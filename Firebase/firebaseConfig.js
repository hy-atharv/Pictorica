
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, initializeFirestore } from "firebase/firestore";

//const firebaseConfig = process.env.FIREBASE_CONFIG
 const firebaseConfig = {
  apiKey: "AIzaSyDepS4_CjimZM89zLHTqT-7g-FKxQXKavQ",
  authDomain: "pictorica-fe97f.firebaseapp.com",
  projectId: "pictorica-fe97f",
  storageBucket: "pictorica-fe97f.appspot.com",
  messagingSenderId: "742728956413",
  appId: "1:742728956413:web:a052dcf5b57d5338b84194",
  measurementId: "G-WBY1PV5H02"
}



export const app = initializeApp(firebaseConfig);

initializeFirestore(app,{experimentalAutoDetectLongPolling:true})

export const db = getFirestore(app)


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })


  
