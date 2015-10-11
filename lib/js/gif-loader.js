Reveal.addEventListener('slidechanged', function(event) {
  var gifs = event.currentSlide.getElementsByClassName("animated-gif");
  for (var g = 0;g < gifs.length; g++) {
    gifs[g].src = gifs[g].src + "?" + new Date().getTime();
  }
})
