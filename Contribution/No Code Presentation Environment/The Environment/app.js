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
    if (type === 'bullets') newElem = { type, items: ['New point'], animation: 'none', position: { top: '0px', left: '0px' }, fontSize: '1em', fontFamily: 'Arial', color: '#000000' };
    else if (type === 'image') newElem = { type, src: '', alt: '', animation: 'none', width: '80%', position: { top: '0px', left: '0px' } };
    else if (type === 'video') newElem = { type, src: '', controls: true, animation: 'none' };
    else newElem = { type, text: 'Edit me', animation: 'none', position: { top: '0px', left: '0px' }, fontSize: '1em', fontFamily: 'Arial', color: '#000000', ...(type === 'text' ? { align: 'center' } : {}) };
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
    .reveal .slides img { max-width: 80%; height: auto; display: block; margin: 0.6em 0; position: relative; }
    .reveal .slides video { max-width: 90%; display: block; margin: 0.6em 0; }
    ${data.slides.map((slide, sIndex) => slide.elements.map((elem, eIndex) => {
      let styles = '';
      if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
        styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
          ${elem.position ? `position: relative; top: ${escapeHtml(elem.position.top || '0px')}; left: ${escapeHtml(elem.position.left || '0px')};` : ''}
          font-size: ${escapeHtml(elem.fontSize || '1em')};
          font-family: ${escapeHtml(elem.fontFamily || 'Arial')};
          color: ${escapeHtml(elem.color || '#000000')};
          text-transform: none;
          ${elem.type === 'text' && elem.align ? `text-align: ${escapeHtml(elem.align)};` : ''}
        }`;
      } else if (elem.type === 'image') {
        if (elem.width || elem.position) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            max-width: ${escapeHtml(elem.width || '80%')} !important;
            ${elem.position ? `position: relative; top: ${escapeHtml(elem.position.top || '0px')}; left: ${escapeHtml(elem.position.left || '0px')};` : ''}
          }`;
        }
      }
      return styles;
    }).join('')).join('')}
  </style>`;

  const slidesHtml = data.slides.map((slide, sIndex) => {
    const transAttr = `data-transition="${escapeAttr(slide.transition || 'none')}"`;
    const elementsHtml = (slide.elements || []).map((elem, eIndex) => {
      const frag = elem.animation && elem.animation !== 'none' ? `class="fragment ${escapeAttr(elem.animation)}"` : '';
      const ds = `data-slide="${sIndex}" data-elem="${eIndex}"`;
      switch (elem.type) {
        case 'title': return `<h1 ${frag} ${ds}>${escapeHtml(elem.text || '')}</h1>`;
        case 'subtitle': return `<h2 ${frag} ${ds}>${escapeHtml(elem.text || '')}</h2>`;
        case 'text': return `<p ${frag} ${ds}>${escapeHtml(elem.text || '')}</p>`;
        case 'bullets':
          return `<ul ${ds}>${(elem.items || []).map((item, i) => {
            const iFrag = elem.animation && elem.animation !== 'none' ? `class="fragment ${escapeAttr(elem.animation)}"` : '';
            return `<li ${iFrag} data-item="${i}" ${ds}>${escapeHtml(item)}</li>`;
          }).join('')}</ul>`;
        case 'image': return `<img ${frag} ${ds} src="${escapeAttr(elem.src || '')}" alt="${escapeHtml(elem.alt || '')}">`;
        case 'video': return `<video ${frag} ${ds} src="${escapeAttr(elem.src || '')}" ${elem.controls ? 'controls' : ''}></video>`;
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