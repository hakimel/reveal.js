# math-katex Plugin

A plugin that renders mathematical formulas inside reveal.js slides using
 [KaTeX](https://github.com/Khan/KaTeX]).

- Lightweight rendering, thanks to KaTeX
- Marks syntax errors on the slide
- Renders all formulas when presentation loads (no re-rendering when slide changes)


## Plugin setup

1. Add the plugin.

    ```javascript
    Reveal.initialize({
        // … other configuration …

    	dependencies: [
            { src: 'plugin/math-katex/math-katex.js', async: true }
    	]
    });
    ```
    
2. By default KaTeX will be loaded from a CDN. It is however recommended that you add KaTeX to your presentation, so that formula rendering will work **offline**:

    Get a [KaTeX release](https://github.com/Khan/KaTeX/releases/download/v0.1.1/katex.tar.gz) and put it into the `lib` directory of the presentation (extracted KaTeX files go into `lib/katex`).


## Usage

See the [example](example.html).

There are two usage modes:

1. TeX-style, wrapped in `$…$` or `$$…$$`. Works in Markdown, too
2. Wrapped in HTML elements with class `formula` (or `math`)

Rendered TeX-style formulas also get class `formula` added so that you can style them. `$…$` formulas in addition get class `inline`, `$$…$$` class `display`.


### TeX Style (dollars)

Use `$$…$$` for display-style (block) formulas: `$$\frac{1}{1 + e^{-x}}$$`

Use `$…$` for in-line formulas: e.g. `$P(A \mid B)$`

Escape literal dollar characters with `\$`.

*As an alternative:* If you have many slides that use literal dollar characters it may be easier to explicitly activate formula rendering *per slide*: Set `math.enableGlobally` to `false` and then activate formula replacements on each slide (`<section>`) by setting the `data-math` attribute (no value required).


### Wrapped in an element

Wrap the formula in an element with class formula (or math):

`<div class="formula display">\frac{1}{1 + e^{-x}}</div>`

Display mode is in-line by default, add class `display` if needed.


### Exclude elements

You can exclude elements from formula rendering by:

1. Adding the class `math-ignored` to an element or its (direct) parent
1. Adding the element type to the `math.ignoredElements` array on the configuration object (default: `pre`, `code`)



## Optional configuration

Just add the dependency when calling `Reveal.initialize`. You can also set properties on the `math` configuration object, if required.


```javascript
Reveal.initialize({
    // … presentation configuration …

    // `math-katex` plugin:

    // *Optional* configuration:
    math: {
        // Uncomment to disable syntax error notifications
        // notificationsEnabled: false   // default: true

        // Uncomment to disable some KaTeX workarounds:
        // enableWorkarounds: false      // default: `true`

        // Elements to ignore for math rendering (defaults shown):
        // ignoredElements: [ 'pre', 'code' ]

        // Set `enableGlobally` to `false` to avoid excessive
        // escaping. You will then need to activate `$…$`-style
        // replacements per slide with a `data-math` attribute
        // (formulas wrapped in elements are still activated
        // everywhere).
        //
        // enableGlobally: false
    },

    // Specify the plugin as a dependency:
	dependencies: [
        { src: 'plugin/math-katex/math-katex.js', async: true }
	]
});
```


## KaTeX version

This plugin uses the the [v0.1.1 KaTeX release](https://github.com/Khan/KaTeX/releases/tag/v0.1.1).
