import Reveal from './js/reveal';
import zoomPlugin from './plugin/zoom-js/zoom-for-bundler';
import helloWorldPluginCreator from './plugin/helloWorldPluginCreator';

import './css/print/paper.css';
import './css/print/pdf.css';

window.Reveal = Reveal;


Reveal.initialize({
  hash: true,
  dependencies: [
    { id: 'zoom', plugin: zoomPlugin, async: true },
    { id: 'hellows', plugin: helloWorldPluginCreator(83, 'S', 'sync plugin'), async: false },
    { id: 'hellowa', plugin: helloWorldPluginCreator(65, 'A', 'async plugin'), async: true },
  ]
});
