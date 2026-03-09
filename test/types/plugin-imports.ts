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

const highlight = RevealHighlight();
const highlightId: string = highlight.id;

const markdown = RevealMarkdown();
const markdownId: string = markdown.id;

const math = RevealMath;
const mathId: string = math.id;
const mathJax4Id: string = math.MathJax4().id;

const notes = RevealNotes();
const notesId: string = notes.id;
notes.open();

const search = RevealSearch();
const searchId: string = search.id;
search.open();
search.close();
search.toggle();

const zoom = RevealZoom();
const zoomId: string = zoom.id;

void highlightId;
void markdownId;
void mathId;
void mathJax4Id;
void notesId;
void searchId;
void zoomId;
void api;
void pluginFactory;
void plugins;
