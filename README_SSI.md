`-*- word-wrap: t; -*-`

# Server Side Includes

The file `index-ssi.shtml` is a copy of `index.html` with the actual slide content, and some header content, removed; instead it contains a couple of server side include statements. (it therefore needs to be rendered through a server which supports SSI, such as Apache.)

In the `<head>` section there's this:

    <!--#include file="_included/head.html" -->

and in the body there's this:

    <!--#include file="_included/content.html" -->

The `_included` subdirectory isn't checked into this repo, and is something you're presumably going to create and populate yourself. (I'm generating slides from Clojure via Hiccup, and have a few Clojure source files, one for each presentation, each of which builds its own `head.html` and `content.html` for me.)

`head.html` should provide the `<title>` and (if required) `<meta ...>` elements. It must also contain a `<link ...>` for the main theme (since it seems reasonable that different presentations might use different styles).

`content.html` contains the actual slides, wrapped in the `<div class="reveal">` element.

## Slides in Clojure

See the [companion project](https://github.com/cassiel/reveal-js-demo-slides) for an example slide deck and instructions for generating a presentation as a sub-module of this project.

## Setup

Apache needs to be configuted to allow SSI. This is my personal configuration (in `/etc/apache2/users/nick`) under OS X:

        <Directory "/Users/nick/Sites/">
        	Options Includes Indexes Multiviews
        	AddType text/html .shtml
        	AddOutputFilter INCLUDES .shtml
        	AllowOverride AuthConfig Limit
        	Order allow,deny
        	Allow from all
        </Directory>

With this, and with the `reveal.js` repo. checked out into `~/Sites`, I can access my presentation at:

        http://localhost/~nick/reveal.js/index-ssi.shtml

## Author

[Nick Rothwell](http://www.cassiel.com).
