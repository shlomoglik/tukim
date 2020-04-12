import { getCollectionPath } from "../utils";
import { auth, db } from "../../index";
import m from "mithril"

export const insertNote = (sourceModel, note, docID) => {
    console.time('⏲ insertNote')
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const path = `${collectionPath}/${docID}/notes`;
    db.collection(path).add({
        note,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
    })
    .then(() => console.timeEnd('⏲ insertNote'))
    .catch(err => alert(err))
    .finally(() => m.redraw())
}