
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
Utils.drawGrid(50, 50, view.bounds, grid);
grid.position = view.center;

// Animate
function onFrame(event) {
  
}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);
  grid.position = view.center;
}
onResize();

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing distance-check.js");
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding distance-check.js");
}
