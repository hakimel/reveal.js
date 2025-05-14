import { enterFullscreen } from '../utils/util.js'

/**
 * Handles all reveal.js keyboard interactions.
 */
export default class Keyboard {

	constructor( Reveal ) {

		this.Reveal = Reveal;

		// A key:value map of keyboard keys and descriptions of
		// the actions they trigger
		this.shortcuts = {};

		// Holds custom key code mappings
		this.bindings = {};

		this.onDocumentKeyDown = this.onDocumentKeyDown.bind( this );
		this.onDocumentKeyPress = this.onDocumentKeyPress.bind( this );

	}

	/**
	 * Called when the reveal.js config is updated.
	 */
	configure( config, oldConfig ) {

		if( config.navigationMode === 'linear' ) {
			this.shortcuts['&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J'] = 'Next slide';
			this.shortcuts['&#8592;  ,  &#8593;  ,  P  ,  H  ,  K']           = 'Previous slide';
		}
		else {
			this.shortcuts['N  ,  SPACE']   = 'Next slide';
			this.shortcuts['P  ,  Shift SPACE']             = 'Previous slide';
			this.shortcuts['&#8592;  ,  H'] = 'Navigate left';
			this.shortcuts['&#8594;  ,  L'] = 'Navigate right';
			this.shortcuts['&#8593;  ,  K'] = 'Navigate up';
			this.shortcuts['&#8595;  ,  J'] = 'Navigate down';
		}

		this.shortcuts['Alt + &#8592;/&#8593/&#8594;/&#8595;']        = 'Navigate without fragments';
		this.shortcuts['Shift + &#8592;/&#8593/&#8594;/&#8595;']      = 'Jump to first/last slide';
		this.shortcuts['B  ,  .']                       = 'Pause';
		this.shortcuts['F']                             = 'Fullscreen';
		this.shortcuts['G']                             = 'Jump to slide';
		this.shortcuts['ESC, O']                        = 'Slide overview';

	}

	/**
	 * Starts listening for keyboard events.
	 */
	bind() {

		document.addEventListener( 'keydown', this.onDocumentKeyDown, false );
		document.addEventListener( 'keypress', this.onDocumentKeyPress, false );

	}

	/**
	 * Stops listening for keyboard events.
	 */
	unbind() {

		document.removeEventListener( 'keydown', this.onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', this.onDocumentKeyPress, false );

	}

	/**
	 * Add a custom key binding with optional description to
	 * be added to the help screen.
	 */
	addKeyBinding( binding, callback ) {

		if( typeof binding === 'object' && binding.keyCode ) {
			this.bindings[binding.keyCode] = {
				callback: callback,
				key: binding.key,
				description: binding.description
			};
		}
		else {
			this.bindings[binding] = {
				callback: callback,
				key: null,
				description: null
			};
		}

	}

	/**
	 * Removes the specified custom key binding.
	 */
	removeKeyBinding( keyCode ) {

		delete this.bindings[keyCode];

	}

	/**
	 * Programmatically triggers a keyboard event
	 *
	 * @param {int} keyCode
	 */
	triggerKey( keyCode ) {

		this.onDocumentKeyDown( { keyCode } );

	}

	/**
	 * Registers a new shortcut to include in the help overlay
	 *
	 * @param {String} key
	 * @param {String} value
	 */
	registerKeyboardShortcut( key, value ) {

		this.shortcuts[key] = value;

	}

	getShortcuts() {

		return this.shortcuts;

	}

	getBindings() {

		return this.bindings;

	}

	/**
	 * Handler for the document level 'keypress' event.
	 *
	 * @param {object} event
	 */
	onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			this.Reveal.toggleHelp();
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {object} event
	 */
	onDocumentKeyDown( event ) {

		let config = this.Reveal.getConfig();

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition(event) === false ) {
			return true;
		}

		// If keyboardCondition is set, only capture keyboard events
		// for embedded decks when they are focused
		if( config.keyboardCondition === 'focused' && !this.Reveal.isFocused() ) {
			return true;
		}

		// Shorthand
		let keyCode = event.keyCode;

		// Remember if auto-sliding was paused so we can toggle it
		let autoSlideWasPaused = !this.Reveal.isAutoSliding();

		this.Reveal.onUserInput( event );

		// Is there a focused element that could be using the keyboard?
		let activeElementIsCE = document.activeElement && document.activeElement.isContentEditable === true;
		let activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );
		let activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test( document.activeElement.className);

		// Whitelist certain modifiers for slide navigation shortcuts
		let isNavigationKey = [32, 37, 38, 39, 40, 78, 80].indexOf( event.keyCode ) !== -1;

		// Prevent all other events when a modifier is pressed
		let unusedModifier = 	!( isNavigationKey && event.shiftKey || event.altKey ) &&
								( event.shiftKey || event.altKey || event.ctrlKey || event.metaKey );

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || activeElementIsNotes || unusedModifier ) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		let resumeKeyCodes = [66,86,190,191];
		let key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( this.Reveal.isPaused() && resumeKeyCodes.indexOf( keyCode ) === -1 ) {
			return false;
		}

		// Use linear navigation if we're configured to OR if
		// the presentation is one-dimensional
		let useLinearMode = config.navigationMode === 'linear' || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides();

		let triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === keyCode ) {

					let value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof this.Reveal[ value ] === 'function' ) {
						this.Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. Registered custom key bindings
		if( triggered === false ) {

			for( key in this.bindings ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === keyCode ) {

					let action = this.bindings[ key ].callback;

					// Callback function
					if( typeof action === 'function' ) {
						action.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof action === 'string' && typeof this.Reveal[ action ] === 'function' ) {
						this.Reveal[ action ].call();
					}

					triggered = true;
				}
			}
		}

		// 3. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			// P, PAGE UP
			if( keyCode === 80 || keyCode === 33 ) {
				this.Reveal.prev({skipFragments: event.altKey});
			}
			// N, PAGE DOWN
			else if( keyCode === 78 || keyCode === 34 ) {
				this.Reveal.next({skipFragments: event.altKey});
			}
			// H, LEFT
			else if( keyCode === 72 || keyCode === 37 ) {
				if( event.shiftKey ) {
					this.Reveal.slide( 0 );
				}
				else if( !this.Reveal.overview.isActive() && useLinearMode ) {
					this.Reveal.prev({skipFragments: event.altKey});
				}
				else {
					this.Reveal.left({skipFragments: event.altKey});
				}
			}
			// L, RIGHT
			else if( keyCode === 76 || keyCode === 39 ) {
				if( event.shiftKey ) {
					this.Reveal.slide( this.Reveal.getHorizontalSlides().length - 1 );
				}
				else if( !this.Reveal.overview.isActive() && useLinearMode ) {
					this.Reveal.next({skipFragments: event.altKey});
				}
				else {
					this.Reveal.right({skipFragments: event.altKey});
				}
			}
			// K, UP
			else if( keyCode === 75 || keyCode === 38 ) {
				if( event.shiftKey ) {
					this.Reveal.slide( undefined, 0 );
				}
				else if( !this.Reveal.overview.isActive() && useLinearMode ) {
					this.Reveal.prev({skipFragments: event.altKey});
				}
				else {
					this.Reveal.up({skipFragments: event.altKey});
				}
			}
			// J, DOWN
			else if( keyCode === 74 || keyCode === 40 ) {
				if( event.shiftKey ) {
					this.Reveal.slide( undefined, Number.MAX_VALUE );
				}
				else if( !this.Reveal.overview.isActive() && useLinearMode ) {
					this.Reveal.next({skipFragments: event.altKey});
				}
				else {
					this.Reveal.down({skipFragments: event.altKey});
				}
			}
			// HOME
			else if( keyCode === 36 ) {
				this.Reveal.slide( 0 );
			}
			// END
			else if( keyCode === 35 ) {
				this.Reveal.slide( this.Reveal.getHorizontalSlides().length - 1 );
			}
			// SPACE
			else if( keyCode === 32 ) {
				if( this.Reveal.overview.isActive() ) {
					this.Reveal.overview.deactivate();
				}
				if( event.shiftKey ) {
					this.Reveal.prev({skipFragments: event.altKey});
				}
				else {
					this.Reveal.next({skipFragments: event.altKey});
				}
			}
			// TWO-SPOT, SEMICOLON, B, V, PERIOD, LOGITECH PRESENTER TOOLS "BLACK SCREEN" BUTTON
			else if( keyCode === 58 || keyCode === 59 || keyCode === 66 || keyCode === 86 || keyCode === 190 || keyCode === 191 ) {
				this.Reveal.togglePause();
			}
			// F
			else if( keyCode === 70 ) {
				enterFullscreen( config.embedded ? this.Reveal.getViewportElement() : document.documentElement );
			}
			// A
			else if( keyCode === 65 ) {
				if ( config.autoSlideStoppable ) {
					this.Reveal.toggleAutoSlide( autoSlideWasPaused );
				}
			}
			// G
			else if( keyCode === 71 ) {
				if ( config.jumpToSlide ) {
					this.Reveal.toggleJumpToSlide();
				}
			}
			else {
				triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if( keyCode === 27 || keyCode === 79 ) {
			if( this.Reveal.closeOverlay() === false ) {
				this.Reveal.overview.toggle();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		this.Reveal.cueAutoSlide();

	}

}