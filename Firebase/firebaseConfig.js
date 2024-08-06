
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = process.env.FIREBASE_CONFIG




export const app = initializeApp(firebaseConfig);

initializeFirestore(app,{experimentalAutoDetectLongPolling:true})

export const db = getFirestore(app)


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })


  
