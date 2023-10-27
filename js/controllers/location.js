/**
 * Reads and writes the URL based on reveal.js' current state.
 */
export default class Location {

	// The minimum number of milliseconds that must pass between
	// calls to history.replaceState
	MAX_REPLACE_STATE_FREQUENCY = 1000

	constructor( Reveal ) {

		this.Reveal = Reveal;

		// Delays updates to the URL due to a Chrome thumbnailer bug
		this.writeURLTimeout = 0;

		this.replaceStateTimestamp = 0;

		this.onWindowHashChange = this.onWindowHashChange.bind( this );

	}

	bind() {

		window.addEventListener( 'hashchange', this.onWindowHashChange, false );

	}

	unbind() {

		window.removeEventListener( 'hashchange', this.onWindowHashChange, false );

	}

	/**
	 * Returns the slide indices for the given hash link.
	 *
	 * @param {string} [hash] the hash string that we want to
	 * find the indices for
	 *
	 * @returns slide indices or null
	 */
	getIndicesFromHash( hash=window.location.hash, options={} ) {

		// Attempt to parse the hash as either an index or name
		let name = hash.replace( /^#\/?/, '' );
		let bits = name.split( '/' );

		// If the first bit is not fully numeric and there is a name we
		// can assume that this is a named link
		if( !/^[0-9]*$/.test( bits[0] ) && name.length ) {
			let slide;

			let f;

			// Parse named links with fragments (#/named-link/2)
			if( /\/[-\d]+$/g.test( name ) ) {
				f = parseInt( name.split( '/' ).pop(), 10 );
				f = isNaN(f) ? undefined : f;
				name = name.split( '/' ).shift();
			}

			// Ensure the named link is a valid HTML ID attribute
			try {
				slide = document
					.getElementById( decodeURIComponent( name ) )
					.closest('.slides section');
			}
			catch ( error ) { }

			if( slide ) {
				return { ...this.Reveal.getIndices( slide ), f };
			}
		}
		else {
			const config = this.Reveal.getConfig();
			let hashIndexBase = config.hashOneBasedIndex || options.oneBasedIndex ? 1 : 0;

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

			return { h, v, f };
		}

		// The hash couldn't be parsed or no matching named link was found
		return null

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	readURL() {

		const currentIndices = this.Reveal.getIndices();
		const newIndices = this.getIndicesFromHash();

		if( newIndices ) {
			if( ( newIndices.h !== currentIndices.h || newIndices.v !== currentIndices.v || newIndices.f !== undefined ) ) {
					this.Reveal.slide( newIndices.h, newIndices.v, newIndices.f );
			}
		}
		// If no new indices are available, we're trying to navigate to
		// a slide hash that does not exist
		else {
			this.Reveal.slide( currentIndices.h || 0, currentIndices.v || 0 );
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

			let hash = this.getHash();

			// If we're configured to push to history OR the history
			// API is not available.
			if( config.history ) {
				window.location.hash = hash;
			}
			// If we're configured to reflect the current slide in the
			// URL without pushing to history.
			else if( config.hash ) {
				// If the hash is empty, don't add it to the URL
				if( hash === '/' ) {
					this.debouncedReplaceState( window.location.pathname + window.location.search );
				}
				else {
					this.debouncedReplaceState( '#' + hash );
				}
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

	replaceState( url ) {

		window.history.replaceState( null, null, url );
		this.replaceStateTimestamp = Date.now();

	}

	debouncedReplaceState( url ) {

		clearTimeout( this.replaceStateTimeout );

		if( Date.now() - this.replaceStateTimestamp > this.MAX_REPLACE_STATE_FREQUENCY ) {
			this.replaceState( url );
		}
		else {
			this.replaceStateTimeout = setTimeout( () => this.replaceState( url ), this.MAX_REPLACE_STATE_FREQUENCY );
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