import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseconfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "soccerwise-f2f76.firebaseapp.com",
    projectId: "soccerwise-f2f76",
    storageBucket: "soccerwise-f2f76.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  };
const app = initializeApp(firebaseconfig);
const auth = getAuth(app);
const db = getFirestore();
const googleAuthProvider = new GoogleAuthProvider();


export {app , auth , googleAuthProvider , db};