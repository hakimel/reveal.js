// theme-switcher.js
const THEMES = {
  light:  { bg:'#ffffff', fg:'#0b1324', ac:'#4f46e5' },
  dark:   { bg:'#0b1324', fg:'#e5e7eb', ac:'#22d3ee' },
  solarized: { bg:'#fdf6e3', fg:'#073642', ac:'#268bd2' },
  midnight:  { bg:'#0b1020', fg:'#cbd5e1', ac:'#7c3aed' },
  pastel: { bg:'#fff7f8', fg:'#37384b', ac:'#ef5da8' }
};

function applyThemeClass(name){
  document.body.className = `theme-${name}`;
  document.getElementById('current-theme').textContent = name;
  localStorage.setItem('tp-theme', name);
}
function applyCustomTheme({bg,fg,ac}){
  document.documentElement.style.setProperty('--bg', bg);
  document.documentElement.style.setProperty('--fg', fg);
  document.documentElement.style.setProperty('--ac', ac);
}

(function initThemeSwitcher(){
  const cont = document.getElementById('theme-switcher');
  if(!cont) return;
  Object.keys(THEMES).forEach(name=>{
    const btn = document.createElement('button');
    btn.className = 'tp-btn';
    btn.textContent = name;
    btn.addEventListener('click', ()=>applyThemeClass(name));
    cont.appendChild(btn);
  });
  const saved = localStorage.getItem('tp-theme') || 'light';
  applyThemeClass(saved);

  const randomBtn = document.getElementById('theme-random');
  randomBtn?.addEventListener('click', ()=>{
    const keys = Object.keys(THEMES);
    const pick = keys[Math.floor(Math.random()*keys.length)];
    applyThemeClass(pick);
  });

  const bg = document.getElementById('th-bg');
  const fg = document.getElementById('th-fg');
  const ac = document.getElementById('th-ac');
  document.getElementById('theme-apply')?.addEventListener('click', ()=>{
    applyCustomTheme({bg:bg.value, fg:fg.value, ac:ac.value});
  });
  document.getElementById('theme-save')?.addEventListener('click', ()=>{
    const custom = {bg:bg.value, fg:fg.value, ac:ac.value};
    localStorage.setItem('tp-custom-theme', JSON.stringify(custom));
    alert('Saved as My Theme (reload to apply with JS)');
  });
})();
