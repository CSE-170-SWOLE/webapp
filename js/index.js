// DEFINITIONS /////////////////////////////////////////////////////////////////

function displayWorkouts(workouts) {
    // select element with 'workout-list' class. Returns htmlcollection array and we select [0] because there should only be one
    var workoutList = document.getElementsByClassName('workout-list')[0];

    // array to hold workouts, ordered by date/time
    var workoutsByDate = [];

    // iterate through each workout
    for(var workoutName in workouts) {
        workoutsByDate = workouts[workoutName][0].push;
        
        // {"meta": {"doneDate": ""}}

        /* 
        // create an anchor tag for each workout
        var workoutListItem = document.createElement('a');

        // add each anchor tag to key section
        workoutList.appendChild(workoutListItem);

        // add workout name
        workoutListItem.outerHTML = '<a href="workout.html#' + workoutName + '"><li>'+ workoutName +'</li></a>';
        */
    }

    // iterate through each workout
    for(var workoutName in workouts) {
        // create an anchor tag for each workout
        var workoutListItem = document.createElement('a');

        // add each anchor tag to key section
        workoutList.appendChild(workoutListItem);

        // add workout name
        workoutListItem.outerHTML = '<a href="workout.html#' + workoutName + '"><li>'+ workoutName +'</li></a>';
    }
}



// CODE THAT RUNS after local storage is ready /////////////////////////////////

function localStorageReady() {
    // display workouts
    if(logging === true) console.log('Displaying workouts...');
    displayWorkouts(workouts);
}