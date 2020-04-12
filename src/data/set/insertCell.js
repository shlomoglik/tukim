import m from "mithril"
import { auth, db } from "../../index";
import { getCollectionPath } from "../utils";

export const insertNewCell = (sourceModel, count) => {
    if (count > 1) return insertMenyCells(sourceModel, count)

    console.time('⏲ insertNewCell')
    const addDoc = {
        cellStatus: "active",
        cellIndex: parseInt(sourceModel.data.length) + 1,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
    }
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const colRef = db.collection(collectionPath);
    colRef.add(addDoc)
        .catch(err => alert(err))
        .finally(() => {
            console.timeEnd('⏲ insertNewCell')
            m.redraw()
        })
}

export const insertMenyCells = async (sourceModel, count) => {
    const batch = db.batch();
    console.time('⏲ insertMenyCells')
    let index = parseInt(sourceModel.data.length) + 1
    const addDoc = {
        cellStatus: "active",
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
    }
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const colRef = db.collection(collectionPath);
    try {
        for (let i = 0; i < count; i++) {
            addDoc.cellIndex = index;
            const docRef = colRef.doc()
            batch.set(docRef, addDoc);
            index++;
        }
        await batch.commit();
    } catch (err) {
        alert(err)
    } finally {
        console.timeEnd('⏲ insertMenyCells')
        m.redraw()
    }
}