/**
 * The default reveal.js config object.
 */
export default {

	// The "normal" size of the presentation, aspect ratio will be preserved
	// when the presentation is scaled to fit different resolutions
	width: 960,
	height: 700,

	// Factor of the display size that should remain empty around the content
	margin: 0.04,

	// Bounds for smallest/largest possible scale to apply to content
	minScale: 0.2,
	maxScale: 2.0,

	// Display presentation control arrows
	controls: true,

	// Help the user learn the controls by providing hints, for example by
	// bouncing the down arrow when they first encounter a vertical slide
	controlsTutorial: true,

	// Determines where controls appear, "edges" or "bottom-right"
	controlsLayout: 'bottom-right',

	// Visibility rule for backwards navigation arrows; "faded", "hidden"
	// or "visible"
	controlsBackArrows: 'faded',

	// Display a presentation progress bar
	progress: true,

	// Display the page number of the current slide
	// - true:    Show slide number
	// - false:   Hide slide number
	//
	// Can optionally be set as a string that specifies the number formatting:
	// - "h.v":	  Horizontal . vertical slide number (default)
	// - "h/v":	  Horizontal / vertical slide number
	// - "c":	  Flattened slide number
	// - "c/t":	  Flattened slide number / total slides
	//
	// Alternatively, you can provide a function that returns the slide
	// number for the current slide. The function should take in a slide
	// object and return an array with one string [slideNumber] or
	// three strings [n1,delimiter,n2]. See #formatSlideNumber().
	slideNumber: false,

	// Can be used to limit the contexts in which the slide number appears
	// - "all":      Always show the slide number
	// - "print":    Only when printing to PDF
	// - "speaker":  Only in the speaker view
	showSlideNumber: 'all',

	// Use 1 based indexing for # links to match slide number (default is zero
	// based)
	hashOneBasedIndex: false,

	// Add the current slide number to the URL hash so that reloading the
	// page/copying the URL will return you to the same slide
	hash: false,

	// Flags if we should monitor the hash and change slides accordingly
	respondToHashChanges: true,

	// Enable support for jump-to-slide navigation shortcuts
	jumpToSlide: true,

	// Push each slide change to the browser history.  Implies `hash: true`
	history: false,

	// Enable keyboard shortcuts for navigation
	keyboard: true,

	// Optional function that blocks keyboard events when retuning false
	//
	// If you set this to 'focused', we will only capture keyboard events
	// for embedded decks when they are in focus
	keyboardCondition: null,

	// Disables the default reveal.js slide layout (scaling and centering)
	// so that you can use custom CSS layout
	disableLayout: false,

	// Enable the slide overview mode
	overview: true,

	// Vertical centering of slides
	center: true,

	// Enables touch navigation on devices with touch input
	touch: true,

	// Loop the presentation
	loop: false,

	// Change the presentation direction to be RTL
	rtl: false,

	// Changes the behavior of our navigation directions.
	//
	// "default"
	// Left/right arrow keys step between horizontal slides, up/down
	// arrow keys step between vertical slides. Space key steps through
	// all slides (both horizontal and vertical).
	//
	// "linear"
	// Removes the up/down arrows. Left/right arrows step through all
	// slides (both horizontal and vertical).
	//
	// "grid"
	// When this is enabled, stepping left/right from a vertical stack
	// to an adjacent vertical stack will land you at the same vertical
	// index.
	//
	// Consider a deck with six slides ordered in two vertical stacks:
	// 1.1    2.1
	// 1.2    2.2
	// 1.3    2.3
	//
	// If you're on slide 1.3 and navigate right, you will normally move
	// from 1.3 -> 2.1. If "grid" is used, the same navigation takes you
	// from 1.3 -> 2.3.
	navigationMode: 'default',

	// Randomizes the order of slides each time the presentation loads
	shuffle: false,

	// Turns fragments on and off globally
	fragments: true,

	// Flags whether to include the current fragment in the URL,
	// so that reloading brings you to the same fragment position
	fragmentInURL: true,

	// Flags if the presentation is running in an embedded mode,
	// i.e. contained within a limited portion of the screen
	embedded: false,

	// Flags if we should show a help overlay when the question-mark
	// key is pressed
	help: true,

	// Flags if it should be possible to pause the presentation (blackout)
	pause: true,

	// Flags if speaker notes should be visible to all viewers
	showNotes: false,

	// Flags if slides with data-visibility="hidden" should be kep visible
	showHiddenSlides: false,

	// Global override for autoplaying embedded media (video/audio/iframe)
	// - null:   Media will only autoplay if data-autoplay is present
	// - true:   All media will autoplay, regardless of individual setting
	// - false:  No media will autoplay, regardless of individual setting
	autoPlayMedia: null,

	// Global override for preloading lazy-loaded iframes
	// - null:   Iframes with data-src AND data-preload will be loaded when within
	//           the viewDistance, iframes with only data-src will be loaded when visible
	// - true:   All iframes with data-src will be loaded when within the viewDistance
	// - false:  All iframes with data-src will be loaded only when visible
	preloadIframes: null,

	// Can be used to globally disable auto-animation
	autoAnimate: true,

	// Optionally provide a custom element matcher that will be
	// used to dictate which elements we can animate between.
	autoAnimateMatcher: null,

	// Default settings for our auto-animate transitions, can be
	// overridden per-slide or per-element via data arguments
	autoAnimateEasing: 'ease',
	autoAnimateDuration: 1.0,
	autoAnimateUnmatched: true,

	// CSS properties that can be auto-animated. Position & scale
	// is matched separately so there's no need to include styles
	// like top/right/bottom/left, width/height or margin.
	autoAnimateStyles: [
		'opacity',
		'color',
		'background-color',
		'padding',
		'font-size',
		'line-height',
		'letter-spacing',
		'border-width',
		'border-color',
		'border-radius',
		'outline',
		'outline-offset'
	],

	// Controls automatic progression to the next slide
	// - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
	//           is present on the current slide or fragment
	// - 1+:     All slides will progress automatically at the given interval
	// - false:  No auto-sliding, even if data-autoslide is present
	autoSlide: 0,

	// Stop auto-sliding after user input
	autoSlideStoppable: true,

	// Use this method for navigation when auto-sliding (defaults to navigateNext)
	autoSlideMethod: null,

	// Specify the average time in seconds that you think you will spend
	// presenting each slide. This is used to show a pacing timer in the
	// speaker view
	defaultTiming: null,

	// Enable slide navigation via mouse wheel
	mouseWheel: false,

	// Opens links in an iframe preview overlay
	// Add `data-preview-link` and `data-preview-link="false"` to customise each link
	// individually
	previewLinks: false,

	// Exposes the reveal.js API through window.postMessage
	postMessage: true,

	// Dispatches all reveal.js events to the parent window through postMessage
	postMessageEvents: false,

	// Focuses body when page changes visibility to ensure keyboard shortcuts work
	focusBodyOnPageVisibilityChange: true,

	// Transition style
	transition: 'slide', // none/fade/slide/convex/concave/zoom

	// Transition speed
	transitionSpeed: 'default', // default/fast/slow

	// Transition style for full page slide backgrounds
	backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

	// Parallax background image
	parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

	// Parallax background size
	parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

	// Parallax background repeat
	parallaxBackgroundRepeat: '', // repeat/repeat-x/repeat-y/no-repeat/initial/inherit

	// Parallax background position
	parallaxBackgroundPosition: '', // CSS syntax, e.g. "top left"

	// Amount of pixels to move the parallax background per slide step
	parallaxBackgroundHorizontal: null,
	parallaxBackgroundVertical: null,

	// Can be used to initialize reveal.js in one of the following views:
	// - print:   Render the presentation so that it can be printed to PDF
	// - reader:  Show the presentation as a tall scrollable page with scroll
	//            triggered animations
	view: null,

	// Adjusts the height of each slide in reader mode
	// - full:       Each slide is as tall as the viewport
	// - compact:    Slides are as small as possible, allowing multiple slides
	//               to be visible in parallel on tall devices
	readerLayout: 'full',

	// Control how scroll snapping works in reader mode.
	// - false:   	No snapping, scrolling is continuous
	// - proximity:  Snap when close to a slide
	// - mandatory:  Always snap to the closest slide
	//
	// Only applies to presentations in reader mode.
	readerScrollSnap: 'mandatory',

	// Enables and configure the reader mode scroll bar.
	// - 'auto':    Show the scrollbar while scrolling, hide while idle
	// - true:      Always show the scrollbar
	// - false:     Never show the scrollbar
	readerScrollbar: 'auto',

	// Responsively activate the reader mode when we reach the specified
	// width (in pixels)
	readerActivationWidth: null,

	// The maximum number of pages a single slide can expand onto when printing
	// to PDF, unlimited by default
	pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

	// Prints each fragment on a separate slide
	pdfSeparateFragments: true,

	// Offset used to reduce the height of content within exported PDF pages.
	// This exists to account for environment differences based on how you
	// print to PDF. CLI printing options, like phantomjs and wkpdf, can end
	// on precisely the total height of the document whereas in-browser
	// printing has to end one pixel before.
	pdfPageHeightOffset: -1,

	// Number of slides away from the current that are visible
	viewDistance: 3,

	// Number of slides away from the current that are visible on mobile
	// devices. It is advisable to set this to a lower number than
	// viewDistance in order to save resources.
	mobileViewDistance: 2,

	// The display mode that will be used to show slides
	display: 'block',

	// Hide cursor if inactive
	hideInactiveCursor: true,

	// Time before the cursor is hidden (in ms)
	hideCursorTime: 5000,

	// Should we automatically sort and set indices for fragments
	// at each sync? (See Reveal.sync)
	sortFragmentsOnSync: true,

	// Script dependencies to load
	dependencies: [],

	// Plugin objects to register and use for this presentation
	plugins: []

}