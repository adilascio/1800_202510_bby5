import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js"; 

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

async function fetchUserData(userId) {
    const userRef = doc(db, "users", userId); // Reference to Firestore document
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        const userData = userSnap.data();

        // Populate the elements with Firestore data
        document.getElementById("userName").textContent = userData.username || "No username";
        document.getElementById("fullName").textContent = `${userData.firstName} ${userData.lastName}` || "No name available";
        document.getElementById("dateOfBirth").textContent = `Born: ${userData.birthDate || "N/A"}`;
    } else {
        console.log("Couldn't make user snap");
    }
}

// Correct usage of Firebase's onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserData(user.uid); // Call function with logged-in user's UID
    } else {
        console.log("User not signed in.");
    }
});
