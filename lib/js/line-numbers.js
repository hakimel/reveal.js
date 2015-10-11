/**
 * Add this javascript library to a reaveal.js presentation by adding it as a
 * dependency in Reveal.initialize.
 */

// Add an event listener when reveal is finished loading.
Reveal.addEventListener( 'ready', function( event ) {
 // Check to see if code blocks with line-numbers class exist.
 if ($('code.line-numbers').length > 0) {
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
  $('code.line-numbers').each(function(){
    // Check ihighlight js has already run and not already added line numbers
    if ($(this).hasClass('hljs') && ($(this).html().indexOf('class="line-number') < 1)) {
      // Get the content of the code block.
      var content = $(this).html();
      // Split the content on new lines "\n".
      content = content.split("\n");
      // Re-join the content with line number spans after the new line.
      content = content.join("\n<span class='line-number'> </span>");
      // Prefix with a line number for the first line.
      content = '<span class="line-number"> </span>' + content;
      // Replace the content of the code block with the new content.
      $(this).html(content);
    }
  });
});

