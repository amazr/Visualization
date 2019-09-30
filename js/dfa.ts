
interface Edge {
    id: String;
    source: String;
    target: String;
};

interface Dfa {
    alphabet: Set<String>
    states: Set<String>;
    initial: Set<String>;
    accepting: Set<String>;
    transitions: Set<Edge>;
};

let dfaParser = function (fileString): Dfa {

    //Regex for finding keywords in the file
    let regex = /\b(\w*states\w*)\b/g;
    const statesLocation = fileString.search(regex);

    regex = /\b(\w*edges\w*)\b/g;
    const edgesLocation = fileString.search(regex);

    regex = /\b(\w*start\w*)\b/g;
    const startLocation = fileString.search(regex);

    regex = /\b(\w*final\w*)\b/g;
    const finalsLocation = fileString.search(regex);

    regex = /\b(\w*alphabet\w*)\b/g;
    const alphabetLocation = fileString.search(regex);

    //these functions will return a js interactable object/array/variable
    const states: Set<String> = regularParser(fileString.substring(statesLocation, edgesLocation));
    const edges: Set<Edge> = edgeParser(fileString.substring(edgesLocation, startLocation));
    const start: Set<String> = regularParser(fileString.substring(startLocation, finalsLocation));
    const finals: Set<String> = regularParser(fileString.substring(finalsLocation, alphabetLocation));
    const alphabet: Set<String> = regularParser(fileString.substring(alphabetLocation, fileString.length - 1));

    const dfa: Dfa = {
        states: states,
        transitions: edges,
        initial: start,
        accepting: finals,
        alphabet: alphabet
    };

    //This clears the empty transition added by the map function, OR any transitions created with no id
    dfa.transitions.forEach(function(toDelete) {
        if (toDelete.id == "") {
            dfa.transitions.delete(toDelete);
        }
    });

    return dfa;
};

const regularParser = function (stateString: String): Set<String> {

    //This line makes it so that we don't have to call the json formatting stuff later down the line.
    stateString = stringFormat(stateString);

    stateString = removeWhiteSpace(stateString);
    const equalEx = getEqualRegex();

    const tempString: String = stateString.substring(stateString.search(equalEx) + 1, stateString.length);
    const states: Set<String> = new Set(tempString.split(","));

    return states;
};

let edgeParser = function (edgeString: String): Set<Edge> {

    //This line makes it so that we don't have to call the json formatting stuff later down the line.
    edgeString = stringFormat(edgeString);

    edgeString = removeWhiteSpace(edgeString);
    let equalEx = getEqualRegex();

    edgeString = edgeString.substring(edgeString.search(equalEx) + 1, edgeString.length);
    
    return new Set(
        edgeString.split("input").map(
            e => <Edge>{
                id: e.substring(e.indexOf(':') + 1, e.indexOf(',')),
                source: e.substring(e.indexOf(':', e.indexOf(':') + 1) + 1, e.lastIndexOf(',')),
                target: e.substring(e.lastIndexOf(':') + 1)
            }
        )
    );
};

let removeWhiteSpace = function (aString: String): String {
    return aString.replace(/ /g, "");
};

let getEqualRegex = function (): RegExp {
    let equalEx = new RegExp(/\=/);
    return equalEx;
};

let stringFormat = function (to_format: String): String {
    return JSON.stringify(to_format).replace(/\\./g, '').replace(/\"/g, '');
};