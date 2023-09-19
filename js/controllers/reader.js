import { SLIDES_SELECTOR } from '../utils/constants.js'
import { queryAll, createStyleSheet } from '../utils/util.js'

/**
 * The reader mode lets you read a reveal.js presentation
 * as a linear scrollable page.
 */
export default class Reader {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.active = false;
		this.activatedCallbacks = [];

	}

	async activate() {

		if( this.active ) return;

		this.active = true;

		this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;

		const viewportElement = this.Reveal.getViewportElement();
		const slides = queryAll( this.Reveal.getRevealElement(), SLIDES_SELECTOR );

		// Dimensions of slides within the pages
		const slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );
		const slideWidth = slideSize.width,
			  slideHeight = slideSize.height;

		viewportElement.classList.add( 'loading-scroll-mode', 'reveal-reader' );
		viewportElement.addEventListener( 'scroll', this.onScroll.bind( this ) );

		let presentationBackground;
		if( viewportElement ) {
			const viewportStyles = window.getComputedStyle( viewportElement );
			if( viewportStyles && viewportStyles.background ) {
				presentationBackground = viewportStyles.background;
			}
		}

		// Make sure stretch elements fit on slide
		await new Promise( requestAnimationFrame );
		this.Reveal.layoutSlideContents( slideWidth, slideHeight );

		const pages = [];
		const pageContainer = slides[0].parentNode;

		// Slide and slide background layout
		slides.forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				const page = document.createElement( 'div' );
				pages.push( page );

				page.className = 'reader-page';
				page.style.width = slideWidth + 'px';
				page.style.height = slideHeight + 'px';

				slide.style.width = slideWidth + 'px';

				// Copy the presentation-wide background to each individual
				// page when printing
				if( presentationBackground ) {
					page.style.background = presentationBackground;
				}

				page.appendChild( slide );

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

			}

		}, this );

		// Remove leftover stacks
		queryAll( this.Reveal.getRevealElement(), '.stack' ).forEach( stack => stack.remove() );

		await new Promise( requestAnimationFrame );

		pages.forEach( page => pageContainer.appendChild( page ) );

		// Re-run JS-based content layout after the slide is added to page DOM
		this.Reveal.slideContent.layout( this.Reveal.getSlidesElement() );

		this.Reveal.layout();

		viewportElement.classList.remove( 'loading-scroll-mode' );

		this.activatedCallbacks.forEach( callback => callback() );
		this.activatedCallbacks = [];

	}

	deactivate() {

		if( !this.active ) return;

		this.active = false;

		this.Reveal.getViewportElement().classList.remove( 'reveal-reader' );
		this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation;
		this.Reveal.sync();

		// TODO Navigate to the slide that is currently scrolled into view
		this.Reveal.slide( 0 );

	}

	toggle() {

		if( this.active === true ) {
			this.deactivate();
		}
		else {
			this.activate();
		}

	}

	/**
	 * Checks if the reader mode is currently active.
	 */
	isActive() {

		return this.active;

	}

	generatePageMap() {

		const viewportElement = this.Reveal.getViewportElement();
		const viewportHeight = viewportElement.offsetHeight;

		const slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );
		const scale = this.Reveal.getScale();

		// The height that needs to be scrolled between scroll triggers
		const scrollTriggerHeight = slideSize.height * scale / 2;

		this.pageElements = Array.from( this.Reveal.getRevealElement().querySelectorAll( '.reader-page' ) );

		this.pageMap = this.pageElements.map( pageElement => {
			// pageElement.style.width = ( viewportElement.offsetWidth / scale ) + 'px';
			// pageElement.style.height = ( viewportElement.offsetHeight / scale ) + 'px';

			const page = {
				pageElement: pageElement,
				slideElement: pageElement.querySelector( 'section' ),
				top: pageElement.offsetTop * scale,
				pageHeight: pageElement.offsetHeight * scale,
				scrollTriggers: []
			};

			page.fragments = this.Reveal.fragments.sort( pageElement.querySelectorAll( '.fragment:not(.disabled)' ) );

			// Each fragment 'group' is an array containing one or more
			// fragments. Multiple fragments that appear at the same time
			// are part of the same group.
			page.fragmentGroups = this.Reveal.fragments.sort( pageElement.querySelectorAll( '.fragment' ), true );

			// The amount of empty scrollable space that has been append
			page.scrollHeight = scrollTriggerHeight * Math.max( page.fragmentGroups.length - 1, 0 );

			// The total height including scrollable space
			page.totalHeight = page.pageHeight + page.scrollHeight;

			page.bottom = page.top + page.totalHeight;

			// Pad the page height to reserve scrollable height
			page.pageElement.style.marginBottom = page.scrollHeight / scale + 'px';

			// Create scroll triggers that show/hide fragments
			if( page.fragmentGroups.length ) {
				const segmentSize = 1 / ( page.fragmentGroups.length + 1 );
				page.scrollTriggers.push(
					// Trigger for the initial state with no fragments visible
					{ range: [ 0, segmentSize ], fragmentIndex: -1 },

					// Triggers for each fragment group
					...page.fragmentGroups.map( ( fragments, i ) => ({
						range: [ segmentSize * ( i + 1 ), segmentSize * ( i + 2 ) ],
						fragmentIndex: i
					}))
				);

				// Make this page freeze at the vertical center of the viewport
				page.top -= ( viewportHeight - page.pageHeight ) / 2;
			}

			return page;
		} );

	}

	layout() {

		this.generatePageMap();
		this.onScroll();

	}

	scrollToSlide( slideElement ) {

		if( !this.active ) {
			this.activatedCallbacks.push( () => this.scrollToSlide( slideElement ) );
		}
		else {
			slideElement.parentNode.scrollIntoView();
		}

	}

	onScroll() {

		const viewportElement = this.Reveal.getViewportElement();
		const viewportHeight = viewportElement.offsetHeight;

		const scrollTop = viewportElement.scrollTop;
		const scale = this.Reveal.getScale();

		this.pageMap.forEach( ( page, i ) => {
			const isWithinPreloadRange = scrollTop + viewportHeight >= page.top - viewportHeight && scrollTop < page.top + page.bottom + viewportHeight;
			const isPartiallyVisible = scrollTop + viewportHeight >= page.top && scrollTop < page.top + page.bottom;

			// Preload content when it appears within range
			if( isWithinPreloadRange ) {
				if( !page.preloaded ) {
					page.preloaded = true;
					this.Reveal.slideContent.load( page.slideElement );
				}
			}
			else if( page.preloaded ) {
				page.preloaded = false;
				this.Reveal.slideContent.unload( page.slideElement );
			}

			// Play slide content when the slide becomes visible
			if( isPartiallyVisible ) {
				if( !page.playing ) {
					page.playing = true;
					this.Reveal.slideContent.startEmbeddedContent( page.slideElement );
				}
			}
			else if( page.playing ) {
				page.playing = false;
				this.Reveal.slideContent.stopEmbeddedContent( page.slideElement );
			}

			// Handle scroll freezing and triggers for slides in view
			if( isPartiallyVisible && page.totalHeight > page.pageHeight ) {
				let scrollProgress = ( scrollTop - page.top ) / page.scrollHeight;
				scrollProgress = Math.max( Math.min( scrollProgress, 1 ), 0 );

				// Fix the slide to the top of the viewport while we're in its
				// scrollable region
				page.pageElement.style.transform = `translateY( ${ scrollProgress * page.scrollHeight / scale }px )`;

				page.scrollTriggers.forEach( trigger => {
					if( scrollProgress >= trigger.range[0] && scrollProgress < trigger.range[1] ) {
						if( !trigger.active ) {
							trigger.active = true;
							this.Reveal.fragments.update( trigger.fragmentIndex, page.fragments, page.slideElement );
						}
					}
					else {
						trigger.active = false;
					}
				} );
			}
		} );

	}

}
