import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js"; 

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

async function fetchUserData(userUid) {
    // Create a query to find the document where uid field matches the user's UID
    const userQuery = query(collection(db, "users"), where("uid", "==", userUid));

    try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            querySnapshot.forEach((docSnap) => {
                const userData = docSnap.data();

                // Populate the elements with Firestore data
                document.getElementById("userName").textContent = userData.username || "No username";
                document.getElementById("fullName").textContent = `${userData.firstName} ${userData.lastName}` || "No name available";
                document.getElementById("dateOfBirth").textContent = `Born: ${userData.birthDate || "N/A"}`;
            });
        } else {
            console.log("No user document found!");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Correct usage of Firebase's onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user.uid);  // The Firebase Authentication UID
        fetchUserData(user.uid); // Fetch user data based on the UID field in the Firestore document
    } else {
        console.log("User not signed in.");
    }
});
