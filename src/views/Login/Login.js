import m from "mithril";

import "./style.scss";
import { auth } from "../../index";

export const Login = node => {
    const user = {
        email: "",
        password: ""
    }
    const loginUser = async () => {
        if (user.email.trim() === "" || user.password.trim() === "") return alert("נסה שנית , יש למלא אימייל וסיסמא!");
        try {
            const userCred = await auth.signInWithEmailAndPassword(user.email, user.password);
            alert(`ברוך הבא ${userCred.user.displayName || userCred.user.email}`)
            m.route.set("/");
            // TODO: stay logged in using localStorage
        } catch (err) {
            if (err.code) {
                switch (err.code) {
                    case "auth/user-not-found":
                        alert("משתמש לא נמצא!!! בדוק כי האיימייל והסיסמא תקינים ונסה שנית")
                        break;
                    default:
                        alert(err.code)
                }
            } else {
                alert("חלה שגיאה בהתחברות");
            }
        }
    }

    return {
        view: vnode => {
            return m(".login", [
                m("img.logo", { src: "./img/logo.png" }),
                m(".login__heading", "התחברות"),
                m("label.login__input",
                    [
                        m("span.login__label", "אימייל"),
                        m("input#email.login__field[type=email][name='email'][autocomplete='on']", { value: user.email, oninput: e => user.email = e.target.value })
                    ]
                ),
                m("label.login__input",
                    [
                        m("span.login__label", "סיסמא"),
                        m("input#password.login__field[type=password][name='password'][autocomplete='on']", { value: user.password, oninput: e => user.password = e.target.value }),
                    ]
                ),
                m("button.login__button button", { onclick: e => loginUser() }, "התחבר")
            ])
        }
    }
}