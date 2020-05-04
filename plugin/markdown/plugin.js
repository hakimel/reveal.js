/*!
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */

import marked from 'marked'

const DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$',
	  DEFAULT_NOTES_SEPARATOR = 'notes?:',
	  DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
	  DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';

const SCRIPT_END_PLACEHOLDER = '__SCRIPT_END__';

const CODE_LINE_NUMBER_REGEX = /\[([\s\d,|-]*)\]/;

const Plugin = () => {

	// The reveal.js instance this plugin is attached to
	let deck;

	/**
	 * Retrieves the markdown contents of a slide section
	 * element. Normalizes leading tabs/whitespace.
	 */
	function getMarkdownFromSlide( section ) {

		// look for a <script> or <textarea data-template> wrapper
		var template = section.querySelector( '[data-template]' ) || section.querySelector( 'script' );

		// strip leading whitespace so it isn't evaluated as code
		var text = ( template || section ).textContent;

		// restore script end tags
		text = text.replace( new RegExp( SCRIPT_END_PLACEHOLDER, 'g' ), '</script>' );

		var leadingWs = text.match( /^\n?(\s*)/ )[1].length,
			leadingTabs = text.match( /^\n?(\t*)/ )[1].length;

		if( leadingTabs > 0 ) {
			text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
		}
		else if( leadingWs > 1 ) {
			text = text.replace( new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n' );
		}

		return text;

	}

	/**
	 * Given a markdown slide section element, this will
	 * return all arguments that aren't related to markdown
	 * parsing. Used to forward any other user-defined arguments
	 * to the output markdown slide.
	 */
	function getForwardedAttributes( section ) {

		var attributes = section.attributes;
		var result = [];

		for( var i = 0, len = attributes.length; i < len; i++ ) {
			var name = attributes[i].name,
				value = attributes[i].value;

			// disregard attributes that are used for markdown loading/parsing
			if( /data\-(markdown|separator|vertical|notes)/gi.test( name ) ) continue;

			if( value ) {
				result.push( name + '="' + value + '"' );
			}
			else {
				result.push( name );
			}
		}

		return result.join( ' ' );

	}

	/**
	 * Inspects the given options and fills out default
	 * values for what's not defined.
	 */
	function getSlidifyOptions( options ) {

		options = options || {};
		options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
		options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
		options.attributes = options.attributes || '';

		return options;

	}

	/**
	 * Helper function for constructing a markdown slide.
	 */
	function createMarkdownSlide( content, options ) {

		options = getSlidifyOptions( options );

		var notesMatch = content.split( new RegExp( options.notesSeparator, 'mgi' ) );

		if( notesMatch.length === 2 ) {
			content = notesMatch[0] + '<aside class="notes">' + marked(notesMatch[1].trim()) + '</aside>';
		}

		// prevent script end tags in the content from interfering
		// with parsing
		content = content.replace( /<\/script>/g, SCRIPT_END_PLACEHOLDER );

		return '<script type="text/template">' + content + '</script>';

	}

	/**
	 * Parses a data string into multiple slides based
	 * on the passed in separator arguments.
	 */
	function slidify( markdown, options ) {

		options = getSlidifyOptions( options );

		var separatorRegex = new RegExp( options.separator + ( options.verticalSeparator ? '|' + options.verticalSeparator : '' ), 'mg' ),
			horizontalSeparatorRegex = new RegExp( options.separator );

		var matches,
			lastIndex = 0,
			isHorizontal,
			wasHorizontal = true,
			content,
			sectionStack = [];

		// iterate until all blocks between separators are stacked up
		while( matches = separatorRegex.exec( markdown ) ) {
			var notes = null;

			// determine direction (horizontal by default)
			isHorizontal = horizontalSeparatorRegex.test( matches[0] );

			if( !isHorizontal && wasHorizontal ) {
				// create vertical stack
				sectionStack.push( [] );
			}

			// pluck slide content from markdown input
			content = markdown.substring( lastIndex, matches.index );

			if( isHorizontal && wasHorizontal ) {
				// add to horizontal stack
				sectionStack.push( content );
			}
			else {
				// add to vertical stack
				sectionStack[sectionStack.length-1].push( content );
			}

			lastIndex = separatorRegex.lastIndex;
			wasHorizontal = isHorizontal;
		}

		// add the remaining slide
		( wasHorizontal ? sectionStack : sectionStack[sectionStack.length-1] ).push( markdown.substring( lastIndex ) );

		var markdownSections = '';

		// flatten the hierarchical stack, and insert <section data-markdown> tags
		for( var i = 0, len = sectionStack.length; i < len; i++ ) {
			// vertical
			if( sectionStack[i] instanceof Array ) {
				markdownSections += '<section '+ options.attributes +'>';

				sectionStack[i].forEach( function( child ) {
					markdownSections += '<section data-markdown>' + createMarkdownSlide( child, options ) + '</section>';
				} );

				markdownSections += '</section>';
			}
			else {
				markdownSections += '<section '+ options.attributes +' data-markdown>' + createMarkdownSlide( sectionStack[i], options ) + '</section>';
			}
		}

		return markdownSections;

	}

	/**
	 * Parses any current data-markdown slides, splits
	 * multi-slide markdown into separate sections and
	 * handles loading of external markdown.
	 */
	function processSlides( scope ) {

		return new Promise( function( resolve ) {

			var externalPromises = [];

			[].slice.call( scope.querySelectorAll( '[data-markdown]:not([data-markdown-parsed])') ).forEach( function( section, i ) {

				if( section.getAttribute( 'data-markdown' ).length ) {

					externalPromises.push( loadExternalMarkdown( section ).then(

						// Finished loading external file
						function( xhr, url ) {
							section.outerHTML = slidify( xhr.responseText, {
								separator: section.getAttribute( 'data-separator' ),
								verticalSeparator: section.getAttribute( 'data-separator-vertical' ),
								notesSeparator: section.getAttribute( 'data-separator-notes' ),
								attributes: getForwardedAttributes( section )
							});
						},

						// Failed to load markdown
						function( xhr, url ) {
							section.outerHTML = '<section data-state="alert">' +
								'ERROR: The attempt to fetch ' + url + ' failed with HTTP status ' + xhr.status + '.' +
								'Check your browser\'s JavaScript console for more details.' +
								'<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>' +
								'</section>';
						}

					) );

				}
				else if( section.getAttribute( 'data-separator' ) || section.getAttribute( 'data-separator-vertical' ) || section.getAttribute( 'data-separator-notes' ) ) {

					section.outerHTML = slidify( getMarkdownFromSlide( section ), {
						separator: section.getAttribute( 'data-separator' ),
						verticalSeparator: section.getAttribute( 'data-separator-vertical' ),
						notesSeparator: section.getAttribute( 'data-separator-notes' ),
						attributes: getForwardedAttributes( section )
					});

				}
				else {
					section.innerHTML = createMarkdownSlide( getMarkdownFromSlide( section ) );
				}

			});

			Promise.all( externalPromises ).then( resolve );

		} );

	}

	function loadExternalMarkdown( section ) {

		return new Promise( function( resolve, reject ) {

			var xhr = new XMLHttpRequest(),
				url = section.getAttribute( 'data-markdown' );

			var datacharset = section.getAttribute( 'data-charset' );

			// see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
			if( datacharset != null && datacharset != '' ) {
				xhr.overrideMimeType( 'text/html; charset=' + datacharset );
			}

			xhr.onreadystatechange = function( section, xhr ) {
				if( xhr.readyState === 4 ) {
					// file protocol yields status code 0 (useful for local debug, mobile applications etc.)
					if ( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 0 ) {

						resolve( xhr, url );

					}
					else {

						reject( xhr, url );

					}
				}
			}.bind( this, section, xhr );

			xhr.open( 'GET', url, true );

			try {
				xhr.send();
			}
			catch ( e ) {
				console.warn( 'Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e );
				resolve( xhr, url );
			}

		} );

	}

	/**
	 * Check if a node value has the attributes pattern.
	 * If yes, extract it and add that value as one or several attributes
	 * to the target element.
	 *
	 * You need Cache Killer on Chrome to see the effect on any FOM transformation
	 * directly on refresh (F5)
	 * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
	 */
	function addAttributeInElement( node, elementTarget, separator ) {

		var mardownClassesInElementsRegex = new RegExp( separator, 'mg' );
		var mardownClassRegex = new RegExp( "([^\"= ]+?)=\"([^\"]+?)\"|(data-[^\"= ]+?)(?=[\" ])", 'mg' );
		var nodeValue = node.nodeValue;
		var matches,
			matchesClass;
		if( matches = mardownClassesInElementsRegex.exec( nodeValue ) ) {

			var classes = matches[1];
			nodeValue = nodeValue.substring( 0, matches.index ) + nodeValue.substring( mardownClassesInElementsRegex.lastIndex );
			node.nodeValue = nodeValue;
			while( matchesClass = mardownClassRegex.exec( classes ) ) {
				if( matchesClass[2] ) {
					elementTarget.setAttribute( matchesClass[1], matchesClass[2] );
				} else {
					elementTarget.setAttribute( matchesClass[3], "" );
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * Add attributes to the parent element of a text node,
	 * or the element of an attribute node.
	 */
	function addAttributes( section, element, previousElement, separatorElementAttributes, separatorSectionAttributes ) {

		if ( element != null && element.childNodes != undefined && element.childNodes.length > 0 ) {
			var previousParentElement = element;
			for( var i = 0; i < element.childNodes.length; i++ ) {
				var childElement = element.childNodes[i];
				if ( i > 0 ) {
					var j = i - 1;
					while ( j >= 0 ) {
						var aPreviousChildElement = element.childNodes[j];
						if ( typeof aPreviousChildElement.setAttribute == 'function' && aPreviousChildElement.tagName != "BR" ) {
							previousParentElement = aPreviousChildElement;
							break;
						}
						j = j - 1;
					}
				}
				var parentSection = section;
				if( childElement.nodeName ==  "section" ) {
					parentSection = childElement ;
					previousParentElement = childElement ;
				}
				if ( typeof childElement.setAttribute == 'function' || childElement.nodeType == Node.COMMENT_NODE ) {
					addAttributes( parentSection, childElement, previousParentElement, separatorElementAttributes, separatorSectionAttributes );
				}
			}
		}

		if ( element.nodeType == Node.COMMENT_NODE ) {
			if ( addAttributeInElement( element, previousElement, separatorElementAttributes ) == false ) {
				addAttributeInElement( element, section, separatorSectionAttributes );
			}
		}
	}

	/**
	 * Converts any current data-markdown slides in the
	 * DOM to HTML.
	 */
	function convertSlides() {

		var sections = deck.getRevealElement().querySelectorAll( '[data-markdown]:not([data-markdown-parsed])');

		[].slice.call( sections ).forEach( function( section ) {

			section.setAttribute( 'data-markdown-parsed', true )

			var notes = section.querySelector( 'aside.notes' );
			var markdown = getMarkdownFromSlide( section );

			section.innerHTML = marked( markdown );
			addAttributes( 	section, section, null, section.getAttribute( 'data-element-attributes' ) ||
							section.parentNode.getAttribute( 'data-element-attributes' ) ||
							DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR,
							section.getAttribute( 'data-attributes' ) ||
							section.parentNode.getAttribute( 'data-attributes' ) ||
							DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR);

			// If there were notes, we need to re-add them after
			// having overwritten the section's HTML
			if( notes ) {
				section.appendChild( notes );
			}

		} );

		return Promise.resolve();

	}

	return {
		id: 'markdown',

		/**
		 * Starts processing and converting Markdown within the
		 * current reveal.js deck.
		 */
		init: function( reveal ) {

			deck = reveal;

			let renderer = new marked.Renderer();

			renderer.code = ( code, language ) => {

				// Off by default
				let lineNumbers = '';

				// Users can opt in to show line numbers and highlight
				// specific lines.
				// ```javascript []        show line numbers
				// ```javascript [1,4-8]   highlights lines 1 and 4-8
				if( CODE_LINE_NUMBER_REGEX.test( language ) ) {
					lineNumbers = language.match( CODE_LINE_NUMBER_REGEX )[1].trim();
					lineNumbers = `data-line-numbers="${lineNumbers}"`;
					language = language.replace( CODE_LINE_NUMBER_REGEX, '' ).trim();
				}

				return `<pre><code ${lineNumbers} class="${language}">${code}</code></pre>`;
			};

			marked.setOptions( {
				renderer,
				...deck.getConfig().markdown
			} );

			return processSlides( deck.getRevealElement() ).then( convertSlides );

		},

		// TODO: Do these belong in the API?
		processSlides: processSlides,
		convertSlides: convertSlides,
		slidify: slidify,
		marked: marked
	}

};

export default Plugin;
