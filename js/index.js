let toJson = function(res) { 
    return res.json(); 
};

let cy = cytoscape({
    container: document.getElementById('cy'),
    
    elements: {
        nodes: [
          {
            data: { id: 'a' }
          },
    
          {
            data: { id: 'b' }
          }
        ],
        edges: [
          {
            data: { id: 'ab', source: 'a', target: 'b' }
          }
        ]
    },

    layout: {
        name: 'grid',
        columns: 4
    },

    style: [
        {
            selector: 'node',
            style: {
                label: 'data(id)'
            }
        }
    ]
  });