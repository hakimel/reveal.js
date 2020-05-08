import { supportsHistoryAPI } from '../utils/device.js'

/**
 * Reads and writes the URL based on reveal.js' current state.
 */
export default class Location {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		// Delays updates to the URL due to a Chrome thumbnailer bug
		this.writeURLTimeout = 0;

		this.onWindowHashChange = this.onWindowHashChange.bind( this );

	}

	bind() {

		window.addEventListener( 'hashchange', this.onWindowHashChange, false );

	}

	unbind() {

		window.removeEventListener( 'hashchange', this.onWindowHashChange, false );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	readURL() {

		let config = this.Reveal.getConfig();
		let indices = this.Reveal.getIndices();
		let currentSlide = this.Reveal.getCurrentSlide();

		let hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		let bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#\/?/gi, '' );

		// If the first bit is not fully numeric and there is a name we
		// can assume that this is a named link
		if( !/^[0-9]*$/.test( bits[0] ) && name.length ) {
			let element;

			let f;

			// Parse named links with fragments (#/named-link/2)
			if( /\/[-\d]+$/g.test( name ) ) {
				f = parseInt( name.split( '/' ).pop(), 10 );
				f = isNaN(f) ? undefined : f;
				name = name.split( '/' ).shift();
			}

			// Ensure the named link is a valid HTML ID attribute
			try {
				element = document.getElementById( decodeURIComponent( name ) );
			}
			catch ( error ) { }

			// Ensure that we're not already on a slide with the same name
			let isSameNameAsCurrentSlide = currentSlide ? currentSlide.getAttribute( 'id' ) === name : false;

			if( element ) {
				// If the slide exists and is not the current slide...
				if ( !isSameNameAsCurrentSlide || typeof f !== 'undefined' ) {
					// ...find the position of the named slide and navigate to it
					let slideIndices = this.Reveal.getIndices( element );
					this.Reveal.slide( slideIndices.h, slideIndices.v, f );
				}
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				this.Reveal.slide( indices.h || 0, indices.v || 0 );
			}
		}
		else {
			let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;

			// Read the index components of the hash
			let h = ( parseInt( bits[0], 10 ) - hashIndexBase ) || 0,
				v = ( parseInt( bits[1], 10 ) - hashIndexBase ) || 0,
				f;

			if( config.fragmentInURL ) {
				f = parseInt( bits[2], 10 );
				if( isNaN( f ) ) {
					f = undefined;
				}
			}

			if( h !== indices.h || v !== indices.v || f !== undefined ) {
				this.Reveal.slide( h, v, f );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	writeURL( delay ) {

		let config = this.Reveal.getConfig();
		let currentSlide = this.Reveal.getCurrentSlide();

		// Make sure there's never more than one timeout running
		clearTimeout( this.writeURLTimeout );

		// If a delay is specified, timeout this call
		if( typeof delay === 'number' ) {
			this.writeURLTimeout = setTimeout( this.writeURL, delay );
		}
		else if( currentSlide ) {
			// If we're configured to push to history OR the history
			// API is not avaialble.
			if( config.history || supportsHistoryAPI === false ) {
				window.location.hash = this.getHash();
			}
			// If we're configured to reflect the current slide in the
			// URL without pushing to history.
			else if( config.hash ) {
				window.history.replaceState( null, null, '#' + this.getHash() );
			}
			// UPDATE: The below nuking of all hash changes breaks
			// anchors on pages where reveal.js is running. Removed
			// in 4.0. Why was it here in the first place? ¯\_(ツ)_/¯
			//
			// If history and hash are both disabled, a hash may still
			// be added to the URL by clicking on a href with a hash
			// target. Counter this by always removing the hash.
			// else {
			// 	window.history.replaceState( null, null, window.location.pathname + window.location.search );
			// }
		}

	}

	/**
	 * Return a hash URL that will resolve to the given slide location.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to link to
	 */
	getHash( slide ) {

		let url = '/';

		// Attempt to create a named link based on the slide's ID
		let s = slide || this.Reveal.getCurrentSlide();
		let id = s ? s.getAttribute( 'id' ) : null;
		if( id ) {
			id = encodeURIComponent( id );
		}

		let index = this.Reveal.getIndices( slide );
		if( !this.Reveal.getConfig().fragmentInURL ) {
			index.f = undefined;
		}

		// If the current slide has an ID, use that as a named link,
		// but we don't support named links with a fragment index
		if( typeof id === 'string' && id.length ) {
			url = '/' + id;

			// If there is also a fragment, append that at the end
			// of the named link, like: #/named-link/2
			if( index.f >= 0 ) url += '/' + index.f;
		}
		// Otherwise use the /h/v index
		else {
			let hashIndexBase = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
			if( index.h > 0 || index.v > 0 || index.f >= 0 ) url += index.h + hashIndexBase;
			if( index.v > 0 || index.f >= 0 ) url += '/' + (index.v + hashIndexBase );
			if( index.f >= 0 ) url += '/' + index.f;
		}

		return url;

	}

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	onWindowHashChange( event ) {

		this.readURL();

	}

}