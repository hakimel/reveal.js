/**
 * This reveal.js plugin is wrapper around the highlight.js
 * syntax highlighting library.
 */
(function( root, factory ) {
		if (typeof define === 'function' && define.amd) {
			root.RevealHighlight = factory();
		} else if( typeof exports === 'object' ) {
			module.exports = factory();
    } else {
			// Browser globals (root is window)
			root.RevealHighlight = factory();
		}
}( this, function() {

	function loadScript( url, callback ) {

		var head = document.querySelector( 'head' );
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = url;

		// Wrapper for callback to make sure it only fires once
		var finish = function() {
			if( typeof callback === 'function' ) {
				callback.call();
				callback = null;
			}
		}

		script.onload = finish;

		// IE
		script.onreadystatechange = function() {
			if ( this.readyState === 'loaded' ) {
				finish();
			}
		}

		// Normal browsers
		head.appendChild( script );

	}

	// Function to perform a better "data-trim" on code snippets
	// Will slice an indentation amount on each line of the snippet (amount based on the line having the lowest indentation length)
	function betterTrim(snippetEl) {
		// Helper functions
		function trimLeft(val) {
			// Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
			return val.replace(/^[\s\uFEFF\xA0]+/g, '');
		}
		function trimLineBreaks(input) {
			var lines = input.split('\n');

			// Trim line-breaks from the beginning
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].trim() === '') {
					lines.splice(i--, 1);
				} else break;
			}

			// Trim line-breaks from the end
			for (var i = lines.length-1; i >= 0; i--) {
				if (lines[i].trim() === '') {
					lines.splice(i, 1);
				} else break;
			}

			return lines.join('\n');
		}

		// Main function for betterTrim()
		return (function(snippetEl) {
			var content = trimLineBreaks(snippetEl.innerHTML);
			var lines = content.split('\n');
			// Calculate the minimum amount to remove on each line start of the snippet (can be 0)
			var pad = lines.reduce(function(acc, line) {
				if (line.length > 0 && trimLeft(line).length > 0 && acc > line.length - trimLeft(line).length) {
					return line.length - trimLeft(line).length;
				}
				return acc;
			}, Number.POSITIVE_INFINITY);
			// Slice each line with this amount
			return lines.map(function(line, index) {
				return line.slice(pad);
			})
			.join('\n');
		})(snippetEl);
	}

	var RevealHighlight = {

		HIGHLIGHT_STEP_DELIMITER: '|',
		HIGHLIGHT_LINE_DELIMITER: ',',
		HIGHLIGHT_LINE_RANGE_DELIMITER: '-',

		init: function() {
			// Read the plugin config options and provide fallbacks
			var config = Reveal.getConfig().highlight || {};
			config.highlightOnLoad = typeof config.highlightOnLoad === 'boolean' ? config.highlightOnLoad : true;
			config.escapeHTML = typeof config.escapeHTML === 'boolean' ? config.escapeHTML : true;
			config.location = typeof config.location === 'string' ? config.location : './plugin/highlight';

			loadScript( config.location + '/highlight.min.js', function() {

				/* highlightjs-line-numbers.js 2.6.0 | (C) 2018 Yauheni Pakala | MIT License | github.com/wcoder/highlightjs-line-numbers.js */
				/* Edited by Hakim for reveal.js; removed async timeout */
				!function(n,e){"use strict";function t(){var n=e.createElement("style");n.type="text/css",n.innerHTML=g(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}",[v,L,b]),e.getElementsByTagName("head")[0].appendChild(n)}function r(t){"interactive"===e.readyState||"complete"===e.readyState?i(t):n.addEventListener("DOMContentLoaded",function(){i(t)})}function i(t){try{var r=e.querySelectorAll("code.hljs,code.nohighlight");for(var i in r)r.hasOwnProperty(i)&&l(r[i],t)}catch(o){n.console.error("LineNumbers error: ",o)}}function l(n,e){"object"==typeof n&&f(function(){n.innerHTML=s(n,e)})}function o(n,e){if("string"==typeof n){var t=document.createElement("code");return t.innerHTML=n,s(t,e)}}function s(n,e){e=e||{singleLine:!1};var t=e.singleLine?0:1;return c(n),a(n.innerHTML,t)}function a(n,e){var t=u(n);if(""===t[t.length-1].trim()&&t.pop(),t.length>e){for(var r="",i=0,l=t.length;i<l;i++)r+=g('<tr><td class="{0}"><div class="{1} {2}" {3}="{5}"></div></td><td class="{4}"><div class="{1}">{6}</div></td></tr>',[j,m,L,b,p,i+1,t[i].length>0?t[i]:" "]);return g('<table class="{0}">{1}</table>',[v,r])}return n}function c(n){var e=n.childNodes;for(var t in e)if(e.hasOwnProperty(t)){var r=e[t];h(r.textContent)>0&&(r.childNodes.length>0?c(r):d(r.parentNode))}}function d(n){var e=n.className;if(/hljs-/.test(e)){for(var t=u(n.innerHTML),r=0,i="";r<t.length;r++){var l=t[r].length>0?t[r]:" ";i+=g('<span class="{0}">{1}</span>\n',[e,l])}n.innerHTML=i.trim()}}function u(n){return 0===n.length?[]:n.split(y)}function h(n){return(n.trim().match(y)||[]).length}function f(e){e()}function g(n,e){return n.replace(/\{(\d+)\}/g,function(n,t){return e[t]?e[t]:n})}var v="hljs-ln",m="hljs-ln-line",p="hljs-ln-code",j="hljs-ln-numbers",L="hljs-ln-n",b="data-line-number",y=/\r\n|\r|\n/g;n.hljs?(n.hljs.initLineNumbersOnLoad=r,n.hljs.lineNumbersBlock=l,n.hljs.lineNumbersValue=o,t()):n.console.error("highlight.js not detected!")}(window,document);


				[].slice.call( document.querySelectorAll( '.reveal pre code' ) ).forEach( function( block ) {

					// Trim whitespace if the "data-trim" attribute is present
					if( block.hasAttribute( 'data-trim' ) && typeof block.innerHTML.trim === 'function' ) {
						block.innerHTML = betterTrim( block );
					}

					// Escape HTML tags unless the "data-noescape" attrbute is present
					if( config.escapeHTML && !block.hasAttribute( 'data-noescape' )) {
						block.innerHTML = block.innerHTML.replace( /</g,"&lt;").replace(/>/g, '&gt;' );
					}

					// Re-highlight when focus is lost (for contenteditable code)
					block.addEventListener( 'focusout', function( event ) {
						hljs.highlightBlock( event.currentTarget );
					}, false );

					if( config.highlightOnLoad ) {
						RevealHighlight.highlightBlock( block );
					}
				} );

			})

		},

		/**
		 * Highlights a code block. If the <code> node has the
		 * 'data-line-numbers' attribute we also generate slide
		 * numbers.
		 *
		 * If the block contains multiple line highlight steps,
		 * we clone the block and create a fragment for each step.
		 */
		highlightBlock: function( block ) {

			hljs.highlightBlock( block );

			// Don't generate line numbers for empty code blocks
			if( block.innerHTML.trim().length === 0 ) return;

			if( block.hasAttribute( 'data-line-numbers' ) ) {
				hljs.lineNumbersBlock( block, { singleLine: true } );

				// If there is at least one highlight step, generate
				// fragments
				var highlightSteps = RevealHighlight.deserializeHighlightSteps( block.getAttribute( 'data-line-numbers' ) );
				if( highlightSteps.length > 1 ) {

					// If the original code block has a fragment-index,
					// each clone should follow in an incremental sequence
					var fragmentIndex = parseInt( block.getAttribute( 'data-fragment-index' ), 10 );
					if( typeof fragmentIndex !== 'number' || isNaN( fragmentIndex ) ) {
						fragmentIndex = null;
					}

					// Generate fragments for all steps except the original block
					highlightSteps.slice(1).forEach( function( highlight ) {

						var fragmentBlock = block.cloneNode( true );
						fragmentBlock.setAttribute( 'data-line-numbers', RevealHighlight.serializeHighlightSteps( [ highlight ] ) );
						fragmentBlock.classList.add( 'fragment' );
						block.parentNode.appendChild( fragmentBlock );
						RevealHighlight.highlightLines( fragmentBlock );

						if( typeof fragmentIndex === 'number' ) {
							fragmentBlock.setAttribute( 'data-fragment-index', fragmentIndex );
							fragmentIndex += 1;
						}
						else {
							fragmentBlock.removeAttribute( 'data-fragment-index' );
						}

					} );

					block.removeAttribute( 'data-fragment-index' )
					block.setAttribute( 'data-line-numbers', RevealHighlight.serializeHighlightSteps( [ highlightSteps[0] ] ) );

				}

				RevealHighlight.highlightLines( block );

			}

		},

		/**
		 * Visually emphasize specific lines within a code block.
		 * This only works on blocks with line numbering turned on.
		 *
		 * @param {HTMLElement} block a <code> block
		 * @param {String} [linesToHighlight] The lines that should be
		 * highlighted in this format:
		 * "1" 		= highlights line 1
		 * "2,5"	= highlights lines 2 & 5
		 * "2,5-7"	= highlights lines 2, 5, 6 & 7
		 */
		highlightLines: function( block, linesToHighlight ) {

			var highlightSteps = RevealHighlight.deserializeHighlightSteps( linesToHighlight || block.getAttribute( 'data-line-numbers' ) );

			if( highlightSteps.length ) {

				highlightSteps[0].forEach( function( highlight ) {

					var elementsToHighlight = [];

					// Highlight a range
					if( typeof highlight.end === 'number' ) {
						elementsToHighlight = [].slice.call( block.querySelectorAll( 'table tr:nth-child(n+'+highlight.start+'):nth-child(-n+'+highlight.end+')' ) );
					}
					// Highlight a single line
					else if( typeof highlight.start === 'number' ) {
						elementsToHighlight = [].slice.call( block.querySelectorAll( 'table tr:nth-child('+highlight.start+')' ) );
					}

					if( elementsToHighlight.length ) {
						elementsToHighlight.forEach( function( lineElement ) {
							lineElement.classList.add( 'highlight-line' );
						} );

						block.classList.add( 'has-highlights' );
					}

				} );

			}

		},

		/**
		 * Parses and formats a user-defined string of line
		 * numbers to highlight.
		 *
		 * @example
		 * RevealHighlight.deserializeHighlightSteps( '1,2|3,5-10' )
		 * // [
		 * //   [ { start: 1 }, { start: 2 } ],
		 * //   [ { start: 3 }, { start: 5, end: 10 } ]
		 * // ]
		 */
		deserializeHighlightSteps: function( highlightSteps ) {

			// Remove whitespace
			highlightSteps = highlightSteps.replace( /\s/g, '' );

			// Divide up our line number groups
			highlightSteps = highlightSteps.split( RevealHighlight.HIGHLIGHT_STEP_DELIMITER );

			return highlightSteps.map( function( highlights ) {

				return highlights.split( RevealHighlight.HIGHLIGHT_LINE_DELIMITER ).map( function( highlight ) {

					// Parse valid line numbers
					if( /^[\d-]+$/.test( highlight ) ) {

						highlight = highlight.split( RevealHighlight.HIGHLIGHT_LINE_RANGE_DELIMITER );

						var lineStart = parseInt( highlight[0], 10 ),
							lineEnd = parseInt( highlight[1], 10 );

						if( isNaN( lineEnd ) ) {
							return {
								start: lineStart
							};
						}
						else {
							return {
								start: lineStart,
								end: lineEnd
							};
						}

					}
					// If no line numbers are provided, no code will be highlighted
					else {

						return {};

					}

				} );

			} );

		},

		/**
		 * Serializes parsed line number data into a string so
		 * that we can store it in the DOM.
		 */
		serializeHighlightSteps: function( highlightSteps ) {

			return highlightSteps.map( function( highlights ) {

				return highlights.map( function( highlight ) {

					// Line range
					if( typeof highlight.end === 'number' ) {
						return highlight.start + RevealHighlight.HIGHLIGHT_LINE_RANGE_DELIMITER + highlight.end;
					}
					// Single line
					else if( typeof highlight.start === 'number' ) {
						return highlight.start;
					}
					// All lines
					else {
						return '';
					}

				} ).join( RevealHighlight.HIGHLIGHT_LINE_DELIMITER );

			} ).join( RevealHighlight.HIGHLIGHT_STEP_DELIMITER );

		}

	}

	Reveal.registerPlugin( 'highlight', RevealHighlight );

	return RevealHighlight;

}));