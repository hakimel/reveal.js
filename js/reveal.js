/*!
 * reveal.js 2.1 r36
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
var Reveal = (function(){

	'use strict';

	var HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
		VERTICAL_SLIDES_SELECTOR = '.reveal .slides>section.present>section',

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

			// Enable the slide overview mode
			overview: true,

			// Loop the presentation
			loop: false,

			// Number of milliseconds between automatically proceeding to the
			// next slide, disabled when set to 0, this value can be overwritten
			// by using a data-autoslide attribute on your slides
			autoSlide: 0,

			// Enable slide navigation via mouse wheel
			mouseWheel: true,

			// Apply a 3D roll to links on hover
			rollingLinks: true,

			// Transition style (see /css/theme)
			theme: null,

			// Transition style
			transition: 'default', // default/cube/page/concave/zoom/linear/none

			// Script dependencies to load
			dependencies: []
		},

		// Stores if the next slide should be shown automatically
		// after n milliseconds
		autoSlide = config.autoSlide,

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
			threshold: 80
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

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {
		// Cache references to key DOM elements
		dom.theme = document.querySelector( '#theme' );
		dom.wrapper = document.querySelector( '.reveal' );

		// Progress bar
		if( !dom.wrapper.querySelector( '.progress' ) && config.progress ) {
			var progressElement = document.createElement( 'div' );
			progressElement.classList.add( 'progress' );
			progressElement.innerHTML = '<span></span>';
			dom.wrapper.appendChild( progressElement );
		}

		// Arrow controls
		if( !dom.wrapper.querySelector( '.controls' ) && config.controls ) {
			var controlsElement = document.createElement( 'aside' );
			controlsElement.classList.add( 'controls' );
			controlsElement.innerHTML = '<div class="left"></div>' +
										'<div class="right"></div>' +
										'<div class="up"></div>' +
										'<div class="down"></div>';
			dom.wrapper.appendChild( controlsElement );
		}

		// Presentation background element
		if( !dom.wrapper.querySelector( '.state-background' ) ) {
			var backgroundElement = document.createElement( 'div' );
			backgroundElement.classList.add( 'state-background' );
			dom.wrapper.appendChild( backgroundElement );
		}

		// Overlay graphic which is displayed during the paused mode
		if( !dom.wrapper.querySelector( '.pause-overlay' ) ) {
			var pausedElement = document.createElement( 'div' );
			pausedElement.classList.add( 'pause-overlay' );
			dom.wrapper.appendChild( pausedElement );
		}

		// Cache references to elements
		dom.progress = document.querySelector( '.reveal .progress' );
		dom.progressbar = document.querySelector( '.reveal .progress span' );

		if ( config.controls ) {
			dom.controls = document.querySelector( '.reveal .controls' );
			dom.controlsLeft = document.querySelector( '.reveal .controls .left' );
			dom.controlsRight = document.querySelector( '.reveal .controls .right' );
			dom.controlsUp = document.querySelector( '.reveal .controls .up' );
			dom.controlsDown = document.querySelector( '.reveal .controls .down' );
		}
	}

	/**
	 * Hides the address bar if we're on a mobile device.
	 */
	function hideAddressBar() {
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
					head.ready( s.src.match( /([\w\d_\-]*)\.?[^\\\/]*$/i )[0], s.callback );
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
		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Subscribe to input
		addEventListeners();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( function() {
			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );
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

		// 3D links
		if( config.rollingLinks ) {
			linkify();
		}

		// Load the theme in the config, if it's not already loaded
		if( config.theme && dom.theme ) {
			var themeURL = dom.theme.getAttribute( 'href' );
			var themeFinder = /[^\/]*?(?=\.css)/;
			var themeName = themeURL.match(themeFinder)[0];

			if(  config.theme !== themeName ) {
				themeURL = themeURL.replace(themeFinder, config.theme);
				dom.theme.setAttribute( 'href', themeURL );
			}
		}
	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		document.addEventListener( 'touchend', onDocumentTouchEnd, false );
		window.addEventListener( 'hashchange', onWindowHashChange, false );

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
		}

		if ( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', preventAndForward( onProgressClick ), false );
		}

		if ( config.controls && dom.controls ) {
			dom.controlsLeft.addEventListener( 'click', preventAndForward( navigateLeft ), false );
			dom.controlsRight.addEventListener( 'click', preventAndForward( navigateRight ), false );
			dom.controlsUp.addEventListener( 'click', preventAndForward( navigateUp ), false );
			dom.controlsDown.addEventListener( 'click', preventAndForward( navigateDown ), false );
		}
	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {
		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
		document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', preventAndForward( onProgressClick ), false );
		}

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
			delegate.call( null, event );
		};
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
			}
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

		// Only proceed if enabled in config
		if( config.overview ) {

			dom.wrapper.classList.add( 'overview' );

			var horizontalSlides = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

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

				var verticalSlides = hslide.querySelectorAll( 'section' );

				for( var j = 0, len2 = verticalSlides.length; j < len2; j++ ) {
					var vslide = verticalSlides[j],
						vtransform = 'translate(0%, ' + ( ( j - ( i === indexh ? indexv : 0 ) ) * 105 ) + '%)';

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

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			dom.wrapper.classList.remove( 'overview' );

			// Select all slides
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
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} override Optional flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {
		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverviewActive() ? deactivateOverview() : activateOverview();
		}
	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverviewActive() {
		return dom.wrapper.classList.contains( 'overview' );
	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {
		var element = document.body;

		// Check which implementation is available
		var requestMethod = element.requestFullScreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullScreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}
	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {
		dom.wrapper.classList.add( 'paused' );
	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {
		dom.wrapper.classList.remove( 'paused' );
	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause() {
		if( isPaused() ) {
			resume();
		}
		else {
			pause();
		}
	}

	/**
	 * Checks if we are currently in the paused mode.
	 */
	function isPaused() {
		return dom.wrapper.classList.contains( 'paused' );
	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {int} h Horizontal index of the target slide
	 * @param {int} v Vertical index of the target slide
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

		// If the overview is active, re-activate it to update positions
		if( isOverviewActive() ) {
			activateOverview();
		}

		updateControls();

		// Update the URL hash after a delay since updating it mid-transition
		// is likely to cause visual lag
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
				var element = slides[i];

				// Optimization; hide all slides that are three or more steps
				// away from the present slide
				if( isOverviewActive() === false ) {
					// The distance loops so that it measures 1 between the first
					// and last slides
					var distance = Math.abs( ( index - i ) % ( slidesLength - 3 ) ) || 0;

					element.style.display = distance > 3 ? 'none' : 'block';
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
				if( element.querySelector( 'section' ) ) {
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

			// If this slide has a data-autoslide attribtue associated use this as
			// autoSlide value otherwise use the global configured time
			var slideAutoSlide = slides[index].getAttribute( 'data-autoslide' );
			if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide );
			} else {
				autoSlide = config.autoSlide
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
	 * Updates the state and link pointers of the controls.
	 */
	function updateControls() {
		if ( config.controls && dom.controls ) {

			var routes = availableRoutes();

			// Remove the 'enabled' class from all directions
			[ dom.controlsLeft, dom.controlsRight, dom.controlsUp, dom.controlsDown ].forEach( function( node ) {
				node.classList.remove( 'enabled' );
			} );

			// Add the 'enabled' class to the available routes
			if( routes.left ) dom.controlsLeft.classList.add( 'enabled' );
			if( routes.right ) dom.controlsRight.classList.add( 'enabled' );
			if( routes.up ) dom.controlsUp.classList.add( 'enabled' );
			if( routes.down ) dom.controlsDown.classList.add( 'enabled' );

		}
	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {Object} containing four booleans: left/right/up/down
	 */
	function availableRoutes() {
		var horizontalSlides = document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = document.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

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
		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if( isNaN( parseInt( bits[0], 10 ) ) && name.length ) {
			// Find the slide with the specified name
			var element = document.querySelector( '#' + name );

			if( element ) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices( element );
				slide( indices.h, indices.v );
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh, indexv );
			}
		}
		else {
			// Read the index components of the hash
			var h = parseInt( bits[0], 10 ) || 0,
				v = parseInt( bits[1], 10 ) || 0;

			slide( h, v );
		}
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
	 * Retrieves the h/v location of the current, or specified,
	 * slide.
	 *
	 * @param {HTMLElement} slide If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {Object} { h: <int>, v: <int> }
	 */
	function getIndices( slide ) {
		// By default, return the current indices
		var h = indexh,
			v = indexv;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			var isVertical = !!slide.parentNode.nodeName.match( /section/gi );
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = Array.prototype.slice.call( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( Array.prototype.slice.call( slide.parentNode.children ).indexOf( slide ), 0 );
			}
		}

		return { h: h, v: v };
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

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {
		clearTimeout( autoSlideTimeout );

		// Cue the next auto-slide if enabled
		if( autoSlide ) {
			autoSlideTimeout = setTimeout( navigateNext, autoSlide );
		}
	}

	function navigateLeft() {
		// Prioritize hiding fragments
		if( isOverviewActive() || previousFragment() === false ) {
			slide( indexh - 1, 0 );
		}
	}

	function navigateRight() {
		// Prioritize revealing fragments
		if( isOverviewActive() || nextFragment() === false ) {
			slide( indexh + 1, 0 );
		}
	}

	function navigateUp() {
		// Prioritize hiding fragments
		if( isOverviewActive() || previousFragment() === false ) {
			slide( indexh, indexv - 1 );
		}
	}

	function navigateDown() {
		// Prioritize revealing fragments
		if( isOverviewActive() || nextFragment() === false ) {
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


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//


	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {Object} event
	 */
	function onDocumentKeyDown( event ) {
		// Check if there's a focused element that could be using 
		// the keyboard
		var activeElement = document.activeElement;
    	var hasFocus = !!( document.activeElement && ( document.activeElement.type || document.activeElement.href || document.activeElement.contentEditable !== 'inherit' ) );

		// Disregard the event if there's a focused element or a 
		// keyboard modifier key is present
		if ( hasFocus || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) return;

		var triggered = true;

		switch( event.keyCode ) {
			// p, page up
			case 80: case 33: navigatePrev(); break;
			// n, page down
			case 78: case 34: navigateNext(); break;
			// h, left
			case 72: case 37: navigateLeft(); break;
			// l, right
			case 76: case 39: navigateRight(); break;
			// k, up
			case 75: case 38: navigateUp(); break;
			// j, down
			case 74: case 40: navigateDown(); break;
			// home
			case 36: slide( 0 ); break;
			// end
			case 35: slide( Number.MAX_VALUE ); break;
			// space
			case 32: isOverviewActive() ? deactivateOverview() : navigateNext(); break;
			// return
			case 13: isOverviewActive() ? deactivateOverview() : triggered = false; break;
			// b, period
			case 66: case 190: togglePause(); break;
			// f
			case 70: enterFullscreen(); break;
			default:
				triggered = false;
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
		if( event.touches.length === 2 && config.overview ) {
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
			if( event.touches.length === 2 && touch.startCount === 2 && config.overview ) {

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

				event.preventDefault();

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 && touch.startCount !== 2 ) {

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

				event.preventDefault();

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( navigator.userAgent.match( /android/gi ) ) {
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
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
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
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 */
	function onProgressClick( event ) {
		var slidesTotal = Array.prototype.slice.call( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).length;
		var slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		slide( slideIndex );
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
	 * Invoked when a slide is and we're in the overview.
	 */
	function onOverviewSlideClicked( event ) {
		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( isOverviewActive() ) {
			event.preventDefault();

			deactivateOverview();

			indexh = this.getAttribute( 'data-index-h' );
			indexv = this.getAttribute( 'data-index-v' );

			slide();
		}
	}


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	return {
		initialize: initialize,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide;
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