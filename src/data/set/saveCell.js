import { getCollectionPath } from "../utils";
import { auth, db } from "../../index";
import m from "mithril";

export const saveCell = (sourceModel, docToSave, docID) => {
    console.time('⏲ saveCell')
    let saveDoc = Object.assign(docToSave, {
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid
    })
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const path = `${collectionPath}/${docID}`;
    db.doc(path).set(saveDoc, { merge: true })
        .then(() => {
            console.timeEnd('⏲ saveCell')
        })
        .catch(err => alert(err))
        .finally(() => m.redraw())
}