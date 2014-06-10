/*****************************************************************
** Author: Asvin Goel, goel@telematique.eu
**
** Audio slideshow is a plugin for reveal.js allowing to
** automatically play  audio file for a slide deck. Audio files
** within slides or fragments are automatically played when content
** is shown. The next slide or fragment is shown after the audio 
** file is played. Autoslide values for slides and fragments are 
** automatically increased if an audio files has a longer duration.
**
** License: MIT license (see LICENSE.md)
**
** Thanks to Hakim El Hattab for giving hints on creating plugins.
******************************************************************/

(function(){
	Reveal.addEventListener( 'fragmentshown', function( event ) {
		if ( Reveal.isAutoSliding() ) startAudio( Reveal.getIndices(), event.fragment );
	} );

	Reveal.addEventListener( 'fragmenthidden', function( event ) {
	} );

	Reveal.addEventListener( 'ready', function( event ) {
		// never start audio slideshow automatically to not annoy users
		Reveal.toggleAutoSlide( false );
		setup();
	} );

	Reveal.addEventListener( 'autoslideresumed', function( event ) {
		var currentFragment = Reveal.getCurrentSlide().querySelector( '.current-fragment' );
		currentFragment ? startAudio( Reveal.getIndices(), currentFragment ) : startAudio( Reveal.getIndices() );
	} );

	Reveal.addEventListener( 'autoslidepaused', function( event ) {
		stopAudio( Reveal.getCurrentSlide() );
	} );

	Reveal.addEventListener( 'slidechanged', function( event ) {
		var indices = Reveal.getIndices();
		if ( typeof indices.f !== 'undefined' && indices.f > 0) {
			// allways hide all fragments when slide is shown
			Reveal.slide(indices.h, indices.v, -1);		
		}

		if ( Reveal.isAutoSliding() ) {
			startAudio( indices ); 
		}
	} );

	function stopAudio( content ) {
		var audioElements =  content.querySelectorAll( 'audio' );
		for (var i = 0; i < audioElements.length; ++i) {
			if ( !audioElements[ i ].error ) {
				audioElements[ i ].pause();
				audioElements[ i ].currentTime = 0;
			}
		}

	}

	function startAudio( indices, fragment ) {
		var prefix = Reveal.getConfig().audioPrefix;
		if ( !prefix ) prefix = 'audio/';
		var suffix = Reveal.getConfig().audioSuffix;
		if ( !suffix ) suffix = '.ogg';
		var offset = Reveal.getConfig().audioOffset;
		if ( !offset ) offset = 1000;


		var duration = Reveal.getConfig().autoSlide;
		if ( Reveal.getCurrentSlide().parentNode && Reveal.getCurrentSlide().parentNode.hasAttribute( 'data-autoslide' ) ) {
			duration = Reveal.getCurrentSlide().parentNode.getAttribute( 'data-autoslide' );			
		}
		if ( Reveal.getCurrentSlide().hasAttribute( 'data-autoslide' ) ) {
			duration = Reveal.getCurrentSlide().getAttribute( 'data-autoslide' );			
		}

		if ( typeof fragment != 'undefined' && fragment != null ) {
			// if fragment is shown, start playing audio file of fragment
			if ( fragment.hasAttribute( 'data-autoslide' ) ) {
				duration = fragment.getAttribute( 'data-autoslide' );				
			}
			setDurationAndPlay( fragment, duration, 10);

		}
		else {
			setDurationAndPlay( Reveal.getCurrentSlide(), duration, offset);	
		}
	}

	function setDurationAndPlay( container, duration, offset ) {
		var audioElement =  container.querySelector( 'audio' );
		if ( audioElement && !audioElement.error ) {
			// set or increase auto-slide value if necessary
			if ( !duration || duration  < audioElement.duration * 1000 + offset ) {
				container.setAttribute( 'data-autoslide', audioElement.duration * 1000  + offset );
			}
			// start playing audio file
			audioElement.play();
		}
	}

	function setup() {
		var prefix = Reveal.getConfig().audioPrefix;
		if ( !prefix ) prefix = 'audio/'
		var suffix = Reveal.getConfig().audioSuffix;
		if ( !suffix ) suffix = '.ogg'

		var horizontalSlides = document.querySelectorAll( '.reveal .slides>section' );
		for( var h = 0, len1 = horizontalSlides.length; h < len1; h++ ) {
			var verticalSlides = horizontalSlides[ h ].querySelectorAll( 'section' );
			if ( !verticalSlides.length ) {
				setupSlide( horizontalSlides[ h ], prefix, h, 0, suffix );
			}
			else {
				for( var v = 0, len2 = verticalSlides.length; v < len2; v++ ) {
					setupSlide( verticalSlides[ v ], prefix, h, v, suffix );
				}
			}
		}
	}

	function setupSlide( slide, prefix, h, v, suffix ) {
		setupAudio( slide, prefix + h + '.' + v + suffix );
		var fragments = slide.querySelectorAll( '.fragment' );
		for( var f = 0, len = fragments.length; f < len; f++ ) {
			setupAudio( fragments[ f ], prefix + h + '.' + v + '.' + fragments[ f ].getAttribute( 'data-fragment-index' ) + suffix );
		}
	}

	function setupAudio( container, filename ) {
		var audioElement = container.querySelector( 'audio' );
		if ( !audioElement ) {
			audioElement = document.createElement( 'audio' );
			audioElement.setAttribute( 'src', filename );
			audioElement.setAttribute( 'preload', 'auto' );
			container.insertBefore( audioElement, container.firstChild );
		}
	}


})();
