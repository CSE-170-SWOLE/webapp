// example
// asyncGet('timeframe.json', true, useAsyncData, errorCallback);
// url of resource to request, json bool, function to call with asyncData
// json bool should be true if resource is json, else false and you'll get text
// callback function gets passed a json object if json===true, else text
// error callback gets passed the url that failed to load

// callback example
// function useAsyncData(data) {
//	   console.log(data);
// }

// error callback example
// function requestFailure(url) {
//     alert('Failed to load ' + url);
// }

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
				if (errcb && typeof(errcb) === "function") errcb(url);
			} else return; // return, browser will try again
		}
	}
}