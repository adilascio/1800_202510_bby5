// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"; // ✅ Import Firestore

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClqsSTYdjvWkReamO0GPJrD6m_d5zY9UI",
    authDomain: "gympal-8419a.firebaseapp.com",
    projectId: "gympal-8419a",
    storageBucket: "gympal-8419a.firebasestorage.app",
    messagingSenderId: "193277208966",
    appId: "1:193277208966:web:c5ff40b20d0dd283ce2407",
    measurementId: "G-MEW3WG1HGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

// Export Firestore database
export { auth, db }; // ✅ Now 'db' is properly exported
