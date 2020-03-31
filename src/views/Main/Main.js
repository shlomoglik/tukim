import m from "mithril";

import "./style.scss";
import { Icon } from "../icon/Icon";

export const Main = node => {

    const DGIRA_DUE = 20;
    const HAFRADA_DUE = 40;

    const STATUS = {
        none: "none",
        verifired: "verifired",
        estimate: "estimate"
    }

    const formatDateDisplay = (date) => {
        const y = date.getFullYear();
        let m = date.getMonth(); m++;
        if (Number(m).toString() < 10) m = "0" + m
        let d = date.getDate();
        if (Number(d).toString() < 10) d = "0" + d
        if (isNaN(y) || isNaN(m) || isNaN(d)) return "--ללא--"
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
            "hatalaTime": { label: "הטלה", type: "date" },
            "bekiaTime": { label: "בקיעה", type: "date" },
            "hafradaTime": { label: "הפרדה", type: "date" },
            "status": { label: "נוכחי", type: "text" },
            "count": { label: "כמות", type: "number" },
        },
        data: [
            //expample:
            { cell: 1, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 2, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 3, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 3, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 4, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 5, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 6, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 7, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 8, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 9, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 10, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 11, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 12, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 13, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 14, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 15, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 16, hatalaTime: "2020/03/30", bekiaTime: "2020/03/30", count: 2, hafradaTime: "2020/03/30", hatalaStatus: STATUS.verifired, bekiaStatus: STATUS.verifired, hafradaTime: STATUS.estimate },
            { cell: 17, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaTime: STATUS.none },
            { cell: 18, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaTime: STATUS.none },
            { cell: 19, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaTime: STATUS.none },
            { cell: 20, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaTime: STATUS.none },
            { cell: 21, hatalaTime: "", bekiaTime: "", count: 0, hafradaTime: "", hatalaStatus: STATUS.none, bekiaStatus: STATUS.none, hafradaTime: STATUS.none },
        ],
    }
    return {
        editValue: { ind: -1, key: "" },
        view: vnode => {
            return m(".mainPage",
                m("img.logo", { src: "./img/logo.png" }),
                m(".content", [
                    model.data.map((doc, ind) => {
                        return m(".cell", [
                            m(".cell__index", { onclick: e => resetEdit(e) }, doc.cell),
                            m(".cell__item hatalaTime",
                                m(Icon,{class:"cell__mark",icon:"icon-v"}),
                                m(".cell__caption", model.headers.hatalaTime.label),
                                isEdit(ind, "hatalaTime") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.hatalaTime)), oninput: e => editValue(e, ind, "hatalaTime") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "hatalaTime") }, formatDateDisplay(new Date(doc.hatalaTime)))
                            ),
                            m(".cell__item bekiaTime",
                                m(".cell__caption", { class: "cell__caption--estimate" }, model.headers.bekiaTime.label),
                                isEdit(ind, "bekiaTime") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.bekiaTime)), oninput: e => editValue(e, ind, "bekiaTime") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "bekiaTime") }, formatDateDisplay(new Date(doc.bekiaTime)))
                            ),
                            m(".cell__item hafradaTime",
                                m(".cell__caption", model.headers.hafradaTime.label),
                                isEdit(ind, "hafradaTime") ? m("input.cell__input[type=date]", { value: dateValue(new Date(doc.hafradaTime)), oninput: e => editValue(e, ind, "hafradaTime") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "hafradaTime") }, formatDateDisplay(new Date(doc.hafradaTime)))
                            ),
                            m(".cell__item count",
                                m(".cell__caption", model.headers.count.label),
                                isEdit(ind, "count") ? m("input.cell__input[type=number]", { value: doc.count, oninput: e => editValue(e, ind, "count") }) : m(".cell__value", { onclick: e => toggleEdit(e, ind, "count") }, doc.count)
                            ),
                            m(".cell__buttons", [
                                m("label.cell__action", [
                                    m("span", "אפס"),
                                    m(Icon, { class: "cell__button", icon: "icon-circle-with-minus" })
                                ]),
                                m("label.cell__action", [
                                    m("span", "הערה"),
                                    m(Icon, { class: "cell__button", icon: "icon-chat" })
                                ]),
                            ])
                        ])
                    })
                ])
            )
        }
    }
}