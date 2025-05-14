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

		const query = this.jumpInput.value.trim( '' );
		let indices = this.Reveal.location.getIndicesFromHash( query, { oneBasedIndex: true } );

		// If no valid index was found and the input query is a
		// string, fall back on a simple search
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