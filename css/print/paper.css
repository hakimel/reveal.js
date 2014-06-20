/* Default Print Stylesheet Template
   by Rob Glazebrook of CSSnewbie.com
   Last Updated: June 4, 2008

   Feel free (nay, compelled) to edit, append, and
   manipulate this file as you see fit. */


@media print {

	/* SECTION 1: Set default width, margin, float, and
	   background. This prevents elements from extending
	   beyond the edge of the printed page, and prevents
	   unnecessary background images from printing */
	html {
		background: #fff;
		width: auto;
		height: auto;
		overflow: visible;
	}
	body {
		background: #fff;
		font-size: 20pt;
		width: auto;
		height: auto;
		border: 0;
		margin: 0 5%;
		padding: 0;
		overflow: visible;
		float: none !important;
	}

	/* SECTION 2: Remove any elements not needed in print.
	   This would include navigation, ads, sidebars, etc. */
	.nestedarrow,
	.controls,
	.fork-reveal,
	.share-reveal,
	.state-background,
	.reveal .progress,
	.reveal .backgrounds {
		display: none !important;
	}

	/* SECTION 3: Set body font face, size, and color.
	   Consider using a serif font for readability. */
	body, p, td, li, div {
		font-size: 20pt!important;
		font-family: Georgia, "Times New Roman", Times, serif !important;
		color: #000;
	}

	/* SECTION 4: Set heading font face, sizes, and color.
	   Differentiate your headings from your body text.
	   Perhaps use a large sans-serif for distinction. */
	h1,h2,h3,h4,h5,h6 {
		color: #000!important;
		height: auto;
		line-height: normal;
		font-family: Georgia, "Times New Roman", Times, serif !important;
		text-shadow: 0 0 0 #000 !important;
		text-align: left;
		letter-spacing: normal;
	}
	/* Need to reduce the size of the fonts for printing */
	h1 { font-size: 28pt !important;  }
	h2 { font-size: 24pt !important; }
	h3 { font-size: 22pt !important; }
	h4 { font-size: 22pt !important; font-variant: small-caps; }
	h5 { font-size: 21pt !important; }
	h6 { font-size: 20pt !important; font-style: italic; }

	/* SECTION 5: Make hyperlinks more usable.
	   Ensure links are underlined, and consider appending
	   the URL to the end of the link for usability. */
	a:link,
	a:visited {
		color: #000 !important;
		font-weight: bold;
		text-decoration: underline;
	}
	/*
	.reveal a:link:after,
	.reveal a:visited:after {
		content: " (" attr(href) ") ";
		color: #222 !important;
		font-size: 90%;
	}
	*/


	/* SECTION 6: more reveal.js specific additions by @skypanther */
	ul, ol, div, p {
		visibility: visible;
		position: static;
		width: auto;
		height: auto;
		display: block;
		overflow: visible;
		margin: 0;
		text-align: left !important;
	}
	.reveal pre,
	.reveal table {
		margin-left: 0;
		margin-right: 0;
	}
	.reveal pre code {
		padding: 20px;
		border: 1px solid #ddd;
	}
	.reveal blockquote {
		margin: 20px 0;
	}
	.reveal .slides {
		position: static !important;
		width: auto !important;
		height: auto !important;

		left: 0 !important;
		top: 0 !important;
		margin-left: 0 !important;
		margin-top: 0 !important;
		padding: 0 !important;
		zoom: 1 !important;

		overflow: visible !important;
		display: block !important;

		text-align: left !important;
		-webkit-perspective: none;
		   -moz-perspective: none;
		    -ms-perspective: none;
		        perspective: none;

		-webkit-perspective-origin: 50% 50%;
		   -moz-perspective-origin: 50% 50%;
		    -ms-perspective-origin: 50% 50%;
		        perspective-origin: 50% 50%;
	}
	.reveal .slides section {
		visibility: visible !important;
		position: static !important;
		width: 100% !important;
		height: auto !important;
		display: block !important;
		overflow: visible !important;

		left: 0 !important;
		top: 0 !important;
		margin-left: 0 !important;
		margin-top: 0 !important;
		padding: 60px 20px !important;
		z-index: auto !important;

		opacity: 1 !important;

		page-break-after: always !important;

		-webkit-transform-style: flat !important;
		   -moz-transform-style: flat !important;
		    -ms-transform-style: flat !important;
		        transform-style: flat !important;

		-webkit-transform: none !important;
		   -moz-transform: none !important;
		    -ms-transform: none !important;
		        transform: none !important;

		-webkit-transition: none !important;
		   -moz-transition: none !important;
		    -ms-transition: none !important;
		        transition: none !important;
	}
	.reveal .slides section.stack {
		padding: 0 !important;
	}
	.reveal section:last-of-type {
		page-break-after: avoid !important;
	}
	.reveal section .fragment {
		opacity: 1 !important;
		visibility: visible !important;

		-webkit-transform: none !important;
		   -moz-transform: none !important;
		    -ms-transform: none !important;
		        transform: none !important;
	}
	.reveal section img {
		display: block;
		margin: 15px 0px;
		background: rgba(255,255,255,1);
		border: 1px solid #666;
		box-shadow: none;
	}

	.reveal section small {
		font-size: 0.8em;
	}

}