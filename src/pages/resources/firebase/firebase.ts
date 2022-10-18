// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAtH7KQr236KY-CpTRmyr0eaokieRswFNU",
  authDomain: "mvpp-3a85d.firebaseapp.com",
  projectId: "mvpp-3a85d",
  storageBucket: "mvpp-3a85d.appspot.com",
  messagingSenderId: "572134306161",
  appId: "1:572134306161:web:639490695f053b5ec6c6d0",
  measurementId: "G-TFYMBMMMJT",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
