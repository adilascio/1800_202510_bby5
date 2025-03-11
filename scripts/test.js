import { db } from "./authentication.js"; 
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

async function getField() {
    const docref = doc(db, "users", "testUser1");
    const docsnap = await getDoc(docref);

    if (docsnap.exists()) {
        console.log("Name: " + docsnap.data().name);
    }
}
getField()
