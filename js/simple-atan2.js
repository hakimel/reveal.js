
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
Utils.drawGrid(50, 50, view.bounds, grid);
grid.position = view.center;

var radius = 200;
var minRadius = 50;
var maxRadius = 200;

var circle = new Path.Circle(new Point(0, 0), radius);
circle.strokeWidth = 2;
circle.strokeColor = 'white';

var radiusLine = new Path.Line(new Point(0,0), new Point(radius, 0));
radiusLine.strokeColor = 'red';

var centerPoint = new Path.Circle(new Point(0, 0), 6);
centerPoint.fillColor = 'white';

var radiusPoint = new Path.Circle(new Point(radius, 0), 6);
radiusPoint.fillColor = 'red';

var circleGroup = new Group([circle, radiusLine, centerPoint, radiusPoint]);

var degText = new PointText(new Point(0, 200));
degText.justification = 'center';
degText.fontSize = '14pt';
degText.fillColor = 'white';
degText.content = 'degrees: 0';

var radText = new PointText(new Point(0, 225));
radText.justification = 'center';
radText.fontSize = '14pt';
radText.fillColor = 'white';
radText.content = 'radians: 0';

var thetaText = new PointText(new Point(0, 250));
thetaText.justification = 'center';
thetaText.fontSize = '14pt';
thetaText.fillColor = 'white';
thetaText.content = 'theta: 0';

// Update circle size and rendering
function onMouseDrag(event) {
  var localPoint = event.point - radiusLine.firstSegment.point;
  var theta = Math.atan2(localPoint.y, localPoint.x);
  
  var linePoint = radiusLine.firstSegment.point + (new Point(Math.cos(theta), Math.sin(theta)) * radius);
  radiusLine.lastSegment.point = linePoint;
  radiusPoint.position = linePoint;
  
  circle.scale((radius - circle.strokeWidth / 2) / (circle.bounds.width / 2));
  degText.content = 'degrees: ' + Math.floor(360 - ((theta * rad2deg) + 720) % 360);
  radText.content = 'radians: ' + ((2 * Math.PI) - ((theta) + (4 * Math.PI)) % (2 * Math.PI)).toFixed(4);
  thetaText.content = 'theta: ' + theta.toFixed(4);
}

// Animate
function onFrame(event) {
  
}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);
  grid.position = view.center;
	circleGroup.position = view.center + new Point(circle.strokeWidth * 2, 0);
  degText.position = view.center + new Point(200, 230);
  radText.position = view.center + new Point(200, 260);
  thetaText.position = view.center + new Point(200, 290);
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
