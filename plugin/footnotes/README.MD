# The footnotes & bibliography plugin

This plugin allows adding on-slide, fixed positioned footnotes with remarks, bibliography, etc. Just add a "`<note>`" tag anywhere in the slide `<section>` and some text, link, etc. inside.

An example slide section tag can look like this:
```html
<section>
	<h3>Lorem ipsum</h3>
	<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. </p>
	<note>
		<a href="http://lipsum.com">Cicero, M. T. (45 BC). de Finibus Bonorum et Malorum. In: Rackham, H. (1914). De Natura Deorum. Heinemann, London.</a>
	</note>
</section>
```

Adding:

```javascript
{ src: 'plugin/footnotes/footnotes.js', async: false, condition: function() { return !!document.querySelector( 'note' ); } },
```
to:

```javascript
	Reveal.initialize({
				...

				dependencies: [
					...<- here
				]
			});
```

Will enable the plugin, it is also enabled by default at the moment.

## Bibliography

Adding:

```html
<script src="plugin/footnotes/bibliography.js"></script>
```

As the first script in the end of the body section, *before* the script tags loading the reveal code, will result in adding an ordered list (`<ol>`) to a slide `<section>` which has the id `reveal-bibliography`.

An example slide:

```html
<section id="reveal-bibliography">
	<h4>Bibliography</h4>
</section>
```

will be turned into:
```html
<section id="reveal-bibliography">
	<h4>Bibliography</h4>
	<ol>
		<li>[...]</li>
	</ol>
</section>
```
with a list item containing the contents of each `<note>` tag that appears in the slides.

Depending on the length of your bibliography you might need to adjust the font-size in `css/reveal.css` for the `#reveal-bibliography ol li` element styling that can be found in the footnotes plugin section of the style file.

