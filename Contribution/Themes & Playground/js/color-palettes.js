// color-palettes.js
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

(function initPalettes(){
  const mode = document.getElementById('palette-mode');
  const base = document.getElementById('palette-base');
  const preview = document.getElementById('palette-preview');
  const btnGen = document.getElementById('palette-generate');
  const btnAI = document.getElementById('palette-ai');
  const btnSave = document.getElementById('palette-save');
  const btnLoad = document.getElementById('palette-load');
  const btnExport = document.getElementById('palette-export');
  const btnImport = document.getElementById('palette-import-btn');
  const inputImport = document.getElementById('palette-import');

  function render(colors){
    preview.innerHTML = '';
    colors.forEach((c,i)=>{
      const sw = document.createElement('div');
      sw.className = 'palette-swatch';
      sw.style.background = c;
      sw.title = c;
      sw.textContent = i+1;
      sw.addEventListener('click', ()=>{
        document.documentElement.style.setProperty('--ac', c);
      });
      preview.appendChild(sw);
    });
  }

  function generate(){
    const cols = generatePalette(base.value, mode.value);
    localStorage.setItem('tp-palette-last', JSON.stringify(cols));
    render(cols);
  }

  btnGen?.addEventListener('click', generate);

  btnAI?.addEventListener('click', ()=>{
    const kw = prompt('Enter keyword (e.g., ocean, sunset, forest, pastel):')||'';
    const ai = AI.suggestPalette(kw);
    if(ai){ render(ai); localStorage.setItem('tp-palette-last', JSON.stringify(ai)); }
    else{ generate(); }
  });

  btnSave?.addEventListener('click', ()=>{
    const last = preview.querySelectorAll('.palette-swatch');
    const colors = [...last].map(el=>el.style.backgroundColor);
    localStorage.setItem('tp-palette-saved', JSON.stringify(colors));
    alert('Palette saved to LocalStorage.');
  });

  btnLoad?.addEventListener('click', ()=>{
    const data = JSON.parse(localStorage.getItem('tp-palette-saved')||'[]');
    if(data.length){ render(data); }
    else alert('No saved palette.');
  });

  btnExport?.addEventListener('click', ()=>{
    const last = JSON.parse(localStorage.getItem('tp-palette-last')||'[]');
    if(last.length){ download('palette.json', JSON.stringify(last,null,2)); }
    else alert('Generate a palette first.');
  });

  btnImport?.addEventListener('click', ()=> inputImport.click());
  inputImport?.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result);
        if(Array.isArray(data)){ render(data); localStorage.setItem('tp-palette-last', JSON.stringify(data)); }
      }catch(err){ alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  });

  // initial
  render(generatePalette(base.value, mode.value));
})();
