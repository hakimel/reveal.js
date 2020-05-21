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
 * querySelectorAll but returns an Array.
 */
export const queryAll = ( el, selector ) => {

	return Array.from( el.querySelectorAll( selector ) );

}

/**
 * classList.toggle() with cross browser support
 */
export const toggleClass = ( el, className, value ) => {
	if( value ) {
		el.classList.add( className );
	}
	else {
		el.classList.remove( className );
	}
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
export const enterFullscreen = element => {

	element = element || document.documentElement;

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
 * Creates an HTML element and returns a reference to it.
 * If the element already exists the existing instance will
 * be returned.
 *
 * @param {HTMLElement} container
 * @param {string} tagname
 * @param {string} classname
 * @param {string} innerHTML
 *
 * @return {HTMLElement}
 */
export const createSingletonNode = ( container, tagname, classname, innerHTML='' ) => {

	// Find all nodes matching the description
	let nodes = container.querySelectorAll( '.' + classname );

	// Check all matches to find one which is a direct child of
	// the specified container
	for( let i = 0; i < nodes.length; i++ ) {
		let testNode = nodes[i];
		if( testNode.parentNode === container ) {
			return testNode;
		}
	}

	// If no node was found, create it now
	let node = document.createElement( tagname );
	node.className = classname;
	node.innerHTML = innerHTML;
	container.appendChild( node );

	return node;

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

/**
 * Returns the remaining height within the parent of the
 * target element.
 *
 * remaining height = [ configured parent height ] - [ current parent height ]
 *
 * @param {HTMLElement} element
 * @param {number} [height]
 */
export const getRemainingHeight = ( element, height = 0 ) => {

	if( element ) {
		let newHeight, oldHeight = element.style.height;

		// Change the .stretch element height to 0 in order find the height of all
		// the other elements
		element.style.height = '0px';

		// In Overview mode, the parent (.slide) height is set of 700px.
		// Restore it temporarily to its natural height.
		element.parentNode.style.height = 'auto';

		newHeight = height - element.parentNode.offsetHeight;

		// Restore the old height, just in case
		element.style.height = oldHeight + 'px';

		// Clear the parent (.slide) height. .removeProperty works in IE9+
		element.parentNode.style.removeProperty('height');

		return newHeight;
	}

	return height;

}