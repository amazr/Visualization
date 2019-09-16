let cy;

let renderGraph = function() {
  let container_id = "cy" + document.getElementById("render-window-selector").value;
  renderCy(dfaObject, container_id);
}

let renderCy = function(dfaObject, container_id) {
  cy = cytoscape({
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

}

let createNodes = function(dfaObject) {

  let nodes = [];
  //work on adding a class for setting the finals class
  for (let i = 0; i < dfaObject.states.length; i++) {
    let node = JSON.stringify(dfaObject.states[i]).replace(/\\./g, '').replace(/\"/g, '');
    if (node == JSON.stringify(dfaObject.start).replace(/\\./g, '').replace(/\"/g, '')) {
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
    let edgeID = JSON.stringify(dfaObject.edges[i].id).replace(/\\./g, '').replace(/\"/g, '');
    let edgeSource = JSON.stringify(dfaObject.edges[i].source).replace(/\\./g, '').replace(/\"/g, '');
    let edgeTarget = JSON.stringify(dfaObject.edges[i].target).replace(/\\./g, '').replace(/\"/g, '');

    edges.push({
      data: {id: (edgeID + edgeSource + edgeTarget), source: edgeSource, target: edgeTarget, name: edgeID}
    });
  }
  
  return edges;
}
