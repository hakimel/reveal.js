# math-katex Plugin

A plugin that renders mathematical formulas inside reveal.js slides using
 [KaTeX](https://github.com/Khan/KaTeX]).

- Lightweight rendering, thanks to KaTeX
- Renders all formulas when presentation loads (no re-rendering when slide changes)
- No MathJax CDN dependency



## Usage

There are two usage modes:

1. TeX-style, wrapped in `$…$` or `$$…$$` (escape literal dollars with `\$`). Works in Markdown, too
2. Wrapped in HTML elements with class `formula` (or `math`)

Rendered TeX-style formulas also get class `formula` added so that you can style them. `$…$` formulas in addition get class `inline`, `$$…$$` class `display`.


### TeX Style

**You must set the `data-math` attribute on each slide**, or set `enableGlobally` on the configuration object (see below). Otherwise it may eat all your dollars …

Example, display-style formula (block): e.g. `$$\frac{1}{1 + e^{-x}}$$`

Use a single $ for in-line formulas: e.g. `$P(A \mid B)$`


### Wrappend in an element

Wrap the formula in an element with class formula (or math):

`<div class="formula">\frac{1}{1 + e^{-x}}</div>`



## Plugin setup

1. Add the KaTeX assets.
2. Add the plugin.

See the [example](example.html) (add `plugin/math-katex` to the relative paths).


### HTML (KaTeX assets)

Add the KaTeX stylesheet:

`<link rel="stylesheet" href="plugin/math-katex/katex/katex.min.css">`

And the script:

`<script src="plugin/math-katex/katex/katex.min.js"></script>`


### Javascript

Just add the dependency when calling `Reveal.initialize`. You can also set properties on the `math` configuration object, if required.


```javascript
Reveal.initialize({
    // … presentation configuration …

    // `math-katex` plugin:

    // *optional* configuration:
    math: {
        // Uncomment to disable some KaTeX workarounds:
        // enableWorkarounds: false

        // Elements to ignore for math rendering (defaults shown):
        // ignoredElements: [ 'pre', 'code', 'script' ]

        // Set `enableGlobally` to `true` to enable formulas wrapped
        // with `$` characters for all slides (disabled by default,
        // may interfere with your financial matters …):
        //
        // enableGlobally: true
    },

    // Specify the plugin as a dependency:
	dependencies: [
        { src: 'plugin/math-katex/math-katex.js', async: true }
	]
});
```


## KaTeX version

This plugin uses the the [v0.1.1 KaTeX release](https://github.com/Khan/KaTeX/releases/tag/v0.1.1).