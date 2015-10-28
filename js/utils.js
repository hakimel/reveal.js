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
  
  utils.createDrawingTool = function(project) {
    var drawingTool = {
      parentLayer: project.activeLayer,
      layer: new paper.Layer(),
      enabled: false,
      active: false,
      path: null,
      dragging: false,
      
      onMouseDown: function(event) {
        //drawingTool.layer.activate();
        drawingTool.path = new paper.Path();
        drawingTool.path.strokeColor = 'white';
        drawingTool.path.strokeWidth = 6;
        
        drawingTool.dragging = true;
        console.log("Draw")
      },

      onMouseMove: function(event) {
        if (drawingTool.dragging) {
          drawingTool.path.add(new paper.Point(event.clientX, event.clientY));
        }
       },

      onMouseUp: function(event) {
        drawingTool.dragging = false;
        
        drawingTool.path.smooth();
        drawingTool.path = null;
        
        console.log("End")
      },
      
      onKeyPress: function(event) {
        if (event.keyCode === 113) { //q
          drawingTool.clear();
        }
        else if (event.keyCode === 119) { //w
          drawingTool.toggleDrawingTool();
        }
      },
      
      clear: function() {
        drawingTool.layer.removeChildren();
      },
      
      toggleDrawingTool: function() {
        drawingTool.enabled = !drawingTool.enabled;
        
        if (drawingTool.enabled) {
          window.addEventListener('mousemove', drawingTool.onMouseMove, true);
          window.addEventListener('mousedown', drawingTool.onMouseDown, true);
          window.addEventListener('mouseup', drawingTool.onMouseUp, true);
          
          drawingTool.layer.activate();
          drawingTool.active = true;
          
          console.log('DRAWING TOOL ACTIVATED');
        }
        else {
          window.removeEventListener('mousemove', drawingTool.onMouseMove, true);
          window.removeEventListener('mousedown', drawingTool.onMouseDown, true);
          window.removeEventListener('mouseup', drawingTool.onMouseUp, true);
          
          drawingTool.clear();
          drawingTool.active = false;
          drawingTool.parentLayer.activate();
          
          console.log('DRAWING TOOL DEACTIVATED');
        }
      }
    };
    
    window.addEventListener('keypress', drawingTool.onKeyPress);
    drawingTool.parentLayer.activate();
    
    return drawingTool;
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
    mouseListener.dragging = true;
    if (mouseListener.onMouseDown) mouseListener.onMouseDown({ point: new paper.Point(e.clientX, e.clientY) });
  });
  
  window.addEventListener('mouseup', function(e) {
    mouseListener.dragging = false;
    if (mouseListener.onMouseUp) mouseListener.onMouseUp({ point: new paper.Point(e.clientX, e.clientY) });
  });
  
  return utils;
})();
