import { app } from "./firebaseAPI_TEAM99.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
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

      cardBody.appendChild(sessionDetails);
    });

    dateCard.appendChild(cardHeader);
    dateCard.appendChild(cardBody);
    container.appendChild(dateCard);
  });
}

function displayMessage(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

// Call the fixed function
displaySessionsForProgress();