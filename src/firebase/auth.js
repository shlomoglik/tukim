import {auth} from '../firebase/firebaseConfig'


export const signIn = (email, password) =>{ 
    return auth.signInWithEmailAndPassword(email, password);
}

