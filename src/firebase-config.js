import { initializeApp } from "firebase/app";   
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAOTXTHAsucOOcC5rZTgpvzC39lLSJsKDY",
    authDomain: "reactjs-and-firebase-6bcd9.firebaseapp.com",
    projectId: "reactjs-and-firebase-6bcd9",
    storageBucket: "reactjs-and-firebase-6bcd9.appspot.com",
    messagingSenderId: "63304771742",
    appId: "1:63304771742:web:f98888c589b2db11e4b38f",
    measurementId: "G-0TBMVH3SQK"
  };
  
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);