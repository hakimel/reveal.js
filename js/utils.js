window.Utils = (function() {
  var utils = {};
  
  utils.drawGrid = function(cellWidth, cellHeight, bounds, group) {
    var xCount = (bounds.width / 2) / cellWidth;
    var yCount = (bounds.height / 2) / cellHeight;
    
    for (var x = 0; x < xCount; x++) {
        var topPoint, bottomPoint, aLine;
        var xPos = x * cellWidth;
        var color = new paper.Color(1.0, 1.0, 1.0, x == 0 ? 0.8 : 0.6);
        
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
        var color = new paper.Color(1.0, 1.0, 1.0, y == 0 ? 0.8 : 0.6);
        
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
  
  return utils;
})();
