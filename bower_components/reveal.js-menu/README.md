# reveal.js-menu

A slideout menu plugin for [Reveal.js](https://github.com/hakimel/reveal.js) to quickly jump to any slide by title. Also optionally change the theme and set the default transition. [Check out the live demo](https://denehyg.github.io/reveal.js-menu)

## Installation

### Bower

Download and install the package in your project:

```bower install reveal.js-menu```

Add the plugin to the dependencies in your presentation, as below. 

```javascript
Reveal.initialize({
	// ...
	
	dependencies: [
		// ... 
	  
		{ src: 'bower_components/reveal.js-menu/menu.js' }
	]
});
```

### npm

Download and install the package in your project:

```npm install --save reveal.js-menu```

Add the plugin to the dependencies in your presentation, as below. 

```javascript
Reveal.initialize({
	// ...
	
	dependencies: [
		// ... 
	  
		{ src: 'node_modules/reveal.js-menu/menu.js' }
	]
});
```

### Manual

Copy this repository into the plugins folder of your reveal.js presentation, ie ```plugins/menu```.

Add the plugin to the dependencies in your presentation, as below. 

```javascript
Reveal.initialize({
	// ...
	
	dependencies: [
		// ... 
	  
		{ src: 'plugin/menu/menu.js' }
	]
});
```

## Configuration

You can configure the menu for your presentation by providing a ```menu``` option in the reveal.js initialization options. Note that all config values are optional and will default as specified below.

```javascript
Reveal.initialize({
	// ...

	menu: {
		// Specifies which side of the presentation the menu will 
		// be shown. Use 'left' or 'right'.
		side: 'left',

		// Add slide numbers to the titles in the slide list.
		// Use 'true' or format string (same as reveal.js slide numbers)
		numbers: false,

		// Specifies which slide elements will be used for generating
		// the slide titles in the menu. The default selects the first
		// heading element found in the slide, but you can specify any
		// valid css selector and the text from the first matching
		// element will be used.
		// Note: that a section data-menu-title attribute or an element
		// with a menu-title class will take precedence over this option
		titleSelector: 'h1, h2, h3, h4, h5, h6',

		// If slides do not have a matching title, attempt to use the
		// start of the text content as the title instead
		useTextContentForMissingTitles: false,

		// Hide slides from the menu that do not have a title.
		// Set to 'true' to only list slides with titles.
		hideMissingTitles: false,

		// Add markers to the slide titles to indicate the 
		// progress through the presentation
		markers: false,

		// Specify custom panels to be included in the menu, by
		// providing an array of objects with 'title', 'icon'
		// properties, and either a 'src' or 'content' property.
		custom: false,

		// Specifies the themes that will be available in the themes
		// menu panel. Set to 'false' to hide themes panel.
		themes: [
			{ name: 'Black', theme: 'css/theme/black.css' },
			{ name: 'White', theme: 'css/theme/white.css' },
			{ name: 'League', theme: 'css/theme/league.css' },
			{ name: 'Sky', theme: 'css/theme/sky.css' },
			{ name: 'Beige', theme: 'css/theme/beige.css' },
			{ name: 'Simple', theme: 'css/theme/simple.css' },
			{ name: 'Serif', theme: 'css/theme/serif.css' },
			{ name: 'Blood', theme: 'css/theme/blood.css' },
			{ name: 'Night', theme: 'css/theme/night.css' },
			{ name: 'Moon', theme: 'css/theme/moon.css' },
			{ name: 'Solarized', theme: 'css/theme/solarized.css' }
		],

		// Specifies if the transitions menu panel will be shown.
		transitions: true,

		// Adds a menu button to the slides to open the menu panel.
		// Set to 'false' to hide the button.
		openButton: true,

		// If 'true' allows the slide number in the presentation to
		// open the menu panel. The reveal.js slideNumber option must 
		// be displayed for this to take effect
		openSlideNumber: false,

		// If true allows the user to open and navigate the menu using
		// the keyboard. Standard keyboard interaction with reveal
		// will be disabled while the menu is open.
		keyboard: true,

		// Normally the menu will close on user actions such as
		// selecting a menu item, or clicking the presentation area.
		// If 'true', the sticky option will leave the menu open
		// until it is explicitly closed, that is, using the close
		// button or pressing the ESC or m key (when the keyboard 
		// interaction option is enabled).
		sticky: false,

		// If 'true' standard menu items will be automatically opened
		// when navigating using the keyboard. Note: this only takes 
		// effect when both the 'keyboard' and 'sticky' options are enabled.
		autoOpen: true,

		// If 'true' the menu will not be created until it is explicitly
		// requested by calling RevealMenu.init(). Note this will delay
		// the creation of all menu panels, including custom panels, and
		// the menu button.
		delayInit: false
	},

});
```

If you are using the themes panel you need to ensure the theme stylesheet in the presentation uses the ```id="theme"``` attribute. For example...
```html
<link rel="stylesheet" href="css/theme/black.css" id="theme">
```

## Slide Titles

The slide titles used in the menu can be supplied explicitly or are taken directly from the presentation, using the following rules...

###### 1. The section's ```data-menu-title``` attribute.
If the slide's section element contains a ```data-menu-title``` attribute this will be used for the slide title in the menu. For example...

```html
<section data-menu-title="Custom Menu Title">
	<h1>Title</h1>
	<p>...</p>
</section>
```

###### 2. Any element with the class ```menu-title```.
If the slide's section contains an element with the class ```menu-title``` then the element's text will be used for the title. The first such element found will be used if there are more than one. Note the element need not be displayed to be used. For example...

```html
<section>
	<h1>Title</h1>
	<span class="menu-title" style="display: none">Custom Menu Title</span>
	<p>...</p>
</section>
```

###### 3. The first heading found or a custom element selector
The ```titleSelector``` option can be used to customise the elements that will be used to generate the slide titles in the menu. The default option selects the first heading element found in the slide. For example...

```html
<section>
	<h3>This will be the slide title in the menu</h3>
	<h1>Title</h1>
	<p>...</p>
</section>
```

Any valid CSS selector should work but note the selector will only be applied to elements contained within the slide section. You could use the ```'h1'``` selector to only use level 1 headings or ```'p'``` to use the first paragraph element. For example, ```titleSelector: 'p.lead'``` would be used like this...

```html
<section>
	<h1>Title</h1>
	<p class="lead">This will be the slide title in the menu</p>
	<p>...</p>
</section>
```

Using ```titleSelector: ''``` will ignore all elements and no title will be provided, unless the slide section contains a ```data-menu-title``` attribute or an element with the ```menu-title``` class.

###### 4. No title is provided
If no title can be found using the above methods, a default title incorporating the slide number will be used. For example, the following would result in a slide title in the format of 'Slide 12'...

```html
<section>
	<p>...</p>
</section>
```

If the ```hideMissingTitles``` option is set to ```true```, however, the slide will not be listed in the menu.


## Custom Menu Panels

Additional custom panels can be added the menu using the ```custom``` option.

```javascript
Reveal.initialize({
	// ...

	menu: {
		// ...

		custom: [
			{ title: 'Links', icon: '<i class="fa fa-external-link">', src: 'links.html' },
			{ title: 'About', icon: '<i class="fa fa-info">', content: '<p>This slidedeck is created with reveal.js</p>' }
		]
	}
});
```

```title``` and ```icon``` are used for the toolbar buttons at the top of the menu. There are two approaches you can use to provide content for the panels...

* You can provide a URL in ```src``` to load html from another file.
* Alternatively, you can provide html in ```content``` and this will be added to the custom panel.

###### Custom slide menu items

You can provide menu items in your custom panels using the following format. This allows you to define your own navigation links for your presentation.

```html
<h1>Links</h1>
<ul class="slide-menu-items">
	<li class="slide-menu-item"><a href="#/transitions">Transitions</a></li>
	<li class="slide-menu-item"><a href="#/13">Code highlighting</a></li>
</ul>
```

You are not limited to linking to presentation slides. You can provide any link you wish. 

```html
<h1>External Links</h1>
<ul class="slide-menu-items">
	<li class="slide-menu-item"><a href="https://github.com/denehyg/reveal.js-menu">Reveal.js-menu</a></li>
	<li class="slide-menu-item"><a href="https://github.com/hakimel/reveal.js">Reveal.js</a></li>
</ul>
```

Using menu items enables keyboard navigation of your links as with the other panels. However, you don't have to use menu items for your links. You can simply provide standard links and unordered lists in your html. Notice you can provide your custom menu items mixed with other html if you wish.


## Ready Event

A 'menu-ready' event is fired when reveal.js-menu has loaded all non-async dependencies and is ready to start navigating.

```javascript
Reveal.addEventListener( 'menu-ready', function( event ) {
	// your code
} );
```

 
## License

MIT licensed

Copyright (C) 2015 Greg Denehy
