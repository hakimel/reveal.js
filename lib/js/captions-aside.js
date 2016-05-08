Reveal.addEventListener('ready', function(event){
  var print = window.location.search.match( /print-pdf/gi );
  var set_aside = document.getElementsByClassName("slides")[0].hasAttribute("data-captions-aside");
  var remove_aside = document.getElementsByClassName("slides")[0].hasAttribute("data-remove-aside");
  var move_aside = document.getElementsByClassName("slides")[0].hasAttribute("data-move-aside");

  if (!print && set_aside) {
    var caption = false;
    while (caption = document.getElementsByClassName("caption")[0]) {
      var text = document.createTextNode(caption.textContent);
      var aside = document.createElement('aside');
      aside.appendChild(text);
      aside.className += ' notes';
      caption.parentNode.replaceChild(aside, caption);
    }
  }

  if (print) {
    var skips = document.querySelectorAll('[data-skip-print]');
    var s = 0;
    for (s = 0; s < skips.length; s++) {
      skips[s].parentNode.removeChild(skips[s]);
    }
  }

  if (remove_aside) {
    while (aside = document.getElementsByClassName("notes")[0]) {
      aside.parentNode.removeChild(aside);
    }
  }

  if (move_aside) {
    var moves = document.querySelectorAll('[data-set-aside]');
    var m = 0;
    for (m = 0; m < moves.length; m++) {
      console.log('move');
      moves[m].parentNode.removeChild(moves[m]);
    }
  }
});
