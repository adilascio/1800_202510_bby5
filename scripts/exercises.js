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

// Uncomment if you want to add exercises on page load
// writeExercises();
