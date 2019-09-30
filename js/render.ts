/// <reference path="fileUpload.ts" />
declare var cytoscape: any;

let dfaArray = [];

let renderGraph = function () {
  let container_id = "cy" + (<HTMLInputElement>document.getElementById("render-window-selector")).value;
  renderCy(dfaObject, container_id);
}

let renderCy = function (dfaObject, container_id) {

  let nodes = createNodes(dfaObject);
  let edges = createEdges(dfaObject, nodes);

  let cy = cytoscape({
    container: document.getElementById(container_id),
    elements: {
      nodes: nodes,
      edges: edges
    }
  });


  let layout;

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
    'visibility': 'hidden',
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

}

let createNodes = function (dfaObject) {

  let nodes = [{
    data: { id: "entryPoint" },
    classes: "entryPoint"
  }];

  let regular: boolean = true;

  dfaObject.states.forEach(function(state) {
    dfaObject.initial.forEach(function(initial) {
      if (state == initial) {
        regular = false;
        nodes.push({
          data: { id: state },
          classes: "start"
        });
      }
    });
    dfaObject.accepting.forEach(function(accepting) {
      if (state == accepting) {
        regular = false;
        nodes.push({
          data: { id: state },
          classes: "final"
        });
      }
    })
    if (regular) {
      nodes.push({
        data: { id: state },
        classes:"regular"
      });
    }
  });

  return nodes;
}

let createEdges = function (dfa, nodes) {

  let edges = [];

  dfaObject.transitions.forEach(function(edge) {
    edges.push({
      data: { id: (edge.id + edge.source + edge.target), source: edge.source, target: edge.target, name: edge.id }
    });

  });

  /*  TODO
  edges = createStartEdges(edges, nodes);*/

  return edges;
}

let createStartEdges = function (edges, nodes) {

  let startingNode = "";
  for (let key in nodes) {
    if (nodes[key].classes == "start") {
      startingNode = nodes[key].data.id;
    }
  }

  edges.push({
    data: { id: "start", source: "entryPoint", target: startingNode, name: "start" }
  });

  return edges;
}