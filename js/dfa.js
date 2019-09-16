let dfaParser = function(fileString) {

    //Regex for finding keywords in the file
    let regex = /\b(\w*states\w*)\b/g;
    let statesLocation = fileString.search(regex);
    
    regex = /\b(\w*edges\w*)\b/g;
    let edgesLocation = fileString.search(regex);

    regex = /\b(\w*start\w*)\b/g;
    let startLocation = fileString.search(regex);

    regex = /\b(\w*final\w*)\b/g;
    let finalsLocation = fileString.search(regex);

    regex = /\b(\w*alphabet\w*)\b/g;
    let alphabetLocation = fileString.search(regex);

    //these functions will return a js interactable object/array/variable
    let states = regularParser(fileString.substring(statesLocation, edgesLocation));
    let edges = edgeParser(fileString.substring(edgesLocation, startLocation));
    let starts = regularParser(fileString.substring(startLocation, finalsLocation));
    let finals = regularParser(fileString.substring(finalsLocation, alphabetLocation));
    let alphabet = regularParser(fileString.substring(alphabetLocation, fileString.length - 1));

    let dfaObject = {
        "states": states,
        "edges": edges,
        "start": starts[0],
        "finals": finals,
        "alphabet": alphabet
    };

    return dfaObject;
}

let regularParser = function (stateString) {
    let states = [];

    stateString = removeWhiteSpace(stateString);
    let equalEx = getEqualRegex();

    let tempString = stateString.substring(stateString.search(equalEx) + 1, stateString.length);
    states = tempString.split(",");

    return states;
}

let edgeParser = function(edgeString) {

    edgeString = removeWhiteSpace(edgeString);
    let equalEx = getEqualRegex();

    let tempEdgeString = edgeString.substring(edgeString.search(equalEx) + 1, edgeString.length);
    let edgeStringAr = tempEdgeString.split("\n");
    let edgeSigmaAr = [];
    let edgeSourceAr = [];
    let edgeTargetAr = [];
    let edgeObjectAr = [];

    for (let i = 0; i < edgeStringAr.length - 1; i++) {
        let aSingleEdge = edgeStringAr[i].split(",");

        let propertyAndValue = aSingleEdge[0].split(":");
        edgeSigmaAr.push(propertyAndValue[1]);

        propertyAndValue = aSingleEdge[1].split(":");
        edgeSourceAr.push(propertyAndValue[1]);

        propertyAndValue = aSingleEdge[2].split(":");
        edgeTargetAr.push(propertyAndValue[1]);
    }

    for (let i = 0; i < edgeStringAr.length - 1; i++) {
        let newObject = {
            id : edgeSigmaAr[i],
            source : edgeSourceAr[i],
            target : edgeTargetAr[i]
        };

        edgeObjectAr.push(newObject);
    }

    return(edgeObjectAr);
}

let removeWhiteSpace = function(aString) {
    return aString.replace(/ /g, "");
}

let getEqualRegex = function() {
    let equalEx = new RegExp(/\=/);
    return equalEx; 
}