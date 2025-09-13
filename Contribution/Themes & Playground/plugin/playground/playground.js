
/* RevealPlayground: HTML/CSS/JS live coding */
var RevealPlayground = window.RevealPlayground || (function(){
  const { el, keyToggle } = window.RTP_SHARED;

  function buildOverlay(){
    const htmlTA = el('textarea', { id: 'rtp-ta-html', placeholder: '<h1>Hello</h1>' });
    const cssTA  = el('textarea', { id: 'rtp-ta-css',  placeholder: 'h1{color:tomato}' });
    const jsTA   = el('textarea', { id: 'rtp-ta-js',   placeholder: "console.log('Hi');" });

    const overlay = el('div', { class: 'rtp-playground', id: 'rtp-playground' }, [
      el('div', { class: 'rtp-pg-header' }, [
        el('div', { class: 'rtp-pg-title' }, 'Reveal Code Playground'),
        el('div', { class: 'rtp-pg-actions' }, [
          el('button', { class: 'rtp-small-btn', onclick: run }, 'Run'),
          el('button', { class: 'rtp-small-btn', onclick: reset }, 'Reset'),
          el('button', { class: 'rtp-small-btn', onclick: share }, 'Share'),
          el('button', { class: 'rtp-small-btn', onclick: () => toggle(false) }, 'Close')
        ])
      ]),
      el('div', { class: 'rtp-pg-body' }, [
        el('div', { class: 'rtp-pg-editors' }, [
          el('div', { class: 'rtp-pg-editor' }, [ el('label', {}, 'HTML'), htmlTA ]),
          el('div', { class: 'rtp-pg-editor' }, [ el('label', {}, 'CSS'), cssTA ]),
          el('div', { class: 'rtp-pg-editor' }, [ el('label', {}, 'JS'), jsTA ]),
        ]),
        el('div', { class: 'rtp-pg-preview' }, [
          el('iframe', { class: 'rtp-pg-iframe', id: 'rtp-pg-iframe', title: 'Playground Preview' })
        ])
      ])
    ]);
    document.body.appendChild(overlay);
    return overlay;
  }

  function toggle(show){
    let pg = document.getElementById('rtp-playground');
    if (!pg) pg = buildOverlay();
    pg.style.display = (show ?? (pg.style.display === 'none')) ? 'flex' : 'none';
  }

  function getEditorsFromSlide(slide){
    const ta = {
      html: slide?.dataset?.html || '',
      css:  slide?.dataset?.css  || '',
      js:   slide?.dataset?.js   || ''
    };
    return ta;
  }

  function run(){
    const iframe = document.getElementById('rtp-pg-iframe');
    const html = document.getElementById('rtp-ta-html').value;
    const css  = document.getElementById('rtp-ta-css').value;
    const js   = document.getElementById('rtp-ta-js').value;

    const doc = `<!doctype html><html><head><meta charset="utf-8">
      <style>${css}</style></head><body>${html}
      <script>try{${js}}catch(e){console.error(e);document.body.appendChild(Object.assign(document.createElement('pre'),{textContent:String(e)}));}<\/script>
    </body></html>`;
    iframe.srcdoc = doc;
  }
	
	function reset() {
    const slide = (typeof Reveal !== 'undefined' && Reveal.getCurrentSlide) ? Reveal.getCurrentSlide() : null;

    // Ensure overlay and textarea elements exist
    let pg = document.getElementById('rtp-playground');
    if (!pg) pg = buildOverlay();

    const htmlTA = document.getElementById('rtp-ta-html');
    const cssTA  = document.getElementById('rtp-ta-css');
    const jsTA   = document.getElementById('rtp-ta-js');

    if (!htmlTA || !cssTA || !jsTA) return; // defensive

    // If the current slide has data-playground (i.e., it provided preload values), restore them.
    if (slide && slide.hasAttribute && slide.hasAttribute('data-playground')) {
      htmlTA.value = slide.getAttribute('data-html') || '';
      cssTA.value  = slide.getAttribute('data-css')  || '';
      jsTA.value   = slide.getAttribute('data-js')   || '';
    } else {
      // otherwise clear editors
      htmlTA.value = '';
      cssTA.value  = '';
      jsTA.value   = '';
    }

    // Update preview
    run();
  }
  
  function share() {
  const html = document.getElementById('rtp-ta-html').value;
  const css  = document.getElementById('rtp-ta-css').value;
  const js   = document.getElementById('rtp-ta-js').value;

  const content = `/* Reveal Playground Code Snippet */\n\n/* HTML */\n${html}\n\n/* CSS */\n${css}\n\n/* JS */\n${js}`;

  // Copy code to clipboard
  navigator.clipboard.writeText(content).then(() => {
    console.log("Code copied to clipboard.");

    // Open Codeshare in a new tab
    window.open('https://codeshare.io/new', '_blank');

    // Show popup reminder
    setTimeout(() => {
      alert("✅ Your code is copied!\n\nPlease paste it into the Codeshare editor (Ctrl+V or Cmd+V).");
    }, 1000);
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
    alert("❌ Failed to copy code. Please copy manually.");
  });
}

  function mountButton(){
    const bar = document.querySelector('.rtp-floating');
    const btn = (bar && bar.querySelector('.rtp-btn.playground')) || (function(){
      const b = el('button', { class: 'rtp-btn playground', onclick: () => {
        const slide = Reveal.getCurrentSlide();
        const data = getEditorsFromSlide(slide);
        let pg = document.getElementById('rtp-playground');
        if (!pg) pg = buildOverlay();
        document.getElementById('rtp-ta-html').value = data.html || '<h1>Hello Reveal</h1>';
        document.getElementById('rtp-ta-css').value  = data.css  || 'h1{font-family:sans-serif;text-align:center}';
        document.getElementById('rtp-ta-js').value   = data.js   || "console.log('Ready')";
        toggle(true);
        run();
      } }, 'Playground');
      if (bar) bar.appendChild(b); else document.body.appendChild(el('div', { class: 'rtp-floating' }, [b]));
      return b;
    })();
    keyToggle('P', () => btn.click());
  }

  return {
    id: 'Playground',
    init: function(deck){
      mountButton();
      deck.on('slidechanged', (e) => {
        if (e?.currentSlide?.dataset?.playground != null){
          const slide = e.currentSlide;
          const data = getEditorsFromSlide(slide);
          let pg = document.getElementById('rtp-playground');
          if (!pg) pg = buildOverlay();
          document.getElementById('rtp-ta-html').value = data.html || '';
          document.getElementById('rtp-ta-css').value  = data.css  || '';
          document.getElementById('rtp-ta-js').value   = data.js   || '';
          toggle(true);
          run();
        }
      });
    }
  };
})();
