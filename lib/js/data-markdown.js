// From https://gist.github.com/1343518
// Modified by Hakim to handle markdown indented with tabs
(function(){

    var slides = document.querySelectorAll('[data-markdown]');

    for( var i = 0, len = slides.length; i < len; i++ ) {
        var elem = slides[i];

        // strip leading whitespace so it isn't evaluated as code
        var text = elem.innerHTML;

        var leadingWs = text.match(/^\n?(\s*)/)[1].length,
            leadingTabs = text.match(/^\n?(\t*)/)[1].length;

        if( leadingTabs > 0 ) {
            text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
        }
        else if( leadingWs > 1 ) {
            text = text.replace( new RegExp('\\n? {' + leadingWs + '}','g'), '\n' );
        }

        // here, have sum HTML
        elem.innerHTML = (new Showdown.converter()).makeHtml(text);
    }

})();