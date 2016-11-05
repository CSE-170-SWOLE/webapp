// DEFINITIONS /////////////////////////////////////////////////////////////////

// global var for workout name
var workoutName = '';

// global bool for editing or not editing workout
var editingWorkout = false;

// replace the text of all elements with class inClass with text newText
function replaceTextOfClass(inClass, newText) {
    // get array of all classes with given name
    var allInstancesOfClass = document.getElementsByClassName(inClass);

    // loop through array of classes
    for (var i = 0, j = allInstancesOfClass.length; i < j; i++) {
        allInstancesOfClass[i].textContent = newText;
    }
}

function viewSavedWorkout() {
    if(logging === true) console.log('Viewing saved workout...');
    // set workoutName equal to hash value
    workoutName = window.location.hash.substring(1);

    // add event listener for Edit button. run editWorkout when clicked
    document.getElementsByClassName('button-edit')[0].addEventListener('click', editWorkout, false);

    // display exercises
    displayExercises(workouts[workoutName]);
}

function createNewWorkout() {
    workoutName = 'New Workout Name';

    // initialize new workout as an array
    workouts[workoutName] = [];

    // add an exercise to initialize the new workout
    addExercise();

    // display exercises
    displayExercises(workouts[workoutName]);

    consoleLogWorkoutObject();

    // start editing workout
    editWorkout();
}

function editWorkout() {
    if(logging === true) console.log('Editing workout...');
    editingWorkout = true;

    // add event listener for Save button. run saveUserInput when clicked
    document.getElementsByClassName('button-save')[0].addEventListener('click', saveUserInput, false);

    // add event listener for Add Exercise (displayed as a plus) button. run addExercise when clicked
    // BUTTON DOESN'T EXIST YET
    // document.getElementsByClassName('button-addExercise')[0].addEventListener('click', addExercise, false);
    
}

function addExercise() {
    // blank exercise object
    var blankExercise = 
    {
        "name": " ",
        "sets": " ",
        "reps": " ",
        "weight": " ",
        "weightUnits": " ",
        "distance": " ",
        "distanceUnits": " ",
        "time": " ",
        "timeUnits": " ",
        "rest": " ",
        "restUnits": " ",
        "form": " ",
        "other": " "
    };

    // push blank exercise to workout array
    workouts[workoutName].push(blankExercise);
}

function displayExercises(exercises) {
    // save workoutName input
    document.getElementsByClassName('jumbo')[0].value = workoutName;

    // select element with 'exercise-list' class. Returns htmlcollection array and we select [0] because there should only be one
    var exerciseList = document.getElementsByClassName('exercise-list')[0];
    for(var eachExercise in exercises) {
        // create a li tag for each workout
        var exerciseListItem = document.createElement('li');
        // add each li tag to exercise list section
        exerciseList.appendChild(exerciseListItem);
        // set class
        exerciseListItem.className += ' exerciseListItem';

        // compile exercise from data
        for(eachExerciseProperty in exercises[eachExercise]) {
            if( exercises[eachExercise][eachExerciseProperty] != " ") {

                // create a p tag for each workout
                var exerciseProperty = document.createElement('p');

                // add each p tag to exerciseli
                exerciseListItem.appendChild(exerciseProperty);

                // add exercise value
                exerciseProperty.outerHTML = '<p>' +  eachExerciseProperty + ": " + exercises[eachExercise][eachExerciseProperty] + '</p>';
            }
        }

        // <input type="text" name="fname"><br>


    }
}


function saveUserInput() {
    // get the workout name
    workoutName = document.getElementsByClassName('jumbo')[0].value;

    // get array of all exercise <li>'s
    allExerciseListItems = document.getElementsByClassName('exerciseListItem');
    // get number of exercises
    numExercises = allExerciseListItems.length;

    // iterate over exercises
    for(var eachExercise = 0; eachExercise < numExercises; eachExercise++) {
        // set the info
        workouts[workoutName][eachExercise].name = document.getElementsByName("name")[eachExercise].value;
        workouts[workoutName][eachExercise].sets = document.getElementsByName("sets")[eachExercise].value;
        workouts[workoutName][eachExercise].reps = document.getElementsByName("reps")[eachExercise].value;
        workouts[workoutName][eachExercise].weight = document.getElementsByName("weight")[eachExercise].value;
        workouts[workoutName][eachExercise].weightUnits = document.getElementsByName("weightUnits")[eachExercise].value;
        workouts[workoutName][eachExercise].distance = document.getElementsByName("distance")[eachExercise].value;
        workouts[workoutName][eachExercise].distanceUnits = document.getElementsByName("distanceUnits")[eachExercise].value;
        workouts[workoutName][eachExercise].time = document.getElementsByName("time")[eachExercise].value;
        workouts[workoutName][eachExercise].timeUnits = document.getElementsByName("timeUnits")[eachExercise].value;
        workouts[workoutName][eachExercise].rest = document.getElementsByName("rest")[eachExercise].value;
        workouts[workoutName][eachExercise].restUnits = document.getElementsByName("restUnits")[eachExercise].value;
        workouts[workoutName][eachExercise].form = document.getElementsByName("form")[eachExercise].value;
        workouts[workoutName][eachExercise].other = document.getElementsByName("other")[eachExercise].value;
    }

    localStorage.setItem("workouts", JSON.stringify(workouts));
    // make a fancier save notification later
    alert('Workout has been saved.');
    consoleLogWorkoutObject();
}



// CODE THAT RUNS after local storage is ready /////////////////////////////////

function localStorageReady() {
    // url hash tells us what to do
    if(window.location.hash) {
        // if url fragment exists
        viewSavedWorkout();
    } else {
        createNewWorkout();
    }

    // log to console what workout this is (or new workout)
    if(logging === true) console.log('Workout: ' + workoutName);

    // change header to workout name/new workout name
    document.getElementsByClassName('jumbo')[0].value = workoutName;
}
