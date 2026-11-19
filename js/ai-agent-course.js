/* Classroom exercises. Only explicit learner responses/progress are stored locally. */
(() => {
  'use strict';
  const $ = (q) => document.querySelector(q);
  const key = 'agent-lab-course-v1';
  const workbook = document.body.classList.contains('workbook');
  const data = $('#lessonActivities');
  const lessons = data ? JSON.parse(data.textContent) : [];
  let saved = { answers: {}, completed: [], draft: {} };
  let persistence = true;
  try {
    const previous = JSON.parse(localStorage.getItem(key));
    if (previous && typeof previous === 'object') {
      saved.answers = previous.answers && typeof previous.answers === 'object' ? previous.answers : {};
      saved.completed = Array.isArray(previous.completed) ? previous.completed.filter(n => Number.isInteger(n) && n > 0 && n <= 18) : [];
      saved.draft = previous.draft && typeof previous.draft === 'object' ? previous.draft : {};
    }
  } catch { persistence = false; }
  const escape = (text) => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(saved)); }
    catch { persistence = false; }
    sync();
  }
  function sync() {
    document.querySelectorAll('[data-answer]').forEach(e => { if (e !== document.activeElement) e.value = saved.answers[e.dataset.answer] || ''; });
    document.querySelectorAll('[data-draft]').forEach(e => { if (e !== document.activeElement) e.value = saved.draft[e.dataset.draft] || ''; });
    document.querySelectorAll('[data-complete]').forEach(e => { e.checked = saved.completed.includes(Number(e.dataset.complete)); });
    if ($('#courseProgress')) $('#courseProgress').textContent = `${saved.completed.length} / 18`;
    document.querySelectorAll('.local-notice').forEach(e => {
      e.textContent = persistence ? 'جاۋاب ۋە بەلگىلەر پەقەت مۇشۇ توركۆرگۈچتە ساقلىنىدۇ؛ بۇ ئاپتوماتىك باھالاش ئەمەس.' : 'يەرلىك ساقلاش ئىشلىمەيۋاتىدۇ؛ جاۋابلىرىڭىزنى چۈشۈرۈپ ساقلاڭ. بۇ بەت يېپىلغاندا جاۋابلار يوقىلىشى مۇمكىن.';
    });
  }
  function openActivity(id) {
    const lesson = lessons.find(l => l.id === Number(id));
    if (!lesson) return;
    const a = lesson.activity;
    $('#activityContent').innerHTML = `<div class="activity-sheet"><span class="lab-tag">${String(lesson.id).padStart(2,'0')} / 18 · ${escape(lesson.title)}</span><h3>${escape(a.title)}</h3><p class="activity-question">${escape(a.question)}</p><label class="answer-label">جاۋابىڭىز<textarea data-answer="${lesson.id}" rows="4" placeholder="جاۋابىڭىز ۋە سىناق دەلىلىڭىز…"></textarea></label><details class="worked-answer"><summary>جاۋاب ۋە چۈشەندۈرۈشنى كۆرۈش</summary><p>${escape(a.answer)}</p></details><div class="acceptance"><strong>قوبۇل قىلىش شەرتى</strong><p>${escape(a.acceptance)}</p></div><label class="completion-check"><input type="checkbox" data-complete="${lesson.id}"> مەشىقنى ئىجرا قىلىپ، نەتىجىنى تەكشۈردۈم</label><p class="local-notice"></p></div>`;
    window.agentLesson.openDialog($('#activityDialog')); sync();
  }
  function openWorkshops(id) {
    window.agentLesson.openDialog($('#workshopDialog'));
    if (id) $('#workshop-' + id)?.scrollIntoView({ block: 'start' });
    else $('#workshopDialog').scrollTop = 0;
    sync();
  }
  if (!workbook) {
    $('#workshopToggle').addEventListener('click', () => openWorkshops());
    $('#practiceToggle').addEventListener('click', () => {
      const lesson = window.agentLesson.getCurrent().dataset.lesson;
      if (lesson) openActivity(lesson); else openWorkshops();
    });
    $('#exportCourse').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({version:1,...saved}, null, 2)], {type:'application/json;charset=utf-8'});
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = 'agent-lab-my-work.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    $('#clearCourse').addEventListener('click', () => {
      saved = {answers:{}, completed:[], draft:{}}; persist();
      document.querySelectorAll('[data-answer],[data-draft]').forEach(e => { e.value = ''; });
    });
  }
  document.addEventListener('click', event => {
    const activity = event.target.closest('[data-activity]');
    if (activity && !workbook) openActivity(activity.dataset.activity);
    const workshop = event.target.closest('[data-workshop]');
    if (workshop && !workbook) openWorkshops(workshop.dataset.workshop);
    const route = event.target.closest('[data-route]');
    if (route) {
      if (workbook) location.href = '../../AI_agent_lesson.html?course=' + encodeURIComponent(route.dataset.route);
      else window.agentLesson.setRoute(route.dataset.route);
    }
    if (event.target.closest('[data-open-capstone]') && !workbook) {
      openWorkshops(); const details = $('.capstone-details'); details.open = true; details.scrollIntoView({ block:'start' });
    }
  });
  document.addEventListener('input', event => {
    const e = event.target;
    if (e.matches('[data-answer]')) { saved.answers[e.dataset.answer] = e.value.slice(0,10000); persist(); }
    if (e.matches('[data-draft]')) { saved.draft[e.dataset.draft] = e.value.slice(0,10000); persist(); }
  });
  document.addEventListener('change', event => {
    const e = event.target;
    if (!e.matches('[data-complete]')) return;
    const id = Number(e.dataset.complete);
    saved.completed = saved.completed.filter(n => n !== id);
    if (e.checked) saved.completed.push(id);
    persist();
  });
  document.addEventListener('lesson:dialog', sync);
  sync();
  const initial = new URLSearchParams(location.search).get('course');
  if (initial && !workbook) window.agentLesson.setRoute(initial);
})();
