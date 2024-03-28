(function(z,T){typeof exports=="object"&&typeof module<"u"?module.exports=T():typeof define=="function"&&define.amd?define(T):(z=typeof globalThis<"u"?globalThis:z||self,z.RevealNotes=T())})(this,function(){"use strict";var kt=Object.defineProperty;var wt=(z,T,_)=>T in z?kt(z,T,{enumerable:!0,configurable:!0,writable:!0,value:_}):z[T]=_;var G=(z,T,_)=>(wt(z,typeof T!="symbol"?T+"":T,_),_);const z=`<!--
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
						if( /ready/.test( data.eventName ) ) {
							// Send a message back to notify that the handshake is complete
							window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'connected'} ), '*' );
						}
						else if( /slidechanged|fragmentshown|fragmenthidden|paused|resumed/.test( data.eventName ) && currentState !== JSON.stringify( data.state ) ) {

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
							notesValue.innerHTML = marked( data.notes );
						}
						else {
							notesValue.innerHTML = data.notes;
						}
					}
					else {
						notes.classList.add( 'hidden' );
					}

					// Update the note slides
					currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );
					upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );
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
</html>`;function T(){return{async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,hooks:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}let _=T();function tt(l){_=l}const U=/[&<>"']/,et=new RegExp(U.source,"g"),B=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,nt=new RegExp(B.source,"g"),it={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Z=l=>it[l];function v(l,n){if(n){if(U.test(l))return l.replace(et,Z)}else if(B.test(l))return l.replace(nt,Z);return l}const st=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function H(l){return l.replace(st,(n,e)=>(e=e.toLowerCase(),e==="colon"?":":e.charAt(0)==="#"?e.charAt(1)==="x"?String.fromCharCode(parseInt(e.substring(2),16)):String.fromCharCode(+e.substring(1)):""))}const rt=/(^|[^\[])\^/g;function k(l,n){l=typeof l=="string"?l:l.source,n=n||"";const e={replace:(t,i)=>(i=i.source||i,i=i.replace(rt,"$1"),l=l.replace(t,i),e),getRegex:()=>new RegExp(l,n)};return e}const at=/[^\w:]/g,lt=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function j(l,n,e){if(l){let t;try{t=decodeURIComponent(H(e)).replace(at,"").toLowerCase()}catch{return null}if(t.indexOf("javascript:")===0||t.indexOf("vbscript:")===0||t.indexOf("data:")===0)return null}n&&!lt.test(e)&&(e=pt(n,e));try{e=encodeURI(e).replace(/%25/g,"%")}catch{return null}return e}const M={},ot=/^[^:]+:\/*[^/]*$/,ct=/^([^:]+:)[\s\S]*$/,ut=/^([^:]+:\/*[^/]*)[\s\S]*$/;function pt(l,n){M[" "+l]||(ot.test(l)?M[" "+l]=l+"/":M[" "+l]=P(l,"/",!0)),l=M[" "+l];const e=l.indexOf(":")===-1;return n.substring(0,2)==="//"?e?n:l.replace(ct,"$1")+n:n.charAt(0)==="/"?e?n:l.replace(ut,"$1")+n:l+n}const N={exec:function(){}};function J(l,n){const e=l.replace(/\|/g,(s,a,r)=>{let u=!1,m=a;for(;--m>=0&&r[m]==="\\";)u=!u;return u?"|":" |"}),t=e.split(/ \|/);let i=0;if(t[0].trim()||t.shift(),t.length>0&&!t[t.length-1].trim()&&t.pop(),t.length>n)t.splice(n);else for(;t.length<n;)t.push("");for(;i<t.length;i++)t[i]=t[i].trim().replace(/\\\|/g,"|");return t}function P(l,n,e){const t=l.length;if(t===0)return"";let i=0;for(;i<t;){const s=l.charAt(t-i-1);if(s===n&&!e)i++;else if(s!==n&&e)i++;else break}return l.slice(0,t-i)}function dt(l,n){if(l.indexOf(n[1])===-1)return-1;const e=l.length;let t=0,i=0;for(;i<e;i++)if(l[i]==="\\")i++;else if(l[i]===n[0])t++;else if(l[i]===n[1]&&(t--,t<0))return i;return-1}function ht(l){l&&l.sanitize&&!l.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}function W(l,n){if(n<1)return"";let e="";for(;n>1;)n&1&&(e+=l),n>>=1,l+=l;return e+l}function Q(l,n,e,t){const i=n.href,s=n.title?v(n.title):null,a=l[1].replace(/\\([\[\]])/g,"$1");if(l[0].charAt(0)!=="!"){t.state.inLink=!0;const r={type:"link",raw:e,href:i,title:s,text:a,tokens:t.inlineTokens(a)};return t.state.inLink=!1,r}return{type:"image",raw:e,href:i,title:s,text:v(a)}}function gt(l,n){const e=l.match(/^(\s+)(?:```)/);if(e===null)return n;const t=e[1];return n.split(`
`).map(i=>{const s=i.match(/^\s+/);if(s===null)return i;const[a]=s;return a.length>=t.length?i.slice(t.length):i}).join(`
`)}class O{constructor(n){this.options=n||_}space(n){const e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){const e=this.rules.block.code.exec(n);if(e){const t=e[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:P(t,`
`)}}}fences(n){const e=this.rules.block.fences.exec(n);if(e){const t=e[0],i=gt(t,e[3]||"");return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline._escapes,"$1"):e[2],text:i}}}heading(n){const e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(/#$/.test(t)){const i=P(t,"#");(this.options.pedantic||!i||/ $/.test(i))&&(t=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){const e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:e[0]}}blockquote(n){const e=this.rules.block.blockquote.exec(n);if(e){const t=e[0].replace(/^ *>[ \t]?/gm,""),i=this.lexer.state.top;this.lexer.state.top=!0;const s=this.lexer.blockTokens(t);return this.lexer.state.top=i,{type:"blockquote",raw:e[0],tokens:s,text:t}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t,i,s,a,r,u,m,f,d,p,o,x,b=e[1].trim();const S=b.length>1,w={type:"list",raw:"",ordered:S,start:S?+b.slice(0,-1):"",loose:!1,items:[]};b=S?`\\d{1,9}\\${b.slice(-1)}`:`\\${b}`,this.options.pedantic&&(b=S?b:"[*+-]");const y=new RegExp(`^( {0,3}${b})((?:[	 ][^\\n]*)?(?:\\n|$))`);for(;n&&(x=!1,!(!(e=y.exec(n))||this.rules.block.hr.test(n)));){if(t=e[0],n=n.substring(t.length),f=e[2].split(`
`,1)[0].replace(/^\t+/,A=>" ".repeat(3*A.length)),d=n.split(`
`,1)[0],this.options.pedantic?(a=2,o=f.trimLeft()):(a=e[2].search(/[^ ]/),a=a>4?1:a,o=f.slice(a),a+=e[1].length),u=!1,!f&&/^ *$/.test(d)&&(t+=d+`
`,n=n.substring(d.length+1),x=!0),!x){const A=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),$=new RegExp(`^ {0,${Math.min(3,a-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),E=new RegExp(`^ {0,${Math.min(3,a-1)}}(?:\`\`\`|~~~)`),C=new RegExp(`^ {0,${Math.min(3,a-1)}}#`);for(;n&&(p=n.split(`
`,1)[0],d=p,this.options.pedantic&&(d=d.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!(E.test(d)||C.test(d)||A.test(d)||$.test(n)));){if(d.search(/[^ ]/)>=a||!d.trim())o+=`
`+d.slice(a);else{if(u||f.search(/[^ ]/)>=4||E.test(f)||C.test(f)||$.test(f))break;o+=`
`+d}!u&&!d.trim()&&(u=!0),t+=p+`
`,n=n.substring(p.length+1),f=d.slice(a)}}w.loose||(m?w.loose=!0:/\n *\n *$/.test(t)&&(m=!0)),this.options.gfm&&(i=/^\[[ xX]\] /.exec(o),i&&(s=i[0]!=="[ ] ",o=o.replace(/^\[[ xX]\] +/,""))),w.items.push({type:"list_item",raw:t,task:!!i,checked:s,loose:!1,text:o}),w.raw+=t}w.items[w.items.length-1].raw=t.trimRight(),w.items[w.items.length-1].text=o.trimRight(),w.raw=w.raw.trimRight();const I=w.items.length;for(r=0;r<I;r++)if(this.lexer.state.top=!1,w.items[r].tokens=this.lexer.blockTokens(w.items[r].text,[]),!w.loose){const A=w.items[r].tokens.filter(E=>E.type==="space"),$=A.length>0&&A.some(E=>/\n.*\n/.test(E.raw));w.loose=$}if(w.loose)for(r=0;r<I;r++)w.items[r].loose=!0;return w}}html(n){const e=this.rules.block.html.exec(n);if(e){const t={type:"html",raw:e[0],pre:!this.options.sanitizer&&(e[1]==="pre"||e[1]==="script"||e[1]==="style"),text:e[0]};if(this.options.sanitize){const i=this.options.sanitizer?this.options.sanitizer(e[0]):v(e[0]);t.type="paragraph",t.text=i,t.tokens=this.lexer.inline(i)}return t}}def(n){const e=this.rules.block.def.exec(n);if(e){const t=e[1].toLowerCase().replace(/\s+/g," "),i=e[2]?e[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline._escapes,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline._escapes,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:i,title:s}}}table(n){const e=this.rules.block.table.exec(n);if(e){const t={type:"table",header:J(e[1]).map(i=>({text:i})),align:e[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:e[3]&&e[3].trim()?e[3].replace(/\n[ \t]*$/,"").split(`
`):[]};if(t.header.length===t.align.length){t.raw=e[0];let i=t.align.length,s,a,r,u;for(s=0;s<i;s++)/^ *-+: *$/.test(t.align[s])?t.align[s]="right":/^ *:-+: *$/.test(t.align[s])?t.align[s]="center":/^ *:-+ *$/.test(t.align[s])?t.align[s]="left":t.align[s]=null;for(i=t.rows.length,s=0;s<i;s++)t.rows[s]=J(t.rows[s],t.header.length).map(m=>({text:m}));for(i=t.header.length,a=0;a<i;a++)t.header[a].tokens=this.lexer.inline(t.header[a].text);for(i=t.rows.length,a=0;a<i;a++)for(u=t.rows[a],r=0;r<u.length;r++)u[r].tokens=this.lexer.inline(u[r].text);return t}}}lheading(n){const e=this.rules.block.lheading.exec(n);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(n){const e=this.rules.block.paragraph.exec(n);if(e){const t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){const e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){const e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:v(e[1])}}tag(n){const e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&/^<a /i.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(e[0]):v(e[0]):e[0]}}link(n){const e=this.rules.inline.link.exec(n);if(e){const t=e[2].trim();if(!this.options.pedantic&&/^</.test(t)){if(!/>$/.test(t))return;const a=P(t.slice(0,-1),"\\");if((t.length-a.length)%2===0)return}else{const a=dt(e[2],"()");if(a>-1){const u=(e[0].indexOf("!")===0?5:4)+e[1].length+a;e[2]=e[2].substring(0,a),e[0]=e[0].substring(0,u).trim(),e[3]=""}}let i=e[2],s="";if(this.options.pedantic){const a=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);a&&(i=a[1],s=a[3])}else s=e[3]?e[3].slice(1,-1):"";return i=i.trim(),/^</.test(i)&&(this.options.pedantic&&!/>$/.test(t)?i=i.slice(1):i=i.slice(1,-1)),Q(e,{href:i&&i.replace(this.rules.inline._escapes,"$1"),title:s&&s.replace(this.rules.inline._escapes,"$1")},e[0],this.lexer)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){let i=(t[2]||t[1]).replace(/\s+/g," ");if(i=e[i.toLowerCase()],!i){const s=t[0].charAt(0);return{type:"text",raw:s,text:s}}return Q(t,i,t[0],this.lexer)}}emStrong(n,e,t=""){let i=this.rules.inline.emStrong.lDelim.exec(n);if(!i||i[3]&&t.match(/[\p{L}\p{N}]/u))return;const s=i[1]||i[2]||"";if(!s||s&&(t===""||this.rules.inline.punctuation.exec(t))){const a=i[0].length-1;let r,u,m=a,f=0;const d=i[0][0]==="*"?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(d.lastIndex=0,e=e.slice(-1*n.length+a);(i=d.exec(e))!=null;){if(r=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!r)continue;if(u=r.length,i[3]||i[4]){m+=u;continue}else if((i[5]||i[6])&&a%3&&!((a+u)%3)){f+=u;continue}if(m-=u,m>0)continue;u=Math.min(u,u+m+f);const p=n.slice(0,a+i.index+(i[0].length-r.length)+u);if(Math.min(a,u)%2){const x=p.slice(1,-1);return{type:"em",raw:p,text:x,tokens:this.lexer.inlineTokens(x)}}const o=p.slice(2,-2);return{type:"strong",raw:p,text:o,tokens:this.lexer.inlineTokens(o)}}}}codespan(n){const e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(/\n/g," ");const i=/[^ ]/.test(t),s=/^ /.test(t)&&/ $/.test(t);return i&&s&&(t=t.substring(1,t.length-1)),t=v(t,!0),{type:"codespan",raw:e[0],text:t}}}br(n){const e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n){const e=this.rules.inline.del.exec(n);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(n,e){const t=this.rules.inline.autolink.exec(n);if(t){let i,s;return t[2]==="@"?(i=v(this.options.mangle?e(t[1]):t[1]),s="mailto:"+i):(i=v(t[1]),s=i),{type:"link",raw:t[0],text:i,href:s,tokens:[{type:"text",raw:i,text:i}]}}}url(n,e){let t;if(t=this.rules.inline.url.exec(n)){let i,s;if(t[2]==="@")i=v(this.options.mangle?e(t[0]):t[0]),s="mailto:"+i;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])[0];while(a!==t[0]);i=v(t[0]),t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:i,href:s,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(n,e){const t=this.rules.inline.text.exec(n);if(t){let i;return this.lexer.state.inRawBlock?i=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):v(t[0]):t[0]:i=v(this.options.smartypants?e(t[0]):t[0]),{type:"text",raw:t[0],text:i}}}}const h={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:N,lheading:/^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/};h._label=/(?!\s*\])(?:\\.|[^\[\]\\])+/,h._title=/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,h.def=k(h.def).replace("label",h._label).replace("title",h._title).getRegex(),h.bullet=/(?:[*+-]|\d{1,9}[.)])/,h.listItemStart=k(/^( *)(bull) */).replace("bull",h.bullet).getRegex(),h.list=k(h.list).replace(/bull/g,h.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+h.def.source+")").getRegex(),h._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",h._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,h.html=k(h.html,"i").replace("comment",h._comment).replace("tag",h._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),h.paragraph=k(h._paragraph).replace("hr",h.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",h._tag).getRegex(),h.blockquote=k(h.blockquote).replace("paragraph",h.paragraph).getRegex(),h.normal={...h},h.gfm={...h.normal,table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"},h.gfm.table=k(h.gfm.table).replace("hr",h.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",h._tag).getRegex(),h.gfm.paragraph=k(h._paragraph).replace("hr",h.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",h.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",h._tag).getRegex(),h.pedantic={...h.normal,html:k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",h._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:N,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:k(h.normal._paragraph).replace("hr",h.hr).replace("heading",` *#{1,6} *[^
]`).replace("lheading",h.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()};const c={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:N,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,rDelimUnd:/^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:N,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};c._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",c.punctuation=k(c.punctuation).replace(/punctuation/g,c._punctuation).getRegex(),c.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,c.escapedEmSt=/(?:^|[^\\])(?:\\\\)*\\[*_]/g,c._comment=k(h._comment).replace("(?:-->|$)","-->").getRegex(),c.emStrong.lDelim=k(c.emStrong.lDelim).replace(/punct/g,c._punctuation).getRegex(),c.emStrong.rDelimAst=k(c.emStrong.rDelimAst,"g").replace(/punct/g,c._punctuation).getRegex(),c.emStrong.rDelimUnd=k(c.emStrong.rDelimUnd,"g").replace(/punct/g,c._punctuation).getRegex(),c._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,c._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,c._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,c.autolink=k(c.autolink).replace("scheme",c._scheme).replace("email",c._email).getRegex(),c._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,c.tag=k(c.tag).replace("comment",c._comment).replace("attribute",c._attribute).getRegex(),c._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,c._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,c._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,c.link=k(c.link).replace("label",c._label).replace("href",c._href).replace("title",c._title).getRegex(),c.reflink=k(c.reflink).replace("label",c._label).replace("ref",h._label).getRegex(),c.nolink=k(c.nolink).replace("ref",h._label).getRegex(),c.reflinkSearch=k(c.reflinkSearch,"g").replace("reflink",c.reflink).replace("nolink",c.nolink).getRegex(),c.normal={...c},c.pedantic={...c.normal,strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:k(/^!?\[(label)\]\((.*?)\)/).replace("label",c._label).getRegex(),reflink:k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",c._label).getRegex()},c.gfm={...c.normal,escape:k(c.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},c.gfm.url=k(c.gfm.url,"i").replace("email",c.gfm._extended_email).getRegex(),c.breaks={...c.gfm,br:k(c.br).replace("{2,}","*").getRegex(),text:k(c.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()};function ft(l){return l.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function K(l){let n="",e,t;const i=l.length;for(e=0;e<i;e++)t=l.charCodeAt(e),Math.random()>.5&&(t="x"+t.toString(16)),n+="&#"+t+";";return n}class R{constructor(n){this.tokens=[],this.tokens.links=Object.create(null),this.options=n||_,this.options.tokenizer=this.options.tokenizer||new O,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const e={block:h.normal,inline:c.normal};this.options.pedantic?(e.block=h.pedantic,e.inline=c.pedantic):this.options.gfm&&(e.block=h.gfm,this.options.breaks?e.inline=c.breaks:e.inline=c.gfm),this.tokenizer.rules=e}static get rules(){return{block:h,inline:c}}static lex(n,e){return new R(e).lex(n)}static lexInline(n,e){return new R(e).inlineTokens(n)}lex(n){n=n.replace(/\r\n|\r/g,`
`),this.blockTokens(n,this.tokens);let e;for(;e=this.inlineQueue.shift();)this.inlineTokens(e.src,e.tokens);return this.tokens}blockTokens(n,e=[]){this.options.pedantic?n=n.replace(/\t/g,"    ").replace(/^ +$/gm,""):n=n.replace(/^( *)(\t+)/gm,(r,u,m)=>u+"    ".repeat(m.length));let t,i,s,a;for(;n;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(r=>(t=r.call({lexer:this},n,e))?(n=n.substring(t.raw.length),e.push(t),!0):!1))){if(t=this.tokenizer.space(n)){n=n.substring(t.raw.length),t.raw.length===1&&e.length>0?e[e.length-1].raw+=`
`:e.push(t);continue}if(t=this.tokenizer.code(n)){n=n.substring(t.raw.length),i=e[e.length-1],i&&(i.type==="paragraph"||i.type==="text")?(i.raw+=`
`+t.raw,i.text+=`
`+t.text,this.inlineQueue[this.inlineQueue.length-1].src=i.text):e.push(t);continue}if(t=this.tokenizer.fences(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.heading(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.hr(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.blockquote(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.list(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.html(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.def(n)){n=n.substring(t.raw.length),i=e[e.length-1],i&&(i.type==="paragraph"||i.type==="text")?(i.raw+=`
`+t.raw,i.text+=`
`+t.raw,this.inlineQueue[this.inlineQueue.length-1].src=i.text):this.tokens.links[t.tag]||(this.tokens.links[t.tag]={href:t.href,title:t.title});continue}if(t=this.tokenizer.table(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.lheading(n)){n=n.substring(t.raw.length),e.push(t);continue}if(s=n,this.options.extensions&&this.options.extensions.startBlock){let r=1/0;const u=n.slice(1);let m;this.options.extensions.startBlock.forEach(function(f){m=f.call({lexer:this},u),typeof m=="number"&&m>=0&&(r=Math.min(r,m))}),r<1/0&&r>=0&&(s=n.substring(0,r+1))}if(this.state.top&&(t=this.tokenizer.paragraph(s))){i=e[e.length-1],a&&i.type==="paragraph"?(i.raw+=`
`+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=i.text):e.push(t),a=s.length!==n.length,n=n.substring(t.raw.length);continue}if(t=this.tokenizer.text(n)){n=n.substring(t.raw.length),i=e[e.length-1],i&&i.type==="text"?(i.raw+=`
`+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=i.text):e.push(t);continue}if(n){const r="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(r);break}else throw new Error(r)}}return this.state.top=!0,e}inline(n,e=[]){return this.inlineQueue.push({src:n,tokens:e}),e}inlineTokens(n,e=[]){let t,i,s,a=n,r,u,m;if(this.tokens.links){const f=Object.keys(this.tokens.links);if(f.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(a))!=null;)f.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(a=a.slice(0,r.index)+"["+W("a",r[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.blockSkip.exec(a))!=null;)a=a.slice(0,r.index)+"["+W("a",r[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(r=this.tokenizer.rules.inline.escapedEmSt.exec(a))!=null;)a=a.slice(0,r.index+r[0].length-2)+"++"+a.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex),this.tokenizer.rules.inline.escapedEmSt.lastIndex--;for(;n;)if(u||(m=""),u=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(f=>(t=f.call({lexer:this},n,e))?(n=n.substring(t.raw.length),e.push(t),!0):!1))){if(t=this.tokenizer.escape(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.tag(n)){n=n.substring(t.raw.length),i=e[e.length-1],i&&t.type==="text"&&i.type==="text"?(i.raw+=t.raw,i.text+=t.text):e.push(t);continue}if(t=this.tokenizer.link(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.reflink(n,this.tokens.links)){n=n.substring(t.raw.length),i=e[e.length-1],i&&t.type==="text"&&i.type==="text"?(i.raw+=t.raw,i.text+=t.text):e.push(t);continue}if(t=this.tokenizer.emStrong(n,a,m)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.codespan(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.br(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.del(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.autolink(n,K)){n=n.substring(t.raw.length),e.push(t);continue}if(!this.state.inLink&&(t=this.tokenizer.url(n,K))){n=n.substring(t.raw.length),e.push(t);continue}if(s=n,this.options.extensions&&this.options.extensions.startInline){let f=1/0;const d=n.slice(1);let p;this.options.extensions.startInline.forEach(function(o){p=o.call({lexer:this},d),typeof p=="number"&&p>=0&&(f=Math.min(f,p))}),f<1/0&&f>=0&&(s=n.substring(0,f+1))}if(t=this.tokenizer.inlineText(s,ft)){n=n.substring(t.raw.length),t.raw.slice(-1)!=="_"&&(m=t.raw.slice(-1)),u=!0,i=e[e.length-1],i&&i.type==="text"?(i.raw+=t.raw,i.text+=t.text):e.push(t);continue}if(n){const f="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(f);break}else throw new Error(f)}}return e}}class D{constructor(n){this.options=n||_}code(n,e,t){const i=(e||"").match(/\S*/)[0];if(this.options.highlight){const s=this.options.highlight(n,i);s!=null&&s!==n&&(t=!0,n=s)}return n=n.replace(/\n$/,"")+`
`,i?'<pre><code class="'+this.options.langPrefix+v(i)+'">'+(t?n:v(n,!0))+`</code></pre>
`:"<pre><code>"+(t?n:v(n,!0))+`</code></pre>
`}blockquote(n){return`<blockquote>
${n}</blockquote>
`}html(n){return n}heading(n,e,t,i){if(this.options.headerIds){const s=this.options.headerPrefix+i.slug(t);return`<h${e} id="${s}">${n}</h${e}>
`}return`<h${e}>${n}</h${e}>
`}hr(){return this.options.xhtml?`<hr/>
`:`<hr>
`}list(n,e,t){const i=e?"ol":"ul",s=e&&t!==1?' start="'+t+'"':"";return"<"+i+s+`>
`+n+"</"+i+`>
`}listitem(n){return`<li>${n}</li>
`}checkbox(n){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(n){return`<p>${n}</p>
`}table(n,e){return e&&(e=`<tbody>${e}</tbody>`),`<table>
<thead>
`+n+`</thead>
`+e+`</table>
`}tablerow(n){return`<tr>
${n}</tr>
`}tablecell(n,e){const t=e.header?"th":"td";return(e.align?`<${t} align="${e.align}">`:`<${t}>`)+n+`</${t}>
`}strong(n){return`<strong>${n}</strong>`}em(n){return`<em>${n}</em>`}codespan(n){return`<code>${n}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(n){return`<del>${n}</del>`}link(n,e,t){if(n=j(this.options.sanitize,this.options.baseUrl,n),n===null)return t;let i='<a href="'+n+'"';return e&&(i+=' title="'+e+'"'),i+=">"+t+"</a>",i}image(n,e,t){if(n=j(this.options.sanitize,this.options.baseUrl,n),n===null)return t;let i=`<img src="${n}" alt="${t}"`;return e&&(i+=` title="${e}"`),i+=this.options.xhtml?"/>":">",i}text(n){return n}}class V{strong(n){return n}em(n){return n}codespan(n){return n}del(n){return n}html(n){return n}text(n){return n}link(n,e,t){return""+t}image(n,e,t){return""+t}br(){return""}}class F{constructor(){this.seen={}}serialize(n){return n.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(n,e){let t=n,i=0;if(this.seen.hasOwnProperty(t)){i=this.seen[n];do i++,t=n+"-"+i;while(this.seen.hasOwnProperty(t))}return e||(this.seen[n]=i,this.seen[t]=0),t}slug(n,e={}){const t=this.serialize(n);return this.getNextSafeSlug(t,e.dryrun)}}class L{constructor(n){this.options=n||_,this.options.renderer=this.options.renderer||new D,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new V,this.slugger=new F}static parse(n,e){return new L(e).parse(n)}static parseInline(n,e){return new L(e).parseInline(n)}parse(n,e=!0){let t="",i,s,a,r,u,m,f,d,p,o,x,b,S,w,y,I,A,$,E;const C=n.length;for(i=0;i<C;i++){if(o=n[i],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[o.type]&&(E=this.options.extensions.renderers[o.type].call({parser:this},o),E!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(o.type))){t+=E||"";continue}switch(o.type){case"space":continue;case"hr":{t+=this.renderer.hr();continue}case"heading":{t+=this.renderer.heading(this.parseInline(o.tokens),o.depth,H(this.parseInline(o.tokens,this.textRenderer)),this.slugger);continue}case"code":{t+=this.renderer.code(o.text,o.lang,o.escaped);continue}case"table":{for(d="",f="",r=o.header.length,s=0;s<r;s++)f+=this.renderer.tablecell(this.parseInline(o.header[s].tokens),{header:!0,align:o.align[s]});for(d+=this.renderer.tablerow(f),p="",r=o.rows.length,s=0;s<r;s++){for(m=o.rows[s],f="",u=m.length,a=0;a<u;a++)f+=this.renderer.tablecell(this.parseInline(m[a].tokens),{header:!1,align:o.align[a]});p+=this.renderer.tablerow(f)}t+=this.renderer.table(d,p);continue}case"blockquote":{p=this.parse(o.tokens),t+=this.renderer.blockquote(p);continue}case"list":{for(x=o.ordered,b=o.start,S=o.loose,r=o.items.length,p="",s=0;s<r;s++)y=o.items[s],I=y.checked,A=y.task,w="",y.task&&($=this.renderer.checkbox(I),S?y.tokens.length>0&&y.tokens[0].type==="paragraph"?(y.tokens[0].text=$+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&y.tokens[0].tokens[0].type==="text"&&(y.tokens[0].tokens[0].text=$+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:$}):w+=$),w+=this.parse(y.tokens,S),p+=this.renderer.listitem(w,A,I);t+=this.renderer.list(p,x,b);continue}case"html":{t+=this.renderer.html(o.text);continue}case"paragraph":{t+=this.renderer.paragraph(this.parseInline(o.tokens));continue}case"text":{for(p=o.tokens?this.parseInline(o.tokens):o.text;i+1<C&&n[i+1].type==="text";)o=n[++i],p+=`
`+(o.tokens?this.parseInline(o.tokens):o.text);t+=e?this.renderer.paragraph(p):p;continue}default:{const X='Token with "'+o.type+'" type was not found.';if(this.options.silent){console.error(X);return}else throw new Error(X)}}}return t}parseInline(n,e){e=e||this.renderer;let t="",i,s,a;const r=n.length;for(i=0;i<r;i++){if(s=n[i],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]&&(a=this.options.extensions.renderers[s.type].call({parser:this},s),a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type))){t+=a||"";continue}switch(s.type){case"escape":{t+=e.text(s.text);break}case"html":{t+=e.html(s.text);break}case"link":{t+=e.link(s.href,s.title,this.parseInline(s.tokens,e));break}case"image":{t+=e.image(s.href,s.title,s.text);break}case"strong":{t+=e.strong(this.parseInline(s.tokens,e));break}case"em":{t+=e.em(this.parseInline(s.tokens,e));break}case"codespan":{t+=e.codespan(s.text);break}case"br":{t+=e.br();break}case"del":{t+=e.del(this.parseInline(s.tokens,e));break}case"text":{t+=e.text(s.text);break}default:{const u='Token with "'+s.type+'" type was not found.';if(this.options.silent){console.error(u);return}else throw new Error(u)}}}return t}}class q{constructor(n){this.options=n||_}preprocess(n){return n}postprocess(n){return n}}G(q,"passThroughHooks",new Set(["preprocess","postprocess"]));function mt(l,n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,l){const i="<p>An error occurred:</p><pre>"+v(t.message+"",!0)+"</pre>";if(n)return Promise.resolve(i);if(e){e(null,i);return}return i}if(n)return Promise.reject(t);if(e){e(t);return}throw t}}function Y(l,n){return(e,t,i)=>{typeof t=="function"&&(i=t,t=null);const s={...t};t={...g.defaults,...s};const a=mt(t.silent,t.async,i);if(typeof e>"u"||e===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(ht(t),t.hooks&&(t.hooks.options=t),i){const r=t.highlight;let u;try{t.hooks&&(e=t.hooks.preprocess(e)),u=l(e,t)}catch(d){return a(d)}const m=function(d){let p;if(!d)try{t.walkTokens&&g.walkTokens(u,t.walkTokens),p=n(u,t),t.hooks&&(p=t.hooks.postprocess(p))}catch(o){d=o}return t.highlight=r,d?a(d):i(null,p)};if(!r||r.length<3||(delete t.highlight,!u.length))return m();let f=0;g.walkTokens(u,function(d){d.type==="code"&&(f++,setTimeout(()=>{r(d.text,d.lang,function(p,o){if(p)return m(p);o!=null&&o!==d.text&&(d.text=o,d.escaped=!0),f--,f===0&&m()})},0))}),f===0&&m();return}if(t.async)return Promise.resolve(t.hooks?t.hooks.preprocess(e):e).then(r=>l(r,t)).then(r=>t.walkTokens?Promise.all(g.walkTokens(r,t.walkTokens)).then(()=>r):r).then(r=>n(r,t)).then(r=>t.hooks?t.hooks.postprocess(r):r).catch(a);try{t.hooks&&(e=t.hooks.preprocess(e));const r=l(e,t);t.walkTokens&&g.walkTokens(r,t.walkTokens);let u=n(r,t);return t.hooks&&(u=t.hooks.postprocess(u)),u}catch(r){return a(r)}}}function g(l,n,e){return Y(R.lex,L.parse)(l,n,e)}return g.options=g.setOptions=function(l){return g.defaults={...g.defaults,...l},tt(g.defaults),g},g.getDefaults=T,g.defaults=_,g.use=function(...l){const n=g.defaults.extensions||{renderers:{},childTokens:{}};l.forEach(e=>{const t={...e};if(t.async=g.defaults.async||t.async||!1,e.extensions&&(e.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if(i.renderer){const s=n.renderers[i.name];s?n.renderers[i.name]=function(...a){let r=i.renderer.apply(this,a);return r===!1&&(r=s.apply(this,a)),r}:n.renderers[i.name]=i.renderer}if(i.tokenizer){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");n[i.level]?n[i.level].unshift(i.tokenizer):n[i.level]=[i.tokenizer],i.start&&(i.level==="block"?n.startBlock?n.startBlock.push(i.start):n.startBlock=[i.start]:i.level==="inline"&&(n.startInline?n.startInline.push(i.start):n.startInline=[i.start]))}i.childTokens&&(n.childTokens[i.name]=i.childTokens)}),t.extensions=n),e.renderer){const i=g.defaults.renderer||new D;for(const s in e.renderer){const a=i[s];i[s]=(...r)=>{let u=e.renderer[s].apply(i,r);return u===!1&&(u=a.apply(i,r)),u}}t.renderer=i}if(e.tokenizer){const i=g.defaults.tokenizer||new O;for(const s in e.tokenizer){const a=i[s];i[s]=(...r)=>{let u=e.tokenizer[s].apply(i,r);return u===!1&&(u=a.apply(i,r)),u}}t.tokenizer=i}if(e.hooks){const i=g.defaults.hooks||new q;for(const s in e.hooks){const a=i[s];q.passThroughHooks.has(s)?i[s]=r=>{if(g.defaults.async)return Promise.resolve(e.hooks[s].call(i,r)).then(m=>a.call(i,m));const u=e.hooks[s].call(i,r);return a.call(i,u)}:i[s]=(...r)=>{let u=e.hooks[s].apply(i,r);return u===!1&&(u=a.apply(i,r)),u}}t.hooks=i}if(e.walkTokens){const i=g.defaults.walkTokens;t.walkTokens=function(s){let a=[];return a.push(e.walkTokens.call(this,s)),i&&(a=a.concat(i.call(this,s))),a}}g.setOptions(t)})},g.walkTokens=function(l,n){let e=[];for(const t of l)switch(e=e.concat(n.call(g,t)),t.type){case"table":{for(const i of t.header)e=e.concat(g.walkTokens(i.tokens,n));for(const i of t.rows)for(const s of i)e=e.concat(g.walkTokens(s.tokens,n));break}case"list":{e=e.concat(g.walkTokens(t.items,n));break}default:g.defaults.extensions&&g.defaults.extensions.childTokens&&g.defaults.extensions.childTokens[t.type]?g.defaults.extensions.childTokens[t.type].forEach(function(i){e=e.concat(g.walkTokens(t[i],n))}):t.tokens&&(e=e.concat(g.walkTokens(t.tokens,n)))}return e},g.parseInline=Y(R.lexInline,L.parseInline),g.Parser=L,g.parser=L.parse,g.Renderer=D,g.TextRenderer=V,g.Lexer=R,g.lexer=R.lex,g.Tokenizer=O,g.Slugger=F,g.Hooks=q,g.parse=g,g.options,g.setOptions,g.use,g.walkTokens,g.parseInline,L.parse,R.lex,()=>{let l,n=null,e;function t(){if(n&&!n.closed)n.focus();else{if(n=window.open("about:blank","reveal.js - Notes","width=1100,height=700"),n.marked=g,n.document.write(z),!n){alert("Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.");return}s()}}function i(d){n&&!n.closed?n.focus():(n=d,window.addEventListener("message",m),f())}function s(){const d=e.getConfig().url,p=typeof d=="string"?d:window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search;l=setInterval(function(){n.postMessage(JSON.stringify({namespace:"reveal-notes",type:"connect",state:e.getState(),url:p}),"*")},500),window.addEventListener("message",m)}function a(d,p,o){let x=e[d].apply(e,p);n.postMessage(JSON.stringify({namespace:"reveal-notes",type:"return",result:x,callId:o}),"*")}function r(d){let p=e.getCurrentSlide(),o=p.querySelectorAll("aside.notes"),x=p.querySelector(".current-fragment"),b={namespace:"reveal-notes",type:"state",notes:"",markdown:!1,whitespace:"normal",state:e.getState()};if(p.hasAttribute("data-notes")&&(b.notes=p.getAttribute("data-notes"),b.whitespace="pre-wrap"),x){let S=x.querySelector("aside.notes");S?(b.notes=S.innerHTML,b.markdown=typeof S.getAttribute("data-markdown")=="string",o=null):x.hasAttribute("data-notes")&&(b.notes=x.getAttribute("data-notes"),b.whitespace="pre-wrap",o=null)}o&&o.length&&(o=Array.from(o).filter(S=>S.closest(".fragment")===null),b.notes=o.map(S=>S.innerHTML).join(`
`),b.markdown=o[0]&&typeof o[0].getAttribute("data-markdown")=="string"),n.postMessage(JSON.stringify(b),"*")}function u(d){try{return window.location.origin===d.source.location.origin}catch{return!1}}function m(d){if(u(d))try{let p=JSON.parse(d.data);p&&p.namespace==="reveal-notes"&&p.type==="connected"?(clearInterval(l),f()):p&&p.namespace==="reveal-notes"&&p.type==="call"&&a(p.methodName,p.arguments,p.callId)}catch{}}function f(){e.on("slidechanged",r),e.on("fragmentshown",r),e.on("fragmenthidden",r),e.on("overviewhidden",r),e.on("overviewshown",r),e.on("paused",r),e.on("resumed",r),r()}return{id:"notes",init:function(d){e=d,/receiver/i.test(window.location.search)||(window.location.search.match(/(\?|\&)notes/gi)!==null?t():window.addEventListener("message",p=>{if(!n&&typeof p.data=="string"){let o;try{o=JSON.parse(p.data)}catch{}o&&o.namespace==="reveal-notes"&&o.type==="heartbeat"&&i(p.source)}}),e.addKeyBinding({keyCode:83,key:"S",description:"Speaker notes view"},function(){t()}))},open:t}}});
