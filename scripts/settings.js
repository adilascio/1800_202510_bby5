import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js";

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserData(user.uid);
    } else {
        console.log("User not logged in");
    }
});

async function fetchUserData(userUid) {
    const userQuery = query(collection(db, "users"), where("uid", "==", userUid));
    try {
        const userSnap = await getDocs(userQuery);

        if (!userSnap.empty) {
            userSnap.forEach((docsnap) => {
                const userData = docsnap.data();
                document.getElementById("FIRST").value = userData.firstName;
                document.getElementById("LAST").value = userData.lastName;
                document.getElementById("BIRTHDAY").value = userData.birthDate;
                document.getElementById("EMAIL").value = userData.email;
                document.getElementById("USERNAME").value = userData.username;

                // Store the document ID for later use in save()
                document.getElementById("submit").dataset.docId = docsnap.id;
            });
        } else {
            console.log("Couldn't load userSnap");
        }
    } catch (error) {
        console.error("Error loading user data: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit").addEventListener("click", async function (e) {
        e.preventDefault(); // Prevent form submission
        await save(); // Call the save function
    });
});

async function save() {
    console.log("Saving...");

    const firstName = document.getElementById("FIRST").value;
    const lastName = document.getElementById("LAST").value;
    const birthDate = document.getElementById("BIRTHDAY").value;
    const email = document.getElementById("EMAIL").value;
    const username = document.getElementById("USERNAME").value;

    // Get the current user's UID from Firebase Authentication
    const currentUid = auth.currentUser?.uid;

    // Check if currentUid is available
    if (!currentUid) {
        console.error("User is not authenticated.");
        return; // Stop if user is not authenticated
    }

    // Check if email or username already exists
    const userExists = await isUserExisting(email, username, currentUid);
    if (userExists) {
        alert("Username or email already in use.");
        return; // Stop if user already exists
    }

    // Get document ID to update
    const docId = document.getElementById("submit").dataset.docId;
    if (!docId) {
        console.error("Error: Document ID not found.");
        return;
    }

    const userRef = doc(db, "users", docId);
    try {
        await updateDoc(userRef, {
            firstName,
            lastName,
            birthDate,
            email,
            username,
        });
        alert("User data updated successfully!");
    } catch (error) {
        console.error("Error updating user data: " + error.message);
    }
}


async function isUserExisting(email, username, currentUid) {
    // Ensure currentUid is defined and valid
    if (!currentUid) {
        console.error("currentUid is undefined or null");
        return false; // Or handle this case accordingly
    }

    const usersRef = collection(db, "users");

    // Query Firestore for existing email OR username, excluding the current user's UID
    const emailQuery = query(usersRef, where("email", "==", email), where("uid", "!=" , currentUid));
    const usernameQuery = query(usersRef, where("username", "==", username), where("uid", "!=" , currentUid));

    try {
        // Run both queries
        const emailSnapshot = await getDocs(emailQuery);
        const usernameSnapshot = await getDocs(usernameQuery);

        // Return true if either email or username already exists, excluding current user
        return !emailSnapshot.empty || !usernameSnapshot.empty;
    } catch (error) {
        console.error("Error checking user existence: " + error.message);
        return false; // Return false in case of an error
    }
}

addEventListener("DOMContentLoaded", () => {
    document.getElementById("logout").addEventListener("click", function() {
        window.location.href = "./index.html";
    });
});
