/**
 * Handles the showing of speaker notes
 */
export default class Notes {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	render() {

		this.element = document.createElement( 'div' );
		this.element.className = 'speaker-notes';
		this.element.setAttribute( 'data-prevent-swipe', '' );
		this.element.setAttribute( 'tabindex', '0' );
		this.Reveal.getRevealElement().appendChild( this.element );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		if( config.showNotes ) {
			this.element.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	update() {

		if( this.Reveal.getConfig().showNotes &&
			this.element && this.Reveal.getCurrentSlide() &&
			!this.Reveal.isScrollView() &&
			!this.Reveal.isPrintView()
		) {
			this.element.innerHTML = this.getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';
		}

	}

	/**
	 * Updates the visibility of the speaker notes sidebar that
	 * is used to share annotated slides. The notes sidebar is
	 * only visible if showNotes is true and there are notes on
	 * one or more slides in the deck.
	 */
	updateVisibility() {

		if( this.Reveal.getConfig().showNotes &&
			this.hasNotes() &&
			!this.Reveal.isScrollView() &&
			!this.Reveal.isPrintView()
		) {
			this.Reveal.getRevealElement().classList.add( 'show-notes' );
		}
		else {
			this.Reveal.getRevealElement().classList.remove( 'show-notes' );
		}

	}

	/**
	 * Checks if there are speaker notes for ANY slide in the
	 * presentation.
	 */
	hasNotes() {

		return this.Reveal.getSlidesElement().querySelectorAll( '[data-notes], aside.notes' ).length > 0;

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	isSpeakerNotesWindow() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. With <aside class="notes"> elements inside the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	getSlideNotes( slide = this.Reveal.getCurrentSlide() ) {

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using <aside class="notes"> elements
		let notesElements = slide.querySelectorAll( 'aside.notes' );
		if( notesElements ) {
			return Array.from(notesElements).map( notesElement => notesElement.innerHTML ).join( '\n' );
		}

		return null;

	}

	destroy() {

		this.element.remove();

	}

}