import m from "mithril";

import "./style.scss";

export const Main = node => {
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
        view: vnode => {
            return m(".main", [
                model.data.map(doc => {
                    return m(".cell", [
                        m(".cell__index", doc.cell),
                        m(".cell__item hatala",
                            m(".cell__caption", model.headers.hatala.label),
                            m(".cell__value", new Date(doc.hatala).toDateString())
                        ),
                        m(".cell__item bekia",
                            m(".cell__caption", model.headers.bekia.label),
                            m(".cell__value",new Date(doc.bekia).toDateString())
                        ),
                        m(".cell__item hafrada",
                            m(".cell__caption", model.headers.hafrada.label),
                            m(".cell__value",new Date(doc.hafrada).toDateString())
                        ),
                        m(".cell__item count",
                            m(".cell__caption", model.headers.count.label),
                            m(".cell__value",doc.count)
                        ),
                    ])
                })
            ])
        }
    }
}