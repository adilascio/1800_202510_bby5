import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { app } from "./firebaseAPI_TEAM99.js"; // Adjust the path as needed

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

function setOwnerForEvent() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        // Reference the event document
        const eventDocRef = doc(db, "events", "F255F3Onx9e9dGrPudwa");
  
        try {
          // Set the "owner" field to the user's UID, using merge to preserve existing fields
          await setDoc(eventDocRef, { owner: uid }, { merge: true });
          console.log("Event owner set successfully:", uid);
        } catch (error) {
          console.error("Error setting event owner:", error);
        }
      } else {
        console.error("No user is logged in.");
      }
    });
  }
  
  // Call the function when needed
//   setOwnerForEvent()