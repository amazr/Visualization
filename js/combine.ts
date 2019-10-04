/// <reference path="render.ts" />
/// <reference path="dfa.ts" />
/// <reference path="intersection.ts" />
/// <reference path="union.ts" />

let combine = function() {

    let combination_string:string = (<HTMLInputElement>document.getElementById("combination-selector")).value;
    let combination_number:number = +combination_string;

    let dfasLoaded:number = dfaArray.length;

    if (dfasLoaded == 0) {
        alert("No DFA loaded");
    }
    else if (dfasLoaded == 1) {
        alert("Insuffecient number of DFA's loaded");
    }
    else {
        let combinedDFA:Dfa = basicCombination();
        switch(combination_number) {
            case 1: //UNION
                union(combinedDFA);
                console.log(combinedDFA);
                renderCy(combinedDFA,"cy3");
                break;
            case 2: //INTERSECTION
                //intersection(combinedDFA);
                break;
        }
    }
}

//Controller function for creating a combined dfa (right now it just creates the portions union and intersection share in common)
let basicCombination = function():Dfa {
    let initials:Set<String> = mergeInitial();
    let states:Set<String> = mergeStates();
    let transitions:Set<Edge> = mergeTransitions();
    let alphabet:Set<String> = mergeAlphabet();

    const dfa: Dfa = {
        states: states,
        transitions: transitions,
        initial: initials,
        accepting: new Set<String>(),
        alphabet: alphabet
    };
    return dfa;
}

//Only merges states with a single starting point (this is all messy because it wasn't working for some dumb reason -- figure this out later)
let mergeInitial = function():Set<String> {
    let firstInitial = dfaArray[0].initial.values();
    let secondInitial = dfaArray[1].initial.values();
    let initialString = (firstInitial.next().value.concat( secondInitial.next().value));
    let initialSet = new Set<String>();
    initialSet.add(initialString);
    return initialSet;
}

//Only merges the states in two dfa
let mergeStates = function():Set<String> {
    let states = new Set<String>();
    dfaArray[0].states.forEach(function(state1) {
        dfaArray[1].states.forEach(function(state2) {
            states.add(state1 + state2);
        });
    });
    return states;
}

//merges the transitions of two dfa
let mergeTransitions = function():Set<Edge> {
    let edges = new Set<Edge>();
    dfaArray[0].transitions.forEach(function(edge1) {
        dfaArray[1].transitions.forEach(function(edge2) {
            if (edge1.id == edge2.id) {
                edges.add({
                    id:edge1.id,
                    source: (edge1.source + edge2.source),
                    target: (edge1.target + edge2.target)
                });       
            }
        });
    });
    return edges;
}
//TODO
let mergeAlphabet = function():Set<String> {
    let alphabet = new Set<String>();

    dfaArray[0].alphabet.forEach(function(symbol) {
        alphabet.add(symbol);
    });

    dfaArray[1].alphabet.forEach(function(symbol) {
        if (!alphabet.has(symbol)) {
            alphabet.add(symbol);
        }
    });

    return alphabet;
}