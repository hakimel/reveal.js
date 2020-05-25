/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for KaTeX.
 *
 * @author Hakim El Hattab
 * @author Gerhard Burger
 */
const Plugin = () => {
	let deck;

	let defaultOptions = {
		version: '0.11.1',
		delimiters: [
			{left: '$', right: '$', display: false},
			{left: '$$', right: '$$', display: true},
			{left: '\\(', right: '\\)', display: false},
			{left: '\\[', right: '\\]', display: true}
		],
		ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre']
	}

	const loadCss = src => {
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = src;
		document.head.appendChild(link);
	};

	/**
	 * Loads a JavaScript file and returns a Promise for when it is loaded
	 * Credits: https://aaronsmith.online/easily-load-an-external-script-using-javascript/
	 */
	const loadScript = src => {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.onload = resolve
			script.onerror = reject
			script.src = src
			document.head.append(script)
		})
	};

	return {
		id: 'math',

		init: function (reveal) {

			deck = reveal;

			let revealOptions = deck.getConfig().math || {};

			let options = {...defaultOptions, ...revealOptions};
			const {local, version, ...katexOptions} = options;

			let baseUrl = options.local || 'https://cdn.jsdelivr.net/npm/katex';
			let versionString = options.local ? '' : '@' + options.version;

			let cssUrl = baseUrl + versionString + '/dist/katex.min.css';
			let katexUrl = baseUrl + versionString + '/dist/katex.min.js';
			let karUrl = baseUrl + versionString + '/dist/contrib/auto-render.js';

			loadCss(cssUrl);

			// For some reason dynamically loading with defer attribute doesn't result in the expected behavior, the below code does
			loadScript(katexUrl)
				.then(() => {
					loadScript(karUrl)
				})

			window.addEventListener('load', (event) => {
				renderMathInElement(document.body, katexOptions);
				deck.layout();
			});
		}
	}

};

export default Plugin;

