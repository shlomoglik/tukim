import m from "mithril";

import "./style.scss";

export const Login = node => {
    const user = {
        email: "",
        password: ""
    }
    const loginUser = () => {
        console.log("TODO: login in with email and password", user.email, user.password)
    }
    return {
        view: vnode => {
            return m(".login", [
                m(".login__heading", "התחברות"),
                m("label.login__label",
                    [
                        m("span", "אימייל"),
                        m("input.login__input[type=email]", { value: user.email, oninput: e => user.email = e.target.value })
                    ]
                ),
                m("label.login__label",
                    [
                        m("span", "סיסמא"),
                        m("input.login__input[type=password]", { value: user.password, oninput: e => user.password = e.target.value }),
                    ]
                ),
                m("button.login__button button", { onclick: e => loginUser() }, "התחבר")
            ])
        }
    }
}