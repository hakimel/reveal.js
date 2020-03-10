import { enterFullscreen } from '../utils/util.js'

/**
 * Handles all reveal.js keyboard interactions.
 */
export default class Location {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	/**
	 * Return a hash URL that will resolve to the given slide location.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to link to
	 */
	getHash( slide = this.Reveal.getCurrentSlide() ) {

		let url = '/';

		// Attempt to create a named link based on the slide's ID
		let id = slide ? slide.getAttribute( 'id' ) : null;
		if( id ) {
			id = encodeURIComponent( id );
		}

		let index = this.Reveal.getIndices( slide );
		if( !this.Reveal.getConfig().fragmentInURL ) {
			index.f = undefined;
		}

		// If the current slide has an ID, use that as a named link,
		// but we don't support named links with a fragment index
		if( typeof id === 'string' && id.length && index.f === undefined ) {
			url = '/' + id;
		}
		// Otherwise use the /h/v index
		else {
			let hashIndexBase = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
			if( index.h > 0 || index.v > 0 || index.f !== undefined ) url += index.h + hashIndexBase;
			if( index.v > 0 || index.f !== undefined ) url += '/' + (index.v + hashIndexBase );
			if( index.f !== undefined ) url += '/' + index.f;
		}

		return url;

	}

}