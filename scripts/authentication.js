// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Wait for DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form from reloading the page

        // Get email and password values
        let email = document.getElementById("floatingInput").value;
        let password = document.getElementById("floatingPassword").value;
        signInWithEmailAndPassword(auth, email, password) 
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user);
                window.location.href = "./main.html"; // Redirect to main page
            })
            .catch((error) => {
                console.error("Login failed:", error.code, error.message);

                if (error.code === "auth/user-not-found" || error.code === "auth/password-not-found" || error.code === "auth/invalid-credential") {
                    console.log("Login information, redirecting to createaccount.");
                    window.location.href = "./createAccount.html";
                }
            });
    });
});
// Export Firestore database
export { auth, db }; 

