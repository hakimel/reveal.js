import { Config } from './config';

export as namespace Reveal;

export = Reveal;

// The type definitions in this file are adapted from those
// originally created by the community on DefinitelyTyped:
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/reveal.js

/**
 * reveal.js - MIT licensed
 *
 * Copyright (C) 2011-2026 Hakim El Hattab, https://hakim.se
 *
 * @see {@link https://revealjs.com}
 * @see {@link https://github.com/hakimel/reveal.js/blob/master/js/reveal.js}
 * @see {@link https://revealjs.com/api/}
 */
declare const Reveal: {
	new (options?: Config): Reveal.Api;
	new (revealElement: HTMLElement, options?: Config): Reveal.Api;
} & Reveal.Api;

declare namespace Reveal {
	/**
	 * The public reveal.js API
	 *
	 * @see {@link https://github.com/hakimel/reveal.js/blob/master/js/reveal.js}
	 */
	interface Api {
		/**
		 * The reveal.js version
		 *
		 * @returns reveal.js version
		 */
		VERSION: string;

		/**
		 * Starts up the presentation.
		 *
		 * @param options - RevealOption see {@link Options}
		 * @returns a promise
		 */
		initialize(options?: Config): Promise<Api>;

		/**
		 * Applies the configuration settings from the config
		 * object. May be called multiple times.
		 *
		 * @param options - RevealOption see {@link Config}
		 */
		configure(options?: Config): void;

		/**
		 * Uninitializes reveal.js by undoing changes made to the
		 * DOM and removing all event listeners.
		 */
		destroy(): void;

		/**
		 * Syncs the presentation with the current DOM. Useful
		 * when new slides or control elements are added or when
		 * the configuration has changed.
		 */
		sync(): void;

		/**
		 * Updates reveal.js to keep in sync with new slide attributes. For
		 * example, if you add a new `data-background-image` you can call
		 * this to have reveal.js render the new background image.
		 *
		 * Similar to #sync() but more efficient when you only need to
		 * refresh a specific slide.
		 *
		 * @param  slide
		 * @see {@link sync}
		 */
		syncSlide(slide: HTMLElement): void;

		/**
		 * Formats the fragments on the given slide so that they have
		 * valid indices. Call this if fragments are changed in the DOM
		 * after reveal.js has already initialized.
		 *
		 * @param slide
		 * @returns a list of the HTML fragments that were synced
		 */
		syncFragments(slide: HTMLElement): HTMLElement[];

		/**
		 * Steps from the current point in the presentation to the
		 * slide which matches the specified horizontal and vertical
		 * indices.
		 *
		 * @param horizontalIndex - Horizontal index of the target slide
		 * @param verticalIndex - Vertical index of the target slide
		 * @param fragmentIndex - Index of a fragment within the target slide to activate
		 * @param origin - Origin for use in multimaster environments
		 */
		slide(
			horizontalIndex?: number,
			verticalIndex?: number,
			fragmentIndex?: number,
			origin?: number
		): void;

		/**
		 * Navigate one step to the left
		 *
		 * @param params see {@link NavigateParams}
		 */
		left: NavigationFunction;

		/**
		 * Navigate one step to the right
		 *
		 * @param params see {@link NavigateParams}
		 */
		right: NavigationFunction;

		/**
		 * Navigate one step up
		 *
		 * @param params see {@link NavigateParams}
		 */
		up: NavigationFunction;

		/**
		 * Navigate one step down
		 *
		 * @param params see {@link NavigateParams}
		 */
		down: NavigationFunction;

		/**
		 * Navigates backwards, prioritized in the following order:
		 * 1) Previous fragment
		 * 2) Previous vertical slide
		 * 3) Previous horizontal slide
		 *
		 * @param params see {@link NavigateParams}
		 */
		prev: NavigationFunction;

		/**
		 * Navigates forwards, prioritized in the following order:
		 * 1) Next fragment
		 * 2) Next vertical slide
		 * 3) Next horizontal slide
		 *
		 * @param params see {@link NavigateParams}
		 */
		next: NavigationFunction;

		// Navigation aliases

		/**
		 * Alias for `left` see {@link left}
		 */
		navigateLeft: NavigationFunction;

		/**
		 * Alias for `right` see {@link right}
		 */
		navigateRight: NavigationFunction;

		/**
		 * Alias for `up` see {@link up}
		 */
		navigateUp: NavigationFunction;

		/**
		 * Alias for `down` see {@link down}
		 */
		navigateDown: NavigationFunction;

		/**
		 * Alias for `prev` see {@link prev}
		 */
		navigatePrev: NavigationFunction;

		/**
		 * Alias for `next` see {@link next}
		 */
		navigateNext: NavigationFunction;

		/**
		 * Navigate to the specified slide fragment.
		 *
		 * @param index - The index of the fragment that
		 * should be shown, -1 means all are invisible
		 * @param offset - Integer offset to apply to the
		 * fragment index
		 *
		 * @returns true if a change was made in any
		 * fragments visibility as part of this call
		 */
		navigateFragment(index?: number, offset?: number): boolean;

		/**
		 * Navigate to the previous slide fragment.
		 *
		 * @returns true if there was a previous fragment,
		 * false otherwise
		 */
		prevFragment(): boolean;

		/**
		 * Navigate to the next slide fragment.
		 *
		 * @returns true if there was a next fragment,
		 * false otherwise
		 */
		nextFragment(): boolean;

		/**
		 * Adds a listener to one of our custom reveal.js events,
		 * like slidechanged.
		 *
		 * @param type
		 * @param listener
		 * @param useCapture
		 */
		on: HTMLElement['addEventListener'];

		/**
		 * Unsubscribes from a reveal.js event.
		 *
		 * @param type
		 * @param listener
		 * @param useCapture
		 */
		off: HTMLElement['removeEventListener'];

		/**
		 * Legacy event binding methods left in for backwards compatibility
		 * Adds a listener to one of our custom reveal.js events,
		 * like slidechanged.
		 * See: {@link on}
		 *
		 * @param type
		 * @param listener
		 * @param useCapture
		 */
		addEventListener: HTMLElement['addEventListener'];

		/**
		 * Legacy event binding methods left in for backwards compatibility
		 * Unsubscribes from a reveal.js event.
		 * See: {@link off}
		 *
		 * @param type
		 * @param listener
		 * @param useCapture
		 */
		removeEventListener: HTMLElement['removeEventListener'];

		/**
		 * Applies JavaScript-controlled layout rules to the
		 * presentation.
		 */
		layout(): void;

		/**
		 * Randomly shuffles all slides in the deck.
		 */
		shuffle(slides?: HTMLElement[]): void;

		/**
		 * Determine what available routes there are for navigation.
		 *
		 * @param params - If includeFragments is set, a route will be considered
		 * available if either a slide OR a fragment is available in the given direction
		 *
		 * @returns Available route {left, right, up, down}
		 */
		availableRoutes(params?: { includeFragments?: boolean }): {
			down: boolean;
			left: boolean;
			right: boolean;
			up: boolean;
		};

		/**
		 * Returns an object describing the available fragment
		 * directions.
		 *
		 * @returns Available fragments {prev, next}
		 */
		availableFragments(): { prev: boolean; next: boolean };

		/**
		 * Open or close help overlay window.
		 *
		 * @param override - Flag which overrides the
		 * toggle logic and forcibly sets the desired state. True means
		 * help is open, false means it's closed.
		 */
		toggleHelp(override?: boolean): void;

		/**
		 * Toggles the slide overview mode on and off.
		 *
		 * @param override - Flag which overrides the
		 * toggle logic and forcibly sets the desired state. True means
		 * overview is open, false means it's closed.
		 */
		toggleOverview(override?: boolean): void;

		/**
		 * Toggles the paused mode on and off.
		 *
		 * @param override - Flag which overrides the
		 * toggle logic and forcibly sets the desired state.
		 */
		togglePause(override?: boolean): void;

		/**
		 * Toggles the auto slide mode on and off.
		 *
		 * @param override - Flag which sets the desired state.
		 * True means autoplay starts, false means it stops.
		 */
		toggleAutoSlide(override?: boolean): void;

		/**
		 * @returns true if we're currently on the first slide in
		 * the presentation.
		 */
		isFirstSlide(): boolean;

		/**
		 * @returns Returns true if we're currently on the last slide in
		 * the presentation. If the last slide is a stack, we only
		 * consider this the last slide if it's at the end of the
		 * stack.
		 */
		isLastSlide(): boolean;

		/**
		 * @returns true if we're on the last slide in the current
		 * vertical stack.
		 */
		isLastVerticalSlide(): boolean;

		/**
		 * Checks if the current or specified slide is vertical
		 * (nested within another slide).
		 *
		 * @param slide - the slide to check orientation of. Defaults to the current slide.
		 * @return true if the current or specified slide is vertical
		 */
		isVerticalSlide(slide?: HTMLElement): boolean;

		/**
		 * @returns true if we are currently in the paused mode.
		 */
		isPaused(): boolean;

		/**
		 * @returns true if the auto slide mode is currently on.
		 */
		isAutoSliding(): boolean;

		/**
		 * @returns true if this presentation is running inside of
		 * the speaker notes window.
		 */
		isSpeakerNotes(): boolean;

		/**
		 * @returns true if the overview is active, false otherwise
		 */
		isOverview(): boolean;

		/**
		 * Checks if the presentation is focused
		 *
		 * @returns true if the it is focused, false otherwise
		 */
		isFocused(): boolean;

		/**
		 * Checks if this reveal.js instance is being used to print a PDF.
		 *
		 * @returns true if being used to print a PDF, false otherwise
		 */
		isPrintingPDF(): boolean;

		/**
		 * Checks if reveal.js has been loaded and is ready for use
		 *
		 * @returns true if reveal.js is ready for use, false otherwise
		 */
		isReady(): boolean;

		/**
		 * Called when the given slide is within the configured view
		 * distance. Shows the slide element and loads any content
		 * that is set to load lazily (data-src).
		 *
		 * @param slide - Slide to show
		 */
		loadSlide(slide: HTMLElement, options?: { excludeIframes?: boolean }): void;

		/**
		 * Unloads and hides the given slide. This is called when the
		 * slide is moved outside of the configured view distance.
		 *
		 * @param slide
		 */
		unloadSlide(slide: HTMLElement): void;

		/**
		 * Opens a preview window for the target URL.
		 *
		 * @param url - url for preview iframe src
		 */
		showPreview(url: string): void;

		/**
		 * Closes any currently open overlay.
		 */
		hidePreview(): void;

		/**
		 * Binds all internal event listeners.
		 */
		addEventListeners(): void;

		/**
		 * Unbinds all internal event listeners.
		 */
		removeEventListeners(): void;

		/**
		 * Dispatches an event of the specified type from the
		 * reveal DOM element.
		 */
		dispatchEvent({
			target,
			type,
			data,
			bubbles,
		}: {
			/** `revealElement` by default */
			target?: HTMLElement;
			type: string;
			data: any;
			bubbles?: boolean;
		}): Event;

		/**
		 * Retrieves the current state of the presentation as
		 * an object. This state can then be restored at any
		 * time.
		 *
		 * @returns The current state - {indexh, indexv, indexf, paused, overview}
		 */
		getState(): RevealState;

		/**
		 * Restores the presentation to the given state.
		 *
		 * @param object - state as generated by getState()
		 * @see {@link getState} generates the parameter `state`
		 */
		setState(object: RevealState): void;

		/**
		 * Returns a value ranging from 0-1 that represents
		 * how far into the presentation we have navigated.
		 *
		 * @returns a value ranging from 0-1 that represents
		 * how far into the presentation we have navigated.
		 */
		getProgress(): number;

		/**
		 * Retrieves the h/v location and fragment of the current,
		 * or specified, slide.
		 *
		 * @param slide - if specified, the returned index will
		 * be for this slide rather than the currently active one
		 *
		 * @return h/v location and fragment of the current,
		 * or specified, slide. {h, v, f}
		 */
		getIndices(slide?: HTMLElement): { h: number; v: number; f: number };

		/**
		 * Returns an array of objects where each object represents the
		 * attributes on its respective slide.
		 *
		 * @returns an array of objects where each object represents the
		 * attributes on its respective slide.
		 */
		getSlidesAttributes(): Record<string, string>[];

		/**
		 * Returns the number of past slides. This can be used as a global
		 * flattened index for slides.
		 *
		 * @param [slide] - The slide we're counting before, defaults to current slide
		 *
		 * @returns Past slide count
		 */
		getSlidePastCount(slide?: HTMLElement): number;

		/**
		 * Retrieves the total number of slides in this presentation.
		 *
		 * @returns the total number of slides in this presentation.
		 */
		getTotalSlides(): number;

		/**
		 * Returns the slide element matching the specified index.
		 *
		 * @param x - slide index
		 * @param [y] - slide index
		 *
		 * @returns the slide element matching the specified index
		 */
		getSlide(x: number, y?: number): HTMLElement | undefined;

		/**
		 * Returns the previous slide element, may be null
		 *
		 * @returns the previous slide element, may be null
		 */
		getPreviousSlide(): HTMLElement | null;

		/**
		 * Returns the current slide element
		 *
		 * @returns the current slide element
		 */
		getCurrentSlide(): HTMLElement;

		/**
		 * Returns the background element for the given slide.
		 * All slides, even the ones with no background properties
		 * defined, have a background element so as long as the
		 * index is valid an element will be returned.
		 *
		 * @param element A slide
		 * @returns the background element for the given slide
		 */
		getSlideBackground(element: HTMLElement): HTMLElement | undefined;

		/**
		 * Returns the background element for the given slide.
		 * All slides, even the ones with no background properties
		 * defined, have a background element so as long as the
		 * index is valid an element will be returned.
		 *
		 * @param x - Horizontal background index OR a slide
		 * HTML element
		 * @param [y] - Vertical background index
		 * @returns the background element for the given slide
		 */
		getSlideBackground(x: number, y?: number): HTMLElement | undefined;

		/**
		 * Retrieves the speaker notes from a slide. Notes can be
		 * defined in two ways:
		 * 1. As a data-notes attribute on the slide <section>
		 * 2. As an <aside class="notes"> inside of the slide
		 *
		 * @param [slide] - defaults to current slide
		 * @returns the speaker notes from a slide
		 */
		getSlideNotes(slide?: HTMLElement): string | null;

		/**
		 * Retrieves all slides in this presentation.
		 *
		 * @returns all slides in this presentation
		 */
		getSlides(): HTMLElement[];

		/**
		 * Returns a list of all horizontal slides in the deck. Each
		 * vertical stack is included as one horizontal slide in the
		 * resulting array.
		 *
		 * @returns a list of all horizontal slides in the deck
		 */
		getHorizontalSlides(): HTMLElement[];

		/**
		 * Returns all vertical slides that exist within this deck.
		 *
		 * @returns all vertical slides that exist within this deck
		 */
		getVerticalSlides(): HTMLElement[];

		/**
		 * Returns true if there are at least two horizontal slides.
		 *
		 * @returns true if there are at least two horizontal slides
		 */
		hasHorizontalSlides(): boolean;

		/**
		 * Returns true if there are at least two vertical slides.
		 *
		 * @returns true if there are at least two vertical slides
		 */
		hasVerticalSlides(): boolean;

		/**
		 * Checks if the deck has navigated on either axis at least once
		 *
		 * @returns true if the deck has navigated on either horizontal axis
		 * at least once
		 */
		hasNavigatedHorizontally(): boolean;

		/**
		 * Checks if the deck has navigated on either axis at least once
		 *
		 * @returns true if the deck has navigated on either vertically axis
		 * at least once
		 */
		hasNavigatedVertically(): boolean;

		/**
		 * Add a custom key binding with optional description to
		 * be added to the help screen.
		 *
		 * @param binding
		 * @param callback
		 */
		addKeyBinding(
			keyCode: number | { keyCode: number; key: string; description: string },
			callback: string | ((event: KeyboardEvent) => void)
		): void;

		/**
		 * Removes the specified custom key binding.
		 *
		 * @param keyCode
		 */
		removeKeyBinding(keyCode: number): void;

		/**
		 * Programmatically triggers a keyboard event
		 *
		 * @param keyCode
		 */
		triggerKey(keyCode: number): void;

		/**
		 * Registers a new shortcut to include in the help overlay
		 *
		 * @param key
		 * @param value
		 */
		registerKeyboardShortcut(key: string, value: string): void;

		/**
		 * Calculates the computed pixel size of our slides. These
		 * values are based on the width and height configuration
		 * options.
		 *
		 * @param [presentationWidth=dom.wrapper.offsetWidth]
		 * @param [presentationHeight=dom.wrapper.offsetHeight]
		 * @returns the computed pixel size of the slides
		 */
		getComputedSlideSize(
			presentationWidth?: number,
			presentationHeight?: number
		): ComputedSlideSize;

		/**
		 * Returns the current scale of the presentation content
		 *
		 * @returns the current scale of the presentation content
		 */
		getScale(): number;

		/**
		 * Returns the current configuration object
		 *
		 * @returns the current configuration object
		 */
		getConfig(): Config;

		/**
		 * Returns a key:value hash of all query params.
		 *
		 * @returns a key:value hash of all query params
		 */
		getQueryHash(): Record<string, string>;

		/**
		 * Return a hash URL that will resolve to the given slide location.
		 *
		 * @param slide - the slide to link to
		 * @returns a hash URL that will resolve to the given slide location
		 */
		getSlidePath(slide?: HTMLElement): string;

		/**
		 * @returns reveal.js DOM element
		 */
		getRevealElement(): HTMLElement | null;

		/**
		 * @returns reveal.js DOM element
		 */
		getSlidesElement(): HTMLElement | null;

		/**
		 * @returns reveal.js DOM element
		 */
		getViewportElement(): HTMLElement | null;

		/**
		 * @returns reveal.js DOM element
		 */
		getBackgroundsElement(): HTMLDivElement | undefined;

		/**
		 * Registers a new plugin with this reveal.js instance.
		 *
		 * reveal.js waits for all registered plugins to initialize
		 * before considering itself ready, as long as the plugin
		 * is registered before calling `Reveal.initialize()`.
		 *
		 * @param plugin
		 */
		registerPlugin(plugin: Plugin): void;

		/**
		 * Checks if a specific plugin has been registered.
		 *
		 * @param id - unique plugin identifier
		 * @returns true if a specific plugin has been registered.
		 */
		hasPlugin(id: string): boolean;

		/**
		 * Returns the specific plugin instance, if a plugin
		 * with the given ID has been registered.
		 *
		 * @param id - unique plugin identifier
		 * @returns plugin instance
		 */
		getPlugin(id: string): Plugin | undefined;

		/**
		 * @returns id:plugin hash of all plugins
		 */
		getPlugins(): { [id: string]: Plugin };
	}

	/**
	 * Options for navigation
	 */
	interface NavigateParams {
		skipFragments?: boolean;
	}

	type NavigationFunction = (params?: NavigateParams) => void;

	/**
	 * Multiplex configuration
	 *
	 * @see {@link https://github.com/reveal/multiplex}
	 */
	interface MultiplexConfig {
		// Obtained from the socket.io server. Gives this (the master) control of the presentation
		secret: string | null;
		// Obtained from the socket.io server
		id: string;
		// Location of socket.io server
		url: string;
	}

	/**
	 * katex - Math Plugin configuration
	 *
	 * @see {@link https://github.com/reveal/revealjs.com/blob/master/src/math.md}
	 * @see {@link https://github.com/hakimel/reveal.js/blob/master/plugin/math/katex.js}
	 */
	interface KatexConfig {
		local?: string;
		version?: string;
		delimiters?: Array<{ left: string; right: string; display: boolean }>;
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
		tex?: { inlineMath?: any };
		options?: { skipHtmlTags: string[] };
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
	 * Reveal Dependency
	 *
	 * @see {@link https://revealjs.com/plugins/#dependencies}
	 */
	interface RevealDependency {
		src: string;
		async?: boolean;
		callback?: () => void;
		condition?: () => boolean;
	}

	interface ComputedSlideSize {
		width: number;
		height: number;
		presentationWidth: number;
		presentationHeight: number;
	}

	interface RevealState {
		indexh: number;
		indexv: number;
		indexf: number;
		paused: boolean;
		overview: boolean;

		/**
		 * URL of an iframe being previewed
		 */
		previewIframe?: string;

		/**
		 * URL of an image being previewed
		 */
		previewImage?: string;

		/**
		 * URL of a video being previewed
		 */
		previewVideo?: string;

		/**
		 * Fit mode of the previewed media
		 */
		previewFit?: 'none' | 'scale-down' | 'contain' | 'cover';
	}

	// NOTE: it is possible to extend type definitions depend on the plugin
	/**
	 * Reveal Plugin
	 *
	 * @see {@link https://revealjs.com/creating-plugins/}
	 */
	interface Plugin {
		id: string;
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		init?(reveal: Api): void | Promise<any>;
		destroy?(): void;
	}

	interface PluginFunction {
		(): Plugin;
	}
}