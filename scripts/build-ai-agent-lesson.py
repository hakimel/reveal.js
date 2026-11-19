# -*- coding: utf-8 -*-
"""Build the offline beginner course from its single lesson/configuration source.
Run from the repository root: python3 scripts/build-ai-agent-lesson.py
The earlier slide deck is kept separately as AI_agent_presentation.html.
"""
import json
from ai_agent_fonts import asset_font_style
import re
from pathlib import Path

SOURCE = Path('assets/ai-agent/lessons.json')
lessons = json.loads(SOURCE.read_text())
known = {'workflow','framework','patterns','validation','rag','approval','planning',
         'handoff','verification','observability','protocol','context','memory',
         'migration','computer','queue','locality','security'}
ids = [lesson['id'] for lesson in lessons]
assert len(ids) == len(set(ids)), 'Lesson IDs must be unique'
for lesson in lessons:
    assert all(key in lesson for key in ['title','phase','term','summary','objective','detail','rule','theme','demo','quiz'])
    assert all(k in lesson['demo'] for k in ['prediction','mission','fields']), 'Add prediction, mission and fields to each demo'
    assert len(lesson['quiz'].get('feedbackByChoice',[])) == len(lesson['quiz']['choices']), 'Supply feedback for each quiz choice'
    assert lesson['demo']['type'] in known, 'Use an existing demo type or register a new simulator'
    assert 0 <= lesson['quiz']['correct'] < len(lesson['quiz']['choices'])
    assert all(re.fullmatch(r'#[0-9a-fA-F]{6}', lesson['theme'][k]) for k in ['accent','glow','soft'])
    assert len({f['id'] for f in lesson['demo']['fields']}) == len(lesson['demo']['fields'])
font_style = asset_font_style()
payload = json.dumps({'version':1,'lessons':lessons},ensure_ascii=False).replace('<','\\u003c')
page = '''<!doctype html>
<html lang="ug" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101725"><title>ئاگېنت قۇرۇش · ئۆزئارا تەسىرلىك ئۇيغۇرچە دەرسلىك</title><meta name="description" content="18 دەرس ئارقىلىق سۈنئىي ئەقىل ئاگېنتىنى چۈشىنىڭ. تورسىز تەجرىبە، سەۋەبلىك جاۋاب ۋە ساقلىنىدىغان ئۆگىنىش تەرەققىياتى.">__LOCAL_FONT__<link rel="stylesheet" href="css/ai-agent/learning.css"><link rel="stylesheet" href="css/ai-agent/design-tokens.css"><script src="js/ai-agent-icons.js" defer></script><script src="js/ai-agent-demos.js" defer></script><script src="js/ai-agent-extensions.js" defer></script><script src="js/ai-agent-progress.js" defer></script><script src="js/ai-agent-learning.js" defer></script><script src="js/ai-agent-promo-effects.js" defer></script></head>
<body><a href="#mainContent" class="skip-link">دەرس مەزمۇنىغا ئۆتۈش</a>
<div class="ambient" aria-hidden="true"><div class="ambient-glow glow-one"></div><div class="ambient-glow glow-two"></div><div class="ambient-points"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="ambient-line"></div></div>
<header class="app-header"><button class="brand" id="homeButton" aria-label="باش بەتكە قايتىش"><span class="brand-mark" aria-hidden="true">◈</span><span>ئاگېنت تەجرىبىخانىسى<small dir="ltr">AI AGENT / LAB</small></span></button><div class="header-note"><span class="connection-dot" aria-hidden="true"></span>تورسىز ئۆگىنىش · ساختا سانلىق مەلۇمات</div><div class="header-actions"><button id="motionButton" aria-pressed="false">ھەرىكەتنى توختىتىش</button><button id="mobileMenuButton" aria-label="دەرس تىزىملىكىنى ئېچىش" aria-haspopup="dialog" aria-controls="mobileToc">دەرس تىزىملىكى <span aria-hidden="true">☰</span></button></div></header>
<div class="app-layout"><aside class="sidebar" aria-label="دەرس يول باشلاش"><div class="sidebar-heading"><span>ئۆگىنىش يولىڭىز</span><span id="desktopProgress" dir="ltr">0 / 18</span></div><div class="overall-progress" role="progressbar" aria-label="تاماملانغان دەرسلەر" aria-valuemin="0" aria-valuemax="18" aria-valuenow="0"><span></span></div><button class="progress-tools-button" data-open-progress>ساقلاش، يۈكلەش ۋە تەرەققىيات</button><nav class="lesson-list" id="desktopLessons" aria-label="دەرس تىزىملىكى"></nav><p class="sidebar-note">ھەر دەرسنى ئوقۇڭ، تەجرىبىنى سىناڭ، ئاندىن جاۋابنىڭ سەۋەبىنى تەكشۈرۈڭ.</p></aside><main id="mainContent" tabindex="-1"><div id="storageNotice" role="status" hidden></div><div id="pageContent"></div></main></div>
<footer id="lessonFooter" hidden><button id="previousButton" class="nav-button">→ ئالدىنقى دەرس</button><button id="completeButton" aria-describedby="completionCriteria" class="complete-button">دەرس تاماملاندى ✓</button><button id="nextButton" class="nav-button next-button">كېيىنكى دەرس ←</button></footer>
<dialog id="mobileToc" aria-labelledby="mobileTocTitle"><div class="dialog-heading"><h2 id="mobileTocTitle">دەرس تىزىملىكى</h2><button id="closeMenuButton" aria-label="دەرس تىزىملىكىنى تاقاش">×</button></div><p class="mobile-progress" id="mobileProgress"></p><button class="progress-tools-button" data-open-progress>تەرەققىياتنى ساقلاش / يۈكلەش</button><nav class="lesson-list" id="mobileLessons" aria-label="تېلېفوندىكى دەرس تىزىملىكى"></nav></dialog><dialog id="progressDialog" aria-labelledby="progressTitle"><div class="dialog-heading"><h2 id="progressTitle">ئۆگىنىش تەرەققىياتى</h2><button data-close-progress aria-label="تاقاش">×</button></div><div id="progressSummary"></div><p class="progress-explanation">ئوقۇلغان، مەشىق قىلىنغان ۋە سوئالى تەكشۈرۈلگەن دەرسلەر ئايرىم ساقلىنىدۇ. تاماملاش ئۈچۈن تەجرىبىنى سىناپ، تەكشۈرۈش سوئالىغا توغرا جاۋاب بېرىڭ.</p><div class="progress-actions"><button class="primary-button" id="exportProgress">تەرەققىياتنى چۈشۈرۈش</button><label class="secondary-button import-progress-label">ساقلانغان تەرەققىياتنى يۈكلەش<input id="importProgress" type="file" accept=".json,application/json"></label><button class="text-button" id="askResetProgress">تەرەققىياتنى تازىلاش</button></div><div id="resetProgressConfirm" hidden><p>بۇ توركۆرگۈچتىكى دەرس تەرەققىياتى تازىلىنىدۇ. ئالدى بىلەن چۈشۈرۈپ ساقلىۋېلىشقا بولىدۇ.</p><button class="secondary-button" id="cancelResetProgress">قايتىش</button><button class="primary-button" id="confirmResetProgress">تازىلاشنى جەزملەشتۈرۈش</button></div><p id="progressMessage" role="status"></p></dialog><p class="sr-only" id="routeAnnouncement" aria-live="polite"></p><div id="toast" role="status" hidden></div>
<script type="application/json" id="courseData">__COURSE_DATA__</script>
<noscript><p class="no-script">بۇ تورسىز تەجرىبىلەر ئۈچۈن توركۆرگۈچتە JavaScript قوزغىتىلغان بولۇشى كېرەك. تور ئۇلىنىشى ياكى API ئاچقۇچى تەلەپ قىلىنمايدۇ.</p></noscript>
</body></html>'''
page = page.replace('__LOCAL_FONT__', font_style).replace('__COURSE_DATA__', payload)
Path('AI_agent_lesson.html').write_text(page)
print('Built offline interactive course:',len(lessons),'lessons; no network fetch required.')
