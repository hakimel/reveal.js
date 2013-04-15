/**
 * Touch-based remote controller for your presentation courtesy 
 * of the folks at http://remotes.io
 */

(function(window){

    /**
     * Detects if we are dealing with a touch enabled device (with some false positives)
     * Borrowed from modernizr: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touch.js   
     */
    var hasTouch  = (function(){
        return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    })();

    /**
     * Detects if notes are enable and the current page is opened inside an /iframe
     * this prevents loading Remotes.io several times
     */
    var remotesAndIsNotes = (function(){
      return !(window.RevealNotes && self == top);
    })();

    if(!hasTouch && !remotesAndIsNotes){
        head.ready( 'remotes.ne.min.js', function() {
            new Remotes("preview")
                .on("swipe-left", function(e){ Reveal.right(); })
                .on("swipe-right", function(e){ Reveal.left(); })
                .on("swipe-up", function(e){ Reveal.down(); })
                .on("swipe-down", function(e){ Reveal.up(); })
                .on("tap", function(e){ 
                    Reveal.toggleOverview(); 
                });
        } );

        head.js('https://raw.github.com/Remotes/Remotes/master/dist/remotes.ne.min.js');
    }
})(window);