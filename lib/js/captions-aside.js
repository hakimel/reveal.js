Reveal.addEventListener('ready', function(event){
  var print = window.location.search.match( /print-pdf/gi );
  var set_aside = document.getElementsByClassName("slides")[0].hasAttribute("data-captions-aside");

  if (!print && set_aside) {
    var captions = document.getElementsByClassName("caption");
    for (var c = 0; c < captions.length; c++) {
      var text = document.createTextNode(captions[c].textContent);
      var aside = document.createElement('aside');
      aside.appendChild(text);
      aside.className += ' notes';
      captions[c].parentNode.replaceChild(aside, captions[c]);
    }
  }
});
