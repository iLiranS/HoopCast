import { create } from "zustand";
import {auth , googleAuthProvider , db} from '../firebase/base'
import { signInWithEmailAndPassword , sendPasswordResetEmail  , signOut , createUserWithEmailAndPassword , updateProfile , User, signInWithPopup, browserSessionPersistence} from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

interface authModel{
   currentUser:null | User ;
   loginWithEmail:(email:string,password:string,remember:boolean)=>Promise<boolean | string>;
   logout:()=>void;
   loginWithGoogle:()=>Promise<boolean | string>;
   forgotPassword:(email:string)=>Promise<string>;
}


const useAuthStore = create<authModel>((set)=>({
    currentUser:null,
    loginWithEmail: async (email,password,remember=true)=>{
        if (!remember) auth.setPersistence(browserSessionPersistence);
        try{
            const userCrendtial = await signInWithEmailAndPassword(auth,email,password);
            if (!userCrendtial) throw new Error('user does not exists !');
            return false;
        }
        catch(error:any){
            let msg = error.message as string;
            if( msg === 'Firebase: Error (auth/user-not-found).' || msg==='Firebase: Error (auth/wrong-password).') msg = 'Email or Password incorrect'
            return msg;
        }

    },
    logout:()=>{ signOut(auth).then(()=>{
        set({currentUser:null})
    }).catch((error)=>{
        return error.message;
    })},
    loginWithGoogle: async()=>{
        try{
            // need to check before if email exists.
            const userCrendtial = await signInWithPopup(auth,googleAuthProvider);
            const user = userCrendtial.user;
            

            return true;
        }
        catch(error:any){
            const errorMessage = error.message as string;
            return errorMessage;
        }
    },
    forgotPassword: async(email)=>{
        try{
            await sendPasswordResetEmail(auth,email);
            return ('Password Reset email sent successfully !');
        }
        catch(error:any){
            const message = error.message as string;
            return message;
        }
    }

}))

auth.onAuthStateChanged( async (user) => {
    if (user) {
        useAuthStore.setState({currentUser:user})
      // Check if it's a new user by checking if the user document exists in Firestore
      const userRef = doc(collection(db, "users"), user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // It's a new user, so add their information to the Firestore database
        await setDoc(userRef, {
          name: user.displayName ?? "",
          avatarUrl: user.photoURL ?? "",
        });
      }
    }
  });


// useAuthStore.setState({ currentUser: null });
export default useAuthStore;