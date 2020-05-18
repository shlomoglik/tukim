import m from "mithril";

import "./style.scss";
import { Icon } from "../icon/Icon";
import { dateValue, formatDateDisplay, distDays, setPropetiesToComponent, validateInput, sortBy } from "../../js/utils";
import { REQUIRED, MIN, MAX } from "../../js/inputAttrs";
import { db } from "../../index";
import { queryListener } from "../../data/get/listen";
import { getCells } from "../../data/get/getCells";

import { saveCell } from "../../data/set/saveCell";
import { resetCell, resetManyCells } from "../../data/set/resetCell";
import { insertNewCell, insertMenyCells } from "../../data/set/insertCell";
import { deleteCells } from "../../data/set/deleteCell";
import { insertNote } from "../../data/set/insertNote";
import { deleteOne } from "../../data/set/deleteOne";

// TODO:
// filters
// views
// Top
export const Main = node => {
    // ======================
    //      DATA:
    // ======================

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
        {
            label: "הוסף",
            action: (e) => openPopUp(e, null, "insert")
        },
        {
            label: "פילטרים",
            action: (e) => openPopUp(e, null, "filterCells")
        },
        {
            label: "מחק", isSelection: true,
            action: (e) => openPopUp(e, null, "deleteMany")
        },
        {
            label: "אפס", isSelection: true,
            action: (e) => openPopUp(e, null, "resetMany")
        },
    ]

    const FILTER_WARNING = [
        {
            id: "none",
            label: "ללא התראה",
            action: e => null
        }, {
            id: "hatalaTime",
            label: "התראת הטלה",
            action: e => null
        }, {
            id: "bekiaTime",
            label: "התראת בקיעה",
            action: e => null
        }, {
            id: "hafradaTime",
            label: "התראת הפרדה",
            action: e => null
        }
    ]

    const POP_UP = {
        "note": {
            title: "הוספת הערה",
            content: "הוסף הערה לתא ${cellIndex}"
        },
        "resetOne": {
            title: "איפוס תא",
            content: "האם אתה בטוח כי ברצונך לאפס את תא ${cellIndex} ?"
        },
        "insert": {
            title: "הוספת תא",
            content: "האם להוסיף תא חדש?"
        },
        "deleteMany": {
            title: "מחיקת תא",
            content: "האם למחוק ${count} תאים?"
        },
        "resetMany": {
            title: "הוספת תא",
            content: "האם לאפס ${count} תאים?"
        },
        "filterCells": {
            title: "פילטרים",
        }
    }



    const model = {
        headers: {
            "cellIndex": { label: "תא", type: "number", class: "", props: [{ [REQUIRED]: true }] },
            "cellStatus": { label: "נוכחי", type: "text", class: "" },
            "hatalaTime": { label: "הטלה", type: "date", class: "hatala", props: [{ [MAX]: dateValue(new Date()) }] },
            "bekiaTime": { label: "בקיעה", type: "date", class: "bekia", props: [{ [MAX]: dateValue(new Date()) }] },
            "hafradaTime": { label: "הפרדה", type: "date", class: "hafrada", props: [{ [MAX]: dateValue(new Date()) }] },
            "count": { label: "כמות", type: "number", class: "parrot", props: [{ [REQUIRED]: true }, { [MIN]: 0 }, { [MAX]: 8 }] },
        },
        forms: {
            "items": ["hatalaTime", "bekiaTime", "hafradaTime", "count"]
        },
        meta: {
            routes: {
                collection: "cells"
            },
        },
        data: [],
    }

    // ======================
    //      FUNCTIONS:
    // ======================

    function toggleEdit(e, ind, key) {
        e.stopPropagation();
        if (!isEdit(ind, key)) {
            node.state.editValue = { ind, key }
        }
    }


    function editValue(e, ind, key, _value) {
        const value = _value || e.target.value;
        const { valid, errorMsgs } = validateInput(model.headers[key], value, model.data[ind]);
        if (valid) {
            model.data[ind][key] = value;
            //TODO: edit DB
            saveCell(model, { [key]: value }, model.data[ind].docID)
        } else {
            alert(`לא חוקי \n${errorMsgs.join("\n")}`)
        }
    }

    function setDefaultValue(ind, key) {
        const existValue = model.data[ind][key]
        switch (key) {
            case "count":
                let newValue = parseInt(existValue) || 0;
                newValue++;
                editValue(null, ind, key, newValue)
                break;
            default:
                if (!existValue || existValue === "") {
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


    const getWarningObj = (doc) => {
        let warningObj = {
            hatalaTime: false,
            bekiaTime: false,
            hafradaTime: false
        }

        // hatalaTime
        if (doc.hatalaTime === "" && doc.bekiaTime === "" && doc.hafradaTime === "") {
            // console.log("ALL EMPTY - set hatala to true")
            warningObj.hatalaTime = true;
        } else {
            // bekiaTime
            if (doc.hatalaTime !== "") {
                // console.log("BEKIA TIME - if dist from hatala gt dgira_due set bekia to true")
                const distFromHatala = distDays(new Date(doc.hatalaTime), new Date())
                if (doc.bekiaTime === "" && distFromHatala > (DGIRA_DUE - 5))
                    warningObj.bekiaTime = true;
            }

            // hafradaTime
            if (doc.bekiaTime !== "") {
                const distFromBekia = distDays(new Date(doc.bekiaTime), new Date())
                if (doc.hafradaTime === "" && distFromBekia > (HAFRADA_DUE - 5))
                    warningObj.hafradaTime = true;
                if (doc.hatalaTime !== "") {
                    const distFromHatala = distDays(new Date(doc.hatalaTime), new Date())
                    if (doc.hafradaTime === "" && distFromHatala > (DGIRA_DUE + HAFRADA_DUE - 5))
                        warningObj.hafradaTime = true;
                }
            }
        }
        // console.log(`index: #${doc.cellIndex} \n`, hatalaTime, bekiaTime, hafradaTime)

        return warningObj
    }

    // const getWarning = (doc, ind, headerKey) => {
    //     if (headerKey === "hatalaTime") {
    //         if (doc.hatalaTime === "" && doc.bekiaTime === "" && doc.hafradaTime === "") return true
    //     } else if (headerKey === "bekiaTime") {
    //         const distFromHatala = distDays(new Date(doc.hatalaTime), new Date())
    //         if (doc.hatalaTime !== "" &&
    //             // doc.bekiaStatus !== STATUS.verifired &&
    //             doc.bekiaTime === "" &&
    //             distFromHatala > (DGIRA_DUE - 5)
    //         )
    //             return true
    //     } else if (headerKey === "hafradaTime") {
    //         const distFromBekia = distDays(new Date(doc.bekiaTime), new Date())
    //         if (doc.bekiaTime !== "" &&
    //             doc.hafradaTime === "" &&
    //             distFromBekia > (HAFRADA_DUE - 5)
    //         )
    //             return true;
    //     }
    //     return false;
    // }

    const openPopUp = (e, ind, type = "note") => {
        if (!type) return
        const title = POP_UP[type].title;
        let input = {};
        let content = POP_UP[type].content;
        let action = () => null
        switch (type) {
            case "resetOne":
                content = content.replace("${cellIndex}", model.data[ind].cellIndex);
                action = e => {
                    Promise.resolve(resetCell(model, model.data[ind].docID))
                        .then(() => closePopUp())
                }
                break;
            case "note":
                const docID = model.data[ind].docID
                input.note = "";
                input.notes = [];
                queryListener(input.notes, db.collection(`cells/${docID}/notes`))
                content = content.replace("${cellIndex}", model.data[ind].cellIndex);
                action = (e) => {
                    Promise.resolve(insertNote(model, node.state.popUp.input.note, docID))
                        .then(() => node.state.popUp.input.note = "")
                }
                break;
            case "insert":
                input.count = 1;
                action = e => {
                    Promise.resolve(insertNewCell(model, input.count))
                        .then(() => closePopUp())
                }
                break;
            case "deleteMany":
                content = content.replace("${count}", node.state.selected.length);
                action = e => {
                    Promise.resolve(deleteCells(model, [...node.state.selected]))
                        .then(() => closePopUp())
                }
                break;
            case "resetMany":
                content = content.replace("${count}", node.state.selected.length);
                action = e => {
                    Promise.resolve(resetManyCells(model, [...node.state.selected]))
                        .then(() => closePopUp())
                }
                break;
            case "filterCells":
                action = false
                break;
        }
        node.state.popUp = { content, type, title, ind, action, input }
    }

    const setPopUpInput = (e, key) => {
        node.state.popUp.input[key] = e.target.value
    }
    const closePopUp = () => {
        node.state.popUp = false
        node.state.menuOpen = false
        node.state.selected = []
        m.redraw()
    }
    const hasWarningFilters = () => node.state.filters.warning.length > 0 && node.state.filters.warning.length < FILTER_WARNING.length

    const toggleFilter = (filterType = "warning", filterKey) => {
        const index = node.state.filters[filterType].findIndex(item => item === filterKey)
        if (index > -1) node.state.filters[filterType].splice(index, 1)
        else node.state.filters[filterType].push(filterKey)
    }

    const isMatchWarnintFilter = (warningObj) => {
        if (node.state.filters.warning.length == 0) return true // show all no filters
        if (node.state.filters.warning.length == FILTER_WARNING.length) return true // show all - cannot use all filters
        let isMatch = false
        if (node.state.filters.warning.includes("none")) {
            const hasSome = Object.keys(warningObj).some(key => warningObj[key] == true)
            isMatch = !hasSome // no warning at all
        }
        Object.keys(warningObj).forEach(key => {
            if (warningObj[key] == true && node.state.filters.warning.includes(key)) {
                isMatch = true
            }
        })
        return isMatch
    }

    const setRangeTarget = targetCell => {
        const elemID = document.getElementById(targetCell)
        if (elemID === null) return
        elemID.scrollIntoView()
    }

    return {
        editValue: { ind: -1, key: "" },
        menuOpen: false,
        filters: {
            cells: [],
            warning: ["hatalaTime", "bekiaTime", "hafradaTime"],
            // warning: []
        },
        selected: [],
        popUp: false,
        oninit: vnode => {
            getCells(model.data)
        },
        view: vnode => {
            return m(".mainPage",
                vnode.state.popUp !== false &&
                m(".popUp", { onclick: e => vnode.state.popUp = false },
                    m(".popUp__box", { onclick: e => e.stopPropagation() },
                        m(".popUp__title", vnode.state.popUp.title),
                        m(".popUp__msg", vnode.state.popUp.content),
                        vnode.state.popUp.type === "note" && m("textarea.popUp__input [placeholder='הוסף הערה...']", {
                            value: vnode.state.popUp.input.note,
                            oninput: e => setPopUpInput(e, "note")
                        }),
                        vnode.state.popUp.type === "note" && m(".popUp__notes", [
                            vnode.state.popUp.input.notes.sort(sortBy("createdAt", "desc", "date")).map((doc, ind) => {
                                return m(".popUp__note", { key: doc.docID }, [
                                    m("span.popUp__note-time", `${formatDateDisplay(new Date(doc.createdAt), "useHours")} - `),
                                    m("span.popUp__note-text", doc.note),
                                    m(Icon, { icon: "icon-trash", action: e => deleteOne(`cells/${model.data[vnode.state.popUp.ind].docID}/notes/${doc.docID}`) }),
                                ])
                            })
                        ]),
                        vnode.state.popUp.type === "insert" && m("input.popUp__input [type=number]", {
                            value: vnode.state.popUp.input.count,
                            oninput: e => setPopUpInput(e, "count")
                        }),
                        vnode.state.popUp.type === "filterCells" && m(".filter", [
                            m(".filter__input", [
                                m(`input.filter__text[type=range]`, { min: 1, max: model.data.length, oninput: e => setRangeTarget(`cell${e.target.value}`) }),
                            ]),
                            // m(".filter__input",
                            //     model.data.map((doc, ind) => {
                            //         const isSelected = isSelectedCell(ind)
                            //         return m(`.filter__cell  ${isSelected ? "[data-selected=true]" : ""}`, { onclick: e => toggleSelect(e, ind) }, doc.cellIndex)
                            //     })
                            // ),
                            m(".filter__input",
                                FILTER_WARNING.map(opt => m(".filter__opt", {
                                    onclick: e => toggleFilter("warning", opt.id),
                                    "data-active": vnode.state.filters.warning.includes(opt.id)
                                },
                                    opt.label)
                                )
                            )
                        ]),
                        vnode.state.popUp.action && m("button.button popUp__action", { onclick: e => vnode.state.popUp.action(e) }, "אשר")
                    )
                ),
                m("img.logo", { src: "./img/logo.png" }),
                m(".content", [
                    model.data.map((doc, ind) => {
                        const isSelected = isSelectedCell(ind);
                        const warningObj = getWarningObj(doc);
                        let isMatch = isMatchWarnintFilter(warningObj)
                        if (!isMatch) return null
                        return m(`.cell#cell${doc.cellIndex}`, { key: doc.cellIndex, class: isSelected ? "cell--selected" : "" }, [
                            m(".cell__index", {
                                onclick: e => toggleSelect(e, ind),
                                class: isSelected ? "cell__index--selected" : ""
                            },
                                doc.cellIndex
                            ),
                            model.forms.items.map(headerKey => {
                                const field = model.headers[headerKey];
                                // const isWarning = getWarning(doc, ind, headerKey);
                                const isWarning = warningObj[headerKey]
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
                                    m(Icon, { class: "cell__button", icon: "icon-circle-with-minus", action: e => openPopUp(e, ind, "resetOne") })
                                ]),
                                m("label.cell__action", [
                                    m("span", "הערה"),
                                    m(Icon, { class: "cell__button", icon: "icon-chat", action: e => openPopUp(e, ind, "note") }),
                                    doc.countNotes > 0 && m(".counter", doc.countNotes)
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
                                return selectedLength > 0 && m(".menu__item", { onclick: e => menuItem.action(e) }, [menuItem.label, m("span.menu__item-count", selectedLength)])
                            } else {
                                return m(".menu__item", { onclick: e => menuItem.action(e) }, menuItem.label)
                            }
                        })
                    ),
                    m(".menu__button", {
                        onclick: e => vnode.state.menuOpen = !vnode.state.menuOpen,
                    },
                        m(Icon, { icon: vnode.state.menuOpen ? "icon-x" : "icon-menu" })
                    ),
                    (vnode.state.selected.length > 0 && !vnode.state.menuOpen) ? m("span.menu__item-count menu--count", vnode.state.selected.length) : null,
                    // hasWarningFilters() && m(Icon, { class: "menu__filter", icon: "icon-filter", action: e => console.log(`TODO: toggleFilter`) })
                )
            )
        }
    }
}