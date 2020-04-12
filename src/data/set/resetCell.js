import { getCollectionPath } from "../utils";
import { auth, db } from "../../index";
import m from "mithril"

export const resetCell = async (sourceModel, docID, moveToHistory = true) => {
    console.time('⏲ resetCell')
    let saveDoc = {
        count: 0,
        hatalaTime: "",
        bekiaTime: "",
        hafradaTime: "",
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid,
    }
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const path = `${collectionPath}/${docID}`;
    try {
        const docRef = db.doc(path);
        if (moveToHistory) {
            console.time('⏲ moveToHistory')
            const docData = (await docRef.get()).data()
            const docToAdd = Object.assign(docData, {
                createdAt: new Date().toISOString(),
                createdBy: auth.currentUser.uid
            })
            const colRef = `${path}/sessions`;
            await db.collection(colRef).add(docToAdd)
            console.timeEnd('⏲ moveToHistory')
        }
        docRef.set(saveDoc, { merge: true })
    } catch (err) {
        console.error(err)
        alert(err)
    } finally {
        m.redraw()
        console.timeEnd('⏲ resetCell')
    }
}


export const resetManyCells = async (sourceModel, indexes, moveToHistory = true) => {
    console.time('⏲ resetCell')
    let saveDoc = {
        count: 0,
        hatalaTime: "",
        bekiaTime: "",
        hafradaTime: "",
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid
    }
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    try {
        const batch = db.batch();
        for (let i = 0; i < indexes.length; i++) {
            const cellIndex = indexes[i].cellIndex
            const find = sourceModel.data.find(el => el.cellIndex === cellIndex)
            if (find) {
                const docID = find.docID;
                const path = `${collectionPath}/${docID}`
                const docRef = db.doc(path)
                if (moveToHistory) {
                    console.time('⏲ moveToHistory')
                    const docData = (await docRef.get()).data()
                    const docToAdd = Object.assign(docData, {
                        createdAt: new Date().toISOString(),
                        createdBy: auth.currentUser.uid
                    })
                    const colRef = `${path}/sessions`;
                    await db.collection(colRef).add(docToAdd)
                    console.timeEnd('⏲ moveToHistory')
                }
                batch.set(docRef, saveDoc, { merge: true })
            }
        }
        await batch.commit();
    } catch (err) {
        console.error(err)
        alert(err)
    } finally {
        m.redraw()
        console.timeEnd('⏲ resetCell')
    }
}