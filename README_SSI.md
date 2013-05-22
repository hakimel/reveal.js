`-*- word-wrap: t; -*-`

# Server-Side Includes

- Added a `main-ssi.shtml` which includes `_included/head.html` and `_included/content.html` at the top level. (This `_included` directory is excluded from Git via `.gitignore`.)

- `head.html` should carry `<title>` and `<meta>` entries as in the example `index.html` - and I've also commented out the theme from the main file, so `meta.html` should carry a stylesheet link for that.

- `content.html` should carry the content from the `<div class="reveal">` downwards.

## Setup

Apache needs to be configuted to allow SSI. This is my personal configuration under OS X:

        <Directory "/Users/nick/Sites/">
        	Options Includes Indexes Multiviews
        	AddType text/html .shtml
        	AddOutputFilter INCLUDES .shtml
        	AllowOverride AuthConfig Limit
        	Order allow,deny
        	Allow from all
        </Directory>

## Author

[Nick Rothwell](http://www.cassiel.com).
