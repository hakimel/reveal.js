/* --------------- Data & state --------------- */
let data = {
  global: {
    theme: "white",
    customThemeCss: ""
  },
  slides: []
};

let currentSlideIndex = -1;
let history = [];
let historyIndex = -1;
let draggedItem = null;
let isGreenYellowTheme = false; // Track theme state

/* --------------- Initialization --------------- */
function init() {
  bindUI();
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
    isGreenYellowTheme = !isGreenYellowTheme;
    document.body.classList.toggle('green-yellow-theme', isGreenYellowTheme);
    console.log('Toggled theme to:', isGreenYellowTheme ? 'light green to yellow' : 'violet to orange');
  });

  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('redo').addEventListener('click', redo);
  document.getElementById('export-html').addEventListener('click', exportHtml);
  document.getElementById('export-pdf').addEventListener('click', exportPdf);
  document.getElementById('play-deck').addEventListener('click', playDeck);

  window.addEventListener('keydown', (ev) => {
    const mod = (ev.ctrlKey || ev.metaKey);
    if (mod && ev.key === 'n' && !ev.shiftKey) { ev.preventDefault(); addSlide(); return; }
    if (mod && ev.shiftKey && ev.key.toLowerCase() === 'n') { ev.preventDefault(); document.getElementById('new-deck').click(); return; }
    if (mod && ev.key === 'z') { ev.preventDefault(); undo(); return; }
    if (mod && (ev.key === 'y' || (ev.shiftKey && ev.key === 'Z'))) { ev.preventDefault(); redo(); return; }
  });
}

/* --------------- Slide management --------------- */
function addSlide() {
  const newSlide = {
    id: Date.now() + Math.floor(Math.random() * 1000),
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
  updatePreview(true);
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
  list.ondragstart = null;
  list.ondragover = null;
  list.ondragend = null;

  list.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.slide-item');
    if (!draggedItem) return;
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', draggedItem.dataset.id); } catch (err) {}
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
    data.slides.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
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

  panel.appendChild(createLabel('Theme:'));
  const themeSelect = document.createElement('select');
  ['white', 'black', 'league', 'sky', 'beige', 'simple', 'serif', 'night', 'moon', 'solarized', 'custom'].forEach(t => {
    const opt = new Option(t, t);
    if (t === data.global.theme) opt.selected = true;
    themeSelect.add(opt);
  });
  panel.appendChild(themeSelect);

  const customThemeDiv = document.createElement('div');
  customThemeDiv.style.display = data.global.theme === 'custom' ? 'block' : 'none';
  customThemeDiv.style.marginTop = '10px';

  const customLabel = createLabel('Upload custom theme CSS:');
  const customInput = document.createElement('input');
  customInput.type = 'file';
  customInput.accept = '.css';
  customInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        data.global.customThemeCss = ev.target.result;
        console.log('Custom CSS loaded:', data.global.customThemeCss.substring(0, 100) + '...');
        change();
      };
      reader.onerror = () => alert('Error reading CSS file. Ensure it is a valid CSS file.');
      reader.readAsText(file);
    }
  });
  customThemeDiv.appendChild(customLabel);
  customThemeDiv.appendChild(customInput);
  panel.appendChild(customThemeDiv);

  themeSelect.onchange = () => {
    data.global.theme = themeSelect.value;
    customThemeDiv.style.display = data.global.theme === 'custom' ? 'block' : 'none';
    if (data.global.theme !== 'custom') data.global.customThemeCss = '';
    console.log('Theme changed to:', data.global.theme);
    change();
  };
}

function createLabel(text) {
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

  panel.appendChild(createLabel('Transition:'));
  const transSelect = document.createElement('select');
  ['none', 'fade', 'slide', 'convex', 'concave', 'zoom'].forEach(t => {
    const opt = new Option(t, t);
    if (t === slide.transition) opt.selected = true;
    transSelect.add(opt);
  });
  transSelect.onchange = () => { slide.transition = transSelect.value; change(); };
  panel.appendChild(transSelect);

  panel.appendChild(createLabel('Speaker notes:'));
  const notes = document.createElement('textarea');
  notes.rows = 4;
  notes.value = slide.notes || '';
  notes.onchange = () => { slide.notes = notes.value; change(); };
  panel.appendChild(notes);

  panel.appendChild(createLabel('Elements:'));
  const addRow = document.createElement('div');
  addRow.style.display = 'flex';
  addRow.style.gap = '8px';
  const addSelect = document.createElement('select');
  ['title', 'subtitle', 'text', 'bullets', 'image', 'video'].forEach(t => addSelect.add(new Option(t, t)));
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Element';
  addBtn.style.background = 'var(--accent)';
  addBtn.onclick = () => {
    const type = addSelect.value;
    let newElem;
    if (type === 'bullets') newElem = { type, items: ['New point'], animation: 'none', textEffect: 'none', position: { top: '0px', left: '0px' }, fontSize: '1em', fontFamily: 'Arial', color: '#000000' };
    else if (type === 'image') newElem = { type, src: '', alt: '', animation: 'none', width: '80%', position: { top: '0px', left: '0px' } };
    else if (type === 'video') newElem = { type, src: '', controls: true, animation: 'none' };
    else newElem = { type, text: 'Edit me', animation: 'none', textEffect: 'none', position: { top: '0px', left: '0px' }, fontSize: '1em', fontFamily: 'Arial', color: '#000000', ...(type === 'text' ? { align: 'center' } : {}) };
    slide.elements.push(newElem);
    updateEditPanel();
    change();
  };
  addRow.appendChild(addSelect);
  addRow.appendChild(addBtn);
  panel.appendChild(addRow);

  slide.elements.forEach((elem, eIndex) => {
    const editor = createElementEditor(elem, eIndex);
    panel.appendChild(editor);
  });
}

/* --------------- NEW: createElementEditor extended with text animation & effect controls --------------- */
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
    updateEditPanel();
    change();
  };
  controls.appendChild(up);

  const down = document.createElement('button');
  down.textContent = 'Down';
  down.onclick = () => {
    const arr = data.slides[currentSlideIndex].elements;
    if (eIndex >= arr.length - 1) return;
    [arr[eIndex], arr[eIndex + 1]] = [arr[eIndex + 1], arr[eIndex]];
    updateEditPanel();
    change();
  };
  controls.appendChild(down);

  header.appendChild(controls);
  wrapper.appendChild(header);

  const animLabel = createLabel('Animation:');
  wrapper.appendChild(animLabel);
  const animSelect = document.createElement('select');
  ['none', 'appear', 'fade-in', 'fade-out', 'slide-in-left', 'slide-in-right'].forEach(a => {
    const opt = new Option(a, a);
    if (a === elem.animation) opt.selected = true;
    animSelect.add(opt);
  });
  animSelect.onchange = () => { elem.animation = animSelect.value; updatePreview(true); saveState(); };
  wrapper.appendChild(animSelect);

  /* NEW: Text effects controls (only for text-like elements) */
  if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
    const effectLabel = createLabel('Text Effect:');
    wrapper.appendChild(effectLabel);
    const effectSelect = document.createElement('select');
    const effects = ['none', 'typewriter', 'wave', 'neon', 'gradient', 'outline', 'shadow', 'letter-pop', 'letter-sprinkle', 'uppercase', 'lowercase'];
    effects.forEach(eff => {
      const opt = new Option(eff, eff);
      if (eff === (elem.textEffect || 'none')) opt.selected = true;
      effectSelect.add(opt);
    });
    effectSelect.onchange = () => {
      elem.textEffect = effectSelect.value;
      updatePreview(true);
      saveState();
    };
    wrapper.appendChild(effectSelect);

    // Color/gradient control for gradient & neon
    const colorLabel = createLabel('Effect color (for neon/gradient):');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = elem.effectColor || '#ff0080';
    colorInput.onchange = () => {
      elem.effectColor = colorInput.value;
      updatePreview(true);
      saveState();
    };
    wrapper.appendChild(colorLabel);
    wrapper.appendChild(colorInput);
  }

  // Position controls for all relevant element types
  if (['title', 'subtitle', 'text', 'bullets', 'image'].includes(elem.type)) {
    const positionControls = document.createElement('div');
    positionControls.style.display = 'flex';
    positionControls.style.gap = '8px';
    positionControls.style.marginTop = '8px';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.textContent = '↑ Up';
    moveUpBtn.onclick = () => {
      const currentTop = parseInt(elem.position?.top || '0px');
      elem.position = elem.position || { top: '0px', left: '0px' };
      elem.position.top = `${currentTop - 10}px`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    positionControls.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement('button');
    moveDownBtn.textContent = '↓ Down';
    moveDownBtn.onclick = () => {
      const currentTop = parseInt(elem.position?.top || '0px');
      elem.position = elem.position || { top: '0px', left: '0px' };
      elem.position.top = `${currentTop + 10}px`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    positionControls.appendChild(moveDownBtn);

    const moveLeftBtn = document.createElement('button');
    moveLeftBtn.textContent = '← Left';
    moveLeftBtn.onclick = () => {
      const currentLeft = parseInt(elem.position?.left || '0px');
      elem.position = elem.position || { top: '0px', left: '0px' };
      elem.position.left = `${currentLeft - 10}px`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    positionControls.appendChild(moveLeftBtn);

    const moveRightBtn = document.createElement('button');
    moveRightBtn.textContent = '→ Right';
    moveRightBtn.onclick = () => {
      const currentLeft = parseInt(elem.position?.left || '0px');
      elem.position = elem.position || { top: '0px', left: '0px' };
      elem.position.left = `${currentLeft + 10}px`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    positionControls.appendChild(moveRightBtn);
    wrapper.appendChild(positionControls);
  }

  // Font size, style, color, and alignment controls for title, subtitle, text, bullets
  if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
    const fontControls = document.createElement('div');
    fontControls.style.display = 'flex';
    fontControls.style.gap = '8px';
    fontControls.style.marginTop = '8px';

    const increaseSizeBtn = document.createElement('button');
    increaseSizeBtn.textContent = 'Increase Size';
    increaseSizeBtn.onclick = () => {
      const currentSize = parseFloat(elem.fontSize || '1');
      elem.fontSize = `${currentSize + 0.1}em`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    fontControls.appendChild(increaseSizeBtn);

    const decreaseSizeBtn = document.createElement('button');
    decreaseSizeBtn.textContent = 'Decrease Size';
    decreaseSizeBtn.onclick = () => {
      const currentSize = parseFloat(elem.fontSize || '1');
      if (currentSize > 0.2) {
        elem.fontSize = `${currentSize - 0.1}em`;
        updateEditPanel();
        updatePreview(true);
        saveState();
      }
    };
    fontControls.appendChild(decreaseSizeBtn);

    const fontSelect = document.createElement('select');
    ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond'].forEach(f => {
      const opt = new Option(f, f);
      if (f === elem.fontFamily) opt.selected = true;
      fontSelect.add(opt);
    });
    fontSelect.onchange = () => {
      elem.fontFamily = fontSelect.value;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    fontControls.appendChild(fontSelect);

    const colorLabel = createLabel('Text Color:');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = elem.color || '#000000';
    colorInput.onchange = () => {
      elem.color = colorInput.value;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    fontControls.appendChild(colorLabel);
    fontControls.appendChild(colorInput);

    // Alignment control only for text elements
    if (elem.type === 'text') {
      const alignLabel = createLabel('Text Alignment:');
      const alignSelect = document.createElement('select');
      ['left', 'center', 'right'].forEach(a => {
        const opt = new Option(a, a);
        if (a === (elem.align || 'center')) opt.selected = true;
        alignSelect.add(opt);
      });
      alignSelect.onchange = () => {
        elem.align = alignSelect.value;
        updateEditPanel();
        updatePreview(true);
        saveState();
      };
      fontControls.appendChild(alignLabel);
      fontControls.appendChild(alignSelect);
    }

    wrapper.appendChild(fontControls);
  }

  if (['title', 'subtitle', 'text'].includes(elem.type)) {
    const inp = document.createElement('input');
    inp.value = elem.text || '';
    inp.style.textTransform = 'none'; // Prevent automatic capitalization
    inp.oninput = () => { elem.text = inp.value; updatePreview(true); saveState(); };
    wrapper.appendChild(inp);
  } else if (elem.type === 'bullets') {
    const ul = document.createElement('div');
    elem.items.forEach((it, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '8px';
      const bIn = document.createElement('input');
      bIn.value = it;
      bIn.style.textTransform = 'none'; // Prevent automatic capitalization
      bIn.oninput = () => { elem.items[i] = bIn.value; updatePreview(true); saveState(); };
      const delB = document.createElement('button');
      delB.textContent = 'Del';
      delB.onclick = () => { elem.items.splice(i, 1); updateEditPanel(); updatePreview(true); saveState(); };
      row.appendChild(bIn);
      row.appendChild(delB);
      ul.appendChild(row);
    });
    const addB = document.createElement('button');
    addB.textContent = 'Add Bullet';
    addB.onclick = () => { elem.items.push('New point'); updateEditPanel(); updatePreview(true); saveState(); };
    wrapper.appendChild(ul);
    wrapper.appendChild(addB);
  } else if (elem.type === 'image') {
    const src = document.createElement('input');
    src.placeholder = 'Image URL';
    src.value = elem.src || '';
    src.oninput = () => { elem.src = src.value; updatePreview(true); saveState(); };
    wrapper.appendChild(src);

    const alt = document.createElement('input');
    alt.placeholder = 'Alt text';
    alt.value = elem.alt || '';
    alt.oninput = () => { elem.alt = alt.value; updatePreview(true); saveState(); };
    wrapper.appendChild(alt);

    // Image size controls
    const sizeControls = document.createElement('div');
    sizeControls.style.display = 'flex';
    sizeControls.style.gap = '8px';
    sizeControls.style.marginTop = '8px';

    const increaseSizeBtn = document.createElement('button');
    increaseSizeBtn.textContent = 'Increase Size';
    increaseSizeBtn.onclick = () => {
      const currentWidth = parseInt(elem.width || '80%');
      elem.width = `${currentWidth + 10}%`;
      updateEditPanel();
      updatePreview(true);
      saveState();
    };
    sizeControls.appendChild(increaseSizeBtn);

    const decreaseSizeBtn = document.createElement('button');
    decreaseSizeBtn.textContent = 'Decrease Size';
    decreaseSizeBtn.onclick = () => {
      const currentWidth = parseInt(elem.width || '80%');
      if (currentWidth > 10) {
        elem.width = `${currentWidth - 10}%`;
        updateEditPanel();
        updatePreview(true);
        saveState();
      }
    };
    sizeControls.appendChild(decreaseSizeBtn);
    wrapper.appendChild(sizeControls);
  } else if (elem.type === 'video') {
    const vsrc = document.createElement('input');
    vsrc.placeholder = 'Video URL';
    vsrc.value = elem.src || '';
    vsrc.oninput = () => { elem.src = vsrc.value; updatePreview(true); saveState(); };
    const ctrl = document.createElement('input');
    ctrl.type = 'checkbox';
    ctrl.checked = !!elem.controls;
    ctrl.onchange = () => { elem.controls = ctrl.checked; updatePreview(true); saveState(); };
    const ctrlLabel = document.createElement('span');
    ctrlLabel.textContent = ' Show controls';
    wrapper.appendChild(vsrc);
    wrapper.appendChild(ctrl);
    wrapper.appendChild(ctrlLabel);
  }

  return wrapper;
}

/* --------------- Preview generation & interactivity --------------- */
function change() {
  updatePreview(true);
  saveState();
}

function updatePreview(maintainCurrentSlide = false) {
  const html = generateRevealHtml();
  const iframe = document.getElementById('preview-frame');
  const targetSlide = maintainCurrentSlide && currentSlideIndex >= 0 ? currentSlideIndex : data.slides.length - 1;

  try {
    iframe.srcdoc = html;
    console.log('Preview updated with new HTML, targeting slide:', targetSlide + 1);
  } catch (err) {
    console.error('Error setting srcdoc:', err);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const revealRoot = doc.querySelector('.reveal');
      if (revealRoot) {
        const Reveal = iframe.contentWindow.Reveal;
        if (Reveal) {
          Reveal.initialize({
            hash: true,
            controls: true,
            progress: true,
            history: true,
            center: true,
            overview: true
          }).then(() => {
            if (targetSlide >= 0 && targetSlide < data.slides.length) {
              Reveal.slide(targetSlide);
              console.log('Navigated to slide:', targetSlide + 1);
            }
            revealRoot.addEventListener('click', handlePreviewClick);
            console.log('Reveal.js initialized in preview');
          }).catch((e) => {
            console.error('Reveal.js initialization failed:', e);
          });
        } else {
          console.error('Reveal.js not available in iframe');
        }
      } else {
        console.error('Reveal.js root not found in preview');
      }
    } catch (e) {
      console.error('Error in iframe onload:', e);
    }
  };
}

/* --------------- handlePreviewClick (unchanged) --------------- */
function handlePreviewClick(e) {
  let el = e.target;
  const slideAttr = el.closest('[data-slide]');
  if (!slideAttr) return;
  const slideIdx = Number(slideAttr.dataset.slide);
  const elemIdx = Number(el.dataset.elem ?? slideAttr.dataset.elem ?? -1);
  if (isNaN(slideIdx) || slideIdx < 0) return;
  const slide = data.slides[slideIdx];
  if (!slide) return;

  if (el.tagName === 'LI' && slide.elements[elemIdx] && slide.elements[elemIdx].type === 'bullets') {
    const itemIdx = Number(el.dataset.item);
    const newVal = prompt('Edit bullet:', slide.elements[elemIdx].items[itemIdx]);
    if (newVal !== null) { slide.elements[elemIdx].items[itemIdx] = newVal; updateEditPanel(); updatePreview(true); saveState(); }
  } else if (slide.elements[elemIdx]) {
    const elem = slide.elements[elemIdx];
    if (['title', 'subtitle', 'text'].includes(elem.type)) {
      const newVal = prompt('Edit text:', elem.text);
      if (newVal !== null) { elem.text = newVal; updateEditPanel(); updatePreview(true); saveState(); }
    } else if (elem.type === 'image') {
      const newVal = prompt('Edit image URL:', elem.src);
      if (newVal !== null) { elem.src = newVal; updateEditPanel(); updatePreview(true); saveState(); }
    } else if (elem.type === 'video') {
      const newVal = prompt('Edit video URL:', elem.src);
      if (newVal !== null) { elem.src = newVal; updateEditPanel(); updatePreview(true); saveState(); }
    }
  }
}

/* --------------- NEW: helper to wrap text into per-letter spans for certain effects --------------- */
function lettersToSpans(text, baseClass, effectName) {
  // returns HTML string: each letter wrapped with a span that has a staggered --delay CSS variable
  if (!text) return '';
  // treat whitespace groups as single spaces
  const chars = Array.from(text);
  return chars.map((ch, i) => {
    const delay = `${i * 45}ms`;
    const safe = escapeHtml(ch === ' ' ? '\u00A0' : ch);
    return `<span style="--delay:${delay}">${safe}</span>`;
  }).join('');
}

function generateRevealHtml() {
  let themeCss = '';
  if (data.global.theme === 'custom' && data.global.customThemeCss) {
    themeCss = `<style>
      .reveal, .reveal .slides, .reveal .slides section {
        ${data.global.customThemeCss}
      }
      .reveal .slides section {
        display: block !important;
        opacity: 1 !important;
        transform: none !important;
        position: relative !important;
		
      }
    </style>`;
    console.log('Applying custom theme CSS');
  } else if (data.global.theme !== 'custom') {
    themeCss = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/theme/${escapeHtml(data.global.theme)}.min.css" onerror="console.error('Failed to load theme CSS: ${data.global.theme}')">`;
    console.log('Applying built-in theme:', data.global.theme);
  }

  const style = `<style>
    /* basic reveal element sizing (kept simple) */
    .reveal .slides img { max-width: 80%; height: auto; display: block; margin: 0.6em 0; position: relative; }
    .reveal .slides video { max-width: 90%; display: block; margin: 0.6em 0; }

    /* Mirror important text-effect styles inside iframe */
    .reveal .fragment.typewriter { white-space: nowrap; overflow: hidden; display: inline-block; animation: typewriter 2.5s steps(30, end) forwards; border-right: .12em solid rgba(0,0,0,0.6); }
    .reveal .fragment.wave span { display: inline-block; animation: wave 1.2s ease-in-out infinite; transform-origin: 50% 50%; }
    .reveal .fragment.neon { text-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 18px rgba(255,0,255,0.3); animation: neonPulse 1.6s ease-in-out infinite; }
    .reveal .fragment.gradient { background: linear-gradient(90deg,#ff8a00,#e52e71,#6a11cb); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; }
    .reveal .fragment.outline { color: transparent; -webkit-text-stroke: 1px rgba(0,0,0,0.85); text-stroke: 1px rgba(0,0,0,0.85); }
    .reveal .fragment.shadow { text-shadow: 3px 4px 8px rgba(0,0,0,0.4); }
    .reveal .fragment.letter-pop span { display:inline-block; animation: letterPop 0.45s ease forwards; }
    .reveal .fragment.letter-sprinkle span { display:inline-block; animation: sprinkle 0.9s ease forwards; }

    @keyframes typewriter { from { width: 0; } to { width: 100%; border-right: .12em solid rgba(0,0,0,0.0); } }
    @keyframes wave { 0% { transform: translateY(0); } 50% { transform: translateY(-10%); } 100% { transform: translateY(0); } }
    @keyframes neonPulse { 0% { text-shadow: 0 0 6px rgba(255,255,255,0.9), 0 0 14px rgba(255,0,255,0.25);} 50% { text-shadow: 0 0 12px rgba(255,255,255,1), 0 0 26px rgba(255,0,255,0.4);} 100% { text-shadow: 0 0 6px rgba(255,255,255,0.9), 0 0 14px rgba(255,0,255,0.25);} }
    @keyframes letterPop { 0% { transform: scale(0.7) translateY(6px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
    @keyframes sprinkle { 0% { transform: translateY(-14px) rotate(-6deg); opacity: 0; } 100% { transform: translateY(0) rotate(0deg); opacity: 1; } }

    .reveal .fragment.wave span { animation-delay: var(--delay, 0ms); }
    .reveal .fragment.letter-pop span { animation-delay: var(--delay, 0ms); }
    .reveal .fragment.letter-sprinkle span { animation-delay: var(--delay, 0ms); }

    .reveal .text-effect-uppercase { text-transform: uppercase; letter-spacing: 0.06em; }
    .reveal .text-effect-lowercase { text-transform: lowercase; }

    /* ensure inline styles from elements are applied */
  </style>`;

  const slidesHtml = data.slides.map((slide, sIndex) => {
    const transAttr = `data-transition="${escapeAttr(slide.transition || 'none')}"`;
    const elementsHtml = (slide.elements || []).map((elem, eIndex) => {
      // determine fragment class for animation + text effect classes
      const fragClasses = [];
      if (elem.animation && elem.animation !== 'none') {
        // map animations to fragment class names that we've styled
        // we support using the animation name as fragment class (as earlier)
        fragClasses.push(elem.animation);
      }
      // textEffect mapping -> class for styling (we may need to wrap letters)
      const textEffect = elem.textEffect || 'none';
      if (textEffect && textEffect !== 'none') {
        fragClasses.push(textEffect);
      }

      const fragClassAttr = fragClasses.length ? `class="fragment ${fragClasses.map(c => escapeAttr(c)).join(' ')}"` : '';

      const ds = `data-slide="${sIndex}" data-elem="${eIndex}"`;

      // inline style building for position, font, color
      let inlineStyle = '';
      if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
        if (elem.position) {
          inlineStyle += `position:relative; top:${escapeAttr(elem.position.top || '0px')}; left:${escapeAttr(elem.position.left || '0px')};`;
        }
        if (elem.fontSize) inlineStyle += `font-size:${escapeAttr(elem.fontSize)};`;
        if (elem.fontFamily) inlineStyle += `font-family:${escapeAttr(elem.fontFamily)};`;
        if (elem.color) inlineStyle += `color:${escapeAttr(elem.color)};`;
      } else if (elem.type === 'image') {
        if (elem.position) inlineStyle += `position:relative; top:${escapeAttr(elem.position.top || '0px')}; left:${escapeAttr(elem.position.left || '0px')};`;
        if (elem.width) inlineStyle += `max-width:${escapeAttr(elem.width)};`;
      }

      // Apply effect-specific transformations: typewriter uses text raw; wave/letter effects require per-letter spans
      switch (elem.type) {
        case 'title': {
          if (textEffect === 'wave' || textEffect === 'letter-pop' || textEffect === 'letter-sprinkle') {
            // wrap letters
            const wrapped = lettersToSpans(elem.text || '', 'span', textEffect);
            return `<h1 ${fragClassAttr} ${ds} style="${inlineStyle}">${wrapped}</h1>`;
          } else if (textEffect === 'typewriter') {
            return `<h1 ${fragClassAttr} ${ds} style="${inlineStyle}">${escapeHtml(elem.text || '')}</h1>`;
          } else {
            // apply uppercase/lowercase classes
            const caseClass = textEffect === 'uppercase' ? 'text-effect-uppercase' : (textEffect === 'lowercase' ? 'text-effect-lowercase' : '');
            const styleColor = elem.effectColor ? `color:${escapeAttr(elem.effectColor)};` : '';
            return `<h1 ${fragClassAttr} ${ds} style="${inlineStyle + styleColor}" ${caseClass ? `class="${caseClass}"` : ''}>${escapeHtml(elem.text || '')}</h1>`;
          }
        }

        case 'subtitle': {
          if (textEffect === 'wave' || textEffect === 'letter-pop' || textEffect === 'letter-sprinkle') {
            const wrapped = lettersToSpans(elem.text || '', 'span', textEffect);
            return `<h2 ${fragClassAttr} ${ds} style="${inlineStyle}">${wrapped}</h2>`;
          } else {
            const caseClass = textEffect === 'uppercase' ? 'text-effect-uppercase' : (textEffect === 'lowercase' ? 'text-effect-lowercase' : '');
            const styleColor = elem.effectColor ? `color:${escapeAttr(elem.effectColor)};` : '';
            return `<h2 ${fragClassAttr} ${ds} style="${inlineStyle + styleColor}" ${caseClass ? `class="${caseClass}"` : ''}>${escapeHtml(elem.text || '')}</h2>`;
          }
        }

        case 'text': {
          if (textEffect === 'wave' || textEffect === 'letter-pop' || textEffect === 'letter-sprinkle') {
            const wrapped = lettersToSpans(elem.text || '', 'span', textEffect);
            return `<p ${fragClassAttr} ${ds} style="${inlineStyle}">${wrapped}</p>`;
          } else {
            const caseClass = textEffect === 'uppercase' ? 'text-effect-uppercase' : (textEffect === 'lowercase' ? 'text-effect-lowercase' : '');
            const styleColor = elem.effectColor ? `color:${escapeAttr(elem.effectColor)};` : '';
            const alignStyle = elem.align ? `text-align:${escapeAttr(elem.align)};` : '';
            return `<p ${fragClassAttr} ${ds} style="${inlineStyle + styleColor + alignStyle}" ${caseClass ? `class="${caseClass}"` : ''}>${escapeHtml(elem.text || '')}</p>`;
          }
        }

        case 'bullets': {
          const itemsHtml = (elem.items || []).map((it, i) => {
            // For per-item effects, wrap letters if needed
            if (textEffect === 'wave' || textEffect === 'letter-pop' || textEffect === 'letter-sprinkle') {
              const wrapped = lettersToSpans(it, 'span', textEffect);
              return `<li ${fragClassAttr} data-item="${i}" ${ds}>${wrapped}</li>`;
            } else {
              const styleColor = elem.effectColor ? `color:${escapeAttr(elem.effectColor)};` : '';
              const caseClass = textEffect === 'uppercase' ? 'text-effect-uppercase' : (textEffect === 'lowercase' ? 'text-effect-lowercase' : '');
              return `<li ${fragClassAttr} data-item="${i}" ${ds} style="${styleColor}" ${caseClass ? `class="${caseClass}"` : ''}>${escapeHtml(it)}</li>`;
            }
          }).join('');
          return `<ul ${ds}>${itemsHtml}</ul>`;
        }

        case 'image': {
          const effectStyle = elem.effectColor && (elem.textEffect === 'neon') ? `filter: drop-shadow(0 0 8px ${escapeAttr(elem.effectColor)});` : '';
          return `<img ${fragClassAttr} ${ds} src="${escapeAttr(elem.src || '')}" alt="${escapeHtml(elem.alt || '')}" style="${inlineStyle + effectStyle}">`;
        }

        case 'video': {
          return `<video ${fragClassAttr} ${ds} src="${escapeAttr(elem.src || '')}" ${elem.controls ? 'controls' : ''} style="${inlineStyle}"></video>`;
        }

        default: return '';
      }
    }).join('');
    const notesHtml = slide.notes ? `<aside class="notes">${escapeHtml(slide.notes)}</aside>` : '';
    return `<section ${transAttr}>${elementsHtml}${notesHtml}</section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/reveal.min.css" onerror="console.error('Failed to load Reveal.js CSS')">
  ${themeCss}
  ${style}
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slidesHtml}
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/reveal.min.js" onerror="console.error('Failed to load Reveal.js JS')"></script>
  <script>
    try {
      Reveal.initialize({
        hash: true,
        controls: true,
        progress: true,
        history: true,
        center: true,
        overview: true
      }).then(() => {
        console.log('Reveal.js initialized successfully');
      }).catch((e) => {
        console.error('Reveal.js initialization failed:', e);
      });
    } catch (e) {
      console.error('Error initializing Reveal.js:', e);
    }
  </script>
</body>
</html>`;
}

/* --------------- Utilities & persistence --------------- */
function saveState() {
  if (historyIndex < history.length - 1) history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(data));
  historyIndex = history.length - 1;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    data = JSON.parse(history[historyIndex]);
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
  const html = generateRevealHtml();
  const w = window.open('', '_blank');
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => {
    try { w.print(); } catch (e) { console.warn('Print failed', e); }
  }, 1000);
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
  updatePreview(true);
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

