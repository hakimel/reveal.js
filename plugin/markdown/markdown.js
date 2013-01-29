// From https://gist.github.com/1343518
// Modified by Hakim to handle Markdown indented with tabs
(function(){

    if( typeof Showdown === 'undefined' ) {
        throw 'The reveal.js Markdown plugin requires Showdown to be loaded';
    }

    var stripLeadingWhitespace = function(section) {

        var template = section.querySelector( 'script' );

        // strip leading whitespace so it isn't evaluated as code
        var text = ( template || section ).innerHTML;

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

    var slidifyMarkdown = function(markdown, separator, vertical) {

        separator = separator || '^\n---\n$';

        var reSeparator = new RegExp(separator + (vertical ? '|' + vertical : ''), 'mg'),
            reHorSeparator = new RegExp(separator),
            matches,
            lastIndex = 0,
            isHorizontal,
            wasHorizontal = true,
            content,
            sectionStack = [],
            markdownSections = '';

        // iterate until all blocks between separators are stacked up
        while( matches = reSeparator.exec(markdown) ) {

            // determine direction (horizontal by default)
            isHorizontal = reHorSeparator.test(matches[0]);

            if( !isHorizontal && wasHorizontal ) {
                // create vertical stack
                sectionStack.push([]);
            }

            // pluck slide content from markdown input
            content = markdown.substring(lastIndex, matches.index);

            if( isHorizontal && wasHorizontal ) {
                // add to horizontal stack
                sectionStack.push(content);
            } else {
                // add to vertical stack
                sectionStack[sectionStack.length-1].push(content);
            }

            lastIndex = reSeparator.lastIndex;
            wasHorizontal = isHorizontal;

        }

        // add the remaining slide
        (wasHorizontal ? sectionStack : sectionStack[sectionStack.length-1]).push(markdown.substring(lastIndex));

        // flatten the hierarchical stack, and insert <section data-markdown> tags
        for( var k = 0, klen = sectionStack.length; k < klen; k++ ) {
            markdownSections += typeof sectionStack[k] === 'string'
                ? '<section data-markdown>' + sectionStack[k] + '</section>'
                : '<section><section data-markdown>' + sectionStack[k].join('</section><section data-markdown>') + '</section></section>';
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

                xhr.onreadystatechange = function () {
                    if( xhr.readyState === 4 ) {
                        section.outerHTML = slidifyMarkdown( xhr.responseText, section.getAttribute('data-separator'), section.getAttribute('data-vertical') );
                    }
                };

                xhr.open('GET', url, false);
                xhr.send();

            } else if( section.getAttribute('data-separator') ) {

                var markdown = stripLeadingWhitespace(section);
                section.outerHTML = slidifyMarkdown( markdown, section.getAttribute('data-separator'), section.getAttribute('data-vertical') );

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

        section.innerHTML = (new Showdown.converter()).makeHtml(markdown);

        if( notes ) {
            section.appendChild( notes );
        }

    };

    querySlidingMarkdown();

    queryMarkdownSlides();

})();
