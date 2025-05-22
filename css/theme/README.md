## Dependencies

Themes are written using Sass to keep things modular and reduce the need for repeated selectors across files. Make sure that you have the reveal.js development environment installed before proceeding: https://revealjs.com/installation/#full-setup

## Creating a Theme

To create your own theme, start by duplicating a `.scss` file in [/css/theme/source](https://github.com/hakimel/reveal.js/blob/master/css/theme/source). It will be automatically compiled from Sass to CSS (see the [gulpfile](https://github.com/hakimel/reveal.js/blob/master/gulpfile.js)) when you run `npm run build:styles`.

Each theme file follows the same structure:

1. **Include [/css/theme/template/mixins.scss](https://github.com/hakimel/reveal.js/blob/master/css/theme/template/mixins.scss)**  
   Shared utility functions.

2. **Include [/css/theme/template/settings.scss](https://github.com/hakimel/reveal.js/blob/master/css/theme/template/settings.scss)**  
   Declares a set of custom CSS variables that the template file (step 4) expects. Each of these variables can be overridden to customize the theme.

3. **Include [/css/theme/template/theme.scss](https://github.com/hakimel/reveal.js/blob/master/css/theme/template/theme.scss)**  
   The template theme file which will generate final CSS output based on the currently defined variables.

4. **Optionally add custom fonts and/or additional styles**
