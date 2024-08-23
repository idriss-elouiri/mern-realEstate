// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-bcf5b.firebaseapp.com",
  projectId: "mern-realestate-bcf5b",
  storageBucket: "mern-realestate-bcf5b.appspot.com",
  messagingSenderId: "149174207564",
  appId: "1:149174207564:web:6d859c8e32a69e8fd8a0e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);