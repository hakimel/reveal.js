var width = 960,
    height = 500;

var color = d3.scale.category20();

var radius = d3.scale.sqrt()
    .range([0, 6]);

var svg = d3.select(".markov")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 50; });

var graph = {
"nodes": [
    {"name": "Harvest", "size": 50},
    {"name": "Sense", "size": 50},
    {"name": "Receive", "size": 50},
    {"name": "Transmit", "size": 50}
  ],
  "links": [
    {"source": 0, "target": 0},
    {"source": 0, "target": 1},
    {"source": 1, "target": 2},
    {"source": 2, "target": 3},
    {"source": 0, "target": 3}
  ]
};

var drawGraph = function(graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .on("tick", tick)
      .start();
  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class","link");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .attr("r", function(d) { return radius(d.size); })
      .style("fill", function(d) { return "backgroundColor"; })
      .call(force.drag)

  node.append("text")
      .attr("dx", function(d){return -20})
      .text(function(d){return d.name})

  function tick() {
    link.attr("d", function(d) {
      var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y,
          dx = x2 - x1,
          dy = y2 - y1,
          dr = Math.sqrt(dx * dx + dy * dy),

          // Defaults for normal edge.
          drx = dr,
          dry = dr,
          xRotation = 0, // degrees
          largeArc = 0, // 1 or 0
          sweep = 1; // 1 or 0

          // Self edge.
          if ( x1 === x2 && y1 === y2 ) {
            // Fiddle with this angle to get loop oriented.
            xRotation = -45;

            // Needs to be 1.
            largeArc = 1;

            // Change sweep to change orientation of loop. 
            //sweep = 0;

            // Make drx and dry different to get an ellipse
            // instead of a circle.
            drx = 80;
            dry = 100;
            
            // For whatever reason the arc collapses to a point if the beginning
            // and ending points of the arc are the same, so kludge it.
            x2 = x2 + 10;
            y2 = y2 + 10;
          } 

     return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
    });

    node.attr("transform", transform);
  }
};

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

drawGraph(graph);
