/**
 * Creates a visual progress bar for the presentation.
 */
export default class Progress {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.onProgressClicked = this.onProgressClicked.bind( this );

	}

	render() {

		this.element = document.createElement( 'div' );
		this.element.className = 'progress';
		this.element.role = 'progressbar';
		this.element.setAttribute('aria-valuemin', 1);
		this.element.setAttribute('aria-valuemax', this.Reveal.getTotalSlides());
		this.element.setAttribute('aria-valuenow', this.getCurrentProgressValue());
		this.element.setAttribute('aria-valuetext', `Slide ${this.getCurrentProgressValue()} of ${this.Reveal.getTotalSlides()}`);
		this.Reveal.getRevealElement().appendChild( this.element );

		this.bar = document.createElement( 'span' );
		this.element.appendChild( this.bar );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		this.element.style.display = config.progress ? 'block' : 'none';

	}

	bind() {

		if( this.Reveal.getConfig().progress && this.element ) {
			this.element.addEventListener( 'click', this.onProgressClicked, false );
		}

	}

	unbind() {

		if ( this.Reveal.getConfig().progress && this.element ) {
			this.element.removeEventListener( 'click', this.onProgressClicked, false );
		}

	}

	getCurrentProgressValue() {

		const value = Math.ceil(this.Reveal.getTotalSlides() * this.Reveal.getProgress());
		return value === 0 ? 1 : value;

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	update() {

		// Update progress if enabled
		if( this.Reveal.getConfig().progress && this.bar ) {

			let scale = this.Reveal.getProgress();

			// Don't fill the progress bar if there's only one slide
			if( this.Reveal.getTotalSlides() < 2 ) {
				scale = 0;
			}

			this.bar.style.transform = 'scaleX('+ scale +')';
			this.element.setAttribute('aria-valuemax', this.Reveal.getTotalSlides());
			this.element.setAttribute('aria-valuenow', this.getCurrentProgressValue());
			this.element.setAttribute('aria-valuetext', `Slide ${this.getCurrentProgressValue()} of ${this.Reveal.getTotalSlides()}`);

		}

	}

	getMaxWidth() {

		return this.Reveal.getRevealElement().offsetWidth;

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	onProgressClicked( event ) {

		this.Reveal.onUserInput( event );

		event.preventDefault();

		let slides = this.Reveal.getSlides();
		let slidesTotal = slides.length;
		let slideIndex = Math.floor( ( event.clientX / this.getMaxWidth() ) * slidesTotal );

		if( this.Reveal.getConfig().rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		let targetIndices = this.Reveal.getIndices(slides[slideIndex]);
		this.Reveal.slide( targetIndices.h, targetIndices.v );

	}

	destroy() {

		this.element.remove();

	}

}
