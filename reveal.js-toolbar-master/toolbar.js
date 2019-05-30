/*
 * Reveal.js toolbar plugin
 * MIT licensed
 * (c) Greg Denehy 2017
 */

/* TODO: 
 * 		- Fix issue with toolbar access after using overview button
 *		- Reimplement auto slide button to allow restyling ?
 * 		- Notes ?
 * 		- PDF export ?
 *		- custom buttons
 *		- tooltips
 */

var RevealToolbar = window.RevealToolbar || (function(){
	var config = Reveal.getConfig();
	var options = config.toolbar || {};
	options.path = options.path || scriptPath() || 'plugin/toolbar/';
	if (!options.path.endsWith('/')) {
		options.path += '/';
	}
	var loadIcons = options.loadIcons;
	if (typeof loadIcons === "undefined") loadIcons = true;
	
	// Cached references to DOM elements
	var dom = {};

	loadResource(options.path + '/toolbar.css', 'stylesheet', 'toolbar-defaults', function() {
		loadResource(options.path + '/lib/screenfull/screenfull.min.js', 'script', null, function() {
			if (loadIcons) {
				loadResource(options.path + '/font-awesome-5.0.2/css/fontawesome-all.min.css', 'stylesheet', '', loadPlugin);
			} else {
				loadPlugin();
			}
		})
	});
	
	function loadPlugin() {
		// does not support IE8 or below
		if (!head.browser.ie || head.browser.version >= 9) {
			function option(opt, def) {
				if (typeof opt === "undefined") return def;
				return opt;
			}

			//
			// Set option defaults
			//
			var position = option(options.position, 'bottom');	// 'top' or 'bottom'
			var showFullscreen = option(options.fullscreen, false);
			var showOverview = option(options.overview, false);
			var showPause = option(options.pause, false);
			var showNotes = option(options.notes, false);
			var showHelp = option(options.help, false);
			var captureMenu = option(options.captureMenu, true);
			var capturePlaybackControl = option(options.capturePlaybackControl, true);

			// Cache references to key DOM elements
			dom.reveal = document.querySelector( '.reveal' );
			dom.toolbar = document.querySelector( '.reveal-toolbar' );

			if (!dom.toolbar) {
				dom.toolbar = createNode( dom.reveal, 'div', 'reveal-toolbar', null );
			} else {
				// move the existing toolbar after the other Reveal components
				dom.reveal.appendChild(dom.toolbar);
			}

			dom.toolbar.classList.add( (position == 'top' ? 'reveal-toolbar-top' : 'reveal-toolbar-bottom') );
			
			function createToolbarButton(icon, cb) {
				var button = createNode(dom.toolbar, 'a', 'reveal-toolbar-button', null);
				button.setAttribute('href', '#');
				button.onclick = function(event) {
					event.preventDefault();
					cb(event);
				}
				createNode(button, 'i', ['fa', icon]);
				return button;
			}

			if (showOverview) {
				dom.overviewButton = createToolbarButton('fa-th-large', Reveal.toggleOverview);
			}
			
			if (showHelp) {
				dom.helpButton = createToolbarButton('fa-question', Reveal.toggleHelp);
			}			

			if (showNotes && !Reveal.isSpeakerNotes()) {
				createToolbarButton('fa-list-alt', function() { if (RevealNotes) { RevealNotes.open() } });
				// createToolbarButton('fa-list-alt', function() { Reveal.triggerKey(83) });
			}

			if (showFullscreen) {
				dom.fullscreenButton = createToolbarButton('fa-expand', function() { 
					if (screenfull.enabled) {
						screenfull.toggle(document.documentElement);
					}
				});
			}

			// set fullscreen button icon to match fullscreen state
			if (screenfull.enabled) {
				screenfull.on('change', function() {
					var icon = dom.fullscreenButton.querySelector('i');
					icon.classList.remove(screenfull.isFullscreen ? 'fa-expand' : 'fa-compress');
					icon.classList.add(screenfull.isFullscreen ? 'fa-compress' : 'fa-expand');
				});
			}

			if (showPause) {
				dom.pauseButton = createToolbarButton('fa-eye-slash', Reveal.togglePause);
				dom.pauseButton.classList.add('reveal-toolbar-pause-button');
				Reveal.addEventListener( 'paused', function() {
					var icon = dom.pauseButton.querySelector('i');
					icon.classList.remove('fa-eye-slash');
					icon.classList.add('fa-eye');
				});
				Reveal.addEventListener( 'resumed', function() {
					var icon = dom.pauseButton.querySelector('i');
					icon.classList.remove('fa-eye');
					icon.classList.add('fa-eye-slash');
				});
			}

			if (captureMenu) {
				// handle async loading of plugins
				var id_menu = setInterval(function() {
					if (RevealMenu && RevealMenu.isInit()) {
						dom.menu = document.querySelector('div.slide-menu-button');
						if (dom.menu) {
							console.log("Moving menu button");
							dom.toolbar.insertBefore(dom.menu, dom.toolbar.firstChild);
							dom.menu.classList.add('reveal-toolbar-button');
						}
						clearInterval(id_menu);
					}
				}, 50);
			}

			if (capturePlaybackControl) {
				dom.playback = document.querySelector('canvas.playback');
				if (dom.playback) {
					console.log("Moving playback control");
					dom.toolbar.appendChild(dom.playback);
				}
			}

			// place default footer stylesheet before first footer stylesheet to ensure footer styles override defaults
			var defaultStylesheet = document.querySelector( '#toolbar-defaults' );
			var themeStylesheet = document.querySelector( '.toolbar-theme' );
			if (themeStylesheet) {
				themeStylesheet.parentElement.insertBefore(defaultStylesheet, themeStylesheet);
			}

			/**
			 * Extend object a with the properties of object b.
			 * If there's a conflict, object b takes precedence.
			 */
			function extend( a, b ) {
				for( var i in b ) {
					a[ i ] = b[ i ];
				}
			}

			/**
			 * Dispatches an event of the specified type from the
			 * reveal DOM element.
			 */
			function dispatchEvent( type, args ) {
				var event = document.createEvent( 'HTMLEvents', 1, 2 );
				event.initEvent( type, true, true );
				extend( event, args );
				document.querySelector('.reveal').dispatchEvent( event );

				// If we're in an iframe, post each reveal.js event to the
				// parent window. Used by the notes plugin
				if( config.postMessageEvents && window.parent !== window.self ) {
					window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
				}
			}

			dispatchEvent('toolbar-ready');
		}
	};

	// modified from math plugin
	function loadResource( url, type, id, callback ) {
		var head = document.querySelector( 'head' );
		var resource;

		if ( type === 'script' ) {
			resource = document.createElement( 'script' );
			resource.type = 'text/javascript';
			resource.src = url;
      if (id) resource.id = id;
		}
		else if ( type === 'stylesheet' ) {
			resource = document.createElement( 'link' );
			resource.rel = 'stylesheet';
			resource.href = url;
      if (id) resource.id = id;
		}

		// Wrapper for callback to make sure it only fires once
		var finish = function() {
			if( typeof callback === 'function' ) {
				callback.call();
				callback = null;
			}
		}

		resource.onload = finish;

		// IE
		resource.onreadystatechange = function() {
			if ( this.readyState === 'loaded' ) {
				finish();
			}
		}

		// Normal browsers
		head.appendChild( resource );
	}

	function scriptPath() {
		// obtain plugin path from the script element
		var path;
		if (document.currentScript) {
			path = document.currentScript.src.slice(0, -10);
		} else {
			var sel = document.querySelector('script[src$="toolbar.js"]')
			if (sel) {
				path = sel.src.slice(0, -10);
			}
		}
		return path;
	}

	// polyfill
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position){
			return this.substr(position || 0, searchString.length) === searchString;
		};
	}
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(search, this_len) {
			if (this_len === undefined || this_len > this.length) {
				this_len = this.length;
			}
			return this.substring(this_len - search.length, this_len) === search;
		};
	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createNode( container, tagname, classname, innerHTML ) {
		var node = document.createElement( tagname );
		if (classname) {
			if (Array.isArray(classname)) {
				classname.forEach(function(c) {
					node.classList.add(c);
				})
			} else {
				node.classList.add( classname );		
			}
		}
		if( typeof innerHTML === 'string' ) {
			node.innerHTML = innerHTML;
		}
		container.appendChild( node );

		return node;
	}

	return {}; // API
})();
