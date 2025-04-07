import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js"; // Adjust the path as needed

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);
async function buildLeaderboardTable() {

  // Reference the participants subcollection
  const participantsCol = collection(db, "events", "F255F3Onx9e9dGrPudwa", "participants");

  try {
    const querySnapshot = await getDocs(participantsCol);
    const participants = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      participants.push({
        username: data.username || "N/A",
        score: data.score || 0
      });
    });

    // Sort participants by score descending
    participants.sort((a, b) => b.score - a.score);

    // Create the table element and set its class
    const table = document.createElement("table");
    table.className = "table";

    // Create and append the caption
    const caption = document.createElement("caption");
    caption.textContent = "Leaderboard";
    table.appendChild(caption);

    // Create and append the table header (thead)
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

    // Create the table body (tbody) and populate rows
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

    // Append the table to an existing container element (or to the document body if not found)
    const container = document.getElementById("leaderboardContainer");
    if (container) {
      container.innerHTML = ""; // Clear any existing content
      container.appendChild(table);
    } else {
      document.body.appendChild(table);
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
}

// Call the function to build and display the leaderboard table
buildLeaderboardTable();
