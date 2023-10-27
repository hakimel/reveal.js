import { queryAll } from '../utils/util.js'
import { colorToRgb, colorBrightness } from '../utils/color.js'

/**
 * Creates and updates slide backgrounds.
 */
export default class Backgrounds {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	render() {

		this.element = document.createElement( 'div' );
		this.element.className = 'backgrounds';
		this.Reveal.getRevealElement().appendChild( this.element );

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	create() {

		// Clear prior backgrounds
		this.element.innerHTML = '';
		this.element.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		this.Reveal.getHorizontalSlides().forEach( slideh => {

			let backgroundStack = this.createBackground( slideh, this.element );

			// Iterate over all vertical slides
			queryAll( slideh, 'section' ).forEach( slidev => {

				this.createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( this.Reveal.getConfig().parallaxBackgroundImage ) {

			this.element.style.backgroundImage = 'url("' + this.Reveal.getConfig().parallaxBackgroundImage + '")';
			this.element.style.backgroundSize = this.Reveal.getConfig().parallaxBackgroundSize;
			this.element.style.backgroundRepeat = this.Reveal.getConfig().parallaxBackgroundRepeat;
			this.element.style.backgroundPosition = this.Reveal.getConfig().parallaxBackgroundPosition;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( () => {
				this.Reveal.getRevealElement().classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			this.element.style.backgroundImage = '';
			this.Reveal.getRevealElement().classList.remove( 'has-parallax-background' );

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
	createBackground( slide, container ) {

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
		this.sync( slide );

		return element;

	}

	/**
	 * Renders all of the visual properties of a slide background
	 * based on the various background attributes.
	 *
	 * @param {HTMLElement} slide
	 */
	sync( slide ) {

		const element = slide.slideBackgroundElement,
			contentElement = slide.slideBackgroundContentElement;

		const data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundGradient: slide.getAttribute( 'data-background-gradient' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' ),
			backgroundOpacity: slide.getAttribute( 'data-background-opacity' ),
		};

		const dataPreload = slide.hasAttribute( 'data-preload' );

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

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundGradient || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundGradient +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition +
															data.backgroundOpacity );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.setAttribute( 'data-background-size', data.backgroundSize );
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundGradient ) element.style.backgroundImage = data.backgroundGradient;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		if( dataPreload ) element.setAttribute( 'data-preload', '' );

		// Background image options are set on the content wrapper
		if( data.backgroundSize ) contentElement.style.backgroundSize = data.backgroundSize;
		if( data.backgroundRepeat ) contentElement.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) contentElement.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundOpacity ) contentElement.style.opacity = data.backgroundOpacity;

		const contrastClass = this.getContrastClass( slide );

		if( typeof contrastClass === 'string' ) {
			slide.classList.add( contrastClass );
		}

	}

	/**
	 * Returns a class name that can be applied to a slide to indicate
	 * if it has a light or dark background.
	 *
	 * @param {*} slide
	 *
	 * @returns {string|null}
	 */
	getContrastClass( slide ) {

		const element = slide.slideBackgroundElement;

		// If this slide has a background color, we add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be added
		let contrastColor = slide.getAttribute( 'data-background-color' );

		// If no bg color was found, or it cannot be converted by colorToRgb, check the computed background
		if( !contrastColor || !colorToRgb( contrastColor ) ) {
			let computedBackgroundStyle = window.getComputedStyle( element );
			if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
				contrastColor = computedBackgroundStyle.backgroundColor;
			}
		}

		if( contrastColor ) {
			const rgb = colorToRgb( contrastColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( contrastColor ) < 128 ) {
					return 'has-dark-background';
				}
				else {
					return 'has-light-background';
				}
			}
		}

		return null;

	}

	/**
	 * Bubble the 'has-light-background'/'has-dark-background' classes.
	 */
	bubbleSlideContrastClassToElement( slide, target ) {

		[ 'has-light-background', 'has-dark-background' ].forEach( classToBubble => {
			if( slide.classList.contains( classToBubble ) ) {
				target.classList.add( classToBubble );
			}
			else {
				target.classList.remove( classToBubble );
			}
		}, this );

	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	update( includeAll = false ) {

		let currentSlide = this.Reveal.getCurrentSlide();
		let indices = this.Reveal.getIndices();

		let currentBackground = null;

		// Reverse past/future classes when in RTL mode
		let horizontalPast = this.Reveal.getConfig().rtl ? 'future' : 'past',
			horizontalFuture = this.Reveal.getConfig().rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		Array.from( this.element.childNodes ).forEach( ( backgroundh, h ) => {

			backgroundh.classList.remove( 'past', 'present', 'future' );

			if( h < indices.h ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indices.h ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indices.h ) {
				queryAll( backgroundh, '.slide-background' ).forEach( ( backgroundv, v ) => {

					backgroundv.classList.remove( 'past', 'present', 'future' );

					if( v < indices.v ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indices.v ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indices.h ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop content inside of previous backgrounds
		if( this.previousBackground ) {

			this.Reveal.slideContent.stopEmbeddedContent( this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload( this.previousBackground ) } );

		}

		// Start content in the current background
		if( currentBackground ) {

			this.Reveal.slideContent.startEmbeddedContent( currentBackground );

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
			let previousBackgroundHash = this.previousBackground ? this.previousBackground.getAttribute( 'data-background-hash' ) : null;
			let currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== this.previousBackground ) {
				this.element.classList.add( 'no-transition' );
			}

			this.previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			this.bubbleSlideContrastClassToElement( currentSlide, this.Reveal.getRevealElement() );
		}

		// Allow the first background to apply without transition
		setTimeout( () => {
			this.element.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	updateParallax() {

		let indices = this.Reveal.getIndices();

		if( this.Reveal.getConfig().parallaxBackgroundImage ) {

			let horizontalSlides = this.Reveal.getHorizontalSlides(),
				verticalSlides = this.Reveal.getVerticalSlides();

			let backgroundSize = this.element.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			let slideWidth = this.element.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof this.Reveal.getConfig().parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = this.Reveal.getConfig().parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indices.h * -1;

			let slideHeight = this.element.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof this.Reveal.getConfig().parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = this.Reveal.getConfig().parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indices.v : 0;

			this.element.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	destroy() {

		this.element.remove();

	}

}
