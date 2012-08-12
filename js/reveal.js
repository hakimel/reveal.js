/*!
 * reveal.js 2.0 r18
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 * 
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
var Reveal = (function(){
	
	var HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
		VERTICAL_SLIDES_SELECTOR = '.reveal .slides>section.present>section',

		IS_TOUCH_DEVICE = !!( 'ontouchstart' in window ),

		// Configurations defaults, can be overridden at initialization time 
		config = {
			// Display controls in the bottom right corner
			controls: true,

			// Display a presentation progress bar
			progress: true,

			// Push each slide change to the browser history
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Loop the presentation
			loop: false,

			// Number of milliseconds between automatically proceeding to the 
			// next slide, disabled when set to 0
			autoSlide: 0,

			// Enable slide navigation via mouse wheel
			mouseWheel: true,

			// Apply a 3D roll to links on hover
			rollingLinks: true,

			// Transition style
			transition: 'default', // default/cube/page/concave/linear(2d),

			// Script dependencies to load
			dependencies: []
		},

		// The horizontal and verical index of the currently active slide
		indexh = 0,
		indexv = 0,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		// Slides may hold a data-state attribute which we pick up and apply 
		// as a class to the body. This list contains the combined state of 
		// all current slides.
		state = [],

		// Cached references to DOM elements
		dom = {},

		// Detect support for CSS 3D transforms
		supports3DTransforms =  'WebkitPerspective' in document.body.style ||
                        		'MozPerspective' in document.body.style ||
                        		'msPerspective' in document.body.style ||
                        		'OPerspective' in document.body.style ||
                        		'perspective' in document.body.style,
        
        supports2DTransforms =  'WebkitTransform' in document.body.style ||
                        		'MozTransform' in document.body.style ||
                        		'msTransform' in document.body.style ||
                        		'OTransform' in document.body.style ||
                        		'transform' in document.body.style,
		
		// Throttles mouse wheel navigation
		mouseWheelTimeout = 0,

		// An interval used to automatically move on to the next slide
		autoSlideTimeout = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startSpan: 0,
			startCount: 0,
			handled: false,
			threshold: 40
		};
	
	
	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {
		if( ( !supports2DTransforms && !supports3DTransforms ) ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// If the browser doesn't support core features we won't be 
			// using JavaScript to control the presentation
			return;
		}

		// Copy options over to our config object
		extend( config, options );

		// Cache references to DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.progress = document.querySelector( '.reveal .progress' );
		dom.progressbar = document.querySelector( '.reveal .progress span' );

		if ( config.controls ) {
			dom.controls = document.querySelector( '.reveal .controls' );
			dom.controlsLeft = document.querySelector( '.reveal .controls .left' );
			dom.controlsRight = document.querySelector( '.reveal .controls .right' );
			dom.controlsUp = document.querySelector( '.reveal .controls .up' );
			dom.controlsDown = document.querySelector( '.reveal .controls .down' );
		}

		// Loads the dependencies and continues to #start() once done
		load();

		// Set up hiding of the browser address bar
		if( navigator.userAgent.match( /(iphone|ipod|android)/i ) ) {
			// Give the page some scrollable overflow
			document.documentElement.style.overflow = 'scroll';
			document.body.style.height = '120%';

			// Events that should trigger the address bar to hide
			window.addEventListener( 'load', removeAddressBar, false );
			window.addEventListener( 'orientationchange', removeAddressBar, false );
		}
		
	}

	/**
	 * Loads the dependencies of reveal.js. Dependencies are 
	 * defined via the configuration option 'dependencies' 
	 * and will be loaded prior to starting/binding reveal.js. 
	 * Some dependencies may have an 'async' flag, if so they 
	 * will load after reveal.js has been started up.
	 */
	function load() {
		var scripts = [],
			scriptsAsync = [];

		for( var i = 0, len = config.dependencies.length; i < len; i++ ) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					scriptsAsync.push( s.src );
				}
				else {
					scripts.push( s.src );
				}

				// Extension may contain callback functions
				if( typeof s.callback === 'function' ) {
					head.ready( s.src.match( /([\w\d_-]*)\.?[^\\\/]*$/i )[0], s.callback );
				}
			}
		}

		// Called once synchronous scritps finish loading
		function proceed() {
			// Load asynchronous scripts
			head.js.apply( null, scriptsAsync );
			
			start();
		}

		if( scripts.length ) {
			head.ready( proceed );

			// Load synchronous scripts
			head.js.apply( null, scripts );
		}
		else {
			proceed();
		}
	}

	/**
	 * Starts up reveal.js by binding input events and navigating 
	 * to the current URL deeplink if there is one.
	 */
	function start() {
		// Subscribe to input
		addEventListeners();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Start auto-sliding if it's enabled
		cueAutoSlide();
	}

	/**
	 * Applies the configuration settings from the config object.
	 */
	function configure() {
		if( supports3DTransforms === false ) {
			config.transition = 'linear';
		}

		if( config.controls && dom.controls ) {
			dom.controls.style.display = 'block';
		}

		if( config.progress && dom.progress ) {
			dom.progress.style.display = 'block';
		}

		if( config.transition !== 'default' ) {
			dom.wrapper.classList.add( config.transition );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		if( config.rollingLinks ) {
			// Add some 3D magic to our anchors
			linkify();
		}
	}

	function addEventListeners() {
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		document.addEventListener( 'touchend', onDocumentTouchEnd, false );
		window.addEventListener( 'hashchange', onWindowHashChange, false );

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
		}

		if ( config.controls && dom.controls ) {
			dom.controlsLeft.addEventListener( 'click', preventAndForward( navigateLeft ), false );
			dom.controlsRight.addEventListener( 'click', preventAndForward( navigateRight ), false );
			dom.controlsUp.addEventListener( 'click', preventAndForward( navigateUp ), false );
			dom.controlsDown.addEventListener( 'click', preventAndForward( navigateDown ), false );	
		}
	}

	function removeEventListeners() {
		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
		document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		
		if ( config.controls && dom.controls ) {
			dom.controlsLeft.removeEventListener( 'click', preventAndForward( navigateLeft ), false );
			dom.controlsRight.removeEventListener( 'click', preventAndForward( navigateRight ), false );
			dom.controlsUp.removeEventListener( 'click', preventAndForward( navigateUp ), false );
			dom.controlsDown.removeEventListener( 'click', preventAndForward( navigateDown ), false );
		}
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
	 * Measures the distance in pixels between point a
	 * and point b. 
	 * 
	 * @param {Object} a point with x/y properties
	 * @param {Object} b point with x/y properties
	 */
	function distanceBetween( a, b ) {
		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );
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
	 * Causes the address bar to hide on mobile devices, 
	 * more vertical space ftw.
	 */
	function removeAddressBar() {
		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 0 );
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
			// n, page down
			case 78: case 34: navigateNext(); triggered = true; break;
			// h, left
			case 72: case 37: navigateLeft(); triggered = true; break;
			// l, right
			case 76: case 39: navigateRight(); triggered = true; break;
			// k, up
			case 75: case 38: navigateUp(); triggered = true; break;
			// j, down
			case 74: case 40: navigateDown(); triggered = true; break;
			// home
			case 36: navigateTo( 0 ); triggered = true; break;
			// end
			case 35: navigateTo( Number.MAX_VALUE ); triggered = true; break;
			// space
			case 32: overviewIsActive() ? deactivateOverview() : navigateNext(); triggered = true; break;
			// return
			case 13: if( overviewIsActive() ) { deactivateOverview(); triggered = true; } break;
		}

		// If the input resulted in a triggered action we should prevent 
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault();
		}
		else if ( event.keyCode === 27 && supports3DTransforms ) {
			toggleOverview();
	
			event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up 
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the document level 'touchstart' event,
	 * enables support for swipe and pinch gestures.
	 */
	function onDocumentTouchStart( event ) {
		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance 
		// between those two points to detect pinching
		if( event.touches.length === 2 ) {
			touch.startSpan = distanceBetween( {
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			} );
		}
	}
	
	/**
	 * Handler for the document level 'touchmove' event.
	 */
	function onDocumentTouchMove( event ) {
		// Each touch should only trigger one action
		if( !touch.handled ) {
			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started off with two points and still has 
			// two active touches; test for the pinch gesture
			if( event.touches.length === 2 && touch.startCount === 2 ) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween( {
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				} );

				// If the span is larger than the desire amount we've got 
				// ourselves a pinch
				if( Math.abs( touch.startSpan - currentSpan ) > touch.threshold ) {
					touch.handled = true;

					if( currentSpan < touch.startSpan ) {
						activateOverview();
					}
					else {
						deactivateOverview();
					}
				}

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 ) {
				var deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.handled = true;
					navigateLeft();
				} 
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.handled = true;
					navigateRight();
				} 
				else if( deltaY > touch.threshold ) {
					touch.handled = true;
					navigateUp();
				} 
				else if( deltaY < -touch.threshold ) {
					touch.handled = true;
					navigateDown();
				}
			}

			event.preventDefault();
		}
	}

	/**
	 * Handler for the document level 'touchend' event.
	 */
	function onDocumentTouchEnd( event ) {
		touch.handled = false;
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
		if( supports3DTransforms && !( 'msPerspective' in document.body.style ) ) {
        	var nodes = document.querySelectorAll( '.reveal .slides section a:not(.image)' );

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

		var slides = Array.prototype.slice.call( document.querySelectorAll( '.reveal .slides section' ) );

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
	function slide( h, v ) {
		// Remember where we were at before
		previousSlide = currentSlide;

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh,
			indexvBefore = indexv;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

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
		if( config.progress && dom.progress ) {
			dom.progressbar.style.width = ( indexh / ( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ).length - 1 ) ) * window.innerWidth + 'px';
		}

		// Close the overview if it's active
		if( overviewIsActive() ) {
			activateOverview();
		}

		updateControls();
		
		clearTimeout( writeURLTimeout );
		writeURLTimeout = setTimeout( writeURL, 1500 );

		// Query all horizontal slides in the deck
		var horizontalSlides = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Dispatch an event if the slide changed
		if( indexh !== indexhBefore || indexv !== indexvBefore ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh, 
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide
			} );
		}
		else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the 
		// 'present' class when navigating between adjacent vertical 
		// stacks
		if( previousSlide ) {
			previousSlide.classList.remove( 'present' );
		}
	}

	/**
	 * Updates the state and link pointers of the controls.
	 */
	function updateControls() {
		if ( !config.controls || !dom.controls ) {
			return;
		}
		
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
		var h = parseInt( bits[0] ) || 0 ;
		var v = parseInt( bits[1] ) || 0 ;

		navigateTo( h, v );
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
	 * reveal DOM element.
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

				// Notify subscribers of the change
				dispatchEvent( 'fragmentshown', { fragment: verticalFragments[0] } );
				return true;
			}
		}
		// Horizontal slides:
		else {
			var horizontalFragments = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.present .fragment:not(.visible)' );
			if( horizontalFragments.length ) {
				horizontalFragments[0].classList.add( 'visible' );

				// Notify subscribers of the change
				dispatchEvent( 'fragmentshown', { fragment: horizontalFragments[0] } );
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

				// Notify subscribers of the change
				dispatchEvent( 'fragmenthidden', { fragment: verticalFragments[ verticalFragments.length - 1 ] } );
				return true;
			}
		}
		// Horizontal slides:
		else {
			var horizontalFragments = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.present .fragment.visible' );
			if( horizontalFragments.length ) {
				horizontalFragments[ horizontalFragments.length - 1 ].classList.remove( 'visible' );

				// Notify subscribers of the change
				dispatchEvent( 'fragmenthidden', { fragment: horizontalFragments[ horizontalFragments.length - 1 ] } );
				return true;
			}
		}
		
		return false;
	}

	function cueAutoSlide() {
		clearTimeout( autoSlideTimeout );

		// Cue the next auto-slide if enabled
		if( config.autoSlide ) {
			autoSlideTimeout = setTimeout( navigateNext, config.autoSlide );
		}
	}
	
	/**
	 * Triggers a navigation to the specified indices.
	 * 
	 * @param {Number} h The horizontal index of the slide to show
	 * @param {Number} v The vertical index of the slide to show
	 */
	function navigateTo( h, v ) {
		slide( h, v );
	}
	
	function navigateLeft() {
		// Prioritize hiding fragments
		if( overviewIsActive() || previousFragment() === false ) {
			slide( indexh - 1, 0 );
		}
	}
	function navigateRight() {
		// Prioritize revealing fragments
		if( overviewIsActive() || nextFragment() === false ) {
			slide( indexh + 1, 0 );
		}
	}
	function navigateUp() {
		// Prioritize hiding fragments
		if( overviewIsActive() || previousFragment() === false ) {
			slide( indexh, indexv - 1 );
		}
	}
	function navigateDown() {
		// Prioritize revealing fragments
		if( overviewIsActive() || nextFragment() === false ) {
			slide( indexh, indexv + 1 );
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
				var previousSlide = document.querySelector( '.reveal .slides>section.past:nth-child(' + indexh + ')' );

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

		// If auto-sliding is enabled we need to cue up 
		// another timeout
		cueAutoSlide();
	}

	/**
	 * Toggles the slide overview mode on and off.
	 */
	function toggleOverview() {
		if( overviewIsActive() ) {
			deactivateOverview();
		}
		else {
			activateOverview();
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
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,
		toggleOverview: toggleOverview,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Returns the indices of the current slide
		getIndices: function() {
			return { 
				h: indexh, 
				v: indexv 
			};
		},

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function() {
			var query = {};

			location.search.replace( /[A-Z0-9]+?=(\w*)/gi, function(a) {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			return query;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).removeEventListener( type, listener, useCapture );
			}
		}
	};
	
})();

