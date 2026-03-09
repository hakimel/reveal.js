import type Reveal from 'reveal.js';
import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealMarkdown from 'reveal.js/plugin/markdown';
import RevealMath from 'reveal.js/plugin/math';
import RevealNotes from 'reveal.js/plugin/notes';
import RevealSearch from 'reveal.js/plugin/search';
import RevealZoom from 'reveal.js/plugin/zoom';

const api: Reveal.Api | null = null;
const pluginFactory: Reveal.PluginFunction = RevealZoom;
const plugins: Array<Reveal.Plugin | Reveal.PluginFunction> = [RevealHighlight(), RevealMarkdown(), RevealMath, RevealNotes, RevealSearch, RevealZoom];
const mathjax4Config: Reveal.Mathjax4Config = {
	tex: {
		inlineMath: [['$', '$']],
		displayMath: [['$$', '$$']],
		macros: {
			R: '\\mathbb{R}',
			set: ['\\left\\{#1 \\; ; \\; #2\\right\\}', 2],
		},
	},
	options: {
		skipHtmlTags: ['script', 'style'],
	},
	output: {
		font: 'mathjax-stix2',
		displayOverflow: 'linebreak',
		linebreaks: {
			inline: true,
			width: '100%',
			lineleading: 0.2,
		},
	},
};
const revealConfig: Parameters<Reveal.Api['initialize']>[0] = {
	mathjax4: mathjax4Config,
};

const highlight = RevealHighlight();
const highlightId: string = highlight.id;
const highlightSteps = highlight.deserializeHighlightSteps('1,3-5|8');
const highlightSerialized: string = highlight.serializeHighlightSteps(highlightSteps);
const highlightBounds = highlight.getHighlightedLineBounds(document.createElement('code'));
highlight.highlightLines(document.createElement('code'), '1-2');

const markdown = RevealMarkdown();
const markdownId: string = markdown.id;
const markdownHtml: string = markdown.slidify('# Slide');
const markdownPromise: Promise<void[]> = markdown.processSlides(document);
const convertPromise: Promise<void> = markdown.convertSlides();
const markdownOptions = markdown.markdownOptions;

const math = RevealMath;
const mathId: 'mathjax2' = math.id;
const mathJax4Id: 'mathjax4' = math.MathJax4().id;
const katexId: 'katex' = math.KaTeX().id;

const notes = RevealNotes();
const notesId: 'notes' = notes.id;
notes.open();

const search = RevealSearch();
const searchId: 'search' = search.id;
search.open();
search.close();
search.toggle();

const zoom = RevealZoom();
const zoomId: 'zoom' = zoom.id;

void highlightId;
void highlightSteps;
void highlightSerialized;
void highlightBounds;
void markdownId;
void markdownHtml;
void markdownPromise;
void convertPromise;
void markdownOptions;
void mathId;
void mathJax4Id;
void katexId;
void notesId;
void searchId;
void zoomId;
void api;
void pluginFactory;
void plugins;
void mathjax4Config;
void revealConfig;
