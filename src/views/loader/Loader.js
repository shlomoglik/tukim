import m from "mithril" 
import './style.scss'

export const Loader = node =>{
    return {
        view: vnode=>{
            return (
                m(".loader",
                    m('.loader__spinner')
                )
            )
        }
    }
}