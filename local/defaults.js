Reveal.initialize({
  controls: false,
  progress: false,
  history: true,
  center: false,
  rollingLinks: false,
  theme: Reveal.getQueryHash().theme,
  transition: Reveal.getQueryHash().transition || 'none', // default/cube/page/concave/zoom/linear/fade/none

  transitionSpeed: 'default',
  dependencies: [
    { src: 'reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: 'reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { 
      hljs.tabReplace = '<span class="tabindent">\t</span>';// replace tabs with spaces
      hljs.initHighlightingOnLoad(); 
    }}
  ]
});
