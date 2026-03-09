(function($,v){typeof exports=="object"&&typeof module<"u"?module.exports=v():typeof define=="function"&&define.amd?define(v):($=typeof globalThis<"u"?globalThis:$||self,$.RevealNotes=v())})(this,(function(){"use strict";const $=`<!--
	NOTE: You need to build the notes plugin after making changes to this file.
-->
<html lang="en">
	<head>
		<meta charset="utf-8">

		<title>reveal.js - Speaker View</title>

		<style>
			body {
				font-family: Helvetica;
				font-size: 18px;
			}

			#current-slide,
			#upcoming-slide,
			#speaker-controls {
				padding: 6px;
				box-sizing: border-box;
				-moz-box-sizing: border-box;
			}

			#current-slide iframe,
			#upcoming-slide iframe {
				width: 100%;
				height: 100%;
				border: 1px solid #ddd;
			}

			#current-slide .label,
			#upcoming-slide .label {
				position: absolute;
				top: 10px;
				left: 10px;
				z-index: 2;
			}

			#connection-status {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 20;
				padding: 30% 20% 20% 20%;
				font-size: 18px;
				color: #222;
				background: #fff;
				text-align: center;
				box-sizing: border-box;
				line-height: 1.4;
			}

			.overlay-element {
				height: 34px;
				line-height: 34px;
				padding: 0 10px;
				text-shadow: none;
				background: rgba( 220, 220, 220, 0.8 );
				color: #222;
				font-size: 14px;
			}

			.overlay-element.interactive:hover {
				background: rgba( 220, 220, 220, 1 );
			}

			#current-slide {
				position: absolute;
				width: 60%;
				height: 100%;
				top: 0;
				left: 0;
				padding-right: 0;
			}

			#upcoming-slide {
				position: absolute;
				width: 40%;
				height: 40%;
				right: 0;
				top: 0;
			}

			/* Speaker controls */
			#speaker-controls {
				position: absolute;
				top: 40%;
				right: 0;
				width: 40%;
				height: 60%;
				overflow: auto;
				font-size: 18px;
			}

				.speaker-controls-time.hidden,
				.speaker-controls-notes.hidden {
					display: none;
				}

				.speaker-controls-time .label,
				.speaker-controls-pace .label,
				.speaker-controls-notes .label {
					text-transform: uppercase;
					font-weight: normal;
					font-size: 0.66em;
					color: #666;
					margin: 0;
				}

				.speaker-controls-time, .speaker-controls-pace {
					border-bottom: 1px solid rgba( 200, 200, 200, 0.5 );
					margin-bottom: 10px;
					padding: 10px 16px;
					padding-bottom: 20px;
					cursor: pointer;
				}

				.speaker-controls-time .reset-button {
					opacity: 0;
					float: right;
					color: #666;
					text-decoration: none;
				}
				.speaker-controls-time:hover .reset-button {
					opacity: 1;
				}

				.speaker-controls-time .timer,
				.speaker-controls-time .clock {
					width: 50%;
				}

				.speaker-controls-time .timer,
				.speaker-controls-time .clock,
				.speaker-controls-time .pacing .hours-value,
				.speaker-controls-time .pacing .minutes-value,
				.speaker-controls-time .pacing .seconds-value {
					font-size: 1.9em;
				}

				.speaker-controls-time .timer {
					float: left;
				}

				.speaker-controls-time .clock {
					float: right;
					text-align: right;
				}

				.speaker-controls-time span.mute {
					opacity: 0.3;
				}

				.speaker-controls-time .pacing-title {
					margin-top: 5px;
				}

				.speaker-controls-time .pacing.ahead {
					color: blue;
				}

				.speaker-controls-time .pacing.on-track {
					color: green;
				}

				.speaker-controls-time .pacing.behind {
					color: red;
				}

				.speaker-controls-notes {
					padding: 10px 16px;
				}

				.speaker-controls-notes .value {
					margin-top: 5px;
					line-height: 1.4;
					font-size: 1.2em;
				}

			/* Layout selector */
			#speaker-layout {
				position: absolute;
				top: 10px;
				right: 10px;
				color: #222;
				z-index: 10;
			}
				#speaker-layout select {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					border: 0;
					box-shadow: 0;
					cursor: pointer;
					opacity: 0;

					font-size: 1em;
					background-color: transparent;

					-moz-appearance: none;
					-webkit-appearance: none;
					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
				}

				#speaker-layout select:focus {
					outline: none;
					box-shadow: none;
				}

			.clear {
				clear: both;
			}

			/* Speaker layout: Wide */
			body[data-speaker-layout="wide"] #current-slide,
			body[data-speaker-layout="wide"] #upcoming-slide {
				width: 50%;
				height: 45%;
				padding: 6px;
			}

			body[data-speaker-layout="wide"] #current-slide {
				top: 0;
				left: 0;
			}

			body[data-speaker-layout="wide"] #upcoming-slide {
				top: 0;
				left: 50%;
			}

			body[data-speaker-layout="wide"] #speaker-controls {
				top: 45%;
				left: 0;
				width: 100%;
				height: 50%;
				font-size: 1.25em;
			}

			/* Speaker layout: Tall */
			body[data-speaker-layout="tall"] #current-slide,
			body[data-speaker-layout="tall"] #upcoming-slide {
				width: 45%;
				height: 50%;
				padding: 6px;
			}

			body[data-speaker-layout="tall"] #current-slide {
				top: 0;
				left: 0;
			}

			body[data-speaker-layout="tall"] #upcoming-slide {
				top: 50%;
				left: 0;
			}

			body[data-speaker-layout="tall"] #speaker-controls {
				padding-top: 40px;
				top: 0;
				left: 45%;
				width: 55%;
				height: 100%;
				font-size: 1.25em;
			}

			/* Speaker layout: Notes only */
			body[data-speaker-layout="notes-only"] #current-slide,
			body[data-speaker-layout="notes-only"] #upcoming-slide {
				display: none;
			}

			body[data-speaker-layout="notes-only"] #speaker-controls {
				padding-top: 40px;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				font-size: 1.25em;
			}

			@media screen and (max-width: 1080px) {
				body[data-speaker-layout="default"] #speaker-controls {
					font-size: 16px;
				}
			}

			@media screen and (max-width: 900px) {
				body[data-speaker-layout="default"] #speaker-controls {
					font-size: 14px;
				}
			}

			@media screen and (max-width: 800px) {
				body[data-speaker-layout="default"] #speaker-controls {
					font-size: 12px;
				}
			}

		</style>
	</head>

	<body>

		<div id="connection-status">Loading speaker view...</div>

		<div id="current-slide"></div>
		<div id="upcoming-slide"><span class="overlay-element label">Upcoming</span></div>
		<div id="speaker-controls">
			<div class="speaker-controls-time">
				<h4 class="label">Time <span class="reset-button">Click to Reset</span></h4>
				<div class="clock">
					<span class="clock-value">0:00 AM</span>
				</div>
				<div class="timer">
					<span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
				</div>
				<div class="clear"></div>

				<h4 class="label pacing-title" style="display: none">Pacing – Time to finish current slide</h4>
				<div class="pacing" style="display: none">
					<span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
				</div>
			</div>

			<div class="speaker-controls-notes hidden">
				<h4 class="label">Notes</h4>
				<div class="value"></div>
			</div>
		</div>
		<div id="speaker-layout" class="overlay-element interactive">
			<span class="speaker-layout-label"></span>
			<select class="speaker-layout-dropdown"></select>
		</div>

		<script>

			(function() {

				var notes,
					notesValue,
					currentState,
					currentSlide,
					upcomingSlide,
					layoutLabel,
					layoutDropdown,
					pendingCalls = {},
					lastRevealApiCallId = 0,
					connected = false

				var connectionStatus = document.querySelector( '#connection-status' );

				var SPEAKER_LAYOUTS = {
					'default': 'Default',
					'wide': 'Wide',
					'tall': 'Tall',
					'notes-only': 'Notes only'
				};

				setupLayout();

				let openerOrigin;

				try {
					openerOrigin = window.opener.location.origin;
				}
				catch ( error ) { console.warn( error ) }

				// In order to prevent XSS, the speaker view will only run if its
				// opener has the same origin as itself
				if( window.location.origin !== openerOrigin ) {
					connectionStatus.innerHTML = 'Cross origin error.<br>The speaker window can only be opened from the same origin.';
					return;
				}

				var connectionTimeout = setTimeout( function() {
					connectionStatus.innerHTML = 'Error connecting to main window.<br>Please try closing and reopening the speaker view.';
				}, 5000 );

				window.addEventListener( 'message', function( event ) {

					// Validate the origin of all messages to avoid parsing messages
					// that aren't meant for us. Ignore when running off file:// so
					// that the speaker view continues to work without a web server.
					if( window.location.origin !== event.origin && window.location.origin !== 'file://' ) {
						return
					}

					clearTimeout( connectionTimeout );
					connectionStatus.style.display = 'none';

					var data = JSON.parse( event.data );

					// The overview mode is only useful to the reveal.js instance
					// where navigation occurs so we don't sync it
					if( data.state ) delete data.state.overview;

					// Messages sent by the notes plugin inside of the main window
					if( data && data.namespace === 'reveal-notes' ) {
						if( data.type === 'connect' ) {
							handleConnectMessage( data );
						}
						else if( data.type === 'state' ) {
							handleStateMessage( data );
						}
						else if( data.type === 'return' ) {
							pendingCalls[data.callId](data.result);
							delete pendingCalls[data.callId];
						}
					}
					// Messages sent by the reveal.js inside of the current slide preview
					else if( data && data.namespace === 'reveal' ) {
						const supportedEvents = [
							'slidechanged',
							'fragmentshown',
							'fragmenthidden',
							'paused',
							'resumed',
							'previewiframe',
							'previewimage',
							'previewvideo',
							'closeoverlay'
						];

						if( /ready/.test( data.eventName ) ) {
							// Send a message back to notify that the handshake is complete
							window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'connected'} ), '*' );
						}
						else if( supportedEvents.includes( data.eventName ) && currentState !== JSON.stringify( data.state ) ) {
							dispatchStateToMainWindow( data.state );
						}
					}

				} );

				/**
				 * Updates the presentation in the main window to match the state
				 * of the presentation in the notes window.
				 */
				const dispatchStateToMainWindow = debounce(( state ) => {
					window.opener.postMessage( JSON.stringify({ method: 'setState', args: [ state ]} ), '*' );
				}, 500);

				/**
				 * Asynchronously calls the Reveal.js API of the main frame.
				 */
				function callRevealApi( methodName, methodArguments, callback ) {

					var callId = ++lastRevealApiCallId;
					pendingCalls[callId] = callback;
					window.opener.postMessage( JSON.stringify( {
						namespace: 'reveal-notes',
						type: 'call',
						callId: callId,
						methodName: methodName,
						arguments: methodArguments
					} ), '*' );

				}

				/**
				 * Called when the main window is trying to establish a
				 * connection.
				 */
				function handleConnectMessage( data ) {

					if( connected === false ) {
						connected = true;

						setupIframes( data );
						setupKeyboard();
						setupNotes();
						setupTimer();
						setupHeartbeat();
					}

				}

				/**
				 * Called when the main window sends an updated state.
				 */
				function handleStateMessage( data ) {

					// Store the most recently set state to avoid circular loops
					// applying the same state
					currentState = JSON.stringify( data.state );

					// No need for updating the notes in case of fragment changes
					if ( data.notes ) {
						notes.classList.remove( 'hidden' );
						notesValue.style.whiteSpace = data.whitespace;
						if( data.markdown ) {
							notesValue.innerHTML = marked.parse( data.notes );
						}
						else {
							notesValue.innerHTML = data.notes;
						}
					}
					else {
						notes.classList.add( 'hidden' );
					}

					// Don't show lightboxes in the upcoming slide
					const { previewVideo, previewImage, previewIframe, ...upcomingState } = data.state;

					// Update the note slides
					currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );
					upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ upcomingState ] }), '*' );
					upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'next' }), '*' );

				}

				// Limit to max one state update per X ms
				handleStateMessage = debounce( handleStateMessage, 200 );

				/**
				 * Forward keyboard events to the current slide window.
				 * This enables keyboard events to work even if focus
				 * isn't set on the current slide iframe.
				 *
				 * Block F5 default handling, it reloads and disconnects
				 * the speaker notes window.
				 */
				function setupKeyboard() {

					document.addEventListener( 'keydown', function( event ) {
						if( event.keyCode === 116 || ( event.metaKey && event.keyCode === 82 ) ) {
							event.preventDefault();
							return false;
						}
						currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'triggerKey', args: [ event.keyCode ] }), '*' );
					} );

				}

				/**
				 * Creates the preview iframes.
				 */
				function setupIframes( data ) {

					var params = [
						'receiver',
						'progress=false',
						'history=false',
						'transition=none',
						'autoSlide=0',
						'backgroundTransition=none'
					].join( '&' );

					var urlSeparator = /\\?/.test(data.url) ? '&' : '?';
					var hash = '#/' + data.state.indexh + '/' + data.state.indexv;
					var currentURL = data.url + urlSeparator + params + '&scrollActivationWidth=false&postMessageEvents=true' + hash;
					var upcomingURL = data.url + urlSeparator + params + '&scrollActivationWidth=false&controls=false' + hash;

					currentSlide = document.createElement( 'iframe' );
					currentSlide.setAttribute( 'width', 1280 );
					currentSlide.setAttribute( 'height', 1024 );
					currentSlide.setAttribute( 'src', currentURL );
					document.querySelector( '#current-slide' ).appendChild( currentSlide );

					upcomingSlide = document.createElement( 'iframe' );
					upcomingSlide.setAttribute( 'width', 640 );
					upcomingSlide.setAttribute( 'height', 512 );
					upcomingSlide.setAttribute( 'src', upcomingURL );
					document.querySelector( '#upcoming-slide' ).appendChild( upcomingSlide );

				}

				/**
				 * Setup the notes UI.
				 */
				function setupNotes() {

					notes = document.querySelector( '.speaker-controls-notes' );
					notesValue = document.querySelector( '.speaker-controls-notes .value' );

				}

				/**
				 * We send out a heartbeat at all times to ensure we can
				 * reconnect with the main presentation window after reloads.
				 */
				function setupHeartbeat() {

					setInterval( () => {
						window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'heartbeat'} ), '*' );
					}, 1000 );

				}

				function getTimings( callback ) {

					callRevealApi( 'getSlidesAttributes', [], function ( slideAttributes ) {
						callRevealApi( 'getConfig', [], function ( config ) {
							var totalTime = config.totalTime;
							var minTimePerSlide = config.minimumTimePerSlide || 0;
							var defaultTiming = config.defaultTiming;
							if ((defaultTiming == null) && (totalTime == null)) {
								callback(null);
								return;
							}
							// Setting totalTime overrides defaultTiming
							if (totalTime) {
								defaultTiming = 0;
							}
							var timings = [];
							for ( var i in slideAttributes ) {
								var slide = slideAttributes[ i ];
								var timing = defaultTiming;
								if( slide.hasOwnProperty( 'data-timing' )) {
									var t = slide[ 'data-timing' ];
									timing = parseInt(t);
									if( isNaN(timing) ) {
										console.warn("Could not parse timing '" + t + "' of slide " + i + "; using default of " + defaultTiming);
										timing = defaultTiming;
									}
								}
								timings.push(timing);
							}
							if ( totalTime ) {
								// After we've allocated time to individual slides, we summarize it and
								// subtract it from the total time
								var remainingTime = totalTime - timings.reduce( function(a, b) { return a + b; }, 0 );
								// The remaining time is divided by the number of slides that have 0 seconds
								// allocated at the moment, giving the average time-per-slide on the remaining slides
								var remainingSlides = (timings.filter( function(x) { return x == 0 }) ).length
								var timePerSlide = Math.round( remainingTime / remainingSlides, 0 )
								// And now we replace every zero-value timing with that average
								timings = timings.map( function(x) { return (x==0 ? timePerSlide : x) } );
							}
							var slidesUnderMinimum = timings.filter( function(x) { return (x < minTimePerSlide) } ).length
							if ( slidesUnderMinimum ) {
								message = "The pacing time for " + slidesUnderMinimum + " slide(s) is under the configured minimum of " + minTimePerSlide + " seconds. Check the data-timing attribute on individual slides, or consider increasing the totalTime or minimumTimePerSlide configuration options (or removing some slides).";
								alert(message);
							}
							callback( timings );
						} );
					} );

				}

				/**
				 * Return the number of seconds allocated for presenting
				 * all slides up to and including this one.
				 */
				function getTimeAllocated( timings, callback ) {

					callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {
						var allocated = 0;
						for (var i in timings.slice(0, currentSlide + 1)) {
							allocated += timings[i];
						}
						callback( allocated );
					} );

				}

				/**
				 * Create the timer and clock and start updating them
				 * at an interval.
				 */
				function setupTimer() {

					var start = new Date(),
					timeEl = document.querySelector( '.speaker-controls-time' ),
					clockEl = timeEl.querySelector( '.clock-value' ),
					hoursEl = timeEl.querySelector( '.hours-value' ),
					minutesEl = timeEl.querySelector( '.minutes-value' ),
					secondsEl = timeEl.querySelector( '.seconds-value' ),
					pacingTitleEl = timeEl.querySelector( '.pacing-title' ),
					pacingEl = timeEl.querySelector( '.pacing' ),
					pacingHoursEl = pacingEl.querySelector( '.hours-value' ),
					pacingMinutesEl = pacingEl.querySelector( '.minutes-value' ),
					pacingSecondsEl = pacingEl.querySelector( '.seconds-value' );

					var timings = null;
					getTimings( function ( _timings ) {

						timings = _timings;
						if (_timings !== null) {
							pacingTitleEl.style.removeProperty('display');
							pacingEl.style.removeProperty('display');
						}

						// Update once directly
						_updateTimer();

						// Then update every second
						setInterval( _updateTimer, 1000 );

					} );


					function _resetTimer() {

						if (timings == null) {
							start = new Date();
							_updateTimer();
						}
						else {
							// Reset timer to beginning of current slide
							getTimeAllocated( timings, function ( slideEndTimingSeconds ) {
								var slideEndTiming = slideEndTimingSeconds * 1000;
								callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {
									var currentSlideTiming = timings[currentSlide] * 1000;
									var previousSlidesTiming = slideEndTiming - currentSlideTiming;
									var now = new Date();
									start = new Date(now.getTime() - previousSlidesTiming);
									_updateTimer();
								} );
							} );
						}

					}

					timeEl.addEventListener( 'click', function() {
						_resetTimer();
						return false;
					} );

					function _displayTime( hrEl, minEl, secEl, time) {

						var sign = Math.sign(time) == -1 ? "-" : "";
						time = Math.abs(Math.round(time / 1000));
						var seconds = time % 60;
						var minutes = Math.floor( time / 60 ) % 60 ;
						var hours = Math.floor( time / ( 60 * 60 )) ;
						hrEl.innerHTML = sign + zeroPadInteger( hours );
						if (hours == 0) {
							hrEl.classList.add( 'mute' );
						}
						else {
							hrEl.classList.remove( 'mute' );
						}
						minEl.innerHTML = ':' + zeroPadInteger( minutes );
						if (hours == 0 && minutes == 0) {
							minEl.classList.add( 'mute' );
						}
						else {
							minEl.classList.remove( 'mute' );
						}
						secEl.innerHTML = ':' + zeroPadInteger( seconds );
					}

					function _updateTimer() {

						var diff, hours, minutes, seconds,
						now = new Date();

						diff = now.getTime() - start.getTime();

						clockEl.innerHTML = now.toLocaleTimeString( 'en-US', { hour12: true, hour: '2-digit', minute:'2-digit' } );
						_displayTime( hoursEl, minutesEl, secondsEl, diff );
						if (timings !== null) {
							_updatePacing(diff);
						}

					}

					function _updatePacing(diff) {

						getTimeAllocated( timings, function ( slideEndTimingSeconds ) {
							var slideEndTiming = slideEndTimingSeconds * 1000;

							callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {
								var currentSlideTiming = timings[currentSlide] * 1000;
								var timeLeftCurrentSlide = slideEndTiming - diff;
								if (timeLeftCurrentSlide < 0) {
									pacingEl.className = 'pacing behind';
								}
								else if (timeLeftCurrentSlide < currentSlideTiming) {
									pacingEl.className = 'pacing on-track';
								}
								else {
									pacingEl.className = 'pacing ahead';
								}
								_displayTime( pacingHoursEl, pacingMinutesEl, pacingSecondsEl, timeLeftCurrentSlide );
							} );
						} );
					}

				}

				/**
				 * Sets up the speaker view layout and layout selector.
				 */
				function setupLayout() {

					layoutDropdown = document.querySelector( '.speaker-layout-dropdown' );
					layoutLabel = document.querySelector( '.speaker-layout-label' );

					// Render the list of available layouts
					for( var id in SPEAKER_LAYOUTS ) {
						var option = document.createElement( 'option' );
						option.setAttribute( 'value', id );
						option.textContent = SPEAKER_LAYOUTS[ id ];
						layoutDropdown.appendChild( option );
					}

					// Monitor the dropdown for changes
					layoutDropdown.addEventListener( 'change', function( event ) {

						setLayout( layoutDropdown.value );

					}, false );

					// Restore any currently persisted layout
					setLayout( getLayout() );

				}

				/**
				 * Sets a new speaker view layout. The layout is persisted
				 * in local storage.
				 */
				function setLayout( value ) {

					var title = SPEAKER_LAYOUTS[ value ];

					layoutLabel.innerHTML = 'Layout' + ( title ? ( ': ' + title ) : '' );
					layoutDropdown.value = value;

					document.body.setAttribute( 'data-speaker-layout', value );

					// Persist locally
					if( supportsLocalStorage() ) {
						window.localStorage.setItem( 'reveal-speaker-layout', value );
					}

				}

				/**
				 * Returns the ID of the most recently set speaker layout
				 * or our default layout if none has been set.
				 */
				function getLayout() {

					if( supportsLocalStorage() ) {
						var layout = window.localStorage.getItem( 'reveal-speaker-layout' );
						if( layout ) {
							return layout;
						}
					}

					// Default to the first record in the layouts hash
					for( var id in SPEAKER_LAYOUTS ) {
						return id;
					}

				}

				function supportsLocalStorage() {

					try {
						localStorage.setItem('test', 'test');
						localStorage.removeItem('test');
						return true;
					}
					catch( e ) {
						return false;
					}

				}

				function zeroPadInteger( num ) {

					var str = '00' + parseInt( num );
					return str.substring( str.length - 2 );

				}

				/**
				 * Limits the frequency at which a function can be called.
				 */
				function debounce( fn, ms ) {

					var lastTime = 0,
						timeout;

					return function() {

						var args = arguments;
						var context = this;

						clearTimeout( timeout );

						var timeSinceLastCall = Date.now() - lastTime;
						if( timeSinceLastCall > ms ) {
							fn.apply( context, args );
							lastTime = Date.now();
						}
						else {
							timeout = setTimeout( function() {
								fn.apply( context, args );
								lastTime = Date.now();
							}, ms - timeSinceLastCall );
						}

					}

				}

			})();

		<\/script>
	</body>
</html>`;function v(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var T=v();function X(r){T=r}var R={exec:()=>null};function d(r,t=""){let n=typeof r=="string"?r:r.source,s={replace:(e,a)=>{let i=typeof a=="string"?a:a.source;return i=i.replace(b.caret,"$1"),n=n.replace(e,i),s},getRegex:()=>new RegExp(n,t)};return s}var kt=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),b={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:r=>new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}#`),htmlBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}>`)},bt=/^(?:[ \t]*(?:\n|$))+/,wt=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,xt=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,E=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,yt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,B=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Y=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,F=d(Y).replace(/bull/g,B).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),St=d(Y).replace(/bull/g,B).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),O=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,vt=/^[^\n]+/,H=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Tt=d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",H).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Rt=d(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,B).getRegex(),C="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Z=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,At=d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Z).replace("tag",C).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),tt=d(O).replace("hr",E).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",C).getRegex(),$t=d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",tt).getRegex(),U={blockquote:$t,code:wt,def:Tt,fences:xt,heading:yt,hr:E,html:At,lheading:F,list:Rt,newline:bt,paragraph:tt,table:R,text:vt},et=d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",E).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",C).getRegex(),Et={...U,lheading:St,table:et,paragraph:d(O).replace("hr",E).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",et).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",C).getRegex()},zt={...U,html:d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Z).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:R,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:d(O).replace("hr",E).replace("heading",` *#{1,6} *[^
]`).replace("lheading",F).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Lt=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Pt=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,nt=/^( {2,}|\\)\n(?!\s*$)/,It=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,_=/[\p{P}\p{S}]/u,j=/[\s\p{P}\p{S}]/u,rt=/[^\s\p{P}\p{S}]/u,Ct=d(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,j).getRegex(),st=/(?!~)[\p{P}\p{S}]/u,_t=/(?!~)[\s\p{P}\p{S}]/u,Mt=/(?:[^\s\p{P}\p{S}]|~)/u,it=/(?![*_])[\p{P}\p{S}]/u,qt=/(?![*_])[\s\p{P}\p{S}]/u,Nt=/(?:[^\s\p{P}\p{S}]|[*_])/u,Dt=d(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",kt?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),at=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Bt=d(at,"u").replace(/punct/g,_).getRegex(),Ot=d(at,"u").replace(/punct/g,st).getRegex(),lt="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ht=d(lt,"gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,j).replace(/punct/g,_).getRegex(),Zt=d(lt,"gu").replace(/notPunctSpace/g,Mt).replace(/punctSpace/g,_t).replace(/punct/g,st).getRegex(),Ut=d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,j).replace(/punct/g,_).getRegex(),jt=d(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,it).getRegex(),Wt="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Jt=d(Wt,"gu").replace(/notPunctSpace/g,Nt).replace(/punctSpace/g,qt).replace(/punct/g,it).getRegex(),Qt=d(/\\(punct)/,"gu").replace(/punct/g,_).getRegex(),Kt=d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Gt=d(Z).replace("(?:-->|$)","-->").getRegex(),Vt=d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Gt).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),M=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Xt=d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",M).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ot=d(/^!?\[(label)\]\[(ref)\]/).replace("label",M).replace("ref",H).getRegex(),ct=d(/^!?\[(ref)\](?:\[\])?/).replace("ref",H).getRegex(),Yt=d("reflink|nolink(?!\\()","g").replace("reflink",ot).replace("nolink",ct).getRegex(),pt=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,W={_backpedal:R,anyPunctuation:Qt,autolink:Kt,blockSkip:Dt,br:nt,code:Pt,del:R,delLDelim:R,delRDelim:R,emStrongLDelim:Bt,emStrongRDelimAst:Ht,emStrongRDelimUnd:Ut,escape:Lt,link:Xt,nolink:ct,punctuation:Ct,reflink:ot,reflinkSearch:Yt,tag:Vt,text:It,url:R},Ft={...W,link:d(/^!?\[(label)\]\((.*?)\)/).replace("label",M).getRegex(),reflink:d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",M).getRegex()},J={...W,emStrongRDelimAst:Zt,emStrongLDelim:Ot,delLDelim:jt,delRDelim:Jt,url:d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",pt).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:d(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",pt).getRegex()},te={...J,br:d(nt).replace("{2,}","*").getRegex(),text:d(J.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},q={normal:U,gfm:Et,pedantic:zt},z={normal:W,gfm:J,breaks:te,pedantic:Ft},ee={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ut=r=>ee[r];function y(r,t){if(t){if(b.escapeTest.test(r))return r.replace(b.escapeReplace,ut)}else if(b.escapeTestNoEncode.test(r))return r.replace(b.escapeReplaceNoEncode,ut);return r}function ht(r){try{r=encodeURI(r).replace(b.percentDecode,"%")}catch{return null}return r}function dt(r,t){let n=r.replace(b.findPipe,(a,i,o)=>{let l=!1,u=i;for(;--u>=0&&o[u]==="\\";)l=!l;return l?"|":" |"}),s=n.split(b.splitPipe),e=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;e<s.length;e++)s[e]=s[e].trim().replace(b.slashPipe,"|");return s}function L(r,t,n){let s=r.length;if(s===0)return"";let e=0;for(;e<s&&r.charAt(s-e-1)===t;)e++;return r.slice(0,s-e)}function ne(r,t){if(r.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<r.length;s++)if(r[s]==="\\")s++;else if(r[s]===t[0])n++;else if(r[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function re(r,t=0){let n=t,s="";for(let e of r)if(e==="	"){let a=4-n%4;s+=" ".repeat(a),n+=a}else s+=e,n++;return s}function gt(r,t,n,s,e){let a=t.href,i=t.title||null,o=r[1].replace(e.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:r[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:i,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function se(r,t,n){let s=r.match(n.other.indentCodeCompensation);if(s===null)return t;let e=s[1];return t.split(`
`).map(a=>{let i=a.match(n.other.beginningSpace);if(i===null)return a;let[o]=i;return o.length>=e.length?a.slice(e.length):a}).join(`
`)}var N=class{options;rules;lexer;constructor(r){this.options=r||T}space(r){let t=this.rules.block.newline.exec(r);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(r){let t=this.rules.block.code.exec(r);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:L(n,`
`)}}}fences(r){let t=this.rules.block.fences.exec(r);if(t){let n=t[0],s=se(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(r){let t=this.rules.block.heading.exec(r);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=L(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(r){let t=this.rules.block.hr.exec(r);if(t)return{type:"hr",raw:L(t[0],`
`)}}blockquote(r){let t=this.rules.block.blockquote.exec(r);if(t){let n=L(t[0],`
`).split(`
`),s="",e="",a=[];for(;n.length>0;){let i=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),i=!0;else if(!i)o.push(n[l]);else break;n=n.slice(l);let u=o.join(`
`),c=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,e=e?`${e}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,a,!0),this.lexer.state.top=h,n.length===0)break;let p=a.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let g=p,f=g.raw+`
`+n.join(`
`),k=this.blockquote(f);a[a.length-1]=k,s=s.substring(0,s.length-g.raw.length)+k.raw,e=e.substring(0,e.length-g.text.length)+k.text;break}else if(p?.type==="list"){let g=p,f=g.raw+`
`+n.join(`
`),k=this.list(f);a[a.length-1]=k,s=s.substring(0,s.length-p.raw.length)+k.raw,e=e.substring(0,e.length-g.raw.length)+k.raw,n=f.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:e}}}list(r){let t=this.rules.block.list.exec(r);if(t){let n=t[1].trim(),s=n.length>1,e={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),i=!1;for(;r;){let l=!1,u="",c="";if(!(t=a.exec(r))||this.rules.block.hr.test(r))break;u=t[0],r=r.substring(u.length);let h=re(t[2].split(`
`,1)[0],t[1].length),p=r.split(`
`,1)[0],g=!h.trim(),f=0;if(this.options.pedantic?(f=2,c=h.trimStart()):g?f=t[1].length+1:(f=h.search(this.rules.other.nonSpaceChar),f=f>4?1:f,c=h.slice(f),f+=t[1].length),g&&this.rules.other.blankLine.test(p)&&(u+=p+`
`,r=r.substring(p.length+1),l=!0),!l){let k=this.rules.other.nextBulletRegex(f),S=this.rules.other.hrRegex(f),ft=this.rules.other.fencesBeginRegex(f),mt=this.rules.other.headingBeginRegex(f),ae=this.rules.other.htmlBeginRegex(f),le=this.rules.other.blockquoteBeginRegex(f);for(;r;){let K=r.split(`
`,1)[0],I;if(p=K,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),I=p):I=p.replace(this.rules.other.tabCharGlobal,"    "),ft.test(p)||mt.test(p)||ae.test(p)||le.test(p)||k.test(p)||S.test(p))break;if(I.search(this.rules.other.nonSpaceChar)>=f||!p.trim())c+=`
`+I.slice(f);else{if(g||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||ft.test(h)||mt.test(h)||S.test(h))break;c+=`
`+p}g=!p.trim(),u+=K+`
`,r=r.substring(K.length+1),h=I.slice(f)}}e.loose||(i?e.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(i=!0)),e.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),e.raw+=u}let o=e.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;e.raw=e.raw.trimEnd();for(let l of e.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let c={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=c.checked,e.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!e.loose){let u=l.tokens.filter(h=>h.type==="space"),c=u.length>0&&u.some(h=>this.rules.other.anyLine.test(h.raw));e.loose=c}}if(e.loose)for(let l of e.items){l.loose=!0;for(let u of l.tokens)u.type==="text"&&(u.type="paragraph")}return e}}html(r){let t=this.rules.block.html.exec(r);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(r){let t=this.rules.block.def.exec(r);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",e=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:e}}}table(r){let t=this.rules.block.table.exec(r);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=dt(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),e=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let i of s)this.rules.other.tableAlignRight.test(i)?a.align.push("right"):this.rules.other.tableAlignCenter.test(i)?a.align.push("center"):this.rules.other.tableAlignLeft.test(i)?a.align.push("left"):a.align.push(null);for(let i=0;i<n.length;i++)a.header.push({text:n[i],tokens:this.lexer.inline(n[i]),header:!0,align:a.align[i]});for(let i of e)a.rows.push(dt(i,a.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:a.align[l]})));return a}}lheading(r){let t=this.rules.block.lheading.exec(r);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(r){let t=this.rules.block.paragraph.exec(r);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(r){let t=this.rules.block.text.exec(r);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(r){let t=this.rules.inline.escape.exec(r);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(r){let t=this.rules.inline.tag.exec(r);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(r){let t=this.rules.inline.link.exec(r);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=L(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=ne(t[2],"()");if(a===-2)return;if(a>-1){let i=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,i).trim(),t[3]=""}}let s=t[2],e="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],e=a[3])}else e=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),gt(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:e&&e.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(r,t){let n;if((n=this.rules.inline.reflink.exec(r))||(n=this.rules.inline.nolink.exec(r))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),e=t[s.toLowerCase()];if(!e){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return gt(n,e,n[0],this.lexer,this.rules)}}emStrong(r,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(r);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let e=[...s[0]].length-1,a,i,o=e,l=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*r.length+e);(s=u.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(i=[...a].length,s[3]||s[4]){o+=i;continue}else if((s[5]||s[6])&&e%3&&!((e+i)%3)){l+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o+l);let c=[...s[0]][0].length,h=r.slice(0,e+s.index+c+i);if(Math.min(e,i)%2){let g=h.slice(1,-1);return{type:"em",raw:h,text:g,tokens:this.lexer.inlineTokens(g)}}let p=h.slice(2,-2);return{type:"strong",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(r){let t=this.rules.inline.code.exec(r);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),e=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&e&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(r){let t=this.rules.inline.br.exec(r);if(t)return{type:"br",raw:t[0]}}del(r,t,n=""){let s=this.rules.inline.delLDelim.exec(r);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let e=[...s[0]].length-1,a,i,o=e,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*r.length+e);(s=l.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(i=[...a].length,i!==e))continue;if(s[3]||s[4]){o+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o);let u=[...s[0]][0].length,c=r.slice(0,e+s.index+u+i),h=c.slice(e,-e);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(r){let t=this.rules.inline.autolink.exec(r);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(r){let t;if(t=this.rules.inline.url.exec(r)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let e;do e=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(e!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(r){let t=this.rules.inline.text.exec(r);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},w=class G{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||T,this.options.tokenizer=this.options.tokenizer||new N,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:b,block:q.normal,inline:z.normal};this.options.pedantic?(n.block=q.pedantic,n.inline=z.pedantic):this.options.gfm&&(n.block=q.gfm,this.options.breaks?n.inline=z.breaks:n.inline=z.gfm),this.tokenizer.rules=n}static get rules(){return{block:q,inline:z}}static lex(t,n){return new G(n).lex(t)}static lexInline(t,n){return new G(n).inlineTokens(t)}lex(t){t=t.replace(b.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(b.tabCharGlobal,"    ").replace(b.spaceLine,""));t;){let e;if(this.options.extensions?.block?.some(i=>(e=i.call({lexer:this},t,n))?(t=t.substring(e.raw.length),n.push(e),!0):!1))continue;if(e=this.tokenizer.space(t)){t=t.substring(e.raw.length);let i=n.at(-1);e.raw.length===1&&i!==void 0?i.raw+=`
`:n.push(e);continue}if(e=this.tokenizer.code(t)){t=t.substring(e.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+e.raw,i.text+=`
`+e.text,this.inlineQueue.at(-1).src=i.text):n.push(e);continue}if(e=this.tokenizer.fences(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.heading(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.hr(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.blockquote(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.list(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.html(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.def(t)){t=t.substring(e.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+e.raw,i.text+=`
`+e.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[e.tag]||(this.tokens.links[e.tag]={href:e.href,title:e.title},n.push(e));continue}if(e=this.tokenizer.table(t)){t=t.substring(e.raw.length),n.push(e);continue}if(e=this.tokenizer.lheading(t)){t=t.substring(e.raw.length),n.push(e);continue}let a=t;if(this.options.extensions?.startBlock){let i=1/0,o=t.slice(1),l;this.options.extensions.startBlock.forEach(u=>{l=u.call({lexer:this},o),typeof l=="number"&&l>=0&&(i=Math.min(i,l))}),i<1/0&&i>=0&&(a=t.substring(0,i+1))}if(this.state.top&&(e=this.tokenizer.paragraph(a))){let i=n.at(-1);s&&i?.type==="paragraph"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+e.raw,i.text+=`
`+e.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(e),s=a.length!==t.length,t=t.substring(e.raw.length);continue}if(e=this.tokenizer.text(t)){t=t.substring(e.raw.length);let i=n.at(-1);i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+e.raw,i.text+=`
`+e.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(e);continue}if(t){let i="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(i);break}else throw new Error(i)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,e=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(e=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(e[0].slice(e[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,e.index)+"["+"a".repeat(e[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(e=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,e.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(e=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=e[2]?e[2].length:0,s=s.slice(0,e.index+a)+"["+"a".repeat(e[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let i=!1,o="";for(;t;){i||(o=""),i=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},t,n))?(t=t.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(l.raw.length);let c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(t,s,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(t,s,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(t)){t=t.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(t))){t=t.substring(l.raw.length),n.push(l);continue}let u=t;if(this.options.extensions?.startInline){let c=1/0,h=t.slice(1),p;this.options.extensions.startInline.forEach(g=>{p=g.call({lexer:this},h),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(u=t.substring(0,c+1))}if(l=this.tokenizer.inlineText(u)){t=t.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},D=class{options;parser;constructor(r){this.options=r||T}space(r){return""}code({text:r,lang:t,escaped:n}){let s=(t||"").match(b.notSpaceStart)?.[0],e=r.replace(b.endingNewline,"")+`
`;return s?'<pre><code class="language-'+y(s)+'">'+(n?e:y(e,!0))+`</code></pre>
`:"<pre><code>"+(n?e:y(e,!0))+`</code></pre>
`}blockquote({tokens:r}){return`<blockquote>
${this.parser.parse(r)}</blockquote>
`}html({text:r}){return r}def(r){return""}heading({tokens:r,depth:t}){return`<h${t}>${this.parser.parseInline(r)}</h${t}>
`}hr(r){return`<hr>
`}list(r){let t=r.ordered,n=r.start,s="";for(let i=0;i<r.items.length;i++){let o=r.items[i];s+=this.listitem(o)}let e=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+e+a+`>
`+s+"</"+e+`>
`}listitem(r){return`<li>${this.parser.parse(r.tokens)}</li>
`}checkbox({checked:r}){return"<input "+(r?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:r}){return`<p>${this.parser.parseInline(r)}</p>
`}table(r){let t="",n="";for(let e=0;e<r.header.length;e++)n+=this.tablecell(r.header[e]);t+=this.tablerow({text:n});let s="";for(let e=0;e<r.rows.length;e++){let a=r.rows[e];n="";for(let i=0;i<a.length;i++)n+=this.tablecell(a[i]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:r}){return`<tr>
${r}</tr>
`}tablecell(r){let t=this.parser.parseInline(r.tokens),n=r.header?"th":"td";return(r.align?`<${n} align="${r.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:r}){return`<strong>${this.parser.parseInline(r)}</strong>`}em({tokens:r}){return`<em>${this.parser.parseInline(r)}</em>`}codespan({text:r}){return`<code>${y(r,!0)}</code>`}br(r){return"<br>"}del({tokens:r}){return`<del>${this.parser.parseInline(r)}</del>`}link({href:r,title:t,tokens:n}){let s=this.parser.parseInline(n),e=ht(r);if(e===null)return s;r=e;let a='<a href="'+r+'"';return t&&(a+=' title="'+y(t)+'"'),a+=">"+s+"</a>",a}image({href:r,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let e=ht(r);if(e===null)return y(n);r=e;let a=`<img src="${r}" alt="${y(n)}"`;return t&&(a+=` title="${y(t)}"`),a+=">",a}text(r){return"tokens"in r&&r.tokens?this.parser.parseInline(r.tokens):"escaped"in r&&r.escaped?r.text:y(r.text)}},Q=class{strong({text:r}){return r}em({text:r}){return r}codespan({text:r}){return r}del({text:r}){return r}html({text:r}){return r}text({text:r}){return r}link({text:r}){return""+r}image({text:r}){return""+r}br(){return""}checkbox({raw:r}){return r}},x=class V{options;renderer;textRenderer;constructor(t){this.options=t||T,this.options.renderer=this.options.renderer||new D,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Q}static parse(t,n){return new V(n).parse(t)}static parseInline(t,n){return new V(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let e=t[s];if(this.options.extensions?.renderers?.[e.type]){let i=e,o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){n+=o||"";continue}}let a=e;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let i='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return n}parseInline(t,n=this.renderer){let s="";for(let e=0;e<t.length;e++){let a=t[e];if(this.options.extensions?.renderers?.[a.type]){let o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=o||"";continue}}let i=a;switch(i.type){case"escape":{s+=n.text(i);break}case"html":{s+=n.html(i);break}case"link":{s+=n.link(i);break}case"image":{s+=n.image(i);break}case"checkbox":{s+=n.checkbox(i);break}case"strong":{s+=n.strong(i);break}case"em":{s+=n.em(i);break}case"codespan":{s+=n.codespan(i);break}case"br":{s+=n.br(i);break}case"del":{s+=n.del(i);break}case"text":{s+=n.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},P=class{options;block;constructor(r){this.options=r||T}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(r){return r}postprocess(r){return r}processAllTokens(r){return r}emStrongMask(r){return r}provideLexer(){return this.block?w.lex:w.lexInline}provideParser(){return this.block?x.parse:x.parseInline}},ie=class{defaults=v();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=x;Renderer=D;TextRenderer=Q;Lexer=w;Tokenizer=N;Hooks=P;constructor(...r){this.use(...r)}walkTokens(r,t){let n=[];for(let s of r)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let e=s;for(let a of e.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of e.rows)for(let i of a)n=n.concat(this.walkTokens(i.tokens,t));break}case"list":{let e=s;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=s;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(a=>{let i=e[a].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...r){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return r.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(e=>{if(!e.name)throw new Error("extension name required");if("renderer"in e){let a=t.renderers[e.name];a?t.renderers[e.name]=function(...i){let o=e.renderer.apply(this,i);return o===!1&&(o=a.apply(this,i)),o}:t.renderers[e.name]=e.renderer}if("tokenizer"in e){if(!e.level||e.level!=="block"&&e.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[e.level];a?a.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level==="block"?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level==="inline"&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}"childTokens"in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),s.extensions=t),n.renderer){let e=this.defaults.renderer||new D(this.defaults);for(let a in n.renderer){if(!(a in e))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let i=a,o=n.renderer[i],l=e[i];e[i]=(...u)=>{let c=o.apply(e,u);return c===!1&&(c=l.apply(e,u)),c||""}}s.renderer=e}if(n.tokenizer){let e=this.defaults.tokenizer||new N(this.defaults);for(let a in n.tokenizer){if(!(a in e))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let i=a,o=n.tokenizer[i],l=e[i];e[i]=(...u)=>{let c=o.apply(e,u);return c===!1&&(c=l.apply(e,u)),c}}s.tokenizer=e}if(n.hooks){let e=this.defaults.hooks||new P;for(let a in n.hooks){if(!(a in e))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let i=a,o=n.hooks[i],l=e[i];P.passThroughHooks.has(a)?e[i]=u=>{if(this.defaults.async&&P.passThroughHooksRespectAsync.has(a))return(async()=>{let h=await o.call(e,u);return l.call(e,h)})();let c=o.call(e,u);return l.call(e,c)}:e[i]=(...u)=>{if(this.defaults.async)return(async()=>{let h=await o.apply(e,u);return h===!1&&(h=await l.apply(e,u)),h})();let c=o.apply(e,u);return c===!1&&(c=l.apply(e,u)),c}}s.hooks=e}if(n.walkTokens){let e=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(i){let o=[];return o.push(a.call(this,i)),e&&(o=o.concat(e.call(this,i))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(r){return this.defaults={...this.defaults,...r},this}lexer(r,t){return w.lex(r,t??this.defaults)}parser(r,t){return x.parse(r,t??this.defaults)}parseMarkdown(r){return(t,n)=>{let s={...n},e={...this.defaults,...s},a=this.onError(!!e.silent,!!e.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(e.hooks&&(e.hooks.options=e,e.hooks.block=r),e.async)return(async()=>{let i=e.hooks?await e.hooks.preprocess(t):t,o=await(e.hooks?await e.hooks.provideLexer():r?w.lex:w.lexInline)(i,e),l=e.hooks?await e.hooks.processAllTokens(o):o;e.walkTokens&&await Promise.all(this.walkTokens(l,e.walkTokens));let u=await(e.hooks?await e.hooks.provideParser():r?x.parse:x.parseInline)(l,e);return e.hooks?await e.hooks.postprocess(u):u})().catch(a);try{e.hooks&&(t=e.hooks.preprocess(t));let i=(e.hooks?e.hooks.provideLexer():r?w.lex:w.lexInline)(t,e);e.hooks&&(i=e.hooks.processAllTokens(i)),e.walkTokens&&this.walkTokens(i,e.walkTokens);let o=(e.hooks?e.hooks.provideParser():r?x.parse:x.parseInline)(i,e);return e.hooks&&(o=e.hooks.postprocess(o)),o}catch(i){return a(i)}}}onError(r,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,r){let s="<p>An error occurred:</p><pre>"+y(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},A=new ie;function m(r,t){return A.parse(r,t)}return m.options=m.setOptions=function(r){return A.setOptions(r),m.defaults=A.defaults,X(m.defaults),m},m.getDefaults=v,m.defaults=T,m.use=function(...r){return A.use(...r),m.defaults=A.defaults,X(m.defaults),m},m.walkTokens=function(r,t){return A.walkTokens(r,t)},m.parseInline=A.parseInline,m.Parser=x,m.parser=x.parse,m.Renderer=D,m.TextRenderer=Q,m.Lexer=w,m.lexer=w.lex,m.Tokenizer=N,m.Hooks=P,m.parse=m,m.options,m.setOptions,m.use,m.walkTokens,m.parseInline,x.parse,w.lex,()=>{let r,t=null,n;function s(){if(t&&!t.closed)t.focus();else{if(t=window.open("about:blank","reveal.js - Notes","width=1100,height=700"),t.marked=m,t.document.write($),!t){alert("Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.");return}a()}}function e(h){t&&!t.closed?t.focus():(t=h,window.addEventListener("message",u),c())}function a(){const h=n.getConfig().url,p=typeof h=="string"?h:window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search;r=setInterval(function(){t.postMessage(JSON.stringify({namespace:"reveal-notes",type:"connect",state:n.getState(),url:p}),"*")},500),window.addEventListener("message",u)}function i(h,p,g){let f=n[h].apply(n,p);t.postMessage(JSON.stringify({namespace:"reveal-notes",type:"return",result:f,callId:g}),"*")}function o(h){let p=n.getCurrentSlide(),g=p.querySelectorAll("aside.notes"),f=p.querySelector(".current-fragment"),k={namespace:"reveal-notes",type:"state",notes:"",markdown:!1,whitespace:"normal",state:n.getState()};if(p.hasAttribute("data-notes")&&(k.notes=p.getAttribute("data-notes"),k.whitespace="pre-wrap"),f){let S=f.querySelector("aside.notes");S?(k.notes=S.innerHTML,k.markdown=typeof S.getAttribute("data-markdown")=="string",g=null):f.hasAttribute("data-notes")&&(k.notes=f.getAttribute("data-notes"),k.whitespace="pre-wrap",g=null)}g&&g.length&&(g=Array.from(g).filter(S=>S.closest(".fragment")===null),k.notes=g.map(S=>S.innerHTML).join(`
`),k.markdown=g[0]&&typeof g[0].getAttribute("data-markdown")=="string"),t.postMessage(JSON.stringify(k),"*")}function l(h){try{return window.location.origin===h.source.location.origin}catch{return!1}}function u(h){if(l(h))try{let p=JSON.parse(h.data);p&&p.namespace==="reveal-notes"&&p.type==="connected"?(clearInterval(r),c()):p&&p.namespace==="reveal-notes"&&p.type==="call"&&i(p.methodName,p.arguments,p.callId)}catch{}}function c(){n.on("slidechanged",o),n.on("fragmentshown",o),n.on("fragmenthidden",o),n.on("overviewhidden",o),n.on("overviewshown",o),n.on("paused",o),n.on("resumed",o),n.on("previewiframe",o),n.on("previewimage",o),n.on("previewvideo",o),n.on("closeoverlay",o),o()}return{id:"notes",init:function(h){n=h,/receiver/i.test(window.location.search)||(window.location.search.match(/(\?|\&)notes/gi)!==null?s():window.addEventListener("message",p=>{if(!t&&typeof p.data=="string"){let g;try{g=JSON.parse(p.data)}catch{}g&&g.namespace==="reveal-notes"&&g.type==="heartbeat"&&e(p.source)}}),n.addKeyBinding({keyCode:83,key:"S",description:"Speaker notes view"},function(){s()}))},open:s}}}));
