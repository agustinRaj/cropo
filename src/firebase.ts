import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBF5xq8mW7vTb-2VSoQt6xLzqHqI65Zk9w",
  authDomain: "cropo-497d7.firebaseapp.com",
  projectId: "cropo-497d7",
  storageBucket: "cropo-497d7.firebasestorage.app",
  messagingSenderId: "24476630214",
  appId: "1:24476630214:web:9b63b90af85eac584d6bc7",
  measurementId: "G-MYY5TCJ2BN",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
