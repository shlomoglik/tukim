import { db } from "../../index";
import m from "mithril"

export const getCells = (dataSource) => {
    db.collection("cells").orderBy("cellIndex").onSnapshot(snap => {
        snap.docChanges().forEach(change => {
            const doc = change.doc
            const docData = Object.assign(doc.data(), {
                ref: doc.ref.path,
                docID: doc.id
            })
            const index = dataSource.findIndex((elem) => elem.docID === docData.docID)
            if (change.type === "added" || change.type === "modified") {
                if (index !== -1) dataSource[index] = docData
                else dataSource.push(docData)
            } else if (change.type === "removed") {
                dataSource.splice(index, 1)
            }
        })
        // console.log(dataSource)
        m.redraw();
    })
}
