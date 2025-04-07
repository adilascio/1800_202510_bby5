// Import Firestore functions
import {
    getFirestore,
    collection,
    query,
    where,
    doc,
    setDoc,
    getDocs,
  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
  
  import { app } from "./firebaseAPI_TEAM99.js";
  
  
import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js"; 

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";


const auth = getAuth(app);

  // Initialize Firestore
  const db = getFirestore(app);
  
  // Function to get the name of a document in the "exercises" collection
  async function getExerciseNameAndSetDocID() {
    try {
      // Reference the exercises collection
      const exercisesRef = collection(db, "exercises");
  
      // Get all documents in the collection (for example, first one)
      const querySnapshot = await getDocs(exercisesRef);
  
      if (!querySnapshot.empty) {
        // Get the first document in the collection (or any other logic)
        const docSnap = querySnapshot.docs[0];
  
        // Get the name of the exercise document
        const exerciseName = docSnap.data().name;
  
        // Set the name as the exercisesDocID
        const exercisesDocID = exerciseName;
  
        // Log it to confirm
        console.log("Exercise Document ID (Name):", exercisesDocID);
  
        // Optionally, store this in localStorage or use it further
        localStorage.setItem("exercisesDocID", exercisesDocID);
      } else {
        console.log("No exercises found.");
      }
    } catch (error) {
      console.error("Error getting exercise document name:", error);
    }
  }
  
  // Call the function to get the exercise name and set it as the ID
  getExerciseNameAndSetDocID();
  
 

function writeSession() {
  console.log("writeSession function called");

  try {
    
    let sessionDate = document.getElementById("inputdate").value;
    let isEventSubmission = document.getElementById("myCheckbox").checked;
    let selectedEvent = isEventSubmission
      ? document.querySelector('input[name="event"]:checked')
      : null;
    let eventName = selectedEvent ? selectedEvent.value : null;

    const exercises = [];
    const exerciseGroups = document.querySelectorAll(".exercise-group");

    exerciseGroups.forEach((group) => {
      const exerciseName = group.querySelector(".selectedExercise").value;
      const sets = group.querySelector(".inputsets").value;
      const reps = group.querySelector(".inputreps").value;
      const weight = group.querySelector(".inputweight").value;

      if (exerciseName && sets && reps && weight) {
        exercises.push({ exerciseName, sets, reps, weight });
      }
    });

    console.log("Form values:", {
      sessionDate,
      eventName,
      exercises,
    });

    if (!sessionDate || exercises.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    
    let sessionID = uuidv4();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userSessionsRef = doc(collection(db, "users", user.uid, "sessions"), sessionID);

        setDoc(userSessionsRef, {
          sessionID,
          sessionDate,
          eventName,
          exercises,
          timestamp: new Date(),
        })
          
          .then(() => {
            alert("Session successfully saved!");
            window.location.href = "progress.html";
          })
          .catch((error) => {
            console.error("Error writing session to Firestore:", error);
            alert("Error saving session. Please try again.");
          });
      } else {
        alert("You must be signed in to save a session.");
        window.location.href = "createNew.html";
      }
    });
  } catch (error) {
    console.error("Error in writeSession function:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}


window.writeSession = writeSession;

function toSession() {
  window.location.href = "CreateSession.html";
}

// Attach event listener to the button
document.addEventListener("DOMContentLoaded", () => {
  const createSessionButton = document.querySelector('button[onclick="toSession()"]');
  if (createSessionButton) {
    createSessionButton.addEventListener("click", toSession);
  }
});

function toEvent() {
  window.location.href = "CreateEvent.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const createEventButtons = document.querySelectorAll('button[onclick="toEvent()"]');
  createEventButtons.forEach((button) => {
    button.addEventListener("click", toEvent);
  });
});