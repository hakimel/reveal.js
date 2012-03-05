# reveal.js

A CSS 3D slideshow tool for quickly creating good looking HTML presentations. Doesn't _rely_ on any external libraries but [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/) is included by default for code highlighting.

Note that this requires a browser with support for CSS 3D transforms and ``classList``. If CSS 3D support is not detected, the presentation will degrade to less exciting 2D transitions. You could also use a polyfill for ``classList`` to make this work in < iOS 5 and < Safari 5.1, [here's one](https://github.com/remy/polyfills/blob/master/classList.js) from [@remy](https://github.com/remy).

Curious about how this looks in action? [Check out the demo page](http://lab.hakim.se/reveal-js/).

# Examples

* http://lab.hakim.se/reveal-js/ (original)
* http://www.ideapolisagency.com/ by [@achrafkassioui](http://twitter.com/achrafkassioui)
* http://lucienfrelin.com/ by [@lucienfrelin](http://twitter.com/lucienfrelin)
* http://creatorrr.github.com/ThePoet/
* http://moduscreate.com/ by [@ModusCreate](https://twitter.com/ModusCreate)
* [Webapp Development Stack & Tooling](http://dl.dropbox.com/u/39519/talks/jquk-tooling%2Bappstack/index.html) by [@paul_irish](https://twitter.com/paul_irish)
* http://idea.diwank.name/ by [Diwank Singh](http://diwank.name/)
* http://concurrencykit.org/presentations/lockfree_introduction/ by Samy Al Bahra
* http://www.thecssninja.com/talks/not_your_average_dnd/ by [@ryanseddon](http://twitter.com/ryanseddon)
* http://spinscale.github.com/elasticsearch/2012-03-jugm.html by [@spinscale](http://twitter.com/spinscale)

[Send me a link](http://hakim.se/about/contact) if you used reveal.js for a project or presentation.

# Usage

Markup heirarchy needs to be ``<div id="reveal"> <div class="slides"> <section>`` where the ``<section>`` represents one slide and can be repeated indefinitely. If you place multiple ``<section>``'s inside of another ``<section>`` they will be shown as vertical slides.

At the end of your page, after ``<script src="js/reveal.js"></script>``, you need to initialize reveal. Note that all config values are optional.

```
Reveal.initialize({
  // Display controls in the bottom right corner
	controls: true,

	// Display a presentation progress bar
	progress: true,

	// If true; each slide will be pushed to the browser history
	history: true,

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

# History

#### 1.2 (master)

- Big changes to DOM structure:
  - Previous #main wrapper is now called #reveal
  - Slides were moved one level deeper, into #reveal .slides
  - Controls and progress bar were moved into #reveal
- CSS is now much more explicit, rooted at #reveal, to prevent conflicts
- Config option for disabling updates to URL, defaults to true
- Anchors with image children no longer rotate in 3D on hover
- Support for mouse wheel navigation ([naugtur](https://github.com/naugtur))

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

# License

MIT licensed

Copyright (C) 2011 Hakim El Hattab, http://hakim.se