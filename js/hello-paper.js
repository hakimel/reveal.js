
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;
var offsetX = 250;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
bounds.width += bounds.width;
Utils.drawGrid(50, 50, bounds, grid);
grid.position = view.center;

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
for (var i = 15; i < 90; i += 15) {
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
  project.activeLayer.fitBounds(view.bounds, true);
  
  var center = [view.bounds.left + offsetX * Reveal.getScale(), view.center.y];
	rectangleGroup.position = center;
  grid.position = center;
}
onResize();

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing hello-paper.js");
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding hello-paper.js");
}
