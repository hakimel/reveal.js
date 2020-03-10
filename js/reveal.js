import SlideContent from './controllers/slidecontent.js'
import AutoAnimate from './controllers/autoanimate.js'
import Fragments from './controllers/fragments.js'
import Overview from './controllers/overview.js'
import Keyboard from './controllers/keyboard.js'
import Plugins from './controllers/plugins.js'
import Playback from './components/playback.js'
import defaultConfig from './config.js'
import {
	SLIDES_SELECTOR,
	HORIZONTAL_SLIDES_SELECTOR,
	VERTICAL_SLIDES_SELECTOR,
	POST_MESSAGE_METHOD_BLACKLIST
} from './utils/constants.js'
import {
	extend,
	toArray,
	distanceBetween,
	deserialize,
	transformElement,
	createStyleSheet,
	closestParent,
	enterFullscreen,
	getQueryHash
} from './utils/util.js'
import { isMobile, isChrome, isAndroid, supportsZoom } from './utils/device.js'
import { colorToRgb, colorBrightness } from './utils/color.js'

/**
 * reveal.js
 * http://revealjs.com
 * MIT licensed
 *
 * Copyright (C) 2020 Hakim El Hattab, https://hakim.se
 */
export default function( revealElement, options ) {

	const Reveal = {};

	// The reveal.js version
	const VERSION = '4.0.0-dev';

	// Configuration defaults, can be overridden at initialization time
	let config,

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		ready = false,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Remember which directions that the user has navigated towards
		hasNavigatedHorizontally = false,
		hasNavigatedVertically = false,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// Controller for plugin loading
		plugins = new Plugins(),

		// Controls loading and playback of slide content
		slideContent = new SlideContent( Reveal ),

		// Controls auto-animations between slides
		autoAnimate = new AutoAnimate( Reveal ),

		// Controls navigation between slide fragments
		fragments = new Fragments( Reveal ),

		// Controls the birds-eye overview of slides
		overview = new Overview( Reveal ),

		// Controls all keyboard interactions
		keyboard = new Keyboard( Reveal ),

		// List of asynchronously loaded reveal.js dependencies
		asyncDependencies = [],

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Is the mouse pointer currently hidden from view
		cursorHidden = false,

		// Timeout used to determine when the cursor is inactive
		cursorInactiveTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize() {

		if( !revealElement ) {
			console.warn( 'reveal.js can not initialize without a valid .reveal element.' );
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = revealElement;
		dom.slides = revealElement.querySelector( '.slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		// Copy options over to our config object
		config = { ...defaultConfig, ...options, ...getQueryHash() };

		// Load plugins then move on to #start()
		plugins.load( config.dependencies ).then( start )

		return new Promise( resolve => Reveal.addEventListener( 'ready', resolve ) );

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		ready = true;

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( () => {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			dom.wrapper.classList.add( 'ready' );

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		if( isMobile ) {
			dom.wrapper.classList.add( 'no-hover' );
		}
		else {
			dom.wrapper.classList.remove( 'no-hover' );
		}

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		dom.controls = createSingletonNode( dom.wrapper, 'aside', 'controls',
			`<button class="navigate-left" aria-label="${ config.rtl ? 'next slide' : 'previous slide' }"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${ config.rtl ? 'previous slide' : 'next slide' }"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>` );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );
		dom.speakerNotes.setAttribute( 'tabindex', '0' );

		// Overlay graphic which is displayed during the paused mode
		dom.pauseOverlay = createSingletonNode( dom.wrapper, 'div', 'pause-overlay', config.controls ? '<button class="resume-button">Resume presentation</button>' : null );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( dom.wrapper.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( dom.wrapper.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( dom.wrapper.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( dom.wrapper.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( dom.wrapper.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( dom.wrapper.querySelectorAll( '.navigate-next' ) );

		// The left, right and down arrows in the standard reveal.js controls
		dom.controlsRightArrow = dom.controls.querySelector( '.navigate-right' );
		dom.controlsLeftArrow = dom.controls.querySelector( '.navigate-left' );
		dom.controlsDownArrow = dom.controls.querySelector( '.navigate-down' );

		dom.statusElement = createStatusElement();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 *
	 * @return {HTMLElement}
	 */
	function createStatusElement() {

		let statusElement = dom.wrapper.querySelector( '.aria-status' );
		if( !statusElement ) {
			statusElement = document.createElement( 'div' );
			statusElement.style.position = 'absolute';
			statusElement.style.height = '1px';
			statusElement.style.width = '1px';
			statusElement.style.overflow = 'hidden';
			statusElement.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusElement.classList.add( 'aria-status' );
			statusElement.setAttribute( 'aria-live', 'polite' );
			statusElement.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusElement );
		}
		return statusElement;

	}

	/**
	 * Announces the given text to screen readers.
	 */
	function announceStatus( value ) {

		dom.statusElement.textContent = value;

	}

	/**
	 * Converts the given HTML element into a string of text
	 * that can be announced to a screen reader. Hidden
	 * elements are excluded.
	 */
	function getStatusText( node ) {

		let text = '';

		// Text node
		if( node.nodeType === 3 ) {
			text += node.textContent;
		}
		// Element node
		else if( node.nodeType === 1 ) {

			let isAriaHidden = node.getAttribute( 'aria-hidden' );
			let isDisplayHidden = window.getComputedStyle( node )['display'] === 'none';
			if( isAriaHidden !== 'true' && !isDisplayHidden ) {

				toArray( node.childNodes ).forEach( child => {
					text += getStatusText( child );
				} );

			}

		}

		text = text.trim();

		return text === '' ? '' : text + ' ';

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		let slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		let pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		let slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		createStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0px;}' );

		// Limit the size of certain elements to the dimensions of the slide
		createStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Make sure stretch elements fit on slide
		layoutSlideContents( slideWidth, slideHeight );

		// Compute slide numbers now, before we start duplicating slides
		let doingSlideNumbers = config.slideNumber && /all|print/i.test( config.showSlideNumber );
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
			slide.setAttribute( 'data-slide-number', getSlideNumber( slide ) );
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				let left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				let contentHeight = slide.scrollHeight;
				let numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				let page = document.createElement( 'div' );
				page.className = 'pdf-page';
				page.style.height = ( ( pageHeight + config.pdfPageHeightOffset ) * numberOfPages ) + 'px';
				slide.parentNode.insertBefore( page, slide );
				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					let notes = getSlideNotes( slide );
					if( notes ) {

						let notesSpacing = 8;
						let notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						let notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							page.parentNode.insertBefore( notesElement, page.nextSibling );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( doingSlideNumbers ) {
					let numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = slide.getAttribute( 'data-slide-number' );
					page.appendChild( numberElement );
				}

				// Copy page and show fragments one after another
				if( config.pdfSeparateFragments ) {

					// Each fragment 'group' is an array containing one or more
					// fragments. Multiple fragments that appear at the same time
					// are part of the same group.
					let fragmentGroups = fragments.sort( page.querySelectorAll( '.fragment' ), true );

					let previousFragmentStep;
					let previousPage;

					fragmentGroups.forEach( function( fragments ) {

						// Remove 'current-fragment' from the previous group
						if( previousFragmentStep ) {
							previousFragmentStep.forEach( function( fragment ) {
								fragment.classList.remove( 'current-fragment' );
							} );
						}

						// Show the fragments for the current index
						fragments.forEach( function( fragment ) {
							fragment.classList.add( 'visible', 'current-fragment' );
						} );

						// Create a separate page for the current fragment state
						let clonedPage = page.cloneNode( true );
						page.parentNode.insertBefore( clonedPage, ( previousPage || page ).nextSibling );

						previousFragmentStep = fragments;
						previousPage = clonedPage;

					} );

					// Reset the first/original page so that all fragments are hidden
					fragmentGroups.forEach( function( fragments ) {
						fragments.forEach( function( fragment ) {
							fragment.classList.remove( 'visible', 'current-fragment' );
						} );
					} );

				}
				// Show all fragments
				else {
					toArray( page.querySelectorAll( '.fragment:not(.fade-out)' ) ).forEach( function( fragment ) {
						fragment.classList.add( 'visible' );
					} );
				}

			}

		} );

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent( 'pdf-ready' );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( () => {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createSingletonNode( container, tagname, classname, innerHTML='' ) {

		// Find all nodes matching the description
		let nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( let i = 0; i < nodes.length; i++ ) {
			let testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		let node = document.createElement( tagname );
		node.className = classname;
		node.innerHTML = innerHTML;
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		let printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( slideh => {

			let backgroundStack = createBackground( slideh, dom.background );

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( slidev => {

				createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;
			dom.background.style.backgroundRepeat = config.parallaxBackgroundRepeat;
			dom.background.style.backgroundPosition = config.parallaxBackgroundPosition;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( () => {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 * @return {HTMLElement} New background div
	 */
	function createBackground( slide, container ) {

		// Main slide background element
		let element = document.createElement( 'div' );
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		// Inner background element that wraps images/videos/iframes
		let contentElement = document.createElement( 'div' );
		contentElement.className = 'slide-background-content';

		element.appendChild( contentElement );
		container.appendChild( element );

		slide.slideBackgroundElement = element;
		slide.slideBackgroundContentElement = contentElement;

		// Syncs the background to reflect all current background settings
		syncBackground( slide );

		return element;

	}

	/**
	 * Renders all of the visual properties of a slide background
	 * based on the various background attributes.
	 *
	 * @param {HTMLElement} slide
	 */
	function syncBackground( slide ) {

		let element = slide.slideBackgroundElement,
			contentElement = slide.slideBackgroundContentElement;

		// Reset the prior background state in case this is not the
		// initial sync
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		element.removeAttribute( 'data-loaded' );
		element.removeAttribute( 'data-background-hash' );
		element.removeAttribute( 'data-background-size' );
		element.removeAttribute( 'data-background-transition' );
		element.style.backgroundColor = '';

		contentElement.style.backgroundSize = '';
		contentElement.style.backgroundRepeat = '';
		contentElement.style.backgroundPosition = '';
		contentElement.style.backgroundImage = '';
		contentElement.style.opacity = '';
		contentElement.innerHTML = '';

		let data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' ),
			backgroundOpacity: slide.getAttribute( 'data-background-opacity' )
		};

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)([?#\s]|$)/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition +
															data.backgroundOpacity );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.setAttribute( 'data-background-size', data.backgroundSize );
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		if( slide.hasAttribute( 'data-preload' ) ) element.setAttribute( 'data-preload', '' );

		// Background image options are set on the content wrapper
		if( data.backgroundSize ) contentElement.style.backgroundSize = data.backgroundSize;
		if( data.backgroundRepeat ) contentElement.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) contentElement.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundOpacity ) contentElement.style.opacity = data.backgroundOpacity;

		// If this slide has a background color, we add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be added
		let contrastColor = data.backgroundColor;

		// If no bg color was found, check the computed background
		if( !contrastColor ) {
			let computedBackgroundStyle = window.getComputedStyle( element );
			if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
				contrastColor = computedBackgroundStyle.backgroundColor;
			}
		}

		if( contrastColor ) {
			let rgb = colorToRgb( contrastColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( contrastColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', event => {
				let data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {

						if( POST_MESSAGE_METHOD_BLACKLIST.test( data.method ) === false ) {

							const result = Reveal[data.method].apply( Reveal, data.args );

							// Dispatch a postMessage event with the returned value from
							// our method invocation for getter functions
							dispatchPostMessage( 'callback', { method: data.method, result: result } );

						}
						else {
							console.warn( 'reveal.js: "'+ data.method +'" is is blacklisted from the postMessage API' );
						}

					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 *
	 * @param {object} options
	 */
	function configure( options ) {

		const oldTransition = config.transition;

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Abort if reveal.js hasn't finished loading, config
		// changes will be applied automatically once ready
		if( Reveal.isReady() ===  false ) return;

		const numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		// Remove the previously configured transition class
		dom.wrapper.classList.remove( oldTransition );

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';

		dom.controls.setAttribute( 'data-controls-layout', config.controlsLayout );
		dom.controls.setAttribute( 'data-controls-back-arrows', config.controlsBackArrows );

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Auto-hide the mouse pointer when its inactive
		if( config.hideInactiveCursor ) {
			document.addEventListener( 'mousemove', onDocumentCursorActive, false );
			document.addEventListener( 'mousedown', onDocumentCursorActive, false );
		}
		else {
			showCursor();

			document.removeEventListener( 'mousemove', onDocumentCursorActive, false );
			document.removeEventListener( 'mousedown', onDocumentCursorActive, false );
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
			disablePreviewLinks( '[data-preview-link=false]' );
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]:not([data-preview-link=false])' );
		}

		// Reset all changes made by auto-animations
		autoAnimate.reset();

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable ) {
			autoSlidePlayer = new Playback( dom.wrapper, () => {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			fragments.showAll();
		}

		// Slide numbers
		let slideNumberDisplay = 'none';
		if( config.slideNumber && !isPrintingPDF() ) {
			if( config.showSlideNumber === 'all' ) {
				slideNumberDisplay = 'block';
			}
			else if( config.showSlideNumber === 'speaker' && isSpeakerNotes() ) {
				slideNumberDisplay = 'block';
			}
		}

		dom.slideNumber.style.display = slideNumberDisplay;

		// Add the navigation mode to the DOM so we can adjust styling
		if( config.navigationMode !== 'default' ) {
			dom.wrapper.setAttribute( 'data-navigation-mode', config.navigationMode );
		}
		else {
			dom.wrapper.removeAttribute( 'data-navigation-mode' );
		}

		keyboard.refreshSortcuts();

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			if( 'onpointerdown' in window ) {
				// Use W3C pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
			else {
				// Fall back to touch events
				dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
				dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
				dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );
			}
		}

		if( config.keyboard ) {
			keyboard.bind();
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		dom.pauseOverlay.addEventListener( 'click', resume, false );

		if( config.focusBodyOnPageVisibilityChange ) {
			document.addEventListener( 'visibilitychange', onPageVisibilityChange, false );
		}

		// Listen to both touch and click events, in case the device
		// supports both
		let pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( isAndroid ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( eventName => {
			dom.controlsLeft.forEach( el => el.addEventListener( eventName, onNavigateLeftClicked, false ) );
			dom.controlsRight.forEach( el => el.addEventListener( eventName, onNavigateRightClicked, false ) );
			dom.controlsUp.forEach( el => el.addEventListener( eventName, onNavigateUpClicked, false ) );
			dom.controlsDown.forEach( el => el.addEventListener( eventName, onNavigateDownClicked, false ) );
			dom.controlsPrev.forEach( el => el.addEventListener( eventName, onNavigatePrevClicked, false ) );
			dom.controlsNext.forEach( el => el.addEventListener( eventName, onNavigateNextClicked, false ) );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		keyboard.unbind();

		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
		dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
		dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );

		dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
		dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
		dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		dom.pauseOverlay.removeEventListener( 'click', resume, false );

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( eventName => {
			dom.controlsLeft.forEach( el => el.removeEventListener( eventName, onNavigateLeftClicked, false ) );
			dom.controlsRight.forEach( el => el.removeEventListener( eventName, onNavigateRightClicked, false ) );
			dom.controlsUp.forEach( el => el.removeEventListener( eventName, onNavigateUpClicked, false ) );
			dom.controlsDown.forEach( el => el.removeEventListener( eventName, onNavigateDownClicked, false ) );
			dom.controlsPrev.forEach( el => el.removeEventListener( eventName, onNavigatePrevClicked, false ) );
			dom.controlsNext.forEach( el => el.removeEventListener( eventName, onNavigateNextClicked, false ) );
		} );

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 *
	 * @param {object} transforms
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 *
	 * @param {HTMLElement} element
	 * @param {number} [height]
	 */
	function getRemainingHeight( element, height = 0 ) {

		if( element ) {
			let newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';

			// In Overview mode, the parent (.slide) height is set of 700px.
			// Restore it temporarily to its natural height.
			element.parentNode.style.height = 'auto';

			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			// Clear the parent (.slide) height. .removeProperty works in IE9+
			element.parentNode.style.removeProperty('height');

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		let event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		dispatchPostMessage( type );

	}

	/**
	 * Dispatched a postMessage of the given type from our window.
	 */
	function dispatchPostMessage( type, data ) {

		if( config.postMessageEvents && window.parent !== window.self ) {
			let message = {
				namespace: 'reveal',
				eventName: type,
				state: getState()
			};

			extend( message, data );

			window.parent.postMessage( JSON.stringify( message ), '*' );
		}

	}

	/**
	 * Bind preview frame links.
	 *
	 * @param {string} [selector=a] - selector for anchors
	 */
	function enablePreviewLinks( selector = 'a' ) {

		toArray( dom.wrapper.querySelectorAll( selector ) ).forEach( element => {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks( selector = 'a' ) {

		toArray( dom.wrapper.querySelectorAll( selector ) ).forEach( element => {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML =
			`<header>
				<a class="close" href="#"><span class="icon"></span></a>
				<a class="external" href="${url}" target="_blank"><span class="icon"></span></a>
			</header>
			<div class="spinner"></div>
			<div class="viewport">
				<iframe src="${url}"></iframe>
				<small class="viewport-inner">
					<span class="x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`;

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', event => {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', event => {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', event => {
			closeOverlay();
		}, false );

	}

	/**
	 * Open or close help overlay window.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * help is open, false means it's closed.
	 */
	function toggleHelp( override ){

		if( typeof override === 'boolean' ) {
			override ? showHelp() : closeOverlay();
		}
		else {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp();
			}
		}
	}

	/**
	 * Opens an overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			let html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( let key in keyboard.shortcuts ) {
				html += `<tr><td>${key}</td><td>${keyboard.shortcuts[ key ]}</td></tr>`;
			}

			// Add custom key bindings that have associated descriptions
			for( let binding in keyboard.registeredKeyBindings ) {
				if( keyboard.registeredKeyBindings[binding].key && keyboard.registeredKeyBindings[binding].description ) {
					html += `<tr><td>${keyboard.registeredKeyBindings[binding].key}</td><td>${keyboard.registeredKeyBindings[binding].description}</td></tr>`;
				}
			}

			html += '</table>';

			dom.overlay.innerHTML = `
				<header>
					<a class="close" href="#"><span class="icon"></span></a>
				</header>
				<div class="viewport">
					<div class="viewport-inner">${html}</div>
				</div>
			`;

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', event => {
				closeOverlay();
				event.preventDefault();
			}, false );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
			return true;
		}

		return false;

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			if( !config.disableLayout ) {

				// On some mobile devices '100vh' is taller than the visible
				// viewport which leads to part of the presentation being
				// cut off. To work around this we define our own '--vh' custom
				// property where 100x adds up to the correct height.
				//
				// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
				if( isMobile ) {
					document.documentElement.style.setProperty( '--vh', ( window.innerHeight * 0.01 ) + 'px' );
				}

				const size = getComputedSlideSize();

				const oldScale = scale;

				// Layout the contents of the slides
				layoutSlideContents( config.width, config.height );

				dom.slides.style.width = size.width + 'px';
				dom.slides.style.height = size.height + 'px';

				// Determine scale of content to fit within available space
				scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

				// Respect max/min scale settings
				scale = Math.max( scale, config.minScale );
				scale = Math.min( scale, config.maxScale );

				// Don't apply any scaling styles if scale is 1
				if( scale === 1 ) {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				else {
					// Zoom Scaling
					// Content remains crisp no matter how much we scale. Side
					// effects are minor differences in text layout and iframe
					// viewports changing size. A 200x200 iframe viewport in a
					// 2x zoomed presentation ends up having a 400x400 viewport.
					if( scale > 1 && supportsZoom && window.devicePixelRatio < 2 ) {
						dom.slides.style.zoom = scale;
						dom.slides.style.left = '';
						dom.slides.style.top = '';
						dom.slides.style.bottom = '';
						dom.slides.style.right = '';
						transformSlides( { layout: '' } );
					}
					// Transform Scaling
					// Content layout remains the exact same when scaled up.
					// Side effect is content becoming blurred, especially with
					// high scale values on ldpi screens.
					else {
						dom.slides.style.zoom = '';
						dom.slides.style.left = '50%';
						dom.slides.style.top = '50%';
						dom.slides.style.bottom = 'auto';
						dom.slides.style.right = 'auto';
						transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
					}
				}

				// Select all slides, vertical and horizontal
				const slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

				for( let i = 0, len = slides.length; i < len; i++ ) {
					const slide = slides[ i ];

					// Don't bother updating invisible slides
					if( slide.style.display === 'none' ) {
						continue;
					}

					if( config.center || slide.classList.contains( 'center' ) ) {
						// Vertical stacks are not centred since their section
						// children will be
						if( slide.classList.contains( 'stack' ) ) {
							slide.style.top = 0;
						}
						else {
							slide.style.top = Math.max( ( size.height - slide.scrollHeight ) / 2, 0 ) + 'px';
						}
					}
					else {
						slide.style.top = '';
					}

				}

				if( oldScale !== scale ) {
					dispatchEvent( 'resize', {
						'oldScale': oldScale,
						'scale': scale,
						'size': size
					} );
				}
			}

			updateProgress();
			updateParallax();

			if( overview.isActive() ) {
				overview.update();
			}

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 *
	 * @param {string|number} width
	 * @param {string|number} height
	 */
	function layoutSlideContents( width, height ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( element => {

			// Determine how much vertical space we can use
			let remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				const nw = element.naturalWidth || element.videoWidth,
					  nh = element.naturalHeight || element.videoHeight;

				const es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 *
	 * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
	 * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		const size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {string|number} [v=0] Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			const attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Return a hash URL that will resolve to the given slide location.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to link to
	 */
	function locationHash( slide ) {

		let url = '/';

		// Attempt to create a named link based on the slide's ID
		let s = slide || currentSlide;
		let id = s ? s.getAttribute( 'id' ) : null;
		if( id ) {
			id = encodeURIComponent( id );
		}

		let index = getIndices( slide );
		if( !config.fragmentInURL ) {
			index.f = undefined;
		}

		// If the current slide has an ID, use that as a named link,
		// but we don't support named links with a fragment index
		if( typeof id === 'string' && id.length && index.f === undefined ) {
			url = '/' + id;
		}
		// Otherwise use the /h/v index
		else {
			let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;
			if( index.h > 0 || index.v > 0 || index.f !== undefined ) url += index.h + hashIndexBase;
			if( index.v > 0 || index.f !== undefined ) url += '/' + (index.v + hashIndexBase );
			if( index.f !== undefined ) url += '/' + index.f;
		}

		return url;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to check
	 * orientation of
	 * @return {Boolean}
	 */
	function isVerticalSlide( slide = currentSlide ) {

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Returns true if we're on the last slide in the current
	 * vertical stack.
	 */
	function isLastVerticalSlide() {

		if( currentSlide && isVerticalSlide( currentSlide ) ) {
			// Does this slide have a next sibling?
			if( currentSlide.nextElementSibling ) return false;

			return true;
		}

		return false;

	}

	/**
	 * Returns true if we're currently on the first slide in
	 * the presentation.
	 */
	function isFirstSlide() {

		return indexh === 0 && indexv === 0;

	}

	/**
	 * Returns true if we're currently on the last slide in
	 * the presenation. If the last slide is a stack, we only
	 * consider this the last slide if it's at the end of the
	 * stack.
	 */
	function isLastSlide() {

		if( currentSlide ) {
			// Does this slide have a next sibling?
			if( currentSlide.nextElementSibling ) return false;

			// If it's vertical, does its parent have a next sibling?
			if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

			return true;
		}

		return false;

	}

	/**
	 * Shows the mouse pointer after it has been hidden with
	 * #hideCursor.
	 */
	function showCursor() {

		if( cursorHidden ) {
			cursorHidden = false;
			dom.wrapper.style.cursor = '';
		}

	}

	/**
	 * Hides the mouse pointer when it's on top of the .reveal
	 * container.
	 */
	function hideCursor() {

		if( cursorHidden === false ) {
			cursorHidden = true;
			dom.wrapper.style.cursor = 'none';
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			const wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		const wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 *
	 * @return {Boolean}
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} [override] Flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 *
	 * @return {Boolean}
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {number} [h=indexh] Horizontal index of the target slide
	 * @param {number} [v=indexv] Vertical index of the target slide
	 * @param {number} [f] Index of a fragment within the
	 * target slide to activate
	 * @param {number} [o] Origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		const horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Abort if there are no slides
		if( horizontalSlides.length === 0 ) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !overview.isActive() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		const stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		let indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Update the overview if it's currently active
		if( overview.isActive() ) {
			overview.update();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		let currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			fragments.goto( f );
		}

		// Dispatch an event if the slide changed
		let slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if (!slideChanged) {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide && previousSlide !== currentSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			if( isFirstSlide() ) {
				// Launch async task
				setTimeout( () => {
					getVerticalStacks().forEach( slide => {
						setPreviousVerticalIndex( slide, 0 );
					} );
				}, 0 );
			}
		}

		// Apply the new state
		stateLoop: for( let i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( let j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			slideContent.stopEmbeddedContent( previousSlide );
			slideContent.startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents to screen readers
		announceStatus( getStatusText( currentSlide ) );

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		fragments.update();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

		// Auto-animation
		if( slideChanged && previousSlide && currentSlide && !overview.isActive() ) {

			// Skip the slide transition between our two slides
			// when auto-animating individual elements
			if( previousSlide.hasAttribute( 'data-auto-animate' ) && currentSlide.hasAttribute( 'data-auto-animate' ) ) {
				dom.slides.classList.add( 'disable-slide-transitions' );

				setTimeout( () => {
					dom.slides.classList.remove( 'disable-slide-transitions' );
				}, 0 );

				if( config.autoAnimate ) {
					// Run the auto-animation between our slides
					autoAnimate.run( previousSlide, currentSlide );
				}
			}

		}

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		fragments.sortAll();

		updateControls();
		updateProgress();
		updateSlideNumber();
		updateSlidesVisibility();
		updateBackground( true );
		updateNotesVisibility();
		updateNotes();

		slideContent.formatEmbeddedContent();

		// Start or stop embedded content depending on global config
		if( config.autoPlayMedia === false ) {
			slideContent.stopEmbeddedContent( currentSlide, { unloadIframes: false } );
		}
		else {
			slideContent.startEmbeddedContent( currentSlide );
		}

		if( overview.isActive() ) {
			overview.layout();
		}

	}

	/**
	 * Updates reveal.js to keep in sync with new slide attributes. For
	 * example, if you add a new `data-background-image` you can call
	 * this to have reveal.js render the new background image.
	 *
	 * Similar to #sync() but more efficient when you only need to
	 * refresh a specific slide.
	 *
	 * @param {HTMLElement} slide
	 */
	function syncSlide( slide = currentSlide ) {

		syncBackground( slide );
		syncFragments( slide );

		slideContent.load( slide );

		updateBackground();
		updateNotes();

	}

	/**
	 * Formats the fragments on the given slide so that they have
	 * valid indices. Call this if fragments are changed in the DOM
	 * after reveal.js has already initialized.
	 *
	 * @param {HTMLElement} slide
	 * @return {Array} a list of the HTML fragments that were synced
	 */
	function syncFragments( slide = currentSlide ) {

		return config.sort( slide.querySelectorAll( '.fragment' ) );

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		getHorizontalSlides().forEach( horizontalSlide => {

			toArray( horizontalSlide.querySelectorAll( 'section' ) ).forEach( ( verticalSlide, y ) => {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		getHorizontalSlides().forEach( ( slide, i, slides ) => {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {string} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {number} index The index of the slide that should be
	 * shown
	 *
	 * @return {number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		let slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		let printMode = isPrintingPDF();

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

			for( let i = 0; i < slidesLength; i++ ) {
				let element = slides[i];

				let reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past', 'present', 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						// Show all fragments in prior slides
						toArray( element.querySelectorAll( '.fragment' ) ).forEach( fragment => {
							fragment.classList.add( 'visible' );
							fragment.classList.remove( 'current-fragment' );
						} );
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						// Hide all fragments in future slides
						toArray( element.querySelectorAll( '.fragment.visible' ) ).forEach( fragment => {
							fragment.classList.remove( 'visible', 'current-fragment' );
						} );
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			let slideState = slides[index].getAttribute( 'data-state' );
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
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		let horizontalSlides = getHorizontalSlides(),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			let viewDistance = overview.isActive() ? 10 : config.viewDistance;

			// Shorten the view distance on devices that typically have
			// less resources
			if( isMobile ) {
				viewDistance = overview.isActive() ? 6 : config.mobileViewDistance;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( let x = 0; x < horizontalSlidesLength; x++ ) {
				let horizontalSlide = horizontalSlides[x];

				let verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					slideContent.load( horizontalSlide );
				}
				else {
					slideContent.unload( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					let oy = getPreviousVerticalIndex( horizontalSlide );

					for( let y = 0; y < verticalSlidesLength; y++ ) {
						let verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							slideContent.load( verticalSlide );
						}
						else {
							slideContent.unload( verticalSlide );
						}
					}

				}
			}

			// Flag if there are ANY vertical slides, anywhere in the deck
			if( hasVerticalSlides() ) {
				dom.wrapper.classList.add( 'has-vertical-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-vertical-slides' );
			}

			// Flag if there are ANY horizontal slides, anywhere in the deck
			if( hasHorizontalSlides() ) {
				dom.wrapper.classList.add( 'has-horizontal-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-horizontal-slides' );
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';

		}

	}

	/**
	 * Updates the visibility of the speaker notes sidebar that
	 * is used to share annotated slides. The notes sidebar is
	 * only visible if showNotes is true and there are notes on
	 * one or more slides in the deck.
	 */
	function updateNotesVisibility() {

		if( config.showNotes && hasNotes() ) {
			dom.wrapper.classList.add( 'show-notes' );
		}
		else {
			dom.wrapper.classList.remove( 'show-notes' );
		}

	}

	/**
	 * Checks if there are speaker notes for ANY slide in the
	 * presentation.
	 */
	function hasNotes() {

		return dom.slides.querySelectorAll( '[data-notes], aside.notes' ).length > 0;

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}


	/**
	 * Updates the slide number to match the current slide.
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {
			dom.slideNumber.innerHTML = getSlideNumber();
		}

	}

	/**
	 * Returns the HTML string corresponding to the current slide number,
	 * including formatting.
	 */
	function getSlideNumber( slide = currentSlide ) {

		let value;
		let format = 'h.v';

		if ( typeof config.slideNumber === 'function' ) {
			value = config.slideNumber( slide );
		} else {
			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			// If there are ONLY vertical slides in this deck, always use
			// a flattened slide number
			if( !/c/.test( format ) && dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ).length === 1 ) {
				format = 'c';
			}

			value = [];
			switch( format ) {
				case 'c':
					value.push( getSlidePastCount( slide ) + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount( slide ) + 1, '/', getTotalSlides() );
					break;
				default:
					let indices = getIndices( slide );
					value.push( indices.h + 1 );
					let sep = format === 'h/v' ? '/' : '.';
					if( isVerticalSlide( slide ) ) value.push( sep, indices.v + 1 );
			}
		}

		let url = '#' + locationHash( slide );
		return formatSlideNumber( value[0], value[1], value[2], url );

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 *
	 * @param {number} a Current slide
	 * @param {string} delimiter Character to separate slide numbers
	 * @param {(number|*)} b Total slides
	 * @param {HTMLElement} [url='#'+locationHash()] The url to link to
	 * @return {string} HTML string fragment
	 */
	function formatSlideNumber( a, delimiter, b, url = '#' + locationHash() ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					<span class="slide-number-delimiter">${delimiter}</span>
					<span class="slide-number-b">${b}</span>
					</a>`;
		}
		else {
			return `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					</a>`;
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		let routes = availableRoutes();
		let fragmentsRoutes = fragments.availableRoutes();

		// Remove the 'enabled' class from all directions
		[...dom.controlsLeft, ...dom.controlsRight, ...dom.controlsUp, ...dom.controlsDown, ...dom.controlsPrev, ...dom.controlsNext].forEach( node => {
			node.classList.remove( 'enabled', 'fragmented' );

			// Set 'disabled' attribute on all directions
			node.setAttribute( 'disabled', 'disabled' );
		} );

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if( routes.left ) dom.controlsLeft.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right ) dom.controlsRight.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.down ) dom.controlsDown.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragmentsRoutes.prev ) dom.controlsPrev.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			if( fragmentsRoutes.next ) dom.controlsNext.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragmentsRoutes.prev ) dom.controlsUp.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragmentsRoutes.next ) dom.controlsDown.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}
			else {
				if( fragmentsRoutes.prev ) dom.controlsLeft.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragmentsRoutes.next ) dom.controlsRight.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}

		}

		if( config.controlsTutorial ) {

			// Highlight control arrows with an animation to ensure
			// that the viewer knows how to navigate
			if( !hasNavigatedVertically && routes.down ) {
				dom.controlsDownArrow.classList.add( 'highlight' );
			}
			else {
				dom.controlsDownArrow.classList.remove( 'highlight' );

				if( config.rtl ) {

					if( !hasNavigatedHorizontally && routes.left && indexv === 0 ) {
						dom.controlsLeftArrow.classList.add( 'highlight' );
					}
					else {
						dom.controlsLeftArrow.classList.remove( 'highlight' );
					}

				} else {

					if( !hasNavigatedHorizontally && routes.right && indexv === 0 ) {
						dom.controlsRightArrow.classList.add( 'highlight' );
					}
					else {
						dom.controlsRightArrow.classList.remove( 'highlight' );
					}
				}
			}
		}
	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll = false ) {

		let currentBackground = null;

		// Reverse past/future classes when in RTL mode
		let horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( ( backgroundh, h ) => {

			backgroundh.classList.remove( 'past', 'present', 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( ( backgroundv, v ) => {

					backgroundv.classList.remove( 'past', 'present', 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop content inside of previous backgrounds
		if( previousBackground ) {

			slideContent.stopEmbeddedContent( previousBackground, { unloadIframes: !slideContent.shouldPreload( previousBackground ) } );

		}

		// Start content in the current background
		if( currentBackground ) {

			slideContent.startEmbeddedContent( currentBackground );

			let currentBackgroundContent = currentBackground.querySelector( '.slide-background-content' );
			if( currentBackgroundContent ) {

				let backgroundImageURL = currentBackgroundContent.style.backgroundImage || '';

				// Restart GIFs (doesn't work in Firefox)
				if( /\.gif/i.test( backgroundImageURL ) ) {
					currentBackgroundContent.style.backgroundImage = '';
					window.getComputedStyle( currentBackgroundContent ).opacity;
					currentBackgroundContent.style.backgroundImage = backgroundImageURL;
				}

			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			let previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			let currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( classToBubble => {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( () => {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			let horizontalSlides = getHorizontalSlides(),
				verticalSlides = getVerticalSlides();

			let backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			let slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			let slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
	 */
	function availableRoutes() {

		let horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		let routes = {
			left: indexh > 0,
			right: indexh < horizontalSlides.length - 1,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// Looped presentations can always be navigated as long as
		// there are slides available
		if( config.loop ) {
			if( horizontalSlides.length > 1 ) {
				routes.left = true;
				routes.right = true;
			}

			if( verticalSlides.length > 1 ) {
				routes.up = true;
				routes.down = true;
			}
		}

		if ( horizontalSlides.length > 1 && config.navigationMode === 'linear' ) {
			routes.right = routes.right || routes.down;
			routes.left = routes.left || routes.up;
		}

		// Reverse horizontal controls for rtl
		if( config.rtl ) {
			let left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide we're counting before
	 *
	 * @return {number} Past slide count
	 */
	function getSlidePastCount( slide = currentSlide ) {

		let horizontalSlides = getHorizontalSlides();

		// The number of past slides
		let pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( let i = 0; i < horizontalSlides.length; i++ ) {

			let horizontalSlide = horizontalSlides[i];
			let verticalSlides = horizontalSlide.querySelectorAll( 'section' );

			for( let j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j] === slide ) {
					break mainLoop;
				}

				// Don't count slides with the "uncounted" class
				if( verticalSlides[j].dataset.visibility !== 'uncounted' ) {
					pastCount++;
				}

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide === slide ) {
				break;
			}

			// Don't count the wrapping section for vertical slides and
			// slides marked as uncounted
			if( horizontalSlide.classList.contains( 'stack' ) === false && !horizontalSlide.dataset.visibility !== 'uncounted' ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 *
	 * @return {number}
	 */
	function getProgress() {

		// The number of past and total slides
		let totalCount = getTotalSlides();
		let pastCount = getSlidePastCount();

		if( currentSlide ) {

			let allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				let visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				let fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return Math.min( pastCount / ( totalCount - 1 ), 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		let hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		let bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is not fully numeric and there is a name we
		// can assume that this is a named link
		if( !/^[0-9]*$/.test( bits[0] ) && name.length ) {
			let element;

			// Ensure the named link is a valid HTML ID attribute
			try {
				element = document.getElementById( decodeURIComponent( name ) );
			}
			catch ( error ) { }

			// Ensure that we're not already on a slide with the same name
			let isSameNameAsCurrentSlide = currentSlide ? currentSlide.getAttribute( 'id' ) === name : false;

			if( element ) {
				// If the slide exists and is not the current slide...
				if ( !isSameNameAsCurrentSlide ) {
					// ...find the position of the named slide and navigate to it
					let indices = Reveal.getIndices(element);
					slide(indices.h, indices.v);
				}
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;

			// Read the index components of the hash
			let h = ( parseInt( bits[0], 10 ) - hashIndexBase ) || 0,
				v = ( parseInt( bits[1], 10 ) - hashIndexBase ) || 0,
				f;

			if( config.fragmentInURL ) {
				f = parseInt( bits[2], 10 );
				if( isNaN( f ) ) {
					f = undefined;
				}
			}

			if( h !== indexh || v !== indexv || f !== undefined ) {
				slide( h, v, f );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		// Make sure there's never more than one timeout running
		clearTimeout( writeURLTimeout );

		// If a delay is specified, timeout this call
		if( typeof delay === 'number' ) {
			writeURLTimeout = setTimeout( writeURL, delay );
		}
		else if( currentSlide ) {
			// If we're configured to push to history OR the history
			// API is not avaialble.
			if( config.history || !window.history ) {
				window.location.hash = locationHash();
			}
			// If we're configured to reflect the current slide in the
			// URL without pushing to history.
			else if( config.hash ) {
				window.history.replaceState( null, null, '#' + locationHash() );
			}
			// If history and hash are both disabled, a hash may still
			// be added to the URL by clicking on a href with a hash
			// target. Counter this by always removing the hash.
			else {
				window.history.replaceState( null, null, window.location.pathname + window.location.search );
			}
		}

	}

	/**
	 * Retrieves the h/v location and fragment of the current,
	 * or specified, slide.
	 *
	 * @param {HTMLElement} [slide] If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {{h: number, v: number, f: number}}
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		let h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			let isVertical = isVerticalSlide( slide );
			let slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			let horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			let hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				let currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h, v, f };

	}

	/**
	 * Retrieves all slides in this presentation.
	 */
	function getSlides() {

		return toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack):not([data-visibility="uncounted"])' ) );

	}

	/**
	 * Returns a list of all horizontal slides in the deck. Each
	 * vertical stack is included as one horizontal slide in the
	 * resulting array.
	 */
	function getHorizontalSlides() {

		return toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

	}

	/**
	 * Returns all vertical slides that exist within this deck.
	 */
	function getVerticalSlides() {

		return toArray( dom.wrapper.querySelectorAll( '.slides>section>section' ) );

	}

	/**
	 * Returns all vertical stacks (each stack can contain multiple slides).
	 */
	function getVerticalStacks() {

		return toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') );

	}

	/**
	 * Returns true if there are at least two horizontal slides.
	 */
	function hasHorizontalSlides() {

		return getHorizontalSlides().length > 1;
	}

	/**
	 * Returns true if there are at least two vertical slides.
	 */
	function hasVerticalSlides() {

		return getVerticalSlides().length > 1;

	}

	/**
	 * Returns an array of objects where each object represents the
	 * attributes on its respective slide.
	 */
	function getSlidesAttributes() {

		return getSlides().map( slide => {

			let attributes = {};
			for( let i = 0; i < slide.attributes.length; i++ ) {
				let attribute = slide.attributes[ i ];
				attributes[ attribute.name ] = attribute.value;
			}
			return attributes;

		} );

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 *
	 * @return {number}
	 */
	function getTotalSlides() {

		return getSlides().length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 *
	 * @return {HTMLElement}
	 */
	function getSlide( x, y ) {

		let horizontalSlide = getHorizontalSlides()[ x ];
		let verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 *
	 * @param {mixed} x Horizontal background index OR a slide
	 * HTML element
	 * @param {number} y Vertical background index
	 * @return {(HTMLElement[]|*)}
	 */
	function getSlideBackground( x, y ) {

		let slide = typeof x === 'number' ? getSlide( x, y ) : x;
		if( slide ) {
			return slide.slideBackgroundElement;
		}

		return undefined;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	function getSlideNotes( slide = currentSlide ) {

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		let notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 *
	 * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
	 */
	function getState() {

		let indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: overview.isActive()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {object} state As generated by getState()
	 * @see {@link getState} generates the parameter `state`
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			let pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== overview.isActive() ) {
				overview.toggle( overviewFlag );
			}
		}

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide && config.autoSlide !== false ) {

			let fragment = currentSlide.querySelector( '.current-fragment' );

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if( !fragment ) fragment = currentSlide.querySelector( '.fragment' );

			let fragmentAutoSlide = fragment ? fragment.getAttribute( 'data-autoslide' ) : null;
			let parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			let slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments.
			// playbackRate is accounted for in the duration.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( el => {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && (el.duration * 1000 / el.playbackRate ) > autoSlide ) {
							autoSlide = ( el.duration * 1000 / el.playbackRate ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !overview.isActive() && ( !isLastSlide() || fragments.availableRoutes().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( () => {
					if( typeof config.autoSlideMethod === 'function' ) {
						config.autoSlideMethod()
					}
					else {
						navigateNext();
					}
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		hasNavigatedHorizontally = true;

		// Reverse for RTL
		if( config.rtl ) {
			if( ( overview.isActive() || fragments.next() === false ) && availableRoutes().left ) {
				slide( indexh + 1, config.navigationMode === 'grid' ? indexv : undefined );
			}
		}
		// Normal navigation
		else if( ( overview.isActive() || fragments.prev() === false ) && availableRoutes().left ) {
			slide( indexh - 1, config.navigationMode === 'grid' ? indexv : undefined );
		}

	}

	function navigateRight() {

		hasNavigatedHorizontally = true;

		// Reverse for RTL
		if( config.rtl ) {
			if( ( overview.isActive() || fragments.prev() === false ) && availableRoutes().right ) {
				slide( indexh - 1, config.navigationMode === 'grid' ? indexv : undefined );
			}
		}
		// Normal navigation
		else if( ( overview.isActive() || fragments.next() === false ) && availableRoutes().right ) {
			slide( indexh + 1, config.navigationMode === 'grid' ? indexv : undefined );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( overview.isActive() || fragments.prev() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		hasNavigatedVertically = true;

		// Prioritize revealing fragments
		if( ( overview.isActive() || fragments.next() === false ) && availableRoutes().down ) {
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
		if( fragments.prev() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				let previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					let v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					let h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		hasNavigatedHorizontally = true;
		hasNavigatedVertically = true;

		// Prioritize revealing fragments
		if( fragments.next() === false ) {

			let routes = availableRoutes();

			// When looping is enabled `routes.down` is always available
			// so we need a separate check for when we've reached the
			// end of a stack and should move horizontally
			if( routes.down && routes.right && config.loop && isLastVerticalSlide( currentSlide ) ) {
				routes.down = false;
			}

			if( routes.down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 *
	 * @param {object} [event]
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Called whenever there is mouse input at the document level
	 * to determine if the cursor is active or not.
	 *
	 * @param {object} event
	 */
	function onDocumentCursorActive( event ) {

		showCursor();

		clearTimeout( cursorInactiveTimeout );

		cursorInactiveTimeout = setTimeout( hideCursor, config.hideCursorTime );

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 *
	 * @param {object} event
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

	}

	/**
	 * Handler for the 'touchmove' event.
	 *
	 * @param {object} event
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			let currentX = event.touches[0].clientX;
			let currentY = event.touches[0].clientY;

			// There was only one touch point, look for a swipe
			if( event.touches.length === 1 && touch.startCount !== 2 ) {

				let deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						if( config.rtl ) {
							navigateNext();
						}
						else {
							navigatePrev();
						}
					}
					else {
						navigateLeft();
					}
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						if( config.rtl ) {
							navigatePrev();
						}
						else {
							navigateNext();
						}
					}
					else {
						navigateRight();
					}
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						navigatePrev();
					}
					else {
						navigateUp();
					}
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						navigateNext();
					}
					else {
						navigateDown();
					}
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( isAndroid ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 *
	 * @param {object} event
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 *
	 * @param {object} event
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 *
	 * @param {object} event
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 *
	 * @param {object} event
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			let delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else if( delta < 0 ) {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		let slidesTotal = getHorizontalSlides().length;
		let slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); config.navigationMode === 'linear' ? navigatePrev() : navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); config.navigationMode === 'linear' ? navigateNext() : navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 *
	 * @param {object} [event]
	 */
	function onPageVisibilityChange( event ) {

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( document.hidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 *
	 * @param {object} event
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			let url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 *
	 * @param {object} [event]
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	return extend( Reveal, {
		VERSION,

		initialize,
		configure,

		sync,
		syncSlide,
		syncFragments,

		// Navigation methods
		slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Fragment methods
		navigateFragment: fragments.goto.bind( fragments ),
		prevFragment: fragments.prev.bind( fragments ),
		nextFragment: fragments.next.bind( fragments ),

		// Forward event binding to the reveal DOM element
		addEventListener: ( type, listener, useCapture ) => {
			Reveal.getRevealElement().addEventListener( type, listener, useCapture );
		},
		removeEventListener: ( type, listener, useCapture ) => {
			Reveal.getRevealElement().removeEventListener( type, listener, useCapture );
		},

		// Forces an update in slide layout
		layout,

		// Randomizes the order of slides
		shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: fragments.availableRoutes.bind( fragments ),

		// Toggles a help overlay with keyboard shortcuts
		toggleHelp,

		// Toggles the overview mode on/off
		toggleOverview: overview.toggle.bind( overview ),

		// Toggles the "black screen" mode on/off
		togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide,

		// Slide navigation checks
		isFirstSlide,
		isLastSlide,
		isLastVerticalSlide,

		// State checks
		isOverview: overview.isActive.bind( overview ),
		isPaused,
		isAutoSliding,
		isSpeakerNotes,

		// Slide preloading
		loadSlide: slideContent.load.bind( slideContent ),
		unloadSlide: slideContent.unload.bind( slideContent ),

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners,
		removeEventListeners,
		dispatchEvent,

		// Facility for persisting and restoring the presentation state
		getState,
		setState,

		// Presentation progress
		getSlidePastCount,

		// Presentation progress on range of 0-1
		getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices,

		// Returns an Array of all slides
		getSlides,

		// Returns an Array of objects representing the attributes on
		// the slides
		getSlidesAttributes,

		// Returns the total number of slides
		getTotalSlides,

		// Returns the slide element at the specified index
		getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes,

		// Returns an array with all horizontal/vertical slides in the deck
		getHorizontalSlides,
		getVerticalSlides,

		// Checks if the presentation contains two or more
		// horizontal/vertical slides
		hasHorizontalSlides,
		hasVerticalSlides,

		// Adds/removes a custom key binding
		addKeyBinding: keyboard.addKeyBinding.bind( keyboard ),
		removeKeyBinding: keyboard.removeKeyBinding.bind( keyboard ),

		// Programmatically triggers a keyboard event
		triggerKey: keyboard.triggerKey.bind( keyboard ),

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: keyboard.registerKeyboardShortcut.bind( keyboard ),

		// API for registering and retrieving plugins
		registerPlugin: plugins.registerPlugin.bind( plugins ),
		hasPlugin: plugins.hasPlugin.bind( plugins ),
		getPlugin: plugins.getPlugin.bind( plugins ),
		getPlugins: plugins.getRegisteredPlugins.bind( plugins ),

		getComputedSlideSize,

		// Returns the previous slide element, may be null
		getPreviousSlide: () => previousSlide,

		// Returns the current slide element
		getCurrentSlide: () => currentSlide,

		// Returns the current scale of the presentation content
		getScale: () => scale,

		// Returns the current configuration object
		getConfig: () => config,

		// Helper method, retrieves query string as a key:value map
		getQueryHash,

		// Returns the top-level DOM element
		getRevealElement: () => dom.wrapper || document.querySelector( '.reveal' ),
		getSlidesElement: () => dom.slides,
		getBackgroundsElement: () => dom.background,

		// Checks if reveal.js has been loaded and is ready for use
		isReady: () => ready,


		// The following API methods are primarily intended for use
		// by reveal.js controllers

		// Methods for announcing content to screen readers
		announceStatus,
		getStatusText,

		overview,
		slideContent,
		onUserInput,
		closeOverlay,
		updateControls,
		updateProgress,
		updateSlidesVisibility,
		writeURL,
		transformSlides,
		cueAutoSlide,
		cancelAutoSlide

	} );

};
