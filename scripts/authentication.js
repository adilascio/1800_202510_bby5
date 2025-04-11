// Firebase SDK imports
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {app} from "./firebaseAPI_TEAM99.js";

const auth = getAuth(app);


  // Add event listener to the login form
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
                console.error("Authentication Error: " + error.message);
                window.location.href = "./createAccount.html";
            });
        });
    
