/**
 * Deepest vertical stack in the deck.
 *
 * Parallax background travel is divided by this depth so that
 * parallel stacks are not added together. A horizontal slide
 * with no nested <section> elements contributes 0 because it
 * never increments the vertical index.
 *
 * @param {Element[]} horizontalSlides
 * @return {number}
 */
export function getMaxVerticalSlideCount( horizontalSlides ) {

	let max = 0;

	horizontalSlides.forEach( slide => {
		const count = slide.querySelectorAll( 'section' ).length;
		if( count > max ) max = count;
	} );

	return max;

}
