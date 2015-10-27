
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;
var padding = new Path.Circle(new Point(0, 0), 300);

var radius = 100;
var minRadius = 50;
var maxRadius = 200;

var circle = new Path.Circle(new Point(0, 0), radius);
circle.strokeColor = 'white';

var radiusLine = new Path.Line(new Point(0,0), new Point(radius, 0));
radiusLine.strokeColor = 'red';

var centerPoint = new Path.Circle(new Point(0, 0), 3);
centerPoint.fillColor = 'white';

var radiusPoint = new Path.Circle(new Point(radius, 0), 3);
radiusPoint.fillColor = 'red';

var circleGroup = new Group([circle, radiusLine, centerPoint, radiusPoint]);

var text = new PointText(new Point(radius + 5, 3));
text.justification = 'left';
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
  project.activeLayer.fitBounds(view.bounds, false);
	circleGroup.position = view.center;
  onMouseDrag({ point: radiusLine.lastSegment.point });
}
onResize();

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing simple-circle.js");
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding simple-circle.js");
}
