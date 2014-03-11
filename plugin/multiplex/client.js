(function() {
    var multiplex = Reveal.getConfig().multiplex;
    var socket = io.connect(multiplex.url);
    var socketId = multiplex.id;

    //Persist presenter token when supplied via hash:
    if ( window.location.search.search( /\?setToken=[^ ]/i ) == 0){ 
        console.log('Persisting presenter token');
        localStorage.secret = window.location.search.slice(10);
        window.location.search = '';
    }

    if ( typeof(localStorage.secret) == "undefined" || localStorage.secret == null) {
        console.log('Tuning in for the presentation...');

        socket.on(multiplex.id, function(data) {
          console.dir(data);
        	// ignore data from sockets that aren't ours
        	if (data.socketId !== socketId) { return; }
          if( data.indexh !== undefined && data.indexv !== undefined){
           	Reveal.slide(data.indexh, data.indexv, null, 'remote');
          }else{
            if(data.direction == 'next'){
              Reveal.nextFragment();
            }else{
              Reveal.prevFragment();
            }
          }
        });
    }else{
        if ( window.location.search.search( /\?clearToken/i ) >= 0){
          localStorage.clear();
          window.location.search = '';
        }
        console.log('Broadcasting slides...');

        Reveal.addEventListener( 'fragmentshown', function( event ) {
          console.dir(event);
        	var data = {
        		secret: localStorage.secret,
        		socketId : multiplex.id,
            direction: 'next'
        	};
        	if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) socket.emit('navigation', data);
        } );

        Reveal.addEventListener( 'fragmenthidden', function( event ) {
          console.dir(event);
        	var data = {
        		secret: localStorage.secret,
        		socketId : multiplex.id,
            direction: 'prev'
        	};
        	if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) socket.emit('navigation', data);
        } );

        Reveal.addEventListener( 'slidechanged', function( event ) {
          console.dir(event);
        	var nextindexh;
        	var nextindexv;
        	var slideElement = event.currentSlide;

        	if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
        		nextindexh = event.indexh;
        		nextindexv = event.indexv + 1;
        	} else {
        		nextindexh = event.indexh + 1;
        		nextindexv = 0;
        	}

        	var slideData = {
        		indexh : event.indexh,
        		indexv : event.indexv,
        		nextindexh : nextindexh,
        		nextindexv : nextindexv,
        		secret: localStorage.secret,
        		socketId : multiplex.id
        	};

        	if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) socket.emit('slidechanged', slideData);
        } );
    }
}());
