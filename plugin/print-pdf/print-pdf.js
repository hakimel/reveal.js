/**
 * phantomjs script for printing presentations to PDF.
 *
 * Example:
 * phantomjs print-pdf.js "http://revealjs.com?print-pdf" reveal-demo.pdf
 *
 * @author Manuel Bieh (https://github.com/manuelbieh)
 * @author Hakim El Hattab (https://github.com/hakimel)
 * @author Manuel Riezebosch (https://github.com/riezebosch)
 */

// html2pdf.js
var system = require( 'system' );

var probePage = new WebPage();
var printPage = new WebPage();

var inputFile = system.args[1] || 'index.html?print-pdf';
var outputFile = system.args[2] || 'slides.pdf';

if( outputFile.match( /\.pdf$/gi ) === null ) {
	outputFile += '.pdf';
}

console.log( 'Export PDF: Reading reveal.js config [1/4]' );

probePage.open( inputFile, function( status ) {

	console.log( 'Export PDF: Preparing print layout [2/4]' );

	var config = probePage.evaluate( function() {
		return Reveal.getConfig();
	} );

	if( config ) {

		printPage.paperSize = {
			width: Math.floor( config.width * ( 1 + config.margin ) ),
			height: Math.floor( config.height * ( 1 + config.margin ) ),
			border: 0
		};

		printPage.open( inputFile, function( status ) {
			console.log( 'Export PDF: Preparing pdf [3/4]')
			printPage.evaluate(function() {
				Reveal.isReady() ? window.callPhantom() : Reveal.addEventListener( 'pdf-ready', window.callPhantom );
			});
		} );

		printPage.onCallback = function(data) {
			// For some reason we need to "jump the queue" for syntax highlighting to work.
			// See: http://stackoverflow.com/a/3580132/129269
			setTimeout(function() {
				console.log( 'Export PDF: Writing file [4/4]' );
				printPage.render( outputFile );
				console.log( 'Export PDF: Finished successfully!' );
				phantom.exit();
			}, 0);
		};
	}
	else {

        console.log( 'Export PDF: Unable to read reveal.js config. Make sure the input address points to a reveal.js page.' );
        phantom.exit(1);

    }
} );


