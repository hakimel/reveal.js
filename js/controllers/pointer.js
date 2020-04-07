/**
 * Handles hiding of the pointer/cursor when inactive.
 */
export default class Pointer {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		// Throttles mouse wheel navigation
		this.lastMouseWheelStep = 0;

		// Is the mouse pointer currently hidden from view
		this.cursorHidden = false;

		// Timeout used to determine when the cursor is inactive
		this.cursorInactiveTimeout = 0;

		this.onDocumentCursorActive = this.onDocumentCursorActive.bind( this );
		this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind( this );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', this.onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', this.onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', this.onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', this.onDocumentMouseScroll, false );
		}

		// Auto-hide the mouse pointer when its inactive
		if( config.hideInactiveCursor ) {
			document.addEventListener( 'mousemove', this.onDocumentCursorActive, false );
			document.addEventListener( 'mousedown', this.onDocumentCursorActive, false );
		}
		else {
			this.showCursor();

			document.removeEventListener( 'mousemove', this.onDocumentCursorActive, false );
			document.removeEventListener( 'mousedown', this.onDocumentCursorActive, false );
		}

	}

	/**
	 * Shows the mouse pointer after it has been hidden with
	 * #hideCursor.
	 */
	showCursor() {

		if( this.cursorHidden ) {
			this.cursorHidden = false;
			this.Reveal.getRevealElement().style.cursor = '';
		}

	}

	/**
	 * Hides the mouse pointer when it's on top of the .reveal
	 * container.
	 */
	hideCursor() {

		if( this.cursorHidden === false ) {
			this.cursorHidden = true;
			this.Reveal.getRevealElement().style.cursor = 'none';
		}

	}

	/**
	 * Called whenever there is mouse input at the document level
	 * to determine if the cursor is active or not.
	 *
	 * @param {object} event
	 */
	onDocumentCursorActive( event ) {

		this.showCursor();

		clearTimeout( this.cursorInactiveTimeout );

		this.cursorInactiveTimeout = setTimeout( this.hideCursor.bind( this ), this.Reveal.getConfig().hideCursorTime );

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	onDocumentMouseScroll( event ) {

		if( Date.now() - this.lastMouseWheelStep > 1000 ) {

			this.lastMouseWheelStep = Date.now();

			let delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				this.Reveal.next();
			}
			else if( delta < 0 ) {
				this.Reveal.prev();
			}

		}

	}

}