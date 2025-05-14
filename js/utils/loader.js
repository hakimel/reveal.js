/**
 * Loads a JavaScript file from the given URL and executes it.
 *
 * @param {string} url Address of the .js file to load
 * @param {function} callback Method to invoke when the script
 * has loaded and executed
 */
export const loadScript = ( url, callback ) => {

	const script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.async = false;
	script.defer = false;
	script.src = url;

	if( typeof callback === 'function' ) {

		// Success callback
		script.onload = script.onreadystatechange = event => {
			if( event.type === 'load' || /loaded|complete/.test( script.readyState ) ) {

				// Kill event listeners
				script.onload = script.onreadystatechange = script.onerror = null;

				callback();

			}
		};

		// Error callback
		script.onerror = err => {

			// Kill event listeners
			script.onload = script.onreadystatechange = script.onerror = null;

			callback( new Error( 'Failed loading script: ' + script.src + '\n' + err ) );

		};

	}

	// Append the script at the end of <head>
	const head = document.querySelector( 'head' );
	head.insertBefore( script, head.lastChild );

}