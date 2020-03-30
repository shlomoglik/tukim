import m from 'mithril';
import { app } from "./firebase/firebaseConfig"
const root = document.body;
import './index.scss';

//FUNCTIONS
export const auth = firebase.auth(app);
export const db = firebase.firestore();
// m.route.prefix('?')

//VIEWS
import { Login } from './views/Login/Login';
import { Main } from './views/Main/Main';


//DATA

//routes config
m.route(root, "/login", {
    "/login": Login,
    "/": Main,
});