import type Reveal from 'reveal.js';

export interface KaTeXPlugin extends Reveal.Plugin {
	id: 'katex';
}

export interface MathJax2Plugin extends Reveal.Plugin {
	id: 'mathjax2';
}

export interface MathJax3Plugin extends Reveal.Plugin {
	id: 'mathjax3';
}

export interface MathJax4Plugin extends Reveal.Plugin {
	id: 'mathjax4';
}

export interface MathPlugin extends MathJax2Plugin {
	KaTeX: () => KaTeXPlugin;
	MathJax2: () => MathJax2Plugin;
	MathJax3: () => MathJax3Plugin;
	MathJax4: () => MathJax4Plugin;
}

declare const Math: MathPlugin;

export default Math;
