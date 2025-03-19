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

// Display Exercises Dynamically
async function displayExercisesDynamically(collectionName) {
  let cardTemplate = document.getElementById("exercisesCardTemplate");

  try {
    // Get all documents from the collection
    const querySnapshot = await getDocs(collection(db, collectionName));
    let i = 1;

    // Loop through each document in the collection
    querySnapshot.forEach((doc) => {
      const exercisesID = doc.id;
      const { name, image } = doc.data();
      let newCard = cardTemplate.content.cloneNode(true);

      // Update card details
      newCard.querySelector(".name").innerHTML = name;
      newCard.querySelector(".image").src = image;
      newCard.querySelector(".id").innerHTML = exercisesID;

      // Append the new card to the correct card group
      document.getElementById(collectionName + "CardGroup").appendChild(newCard);
      i++;
    });
  } catch (error) {
    console.error("Error displaying exercises: ", error);
  }
}

// Call the function to display exercises dynamically
displayExercisesDynamically("exercises");

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
