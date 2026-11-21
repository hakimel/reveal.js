/* 8-Bit Orbit vertical navigation, extended for RTL lessons and accessible controls. */
(() => {
  'use strict';
  const $ = (q) => document.querySelector(q);
  const slides = [...document.querySelectorAll('.slide')];
  const container = $('#slidesContainer');
  const dialogs = [...document.querySelectorAll('dialog')];
  let current = 0, reading = false;
  let route = slides.map((_, i) => i);
  let routeName = 'all';
  let motionPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let toastTimer;
  function toast(text) {
    clearTimeout(toastTimer); $('#toast').textContent = text; $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2400);
  }
  function updateHash() { history.replaceState(null, '', '#slide-' + (current + 1)); }
  function updateUI() {
    // Fragment navigation must not add native scroll to the translated stage.
    $('#deck').scrollTop = 0;
    $('#deck').scrollLeft = 0;
    const position = route.indexOf(current);
    container.style.transform = `translateY(-${position * 100}%)`;
    slides.forEach((slide, i) => {
      slide.hidden = !route.includes(i);
      slide.classList.toggle('active', i === current);
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    $('#slideCounter').textContent = `${String(position + 1).padStart(2, '0')} / ${route.length}`;
    $('#currentTitle').textContent = slides[current].dataset.title;
    const routeLabel = routeName === 'all' ? 'سۈنئىي ئەقىل ئاگېنتى قۇرۇش' : routeName === 'overview' ? 'قىسقا ئومۇمىي تونۇشتۇرۇش' : 'ئەمەلىي دەرس ' + routeName.split('-')[1] + ' / 5';
    document.querySelector('.header-context').textContent = routeLabel;
    $('#workshopToggle').textContent = routeName === 'all' ? 'ئەمەلىي دەرسلەر' : routeName === 'overview' ? 'قىسقا تونۇشتۇرۇش' : 'دەرس ' + routeName.split('-')[1];
    $('#progressBar').style.width = `${((position + 1) / route.length) * 100}%`;
    $('#prevSlide').disabled = position === 0;
    $('#nextSlide').disabled = position === route.length - 1;
    document.querySelectorAll('[data-goto]').forEach(b => b.setAttribute('aria-current', String(Number(b.dataset.goto) === current)));
    if ($('#notesDialog').open) $('#notesContent').innerHTML = slides[current].querySelector('.speaker-notes').innerHTML;
    updateHash();
  }
  function goToSlide(index) {
    if (!Number.isFinite(index)) return;
    const previous = current;
    current = Math.max(0, Math.min(slides.length - 1, index));
    if (previous !== current) slides[current].scrollTop = 0;
    if (!route.includes(current)) { routeName = 'all'; route = slides.map((_, i) => i); }
    updateUI();
  }
  function moveSlide(delta) {
    const position = route.indexOf(current);
    goToSlide(route[Math.max(0, Math.min(route.length - 1, position + delta))]);
  }
  function setRoute(name) {
    const pick = (selector) => slides.map((s, i) => s.matches(selector) ? i : -1).filter(i => i >= 0);
    const lesson = (first, last) => slides.map((s, i) => {
      const n = Number(s.dataset.lesson); return n >= first && n <= last ? i : -1;
    }).filter(i => i >= 0);
    const common = pick('.loop-slide');
    const checkpoint = (n) => pick('.checkpoint-slide.workshop-' + n);
    const paths = {
      all: slides.map((_, i) => i),
      overview: pick('.cover,.goal-slide,.map-slide,.loop-slide,.architecture-slide,[data-lesson="1"],[data-lesson="4"],[data-lesson="6"],[data-lesson="10"],[data-lesson="18"],.demo-slide,.capstone-slide,.closing-slide'),
      'workshop-1': [...pick('.cover,.goal-slide,.map-slide,.loop-slide,.architecture-slide'), ...lesson(1,3), ...pick('.comparison-slide').slice(0,1), ...pick('.lab-slide'), ...checkpoint(1)],
      'workshop-2': [...common, ...lesson(4,4), ...pick('.failure-slide'), ...lesson(5,5), ...pick('.evidence-slide'), ...lesson(6,6), ...pick('.demo-slide'), ...checkpoint(2)],
      'workshop-3': [...common, ...lesson(7,9), ...pick('.tradeoff-slide'), ...checkpoint(3)],
      'workshop-4': [...common, ...lesson(10,12), ...pick('.context-slide'), ...lesson(13,14), ...pick('.comparison-slide').slice(1), ...checkpoint(4)],
      'workshop-5': [...common, ...lesson(15,18), ...pick('.injection-slide,.exercise-slide,.capstone-slide'), ...checkpoint(5), ...pick('.closing-slide')]
    };
    if (!paths[name]) return;
    routeName = name; route = [...new Set(paths[name])];
    if (reading) setReading(false);
    dialogs.forEach(d => { if (d.open) d.close(); });
    goToSlide(route[0]);
    document.dispatchEvent(new CustomEvent('lesson:route', { detail: {name: routeName, count: route.length} }));
  }
  function openDialog(dialog) {
    dialogs.forEach(d => { if (d.open && d !== dialog) d.close(); });
    if (!dialog.open) dialog.showModal();
    if (dialog.id === 'lessonMenu') $('#menuToggle').setAttribute('aria-expanded', 'true');
    document.dispatchEvent(new CustomEvent('lesson:dialog'));
  }
  function showNotes() {
    $('#notesContent').innerHTML = slides[current].querySelector('.speaker-notes').innerHTML;
    openDialog($('#notesDialog'));
  }
  function setReading(value) {
    reading = value;
    document.body.classList.toggle('reading', value);
    $('#readerView').hidden = !value;
    $('#readerToggle').setAttribute('aria-pressed', String(value));
    $('#readerToggle').textContent = value ? 'كۆرسىتىش ھالىتى' : 'ئوقۇش ھالىتى';
    if (value) {
      const lesson = slides[current].dataset.lesson;
      window.scrollTo(0, 0);
      if (lesson) $('#read-' + lesson).scrollIntoView();
    } else window.scrollTo(0, 0);
  }
  function updateMotion() {
    document.body.classList.toggle('motion-paused', motionPaused);
    $('#motionToggle').setAttribute('aria-pressed', String(motionPaused));
    $('#motionToggle').textContent = motionPaused ? 'ھەرىكەتنى قوزغىتىش' : 'ھەرىكەتنى توختىتىش';
  }
  $('#nextSlide').addEventListener('click', () => moveSlide(1));
  $('#prevSlide').addEventListener('click', () => moveSlide(-1));
  $('#menuToggle').addEventListener('click', () => openDialog($('#lessonMenu')));
  $('#readerToggle').addEventListener('click', () => setReading(!reading));
  $('#notesToggle').addEventListener('click', showNotes);
  $('#motionToggle').addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
  $('#fullscreenToggle').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { toast('توركۆرگۈچ تولۇق ئېكرانغا ئۆتۈشكە يول قويمىدى.'); }
  });
  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close-dialog]');
    if (close) close.closest('dialog').close();
    const next = event.target.closest('[data-next]');
    if (next) moveSlide(1);
    const note = event.target.closest('[data-notes]');
    if (note) showNotes();
    const jump = event.target.closest('[data-goto], [data-jump-lesson]');
    if (jump) {
      const index = jump.hasAttribute('data-goto') ? Number(jump.dataset.goto) : slides.findIndex(s => s.dataset.lesson === jump.dataset.jumpLesson);
      if (reading) setReading(false);
      dialogs.forEach(d => { if (d.open) d.close(); });
      goToSlide(index);
    }
    if (event.target.closest('[data-open-code]')) openDialog($('#codeDialog'));
  });
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => { if (dialog.id === 'lessonMenu') $('#menuToggle').setAttribute('aria-expanded', 'false'); });
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
    });
  });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (dialogs.some(d => d.open)) return;
    if (['BUTTON', 'A', 'SUMMARY'].includes(e.target.tagName) && [' ', 'Enter'].includes(e.key)) return;
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); setReading(!reading); return; }
    if (e.key.toLowerCase() === 'm') { e.preventDefault(); openDialog($('#lessonMenu')); return; }
    if (reading) return;
    if (['ArrowDown','ArrowUp',' '].includes(e.key)) {
      const slide=slides[current], direction=e.key==='ArrowUp'||(e.key===' '&&e.shiftKey)?-1:1;
      const remaining=direction>0?slide.scrollHeight-slide.clientHeight-slide.scrollTop:slide.scrollTop;
      if(remaining>2){e.preventDefault();slide.scrollBy({top:direction*(e.key===' '?slide.clientHeight*.8:80),behavior:'instant'});return;}
    }
    if (e.key.toLowerCase() === 'n') { e.preventDefault(); showNotes(); }
    else if (['ArrowDown', 'ArrowLeft', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); moveSlide(1); }
    else if (['ArrowUp', 'ArrowRight', 'PageUp'].includes(e.key)) { e.preventDefault(); moveSlide(-1); }
    else if (e.key === 'Home') { e.preventDefault(); goToSlide(route[0]); }
    else if (e.key === 'End') { e.preventDefault(); goToSlide(route[route.length - 1]); }
  });
  // Native scrolling stays available on dense/mobile slides and within dialogs.
  let wheelLock = false;
  $('#deck').addEventListener('wheel', e => {
    if (reading || dialogs.some(d => d.open) || wheelLock || Math.abs(e.deltaY) < 15) return;
    const scrollable = slides[current];
    if (scrollable.scrollHeight > scrollable.clientHeight + 2) return;
    if (e.target.closest('pre,.table-wrap')) return;
    e.preventDefault(); wheelLock = true;
    moveSlide(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock = false; }, 700);
  }, { passive: false });
  let touchStart;
  $('#deck').addEventListener('touchstart', e => { touchStart = [e.touches[0].clientX, e.touches[0].clientY]; }, { passive: true });
  $('#deck').addEventListener('touchend', e => {
    if (!touchStart || e.target.closest('button,a,pre')) return;
    const dx = e.changedTouches[0].clientX - touchStart[0];
    const dy = e.changedTouches[0].clientY - touchStart[1];
    if (Math.abs(dx) > 75 && Math.abs(dx) > Math.abs(dy) * 1.5) moveSlide(dx > 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.parentElement.querySelector('pre').textContent); toast('بۇيرۇقلار كۆچۈرۈلدى.'); }
    catch { toast('كۆچۈرەلمىدى؛ كودنى تاللاپ قولدا كۆچۈرۈڭ.'); }
  }));
  // Deliberately deterministic: no model requests, credentials or file writes.
  let demoStep = 0;
  function trace(text, code) {
    const li = document.createElement('li');
    li.append(document.createTextNode(text));
    if (code) { const c = document.createElement('code'); c.dir = 'ltr'; c.style.display = 'block'; c.textContent = code; li.append(c); }
    $('#demoTrace').append(li);
  }
  function resetDemo() {
    demoStep = 0; $('#demoTrace').innerHTML = '<li class="trace-goal">نىشان: ۋاقىتنى ھېسابلاپ، پىلان خاتىرىسى ساقلاش.</li>';
    $('#demoStatus').textContent = 'تەييار'; $('#demoApproval').hidden = true;
    $('#demoNext').disabled = false; $('#demoNext').textContent = 'تەقلىدنى باشلاش ←';
  }
  $('#demoReset').addEventListener('click', resetDemo);
  $('#demoNext').addEventListener('click', () => {
    demoStep++;
    if (demoStep === 1) {
      trace('قورال تەلىپى تاللاندى؛ پارامېتىر تەكشۈرۈلدى.', 'safe_calculate({"expression": "18 * 45 / 60"})');
      $('#demoStatus').textContent = 'قورال چاقىرىقى'; $('#demoNext').textContent = 'نەتىجىنى كۆرۈش ←';
    } else if (demoStep === 2) {
      trace('ھېسابلاش نەتىجىسى: 13.5 سائەت.', '{"result": 13.5}');
      $('#demoStatus').textContent = 'دەلىل تەييار'; $('#demoNext').textContent = 'ساقلاش قەدىمى ←';
    } else if (demoStep === 3) {
      trace('ساقلاش تەلىپى ئىنسان تەستىقىنى كۈتمەكتە.', 'save_note({"title": "Study plan", "content": "13.5 hours"})');
      $('#demoStatus').textContent = 'تەستىق كۈتۈلمەكتە'; $('#demoApproval').hidden = false; $('#demoNext').disabled = true;
    }
  });
  document.querySelectorAll('[data-approve]').forEach(button => button.addEventListener('click', () => {
    const approved = button.dataset.approve === 'yes';
    trace(approved ? 'تەستىقلاندى: خاتىرە ساقلاش تەقلىد قىلىندى.' : 'رەت قىلىندى: ساقلاش مەشغۇلاتى ئىجرا قىلىنمىدى.', approved ? '{"status": "saved", "simulation": true}' : '{"status": "denied", "saved": false}');
    trace(approved ? 'ئاخىرقى جاۋاب: جەمئىي 13.5 سائەت. خاتىرە ساقلاش تەقلىد قىلىندى.' : 'ئاخىرقى جاۋاب: جەمئىي 13.5 سائەت. خاتىرە ساقلانمىدى.');
    $('#demoApproval').hidden = true; $('#demoStatus').textContent = 'تاماملاندى';
  }));
  window.addEventListener('hashchange', () => {
    const match = location.hash.match(/^#slide-(\d+)$/); if (match) goToSlide(Number(match[1]) - 1);
  });
  const initial = location.hash.match(/^#slide-(\d+)$/);
  window.agentLesson = { setRoute, goToSlide, openDialog, getCurrent: () => slides[current], getRoute: () => ({ name: routeName, count: route.length }) };
  updateMotion(); goToSlide(initial ? Number(initial[1]) - 1 : 0);
})();
