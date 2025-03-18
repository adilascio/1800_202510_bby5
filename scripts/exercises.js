// Import Firebase configuration
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

function displayExercisesDynamically(collectionName) {
    let cardTemplate = document.getElementById("exercisesCardTemplate");

    db.collection(collectionName).get().then(allExercises => {
        var i = 1;

        allExercises.forEach(doc => {
            var exercisesID = doc.id;
            var name = doc.data().name;
            var image = doc.data().image;
            let newCard = cardTemplate.content.cloneNode(true);

            newCard.querySelector(".name").innerHTML = name;
            newCard.querySelector(".image").src = image;
            newCard.querySelector(".id").innerHTML = exercisesID;

            document.getElementById(collectionName + "CardGroup").appendChild(newCard);
            i++;
        })
    })
}

displayExercisesDynamically("exercises");

function writeExercises() {
    const exercisesRef = db.collection("exercises");

    exercisesRef.add({
        name: "Chest Press",
        image: "/images/gym_session.jpg"
    });

    exercisesRef.add({
        name: "Squats",
        image: "/images/gym_session.jpg"
    });

    exercisesRef.add({
        name: "Deadlifts",
        image: "/images/gym_session.jpg"
    });
}