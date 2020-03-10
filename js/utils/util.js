/**
 * Extend object a with the properties of object b.
 * If there's a conflict, object b takes precedence.
 *
 * @param {object} a
 * @param {object} b
 */
export const extend = ( a, b ) => {

	for( let i in b ) {
		a[ i ] = b[ i ];
	}

	return a;

}

/**
 * Converts the target object to an array.
 *
 * @param {object} o
 * @return {object[]}
 */
export const toArray = ( o ) => {

	return Array.prototype.slice.call( o );

}

/**
 * Utility for deserializing a value.
 *
 * @param {*} value
 * @return {*}
 */
export const deserialize = ( value ) => {

	if( typeof value === 'string' ) {
		if( value === 'null' ) return null;
		else if( value === 'true' ) return true;
		else if( value === 'false' ) return false;
		else if( value.match( /^-?[\d\.]+$/ ) ) return parseFloat( value );
	}

	return value;

}

/**
 * Measures the distance in pixels between point a
 * and point b.
 *
 * @param {object} a point with x/y properties
 * @param {object} b point with x/y properties
 *
 * @return {number}
 */
export const distanceBetween = ( a, b ) => {

	let dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt( dx*dx + dy*dy );

}

/**
 * Applies a CSS transform to the target element.
 *
 * @param {HTMLElement} element
 * @param {string} transform
 */
export const transformElement = ( element, transform ) => {

	element.style.transform = transform;

}

/**
 * Find the closest parent that matches the given
 * selector.
 *
 * @param {HTMLElement} target The child element
 * @param {String} selector The CSS selector to match
 * the parents against
 *
 * @return {HTMLElement} The matched parent or null
 * if no matching parent was found
 */
export const closestParent = ( target, selector ) => {

	let parent = target.parentNode;

	while( parent ) {

		// There's some overhead doing this each time, we don't
		// want to rewrite the element prototype but should still
		// be enough to feature detect once at startup...
		let matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

		// If we find a match, we're all set
		if( matchesMethod && matchesMethod.call( parent, selector ) ) {
			return parent;
		}

		// Keep searching
		parent = parent.parentNode;

	}

	return null;

}

/**
 * Handling the fullscreen functionality via the fullscreen API
 *
 * @see http://fullscreen.spec.whatwg.org/
 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
 */
export const enterFullscreen = () => {

	let element = document.documentElement;

	// Check which implementation is available
	let requestMethod = element.requestFullscreen ||
						element.webkitRequestFullscreen ||
						element.webkitRequestFullScreen ||
						element.mozRequestFullScreen ||
						element.msRequestFullscreen;

	if( requestMethod ) {
		requestMethod.apply( element );
	}

}

/**
 * Injects the given CSS styles into the DOM.
 *
 * @param {string} value
 */
export const createStyleSheet = ( value ) => {

	let tag = document.createElement( 'style' );
	tag.type = 'text/css';

	if( value && value.length > 0 ) {
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
	}

	document.head.appendChild( tag );

	return tag;

}

/**
 * Returns a key:value hash of all query params.
 */
export const getQueryHash = () => {

	let query = {};

	location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, a => {
		query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
	} );

	// Basic deserialization
	for( let i in query ) {
		let value = query[ i ];

		query[ i ] = deserialize( unescape( value ) );
	}

	// Do not accept new dependencies via query config to avoid
	// the potential of malicious script injection
	if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

	return query;

}