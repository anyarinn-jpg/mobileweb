// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA0i9iMHCuF8huo8zLce4xUqzv0ITlJ6c",
  authDomain: "lab06-expense-f1744.firebaseapp.com",
  projectId: "lab06-expense-f1744",
  storageBucket: "lab06-expense-f1744.firebasestorage.app",
  messagingSenderId: "707358611735",
  appId: "1:707358611735:web:f9c6f395aa43adab353f52",
  measurementId: "G-2YM5EQ968K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);