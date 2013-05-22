`-*- word-wrap: t; -*-`

# Server-Side Includes

- Added a `main-ssi.shtml` which includes `_included/meta.html` and `_included/content.html` at the top level. (This `_included` directory is excluded from Git via `.gitignore`.)

- `meta.html` should carry `<title>` and `<meta>` entries as in the example `index.html`

- `content.html` should carry the content from the `<div class="reveal">` downwards.

## Author

[Nick Rothwell](http://www.cassiel.com).
