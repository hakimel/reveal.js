# reveal.js

A CSS 3D slideshow tool for quickly creating good looking HTML presentations. Doesn't _rely_ on any external libraries but [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/) is included by default for code highlighting.

Note that this requires a browser with support for CSS 3D transforms and classList. If CSS 3D support is not detected, the presentation will degrade to less exciting 2D transitions.

Curious about how this looks in action? [Check out the demo page](http://lab.hakim.se/reveal-js/).

# Examples

* http://lab.hakim.se/reveal-js/ (original)
* http://www.ideapolisagency.com/ from [@achrafkassioui](http://twitter.com/achrafkassioui)
* http://lucienfrelin.com/ from [@lucienfrelin](http://twitter.com/lucienfrelin)

[Send me a link](http://hakim.se/about/contact) if you used reveal.js for a project or presentation.

# History

### 1.2 (master)
- Big changes to DOM structure:
  - Previous #main wrapper is now called #reveal
  - Slides were moved one level deeper, into #reveal .slides
  - Controls and progress bar were moved into #reveal
- CSS is now much more explicit, rooted at #reveal, to prevent conflicts

### 1.1

- Added an optional presentation progress bar
- Images wrapped in anchors no longer unexpectedly flip in 3D
- Slides that contain other slides are given the 'stack' class
- Added 'transition' option for specifying transition styles
- Added 'theme' option for specifying UI styles
- New transitions: 'box' & 'page'
- New theme: 'neon'

### 1.0

- New and improved style
- Added controls in bottom right which indicate where you can navigate
- Reveal views in iteratively by giving them the .fragment class
- Code sample syntax highlighting thanks to [highlight.js](http://softwaremaniacs.org/soft/highlight/en/description/)
- Initialization options (toggling controls, toggling rolling links, transition theme)

### 0.3

- Added licensing terms
- Fixed broken links on touch devices

### 0.2

- Refactored code and added inline documentation
- Slides now have unique URL's
- A basic API to invoke navigation was added

### 0.1
- First release

# License

MIT licensed

Copyright (C) 2011 Hakim El Hattab, http://hakim.se