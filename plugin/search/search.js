/*
 * Handles finding a text string anywhere in the slides and showing the next occurrence to the user
 * by navigatating to that slide and highlighting it.
 *
 * By Jon Snyder <snyder.jon@gmail.com>, February 2013
 */

var RevealSearch = (function() {

	var matchedSlides;
	var currentMatchedIndex;
	var searchboxDirty;
	var myHilitor;

// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
// 2/2013 jon: modified regex to display any match, not restricted to word boundaries.

function Hilitor(id, tag)
{

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
		input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'-]+/g, "|");
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
			if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
				//find the slide's section element and save it in our list of matching slides
				var secnode = node;
				while (secnode != null && secnode.nodeName != 'SECTION') {
					secnode = secnode.parentNode;
				}

				var slideIndex = Reveal.getIndices(secnode);
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

	function openSearch() {
		//ensure the search term input dialog is visible and has focus:
		var inputboxdiv = document.getElementById("searchinputdiv");
		var inputbox = document.getElementById("searchinput");
		inputboxdiv.style.display = "inline";
		inputbox.focus();
		inputbox.select();
	}

	function closeSearch() {
		var inputboxdiv = document.getElementById("searchinputdiv");
		inputboxdiv.style.display = "none";
		if(myHilitor) myHilitor.remove();
	}

	function toggleSearch() {
		var inputboxdiv = document.getElementById("searchinputdiv");
		if (inputboxdiv.style.display !== "inline") {
			openSearch();
		}
		else {
			closeSearch();
		}
	}

	function doSearch() {
		//if there's been a change in the search term, perform a new search:
		if (searchboxDirty) {
			var searchstring = document.getElementById("searchinput").value;

			if (searchstring === '') {
				if(myHilitor) myHilitor.remove();
				matchedSlides = null;
			}
			else {
				//find the keyword amongst the slides
				myHilitor = new Hilitor("slidecontent");
				matchedSlides = myHilitor.apply(searchstring);
				currentMatchedIndex = 0;
			}
		}

		if (matchedSlides) {
			//navigate to the next slide that has the keyword, wrapping to the first if necessary
			if (matchedSlides.length && (matchedSlides.length <= currentMatchedIndex)) {
				currentMatchedIndex = 0;
			}
			if (matchedSlides.length > currentMatchedIndex) {
				Reveal.slide(matchedSlides[currentMatchedIndex].h, matchedSlides[currentMatchedIndex].v);
				currentMatchedIndex++;
			}
		}
	}

	var dom = {};
	dom.wrapper = document.querySelector( '.reveal' );

	if( !dom.wrapper.querySelector( '.searchbox' ) ) {
			var searchElement = document.createElement( 'div' );
			searchElement.id = "searchinputdiv";
			searchElement.classList.add( 'searchdiv' );
			searchElement.style.position = 'absolute';
			searchElement.style.top = '10px';
			searchElement.style.right = '10px';
			searchElement.style.zIndex = 10;
			//embedded base64 search icon Designed by Sketchdock - http://www.sketchdock.com/:
			searchElement.innerHTML = '<span><input type="search" id="searchinput" class="searchinput" style="vertical-align: top;"/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJiSURBVHjatFZNaxNBGH5md+Mmu92NVdKDRipSAyqCghgQD4L4cRe86UUtAQ+eFCxoa4/25EXBFi8eBE+eRPoDhB6KgiiixdAPCEkx2pjvTXadd9yNsflwuyUDD/O+u8PzzDPvzOwyx3EwyCZhwG3gAkp7MnpjgbopjsltcD4gjuXZZKeAR348MYLYTm3LzOs/y3j3JTfZxgXWXmTuwPHIc4VmoOmv5IrI53+AO2DdHLjkDWQ3GoEEVFXtXQOvkSnPWcyUceviLhwbDYv8/XIVj97kse7TodLvZXxYxrPUHkQ1ufXs3FEdybEIxucySOesoNvUgWU1cP3MkCBfTFdw9fGaAMVmRELq7LBw2Q3/FaAxxWIRpw+ZIr/7IouPqzUBiqmdHAv7EuhRAwf1er2Vy4x1jW3b2d5Jfvu5IPp7l2LYbcgCFFNb+FoJ7oBqEAqFMPNqFcmEgVMJDfMT+1tvN0pNjERlMS6QA5pFOKxiKVPFhakPeL3It+WGJUDxt2wFR+JhzI7v5ctkd8DXOZAkCYYxhO+lKm4+Xfqz/rIixBuNBl7eOYzkQQNzqX249mRl6zUgEcYkaJrGhUwBinVdh6IouPzwE6/DL5w4oLkH8y981aDf+uq6hlKpJESiUdNfDZi7/ehG9K6KfiA3pml0PLcsq+cSMTj2NL9ukc4UOmz7AZ3+crkC4mHujFvXNaMFB3bEr8xPS6p5O+jXxq4VZtaen7/PwzrntjcLUE0iHPS1Ud1cdiEJl/8WivZk0wXd7zWOMkeF8s0CcAmkNrC2nvXZDbbbN73ccYnZoH9bfgswAFzAe9/h3dbKAAAAAElFTkSuQmCC" id="searchbutton" class="searchicon" style="vertical-align: top; margin-top: -1px;"/></span>';
			dom.wrapper.appendChild( searchElement );
	}

	document.getElementById( 'searchbutton' ).addEventListener( 'click', function(event) {
		doSearch();
	}, false );

	document.getElementById( 'searchinput' ).addEventListener( 'keyup', function( event ) {
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

	document.addEventListener( 'keydown', function( event ) {
		if( event.key == "F" && (event.ctrlKey || event.metaKey) ) { //Control+Shift+f
			event.preventDefault();
			toggleSearch();
		}
	}, false );
	if( window.Reveal ) Reveal.registerKeyboardShortcut( 'Ctrl-Shift-F', 'Search' );
	closeSearch();
	return { open: openSearch };
})();
