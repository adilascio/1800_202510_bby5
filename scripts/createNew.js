// Import Firestore functions
import {
    getFirestore,
    collection,
    doc,
    getDoc,
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
  
        // Create a new dropdown item
        const dropdownItem = document.createElement("li");
        const link = document.createElement("a");
        link.className = "dropdown-item exercise-name";
        link.textContent = exerciseName;
        dropdownItem.appendChild(link);
  
        // Append to the dropdown menu
        dropdownMenu.appendChild(dropdownItem);
      });
    } catch (error) {
      console.error("Error populating exercise dropdown:", error);
    }
  }
  
  // Call the function to populate the dropdown
  populateExerciseDropdown();
  
  function displayExercises(collection) {
    let cardTemplate = document.getElementById("exercisesCardTemplate");
      db.collection(collection).get() 
       allExercises.forEach(doc => {
        var name = doc.data().name;

        newCard.querySelector(".name").innerHTML = name;

        document.getElementById(collection + "-go-here").appendChild(newCard);
  });

}
// Write Sessions to Firestore
function writeSession() {
  console.log("inside write session");
  let sessionDate = document.getElementById("inputdate").value;
  let sessionDuration = document.getElementById("inputduration").value;
  let sessionSets = document.getElementById("inputsets").value;
  let sessionReps = document.getElementById("inputreps").value;
  // let hikeFlooded = document.querySelector('input[name="flooded"]:checked').value;
  // let hikeScrambled = document.querySelector('input[name="scrambled"]:checked').value;

  console.log(sessionDate, sessionDuration, sessionSets, sessionReps,);

  var user = firebase.auth().currentUser;
  if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      // Get the document for the current user.
      db.collection("sessions").add({
          sessionDate: sessionDate,
          sessionDuration: sessionDuration,
          sessionSets: sessionSets,
          sessionReps: sessionReps,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          window.location.href = "submitted.html"; // Redirect to the thanks page
      });
  } else {
      console.log("No user is signed in");
      window.location.href = 'createNew.html';
  }
}

// Attach writeSession to the global window object
window.writeSession = writeSession;