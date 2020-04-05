import { MINLENGTH, REQUIRED, PATTERN, MIN, MAX } from "./inputAttrs";

export const dateInDays = date => parseInt(date / (1000 * 60 * 60 * 24))
export const distDays = (d1, d2) => dateInDays(d2) - dateInDays(d1)

export const formatDateDisplay = (date, displayType) => {
    const y = date.getFullYear();
    let m = date.getMonth(); m++;
    if (Number(m).toString() < 10) m = "0" + m
    let d = date.getDate();
    if (Number(d).toString() < 10) d = "0" + d
    if (isNaN(y) || isNaN(m) || isNaN(d)) return "--ללא--";

    const today = new Date();
    const dist = distDays(today, date);
    const absDist = Math.abs(dist)
    if (absDist < 7) {
        if (absDist === 0) return "היום"
        switch (dist) {
            case 1: return "מחר"
            case 2: return "+יומיים"
            case -1: return "אתמול"
            case -2: return "שלשום"
        }
        if(dist<0){
            return `לפני ${absDist} ימים`
        }else{
            return `${dist} ימים`
        }
    } else {
        let output = ""
        if (displayType === "datesOnly") {
            output += d + "/" + m + "/" + y.toString().substring(2);
        } else if (displayType === "weeks") {
            const weeks = Math.floor(absDist / 7)
            const days = absDist % 7;
            if (dist < 0) output += "לפני "
            output += `${weeks}ש`;
            if (days > 0) {
                output += ` (+${days})`
            }
        } else {
            if (dist < 0) output += "לפני "
            else output += "עוד "
            output += `${absDist} יום`
        }
        return output;
    }
}

export const dateValue = (date) => {
    const y = date.getFullYear();
    let m = date.getMonth(); m++;
    if (Number(m).toString() < 10) m = "0" + m
    let d = date.getDate();
    if (Number(d).toString() < 10) d = "0" + d;
    if (isNaN(y) || isNaN(m) || isNaN(d)) return ""
    const output = y + "-" + m + "-" + d;
    return output;
}

export const objType = obj => {
    const toString = Object.prototype.toString;
    return toString.call(obj); // [object Object]
}

export const setPropetiesToComponent = (vnode, props, childIndex) => {
    if (props) {
        props.forEach(prop => {
            const [[key, attr]] = Object.entries(prop)
            const type = objType(attr);
            let value = attr;
            if (type === "[object Function]") value = attr(vnode.attrs.source)

            let elem = vnode.dom;
            if (childIndex !== undefined) elem = elem.children[childIndex];

            const has = key.toString() in elem.__proto__;
            if (has) elem.setAttribute(key, value);
        })
    }
}

export const validateInput = (field, value, doc) => {
    let errorMsgs = [];
    let valid = true;
    // [1] - props validation
    if (field.props) {
        field.props.forEach((prop) => {
            const k = Object.keys(prop)[0];
            const v = prop[k];
            // console.log(k, v, value)
            switch (k) {
                case MAX:
                    if (field.type === "date") {
                        const dist = distDays(new Date(value), v)
                        console.log(dist)
                        if (dist > 0) {
                            valid = false;
                            errorMsgs.push(`תאריך אחרי ${v}`)
                            break;
                        }
                    } else {
                        if (value > v) {
                            valid = false;
                            errorMsgs.push(`הערך גדול מ ${v}`)
                            break;
                        }
                    }
                    break;
                case MIN:
                    if (value < v) {
                        valid = false;
                        errorMsgs.push(` הערך קטן מ${v}`)
                        break;
                    }
                    break;
                case PATTERN:
                    if (!String(value).match(new RegExp(v))) {
                        valid = false;
                        errorMsgs.push(` הערך אינו תואם לתבנית הקלט${v}`)
                        break;
                    }
                case REQUIRED:
                    if (value.toString().trim().length === 0) {
                        valid = false;
                        errorMsgs.push("זהו שדה חובה!")
                        break;
                    }
                case MINLENGTH:
                    if (value.length < v) {
                        valid = false;
                        errorMsgs.push(`יש להשתמש במחרוזת טקסט בעלת ${v} אותיות לכל הפחות`)
                        break;
                    }
                //BUG: this one is trigger all the the time
                // case props.MAXLENGTH:
                // if (value.length > v) {
                // console.log("FIXME: maxLength is fire 🔥🔥🔥")
                //         valid = false;
                //         errorMsgs.push(`יש להשתמש במחרוזת טקסט בעלת ${v} אותיות לכל היותר`)
                //         break;
                // }
            }
        })
    }
    // [2] - logic validation
    console.log(doc)

    return { valid, errorMsgs }
}