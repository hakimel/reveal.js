# reveal.js [![Build Status](https://travis-ci.org/hakimel/reveal.js.png?branch=master)](https://travis-ci.org/hakimel/reveal.js)

A framework for easily creating beautiful presentations using HTML. [Check out the live demo](http://lab.hakim.se/reveal-js/).

reveal.js comes with a broad range of features including [nested slides](https://github.com/hakimel/reveal.js#markup), [markdown contents](https://github.com/hakimel/reveal.js#markdown), [PDF export](https://github.com/hakimel/reveal.js#pdf-export), [speaker notes](https://github.com/hakimel/reveal.js#speaker-notes) and a [JavaScript API](https://github.com/hakimel/reveal.js#api). It's best viewed in a browser with support for CSS 3D transforms but [fallbacks](https://github.com/hakimel/reveal.js/wiki/Browser-Support) are available to make sure your presentation can still be viewed elsewhere.


#### More reading in the Wiki:
- [Changelog](https://github.com/hakimel/reveal.js/wiki/Changelog): Up-to-date version history.
- [Examples](https://github.com/hakimel/reveal.js/wiki/Example-Presentations): Presentations created with reveal.js, add your own!
- [Browser Support](https://github.com/hakimel/reveal.js/wiki/Browser-Support): Explanation of browser support and fallbacks.

## rvl.io

Slides are written using HTML or markdown but there's also an online editor for those of you who prefer a more traditional user interface. Give it a try at [www.rvl.io](http://www.rvl.io).


## Instructions

### Markup

Markup heirarchy needs to be ``<div class="reveal"> <div class="slides"> <section>`` where the ``<section>`` represents one slide and can be repeated indefinitely. If you place multiple ``<section>``'s inside of another ``<section>`` they will be shown as vertical slides. The first of the vertical slides is the "root" of the others (at the top), and it will be included in the horizontal sequence. For example:

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

It's possible to write your slides using Markdown. To enable Markdown, add the ```data-markdown``` attribute to your ```<section>``` elements and wrap the contents in a ```<script type="text/template">``` like the example below.

This is based on [data-markdown](https://gist.github.com/1343518) from [Paul Irish](https://github.com/paulirish) which in turn uses [showdown](https://github.com/coreyti/showdown/). Sensitive to indentation (avoid mixing tabs and spaces) and line breaks (avoid consecutive breaks).

```html
<section data-markdown>
	<script type="text/template">
		## Page title

		A paragraph with some text and a [link](http://hakim.se).
	</script>
</section>
```

#### External Markdown

You can write your content as a separate file and have reveal.js load it at runtime. Note the separator arguments which determine how slides are delimited in the external file.

```html
<section data-markdown="example.md" data-separator="^\n\n\n" data-vertical="^\n\n"></section>
```

### Configuration

At the end of your page you need to initialize reveal by running the following code. Note that all config values are optional and will default as specified below.

```javascript
Reveal.initialize({

	// Display controls in the bottom right corner
	controls: true,

	// Display a presentation progress bar
	progress: true,

	// Push each slide change to the browser history
	history: false,

	// Enable keyboard shortcuts for navigation
	keyboard: true,

	// Enable the slide overview mode
	overview: true,

	// Vertical centering of slides
	center: true,

	// Loop the presentation
	loop: false,

	// Change the presentation direction to be RTL
	rtl: false,

	// Number of milliseconds between automatically proceeding to the 
	// next slide, disabled when set to 0, this value can be overwritten
	// by using a data-autoslide attribute on your slides
	autoSlide: 0,

	// Enable slide navigation via mouse wheel
	mouseWheel: false,

	// Apply a 3D roll to links on hover
	rollingLinks: true,

	// Transition style
	transition: 'default' // default/cube/page/concave/zoom/linear/fade/none

});
```

Note that the new default vertical centering option will break compatibility with slides that were using transitions with backgrounds (`cube` and `page`). To restore the previous behavior, set `center` to `false`.

The configuration can be updated after initialization using the ```configure``` method:

```javascript
// Turn autoSlide off
Reveal.configure({ autoSlide: 0 });

// Start auto-sliding every 5s
Reveal.configure({ autoSlide: 5000 });
```


### Presentation Size

All presentations have a normal size, that is the resolution at which they are authored. The framework will automatically scale presentations uniformly based on this size to ensure that everything fits on any given display or viewport. 

See below for a list of configuration options related to sizing, including default values:

```javascript
Reveal.initialize({
	
	...
	
	// The "normal" size of the presentation, aspect ratio will be preserved
	// when the presentation is scaled to fit different resolutions. Can be
	// specified using percentage units.
	width: 960,
	height: 700,
	
	// Factor of the display size that should remain empty around the content
	margin: 0.1,
	
	// Bounds for smallest/largest possible scale to apply to content
	minScale: 0.2,
	maxScale: 1.0
	
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
		{ src: 'plugin/markdown/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

		// Syntax highlight for <code> elements
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },

		// Zoom in and out with Alt+click
		{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },

		// Speaker notes
		{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },

		// Remote control your reveal.js presentation using a touch device
		{ src: 'plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } }
	]
});
```

You can add your own extensions using the same syntax. The following properties are available for each dependency object:
- **src**: Path to the script to load
- **async**: [optional] Flags if the script should load after reveal.js has started, defaults to false
- **callback**: [optional] Function to execute when the script has loaded
- **condition**: [optional] Function which must return true for the script to be loaded


### API

The ``Reveal`` class provides a minimal JavaScript API for controlling navigation and reading state:

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
Reveal.toggleOverview();

// Retrieves the previous and current slide elements
Reveal.getPreviousSlide();
Reveal.getCurrentSlide();

Reveal.getIndices(); // { h: 0, v: 0 } }
```

### States

If you set ``data-state="somestate"`` on a slide ``<section>``, "somestate" will be applied as a class on the document element when that slide is opened. This allows you to apply broad style changes to the page based on the active slide.

Furthermore you can also listen to these changes in state via JavaScript:

```javascript
Reveal.addEventListener( 'somestate', function() {
	// TODO: Sprinkle magic
}, false );
```

### Ready event

The 'ready' event is fired when reveal.js has loaded all (synchronous) dependencies and is ready to start navigating.

```javascript
Reveal.addEventListener( 'ready', function( event ) {
	// event.currentSlide, event.indexh, event.indexv
} );
```

### Slide change event

An 'slidechanged' event is fired each time the slide is changed (regardless of state). The event object holds the index values of the current slide as well as a reference to the previous and current slide HTML nodes.

Some libraries, like MathJax (see [#226](https://github.com/hakimel/reveal.js/issues/226#issuecomment-10261609)), get confused by the transforms and display states of slides. Often times, this can be fixed by calling their update or render function from this callback.

```javascript
Reveal.addEventListener( 'slidechanged', function( event ) {
	// event.previousSlide, event.currentSlide, event.indexh, event.indexv
} );
```

### Internal links

It's easy to link between slides. The first example below targets the index of another slide whereas the second targets a slide with an ID attribute (```<section id="some-slide">```):

```html
<a href="#/2/2">Link</a>
<a href="#/some-slide">Link</a>
```

You can also add relative navigation links, similar to the built in reveal.js controls, by appending one of the following classes on any element. Note that each element is automatically given an ```enabled``` class when it's a valid navigation route based on the current slide.

```html
<a href="#" class="navigate-left">
<a href="#" class="navigate-right">
<a href="#" class="navigate-up">
<a href="#" class="navigate-down">
<a href="#" class="navigate-prev"> <!-- Previous vertical or horizontal slide -->
<a href="#" class="navigate-next"> <!-- Next vertical or horizontal slide -->
```


### Fragments
Fragments are used to highlight individual elements on a slide. Every elmement with the class ```fragment``` will be stepped through before moving on to the next slide. Here's an example: http://lab.hakim.se/reveal-js/#/16

The default fragment style is to start out invisible and fade in. This style can be changed by appending a different class to the fragment:

```html
<section>
	<p class="fragment grow">grow</p>
	<p class="fragment shrink">shrink</p>
	<p class="fragment roll-in">roll-in</p>
	<p class="fragment fade-out">fade-out</p>
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

The display order of fragments can be controlled using the ```data-fragment-index``` attribute.

```html
<section>
	<p class="fragment" data-fragment-index="3">Appears last</p>
	<p class="fragment" data-fragment-index="1">Appears first</p>
	<p class="fragment" data-fragment-index="2">Appears second</p>
</section>
```

### Fragment events

When a slide fragment is either shown or hidden reveal.js will dispatch an event.

```javascript
Reveal.addEventListener( 'fragmentshown', function( event ) {
	// event.fragment = the fragment DOM element
} );
Reveal.addEventListener( 'fragmenthidden', function( event ) {
	// event.fragment = the fragment DOM element
} );
```

### Code syntax highlighting

By default, Reveal is configured with [highlight.js](http://softwaremaniacs.org/soft/highlight/en/) for code syntax highlighting. Below is an example with clojure code that will be syntax highlighted:

```html
<section>
	<pre><code>
(def lazy-fib
  (concat
   [0 1]
   ((fn rfib [a b]
        (lazy-cons (+ a b) (rfib b (+ a b)))) 0 1)))
	</code></pre>
</section>
```


### Overview mode

Press "Esc" key to toggle the overview mode on and off. While you're in this mode, you can still navigate between slides,
as if you were at 1,000 feet above your presentation. The overview mode comes with a few API hooks:

```javascript
Reveal.addEventListener( 'overviewshown', function( event ) { /* ... */ } );
Reveal.addEventListener( 'overviewhidden', function( event ) { /* ... */ } );

// Toggle the overview mode programmatically
Reveal.toggleOverview();
```

### Fullscreen mode
Just press »F« on your keyboard to show your presentation in fullscreen mode. Press the »ESC« key to exit fullscreen mode.


## PDF Export

Presentations can be exported to PDF via a special print stylesheet. This feature requires that you use [Google Chrome](http://google.com/chrome). 
Here's an example of an exported presentation that's been uploaded to SlideShare: http://www.slideshare.net/hakimel/revealjs-13872948.

1. Open your presentation with [css/print/pdf.css](https://github.com/hakimel/reveal.js/blob/master/css/print/pdf.css) included on the page. The default index HTML lets you add *print-pdf* anywhere in the query to include the stylesheet, for example: [lab.hakim.se/reveal-js?print-pdf](http://lab.hakim.se/reveal-js?print-pdf).
2. Open the in-browser print dialog (CMD+P).
3. Change the **Destination** setting to **Save as PDF**.
4. Change the **Layout** to **Landscape**.
5. Change the **Margins** to **None**.
6. Click **Save**.

![Chrome Print Settings](https://s3.amazonaws.com/hakim-static/reveal-js/pdf-print-settings.png)


## Speaker Notes

reveal.js comes with a speaker notes plugin which can be used to present per-slide notes in a separate browser window. The notes window also gives you a preview of the next upcoming slide so it may be helpful even if you haven't written any notes. Append ```?notes``` to the presentation URL or press the 's' key on your keyboard to open the notes window.

By default notes are written using standard HTML, see below, but you can add a ```data-markdown``` attribute to the ```<aside>``` to write them using Markdown.

```html
<section>
	<h2>Some Slide</h2>

	<aside class="notes">
		Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit 's' on your keyboard).
	</aside>
</section>
```

## Server Side Speaker Notes

In some cases it can be desirable to run notes on a separate device from the one you're presenting on. The Node.js-based notes plugin lets you do this using the same note definitions as its client side counterpart. Include the required scripts by adding the following dependencies:

```javascript
Reveal.initialize({
	...

	dependencies: [
		{ src: 'socket.io/socket.io.js', async: true },
		{ src: 'plugin/notes-server/client.js', async: true }
	]
});
```

Then:

1. Install [Node.js](http://nodejs.org/)
2. Run ```npm install```
3. Run ```node plugin/notes-server```


## Multiplexing

The multiplex plugin allows your audience to view the slides on their own phone, tablet or laptop. As the master navigates the slides, all clients will update in real time. See a demo at [http://revealjs.jit.su/](http://revealjs.jit.su).

Configuration is via the multiplex object in ```Reveal.initialize```. To generate unique secret and token values, visit [revealjs.jit.su/token](revealjs.jit.su/token). Below is an example configuration with the multiplex plugin enabled:

```javascript
Reveal.initialize({
	...

	// Generate a unique id and secret at revealjs.jit.su/token
	multiplex: {
		id: '',
		secret: '',
		url: 'revealjs.jit.su:80'
	},

	dependencies: [
		{ src: 'socket.io/socket.io.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },
	]
});
```

```multiplex.secret``` should only be configured on those pages you wish to be able to control slide navigation for all clients. Multi-master configurations work, but if you don't want your audience to be able to control your slides, set the secret to ``null``. In this master/slave setup, you should create a publicly accessible page with secret set to ``null``, and a protected page containing your secret.

You are very welcome to use the server running at reveal.jit.su, however availability and stability are not guaranteed. For anything mission critical I recommend you run your own server. It is simple to deploy to nodejitsu or run on your own environment.


## Theming

The framework comes with a few different themes included:

- default: Gray background, white text, blue links
- beige: Beige background, dark text, brown links
- sky: Blue background, thin white text, blue links
- night: Black background, thick white text, orange links
- serif: Cappuccino background, gray text, brown links
- simple: White background, black text, blue links

Each theme is available as a separate stylesheet. To change theme you will need to replace **default** below with your desired theme name in index.html:

```html
<link rel="stylesheet" href="css/theme/default.css" id="theme">
```

If you want to add a theme of your own see the instructions here: [/css/theme/README.md](https://github.com/hakimel/reveal.js/blob/master/css/theme/README.md).


## Development Environment

reveal.js is built using the task-based command line build tool [grunt.js](http://gruntjs.com) ([installation instructions](https://github.com/gruntjs/grunt#installing-grunt)). With Node.js and grunt.js installed, you need to start by running ```npm install``` in the reveal.js root. When the dependencies have been installed you should run ```grunt watch``` to start monitoring files for changes.

If you want to customise reveal.js without running grunt.js you can alter the HTML to point to the uncompressed source files (css/reveal.css & js/reveal.js).

### Folder Structure
- **css/** Core styles without which the project does not function
- **js/** Like above but for JavaScript
- **plugin/** Components that have been developed as extensions to reveal.js
- **lib/** All other third party assets (JavaScript, CSS, fonts)


## License

MIT licensed

Copyright (C) 2013 Hakim El Hattab, http://hakim.se

