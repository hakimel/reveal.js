/* ===========================
   No-Code Reveal.js Builder — MVP+
   Features:
   - Autosave + restore toast
   - JSON import/export
   - Live preview (iframe, sandboxed)
   - Starter templates
   - Theme toggle (editor); deck theme dropdown
   - Keyboard shortcuts + Help modal
   - Drag & drop reordering, duplicate, delete confirm
   - AI Outline Generator (local heuristic, no API)
   - Export standalone HTML via CDN
=========================== */

const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- State ---------- */
let deck = null;
let activeIndex = 0;
const HISTORY = [];
const REDO = [];
const STORAGE_KEY = 'nocode-revealjs-deck-v1';
const THEME_KEY   = 'nocode-theme';

const fmtTime = d => d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
let lastSavedAt = null;
function updateAutosaveIndicator(){
  const el = $('#autosave-indicator');
  if(!el) return;
  el.textContent = lastSavedAt ? `Saved · ${fmtTime(lastSavedAt)}` : 'Saved · —';
}
function markSaved(){ lastSavedAt = new Date(); updateAutosaveIndicator(); }

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  // Editor theme (chrome)
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  if(savedTheme === 'light') document.documentElement.classList.add('light');

  bindToolbar();
  updateAutosaveIndicator();
  maybeRestoreSession();
  if(!deck){ newDeck('Untitled Deck'); }
  renderAll();
  setupShortcuts();
});

/* ---------- Toolbar ---------- */
function bindToolbar(){
  $('#new-deck').addEventListener('click', () => { newDeck(); toast('New deck created'); });
  $('#add-slide').addEventListener('click', () => addSlide());
  $('#undo').addEventListener('click', undo);
  $('#redo').addEventListener('click', redo);
  $('#theme-toggle').addEventListener('click', toggleTheme);

  $('#save-json').addEventListener('click', downloadJSON);
  $('#export-html').addEventListener('click', exportHTMLStandalone);
  $('#export-pdf').addEventListener('click', exportPDFHint);
  $('#play-deck').addEventListener('click', openPlayerWindow);
  $('#ai-generate').addEventListener('click', aiGenerateOutline);

  $('#import-btn').addEventListener('click', ()=> $('#import-json').click());
  $('#import-json').addEventListener('change', importJSON);

  $('#import-designs').addEventListener('click', ()=> $('#import-designs-json').click());
  $('#import-designs-json').addEventListener('change', importDesigns);
}

function toggleTheme(){
  document.documentElement.classList.toggle('light');
  const mode = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, mode);
  renderPreview();
}

/* ---------- Deck Model ---------- */
function newDeck(title='Untitled Deck'){
  pushHistory();
  deck = {
    id: crypto.randomUUID(),
    title,
    theme: document.documentElement.classList.contains('light') ? 'white' : 'black',
    slides: [ templateSlide('title', 'Welcome', 'Add your content here…') ],
    tokens: {
      primary: '#4f46e5',
      text: document.documentElement.classList.contains('light') ? '#111827' : '#e6edf3',
      background: document.documentElement.classList.contains('light') ? '#ffffff' : '#0b0d10'
    }
  };
  activeIndex = 0;
  saveAutosave();
  renderAll();
}

function templateSlide(layout='title', title='Slide Title', content=''){
  return {
    id: crypto.randomUUID(),
    layout, title, content,
    notes: '',
    hidden: false,
    autoAnimate: false
  };
}

function addSlide(layout='title'){
  pushHistory();
  deck.slides.splice(activeIndex+1,0, templateSlide(layout,'New Slide',''));
  activeIndex++;
  saveAutosave();
  renderAll();
}

function removeSlide(idx){
  if(deck.slides.length===1) return toast('Keep at least one slide');
  pushHistory();
  deck.slides.splice(idx,1);
  activeIndex = Math.max(0, Math.min(activeIndex, deck.slides.length-1));
  saveAutosave();
  renderAll();
}

function moveSlide(idx, dir){
  const to = idx + dir;
  if(to<0 || to>=deck.slides.length) return;
  pushHistory();
  const [s] = deck.slides.splice(idx,1);
  deck.slides.splice(to,0,s);
  activeIndex = to;
  saveAutosave();
  renderAll();
}

/* ---------- History ---------- */
function pushHistory(){
  if(deck) HISTORY.push(JSON.stringify(deck));
  if(HISTORY.length>100) HISTORY.shift();
  REDO.length = 0;
}
function undo(){
  if(!HISTORY.length) return;
  REDO.push(JSON.stringify(deck));
  deck = JSON.parse(HISTORY.pop());
  activeIndex = Math.min(activeIndex, deck.slides.length-1);
  saveAutosave();
  renderAll();
}
function redo(){
  if(!REDO.length) return;
  HISTORY.push(JSON.stringify(deck));
  deck = JSON.parse(REDO.pop());
  saveAutosave();
  renderAll();
}

/* ---------- Autosave ---------- */
function saveAutosave(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(deck)); }
  catch(e){ console.warn('Autosave failed', e); }
  markSaved();
}
function maybeRestoreSession(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  const bar = ensureSnackbar();
  bar.innerHTML = `Found an autosaved deck. <button id="restore-btn">Restore</button> <button id="dismiss-btn">Dismiss</button>`;
  bar.classList.add('show');
  $('#restore-btn').onclick = () => {
    deck = JSON.parse(raw);
    activeIndex = 0;
    bar.classList.remove('show');
    renderAll();
  };
  $('#dismiss-btn').onclick = () => bar.classList.remove('show');
}
function ensureSnackbar(){
  let bar = $('.snackbar');
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'snackbar';
    document.body.appendChild(bar);
  }
  return bar;
}
function toast(msg){
  const bar = ensureSnackbar();
  bar.textContent = msg;
  bar.classList.add('show');
  setTimeout(()=>bar.classList.remove('show'), 1500);
}

/* ---------- Rendering ---------- */
function renderAll(){
  renderSlideList();
  renderEditor();
  renderGlobalPanel();
  renderPreview();
}

function renderSlideList(){
  const container = $('#slide-list');
  container.innerHTML = '';
  deck.slides.forEach((s, i)=>{
    const item = document.createElement('div');
    item.className = 'slide-item' + (i===activeIndex?' active':'');
    item.setAttribute('role','button');
    item.setAttribute('tabindex','0');
    item.setAttribute('aria-label', `Slide ${i+1}: ${s.title}`);
    item.draggable = true; // drag

    item.innerHTML = `
      <div>
        <strong>${i+1}. ${escapeHTML(s.title || '(untitled)')}</strong>
        <div><small class="badge">${s.layout}${s.hidden?' · H':''}${s.autoAnimate?' · AA':''}</small></div>
      </div>
      <div style="margin-left:auto;display:flex;gap:6px">
        <button title="Up" aria-label="Move up">↑</button>
        <button title="Down" aria-label="Move down">↓</button>
        <button title="Duplicate" aria-label="Duplicate slide">⧉</button>
        <button title="Delete" aria-label="Delete slide">✕</button>
      </div>
    `;

    item.addEventListener('click', (e)=>{
      if(e.target.tagName==='BUTTON') return;
      activeIndex = i; renderAll();
    });
    item.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' '){ activeIndex = i; renderAll(); }
    });

    const [btnUp, btnDown, btnDup, btnDel] = item.querySelectorAll('button');
    btnUp.onclick  = (e)=>{ e.stopPropagation(); moveSlide(i,-1); };
    btnDown.onclick= (e)=>{ e.stopPropagation(); moveSlide(i,+1); };
    btnDup.onclick = (e)=>{ e.stopPropagation(); duplicateSlide(i); };
    btnDel.onclick = (e)=>{ e.stopPropagation(); confirmDeleteSlide(i); };

    // Drag & drop
    item.addEventListener('dragstart', (e)=>{
      item.classList.add('dragging');
      e.dataTransfer.setData('text/plain', String(i));
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', ()=> item.classList.remove('dragging'));
    item.addEventListener('dragover', (e)=>{
      e.preventDefault();
      item.classList.add('drag-over');
      e.dataTransfer.dropEffect = 'move';
    });
    item.addEventListener('dragleave', ()=> item.classList.remove('drag-over'));
    item.addEventListener('drop', (e)=>{
      e.preventDefault();
      item.classList.remove('drag-over');
      const from = Number(e.dataTransfer.getData('text/plain'));
      const to   = i;
      if(from===to) return;
      pushHistory();
      const [s] = deck.slides.splice(from,1);
      deck.slides.splice(to,0,s);
      activeIndex = to;
      saveAutosave();
      renderAll();
    });

    container.appendChild(item);
  });
}

function renderGlobalPanel(){
  const el = $('#global-panel');
  el.innerHTML = `
    <h3>Deck</h3>
    <div class="row"><label>Title</label><input id="deck-title" type="text" value="${escapeAttr(deck.title)}"></div>
    <div class="row"><label>Theme</label>
      <select id="deck-theme">
        ${['black','white','league','beige','night','moon','serif','simple','sky','blood','solarized']
          .map(t=>`<option ${deck.theme===t?'selected':''} value="${t}">${t}</option>`).join('')}
      </select>
    </div>
    <p class="badge">Press <span class="kbd">?</span> for shortcuts.</p>
  `;
  $('#deck-title').oninput  = e => { deck.title = e.target.value; saveAutosave(); renderPreviewSoon(); };
  $('#deck-theme').onchange = e => { deck.theme = e.target.value; saveAutosave(); renderPreview(); };
}

function renderEditor(){
  const s = deck.slides[activeIndex];
  const el = $('#edit-panel');
  el.innerHTML = `
    <h3>Edit Slide</h3>
    <div class="row"><label>Layout</label>
      <select id="s-layout">
        ${['title','two-col','quote','image-left','code'].map(opt=>`<option ${s.layout===opt?'selected':''} value="${opt}">${opt}</option>`).join('')}
      </select>
    </div>
    <div class="row"><label>Title</label><input id="s-title" type="text" value="${escapeAttr(s.title)}"></div>
    <div class="row"><label>Content</label><textarea id="s-content" placeholder="HTML or Markdown accepted">${escapeHTML(s.content||'')}</textarea></div>
    <div class="row"><label>Notes</label><textarea id="s-notes" placeholder="Speaker notes">${escapeHTML(s.notes||'')}</textarea></div>
    <div class="row"><label>Flags</label>
      <div>
        <label><input id="s-hidden" type="checkbox" ${s.hidden?'checked':''}> Hidden</label>
        <label style="margin-left:10px"><input id="s-aa" type="checkbox" ${s.autoAnimate?'checked':''}> Auto-animate</label>
      </div>
    </div>
    <div class="row"><label>Templates</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="tpl" data-tpl="title">Title</button>
        <button class="tpl" data-tpl="two-col">Two-Column</button>
        <button class="tpl" data-tpl="quote">Quote</button>
        <button class="tpl" data-tpl="image-left">Image-Left</button>
        <button class="tpl" data-tpl="code">Code</button>
        <button id="btn-add-slide">+ Add Slide</button>
      </div>
    </div>
  `;

  $('#s-layout').onchange = e => { s.layout = e.target.value; saveAutosave(); renderPreview(); renderSlideList(); };
  $('#s-title').oninput   = e => { s.title = e.target.value; saveAutosave(); renderSlideList(); renderPreviewSoon(); };
  $('#s-content').oninput = e => { s.content = e.target.value; saveAutosave(); renderPreviewSoon(); };
  $('#s-notes').oninput   = e => { s.notes = e.target.value; saveAutosave(); };
  $('#s-hidden').onchange = e => { s.hidden = e.target.checked; saveAutosave(); renderSlideList(); renderPreview(); };
  $('#s-aa').onchange     = e => { s.autoAnimate = e.target.checked; saveAutosave(); renderSlideList(); renderPreview(); };

  $$('#edit-panel .tpl').forEach(b=> b.onclick = ()=>applyTemplateToSlide(b.dataset.tpl));
  $('#btn-add-slide').onclick = ()=> addSlide('title');
}

/* ---------- Templates ---------- */
function applyTemplateToSlide(kind){
  const s = deck.slides[activeIndex];
  pushHistory();
  s.layout = kind;
  if(kind==='title'){
    s.title = s.title || 'Big Title';
    s.content = `<p>Subtitle or tagline</p>`;
  } else if(kind==='two-col'){
    s.title ||= 'Two Column';
    s.content = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div><ul><li>Point A</li><li>Point B</li></ul></div>
  <div><ul><li>Point C</li><li>Point D</li></ul></div>
</div>`;
  } else if(kind==='quote'){
    s.title ||= 'Quote';
    s.content = `<blockquote>“Your powerful quote here.”<br><small>— Source</small></blockquote>`;
  } else if(kind==='image-left'){
    s.title ||= 'Image + Text';
    s.content = `
<div style="display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:center">
  <img src="https://picsum.photos/400/300" alt="placeholder" style="width:100%;border-radius:8px">
  <div><h3>Key Message</h3><p>Add supporting text.</p></div>
</div>`;
  } else if(kind==='code'){
    s.title ||= 'Code Sample';
    s.content = `<pre><code class="hljs javascript">console.log('Hello Reveal');</code></pre>`;
  }
  saveAutosave();
  renderAll();
}

/* ---------- Duplicate / Delete helpers ---------- */
function duplicateSlide(idx){
  pushHistory();
  const c = JSON.parse(JSON.stringify(deck.slides[idx]));
  c.id = crypto.randomUUID();
  deck.slides.splice(idx+1,0,c);
  activeIndex = idx+1;
  saveAutosave();
  renderAll();
}
function confirmDeleteSlide(idx){
  const bypass = window.event && (window.event.altKey || window.event.metaKey);
  if(!bypass){
    const name = deck.slides[idx]?.title || `Slide ${idx+1}`;
    if(!confirm(`Delete "${name}"?`)) return;
  }
  removeSlide(idx);
}

/* ---------- Preview ---------- */
let previewTimer = null;
function renderPreviewSoon(){
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreview, 200);
}
function renderPreview(){
  const src = buildRevealHTML(deck);
  const blob = new Blob([src], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const iframe = $('#preview-frame');
  iframe.src = url;
  iframe.onload = ()=> setTimeout(()=> URL.revokeObjectURL(url), 1000);
}

/* ---------- Build Reveal HTML (Standalone) ---------- */
function buildRevealHTML(d){
  const themeHref = `https://unpkg.com/reveal.js@5.0.4/dist/theme/${d.theme}.css`;
  const slidesHTML = d.slides.map(s=>{
    if(s.hidden) return `<section data-visibility="hidden">${renderSlideSection(s)}</section>`;
    return `<section ${s.autoAnimate?'data-auto-animate':''}>${renderSlideSection(s)}</section>`;
  }).join('\n');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHTML(d.title)}</title>
<link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/dist/reset.css">
<link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/dist/reveal.css">
<link rel="stylesheet" href="${themeHref}">
<link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/monokai.css">
<style>.reveal pre{white-space:pre-wrap}</style>
</head>
<body>
<div class="reveal"><div class="slides">
${slidesHTML}
</div></div>
<script src="https://unpkg.com/reveal.js@5.0.4/dist/reveal.js"></script>
<script src="https://unpkg.com/reveal.js@5.0.4/plugin/notes/notes.js"></script>
<script src="https://unpkg.com/reveal.js@5.0.4/plugin/markdown/markdown.js"></script>
<script src="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/highlight.js"></script>
<script>
Reveal.initialize({hash:true, plugins:[RevealMarkdown, RevealHighlight, RevealNotes]});
</script>
</body></html>`;
}

function renderSlideSection(s){
  const title = `<h2>${escapeHTML(s.title||'')}</h2>`;
  let body = s.content || '';
  return `${title}\n${body}\n${s.notes?`<aside class="notes">${escapeHTML(s.notes)}</aside>`:''}`;
}

/* ---------- Export / Import ---------- */
function downloadJSON(){
  const data = JSON.stringify(deck, null, 2);
  downloadFile(`${safeFilename(deck.title||'deck')}.json`, data, 'application/json');
  toast('JSON downloaded');
}
function exportHTMLStandalone(){
  const html = buildRevealHTML(deck);
  downloadFile(`${safeFilename(deck.title||'deck')}.html`, html, 'text/html');
  toast('Exported HTML');
}
function exportPDFHint(){
  alert('PDF tip: open the exported HTML, then Print (Ctrl/Cmd+P) → Save as PDF. Enable background graphics if needed.');
}
function importJSON(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(reader.result);
      if(!obj.slides) throw new Error('Not a deck JSON');
      pushHistory();
      deck = obj;
      activeIndex = 0;
      saveAutosave();
      renderAll();
      toast('Deck imported');
    }catch(e){
      alert('Invalid JSON: '+e.message);
    }
  };
  reader.readAsText(file);
  evt.target.value = '';
}
function importDesigns(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(reader.result);
      deck.tokens = {...deck.tokens, ...obj.tokens};
      toast('Design tokens merged');
      renderPreview();
    }catch(e){
      alert('Invalid designs JSON: '+e.message);
    }
  };
  reader.readAsText(file);
  evt.target.value = '';
}

/* ---------- Player ---------- */
function openPlayerWindow(){
  const html = buildRevealHTML(deck);
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ---------- “AI” Outline (offline heuristic) ---------- */
function aiGenerateOutline(){
  const topic = prompt('Enter a topic (e.g., “Intro to Web Security”)');
  if(!topic) return;
  const slides = synthesizeOutline(topic);
  const preview = slides.map((s,i)=>`${i+1}. ${s.title}`).join('\n');
  const ok = confirm(`Proposed slides:\n\n${preview}\n\nApply? This will replace current deck (you can Undo).`);
  if(!ok) return;
  pushHistory();
  deck.title = topic;
  deck.slides = slides;
  activeIndex = 0;
  saveAutosave();
  renderAll();
}
function synthesizeOutline(topic){
  const parts = [
    ['title', `What is ${topic}?`, `<ul><li>Definition</li><li>Why it matters</li></ul>`],
    ['two-col', 'Key Concepts', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div><ul><li>Term A</li><li>Term B</li></ul></div><div><ul><li>Term C</li><li>Term D</li></ul></div></div>`],
    ['image-left', 'Real-World Example', `<div style="display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:center"><img src="https://picsum.photos/400/300" alt="${escapeAttr(topic)}"><div><p>Short story / case study.</p></div></div>`],
    ['quote', 'Insight', `<blockquote>“If you can’t explain it simply, you don’t understand it well enough.”<br/><small>— Einstein (apocryphal)</small></blockquote>`],
    ['code', 'Demo / Snippet', `<pre><code class="hljs javascript">// Replace with your demo\nconsole.log('${escapeJS(topic)}')</code></pre>`],
    ['title', 'Best Practices', `<ul><li>Do X</li><li>Avoid Y</li><li>Measure Z</li></ul>`],
    ['title', 'Summary', `<ul><li>Key takeaways</li><li>Next steps</li></ul>`],
  ];
  return parts.map(([layout, title, content])=>({
    id: crypto.randomUUID(), layout,
    title, content, notes:'', hidden:false, autoAnimate:false
  }));
}

/* ---------- Shortcuts & Help ---------- */
function setupShortcuts(){
  window.addEventListener('keydown', (e)=>{
    const mod = e.ctrlKey || e.metaKey;

    // File ops
    if(mod && e.key.toLowerCase()==='s'){ e.preventDefault(); downloadJSON(); }
    if(mod && e.key.toLowerCase()==='n'){ e.preventDefault(); if(e.shiftKey) newDeck(); else addSlide(); }
    if(mod && e.key.toLowerCase()==='z'){ e.preventDefault(); undo(); }
    if(mod && (e.key.toLowerCase()==='y' || (e.shiftKey && e.key.toLowerCase()==='z'))){ e.preventDefault(); redo(); }

    // Navigation
    if(e.key==='ArrowLeft'){ e.preventDefault(); activeIndex = Math.max(0, activeIndex-1); renderAll(); }
    if(e.key==='ArrowRight'){ e.preventDefault(); activeIndex = Math.min(deck.slides.length-1, activeIndex+1); renderAll(); }

    // Delete current slide (unless typing)
    const tag = document.activeElement.tagName;
    if((e.key==='Delete' || e.key==='Backspace') && tag!=='INPUT' && tag!=='TEXTAREA'){
      e.preventDefault(); confirmDeleteSlide(activeIndex);
    }

    // Help
    if(e.key==='?' || (mod && e.key.toLowerCase()==='/')) showHelp();
  });
}

function showHelp(){
  const m = $('#help-modal'), b = $('#help-backdrop'), close = $('#help-close');
  if(!m || !b) return alert('Help modal not mounted.');
  m.classList.add('show'); b.classList.add('show');
  function end(){ m.classList.remove('show'); b.classList.remove('show'); cleanup(); }
  function onKey(e){ if(e.key==='Escape') end(); }
  function cleanup(){ close.removeEventListener('click', end); document.removeEventListener('keydown', onKey); b.removeEventListener('click', end); }
  close.addEventListener('click', end);
  b.addEventListener('click', end);
  document.addEventListener('keydown', onKey);
}

/* ---------- Utils ---------- */
function escapeHTML(s=''){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function escapeAttr(s=''){ return escapeHTML(s); }
function escapeJS(s=''){ return s.replace(/[`\\$]/g, '\\$&'); }
function safeFilename(s){ return s.trim().replace(/[^a-z0-9\-_]+/gi,'-').replace(/-+/g,'-'); }
function downloadFile(name, content, type){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type}));
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1500);
}
