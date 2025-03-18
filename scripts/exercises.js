// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClqsSTYdjvWkReamO0GPJrD6m_d5zY9UI",
    authDomain: "gympal-8419a.firebaseapp.com",
    projectId: "gympal-8419a",
    storageBucket: "gympal-8419a.firebasestorage.app",
    messagingSenderId: "193277208966",
    appId: "1:193277208966:web:c5ff40b20d0dd283ce2407",
    measurementId: "G-MEW3WG1HGT"
};
module = firebase.initializeApp(firebaseConfig);
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
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