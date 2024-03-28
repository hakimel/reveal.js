/*!
 * Handles finding a text string anywhere in the slides and showing the next occurrence to the user
 * by navigatating to that slide and highlighting it.
 *
 * @author Jon Snyder <snyder.jon@gmail.com>, February 2013
 */

const Plugin = () => {

	// The reveal.js instance this plugin is attached to
	let deck;

	let searchElement;
	let searchButton;
	let searchInput;

	let matchedSlides;
	let currentMatchedIndex;
	let searchboxDirty;
	let hilitor;

	function render() {

		searchElement = document.createElement( 'div' );
		searchElement.classList.add( 'searchbox' );
		searchElement.style.position = 'absolute';
		searchElement.style.top = '10px';
		searchElement.style.right = '10px';
		searchElement.style.zIndex = 10;

		//embedded base64 search icon Designed by Sketchdock - http://www.sketchdock.com/:
		searchElement.innerHTML = `<input type="search" class="searchinput" placeholder="Search..." style="vertical-align: top;"/>
		</span>`;

		searchInput = searchElement.querySelector( '.searchinput' );
		searchInput.style.width = '240px';
		searchInput.style.fontSize = '14px';
		searchInput.style.padding = '4px 6px';
		searchInput.style.color = '#000';
		searchInput.style.background = '#fff';
		searchInput.style.borderRadius = '2px';
		searchInput.style.border = '0';
		searchInput.style.outline = '0';
		searchInput.style.boxShadow = '0 2px 18px rgba(0, 0, 0, 0.2)';
		searchInput.style['-webkit-appearance']  = 'none';

		deck.getRevealElement().appendChild( searchElement );

		// searchButton.addEventListener( 'click', function(event) {
		// 	doSearch();
		// }, false );

		searchInput.addEventListener( 'keyup', function( event ) {
			switch (event.keyCode) {
				case 13:
					event.preventDefault();
					doSearch();
					searchboxDirty = false;
					break;
				default:
					searchboxDirty = true;
			}
		}, false );

		closeSearch();

	}

	function openSearch() {
		if( !searchElement ) render();

		searchElement.style.display = 'inline';
		searchInput.focus();
		searchInput.select();
	}

	function closeSearch() {
		if( !searchElement ) render();

		searchElement.style.display = 'none';
		if(hilitor) hilitor.remove();
	}

	function toggleSearch() {
		if( !searchElement ) render();

		if (searchElement.style.display !== 'inline') {
			openSearch();
		}
		else {
			closeSearch();
		}
	}

	function doSearch() {
		//if there's been a change in the search term, perform a new search:
		if (searchboxDirty) {
			var searchstring = searchInput.value;

			if (searchstring === '') {
				if(hilitor) hilitor.remove();
				matchedSlides = null;
			}
			else {
				//find the keyword amongst the slides
				hilitor = new Hilitor("slidecontent");
				matchedSlides = hilitor.apply(searchstring);
				currentMatchedIndex = 0;
			}
		}

		if (matchedSlides) {
			//navigate to the next slide that has the keyword, wrapping to the first if necessary
			if (matchedSlides.length && (matchedSlides.length <= currentMatchedIndex)) {
				currentMatchedIndex = 0;
			}
			if (matchedSlides.length > currentMatchedIndex) {
				deck.slide(matchedSlides[currentMatchedIndex].h, matchedSlides[currentMatchedIndex].v);
				currentMatchedIndex++;
			}
		}
	}

	// Original JavaScript code by Chirp Internet: www.chirp.com.au
	// Please acknowledge use of this code by including this header.
	// 2/2013 jon: modified regex to display any match, not restricted to word boundaries.
	function Hilitor(id, tag) {

		var targetNode = document.getElementById(id) || document.body;
		var hiliteTag = tag || "EM";
		var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM)$");
		var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
		var wordColor = [];
		var colorIdx = 0;
		var matchRegex = "";
		var matchingSlides = [];

		this.setRegex = function(input)
		{
			input = input.trim();
			matchRegex = new RegExp("(" + input + ")","i");
		}

		this.getRegex = function()
		{
			return matchRegex.toString().replace(/^\/\\b\(|\)\\b\/i$/g, "").replace(/\|/g, " ");
		}

		// recursively apply word highlighting
		this.hiliteWords = function(node)
		{
			if(node == undefined || !node) return;
			if(!matchRegex) return;
			if(skipTags.test(node.nodeName)) return;

			if(node.hasChildNodes()) {
				for(var i=0; i < node.childNodes.length; i++)
					this.hiliteWords(node.childNodes[i]);
			}
			if(node.nodeType == 3) { // NODE_TEXT
				var nv, regs;
				if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
					//find the slide's section element and save it in our list of matching slides
					var secnode = node;
					while (secnode != null && secnode.nodeName != 'SECTION') {
						secnode = secnode.parentNode;
					}

					var slideIndex = deck.getIndices(secnode);
					var slidelen = matchingSlides.length;
					var alreadyAdded = false;
					for (var i=0; i < slidelen; i++) {
						if ( (matchingSlides[i].h === slideIndex.h) && (matchingSlides[i].v === slideIndex.v) ) {
							alreadyAdded = true;
						}
					}
					if (! alreadyAdded) {
						matchingSlides.push(slideIndex);
					}

					if(!wordColor[regs[0].toLowerCase()]) {
						wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
					}

					var match = document.createElement(hiliteTag);
					match.appendChild(document.createTextNode(regs[0]));
					match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
					match.style.fontStyle = "inherit";
					match.style.color = "#000";

					var after = node.splitText(regs.index);
					after.nodeValue = after.nodeValue.substring(regs[0].length);
					node.parentNode.insertBefore(match, after);
				}
			}
		};

		// remove highlighting
		this.remove = function()
		{
			var arr = document.getElementsByTagName(hiliteTag);
			var el;
			while(arr.length && (el = arr[0])) {
				el.parentNode.replaceChild(el.firstChild, el);
			}
		};

		// start highlighting at target node
		this.apply = function(input)
		{
			if(input == undefined || !input) return;
			this.remove();
			this.setRegex(input);
			this.hiliteWords(targetNode);
			return matchingSlides;
		};

	}

	return {

		id: 'search',

		init: reveal => {

			deck = reveal;
			deck.registerKeyboardShortcut( 'CTRL + Shift + F', 'Search' );

			document.addEventListener( 'keydown', function( event ) {
				if( event.key == "F" && (event.ctrlKey || event.metaKey) ) { //Control+Shift+f
					event.preventDefault();
					toggleSearch();
				}
			}, false );

		},

		open: openSearch

	}
};

export default Plugin;