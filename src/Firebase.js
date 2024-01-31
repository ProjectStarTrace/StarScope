//Firebase.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
    apiKey: "AIzaSyBfX9EaPggkqFDHDdRa8v-_U1USMry_SFw",
    authDomain: "startrace-81336.firebaseapp.com",
    projectId: "startrace-81336",
    storageBucket: "startrace-81336.appspot.com",
    messagingSenderId: "504958765107",
    appId: "1:504958765107:web:fe69232a6b4d01a0893b46",
    measurementId: "G-29WRGG6TSV"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const db = firebase.firestore();