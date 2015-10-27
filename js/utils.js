window.Utils = (function() {
  var utils = {};
  var mouseListener = {
    onMouseDown: null,
    onMouseUp: null,
    onMouseDrag: null,
    onMouseMove: null,
    dragging: false
  };
  
  utils.drawGrid = function(cellWidth, cellHeight, bounds, group) {
    var xCount = (bounds.width / 2) / cellWidth;
    var yCount = (bounds.height / 2) / cellHeight;
    
    for (var x = 0; x < xCount; x++) {
        var topPoint, bottomPoint, aLine;
        var xPos = x * cellWidth;
        var color = new paper.Color(1.0, 1.0, 1.0, x == 0 ? 0.4 : 0.25);
        
        topPoint = new paper.Point(xPos, -(Math.floor(yCount) * cellHeight));
        bottomPoint = new paper.Point(xPos, (Math.floor(yCount) * cellHeight));
        aLine = new paper.Path.Line(topPoint, bottomPoint);
        aLine.strokeColor = color;
        group.addChild(aLine);
        
        topPoint = new paper.Point(-xPos, -(Math.floor(yCount) * cellHeight));
        bottomPoint = new paper.Point(-xPos, (Math.floor(yCount) * cellHeight));
        aLine = new paper.Path.Line(topPoint, bottomPoint);
        aLine.strokeColor = color;
        group.addChild(aLine);
    }
    
    for (var y = 0; y < yCount; y++) {
        var leftPoint, rightPoint, aLine;
        var yPos = y * cellHeight;
        var color = new paper.Color(1.0, 1.0, 1.0, y == 0 ? 0.4 : 0.25);
        
        leftPoint = new paper.Point(-(Math.floor(xCount) * cellWidth), yPos);
        rightPoint = new paper.Point((Math.floor(xCount) * cellWidth), yPos);
        aLine = new paper.Path.Line(leftPoint, rightPoint);
        aLine.strokeColor = color;
        group.addChild(aLine);
        
        leftPoint = new paper.Point(-(Math.floor(xCount) * cellWidth), -yPos);
        rightPoint = new paper.Point((Math.floor(xCount) * cellWidth), -yPos);
        aLine = new paper.Path.Line(leftPoint, rightPoint);
        aLine.strokeColor = color;
        group.addChild(aLine);
    }
  }
  
  utils.bindMouse = function(onMouseDown, onMouseUp, onMouseDrag, onMouseMove) {
    mouseListener.onMouseDown = onMouseDown;
    mouseListener.onMouseUp = onMouseUp;
    mouseListener.onMouseDrag = onMouseDrag;
    mouseListener.onMouseMove = onMouseMove;
  }
  
  utils.unbindMouse = function() {
    mouseListener.onMouseDown = null;
    mouseListener.onMouseUp = null;
    mouseListener.onMouseDrag = null;
    mouseListener.onMouseMove = null;
  }
  
  window.addEventListener('mousemove', function(e) {
    if (mouseListener.onMouseMove) mouseListener.onMouseMove({ point: new paper.Point(e.clientX, e.clientY) });
    if (mouseListener.dragging && mouseListener.onMouseDrag) mouseListener.onMouseDrag({ point: new paper.Point(e.clientX, e.clientY) });
  });
  
  window.addEventListener('mousedown', function(e) {
    if (mouseListener.onMouseDown) mouseListener.onMouseDown({ point: new paper.Point(e.clientX, e.clientY) });
    mouseListener.dragging = true;
  });
  window.addEventListener('mouseup', function(e) {
    if (mouseListener.onMouseUp) mouseListener.onMouseUp({ point: new paper.Point(e.clientX, e.clientY) });
    mouseListener.dragging = false;
  });
  
  return utils;
})();
