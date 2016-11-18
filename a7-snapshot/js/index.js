// DEFINITIONS /////////////////////////////////////////////////////////////////

// displays workouts ordered by date (and time) with most recent at the top
function displayWorkouts(workouts) {
    // select element with 'workout-list' class. Returns htmlcollection array and we select [0] because there should only be one
    var workoutList = document.getElementsByClassName('workout-list')[0];

    // array to hold workouts, ordered by date
    var workoutsByDate = [];

    // iterate through each workout to create array of workouts with date values
    for(var workoutName in workouts) {
        // push an array of [dateValue,workoutName] into workoutsByDate for each
        // workout
        workoutsByDate.push([[workouts[workoutName][0].doneDate],[workoutName]]);
    }

    // sort the array
    workoutsByDate = workoutsByDate.sort(sortFunction);
    function sortFunction(a,b) {
        if(a[0] === b[0]) {
            return 0;
        } else return (a[0] > b[0]) ? -1 : 1;
    }

    // display workouts sorted by date
    for(var workoutIndex = 0; workoutIndex < workoutsByDate.length; workoutIndex++) {
        // create an anchor tag for each workout
        var workoutListItem = document.createElement('a');

        // add each anchor tag to workouts list
        workoutList.appendChild(workoutListItem);

        // add workout name
        workoutListItem.outerHTML = '<a href="workout.html#' + workoutsByDate[workoutIndex][1] + '"><li>'+ workoutsByDate[workoutIndex][1] +'</li></a>';
    }
}



// CODE THAT RUNS after local storage is ready /////////////////////////////////

function localStorageReady() {
    // display workouts
    if(logging === true) console.log('Displaying workouts...');
    displayWorkouts(workouts);
}