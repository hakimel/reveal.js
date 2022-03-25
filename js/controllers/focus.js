import { closest } from '../utils/util.js'

/**
 * Manages focus when a presentation is embedded. This
 * helps us only capture keyboard from the presentation
 * a user is currently interacting with in a page where
 * multiple presentations are embedded.
 */

const STATE_FOCUS = 'focus';
const STATE_BLUR = 'blur';

export default class Focus {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.onRevealPointerDown = this.onRevealPointerDown.bind( this );
		this.onDocumentPointerDown = this.onDocumentPointerDown.bind( this );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		if( config.embedded ) {
			this.blur();
		}
		else {
			this.focus();
			this.unbind();
		}

	}

	bind() {

		if( this.Reveal.getConfig().embedded ) {
			this.Reveal.getRevealElement().addEventListener( 'pointerdown', this.onRevealPointerDown, false );
		}

	}

	unbind() {

		this.Reveal.getRevealElement().removeEventListener( 'pointerdown', this.onRevealPointerDown, false );
		document.removeEventListener( 'pointerdown', this.onDocumentPointerDown, false );

	}

	focus() {

		if( this.state !== STATE_FOCUS ) {
			this.Reveal.getRevealElement().classList.add( 'focused' );
			document.addEventListener( 'pointerdown', this.onDocumentPointerDown, false );
		}

		this.state = STATE_FOCUS;

	}

	blur() {

		if( this.state !== STATE_BLUR ) {
			this.Reveal.getRevealElement().classList.remove( 'focused' );
			document.removeEventListener( 'pointerdown', this.onDocumentPointerDown, false );
		}

		this.state = STATE_BLUR;

	}

	isFocused() {

		return this.state === STATE_FOCUS;

	}

	destroy() {

		this.Reveal.getRevealElement().classList.remove( 'focused' );

	}

	onRevealPointerDown( event ) {

		this.focus();

	}

	onDocumentPointerDown( event ) {

		let revealElement = closest( event.target, '.reveal' );
		if( !revealElement || revealElement !== this.Reveal.getRevealElement() ) {
			this.blur();
		}

	}

}