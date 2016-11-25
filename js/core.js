// DEFINITIONS /////////////////////////////////////////////////////////////////

// global logging bool for bug finding
var logging = true;
if(logging === true) console.log('Starting app...');

// global var to store workouts array
var workouts;


// check that local storage is accessible
function checkLocalStorage() {
    function test() {
        if(logging === true) console.log('Checking local storage...');
        var b = 'foo';
        try {
            localStorage.setItem(b,b);
            localStorage.removeItem(b);
            return true;
        } catch(e) {
            return false;
        }
    }

    if(test() === true) {
        if(logging === true) console.log('Local storage is accessible.');
        return true;
    } else {
        alert('Unable to access local storage. This may occur when using "Private Browsing" in Safari or a similar feature of your web browser. Try browsing normally instead.');
        if(logging === true) console.log('Unable to access local storage. This may occur when using "Private Browsing" in Safari or a similar feature of your web browser. Try browsing normally instead.');
        return false;
    }
}

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

// notification generator
// (text) to display, (secs) to display for, (transition) duration for opacity
function notify(text,secs,transition,onOff) {
    var notification = document.getElementsByClassName('u-notification')[0];
    // add (text)
    notification.innerHTML = text;
    notification.classList.remove('u-isAbsent');
    // doesn't transition properly without setTimeout. ??? see below
    // http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
    window.setTimeout(appearNotification);

    if(!onOff) {
        // wait for (secs) seconds (setTimeout expects milliseconds)
        window.setTimeout(disappearNotification,secs*1000);

        // remove the notification via display:none
        window.setTimeout(removeNotification,transition*1000 + secs*1000);
    }

    if(onOff === 'off') {
        // wait for (secs) seconds (setTimeout expects milliseconds)
        window.setTimeout(disappearNotification,secs*1000);

        // remove the notification via display:none
        window.setTimeout(removeNotification,transition*1000 + secs*1000);
    }

    function appearNotification() {
        notification.style.opacity = 1;
    }

    function disappearNotification() {
        notification.style.opacity = 0;
    }

    function removeNotification() {
        notification.classList.add('u-isAbsent');
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

// for debugging
// localStorage.clear();

// check that local storage is accessible
checkLocalStorage();

// Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-87818240-1', 'auto');
  ga('send', 'pageview');

// if no workouts in local storage, fetch defaults and add to local storage
// else read workouts from local storage
if(!localStorage.getItem("workouts")) {
    if(logging === true) console.log('Nothing found in local storage.');
    addDefaultWorkoutsToLocalStorage();
}
else {
   readFromLocalStorage(localStorageReady);
}
