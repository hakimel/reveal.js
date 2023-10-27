import { HORIZONTAL_SLIDES_SELECTOR } from '../utils/constants.js'
import { queryAll } from '../utils/util.js'

const HIDE_SCROLLBAR_TIMEOUT = 500;
const MAX_PROGRESS_SPACING = 4;
const MIN_PROGRESS_SEGMENT_HEIGHT = 6;
const MIN_PLAYHEAD_HEIGHT = 8;

/**
 * The scroll view lets you read a reveal.js presentation
 * as a linear scrollable page.
 */
export default class ScrollView {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.active = false;
		this.activatedCallbacks = [];

		this.onScroll = this.onScroll.bind( this );

	}

	/**
	 * Activates the scroll view. This rearranges the presentation DOM
	 * by—among other things—wrapping each slide in a page element.
	 */
	activate() {

		if( this.active ) return;

		const stateBeforeActivation = this.Reveal.getState();

		this.active = true;

		// Store the full presentation HTML so that we can restore it
		// when/if the scroll view is deactivated
		this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;

		const horizontalSlides = queryAll( this.Reveal.getRevealElement(), HORIZONTAL_SLIDES_SELECTOR );

		this.viewportElement.classList.add( 'loading-scroll-mode', 'reveal-scroll' );

		let presentationBackground;

		const viewportStyles = window.getComputedStyle( this.viewportElement );
		if( viewportStyles && viewportStyles.background ) {
			presentationBackground = viewportStyles.background;
		}

		const pageElements = [];
		const pageContainer = horizontalSlides[0].parentNode;

		let previousSlide;

		// Creates a new page element and appends the given slide/bg
		// to it.
		const createPageElement = ( slide, h, v ) => {

			let contentContainer;

			// If this slide is part of an auto-animation sequence, we
			// group it under the same page element as the previous slide
			if( previousSlide && this.Reveal.shouldAutoAnimateBetween( previousSlide, slide ) ) {
				contentContainer = document.createElement( 'div' );
				contentContainer.className = 'scroll-page-content scroll-auto-animate-page';
				contentContainer.style.display = 'none';
				previousSlide.closest( '.scroll-page-content' ).parentNode.appendChild( contentContainer );
			}
			else {
				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				const page = document.createElement( 'div' );
				page.className = 'scroll-page';
				pageElements.push( page );

				// Copy the presentation-wide background to each page
				if( presentationBackground ) {
					page.style.background = presentationBackground;
				}

				const stickyContainer = document.createElement( 'div' );
				stickyContainer.className = 'scroll-page-sticky';
				page.appendChild( stickyContainer );

				contentContainer = document.createElement( 'div' );
				contentContainer.className = 'scroll-page-content';
				stickyContainer.appendChild( contentContainer );
			}

			contentContainer.appendChild( slide );

			slide.classList.remove( 'past', 'future' );
			slide.setAttribute( 'data-index-h', h );
			slide.setAttribute( 'data-index-v', v );

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
					createPageElement( verticalSlide, h, v );
				});
			}
			else {
				createPageElement( horizontalSlide, h, 0 );
			}

		}, this );

		this.createProgressBar();

		// Remove leftover stacks
		queryAll( this.Reveal.getRevealElement(), '.stack' ).forEach( stack => stack.remove() );

		// Add our newly created pages to the DOM
		pageElements.forEach( page => pageContainer.appendChild( page ) );

		// Re-run JS-based content layout after the slide is added to page DOM
		this.Reveal.slideContent.layout( this.Reveal.getSlidesElement() );

		this.Reveal.layout();
		this.Reveal.setState( stateBeforeActivation );

		this.activatedCallbacks.forEach( callback => callback() );
		this.activatedCallbacks = [];

		this.restoreScrollPosition();

		this.viewportElement.classList.remove( 'loading-scroll-mode' );
		this.viewportElement.addEventListener( 'scroll', this.onScroll, { passive: true } );

	}

	/**
	 * Deactivates the scroll view and restores the standard slide-based
	 * presentation.
	 */
	deactivate() {

		if( !this.active ) return;

		const stateBeforeDeactivation = this.Reveal.getState();

		this.active = false;

		this.viewportElement.removeEventListener( 'scroll', this.onScroll );
		this.viewportElement.classList.remove( 'reveal-scroll' );

		this.removeProgressBar();

		this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation;
		this.Reveal.sync();
		this.Reveal.setState( stateBeforeDeactivation );

		this.slideHTMLBeforeActivation = null;

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
	 * Checks if the scroll view is currently active.
	 */
	isActive() {

		return this.active;

	}

	/**
	 * Renders the progress bar component.
	 */
	createProgressBar() {

		this.progressBar = document.createElement( 'div' );
		this.progressBar.className = 'scrollbar';

		this.progressBarInner = document.createElement( 'div' );
		this.progressBarInner.className = 'scrollbar-inner';
		this.progressBar.appendChild( this.progressBarInner );

		this.progressBarPlayhead = document.createElement( 'div' );
		this.progressBarPlayhead.className = 'scrollbar-playhead';
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
			this.syncScrollPosition();
		}

	}

	/**
	 * Updates our pages to match the latest configuration and
	 * presentation size.
	 */
	syncPages() {

		const config = this.Reveal.getConfig();

		const slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );
		const scale = this.Reveal.getScale();
		const useCompactLayout = config.scrollLayout === 'compact';

		const viewportHeight = this.viewportElement.offsetHeight;
		const compactHeight = slideSize.height * scale;
		const pageHeight = useCompactLayout ? compactHeight : viewportHeight;

		// The height that needs to be scrolled between scroll triggers
		const scrollTriggerHeight = useCompactLayout ? compactHeight : viewportHeight;

		this.viewportElement.style.setProperty( '--page-height', pageHeight + 'px' );
		this.viewportElement.style.scrollSnapType = typeof config.scrollSnap === 'string' ? `y ${config.scrollSnap}` : '';

		// This will hold all scroll triggers used to show/hide slides
		this.slideTriggers = [];

		const pageElements = Array.from( this.Reveal.getRevealElement().querySelectorAll( '.scroll-page' ) );

		this.pages = pageElements.map( pageElement => {
			const page = this.createPage({
				pageElement,
				slideElement: pageElement.querySelector( 'section' ),
				stickyElement: pageElement.querySelector( '.scroll-page-sticky' ),
				contentElement: pageElement.querySelector( '.scroll-page-content' ),
				backgroundElement: pageElement.querySelector( '.slide-background' ),
				autoAnimateElements: pageElement.querySelectorAll( '.scroll-auto-animate-page' ),
				autoAnimatePages: []
			});

			page.pageElement.style.setProperty( '--slide-height', config.center === true ? 'auto' : slideSize.height + 'px' );

			this.slideTriggers.push({
				page: page,
				activate: () => this.activatePage( page ),
				deactivate: () => this.deactivatePage( page )
			});

			// Create scroll triggers that show/hide fragments
			this.createFragmentTriggersForPage( page );

			// Create scroll triggers for triggering auto-animate steps
			if( page.autoAnimateElements.length > 0 ) {
				this.createAutoAnimateTriggersForPage( page );
			}

			let totalScrollTriggerCount = Math.max( page.scrollTriggers.length - 1, 0 );

			// Each auto-animate step may include its own scroll triggers
			// for fragments, ensure we count those as well
			totalScrollTriggerCount += page.autoAnimatePages.reduce( ( total, page ) => {
				return total + Math.max( page.scrollTriggers.length - 1, 0 );
			}, page.autoAnimatePages.length );

			// Clean up from previous renders
			page.pageElement.querySelectorAll( '.scroll-snap-point' ).forEach( el => el.remove() );

			// Create snap points for all scroll triggers
			// - Can't be absolute in FF
			// - Can't be 0-height in Safari
			// - Can't use snap-align on parent in Safari because then
			//   inner triggers won't work
			for( let i = 0; i < totalScrollTriggerCount + 1; i++ ) {
				const triggerStick = document.createElement( 'div' );
				triggerStick.className = 'scroll-snap-point';
				triggerStick.style.height = scrollTriggerHeight + 'px';
				triggerStick.style.scrollSnapAlign = useCompactLayout ? 'center' : 'start';
				page.pageElement.appendChild( triggerStick );

				if( i === 0 ) {
					triggerStick.style.marginTop = -scrollTriggerHeight + 'px';
				}
			}

			// In the compact layout, only slides with scroll triggers cover the
			// full viewport height. This helps avoid empty gaps before or after
			// a sticky slide.
			if( useCompactLayout && page.scrollTriggers.length > 0 ) {
				page.pageHeight = viewportHeight;
				page.pageElement.style.setProperty( '--page-height', viewportHeight + 'px' );
			}
			else {
				page.pageHeight = pageHeight;
				page.pageElement.style.removeProperty( '--page-height' );
			}

			// Add scroll padding based on how many scroll triggers we have
			page.scrollPadding = scrollTriggerHeight * totalScrollTriggerCount;

			// The total height including scrollable space
			page.totalHeight = page.pageHeight + page.scrollPadding;

			// This is used to pad the height of our page in CSS
			page.pageElement.style.setProperty( '--page-scroll-padding', page.scrollPadding + 'px' );

			// If this is a sticky page, stick it to the vertical center
			if( totalScrollTriggerCount > 0 ) {
				page.stickyElement.style.position = 'sticky';
				page.stickyElement.style.top = Math.max( ( viewportHeight - page.pageHeight ) / 2, 0 ) + 'px';
			}
			else {
				page.stickyElement.style.position = 'relative';
				page.pageElement.style.scrollSnapAlign = page.pageHeight < viewportHeight ? 'center' : 'start';
			}

			return page;
		} );

		this.setTriggerRanges();

		/*
		console.log(this.slideTriggers.map( t => {
			return {
				range: `${t.range[0].toFixed(2)}-${t.range[1].toFixed(2)}`,
				triggers: t.page.scrollTriggers.map( t => {
					return `${t.range[0].toFixed(2)}-${t.range[1].toFixed(2)}`
				}).join( ', ' ),
			}
		}))
		*/

		this.viewportElement.setAttribute( 'data-scrollbar', config.scrollProgress );

		if( config.scrollProgress && this.totalScrollTriggerCount > 1 ) {
			// Create the progress bar if it doesn't already exist
			if( !this.progressBar ) this.createProgressBar();

			this.syncProgressBar();
		}
		else {
			this.removeProgressBar();
		}

	}

	/**
	 * Calculates and sets the scroll range for all of our scroll
	 * triggers.
	 */
	setTriggerRanges() {

		// Calculate the total number of scroll triggers
		this.totalScrollTriggerCount = this.slideTriggers.reduce( ( total, trigger ) => {
			return total + Math.max( trigger.page.scrollTriggers.length, 1 );
		}, 0 );

		let rangeStart = 0;

		// Calculate the scroll range of each scroll trigger on a scale
		// of 0-1
		this.slideTriggers.forEach( ( trigger, i ) => {
			trigger.range = [
				rangeStart,
				rangeStart + Math.max( trigger.page.scrollTriggers.length, 1 ) / this.totalScrollTriggerCount
			];

			const scrollTriggerSegmentSize = ( trigger.range[1] - trigger.range[0] ) / trigger.page.scrollTriggers.length;

			// Set the range for each inner scroll trigger
			trigger.page.scrollTriggers.forEach( ( scrollTrigger, i ) => {
				scrollTrigger.range = [
					rangeStart + i * scrollTriggerSegmentSize,
					rangeStart + ( i + 1 ) * scrollTriggerSegmentSize
				];
			} );

			rangeStart = trigger.range[1];
		} );

	}

	/**
	 * Creates one scroll trigger for each fragments in the given page.
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

		if( page.autoAnimateElements.length > 0 ) {

			// Triggers for each subsequent auto-animate slide
			this.slideTriggers.push( ...Array.from( page.autoAnimateElements ).map( ( autoAnimateElement, i ) => {
				let autoAnimatePage = this.createPage({
					slideElement: autoAnimateElement.querySelector( 'section' ),
					contentElement: autoAnimateElement,
					backgroundElement: autoAnimateElement.querySelector( '.slide-background' )
				});

				// Create fragment scroll triggers for the auto-animate slide
				this.createFragmentTriggersForPage( autoAnimatePage, autoAnimatePage.slideElement );

				page.autoAnimatePages.push( autoAnimatePage );

				// Return our slide trigger
				return {
					page: autoAnimatePage,
					activate: () => this.activatePage( autoAnimatePage ),
					deactivate: () => this.deactivatePage( autoAnimatePage )
				};
			}));
		}

	}

	/**
	 * Helper method for creating a page definition and adding
	 * required fields. A "page" is a slide or auto-animate step.
	 */
	createPage( page ) {

		page.scrollTriggers = [];
		page.indexh = parseInt( page.slideElement.getAttribute( 'data-index-h' ), 10 );
		page.indexv = parseInt( page.slideElement.getAttribute( 'data-index-v' ), 10 );

		return page;

	}

	/**
	 * Rerenders progress bar segments so that they match the current
	 * reveal.js config and size.
	 */
	syncProgressBar() {

		this.progressBarInner.querySelectorAll( '.scrollbar-slide' ).forEach( slide => slide.remove() );

		const scrollHeight = this.viewportElement.scrollHeight;
		const viewportHeight = this.viewportElement.offsetHeight;
		const viewportHeightFactor = viewportHeight / scrollHeight;

		this.progressBarHeight = this.progressBarInner.offsetHeight;
		this.playheadHeight = Math.max( viewportHeightFactor * this.progressBarHeight, MIN_PLAYHEAD_HEIGHT );
		this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;

		const progressSegmentHeight = viewportHeight / scrollHeight * this.progressBarHeight;
		const spacing = Math.min( progressSegmentHeight / 8, MAX_PROGRESS_SPACING );

		this.progressBarPlayhead.style.height = this.playheadHeight - spacing + 'px';

		// Don't show individual segments if they're too small
		if( progressSegmentHeight > MIN_PROGRESS_SEGMENT_HEIGHT ) {

			this.slideTriggers.forEach( slideTrigger => {

				const { page } = slideTrigger;

				// Visual representation of a slide
				page.progressBarSlide = document.createElement( 'div' );
				page.progressBarSlide.className = 'scrollbar-slide';
				page.progressBarSlide.style.top = slideTrigger.range[0] * this.progressBarHeight + 'px';
				page.progressBarSlide.style.height = ( slideTrigger.range[1] - slideTrigger.range[0] ) * this.progressBarHeight - spacing + 'px';
				page.progressBarSlide.classList.toggle( 'has-triggers', page.scrollTriggers.length > 0 );
				this.progressBarInner.appendChild( page.progressBarSlide );

				// Visual representations of each scroll trigger
				page.scrollTriggerElements = page.scrollTriggers.map( ( trigger, i ) => {

					const triggerElement = document.createElement( 'div' );
					triggerElement.className = 'scrollbar-trigger';
					triggerElement.style.top = ( trigger.range[0] - slideTrigger.range[0] ) * this.progressBarHeight + 'px';
					triggerElement.style.height = ( trigger.range[1] - trigger.range[0] ) * this.progressBarHeight - spacing + 'px';
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
	 * Reads the current scroll position and updates our active
	 * trigger states accordingly.
	 */
	syncScrollPosition() {

		const viewportHeight = this.viewportElement.offsetHeight;
		const viewportHeightFactor = viewportHeight / this.viewportElement.scrollHeight;

		const scrollTop = this.viewportElement.scrollTop;
		const scrollHeight = this.viewportElement.scrollHeight - viewportHeight
		const scrollProgress = Math.max( Math.min( scrollTop / scrollHeight, 1 ), 0 );
		const scrollProgressMid = Math.max( Math.min( ( scrollTop + viewportHeight / 2 ) / this.viewportElement.scrollHeight, 1 ), 0 );

		let activePage;

		this.slideTriggers.forEach( ( trigger ) => {
			const { page } = trigger;

			const shouldPreload = scrollProgress >= trigger.range[0] - viewportHeightFactor*2 &&
														scrollProgress <= trigger.range[1] + viewportHeightFactor*2;

			// Load slides that are within the preload range
			if( shouldPreload && !page.loaded ) {
				page.loaded = true;
				this.Reveal.slideContent.load( page.slideElement );
			}
			else if( page.loaded ) {
				page.loaded = false;
				this.Reveal.slideContent.unload( page.slideElement );
			}

			// If we're within this trigger range, activate it
			if( scrollProgress >= trigger.range[0] && scrollProgress <= trigger.range[1] ) {
				this.activateTrigger( trigger );
				activePage = trigger.page;
			}
			// .. otherwise deactivate
			else if( trigger.active ) {
				this.deactivateTrigger( trigger );
			}
		} );

		// Each page can have its own scroll triggers, check if any of those
		// need to be activated/deactivated
		if( activePage ) {
			activePage.scrollTriggers.forEach( ( trigger ) => {
				if( scrollProgressMid >= trigger.range[0] && scrollProgressMid <= trigger.range[1] ) {
					this.activateTrigger( trigger );
				}
				else if( trigger.active ) {
					this.deactivateTrigger( trigger );
				}
			} );
		}

		// Update our visual progress indication
		this.setProgressBarValue( scrollTop / ( this.viewportElement.scrollHeight - viewportHeight ) );

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
					page.progressBarSlide.classList.toggle( 'active', page.active === true );

					page.scrollTriggers.forEach( ( trigger, i ) => {
						page.scrollTriggerElements[i].classList.toggle( 'active', page.active === true && trigger.active === true );
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

		if( this.Reveal.getConfig().scrollProgress === 'auto' && !this.draggingProgressBar ) {

			this.hideProgressBarTimeout = setTimeout( () => {
				if( this.progressBar ) {
					this.progressBar.classList.remove( 'visible' );
				}
			}, HIDE_SCROLLBAR_TIMEOUT );

		}

	}

	/**
	 * Scrolls the given slide element into view.
	 *
	 * @param {HTMLElement} slideElement
	 */
	scrollToSlide( slideElement ) {

		// If the scroll view isn't active yet, queue this action
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

	/**
	 * Persists the current scroll position to session storage
	 * so that it can be restored.
	 */
	storeScrollPosition() {

		clearTimeout( this.storeScrollPositionTimeout );

		this.storeScrollPositionTimeout = setTimeout( () => {
			sessionStorage.setItem( 'reveal-scroll-top', this.viewportElement.scrollTop );
			sessionStorage.setItem( 'reveal-scroll-origin', location.origin + location.pathname );

			this.storeScrollPositionTimeout = null;
		}, 50 );

	}

	/**
	 * Restores the scroll position when a deck is reloader.
	 */
	restoreScrollPosition() {

		const scrollPosition = sessionStorage.getItem( 'reveal-scroll-top' );
		const scrollOrigin = sessionStorage.getItem( 'reveal-scroll-origin' );

		if( scrollPosition && scrollOrigin === location.origin + location.pathname ) {
			this.viewportElement.scrollTop = parseInt( scrollPosition, 10 );
		}

	}

	/**
	 * Activates the given page and starts its embedded conten
	 * if there is any.
	 *
	 * @param {object} page
	 */
	activatePage( page ) {

		if( !page.active ) {

			page.active = true;

			const { slideElement, backgroundElement, contentElement, indexh, indexv } = page;

			contentElement.style.display = 'block';

			slideElement.classList.add( 'present' );

			if( backgroundElement ) {
				backgroundElement.classList.add( 'present' );
			}

			this.Reveal.setCurrentScrollPage( slideElement, indexh, indexv );
			this.Reveal.backgrounds.bubbleSlideContrastClassToElement( slideElement, this.viewportElement );

			// If this page is part of an auto-animation there will be one
			// content element per auto-animated page. We need to show the
			// current page and hide all others.
			Array.from( contentElement.parentNode.querySelectorAll( '.scroll-page-content' ) ).forEach( sibling => {
				if( sibling !== contentElement ) {
					sibling.style.display = 'none';
				}
			});

		}

	}

	/**
	 * Deactivates the page after it has been visible.
	 *
	 * @param {object} page
	 */
	deactivatePage( page ) {

		if( page.active ) {

			page.active = false;
			page.slideElement.classList.remove( 'present' );
			page.backgroundElement.classList.remove( 'present' );

		}

	}

	activateTrigger( trigger ) {

		if( !trigger.active ) {
			trigger.active = true;
			trigger.activate();
		}

	}

	deactivateTrigger( trigger ) {

		if( trigger.active ) {
			trigger.active = false;

			if( trigger.deactivate ) {
				trigger.deactivate();
			}
		}

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

	/**
	 * Retrieve a list of all scroll triggers for the given slide
	 * DOM element.
	 *
	 * @param {HTMLElement} slide
	 * @returns {Array}
	 */
	getScrollTriggerBySlide( slide ) {

		return this.slideTriggers.find( trigger => trigger.page.slideElement === slide );

	}

	/**
	 * Get a list of all pages in the scroll view. This includes
	 * both top-level slides and auto-animate steps.
	 *
	 * @returns {Array}
	 */
	getAllPages() {

		return this.pages.flatMap( page => [page, ...(page.autoAnimatePages || [])] );

	}

	onScroll() {

		this.syncScrollPosition();
		this.storeScrollPosition();

	}

	get viewportElement() {

		return this.Reveal.getViewportElement();

	}

}
