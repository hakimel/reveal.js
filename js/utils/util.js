/**
 * Extend object a with the properties of object b.
 * If there's a conflict, object b takes precedence.
 *
 * @param {object} a
 * @param {object} b
 */
export const extend = ( a, b ) => {

	for( var i in b ) {
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

	var dx = a.x - b.x,
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
 * Injects the given CSS styles into the DOM.
 *
 * @param {string} value
 */
export const injectStyleSheet = ( value ) => {

	let tag = document.createElement( 'style' );
	tag.type = 'text/css';
	if( tag.styleSheet ) {
		tag.styleSheet.cssText = value;
	}
	else {
		tag.appendChild( document.createTextNode( value ) );
	}
	document.getElementsByTagName( 'head' )[0].appendChild( tag );

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
 * Converts various color input formats to an {r:0,g:0,b:0} object.
 *
 * @param {string} color The string representation of a color
 * @example
 * colorToRgb('#000');
 * @example
 * colorToRgb('#000000');
 * @example
 * colorToRgb('rgb(0,0,0)');
 * @example
 * colorToRgb('rgba(0,0,0)');
 *
 * @return {{r: number, g: number, b: number, [a]: number}|null}
 */
export const colorToRgb = ( color ) => {

	let hex3 = color.match( /^#([0-9a-f]{3})$/i );
	if( hex3 && hex3[1] ) {
		hex3 = hex3[1];
		return {
			r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
			g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
			b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
		};
	}

	let hex6 = color.match( /^#([0-9a-f]{6})$/i );
	if( hex6 && hex6[1] ) {
		hex6 = hex6[1];
		return {
			r: parseInt( hex6.substr( 0, 2 ), 16 ),
			g: parseInt( hex6.substr( 2, 2 ), 16 ),
			b: parseInt( hex6.substr( 4, 2 ), 16 )
		};
	}

	let rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
	if( rgb ) {
		return {
			r: parseInt( rgb[1], 10 ),
			g: parseInt( rgb[2], 10 ),
			b: parseInt( rgb[3], 10 )
		};
	}

	let rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
	if( rgba ) {
		return {
			r: parseInt( rgba[1], 10 ),
			g: parseInt( rgba[2], 10 ),
			b: parseInt( rgba[3], 10 ),
			a: parseFloat( rgba[4] )
		};
	}

	return null;

}

/**
 * Calculates brightness on a scale of 0-255.
 *
 * @param {string} color See colorToRgb for supported formats.
 * @see {@link colorToRgb}
 */
export const colorBrightness = ( color ) => {

	if( typeof color === 'string' ) color = colorToRgb( color );

	if( color ) {
		return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
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