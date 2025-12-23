/* RevealThemeSwitcher: Enhanced UI for theme switching + live editor */
var RevealThemeSwitcher = window.RevealThemeSwitcher || (function(){
  const { el, keyToggle } = window.RTP_SHARED;
  const THEMES = [
    'minimal-dark','neon-night','solarized-plus','aurora','paper','oceanic','dragula','monokai-pro',
    'one-dark-pro','nord','cobalt2','shades-of-purple','material-darker','night-owl','ayu-mirage','tokyo-night',
    'horizon-dark','synthwave84','cyberpunk','gruvbox-dark','solarized-light','material-light',
    'ayu-light','quite-light','one-light','bluloco-light','palenight-light','minimal-light',
    'papercolor-light','catppuccin-latte','catppuccin-mocha','catppuccin-frappe','catppuccin-macchiato',
    'rose-pine-dawn','rose-pine-moon','fairyfloss','panda','iceberg','nightfox','dayfox',
    'afterglow','dark-vibrant','challenger-deep','hopscotch','high-contrast-dark','high-contrast-light',
    'noctis','material-palenight','blackboard','flatland','spacegray'
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
    else applyTheme('minimal-dark');

    const custom = localStorage.getItem('rtp-custom-theme');
    if (custom) {
      try {
        const { bg, fg, ac } = JSON.parse(custom);
        applyCustomTheme({ bg, fg, ac });
      } catch {}
    }
  }

  function applyCustomTheme({ bg, fg, ac }) {
    document.documentElement.style.setProperty('--bg', bg);
    document.documentElement.style.setProperty('--fg', fg);
    document.documentElement.style.setProperty('--ac', ac);
  }

  function randomTheme() {
    const pick = THEMES[Math.floor(Math.random() * THEMES.length)];
    applyTheme(pick);
  }

  function panel() {
    const container = el('div', { class: 'rtp-panel', id: 'rtp-theme-panel', style: { display: 'none' } }, [
      el('h4', {}, 'Themes'),
      el('div', { class: 'rtp-grid' }, THEMES.map(t =>
        el('div', { class: 'rtp-theme-tile', onclick: () => applyTheme(t) }, t)
      )),
      el('button', { class: 'rtp-btn', onclick: randomTheme, style:{margin:'8px 0'} }, '🎲 Random Theme'),

      el('h4', {}, 'Live Theme Editor'),
      el('div', { class: 'rtp-grid' }, [
        el('label', {}, ['BG ', el('input', { type:'color', id:'th-bg', value:'#ffffff' })]),
        el('label', {}, ['Text ', el('input', { type:'color', id:'th-fg', value:'#111111' })]),
        el('label', {}, ['Accent ', el('input', { type:'color', id:'th-ac', value:'#4f46e5' })]),
      ]),
      el('div', { class:'rtp-toolbar' }, [
        el('button', { class:'rtp-btn', onclick: ()=> {
          const bg=document.getElementById('th-bg').value;
          const fg=document.getElementById('th-fg').value;
          const ac=document.getElementById('th-ac').value;
          applyCustomTheme({ bg, fg, ac });
        }}, 'Apply'),
        el('button', { class:'rtp-btn', onclick: ()=> {
          const custom = {
            bg:document.getElementById('th-bg').value,
            fg:document.getElementById('th-fg').value,
            ac:document.getElementById('th-ac').value
          };
          localStorage.setItem('rtp-custom-theme', JSON.stringify(custom));
          alert('Custom theme saved!');
        }}, 'Save')
      ]),

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
