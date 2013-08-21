// From https://gist.github.com/1343518
// Modified by Hakim to handle Markdown indented with tabs
(function(){

    if( typeof marked === 'undefined' ) {
        throw 'The reveal.js Markdown plugin requires marked to be loaded';
    }

    if (typeof hljs !== 'undefined') {
        marked.setOptions({
            highlight: function (lang, code) {
                return hljs.highlightAuto(lang, code).value;
            }
        });
    }

    var stripLeadingWhitespace = function(section) {

        var template = section.querySelector( 'script' );

        // strip leading whitespace so it isn't evaluated as code
        var text = ( template || section ).textContent;

        var leadingWs = text.match(/^\n?(\s*)/)[1].length,
            leadingTabs = text.match(/^\n?(\t*)/)[1].length;

        if( leadingTabs > 0 ) {
            text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
        }
        else if( leadingWs > 1 ) {
            text = text.replace( new RegExp('\\n? {' + leadingWs + '}','g'), '\n' );
        }

        return text;

    };

    var twrap = function(el) {
        var content = el.content || el;
        content += el.asideContent ? ('<aside class="notes" data-markdown>' + el.asideContent + '</aside>') : '';
        return '<script type="text/template">' + content + '</script>';
    };

    var getForwardedAttributes = function(section) {
        var attributes = section.attributes;
        var result = [];

        for( var i = 0, len = attributes.length; i < len; i++ ) {
            var name = attributes[i].name,
                value = attributes[i].value;

            // disregard attributes that are used for markdown loading/parsing
            if( /data\-(markdown|separator|vertical|notes)/gi.test( name ) ) continue;

            if( value ) {
                result.push( name + '=' + value );
            }
            else {
                result.push( name );
            }
        }

        return result.join( ' ' );
    };

    var slidifyMarkdown = function(markdown, separator, vertical, notes, attributes) {

        separator = separator || '^\n---\n$';
        notes = notes || 'note:';

        var separatorRegex = new RegExp( separator + ( vertical ? '|' + vertical : '' ), 'mg' ),
            horizontalSeparatorRegex = new RegExp( separator ),
            notesSeparatorRegex = new RegExp( notes, 'mgi' ),
            matches,
            noteMatch,
            lastIndex = 0,
            isHorizontal,
            wasHorizontal = true,
            content,
            asideContent,
            slide,
            sectionStack = [],
            markdownSections = '';

        // iterate until all blocks between separators are stacked up
        while( matches = separatorRegex.exec( markdown ) ) {
            asideContent = null;

            // determine direction (horizontal by default)
            isHorizontal = horizontalSeparatorRegex.test( matches[0] );

            if( !isHorizontal && wasHorizontal ) {
                // create vertical stack
                sectionStack.push( [] );
            }

            // pluck slide content from markdown input
            content = markdown.substring( lastIndex, matches.index );
            noteMatch = content.split( notesSeparatorRegex );

            if( noteMatch.length === 2 ) {
                content = noteMatch[0];
                asideContent = noteMatch[1].trim();
            }

            slide = {
                content: content,
                asideContent: asideContent || ""
            };

            if( isHorizontal && wasHorizontal ) {
                // add to horizontal stack
                sectionStack.push(slide);
            } else {
                // add to vertical stack
                sectionStack[sectionStack.length-1].push(slide);
            }

            lastIndex = separatorRegex.lastIndex;
            wasHorizontal = isHorizontal;
        }

        // add the remaining slide
        (wasHorizontal ? sectionStack : sectionStack[sectionStack.length-1]).push(markdown.substring(lastIndex));

        // flatten the hierarchical stack, and insert <section data-markdown> tags
        for( var k = 0, klen = sectionStack.length; k < klen; k++ ) {
            // vertical
            if( sectionStack[k].propertyIsEnumerable(length) && typeof sectionStack[k].splice === 'function' ) {
                markdownSections += '<section '+ attributes +'>' +
                                        '<section data-markdown>' +  sectionStack[k].map(twrap).join('</section><section data-markdown>') + '</section>' +
                                    '</section>';
            } else {
                markdownSections += '<section '+ attributes +' data-markdown>' + twrap( sectionStack[k] ) + '</section>';
            }
        }

        return markdownSections;
    };

    var querySlidingMarkdown = function() {

        var sections = document.querySelectorAll( '[data-markdown]'),
            section;

        for( var j = 0, jlen = sections.length; j < jlen; j++ ) {

            section = sections[j];

            if( section.getAttribute('data-markdown').length ) {

                var xhr = new XMLHttpRequest(),
                    url = section.getAttribute('data-markdown');

                datacharset = section.getAttribute('data-charset');
                // see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
                if (datacharset != null && datacharset != '') {
                    xhr.overrideMimeType('text/html; charset=' + datacharset);
                }

                xhr.onreadystatechange = function () {
                    if( xhr.readyState === 4 ) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            section.outerHTML = slidifyMarkdown( xhr.responseText, section.getAttribute('data-separator'), section.getAttribute('data-vertical'), section.getAttribute('data-notes'), getForwardedAttributes(section) );
                        } else {
                            section.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + url + ' failed with the HTTP status ' + xhr.status +
                                '. Check your browser\'s JavaScript console for more details.' +
                                '<p>Remember that you need to serve the presentation HTML from a HTTP server and the Markdown file must be there too.</p></section>';
                        }
                    }
                };

                xhr.open('GET', url, false);
                try {
                    xhr.send();
                } catch (e) {
                    alert('Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e);
                }

            } else if( section.getAttribute('data-separator') ) {

                var markdown = stripLeadingWhitespace(section);
                section.outerHTML = slidifyMarkdown( markdown, section.getAttribute('data-separator'), section.getAttribute('data-vertical'), section.getAttribute('data-notes'), getForwardedAttributes(section) );

            }
        }

    };

    var queryMarkdownSlides = function() {

        var sections = document.querySelectorAll( '[data-markdown]');

        for( var j = 0, jlen = sections.length; j < jlen; j++ ) {

            makeHtml(sections[j]);

        }

    };

    var makeHtml = function(section) {

        var notes = section.querySelector( 'aside.notes' );

        var markdown = stripLeadingWhitespace(section);

        section.innerHTML = marked(markdown);

        if( notes ) {
            section.appendChild( notes );
        }

    };

    querySlidingMarkdown();

    queryMarkdownSlides();

})();
