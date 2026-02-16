/**
 * Loads a JavaScript file from the given URL and executes it.
 *
 * @param {string} url Address of the .js file to load
 * @param {function} callback Method to invoke when the script
 * has loaded and executed
 */
export const loadScript = (url: string, callback?: (error?: Error) => void) => {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = false;
	script.defer = false;
	script.src = url;

	if (typeof callback === 'function') {
		// Success callback
		script.onload = (event: Event) => {
			if (event.type === 'load') {
				// Kill event listeners
				script.onload = script.onerror = null;

				callback();
			}
		};

		// Error callback
		script.onerror = (err: Event | string) => {
			// Kill event listeners
			script.onload = script.onerror = null;

			callback(new Error('Failed loading script: ' + script.src + '\n' + err));
		};
	}

	// Append the script at the end of <head>
	const head = document.querySelector('head');
	if (head) {
		head.insertBefore(script, head.lastChild);
	}
};
