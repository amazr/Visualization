/// <reference path="fileUpload.ts" />
var dfaArray = [];
var renderGraph = function () {
    var container_id = "cy" + document.getElementById("render-window-selector").value;
    renderCy(dfaObject, container_id);
};
var renderCy = function (dfaObject, container_id) {
    //This is just an exmaple of iterating through a set
    console.log(dfaObject);
    dfaObject.transitions.forEach(function (something) {
        console.log(something.id);
    });
    var nodes = createNodes(dfaObject);
    var edges = createEdges(dfaObject, nodes);
    var cy = cytoscape({
        container: document.getElementById(container_id),
        elements: {
            nodes: nodes,
            edges: edges
        }
    });
    var layout;
    if (cy.nodes().length > 4) {
        layout = cy.layout({
            name: 'circle'
        });
    }
    else {
        layout = cy.layout({
            name: 'grid',
            columns: 3
        });
    }
    //node inline style
    cy.style().selector('node').style({
        label: 'data(id)',
        'background-color': '#FEFEFE',
        'border-color': '#454545',
        'border-width': '2',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-weight': 'bold'
    }).update();
    cy.style().selector('node.entryPoint').style({
        'visibility': 'hidden'
    }).update();
    cy.style().selector('node.final').style({
        'background-color': '#FEFEFE',
        'border-color': '#454545',
        'border-width': '5',
        'border-style': 'double'
    }).update();
    //edge inline style
    cy.style().selector('edge').style({
        label: 'data(name)',
        "curve-style": 'bezier',
        "control-point-by-step-size": 40,
        "target-arrow-shape": 'triangle'
    }).update();
    layout.run();
    //This makes sure there are only two cytoscape objects to combine... for now
    if (dfaArray.length > 2) {
        dfaArray.shift();
    }
    else {
        dfaArray.push(dfaObject);
    }
};
var createNodes = function (dfaObject) {
    var nodes = [{
            data: { id: "entryPoint" },
            classes: "entryPoint"
        }];
    var regular = true;
    dfaObject.states.forEach(function (state) {
        dfaObject.initial.forEach(function (initial) {
            if (state == initial) {
                regular = false;
                nodes.push({
                    data: { id: state },
                    classes: "start"
                });
            }
        });
        dfaObject.accepting.forEach(function (accepting) {
            if (state == accepting) {
                regular = false;
                nodes.push({
                    data: { id: state },
                    classes: "final"
                });
            }
        });
        if (regular) {
            nodes.push({
                data: { id: state },
                classes: "regular"
            });
        }
    });
    /*
    for (let i = 0; i < dfaObject.states.length; i++) {
      let node = formatData(dfaObject.states[i]);
      if (node == formatData(dfaObject.start)) {
        nodes.push({
          data: { id: node },
          classes: "start"
        });
      }
      else if (formatData(dfaObject.finals).includes(node)) {
        nodes.push({
          data: { id: node },
          classes: "final"
        });
      }
      else {
        nodes.push({
          data: { id: node },
          classes:"regular"
        });
      }
    }
  */
    return nodes;
};
var createEdges = function (dfa, nodes) {
    var edges = [];
    dfaObject.transitions.forEach(function (edge) {
        edges.push({
            data: { id: (edge.id + edge.source + edge.target), source: edge.source, target: edge.target, name: edge.id }
        });
    });
    /*
      for (let i = 0; i < dfaObject.transitions.size; i++) {
        let edgeID = formatData(dfaObject.transitions[i].value.id);
        let edgeSource = formatData(dfaObject.transitions[i].value.source);
        let edgeTarget = formatData(dfaObject.transitions[i].value.target);
    
        edges.push({
          data: { id: (edgeID + edgeSource + edgeTarget), source: edgeSource, target: edgeTarget, name: edgeID }
        });
      }
    
      edges = createStartEdges(edges, nodes);*/
    return edges;
};
var createStartEdges = function (edges, nodes) {
    var startingNode = "";
    for (var key in nodes) {
        if (nodes[key].classes == "start") {
            startingNode = nodes[key].data.id;
        }
    }
    edges.push({
        data: { id: "start", source: "entryPoint", target: startingNode, name: "start" }
    });
    return edges;
};
//This function just properly formats the data passed from the object created by dfa.js
//For some reason it was coming in with some weird values. If you try and create the cytoscape graph
//with values directly from the object it fails in a really weird way... 
var formatData = function (to_format) {
    return JSON.stringify(to_format).replace(/\\./g, '').replace(/\"/g, '');
};
