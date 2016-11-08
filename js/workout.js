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

    // make edit button appear
    document.getElementsByClassName('button-edit')[0].classList.remove('u-isAbsent');

    // display exercises
    displayExercises(workouts[workoutName]);
}

function createNewWorkout() {
    if(logging === true) console.log('Creating new workout...');
    workoutName = 'New Workout Name';

    // initialize new workout as an array
    workouts[workoutName] = [];

    // add an exercise to initialize the new workout for display.
    // also runs editWorkout to start editing, saving inputted data first
    addExercise(true);

    consoleLogWorkoutObject();
}

function editWorkout() {
    if(logging === true) console.log('Editing workout...');
    editingWorkout = true;

    // display exercises with all input fields, including empty
    displayExercises(workouts[workoutName]);

    // make edit button disappear
    document.getElementsByClassName('button-edit')[0].classList.add('u-isAbsent');

    // make Add Exercise button appear
    document.getElementsByClassName('button-addExercise')[0].classList.remove('u-isAbsent');

    // make save button appear
    document.getElementsByClassName('button-save')[0].classList.remove('u-isAbsent');
}

function addExercise(newWorkout) {
    // blank exercise object
    var blankExercise = 
    {
        "name": "",
        "sets": "",
        "reps": "",
        "weight": "",
        "weightUnits": "",
        "distance": "",
        "distanceUnits": "",
        "time": "",
        "timeUnits": "",
        "rest": "",
        "restUnits": "",
        "form": "",
        "other": ""
    };

    // push blank exercise to workout array
    workouts[workoutName].push(blankExercise);

    // if adding exercise to existing workout, save user input so it isn't lost
    if(newWorkout !== true) {
        if(saveUserInput() === 'unsaved') return;
    }

    // start editing. refresh display with blank exercise.
    editWorkout();
}

function displayExercises(exercises) {
    // display workout name
    // display as placeholder if "New Workout Name"
    if(workoutName === 'New Workout Name') {
        document.getElementsByClassName('jumbo')[0].placeholder = workoutName;
    } else {
        document.getElementsByClassName('jumbo')[0].value = workoutName;
    }

    // select element with 'exercise-list' class. Returns htmlcollection array and we select [0] because there should only be one
    var exerciseList = document.getElementsByClassName('exercise-list')[0];
    // clear exerciseList of previous render. eg when editing/saving
    exerciseList.innerHTML = "";

   // run loop for each exercise in current workout 
    for(var eachExercise in exercises) {
        // create a li tag for each exercise
        var exerciseListItem = document.createElement('li');
        // add each li tag to exercise list section
        exerciseList.appendChild(exerciseListItem);
        // set class
        exerciseListItem.classList.add('exerciseListItem');

        // always display exercise name, even if no input
        exerciseListItem.innerHTML += '<input type="text" class="exercise-name" name="name" value="' + workouts[workoutName][eachExercise].name + '" placeholder="exercise name"><br>';

        if(workouts[workoutName][eachExercise].sets || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Sets: <input type="text" placeholder="sets" name="sets" value="' + workouts[workoutName][eachExercise].sets + '">';
        }

        if(workouts[workoutName][eachExercise].reps || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Reps: <input type="text" placeholder="reps" name="reps" value="' + workouts[workoutName][eachExercise].reps + '">';
        }

        if(workouts[workoutName][eachExercise].weight || editingWorkout === true) {
            exerciseListItem.innerHTML += '<br>Weight: <input type="text" placeholder="weight" name="weight" value="' + workouts[workoutName][eachExercise].weight + '">';
        }

        if(workouts[workoutName][eachExercise].weight || editingWorkout === true) {
            switch(workouts[workoutName][eachExercise].weightUnits) {
                case "n/a":
                exerciseListItem.innerHTML += '<select name="weightUnits"><option value="lbs">lbs</option><option value="kg">kg</option><option value="n/a" selected>n/a</option></select><br>';
                    break;
                case "kg":
                exerciseListItem.innerHTML += '<select name="weightUnits"><option value="lbs">lbs</option><option selected value="kg">kg</option><option value="n/a">n/a</option></select><br>';
                    break;
                default: // lbs
                exerciseListItem.innerHTML += '<select name="weightUnits"><option value="lbs" selected>lbs</option><option value="kg">kg</option><option value="n/a">n/a</option></select><br>';
                    break;
            }
        }

        if(workouts[workoutName][eachExercise].distance || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Distance: <input type="text" placeholder="distance" name="distance" value="' + workouts[workoutName][eachExercise].distance + '">';
        }

        if(workouts[workoutName][eachExercise].distance || editingWorkout === true) {
            switch(workouts[workoutName][eachExercise].distanceUnits) {
                case "mi":
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option selected value="mi">mi</option><option value="km">km</option><option value="yds">yds</option><option value="m">m</option><option value="laps">laps</option><option value="n/a">n/a</option></select><br>';
                    break;
                case "km":
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option value="mi">mi</option><option selected value="km">km</option><option value="yds">yds</option><option value="m">m</option><option value="laps">laps</option><option value="n/a">n/a</option></select><br>';
                    break;
                case "yds":
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option value="mi">mi</option><option value="km">km</option><option selected value="yds">yds</option><option value="m">m</option><option value="laps">laps</option><option value="n/a">n/a</option></select><br>';
                    break;
                case "m":
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option value="mi">mi</option><option value="km">km</option><option value="yds">yds</option><option selected value="m">m</option><option value="laps">laps</option><option value="n/a">n/a</option></select><br>';
                    break;
                case "laps":
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option value="mi">mi</option><option value="km">km</option><option value="yds">yds</option><option value="m">m</option><option selected value="laps">laps</option><option value="n/a">n/a</option></select><br>';
                    break;
                default: // n/a
                    exerciseListItem.innerHTML += '<select name="distanceUnits"><option value="mi">mi</option><option value="km">km</option><option value="yds">yds</option><option value="m">m</option><option value="laps">laps</option><option selected value="n/a">n/a</option></select>';
                    break;
            }
        }

        if(workouts[workoutName][eachExercise].time || editingWorkout === true) {
            exerciseListItem.innerHTML += '<br>Time: <input type="text" placeholder="time" name="time" value="' + workouts[workoutName][eachExercise].time + '">';
        }

        if(workouts[workoutName][eachExercise].time || editingWorkout === true) {
            switch(workouts[workoutName][eachExercise].timeUnits) {
                case "hr":
                    exerciseListItem.innerHTML += '<select name="timeUnits"><option value="sec">sec</option><option value="min">min</option><option selected value="hr">hr</option></select><br>';
                    break;
                case "min":
                    exerciseListItem.innerHTML += '<select name="timeUnits"><option value="sec">sec</option><option selected value="min">min</option><option value="hr">hr</option></select><br>';
                    break;
                default: // sec
                    exerciseListItem.innerHTML += '<select name="timeUnits"><option selected value="sec">sec</option><option value="min">min</option><option value="hr">hr</option></select><br>';
                    break;
            }
        }

        if(workouts[workoutName][eachExercise].rest || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Rest period: <input type="text" placeholder="rest period" name="rest" value="' + workouts[workoutName][eachExercise].rest + '">';
        }

        if(workouts[workoutName][eachExercise].rest || editingWorkout === true) {
            switch(workouts[workoutName][eachExercise].restUnits) {
                case "min":
                    exerciseListItem.innerHTML += '<select name="restUnits"><option value="sec">sec</option><option value="min" selected>min</option></select><br>';
                    break;
                default: // sec
                    exerciseListItem.innerHTML += '<select name="restUnits"><option selected value="sec">sec</option><option value="min">min</option></select><br>';
                    break;
            }
        }

        /* feature to be implemented later
        if(workouts[workoutName][eachExercise].form || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Form: <input type="text" placeholder="pick proper form" name="form" value="' + workouts[workoutName][eachExercise].form + '"><br>';
        }
        */

        if(workouts[workoutName][eachExercise].other || editingWorkout === true) {
            exerciseListItem.innerHTML += 'Other: <input type="text" placeholder="other notes" name="other" value="' + workouts[workoutName][eachExercise].other + '">';
        }
    }
}


function saveUserInput() {

    if(logging === true) console.log('Saving workout...');

    // check if a workout name was entered. set workoutName if yes
    if(document.getElementsByClassName('jumbo')[0].value) {
        // save old workout name for comparison
        oldWorkoutName = workoutName;
        // set workoutName to new value inputted
        workoutName = document.getElementsByClassName('jumbo')[0].value;
    } else {
        // alert if no input and return from function
        alert('Please enter a name for this workout.');
        return 'unsaved';
    }

    // make save button disappear (only after we've checked for a workout name)
    document.getElementsByClassName('button-save')[0].classList.add('u-isAbsent');

    // make add Exercise button disappear (only after we've checked for a workout name)
    document.getElementsByClassName('button-addExercise')[0].classList.add('u-isAbsent');

    // if the workout name is being changed, create new array to hold workout
    // and delete old array
    if(workoutName != oldWorkoutName) {
        // check if another workout exists with this workout name.
        // if yes, add integer to end of name.
        if(workouts[workoutName]) {
            // iterator to be appended to existing workout name
            var workoutNameI = 2;
            // to hold the name part of the workout name
            var theNamePart = workoutName;
            while(workouts[workoutName]) {
                workoutName = theNamePart + ' ' + workoutNameI.toString();
                workoutNameI++;
            }
        }
        workouts[workoutName] = [{}];
        delete workouts[oldWorkoutName];
    }

    console.log('Workout name: ' + workoutName);
    consoleLogWorkoutObject();

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
        /* feature to be implemented later
        workouts[workoutName][eachExercise].form = document.getElementsByName("form")[eachExercise].value;
        */
        workouts[workoutName][eachExercise].other = document.getElementsByName("other")[eachExercise].value;
    }

    // make a fancier save notification later
    localStorage.setItem("workouts", JSON.stringify(workouts));

    consoleLogWorkoutObject();
}



// CODE THAT RUNS after local storage is ready /////////////////////////////////

function localStorageReady() {
    // set up event listeners for buttons. they can't be clicked until they are made to appear at the proper time.
        // add event listener for Save button. run saveUserInput when clicked
        document.getElementsByClassName('button-save')[0].addEventListener('click', saveUserInput, false);
        // add event listener for Edit button. run editWorkout when clicked
        document.getElementsByClassName('button-edit')[0].addEventListener('click', editWorkout, false);
        // add event listener for Add Exercise (displayed as a plus) button. run addExercise when clicked
        document.getElementsByClassName('button-addExercise')[0].addEventListener('click', addExercise, false);

    // url hash tells us what to do
    if(window.location.hash) {
        // if url fragment exists
        viewSavedWorkout();
    } else {
        createNewWorkout();
    }

    // log to console what workout this is (or new workout)
    if(logging === true) console.log('Workout: ' + workoutName);
}
