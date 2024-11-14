import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD484RMn82nfZXm8IzOsiilAl99E-uZHao",
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

// IOS : 500450400417-sqtsj83q075sduha6dsrk3c19c9ac1ci.apps.googleusercontent.com
// Android: 500450400417-gg1pf3lqt2k98ov98u85aem2ekc2rsd8.apps.googleusercontent.com
