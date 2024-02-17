import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// ADD FIREBASE CONFIGURATION HERE
const firebaseConfig = {
    apiKey: "AIzaSyCHCFddeDEfaigRaQeOpPJAasrLr_SJ8a8",
    authDomain: "trello-clone-73c69.firebaseapp.com",
    projectId: "trello-clone-73c69",
    storageBucket: "trello-clone-73c69.appspot.com",
    messagingSenderId: "243712822204",
    appId: "1:243712822204:web:a906cdd3e8f9aa2f97b9b9",
    measurementId: "G-QDPHQNB927"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}