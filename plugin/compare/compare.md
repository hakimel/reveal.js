This plugin provides fonctionality to compare 2 images by overlaying them with a sliders that uncover the bottom one.


Minimal example on one slide:
```html
<section>
	<div class="r-stack"><div class="compare">
		<img data-src=img/image1.png>
		<img data-src=img/image2.png>
	</div></div>
</section>
```

Add this line in the head section of the index.html file:
```html
<link rel="stylesheet" href="plugin/compare/Compare.css">
```

Add this line at the end of the body in the index.html file:
```html
<script src="plugin/compare/Compare.js"></script>
```

Original code from https://github.com/CreativeTechGuy/RevealJS
Only the class names have been altered to not create ambiguity with the main reveal project here.
