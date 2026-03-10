import type { RevealPlugin } from 'reveal.js';

// @ts-expect-error The runtime implementation remains in JS during the migration.
import MathImplementation from './plugin.js';

export interface KaTeXPlugin extends RevealPlugin {
	id: 'katex';
}

export interface MathJax2Plugin extends RevealPlugin {
	id: 'mathjax2';
}

export interface MathJax3Plugin extends RevealPlugin {
	id: 'mathjax3';
}

export interface MathJax4Plugin extends RevealPlugin {
	id: 'mathjax4';
}

export interface MathPlugin extends MathJax2Plugin {
	KaTeX: () => KaTeXPlugin;
	MathJax2: () => MathJax2Plugin;
	MathJax3: () => MathJax3Plugin;
	MathJax4: () => MathJax4Plugin;
}

const Math = MathImplementation as MathPlugin;

export default Math;
