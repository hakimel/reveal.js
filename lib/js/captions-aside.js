Reveal.addEventListener('ready', function(event){
  var print = window.location.search.match( /print-pdf/gi );
  var set_aside = document.getElementsByClassName("slides")[0].hasAttribute("data-captions-aside");

  if (!print && set_aside) {
    while (document.getElementsByClassName("caption").length > 0) {
      var caption = document.getElementsByClassName("caption")[0];
      var text = document.createTextNode(caption.textContent);
      var aside = document.createElement('aside');
      aside.appendChild(text);
      aside.className += 'notes';
      caption.parentNode.replaceChild(aside, caption);
    }
  }
});