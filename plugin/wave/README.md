Advance through your slides by waving
=====================================

This plugin makes it possible to use your webcam to detect waving - and then triggering a slide change.
It's more of a cool effect than a useful library - but great to impress your audience.


Restrictions
=======
- works only in Chrome (only Chrome supports getUserMedia() which is used to get access to your webcam)
- it only works if your calling the presentation on a server (i.e not with a file:// url)
- you must accept Chrome's request to use your webcam


HowTo
=======

Include this two lines in the "dependencies" section in index.html:
`{ src: 'plugin/wave/webcam-swiper-0.1.js'},
{ src: 'plugin/wave/client.js'}´

Run the server.js file via node to startup a server on localhost:1947 (or use any other server to serve the presentation). 
Open the presentation, click "accept" and wave to 
advnace through your slides.


TODOS:
=======

- make it possible to enable and disable the swipe detection (maybe a button on the cursorpad?)
- improve the detection and enable going backwards through slides



The webcam-swiper library is from https://github.com/iambrandonn/WebcamSwiper
