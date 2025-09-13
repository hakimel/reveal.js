/* app.js
   Drop this into the same folder as index.html and style.css.
   Small improvements: keyboard shortcuts, safer iframe usage, minor bug fixes.
*/

/* --------------- Data & state --------------- */
let data = {
  global: {
    theme: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "32px",
    textColor: "#000000"
  },
  slides: []
};

let currentSlideIndex = -1;
let history = [];
let historyIndex = -1;
let draggedItem = null;

/* --------------- Initialization --------------- */
function init() {
  bindUI();
  // Restore a default empty deck
  addSlide();
  saveState();
  updateAll();
}

function bindUI() {
  document.getElementById('add-slide').addEventListener('click', addSlide);
  document.getElementById('new-deck').addEventListener('click', () => {
    data = { global: { ...data.global }, slides: [] };
    currentSlideIndex = -1;
    addSlide();
    saveState();
    updateAll();
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('redo').addEventListener('click', redo);
  document.getElementById('save-json').addEventListener('click', saveJson);
  document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-json').click());
  document.getElementById('import-json').addEventListener('change', importJson);
  document.getElementById('export-html').addEventListener('click', exportHtml);
  document.getElementById('export-pdf').addEventListener('click', exportPdf);
  document.getElementById('play-deck').addEventListener('click', playDeck);

  // Keyboard shortcuts
  window.addEventListener('keydown', (ev) => {
    // Ctrl / Cmd detection
    const mod = (ev.ctrlKey || ev.metaKey);
    if (mod && ev.key === 's') { ev.preventDefault(); saveJson(); return; }     // Ctrl+S -> save JSON
    if (mod && ev.key === 'n' && !ev.shiftKey) { ev.preventDefault(); addSlide(); return; } // Ctrl+N -> add slide
    if (mod && ev.shiftKey && ev.key.toLowerCase() === 'n') { ev.preventDefault(); document.getElementById('new-deck').click(); return; } // Ctrl+Shift+N -> new deck
    if (mod && ev.key === 'z') { ev.preventDefault(); undo(); return; }
    if (mod && (ev.key === 'y' || (ev.shiftKey && ev.key === 'Z'))) { ev.preventDefault(); redo(); return; }
  });
}

/* --------------- Slide management --------------- */
function addSlide() {
  const newSlide = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    background: { type: "color", value: "#ffffff" },
    transition: "none",
    notes: "",
    elements: []
  };
  data.slides.push(newSlide);
  selectSlide(data.slides.length - 1);
  saveState();
  updateAll();
}

function deleteSlide(index) {
  if (index < 0 || index >= data.slides.length) return;
  data.slides.splice(index, 1);
  if (data.slides.length === 0) {
    currentSlideIndex = -1;
  } else {
    currentSlideIndex = Math.max(0, Math.min(currentSlideIndex, data.slides.length - 1));
  }
  saveState();
  updateAll();
}

function selectSlide(index) {
  if (index < 0 || index >= data.slides.length) return;
  currentSlideIndex = index;
  updateSlideList();
  updateEditPanel();
}

/* --------------- UI updates --------------- */
function updateSlideList() {
  const list = document.getElementById('slide-list');
  list.innerHTML = '';
  data.slides.forEach((slide, index) => {
    const div = document.createElement('div');
    div.className = 'slide-item' + (index === currentSlideIndex ? ' selected' : '');
    div.draggable = true;
    div.dataset.id = slide.id;
    // label + delete btn container
    const label = document.createElement('div');
    label.textContent = `Slide ${index + 1}`;
    label.style.flex = '1';
    div.appendChild(label);

    const del = document.createElement('button');
    del.className = 'delete-slide';
    del.textContent = 'Delete';
    del.title = 'Delete slide';
    del.addEventListener('click', (e) => { e.stopPropagation(); deleteSlide(index); });
    div.appendChild(del);

    div.addEventListener('click', () => selectSlide(index));
    list.appendChild(div);
  });
  setupDragDrop();
}

function setupDragDrop() {
  const list = document.getElementById('slide-list');

  // Remove previous handlers to avoid duplication
  list.ondragstart = null;
  list.ondragover = null;
  list.ondragend = null;

  list.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.slide-item');
    if (!draggedItem) return;
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', draggedItem.dataset.id); } catch (err) { /* some browsers require try */ }
  });

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.slide-item');
    if (!target || !draggedItem || target === draggedItem) return;
    const rect = target.getBoundingClientRect();
    const after = (e.clientY - rect.top) > rect.height / 2;
    if (after) target.after(draggedItem); else target.before(draggedItem);
  });

  list.addEventListener('dragend', () => {
    if (!list.children.length) return;
    const newOrder = Array.from(list.children).map(div => Number(div.dataset.id));
    // reorder data.slides to match newOrder
    data.slides.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
    // ensure currentSlideIndex follows the slide that was selected (by id)
    const selectedDom = list.querySelector('.selected');
    if (selectedDom) {
      const selId = Number(selectedDom.dataset.id);
      currentSlideIndex = data.slides.findIndex(s => s.id === selId);
    } else {
      currentSlideIndex = 0;
    }
    updateSlideList();
    saveState();
    updateAll();
  });
}

function updateGlobalPanel() {
  const panel = document.getElementById('global-panel');
  panel.innerHTML = '';
  const header = document.createElement('h3');
  header.textContent = 'Global settings';
  panel.appendChild(header);

  // theme
  panel.appendChild(createLabel('Theme:'));
  const themeSelect = document.createElement('select');
  ['white','black','league','sky','beige','simple','serif','night','moon','solarized'].forEach(t => {
    const opt = new Option(t, t);
    if (t === data.global.theme) opt.selected = true;
    themeSelect.add(opt);
  });
  themeSelect.onchange = () => { data.global.theme = themeSelect.value; change(); };
  panel.appendChild(themeSelect);

  panel.appendChild(createLabel('Font family:'));
  const fontInput = document.createElement('input');
  fontInput.value = data.global.fontFamily;
  fontInput.onchange = () => { data.global.fontFamily = fontInput.value; change(); };
  panel.appendChild(fontInput);

  panel.appendChild(createLabel('Font size (e.g. 28px):'));
  const sizeInput = document.createElement('input');
  sizeInput.value = data.global.fontSize;
  sizeInput.onchange = () => { data.global.fontSize = sizeInput.value; change(); };
  panel.appendChild(sizeInput);

  panel.appendChild(createLabel('Text color:'));
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = data.global.textColor;
  colorInput.onchange = () => { data.global.textColor = colorInput.value; change(); };
  panel.appendChild(colorInput);
}

function createLabel(text){
  const l = document.createElement('div');
  l.style.marginTop = '10px';
  l.style.fontSize = '13px';
  l.style.color = 'var(--muted)';
  l.textContent = text;
  return l;
}

function updateEditPanel() {
  const panel = document.getElementById('edit-panel');
  panel.innerHTML = '';
  if (currentSlideIndex < 0 || !data.slides[currentSlideIndex]) {
    panel.innerHTML = '<p>No slide selected</p>';
    return;
  }
  const slide = data.slides[currentSlideIndex];

  // Background type
  panel.appendChild(createLabel('Background type:'));
  const bgSelect = document.createElement('select');
  ['color','image','gradient'].forEach(t => {
    const opt = new Option(t, t);
    if (t === slide.background.type) opt.selected = true;
    bgSelect.add(opt);
  });
  bgSelect.onchange = () => { slide.background.type = bgSelect.value; updateEditPanel(); change(); };
  panel.appendChild(bgSelect);

  // Background value
  panel.appendChild(createLabel('Background value:'));
  const bgValue = document.createElement('input');
  bgValue.value = slide.background.value || '';
  bgValue.placeholder = slide.background.type === 'color' ? '#hex or color name' : (slide.background.type === 'image' ? 'https://...' : 'linear-gradient(...)');
  bgValue.onchange = () => { slide.background.value = bgValue.value; change(); };
  panel.appendChild(bgValue);

  // Transition
  panel.appendChild(createLabel('Transition:'));
  const transSelect = document.createElement('select');
  ['none','fade','slide','convex','concave','zoom'].forEach(t => {
    const opt = new Option(t, t);
    if (t === slide.transition) opt.selected = true;
    transSelect.add(opt);
  });
  transSelect.onchange = () => { slide.transition = transSelect.value; change(); };
  panel.appendChild(transSelect);

  // Notes
  panel.appendChild(createLabel('Speaker notes:'));
  const notes = document.createElement('textarea');
  notes.rows = 4;
  notes.value = slide.notes || '';
  notes.onchange = () => { slide.notes = notes.value; change(); };
  panel.appendChild(notes);

  // Elements
  panel.appendChild(createLabel('Elements:'));
  const addRow = document.createElement('div');
  addRow.style.display = 'flex';
  addRow.style.gap = '8px';
  const addSelect = document.createElement('select');
  ['title','subtitle','text','bullets','image','video'].forEach(t => addSelect.add(new Option(t, t)));
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Element';
  addBtn.style.background = 'var(--accent)';
  addBtn.onclick = () => {
    const type = addSelect.value;
    let newElem;
    if (type === 'bullets') newElem = { type, items: ['New point'], animation: 'none' };
    else if (type === 'image') newElem = { type, src: '', alt: '', animation: 'none' };
    else if (type === 'video') newElem = { type, src: '', controls: true, animation: 'none' };
    else newElem = { type, text: 'Edit me', animation: 'none' };
    slide.elements.push(newElem);
    updateEditPanel();
    change();
  };
  addRow.appendChild(addSelect);
  addRow.appendChild(addBtn);
  panel.appendChild(addRow);

  // List existing elements
  slide.elements.forEach((elem, eIndex) => {
    const editor = createElementEditor(elem, eIndex);
    panel.appendChild(editor);
  });
}

function createElementEditor(elem, eIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'element-item';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('strong');
  title.textContent = elem.type;
  header.appendChild(title);

  const controls = document.createElement('div');

  const del = document.createElement('button');
  del.textContent = 'Delete';
  del.onclick = () => { data.slides[currentSlideIndex].elements.splice(eIndex, 1); updateEditPanel(); change(); };
  controls.appendChild(del);

  const up = document.createElement('button');
  up.textContent = 'Up';
  up.onclick = () => {
    if (eIndex <= 0) return;
    const arr = data.slides[currentSlideIndex].elements;
    [arr[eIndex - 1], arr[eIndex]] = [arr[eIndex], arr[eIndex - 1]];
    updateEditPanel(); change();
  };
  controls.appendChild(up);

  const down = document.createElement('button');
  down.textContent = 'Down';
  down.onclick = () => {
    const arr = data.slides[currentSlideIndex].elements;
    if (eIndex >= arr.length - 1) return;
    [arr[eIndex], arr[eIndex + 1]] = [arr[eIndex + 1], arr[eIndex]];
    updateEditPanel(); change();
  };
  controls.appendChild(down);

  header.appendChild(controls);
  wrapper.appendChild(header);

  // Animation selector
  const animLabel = createLabel('Animation:');
  wrapper.appendChild(animLabel);
  const animSelect = document.createElement('select');
  ['none','appear','fade-in','fade-out','slide-in-left','slide-in-right'].forEach(a => {
    const opt = new Option(a, a);
    if (a === elem.animation) opt.selected = true;
    animSelect.add(opt);
  });
  animSelect.onchange = () => { elem.animation = animSelect.value; change(); };
  wrapper.appendChild(animSelect);

  // Content area by type
  if (['title','subtitle','text'].includes(elem.type)) {
    const inp = document.createElement('input');
    inp.value = elem.text || '';
    inp.onchange = () => { elem.text = inp.value; change(); };
    wrapper.appendChild(inp);
  } else if (elem.type === 'bullets') {
    const ul = document.createElement('div');
    elem.items.forEach((it, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '8px';
      const bIn = document.createElement('input');
      bIn.value = it;
      bIn.onchange = () => { elem.items[i] = bIn.value; change(); };
      const delB = document.createElement('button');
      delB.textContent = 'Del';
      delB.onclick = () => { elem.items.splice(i, 1); updateEditPanel(); change(); };
      row.appendChild(bIn);
      row.appendChild(delB);
      ul.appendChild(row);
    });
    const addB = document.createElement('button');
    addB.textContent = 'Add Bullet';
    addB.onclick = () => { elem.items.push('New point'); updateEditPanel(); change(); };
    wrapper.appendChild(ul);
    wrapper.appendChild(addB);
  } else if (elem.type === 'image') {
    const src = document.createElement('input'); src.placeholder = 'Image URL'; src.value = elem.src || '';
    src.onchange = () => { elem.src = src.value; change(); };
    const alt = document.createElement('input'); alt.placeholder = 'Alt text'; alt.value = elem.alt || '';
    alt.onchange = () => { elem.alt = alt.value; change(); };
    wrapper.appendChild(src); wrapper.appendChild(alt);
  } else if (elem.type === 'video') {
    const vsrc = document.createElement('input'); vsrc.placeholder = 'Video URL'; vsrc.value = elem.src || '';
    vsrc.onchange = () => { elem.src = vsrc.value; change(); };
    const ctrl = document.createElement('input'); ctrl.type = 'checkbox'; ctrl.checked = !!elem.controls;
    ctrl.onchange = () => { elem.controls = ctrl.checked; change(); };
    const ctrlLabel = document.createElement('span'); ctrlLabel.textContent = ' Show controls';
    wrapper.appendChild(vsrc);
    wrapper.appendChild(ctrl);
    wrapper.appendChild(ctrlLabel);
  }

  return wrapper;
}

/* --------------- Preview generation & interactivity --------------- */
function change() {
  updatePreview();
  saveState();
}

function updatePreview() {
  const html = generateRevealHtml();
  const iframe = document.getElementById('preview-frame');
  // Use srcdoc when supported, fallback to write if needed
  try {
    iframe.srcdoc = html;
  } catch (err) {
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }
  // Attach click handler inside iframe once it loads
  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const revealRoot = doc.querySelector('.reveal');
      if (revealRoot) revealRoot.addEventListener('click', handlePreviewClick);
    } catch (e) {
      // cross-origin or other issues — ignore silently
    }
  };
}

function handlePreviewClick(e) {
  let el = e.target;
  // climb to element with data-slide if needed
  const slideAttr = el.closest('[data-slide]');
  if (!slideAttr) return;
  const slideIdx = Number(slideAttr.dataset.slide);
  const elemIdx = Number(el.dataset.elem ?? slideAttr.dataset.elem ?? -1);
  if (isNaN(slideIdx) || slideIdx < 0) return;
  const slide = data.slides[slideIdx];
  if (!slide) return;

  // Edit inline using prompt (simple edit interface)
  if (el.tagName === 'LI' && slide.elements[elemIdx] && slide.elements[elemIdx].type === 'bullets') {
    const itemIdx = Number(el.dataset.item);
    const newVal = prompt('Edit bullet:', slide.elements[elemIdx].items[itemIdx]);
    if (newVal !== null) { slide.elements[elemIdx].items[itemIdx] = newVal; change(); updateEditPanel(); }
  } else if (slide.elements[elemIdx]) {
    const elem = slide.elements[elemIdx];
    if (['title','subtitle','text'].includes(elem.type)) {
      const newVal = prompt('Edit text:', elem.text);
      if (newVal !== null) { elem.text = newVal; change(); updateEditPanel(); }
    } else if (elem.type === 'image') {
      const newVal = prompt('Edit image URL:', elem.src);
      if (newVal !== null) { elem.src = newVal; change(); updateEditPanel(); }
    } else if (elem.type === 'video') {
      const newVal = prompt('Edit video URL:', elem.src);
      if (newVal !== null) { elem.src = newVal; change(); updateEditPanel(); }
    }
  }
}

function generateRevealHtml() {
  // Build theme link (reveal themes are remote; reveal is loaded inside the generated page)
  const themeLink = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/theme/${escapeHtml(data.global.theme)}.min.css">`;
  const style = `<style>
    .reveal { font-family: ${escapeHtml(data.global.fontFamily)}; font-size: ${escapeHtml(data.global.fontSize)}; color: ${escapeHtml(data.global.textColor)}; }
    img { max-width: 80%; height: auto; display:block; margin: 0.6em 0; }
    video { max-width: 90%; display:block; margin: 0.6em 0; }
  </style>`;

  const slidesHtml = data.slides.map((slide, sIndex) => {
    let bgAttr = '';
    if (slide.background) {
      if (slide.background.type === 'color') bgAttr = `data-background-color="${escapeAttr(slide.background.value || '')}"`;
      if (slide.background.type === 'image') bgAttr = `data-background-image="${escapeAttr(slide.background.value || '')}"`;
      if (slide.background.type === 'gradient') bgAttr = `data-background-gradient="${escapeAttr(slide.background.value || '')}"`;
    }
    const transAttr = `data-transition="${escapeAttr(slide.transition || 'none')}"`;
    const elementsHtml = (slide.elements || []).map((elem, eIndex) => {
      const frag = elem.animation && elem.animation !== 'none' ? `class="fragment ${escapeAttr(elem.animation)}"` : '';
      const ds = `data-slide="${sIndex}" data-elem="${eIndex}"`;
      switch (elem.type) {
        case 'title': return `<h1 ${frag} ${ds}>${escapeHtml(elem.text || '')}</h1>`;
        case 'subtitle': return `<h2 ${frag} ${ds}>${escapeHtml(elem.text || '')}</h2>`;
        case 'text': return `<p ${frag} ${ds}>${escapeHtml(elem.text || '')}</p>`;
        case 'bullets':
          return `<ul ${ds}>${(elem.items||[]).map((item, i) => {
            const iFrag = elem.animation && elem.animation !== 'none' ? `class="fragment ${escapeAttr(elem.animation)}"` : '';
            return `<li ${iFrag} data-item="${i}" ${ds}>${escapeHtml(item)}</li>`;
          }).join('')}</ul>`;
        case 'image': return `<img ${frag} ${ds} src="${escapeAttr(elem.src||'')}" alt="${escapeHtml(elem.alt||'')}">`;
        case 'video': return `<video ${frag} ${ds} src="${escapeAttr(elem.src||'')}" ${elem.controls ? 'controls' : ''}></video>`;
        default: return '';
      }
    }).join('');
    const notesHtml = slide.notes ? `<aside class="notes">${escapeHtml(slide.notes)}</aside>` : '';
    return `<section ${bgAttr} ${transAttr}>${elementsHtml}${notesHtml}</section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/reveal.min.css">
  ${themeLink}
  ${style}
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slidesHtml}
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/reveal.min.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      controls: true,
      progress: true,
      history: true,
      center: true,
      overview: true
    });
  </script>
</body>
</html>`;
}

/* --------------- Utilities & persistence --------------- */
function saveState() {
  // push a deep copy string to history
  if (historyIndex < history.length - 1) history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(data));
  historyIndex = history.length - 1;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    data = JSON.parse(history[historyIndex]);
    // ensure selected slide index remains within bounds
    currentSlideIndex = Math.min(currentSlideIndex, data.slides.length - 1);
    updateAll();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    data = JSON.parse(history[historyIndex]);
    currentSlideIndex = Math.min(currentSlideIndex, data.slides.length - 1);
    updateAll();
  }
}

function saveJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'presentation.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      // basic validation
      if (!parsed.global) parsed.global = data.global;
      if (!Array.isArray(parsed.slides)) parsed.slides = [];
      data = parsed;
      currentSlideIndex = data.slides.length > 0 ? 0 : -1;
      saveState();
      updateAll();
    } catch (err) {
      alert('Invalid JSON file: ' + (err.message || 'parse error'));
    }
  };
  reader.readAsText(file);
}

function exportHtml() {
  const html = generateRevealHtml();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'presentation.html';
  a.click();
  URL.revokeObjectURL(url);
}

function exportPdf() {
  // open a new window and print there (user can select Save as PDF)
  const html = generateRevealHtml();
  const w = window.open('', '_blank');
  w.document.open();
  w.document.write(html);
  w.document.close();
  // give reveal a moment to initialize (simple timeout)
  setTimeout(() => {
    try { w.print(); } catch (e) { console.warn('Print failed', e); }
  }, 800);
}

function playDeck() {
  const html = generateRevealHtml();
  const newWin = window.open('', '_blank');
  newWin.document.open();
  newWin.document.write(html);
  newWin.document.close();
}

function updateAll() {
  updateSlideList();
  updateGlobalPanel();
  updateEditPanel();
  updatePreview();
}

/* --------------- Helpers --------------- */
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(s = '') { return escapeHtml(s); }

/* --------------- start --------------- */
window.addEventListener('load', init);
