import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js"; // Adjust the path as needed

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Builds the leaderboard tables for all events in the current user's subcollection.
 * It now fetches the "eventID" field from the event doc and uses that to query the main events collection.
 */
async function buildUserLeaderboards() {
  const container = document.getElementById("leaderboardContainer");
  if (container) {
    container.innerHTML = ""; // Clear any existing content
  } else {
    console.warn("Container element with ID 'leaderboardContainer' not found. Appending to document.body.");
  }

  // Listen for authentication state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      console.log("Current user UID:", uid);

      // Reference the user's events subcollection: "users/<uid>/events"
      const userEventsRef = collection(db, "users", uid, "events");
      try {
        const userEventsSnapshot = await getDocs(userEventsRef);
        console.log("User events snapshot:", userEventsSnapshot.docs);

        if (userEventsSnapshot.empty) {
          const msg = "No events found for the current user.";
          console.log(msg);
          if (container) {
            container.innerHTML = msg;
          }
          return;
        }

        // Loop over each event document in the user's events subcollection
        for (const eventDoc of userEventsSnapshot.docs) {
          // Get the user event document data
          const userEventData = eventDoc.data();
          console.log("User event document data for event doc", eventDoc.id, ":", userEventData);

          // Fetch the eventID from the document. If not present, fallback to the document's ID.
          const fetchedEventID = userEventData.eventID || eventDoc.id;
          console.log("Processing Event ID:", fetchedEventID);

          // Determine the event name:
          // First try to get it from the user's event document using the "event name" field.
          let eventName = "Leaderboard"; // Fallback caption
          if (userEventData["event name"]) {
            eventName = userEventData["event name"];
          } else {
            // If not available, try fetching the main event document from "events/<fetchedEventID>"
            try {
              const mainEventRef = doc(db, "events", fetchedEventID);
              const mainEventSnap = await getDoc(mainEventRef);
              if (mainEventSnap.exists()) {
                const mainEventData = mainEventSnap.data();
                eventName = mainEventData["event name"] || eventName;
                console.log("Main event document data for event", fetchedEventID, ":", mainEventData);
              }
            } catch (e) {
              console.error("Error fetching main event document for event", fetchedEventID, ":", e);
            }
          }
          console.log("Using event name:", eventName);

          // Fetch participants for this event from: "events/<fetchedEventID>/participants"
          const participantsCol = collection(db, "events", fetchedEventID, "participants");
          const participantsSnapshot = await getDocs(participantsCol);
          const participants = [];
          participantsSnapshot.forEach((participantDoc) => {
            const pData = participantDoc.data();
            participants.push({
              username: pData.username || "N/A",
              score: pData.score || 0
            });
          });
          console.log("Participants for event", fetchedEventID, ":", participants);

          // Sort participants by score descending (highest first)
          participants.sort((a, b) => b.score - a.score);

          // Create a table element for this event's leaderboard
          const table = document.createElement("table");
          table.className = "table";

          // Create and append the caption using the event name
          const caption = document.createElement("caption");
          caption.textContent = eventName;
          table.appendChild(caption);

          // Build the table header (thead)
          const thead = document.createElement("thead");
          thead.innerHTML = `
            <tr>
              <th scope="col">#</th>
              <th scope="col">username</th>
              <th scope="col">score</th>
              <th scope="col">date</th>
            </tr>
          `;
          table.appendChild(thead);

          // Build the table body (tbody) with a row per participant
          const tbody = document.createElement("tbody");
          participants.forEach((participant, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <th scope="row">${index + 1}</th>
              <td>${participant.username}</td>
              <td>${participant.score}</td>
              <td></td>
            `;
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);

          // Append this event's leaderboard table to the container (or document.body if container not found)
          if (container) {
            container.appendChild(table);
          } else {
            document.body.appendChild(table);
          }
        }
      } catch (error) {
        console.error("Error fetching user's events:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  });
}

// Wait until the DOM is fully loaded before calling our function
document.addEventListener("DOMContentLoaded", () => {
  buildUserLeaderboards();
});
