if(window.location.search.match( /print-pdf/gi )) {
	var linkElement = document.querySelector('link[href$="css/print/paper.css"]')
	var paperCssPath = linkElement.getAttribute('href');
	var pdfCssSource = linkElement.getAttribute('href').replace('paper.css', 'pdf.css');
	linkElement.setAttribute('href',pdfCssSource);

	if(window.location.search.match( /print-notes/gi )) {
		var linkNotesStyles = document.createElement('link');
		linkNotesStyles.setAttribute('href', paperCssPath.replace('paper.css', 'notes.css'));
		linkNotesStyles.setAttribute('rel', 'stylesheet');
		document.getElementsByTagName('head')[0].appendChild(linkNotesStyles);
	}
}
