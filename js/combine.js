/// <reference path="render.ts" />
/// <reference path="dfa.ts" />
/// <reference path="intersection.ts" />
/// <reference path="union.ts" />
var combine = function () {
    var combination_string = document.getElementById("combination-selector").value;
    var combination_number = +combination_string;
    var dfasLoaded = dfaArray.length;
    if (dfasLoaded == 0) {
        alert("No DFA loaded");
    }
    else if (dfasLoaded == 1) {
        alert("Insuffecient number of DFA's loaded");
    }
    else {
        var combinedDFA = basicCombination();
        switch (combination_number) {
            case 1: //UNION
                union(combinedDFA);
                console.log(combinedDFA);
                renderCy(combinedDFA, "cy3");
                break;
            case 2: //INTERSECTION
                //intersection(combinedDFA);
                break;
        }
    }
};
//Controller function for creating a combined dfa (right now it just creates the portions union and intersection share in common)
var basicCombination = function () {
    var initials = mergeInitial();
    var states = mergeStates();
    var transitions = mergeTransitions();
    var alphabet = mergeAlphabet();
    var dfa = {
        states: states,
        transitions: transitions,
        initial: initials,
        accepting: new Set(),
        alphabet: alphabet
    };
    return dfa;
};
//Only merges states with a single starting point (this is all messy because it wasn't working for some dumb reason -- figure this out later)
var mergeInitial = function () {
    var firstInitial = dfaArray[0].initial.values();
    var secondInitial = dfaArray[1].initial.values();
    var initialString = (firstInitial.next().value.concat(secondInitial.next().value));
    var initialSet = new Set();
    initialSet.add(initialString);
    return initialSet;
};
//Only merges the states in two dfa
var mergeStates = function () {
    var states = new Set();
    dfaArray[0].states.forEach(function (state1) {
        dfaArray[1].states.forEach(function (state2) {
            states.add(state1 + state2);
        });
    });
    return states;
};
//merges the transitions of two dfa
var mergeTransitions = function () {
    var edges = new Set();
    dfaArray[0].transitions.forEach(function (edge1) {
        dfaArray[1].transitions.forEach(function (edge2) {
            if (edge1.id == edge2.id) {
                edges.add({
                    id: edge1.id,
                    source: (edge1.source + edge2.source),
                    target: (edge1.target + edge2.target)
                });
            }
        });
    });
    return edges;
};
//TODO
var mergeAlphabet = function () {
    var alphabet = new Set();
    dfaArray[0].alphabet.forEach(function (symbol) {
        alphabet.add(symbol);
    });
    dfaArray[1].alphabet.forEach(function (symbol) {
        if (!alphabet.has(symbol)) {
            alphabet.add(symbol);
        }
    });
    return alphabet;
};
