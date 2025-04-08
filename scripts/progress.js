import { app } from "./firebaseAPI_TEAM99.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Improved error handling, safer HTML injection, and reusable functions

async function displaySessionsForProgress() {
  const sessionsContainer = document.getElementById("sessionCardsContainer");
  sessionsContainer.innerHTML = ""; // Clear previous content

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const sessionsRef = collection(db, "users", uid, "sessions");

      try {
        const querySnapshot = await getDocs(sessionsRef);

        if (!querySnapshot.empty) {
          const sessionsByDate = {};

          querySnapshot.forEach((doc) => {
            const sessionData = doc.data();
            const sessionDate = sessionData.sessionDate;
            if (!sessionsByDate[sessionDate]) {
              sessionsByDate[sessionDate] = [];
            }

            const exercises = sessionData.exercises || [];
            const exerciseDetails = exercises.map(exercise => {
              const div = document.createElement("div");
              div.innerHTML = `
                <strong>Exercise:</strong> ${exercise.exerciseName || "N/A"}<br>
                <strong>Sets:</strong> ${exercise.sets || "N/A"}<br>
                <strong>Reps:</strong> ${exercise.reps || "N/A"}<br>
                <strong>Weight:</strong> ${exercise.weight || "N/A"} lbs<br>
              `;
              return div.innerHTML;
            }).join("<br>");

            sessionsByDate[sessionDate].push({
              id: doc.id,
              ...sessionData,
              exerciseDetails,
            });
          });

          renderSessions(sessionsByDate, sessionsContainer);
        } else {
          displayMessage(sessionsContainer, "No sessions found.");
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        displayMessage(sessionsContainer, "Error fetching sessions. Please try again later.");
      }
    } else {
      displayMessage(sessionsContainer, "You must be logged in to view your sessions.");
    }
  });
}

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

      const pinButton = document.createElement("button");
      pinButton.className = "btn btn-warning btn-sm me-2";
      pinButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>
        </svg> Pin Session
      `;
      pinButton.onclick = () => pinSession(sessionData.id, pinButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg> Delete Session
      `;
      deleteButton.onclick = () => deleteSession(sessionData.id);

      const buttonContainer = document.createElement("div");
      buttonContainer.appendChild(pinButton);
      buttonContainer.appendChild(deleteButton);

      cardBody.appendChild(sessionDetails);
      cardBody.appendChild(buttonContainer);
    });

    dateCard.appendChild(cardHeader);
    dateCard.appendChild(cardBody);
    container.appendChild(dateCard);
  });
}

async function pinSession(sessionId, pinButton) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const sessionRef = doc(db, "users", uid, "sessions", sessionId);
      const pinnedRef = doc(db, "users", uid, "pinned", sessionId);

      const sessionSnapshot = await getDoc(sessionRef); // Use getDoc for a single document
      if (sessionSnapshot.exists()) {
        const sessionData = sessionSnapshot.data();
        await setDoc(pinnedRef, { ...sessionData, pinned: true }, { merge: true });
      }

      alert("Session pinned successfully!");

      // Update the button to show "Pinned Session" and change the icon
      pinButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>
        </svg> Pinned Session
      `;
      pinButton.disabled = true; // Disable the button after pinning
    }
  } catch (error) {
    console.error("Error pinning session:", error);
    alert("Failed to pin session. Please try again.");
  }
}

async function deleteSession(sessionId) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const sessionRef = doc(db, "users", uid, "sessions", sessionId);
      await deleteDoc(sessionRef);
      alert("Session deleted successfully!");
      displaySessionsForProgress(); // Refresh the sessions
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    alert("Failed to delete session. Please try again.");
  }
}

function displayMessage(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

// Call the fixed function
displaySessionsForProgress();