// DEFINITIONS /////////////////////////////////////////////////////////////////

// global logging bool for bug finding
var logging = true;
if(logging === true) console.log('Displaying workouts...');

// global var to store workouts array
var workouts;

function consoleLogWorkoutObject() {
    if(logging === true) console.log('\nWorkouts object: ');
    if(logging === true) console.log(workouts);
    if(logging === true) console.log('\n');
}

function asyncGet(url, json, cb, errcb) {
    // var to contain async data
    var asyncData;

    // xhr object accessible in entire function
    var xhr;

    // number of request attempts; call errcb after 20 unsuccessful attempts
    var attempts = 0;

    // make async request
    makeRequest(url);

    function makeRequest(url) {
        xhr = new XMLHttpRequest();
        // run prepdata when response received from server
        xhr.onreadystatechange = prepData;
        // send request
        xhr.open('GET', url, true);
        xhr.send();
    }

    function prepData() {
        // readyState 4 means xhr request successful and response received from server
        // http status 200 means server OK'd response (200: "OK")
        // note that status should be 0 when retrieving from filesystem (without HTTP server)
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (json === true) { // if json
                asyncData = JSON.parse(xhr.responseText);
            } else if (json === false) { // if text
                asyncData = xhr.responseText;
            } else console.log('asyncGet(json) argument was not a bool');
            // call a function that uses the data
            cb(asyncData);
        } else {
            attempts++;
            console.log('asyncGet(' + url + '): No response received yet (attempt ' + attempts + '), retrying...');
            // after 4 failed requests
            if (attempts >= 4) {
                console.log('asyncGet(' + url + '): failed to load resource after ' + attempts + ' attempts. Will now call errcb if given.');
                // call error cb with url
                if (errcb && typeof(errcb) === "function") errcb(url,attempts);
            } else return; // return, browser will try again
        }
    }
}

function requestFailure(url, attempts) {
    alert('Failed to load ' + url + ' after ' + attempts + ' attempts.');
}

function addDefaultWorkoutsToLocalStorage() {
    // fetch json file and run useData function
    if(logging === true) console.log('Fetching default workouts...');
    asyncGet('defaultWorkouts.json',true,useData,requestFailure);
    function useData(data) {
        // add default data to local storage
        if(logging === true) console.log('Adding default workouts to local storage...');
        localStorage.setItem("workouts", JSON.stringify(data));
        // read in the data
        readFromLocalStorage(localStorageReady);
    }
}

// get workouts from local storage
function readFromLocalStorage(cb) {
    if(logging === true) console.log('Reading local storage...');
    // add data to workouts object
    workouts = JSON.parse(localStorage.getItem("workouts"));
    consoleLogWorkoutObject();
    cb();
}



// CODE THAT RUNS //////////////////////////////////////////////////////////////

// if no workouts in local storage, fetch defaults and add to local storage
// else read workouts from local storage
if(!localStorage.getItem("workouts")) {
    if(logging === true) console.log('Nothing found in local storage.');
    addDefaultWorkoutsToLocalStorage();
}
else {
   readFromLocalStorage(localStorageReady);
}