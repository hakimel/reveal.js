
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;
var offsetX = 250;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
bounds.width += bounds.width;
Utils.drawGrid(50, 50, bounds, grid);
grid.position = view.center;

// Create a sin wave
var sineWaveLength = 360;
var sineWaveStep = sineWaveLength/360;
var sineScale = 100;
var theta = 0;

var sinWave = new Path();
sinWave.strokeColor = 'red';
for (var i = 0; i < bounds.width; ++i) {
    sinWave.add([i * sineScale, Math.sin(i) * sineScale]);
}
sinWave.smooth();
sinWave.pivot = [Math.PI * sineScale, 0];

var cosWave = new Path();
cosWave.strokeColor = 'red';
for (var i = 0; i < bounds.width; ++i) {
    cosWave.add([i * sineScale, Math.cos(i) * sineScale]);
}
cosWave.smooth();
cosWave.pivot = [Math.PI * sineScale, 0];

// Animate
function onFrame(event) {
  theta += event.delta;

  for (var s = 0; s < sinWave.segments.length; ++s) {
    sinWave.segments[s].point.y = sinWave.position.y + Math.sin(theta + s) * sineScale;
  }
  sinWave.smooth();

  for (var c = 0; c < cosWave.segments.length; ++c) {
    cosWave.segments[c].point.y = cosWave.position.y + Math.cos(theta + c) * sineScale;
  }
  cosWave.smooth();

	sinWave.strokeColor.hue += 1;
  cosWave.strokeColor.hue = sinWave.strokeColor.hue + 45;
}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);

  var center = [view.bounds.left + offsetX * Reveal.getScale(), view.center.y];
  sinWave.position = center;
  cosWave.position = center;
  grid.position = center;
}
onResize();

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing sine-wave.js");
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding sine-wave.js");
}
