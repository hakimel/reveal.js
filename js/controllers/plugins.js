import { loadScript } from '../utils/loader.js'

/**
 * Manages loading and registering of reveal.js plugins.
 */
export default class Plugins {

	constructor( reveal ) {

		this.Reveal = reveal;

		// Flags our current state (idle -> loading -> loaded)
		this.state = 'idle';

		// An id:instance map of currently registed plugins
		this.registeredPlugins = {};

		this.asyncDependencies = [];

	}

	/**
	 * Loads reveal.js dependencies, registers and
	 * initializes plugins.
	 *
	 * Plugins are direct references to a reveal.js plugin
	 * object that we register and initialize after any
	 * synchronous dependencies have loaded.
	 *
	 * Dependencies are defined via the 'dependencies' config
	 * option and will be loaded prior to starting reveal.js.
	 * Some dependencies may have an 'async' flag, if so they
	 * will load after reveal.js has been started up.
	 */
	load( plugins, dependencies ) {

		this.state = 'loading';

		plugins.forEach( this.registerPlugin.bind( this ) );

		return new Promise( resolve => {

			let scripts = [],
				scriptsToLoad = 0;

			dependencies.forEach( s => {
				// Load if there's no condition or the condition is truthy
				if( !s.condition || s.condition() ) {
					if( s.async ) {
						this.asyncDependencies.push( s );
					}
					else {
						scripts.push( s );
					}
				}
			} );

			if( scripts.length ) {
				scriptsToLoad = scripts.length;

				const scriptLoadedCallback = (s) => {
					if( s && typeof s.callback === 'function' ) s.callback();

					if( --scriptsToLoad === 0 ) {
						this.initPlugins().then( resolve );
					}
				};

				// Load synchronous scripts
				scripts.forEach( s => {
					if( typeof s.id === 'string' ) {
						this.registerPlugin( s );
						scriptLoadedCallback( s );
					}
					else if( typeof s.src === 'string' ) {
						loadScript( s.src, () => scriptLoadedCallback(s) );
					}
					else {
						console.warn( 'Unrecognized plugin format', s );
						scriptLoadedCallback();
					}
				} );
			}
			else {
				this.initPlugins().then( resolve );
			}

		} );

	}

	/**
	 * Initializes our plugins and waits for them to be ready
	 * before proceeding.
	 */
	initPlugins() {

		return new Promise( resolve => {

			let pluginValues = Object.values( this.registeredPlugins );
			let pluginsToInitialize = pluginValues.length;

			// If there are no plugins, skip this step
			if( pluginsToInitialize === 0 ) {
				this.loadAsync().then( resolve );
			}
			// ... otherwise initialize plugins
			else {

				let initNextPlugin;

				let afterPlugInitialized = () => {
					if( --pluginsToInitialize === 0 ) {
						this.loadAsync().then( resolve );
					}
					else {
						initNextPlugin();
					}
				};

				let i = 0;

				// Initialize plugins serially
				initNextPlugin = () => {

					let plugin = pluginValues[i++];

					// If the plugin has an 'init' method, invoke it
					if( typeof plugin.init === 'function' ) {
						let promise = plugin.init( this.Reveal );

						// If the plugin returned a Promise, wait for it
						if( promise && typeof promise.then === 'function' ) {
							promise.then( afterPlugInitialized );
						}
						else {
							afterPlugInitialized();
						}
					}
					else {
						afterPlugInitialized();
					}

				}

				initNextPlugin();

			}

		} )

	}

	/**
	 * Loads all async reveal.js dependencies.
	 */
	loadAsync() {

		this.state = 'loaded';

		if( this.asyncDependencies.length ) {
			this.asyncDependencies.forEach( s => {
				loadScript( s.src, s.callback );
			} );
		}

		return Promise.resolve();

	}

	/**
	 * Registers a new plugin with this reveal.js instance.
	 *
	 * reveal.js waits for all regisered plugins to initialize
	 * before considering itself ready, as long as the plugin
	 * is registered before calling `Reveal.initialize()`.
	 */
	registerPlugin( plugin ) {

		// Backwards compatibility to make reveal.js ~3.9.0
		// plugins work with reveal.js 4.0.0
		if( arguments.length === 2 && typeof arguments[0] === 'string' ) {
			plugin = arguments[1];
			plugin.id = arguments[0];
		}
		// Plugin can optionally be a function which we call
		// to create an instance of the plugin
		else if( typeof plugin === 'function' ) {
			plugin = plugin();
		}

		let id = plugin.id;

		if( typeof id !== 'string' ) {
			console.warn( 'Unrecognized plugin format; can\'t find plugin.id', plugin );
		}
		else if( this.registeredPlugins[id] === undefined ) {
			this.registeredPlugins[id] = plugin;

			// If a plugin is registered after reveal.js is loaded,
			// initialize it right away
			if( this.state === 'loaded' && typeof plugin.init === 'function' ) {
				plugin.init( this.Reveal );
			}
		}
		else {
			console.warn( 'reveal.js: "'+ id +'" plugin has already been registered' );
		}

	}

	/**
	 * Checks if a specific plugin has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	hasPlugin( id ) {

		return !!this.registeredPlugins[id];

	}

	/**
	 * Returns the specific plugin instance, if a plugin
	 * with the given ID has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	getPlugin( id ) {

		return this.registeredPlugins[id];

	}

	getRegisteredPlugins() {

		return this.registeredPlugins;

	}

	destroy() {

		Object.values( this.registeredPlugins ).forEach( plugin => {
			if( typeof plugin.destroy === 'function' ) {
				plugin.destroy();
			}
		} );

		this.registeredPlugins = {};
		this.asyncDependencies = [];

	}

}
