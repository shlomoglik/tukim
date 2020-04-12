import { auth } from "../index";

export function getCollectionPath(_path) {
    let path = _path;
    let split = path.split("/");
    if (split.length > 1) {
        let replace = split.map(part => {
            if (part.startsWith(":")) {
                switch (part) {
                    case ":userID":
                        return auth.currentUser.uid
                }
            } else {
                return part
            }
        })
        path = replace.join("/");
    }
    return path;
}

export function removeOneLocal(source, dataSource, docID) {
    source[dataSource] = source[dataSource].filter(doc => doc.docID !== docID)
    source[dataSource].forEach((doc, ind) => doc.docID = ind + 1)
}