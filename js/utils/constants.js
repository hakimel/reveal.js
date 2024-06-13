
export const SLIDES_SELECTOR = '.slides section';
export const HORIZONTAL_SLIDES_SELECTOR = '.slides>section';
export const VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section';
export const HORIZONTAL_BACKGROUNDS_SELECTOR = '.backgrounds>.slide-background';

// Methods that may not be invoked via the postMessage API
export const POST_MESSAGE_METHOD_BLACKLIST = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/;

// Regex for retrieving the fragment style from a class attribute
export const FRAGMENT_STYLE_REGEX = /fade-(down|up|right|left|out|in-then-out|in-then-semi-out)|semi-fade-out|current-visible|shrink|grow/;

// Slide number formats
export const SLIDE_NUMBER_FORMAT_HORIZONTAL_DOT_VERTICAL = 'h.v';
export const SLIDE_NUMBER_FORMAT_HORIZONTAL_SLASH_VERTICAL = 'h/v';
export const SLIDE_NUMBER_FORMAT_CURRENT = 'c';
export const SLIDE_NUMBER_FORMAT_CURRENT_SLASH_TOTAL = 'c/t';