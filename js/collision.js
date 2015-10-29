
var deg2rad = Math.PI/180, rad2deg = 180/Math.PI;

// Draw a grid
var grid = new Group();
var bounds = view.bounds;
Utils.drawGrid(50, 50, view.bounds, grid);
grid.position = view.center;

function createTurret(position, radius)
{
  var turretOuter = new Path.Circle(new Point(0, 0), radius);
  turretOuter.strokeColor = 'white';
  turretOuter.strokeWidth = 5;
  turretOuter.strokeCap = 'round';
  turretOuter.dashArray = [360/15, 360/15];
  turretOuter.fillColor = new Color(0.0, 1.0, 0.0, 0.1);

  var turretCenter = new Path.Circle(new Point(0, 0), 5);
  turretCenter.fillColor = 'white';

  var turret = new Group(turretOuter, turretCenter);
  turret.position = position;

  turret.meta = {};
  turret.meta.getRadius = function() {
    return turretOuter.bounds.width / 2;
  }

  turret.meta.setFillColor = function(color) {
    turretOuter.fillColor = color;
  }

  return turret;
}

function createPlayer(position, radius, showBounds)
{
  showBounds = (showBounds === true ? showBounds : false);

  var playerOuter;
  if (showBounds) {
    playerOuter = new Path.Circle(new Point(0, 0), radius);
    playerOuter.strokeColor = 'white';
    playerOuter.strokeWidth = 2;
    playerOuter.fillColor = new Color(1.0, 0.0, 1.0, 0.1);
  }

  var playerCenter = new Path.Circle(new Point(0, 0), 10);
  playerCenter.fillColor = 'white';

  var player = new Group(showBounds ? [playerOuter, playerCenter] : [playerCenter]);
  player.position = position;

  player.meta = {};
  player.meta.getRadius = function() {
    return (showBounds ? playerOuter.bounds.width / 2 : playerCenter.bounds.width / 2);
  }

  player.meta.setFillColor = function(color) {
    playerOuter.fillColor = color;
  }

  return player;
}

var turret = createTurret(new Point(0, 0), 175);
var player = createPlayer(new Point(view.center), 50, true);

function onMouseMove(event) {
  player.position = event.point;

  var distance = Math.sqrt(((turret.position.x - player.position.x) * (turret.position.x - player.position.x)) + ((turret.position.y - player.position.y) * (turret.position.y - player.position.y)));

  var radius = turret.meta.getRadius();
  var playerRadius = player.meta.getRadius();
  if ((distance - playerRadius) < radius) {
    turret.meta.setFillColor(new Color(1.0, 0.0, 0.0, 0.1));
  }
  else {
    turret.meta.setFillColor(new Color(0.0, 1.0, 0.0, 0.1));
  }
}

// Animate
function onFrame(event) {

}

// Resize the view
function onResize(event) {
  project.activeLayer.fitBounds(view.bounds, true);
  grid.position = view.center;
  turret.position = view.center - (new Point(350, -75) * Reveal.getScale());
}

// Expose a function to be called when our slide is shown
view.onShow = function() {
  console.log("Showing collision.js");
  Utils.bindMouse(null, null, null, onMouseMove);
  onResize();
}

// Expose a function to be called when our slide is hidden
view.onHide = function() {
  console.log("Hiding collision.js");
}

// Initialize
view.onShow();
