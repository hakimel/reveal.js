/**
 * Loads a JavaScript file from the given URL and executes it.
 *
 * @param {string} url Address of the .js file to load
 * @param {function} callback Method to invoke when the script
 * has loaded and executed
 */
export declare const loadScript: (url: string, callback?: (error?: Error) => void) => void;
