// html2pdf.js
var page = new WebPage();
var system = require("system");

page.paperSize = {
  format: "A4",
  orientation: "landscape",
  margin: {
	left:"0", 
	right:"0", 
	top:"0", 
	bottom:"0"
  }
};
page.zoomFactor = 1.5;

var revealFile = system.args[1] || 'index.html?print-pdf';
var slideFile = system.args[2] || 'slides.pdf';

if(slideFile.length - 4 != slideFile.lastIndexOf('.pdf')) {
	slideFile += '.pdf';
}

page.open(revealFile, function (status) {
	page.render(slideFile);
	phantom.exit();
});