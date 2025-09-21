/*!
 * reveal.js Zoom plugin
 */
const Plugin = () => {
	/**
	 * @typedef {Object} ZoomOptions
	 * @property {number} [scale] - the scaling factor
	 * @property {number} [x] - the x coordinate
	 * @property {number} [y] - the y coordinate
	 * @property {boolean} [pan] - is panning?
	 */

	/**
	 * @typedef {Object} ZoomBroadcastMessage
	 * @property {("speaker"|"main")} source - the type of message
	 * @property {number} relativeX - relative x coordinate
	 * @property {number} relativeY - relative y coordinate
	 */

	let isSpeakerView = false; //true: presenter/speaker view, false: main view
	let isSpeakerPreviewFrame = false; //we only want to zoom in the main presenter frame (not presenter preview frame)
	let broadcastChannel = new BroadcastChannel('zoom_channel');

	return {
		id: 'zoom',

		init: function( reveal ) {

			const urlSearchParams = new URLSearchParams(window.location.search);
			const params = Object.fromEntries(urlSearchParams.entries());

			isSpeakerView = params.hasOwnProperty('receiver')

			//present html has a main view (iframe) and a preview next frame (iframe)
			//preview don't have controls (so they are explicitly hidden)
			isSpeakerPreviewFrame = isSpeakerView && params.hasOwnProperty('controls')

			reveal.getRevealElement().addEventListener( 'mousedown', function( event ) {
				var defaultModifier = /Linux/.test( window.navigator.platform ) ? 'ctrl' : 'alt';

				var modifier = ( reveal.getConfig().zoomKey ? reveal.getConfig().zoomKey : defaultModifier ) + 'Key';
				var zoomLevel = ( reveal.getConfig().zoomLevel ? reveal.getConfig().zoomLevel : 2 );

				if( event[ modifier ] && !reveal.isOverview() ) {
					event.preventDefault();

					/** @type {ZoomOptions} */
					let zoomOptions = {
						x: event.clientX,
						y: event.clientY,
						scale: zoomLevel,
						pan: false
					};
					zoom.to(zoomOptions);

					if (reveal.getConfig().syncZoom) {
						/** @type {ZoomBroadcastMessage} */
						const msg =  {
							source: isSpeakerView ? 'speaker' : 'main',
							relativeX: event.clientX / document.body.clientWidth,
							relativeY: event.clientY / document.body.clientHeight,
						};
						broadcastChannel.postMessage(msg);
					}

				}
			} );

      broadcastChannel.addEventListener('message', ( event) => {

				if (isSpeakerView && isSpeakerPreviewFrame) return //not zoom preview frame

				if (!reveal.getConfig().syncZoom) return

        var zoomLevel = ( reveal.getConfig().zoomLevel ? reveal.getConfig().zoomLevel : 2 );

        /** @type ZoomBroadcastMessage */
        const msg = event.data;

        let zoomToOptions = {
          x: msg.relativeX * document.body.clientWidth,
          y: msg.relativeY * document.body.clientHeight,
          scale: zoomLevel,
          pan: false
        }
        zoom.to(zoomToOptions);
      })

		},

		destroy: () => {

			zoom.reset();

		}

	}
};

export default Plugin;

/*!
 * zoom.js 0.3 (modified for use with reveal.js)
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
 */
var zoom = (function(){

	// The current zoom level (scale)
	var level = 1;

	// The current mouse position, used for panning
	var mouseX = 0,
		mouseY = 0;

	// Timeout before pan is activated
	var panEngageTimeout = -1,
		panUpdateInterval = -1;

	// Check for transform support so that we can fallback otherwise
	var supportsTransforms = 	'transform' in document.body.style;

	if( supportsTransforms ) {
		// The easing that will be applied when we zoom in/out
		document.body.style.transition = 'transform 0.8s ease';
	}

	// Zoom out if the user hits escape
	document.addEventListener( 'keyup', function( event ) {
		if( level !== 1 && event.keyCode === 27 ) {
			zoom.out();
		}
	} );

	// Monitor mouse movement for panning
	document.addEventListener( 'mousemove', function( event ) {
		if( level !== 1 ) {
			mouseX = event.clientX;
			mouseY = event.clientY;
		}
	} );

	/**
	 * Applies the CSS required to zoom in, prefers the use of CSS3
	 * transforms but falls back on zoom for IE.
	 *
	 * @param {Object} rect
	 * @param {Number} scale
	 */
	function magnify( rect, scale ) {

		var scrollOffset = getScrollOffset();

		// Ensure a width/height is set
		rect.width = rect.width || 1;
		rect.height = rect.height || 1;

		// Center the rect within the zoomed viewport
		rect.x -= ( window.innerWidth - ( rect.width * scale ) ) / 2;
		rect.y -= ( window.innerHeight - ( rect.height * scale ) ) / 2;

		if( supportsTransforms ) {
			// Reset
			if( scale === 1 ) {
				document.body.style.transform = '';
			}
			// Scale
			else {
				var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
					transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';

				document.body.style.transformOrigin = origin;
				document.body.style.transform = transform;
			}
		}
		else {
			// Reset
			if( scale === 1 ) {
				document.body.style.position = '';
				document.body.style.left = '';
				document.body.style.top = '';
				document.body.style.width = '';
				document.body.style.height = '';
				document.body.style.zoom = '';
			}
			// Scale
			else {
				document.body.style.position = 'relative';
				document.body.style.left = ( - ( scrollOffset.x + rect.x ) / scale ) + 'px';
				document.body.style.top = ( - ( scrollOffset.y + rect.y ) / scale ) + 'px';
				document.body.style.width = ( scale * 100 ) + '%';
				document.body.style.height = ( scale * 100 ) + '%';
				document.body.style.zoom = scale;
			}
		}

		level = scale;

		if( document.documentElement.classList ) {
			if( level !== 1 ) {
				document.documentElement.classList.add( 'zoomed' );
			}
			else {
				document.documentElement.classList.remove( 'zoomed' );
			}
		}
	}

	/**
	 * Pan the document when the mouse cursor approaches the edges
	 * of the window.
	 */
	function pan() {
		var range = 0.12,
			rangeX = window.innerWidth * range,
			rangeY = window.innerHeight * range,
			scrollOffset = getScrollOffset();

		// Up
		if( mouseY < rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( mouseY / rangeY ) ) * ( 14 / level ) );
		}
		// Down
		else if( mouseY > window.innerHeight - rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - mouseY ) / rangeY ) * ( 14 / level ) );
		}

		// Left
		if( mouseX < rangeX ) {
			window.scroll( scrollOffset.x - ( 1 - ( mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
		}
		// Right
		else if( mouseX > window.innerWidth - rangeX ) {
			window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
		}
	}

	function getScrollOffset() {
		return {
			x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
			y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
		}
	}

	return {
		/**
		 * Zooms in on either a rectangle or HTML element.
		 *
		 * @param {Object} options
		 *   - element: HTML element to zoom in on
		 *   OR
		 *   - x/y: coordinates in non-transformed space to zoom in on
		 *   - width/height: the portion of the screen to zoom in on
		 *   - scale: can be used instead of width/height to explicitly set scale
		 */
		to: function( options ) {

			// Due to an implementation limitation we can't zoom in
			// to another element without zooming out first
			if( level !== 1 ) {
				zoom.out();
			}
			else {
				options.x = options.x || 0;
				options.y = options.y || 0;

				// If an element is set, that takes precedence
				if( !!options.element ) {
					// Space around the zoomed in element to leave on screen
					var padding = 20;
					var bounds = options.element.getBoundingClientRect();

					options.x = bounds.left - padding;
					options.y = bounds.top - padding;
					options.width = bounds.width + ( padding * 2 );
					options.height = bounds.height + ( padding * 2 );
				}

				// If width/height values are set, calculate scale from those values
				if( options.width !== undefined && options.height !== undefined ) {
					options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
				}

				if( options.scale > 1 ) {
					options.x *= options.scale;
					options.y *= options.scale;

					magnify( options, options.scale );

					if( options.pan !== false ) {

						// Wait with engaging panning as it may conflict with the
						// zoom transition
						panEngageTimeout = setTimeout( function() {
							panUpdateInterval = setInterval( pan, 1000 / 60 );
						}, 800 );

					}
				}
			}
		},

		/**
		 * Resets the document zoom state to its default.
		 */
		out: function() {
			clearTimeout( panEngageTimeout );
			clearInterval( panUpdateInterval );

			magnify( { x: 0, y: 0 }, 1 );

			level = 1;
		},

		// Alias
		magnify: function( options ) { this.to( options ) },
		reset: function() { this.out() },

		zoomLevel: function() {
			return level;
		}
	}

})();
