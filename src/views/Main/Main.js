import m from "mithril";

import "./style.scss";

export const Main = node => {
    const formatDateDisplay = (date) => {
        const y = date.getFullYear();
        let m = date.getMonth(); m++;
        if (Number(m).toString() < 10) m = "0" + m
        let d = date.getDate();
        if (Number(d).toString() < 10) d = "0" + d
        const output = d + "/" + m + "/" + y.toString().substring(2);
        return output;
    }

    const dateValue = (date) => {
        const y = date.getFullYear();
        let m = date.getMonth(); m++;
        if (Number(m).toString() < 10) m = "0" + m
        let d = date.getDate();
        if (Number(d).toString() < 10) d = "0" + d;
        if (isNaN(y) || isNaN(m) || isNaN(d)) return ""
        const output = y + "-" + m + "-" + d;
        return output;
    }

    const toggleEdit = (e, ind, key) => {
        e.stopPropagation();
        if (!isEdit(ind, key)) {
            node.state.editValue = { ind, key }
        }
    }

    const editValue = (e, ind, key) => {
        model.data[ind][key] = e.target.value;
    }


    const resetEdit = e => {
        e.stopPropagation();
        node.state.editValue = { ind: -1, key: "" }
    }

    const isEdit = (ind, key) => ind === node.state.editValue.ind && key === node.state.editValue.key

    const model = {
        headers: {
            "cell": { label: "תא", type: "number" },
            "hatala": { label: "הטלה", type: "date" },
            "bekia": { label: "בקיעה", type: "date" },
            "count": { label: "כמות", type: "number" },
            "hafrada": { label: "הפרדה", type: "date" },
        },
        data: [
            //expample:
            { cell: 1, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 2, hatala: "2020/03/30", bekia: "2020/03/30", count: 3, hafrada: "2020/03/30" },
            { cell: 3, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 4, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 5, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 6, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 7, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 8, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 9, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 10, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 11, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 12, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 13, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 14, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 15, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
            { cell: 16, hatala: "2020/03/30", bekia: "2020/03/30", count: 2, hafrada: "2020/03/30" },
        ],
    }
    return {
        editValue: { ind: -1, key: "" },
        view: vnode => {
            return m(".main", [
                model.data.map((doc, ind) => {
                    return m(".cell", [
                        m(".cell__index", { onclick: e => resetEdit(e) }, doc.cell),
                        m(".cell__item hatala",
                            m(".cell__caption", model.headers.hatala.label),
                            isEdit(ind, "hatala") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.hatala)), oninput: e => editValue(e, ind, "hatala") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "hatala") }, formatDateDisplay(new Date(doc.hatala)))
                        ),
                        m(".cell__item bekia",
                            m(".cell__caption", model.headers.bekia.label),
                            isEdit(ind, "bekia") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.bekia)), oninput: e => editValue(e, ind, "bekia") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "bekia") }, formatDateDisplay(new Date(doc.bekia)))
                        ),
                        m(".cell__item hafrada",
                            m(".cell__caption", model.headers.hafrada.label),
                            isEdit(ind, "hafrada") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.hafrada)), oninput: e => editValue(e, ind, "hafrada") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "hafrada") }, formatDateDisplay(new Date(doc.hafrada)))
                        ),
                        m(".cell__item count",
                            m(".cell__caption", model.headers.count.label),
                            isEdit(ind, "count") ? m("input.cell__input[type=number]", { value: doc.count, oninput: e => editValue(e, ind, "count") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "count") }, doc.count)
                        ),
                        m(".cell__button","V"),
                        m(".cell__button","V"),
                        m(".cell__button","V"),
                        m(".cell__button","+"),
                    ])
                })
            ])
        }
    }
}