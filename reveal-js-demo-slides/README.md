`-*- word-wrap: t; -*-`

# reveal-js-demo-slides

Some Clojure source for generating demo slides for [reveal.js](https://github.com/hakimel/reveal.js).

## Usage

Check out our `reveal.js` with the Server Side Include support:

        $ git clone https://github.com/cassiel/reveal.js

(Hopefully that will make its way into the main release.) If you're on a Mac, that should probably go into `~/Sites`.

Check out this project as a submodule:

        $ cd [...]/reveal.js
        $ git submodule add git@github.com:cassiel/reveal-js-demo-slides.git reveal-js-demo-slides

Do the [Leiningen](https://github.com/technomancy/leiningen) thing to evaluate the code in `reveal-js-demo-slides/example-slides.clj`. (I do everything in [emacs-live](https://github.com/overtone/emacs-live).)

This should result in files in the directory `_included` in the main `reveal.js` directory. Depending on your server configuration, browsing to `index-ssi.shtml` should result in a complete presentation.

## License

Copyright © 2013 Nick Rothwell.

Distributed under the Eclipse Public License, the same as Clojure.
