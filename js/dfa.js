;
;
var dfaParser = function (fileString) {
    //Regex for finding keywords in the file
    var regex = /\b(\w*states\w*)\b/g;
    var statesLocation = fileString.search(regex);
    regex = /\b(\w*edges\w*)\b/g;
    var edgesLocation = fileString.search(regex);
    regex = /\b(\w*start\w*)\b/g;
    var startLocation = fileString.search(regex);
    regex = /\b(\w*final\w*)\b/g;
    var finalsLocation = fileString.search(regex);
    regex = /\b(\w*alphabet\w*)\b/g;
    var alphabetLocation = fileString.search(regex);
    //these functions will return a js interactable object/array/variable
    var states = regularParser(fileString.substring(statesLocation, edgesLocation));
    var edges = edgeParser(fileString.substring(edgesLocation, startLocation));
    var start = regularParser(fileString.substring(startLocation, finalsLocation));
    var finals = regularParser(fileString.substring(finalsLocation, alphabetLocation));
    var alphabet = regularParser(fileString.substring(alphabetLocation, fileString.length - 1));
    var dfa = {
        states: states,
        transitions: edges,
        initial: start,
        accepting: finals,
        alphabet: alphabet
    };
    //This clears the empty transition added by the map function, OR any transitions created with no id
    dfa.transitions.forEach(function (toDelete) {
        if (toDelete.id == "") {
            dfa.transitions["delete"](toDelete);
        }
    });
    return dfa;
};
var regularParser = function (stateString) {
    stateString = stringFormat(stateString);
    stateString = removeWhiteSpace(stateString);
    var equalEx = getEqualRegex();
    var tempString = stateString.substring(stateString.search(equalEx) + 1, stateString.length);
    var states = new Set(tempString.split(","));
    return states;
};
var edgeParser = function (edgeString) {
    edgeString = stringFormat(edgeString);
    edgeString = removeWhiteSpace(edgeString);
    var equalEx = getEqualRegex();
    edgeString = edgeString.substring(edgeString.search(equalEx) + 1, edgeString.length);
    return new Set(edgeString.split("input").map(function (e) { return ({
        id: e.substring(e.indexOf(':') + 1, e.indexOf(',')),
        source: e.substring(e.indexOf(':', e.indexOf(':') + 1) + 1, e.lastIndexOf(',')),
        target: e.substring(e.lastIndexOf(':') + 1)
    }); }));
};
var removeWhiteSpace = function (aString) {
    return aString.replace(/ /g, "");
};
var getEqualRegex = function () {
    var equalEx = new RegExp(/\=/);
    return equalEx;
};
var stringFormat = function (to_format) {
    return JSON.stringify(to_format).replace(/\\./g, '').replace(/\"/g, '');
};
