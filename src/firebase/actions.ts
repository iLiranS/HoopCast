import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/base';

export const login_with_email = async(email:string , password:string) =>{
   
        signInWithEmailAndPassword(auth,email,password).then((userCredentail)=>{
            // login successfully
            const user = userCredentail.user;
        }).catch((error)=>{
            // error handling
            const errorMessage = error.message;
            return (errorMessage);
        })
    return;
}

