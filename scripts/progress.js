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

async function displaySessions() {
  const sessionsContainer = document.createElement("div");
  sessionsContainer.className = "container mt-4";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const sessionsRef = collection(db, "users", uid, "sessions");
      const pinnedRef = collection(db, "users", uid, "pinned");

      try {
        const pinnedSnapshot = await getDocs(pinnedRef);
        const pinnedIds = pinnedSnapshot.docs.map((doc) => doc.id);

        const querySnapshot = await getDocs(sessionsRef);

        if (!querySnapshot.empty) {
          // Organize sessions by date
          const sessionsByDate = {};

          querySnapshot.forEach((doc) => {
            const sessionData = doc.data();
            const sessionDate = sessionData.sessionDate;

            if (!sessionsByDate[sessionDate]) {
              sessionsByDate[sessionDate] = [];
            }

            sessionsByDate[sessionDate].push({ id: doc.id, ...sessionData });
          });

          // Sort dates in descending order
          const sortedDates = Object.keys(sessionsByDate).sort((a, b) => new Date(b) - new Date(a));

          sortedDates.forEach((date) => {
            // Create a card for each date
            const dateCard = document.createElement("div");
            dateCard.className = "card mb-3";

            const cardHeader = document.createElement("div");
            cardHeader.className = "card-header";
            cardHeader.textContent = `Date: ${date}`;

            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            // Add all sessions for the date
            sessionsByDate[date].forEach((sessionData) => {
              const sessionDetails = document.createElement("p");
              sessionDetails.className = "card-text";
              sessionDetails.innerHTML = `
                <strong>Exercise:</strong> ${sessionData.exerciseName || "N/A"}<br>
                <strong>Sets:</strong> ${sessionData.sessionSets || "N/A"}<br>
                <strong>Reps:</strong> ${sessionData.sessionReps || "N/A"}<br>
                <strong>Duration:</strong> ${sessionData.sessionDuration || "N/A"} minutes<br>
                ${sessionData.eventName ? `<strong>Event:</strong> ${sessionData.eventName}<br>` : ""}
              `;

              // Add a pin icon for each session
              const pinIcon = document.createElement("button");
              pinIcon.className = "btn btn-outline-primary btn-sm ms-2";
              pinIcon.innerHTML = pinnedIds.includes(sessionData.id)
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">\n                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>\n                </svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">\n                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>\n                </svg>';
              pinIcon.title = pinnedIds.includes(sessionData.id)
                ? "Unpin this session"
                : "Pin this session";

              pinIcon.addEventListener("click", async () => {
                try {
                  if (pinnedIds.includes(sessionData.id)) {
                    // Unpin the session
                    await deleteDoc(doc(pinnedRef, sessionData.id));
                    pinnedIds.splice(pinnedIds.indexOf(sessionData.id), 1);
                    pinIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">\n                      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>\n                    </svg>';
                    pinIcon.title = "Pin this session";
                    alert("Session unpinned successfully!");
                  } else {
                    // Pin the session
                    await setDoc(doc(pinnedRef, sessionData.id), sessionData);
                    pinnedIds.push(sessionData.id);
                    pinIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">\n                      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>\n                    </svg>';
                    pinIcon.title = "Unpin this session";
                    alert("Session pinned successfully!");
                  }
                } catch (error) {
                  console.error("Error updating pin status:", error);
                  alert("Failed to update pin status. Please try again.");
                }
              });

              sessionDetails.appendChild(pinIcon);
              cardBody.appendChild(sessionDetails);
            });

            dateCard.appendChild(cardHeader);
            dateCard.appendChild(cardBody);
            sessionsContainer.appendChild(dateCard);
          });
        } else {
          sessionsContainer.innerHTML = `<p>No sessions found.</p>`;
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        sessionsContainer.innerHTML = `<p>Error fetching sessions. Please try again later.</p>`;
      }
    } else {
      sessionsContainer.innerHTML = `<p>You must be logged in to view your sessions.</p>`;
    }

    // Append the sessions container to the body
    document.body.appendChild(sessionsContainer);
  });
}

// Call the function to display sessions
displaySessions();
