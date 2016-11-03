// inserts style rule at end of first style tag
// This is necessary to modify a pseudo element css rule because pseudo elements do not exist in the DOM.

// example
// insertStyleRule('body {background-color:#444444}');

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