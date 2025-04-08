import { getFirestore, collection, query, where, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
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
  const pinnedContainer = document.getElementById("pinnedSessionsContainer"); // Use the existing container
  pinnedContainer.innerHTML = ""; // Clear previous content

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const pinnedRef = collection(db, "users", uid, "pinned");

      try {
        const querySnapshot = await getDocs(pinnedRef);
        const sessionsByDate = {};

        querySnapshot.forEach((doc) => {
          const sessionData = doc.data();
          const sessionDate = sessionData.sessionDate;

          if (!sessionsByDate[sessionDate]) {
            sessionsByDate[sessionDate] = [];
          }

          const exercises = sessionData.exercises || [];
          const exerciseDetails = exercises.map((exercise) => {
            return `
              <strong>Exercise:</strong> ${exercise.exerciseName || "N/A"}<br>
              <strong>Sets:</strong> ${exercise.sets || "N/A"}<br>
              <strong>Reps:</strong> ${exercise.reps || "N/A"}<br>
              <strong>Weight:</strong> ${exercise.weight || "N/A"} lbs<br>
            `;
          }).join("<br>");

          sessionsByDate[sessionDate].push({
            id: doc.id,
            ...sessionData,
            exerciseDetails,
          });
        });

        if (Object.keys(sessionsByDate).length > 0) {
          renderSessions(sessionsByDate, pinnedContainer);
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
  });
}

// Call the function to display pinned sessions
displayPinnedSessions();

function renderSessions(sessionsByDate, container) {
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const dateCard = document.createElement("div");
    dateCard.className = "card mb-3";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.textContent = `Date: ${date}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    sessionsByDate[date].forEach(sessionData => {
      const sessionDetails = document.createElement("p");
      sessionDetails.className = "card-text";
      sessionDetails.innerHTML = `
        ${sessionData.exerciseDetails}<br>
        ${sessionData.eventName ? `<strong>Event:</strong> ${sessionData.eventName}<br>` : ""}
      `;

      const unpinButton = document.createElement("button");
      unpinButton.className = "btn btn-success btn-sm me-2";
      unpinButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>
        </svg> Unpin Session
      `;
      unpinButton.onclick = () => unpinSession(sessionData.id, unpinButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg> Delete Session
      `;
      deleteButton.onclick = () => deleteSession(sessionData.id);

      const buttonContainer = document.createElement("div");
      buttonContainer.appendChild(unpinButton);
      buttonContainer.appendChild(deleteButton);

      cardBody.appendChild(sessionDetails);
      cardBody.appendChild(buttonContainer);
    });

    dateCard.appendChild(cardHeader);
    dateCard.appendChild(cardBody);
    container.appendChild(dateCard);
  });
}

async function pinSession(sessionId) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const sessionRef = doc(db, "users", uid, "sessions", sessionId);
      await setDoc(sessionRef, { pinned: true }, { merge: true });
      alert("Session pinned successfully!");
    }
  } catch (error) {
    console.error("Error pinning session:", error);
    alert("Failed to pin session. Please try again.");
  }
}

async function unpinSession(sessionId, unpinButton) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const pinnedRef = doc(db, "users", uid, "pinned", sessionId);
      await deleteDoc(pinnedRef);
      alert("Session unpinned successfully!");

      // Remove the session card or update the UI
      unpinButton.closest(".card").remove();
    }
  } catch (error) {
    console.error("Error unpinning session:", error);
    alert("Failed to unpin session. Please try again.");
  }
}

async function deleteSession(sessionId) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const sessionRef = doc(db, "users", uid, "sessions", sessionId);
      const pinnedRef = doc(db, "users", uid, "pinned", sessionId);

      // Delete from both sessions and pinned collections
      await deleteDoc(sessionRef);
      await deleteDoc(pinnedRef);

      alert("Session deleted successfully!");

      // Refresh the pinned sessions
      displayPinnedSessions();
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    alert("Failed to delete session. Please try again.");
  }
}
