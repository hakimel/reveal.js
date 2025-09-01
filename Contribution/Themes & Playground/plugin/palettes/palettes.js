
/* RevealPalettes: dynamic accent palette generator & picker */
var RevealPalettes = window.RevealPalettes || (function(){
  const { el, hsl, setCSSVars, keyToggle } = window.RTP_SHARED;

  function shades(h, s=70, l=52) {
    return [
      hsl(h, s, minmax(l+15)), hsl(h, s, minmax(l+8)), hsl(h, s, l),
      hsl(h, s, minmax(l-8)), hsl(h, s, minmax(l-15)), hsl(h, s, minmax(l-22))
    ];
  }
  function minmax(v){ return Math.max(10, Math.min(90, v)); }

  function applyHue(h) {
    setCSSVars({
      '--rtp-accent-h': h
    });
    localStorage.setItem('rtp-hue', h);
    document.dispatchEvent(new CustomEvent('rtp:hue', { detail: { h } }));
  }

  function buildPanel() {
    const current = Number(localStorage.getItem('rtp-hue') || 200);
    const cont = el('div', { class: 'rtp-palette-panel', id: 'rtp-palette-panel', style: { display: 'none' } }, [
      el('div', { class: 'rtp-toolbar' }, [
        el('button', { class: 'rtp-btn', onclick: () => randomize() }, 'Randomize'),
        el('button', { class: 'rtp-btn', onclick: () => copyTokens() }, 'Copy CSS Vars')
      ]),
      el('input', { type: 'range', min: 0, max: 360, value: current, class: 'rtp-range', oninput: (e)=>{
        const h = e.target.value;
        applyHue(h);
        renderShades(h);
      }}),
      el('div', { style: { marginTop: '6px', fontSize: '12px', opacity: .8 } }, 'Tip: Press T for Themes, or use this panel with P for Playground and ` for Terminal.'),
      el('div', { id: 'rtp-shade-grid', class: 'rtp-row', style: { marginTop: '10px' } })
    ]);
    document.body.appendChild(cont);
    renderShades(current);
    return cont;
  }

  function renderShades(h){
    const grid = document.getElementById('rtp-shade-grid');
    grid.innerHTML = '';
    shades(h).forEach(c => grid.appendChild(el('div', { class: 'rtp-swatch', style: { background: c } })));
  }

  function randomize(){
    const h = Math.floor(Math.random()*360);
    applyHue(h);
    renderShades(h);
  }

  function copyTokens(){
    const h = localStorage.getItem('rtp-hue') || 200;
    const css = `:root{--rtp-accent-h:${h};--rtp-accent-s:70%;--rtp-accent-l:52%;}`;
    navigator.clipboard?.writeText(css);
    alert('Copied to clipboard:\\n' + css);
  }

  function togglePanel() {
    let p = document.getElementById('rtp-palette-panel');
    if (!p) p = buildPanel();
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  }

  return {
    id: 'Palettes',
    init: function(deck){
      const bar = document.querySelector('.rtp-floating');
      const btn = el('button', { class: 'rtp-btn', onclick: togglePanel }, 'Palettes');
      if (bar) bar.appendChild(btn); else {
        const fallback = el('div', { class: 'rtp-floating' }, [btn]);
        document.body.appendChild(fallback);
      }
    }
  };
})();
