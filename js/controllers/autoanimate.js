import { queryAll, extend, createStyleSheet, matches, closest } from '../utils/util.js'
import { FRAGMENT_STYLE_REGEX } from '../utils/constants.js'

// Counter used to generate unique IDs for auto-animated elements
let autoAnimateCounter = 0;

/**
 * Automatically animates matching elements across
 * slides with the [data-auto-animate] attribute.
 */
export default class AutoAnimate {

	constructor( Reveal ) {

		this.Reveal = Reveal;

	}

	/**
	 * Runs an auto-animation between the given slides.
	 *
	 * @param  {HTMLElement} fromSlide
	 * @param  {HTMLElement} toSlide
	 */
	run( fromSlide, toSlide ) {

		// Clean up after prior animations
		this.reset();

		let allSlides = this.Reveal.getSlides();
		let toSlideIndex = allSlides.indexOf( toSlide );
		let fromSlideIndex = allSlides.indexOf( fromSlide );

		// Ensure that both slides are auto-animate targets with the same data-auto-animate-id value
		// (including null if absent on both) and that data-auto-animate-restart isn't set on the
		// physically latter slide (independent of slide direction)
		if( fromSlide.hasAttribute( 'data-auto-animate' ) && toSlide.hasAttribute( 'data-auto-animate' )
				&& fromSlide.getAttribute( 'data-auto-animate-id' ) === toSlide.getAttribute( 'data-auto-animate-id' ) 
				&& !( toSlideIndex > fromSlideIndex ? toSlide : fromSlide ).hasAttribute( 'data-auto-animate-restart' ) ) {

			// Create a new auto-animate sheet
			this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || createStyleSheet();

			let animationOptions = this.getAutoAnimateOptions( toSlide );

			// Set our starting state
			fromSlide.dataset.autoAnimate = 'pending';
			toSlide.dataset.autoAnimate = 'pending';

			// Flag the navigation direction, needed for fragment buildup
			animationOptions.slideDirection = toSlideIndex > fromSlideIndex ? 'forward' : 'backward';

			// If the from-slide is hidden because it has moved outside
			// the view distance, we need to temporarily show it while
			// measuring
			let fromSlideIsHidden = fromSlide.style.display === 'none';
			if( fromSlideIsHidden ) fromSlide.style.display = this.Reveal.getConfig().display;

			// Inject our auto-animate styles for this transition
			let css = this.getAutoAnimatableElements( fromSlide, toSlide ).map( elements => {
				return this.autoAnimateElements( elements.from, elements.to, elements.options || {}, animationOptions, autoAnimateCounter++ );
			} );

			if( fromSlideIsHidden ) fromSlide.style.display = 'none';

			// Animate unmatched elements, if enabled
			if( toSlide.dataset.autoAnimateUnmatched !== 'false' && this.Reveal.getConfig().autoAnimateUnmatched === true ) {

				// Our default timings for unmatched elements
				let defaultUnmatchedDuration = animationOptions.duration * 0.8,
					defaultUnmatchedDelay = animationOptions.duration * 0.2;

				this.getUnmatchedAutoAnimateElements( toSlide ).forEach( unmatchedElement => {

					let unmatchedOptions = this.getAutoAnimateOptions( unmatchedElement, animationOptions );
					let id = 'unmatched';

					// If there is a duration or delay set specifically for this
					// element our unmatched elements should adhere to those
					if( unmatchedOptions.duration !== animationOptions.duration || unmatchedOptions.delay !== animationOptions.delay ) {
						id = 'unmatched-' + autoAnimateCounter++;
						css.push( `[data-auto-animate="running"] [data-auto-animate-target="${id}"] { transition: opacity ${unmatchedOptions.duration}s ease ${unmatchedOptions.delay}s; }` );
					}

					unmatchedElement.dataset.autoAnimateTarget = id;

				}, this );

				// Our default transition for unmatched elements
				css.push( `[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${defaultUnmatchedDuration}s ease ${defaultUnmatchedDelay}s; }` );

			}

			// Setting the whole chunk of CSS at once is the most
			// efficient way to do this. Using sheet.insertRule
			// is multiple factors slower.
			this.autoAnimateStyleSheet.innerHTML = css.join( '' );

			// Start the animation next cycle
			requestAnimationFrame( () => {
				if( this.autoAnimateStyleSheet ) {
					// This forces our newly injected styles to be applied in Firefox
					getComputedStyle( this.autoAnimateStyleSheet ).fontWeight;

					toSlide.dataset.autoAnimate = 'running';
				}
			} );

			this.Reveal.dispatchEvent({
				type: 'autoanimate',
				data: {
					fromSlide,
					toSlide,
					sheet: this.autoAnimateStyleSheet
				}
			});

		}

	}

	/**
	 * Rolls back all changes that we've made to the DOM so
	 * that as part of animating.
	 */
	reset() {

		// Reset slides
		queryAll( this.Reveal.getRevealElement(), '[data-auto-animate]:not([data-auto-animate=""])' ).forEach( element => {
			element.dataset.autoAnimate = '';
		} );

		// Reset elements
		queryAll( this.Reveal.getRevealElement(), '[data-auto-animate-target]' ).forEach( element => {
			delete element.dataset.autoAnimateTarget;
		} );

		// Remove the animation sheet
		if( this.autoAnimateStyleSheet && this.autoAnimateStyleSheet.parentNode ) {
			this.autoAnimateStyleSheet.parentNode.removeChild( this.autoAnimateStyleSheet );
			this.autoAnimateStyleSheet = null;
		}

	}

	/**
	 * Creates a FLIP animation where the `to` element starts out
	 * in the `from` element position and animates to its original
	 * state.
	 *
	 * @param {HTMLElement} from
	 * @param {HTMLElement} to
	 * @param {Object} elementOptions Options for this element pair
	 * @param {Object} animationOptions Options set at the slide level
	 * @param {String} id Unique ID that we can use to identify this
	 * auto-animate element in the DOM
	 */
	autoAnimateElements( from, to, elementOptions, animationOptions, id ) {

		// 'from' elements are given a data-auto-animate-target with no value,
		// 'to' elements are are given a data-auto-animate-target with an ID
		from.dataset.autoAnimateTarget = '';
		to.dataset.autoAnimateTarget = id;

		// Each element may override any of the auto-animate options
		// like transition easing, duration and delay via data-attributes
		let options = this.getAutoAnimateOptions( to, animationOptions );

		// If we're using a custom element matcher the element options
		// may contain additional transition overrides
		if( typeof elementOptions.delay !== 'undefined' ) options.delay = elementOptions.delay;
		if( typeof elementOptions.duration !== 'undefined' ) options.duration = elementOptions.duration;
		if( typeof elementOptions.easing !== 'undefined' ) options.easing = elementOptions.easing;

		let fromProps = this.getAutoAnimatableProperties( 'from', from, elementOptions ),
			toProps = this.getAutoAnimatableProperties( 'to', to, elementOptions );

		// Maintain fragment visibility for matching elements when
		// we're navigating forwards, this way the viewer won't need
		// to step through the same fragments twice
		if( to.classList.contains( 'fragment' ) ) {

			// Don't auto-animate the opacity of fragments to avoid
			// conflicts with fragment animations
			delete toProps.styles['opacity'];

			if( from.classList.contains( 'fragment' ) ) {

				let fromFragmentStyle = ( from.className.match( FRAGMENT_STYLE_REGEX ) || [''] )[0];
				let toFragmentStyle = ( to.className.match( FRAGMENT_STYLE_REGEX ) || [''] )[0];

				// Only skip the fragment if the fragment animation style
				// remains unchanged
				if( fromFragmentStyle === toFragmentStyle && animationOptions.slideDirection === 'forward' ) {
					to.classList.add( 'visible', 'disabled' );
				}

			}

		}

		// If translation and/or scaling are enabled, css transform
		// the 'to' element so that it matches the position and size
		// of the 'from' element
		if( elementOptions.translate !== false || elementOptions.scale !== false ) {

			let presentationScale = this.Reveal.getScale();

			let delta = {
				x: ( fromProps.x - toProps.x ) / presentationScale,
				y: ( fromProps.y - toProps.y ) / presentationScale,
				scaleX: fromProps.width / toProps.width,
				scaleY: fromProps.height / toProps.height
			};

			// Limit decimal points to avoid 0.0001px blur and stutter
			delta.x = Math.round( delta.x * 1000 ) / 1000;
			delta.y = Math.round( delta.y * 1000 ) / 1000;
			delta.scaleX = Math.round( delta.scaleX * 1000 ) / 1000;
			delta.scaleX = Math.round( delta.scaleX * 1000 ) / 1000;

			let translate = elementOptions.translate !== false && ( delta.x !== 0 || delta.y !== 0 ),
				scale = elementOptions.scale !== false && ( delta.scaleX !== 0 || delta.scaleY !== 0 );

			// No need to transform if nothing's changed
			if( translate || scale ) {

				let transform = [];

				if( translate ) transform.push( `translate(${delta.x}px, ${delta.y}px)` );
				if( scale ) transform.push( `scale(${delta.scaleX}, ${delta.scaleY})` );

				fromProps.styles['transform'] = transform.join( ' ' );
				fromProps.styles['transform-origin'] = 'top left';

				toProps.styles['transform'] = 'none';

			}

		}

		// Delete all unchanged 'to' styles
		for( let propertyName in toProps.styles ) {
			const toValue = toProps.styles[propertyName];
			const fromValue = fromProps.styles[propertyName];

			if( toValue === fromValue ) {
				delete toProps.styles[propertyName];
			}
			else {
				// If these property values were set via a custom matcher providing
				// an explicit 'from' and/or 'to' value, we always inject those values.
				if( toValue.explicitValue === true ) {
					toProps.styles[propertyName] = toValue.value;
				}

				if( fromValue.explicitValue === true ) {
					fromProps.styles[propertyName] = fromValue.value;
				}
			}
		}

		let css = '';

		let toStyleProperties = Object.keys( toProps.styles );

		// Only create animate this element IF at least one style
		// property has changed
		if( toStyleProperties.length > 0 ) {

			// Instantly move to the 'from' state
			fromProps.styles['transition'] = 'none';

			// Animate towards the 'to' state
			toProps.styles['transition'] = `all ${options.duration}s ${options.easing} ${options.delay}s`;
			toProps.styles['transition-property'] = toStyleProperties.join( ', ' );
			toProps.styles['will-change'] = toStyleProperties.join( ', ' );

			// Build up our custom CSS. We need to override inline styles
			// so we need to make our styles vErY IMPORTANT!1!!
			let fromCSS = Object.keys( fromProps.styles ).map( propertyName => {
				return propertyName + ': ' + fromProps.styles[propertyName] + ' !important;';
			} ).join( '' );

			let toCSS = Object.keys( toProps.styles ).map( propertyName => {
				return propertyName + ': ' + toProps.styles[propertyName] + ' !important;';
			} ).join( '' );

			css = 	'[data-auto-animate-target="'+ id +'"] {'+ fromCSS +'}' +
					'[data-auto-animate="running"] [data-auto-animate-target="'+ id +'"] {'+ toCSS +'}';

		}

		return css;

	}

	/**
	 * Returns the auto-animate options for the given element.
	 *
	 * @param {HTMLElement} element Element to pick up options
	 * from, either a slide or an animation target
	 * @param {Object} [inheritedOptions] Optional set of existing
	 * options
	 */
	getAutoAnimateOptions( element, inheritedOptions ) {

		let options = {
			easing: this.Reveal.getConfig().autoAnimateEasing,
			duration: this.Reveal.getConfig().autoAnimateDuration,
			delay: 0
		};

		options = extend( options, inheritedOptions );

		// Inherit options from parent elements
		if( element.parentNode ) {
			let autoAnimatedParent = closest( element.parentNode, '[data-auto-animate-target]' );
			if( autoAnimatedParent ) {
				options = this.getAutoAnimateOptions( autoAnimatedParent, options );
			}
		}

		if( element.dataset.autoAnimateEasing ) {
			options.easing = element.dataset.autoAnimateEasing;
		}

		if( element.dataset.autoAnimateDuration ) {
			options.duration = parseFloat( element.dataset.autoAnimateDuration );
		}

		if( element.dataset.autoAnimateDelay ) {
			options.delay = parseFloat( element.dataset.autoAnimateDelay );
		}

		return options;

	}

	/**
	 * Returns an object containing all of the properties
	 * that can be auto-animated for the given element and
	 * their current computed values.
	 *
	 * @param {String} direction 'from' or 'to'
	 */
	getAutoAnimatableProperties( direction, element, elementOptions ) {

		let config = this.Reveal.getConfig();

		let properties = { styles: [] };

		// Position and size
		if( elementOptions.translate !== false || elementOptions.scale !== false ) {
			let bounds;

			// Custom auto-animate may optionally return a custom tailored
			// measurement function
			if( typeof elementOptions.measure === 'function' ) {
				bounds = elementOptions.measure( element );
			}
			else {
				if( config.center ) {
					// More precise, but breaks when used in combination
					// with zoom for scaling the deck ¯\_(ツ)_/¯
					bounds = element.getBoundingClientRect();
				}
				else {
					let scale = this.Reveal.getScale();
					bounds = {
						x: element.offsetLeft * scale,
						y: element.offsetTop * scale,
						width: element.offsetWidth * scale,
						height: element.offsetHeight * scale
					};
				}
			}

			properties.x = bounds.x;
			properties.y = bounds.y;
			properties.width = bounds.width;
			properties.height = bounds.height;
		}

		const computedStyles = getComputedStyle( element );

		// CSS styles
		( elementOptions.styles || config.autoAnimateStyles ).forEach( style => {
			let value;

			// `style` is either the property name directly, or an object
			// definition of a style property
			if( typeof style === 'string' ) style = { property: style };

			if( typeof style.from !== 'undefined' && direction === 'from' ) {
				value = { value: style.from, explicitValue: true };
			}
			else if( typeof style.to !== 'undefined' && direction === 'to' ) {
				value = { value: style.to, explicitValue: true };
			}
			else {
				// Use a unitless value for line-height so that it inherits properly
				if( style.property === 'line-height' ) {
					value = parseFloat( computedStyles['line-height'] ) / parseFloat( computedStyles['font-size'] );
				}

				if( isNaN(value) ) {
					value = computedStyles[style.property];
				}
			}

			if( value !== '' ) {
				properties.styles[style.property] = value;
			}
		} );

		return properties;

	}

	/**
	 * Get a list of all element pairs that we can animate
	 * between the given slides.
	 *
	 * @param {HTMLElement} fromSlide
	 * @param {HTMLElement} toSlide
	 *
	 * @return {Array} Each value is an array where [0] is
	 * the element we're animating from and [1] is the
	 * element we're animating to
	 */
	getAutoAnimatableElements( fromSlide, toSlide ) {

		let matcher = typeof this.Reveal.getConfig().autoAnimateMatcher === 'function' ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs;

		let pairs = matcher.call( this, fromSlide, toSlide );

		let reserved = [];

		// Remove duplicate pairs
		return pairs.filter( ( pair, index ) => {
			if( reserved.indexOf( pair.to ) === -1 ) {
				reserved.push( pair.to );
				return true;
			}
		} );

	}

	/**
	 * Identifies matching elements between slides.
	 *
	 * You can specify a custom matcher function by using
	 * the `autoAnimateMatcher` config option.
	 */
	getAutoAnimatePairs( fromSlide, toSlide ) {

		let pairs = [];

		const codeNodes = 'pre';
		const textNodes = 'h1, h2, h3, h4, h5, h6, p, li';
		const mediaNodes = 'img, video, iframe';

		// Explicit matches via data-id
		this.findAutoAnimateMatches( pairs, fromSlide, toSlide, '[data-id]', node => {
			return node.nodeName + ':::' + node.getAttribute( 'data-id' );
		} );

		// Text
		this.findAutoAnimateMatches( pairs, fromSlide, toSlide, textNodes, node => {
			return node.nodeName + ':::' + node.innerText;
		} );

		// Media
		this.findAutoAnimateMatches( pairs, fromSlide, toSlide, mediaNodes, node => {
			return node.nodeName + ':::' + ( node.getAttribute( 'src' ) || node.getAttribute( 'data-src' ) );
		} );

		// Code
		this.findAutoAnimateMatches( pairs, fromSlide, toSlide, codeNodes, node => {
			return node.nodeName + ':::' + node.innerText;
		} );

		pairs.forEach( pair => {
			// Disable scale transformations on text nodes, we transition
			// each individual text property instead
			if( matches( pair.from, textNodes ) ) {
				pair.options = { scale: false };
			}
			// Animate individual lines of code
			else if( matches( pair.from, codeNodes ) ) {

				// Transition the code block's width and height instead of scaling
				// to prevent its content from being squished
				pair.options = { scale: false, styles: [ 'width', 'height' ] };

				// Lines of code
				this.findAutoAnimateMatches( pairs, pair.from, pair.to, '.hljs .hljs-ln-code', node => {
					return node.textContent;
				}, {
					scale: false,
					styles: [],
					measure: this.getLocalBoundingBox.bind( this )
				} );

				// Line numbers
				this.findAutoAnimateMatches( pairs, pair.from, pair.to, '.hljs .hljs-ln-numbers[data-line-number]', node => {
					return node.getAttribute( 'data-line-number' );
				}, {
					scale: false,
					styles: [ 'width' ],
					measure: this.getLocalBoundingBox.bind( this )
				} );

			}

		}, this );

		return pairs;

	}

	/**
	 * Helper method which returns a bounding box based on
	 * the given elements offset coordinates.
	 *
	 * @param {HTMLElement} element
	 * @return {Object} x, y, width, height
	 */
	getLocalBoundingBox( element ) {

		const presentationScale = this.Reveal.getScale();

		return {
			x: Math.round( ( element.offsetLeft * presentationScale ) * 100 ) / 100,
			y: Math.round( ( element.offsetTop * presentationScale ) * 100 ) / 100,
			width: Math.round( ( element.offsetWidth * presentationScale ) * 100 ) / 100,
			height: Math.round( ( element.offsetHeight * presentationScale ) * 100 ) / 100
		};

	}

	/**
	 * Finds matching elements between two slides.
	 *
	 * @param {Array} pairs            	List of pairs to push matches to
	 * @param {HTMLElement} fromScope   Scope within the from element exists
	 * @param {HTMLElement} toScope     Scope within the to element exists
	 * @param {String} selector         CSS selector of the element to match
	 * @param {Function} serializer     A function that accepts an element and returns
	 *                                  a stringified ID based on its contents
	 * @param {Object} animationOptions Optional config options for this pair
	 */
	findAutoAnimateMatches( pairs, fromScope, toScope, selector, serializer, animationOptions ) {

		let fromMatches = {};
		let toMatches = {};

		[].slice.call( fromScope.querySelectorAll( selector ) ).forEach( ( element, i ) => {
			const key = serializer( element );
			if( typeof key === 'string' && key.length ) {
				fromMatches[key] = fromMatches[key] || [];
				fromMatches[key].push( element );
			}
		} );

		[].slice.call( toScope.querySelectorAll( selector ) ).forEach( ( element, i ) => {
			const key = serializer( element );
			toMatches[key] = toMatches[key] || [];
			toMatches[key].push( element );

			let fromElement;

			// Retrieve the 'from' element
			if( fromMatches[key] ) {
				const primaryIndex = toMatches[key].length - 1;
				const secondaryIndex = fromMatches[key].length - 1;

				// If there are multiple identical from elements, retrieve
				// the one at the same index as our to-element.
				if( fromMatches[key][ primaryIndex ] ) {
					fromElement = fromMatches[key][ primaryIndex ];
					fromMatches[key][ primaryIndex ] = null;
				}
				// If there are no matching from-elements at the same index,
				// use the last one.
				else if( fromMatches[key][ secondaryIndex ] ) {
					fromElement = fromMatches[key][ secondaryIndex ];
					fromMatches[key][ secondaryIndex ] = null;
				}
			}

			// If we've got a matching pair, push it to the list of pairs
			if( fromElement ) {
				pairs.push({
					from: fromElement,
					to: element,
					options: animationOptions
				});
			}
		} );

	}

	/**
	 * Returns a all elements within the given scope that should
	 * be considered unmatched in an auto-animate transition. If
	 * fading of unmatched elements is turned on, these elements
	 * will fade when going between auto-animate slides.
	 *
	 * Note that parents of auto-animate targets are NOT considered
	 * unmatched since fading them would break the auto-animation.
	 *
	 * @param {HTMLElement} rootElement
	 * @return {Array}
	 */
	getUnmatchedAutoAnimateElements( rootElement ) {

		return [].slice.call( rootElement.children ).reduce( ( result, element ) => {

			const containsAnimatedElements = element.querySelector( '[data-auto-animate-target]' );

			// The element is unmatched if
			// - It is not an auto-animate target
			// - It does not contain any auto-animate targets
			if( !element.hasAttribute( 'data-auto-animate-target' ) && !containsAnimatedElements ) {
				result.push( element );
			}

			if( element.querySelector( '[data-auto-animate-target]' ) ) {
				result = result.concat( this.getUnmatchedAutoAnimateElements( element ) );
			}

			return result;

		}, [] );

	}

}
