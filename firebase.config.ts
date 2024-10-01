import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoTYS6P1-STpEG2sNp_KTqPT92OV-m4Eg",
  authDomain: "my-app-54dfc.firebaseapp.com",
  projectId: "my-app-54dfc",
  storageBucket: "my-app-54dfc.appspot.com",
  messagingSenderId: "500450400417",
  appId: "1:500450400417:web:244a08b9af3e99cd1bf8e0",
  measurementId: "G-7M1YE9C0ZL",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
