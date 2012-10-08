// From https://gist.github.com/1343518
// Modified by Hakim to handle Markdown indented with tabs
(function(){

    var sections = document.querySelectorAll( '[data-markdown]' );

    for( var i = 0, len = sections.length; i < len; i++ ) {
        var section = sections[i];

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

        section.innerHTML = (new Showdown.converter()).makeHtml(text);
    }

})();