import {
	SLIDE_NUMBER_FORMAT_CURRENT,
	SLIDE_NUMBER_FORMAT_CURRENT_SLASH_TOTAL
} from "../utils/constants";

/**
 * Makes it possible to jump to a slide by entering its
 * slide number or id.
 */
export default class JumpToSlide {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		this.onInput = this.onInput.bind( this );
		this.onBlur = this.onBlur.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );

	}

	render() {

		this.element = document.createElement( 'div' );
		this.element.className = 'jump-to-slide';

    this.jumpInput = document.createElement( 'input' );
    this.jumpInput.type = 'text';
    this.jumpInput.className = 'jump-to-slide-input';
    this.jumpInput.placeholder = 'Jump to slide';
		this.jumpInput.addEventListener( 'input', this.onInput );
		this.jumpInput.addEventListener( 'keydown', this.onKeyDown );
		this.jumpInput.addEventListener( 'blur', this.onBlur );

    this.element.appendChild( this.jumpInput );

	}

	show() {

		this.indicesOnShow = this.Reveal.getIndices();

		this.Reveal.getRevealElement().appendChild( this.element );
		this.jumpInput.focus();

	}

	hide() {

		if( this.isVisible() ) {
			this.element.remove();
			this.jumpInput.value = '';

			clearTimeout( this.jumpTimeout );
			delete this.jumpTimeout;
		}

	}

	isVisible() {

		return !!this.element.parentNode;

	}

	/**
	 * Parses the current input and jumps to the given slide.
	 */
	jump() {

		clearTimeout( this.jumpTimeout );
		delete this.jumpTimeout;

		let query = this.jumpInput.value.trim( '' );
		let indices;

		// When slide numbers are formatted to be a single linear mumber
		// (instead of showing a separate horizontal/vertical index) we
		// use the same format for slide jumps
		if( /^\d+$/.test( query ) ) {
			const slideNumberFormat = this.Reveal.getConfig().slideNumber;
			if( slideNumberFormat === SLIDE_NUMBER_FORMAT_CURRENT || slideNumberFormat === SLIDE_NUMBER_FORMAT_CURRENT_SLASH_TOTAL ) {
				const slide = this.Reveal.getSlides()[ parseInt( query, 10 ) - 1 ];
				if( slide ) {
					indices = this.Reveal.getIndices( slide );
				}
			}
		}

		if( !indices ) {
			// If the query uses "horizontal.vertical" format, convert to
			// "horizontal/vertical" so that our URL parser can understand
			if( /^\d+\.\d+$/.test( query ) ) {
				query = query.replace( '.', '/' );
			}

			indices = this.Reveal.location.getIndicesFromHash( query, { oneBasedIndex: true } );
		}

		// Still no valid index? Fall back on a text search
		if( !indices && /\S+/i.test( query ) && query.length > 1 ) {
			indices = this.search( query );
		}

		if( indices && query !== '' ) {
			this.Reveal.slide( indices.h, indices.v, indices.f );
			return true;
		}
		else {
			this.Reveal.slide( this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f );
			return false;
		}

	}

	jumpAfter( delay ) {

		clearTimeout( this.jumpTimeout );
		this.jumpTimeout = setTimeout( () => this.jump(), delay );

	}

	/**
	 * A lofi search that looks for the given query in all
	 * of our slides and returns the first match.
	 */
	search( query ) {

		const regex = new RegExp( '\\b' + query.trim() + '\\b', 'i' );

		const slide = this.Reveal.getSlides().find( ( slide ) => {
			return regex.test( slide.innerText );
		} );

		if( slide ) {
			return this.Reveal.getIndices( slide );
		}
		else {
			return null;
		}

	}

	/**
	 * Reverts back to the slide we were on when jump to slide was
	 * invoked.
	 */
	cancel() {

		this.Reveal.slide( this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f );
		this.hide();

	}

	confirm() {

		this.jump();
		this.hide();

	}

	destroy() {

		this.jumpInput.removeEventListener( 'input', this.onInput );
		this.jumpInput.removeEventListener( 'keydown', this.onKeyDown );
		this.jumpInput.removeEventListener( 'blur', this.onBlur );

		this.element.remove();

	}

	onKeyDown( event ) {

		if( event.keyCode === 13 ) {
			this.confirm();
		}
		else if( event.keyCode === 27 ) {
			this.cancel();

			event.stopImmediatePropagation();
		}

	}

	onInput( event ) {

		this.jumpAfter( 200 );

	}

	onBlur() {

		setTimeout( () => this.hide(), 1 );

	}

}