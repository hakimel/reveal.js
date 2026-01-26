var RevealPalettes = window.RevealPalettes || (function(){
  const { el, keyToggle } = window.RTP_SHARED;

  // --- Helpers (HSL<->HEX) ---
  function hexToHsl(H) {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2*l - 1));
    s = +(s*100).toFixed(1);
    l = +(l*100).toFixed(1);
    return {h,s,l};
  }

  function hslToHex(h,s,l) {
    s/=100; l/=100;
    let c = (1-Math.abs(2*l-1))*s,
        x = c*(1-Math.abs((h/60)%2-1)),
        m = l-c/2,
        r=0,g=0,b=0;
    if (0<=h && h<60){r=c;g=x;b=0;}
    else if (60<=h && h<120){r=x;g=c;b=0;}
    else if (120<=h && h<180){r=0;g=c;b=x;}
    else if (180<=h && h<240){r=0;g=x;b=c;}
    else if (240<=h && h<300){r=x;g=0;b=c;}
    else if (300<=h && h<360){r=c;g=0;b=x;}
    r=Math.round((r+m)*255);
    g=Math.round((g+m)*255);
    b=Math.round((b+m)*255);
    return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }

  function generatePalette(baseHex, mode='complementary'){
    const {h,s,l} = hexToHsl(baseHex);
    const list = [];
    const push = (hh)=> list.push(hslToHex(hh, s, l));
    const wrap = (x)=> (x+360)%360;

    if(mode==='complementary'){
      [0,180,30,210,60].forEach(d=>push(wrap(h+d)));
    }else if(mode==='triad'){
      [0,120,240,60,300].forEach(d=>push(wrap(h+d)));
    }else if(mode==='tetrad'){
      [0,90,180,270,45].forEach(d=>push(wrap(h+d)));
    }else if(mode==='analogous'){
      [-30,0,30,60,90].forEach(d=>push(wrap(h+d)));
    }else if(mode==='golden'){
      const phi = 137.5;
      [0,phi,phi*2,phi*3,phi*4].forEach(d=>push(wrap(h+d)));
    }else{
      [0,180,30,210,60].forEach(d=>push(wrap(h+d)));
    }
    return list.slice(0,10);
  }

  // --- Apply Theme (BG, FG, AC) ---
  function applyCustomTheme(bg, fg, ac) {
    document.documentElement.style.setProperty('--rtp-bg', bg);
    document.documentElement.style.setProperty('--rtp-fg', fg);
    document.documentElement.style.setProperty('--rtp-ac', ac);
  }

  function saveCustomTheme(bg, fg, ac) {
    localStorage.setItem('rtp-custom-theme', JSON.stringify({ bg, fg, ac }));
  }
  function loadCustomTheme() {
    const data = localStorage.getItem('rtp-custom-theme');
    if (!data) return null;
    try { return JSON.parse(data); } catch { return null; }
  }

  // --- Build UI Panel ---
  function buildPanel() {
    const custom = loadCustomTheme() || { bg: '#121212', fg: '#ffffff', ac: '#ff4081' };

    const cont = el('div', { class: 'rtp-palette-panel', id: 'rtp-palette-panel' }, [
      el('h4', {}, '🎨 Theme Editor + Palettes'),

      // BG/FG/AC live theme editor
      el('div', { class: 'rtp-row' }, [
        el('label', {}, [ 'BG', el('input', { type: 'color', id: 'rtp-bg', value: custom.bg }) ]),
        el('label', {}, [ 'Text', el('input', { type: 'color', id: 'rtp-fg', value: custom.fg }) ]),
        el('label', {}, [ 'Accent', el('input', { type: 'color', id: 'rtp-ac', value: custom.ac }) ])
      ]),
      el('div', { class: 'rtp-toolbar' }, [
        el('button', { class: 'rtp-btn', onclick: () => {
          const bg = document.getElementById('rtp-bg').value;
          const fg = document.getElementById('rtp-fg').value;
          const ac = document.getElementById('rtp-ac').value;
          applyCustomTheme(bg, fg, ac);
        }}, 'Apply'),
        el('button', { class: 'rtp-btn', onclick: () => {
          const bg = document.getElementById('rtp-bg').value;
          const fg = document.getElementById('rtp-fg').value;
          const ac = document.getElementById('rtp-ac').value;
          saveCustomTheme(bg, fg, ac);
          alert('Custom theme saved!');
        }}, 'Save')
      ]),

      // Palette generator controls
      el('div', { class: 'rtp-row', style:{marginTop:'12px'} }, [
        el('select', { id: 'palette-mode' }, [
          el('option', { value:'complementary' }, 'Complementary'),
          el('option', { value:'triad' }, 'Triad'),
          el('option', { value:'tetrad' }, 'Tetrad'),
          el('option', { value:'analogous' }, 'Analogous'),
          el('option', { value:'golden' }, 'Golden Ratio'),
        ]),
        el('input', { type:'color', id:'palette-base', value:'#6754e2' }),
        el('button', { id:'palette-generate', class:'rtp-btn' }, 'Generate')
      ]),
      el('div', { class:'rtp-toolbar' }, [
        el('button', { id:'palette-ai', class:'rtp-btn' }, 'AI Suggest'),
        el('button', { id:'palette-save', class:'rtp-btn' }, 'Save'),
        el('button', { id:'palette-load', class:'rtp-btn' }, 'Load'),
        el('button', { id:'palette-export', class:'rtp-btn' }, 'Export'),
        el('button', { id:'palette-import-btn', class:'rtp-btn' }, 'Import'),
        el('input', { type:'file', id:'palette-import', accept:'application/json', style:{display:'none'} })
      ]),
      el('div', { id:'palette-preview', class:'palette-grid' }),

      el('div', { style: { marginTop: '6px', fontSize: '12px', opacity: .8 } },
        'Tip: Press P to toggle this palette editor'
      )
    ]);

    document.body.appendChild(cont);

    // --- Wire up palette logic ---
    const mode = cont.querySelector('#palette-mode');
    const base = cont.querySelector('#palette-base');
    const preview = cont.querySelector('#palette-preview');
    const btnGen = cont.querySelector('#palette-generate');
    const btnAI = cont.querySelector('#palette-ai');
    const btnSave = cont.querySelector('#palette-save');
    const btnLoad = cont.querySelector('#palette-load');
    const btnExport = cont.querySelector('#palette-export');
    const btnImport = cont.querySelector('#palette-import-btn');
    const inputImport = cont.querySelector('#palette-import');

    function render(colors){
      preview.innerHTML = '';
      colors.forEach((c,i)=>{
        const sw = document.createElement('div');
        sw.className = 'palette-swatch';
        sw.style.background = c;
        sw.title = c;
        sw.textContent = i+1;
        sw.addEventListener('click', ()=> {
          document.documentElement.style.setProperty('--rtp-ac', c);
        });
        preview.appendChild(sw);
      });
    }

    function generate(){
      const cols = generatePalette(base.value, mode.value);
      localStorage.setItem('rtp-palette-last', JSON.stringify(cols));
      render(cols);
    }

    btnGen?.addEventListener('click', generate);

    btnAI?.addEventListener('click', ()=>{
      const kw = prompt('Enter keyword (ocean, sunset, pastel):')||'';
      if(window.AI && AI.suggestPalette){
        const ai = AI.suggestPalette(kw);
        if(ai){ render(ai); localStorage.setItem('rtp-palette-last', JSON.stringify(ai)); return; }
      }
      generate();
    });

    btnSave?.addEventListener('click', ()=>{
      const last = preview.querySelectorAll('.palette-swatch');
      const colors = [...last].map(el=>el.style.backgroundColor);
      localStorage.setItem('rtp-palette-saved', JSON.stringify(colors));
      alert('Palette saved.');
    });

    btnLoad?.addEventListener('click', ()=>{
      const data = JSON.parse(localStorage.getItem('rtp-palette-saved')||'[]');
      if(data.length){ render(data); }
      else alert('No saved palette.');
    });

    btnExport?.addEventListener('click', ()=>{
      const last = JSON.parse(localStorage.getItem('rtp-palette-last')||'[]');
      if(last.length){
        const blob = new Blob([JSON.stringify(last,null,2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'palette.json';
        a.click();
      }else alert('Generate a palette first.');
    });

    btnImport?.addEventListener('click', ()=> inputImport.click());
    inputImport?.addEventListener('change', (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        try{
          const data = JSON.parse(reader.result);
          if(Array.isArray(data)){ render(data); localStorage.setItem('rtp-palette-last', JSON.stringify(data)); }
        }catch(err){ alert('Invalid JSON'); }
      };
      reader.readAsText(file);
    });

    // initial
    generate();

    return cont;
  }

  function togglePanel() {
    let p = document.getElementById('rtp-palette-panel');
    if (!p) p = buildPanel();
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  }

  return {
    id: 'Palettes',
    init: function(deck){
      // restore saved custom theme
      const custom = loadCustomTheme();
      if (custom) applyCustomTheme(custom.bg, custom.fg, custom.ac);

      // floating button
      const bar = document.querySelector('.rtp-floating');
      const btn = el('button', { class: 'rtp-btn', onclick: togglePanel }, 'Palette');
      if (bar) bar.appendChild(btn);
      else document.body.appendChild(el('div',{class:'rtp-floating'},[btn]));

      // keyboard shortcut
      keyToggle('P', togglePanel);
    }
  };
})();
