
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

var drawGridLines = function(width_per_rectangle, height_per_rectangle, boundingRect, group) {
    var num_rectangles_wide = boundingRect.width / width_per_rectangle;
    var num_rectangles_tall = boundingRect.height / height_per_rectangle;
    for (var i = 0; i <= num_rectangles_wide; i++) {
        var xPos = boundingRect.left + i * width_per_rectangle;
        var topPoint = new Point(xPos, boundingRect.top);
        var bottomPoint = new Point(xPos, boundingRect.bottom);
        var aLine = new Path.Line(topPoint, bottomPoint);
        aLine.strokeColor = 'white';
        group.addChild(aLine);
    }
    for (var i = 0; i <= num_rectangles_tall; i++) {
        var yPos = boundingRect.top + i * height_per_rectangle;
        var leftPoint = new Point(boundingRect.left, yPos);
        var rightPoint = new Point(boundingRect.right, yPos);
        var aLine = new Path.Line(leftPoint, rightPoint);
        aLine.strokeColor = 'white';
        group.addChild(aLine);
    }
}

// Draw a grid
var grid = new Group();
drawGridLines(100, 100, view.bounds, grid);

// Create a base rectangle
var rectangles = [
  new Path.Rectangle({
    point: [300, 300],
	  size: [300, 300],
	  strokeColor: 'red',
    strokeWidth: 4
  })
];

// Create a rectangle ring
for (var i = 15; i < 360; i += 15) {
  var rect = rectangles[0].clone();
  rect.rotate(i);
  rect.strokeColor.hue += i;
  rectangles.push(rect);
}
var rectangleGroup = new Group(rectangles);
rectangleGroup.position = view.center;

// Animate
function onFrame(event) {
	for (var i = 0; i < rectangles.length; ++i) {
	   var rectangle = rectangles[i];
     rectangle.rotate(2);
     rectangle.strokeColor.hue += 1;
   }
}

// Resize the view
function onResize(event) {
	// Whenever the window is resized, recenter the path:
	rectangleGroup.position = view.center;
  grid.position = view.center;
  project.activeLayer.fitBounds(view.bounds, true);
}


// Expose a function to be called when our slide is shown
view.onShow = function() {
  grid.removeChildren();
  drawGridLines(100, 100, view.bounds, grid);
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("HIDING VIEW");
}
