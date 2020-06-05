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

		let slidesTotal = this.Reveal.getHorizontalSlides().length;
		let slideIndex = Math.floor( ( event.clientX / this.getMaxWidth() ) * slidesTotal );

		if( this.Reveal.getConfig().rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		this.Reveal.slide( slideIndex );

	}


}