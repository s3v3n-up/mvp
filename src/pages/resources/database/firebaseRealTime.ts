import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  databaseURL: "https://mvpp-3a85d-default-rtdb.firebaseio.com/mvp",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

