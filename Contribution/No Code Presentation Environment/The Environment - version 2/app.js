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

function importDesigns(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);

      if (!Array.isArray(parsed.slides)) {
        alert("Invalid design file: no slides found");
        return;
      }

      // Merge imported slide designs, stripping background and setting defaults for elements
      parsed.slides.forEach(slide => {
        const { background, ...rest } = slide; // Strip background
        rest.elements = (rest.elements || []).map(elem => {
          if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
            return {
              ...elem,
              fontFamily: elem.fontFamily || 'Arial',
              textAlign: elem.textAlign || 'left',
              x: elem.x || 0,
              y: elem.y || 0
            };
          } else if (elem.type === 'image') {
            return {
              ...elem,
              width: elem.width || 'auto',
              height: elem.height || 'auto',
              x: elem.x || 0,
              y: elem.y || 0
            };
          }
          return elem;
        });
        data.slides.push(rest);
      });

      currentSlideIndex = data.slides.length - 1;
      saveState();
      updateAll();

      alert("Designs imported successfully!");
    } catch (err) {
      alert("Invalid design JSON: " + err.message);
    }
  };
  reader.readAsText(file);
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
  document.getElementById('save-json').addEventListener('click', saveJson);
  document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-json').click());
  document.getElementById('import-json').addEventListener('change', importJson);
  document.getElementById('export-html').addEventListener('click', exportHtml);
  document.getElementById('export-pdf').addEventListener('click', exportPdf);
  document.getElementById('play-deck').addEventListener('click', playDeck);

  document.getElementById('ai-generate').addEventListener('click', async () => {
    const topic = prompt("Enter topic for AI slides:");
    if (!topic) return;
    const num = parseInt(prompt("How many slides? (1-15)", "5"), 10) || 5;

    const finalNum = Math.max(1, Math.min(num, 15)); // Clamp slides to 1-15
    const normalizedTopic = topic.trim();

    try {
      const generatedSlides = [];
      // Allocate slides for content, leaving 2 for Title and Conclusion (min 1 content slide)
      const contentSlidesNeeded = Math.max(1, finalNum - 2);
      
      // --- 1. Title Slide (Slide 1) ---
      generatedSlides.push({
          title: normalizedTopic,
          subtitle: `A Comprehensive Overview of ${normalizedTopic}`,
          points: [`Presented by the Slide Builder AI`, `Focus on Key Concepts and Practical Applications`]
      });

      // --- 2. Main Content Sections (Simulation of detailed AI content) ---
      const mainSections = [
          `Introduction & Context`,
          `Core Components and Mechanics`,
          `Real-World Applications and Case Studies`,
          `Challenges, Risks, and Mitigation Strategies`,
          `Future Trends and Long-term Impact`
      ];
      
      let sections = mainSections.slice(0, contentSlidesNeeded);
      
      // If more slides are requested than the standard 5 sections, add placeholder detail slides
      while (sections.length < contentSlidesNeeded) {
          sections.push(`Detailed Analysis: Aspect ${sections.length - mainSections.length + 1}`);
      }

      for (let i = 0; i < sections.length; i++) {
          const sectionTitle = sections[i];
          
          let points = [];
          if (sectionTitle.includes('Introduction')) {
              points = ['Definition and background of the topic.', 'Historical perspective and evolution.', 'Why this topic is important today.'];
          } else if (sectionTitle.includes('Core Components')) {
              points = ['Breakdown of essential elements.', 'How the system or process works (detailed step).', 'Diagram/Model concept (visual idea).'];
          } else if (sectionTitle.includes('Applications')) {
              points = ['Example 1: Specific industry use case.', 'Example 2: Measurable results or impact.', 'Lessons learned from successful deployment.'];
          } else if (sectionTitle.includes('Challenges')) {
              points = ['Identifying the top 3 difficulties.', 'Proposed solution for each challenge.', 'Risk assessment and severity level.'];
          } else if (sectionTitle.includes('Future Trends')) {
              points = ['Predicted developments in the next 5 years.', 'Opportunities for innovation.', 'Call to Action for the audience.'];
          } else {
              // Default points for extra detail slides
              points = [`Key detail on the topic's sub-aspect ${i+1}.`, `Supporting data or statistics for this aspect.`, `Conclusion for this specific detail.`];
          }

          generatedSlides.push({
              'title': sectionTitle,
              'subtitle': `${normalizedTopic}: ${sectionTitle}`,
              'points': points
          });
      }
      
      // --- 3. Conclusion Slide (Final Slide, if requested) ---
      if (finalNum > 1) {
          generatedSlides.push({
              'title': 'Summary & Next Steps',
              'subtitle': `Concluding Thoughts on ${normalizedTopic}`,
              'points': ['Recap of the most critical takeaways.', 'Open Q&A session.', 'Thank you and contact information.']
          });
      }

      // Process the generated slides and add them to the deck
      const slidesToAdd = generatedSlides.slice(0, finalNum);

      slidesToAdd.forEach(sl => {
        const newSlide = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          transition: "fade",
          notes: "",
          elements: [
            { type: "title", text: sl.title, animation: "none", fontSize: "40px", color: "#000000", fontFamily: "Arial", textAlign: "left", x: 0, y: 0 },
            { type: "subtitle", text: sl.subtitle, animation: "none", fontSize: "24px", color: "#333333", fontFamily: "Arial", textAlign: "left", x: 0, y: 0 },
            { type: "bullets", items: sl.points, animation: "none", fontSize: "20px", color: "#000000", fontFamily: "Arial", textAlign: "left", x: 0, y: 0 }
          ]
        };
        data.slides.push(newSlide);
      });

      currentSlideIndex = data.slides.length - 1;
      saveState();
      updateAll();

    } catch (err) {
      alert("AI generation failed unexpectedly. Check the console for details.");
      console.error(err);
    }
  });

  document.getElementById('import-designs').addEventListener('click', () => {
    document.getElementById('import-designs-json').click();
  });

  document.getElementById('import-designs-json').addEventListener('change', importDesigns);

  window.addEventListener('keydown', (ev) => {
    const mod = (ev.ctrlKey || ev.metaKey);
    if (mod && ev.key === 's') { ev.preventDefault(); saveJson(); return; }
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
    if (type === 'bullets') newElem = { type, items: ['New point'], animation: 'none', fontSize: '32px', color: '#000000', fontFamily: 'Arial', textAlign: 'left', x: 0, y: 0 };
    else if (type === 'image') newElem = { type, src: '', alt: '', animation: 'none', width: 'auto', height: 'auto', x: 0, y: 0 };
    else if (type === 'video') newElem = { type, src: '', controls: true, animation: 'none' };
    else newElem = { type, text: 'Edit me', animation: 'none', fontSize: '32px', color: '#000000', fontFamily: 'Arial', textAlign: 'left', x: 0, y: 0 };
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
  animSelect.onchange = () => { elem.animation = animSelect.value; change(); };
  wrapper.appendChild(animSelect);

  if (['title', 'subtitle', 'text'].includes(elem.type)) {
    const inp = document.createElement('input');
    inp.value = elem.text || '';
    inp.style.textTransform = 'none'; // Prevent auto-capitalization
    inp.onchange = () => { elem.text = inp.value; change(); };
    wrapper.appendChild(inp);

    const fontSizeControls = document.createElement('div');
    fontSizeControls.style.display = 'flex';
    fontSizeControls.style.gap = '8px';
    fontSizeControls.style.marginTop = '8px';

    const increaseFontBtn = document.createElement('button');
    increaseFontBtn.textContent = 'Increase Font';
    increaseFontBtn.onclick = () => {
      const currentSize = parseInt(elem.fontSize || '32px');
      elem.fontSize = `${currentSize + 2}px`;
      updateEditPanel();
      change();
    };
    fontSizeControls.appendChild(increaseFontBtn);

    const decreaseFontBtn = document.createElement('button');
    decreaseFontBtn.textContent = 'Decrease Font';
    decreaseFontBtn.onclick = () => {
      const currentSize = parseInt(elem.fontSize || '32px');
      if (currentSize > 10) {
        elem.fontSize = `${currentSize - 2}px`;
        updateEditPanel();
        change();
      }
    };
    fontSizeControls.appendChild(decreaseFontBtn);

    const fontFamilyLabel = createLabel('Font Family:');
    const fontFamilySelect = document.createElement('select');
    ['Arial', 'Times New Roman', 'Helvetica', 'Courier New', 'Verdana', 'Georgia'].forEach(f => {
      const opt = new Option(f, f);
      if (f === elem.fontFamily) opt.selected = true;
      fontFamilySelect.add(opt);
    });
    fontFamilySelect.onchange = () => { elem.fontFamily = fontFamilySelect.value; change(); };
    wrapper.appendChild(fontFamilyLabel);
    wrapper.appendChild(fontFamilySelect);

    const textAlignLabel = createLabel('Text Align:');
    const textAlignSelect = document.createElement('select');
    ['left', 'center', 'right'].forEach(a => {
      const opt = new Option(a, a);
      if (a === elem.textAlign) opt.selected = true;
      textAlignSelect.add(opt);
    });
    textAlignSelect.onchange = () => { elem.textAlign = textAlignSelect.value; change(); };
    wrapper.appendChild(textAlignLabel);
    wrapper.appendChild(textAlignSelect);

    const positionControls = document.createElement('div');
    positionControls.style.display = 'flex';
    positionControls.style.gap = '8px';
    positionControls.style.marginTop = '8px';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.textContent = 'Move Up';
    moveUpBtn.onclick = () => {
      elem.y = (elem.y || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement('button');
    moveDownBtn.textContent = 'Move Down';
    moveDownBtn.onclick = () => {
      elem.y = (elem.y || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveDownBtn);

    const moveLeftBtn = document.createElement('button');
    moveLeftBtn.textContent = 'Move Left';
    moveLeftBtn.onclick = () => {
      elem.x = (elem.x || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveLeftBtn);

    const moveRightBtn = document.createElement('button');
    moveRightBtn.textContent = 'Move Right';
    moveRightBtn.onclick = () => {
      elem.x = (elem.x || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveRightBtn);

    const colorLabel = createLabel('Text color:');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = elem.color || '#000000';
    colorInput.onchange = () => {
      elem.color = colorInput.value;
      updateEditPanel();
      change();
    };
    wrapper.appendChild(fontSizeControls);
    wrapper.appendChild(colorLabel);
    wrapper.appendChild(colorInput);
    wrapper.appendChild(positionControls);
  } else if (elem.type === 'bullets') {
    const ul = document.createElement('div');
    elem.items.forEach((it, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '8px';
      const bIn = document.createElement('input');
      bIn.value = it;
      bIn.style.textTransform = 'none'; // Prevent auto-capitalization
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

    const fontSizeControls = document.createElement('div');
    fontSizeControls.style.display = 'flex';
    fontSizeControls.style.gap = '8px';
    fontSizeControls.style.marginTop = '8px';

    const increaseFontBtn = document.createElement('button');
    increaseFontBtn.textContent = 'Increase Font';
    increaseFontBtn.onclick = () => {
      const currentSize = parseInt(elem.fontSize || '32px');
      elem.fontSize = `${currentSize + 2}px`;
      updateEditPanel();
      change();
    };
    fontSizeControls.appendChild(increaseFontBtn);

    const decreaseFontBtn = document.createElement('button');
    decreaseFontBtn.textContent = 'Decrease Font';
    decreaseFontBtn.onclick = () => {
      const currentSize = parseInt(elem.fontSize || '32px');
      if (currentSize > 10) {
        elem.fontSize = `${currentSize - 2}px`;
        updateEditPanel();
        change();
      }
    };
    fontSizeControls.appendChild(decreaseFontBtn);

    const fontFamilyLabel = createLabel('Font Family:');
    const fontFamilySelect = document.createElement('select');
    ['Arial', 'Times New Roman', 'Helvetica', 'Courier New', 'Verdana', 'Georgia'].forEach(f => {
      const opt = new Option(f, f);
      if (f === elem.fontFamily) opt.selected = true;
      fontFamilySelect.add(opt);
    });
    fontFamilySelect.onchange = () => { elem.fontFamily = fontFamilySelect.value; change(); };
    wrapper.appendChild(fontFamilyLabel);
    wrapper.appendChild(fontFamilySelect);

    const textAlignLabel = createLabel('Text Align:');
    const textAlignSelect = document.createElement('select');
    ['left', 'center', 'right'].forEach(a => {
      const opt = new Option(a, a);
      if (a === elem.textAlign) opt.selected = true;
      textAlignSelect.add(opt);
    });
    textAlignSelect.onchange = () => { elem.textAlign = textAlignSelect.value; change(); };
    wrapper.appendChild(textAlignLabel);
    wrapper.appendChild(textAlignSelect);

    const positionControls = document.createElement('div');
    positionControls.style.display = 'flex';
    positionControls.style.gap = '8px';
    positionControls.style.marginTop = '8px';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.textContent = 'Move Up';
    moveUpBtn.onclick = () => {
      elem.y = (elem.y || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement('button');
    moveDownBtn.textContent = 'Move Down';
    moveDownBtn.onclick = () => {
      elem.y = (elem.y || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveDownBtn);

    const moveLeftBtn = document.createElement('button');
    moveLeftBtn.textContent = 'Move Left';
    moveLeftBtn.onclick = () => {
      elem.x = (elem.x || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveLeftBtn);

    const moveRightBtn = document.createElement('button');
    moveRightBtn.textContent = 'Move Right';
    moveRightBtn.onclick = () => {
      elem.x = (elem.x || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveRightBtn);

    const colorLabel = createLabel('Text color:');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = elem.color || '#000000';
    colorInput.onchange = () => {
      elem.color = colorInput.value;
      updateEditPanel();
      change();
    };
    wrapper.appendChild(fontSizeControls);
    wrapper.appendChild(colorLabel);
    wrapper.appendChild(colorInput);
    wrapper.appendChild(positionControls);
  } else if (elem.type === 'image') {
    const src = document.createElement('input');
    src.placeholder = 'Image URL';
    src.value = elem.src || '';
    src.onchange = () => { elem.src = src.value; change(); };
    wrapper.appendChild(src);

    const alt = document.createElement('input');
    alt.placeholder = 'Alt text';
    alt.value = elem.alt || '';
    alt.onchange = () => { elem.alt = alt.value; change(); };
    wrapper.appendChild(alt);

    const sizeControls = document.createElement('div');
    sizeControls.style.display = 'flex';
    sizeControls.style.gap = '8px';
    sizeControls.style.marginTop = '8px';

    const increaseSizeBtn = document.createElement('button');
    increaseSizeBtn.textContent = 'Increase Size';
    increaseSizeBtn.onclick = () => {
      const currentWidth = elem.width === 'auto' ? 200 : parseInt(elem.width);
      const currentHeight = elem.height === 'auto' ? 200 : parseInt(elem.height);
      elem.width = `${currentWidth + 10}px`;
      elem.height = `${currentHeight + 10}px`;
      updateEditPanel();
      change();
    };
    sizeControls.appendChild(increaseSizeBtn);

    const decreaseSizeBtn = document.createElement('button');
    decreaseSizeBtn.textContent = 'Decrease Size';
    decreaseSizeBtn.onclick = () => {
      const currentWidth = elem.width === 'auto' ? 200 : parseInt(elem.width);
      const currentHeight = elem.height === 'auto' ? 200 : parseInt(elem.height);
      if (currentWidth > 50 && currentHeight > 50) {
        elem.width = `${currentWidth - 10}px`;
        elem.height = `${currentHeight - 10}px`;
        updateEditPanel();
        change();
      }
    };
    sizeControls.appendChild(decreaseSizeBtn);

    const positionControls = document.createElement('div');
    positionControls.style.display = 'flex';
    positionControls.style.gap = '8px';
    positionControls.style.marginTop = '8px';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.textContent = 'Move Up';
    moveUpBtn.onclick = () => {
      elem.y = (elem.y || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement('button');
    moveDownBtn.textContent = 'Move Down';
    moveDownBtn.onclick = () => {
      elem.y = (elem.y || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveDownBtn);

    const moveLeftBtn = document.createElement('button');
    moveLeftBtn.textContent = 'Move Left';
    moveLeftBtn.onclick = () => {
      elem.x = (elem.x || 0) - 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveLeftBtn);

    const moveRightBtn = document.createElement('button');
    moveRightBtn.textContent = 'Move Right';
    moveRightBtn.onclick = () => {
      elem.x = (elem.x || 0) + 10;
      updateEditPanel();
      change();
    };
    positionControls.appendChild(moveRightBtn);

    wrapper.appendChild(sizeControls);
    wrapper.appendChild(positionControls);
  } else if (elem.type === 'video') {
    const vsrc = document.createElement('input');
    vsrc.placeholder = 'Video URL';
    vsrc.value = elem.src || '';
    vsrc.onchange = () => { elem.src = vsrc.value; change(); };
    const ctrl = document.createElement('input');
    ctrl.type = 'checkbox';
    ctrl.checked = !!elem.controls;
    ctrl.onchange = () => { elem.controls = ctrl.checked; change(); };
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
    iframe.srcdoc = '';
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
    if (newVal !== null) {
      slide.elements[elemIdx].items[itemIdx] = newVal;
      updateEditPanel();
      updatePreview(true);
      saveState();
    }
  } else if (slide.elements[elemIdx]) {
    const elem = slide.elements[elemIdx];
    if (['title', 'subtitle', 'text'].includes(elem.type)) {
      const newVal = prompt('Edit text:', elem.text);
      if (newVal !== null) {
        elem.text = newVal;
        updateEditPanel();
        updatePreview(true);
        saveState();
      }
    } else if (elem.type === 'image') {
      const newVal = prompt('Edit image URL:', elem.src);
      if (newVal !== null) {
        elem.src = newVal;
        updateEditPanel();
        updatePreview(true);
        saveState();
      }
    } else if (elem.type === 'video') {
      const newVal = prompt('Edit video URL:', elem.src);
      if (newVal !== null) {
        elem.src = newVal;
        updateEditPanel();
        updatePreview(true);
        saveState();
      }
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
    .reveal .slides img { max-width: 80%; height: auto; display: block; margin: 0.6em 0; }
    .reveal .slides video { max-width: 90%; display: block; margin: 0.6em 0; }
    .reveal .slides h1, .reveal .slides h2, .reveal .slides p, .reveal .slides ul { text-transform: none !important; }
    ${data.slides.map((slide, sIndex) => slide.elements.map((elem, eIndex) => {
      let styles = '';
      if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
        if (elem.fontSize) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            font-size: ${escapeHtml(elem.fontSize)} !important;
          }`;
        }
        if (elem.color) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            color: ${escapeHtml(elem.color)} !important;
          }`;
        }
        if (elem.fontFamily) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            font-family: ${escapeHtml(elem.fontFamily)} !important;
          }`;
        }
        if (elem.textAlign) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            text-align: ${escapeHtml(elem.textAlign)} !important;
          }`;
        }
        if (elem.x !== undefined || elem.y !== undefined) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            transform: translate(${elem.x || 0}px, ${elem.y || 0}px) !important;
            position: relative !important;
          }`;
        }
      } else if (elem.type === 'image') {
        if (elem.width && elem.width !== 'auto') {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            width: ${escapeHtml(elem.width)} !important;
          }`;
        }
        if (elem.height && elem.height !== 'auto') {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            height: ${escapeHtml(elem.height)} !important;
          }`;
        }
        if (elem.x !== undefined || elem.y !== undefined) {
          styles += `.reveal .slides section:nth-child(${sIndex + 1}) [data-elem="${eIndex}"] {
            transform: translate(${elem.x || 0}px, ${elem.y || 0}px) !important;
            position: relative !important;
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
      if (!parsed.global) parsed.global = data.global;
      if (!Array.isArray(parsed.slides)) parsed.slides = [];
      // Strip background and set defaults for elements
      parsed.slides = parsed.slides.map(({ background, ...rest }) => {
        rest.elements = (rest.elements || []).map(elem => {
          if (['title', 'subtitle', 'text', 'bullets'].includes(elem.type)) {
            return {
              ...elem,
              fontFamily: elem.fontFamily || 'Arial',
              textAlign: elem.textAlign || 'left',
              x: elem.x || 0,
              y: elem.y || 0
            };
          } else if (elem.type === 'image') {
            return {
              ...elem,
              width: elem.width || 'auto',
              height: elem.height || 'auto',
              x: elem.x || 0,
              y: elem.y || 0
            };
          }
          return elem;
        });
        return rest;
      });
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