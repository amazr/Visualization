let cytoArray = [];

let renderGraph = function() {
  let container_id = "cy" + document.getElementById("render-window-selector").value;
  renderCy(dfaObject, container_id);
}

let renderCy = function(dfaObject, container_id) {
  let cy = cytoscape({
    container: document.getElementById(container_id),
    elements: {
      nodes: createNodes(dfaObject),
      edges: createEdges(dfaObject)
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
      columns: 2
    });
  }

  //node inline style
  cy.style().selector('node').style({
    label: 'data(id)',
  }).update();

  cy.style().selector('node.start').style({
    shape: 'diamond',
    'background-color': 'red'
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
  if (cytoArray.length > 2) {
    cytoArray.shift();
  }
  else {
    cytoArray.push(cy);
  }
  
}

let createNodes = function(dfaObject) {

  let nodes = [];
  //work on adding a cyto-class for setting the finals class
  for (let i = 0; i < dfaObject.states.length; i++) {
    let node = formatData(dfaObject.states[i]);
    if (node == formatData(dfaObject.start)) {
      nodes.push({
        data: {id: node},
        classes: "start"
      });
    }
    else {
      nodes.push({
        data: {id: node}
      });
    }
  }

  return nodes;
}

let createEdges = function(dfaObject) {

  let edges = [];

  for (let i = 0; i < dfaObject.edges.length; i++) {
    let edgeID = formatData(dfaObject.edges[i].id);
    let edgeSource = formatData(dfaObject.edges[i].source);
    let edgeTarget = formatData(dfaObject.edges[i].target);

    edges.push({
      data: {id: (edgeID + edgeSource + edgeTarget), source: edgeSource, target: edgeTarget, name: edgeID}
    });
  }
  
  return edges;
}

//This function just properly formats the data passed from the object created by dfa.js
//For some reason it was coming in with some weird values. If you try and create the cytoscape graph
//with values directly from the object it fails in a really weird way... 
let formatData = function(to_format) {
  return JSON.stringify(to_format).replace(/\\./g, '').replace(/\"/g, '');
}