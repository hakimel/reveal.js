import test from 'node:test';
import assert from 'node:assert/strict';
import { getMaxVerticalSlideCount } from '../../js/utils/vertical-slide-count.js';

function slideWithVerticalSections( count ) {
	return {
		querySelectorAll( selector ) {
			if( selector !== 'section' ) return [];
			return Array.from( { length: count } );
		}
	};
}

test( 'ignores horizontal slides that have no nested sections', () => {
	assert.equal( getMaxVerticalSlideCount( [ slideWithVerticalSections( 0 ) ] ), 0 );
} );

test( 'returns the tallest stack, not the total number of vertical slides', () => {
	// Layout from https://github.com/hakimel/reveal.js/issues/3878
	// A-B, C-D-E, F-G, H-I-J-K, L
	const slides = [
		slideWithVerticalSections( 2 ),
		slideWithVerticalSections( 3 ),
		slideWithVerticalSections( 2 ),
		slideWithVerticalSections( 4 ),
		slideWithVerticalSections( 0 )
	];
	const totalVertical = 2 + 3 + 2 + 4;
	assert.equal( getMaxVerticalSlideCount( slides ), 4 );
	assert.notEqual( getMaxVerticalSlideCount( slides ), totalVertical );
} );

test( 'auto parallax step uses the tallest stack as the divisor', () => {
	const backgroundHeight = 1200;
	const slideHeight = 0;
	const slides = [
		slideWithVerticalSections( 2 ),
		slideWithVerticalSections( 3 ),
		slideWithVerticalSections( 2 ),
		slideWithVerticalSections( 4 ),
		slideWithVerticalSections( 0 )
	];
	const verticalSlideCount = getMaxVerticalSlideCount( slides );
	const multiplier = verticalSlideCount > 1
		? ( backgroundHeight - slideHeight ) / ( verticalSlideCount - 1 )
		: 0;
	assert.equal( multiplier, 400 );
	assert.equal( multiplier * 3, 1200 );
} );
