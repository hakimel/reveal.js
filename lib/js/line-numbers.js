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
  addLineNumbers();
});

function addLineNumbers() {
  // For any code blocks in the current slide with class 'line-numbers'.
  var line_numbers = document.getElementsByClassName("line-numbers");
  var highlights = [];
  for (var l = 0; l < line_numbers.length; l++) {
    highlights = [];
    if (line_numbers[l].classList.contains('hljs') && (line_numbers[l].innerHTML.indexOf("line-number") < 1)) {
      // See if there are any lines that need to be highlighted.
      if (line_numbers[l].hasAttribute("data-highlight-lines")) {
        highlights = getLineNumberHighlights(line_numbers[l].getAttribute("data-highlight-lines"));
      }
      //console.log(highlights);
      var content = line_numbers[l].innerHTML;
      var classes = '';
      content = content.split("\n");
      //console.log(content);
      for (var n =0; n < content.length; n++) {
        classes = 'line-number';
        if (highlights.indexOf(n+1) > -1) {
          classes += ' highlight-line';
        }
        content[n] = "<span class=\"" + classes + "\"> </span>" + content[n];
      }
      content = content.join("\n");
      line_numbers[l].innerHTML = content;
    }
  }
}

function getLineNumberHighlights(line_numbers) {
  var highlights = num_range = [];
  var start = end = num = 0;

  if (line_numbers.indexOf(',') > 0) {
    line_numbers = line_numbers.split(",");
  }
  else {
    line_numbers = [line_numbers];
  }

  for(n = 0; n < line_numbers.length; n++) {
    if (line_numbers[n].indexOf("-") > 0) {
      num_range = line_numbers[n].split("-");
      start = Number.parseInt(num_range[0]);
      end = Number.parseInt(num_range[1]);

      while (start <= end) {
        if (highlights.indexOf(start) < 0) {
          highlights.push(start);
        }
        start++;
      }
    }
    else {
      num = Number.parseInt(line_numbers[n]);
      if ((num == line_numbers[n]) && highlights.indexOf(num) < 0) {
        highlights.push(num);
      }
    }
  }

  return highlights;
}
