
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
Utils.drawGrid(50, 50, view.bounds, grid);
grid.position = view.center;

var radius = 100;
var minRadius = 50;
var maxRadius = 150;

var circle = new Path.Circle(new Point(0, 0), radius);
circle.strokeColor = 'white';
circle.strokeWidth = 2;

var radiusLine = new Path.Line(new Point(0,0), new Point(radius, 0));
radiusLine.strokeColor = 'red';

var centerPoint = new Path.Circle(new Point(0, 0), 6);
centerPoint.fillColor = 'white';

var radiusPoint = new Path.Circle(new Point(radius, 0), 6);
radiusPoint.fillColor = 'red';

var circleGroup = new Group([circle, radiusLine, centerPoint, radiusPoint]);

var text = new PointText(new Point(radius + 5, 3));
text.justification = 'left';
text.fontSize = '14pt';
text.fontFamily = 'monospace';
text.fillColor = 'red';
text.content = '100';

// Update circle size and rendering
function onMouseDrag(event) {
  var localPoint = event.point - radiusLine.firstSegment.point;
  var theta = Math.atan2(localPoint.y, localPoint.x);
  var radius = Math.min(Math.max(localPoint.length, minRadius), maxRadius);
  
  var linePoint = radiusLine.firstSegment.point + (new Point(Math.cos(theta), Math.sin(theta)) * radius);
  text.position = radiusLine.firstSegment.point + (new Point(Math.cos(theta), Math.sin(theta)) * (radius + 25));
  radiusLine.lastSegment.point = linePoint;
  radiusPoint.position = linePoint;
  
  circle.scale((radius - circle.strokeWidth / 2) / (circle.bounds.width / 2));
  text.content = Math.floor(radius);
}

// Animate
function onFrame(event) {
  
}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);
  grid.position = view.center;
	circleGroup.position = view.center + new Point(circle.strokeWidth * 2, 0);
  onMouseDrag({ point: radiusLine.lastSegment.point });
}

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing simple-circle.js");
  Utils.bindMouse(null, null, onMouseDrag, null);
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding simple-circle.js");
  Utils.unbindMouse();
}

// Initialize
view.onShow();
