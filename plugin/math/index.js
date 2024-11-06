import {KaTeX} from "./katex";
import {MathJax2} from "./mathjax2";
import {MathJax3} from "./mathjax3";

const defaultTypesetter = MathJax2;

/*!
 * This plugin is a wrapper for the MathJax2,
 * MathJax3 and KaTeX typesetter plugins.
 */
export default Plugin = Object.assign( defaultTypesetter(), {
	KaTeX,
	MathJax2,
	MathJax3
} );