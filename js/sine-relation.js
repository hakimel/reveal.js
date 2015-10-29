
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;
var offsetX = 400;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
bounds.width += bounds.width;
Utils.drawGrid(50, 50, bounds, grid);
grid.position = view.center;

// Create a sin wave
var sineWaveLength = 360;
var sineWaveStep = sineWaveLength/360;
var sineWidth = view.bounds.width;
var sineScale = 50;
var theta = 0;

var circle = new Path.Circle(new Point(0,0), 50);
circle.strokeColor = 'white';

var circleTrack = new Path.Circle(new Point(0,0), 5);
circleTrack.fillColor = 'white';

var sinTrack = new Path.Circle(new Point(0,0), 5);
sinTrack.fillColor = 'white';

var cosTrack = new Path.Circle(new Point(0,0), 5);
cosTrack.fillColor = 'white';

var sinWave = new Path();
sinWave.strokeColor = 'red';
for (var i = 0; i < sineWidth; ++i) {
    sinWave.add([i, Math.sin(i / sineScale) * sineScale]);
}
sinWave.smooth();
sinWave.pivot = [0, 0];

var cosWave = new Path();
cosWave.strokeColor = 'red';
for (var i = 0; i < sineWidth; ++i) {
    cosWave.add([i * sineScale, Math.cos(i) * sineScale]);
}
cosWave.smooth();
cosWave.pivot = [0, 0];

// Animate
function onFrame(event) {
  theta += event.delta;

  var x = Math.cos(theta) * circle.bounds.width/2;
  var y = Math.sin(theta) * circle.bounds.width/2;
  circleTrack.position = circle.position + (new Point(x, y));

  x = theta * sinWave.bounds.height/2;
  y = Math.sin(theta) * sinWave.bounds.height/2;
  sinTrack.position = sinWave.position + (new Point(x, y));

  x = theta * cosWave.bounds.height/2;
  y = Math.cos(theta) * cosWave.bounds.height/2;
  cosTrack.position = cosWave.position + (new Point(x, y));

	sinWave.strokeColor.hue += 1;
  cosWave.strokeColor.hue = sinWave.strokeColor.hue + 45;
}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);

  var center = new Point(view.bounds.left + offsetX * Reveal.getScale(), view.center.y);
  sinWave.position = (center + (new Point(0, -100 / Reveal.getScale())));
  cosWave.position = (center + (new Point(0, 100 / Reveal.getScale())));
  circle.position = (center + (new Point(-150 / Reveal.getScale(), 0)));
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
