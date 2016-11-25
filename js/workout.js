// DEFINITIONS /////////////////////////////////////////////////////////////////

// global var for workout name
var workoutName = '';

// global bool for editing or not editing workout
var editingWorkout = false;

function viewSavedWorkout() {
    if(logging === true) console.log('Viewing saved workout...');
    // set workoutName equal to hash value
    workoutName = window.location.hash.substring(1);

    // log to console what workout this is (or new workout)
    if(logging === true) console.log('Workout: ' + workoutName);

    // make edit button appear
    document.getElementsByClassName('button-edit')[0].classList.remove('u-isAbsent');

    // display exercises
    displayExercises(workouts[workoutName]);

    // make inputs uneditable
    setInputReadStatus(true);
}

function createNewWorkout() {
    if(logging === true) console.log('Creating new workout...');
    workoutName = 'New Workout Name';

    // initialize new workout as an array
    workouts[workoutName] = [{"doneDate": ""}];

    // add an exercise to initialize the new workout for display.
    // also runs editWorkout to start editing, saving inputted data first
    addExercise(true);

    consoleLogWorkoutObject();
}

function editWorkout() {
    if(logging === true) console.log('Editing workout...');
    editingWorkout = true;

    // EXP
    sessionStorage.setItem('startTime',new Date().startTime());

    // display exercises with all input fields, including empty
    displayExercises(workouts[workoutName]); 

    // make edit button disappear
    document.getElementsByClassName('button-edit')[0].classList.add('u-isAbsent');

    // make Add Exercise button appear
    document.getElementsByClassName('button-addExercise')[0].classList.remove('u-isAbsent');

    // make save button appear
    document.getElementsByClassName('button-save')[0].classList.remove('u-isAbsent');

    // make done date section disappear 
    document.querySelector(".doneDateSection").classList.add('u-isAbsent');

    // notify user that they're editing
    notify('Editing workout',3,1,"on");
}

function setInputReadStatus(readonly) {
    if(logging === true) console.log('Making inputs uneditable...');

    // get array of inputs
    var inputs = document.getElementsByTagName("input");
    var numInputs = inputs.length;
    // get array of selects
    var selects = document.getElementsByTagName("select");
    var numSelects = selects.length;

    for(var i = 0; i < numInputs; i++) {
        inputs[i].setAttribute("readonly","");
    }
    for(var i = 0; i < numSelects; i++) {
        selects[i].setAttribute("disabled","");
    }
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

    console.log('Added new exercise.');
    consoleLogWorkoutObject();

    // if adding exercise to existing workout, save user input so it isn't lost
    if(newWorkout !== true) {
        // stop if it didn't get saved
        if(saveUserInput() === 'unsaved') return;
    }

    // start editing. refresh display with blank exercise.
    editWorkout();
}

function displayDoneDate(newDateValue) {
    // add workout done date. if no date found, default value of 'never' remains
    // use parameter or pull from storage if exists
    if(newDateValue) {
        var doneDateValue = newDateValue;
    } else if(workouts[workoutName][0].doneDate !== 0) {
        var doneDateValue = workouts[workoutName][0].doneDate;
    }
    if(doneDateValue) {
        // pull date from workouts object
        doneDate = new Date(doneDateValue);

        // convert month number to string
        var doneDateMonth;
        switch(doneDate.getMonth()) {
            case 0: 
                doneDateMonth = 'Jan';
                break;
            case 1:
                doneDateMonth = 'Fed';
                break;
            case 2:
                doneDateMonth = 'Mar';
                break;
            case 3:
                doneDateMonth = 'Apr';
                break;
            case 4:
                doneDateMonth = 'May';
                break;
            case 5:
                doneDateMonth = 'Jun';
                break;
            case 6:
                doneDateMonth = 'Jul';
                break;
            case 7:
                doneDateMonth = 'Aug';
                break;
            case 8:
                doneDateMonth = 'Sep';
                break;
            case 9:
                doneDateMonth = 'Oct';
                break;
            case 10:
                doneDateMonth = 'Nov';
                break;
            case 11:
                doneDateMonth = 'Dec';
                break;
            default: 
                if(logging === true) console.log("Error: couldn't retrieve doneDateMonth, the month this workout was done.");
                break;
        }
        // print
        document.querySelector(".doneDate").innerHTML = 'You last did this workout: ' + doneDateMonth + ' ' + doneDate.getDate();
        // default to 'never'
    } else document.querySelector(".doneDate").innerHTML = 'You last did this workout: never';
    // make done date section visible 
    document.querySelector(".doneDateSection").classList.remove('u-isAbsent');
}

function doWorkout() {
    // creates a date from this moment
    var newDateValue = Date.now();
    // set doneDate value in current workout
    workouts[workoutName][0].doneDate = newDateValue;
    // display the new date
    displayDoneDate(newDateValue);

    // save date (and everything else) to local storage
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

function displayExercises(exercises) {
    // display workout name
    // display as placeholder if "New Workout Name"
    if(workoutName === 'New Workout Name') {
        document.getElementsByClassName('jumbo')[0].placeholder = workoutName;
    } else {
        document.getElementsByClassName('jumbo')[0].value = workoutName;
    }

    // display date workout was done, unless editing
    if(editingWorkout === false) displayDoneDate();

    // select element with 'exercise-list' class. Returns htmlcollection array and we select [0] because there should only be one
    var exerciseList = document.getElementsByClassName('exercise-list')[0];
    // clear exerciseList of previous render. eg when editing/saving
    exerciseList.innerHTML = "";

    // exerciseIndex: this is for the remove exercise button
    // This var is to keep track of the exercise indices, to use when deleting 
    // an exercise from the workout. We can't pass the exercise object itself to
    // the removeExerciseButton closure, because it will make a copy of the
    // object instead of referencing it. But we need the closure so that the 
    // event listeners don't all reference the same value for exerciseIndex and 
    // exerciseListItem.
    var exerciseIndex = 1;

    // run for loop for each exercise in current workout
    for(var eachExercise = 1; eachExercise < exercises.length; eachExercise++) {
        // create a li tag for each exercise
        var exerciseListItem = document.createElement('li');
        // add each li tag to exercise list section
        exerciseList.appendChild(exerciseListItem);
        // set class
        exerciseListItem.classList.add('exerciseListItem');

        // always display exercise name, even if no input
        exerciseListItem.innerHTML += '<input type="text" class="exercise-name" name="name" value="' + workouts[workoutName][eachExercise].name + '" placeholder="exercise name">';

        if(workouts[workoutName][eachExercise].sets || editingWorkout === true) {
            exerciseListItem.innerHTML += '<label for="sets">Sets: <input type="text" name="sets" value="' + workouts[workoutName][eachExercise].sets + '"></label>';
        }

        if(workouts[workoutName][eachExercise].reps || editingWorkout === true) {
            exerciseListItem.innerHTML += '<label for="reps">Reps: <input type="text" name="reps" value="' + workouts[workoutName][eachExercise].reps + '"></label>';
        }

        if(workouts[workoutName][eachExercise].weight || editingWorkout === true) {
            // add the html for the dropdown
            exerciseListItem.innerHTML += '<label class="exerciseListItemUnitRow" for="weight"><input type="text" name="weight" value="' + workouts[workoutName][eachExercise].weight + '"><select name="weightUnits"><option value="lbs">lbs</option><option value="kg">kg</option><option value=" " selected> </option></select></label>';

            // find out what the units are and set that <option> to be selected
            // lbs is selected by default
            if(workouts[workoutName][eachExercise].weightUnits) {
                exerciseListItem.querySelector('select[name="weightUnits"] option[value="' + workouts[workoutName][eachExercise].weightUnits + '"]').setAttribute("selected","");
            } else {
                exerciseListItem.querySelector('select[name="weightUnits"] option[value="lbs"]').setAttribute("selected","");
            }
        }

        if(workouts[workoutName][eachExercise].distance || editingWorkout === true) {

            // add the html for the dropdown
            exerciseListItem.innerHTML += '<label class="exerciseListItemUnitRow" for="distance"><input type="text" name="distance" value="' + workouts[workoutName][eachExercise].distance + '"><select name="distanceUnits"><option value="mi">mi</option><option value="km">km</option><option value="yds">yds</option><option value="m">m</option><option value="laps">laps</option><option value=" "> </option></select></label>';

            // find out what the units are and set that <option> to be selected
            // miles is selected by default
            if(workouts[workoutName][eachExercise].distanceUnits) {
                exerciseListItem.querySelector('select[name="distanceUnits"] option[value="' + workouts[workoutName][eachExercise].distanceUnits + '"]').setAttribute("selected","");
            } else {
                exerciseListItem.querySelector('select[name="distanceUnits"] option[value="mi"]').setAttribute("selected","");
            }
        }

        if(workouts[workoutName][eachExercise].time || editingWorkout === true) {
            
            // add the html for the dropdown
            exerciseListItem.innerHTML += '<label class="exerciseListItemUnitRow" for="time"><input type="text" name="time" value="' + workouts[workoutName][eachExercise].time + '"><select name="timeUnits"><option value="sec">sec</option><option value="min">min</option><option value="hr">hr</option></select></label>';

            // find out what the units are and set that <option> to be selected
            // secs is selected by default
            if(workouts[workoutName][eachExercise].timeUnits) {
                exerciseListItem.querySelector('select[name="timeUnits"] option[value="' + workouts[workoutName][eachExercise].timeUnits + '"]').setAttribute("selected","");
            } else {
                exerciseListItem.querySelector('select[name="timeUnits"] option[value="sec"]').setAttribute("selected","");
            }
        }

        if(workouts[workoutName][eachExercise].rest || editingWorkout === true) {
            
            // add the html for the dropdown
            exerciseListItem.innerHTML += '<label class="exerciseListItemUnitRow" for="rest"><input type="text" name="rest" value="' + workouts[workoutName][eachExercise].rest + '"><select name="restUnits"><option value="sec">sec</option><option value="min" selected>min</option></select></label>';

            // find out what the units are and set that <option> to be selected
            // secs is selected by default
            if(workouts[workoutName][eachExercise].restUnits) {
                exerciseListItem.querySelector('select[name="restUnits"] option[value="' + workouts[workoutName][eachExercise].restUnits + '"]').setAttribute("selected","");
            } else {
                exerciseListItem.querySelector('select[name="restUnits"] option[value="sec"]').setAttribute("selected","");
            }
        }

        /* feature to be implemented later
        if(workouts[workoutName][eachExercise].form || editingWorkout === true) {
            exerciseListItem.innerHTML += '<label>Form: <input type="text" placeholder="pick proper form" name="form" value="' + workouts[workoutName][eachExercise].form + '"></label>';
        }
        */

        if(workouts[workoutName][eachExercise].other || editingWorkout === true) {
            exerciseListItem.innerHTML += '<label for="other"><input type="text" name="other" value="' + workouts[workoutName][eachExercise].other + '"></label>';
        }


        // add a remove exercise button for each exercise
        if(editingWorkout === true) {

            // create anchor element
            removeExerciseButton = document.createElement('a');
            // set inner html
            removeExerciseButton.innerHTML = "<button class='u-textbutton button-removeExercise'>Remove</button>";
            // append to exercise
            exerciseListItem.appendChild(removeExerciseButton);

            // event listener runs closure, which gives different values for
            // exerciseIndex and exerciseListItem for each event listener (and 
            // exercise) in the loop.
            removeExerciseButton.addEventListener('click', (function(exerciseIndex,exerciseListItem){
                    // this function is returned to and executed by the listener
                    return function(event){
                        if(logging === true) console.log('Remove ' + workouts[workoutName][exerciseIndex].name + '?');

                        // confirm removing the exercise
                        if(confirm('Remove ' + workouts[workoutName][exerciseIndex].name +'?') === true) {
                            // remove the exercise <li> from the page
                            exerciseListItem.parentNode.removeChild(exerciseListItem);

                            // we have to say it's removed before we actually
                            // remove it because then we won't know what the
                            // name is lol
                            if(logging === true) console.log(workouts[workoutName][exerciseIndex].name + ' removed.');

                            // splice (remove) the exercise from workout array
                            // just deleting it will set it to null
                            workouts[workoutName].splice(exerciseIndex,1);

                            consoleLogWorkoutObject();
                        }
                        // event.preventDefault();
                    };
                    // these are the closure's parameters
                })(exerciseIndex,exerciseListItem), 'false' );

            // increment exercise index
            exerciseIndex++;
        }
    }

    // remove dropdowns if their value is blank and we're not editing
    if(editingWorkout === false) {
            // get array of dropdowns with blank option selected
            var dropdowns = exerciseList.querySelectorAll('option[value=" "][selected=""]');
            console.log(dropdowns);

            // loop through dropdowns
            for(var b = 0; b < dropdowns.length; b++) {
                // make them all disappear
                dropdowns[b].parentNode.classList.add('u-isAbsent');

                // make the label take up the rest of the space and fix margin
                dropdowns[b].parentNode.parentNode.querySelector('input').style.width = 'calc(100% - 5.5rem)';
                dropdowns[b].parentNode.parentNode.querySelector('input').style.marginLeft = '5.5rem';
            }
    }
}

function saveUserInput() {

    if(logging === true) console.log('Saving workout...');

    // check if a workout name was entered. set workoutName if yes
    if(document.getElementsByClassName('jumbo')[0].value) {
        // save old workout name for comparison
        var oldWorkoutName = workoutName;
        // set workoutName to new value inputted
        workoutName = document.getElementsByClassName('jumbo')[0].value;
    } else {
        // alert if no input and return from function
        alert('Please enter a name for this workout.');
        return 'unsaved';
    }

    // remove editing notification
    notify('Editing workout',3,1,"off");

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
        // set up workout object
        workouts[workoutName] = [{"doneDate": ""},{}];

        // set url hash to workoutName
        window.location.hash = workoutName;
        delete workouts[oldWorkoutName];
    }

    console.log('Workout name: ' + workoutName);
    consoleLogWorkoutObject();

    // get array of all exercise <li>'s
    allExerciseListItems = document.getElementsByClassName('exerciseListItem');
    // get number of exercises. subtract 1 for metadata (first element of array)
    var numExerciseListItems = allExerciseListItems.length;

    // iterate over exercises
    for(var exerciseListItemIndex = 0; exerciseListItemIndex < numExerciseListItems; exerciseListItemIndex++) {
        var exerciseIndex = exerciseListItemIndex + 1;
        // set the info
        workouts[workoutName][exerciseIndex].name = document.getElementsByName("name")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].sets = document.getElementsByName("sets")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].reps = document.getElementsByName("reps")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].weight = document.getElementsByName("weight")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].weightUnits = document.getElementsByName("weightUnits")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].distance = document.getElementsByName("distance")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].distanceUnits = document.getElementsByName("distanceUnits")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].time = document.getElementsByName("time")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].timeUnits = document.getElementsByName("timeUnits")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].rest = document.getElementsByName("rest")[exerciseListItemIndex].value;
        workouts[workoutName][exerciseIndex].restUnits = document.getElementsByName("restUnits")[exerciseListItemIndex].value;
        /* feature to be implemented later
        workouts[workoutName][exerciseIndex].form = document.getElementsByName("form")[exerciseListItemIndex].value;
        */
        workouts[workoutName][exerciseIndex].other = document.getElementsByName("other")[exerciseListItemIndex].value;
    }

    // save to local storage
    localStorage.setItem("workouts", JSON.stringify(workouts));

    // notify user that they've saved
    notify('Workout saved',3,1);

    // reset editing bool
    editingWorkout = false;

    consoleLogWorkoutObject();

    // EXP
    sessionStorage.setItem('endTime',new Date().getTime());
    sendExpData();

    // display workout again
    viewSavedWorkout(workouts[workoutName]);
}

/*
function timerStuff (command, time, units) {
    if (command == "pause"){
		//make boolean to stop timer	
    }
    else if (command == "start"){
		
    }
    else if (command == "reset"){
		
    }
}
*/

// EXP
function expSetup() {
    if(logging === true) console.log('Setting up experiment...');

    // clear old timing data, if any
    if(sessionStorage.getItem('startTime')) sessionStorage.removeItem('startTime');
    if(sessionStorage.getItem('endTime')) sessionStorage.removeItem('endTime');

    // generate random integer 0 or 1, then add to session storage
    if(!sessionStorage.getItem('whichTestCase')) {
        var whichTestCase = Math.floor(Math.random() * 2);
        sessionStorage.setItem('whichTestCase', whichTestCase);
    }
    
    // get whichTestCase from session storage
    var whichTestCase = sessionStorage.getItem('whichTestCase');
    if(logging === true) console.log('Experiment test case: ' + whichTestCase);
    if(whichTestCase == 0) { // show new and improved version
        return; // do nothing; the default is new and improved
    } else if(whichTestCase == 1) { // show old and crappy version
        // add a style tag to the end of <head> for the following css we'll add
        var testStyleTag = document.createElement('style');
        document.querySelector('head').appendChild(testStyleTag);

        // add some css for the old version
        function insertStyleRule(newRule) {
            // htmlcollection (array) of all style elements
            var styleTags = document.getElementsByTagName('style');

            // pick last style tag in array so that the new rule supersedes other rules
            var indexOfLast = styleTags.length - 1;

            // var style becomes an object with a bunch of css/dom info
            var style = styleTags[indexOfLast].sheet;

            // determines number of rules in stylesheet (cssRules is an array containing all of the style rules)
            // array is zero-indexed, so .length will return a value 1 greater than the index of last rule
            var numRules = style.cssRules.length;

            // new rule is inserted at index which is 1 greater than index of last rule
            style.insertRule(newRule, numRules);
        }
        insertStyleRule('.exercise-list input:not([readonly=""]):focus {background-color: #555555;}');
    }
}

// EXP
function sendExpData() {
    if(sessionStorage.getItem('startTime')&& sessionStorage.getItem('endTime')){
        // calc time elapsed
        var duration = endTime - startTime;
        // send to ga
        ga('send', {
          hitType: 'event',
          eventCategory: 'Workout editing',
          eventAction: 'editing duration',
          eventValue: duration
        });

    } else { // if we don't have a start AND end time, delete the single value  
        if(sessionStorage.getItem('startTime')) sessionStorage.removeItem('startTime');
        if(sessionStorage.getItem('endTime')) sessionStorage.removeItem('endTime');
    }
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

        // add event listener for do workout button. run doWorkout when clicked
        // this button is always visible
        document.getElementsByClassName('button-doWorkout')[0].addEventListener('click', doWorkout, false);

    // url hash tells us what to do
    if(window.location.hash) {
        // if url fragment exists
        viewSavedWorkout();
    } else {
        createNewWorkout();
    }


expSetup();
}
