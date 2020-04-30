import m from "mithril"
import { auth, db } from "../../index";

export const deleteOne = async (path) => {
    console.time('⏲ deleteOne')
    try {
        await db.doc(path).delete()
    } catch (err) {
        alert(err)
    } finally {
        console.timeEnd('⏲ deleteOne')
        m.redraw()
    }
    return 
}