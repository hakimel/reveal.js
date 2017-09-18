// More info https://github.com/sinesiobittencourt/presentations#configuration
Reveal.initialize({
    controls: false, //Display controls in the bottom right corner
    progress: true, //Display a presentation progress bar
    slideNumber: true, //Display the page number of the current slide
    history: true, //Push each slide change to the browser history
    keyboard: true, //Enable keyboard shortcuts for navigation
    overview: true, //Enable the slide overview mode
    center: true, //Vertical centering of slides
    touch: true, //Enables touch navigation on devices with touch input
    loop: false, //Loop the presentation
    rtl: false, //Change the presentation direction to be RTL
    fragments: true,  //Turns fragments on and off globally
    embedded: false, //Flags if the presentation is running in an embedded mode, i.e. contained within a limited portion of the screen
    help: true, //Flags if we should show a help overlay when the questionmark key is pressed
    showNotes: false, //Flags if speaker notes should be visible to all viewers
    autoSlide: 0, //Number of milliseconds between automatically proceeding to the next slide, disabled when set to 0, this value can be overwritten by using a data-autoslide attribute on your slides
    autoSlideStoppable: true, //Stop auto-sliding after user input
    mouseWheel: true, //Enable slide navigation via mouse wheel
    hideAddressBar: true, //Hides the address bar on mobile devices
    previewLinks: false, //Opens links in an iframe preview overlay
    // transition: 'concave', //none/fade/slide/convex/concave/zoom
    // transitionSpeed: 'slow', //default/slow/fast
    // backgroundTransition: 'default', //none/fade/slide/convex/concave/zoom  //Transition style for full page slide backgrounds

    
    // transition: 'convex', // none/fade/slide/convex/concave/zoom

menu: {
    // Font: https://github.com/denehyg/reveal.js-menu
    // Specifies which side of the presentation the menu will 
    // be shown. Use 'left' or 'right'.
    side: 'right',

    // Add slide numbers to the titles in the slide list.
    // Use 'true' or format string (same as reveal.js slide numbers)
    numbers: true,

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
    custom: true,

    // Specifies the themes that will be available in the themes
    // menu panel. Set to 'false' to hide themes panel.
    themes: [
        { name: 'Black', theme: '../css/theme/black.css' },
        { name: 'White', theme: '../css/theme/white.css' },
        { name: 'League', theme: '../css/theme/league.css' },
        { name: 'Sky', theme: '../css/theme/sky.css' },
        { name: 'Beige', theme: '../css/theme/beige.css' },
        { name: 'Simple', theme: '../css/theme/simple.css' },
        { name: 'Serif', theme: '../css/theme/serif.css' },
        { name: 'Blood', theme: '../css/theme/blood.css' },
        { name: 'Night', theme: '../css/theme/night.css' },
        { name: 'Moon', theme: '../css/theme/moon.css' },
        { name: 'Solarized', theme: '../css/theme/solarized.css' }
    ],
custom: [
    // { title: 'Links', icon: '<i class="fa fa-external-link">', src: '../index.html' },
    { title: 'About', icon: '<i class="fa fa-info">', content: '<p>Sinesio Bittencourt</p>' }
],

    // Specifies if the transitions menu panel will be shown.
    transitions: true,

    // Adds a menu button to the slides to open the menu panel.
    // Set to 'false' to hide the button.
    openButton: true,

    // If 'true' allows the slide number in the presentation to
    // open the menu panel. The reveal.js slideNumber option must 
    // be displayed for this to take effect
    openSlideNumber: true,

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
    multiplex: {
        // Example values. To generate your own, see the socket.io server instructions.
		secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
		id: '1ea875674b17ca76', // Obtained from socket.io server
		url: 'https://reveal-js-multiplex-ccjbegmaii.now.sh' // Location of socket.io server
        },


// More info https://github.com/sinesiobittencourt/presentations#dependencies
dependencies: [
    { src: '../lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: '../plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '../plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '../plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: '../plugin/zoom-js/zoom.js', async: true },
    { src: '../plugin/notes/notes.js', async: true },

    { src: 'http://cdn.socket.io/socket.io-1.3.5.js', async: true },
    { src: '../plugin/multiplex/master.js', async: true },

    // and if you want speaker notes
    { src: '../plugin/notes-server/client.js', async: true },
    
    { src: '../bower_components/reveal.js-menu/menu.js' },
    // { src: '../node_modules/reveal.js-menu/menu.js' },
    { src: '../plugin/customcontrols/customcontrols.js' }
    ]
});