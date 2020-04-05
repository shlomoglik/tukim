import m from "mithril";

import "./style.scss";
import { Icon } from "../icon/Icon";
import { dateValue, formatDateDisplay, distDays, setPropetiesToComponent, validateInput } from "../../js/utils";
import { REQUIRED, MIN, MAX } from "../../js/inputAttrs";

// TODO:
// filters
// views
// Top
export const Main = node => {

    const DGIRA_DUE = 23;
    const HAFRADA_DUE = 30;

    const STATUS = {
        none: "none",
        verifired: "verifired",
        estimate: "estimate"
    }
    const CELL_STATUS = {
        active: "active",
        empty: "empty",
        archive: "archive"
    }

    const MENU_ITEMS = [
        { label: "הוסף" },
        { label: "מחק", isSelection: true },
        { label: "אפס", isSelection: true },
    ]

    const POP_UP = {
        "note": {
            title: "הוספת הערה",
            content: "הוסף הערה לתא ${cellIndex}"
        },
        "resetOne": {
            title: "איפוס תא",
            content: "האם אתה בטוח כי ברצונך לאפס את תא ${cellIndex} ?"
        }
    }


    const toggleEdit = (e, ind, key) => {
        e.stopPropagation();
        if (!isEdit(ind, key)) {
            node.state.editValue = { ind, key }
        }
    }


    const editValue = (e, ind, key, _value) => {
        const value = _value || e.target.value;
        const { valid, errorMsgs } = validateInput(model.headers[key], value, model.data[ind]);
        if (valid) {
            model.data[ind][key] = value;
        } else {
            alert(`לא חוקי \n${errorMsgs.join("\n")}`)
        }
    }

    const setDefaultValue = (ind, key) => {
        const existValue = model.data[ind][key]
        switch (key) {
            case "count":
                const newValue = parseInt(existValue) + 1;
                editValue(null, ind, key, newValue)
                break;
            default:
                if (existValue === "") {
                    editValue(null, ind, key, new Date().toISOString())
                }
        }
    }

    const isSelectedCell = ind => node.state.selected.find(el => el.cellIndex === model.data[ind].cellIndex)

    const toggleSelect = (e, ind) => {
        e.stopPropagation();
        resetEdit();
        const cellIndex = model.data[ind].cellIndex
        const existInd = node.state.selected.findIndex(el => el.cellIndex === cellIndex);
        if (existInd > -1) {
            node.state.selected.splice(existInd, 1)
        } else {
            node.state.selected = [{ cellIndex }, ...node.state.selected]
        }
    }

    const resetEdit = () => node.state.editValue = { ind: -1, key: "" }

    const getValue = (val, type) => {
        // if (!val) return ""
        switch (type) {
            case "date": return dateValue(new Date(val))
            case "number": return Number(val)
            case "text": return val
            default: return val || ""
        }
    }
    const getDisplayValue = (val, type) => {
        let displayValue = ""
        let isEmpty = true;
        switch (type) {
            case "date":
                if (val) {
                    displayValue = formatDateDisplay(new Date(val))
                    isEmpty = false
                }
                else displayValue = "--ללא--"
                break;
            case "number":
                if (val) {
                    displayValue = Number(val);
                    isEmpty = false
                }
                else displayValue = 0
                break;
            case "text":
                if (val) displayValue = val
                else isEmpty = false
                break;
            default:
                if (val) displayValue = val
                else isEmpty = false
        }
        return { displayValue, isEmpty }
    }

    const isEdit = (ind, key) => ind === node.state.editValue.ind && key === node.state.editValue.key

    const getWarning = (doc, ind, headerKey) => {
        if (headerKey === "hatalaTime") {
            if (doc[headerKey] === "") return true
        } else if (headerKey === "bekiaTime") {
            const distFromHatala = distDays(new Date(doc.hatalaTime), new Date())
            if (doc.hatalaTime !== "" &&
                // doc.bekiaStatus !== STATUS.verifired &&
                doc.bekiaTime === "" &&
                distFromHatala > (DGIRA_DUE - 5)
            )
                return true
        } else if (headerKey === "hafradaTime") {
            const distFromBekia = distDays(new Date(doc.bekiaTime), new Date())
            if (doc.bekiaTime !== "" &&
                doc.hafradaTime === "" &&
                distFromBekia > (HAFRADA_DUE - 5)
            )
                return true;
        }
        return false;
    }

    const openPopUp = (e, ind, type = "note") => {
        const title = POP_UP[type].title;
        let content = POP_UP[type].content;
        switch (type) {
            case "note":
                content = content.replace("${cellIndex}", model.data[ind].cellIndex);
                break;
            case "resetOne":
                content = content.replace("${cellIndex}", model.data[ind].cellIndex);
                break;
        }
        node.state.popUp = { content, type, title, ind }
    }

    const resetCell = (e, ind) => {
        model.data[ind].hatalaTime = "";
        model.data[ind].bekiaTime = "";
        model.data[ind].hafradaTime = "";
        model.data[ind].count = 0;
    }



    const model = {
        headers: {
            "cellIndex": { label: "תא", type: "number", src: "cells/:docID", class: "", props: [{ [REQUIRED]: true }] },
            "cellStatus": { label: "נוכחי", type: "text", class: "", src: "cells/:docID" },
            "hatalaTime": { label: "הטלה", type: "date", src: "cells/:docID", class: "hatala", props: [{ [MAX]: dateValue(new Date()) }] },
            "bekiaTime": { label: "בקיעה", type: "date", src: "cells/:docID/sessions/:sessionID", class: "bekia", props: [{ [MAX]: dateValue(new Date()) }] },
            "hafradaTime": { label: "הפרדה", type: "date", src: "cells/:docID/sessions/:sessionID", class: "hafrada", props: [{ [MAX]: dateValue(new Date()) }] },
            "count": { label: "כמות", type: "number", src: "cells/:docID/sessions/:sessionID", class: "parrot", props: [{ [REQUIRED]: true }, { [MIN]: 0 }, { [MAX]: 8 }] },
        },
        forms: {
            "items": ["hatalaTime", "bekiaTime", "hafradaTime", "count"]
        },
        data: [
            //expample:
            { cellIndex: 1, hatalaTime: "2020-03-02", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 2, hatalaTime: "2020-03-02", bekiaTime: "", count: 3, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 3, hatalaTime: "2020-03-02", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 4, hatalaTime: "2020-03-02", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 5, hatalaTime: "2020-03-02", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 6, hatalaTime: "2020-03-02", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 7, hatalaTime: "2020-03-01", bekiaTime: "", count: 2, hafradaTime: "", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 8, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 9, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 10, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 11, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 12, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 13, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 14, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 15, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 16, hatalaTime: "2020-03-01", bekiaTime: "2020-04-01", count: 2, hafradaTime: "2020-04-01", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.estimate, hafradaStatus: STATUS.estimate },
            { cellIndex: 17, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaStatus: STATUS.none },
            { cellIndex: 18, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaStatus: STATUS.none },
            { cellIndex: 19, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaStatus: STATUS.none },
            { cellIndex: 20, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaStatus: STATUS.none },
            { cellIndex: 21, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaStatus: STATUS.none },
        ],
    }
    return {
        editValue: { ind: -1, key: "" },
        menuOpen: false,
        selected: [],
        popUp: false,
        view: vnode => {
            return m(".mainPage",
                vnode.state.popUp !== false &&
                m(".popUp", { onclick: e => vnode.state.popUp = false },
                    m(".popUp__box", { onclick: e => e.stopPropagation() },
                        m(".popUp__title", vnode.state.popUp.title),
                        m(".popUp__msg", vnode.state.popUp.content),
                        vnode.state.popUp.type === "note" && m("textarea.popUp__input [placeholder='הוסף הערה...']")
                    )
                ),
                m("img.logo", { src: "./img/logo.png" }),
                m(".content", [
                    model.data.map((doc, ind) => {
                        const isSelected = isSelectedCell(ind)
                        return m(".cell", { class: isSelected ? "cell--selected" : "" }, [
                            m(".cell__index", {
                                onclick: e => toggleSelect(e, ind),
                                class: isSelected ? "cell__index--selected" : ""
                            },
                                doc.cellIndex
                            ),
                            model.forms.items.map(headerKey => {
                                const field = model.headers[headerKey];
                                const isWarning = getWarning(doc, ind, headerKey);
                                const { displayValue, isEmpty } = getDisplayValue(doc[headerKey], field.type);
                                return m(".cell__item", { class: field.class },
                                    m(".cell__caption", { onclick: e => setDefaultValue(ind, headerKey) }, field.label),
                                    isWarning ? m(Icon, { class: "cell__mark", icon: "icon-warning" }) : null,
                                    isEdit(ind, headerKey) ?
                                        m(`input.cell__input[type=${field.type || "text"}]`, {
                                            value: getValue(doc[headerKey], field.type),
                                            oninput: e => editValue(e, ind, headerKey),
                                            oncreate: el => setPropetiesToComponent(el, field.props)
                                        }) :
                                        m(`.cell__value [data-empty=${isEmpty}]`, { onclick: e => toggleEdit(e, ind, headerKey) },
                                            displayValue
                                        )
                                )
                            }),
                            m(".cell__buttons", [
                                m("label.cell__action", [
                                    m("span", "אפס"),
                                    m(Icon, { class: "cell__button", icon: "icon-circle-with-minus", action: e => resetCell(e, ind) })
                                ]),
                                m("label.cell__action", [
                                    m("span", "הערה"),
                                    m(Icon, { class: "cell__button", icon: "icon-chat", action: e => openPopUp(e, ind, "note") })
                                ]),
                            ])
                        ])
                    }),
                ]),
                m(".menu",
                    vnode.state.menuOpen && m(".menu__list",
                        MENU_ITEMS.map(menuItem => {
                            if (menuItem.isSelection) {
                                const selectedLength = vnode.state.selected.length;
                                return selectedLength > 0 && m(".menu__item", [menuItem.label, m("span.menu__item-count", selectedLength)])
                            } else {
                                return m(".menu__item", menuItem.label)
                            }
                        })
                    ),
                    m(".menu__button", {
                        onclick: e => vnode.state.menuOpen = !vnode.state.menuOpen,
                    },
                        m(Icon, { icon: vnode.state.menuOpen ? "icon-x" : "icon-menu" })
                    ),
                    (vnode.state.selected.length > 0 && !vnode.state.menuOpen) ? m("span.menu__item-count menu--count", vnode.state.selected.length) : null
                )
            )
        }
    }
}