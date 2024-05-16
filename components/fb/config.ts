"use client"
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdSmj_Dt2z3KTVDZcprly2GCT_0UGKZOk",
  authDomain: "proj-eventsatucek.firebaseapp.com",
  projectId: "proj-eventsatucek",
  storageBucket: "proj-eventsatucek.appspot.com",
  messagingSenderId: "747267605566",
  appId: "1:747267605566:web:e6d8dbb9f4a16dbf2e7d6f"
};

export const apiKey = firebaseConfig.apiKey
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)


