let cy;

let renderGraph = function() {
  renderCy(dfaObject);
}

let renderCy = function(dfaObject) {

  cy = cytoscape({
    container: document.getElementById('cy'),
    elements: {
      nodes: createNodes(dfaObject)
      //edges: createEdges(dfaObject)
    }
  });

  let layout = cy.layout({
    name: 'grid',
    columns: 4
  });

  //node inline style
  cy.style().selector('node').style({
    label: 'data(id)'
  }).update();

  //edge inline style
  cy.style().selector('edge').style({
    label: 'data(id)',
    "curve-style": 'bezier',
    "control-point-by-step-size": 40,
    "target-arrow-shape": 'triangle'
  }).update();

  layout.run();

}

let createNodes = function(dfaObject) {

  let nodes = [];
  for (let i = 0; i < dfaObject.states.length; i++) {
    let node = dfaObject.states[i];
    nodes.push(node);
  }
  
  let elemNodes = [];
  for (let key in nodes) {
    elemNodes.push({
      data: {id: nodes[key]}
    });
  }

  return elemNodes;
}

let createEdges = function(dfaObject) {

  let edges = [];
  for (let i = 0; i < dfaObject.edges.length; i++) {
    let edge = dfaObject.edges[i];
    edges.push(edge);
  }

  let elemEdges = [];
  for (let key in edges) {
    elemEdges.push({
      data: {id: edges[key].id, source: edges[key].source, target: edges[key].target}
    });
  }

  return elemEdges;
}
