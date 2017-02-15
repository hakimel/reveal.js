/**
 * phantomjs script for printing presentations to PDF.
 *
 * Example:
 * phantomjs print-pdf.js "http://lab.hakim.se/reveal-js?print-pdf" reveal-demo.pdf
 *
 * @author Manuel Bieh (https://github.com/manuelbieh)
 * @author Hakim El Hattab (https://github.com/hakimel)
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

console.log( 'Export PDF: Reading reveal.js config [1/3]' );

probePage.open( inputFile, function( status ) {

	console.log( 'Export PDF: Preparing print layout [2/3]' );

	var config = probePage.evaluate( function() {
		return Reveal.getConfig();
	} );

	printPage.paperSize = {
		width: config.width * ( 1 + config.margin ),
		height: config.height * ( 1 + config.margin ),
		border: 0
	};

	printPage.open( inputFile, function( status ) {
		window.setTimeout( function() {
			console.log( 'Export PDF: Writing file [3/3]' );
			printPage.render( outputFile );
			console.log( 'Export PDF: Finished successfully!' );
			phantom.exit();
		}, 1000 );
	} );

} );


