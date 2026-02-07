// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDA0i9iMHCuF8huo8zLce4xUqzv0ITlJ6c",
  authDomain: "lab06-expense-f1744.firebaseapp.com",
  projectId: "lab06-expense-f1744",
  storageBucket: "lab06-expense-f1744.firebasestorage.app",
  messagingSenderId: "707358611735",
  appId: "1:707358611735:web:f56744955039fde7353f52",
  measurementId: "G-P32507DWTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)