import m from 'mithril'
import './style.scss'

export const Icon = vnode => {
    return {
        view: vnode => {
            return (
                m('svg.icon', {
                    class: vnode.attrs.class || '',
                    onclick: e => vnode.attrs.action ? vnode.attrs.action(e) : null,
                },
                    [
                        m('use', { href: `/img/icons.svg#${vnode.attrs.icon}` })
                    ]
                )
            )
        }
    }
}