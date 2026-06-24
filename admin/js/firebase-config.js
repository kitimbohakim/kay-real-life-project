import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXN7NNTI418c2hyAofjf67EfFC8p_iGEM",
    authDomain: "eliad-avocates.firebaseapp.com",
    projectId: "eliad-avocates",
    storageBucket: "eliad-avocates.firebasestorage.app",
    messagingSenderId: "1053981108667",
    appId: "1:1053981108667:web:7240520871145f46647c9e",
    measurementId: "G-0TNTKKZZC0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;
window.firebaseTools = {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
};