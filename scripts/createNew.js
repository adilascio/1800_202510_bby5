import {getFireStore} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import {app} from "./firebaseAPI_TEAM99.js";

const db = getFireStore(app);

function writeExercises() {

    var exercisesRef = db.collection("exercises");

    exercisesRef.add({
        name: "Chest Press",
        Image: "chest.jpg",
    })

    var exercisesRef = db.collection("exercises");
    exercisesRef.add({
        name: "Squats",
        Image: "squat.jpg",
    })

    var exercisesRef = db.collection("exercises");
    exercisesRef.add({
        name: "Deadlifts",
        Image: "deadlift.jpg",
    })
}


function displayExercisesInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("exercises")
    .doc(ID)
    .get()
    .then( doc => {
        console.log(doc.data());
        thisExercises = doc.data();
        exercisesCode = thisExercises.code;
        exercisesName = thisExercises.name;
        exercisesImage = thisExercises.Image;
        
        document.getElementById("exercisesName").innerHTML = exercisesName;
        let imgEvent = document.querySelector(".exercises-img");
        imgEvent.src = "../images/" + exercisesCode + ".jpg";
 
    })
}

function saveExercisesDocumentIDAndRedirect() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);
    localStorage.setItem("exercisesDocID", ID);
}

var exercisesDocID = localStorage.getItem("exercisesDocID");

function getExercisesName(id) {
    db.collection("exercises")
    .doc(id)
    .get()
    .then((thisExercises) => {
        var exercisesName = thisExercises.data().name;
        document.getElementById("exercisesName").innerHTML = exercisesName;
    })
}

function populateSession() {
    console.log("Populating session...");
    let exerciseCardTemplate = document.getElementById("exercisesCardTemplate");
    let exercisesCardGroup = document.getElementById("exercisesCardGroup");

    let params = new URL(window.location.href);
    let exercisesID = params.searchParams.get("docID");

    db.collection("exercises")
      .where("exerciseID", "==", exercisesID)
      .get()
      .then((allExercises) => {
         exercises = allExercises.docs;
         console.log(exercises);
         exercises.forEach((doc) => {
            var name = doc.data().name;
            var image = doc.data().Image;
            var id = doc.id;
            console.log(name, image, id);

            let exerciseCard = exerciseCardTemplate.cloneNode(true);
            exercisesCard.querySelector(".name").innerHTML = name;
            exercisesCard.querySelector(".image").src = image;
            exercisesCard.querySelector(".id").innerHTML = id;

            exercisesCardGroup.appendChild(exerciseCard);
         })
    })
}

populateSession();
getExercisesName(exercisesDocID);
displayExercisesInfo();


