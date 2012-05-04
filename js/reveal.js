/*!
 * reveal.js 1.3
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 * 
 * Copyright (C) 2012 Hakim El Hattab, http://hakim.se
 */
var Reveal = (function(){
	
	var HORIZONTAL_SLIDES_SELECTOR = '#reveal .slides>section',
		VERTICAL_SLIDES_SELECTOR = '#reveal .slides>section.present>section',

		// The horizontal and verical index of the currently active slide
		indexh = 0,
		indexv = 0,

		// Configurations options, can be overridden at initialization time 
		config = {
			controls: false,
			progress: false,
			history: false,
			loop: false,
			mouseWheel: true,
			rollingLinks: true,
			transition: 'default',
			theme: 'default'
		},

		// Slides may hold a data-state attribute which we pick up and apply 
		// as a class to the body. This list contains the combined state of 
		// all current slides.
		state = [],

		// Cached references to DOM elements
		dom = {},

		// Detect support for CSS 3D transforms
		supports3DTransforms =  document.body.style['perspectiveProperty'] !== undefined ||
								document.body.style['WebkitPerspective'] !== undefined || 
                        		document.body.style['MozPerspective'] !== undefined ||
                        		document.body.style['msPerspective'] !== undefined ||
                        		document.body.style['OPerspective'] !== undefined,
        
        supports2DTransforms =  document.body.style['transformProperty'] !== undefined ||
								document.body.style['WebkitTransform'] !== undefined || 
                        		document.body.style['MozTransform'] !== undefined ||
                        		document.body.style['msTransform'] !== undefined ||
                        		document.body.style['OTransform'] !== undefined,
		
		// Throttles mouse wheel navigation
		mouseWheelTimeout = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0;
	
	/**
	 * Starts up the slideshow by applying configuration
	 * options and binding various events.
	 */
	function initialize( options ) {
		
		if( !supports2DTransforms && !supports3DTransforms ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// If the browser doesn't support transforms we won't be 
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to DOM elements
		dom.wrapper = document.querySelector( '#reveal' );
		dom.progress = document.querySelector( '#reveal .progress' );
		dom.progressbar = document.querySelector( '#reveal .progress span' );
		dom.controls = document.querySelector( '#reveal .controls' );
		dom.controlsLeft = document.querySelector( '#reveal .controls .left' );
		dom.controlsRight = document.querySelector( '#reveal .controls .right' );
		dom.controlsUp = document.querySelector( '#reveal .controls .up' );
		dom.controlsDown = document.querySelector( '#reveal .controls .down' );

		// Bind all view events
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		window.addEventListener( 'hashchange', onWindowHashChange, false );
		dom.controlsLeft.addEventListener( 'click', preventAndForward( navigateLeft ), false );
		dom.controlsRight.addEventListener( 'click', preventAndForward( navigateRight ), false );
		dom.controlsUp.addEventListener( 'click', preventAndForward( navigateUp ), false );
		dom.controlsDown.addEventListener( 'click', preventAndForward( navigateDown ), false );

		// Copy options over to our config object
		extend( config, options );

		// Fall back on the 2D transform theme 'linear'
		if( supports3DTransforms === false ) {
			config.transition = 'linear';
		}

		if( config.controls ) {
			dom.controls.style.display = 'block';
		}

		if( config.progress ) {
			dom.progress.style.display = 'block';
		}

		if( config.transition !== 'default' ) {
			dom.wrapper.classList.add( config.transition );
		}

		if( config.theme !== 'default' ) {
			dom.wrapper.classList.add( config.theme );
		}

		if( config.mouseWheel ) {
			document.addEventListener('DOMMouseScroll', onDocumentMouseScroll, false); // FF
			document.addEventListener('mousewheel', onDocumentMouseScroll, false);
		}

		if( config.rollingLinks ) {
			// Add some 3D magic to our anchors
			linkify();
		}

		// Read the initial hash
		readURL();
	}

	/**
	 * Extend object a with the properties of object b. 
	 * If there's a conflict, object b takes precedence.
	 */
	function extend( a, b ) {
		for( var i in b ) {
			a[ i ] = b[ i ];
		}
	}

	/**
	 * Prevents an events defaults behavior calls the 
	 * specified delegate.
	 * 
	 * @param {Function} delegate The method to call 
	 * after the wrapper has been executed
	 */
	function preventAndForward( delegate ) {
		return function( event ) {
			event.preventDefault();
			delegate.call();
		}
	}
	
	/**
	 * Handler for the document level 'keydown' event.
	 * 
	 * @param {Object} event
	 */
	function onDocumentKeyDown( event ) {
		// FFT: Use document.querySelector( ':focus' ) === null 
		// instead of checking contentEditable?

		// Disregard the event if the target is editable or a 
		// modifier is present
		if ( event.target.contentEditable != 'inherit' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) return;
				
		var triggered = false;

		switch( event.keyCode ) {
			// p, page up
			case 80: case 33: navigatePrev(); triggered = true; break; 
			// n, page down, space
			case 78: case 32: case 34: navigateNext(); triggered = true; break;
			// h, left
			case 72: case 37: navigateLeft(); triggered = true; break;
			// l, right
			case 76: case 39: navigateRight(); triggered = true; break;
			// k, up
			case 75: case 38: navigateUp(); triggered = true; break;
			// j, down
			case 74: case 40: navigateDown(); triggered = true; break;
		}

		if( triggered ) {
			event.preventDefault();
		}
		else if ( event.keyCode === 27 && supports3DTransforms ) {
			if( overviewIsActive() ) {
				deactivateOverview();
			}
			else {
				activateOverview();
			}
	
			event.preventDefault();
		}

	}
	
	/**
	 * Handler for the document level 'touchstart' event.
	 * 
	 * This enables very basic tap interaction for touch
	 * devices. Added mainly for performance testing of 3D
	 * transforms on iOS but was so happily surprised with
	 * how smoothly it runs so I left it in here. Apple +1
	 * 
	 * @param {Object} event
	 */
	function onDocumentTouchStart( event ) {
		// We're only interested in one point taps
		if (event.touches.length === 1) {
			// Never prevent taps on anchors and images
			if( event.target.tagName.toLowerCase() === 'a' || event.target.tagName.toLowerCase() === 'img' ) {
				return;
			}
			
			event.preventDefault();
			
			var point = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			};
			
			// Define the extent of the areas that may be tapped
			// to navigate
			var wt = window.innerWidth * 0.3;
			var ht = window.innerHeight * 0.3;
			
			if( point.x < wt ) {
				navigateLeft();
			}
			else if( point.x > window.innerWidth - wt ) {
				navigateRight();
			}
			else if( point.y < ht ) {
				navigateUp();
			}
			else if( point.y > window.innerHeight - ht ) {
				navigateDown();
			}
			
			slide();
		}
	}


	/**
	 * Handles mouse wheel scrolling, throttled to avoid 
	 * skipping multiple slides.
	 */
	function onDocumentMouseScroll( event ){
		clearTimeout( mouseWheelTimeout );

		mouseWheelTimeout = setTimeout( function() {
			var delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else {
				navigatePrev();
			}
		}, 100 );
	}
	
	/**
	 * Handler for the window level 'hashchange' event.
	 * 
	 * @param {Object} event
	 */
	function onWindowHashChange( event ) {
		readURL();
	}

	/**
	 * Wrap all links in 3D goodness.
	 */
	function linkify() {
        if( supports3DTransforms ) {
        	var nodes = document.querySelectorAll( '#reveal .slides section a:not(.image)' );

	        for( var i = 0, len = nodes.length; i < len; i++ ) {
	            var node = nodes[i];
	            
	            if( node.textContent && !node.querySelector( 'img' ) && ( !node.className || !node.classList.contains( node, 'roll' ) ) ) {
	                node.classList.add( 'roll' );
	                node.innerHTML = '<span data-title="'+ node.text +'">' + node.innerHTML + '</span>';
	            }
	        };
        }
	}

	/**
	 * Displays the overview of slides (quick nav) by 
	 * scaling down and arranging all slide elements.
	 * 
	 * Experimental feature, might be dropped if perf 
	 * can't be improved.
	 */
	function activateOverview() {
		dom.wrapper.classList.add( 'overview' );

		var horizontalSlides = Array.prototype.slice.call( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		for( var i = 0, len1 = horizontalSlides.length; i < len1; i++ ) {
			var hslide = horizontalSlides[i],
				htransform = 'translateZ(-2500px) translate(' + ( ( i - indexh ) * 105 ) + '%, 0%)';
			
			hslide.setAttribute( 'data-index-h', i );
			hslide.style.display = 'block';
			hslide.style.WebkitTransform = htransform;
			hslide.style.MozTransform = htransform;
			hslide.style.msTransform = htransform;
			hslide.style.OTransform = htransform;
			hslide.style.transform = htransform;

			if( !hslide.classList.contains( 'stack' ) ) {
				// Navigate to this slide on click
				hslide.addEventListener( 'click', onOverviewSlideClicked, true );
			}

			var verticalSlides = Array.prototype.slice.call( hslide.querySelectorAll( 'section' ) );

			for( var j = 0, len2 = verticalSlides.length; j < len2; j++ ) {
				var vslide = verticalSlides[j],
					vtransform = 'translate(0%, ' + ( ( j - indexv ) * 105 ) + '%)';

				vslide.setAttribute( 'data-index-h', i );
				vslide.setAttribute( 'data-index-v', j );
				vslide.style.display = 'block';
				vslide.style.WebkitTransform = vtransform;
				vslide.style.MozTransform = vtransform;
				vslide.style.msTransform = vtransform;
				vslide.style.OTransform = vtransform;
				vslide.style.transform = vtransform;

				// Navigate to this slide on click
				vslide.addEventListener( 'click', onOverviewSlideClicked, true );
			}
		}
	}
	
	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {
		dom.wrapper.classList.remove( 'overview' );

		var slides = Array.prototype.slice.call( document.querySelectorAll( '#reveal .slides section' ) );

		for( var i = 0, len = slides.length; i < len; i++ ) {
			var element = slides[i];

			// Resets all transforms to use the external styles
			element.style.WebkitTransform = '';
			element.style.MozTransform = '';
			element.style.msTransform = '';
			element.style.OTransform = '';
			element.style.transform = '';

			element.removeEventListener( 'click', onOverviewSlideClicked );
		}

		slide();
	}

	/**
	 * Checks if the overview is currently active.
	 * 
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function overviewIsActive() {
		return dom.wrapper.classList.contains( 'overview' );
	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 */
	function onOverviewSlideClicked( event ) {
		// TODO There's a bug here where the event listeners are not 
		// removed after deactivating the overview.
		if( overviewIsActive() ) {
			event.preventDefault();

			deactivateOverview();

			indexh = this.getAttribute( 'data-index-h' );
			indexv = this.getAttribute( 'data-index-v' );

			slide();
		}
	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 * 
	 * @param {String} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {Number} index The index of the slide that should be
	 * shown
	 * 
	 * @return {Number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of 
	 * bounds.
	 */
	function updateSlides( selector, index ) {
		
		// Select all slides and convert the NodeList result to
		// an array
		var slides = Array.prototype.slice.call( document.querySelectorAll( selector ) ),
			slidesLength = slides.length;
		
		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}
			
			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );
			
			for( var i = 0; i < slidesLength; i++ ) {
				var slide = slides[i];

				// Optimization; hide all slides that are three or more steps 
				// away from the present slide
				if( overviewIsActive() === false ) {
					// The distance loops so that it measures 1 between the first
					// and last slides
					var distance = Math.abs( ( index - i ) % ( slidesLength - 3 ) ) || 0;

					slide.style.display = distance > 3 ? 'none' : 'block';
				}

				slides[i].classList.remove( 'past' );
				slides[i].classList.remove( 'present' );
				slides[i].classList.remove( 'future' );

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					slides[i].classList.add( 'past' );
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					slides[i].classList.add( 'future' );
				}

				// If this element contains vertical slides
				if( slide.querySelector( 'section' ) ) {
					slides[i].classList.add( 'stack' );
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}
		}
		else {
			// Since there are no slides we can't be anywhere beyond the 
			// zeroth index
			index = 0;
		}
		
		return index;
		
	}
	
	/**
	 * Updates the visual slides to represent the currently
	 * set indices. 
	 */
	function slide() {
		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, indexh );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, indexv );

		// Apply the new state
		stateLoop: for( var i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it 
			// did, we will avoid adding it repeatedly.
			for( var j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remaints of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		// Update progress if enabled
		if( config.progress ) {
			dom.progressbar.style.width = ( indexh / ( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ).length - 1 ) ) * window.innerWidth + 'px';
		}

		// Close the overview if it's active
		if( overviewIsActive() ) {
			activateOverview();
		}

		updateControls();
		
		clearTimeout( writeURLTimeout );
		writeURLTimeout = setTimeout( writeURL, 1500 );

		// Dispatch an event notifying observers of the change in slide
		dispatchEvent( 'slidechanged', {
			'indexh': indexh, 
			'indexv': indexv
		} );
	}

	/**
	 * Updates the state and link pointers of the controls.
	 */
	function updateControls() {
		var routes = availableRoutes();

		// Remove the 'enabled' class from all directions
		[ dom.controlsLeft, dom.controlsRight, dom.controlsUp, dom.controlsDown ].forEach( function( node ) {
			node.classList.remove( 'enabled' );
		} )

		if( routes.left ) dom.controlsLeft.classList.add( 'enabled' );
		if( routes.right ) dom.controlsRight.classList.add( 'enabled' );
		if( routes.up ) dom.controlsUp.classList.add( 'enabled' );
		if( routes.down ) dom.controlsDown.classList.add( 'enabled' );
	}

	/**
	 * Determine what available routes there are for navigation.
	 * 
	 * @return {Object} containing four booleans: left/right/up/down
	 */
	function availableRoutes() {
		var horizontalSlides = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );
		var verticalSlides = document.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		return {
			left: indexh > 0,
			right: indexh < horizontalSlides.length - 1,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};
	}
	
	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {
		// Break the hash down to separate components
		var bits = window.location.hash.slice(2).split('/');
		
		// Read the index components of the hash
		indexh = parseInt( bits[0] ) || 0 ;
		indexv = parseInt( bits[1] ) || 0 ;
		
		navigateTo( indexh, indexv );
	}
	
	/**
	 * Updates the page URL (hash) to reflect the current
	 * state. 
	 */
	function writeURL() {
		if( config.history ) {
			var url = '/';
			
			// Only include the minimum possible number of components in
			// the URL
			if( indexh > 0 || indexv > 0 ) url += indexh;
			if( indexv > 0 ) url += '/' + indexv;
			
			window.location.hash = url;
		}
	}

	/**
	 * Dispatches an event of the specified type from the 
	 * #reveal DOM element.
	 */
	function dispatchEvent( type, properties ) {
		var event = document.createEvent( "HTMLEvents", 1, 2 );
		event.initEvent( type, true, true );
		extend( event, properties );
		dom.wrapper.dispatchEvent( event );
	}

	/**
	 * Navigate to the next slide fragment.
	 * 
	 * @return {Boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {
		// Vertical slides:
		if( document.querySelector( VERTICAL_SLIDES_SELECTOR + '.present' ) ) {
			var verticalFragments = document.querySelectorAll( VERTICAL_SLIDES_SELECTOR + '.present .fragment:not(.visible)' );
			if( verticalFragments.length ) {
				verticalFragments[0].classList.add( 'visible' );
				return true;
			}
		}
		// Horizontal slides:
		else {
			var horizontalFragments = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.present .fragment:not(.visible)' );
			if( horizontalFragments.length ) {
				horizontalFragments[0].classList.add( 'visible' );
				return true;
			}
		}

		return false;
	}

	/**
	 * Navigate to the previous slide fragment.
	 * 
	 * @return {Boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function previousFragment() {
		// Vertical slides:
		if( document.querySelector( VERTICAL_SLIDES_SELECTOR + '.present' ) ) {
			var verticalFragments = document.querySelectorAll( VERTICAL_SLIDES_SELECTOR + '.present .fragment.visible' );
			if( verticalFragments.length ) {
				verticalFragments[ verticalFragments.length - 1 ].classList.remove( 'visible' );
				return true;
			}
		}
		// Horizontal slides:
		else {
			var horizontalFragments = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.present .fragment.visible' );
			if( horizontalFragments.length ) {
				horizontalFragments[ horizontalFragments.length - 1 ].classList.remove( 'visible' );
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Triggers a navigation to the specified indices.
	 * 
	 * @param {Number} h The horizontal index of the slide to show
	 * @param {Number} v The vertical index of the slide to show
	 */
	function navigateTo( h, v ) {
		indexh = h === undefined ? indexh : h;
		indexv = v === undefined ? indexv : v;
		
		slide();
	}
	
	function navigateLeft() {
		// Prioritize hiding fragments
		if( overviewIsActive() || previousFragment() === false ) {
			indexh --;
			indexv = 0;
			slide();
		}
	}
	function navigateRight() {
		// Prioritize revealing fragments
		if( overviewIsActive() || nextFragment() === false ) {
			indexh ++;
			indexv = 0;
			slide();
		}
	}
	function navigateUp() {
		// Prioritize hiding fragments
		if( overviewIsActive() || previousFragment() === false ) {
			indexv --;
			slide();
		}
	}
	function navigateDown() {
		// Prioritize revealing fragments
		if( overviewIsActive() || nextFragment() === false ) {
			indexv ++;
			slide();
		}
	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {
		// Prioritize revealing fragments
		if( previousFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide = document.querySelector( '#reveal .slides>section.past:nth-child(' + indexh + ')' );

				if( previousSlide ) {
					indexv = ( previousSlide.querySelectorAll('section').length + 1 ) || 0;
					indexh --;
					slide();
				}
			}
		}
	}

	/**
	 * Same as #navigatePrev() but navigates forwards.
	 */
	function navigateNext() {
		// Prioritize revealing fragments
		if( nextFragment() === false ) {
			availableRoutes().down ? navigateDown() : navigateRight();
		}
	}
	
	// Expose some methods publicly
	return {
		initialize: initialize,
		navigateTo: navigateTo,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			( dom.wrapper || document.querySelector( '#reveal' ) ).addEventListener( type, listener, useCapture );
		},
		removeEventListener: function( type, listener, useCapture ) {
			( dom.wrapper || document.querySelector( '#reveal' ) ).removeEventListener( type, listener, useCapture );
		}
	};
	
})();

