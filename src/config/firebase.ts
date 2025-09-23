import { initializeApp } from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDFu9wDUh6ANufhrijU4XiJXxD8xoRk8wA",
  authDomain: "panpal-api.firebaseapp.com",
  projectId: "panpal-api",
  storageBucket: "panpal-api.firebasestorage.app",
  messagingSenderId: "984938034444",
  appId: "1:984938034444:web:6ef113f4b60593c75c4529",
  measurementId: "G-CECV14G714"
};
const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();