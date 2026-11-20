/**
 * Slide transition styles.
 *
 * @see {@link https://revealjs.com/transitions/}
 */
type TransitionStyle = 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
/**
 * Slide transition speeds.
 *
 * @see {@link https://revealjs.com/transitions/}
 */
type TransitionSpeed = 'default' | 'fast' | 'slow';
/**
 * Fragment animation classes.
 *
 * @see {@link https://revealjs.com/fragments/}
 */
type FragmentAnimation = 'fade-out' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in-then-out' | 'fade-in-then-semi-out' | 'grow' | 'shrink' | 'strike' | 'highlight-red' | 'highlight-blue' | 'highlight-green' | 'highlight-current-red' | 'highlight-current-blue' | 'highlight-current-green' | (string & {});
/**
 * katex - Math Plugin configuration
 *
 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/math.md}
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/math/katex.js}
 */
interface KatexConfig {
    local?: string;
    version?: string;
    delimiters?: Array<{
        left: string;
        right: string;
        display: boolean;
    }>;
    ignoredTags?: string[];
}
/**
 * mathjax2 - Math Plugin configuration
 *
 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/math.md}
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/math/mathjax2.js}
 */
interface Mathjax2Config {
    mathjax?: string;
    config?: string;
    tex2jax?: {
        inlineMath?: any;
        skipTags?: string[];
    };
}
/**
 * mathjax3 - Math Plugin configuration
 *
 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/math.md}
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/math/mathjax3.js}
 */
interface Mathjax3Config {
    mathjax?: string;
    tex?: {
        inlineMath?: any;
    };
    options?: {
        skipHtmlTags: string[];
    };
}
/**
 * mathjax4 - Math Plugin configuration
 *
 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/math.md}
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/math/mathjax4.js}
 */
interface Mathjax4Config {
    mathjax?: string;
    tex?: {
        inlineMath?: Array<[string, string]>;
        displayMath?: Array<[string, string]>;
        macros?: Record<string, string | [string, number]>;
    };
    options?: {
        skipHtmlTags?: string[];
    };
    startup?: {
        ready?: () => void;
    };
    output?: {
        font?: string;
        displayOverflow?: string;
        linebreaks?: {
            inline?: boolean;
            width?: string;
            lineleading?: number;
            LinebreakVisitor?: unknown;
        };
    };
}
/**
 * Highlight Plugin configuration
 *
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/highlight/plugin.js}
 */
interface HighlightConfig {
    highlightOnLoad?: boolean;
    escapeHTML?: boolean;
    beforeHighlight?: (...args: any) => any;
}
/**
 * Markdown Plugin configuration
 *
 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/markdown.md}
 * @see {@link https://marked.js.org/using_advanced}
 */
interface MarkdownConfig {
    async?: boolean;
    baseUrl?: string;
    breaks?: boolean;
    gfm?: boolean;
    headerIds?: boolean;
    headerPrefix?: string;
    highlight?: (...args: any) => any;
    langPrefix?: string;
    mangle?: boolean;
    pedantic?: boolean;
    renderer?: object;
    sanitize?: boolean;
    sanitizer?: (...args: any) => any;
    silent?: boolean;
    smartLists?: boolean;
    smartypants?: boolean;
    tokenizer?: object;
    walkTokens?: (...args: any) => any;
    xhtml?: boolean;
    separator?: string;
    verticalSeparator?: string;
    notesSeparator?: string;
    attributes?: string;
}
/**
 * Configuration object for reveal.js.
 *
 * @see {@link https://revealjs.com/config/}
 */
interface RevealConfig {
    /**
     * The "normal" size of the presentation, aspect ratio will be preserved
     * when the presentation is scaled to fit different resolutions
     *
     * @see {@link https://revealjs.com/presentation-size/}
     *
     * @defaultValue 960
     */
    width?: number | string;
    /**
     * The "normal" size of the presentation, aspect ratio will be preserved
     * when the presentation is scaled to fit different resolutions
     *
     * @see {@link https://revealjs.com/presentation-size/}
     *
     * @defaultValue 700
     */
    height?: number | string;
    /**
     * Factor of the display size that should remain empty around the content
     *
     * @see {@link https://revealjs.com/presentation-size/}
     *
     * @defaultValue 0.04
     */
    margin?: number;
    /**
     * The smallest possible factor to scale content down by in order to fit
     * the available viewport.
     *
     * @see {@link https://revealjs.com/presentation-size/}
     *
     * @defaultValue 0.2
     */
    minScale?: number;
    /**
     * The largest possible factor to scale content up by in order to cover
     * the available viewport.
     *
     * @see {@link https://revealjs.com/presentation-size/}
     *
     * @defaultValue 2.0
     */
    maxScale?: number;
    /**
     * Display presentation control arrows
     * - true: Display controls in all views
     * - false: Hide controls in all views
     * - 'speaker': Display controls only in the speaker view
     *
     * @defaultValue true
     */
    controls?: boolean | 'speaker' | 'speaker-only';
    /**
     * Help the user learn the controls by providing hints, for example by
     * bouncing the down arrow when they first encounter a vertical slide
     *
     * @defaultValue true
     */
    controlsTutorial?: boolean;
    /**
     * Determines where controls appear, "edges" or "bottom-right"
     *
     * @defaultValue 'bottom-right'
     */
    controlsLayout?: 'edges' | 'bottom-right';
    /**
     * Visibility rule for backwards navigation arrows; "faded", "hidden"
     * or "visible"
     *
     * @defaultValue 'faded'
     */
    controlsBackArrows?: 'faded' | 'hidden' | 'visible';
    /**
     * Display a presentation progress bar
     *
     * @defaultValue true
     */
    progress?: boolean;
    /**
     * Display the page number of the current slide
     * - true:    Show slide number
     * - false:   Hide slide number
     *
     * Can optionally be set as a string that specifies the number formatting:
     * - "h.v":	  Horizontal . vertical slide number (default)
     * - "h/v":	  Horizontal / vertical slide number
     * - "c":	  Flattened slide number
     * - "c/t":	  Flattened slide number / total slides
     *
     * Alternatively, you can provide a function that returns the slide
     * number for the current slide. The function should take in a slide
     * object and return an array with one string [slideNumber] or
     * three strings [n1,delimiter,n2]. See #formatSlideNumber().
     *
     * @defaultValue false
     */
    slideNumber?: boolean | 'h.v' | 'h/v' | 'c' | 'c/t' | ((slide: any) => string | [string, string, string]);
    /**
     * Can be used to limit the contexts in which the slide number appears
     * - "all":      Always show the slide number
     * - "print":    Only when printing to PDF
     * - "speaker":  Only in the speaker view
     *
     * @defaultValue 'all'
     */
    showSlideNumber?: 'all' | 'print' | 'speaker';
    /**
     * Use 1 based indexing for # links to match slide number (default is zero
     * based)
     *
     * @defaultValue false
     */
    hashOneBasedIndex?: boolean;
    /**
     * Add the current slide number to the URL hash so that reloading the
     * page/copying the URL will return you to the same slide
     *
     * @defaultValue false
     */
    hash?: boolean;
    /**
     * Flags if we should monitor the hash and change slides accordingly
     *
     * @defaultValue true
     */
    respondToHashChanges?: boolean;
    /**
     * Enable support for jump-to-slide navigation shortcuts
     *
     * @defaultValue true
     */
    jumpToSlide?: boolean;
    /**
     * Push each slide change to the browser history. Implies `hash: true`
     *
     * @defaultValue false
     */
    history?: boolean;
    /**
     * Enable keyboard shortcuts for navigation
     *
     * @defaultValue true
     */
    keyboard?: boolean | {
        [keyCode: number]: string | ((event: KeyboardEvent) => void);
    };
    /**
     * Optional function that blocks keyboard events when returning false
     *
     * If you set this to 'focused', we will only capture keyboard events
     * for embedded decks when they are in focus
     *
     * @defaultValue null
     */
    keyboardCondition?: null | 'focused' | ((event: KeyboardEvent) => boolean);
    /**
     * Disables the default reveal.js slide layout (scaling and centering)
     * so that you can use custom CSS layout
     *
     * @defaultValue false
     */
    disableLayout?: boolean;
    /**
     * Enable the slide overview mode
     *
     * @see {@link https://revealjs.com/overview/}
     *
     * @defaultValue true
     */
    overview?: boolean;
    /**
     * Vertical centering of slides
     *
     * @defaultValue true
     */
    center?: boolean;
    /**
     * Enables touch navigation on devices with touch input
     *
     * @defaultValue true
     */
    touch?: boolean;
    /**
     * Loop the presentation
     *
     * @defaultValue false
     */
    loop?: boolean;
    /**
     * Change the presentation direction to be RTL
     *
     * @defaultValue false
     */
    rtl?: boolean;
    /**
     * Changes the behavior of our navigation directions.
     *
     * "default"
     * Left/right arrow keys step between horizontal slides, up/down
     * arrow keys step between vertical slides. Space key steps through
     * all slides (both horizontal and vertical).
     *
     * "linear"
     * Removes the up/down arrows. Left/right arrows step through all
     * slides (both horizontal and vertical).
     *
     * "grid"
     * When this is enabled, stepping left/right from a vertical stack
     * to an adjacent vertical stack will land you at the same vertical
     * index.
     *
     * Consider a deck with six slides ordered in two vertical stacks:
     * 1.1    2.1
     * 1.2    2.2
     * 1.3    2.3
     *
     * If you're on slide 1.3 and navigate right, you will normally move
     * from 1.3 -> 2.1. If "grid" is used, the same navigation takes you
     * from 1.3 -> 2.3.
     *
     * @defaultValue 'default'
     */
    navigationMode?: 'default' | 'linear' | 'grid';
    /**
     * Randomizes the order of slides each time the presentation loads
     *
     * @defaultValue false
     */
    shuffle?: boolean;
    /**
     * Turns fragments on and off globally
     *
     * @see {@link https://revealjs.com/fragments/}
     *
     * @defaultValue true
     */
    fragments?: boolean;
    /**
     * Flags whether to include the current fragment in the URL,
     * so that reloading brings you to the same fragment position
     *
     * @defaultValue true
     */
    fragmentInURL?: boolean;
    /**
     * Flags if the presentation is running in an embedded mode,
     * i.e. contained within a limited portion of the screen
     *
     * @defaultValue false
     */
    embedded?: boolean;
    /**
     * Flags if we should show a help overlay when the question-mark
     * key is pressed
     *
     * @defaultValue true
     */
    help?: boolean;
    /**
     * Flags if it should be possible to pause the presentation (blackout)
     *
     * @defaultValue true
     */
    pause?: boolean;
    /**
     * Flags if speaker notes should be visible to all viewers
     *
     * @defaultValue false
     */
    showNotes?: boolean;
    /**
     * Flags if slides with data-visibility="hidden" should be kept visible
     *
     * @defaultValue false
     */
    showHiddenSlides?: boolean;
    /**
     * Global override for autoplaying embedded media (video/audio/iframe)
     * - null:   Media will only autoplay if data-autoplay is present
     * - true:   All media will autoplay, regardless of individual setting
     * - false:  No media will autoplay, regardless of individual setting
     *
     * @defaultValue null
     */
    autoPlayMedia?: null | boolean;
    /**
     * Global override for preloading lazy-loaded iframes
     * - null:   Iframes with data-src AND data-preload will be loaded when within
     *           the viewDistance, iframes with only data-src will be loaded when visible
     * - true:   All iframes with data-src will be loaded when within the viewDistance
     * - false:  All iframes with data-src will be loaded only when visible
     *
     * @defaultValue null
     */
    preloadIframes?: null | boolean;
    /**
     * Prevent embedded iframes from automatically focusing on themselves
     *
     * @defaultValue false
     */
    preventIframeAutoFocus?: boolean;
    /**
     * Can be used to globally disable auto-animation
     *
     * @see {@link https://revealjs.com/auto-animate/}
     *
     * @defaultValue true
     */
    autoAnimate?: boolean;
    /**
     * Optionally provide a custom element matcher that will be
     * used to dictate which elements we can animate between.
     *
     * @defaultValue null
     */
    autoAnimateMatcher?: null | Function;
    /**
     * Default settings for our auto-animate transitions, can be
     * overridden per-slide or per-element via data arguments
     *
     * @defaultValue 'ease'
     */
    autoAnimateEasing?: 'ease' | string;
    /**
     * Number of seconds to animate each element.
     *
     * @defaultValue 1.0
     */
    autoAnimateDuration?: number;
    /**
     * Should unmatched elements be faded in?
     *
     * @defaultValue true
     */
    autoAnimateUnmatched?: boolean;
    /**
     * CSS properties that can be auto-animated. Position & scale
     * is matched separately so there's no need to include styles
     * like top/right/bottom/left, width/height or margin.
     *
     * @defaultValue ['opacity', 'color', 'background-color', 'padding', 'font-size', 'line-height', 'letter-spacing', 'border-width', 'border-color', 'border-radius', 'outline', 'outline-offset']
     */
    autoAnimateStyles?: string[];
    /**
     * Controls automatic progression to the next slide
     * - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
     *           is present on the current slide or fragment
     * - 1+:     All slides will progress automatically at the given interval
     * - false:  No auto-sliding, even if data-autoslide is present
     *
     * @defaultValue 0
     */
    autoSlide?: number | false;
    /**
     * Stop auto-sliding after user input
     *
     * @defaultValue true
     */
    autoSlideStoppable?: boolean;
    /**
     * Use this method for navigation when auto-sliding (defaults to navigateNext)
     *
     * @defaultValue null
     */
    autoSlideMethod?: null | Function;
    /**
     * Specify the average time in seconds that you think you will spend
     * presenting each slide. This is used to show a pacing timer in the
     * speaker view
     *
     * @defaultValue null
     */
    defaultTiming?: null;
    /**
     * Enable slide navigation via mouse wheel
     *
     * @defaultValue false
     */
    mouseWheel?: boolean;
    /**
     * Opens links in an iframe preview overlay
     * Add `data-preview-link` and `data-preview-link="false"` to customize each link
     * individually
     *
     * @defaultValue false
     */
    previewLinks?: boolean;
    /**
     * Exposes the reveal.js API through window.postMessage
     *
     * @defaultValue true
     */
    postMessage?: boolean;
    /**
     * Dispatches all reveal.js events to the parent window through postMessage
     *
     * @defaultValue false
     */
    postMessageEvents?: boolean;
    /**
     * Focuses body when page changes visibility to ensure keyboard shortcuts work
     *
     * @defaultValue true
     */
    focusBodyOnPageVisibilityChange?: boolean;
    /**
     * Transition style
     *
     * @see {@link https://revealjs.com/transitions/}
     *
     * @defaultValue 'slide'
     */
    transition?: TransitionStyle;
    /**
     * Transition speed
     *
     * @defaultValue 'default'
     */
    transitionSpeed?: TransitionSpeed;
    /**
     * Transition style for full page slide backgrounds
     *
     * @defaultValue 'fade'
     */
    backgroundTransition?: TransitionStyle;
    /**
     * Parallax background image
     *
     * @defaultValue ''
     */
    parallaxBackgroundImage?: null | string;
    /**
     * Parallax background size
     *
     * @defaultValue ''
     */
    parallaxBackgroundSize?: null | string;
    /**
     * Parallax background repeat
     *
     * @defaultValue ''
     */
    parallaxBackgroundRepeat?: null | string;
    /**
     * Parallax background position
     *
     * @defaultValue ''
     */
    parallaxBackgroundPosition?: null | string;
    /**
     * Amount of pixels to move the parallax background per slide step
     *
     * @defaultValue null
     */
    parallaxBackgroundHorizontal?: null | number;
    /**
     *
     * @defaultValue null
     */
    parallaxBackgroundVertical?: null | number;
    /**
     * Can be used to initialize reveal.js in one of the following views:
     * - print:   Render the presentation so that it can be printed to PDF
     * - scroll:  Show the presentation as a tall scrollable page with scroll
     *            triggered animations
     *
     * @see {@link https://revealjs.com/scroll-view/}
     *
     * @defaultValue null
     */
    view?: null | 'print' | 'scroll';
    /**
     * Adjusts the height of each slide in the scroll view.
     * - full:       Each slide is as tall as the viewport
     * - compact:    Slides are as small as possible, allowing multiple slides
     *               to be visible in parallel on tall devices
     *
     * @defaultValue 'full'
     */
    scrollLayout?: 'full' | 'compact';
    /**
     * Control how scroll snapping works in the scroll view.
     * - false:   	No snapping, scrolling is continuous
     * - proximity:  Snap when close to a slide
     * - mandatory:  Always snap to the closest slide
     *
     * Only applies to presentations in scroll view.
     *
     * @defaultValue 'mandatory'
     */
    scrollSnap?: false | 'proximity' | 'mandatory';
    /**
     * Enables and configures the scroll view progress bar.
     * - 'auto':    Show the scrollbar while scrolling, hide while idle
     * - true:      Always show the scrollbar
     * - false:     Never show the scrollbar
     *
     * @defaultValue 'auto'
     */
    scrollProgress?: 'auto' | boolean;
    /**
     * Automatically activate the scroll view when we the viewport falls
     * below the given width.
     *
     * @defaultValue 435
     */
    scrollActivationWidth?: number;
    /**
     * The maximum number of pages a single slide can expand onto when printing
     * to PDF, unlimited by default
     *
     * @defaultValue Number.POSITIVE_INFINITY
     */
    pdfMaxPagesPerSlide?: number;
    /**
     * Prints each fragment on a separate slide
     *
     * @defaultValue true
     */
    pdfSeparateFragments?: boolean;
    /**
     * Offset used to reduce the height of content within exported PDF pages.
     * This exists to account for environment differences based on how you
     * print to PDF. CLI printing options, like phantomjs and wkpdf, can end
     * on precisely the total height of the document whereas in-browser
     * printing has to end one pixel before.
     *
     * @defaultValue -1
     */
    pdfPageHeightOffset?: number;
    /**
     * Number of slides away from the current that are visible
     *
     * @defaultValue 3
     */
    viewDistance?: number;
    /**
     * Number of slides away from the current that are visible on mobile
     * devices. It is advisable to set this to a lower number than
     * viewDistance in order to save resources.
     *
     * @defaultValue 2
     */
    mobileViewDistance?: number;
    /**
     * The display mode that will be used to show slides
     *
     * @defaultValue 'block'
     */
    display?: string;
    /**
     * Hide cursor if inactive
     *
     * @defaultValue true
     */
    hideInactiveCursor?: boolean;
    /**
     * Time before the cursor is hidden (in ms)
     *
     * @defaultValue 5000
     */
    hideCursorTime?: number;
    /**
     * Should we automatically sort and set indices for fragments
     * at each sync? (See Reveal.sync)
     *
     * @defaultValue true
     */
    sortFragmentsOnSync?: boolean;
    /**
     * Highlight plugin configuration
     */
    highlight?: HighlightConfig;
    /**
     * Markdown plugin configuration
     */
    markdown?: MarkdownConfig;
    /**
     * KaTeX math plugin configuration
     */
    katex?: KatexConfig;
    /**
     * MathJax 2 plugin configuration
     */
    mathjax2?: Mathjax2Config;
    /**
     * MathJax 3 plugin configuration
     */
    mathjax3?: Mathjax3Config;
    /**
     * MathJax 4 plugin configuration
     */
    mathjax4?: Mathjax4Config;
    /**
     * Script dependencies to load
     *
     * @defaultValue []
     */
    dependencies?: any[];
    /**
     * Plugin objects to register and use for this presentation
     *
     * @defaultValue []
     */
    plugins?: any[];
}
/**
 * The default reveal.js config object.
 */
declare const defaultConfig: RevealConfig;
export type { RevealConfig, TransitionStyle, TransitionSpeed, FragmentAnimation, KatexConfig, Mathjax2Config, Mathjax3Config, Mathjax4Config, HighlightConfig, MarkdownConfig, };
export { defaultConfig };
