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

async function displayPinnedSessions() {
  const pinnedContainer = document.createElement("div");
  pinnedContainer.className = "container mt-4";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const pinnedRef = collection(db, "users", uid, "pinned");

      try {
        const querySnapshot = await getDocs(pinnedRef);

        if (!querySnapshot.empty) {
          const pinnedHeader = document.createElement("h3");
          pinnedHeader.textContent = "Pinned Sessions";
          pinnedContainer.appendChild(pinnedHeader);

          querySnapshot.forEach((doc) => {
            const sessionData = doc.data();

            const sessionCard = document.createElement("div");
            sessionCard.className = "card mb-3";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body";
            cardBody.innerHTML = `
              <strong>Exercise:</strong> ${sessionData.exerciseName || "N/A"}<br>
              <strong>Sets:</strong> ${sessionData.sessionSets || "N/A"}<br>
              <strong>Reps:</strong> ${sessionData.sessionReps || "N/A"}<br>
              <strong>Duration:</strong> ${sessionData.sessionDuration || "N/A"} minutes<br>
              ${sessionData.eventName ? `<strong>Event:</strong> ${sessionData.eventName}<br>` : ""}
            `;

            sessionCard.appendChild(cardBody);
            pinnedContainer.appendChild(sessionCard);
          });
        } else {
          pinnedContainer.innerHTML = `<p>No pinned sessions found.</p>`;
        }
      } catch (error) {
        console.error("Error fetching pinned sessions:", error);
        pinnedContainer.innerHTML = `<p>Error fetching pinned sessions. Please try again later.</p>`;
      }
    } else {
      pinnedContainer.innerHTML = `<p>You must be logged in to view your pinned sessions.</p>`;
    }

    // Append the pinned container to the body
    document.body.appendChild(pinnedContainer);
  });
}

// Call the function to display pinned sessions
displayPinnedSessions();
