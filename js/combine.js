let combine = function() {

    let combination_type = document.getElementById("combination-selector").value;

    let states = [];
    let edges = [];
    let start;
    let finals = [];
    let alphabet = [];

    let combinedDFA = {
        "states": states,
        "edges": edges,
        "start": start,
        "finals": finals,
        "alphabet": alphabet
    };

    if (combination_type == 1) {
        union(combinedDFA);
    }
    else if (combination_type == 2) {
        intersection(combinedDFA);
    }

    renderCy(combinedDFA, "cy3");
}

let union = function(combinedDFA) {
    unionStart(combinedDFA);    //MUST COME BEFORE EDGES (probably poor design)
    combineStates(combinedDFA);
    combineEdges(combinedDFA);
    combineAlphabets(combinedDFA);
    unionFinals(combinedDFA);
}

let intersection = function(combinedDFA) {
    unionStart(combinedDFA);
    combineStates(combinedDFA);
    combineEdges(combinedDFA);
    combineAlphabets(combinedDFA);
    intersectionFinals(combinedDFA);
}

let unionFinals = function(combinedDFA) {
    for (let i = 0; i < combinedDFA.states.length; i++) {
        for (let j = 0; j < dfaArray[0].finals.length; j++) {
            if (combinedDFA.states[i].includes(formatData(dfaArray[0].finals[j]))) {
                if (!combinedDFA.finals.includes(combinedDFA.states[i])) {
                    combinedDFA.finals.push(combinedDFA.states[i])
                }
            }
        }
        for (let j = 0; j < dfaArray[1].finals.length; j++) {
            if (combinedDFA.states[i].includes(formatData(dfaArray[0].finals[j]))) {
                if (!combinedDFA.finals.includes(combinedDFA.states[i])) {
                    combinedDFA.finals.push(combinedDFA.states[i])
                }
            }
        }
    }
}

//If the final states from the two DFA intersect. If final states in m1 = {B}, m2 = {B}, then finals in mI = {BB}, not {AB, BA, BB} like union
let intersectionFinals = function(combinedDFA) {
    for (let i = 0; i < combinedDFA.states.length; i++) {
        for (let j = 0; j < dfaArray[0].finals.length; j++) {
            for (let k = 0; k < dfaArray[1].finals.length; k++) {
                let checkForSecond = combinedDFA.states[i].split(formatData(dfaArray[0].finals[j]));
                if (checkForSecond.includes(formatData(dfaArray[1].finals[k]))) {
                    combinedDFA.finals.push(combinedDFA.states[i]);
                }
            }
        }
    }
}

let combineAlphabets = function(combinedDFA) {
    for (let i = 0; i < dfaArray[0].alphabet.length; i++) {;
        combinedDFA.alphabet.push(dfaArray[0].alphabet[i]);
    }
    for (let i = 0; i < dfaArray[1].alphabet.length; i++) {
        if (!combinedDFA.alphabet.includes(dfaArray[1].alphabet[i])) {
            combinedDFA.alphabet.push(dfaArray[1].alphabet[i]);
        }
    }
}

let combineStates = function(combinedDFA) {
    for (let i = 0; i < dfaArray[0].states.length; i++) {
        for (let j = 0; j < dfaArray[1].states.length; j++) {
            combinedDFA.states.push(formatData(dfaArray[0].states[i]) + formatData(dfaArray[1].states[j]));
        }
    }
}

let unionStart = function(combinedDFA) {
    combinedDFA.start = formatData(dfaArray[0].start[0]) + formatData(dfaArray[1].start[0]);
}

let combineEdges = function(combinedDFA) {
    for (let i = 0; i < dfaArray[0].edges.length; i++) {
        for (let j = 0; j < dfaArray[1].edges.length; j++) {
            if (dfaArray[0].edges[i].id == dfaArray[1].edges[j].id) {
                let newEdge = {
                    id: dfaArray[0].edges[i].id,
                    source: formatData(dfaArray[0].edges[i].source) + formatData(dfaArray[1].edges[j].source),
                    target: formatData(dfaArray[0].edges[i].target) + formatData(dfaArray[1].edges[j].target)
                };
                combinedDFA.edges.push(newEdge);
            }
        }
    }

    let dontDeleteTheseStates = [combinedDFA.start];
    for (let i = 0; i < combinedDFA.states.length; i++) {
        for (let j = 0; j < combinedDFA.edges.length; j++) {
            if (combinedDFA.states[i] == combinedDFA.edges[j].target) {
                dontDeleteTheseStates.push(formatData(combinedDFA.edges[i].target));
            }
        }
    }

    for (let i = 0; i < combinedDFA.states.length; i++) {
        if (!dontDeleteTheseStates.includes(combinedDFA.states[i])) {
            combinedDFA.states.splice(i,1);
        }
    }

    for (let i = 0; i < combinedDFA.edges.length; i++) {
        if (!dontDeleteTheseStates.includes(combinedDFA.edges[i].source)) {
            combinedDFA.edges.splice(i,1);
        }
    }
}