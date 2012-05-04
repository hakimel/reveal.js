# reveal.js

A CSS 3D slideshow tool for quickly creating good looking HTML presentations. Doesn't _rely_ on any external libraries but [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/) is included by default for code highlighting.

Note that this requires a browser with support for CSS 3D transforms and ``classList``. If CSS 3D support is not detected, the presentation will degrade to less exciting 2D transitions. A [classList polyfill](http://purl.eligrey.com/github/classList.js/blob/master/classList.js) is incuded to make this work in < iOS 5, < Safari 5.1 and IE.

Curious about how it looks in action? [Check out the demo page](http://lab.hakim.se/reveal-js/).

## Usage

### Markup

Markup heirarchy needs to be ``<div id="reveal"> <div class="slides"> <section>`` where the ``<section>`` represents one slide and can be repeated indefinitely. If you place multiple ``<section>``'s inside of another ``<section>`` they will be shown as vertical slides. For example:

```
<div id="reveal">
	<div class="slides"> 
		<section>Single Horizontal Slide</section>
		<section>
			<section>Vertical Slide 1</section>
			<section>Vertical Slide 2</section>
		</section>
	</div>
</div>
```

### Configuration

At the end of your page, after ``<script src="js/reveal.js"></script>``, you need to initialize reveal by running the following code. Note that all config values are optional.

```
Reveal.initialize({
	// Display controls in the bottom right corner
	controls: true,

	// Display a presentation progress bar
	progress: true,

	// If true; each slide will be pushed to the browser history
	history: true,

	// Loops the presentation, defaults to false
	loop: false,

	// Flags if mouse wheel navigation should be enabled
	mouseWheel: true,

	// Apply a 3D roll to links on hover
	rollingLinks: true,

	// UI style
	theme: 'default', // default/neon

	// Transition style
	transition: 'default' // default/cube/page/concave/linear(2d)
});
```

### API

The Reveal class provides a minimal JavaScript API for controlling its navigation:

- Reveal.navigateTo( indexh, indexv );
- Reveal.navigateLeft();
- Reveal.navigateRight();
- Reveal.navigateUp();
- Reveal.navigateDown();

### States

If you set ``data-state="somestate"`` on a slide ``<section>``, "somestate" will be applied as a class on the document element when that slide is opened. This allows you to apply broad style changes to the page based on the active slide.

Furthermore you can also listen to these changes in state via JavaScript:

```
Reveal.addEventListener( 'somestate', function() {
	// TODO: Sprinkle magic
}, false );
```

### Slide change event

An 'slidechanged' event is fired each time the slide is changed (regardless of state). The event object holds the index of the current slide.

```
Reveal.addEventListener( 'slidechanged', function( event ) {
	// event.indexh & event.indexv
} );
```


## Examples

* http://lab.hakim.se/reveal-js/ (original)
* http://www.ideapolisagency.com/ by [@achrafkassioui](http://twitter.com/achrafkassioui)
* http://lucienfrelin.com/ by [@lucienfrelin](http://twitter.com/lucienfrelin)
* http://creatorrr.github.com/ThePoet/
* http://moduscreate.com/ by [@ModusCreate](https://twitter.com/ModusCreate)
* http://idea.diwank.name/ by [Diwank Singh](http://diwank.name/)
* [Webapp Development Stack & Tooling](http://dl.dropbox.com/u/39519/talks/jquk-tooling%2Bappstack/index.html) by [@paul_irish](https://twitter.com/paul_irish)
* [Lock-free algorithms](http://concurrencykit.org/presentations/lockfree_introduction/) by Samy Al Bahra
* [Not Your Average Drag and Drop](http://www.thecssninja.com/talks/not_your_average_dnd/) by [@ryanseddon](http://twitter.com/ryanseddon)
* [Elasticsearch](http://spinscale.github.com/elasticsearch/2012-03-jugm.html) by [@spinscale](http://twitter.com/spinscale)
* [JavaScript Tooling](http://dl.dropbox.com/u/39519/talks/jsconf-tools/index.html) by [@paul_irish](https://twitter.com/paul_irish)
* [The Graphical Web: Fostering Creativity](http://vhardy.github.com/presentations/html5-community-meet-up-2012/) by [@vincent_hardy](https://twitter.com/vincent_hardy)
* [Mobile Web Programming is a Bloody Mess](http://westcoastlogic.com/slides/debug-mobile/) by [@brianleroux](https://twitter.com/brianleroux)
* [Bio Database Access and Sequence Alignment](http://www.philipbjorge.com/bioinformatics-presentation/) by [Philip Bjorge](https://github.com/philipbjorge)
* [Web vs Native](http://prez.mahemoff.com/state-native/) by [Michael Mahemoff](https://github.com/mahemoff)

[Send me a link](http://hakim.se/about/contact) if you used reveal.js for a project or presentation.


## History

#### 1.3 (master)
- Revised keyboard shortcuts, including ESC for overview, N for next, P for previous. Thanks [mahemoff](https://github.com/mahemoff)
- Added support for looped presentations via config
- Fixed IE9 fallback
- Added event binding methods (Reveal.addEventListener, Reveal.removeEventListener)
- Added 'slidechanged' event

#### 1.2

- Big changes to DOM structure:
  - Previous #main wrapper is now called #reveal
  - Slides were moved one level deeper, into #reveal .slides
  - Controls and progress bar were moved into #reveal
- CSS is now much more explicit, rooted at #reveal, to prevent conflicts
- Config option for disabling updates to URL, defaults to true
- Anchors with image children no longer rotate in 3D on hover
- Support for mouse wheel navigation ([naugtur](https://github.com/naugtur))
- Delayed updates to URL hash to work around a bug in Chrome
- Included a classList polyfill for IE9
- Support for wireless presenter keys
- States can now be applied as classes on the document element by adding data-state on a slide

#### 1.1

- Added an optional presentation progress bar
- Images wrapped in anchors no longer unexpectedly flip in 3D
- Slides that contain other slides are given the 'stack' class
- Added 'transition' option for specifying transition styles
- Added 'theme' option for specifying UI styles
- New transitions: 'box' & 'page'
- New theme: 'neon'

#### 1.0

- New and improved style
- Added controls in bottom right which indicate where you can navigate
- Reveal views in iteratively by giving them the .fragment class
- Code sample syntax highlighting thanks to [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/)
- Initialization options (toggling controls, toggling rolling links, transition theme)

#### 0.3

- Added licensing terms
- Fixed broken links on touch devices

#### 0.2

- Refactored code and added inline documentation
- Slides now have unique URL's
- A basic API to invoke navigation was added

#### 0.1

- First release
- Transitions and a white theme

## License

MIT licensed

Copyright (C) 2012 Hakim El Hattab, http://hakim.se