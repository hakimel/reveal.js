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
	async setupPDF() {

		const config = this.Reveal.getConfig();
		const slides = queryAll( this.Reveal.getRevealElement(), SLIDES_SELECTOR )

		// Compute slide numbers now, before we start duplicating slides
		const injectPageNumbers = config.slideNumber && /all|print/i.test( config.showSlideNumber );

		const slideSize = this.Reveal.getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		const pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		const slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		await new Promise( requestAnimationFrame );

		// Let the browser know what page size we want to print
		createStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0px;}' );

		// Limit the size of certain elements to the dimensions of the slide
		createStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.documentElement.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		const viewportElement = document.querySelector( '.reveal-viewport' );
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

		// Batch scrollHeight access to prevent layout thrashing
		await new Promise( requestAnimationFrame );

		const slideScrollHeights = slides.map( slide => slide.scrollHeight );

		const pages = [];
		const pageContainer = slides[0].parentNode;
		let slideNumber = 1;

		// Slide and slide background layout
		slides.forEach( function( slide, index ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				let left = ( pageWidth - slideWidth ) / 2;
				let top = ( pageHeight - slideHeight ) / 2;

				const contentHeight = slideScrollHeights[ index ];
				let numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				const page = document.createElement( 'div' );
				pages.push( page );

				page.className = 'pdf-page';
				page.style.height = ( ( pageHeight + config.pdfPageHeightOffset ) * numberOfPages ) + 'px';

				// Copy the presentation-wide background to each individual
				// page when printing
				if( presentationBackground ) {
					page.style.background = presentationBackground;
				}

				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				// Re-run the slide layout so that r-fit-text is applied based on
				// the printed slide size
				this.Reveal.slideContent.layout( slide )

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					const notes = this.Reveal.getSlideNotes( slide );
					if( notes ) {

						const notesSpacing = 8;
						const notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						const notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							pages.push( notesElement );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject page numbers if `slideNumbers` are enabled
				if( injectPageNumbers ) {
					const numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = slideNumber++;
					page.appendChild( numberElement );
				}

				// Copy page and show fragments one after another
				if( config.pdfSeparateFragments ) {

					// Each fragment 'group' is an array containing one or more
					// fragments. Multiple fragments that appear at the same time
					// are part of the same group.
					const fragmentGroups = this.Reveal.fragments.sort( page.querySelectorAll( '.fragment' ), true );

					let previousFragmentStep;

					fragmentGroups.forEach( function( fragments, index ) {

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
						const clonedPage = page.cloneNode( true );

						// Inject unique page numbers for fragments
						if( injectPageNumbers ) {
							const numberElement = clonedPage.querySelector( '.slide-number-pdf' );
							const fragmentNumber = index + 1;
							numberElement.innerHTML += '.' + fragmentNumber;
						}

						pages.push( clonedPage );

						previousFragmentStep = fragments;

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

		await new Promise( requestAnimationFrame );

		pages.forEach( page => pageContainer.appendChild( page ) );

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
