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
  
  async function populateExerciseDropdown(dropdownMenu) {
    try {
      const exercisesRef = collection(db, "exercises");
      const querySnapshot = await getDocs(exercisesRef);
  
      querySnapshot.forEach((doc) => {
        const exerciseName = doc.data().name;
  
        // Create a list item
        const listItem = document.createElement("li");
  
        // Create a radio button
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = `exercise-${dropdownMenu.parentElement.parentElement.querySelector(".selectedExercise").id}`;
        radioButton.value = exerciseName;
        radioButton.className = "form-check-input";
  
        // Create a label for the radio button
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.textContent = exerciseName;
  
        // Append the radio button and label to the list item
        listItem.appendChild(radioButton);
        listItem.appendChild(label);
  
        // Add a click event to update the selected exercise
        radioButton.addEventListener("change", () => {
          dropdownMenu.parentElement.parentElement.querySelector(".selectedExercise").value = exerciseName;
        });
  
        // Append the list item to the dropdown menu
        dropdownMenu.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error populating exercise dropdown:", error);
    }
  }
  
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
document.addEventListener("DOMContentLoaded", () => {
  const addExerciseButton = document.getElementById("addExerciseButton");
  const exerciseContainer = document.getElementById("exerciseContainer");

  addExerciseButton.addEventListener("click", () => {
    const exerciseGroup = document.querySelector(".exercise-group").cloneNode(true);

    // Clear the cloned inputs
    exerciseGroup.querySelector(".selectedExercise").value = "";
    exerciseGroup.querySelector(".inputsets").value = "";
    exerciseGroup.querySelector(".inputreps").value = "";
    exerciseGroup.querySelector(".inputweight").value = "";

    // Reattach event listeners for the new dropdown
    const dropdownMenu = exerciseGroup.querySelector(".exerciseDropdown");
    dropdownMenu.innerHTML = ""; // Clear existing items

    populateExerciseDropdown(dropdownMenu);

    exerciseContainer.appendChild(exerciseGroup);
  });

  populateExerciseDropdown(document.querySelector(".exerciseDropdown"));
});

function writeSession() {
  console.log("writeSession function called");

  try {
    // Get form values
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

    // Generate a unique session ID
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
          // After successfully saving the session, redirect the user to progress.html
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

// Attach writeSession to the global window object
window.writeSession = writeSession;

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