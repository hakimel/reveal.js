/**
 * Handles the display of reveal.js' optional slide number.
 */
export default class SlideNumber {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	render() {

		this.element = document.createElement( 'div' );
		this.element.className = 'slide-number';
		this.Reveal.getRevealElement().appendChild( this.element );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		let slideNumberDisplay = 'none';
		if( config.slideNumber && !this.Reveal.isPrintingPDF() ) {
			if( config.showSlideNumber === 'all' ) {
				slideNumberDisplay = 'block';
			}
			else if( config.showSlideNumber === 'speaker' && this.Reveal.isSpeakerNotes() ) {
				slideNumberDisplay = 'block';
			}
		}

		this.element.style.display = slideNumberDisplay;

	}

	/**
	 * Updates the slide number to match the current slide.
	 */
	update() {

		// Update slide number if enabled
		if( this.Reveal.getConfig().slideNumber && this.element ) {
			this.element.innerHTML = this.getSlideNumber();
		}

	}

	/**
	 * Returns the HTML string corresponding to the current slide
	 * number, including formatting.
	 */
	getSlideNumber( slide = this.Reveal.getCurrentSlide() ) {

		let config = this.Reveal.getConfig();
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
			if( !/c/.test( format ) && this.Reveal.getHorizontalSlides().length === 1 ) {
				format = 'c';
			}

			// Offset the current slide number by 1 to make it 1-indexed
			let horizontalOffset = slide && slide.dataset.visibility === 'uncounted' ? 0 : 1;

			value = [];
			switch( format ) {
				case 'c':
					value.push( this.Reveal.getSlidePastCount( slide ) + horizontalOffset );
					break;
				case 'c/t':
					value.push( this.Reveal.getSlidePastCount( slide ) + horizontalOffset, '/', this.Reveal.getTotalSlides() );
					break;
				default:
					let indices = this.Reveal.getIndices( slide );
					value.push( indices.h + horizontalOffset );
					let sep = format === 'h/v' ? '/' : '.';
					if( this.Reveal.isVerticalSlide( slide ) ) value.push( sep, indices.v + 1 );
			}
		}

		let url = '#' + this.Reveal.location.getHash( slide );
		return this.formatNumber( value[0], value[1], value[2], url );

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
	formatNumber( a, delimiter, b, url = '#' + this.Reveal.location.getHash() ) {

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

}