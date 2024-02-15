import { extend, queryAll } from '../utils/util.js'

/**
 * Handles sorting and navigation of slide fragments.
 * Fragments are elements within a slide that are
 * revealed/animated incrementally.
 */
export default class Fragments {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		if( config.fragments === false ) {
			this.disable();
		}
		else if( oldConfig.fragments === false ) {
			this.enable();
		}

	}

	/**
	 * If fragments are disabled in the deck, they should all be
	 * visible rather than stepped through.
	 */
	disable() {

		queryAll( this.Reveal.getSlidesElement(), '.fragment' ).forEach( element => {
			element.classList.add( 'visible' );
			element.classList.remove( 'current-fragment' );
		} );

	}

	/**
	 * Reverse of #disable(). Only called if fragments have
	 * previously been disabled.
	 */
	enable() {

		queryAll( this.Reveal.getSlidesElement(), '.fragment' ).forEach( element => {
			element.classList.remove( 'visible' );
			element.classList.remove( 'current-fragment' );
		} );

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {{prev: boolean, next: boolean}}
	 */
	availableRoutes() {

		let currentSlide = this.Reveal.getCurrentSlide();
		if( currentSlide && this.Reveal.getConfig().fragments ) {
			let fragments = currentSlide.querySelectorAll( '.fragment:not(.disabled)' );
			let hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.disabled):not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 *
	 * @param {object[]|*} fragments
	 * @param {boolean} grouped If true the returned array will contain
	 * nested arrays for all fragments with the same index
	 * @return {object[]} sorted Sorted array of fragments
	 */
	sort( fragments, grouped = false ) {

		fragments = Array.from( fragments );

		let ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( fragment => {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				let index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		let index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( group => {
			group.forEach( fragment => {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return grouped === true ? ordered : sorted;

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	sortAll() {

		this.Reveal.getHorizontalSlides().forEach( horizontalSlide => {

			let verticalSlides = queryAll( horizontalSlide, 'section' );
			verticalSlides.forEach( ( verticalSlide, y ) => {

				this.sort( verticalSlide.querySelectorAll( '.fragment' ) );

			}, this );

			if( verticalSlides.length === 0 ) this.sort( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Refreshes the fragments on the current slide so that they
	 * have the appropriate classes (.visible + .current-fragment).
	 *
	 * @param {number} [index] The index of the current fragment
	 * @param {array} [fragments] Array containing all fragments
	 * in the current slide
	 *
	 * @return {{shown: array, hidden: array}}
	 */
	update( index, fragments, slide = this.Reveal.getCurrentSlide() ) {

		let changedFragments = {
			shown: [],
			hidden: []
		};

		if( slide && this.Reveal.getConfig().fragments ) {

			fragments = fragments || this.sort( slide.querySelectorAll( '.fragment' ) );

			if( fragments.length ) {

				let maxIndex = 0;

				if( typeof index !== 'number' ) {
					let currentFragment = this.sort( slide.querySelectorAll( '.fragment.visible' ) ).pop();
					if( currentFragment ) {
						index = parseInt( currentFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
				}

				Array.from( fragments ).forEach( ( el, i ) => {

					if( el.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( el.getAttribute( 'data-fragment-index' ), 10 );
					}

					maxIndex = Math.max( maxIndex, i );

					// Visible fragments
					if( i <= index ) {
						let wasVisible = el.classList.contains( 'visible' )
						el.classList.add( 'visible' );
						el.classList.remove( 'current-fragment' );

						if( i === index ) {
							// Announce the fragments one by one to the Screen Reader
							this.Reveal.announceStatus( this.Reveal.getStatusText( el ) );

							el.classList.add( 'current-fragment' );
							this.Reveal.slideContent.startEmbeddedContent( el );
						}

						if( !wasVisible ) {
							changedFragments.shown.push( el )
							this.Reveal.dispatchEvent({
								target: el,
								type: 'visible',
								bubbles: false
							});
						}
					}
					// Hidden fragments
					else {
						let wasVisible = el.classList.contains( 'visible' )
						el.classList.remove( 'visible' );
						el.classList.remove( 'current-fragment' );

						if( wasVisible ) {
							this.Reveal.slideContent.stopEmbeddedContent( el );
							changedFragments.hidden.push( el );
							this.Reveal.dispatchEvent({
								target: el,
								type: 'hidden',
								bubbles: false
							});
						}
					}

				} );

				// Write the current fragment index to the slide <section>.
				// This can be used by end users to apply styles based on
				// the current fragment index.
				index = typeof index === 'number' ? index : -1;
				index = Math.max( Math.min( index, maxIndex ), -1 );
				slide.setAttribute( 'data-fragment', index );

			}

		}

		return changedFragments;

	}

	/**
	 * Formats the fragments on the given slide so that they have
	 * valid indices. Call this if fragments are changed in the DOM
	 * after reveal.js has already initialized.
	 *
	 * @param {HTMLElement} slide
	 * @return {Array} a list of the HTML fragments that were synced
	 */
	sync( slide = this.Reveal.getCurrentSlide() ) {

		return this.sort( slide.querySelectorAll( '.fragment' ) );

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {?number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	goto( index, offset = 0 ) {

		let currentSlide = this.Reveal.getCurrentSlide();
		if( currentSlide && this.Reveal.getConfig().fragments ) {

			let fragments = this.sort( currentSlide.querySelectorAll( '.fragment:not(.disabled)' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					let lastVisibleFragment = this.sort( currentSlide.querySelectorAll( '.fragment:not(.disabled).visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// Apply the offset if there is one
				index += offset;

				let changedFragments = this.update( index, fragments );

				if( changedFragments.hidden.length ) {
					this.Reveal.dispatchEvent({
						type: 'fragmenthidden',
						data: {
							fragment: changedFragments.hidden[0],
							fragments: changedFragments.hidden
						}
					});
				}

				if( changedFragments.shown.length ) {
					this.Reveal.dispatchEvent({
						type: 'fragmentshown',
						data: {
							fragment: changedFragments.shown[0],
							fragments: changedFragments.shown
						}
					});
				}

				this.Reveal.controls.update();
				this.Reveal.progress.update();

				if( this.Reveal.getConfig().fragmentInURL ) {
					this.Reveal.location.writeURL();
				}

				return !!( changedFragments.shown.length || changedFragments.hidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {boolean} true if there was a next fragment,
	 * false otherwise
	 */
	next() {

		return this.goto( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	prev() {

		return this.goto( null, -1 );

	}

}