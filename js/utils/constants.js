
export const SLIDES_SELECTOR = '.slides section';
export const HORIZONTAL_SLIDES_SELECTOR = '.slides>section';
export const VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section';

// Methods that may not be invoked via the postMessage API
export const POST_MESSAGE_METHOD_BLACKLIST = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/;

// Regex for retrieving the fragment style from a class attribute
export const FRAGMENT_STYLE_REGEX = /fade-(down|up|right|left|out|in-then-out|in-then-semi-out)|semi-fade-out|current-visible|shrink|grow/;