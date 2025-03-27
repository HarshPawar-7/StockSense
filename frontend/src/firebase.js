// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbPbScrbC3WMQqp6VFUyhK3eji1QTfljA",
  authDomain: "fintech-portfolio.firebaseapp.com",
  projectId: "fintech-portfolio",
  storageBucket: "fintech-portfolio.firebasestorage.app",
  messagingSenderId: "893036599648",
  appId: "1:893036599648:web:9901825019c999482ea605",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
