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
  
  async function populateExerciseDropdown() {
    try {
      const exercisesRef = collection(db, "exercises");
      const querySnapshot = await getDocs(exercisesRef);
  
      const dropdownMenu = document.getElementById("exerciseDropdown");
      dropdownMenu.innerHTML = ""; // Clear existing items
  
      querySnapshot.forEach((doc) => {
        const exerciseName = doc.data().name;
  
        // Create a list item
        const listItem = document.createElement("li");
  
        // Create a radio button
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "exercise";
        radioButton.id = `exercise-${exerciseName}`;
        radioButton.value = exerciseName;
        radioButton.className = "form-check-input";
  
        // Create a label for the radio button
        const label = document.createElement("label");
        label.htmlFor = `exercise-${exerciseName}`;
        label.className = "form-check-label";
        label.textContent = exerciseName;
  
        // Append the radio button and label to the list item
        listItem.appendChild(radioButton);
        listItem.appendChild(label);
  
        // Append the list item to the dropdown menu
        dropdownMenu.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error populating exercise dropdown:", error);
    }
  }
  
  // Call the function to populate the dropdown
  populateExerciseDropdown().then(() => {
    attachExerciseListeners();
  });
  
  async function populateEventDropdown() {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);
  
      const dropdownMenu = document.getElementById("eventDropdown");
      dropdownMenu.innerHTML = ""; // Clear existing items
  
      querySnapshot.forEach((doc) => {
        const eventName = doc.data().name;
  
        // Create a list item
        const listItem = document.createElement("li");
  
        // Create a radio button
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "event";
        radioButton.id = `event-${eventName}`;
        radioButton.value = eventName;
        radioButton.className = "form-check-input";
  
        // Create a label for the radio button
        const label = document.createElement("label");
        label.htmlFor = `event-${eventName}`;
        label.className = "form-check-label";
        label.textContent = eventName;
  
        // Append the radio button and label to the list item
        listItem.appendChild(radioButton);
        listItem.appendChild(label);
  
        // Append the list item to the dropdown menu
        dropdownMenu.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error populating event dropdown:", error);
    }
  }
  
  // Call the function to populate the event dropdown
  populateEventDropdown().then(() => {
    attachEventListeners();
  });
  
  function displayExercises(collection) {
    let cardTemplate = document.getElementById("exercisesCardTemplate");
      db.collection(collection).get() 
       allExercises.forEach(doc => {
        var name = doc.data().name;

        newCard.querySelector(".name").innerHTML = name;

        document.getElementById(collection + "-go-here").appendChild(newCard);
  });

}

import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js"; // Import UUID for unique IDs

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth(app);

// Write Sessions to Firestore
function writeSession() {
  console.log("writeSession function called"); // Log to confirm function execution

  try {
    // Get form values
    let sessionDate = document.getElementById("inputdate").value;
    let sessionDuration = document.getElementById("inputetime").value;
    let sessionSets = document.getElementById("inputsets").value;
    let sessionReps = document.getElementById("inputreps").value;

    // Get selected exercise
    let selectedExercise = document.querySelector('input[name="exercise"]:checked');
    let exerciseName = selectedExercise ? selectedExercise.value : null;

    // Get selected event (if checkbox is checked)
    let isEventSubmission = document.getElementById("myCheckbox").checked;
    let selectedEvent = isEventSubmission
      ? document.querySelector('input[name="event"]:checked')
      : null;
    let eventName = selectedEvent ? selectedEvent.value : null;

    console.log("Form values:", {
      sessionDate,
      sessionDuration,
      sessionSets,
      sessionReps,
      exerciseName,
      eventName,
    });

    // Check if required fields are filled
    if (!sessionDate || !sessionDuration || !sessionSets || !sessionReps || !exerciseName) {
      console.error("Missing required form fields");
      alert("Please fill in all required fields.");
      return;
    }

    // Generate a unique session ID
    let sessionID = uuidv4();
    console.log("Generated session ID:", sessionID);

    // Get the current user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Firebase Auth UID:", user.uid);

        // Reference the user's sessions subcollection
        const userSessionsRef = doc(collection(db, "users", user.uid, "sessions"), sessionID);

        // Add the session document
        setDoc(userSessionsRef, {
          sessionID: sessionID,
          sessionDate: sessionDate,
          sessionDuration: sessionDuration,
          sessionSets: sessionSets,
          sessionReps: sessionReps,
          exerciseName: exerciseName,
          eventName: eventName,
          timestamp: new Date(),
        })
          .then(() => {
            console.log("Session successfully written!");
            alert("Session successfully saved!");
            //window.location.href = "profile.html"; // Redirect to the thanks page
          })
          .catch((error) => {
            console.error("Error writing session to Firestore:", error);
            alert("Error saving session. Please try again.");
          });
      } else {
        console.error("No user is signed in");
        alert("You must be signed in to save a session.");
        window.location.href = "createNew.html";
      }
    });
  } catch (error) {
    console.error("Error in writeSession function:", error);
    alert("An unexpected error occurred. Please try again.");
  }

  // Test Firestore write
  setDoc(doc(collection(db, "testCollection"), "testDoc"), {
    testField: "testValue",
  })
    .then(() => {
      console.log("Test document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing test document:", error);
    });
}

// Attach writeSession to the global window object
// window.writeSession = writeSession;

// // Test function to write a new subcollection "sessions" with a document "session"
// async function testWriteSession(uid) {
//   console.log("testWriteSession function called");

//   try {
//     // Example session data
//     const sessionData = {
//       sessionID: "testSessionID",
//       sessionDate: "2023-10-01",
//       sessionDuration: 60,
//       sessionSets: 3,
//       sessionReps: 12,
//       exerciseName: "Push-ups",
//       eventName: "Morning Workout",
//       timestamp: new Date(),
//     };

//     // Reference the user's sessions subcollection
//     const userSessionsRef = doc(collection(db, "users", uid, "sessions"), "session");

//     // Write the session data
//     await setDoc(userSessionsRef, sessionData);
//     console.log("Test session successfully written!");
//   } catch (error) {
//     console.error("Error writing test session:", error);
//   }
// }

// Example usage of the test function
// Replace "exampleUID" with the actual user ID
//stestWriteSession("exampleUID");

function updateSelectedExercise() {
  const selectedExercise = document.querySelector('input[name="exercise"]:checked');
  const selectedExerciseTextBox = document.getElementById("selectedExercise");
  if (selectedExercise) {
    selectedExerciseTextBox.value = selectedExercise.value;
  } else {
    selectedExerciseTextBox.value = ""; // Clear the text box if no exercise is selected
  }
}

// Attach event listeners to exercise radio buttons
function attachExerciseListeners() {
  const exerciseRadios = document.querySelectorAll('input[name="exercise"]');
  exerciseRadios.forEach((radio) => {
    radio.addEventListener("change", updateSelectedExercise);
  });
}

function updateSelectedEvent() {
  const selectedEvent = document.querySelector('input[name="event"]:checked');
  const selectedEventTextBox = document.getElementById("selectedEvent");
  if (selectedEvent) {
    selectedEventTextBox.value = selectedEvent.value;
  } else {
    selectedEventTextBox.value = ""; // Clear the text box if no event is selected
  }
}

// Attach event listeners to event radio buttons
function attachEventListeners() {
  const eventRadios = document.querySelectorAll('input[name="event"]');
  eventRadios.forEach((radio) => {
    radio.addEventListener("change", updateSelectedEvent);
  });
}

// Call this function after populating the event dropdown
populateEventDropdown().then(() => {
  attachEventListeners();
});

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