/**
 * Add this javascript library to a reaveal.js presentation by adding it as a
 * dependency in Reveal.initialize.
 */

// Add an event listener when reveal is finished loading.
Reveal.addEventListener( 'ready', function( event ) {
 // Check to see if code blocks with line-numbers class exist.
 if (document.getElementsByClassName("line-numbers").length > 0) {
    // Include css.
    var link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'lib/css/line-numbers.css';
    // Add CSS to head
    document.getElementsByTagName( 'head' )[0].appendChild( link );
  }
});

// Adding an event listener on slidechanged event to add line numbers to
// code blocks.
Reveal.addEventListener('slidechanged', function(event) {
  // For any code blocks in the current slide with class 'line-numbers'.
  var line_numbers = document.getElementsByClassName("line-numbers");
  for (var l = 0; l < line_numbers.length; l++) {
    if (line_numbers[l].classList.contains('hljs') && (line_numbers[l].innerHTML.indexOf("line-number") < 1)) {
      var content = line_numbers[l].innerHTML;
      content = content.split("\n");
      content = content.join("\n<span class='line-number'> </span>");
      content = "<span class='line-number'> </span>" + content;
      line_numbers[l].innerHTML = content;
    }
  }
});
