// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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
    databaseURL: "https://mvpp-3a85d-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
const app = getApps()[0] || initializeApp(firebaseConfig);
export const database = getDatabase(app);


