import type Reveal from 'reveal.js';

interface MathPlugin extends Reveal.Plugin {
	KaTeX: Reveal.PluginFunction;
	MathJax2: Reveal.PluginFunction;
	MathJax3: Reveal.PluginFunction;
	MathJax4: Reveal.PluginFunction;
}

declare const Math: MathPlugin;

export default Math;
