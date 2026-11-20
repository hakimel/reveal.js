//#region plugin/notes/speaker-view.html?raw
var e = "<!--\n	NOTE: You need to build the notes plugin after making changes to this file.\n-->\n<html lang=\"en\">\n	<head>\n		<meta charset=\"utf-8\">\n\n		<title>reveal.js - Speaker View</title>\n\n		<style>\n			body {\n				font-family: Helvetica;\n				font-size: 18px;\n			}\n\n			#current-slide,\n			#upcoming-slide,\n			#speaker-controls {\n				padding: 6px;\n				box-sizing: border-box;\n				-moz-box-sizing: border-box;\n			}\n\n			#current-slide iframe,\n			#upcoming-slide iframe {\n				width: 100%;\n				height: 100%;\n				border: 1px solid #ddd;\n			}\n\n			#current-slide .label,\n			#upcoming-slide .label {\n				position: absolute;\n				top: 10px;\n				left: 10px;\n				z-index: 2;\n			}\n\n			#connection-status {\n				position: absolute;\n				top: 0;\n				left: 0;\n				width: 100%;\n				height: 100%;\n				z-index: 20;\n				padding: 30% 20% 20% 20%;\n				font-size: 18px;\n				color: #222;\n				background: #fff;\n				text-align: center;\n				box-sizing: border-box;\n				line-height: 1.4;\n			}\n\n			.overlay-element {\n				height: 34px;\n				line-height: 34px;\n				padding: 0 10px;\n				text-shadow: none;\n				background: rgba( 220, 220, 220, 0.8 );\n				color: #222;\n				font-size: 14px;\n			}\n\n			.overlay-element.interactive:hover {\n				background: rgba( 220, 220, 220, 1 );\n			}\n\n			#current-slide {\n				position: absolute;\n				width: 60%;\n				height: 100%;\n				top: 0;\n				left: 0;\n				padding-right: 0;\n			}\n\n			#upcoming-slide {\n				position: absolute;\n				width: 40%;\n				height: 40%;\n				right: 0;\n				top: 0;\n			}\n\n			/* Speaker controls */\n			#speaker-controls {\n				position: absolute;\n				top: 40%;\n				right: 0;\n				width: 40%;\n				height: 60%;\n				overflow: auto;\n				font-size: 18px;\n			}\n\n				.speaker-controls-time.hidden,\n				.speaker-controls-notes.hidden {\n					display: none;\n				}\n\n				.speaker-controls-time .label,\n				.speaker-controls-pace .label,\n				.speaker-controls-notes .label {\n					text-transform: uppercase;\n					font-weight: normal;\n					font-size: 0.66em;\n					color: #666;\n					margin: 0;\n				}\n\n				.speaker-controls-time, .speaker-controls-pace {\n					border-bottom: 1px solid rgba( 200, 200, 200, 0.5 );\n					margin-bottom: 10px;\n					padding: 10px 16px;\n					padding-bottom: 20px;\n					cursor: pointer;\n				}\n\n				.speaker-controls-time .reset-button {\n					opacity: 0;\n					float: right;\n					color: #666;\n					text-decoration: none;\n				}\n				.speaker-controls-time:hover .reset-button {\n					opacity: 1;\n				}\n\n				.speaker-controls-time .timer,\n				.speaker-controls-time .clock {\n					width: 50%;\n				}\n\n				.speaker-controls-time .timer,\n				.speaker-controls-time .clock,\n				.speaker-controls-time .pacing .hours-value,\n				.speaker-controls-time .pacing .minutes-value,\n				.speaker-controls-time .pacing .seconds-value {\n					font-size: 1.9em;\n				}\n\n				.speaker-controls-time .timer {\n					float: left;\n				}\n\n				.speaker-controls-time .clock {\n					float: right;\n					text-align: right;\n				}\n\n				.speaker-controls-time span.mute {\n					opacity: 0.3;\n				}\n\n				.speaker-controls-time .pacing-title {\n					margin-top: 5px;\n				}\n\n				.speaker-controls-time .pacing.ahead {\n					color: blue;\n				}\n\n				.speaker-controls-time .pacing.on-track {\n					color: green;\n				}\n\n				.speaker-controls-time .pacing.behind {\n					color: red;\n				}\n\n				.speaker-controls-notes {\n					padding: 10px 16px;\n				}\n\n				.speaker-controls-notes .value {\n					margin-top: 5px;\n					line-height: 1.4;\n					font-size: 1.2em;\n				}\n\n			/* Layout selector\xA0*/\n			#speaker-layout {\n				position: absolute;\n				top: 10px;\n				right: 10px;\n				color: #222;\n				z-index: 10;\n			}\n				#speaker-layout select {\n					position: absolute;\n					width: 100%;\n					height: 100%;\n					top: 0;\n					left: 0;\n					border: 0;\n					box-shadow: 0;\n					cursor: pointer;\n					opacity: 0;\n\n					font-size: 1em;\n					background-color: transparent;\n\n					-moz-appearance: none;\n					-webkit-appearance: none;\n					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n				}\n\n				#speaker-layout select:focus {\n					outline: none;\n					box-shadow: none;\n				}\n\n			.clear {\n				clear: both;\n			}\n\n			/* Speaker layout: Wide */\n			body[data-speaker-layout=\"wide\"] #current-slide,\n			body[data-speaker-layout=\"wide\"] #upcoming-slide {\n				width: 50%;\n				height: 45%;\n				padding: 6px;\n			}\n\n			body[data-speaker-layout=\"wide\"] #current-slide {\n				top: 0;\n				left: 0;\n			}\n\n			body[data-speaker-layout=\"wide\"] #upcoming-slide {\n				top: 0;\n				left: 50%;\n			}\n\n			body[data-speaker-layout=\"wide\"] #speaker-controls {\n				top: 45%;\n				left: 0;\n				width: 100%;\n				height: 50%;\n				font-size: 1.25em;\n			}\n\n			/* Speaker layout: Tall */\n			body[data-speaker-layout=\"tall\"] #current-slide,\n			body[data-speaker-layout=\"tall\"] #upcoming-slide {\n				width: 45%;\n				height: 50%;\n				padding: 6px;\n			}\n\n			body[data-speaker-layout=\"tall\"] #current-slide {\n				top: 0;\n				left: 0;\n			}\n\n			body[data-speaker-layout=\"tall\"] #upcoming-slide {\n				top: 50%;\n				left: 0;\n			}\n\n			body[data-speaker-layout=\"tall\"] #speaker-controls {\n				padding-top: 40px;\n				top: 0;\n				left: 45%;\n				width: 55%;\n				height: 100%;\n				font-size: 1.25em;\n			}\n\n			/* Speaker layout: Notes only */\n			body[data-speaker-layout=\"notes-only\"] #current-slide,\n			body[data-speaker-layout=\"notes-only\"] #upcoming-slide {\n				display: none;\n			}\n\n			body[data-speaker-layout=\"notes-only\"] #speaker-controls {\n				padding-top: 40px;\n				top: 0;\n				left: 0;\n				width: 100%;\n				height: 100%;\n				font-size: 1.25em;\n			}\n\n			@media screen and (max-width: 1080px) {\n				body[data-speaker-layout=\"default\"] #speaker-controls {\n					font-size: 16px;\n				}\n			}\n\n			@media screen and (max-width: 900px) {\n				body[data-speaker-layout=\"default\"] #speaker-controls {\n					font-size: 14px;\n				}\n			}\n\n			@media screen and (max-width: 800px) {\n				body[data-speaker-layout=\"default\"] #speaker-controls {\n					font-size: 12px;\n				}\n			}\n\n		</style>\n	</head>\n\n	<body>\n\n		<div id=\"connection-status\">Loading speaker view...</div>\n\n		<div id=\"current-slide\"></div>\n		<div id=\"upcoming-slide\"><span class=\"overlay-element label\">Upcoming</span></div>\n		<div id=\"speaker-controls\">\n			<div class=\"speaker-controls-time\">\n				<h4 class=\"label\">Time <span class=\"reset-button\">Click to Reset</span></h4>\n				<div class=\"clock\">\n					<span class=\"clock-value\">0:00 AM</span>\n				</div>\n				<div class=\"timer\">\n					<span class=\"hours-value\">00</span><span class=\"minutes-value\">:00</span><span class=\"seconds-value\">:00</span>\n				</div>\n				<div class=\"clear\"></div>\n\n				<h4 class=\"label pacing-title\" style=\"display: none\">Pacing – Time to finish current slide</h4>\n				<div class=\"pacing\" style=\"display: none\">\n					<span class=\"hours-value\">00</span><span class=\"minutes-value\">:00</span><span class=\"seconds-value\">:00</span>\n				</div>\n			</div>\n\n			<div class=\"speaker-controls-notes hidden\">\n				<h4 class=\"label\">Notes</h4>\n				<div class=\"value\"></div>\n			</div>\n		</div>\n		<div id=\"speaker-layout\" class=\"overlay-element interactive\">\n			<span class=\"speaker-layout-label\"></span>\n			<select class=\"speaker-layout-dropdown\"></select>\n		</div>\n\n		<script>\n\n			(function() {\n\n				var notes,\n					notesValue,\n					currentState,\n					currentSlide,\n					upcomingSlide,\n					layoutLabel,\n					layoutDropdown,\n					pendingCalls = {},\n					lastRevealApiCallId = 0,\n					connected = false\n\n				var connectionStatus = document.querySelector( '#connection-status' );\n\n				var SPEAKER_LAYOUTS = {\n					'default': 'Default',\n					'wide': 'Wide',\n					'tall': 'Tall',\n					'notes-only': 'Notes only'\n				};\n\n				setupLayout();\n\n				let openerOrigin;\n\n				try {\n					openerOrigin = window.opener.location.origin;\n				}\n				catch ( error ) { console.warn( error ) }\n\n				// In order to prevent XSS, the speaker view will only run if its\n				// opener has the same origin as itself\n				if( window.location.origin !== openerOrigin ) {\n					connectionStatus.innerHTML = 'Cross origin error.<br>The speaker window can only be opened from the same origin.';\n					return;\n				}\n\n				var connectionTimeout = setTimeout( function() {\n					connectionStatus.innerHTML = 'Error connecting to main window.<br>Please try closing and reopening the speaker view.';\n				}, 5000 );\n\n				window.addEventListener( 'message', function( event ) {\n\n					// Validate the origin of all messages to avoid parsing messages\n					// that aren't meant for us. Ignore when running off file:// so\n					// that the speaker view continues to work without a web server.\n					if( window.location.origin !== event.origin && window.location.origin !== 'file://' ) {\n						return\n					}\n\n					clearTimeout( connectionTimeout );\n					connectionStatus.style.display = 'none';\n\n					var data = JSON.parse( event.data );\n\n					// The overview mode is only useful to the reveal.js instance\n					// where navigation occurs so we don't sync it\n					if( data.state ) delete data.state.overview;\n\n					// Messages sent by the notes plugin inside of the main window\n					if( data && data.namespace === 'reveal-notes' ) {\n						if( data.type === 'connect' ) {\n							handleConnectMessage( data );\n						}\n						else if( data.type === 'state' ) {\n							handleStateMessage( data );\n						}\n						else if( data.type === 'return' ) {\n							pendingCalls[data.callId](data.result);\n							delete pendingCalls[data.callId];\n						}\n					}\n					// Messages sent by the reveal.js inside of the current slide preview\n					else if( data && data.namespace === 'reveal' ) {\n						const supportedEvents = [\n							'slidechanged',\n							'fragmentshown',\n							'fragmenthidden',\n							'paused',\n							'resumed',\n							'previewiframe',\n							'previewimage',\n							'previewvideo',\n							'closeoverlay'\n						];\n\n						if( /ready/.test( data.eventName ) ) {\n							// Send a message back to notify that the handshake is complete\n							window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'connected'} ), '*' );\n						}\n						else if( supportedEvents.includes( data.eventName ) && currentState !== JSON.stringify( data.state ) ) {\n							dispatchStateToMainWindow( data.state );\n						}\n					}\n\n				} );\n\n				/**\n				 * Updates the presentation in the main window to match the state\n				 * of the presentation in the notes window.\n				 */\n				const dispatchStateToMainWindow = debounce(( state ) => {\n					window.opener.postMessage( JSON.stringify({ method: 'setState', args: [ state ]} ), '*' );\n				}, 500);\n\n				/**\n				 * Asynchronously calls the Reveal.js API of the main frame.\n				 */\n				function callRevealApi( methodName, methodArguments, callback ) {\n\n					var callId = ++lastRevealApiCallId;\n					pendingCalls[callId] = callback;\n					window.opener.postMessage( JSON.stringify( {\n						namespace: 'reveal-notes',\n						type: 'call',\n						callId: callId,\n						methodName: methodName,\n						arguments: methodArguments\n					} ), '*' );\n\n				}\n\n				/**\n				 * Called when the main window is trying to establish a\n				 * connection.\n				 */\n				function handleConnectMessage( data ) {\n\n					if( connected === false ) {\n						connected = true;\n\n						setupIframes( data );\n						setupKeyboard();\n						setupNotes();\n						setupTimer();\n						setupHeartbeat();\n					}\n\n				}\n\n				/**\n				 * Called when the main window sends an updated state.\n				 */\n				function handleStateMessage( data ) {\n\n					// Store the most recently set state to avoid circular loops\n					// applying the same state\n					currentState = JSON.stringify( data.state );\n\n					// No need for updating the notes in case of fragment changes\n					if ( data.notes ) {\n						notes.classList.remove( 'hidden' );\n						notesValue.style.whiteSpace = data.whitespace;\n						if( data.markdown ) {\n							notesValue.innerHTML = marked.parse( data.notes );\n						}\n						else {\n							notesValue.innerHTML = data.notes;\n						}\n					}\n					else {\n						notes.classList.add( 'hidden' );\n					}\n\n					// Don't show lightboxes in the upcoming slide\n					const { previewVideo, previewImage, previewIframe, ...upcomingState } = data.state;\n\n					// Update the note slides\n					currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );\n					upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ upcomingState ] }), '*' );\n					upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'next' }), '*' );\n\n				}\n\n				// Limit to max one state update per X ms\n				handleStateMessage = debounce( handleStateMessage, 200 );\n\n				/**\n				 * Forward keyboard events to the current slide window.\n				 * This enables keyboard events to work even if focus\n				 * isn't set on the current slide iframe.\n				 *\n				 * Block F5 default handling, it reloads and disconnects\n				 * the speaker notes window.\n				 */\n				function setupKeyboard() {\n\n					document.addEventListener( 'keydown', function( event ) {\n						if( event.keyCode === 116 || ( event.metaKey && event.keyCode === 82 ) ) {\n							event.preventDefault();\n							return false;\n						}\n						currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'triggerKey', args: [ event.keyCode ] }), '*' );\n					} );\n\n				}\n\n				/**\n				 * Creates the preview iframes.\n				 */\n				function setupIframes( data ) {\n\n					var params = [\n						'receiver',\n						'progress=false',\n						'history=false',\n						'transition=none',\n						'autoSlide=0',\n						'backgroundTransition=none'\n					].join( '&' );\n\n					var urlSeparator = /\\?/.test(data.url) ? '&' : '?';\n					var hash = '#/' + data.state.indexh + '/' + data.state.indexv;\n					var currentURL = data.url + urlSeparator + params + '&scrollActivationWidth=false&postMessageEvents=true' + hash;\n					var upcomingURL = data.url + urlSeparator + params + '&scrollActivationWidth=false&controls=false' + hash;\n\n					currentSlide = document.createElement( 'iframe' );\n					currentSlide.setAttribute( 'width', 1280 );\n					currentSlide.setAttribute( 'height', 1024 );\n					currentSlide.setAttribute( 'src', currentURL );\n					document.querySelector( '#current-slide' ).appendChild( currentSlide );\n\n					upcomingSlide = document.createElement( 'iframe' );\n					upcomingSlide.setAttribute( 'width', 640 );\n					upcomingSlide.setAttribute( 'height', 512 );\n					upcomingSlide.setAttribute( 'src', upcomingURL );\n					document.querySelector( '#upcoming-slide' ).appendChild( upcomingSlide );\n\n				}\n\n				/**\n				 * Setup the notes UI.\n				 */\n				function setupNotes() {\n\n					notes = document.querySelector( '.speaker-controls-notes' );\n					notesValue = document.querySelector( '.speaker-controls-notes .value' );\n\n				}\n\n				/**\n				 * We send out a heartbeat at all times to ensure we can\n				 * reconnect with the main presentation window after reloads.\n				 */\n				function setupHeartbeat() {\n\n					setInterval( () => {\n						window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'heartbeat'} ), '*' );\n					}, 1000 );\n\n				}\n\n				function getTimings( callback ) {\n\n					callRevealApi( 'getSlidesAttributes', [], function ( slideAttributes ) {\n						callRevealApi( 'getConfig', [], function ( config ) {\n							var totalTime = config.totalTime;\n							var minTimePerSlide = config.minimumTimePerSlide || 0;\n							var defaultTiming = config.defaultTiming;\n							if ((defaultTiming == null) && (totalTime == null)) {\n								callback(null);\n								return;\n							}\n							// Setting totalTime overrides defaultTiming\n							if (totalTime) {\n								defaultTiming = 0;\n							}\n							var timings = [];\n							for ( var i in slideAttributes ) {\n								var slide = slideAttributes[ i ];\n								var timing = defaultTiming;\n								if( slide.hasOwnProperty( 'data-timing' )) {\n									var t = slide[ 'data-timing' ];\n									timing = parseInt(t);\n									if( isNaN(timing) ) {\n										console.warn(\"Could not parse timing '\" + t + \"' of slide \" + i + \"; using default of \" + defaultTiming);\n										timing = defaultTiming;\n									}\n								}\n								timings.push(timing);\n							}\n							if ( totalTime ) {\n								// After we've allocated time to individual slides, we summarize it and\n								// subtract it from the total time\n								var remainingTime = totalTime - timings.reduce( function(a, b) { return a + b; }, 0 );\n								// The remaining time is divided by the number of slides that have 0 seconds\n								// allocated at the moment, giving the average time-per-slide on the remaining slides\n								var remainingSlides = (timings.filter( function(x) { return x == 0 }) ).length\n								var timePerSlide = Math.round( remainingTime / remainingSlides, 0 )\n								// And now we replace every zero-value timing with that average\n								timings = timings.map( function(x) { return (x==0 ? timePerSlide : x) } );\n							}\n							var slidesUnderMinimum = timings.filter( function(x) { return (x < minTimePerSlide) } ).length\n							if ( slidesUnderMinimum ) {\n								message = \"The pacing time for \" + slidesUnderMinimum + \" slide(s) is under the configured minimum of \" + minTimePerSlide + \" seconds. Check the data-timing attribute on individual slides, or consider increasing the totalTime or minimumTimePerSlide configuration options (or removing some slides).\";\n								alert(message);\n							}\n							callback( timings );\n						} );\n					} );\n\n				}\n\n				/**\n				 * Return the number of seconds allocated for presenting\n				 * all slides up to and including this one.\n				 */\n				function getTimeAllocated( timings, callback ) {\n\n					callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {\n						var allocated = 0;\n						for (var i in timings.slice(0, currentSlide + 1)) {\n							allocated += timings[i];\n						}\n						callback( allocated );\n					} );\n\n				}\n\n				/**\n				 * Create the timer and clock and start updating them\n				 * at an interval.\n				 */\n				function setupTimer() {\n\n					var start = new Date(),\n					timeEl = document.querySelector( '.speaker-controls-time' ),\n					clockEl = timeEl.querySelector( '.clock-value' ),\n					hoursEl = timeEl.querySelector( '.hours-value' ),\n					minutesEl = timeEl.querySelector( '.minutes-value' ),\n					secondsEl = timeEl.querySelector( '.seconds-value' ),\n					pacingTitleEl = timeEl.querySelector( '.pacing-title' ),\n					pacingEl = timeEl.querySelector( '.pacing' ),\n					pacingHoursEl = pacingEl.querySelector( '.hours-value' ),\n					pacingMinutesEl = pacingEl.querySelector( '.minutes-value' ),\n					pacingSecondsEl = pacingEl.querySelector( '.seconds-value' );\n\n					var timings = null;\n					getTimings( function ( _timings ) {\n\n						timings = _timings;\n						if (_timings !== null) {\n							pacingTitleEl.style.removeProperty('display');\n							pacingEl.style.removeProperty('display');\n						}\n\n						// Update once directly\n						_updateTimer();\n\n						// Then update every second\n						setInterval( _updateTimer, 1000 );\n\n					} );\n\n\n					function _resetTimer() {\n\n						if (timings == null) {\n							start = new Date();\n							_updateTimer();\n						}\n						else {\n							// Reset timer to beginning of current slide\n							getTimeAllocated( timings, function ( slideEndTimingSeconds ) {\n								var slideEndTiming = slideEndTimingSeconds * 1000;\n								callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {\n									var currentSlideTiming = timings[currentSlide] * 1000;\n									var previousSlidesTiming = slideEndTiming - currentSlideTiming;\n									var now = new Date();\n									start = new Date(now.getTime() - previousSlidesTiming);\n									_updateTimer();\n								} );\n							} );\n						}\n\n					}\n\n					timeEl.addEventListener( 'click', function() {\n						_resetTimer();\n						return false;\n					} );\n\n					function _displayTime( hrEl, minEl, secEl, time) {\n\n						var sign = Math.sign(time) == -1 ? \"-\" : \"\";\n						time = Math.abs(Math.round(time / 1000));\n						var seconds = time % 60;\n						var minutes = Math.floor( time / 60 ) % 60 ;\n						var hours = Math.floor( time / ( 60 * 60 )) ;\n						hrEl.innerHTML = sign + zeroPadInteger( hours );\n						if (hours == 0) {\n							hrEl.classList.add( 'mute' );\n						}\n						else {\n							hrEl.classList.remove( 'mute' );\n						}\n						minEl.innerHTML = ':' + zeroPadInteger( minutes );\n						if (hours == 0 && minutes == 0) {\n							minEl.classList.add( 'mute' );\n						}\n						else {\n							minEl.classList.remove( 'mute' );\n						}\n						secEl.innerHTML = ':' + zeroPadInteger( seconds );\n					}\n\n					function _updateTimer() {\n\n						var diff, hours, minutes, seconds,\n						now = new Date();\n\n						diff = now.getTime() - start.getTime();\n\n						clockEl.innerHTML = now.toLocaleTimeString( 'en-US', { hour12: true, hour: '2-digit', minute:'2-digit' } );\n						_displayTime( hoursEl, minutesEl, secondsEl, diff );\n						if (timings !== null) {\n							_updatePacing(diff);\n						}\n\n					}\n\n					function _updatePacing(diff) {\n\n						getTimeAllocated( timings, function ( slideEndTimingSeconds ) {\n							var slideEndTiming = slideEndTimingSeconds * 1000;\n\n							callRevealApi( 'getSlidePastCount', [], function ( currentSlide ) {\n								var currentSlideTiming = timings[currentSlide] * 1000;\n								var timeLeftCurrentSlide = slideEndTiming - diff;\n								if (timeLeftCurrentSlide < 0) {\n									pacingEl.className = 'pacing behind';\n								}\n								else if (timeLeftCurrentSlide < currentSlideTiming) {\n									pacingEl.className = 'pacing on-track';\n								}\n								else {\n									pacingEl.className = 'pacing ahead';\n								}\n								_displayTime( pacingHoursEl, pacingMinutesEl, pacingSecondsEl, timeLeftCurrentSlide );\n							} );\n						} );\n					}\n\n				}\n\n				/**\n				 * Sets up the speaker view layout and layout selector.\n				 */\n				function setupLayout() {\n\n					layoutDropdown = document.querySelector( '.speaker-layout-dropdown' );\n					layoutLabel = document.querySelector( '.speaker-layout-label' );\n\n					// Render the list of available layouts\n					for( var id in SPEAKER_LAYOUTS ) {\n						var option = document.createElement( 'option' );\n						option.setAttribute( 'value', id );\n						option.textContent = SPEAKER_LAYOUTS[ id ];\n						layoutDropdown.appendChild( option );\n					}\n\n					// Monitor the dropdown for changes\n					layoutDropdown.addEventListener( 'change', function( event ) {\n\n						setLayout( layoutDropdown.value );\n\n					}, false );\n\n					// Restore any currently persisted layout\n					setLayout( getLayout() );\n\n				}\n\n				/**\n				 * Sets a new speaker view layout. The layout is persisted\n				 * in local storage.\n				 */\n				function setLayout( value ) {\n\n					var title = SPEAKER_LAYOUTS[ value ];\n\n					layoutLabel.innerHTML = 'Layout' + ( title ? ( ': ' + title ) : '' );\n					layoutDropdown.value = value;\n\n					document.body.setAttribute( 'data-speaker-layout', value );\n\n					// Persist locally\n					if( supportsLocalStorage() ) {\n						window.localStorage.setItem( 'reveal-speaker-layout', value );\n					}\n\n				}\n\n				/**\n				 * Returns the ID of the most recently set speaker layout\n				 * or our default layout if none has been set.\n				 */\n				function getLayout() {\n\n					if( supportsLocalStorage() ) {\n						var layout = window.localStorage.getItem( 'reveal-speaker-layout' );\n						if( layout ) {\n							return layout;\n						}\n					}\n\n					// Default to the first record in the layouts hash\n					for( var id in SPEAKER_LAYOUTS ) {\n						return id;\n					}\n\n				}\n\n				function supportsLocalStorage() {\n\n					try {\n						localStorage.setItem('test', 'test');\n						localStorage.removeItem('test');\n						return true;\n					}\n					catch( e ) {\n						return false;\n					}\n\n				}\n\n				function zeroPadInteger( num ) {\n\n					var str = '00' + parseInt( num );\n					return str.substring( str.length - 2 );\n\n				}\n\n				/**\n				 * Limits the frequency at which a function can be called.\n				 */\n				function debounce( fn, ms ) {\n\n					var lastTime = 0,\n						timeout;\n\n					return function() {\n\n						var args = arguments;\n						var context = this;\n\n						clearTimeout( timeout );\n\n						var timeSinceLastCall = Date.now() - lastTime;\n						if( timeSinceLastCall > ms ) {\n							fn.apply( context, args );\n							lastTime = Date.now();\n						}\n						else {\n							timeout = setTimeout( function() {\n								fn.apply( context, args );\n								lastTime = Date.now();\n							}, ms - timeSinceLastCall );\n						}\n\n					}\n\n				}\n\n			})();\n\n		<\/script>\n	</body>\n</html>";
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function t() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var n = t();
function r(e) {
	n = e;
}
var i = { exec: () => null };
function a(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(s.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var o = (() => {
	try {
		return !0;
	} catch {
		return !1;
	}
})(), s = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
	htmlBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"),
	blockquoteBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}>`)
}, c = /^(?:[ \t]*(?:\n|$))+/, l = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, u = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, d = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, f = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, p = / {0,3}(?:[*+-]|\d{1,9}[.)])/, m = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, h = a(m).replace(/bull/g, p).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ee = a(m).replace(/bull/g, p).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), g = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, te = /^[^\n]+/, _ = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, ne = a(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), re = a(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, p).getRegex(), v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", y = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ie = a("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", y).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), b = a(g).replace("hr", d).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), x = {
	blockquote: a(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", b).getRegex(),
	code: l,
	def: ne,
	fences: u,
	heading: f,
	hr: d,
	html: ie,
	lheading: h,
	list: re,
	newline: c,
	paragraph: b,
	table: i,
	text: te
}, S = a("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", d).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), ae = {
	...x,
	lheading: ee,
	table: S,
	paragraph: a(g).replace("hr", d).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", S).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex()
}, oe = {
	...x,
	html: a("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", y).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: i,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: a(g).replace("hr", d).replace("heading", " *#{1,6} *[^\n]").replace("lheading", h).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, se = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ce = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, C = /^( {2,}|\\)\n(?!\s*$)/, w = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, T = /[\p{P}\p{S}]/u, E = /[\s\p{P}\p{S}]/u, D = /[^\s\p{P}\p{S}]/u, le = a(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, E).getRegex(), O = /(?!~)[\p{P}\p{S}]/u, ue = /(?!~)[\s\p{P}\p{S}]/u, de = /(?:[^\s\p{P}\p{S}]|~)/u, fe = a(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", o ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), k = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, pe = a(k, "u").replace(/punct/g, T).getRegex(), me = a(k, "u").replace(/punct/g, O).getRegex(), A = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", he = a(A, "gu").replace(/notPunctSpace/g, D).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), ge = a(A, "gu").replace(/notPunctSpace/g, de).replace(/punctSpace/g, ue).replace(/punct/g, O).getRegex(), _e = a("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, D).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), ve = a(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, T).getRegex(), ye = a("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, D).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), be = a(/\\(punct)/, "gu").replace(/punct/g, T).getRegex(), xe = a(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Se = a(y).replace("(?:-->|$)", "-->").getRegex(), j = a("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Se).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), M = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, Ce = a(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", M).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), N = a(/^!?\[(label)\]\[(ref)\]/).replace("label", M).replace("ref", _).getRegex(), P = a(/^!?\[(ref)\](?:\[\])?/).replace("ref", _).getRegex(), we = a("reflink|nolink(?!\\()", "g").replace("reflink", N).replace("nolink", P).getRegex(), F = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, I = {
	_backpedal: i,
	anyPunctuation: be,
	autolink: xe,
	blockSkip: fe,
	br: C,
	code: ce,
	del: i,
	delLDelim: i,
	delRDelim: i,
	emStrongLDelim: pe,
	emStrongRDelimAst: he,
	emStrongRDelimUnd: _e,
	escape: se,
	link: Ce,
	nolink: P,
	punctuation: le,
	reflink: N,
	reflinkSearch: we,
	tag: j,
	text: w,
	url: i
}, Te = {
	...I,
	link: a(/^!?\[(label)\]\((.*?)\)/).replace("label", M).getRegex(),
	reflink: a(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", M).getRegex()
}, L = {
	...I,
	emStrongRDelimAst: ge,
	emStrongLDelim: me,
	delLDelim: ve,
	delRDelim: ye,
	url: a(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", F).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: a(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", F).getRegex()
}, Ee = {
	...L,
	br: a(C).replace("{2,}", "*").getRegex(),
	text: a(L.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, R = {
	normal: x,
	gfm: ae,
	pedantic: oe
}, z = {
	normal: I,
	gfm: L,
	breaks: Ee,
	pedantic: Te
}, De = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, B = (e) => De[e];
function V(e, t) {
	if (t) {
		if (s.escapeTest.test(e)) return e.replace(s.escapeReplace, B);
	} else if (s.escapeTestNoEncode.test(e)) return e.replace(s.escapeReplaceNoEncode, B);
	return e;
}
function H(e) {
	try {
		e = encodeURI(e).replace(s.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function U(e, t) {
	let n = e.replace(s.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(s.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(s.slashPipe, "|");
	return n;
}
function W(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function Oe(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function ke(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function G(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1");
	r.state.inLink = !0;
	let c = {
		type: e[0].charAt(0) === "!" ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: r.inlineTokens(s)
	};
	return r.state.inLink = !1, c;
}
function Ae(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return r.length >= i.length ? e.slice(i.length) : e;
	}).join("\n");
}
var K = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || n;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = t[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: t[0],
				codeBlockStyle: "indented",
				text: this.options.pedantic ? e : W(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = Ae(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = W(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: t[0],
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: W(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = W(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o;
				for (o = 0; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.blockquote(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - t.raw.length) + o.raw, r = r.substring(0, r.length - t.text.length) + o.text;
					break;
				} else if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = ke(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
				if (this.options.pedantic ? (d = 2, s = c.trimStart()) : u ? d = t[1].length + 1 : (d = c.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, s = c.slice(d), d += t[1].length), u && this.rules.other.blankLine.test(l) && (r += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(d), n = this.rules.other.hrRegex(d), i = this.rules.other.fencesBeginRegex(d), a = this.rules.other.headingBeginRegex(d), o = this.rules.other.htmlBeginRegex(d), f = this.rules.other.blockquoteBeginRegex(d);
					for (; e;) {
						let p = e.split("\n", 1)[0], m;
						if (l = p, this.options.pedantic ? (l = l.replace(this.rules.other.listReplaceNesting, "  "), m = l) : m = l.replace(this.rules.other.tabCharGlobal, "    "), i.test(l) || a.test(l) || o.test(l) || f.test(l) || t.test(l) || n.test(l)) break;
						if (m.search(this.rules.other.nonSpaceChar) >= d || !l.trim()) s += "\n" + m.slice(d);
						else {
							if (u || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(c) || a.test(c) || n.test(c)) break;
							s += "\n" + l;
						}
						u = !l.trim(), r += p + "\n", e = e.substring(p.length + 1), c = m.slice(d);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) {
				if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), e.task) {
					if (e.text = e.text.replace(this.rules.other.listReplaceTask, ""), e.tokens[0]?.type === "text" || e.tokens[0]?.type === "paragraph") {
						e.tokens[0].raw = e.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), e.tokens[0].text = e.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
						for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
							this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
							break;
						}
					}
					let t = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (t) {
						let n = {
							type: "checkbox",
							raw: t[0] + " ",
							checked: t[0] !== "[ ]"
						};
						e.checked = n.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = n.raw + e.tokens[0].raw, e.tokens[0].text = n.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(n)) : e.tokens.unshift({
							type: "paragraph",
							raw: n.raw,
							text: n.raw,
							tokens: [n]
						}) : e.tokens.unshift(n);
					}
				}
				if (!i.loose) {
					let t = e.tokens.filter((e) => e.type === "space");
					i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
				}
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) return {
			type: "html",
			block: !0,
			raw: t[0],
			pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
			text: t[0]
		};
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: t[0],
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = U(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: t[0],
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(U(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: t[0],
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
				if (!this.rules.other.endAngleBracket.test(e)) return;
				let t = W(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = Oe(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), G(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return G(n, e, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
				if (a = [...i].length, r[3] || r[4]) {
					o += a;
					continue;
				} else if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
					s += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o + s);
				let t = [...r[0]][0].length, c = e.slice(0, n + r.index + t + a);
				if (Math.min(n, a) % 2) {
					let e = c.slice(1, -1);
					return {
						type: "em",
						raw: c,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = c.slice(2, -2);
				return {
					type: "strong",
					raw: c,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: e
			};
		}
	}
}, q = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || n, this.options.tokenizer = this.options.tokenizer || new K(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: s,
			block: R.normal,
			inline: z.normal
		};
		this.options.pedantic ? (t.block = R.pedantic, t.inline = z.pedantic) : this.options.gfm && (t.block = R.gfm, this.options.breaks ? t.inline = z.breaks : t.inline = z.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: R,
			inline: z
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(s.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(s.tabCharGlobal, "    ").replace(s.spaceLine, "")); e;) {
			let r;
			if (this.options.extensions?.block?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				}, t.push(r));
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startBlock) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(i))) {
				let a = t.at(-1);
				n && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith("\n") ? "" : "\n") + r.raw, a.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e, r = null;
		if (this.tokens.links) {
			let e = Object.keys(this.tokens.links);
			if (e.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null;) e.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
		}
		for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null;) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		let i;
		for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null;) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let a = !1, o = "";
		for (; e;) {
			a || (o = ""), a = !1;
			let r;
			if (this.options.extensions?.inline?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.escape(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.tag(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.link(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.type === "text" && n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.emStrong(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.codespan(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.br(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.del(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.autolink(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (!this.state.inLink && (r = this.tokenizer.url(e))) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startInline) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (r = this.tokenizer.inlineText(i)) {
				e = e.substring(r.raw.length), r.raw.slice(-1) !== "_" && (o = r.raw.slice(-1)), a = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return t;
	}
}, J = class {
	options;
	parser;
	constructor(e) {
		this.options = e || n;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(s.notSpaceStart)?.[0], i = e.replace(s.endingNewline, "") + "\n";
		return r ? "<pre><code class=\"language-" + V(r) + "\">" + (n ? i : V(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : V(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${V(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = H(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + V(t) + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = H(e);
		if (i === null) return V(n);
		e = i;
		let a = `<img src="${e}" alt="${V(n)}"`;
		return t && (a += ` title="${V(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : V(e.text);
	}
}, Y = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, X = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || n, this.options.renderer = this.options.renderer || new J(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Y();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, Z = class {
	options;
	block;
	constructor(e) {
		this.options = e || n;
	}
	static passThroughHooks = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer() {
		return this.block ? q.lex : q.lexInline;
	}
	provideParser() {
		return this.block ? X.parse : X.parseInline;
	}
}, Q = new class {
	defaults = t();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = X;
	Renderer = J;
	TextRenderer = Y;
	Lexer = q;
	Tokenizer = K;
	Hooks = Z;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(Infinity);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new J(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new K(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new Z();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					Z.passThroughHooks.has(n) ? t[r] = (e) => {
						if (this.defaults.async && Z.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : t[r] = (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return q.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return X.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer() : e ? q.lex : q.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser() : e ? X.parse : X.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer() : e ? q.lex : q.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser() : e ? X.parse : X.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + V(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function $(e, t) {
	return Q.parse(e, t);
}
$.options = $.setOptions = function(e) {
	return Q.setOptions(e), $.defaults = Q.defaults, r($.defaults), $;
}, $.getDefaults = t, $.defaults = n, $.use = function(...e) {
	return Q.use(...e), $.defaults = Q.defaults, r($.defaults), $;
}, $.walkTokens = function(e, t) {
	return Q.walkTokens(e, t);
}, $.parseInline = Q.parseInline, $.Parser = X, $.parser = X.parse, $.Renderer = J, $.TextRenderer = Y, $.Lexer = q, $.lexer = q.lex, $.Tokenizer = K, $.Hooks = Z, $.parse = $, $.options, $.setOptions, $.use, $.walkTokens, $.parseInline, X.parse, q.lex;
//#endregion
//#region plugin/notes/index.ts
var je = () => {
	let t, n = null, r;
	function i() {
		if (n && !n.closed) n.focus();
		else {
			if (n = window.open("about:blank", "reveal.js - Notes", "width=1100,height=700"), n.marked = $, n.document.write(e), !n) {
				alert("Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.");
				return;
			}
			o();
		}
	}
	function a(e) {
		n && !n.closed ? n.focus() : (n = e, window.addEventListener("message", u), d());
	}
	function o() {
		let e = r.getConfig().url, i = typeof e == "string" ? e : window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
		t = setInterval(function() {
			n.postMessage(JSON.stringify({
				namespace: "reveal-notes",
				type: "connect",
				state: r.getState(),
				url: i
			}), "*");
		}, 500), window.addEventListener("message", u);
	}
	function s(e, t, i) {
		let a = r[e].apply(r, t);
		n.postMessage(JSON.stringify({
			namespace: "reveal-notes",
			type: "return",
			result: a,
			callId: i
		}), "*");
	}
	function c(e) {
		let t = r.getCurrentSlide(), i = t.querySelectorAll("aside.notes"), a = t.querySelector(".current-fragment"), o = {
			namespace: "reveal-notes",
			type: "state",
			notes: "",
			markdown: !1,
			whitespace: "normal",
			state: r.getState()
		};
		if (t.hasAttribute("data-notes") && (o.notes = t.getAttribute("data-notes"), o.whitespace = "pre-wrap"), a) {
			let e = a.querySelector("aside.notes");
			e ? (o.notes = e.innerHTML, o.markdown = typeof e.getAttribute("data-markdown") == "string", i = null) : a.hasAttribute("data-notes") && (o.notes = a.getAttribute("data-notes"), o.whitespace = "pre-wrap", i = null);
		}
		i && i.length && (i = Array.from(i).filter((e) => e.closest(".fragment") === null), o.notes = i.map((e) => e.innerHTML).join("\n"), o.markdown = i[0] && typeof i[0].getAttribute("data-markdown") == "string"), n.postMessage(JSON.stringify(o), "*");
	}
	function l(e) {
		try {
			return window.location.origin === e.source.location.origin;
		} catch {
			return !1;
		}
	}
	function u(e) {
		if (l(e)) try {
			let n = JSON.parse(e.data);
			n && n.namespace === "reveal-notes" && n.type === "connected" ? (clearInterval(t), d()) : n && n.namespace === "reveal-notes" && n.type === "call" && s(n.methodName, n.arguments, n.callId);
		} catch {}
	}
	function d() {
		r.on("slidechanged", c), r.on("fragmentshown", c), r.on("fragmenthidden", c), r.on("overviewhidden", c), r.on("overviewshown", c), r.on("paused", c), r.on("resumed", c), r.on("previewiframe", c), r.on("previewimage", c), r.on("previewvideo", c), r.on("closeoverlay", c), c();
	}
	return {
		id: "notes",
		init: function(e) {
			r = e, /receiver/i.test(window.location.search) || (window.location.search.match(/(\?|\&)notes/gi) === null ? window.addEventListener("message", (e) => {
				if (!n && typeof e.data == "string") {
					let t;
					try {
						t = JSON.parse(e.data);
					} catch {}
					t && t.namespace === "reveal-notes" && t.type === "heartbeat" && a(e.source);
				}
			}) : i(), r.addKeyBinding({
				keyCode: 83,
				key: "S",
				description: "Speaker notes view"
			}, function() {
				i();
			}));
		},
		open: i
	};
};
//#endregion
export { je as default };
