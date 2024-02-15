// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-fa022.firebaseapp.com",
  projectId: "mern-blog-fa022",
  storageBucket: "mern-blog-fa022.appspot.com",
  messagingSenderId: "766364253855",
  appId: "1:766364253855:web:24942c51b0a8fa56586caa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

