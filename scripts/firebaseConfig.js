// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Your Firebase configuration (DO NOT EXPOSE THIS PUBLICLY)
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
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase instances for use in other files
export { app, db, auth };
