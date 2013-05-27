// Custom reveal.js integration
(function(){
  Reveal.addEventListener( 'overviewshown', function() { spotlight.enable(); } );
  Reveal.addEventListener( 'overviewhidden', function() { spotlight.disable(); } );
})();

var spotlight = (function() {
  var revealElement = document.querySelector('.reveal');
  var isOn = false;
  var isEnabled = true;
  var mouseX = 0, mouseY = 0;
  var radius = 100;

  document.addEventListener( 'keyup', function( event ) {
    // Disregard the event if a modifier is present
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.keyCode === 65 && isEnabled) {
      if (! isOn) {
        spotlight.on();
        isOn = true;
      } else {
        spotlight.off();
        isOn = false;
      }
    }
  }, false );

  // Monitor mouse movement for panning
  document.addEventListener( 'mousemove', function( event ) {
    var spotlight = revealElement.querySelector('.spotlight');

    if( isOn && spotlight ) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (navigator.userAgent.match('AppleWebKit')) {
        var style = '-webkit-gradient(radial, ' + mouseX + ' ' + mouseY + ', 0, ' + mouseX + ' ' + mouseY + ', ' + radius + ', from(rgba(0,0,0,0)), to(rgba(0,0,0,0.8)), color-stop(0.8, rgba(0,0,0,0)))';
      } else {
        var style = '-moz-radial-gradient(' + mouseX + 'px ' + mouseY + 'px 45deg,circle closest-side,transparent 0,transparent ' + radius + 'px,rgba(0, 0, 0, 0.8) ' + (radius + 20) + 'px)';
      }
      spotlight.style.backgroundImage = style;
    }
  }, false );

  return {
    on: function() {
      var spotlight = revealElement.querySelector('.spotlight');
      if (! spotlight) {
        spotlight = document.createElement('div');
        spotlight.classList.add('spotlight');
        revealElement.appendChild(spotlight);
      }
      isOn = true;
    },

    off: function() {
      var spotlight = revealElement.querySelector('.spotlight');
      if (spotlight) {
        spotlight.parentNode.removeChild(spotlight);
      }
      isOn = false;
    },

    enable: function() {
      isEnabled = true;
    },

    disable: function() {
      isEnabled = false;
    }
  };

})();


