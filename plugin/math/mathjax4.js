/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax 4
 *
 * @author Hakim El Hattab
 * @author Gerhard Burger
 * @author Khris Griffis, Ph.D.
 */
export const MathJax4 = () => {

    // The reveal.js instance this plugin is attached to
    let deck;

    let defaultOptions = {
        tex: {
            inlineMath: [ [ '$', '$' ], [ '\\(', '\\)' ]  ]
        },
        options: {
            skipHtmlTags: [ 'script', 'noscript', 'style', 'textarea', 'pre', 'code' ]
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
                MathJax.startup.promise.then(() => {
                    deck.layout();
                });
            }
        }
    };

    function loadScript( url, callback ) {

        let script = document.createElement( 'script' );
        script.type = 'text/javascript';
        script.id = 'MathJax-script';
        script.src = url;
        script.async = true;

        // Wrapper for callback to make sure it only fires once
        script.onload = () => {
            if (typeof callback === 'function') {
                callback.call();
                callback = null;
            }
        };

        document.head.appendChild( script );
    }

    return {
        id: 'mathjax4',
        init: function(reveal) {

            deck = reveal;

            let revealOptions = deck.getConfig().mathjax4 || {};
            let options = { ...defaultOptions, ...revealOptions };
            options.tex = { ...defaultOptions.tex, ...revealOptions.tex };
            options.options = { ...defaultOptions.options, ...revealOptions.options };
            options.startup = { ...defaultOptions.startup, ...revealOptions.startup };

            let url = options.mathjax || 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
            options.mathjax = null;

            window.MathJax = options;

            loadScript(url, function() {
                // MathJax 4.0.0 uses async startup, so we need to wait for it to be ready
                MathJax.startup.promise.then(() => {
                    // Initial typeset after startup
                    MathJax.typeset();

                    // Reprocess equations in slides when they turn visible
                    deck.addEventListener('slidechanged', function(event) {
                        MathJax.typeset();
                    });
                });
            });
        }
    };
};
