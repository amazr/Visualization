/// <reference path="combine.ts" />
/// <reference path="render.ts" />
//This should only do stuff with accepting states
var union = function (combinedDFA) {
    combinedDFA.states.forEach(function (combinedState) {
        dfaArray[0].accepting.forEach(function (normalState) {
            if (combinedState.includes(normalState)) {
                combinedDFA.accepting.add(combinedState);
            }
        });
        dfaArray[1].accepting.forEach(function (normalState) {
            if (combinedState.includes(normalState) && !combinedDFA.accepting.has(combinedState)) {
                combinedDFA.accepting.add(combinedState);
            }
        });
    });
};
