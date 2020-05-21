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