
/* RevealThemeSwitcher: UI to change theme & palette quickly */
var RevealThemeSwitcher = window.RevealThemeSwitcher || (function(){
  const { el, keyToggle } = window.RTP_SHARED;
  const THEMES = [
    'minimal-dark','neon-night','solarized-plus','aurora','paper','oceanic'
  ];
  function applyTheme(name) {
    const path = `./plugin/themes/${name}.css`;
    let link = document.getElementById('rtp-theme-link');
    if (!link) {
      link = document.createElement('link');
      link.id = 'rtp-theme-link';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = path;
    document.documentElement.setAttribute('data-rtp-theme', name);
    localStorage.setItem('rtp-theme', name);
    document.dispatchEvent(new CustomEvent('rtp:theme', { detail: { name }}));
  }
  function restoreTheme() {
    const saved = localStorage.getItem('rtp-theme');
    if (saved) applyTheme(saved);
  }

  function panel() {
    const container = el('div', { class: 'rtp-panel', id: 'rtp-theme-panel', style: { display: 'none' } }, [
      el('h4', {}, 'Themes'),
      el('div', { class: 'rtp-grid' }, THEMES.map(t =>
        el('div', { class: 'rtp-theme-tile', onclick: () => applyTheme(t) }, t)
      )),
      el('h4', {}, 'Accent Hue'),
      el('input', { type: 'range', min: '0', max: '360', value: localStorage.getItem('rtp-hue') || 200, class: 'rtp-range', oninput: (e) => {
        const h = e.target.value;
        document.documentElement.style.setProperty('--rtp-accent-h', h);
        localStorage.setItem('rtp-hue', h);
        document.dispatchEvent(new CustomEvent('rtp:hue', { detail: { h } }));
      }}),
      el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: .8 } }, 'Tip: Press T to toggle this panel')
    ]);
    document.body.appendChild(container);
    return container;
  }

  function togglePanel() {
    let p = document.getElementById('rtp-theme-panel');
    if (!p) p = panel();
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  }

  function mountUI() {
    const bar = el('div', { class: 'rtp-floating' }, [
      el('button', { class: 'rtp-btn', onclick: togglePanel }, 'Themes')
    ]);
    document.body.appendChild(bar);
    keyToggle('T', togglePanel);
  }

  return {
    id: 'ThemeSwitcher',
    init: function(deck){
      restoreTheme();
      const hue = localStorage.getItem('rtp-hue');
      if (hue) document.documentElement.style.setProperty('--rtp-accent-h', hue);
      mountUI();
    }
  };
})();
