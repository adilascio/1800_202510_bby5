
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClqsSTYdjvWkReamO0GPJrD6m_d5zY9UI",
    authDomain: "gympal-8419a.firebaseapp.com",
    projectId: "gympal-8419a",
    storageBucket: "gympal-8419a.firebasestorage.app",
    messagingSenderId: "193277208966",
    appId: "1:193277208966:web:c5ff40b20d0dd283ce2407",
    measurementId: "G-MEW3WG1HGT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function writeExercises() {

    var exercisesRef = db.collection("exercises");

    exercisesRef.add({
        name: "Chest Press",
        Image: "https://www.verywellfit.com/thmb/7jC7lJw0v3x4VQ6z7uTmZ3X4zX8=/1500x1000/filters:fill(FFDB5D,1)/chest-press-2500-56a6b4c83df78cf7728fbf9e.jpg",
    })

    var exercisesRef = db.collection("exercises");
    exercisesRef.add({
        name: "Squats",
        Image: "https://www.verywellfit.com/thmb/3n6eYv7J6e5m3zFZv5K6Q6zB1Kw=/1500x1000/filters:fill(FFDB5D,1)/squats-2500-56a6b4c83df78cf7728fbf9d.jpg",
    })

    var exercisesRef = db.collection("exercises");
    exercisesRef.add({
        name: "Deadlifts",
        Image: "https://www.verywellfit.com/thmb/0q3m3Q6ZB7Z8w6Dy9qyZ8d7Z8Z4=/1500x1000/filters:fill(FFDB5D,1)/deadlift-2500-56a6b4c83df78cf7728fbf9c.jpg",
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
    .then((thisExercise) => {
        var exercisesName = thisExercises.data().name;
        document.getElementById("exercisesName").innerHTML = exercisesName;
    })
}

function populateSession() {
    console.log("Populating session...");
    let exercisesCardTemplate = document.getElementById("exercisesCardTemplate");
    let exercisesCardGroup = document.getElementById("exercisesCardGroup");

    let params = new URL(window.location.href);
    let exercisesID = params.searchParams.get("docID");

    db.collection("exercises")
      .where("exerciseID", "==", exerciseID)
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

            exerciseCardGroup.appendChild(exerciseCard);
         })
    })
}

populateSession();

getExerciseName(exerciseDocID);

displayExercisesInfo();


