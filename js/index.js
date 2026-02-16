import Deck, { VERSION } from './reveal.js';

/**
 * Expose the Reveal class as a backward-compatible singleton.
 * Usage (legacy API):
 *   Reveal.initialize({ controls: false }).then(() => {
 *     // reveal.js is ready
 *   });
 * Usage (modern API):
 *   let deck = new Reveal(document.querySelector('.reveal'), {
 *     controls: false
 *   });
 *   deck.initialize().then(() => {
 *     // reveal.js is ready
 *   });
 */

let singletonInstance = null;
const enqueuedAPICalls = [];

// Compatibility wrapper for the legacy API
const Reveal = function (...args) {
  // Modern API: Create a new Deck instance if called as a constructor
  // This is rarely used in the legacy setting, but kept for completeness
  return new Deck(...args);
};

// Attach the initialize method for legacy compatibility
Reveal.initialize = options => {
  // Prevent multiple initializations
  if (singletonInstance) {
    return singletonInstance.initialize();
  }
  // Create the singleton Deck instance on the first call
  singletonInstance = new Deck(document.querySelector('.reveal'), options);

  // Attach all Deck instance methods to Reveal for compatibility
  Object.getOwnPropertyNames(Deck.prototype).forEach(method => {
    if (typeof singletonInstance[method] === 'function' && !Reveal[method]) {
      Reveal[method] = singletonInstance[method].bind(singletonInstance);
    }
  });

  // Invoke any queued API calls
  enqueuedAPICalls.forEach(method => method(singletonInstance));

  return singletonInstance.initialize();
};

/**
 * The pre-4.0 API let you add event listeners and call certain methods
 * before Reveal was initialized. To maintain this, we queue up those
 * calls and run them after initialization.
 */
[
  'configure',
  'on',
  'off',
  'addEventListener',
  'removeEventListener',
  'registerPlugin'
].forEach(method => {
  Reveal[method] = (...args) => {
    enqueuedAPICalls.push(deck => deck[method](...args));
  };
});

// For legacy API compatibility
Reveal.isReady = () => !!singletonInstance && singletonInstance.isReady();
Reveal.VERSION = VERSION;

export default Reveal;
