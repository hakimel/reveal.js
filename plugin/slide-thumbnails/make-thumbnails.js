/**
 * phantomjs script for generating slide thumbnails
 *
 * Example:
 * phantomjs make-thumbnails.js "http://lab.hakim.se/reveal-js" slide-thumbs/
 *
 * By Yves Delley (https://github.com/burnpanck)
 */


var page = new WebPage(), size;
var system = require( 'system' );

var inputFile = system.args[1] || 'index.html';
var outputFile = system.args[2] || 'slide-thumbs/';

page.viewportSize = { width: 1024, height: 768 };

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};


function next_slide(){
  var routes = Reveal.availableRoutes();
  if( routes.down ) {
    Reveal.down();
  } else if (routes.right) {
    Reveal.right();
  } else return true;
  return false;
}

function render_page(page,p,cnt){
  var islast;
  var i = page.evaluate(function(){
    return Reveal.getIndices();
  });
  if(p.h>i.h || (p.h==i.h && p.v>=i.v)){
    console.log('Failed to reach a next slide! ',i.h, i.v, cnt);
    cnt += 1;
    islast = page.evaluate(next_slide);
    if(islast) phantom.exit();
    if(cnt>20) phantom.exit();
    render_page(page,p,cnt);
    return;
  }
  p=i;
  cnt=0;
  setTimeout(function() {
    console.log('On slide ',i.h, i.v);
    page.render(outputFile+'/slide-' + i.h.toString() + '-' + i.v.toString() + '.png');
    islast = page.evaluate(next_slide);
    if (islast) phantom.exit();
    render_page(page,p,cnt);
  }, 1000);
};

page.open(inputFile, function (status) {
  if (status !== 'success') {
    console.log('Unable to load the address!');
    phantom.exit();
  } else {
    var size = page.evaluate(function(){
      var b_check_sections = {};

      $('body').css('background-color','transparent');

      // Event start load section on slide
      Reveal.addEventListener('slidechanged', function(event) {
        var sectionID = Reveal.getCurrentSlide().id;
        b_check_sections[sectionID] = true;
      });

      // Event end load section on slide
      $(".reveal .slides").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(event) {
        var sectionID = Reveal.getCurrentSlide().id;

        if(b_check_sections[sectionID]){
          /* your code for transition end */
          console.log('Transition ended!');
          b_check_sections[sectionID] = false;
        }
      });

      var config = Reveal.getConfig();
      console.log('Have config ',config.width, config.height);
      return {width: config.width, height: config.height};
    });
    console.log('have presentation size: ',size.width, size.height);
    page.viewportSize = size;
    var p = {h:undefined, v:undefined};
    var cnt = 0;
    render_page(page,p,cnt);
  }
});
