/* RevealThemeSwitcher: Theme + Font + Slide Editor */
var RevealThemeSwitcher = window.RevealThemeSwitcher || (function(){
  const { el, keyToggle, BUS, setCSSVars } = window.RTP_SHARED || {};
  // Fallback for when RTP_SHARED isn't yet available
  const helpers = window.RTP_SHARED || {};
  const _el = helpers.el || ((tag, attrs = {}, children = []) => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else if (k === 'style') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.substring(2), v);
      else if (v !== false && v !== undefined) e.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  });
  const keyToggleLocal = helpers.keyToggle || ((k, h) => { document.addEventListener('keydown', e => { if (e.key === k && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); h(); } }); });

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

  // Font choices (system + Google fonts). Google fonts will be injected on demand.
  const FONTS = [
    {name:'System UI', css:'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'},
    {name:'Inter', css:'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto'},
    {name:'Roboto', css:'Roboto, system-ui, -apple-system, "Segoe UI", Arial'},
    {name:'Montserrat', css:'"Montserrat", system-ui, -apple-system'},
    {name:'Poppins', css:'Poppins, system-ui, -apple-system'},
    {name:'Merriweather', css:'Merriweather, serif'},
    {name:'Lora', css:'Lora, serif'},
    {name:'Playfair Display', css:'"Playfair Display", serif'},
    {name:'Source Sans 3', css:'"Source Sans 3", system-ui'},
    {name:'Arial', css:'Arial, Helvetica, sans-serif'}
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

    const hue = localStorage.getItem('rtp-hue');
    if (hue) document.documentElement.style.setProperty('--rtp-accent-h', hue);

    const custom = localStorage.getItem('rtp-custom-theme');
    if (custom) {
      try {
        const { bg, fg, ac } = JSON.parse(custom);
        applyCustomTheme({ bg, fg, ac });
      } catch {}
    }

    // fonts
    const font = localStorage.getItem('rtp-font-family');
    const size = localStorage.getItem('rtp-font-size');
    const weight = localStorage.getItem('rtp-font-weight');
    if (font) applyFont(font, size || '24px', weight || '600');
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

  // ---------- Fonts ----------
  function injectGoogleFont(name) {
    // simple mapping: convert spaces -> + for query
    const family = name.replace(/\s+/g, '+');
    // avoid injecting duplicate links
    if (document.querySelector(`link[data-rtp-font="${name}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-rtp-font', name);
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;600;700&display=swap`;
    document.head.appendChild(link);
  }

  function findFontByName(name) {
    return FONTS.find(f => f.name === name) || {name: name, css: name};
  }

  function applyFont(name, size = '24px', weight = '600') {
    const f = findFontByName(name);
    // if it's a known Google font (not system) inject it
    const googleCandidates = ['Inter','Roboto','Montserrat','Poppins','Merriweather','Lora','Playfair Display','Source Sans 3'];
    if (googleCandidates.includes(f.name)) injectGoogleFont(f.name);

    const cssValue = f.css || name;
    document.documentElement.style.setProperty('--rtp-font-family', cssValue);
    document.documentElement.style.setProperty('--rtp-font-size', size);
    document.documentElement.style.setProperty('--rtp-font-weight', weight);
    localStorage.setItem('rtp-font-family', name);
    localStorage.setItem('rtp-font-size', size);
    localStorage.setItem('rtp-font-weight', weight);

    // apply to all slide text by updating root css variables (theme-switcher.css uses these)
    document.dispatchEvent(new CustomEvent('rtp:font', { detail: { name, size, weight }}));
  }

  // ---------- Slide content persistence & editor ----------
  function saveSlideContent(idx, html) {
    try { localStorage.setItem(`rtp-slide-${idx}`, html); } catch(e) {}
  }
  function loadSlideContent(idx) {
    return localStorage.getItem(`rtp-slide-${idx}`);
  }
  function saveSlideBg(idx, value) {
    try { localStorage.setItem(`rtp-slide-bg-${idx}`, value); } catch(e) {}
  }
  function loadSlideBg(idx) {
    return localStorage.getItem(`rtp-slide-bg-${idx}`);
  }

  // Editor overlay (reused)
  let overlayEl = null;
  function createEditorOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = _el('div', { class: 'rtp-editor-overlay', style: { display: 'none' } }, [
      _el('div', { class: 'rtp-editor-card' }, [
        _el('div', { class: 'rtp-editor-head' }, [
          _el('strong', {}, 'Slide Editor'),
          _el('button', { class: 'rtp-btn', onclick: () => hideEditor() }, 'Close')
        ]),
        _el('textarea', { id: 'rtp-editor-text', style: { width: '100%', height: '220px', marginTop: '8px', boxSizing: 'border-box' } }),
        _el('div', { style: { display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' } }, [
          _el('label', {}, ['Background ', _el('input', { type: 'color', id: 'rtp-editor-bg' }) ]),
          _el('label', {}, ['Text Color ', _el('input', { type: 'color', id: 'rtp-editor-fg' }) ]),
          _el('button', { class: 'rtp-btn', onclick: ()=> { applyEditorChanges(); } }, 'Apply'),
          _el('button', { class: 'rtp-btn', onclick: ()=> { saveEditorChanges(true); } }, 'Save')
        ])
      ])
    ]);
    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  let currentEditingSection = null;
  function showEditorForSection(section, idx) {
    createEditorOverlay();
    overlayEl.style.display = 'flex';
    currentEditingSection = { section, idx };
    const ta = document.getElementById('rtp-editor-text');
    ta.value = section.innerHTML;
    const bgInput = document.getElementById('rtp-editor-bg');
    const fgInput = document.getElementById('rtp-editor-fg');
    const bg = section.style.background || loadSlideBg(idx) || '';
    const fg = section.style.color || '';
    bgInput.value = bg ? rgbOrHex(bg) : '#ffffff';
    fgInput.value = fg ? rgbOrHex(fg) : '#111111';
  }
  function hideEditor() {
    if (overlayEl) overlayEl.style.display = 'none';
    currentEditingSection = null;
  }
  function applyEditorChanges() {
    if (!currentEditingSection) return;
    const ta = document.getElementById('rtp-editor-text');
    const bg = document.getElementById('rtp-editor-bg').value;
    const fg = document.getElementById('rtp-editor-fg').value;
    currentEditingSection.section.innerHTML = ta.value;
    currentEditingSection.section.style.background = bg;
    currentEditingSection.section.style.color = fg;
  }
  function saveEditorChanges(persist = true) {
    if (!currentEditingSection) return;
    applyEditorChanges();
    if (persist) {
      saveSlideContent(currentEditingSection.idx, currentEditingSection.section.innerHTML);
      saveSlideBg(currentEditingSection.idx, currentEditingSection.section.style.background || '');
      alert('Slide saved locally');
    }
  }

  function rgbOrHex(val) {
    // try to parse rgb(...) into hex; if already hex, return it
    if (!val) return '#ffffff';
    if (val.startsWith('#')) return val;
    const m = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return '#ffffff';
    const r = parseInt(m[1]).toString(16).padStart(2,'0');
    const g = parseInt(m[2]).toString(16).padStart(2,'0');
    const b = parseInt(m[3]).toString(16).padStart(2,'0');
    return `#${r}${g}${b}`;
  }

  // ---------- UI Panel ----------
  function panel(deck) {
    const container = _el('div', { class: 'rtp-panel', id: 'rtp-theme-panel', style: { display: 'none' } }, [
      _el('h4', {}, 'Themes'),
      _el('div', { class: 'rtp-grid' }, THEMES.map(t =>
        _el('div', { class: 'rtp-theme-tile', onclick: () => applyTheme(t) }, t)
      )),
      _el('button', { class: 'rtp-btn', onclick: randomTheme, style:{margin:'8px 0'} }, '🎲 Random Theme'),

      _el('h4', {}, 'Live Theme Editor'),
      _el('div', { style: { display: 'grid', gap: '8px', marginBottom: '6px' } }, [
        _el('div', { style: { display: 'flex', gap: '8px' } }, [
          _el('label', {}, ['BG ', _el('input', { type:'color', id:'th-bg', value:'#ffffff' })]),
          _el('label', {}, ['Text ', _el('input', { type:'color', id:'th-fg', value:'#111111' })]),
          _el('label', {}, ['Accent ', _el('input', { type:'color', id:'th-ac', value:'#4f46e5' })]),
          _el('button', { class: 'rtp-btn', onclick: ()=> {
            const bg=document.getElementById('th-bg').value;
            const fg=document.getElementById('th-fg').value;
            const ac=document.getElementById('th-ac').value;
            applyCustomTheme({ bg, fg, ac });
          }}, 'Apply')
        ]),
        _el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
          _el('button', { class: 'rtp-btn', onclick: ()=> {
            const custom = {
              bg:document.getElementById('th-bg').value,
              fg:document.getElementById('th-fg').value,
              ac:document.getElementById('th-ac').value
            };
            localStorage.setItem('rtp-custom-theme', JSON.stringify(custom));
            alert('Custom theme saved!');
          }}, 'Save Theme')
        ])
      ]),

      _el('h4', {}, 'Typography'),
      _el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' } }, [
        (function(){
          const sel = _el('select', { id: 'rtp-font-select', onchange: (e)=> {
            const size = document.getElementById('rtp-font-size').value;
            const weight = document.getElementById('rtp-font-weight').value;
            applyFont(e.target.value, size, weight);
          }});
          FONTS.forEach(f => {
            sel.appendChild(_el('option', { value: f.name }, f.name));
          });
          return sel;
        })(),
        _el('input', { id: 'rtp-font-size', type: 'text', value: localStorage.getItem('rtp-font-size') || '24px', style: { width: '68px' }, onchange: (e)=> {
          const name = document.getElementById('rtp-font-select').value;
          const weight = document.getElementById('rtp-font-weight').value;
          applyFont(name, e.target.value, weight);
        } }),
        _el('select', { id: 'rtp-font-weight', onchange: (e)=> {
          const name = document.getElementById('rtp-font-select').value;
          const size = document.getElementById('rtp-font-size').value;
          applyFont(name, size, e.target.value);
        } }, [
          _el('option', { value: '300' }, '300'),
          _el('option', { value: '400' }, '400'),
          _el('option', { value: '600', selected: true }, '600'),
          _el('option', { value: '700' }, '700')
        ])
      ]),

      _el('h4', {}, 'Accent Hue'),
      _el('input', { type: 'range', min: '0', max: '360', value: localStorage.getItem('rtp-hue') || 200, class: 'rtp-range', oninput: (e) => {
        const h = e.target.value;
        document.documentElement.style.setProperty('--rtp-accent-h', h);
        localStorage.setItem('rtp-hue', h);
        document.dispatchEvent(new CustomEvent('rtp:hue', { detail: { h } }));
      }}),

      _el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: .8 } }, 'Tip: Press T to toggle this panel'),

      _el('hr', { style: { margin: '10px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' } }),

      _el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
        _el('button', { class: 'rtp-btn', id: 'rtp-edit-toggle', onclick: () => toggleEditMode() }, '✏️ Edit Mode'),
        _el('button', { class: 'rtp-btn', onclick: ()=> { localStorage.clear(); alert('Local storage cleared (careful)'); } }, 'Clear Storage')
      ])
    ]);
    document.body.appendChild(container);
    return container;
  }

  function togglePanel() {
    let p = document.getElementById('rtp-theme-panel');
    if (!p) p = panel();
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
    // populate font select with saved value
    const savedFont = localStorage.getItem('rtp-font-family');
    if (savedFont) {
      const sel = document.getElementById('rtp-font-select');
      if (sel) sel.value = savedFont;
    }
    const savedSize = localStorage.getItem('rtp-font-size');
    if (savedSize) {
      const sz = document.getElementById('rtp-font-size');
      if (sz) sz.value = savedSize;
    }
    const savedWeight = localStorage.getItem('rtp-font-weight');
    if (savedWeight) {
      const w = document.getElementById('rtp-font-weight');
      if (w) w.value = savedWeight;
    }
  }

  function mountUI(deck) {
    const bar = _el('div', { class: 'rtp-floating' }, [
      _el('button', { class: 'rtp-btn', onclick: togglePanel }, 'Themes')
    ]);
    document.body.appendChild(bar);
    keyToggleLocal('T', togglePanel);

    // ensure panel exists so user can open
    panel(deck);
  }

  // ---------- Edit mode ----------
  let editMode = false;
  function toggleEditMode() {
    editMode = !editMode;
    const btn = document.getElementById('rtp-edit-toggle');
    if (btn) btn.textContent = editMode ? '🟢 Edit Mode: ON' : '✏️ Edit Mode';
    if (editMode) {
      document.body.classList.add('rtp-editing');
      document.addEventListener('click', editClickHandler);
    } else {
      document.body.classList.remove('rtp-editing');
      document.removeEventListener('click', editClickHandler);
    }
  }

  function editClickHandler(e) {
    // avoid clicks inside the panel or overlay
    if (e.target.closest('.rtp-panel') || e.target.closest('.rtp-editor-overlay')) return;
    // find slide section parent
    const section = e.target.closest('.slides > section, .reveal .slides section, section');
    if (!section) return;
    e.preventDefault();
    // find slide index using Reveal (if present)
    let idx = 0;
    try {
      if (window.Reveal && typeof window.Reveal.getIndices === 'function') {
        // use the indices of the clicked section
        const slides = Array.from(document.querySelectorAll('.reveal .slides section'));
        idx = slides.indexOf(section);
      } else {
        const slides = Array.from(document.querySelectorAll('section'));
        idx = slides.indexOf(section);
      }
    } catch (err) {
      idx = 0;
    }
    showEditorForSection(section, idx);
  }

  // ---------- Initialize ----------
  return {
    id: 'ThemeSwitcher',
    init: function(deck){
      // restore theme/font/hue
      restoreTheme();

      // Mount UI
      mountUI(deck);

      // apply fonts to root css var usage (listen to events)
      document.addEventListener('rtp:font', ()=>{ /* nothing extra for now */ });

      // Apply stored slide content/backgrounds
      const slides = Array.from(document.querySelectorAll('.reveal .slides section, .slides section'));
      slides.forEach((s, i) => {
        const saved = loadSlideContent(i);
        if (saved) s.innerHTML = saved;
        const savedBg = loadSlideBg(i);
        if (savedBg) s.style.background = savedBg;
      });

      // create editor overlay (hidden)
      createEditorOverlay();

      // if user has saved font choice, set selects accordingly
      const savedFont = localStorage.getItem('rtp-font-family');
      if (savedFont) {
        const sel = document.getElementById('rtp-font-select');
        if (sel) sel.value = savedFont;
      }

      // expose small API for programmatic changes
      return {
        applyTheme,
        applyFont,
        showEditorForSection
      };
    }
  };
})();
