# reveal.js [![Build Status](https://travis-ci.org/hakimel/reveal.js.svg?branch=master)](https://travis-ci.org/hakimel/reveal.js) <a href="https://slides.com?ref=github"><img src="https://s3.amazonaws.com/static.slid.es/images/slides-github-banner-320x40.png?1" alt="Slides" width="160" height="20"></a>

A framework for easily creating beautiful presentations using HTML. [Check out the live demo](http://revealjs.com/).

reveal.js comes with a broad range of features including [nested slides](https://github.com/hakimel/reveal.js#markup), [Markdown contents](https://github.com/hakimel/reveal.js#markdown), [PDF export](https://github.com/hakimel/reveal.js#pdf-export), [speaker notes](https://github.com/hakimel/reveal.js#speaker-notes) and a [JavaScript API](https://github.com/hakimel/reveal.js#api). There's also a fully featured visual editor and platform for sharing reveal.js presentations at [slides.com](https://slides.com?ref=github).


## Table of contents

- [Online Editor](#online-editor)
- [Installation](#installation)
  - [Basic setup](#basic-setup)
  - [Full setup](#full-setup)
  - [Folder Structure](#folder-structure)
- [Instructions](#instructions)
  - [Markup](#markup)
  - [Markdown](#markdown)
  - [Element Attributes](#element-attributes)
  - [Slide Attributes](#slide-attributes)
- [Configuration](#configuration)
- [Presentation Size](#presentation-size)
- [Dependencies](#dependencies)
- [Ready Event](#ready-event)
- [Auto-sliding](#auto-sliding)
- [Keyboard Bindings](#keyboard-bindings)
- [Touch Navigation](#touch-navigation)
- [Lazy Loading](#lazy-loading)
- [API](#api)
  - [Slide Changed Event](#slide-changed-event)
  - [Presentation State](#presentation-state)
  - [Slide States](#slide-states)
  - [Slide Backgrounds](#slide-backgrounds)
  - [Parallax Background](#parallax-background)
  - [Slide Transitions](#slide-transitions)
  - [Internal links](#internal-links)
  - [Fragments](#fragments)
  - [Fragment events](#fragment-events)
  - [Code syntax highlighting](#code-syntax-highlighting)
  - [Slide number](#slide-number)
  - [Overview mode](#overview-mode)
  - [Fullscreen mode](#fullscreen-mode)
  - [Embedded media](#embedded-media)
  - [Stretching elements](#stretching-elements)
  - [postMessage API](#postmessage-api)
- [PDF Export](#pdf-export)
- [Theming](#theming)
- [Speaker Notes](#speaker-notes)
  - [Share and Print Speaker Notes](#share-and-print-speaker-notes)
  - [Server Side Speaker Notes](#server-side-speaker-notes)
- [Multiplexing](#multiplexing)
  - [Master presentation](#master-presentation)
  - [Client presentation](#client-presentation)
  - [Socket.io server](#socketio-server)
- [MathJax](#mathjax)
- [License](#license)

#### More reading

- [Changelog](https://github.com/hakimel/reveal.js/releases): Up-to-date version history.
- [Examples](https://github.com/hakimel/reveal.js/wiki/Example-Presentations): Presentations created with reveal.js, add your own!
- [Browser Support](https://github.com/hakimel/reveal.js/wiki/Browser-Support): Explanation of browser support and fallbacks.
- [Plugins](https://github.com/hakimel/reveal.js/wiki/Plugins,-Tools-and-Hardware): A list of plugins that can be used to extend reveal.js.


## Online Editor

Presentations are written using HTML or Markdown but there's also an online editor for those of you who prefer a graphical interface. Give it a try at [https://slides.com](https://slides.com?ref=github).


## Installation

The **basic setup** is for authoring presentations only. The **full setup** gives you access to all reveal.js features and plugins such as speaker notes as well as the development tasks needed to make changes to the source.

### Basic setup

The core of reveal.js is very easy to install. You'll simply need to download a copy of this repository and open the index.html file directly in your browser.

1. Download the latest version of reveal.js from <https://github.com/hakimel/reveal.js/releases>
2. Unzip and replace the example contents in index.html with your own
3. Open index.html in a browser to view it

### Full setup

Some reveal.js features, like external Markdown and speaker notes, require that presentations run from a local web server. The following instructions will set up such a server as well as all of the development tasks needed to make edits to the reveal.js source code.

1. Install [Node.js](http://nodejs.org/) (4.0.0 or later)

1. Clone the reveal.js repository
   ```sh
   $ git clone https://github.com/hakimel/reveal.js.git
   ```

1. Navigate to the reveal.js folder
   ```sh
   $ cd reveal.js
   ```

1. Install dependencies
   ```sh
   $ npm install
   ```

1. Serve the presentation and monitor source files for changes
   ```sh
   $ npm start
   ```

1. Open <http://localhost:8000> to view your presentation

   You can change the port by using `npm start -- --port=8001`.

### Folder Structure

- **css/** Core styles without which the project does not function
- **js/** Like above but for JavaScript
- **plugin/** Components that have been developed as extensions to reveal.js
- **lib/** All other third party assets (JavaScript, CSS, fonts)


## Instructions

### Markup

Here's a barebones example of a fully working reveal.js presentation:
```html
<html>
	<head>
		<link rel="stylesheet" href="css/reveal.css">
		<link rel="stylesheet" href="css/theme/white.css">
	</head>
	<body>
		<div class="reveal">
			<div class="slides">
				<section>Slide 1</section>
				<section>Slide 2</section>
			</div>
		</div>
		<script src="js/reveal.js"></script>
		<script>
			Reveal.initialize();
		</script>
	</body>
</html>
```

The presentation markup hierarchy needs to be `.reveal > .slides > section` where the `section` represents one slide and can be repeated indefinitely. If you place multiple `section` elements inside of another `section` they will be shown as vertical slides. The first of the vertical slides is the "root" of the others (at the top), and will be included in the horizontal sequence. For example:

```html
<div class="reveal">
	<div class="slides">
		<section>Single Horizontal Slide</section>
		<section>
			<section>Vertical Slide 1</section>
			<section>Vertical Slide 2</section>
		</section>
	</div>
</div>
```

### Markdown

It's possible to write your slides using Markdown. To enable Markdown, add the `data-markdown` attribute to your `<section>` elements and wrap the contents in a `<textarea data-template>` like the example below. You'll also need to add the `plugin/markdown/marked.js` and `plugin/markdown/markdown.js` scripts (in that order) to your HTML file.

This is based on [data-markdown](https://gist.github.com/1343518) from [Paul Irish](https://github.com/paulirish) modified to use [marked](https://github.com/chjj/marked) to support [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown). Sensitive to indentation (avoid mixing tabs and spaces) and line breaks (avoid consecutive breaks).

```html
<section data-markdown>
	<textarea data-template>
		## Page title

		A paragraph with some text and a [link](http://hakim.se).
	</textarea>
</section>
```

#### External Markdown

You can write your content as a separate file and have reveal.js load it at runtime. Note the separator arguments which determine how slides are delimited in the external file: the `data-separator` attribute defines a regular expression for horizontal slides (defaults to `^\r?\n---\r?\n$`, a newline-bounded horizontal rule)  and `data-separator-vertical` defines vertical slides (disabled by default). The `data-separator-notes` attribute is a regular expression for specifying the beginning of the current slide's speaker notes (defaults to `notes?:`, so it will match both "note:" and "notes:"). The `data-charset` attribute is optional and specifies which charset to use when loading the external file.

When used locally, this feature requires that reveal.js [runs from a local web server](#full-setup).  The following example customises all available options:

```html
<section data-markdown="example.md"
         data-separator="^\n\n\n"
         data-separator-vertical="^\n\n"
         data-separator-notes="^Note:"
         data-charset="iso-8859-15">
    <!--
        Note that Windows uses `\r\n` instead of `\n` as its linefeed character.
        For a regex that supports all operating systems, use `\r?\n` instead of `\n`.
    -->
</section>
```

#### Element Attributes

Special syntax (through HTML comments) is available for adding attributes to Markdown elements. This is useful for fragments, amongst other things.

```html
<section data-markdown>
	<script type="text/template">
		- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
		- Item 2 <!-- .element: class="fragment" data-fragment-index="1" -->
	</script>
</section>
```

#### Slide Attributes

Special syntax (through HTML comments) is available for adding attributes to the slide `<section>` elements generated by your Markdown.

```html
<section data-markdown>
	<script type="text/template">
	<!-- .slide: data-background="#ff0000" -->
		Markdown content
	</script>
</section>
```

#### Configuring *marked*

We use [marked](https://github.com/chjj/marked) to parse Markdown. To customise marked's rendering, you can pass in options when [configuring Reveal](#configuration):

```javascript
Reveal.initialize({
	// Options which are passed into marked
	// See https://github.com/chjj/marked#options-1
	markdown: {
		smartypants: true
	}
});
```

### Configuration

At the end of your page you need to initialize reveal by running the following code. Note that all configuration values are optional and will default to the values specified below.

```javascript
Reveal.initialize({

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
	slideNumber: false,

	// Push each slide change to the browser history
	history: false,

	// Enable keyboard shortcuts for navigation
	keyboard: true,

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

	// Randomizes the order of slides each time the presentation loads
	shuffle: false,

	// Turns fragments on and off globally
	fragments: true,

	// Flags whether to include the current fragment in the URL,
	// so that reloading brings you to the same fragment position
	fragmentInURL: false,

	// Flags if the presentation is running in an embedded mode,
	// i.e. contained within a limited portion of the screen
	embedded: false,

	// Flags if we should show a help overlay when the questionmark
	// key is pressed
	help: true,

	// Flags if speaker notes should be visible to all viewers
	showNotes: false,

	// Global override for autoplaying embedded media (video/audio/iframe)
	// - null: Media will only autoplay if data-autoplay is present
	// - true: All media will autoplay, regardless of individual setting
	// - false: No media will autoplay, regardless of individual setting
	autoPlayMedia: null,

	// Number of milliseconds between automatically proceeding to the
	// next slide, disabled when set to 0, this value can be overwritten
	// by using a data-autoslide attribute on your slides
	autoSlide: 0,

	// Stop auto-sliding after user input
	autoSlideStoppable: true,

	// Use this method for navigation when auto-sliding
	autoSlideMethod: Reveal.navigateNext,

	// Specify the average time in seconds that you think you will spend
	// presenting each slide. This is used to show a pacing timer in the
	// speaker view
	defaultTiming: 120,

	// Enable slide navigation via mouse wheel
	mouseWheel: false,

	// Hides the address bar on mobile devices
	hideAddressBar: true,

	// Opens links in an iframe preview overlay
	// Add `data-preview-link` and `data-preview-link="false"` to customise each link
	// individually
	previewLinks: false,

	// Transition style
	transition: 'slide', // none/fade/slide/convex/concave/zoom

	// Transition speed
	transitionSpeed: 'default', // default/fast/slow

	// Transition style for full page slide backgrounds
	backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

	// Number of slides away from the current that are visible
	viewDistance: 3,

	// Parallax background image
	parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

	// Parallax background size
	parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

	// Number of pixels to move the parallax background per slide
	// - Calculated automatically unless specified
	// - Set to 0 to disable movement along an axis
	parallaxBackgroundHorizontal: null,
	parallaxBackgroundVertical: null,

	// The display mode that will be used to show slides
	display: 'block'

});
```

The configuration can be updated after initialization using the `configure` method:

```javascript
// Turn autoSlide off
Reveal.configure({ autoSlide: 0 });

// Start auto-sliding every 5s
Reveal.configure({ autoSlide: 5000 });
```

### Presentation Size

All presentations have a normal size, that is, the resolution at which they are authored. The framework will automatically scale presentations uniformly based on this size to ensure that everything fits on any given display or viewport.

See below for a list of configuration options related to sizing, including default values:

```javascript
Reveal.initialize({

	// ...

	// The "normal" size of the presentation, aspect ratio will be preserved
	// when the presentation is scaled to fit different resolutions. Can be
	// specified using percentage units.
	width: 960,
	height: 700,

	// Factor of the display size that should remain empty around the content
	margin: 0.1,

	// Bounds for smallest/largest possible scale to apply to content
	minScale: 0.2,
	maxScale: 1.5

});
```

If you wish to disable this behavior and do your own scaling (e.g. using media queries), try these settings:

```javascript
Reveal.initialize({

	// ...

	width: "100%",
	height: "100%",
	margin: 0,
	minScale: 1,
	maxScale: 1
});
```

### Dependencies

Reveal.js doesn't _rely_ on any third party scripts to work but a few optional libraries are included by default. These libraries are loaded as dependencies in the order they appear, for example:

```javascript
Reveal.initialize({
	dependencies: [
		// Cross-browser shim that fully implements classList - https://github.com/eligrey/classList.js/
		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },

		// Interpret Markdown in <section> elements
		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

		// Syntax highlight for <code> elements
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },

		// Zoom in and out with Alt+click
		{ src: 'plugin/zoom-js/zoom.js', async: true },

		// Speaker notes
		{ src: 'plugin/notes/notes.js', async: true },

		// MathJax
		{ src: 'plugin/math/math.js', async: true }
	]
});
```

You can add your own extensions using the same syntax. The following properties are available for each dependency object:
- **src**: Path to the script to load
- **async**: [optional] Flags if the script should load after reveal.js has started, defaults to false
- **callback**: [optional] Function to execute when the script has loaded
- **condition**: [optional] Function which must return true for the script to be loaded

To load these dependencies, reveal.js requires [head.js](http://headjs.com/) *(a script loading library)* to be loaded before reveal.js.

### Ready Event

A `ready` event is fired when reveal.js has loaded all non-async dependencies and is ready to start navigating. To check if reveal.js is already 'ready' you can call `Reveal.isReady()`.

```javascript
Reveal.addEventListener( 'ready', function( event ) {
	// event.currentSlide, event.indexh, event.indexv
} );
```

Note that we also add a `.ready` class to the `.reveal` element so that you can hook into this with CSS.

### Auto-sliding

Presentations can be configured to progress through slides automatically, without any user input. To enable this you will need to tell the framework how many milliseconds it should wait between slides:

```javascript
// Slide every five seconds
Reveal.configure({
  autoSlide: 5000
});
```

When this is turned on a control element will appear that enables users to pause and resume auto-sliding. Alternatively, sliding can be paused or resumed by pressing »A« on the keyboard. Sliding is paused automatically as soon as the user starts navigating. You can disable these controls by specifying `autoSlideStoppable: false` in your reveal.js config.

You can also override the slide duration for individual slides and fragments by using the `data-autoslide` attribute:

```html
<section data-autoslide="2000">
	<p>After 2 seconds the first fragment will be shown.</p>
	<p class="fragment" data-autoslide="10000">After 10 seconds the next fragment will be shown.</p>
	<p class="fragment">Now, the fragment is displayed for 2 seconds before the next slide is shown.</p>
</section>
```

To override the method used for navigation when auto-sliding, you can specify the `autoSlideMethod` setting. To only navigate along the top layer and ignore vertical slides, set this to `Reveal.navigateRight`.

Whenever the auto-slide mode is resumed or paused the `autoslideresumed` and `autoslidepaused` events are fired.

### Keyboard Bindings

If you're unhappy with any of the default keyboard bindings you can override them using the `keyboard` config option:

```javascript
Reveal.configure({
  keyboard: {
    13: 'next', // go to the next slide when the ENTER key is pressed
    27: function() {}, // do something custom when ESC is pressed
    32: null // don't do anything when SPACE is pressed (i.e. disable a reveal.js default binding)
  }
});
```

### Touch Navigation

You can swipe to navigate through a presentation on any touch-enabled device. Horizontal swipes change between horizontal slides, vertical swipes change between vertical slides. If you wish to disable this you can set the `touch` config option to false when initializing reveal.js.

If there's some part of your content that needs to remain accessible to touch events you'll need to highlight this by adding a `data-prevent-swipe` attribute to the element. One common example where this is useful is elements that need to be scrolled.

### Lazy Loading

When working on presentation with a lot of media or iframe content it's important to load lazily. Lazy loading means that reveal.js will only load content for the few slides nearest to the current slide. The number of slides that are preloaded is determined by the `viewDistance` configuration option.

To enable lazy loading all you need to do is change your `src` attributes to `data-src` as shown below. This is supported for image, video, audio and iframe elements. Lazy loaded iframes will also unload when the containing slide is no longer visible.

```html
<section>
  <img data-src="image.png">
  <iframe data-src="http://hakim.se"></iframe>
  <video>
    <source data-src="video.webm" type="video/webm" />
    <source data-src="video.mp4" type="video/mp4" />
  </video>
</section>
```

### API

The `Reveal` object exposes a JavaScript API for controlling navigation and reading state:

```javascript
// Navigation
Reveal.slide( indexh, indexv, indexf );
Reveal.left();
Reveal.right();
Reveal.up();
Reveal.down();
Reveal.prev();
Reveal.next();
Reveal.prevFragment();
Reveal.nextFragment();

// Randomize the order of slides
Reveal.shuffle();

// Toggle presentation states, optionally pass true/false to force on/off
Reveal.toggleOverview();
Reveal.togglePause();
Reveal.toggleAutoSlide();

// Shows a help overlay with keyboard shortcuts, optionally pass true/false
// to force on/off
Reveal.toggleHelp();

// Change a config value at runtime
Reveal.configure({ controls: true });

// Returns the present configuration options
Reveal.getConfig();

// Fetch the current scale of the presentation
Reveal.getScale();

// Retrieves the previous and current slide elements
Reveal.getPreviousSlide();
Reveal.getCurrentSlide();

Reveal.getIndices();        // { h: 0, v: 0, f: 0 }
Reveal.getSlidePastCount();
Reveal.getProgress();       // (0 == first slide, 1 == last slide)
Reveal.getSlides();         // Array of all slides
Reveal.getTotalSlides();    // Total number of slides

// Returns the speaker notes for the current slide
Reveal.getSlideNotes();

// State checks
Reveal.isFirstSlide();
Reveal.isLastSlide();
Reveal.isOverview();
Reveal.isPaused();
Reveal.isAutoSliding();
```

### Custom Key Bindings

Custom key bindings can be added and removed using the following Javascript API. Custom key bindings will override the default keyboard bindings, but will in turn be overridden by the user defined bindings in the ``keyboard`` config option.

```javascript
Reveal.addKeyBinding( binding, callback );
Reveal.removeKeyBinding( keyCode );
```

For example

```javascript
// The binding parameter provides the following properties
//      keyCode: the keycode for binding to the callback
//          key: the key label to show in the help overlay
//  description: the description of the action to show in the help overlay
Reveal.addKeyBinding( { keyCode: 84, key: 'T', description: 'Start timer' }, function() {
	// start timer
} )

// The binding parameter can also be a direct keycode without providing the help description
Reveal.addKeyBinding( 82, function() {
	// reset timer
} )
```

This allows plugins to add key bindings directly to Reveal so they can

* make use of Reveal's pre-processing logic for key handling (for example, ignoring key presses when paused); and
* be included in the help overlay (optional)

### Slide Changed Event

A `slidechanged` event is fired each time the slide is changed (regardless of state). The event object holds the index values of the current slide as well as a reference to the previous and current slide HTML nodes.

Some libraries, like MathJax (see [#226](https://github.com/hakimel/reveal.js/issues/226#issuecomment-10261609)), get confused by the transforms and display states of slides. Often times, this can be fixed by calling their update or render function from this callback.

```javascript
Reveal.addEventListener( 'slidechanged', function( event ) {
	// event.previousSlide, event.currentSlide, event.indexh, event.indexv
} );
```

### Presentation State

The presentation's current state can be fetched by using the `getState` method. A state object contains all of the information required to put the presentation back as it was when `getState` was first called. Sort of like a snapshot. It's a simple object that can easily be stringified and persisted or sent over the wire.

```javascript
Reveal.slide( 1 );
// we're on slide 1

var state = Reveal.getState();

Reveal.slide( 3 );
// we're on slide 3

Reveal.setState( state );
// we're back on slide 1
```

### Slide States

If you set `data-state="somestate"` on a slide `<section>`, "somestate" will be applied as a class on the document element when that slide is opened. This allows you to apply broad style changes to the page based on the active slide.

Furthermore you can also listen to these changes in state via JavaScript:

```javascript
Reveal.addEventListener( 'somestate', function() {
	// TODO: Sprinkle magic
}, false );
```

### Slide Backgrounds

Slides are contained within a limited portion of the screen by default to allow them to fit any display and scale uniformly. You can apply full page backgrounds outside of the slide area by adding a `data-background` attribute to your `<section>` elements. Four different types of backgrounds are supported: color, image, video and iframe.

#### Color Backgrounds

All CSS color formats are supported, including hex values, keywords, `rgba()` or `hsl()`.

```html
<section data-background-color="#ff0000">
	<h2>Color</h2>
</section>
```

#### Image Backgrounds

By default, background images are resized to cover the full page. Available options:

| Attribute                        | Default    | Description |
| :------------------------------- | :--------- | :---------- |
| data-background-image            |            | URL of the image to show. GIFs restart when the slide opens. |
| data-background-size             | cover      | See [background-size](https://developer.mozilla.org/docs/Web/CSS/background-size) on MDN.  |
| data-background-position         | center     | See [background-position](https://developer.mozilla.org/docs/Web/CSS/background-position) on MDN. |
| data-background-repeat           | no-repeat  | See [background-repeat](https://developer.mozilla.org/docs/Web/CSS/background-repeat) on MDN. |
| data-background-opacity          | 1          | Opacity of the background image on a 0-1 scale. 0 is transparent and 1 is fully opaque. |

```html
<section data-background-image="http://example.com/image.png">
	<h2>Image</h2>
</section>
<section data-background-image="http://example.com/image.png" data-background-size="100px" data-background-repeat="repeat">
	<h2>This background image will be sized to 100px and repeated</h2>
</section>
```

#### Video Backgrounds

Automatically plays a full size video behind the slide.

| Attribute                        | Default | Description |
| :---------------------------     | :------ | :---------- |
| data-background-video            |         | A single video source, or a comma separated list of video sources. |
| data-background-video-loop       | false   | Flags if the video should play repeatedly. |
| data-background-video-muted      | false   | Flags if the audio should be muted. |
| data-background-size             | cover   | Use `cover` for full screen and some cropping or `contain` for letterboxing. |
| data-background-opacity          | 1       | Opacity of the background video on a 0-1 scale. 0 is transparent and 1 is fully opaque. |

```html
<section data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4,https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.webm" data-background-video-loop data-background-video-muted>
	<h2>Video</h2>
</section>
```

#### Iframe Backgrounds

Embeds a web page as a slide background that covers 100% of the reveal.js width and height. The iframe is in the background layer, behind your slides, and as such it's not possible to interact with it by default. To make your background interactive, you can add the `data-background-interactive` attribute.

```html
<section data-background-iframe="https://slides.com" data-background-interactive>
	<h2>Iframe</h2>
</section>
```

#### Background Transitions

Backgrounds transition using a fade animation by default. This can be changed to a linear sliding transition by passing `backgroundTransition: 'slide'` to the `Reveal.initialize()` call. Alternatively you can set `data-background-transition` on any section with a background to override that specific transition.


### Parallax Background

If you want to use a parallax scrolling background, set the first two properties below when initializing reveal.js (the other two are optional).

```javascript
Reveal.initialize({

	// Parallax background image
	parallaxBackgroundImage: '', // e.g. "https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg"

	// Parallax background size
	parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px" - currently only pixels are supported (don't use % or auto)

	// Number of pixels to move the parallax background per slide
	// - Calculated automatically unless specified
	// - Set to 0 to disable movement along an axis
	parallaxBackgroundHorizontal: 200,
	parallaxBackgroundVertical: 50

});
```

Make sure that the background size is much bigger than screen size to allow for some scrolling. [View example](http://revealjs.com/?parallaxBackgroundImage=https%3A%2F%2Fs3.amazonaws.com%2Fhakim-static%2Freveal-js%2Freveal-parallax-1.jpg&parallaxBackgroundSize=2100px%20900px).

### Slide Transitions

The global presentation transition is set using the `transition` config value. You can override the global transition for a specific slide by using the `data-transition` attribute:

```html
<section data-transition="zoom">
	<h2>This slide will override the presentation transition and zoom!</h2>
</section>

<section data-transition-speed="fast">
	<h2>Choose from three transition speeds: default, fast or slow!</h2>
</section>
```

You can also use different in and out transitions for the same slide:

```html
<section data-transition="slide">
    The train goes on …
</section>
<section data-transition="slide">
    and on …
</section>
<section data-transition="slide-in fade-out">
    and stops.
</section>
<section data-transition="fade-in slide-out">
    (Passengers entering and leaving)
</section>
<section data-transition="slide">
    And it starts again.
</section>
```
You can choose from `none`, `fade`, `slide`, `convex`, `concave` and `zoom`.
### Internal links

It's easy to link between slides. The first example below targets the index of another slide whereas the second targets a slide with an ID attribute (`<section id="some-slide">`):

```html
<a href="#/2/2">Link</a>
<a href="#/some-slide">Link</a>
```

You can also add relative navigation links, similar to the built in reveal.js controls, by appending one of the following classes on any element. Note that each element is automatically given an `enabled` class when it's a valid navigation route based on the current slide.

```html
<a href="#" class="navigate-left">
<a href="#" class="navigate-right">
<a href="#" class="navigate-up">
<a href="#" class="navigate-down">
<a href="#" class="navigate-prev"> <!-- Previous vertical or horizontal slide -->
<a href="#" class="navigate-next"> <!-- Next vertical or horizontal slide -->
```

### Fragments

Fragments are used to highlight individual elements on a slide. Every element with the class `fragment` will be stepped through before moving on to the next slide. Here's an example: http://revealjs.com/#/fragments

The default fragment style is to start out invisible and fade in. This style can be changed by appending a different class to the fragment:

```html
<section>
	<p class="fragment grow">grow</p>
	<p class="fragment shrink">shrink</p>
	<p class="fragment fade-out">fade-out</p>
	<p class="fragment fade-up">fade-up (also down, left and right!)</p>
	<p class="fragment fade-in-then-out">fades in, then out when we move to the next step</p>
	<p class="fragment fade-in-then-semi-out">fades in, then obfuscate when we move to the next step</p>
	<p class="fragment highlight-current-blue">blue only once</p>
	<p class="fragment highlight-red">highlight-red</p>
	<p class="fragment highlight-green">highlight-green</p>
	<p class="fragment highlight-blue">highlight-blue</p>
</section>
```

Multiple fragments can be applied to the same element sequentially by wrapping it, this will fade in the text on the first step and fade it back out on the second.

```html
<section>
	<span class="fragment fade-in">
		<span class="fragment fade-out">I'll fade in, then out</span>
	</span>
</section>
```

The display order of fragments can be controlled using the `data-fragment-index` attribute.

```html
<section>
	<p class="fragment" data-fragment-index="3">Appears last</p>
	<p class="fragment" data-fragment-index="1">Appears first</p>
	<p class="fragment" data-fragment-index="2">Appears second</p>
</section>
```

### Fragment events

When a slide fragment is either shown or hidden reveal.js will dispatch an event.

Some libraries, like MathJax (see #505), get confused by the initially hidden fragment elements. Often times this can be fixed by calling their update or render function from this callback.

```javascript
Reveal.addEventListener( 'fragmentshown', function( event ) {
	// event.fragment = the fragment DOM element
} );
Reveal.addEventListener( 'fragmenthidden', function( event ) {
	// event.fragment = the fragment DOM element
} );
```

### Code syntax highlighting

By default, Reveal is configured with [highlight.js](https://highlightjs.org/) for code syntax highlighting. To enable syntax highlighting, you'll have to load the highlight plugin ([plugin/highlight/highlight.js](plugin/highlight/highlight.js)) and a highlight.js CSS theme (Reveal comes packaged with the zenburn theme: [lib/css/zenburn.css](lib/css/zenburn.css)).

```javascript
Reveal.initialize({
	// More info https://github.com/hakimel/reveal.js#dependencies
	dependencies: [
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
	]
});
```

Below is an example with clojure code that will be syntax highlighted. When the `data-trim` attribute is present, surrounding whitespace is automatically removed.  HTML will be escaped by default. To avoid this, for example if you are using `<mark>` to call out a line of code, add the `data-noescape` attribute to the `<code>` element.

```html
<section>
	<pre><code data-trim data-noescape>
(def lazy-fib
  (concat
   [0 1]
   <mark>((fn rfib [a b]</mark>
        (lazy-cons (+ a b) (rfib b (+ a b)))) 0 1)))
	</code></pre>
</section>
```

### Slide number

If you would like to display the page number of the current slide you can do so using the `slideNumber` and `showSlideNumber` configuration values.

```javascript
// Shows the slide number using default formatting
Reveal.configure({ slideNumber: true });

// Slide number formatting can be configured using these variables:
//  "h.v": 	horizontal . vertical slide number (default)
//  "h/v": 	horizontal / vertical slide number
//    "c": 	flattened slide number
//  "c/t": 	flattened slide number / total slides
Reveal.configure({ slideNumber: 'c/t' });

// Control which views the slide number displays on using the "showSlideNumber" value:
//     "all": show on all views (default)
// "speaker": only show slide numbers on speaker notes view
//   "print": only show slide numbers when printing to PDF
Reveal.configure({ showSlideNumber: 'speaker' });
```

### Overview mode

Press »ESC« or »O« keys to toggle the overview mode on and off. While you're in this mode, you can still navigate between slides,
as if you were at 1,000 feet above your presentation. The overview mode comes with a few API hooks:

```javascript
Reveal.addEventListener( 'overviewshown', function( event ) { /* ... */ } );
Reveal.addEventListener( 'overviewhidden', function( event ) { /* ... */ } );

// Toggle the overview mode programmatically
Reveal.toggleOverview();
```

### Fullscreen mode

Just press »F« on your keyboard to show your presentation in fullscreen mode. Press the »ESC« key to exit fullscreen mode.

### Embedded media

Add `data-autoplay` to your media element if you want it to automatically start playing when the slide is shown:

```html
<video data-autoplay src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
```

If you want to enable or disable autoplay globally, for all embedded media, you can use the `autoPlayMedia` configuration option. If you set this to `true` ALL media will autoplay regardless of individual `data-autoplay` attributes. If you initialize with `autoPlayMedia: false` NO media will autoplay.

Note that embedded HTML5 `<video>`/`<audio>` and YouTube/Vimeo iframes are automatically paused when you navigate away from a slide. This can be disabled by decorating your element with a `data-ignore` attribute.

### Embedded iframes

reveal.js automatically pushes two [post messages](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage) to embedded iframes. `slide:start` when the slide containing the iframe is made visible and `slide:stop` when it is hidden.

### Stretching elements

Sometimes it's desirable to have an element, like an image or video, stretch to consume as much space as possible within a given slide. This can be done by adding the `.stretch` class to an element as seen below:

```html
<section>
	<h2>This video will use up the remaining space on the slide</h2>
    <video class="stretch" src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
</section>
```

Limitations:
- Only direct descendants of a slide section can be stretched
- Only one descendant per slide section can be stretched

### postMessage API

The framework has a built-in postMessage API that can be used when communicating with a presentation inside of another window. Here's an example showing how you'd make a reveal.js instance in the given window proceed to slide 2:

```javascript
<window>.postMessage( JSON.stringify({ method: 'slide', args: [ 2 ] }), '*' );
```

When reveal.js runs inside of an iframe it can optionally bubble all of its events to the parent. Bubbled events are stringified JSON with three fields: namespace, eventName and state. Here's how you subscribe to them from the parent window:

```javascript
window.addEventListener( 'message', function( event ) {
	var data = JSON.parse( event.data );
	if( data.namespace === 'reveal' && data.eventName ==='slidechanged' ) {
		// Slide changed, see data.state for slide number
	}
} );
```

This cross-window messaging can be toggled on or off using configuration flags.

```javascript
Reveal.initialize({
	// ...

	// Exposes the reveal.js API through window.postMessage
	postMessage: true,

	// Dispatches all reveal.js events to the parent window through postMessage
	postMessageEvents: false
});
```


## PDF Export

Presentations can be exported to PDF via a special print stylesheet. This feature requires that you use [Google Chrome](http://google.com/chrome) or [Chromium](https://www.chromium.org/Home) and to be serving the presentation from a webserver.
Here's an example of an exported presentation that's been uploaded to SlideShare: http://www.slideshare.net/hakimel/revealjs-300.

### Separate pages for fragments
[Fragments](#fragments) are printed on separate slides by default. Meaning if you have a slide with three fragment steps, it will generate three separate slides where the fragments appear incrementally.

If you prefer printing all fragments in their visible states on the same slide you can set the `pdfSeparateFragments` config option to false.

### Page size

Export dimensions are inferred from the configured [presentation size](#presentation-size). Slides that are too tall to fit within a single page will expand onto multiple pages. You can limit how many pages a slide may expand onto using the `pdfMaxPagesPerSlide` config option, for example `Reveal.configure({ pdfMaxPagesPerSlide: 1 })` ensures that no slide ever grows to more than one printed page.

### Print stylesheet

To enable the PDF print capability in your presentation, the special print stylesheet at [/css/print/pdf.css](https://github.com/hakimel/reveal.js/blob/master/css/print/pdf.css) must be loaded. The default index.html file handles this for you when `print-pdf` is included in the query string. If you're using a different HTML template, you can add this to your HEAD:

```html
<script>
	var link = document.createElement( 'link' );
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
	document.getElementsByTagName( 'head' )[0].appendChild( link );
</script>
```

### Instructions

1. Open your presentation with `print-pdf` included in the query string i.e. http://localhost:8000/?print-pdf. You can test this with [revealjs.com?print-pdf](http://revealjs.com?print-pdf).
  * If you want to include [speaker notes](#speaker-notes) in your export, you can append `showNotes=true` to the query string: http://localhost:8000/?print-pdf&showNotes=true
1. Open the in-browser print dialog (CTRL/CMD+P).
1. Change the **Destination** setting to **Save as PDF**.
1. Change the **Layout** to **Landscape**.
1. Change the **Margins** to **None**.
1. Enable the **Background graphics** option.
1. Click **Save**.

![Chrome Print Settings](https://s3.amazonaws.com/hakim-static/reveal-js/pdf-print-settings-2.png)

Alternatively you can use the [decktape](https://github.com/astefanutti/decktape) project.


## Theming

The framework comes with a few different themes included:

- black: Black background, white text, blue links (default theme)
- white: White background, black text, blue links
- league: Gray background, white text, blue links (default theme for reveal.js < 3.0.0)
- beige: Beige background, dark text, brown links
- sky: Blue background, thin dark text, blue links
- night: Black background, thick white text, orange links
- serif: Cappuccino background, gray text, brown links
- simple: White background, black text, blue links
- solarized: Cream-colored background, dark green text, blue links

Each theme is available as a separate stylesheet. To change theme you will need to replace **black** below with your desired theme name in index.html:

```html
<link rel="stylesheet" href="css/theme/black.css" id="theme">
```

If you want to add a theme of your own see the instructions here: [/css/theme/README.md](https://github.com/hakimel/reveal.js/blob/master/css/theme/README.md).


## Speaker Notes

reveal.js comes with a speaker notes plugin which can be used to present per-slide notes in a separate browser window. The notes window also gives you a preview of the next upcoming slide so it may be helpful even if you haven't written any notes. Press the »S« key on your keyboard to open the notes window.

A speaker timer starts as soon as the speaker view is opened. You can reset it to 00:00:00 at any time by simply clicking/tapping on it.

Notes are defined by appending an `<aside>` element to a slide as seen below. You can add the `data-markdown` attribute to the aside element if you prefer writing notes using Markdown.

Alternatively you can add your notes in a `data-notes` attribute on the slide. Like `<section data-notes="Something important"></section>`.

When used locally, this feature requires that reveal.js [runs from a local web server](#full-setup).

```html
<section>
	<h2>Some Slide</h2>

	<aside class="notes">
		Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit »S« on your keyboard).
	</aside>
</section>
```

If you're using the external Markdown plugin, you can add notes with the help of a special delimiter:

```html
<section data-markdown="example.md" data-separator="^\n\n\n" data-separator-vertical="^\n\n" data-separator-notes="^Note:"></section>

# Title
## Sub-title

Here is some content...

Note:
This will only display in the notes window.
```

#### Share and Print Speaker Notes

Notes are only visible to the speaker inside of the speaker view. If you wish to share your notes with others you can initialize reveal.js with the `showNotes` configuration value set to `true`. Notes will appear along the bottom of the presentations.

When `showNotes` is enabled notes are also included when you [export to PDF](https://github.com/hakimel/reveal.js#pdf-export). By default, notes are printed in a box on top of the slide. If you'd rather print them on a separate page, after the slide, set `showNotes: "separate-page"`.

#### Speaker notes clock and timers

The speaker notes window will also show:

- Time elapsed since the beginning of the presentation.  If you hover the mouse above this section, a timer reset button will appear.
- Current wall-clock time
- (Optionally) a pacing timer which indicates whether the current pace of the presentation is on track for the right timing (shown in green), and if not, whether the presenter should speed up (shown in red) or has the luxury of slowing down (blue).

The pacing timer can be enabled by configuring by the `defaultTiming` parameter in the `Reveal` configuration block, which specifies the number of seconds per slide.  120 can be a reasonable rule of thumb.  Timings can also be given per slide `<section>` by setting the `data-timing` attribute.  Both values are in numbers of seconds.


## Server Side Speaker Notes

In some cases it can be desirable to run notes on a separate device from the one you're presenting on. The Node.js-based notes plugin lets you do this using the same note definitions as its client side counterpart. Include the required scripts by adding the following dependencies:

```javascript
Reveal.initialize({
	// ...

	dependencies: [
		{ src: 'socket.io/socket.io.js', async: true },
		{ src: 'plugin/notes-server/client.js', async: true }
	]
});
```

Then:

1. Install [Node.js](http://nodejs.org/) (4.0.0 or later)
2. Run `npm install`
3. Run `node plugin/notes-server`


## Multiplexing

The multiplex plugin allows your audience to view the slides of the presentation you are controlling on their own phone, tablet or laptop. As the master presentation navigates the slides, all client presentations will update in real time. See a demo at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/).

The multiplex plugin needs the following 3 things to operate:

1. Master presentation that has control
2. Client presentations that follow the master
3. Socket.io server to broadcast events from the master to the clients

#### Master presentation

Served from a static file server accessible (preferably) only to the presenter. This need only be on your (the presenter's) computer. (It's safer to run the master presentation from your own computer, so if the venue's Internet goes down it doesn't stop the show.) An example would be to execute the following commands in the directory of your master presentation:

1. `npm install node-static`
2. `static`

If you want to use the speaker notes plugin with your master presentation then make sure you have the speaker notes plugin configured correctly along with the configuration shown below, then execute `node plugin/notes-server` in the directory of your master presentation. The configuration below will cause it to connect to the socket.io server as a master, as well as launch your speaker-notes/static-file server.

You can then access your master presentation at `http://localhost:1947`

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
		id: '1ea875674b17ca76', // Obtained from socket.io server
		url: 'https://reveal-js-multiplex-ccjbegmaii.now.sh' // Location of socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },

		// and if you want speaker notes
		{ src: 'plugin/notes-server/client.js', async: true }

		// other dependencies...
	]
});
```

#### Client presentation

Served from a publicly accessible static file server. Examples include: GitHub Pages, Amazon S3, Dreamhost, Akamai, etc. The more reliable, the better. Your audience can then access the client presentation via `http://example.com/path/to/presentation/client/index.html`, with the configuration below causing them to connect to the socket.io server as clients.

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: null, // null so the clients do not have control of the master presentation
		id: '1ea875674b17ca76', // id, obtained from socket.io server
		url: 'https://reveal-js-multiplex-ccjbegmaii.now.sh' // Location of socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
});
```

#### Socket.io server

Server that receives the `slideChanged` events from the master presentation and broadcasts them out to the connected client presentations. This needs to be publicly accessible. You can run your own socket.io server with the commands:

1. `npm install`
2. `node plugin/multiplex`

Or you can use the socket.io server at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/).

You'll need to generate a unique secret and token pair for your master and client presentations. To do so, visit `http://example.com/token`, where `http://example.com` is the location of your socket.io server. Or if you're going to use the socket.io server at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/), visit [https://reveal-js-multiplex-ccjbegmaii.now.sh/token](https://reveal-js-multiplex-ccjbegmaii.now.sh/token).

You are very welcome to point your presentations at the Socket.io server running at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/), but availability and stability are not guaranteed.

For anything mission critical I recommend you run your own server. The easiest way to do this is by installing [now](https://zeit.co/now). With that installed, deploying your own Multiplex server is as easy running the following command from the reveal.js folder: `now plugin/multiplex`.

##### socket.io server as file static server

The socket.io server can play the role of static file server for your client presentation, as in the example at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/). (Open [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/) in two browsers. Navigate through the slides on one, and the other will update to match.)

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: null, // null so the clients do not have control of the master presentation
		id: '1ea875674b17ca76', // id, obtained from socket.io server
		url: 'example.com:80' // Location of your socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
```

It can also play the role of static file server for your master presentation and client presentations at the same time (as long as you don't want to use speaker notes). (Open [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/) in two browsers. Navigate through the slides on one, and the other will update to match. Navigate through the slides on the second, and the first will update to match.) This is probably not desirable, because you don't want your audience to mess with your slides while you're presenting. ;)

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
		id: '1ea875674b17ca76', // Obtained from socket.io server
		url: 'example.com:80' // Location of your socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
});
```


## MathJax

If you want to display math equations in your presentation you can easily do so by including this plugin. The plugin is a very thin wrapper around the [MathJax](http://www.mathjax.org/) library. To use it you'll need to include it as a reveal.js dependency, [find our more about dependencies here](#dependencies).

The plugin defaults to using [LaTeX](http://en.wikipedia.org/wiki/LaTeX) but that can be adjusted through the `math` configuration object. Note that MathJax is loaded from a remote server. If you want to use it offline you'll need to download a copy of the library and adjust the `mathjax` configuration value.

Below is an example of how the plugin can be configured. If you don't intend to change these values you do not need to include the `math` config object at all.

```js
Reveal.initialize({
	// other options ...

	math: {
		mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
		config: 'TeX-AMS_HTML-full'  // See http://docs.mathjax.org/en/latest/config-files.html
	},

	dependencies: [
		{ src: 'plugin/math/math.js', async: true }
	]
});
```

Read MathJax's documentation if you need [HTTPS delivery](http://docs.mathjax.org/en/latest/start.html#secure-access-to-the-cdn) or serving of [specific versions](http://docs.mathjax.org/en/latest/configuration.html#loading-mathjax-from-the-cdn) for stability.

#### MathJax in Markdown
If you want to include math inside of a presentation written in Markdown you need to wrap the forumla in backticks. This prevents syntax conflicts between LaTeX and Markdown. For example:

```
`$$ J(\theta_0,\theta_1) = \sum_{i=0} $$`
```

## License

MIT licensed

Copyright (C) 2018 Hakim El Hattab, http://hakim.se
