"""HTML fragments shared by the lesson deck and the printable workshop guide."""
from html import escape as E
from pathlib import Path
import json
import re
import zipfile
from ai_agent_fonts import asset_font_style


def U(value):
    """Keep Latin identifiers and numeric expressions LTR inside Uyghur prose."""
    parts=re.split(r'([A-Za-z][A-Za-z0-9_.:/-]*(?: [A-Za-z][A-Za-z0-9_.:/-]*)*|\d+(?:[.,]\d+)?(?:\s*[/×*+−–-]\s*\d+(?:[.,]\d+)?)*)',str(value))
    return ''.join('<bdi dir="ltr">'+E(part)+'</bdi>' if i%2 else E(part) for i,part in enumerate(parts))


def activity_html(lesson, editable=False):
    a = lesson['activity']
    n = lesson['id']
    field = '<label class="answer-label">جاۋابىڭىز<textarea data-answer="{}" rows="4" placeholder="ئۆز چۈشەندۈرۈشىڭىز ۋە سىناق نەتىجىسىنى يېزىڭ…"></textarea></label>'.format(n) if editable else ''
    return '<div class="activity-sheet"><span class="lab-tag">مەشىق · <bdi>{:02}</bdi></span><h3>{}</h3><p class="activity-question">{}</p>{}<details class="worked-answer"><summary>جاۋاب ۋە چۈشەندۈرۈشنى كۆرۈش</summary><p>{}</p></details><div class="acceptance"><strong>قوبۇل قىلىش شەرتى</strong><p>{}</p></div><label class="completion-check"><input type="checkbox" data-complete="{}"> مەشىقنى ئىجرا قىلىپ، نەتىجىنى تەكشۈردۈم</label></div>'.format(n,U(a['title']),U(a['question']),field,U(a['answer']),U(a['acceptance']),n)


def workshop_cards(workshops):
    parts=[]
    for w in workshops:
        agenda=''.join('<li><bdi>{}</bdi><span>{}</span></li>'.format(E(t),E(label)) for t,label in w['agenda'])
        parts.append('<article class="workshop-card" id="workshop-{}"><div class="workshop-number"><bdi>0{}</bdi><span>90 مىنۇتلۇق تەۋسىيە پىلانى · {}–{} دەرس</span></div><h3>{}</h3><p>{}</p><details><summary>ۋاقىت تەقسىماتى</summary><ol class="agenda">{}</ol></details><h4>بۇ قېتىم قوشۇلىدىغان ئىقتىدار</h4><p>{}</p><pre dir="ltr"><code>{}</code></pre><div class="acceptance"><strong>تاپشۇرۇلىدىغان دەلىل</strong><p>{}</p></div><button class="primary" data-route="workshop-{}">بۇ قېتىملىق دەرسنى باشلاش ←</button></article>'.format(w['id'],w['id'],*w['range'],U(w['title']),U(w['outcome']),agenda,U(w['increment']),E(w['command']),U(w['evidence']),w['id']))
    return ''.join(parts)


def capstone_html():
    return '''<div class="capstone-sheet"><h3>ئاخىرقى تۈر: دەلىلگە تايىنىدىغان ئۆگىنىش ياردەمچىسى</h3><p>ئىشلەتكۈچى دەرس سانى ۋە ھەر دەرسنىڭ ۋاقتىنى بېرىدۇ. ئاگېنت ئومۇمىي ۋاقىتنى قورال بىلەن ھېسابلايدۇ، مەنبە بار ئۇچۇرنىلا ئىشلىتىدۇ ۋە تەستىقتىن كېيىن پىلاننى ساقلايدۇ.</p><div class="rubric"><div><bdi>25</bdi><span>ھېسابلاش ۋە قورال توغرىلىقى</span></div><div><bdi>25</bdi><span>ئىجازەت، رەت قىلىش ۋە ئىزدەش دائىرىسى</span></div><div><bdi>20</bdi><span>مەنبە، ۋاقىت ۋە ئەستە ساقلاشنى ئۆچۈرۈش</span></div><div><bdi>20</bdi><span>خاتالىق، ۋاقىت چېكى ۋە تەكرار ئىجرا سىناقلىرى</span></div><div><bdi>10</bdi><span>چۈشەندۈرۈش ۋە قايتا ئىجرا قىلغىلى بولىدىغان كۆرسەتمە</span></div></div><p class="qualifier">بۇ دەرس ئۈچۈن تەۋسىيە قىلىنغان باھالاش: 100 دىن 80 نومۇر. تەستىقسىز يېزىش، ساختا مەنبە ياكى ئىجازەتسىز ئوقۇش بولسا، نومۇر يېتەرلىك بولسىمۇ ئالدى بىلەن تۈزىتىش كېرەك.</p><label class="answer-label">تۈر نىشانى<textarea rows="3" data-draft="goal" placeholder="ئاگېنتىم قايسى ۋەزىپىنى ھەل قىلىدۇ؟"></textarea></label><label class="answer-label">رۇخسەت قىلىنغان قوراللار<textarea rows="2" data-draft="tools" placeholder="قوراللار ۋە ئۇلارنىڭ ھوقۇق چېكى…"></textarea></label><label class="answer-label">قوبۇل قىلىش سىنىقى<textarea rows="3" data-draft="acceptance" placeholder="قايسى نەتىجە چىقسا ۋەزىپە تاماملاندى دەيمەن؟"></textarea></label></div>'''


def course_dialog(workshops):
    return '''<dialog id="workshopDialog"><div class="dialog-top"><h2>بەش باسقۇچلۇق ئەمەلىي دەرس</h2><button data-close-dialog aria-label="تاقاش">×</button></div><p>ھەر قېتىم بىر ئىقتىدار قوشۇڭ، ئىجرا قىلىڭ ۋە دەلىل بىلەن تەكشۈرۈڭ. ۋاقىت تەقسىماتىنى سىنىپ سەۋىيەسىگە قاراپ تەڭشەڭ.</p><div class="course-actions"><button class="secondary" data-route="all">بارلىق بەتلەر</button><button class="primary" data-route="overview">قىسقا ئومۇمىي تونۇشتۇرۇش</button><a class="secondary" href="assets/ai-agent/workshop-guide.html" target="_blank">مەشىق قوللانمىسى ↗</a><a class="secondary" href="assets/ai-agent/lab-package.zip" download>تولۇق تەجرىبە بولىقى ↓</a></div><div class="progress-summary" aria-live="polite">تەكشۈرۈلگەن مەشىقلەر: <output id="courseProgress">0 / 18</output></div><p class="local-notice">جاۋاب ۋە بەلگىلەر پەقەت مۇشۇ توركۆرگۈچتە ساقلىنىدۇ؛ بۇ ئاپتوماتىك باھالاش ئەمەس.</p>'''+workshop_cards(workshops)+'''<details class="capstone-details"><summary>ئاخىرقى تۈر ۋە باھالاش ئۆلچىمى</summary>'''+capstone_html()+'''</details><div class="course-actions"><button class="secondary" id="exportCourse">جاۋابلىرىمنى چۈشۈرۈش ↓</button><button class="secondary" id="clearCourse">يەرلىك جاۋابلارنى تازىلاش</button></div></dialog><dialog id="activityDialog"><div class="dialog-top"><h2>ئەمەلىي مەشىق</h2><button data-close-dialog aria-label="تاقاش">×</button></div><div id="activityContent"></div></dialog>'''


def build_workbook(lessons, workshops):
    chapters=[]
    for w in workshops:
        chapter=workshop_cards([w])
        for l in lessons:
            if w['range'][0] <= l['id'] <= w['range'][1]:
                chapter += '<article class="workbook-lesson"><h2><bdi>{:02}</bdi> · {}</h2><p>{}</p>{}</article>'.format(l['id'],U(l['title']),U(l['detail']),activity_html(l,True))
        chapters.append('<section class="workbook-workshop">'+chapter+'</section>')
    page='''<!doctype html><html lang="ug" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ئاگېنت تەجرىبىخانىسى · مەشىق قوللانمىسى</title><link rel="stylesheet" href="../../css/ai-agent/orbit-base.css"><link rel="stylesheet" href="../../css/ai-agent/lesson.css"><link rel="stylesheet" href="../../css/ai-agent/course.css"><link rel="stylesheet" href="../../css/ai-agent/rtl-reading.css"></head><body class="workbook"><main><header><span class="lab-tag">18 دەرس · 5 قېتىملىق ئەمەلىي دەرس</span><h1>قۇرۇش، سىناش ۋە دەلىللەش</h1><p>بۇ قوشۇمچە مەشىقلەر قايتا لايىھەلەنگەن دەرس ئۈچۈن تەييارلاندى. جاۋابلارنى قولىڭىز بىلەن سىناپ، نەتىجىنى خاتىرىلەڭ.</p><nav><a class="primary" href="../../AI_agent_lesson.html">دەرسكە قايتىش ←</a><a class="secondary" href="lab-package.zip" download>تەجرىبە بولىقى ↓</a><button class="secondary" onclick="window.print()">بېسىپ چىقىرىش</button></nav></header>'''+''.join(chapters)+capstone_html()+'''<footer><p>ئالدىنقى تەييارلىق: بولاقنى يېشىڭ، Python 3.10+ مەۋھۇم مۇھىتىنى قۇرۇڭ ۋە README_ug.md دىكى كۆرسەتمىنى ئوقۇڭ. سىناقلار مودېلسىز ئىجرا بولىدۇ؛ ھەقىقىي ئاگېنت ئۈچۈن ئايرىم مودېل ئىجرا مۇھىتى كېرەك.</p><p>بېسىش نۇسخىسىدا ئىشلىنىدىغان بوشلۇق قالدۇرۇلدى؛ جاۋاب كۆرسەتمىلىرى ئېكراندا ئېچىپ ئوقۇلىدۇ.</p></footer></main><script src="../../js/ai-agent-course.js"></script></body></html>'''
    page=page.replace('</head>',asset_font_style()+'</head>')
    Path('assets/ai-agent/workshop-guide.html').write_text(page)


def package_lab():
    names=['scratch_agent.py','test_lab.py','evaluate_lab.py','framework_agent.py','preflight.py','requirements.txt','requirements-framework.txt','README_ug.md','job_queue.py','sample_handoff.json','context_example.json','untrusted_fixture.txt','live_check.py']
    root=Path('assets/ai-agent')
    with zipfile.ZipFile(root/'lab-package.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
        for name in names:
            p=root/name
            if p.exists(): z.write(p,arcname='agent-lab/'+name)
