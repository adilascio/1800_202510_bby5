// Import app from your Firebase API file
import { app } from "./firebaseAPI_TEAM99.js";

// Import necessary Firestore functions from the Firebase module
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

// Write Exercises to Firestore
async function writeExercises() {
  try {
    // Add documents to the "exercises" collection
    await addDoc(collection(db, "exercises"), {
      name: "Chest Press",
      image: "/images/gym_session.jpg",
    });

    await addDoc(collection(db, "exercises"), {
      name: "Squats",
      image: "/images/gym_session.jpg",
    });

    await addDoc(collection(db, "exercises"), {
      name: "Deadlifts",
      image: "/images/gym_session.jpg",
    });

    console.log("Exercises added successfully!");
  } catch (error) {
    console.error("Error adding exercises:", error);
  }
}

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

function updateSelectedExercise() {
  const selectedExercise = document.querySelector('input[name="exercise"]:checked');
  const selectedExerciseTextBox = document.getElementById("selectedExercise");
  if (selectedExercise) {
    selectedExerciseTextBox.value = selectedExercise.value;
  } else {
    selectedExerciseTextBox.value = ""; 
  }
}

const dropdown = document.getElementById("exerciseDropdown");
populateExerciseDropdown(dropdown).then(() => {
  attachExerciseListeners();
});


function attachExerciseListeners() {
  const exerciseRadios = document.querySelectorAll('input[name="exercise"]');
  exerciseRadios.forEach((radio) => {
    radio.addEventListener("change", updateSelectedExercise);
  });
}

async function populateEventDropdown() {
  try {
    const eventsRef = collection(db, "events");
    const querySnapshot = await getDocs(eventsRef);

    const dropdownMenu = document.getElementById("eventDropdown");

    querySnapshot.forEach((doc) => {
      const eventName = doc.data().name;

      
      const listItem = document.createElement("li");

      
      const radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "event";
      radioButton.id = `event-${eventName}`;
      radioButton.value = eventName;
      radioButton.className = "form-check-input";

      
      const label = document.createElement("label");
      label.htmlFor = `event-${eventName}`;
      label.className = "form-check-label";
      label.textContent = eventName;

      
      listItem.appendChild(radioButton);
      listItem.appendChild(label);

      
      dropdownMenu.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error populating event dropdown:", error);
  }
}

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

function updateSelectedEvent() {
  const selectedEvent = document.querySelector('input[name="event"]:checked');
  const selectedEventTextBox = document.getElementById("selectedEvent");
  if (selectedEvent) {
    selectedEventTextBox.value = selectedEvent.value;
  } else {
    selectedEventTextBox.value = ""; 
  }
}

// Uncomment if you want to add exercises on page load
// writeExercises();
