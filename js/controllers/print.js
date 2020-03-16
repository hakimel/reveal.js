import { SLIDES_SELECTOR } from '../utils/constants.js'
import { queryAll, createStyleSheet } from '../utils/util.js'

/**
 * Setups up our presentation for printing/exporting to PDF.
 */
export default class Print {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	setupPDF() {

		let config = this.Reveal.getConfig();

		let slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );

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

		document.documentElement.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Make sure stretch elements fit on slide
		this.Reveal.layoutSlideContents( slideWidth, slideHeight );

		// Compute slide numbers now, before we start duplicating slides
		let doingSlideNumbers = config.slideNumber && /all|print/i.test( config.showSlideNumber );
		queryAll( this.Reveal.getRevealElement(), SLIDES_SELECTOR ).forEach( function( slide ) {
			slide.setAttribute( 'data-slide-number', this.Reveal.slideNumber.getSlideNumber( slide ) );
		}, this );

		// Slide and slide background layout
		queryAll( this.Reveal.getRevealElement(), SLIDES_SELECTOR ).forEach( function( slide ) {

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
					let fragmentGroups = this.Reveal.fragments.sort( page.querySelectorAll( '.fragment' ), true );

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
						}, this );

						// Create a separate page for the current fragment state
						let clonedPage = page.cloneNode( true );
						page.parentNode.insertBefore( clonedPage, ( previousPage || page ).nextSibling );

						previousFragmentStep = fragments;
						previousPage = clonedPage;

					}, this );

					// Reset the first/original page so that all fragments are hidden
					fragmentGroups.forEach( function( fragments ) {
						fragments.forEach( function( fragment ) {
							fragment.classList.remove( 'visible', 'current-fragment' );
						} );
					} );

				}
				// Show all fragments
				else {
					queryAll( page, '.fragment:not(.fade-out)' ).forEach( function( fragment ) {
						fragment.classList.add( 'visible' );
					} );
				}

			}

		}, this );

		// Notify subscribers that the PDF layout is good to go
		this.Reveal.dispatchEvent({ type: 'pdf-ready' });

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

}