// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNzv-ghNNr8_PidD0ooadqoY5LB7Q5T3c",
  authDomain: "health-connect-fd3e7.firebaseapp.com",
  projectId: "health-connect-fd3e7",
  storageBucket: "health-connect-fd3e7.firebasestorage.app",
  messagingSenderId: "643383211923",
  appId: "1:643383211923:web:eb5055ce5683a456ab9a66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getFirestore, // Export getFirestore
  collection, // Export collection
  getDocs, // Export getDocs
  doc, // export doc
  setDoc, // export setDoc
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  updateDoc,
};
