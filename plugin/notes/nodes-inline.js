(function() {

  var notes,
    notesValue,
    currentState,
    currentSlide,
    upcomingSlide,
    layoutLabel,
    layoutDropdown,
    connected = false;

  var SPEAKER_LAYOUTS = {
    'default': 'Default',
    'wide': 'Wide',
    'tall': 'Tall',
    'notes-only': 'Notes only'
  };

  setupLayout();

  var connectionStatus = document.querySelector( '#connection-status' );
  var connectionTimeout = setTimeout( function() {
    connectionStatus.innerHTML = 'Error connecting to main window.<br>Please try closing and reopening the speaker view.';
  }, 5000 );

  window.addEventListener( 'message', function( event ) {

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
    }
    // Messages sent by the reveal.js inside of the current slide preview
    else if( data && data.namespace === 'reveal' ) {
      if( /ready/.test( data.eventName ) ) {
        // Send a message back to notify that the handshake is complete
        window.opener.postMessage( JSON.stringify({ namespace: 'reveal-notes', type: 'connected'} ), '*' );
      }
      else if( /slidechanged|fragmentshown|fragmenthidden|paused|resumed/.test( data.eventName ) && currentState !== JSON.stringify( data.state ) ) {

        window.opener.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ]} ), '*' );

      }
    }

  } );

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

    var urlSeparator = /\?/.test(data.url) ? '&' : '?';
    var hash = '#/' + data.state.indexh + '/' + data.state.indexv;
    var currentURL = data.url + urlSeparator + params + '&postMessageEvents=true' + hash;
    var upcomingURL = data.url + urlSeparator + params + '&controls=false' + hash;

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

  function getTimings() {

    var slides = Reveal.getSlides();
    var defaultTiming = Reveal.getConfig().defaultTiming;
    if (defaultTiming == null) {
      return null;
    }
    var timings = [];
    for ( var i in slides ) {
      var slide = slides[i];
      var timing = defaultTiming;
      if( slide.hasAttribute( 'data-timing' )) {
        var t = slide.getAttribute( 'data-timing' );
        timing = parseInt(t);
        if( isNaN(timing) ) {
          console.warn("Could not parse timing '" + t + "' of slide " + i + "; using default of " + defaultTiming);
          timing = defaultTiming;
        }
      }
      timings.push(timing);
    }
    return timings;

  }

  /**
   * Return the number of seconds allocated for presenting
   * all slides up to and including this one.
   */
  function getTimeAllocated(timings) {

    var slides = Reveal.getSlides();
    var allocated = 0;
    var currentSlide = Reveal.getSlidePastCount();
    for (var i in slides.slice(0, currentSlide + 1)) {
      allocated += timings[i];
    }
    return allocated;

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

    var timings = getTimings();
    if (timings !== null) {
      pacingTitleEl.style.removeProperty('display');
      pacingEl.style.removeProperty('display');
    }

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

      var slideEndTiming = getTimeAllocated(timings) * 1000;
      var currentSlide = Reveal.getSlidePastCount();
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

    }

    // Update once directly
    _updateTimer();

    // Then update every second
    setInterval( _updateTimer, 1000 );

    function _resetTimer() {

      if (timings == null) {
        start = new Date();
      }
      else {
        // Reset timer to beginning of current slide
        var slideEndTiming = getTimeAllocated(timings) * 1000;
        var currentSlide = Reveal.getSlidePastCount();
        var currentSlideTiming = timings[currentSlide] * 1000;
        var previousSlidesTiming = slideEndTiming - currentSlideTiming;
        var now = new Date();
        start = new Date(now.getTime() - previousSlidesTiming);
      }
      _updateTimer();

    }

    timeEl.addEventListener( 'click', function() {
      _resetTimer();
      return false;
    } );

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
