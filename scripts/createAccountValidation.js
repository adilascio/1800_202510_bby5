// Firebase SDK imports
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { app } from "./firebaseAPI_TEAM99.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("submit").addEventListener("click", async function(event) {
    event.preventDefault();
    
    let first = document.getElementById("firName").value;
    let last = document.getElementById("lasName").value;
    let date = document.getElementById("birthday").value;
    let email = document.getElementById("emailIn").value;
    let password = document.getElementById("passIn").value;
    let username = document.getElementById("userNameIn").value;

    console.log("Submitting:", first, last, date, email, username);

    await registerUser(first, last, date, email, password, username);
});

async function isUserExisting(email, username) {
    const usersRef = collection(db, "users");

    // Query Firestore for existing email OR username
    const emailQuery = query(usersRef, where("email", "==", email));
    const usernameQuery = query(usersRef, where("username", "==", username));

    // Run both queries
    const emailSnapshot = await getDocs(emailQuery);
    const usernameSnapshot = await getDocs(usernameQuery);

    // If either exists, return true
    return !emailSnapshot.empty || !usernameSnapshot.empty;
}

async function registerUser(first, last, date, email, password, username) {
    const exists = await isUserExisting(email, username);

    if (exists) {
        console.error("User already exists! Please use a different email or username.");
        alert("User already exists! Please try a different email or username.");
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Account created:", user);
        
        await addDoc(collection(db, "users"), {
            firstName: first,
            lastName: last,
            birthDate: date,
            email: email,
            username: username
        });

        alert("Account successfully created!");
        window.location.href = "./main.html";  // Redirect after successful signup
    } catch (error) {
        console.error("Account creation failed:", error.message);
        alert("Error creating account: " + error.message);
    }
}
