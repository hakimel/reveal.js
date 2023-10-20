import { HORIZONTAL_SLIDES_SELECTOR } from '../utils/constants.js'
import { queryAll } from '../utils/util.js'

const HIDE_SCROLLBAR_TIMEOUT = 500;
const PROGRESS_SPACING = 4;
const MIN_PROGRESS_SEGMENT_HEIGHT = 6;
const MIN_PLAYHEAD_HEIGHT = 18;

/**
 * The reader mode lets you read a reveal.js presentation
 * as a linear scrollable page.
 */
export default class Reader {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.active = false;
		this.activatedCallbacks = [];

		this.onScroll = this.onScroll.bind( this );

	}

	/**
	 * Activates the reader mode. This rearranges the presentation DOM
	 * by—among other things—wrapping each slide in a page element.
	 */
	activate() {

		if( this.active ) return;

		const state = this.Reveal.getState();

		this.active = true;

		this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;

		const horizontalSlides = queryAll( this.Reveal.getRevealElement(), HORIZONTAL_SLIDES_SELECTOR );

		this.viewportElement.classList.add( 'loading-scroll-mode', 'reveal-reader' );
		this.viewportElement.addEventListener( 'scroll', this.onScroll, { passive: true } );

		let presentationBackground;

		const viewportStyles = window.getComputedStyle( this.viewportElement );
		if( viewportStyles && viewportStyles.background ) {
			presentationBackground = viewportStyles.background;
		}

		const pageElements = [];
		const pageContainer = horizontalSlides[0].parentNode;

		let previousSlide;

		const createPage = ( slide, h, v ) => {

			let contentContainer;

			if( previousSlide && this.Reveal.shouldAutoAnimateBetween( previousSlide, slide ) ) {
				contentContainer = document.createElement( 'div' );
				contentContainer.className = 'reader-page-content reader-auto-animate-page';
				previousSlide.closest( '.reader-page-content' ).parentNode.appendChild( contentContainer );
			}
			else {
				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				const page = document.createElement( 'div' );
				page.className = 'reader-page';
				pageElements.push( page );

				// Copy the presentation-wide background to each page
				if( presentationBackground ) {
					page.style.background = presentationBackground;
				}

				const stickyContainer = document.createElement( 'div' );
				stickyContainer.className = 'reader-page-sticky';
				page.appendChild( stickyContainer );

				contentContainer = document.createElement( 'div' );
				contentContainer.className = 'reader-page-content';
				stickyContainer.appendChild( contentContainer );
			}

			contentContainer.appendChild( slide );

			slide.classList.remove( 'past', 'future' );

			if( typeof h === 'number' ) slide.setAttribute( 'data-index-h', h );
			if( typeof v === 'number' ) slide.setAttribute( 'data-index-v', v );

			if( slide.slideBackgroundElement ) {
				slide.slideBackgroundElement.remove( 'past', 'future' );
				contentContainer.insertBefore( slide.slideBackgroundElement, slide );
			}

			previousSlide = slide;

		}

		// Slide and slide background layout
		horizontalSlides.forEach( ( horizontalSlide, h ) => {

			if( this.Reveal.isVerticalStack( horizontalSlide ) ) {
				horizontalSlide.querySelectorAll( 'section' ).forEach( ( verticalSlide, v ) => {
					createPage( verticalSlide, h, v );
				});
			}
			else {
				createPage( horizontalSlide, h, 0 );
			}

		}, this );

		this.createProgressBar();

		// Remove leftover stacks
		queryAll( this.Reveal.getRevealElement(), '.stack' ).forEach( stack => stack.remove() );

		pageElements.forEach( page => pageContainer.appendChild( page ) );

		// Re-run JS-based content layout after the slide is added to page DOM
		this.Reveal.slideContent.layout( this.Reveal.getSlidesElement() );

		this.Reveal.layout();
		this.Reveal.setState( state );

		this.viewportElement.classList.remove( 'loading-scroll-mode' );

		this.activatedCallbacks.forEach( callback => callback() );
		this.activatedCallbacks = [];

	}

	/**
	 * Deactivates the reader mode and restores the standard slide-based
	 * presentation.
	 */
	deactivate() {

		if( !this.active ) return;

		const state = this.Reveal.getState();

		this.active = false;

		this.viewportElement.removeEventListener( 'scroll', this.onScroll );
		this.viewportElement.classList.remove( 'reveal-reader' );

		this.removeProgressBar();

		this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation;
		this.Reveal.sync();
		this.Reveal.setState( state );

	}

	toggle( override ) {

		if( typeof override === 'boolean' ) {
			override ? this.activate() : this.deactivate();
		}
		else {
			this.isActive() ? this.deactivate() : this.activate();
		}

	}

	/**
	 * Checks if the reader mode is currently active.
	 */
	isActive() {

		return this.active;

	}

	/**
	 * Retrieve a slide by its original h/v index (i.e. the indices the
	 * slide had before being linearized).
	 *
	 * @param {number} h
	 * @param {number} v
	 * @returns {HTMLElement}
	 */
	getSlideByIndices( h, v ) {

		const page = this.getAllPages().find( page => {
			return page.indexh === h && page.indexv === v;
		} );

		return page ? page.slideElement : null;

	}

	getScrollTriggerBySlide( slide ) {

		return this.slideTriggers.find( trigger => trigger.page.slideElement === slide );

	}

	getAllPages() {

		return this.pages.flatMap( page => [page, ...(page.autoAnimatePages || [])] );

	}

	/**
	 * Renders the progress bar component.
	 */
	createProgressBar() {

		this.progressBar = document.createElement( 'div' );
		this.progressBar.className = 'reader-progress';

		this.progressBarInner = document.createElement( 'div' );
		this.progressBarInner.className = 'reader-progress-inner';
		this.progressBar.appendChild( this.progressBarInner );

		this.progressBarPlayhead = document.createElement( 'div' );
		this.progressBarPlayhead.className = 'reader-progress-playhead';
		this.progressBarInner.appendChild( this.progressBarPlayhead );

		this.viewportElement.insertBefore( this.progressBar, this.viewportElement.firstChild );

		const handleDocumentMouseMove	= ( event ) => {

			let progress = ( event.clientY - this.progressBarInner.getBoundingClientRect().top ) / this.progressBarHeight;

			progress = Math.max( Math.min( progress, 1 ), 0 );

			this.viewportElement.scrollTop = progress * ( this.viewportElement.scrollHeight - this.viewportElement.offsetHeight );

		};

		const handleDocumentMouseUp = ( event ) => {

			this.draggingProgressBar = false;
			this.showProgressBar();

			document.removeEventListener( 'mousemove', handleDocumentMouseMove );
			document.removeEventListener( 'mouseup', handleDocumentMouseUp );

		};

		const handleMouseDown = ( event ) => {

			event.preventDefault();

			this.draggingProgressBar = true;

			document.addEventListener( 'mousemove', handleDocumentMouseMove );
			document.addEventListener( 'mouseup', handleDocumentMouseUp );

			handleDocumentMouseMove( event );

		};

		this.progressBarInner.addEventListener( 'mousedown', handleMouseDown );

	}

	removeProgressBar() {

		if( this.progressBar ) {
			this.progressBar.remove();
			this.progressBar = null;
		}

	}

	layout() {

		if( this.isActive() ) {
			this.syncPages();
			this.onScroll();
		}

	}

	/**
	 * Updates our reader pages to match the latest configuration and
	 * presentation size.
	 */
	syncPages() {

		const config = this.Reveal.getConfig();

		const slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );
		const scale = this.Reveal.getScale();
		const readerLayout = config.readerLayout;

		const viewportHeight = this.viewportElement.offsetHeight;
		const compactHeight = slideSize.height * scale;
		const pageHeight = readerLayout === 'full' ? viewportHeight : compactHeight;

		// The height that needs to be scrolled between scroll triggers
		const scrollTriggerHeight = viewportHeight;

		this.viewportElement.style.setProperty( '--page-height', pageHeight + 'px' );
		this.viewportElement.style.scrollSnapType = typeof config.readerScrollSnap === 'string' ?
												`y ${config.readerScrollSnap}` : '';

		// This will hold all scroll triggers used to show/hide slides
		this.slideTriggers = [];

		const pageElements = Array.from( this.Reveal.getRevealElement().querySelectorAll( '.reader-page' ) );

		this.pages = pageElements.map( pageElement => {
			const page = {
				pageElement: pageElement,
				slideElement: pageElement.querySelector( 'section' ),
				stickyElement: pageElement.querySelector( '.reader-page-sticky' ),
				contentElement: pageElement.querySelector( '.reader-page-content' ),
				backgroundElement: pageElement.querySelector( '.slide-background' ),
				autoAnimateElements: pageElement.querySelectorAll( '.reader-auto-animate-page' ),

				top: pageElement.offsetTop,

				scrollTriggers: [],
				scrollTriggerHeight,
				scrollTriggerCount: 0
			};

			let additionalScrollTriggerCount = 0;

			page.indexh = parseInt( page.slideElement.getAttribute( 'data-index-h' ), 10 );
			page.indexv = parseInt( page.slideElement.getAttribute( 'data-index-v' ), 10 );

			page.pageElement.style.setProperty( '--slide-height', config.center === true ? 'auto' : slideSize.height + 'px' );

			this.slideTriggers.push({
				page: page,
				activate: () => this.activatePage( page ),
				deactivate: () => this.deactivatePage( page )
			});

			// Create scroll triggers that show/hide fragments
			page.scrollTriggerCount += this.createFragmentTriggersForPage( page );

			if( page.autoAnimateElements.length > 0 ) {
				// Create scroll triggers for triggering auto-animate steps
				page.autoAnimatePages = this.createAutoAnimateTriggersForPage( page );

				additionalScrollTriggerCount = page.autoAnimatePages.reduce( ( total, page ) => {
					return total + Math.max( page.scrollTriggerCount - 1, 0 );
				}, page.autoAnimateElements.length );
			}

			const totalScrollTriggerCount = Math.max( page.scrollTriggerCount - 1, 0 ) + additionalScrollTriggerCount;

			// Clean up from previous renders
			page.pageElement.querySelectorAll( '.reader-snap-point' ).forEach( el => el.remove() );

			// Create snap points for all scroll triggers
			// - Can't be absolute in FF
			// - Can't be 0-height in Safari
			for( let i = 0; i < totalScrollTriggerCount + 1; i++ ) {
				const triggerStick = document.createElement( 'div' );
				triggerStick.className = 'reader-snap-point';
				triggerStick.style.height = scrollTriggerHeight + 'px';
				page.pageElement.appendChild( triggerStick );

				if( i === 0 ) {
					triggerStick.style.marginTop = -scrollTriggerHeight + 'px';
				}
			}

			// Add scroll padding based on how many scroll triggers we have
			page.scrollPadding = scrollTriggerHeight * totalScrollTriggerCount;

			// In the compact layout, only slides with scroll triggers cover the
			// full viewport height. This helps avoid empty gaps before or after
			// a sticky slide.
			if( readerLayout === 'compact' && page.scrollTriggerCount > 0 ) {
				page.pageHeight = viewportHeight;
				page.pageElement.style.setProperty( '--page-height', viewportHeight + 'px' );
			}
			else {
				page.pageHeight = pageHeight;
				page.pageElement.style.removeProperty( '--page-height' );
			}

			// This variable is used to pad the height of our page in CSS
			page.pageElement.style.setProperty( '--page-scroll-padding', page.scrollPadding + 'px' );

			// The total height including scrollable space
			page.totalHeight = page.pageHeight + page.scrollPadding;

			page.bottom = page.top + page.totalHeight;

			// If this is a sticky page, stick it to the vertical center
			if( totalScrollTriggerCount > 0 ) {
				page.stickyElement.style.position = 'sticky';
				page.stickyElement.style.top = Math.max( ( viewportHeight - page.pageHeight ) / 2, 0 ) + 'px';

				// Make this page freeze at the vertical center of the viewport
				page.top -= ( viewportHeight - page.pageHeight ) / 2;
			}
			else {
				page.stickyElement.style.position = 'relative';
				page.pageElement.style.scrollSnapAlign = page.pageHeight < viewportHeight ? 'center' : 'start';
			}

			return page;
		} );

		this.progressBarSegmentCount = this.slideTriggers.reduce( ( total, trigger ) => total + Math.max( trigger.page.scrollTriggerCount, 1 ), 0 );
		let rangeStart = 0;

		this.slideTriggers.forEach( ( trigger, i ) => {
			const rangeEnd = rangeStart + Math.max( trigger.page.scrollTriggerCount, 1 ) / this.progressBarSegmentCount;
			trigger.range = [rangeStart, rangeEnd];

			const slideRange = trigger.range[1] - trigger.range[0];
			trigger.page.scrollTriggers.forEach( scrollTrigger => {
				scrollTrigger.globalRange = [
					rangeStart + scrollTrigger.range[0] * slideRange,
					rangeStart + scrollTrigger.range[1] * slideRange
				];
			} );
			rangeStart = rangeEnd;
		} );

		/*
		console.log(this.slideTriggers.map( t => {
			return {
				range: `${t.range[0].toFixed(2)}-${t.range[1].toFixed(2)}`,
				triggers: t.page.scrollTriggers.map( t => {
					return `${t.globalRange[0].toFixed(2)}-${t.globalRange[1].toFixed(2)}`
				}).join( ', ' ),
			}
		}))
		*/

		this.viewportElement.setAttribute( 'data-reader-scroll-bar', config.readerScrollbar );

		if( config.readerScrollbar && this.progressBarSegmentCount > 1 ) {
			// Create the progress bar if it doesn't already exist
			if( !this.progressBar ) this.createProgressBar();

			this.syncProgressBar();
		}
		else {
			this.removeProgressBar();
		}

	}

	/**
	 * Creates scroll triggers for the fragments in the given page.
	 *
	 * @param {*} page
	 */
	createFragmentTriggersForPage( page, slideElement ) {

		slideElement = slideElement || page.slideElement;

		// Each fragment 'group' is an array containing one or more
		// fragments. Multiple fragments that appear at the same time
		// are part of the same group.
		const fragmentGroups = this.Reveal.fragments.sort( slideElement.querySelectorAll( '.fragment' ), true );

		// Create scroll triggers that show/hide fragments
		if( fragmentGroups.length ) {
			page.fragments = this.Reveal.fragments.sort( slideElement.querySelectorAll( '.fragment:not(.disabled)' ) );
			page.scrollTriggers.push(
				// Trigger for the initial state with no fragments visible
				{
					activate: () => {
						this.Reveal.fragments.update( -1, page.fragments, slideElement );
					}
				},

				// Triggers for each fragment group
				...fragmentGroups.map( ( fragments, i ) => ({
						activate: () => {
							this.Reveal.fragments.update( i, page.fragments, slideElement );
						}
					})
				)
			);

			const scrollTriggerRangeSegmentSize = 1 / page.scrollTriggers.length;
			page.scrollTriggers.forEach( ( trigger, i ) => {
				trigger.range = [i * scrollTriggerRangeSegmentSize, ( i + 1 ) * scrollTriggerRangeSegmentSize];
			} );
		}


		return page.scrollTriggers.length;

	}

	/**
	 * Creates scroll triggers for the auto-animate steps in the
	 * given page.
	 *
	 * @param {*} page
	 */
	createAutoAnimateTriggersForPage( page ) {

		let pages = [];

		if( page.autoAnimateElements.length > 0 ) {

			// Triggers for each subsequent auto-animate slide
			this.slideTriggers.push( ...Array.from( page.autoAnimateElements ).map( ( autoAnimateElement, i ) => {
				const slideElement = autoAnimateElement.querySelector( 'section' );

				let autoAnimatePage = {
					slideElement,
					backgroundElement: autoAnimateElement.querySelector( '.slide-background' ),
					contentElement: autoAnimateElement,
					scrollTriggers: [],
					scrollTriggerCount: 0,
					scrollTriggerHeight: page.scrollTriggerHeight,
					top: page.top,
					bottom: page.bottom,
					indexh: parseInt( slideElement.getAttribute( 'data-index-h' ), 10 ),
					indexv: parseInt( slideElement.getAttribute( 'data-index-v' ), 10 )
				};

				// Create fragment scroll triggers for the auto-animate slide
				autoAnimatePage.scrollTriggerCount = this.createFragmentTriggersForPage( autoAnimatePage, slideElement );

				pages.push( autoAnimatePage );

				return {
					page: autoAnimatePage,
					activate: () => this.activatePage( autoAnimatePage ),
					deactivate: () => this.deactivatePage( autoAnimatePage )
				};
			}));
		}

		return pages;

	}

	/**
	 * Rerenders progress bar segments so that they match the current
	 * reveal.js config and size.
	 */
	syncProgressBar() {

		this.progressBarInner.querySelectorAll( '.reader-progress-slide' ).forEach( slide => slide.remove() );

		const viewportHeight = this.viewportElement.offsetHeight;
		const scrollHeight = this.viewportElement.scrollHeight;

		this.progressBarHeight = this.progressBarInner.offsetHeight;
		this.playheadHeight = Math.max( 1 / this.progressBarSegmentCount * this.progressBarHeight, MIN_PLAYHEAD_HEIGHT );
		this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;

		this.progressBarPlayhead.style.height = this.playheadHeight - PROGRESS_SPACING + 'px';

		const progressSegmentHeight = viewportHeight / scrollHeight * this.progressBarHeight;

		// Don't show individual segments if they're too small
		if( progressSegmentHeight > MIN_PROGRESS_SEGMENT_HEIGHT ) {

			this.slideTriggers.forEach( trigger => {

				const { page } = trigger;

				page.progressBarSlide = document.createElement( 'div' );
				page.progressBarSlide.className = 'reader-progress-slide';
				page.progressBarSlide.style.top = trigger.range[0] * this.progressBarHeight + 'px';
				page.progressBarSlide.style.height = ( trigger.range[1] - trigger.range[0] ) * this.progressBarHeight - PROGRESS_SPACING + 'px';
				page.progressBarSlide.classList.toggle( 'has-triggers', page.scrollTriggers.length > 0 );
				this.progressBarInner.appendChild( page.progressBarSlide );

				const scrollBarSlideHeight = ( trigger.range[1] - trigger.range[0] ) * this.progressBarHeight;

				// Create visual representations for each scroll trigger
				trigger.page.scrollTriggerElements = page.scrollTriggers.map( ( trigger, i ) => {

					const triggerElement = document.createElement( 'div' );
					triggerElement.className = 'reader-progress-trigger';
					triggerElement.style.top = trigger.range[0] * scrollBarSlideHeight + 'px';
					triggerElement.style.height = ( trigger.range[1] - trigger.range[0] ) * scrollBarSlideHeight - PROGRESS_SPACING*2 + 'px';
					page.progressBarSlide.appendChild( triggerElement );

					if( i === 0 ) triggerElement.style.display = 'none';

					return triggerElement;

				} );

			} );

		}
		else {

			this.pages.forEach( page => page.progressBarSlide = null );

		}

	}

	/**
	 * Moves the progress bar playhead to the specified position.
	 *
	 * @param {number} progress 0-1
	 */
	setProgressBarValue( progress ) {

		if( this.progressBar ) {

			this.progressBarPlayhead.style.transform = `translateY(${progress * this.progressBarScrollableHeight}px)`;

			this.getAllPages()
				.filter( page => page.progressBarSlide )
				.forEach( ( page ) => {
					page.progressBarSlide.classList.toggle( 'active', !!page.active );

					page.scrollTriggers.forEach( ( trigger, i ) => {
						page.scrollTriggerElements[i].classList.toggle( 'active', page.active && trigger.active );
					} );
				} );

			this.showProgressBar();

		}

	}

	/**
	 * Show the progress bar and, if configured, automatically hide
	 * it after a delay.
	 */
	showProgressBar() {

		this.progressBar.classList.add( 'visible' );

		clearTimeout( this.hideProgressBarTimeout );

		if( this.Reveal.getConfig().readerScrollbar === 'auto' && !this.draggingProgressBar ) {

			this.hideProgressBarTimeout = setTimeout( () => {
				this.progressBar.classList.remove( 'visible' );
			}, HIDE_SCROLLBAR_TIMEOUT );

		}

	}

	/**
	 * Scrolls the given slide element into view.
	 *
	 * @param {HTMLElement} slideElement
	 */
	scrollToSlide( slideElement ) {

		if( !this.active ) {
			this.activatedCallbacks.push( () => this.scrollToSlide( slideElement ) );
		}
		else {
			// Find the trigger for this slide
			const trigger = this.getScrollTriggerBySlide( slideElement );

			if( trigger ) {
				// Use the trigger's range to calculate the scroll position
				this.viewportElement.scrollTop = trigger.range[0] * ( this.viewportElement.scrollHeight - this.viewportElement.offsetHeight );
			}
		}

	}

	activatePage( page ) {

		if( !page.active ) {

			page.active = true;

			const { slideElement, backgroundElement, contentElement, indexh, indexv } = page;

			contentElement.style.display = 'block';

			slideElement.classList.add( 'present' );
			backgroundElement.classList.add( 'present' );

			this.Reveal.setCurrentReaderPage( slideElement, indexh, indexv );
			this.Reveal.slideContent.startEmbeddedContent( slideElement );
			this.Reveal.backgrounds.bubbleSlideContrastClassToElement( slideElement, this.viewportElement );

			if( backgroundElement ) {
				this.Reveal.slideContent.startEmbeddedContent( backgroundElement );
			}

			// Hide all content element siblings
			Array.from( contentElement.parentNode.children ).forEach( sibling => {
				if( sibling !== contentElement ) {
					sibling.style.display = 'none';
				}
			});

		}

	}

	deactivatePage( page ) {

		if( page.active ) {

			page.active = false;

			const { slideElement, backgroundElement } = page;

			slideElement.classList.remove( 'present' );
			backgroundElement.classList.remove( 'present' );

			this.Reveal.slideContent.stopEmbeddedContent( slideElement );

			if( backgroundElement ) {
				this.Reveal.slideContent.stopEmbeddedContent( backgroundElement );
			}

		}

	}

	onScroll() {

		const viewportHeight = this.viewportElement.offsetHeight;
		const scrollTop = this.viewportElement.scrollTop;
		const scrollHeight = this.viewportElement.scrollHeight - viewportHeight
		const scrollProgress = Math.max( Math.min( scrollTop / scrollHeight, 1 ), 0 );
		const scrollProgressMid = Math.max( Math.min( ( scrollTop + viewportHeight / 2 ) / this.viewportElement.scrollHeight, 1 ), 0 );

		let activePage;

		this.slideTriggers.forEach( ( trigger, i ) => {
			const { page } = trigger;
			const isWithinPreloadRange = scrollProgress >= trigger.range[0] - 2 && scrollProgress <= trigger.range[1] + 2;

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

			if( scrollProgress >= trigger.range[0] && scrollProgress <= trigger.range[1] ) {
				if( !trigger.active ) {
					trigger.active = true;
					trigger.activate();
				}

				activePage = trigger.page;
			}
			else if( trigger.activate ) {
				trigger.active = false;
				if( trigger.deactivate ) trigger.deactivate();
			}
		} );

		if( activePage ) {
			activePage.scrollTriggers.forEach( trigger => {
				if( scrollProgressMid >= trigger.globalRange[0] && scrollProgressMid <= trigger.globalRange[1] ) {
					if( !trigger.active ) {
						trigger.active = true;
						trigger.activate();
					}
				}
				else if( trigger.activate ) {
					trigger.active = false;
					if( trigger.deactivate ) trigger.deactivate();
				}
			} );
		}

		this.setProgressBarValue( scrollTop / ( this.viewportElement.scrollHeight - viewportHeight ) );

	}

	get viewportElement() {

		return this.Reveal.getViewportElement();

	}

}
