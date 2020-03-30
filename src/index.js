import m from 'mithril';

const root = document.body;


import './index.scss';
import { Login } from './views/Login/Login';

//functions
// m.route.prefix('?')

//Views


//data

//routes config
m.route(root, "/login", {
    "/login": Login
    // "/login": {view:()=>m(".","hello world!")}
});