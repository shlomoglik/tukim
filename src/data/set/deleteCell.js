import m from "mithril"
import { auth, db } from "../../index";
import { getCollectionPath } from "../utils";

export const deleteCells = async (sourceModel, indexes) => {
    const batch = db.batch();
    console.time('⏲ deleteManyCells')
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    try {
        for (let i = 0; i < indexes.length; i++) {
            const cellIndex = indexes[i].cellIndex
            const find = sourceModel.data.find(el=>el.cellIndex === cellIndex)
            if(find){
                const docID = find.docID;
                const docRef = db.doc(`${collectionPath}/${docID}`)
                batch.delete(docRef);
            }
        }
        await batch.commit();
    } catch (err) {
        alert(err)
    } finally {
        console.timeEnd('⏲ deleteManyCells')
        m.redraw()
    }
    return 
}