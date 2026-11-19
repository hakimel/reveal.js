"""Static full-file audit: local resources, IDs, language, metadata and data completeness."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
import runpy

class Audit(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.refs=[];self.lang={};self.elements=Counter();self.external=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.elements[tag]+=1
        if tag=='html':self.lang={k:a.get(k) for k in ['lang','dir']}
        if 'id' in a:self.ids.append(a['id'])
        for name in ['src','href']:
            if name in a:
                ref=a[name];u=urlsplit(ref)
                if u.scheme in ('http','https'):self.external.append(ref)
                elif not u.scheme and u.path:self.refs.append(unquote(u.path))

root=Path.cwd();reports=[]
for name in ['AI_agent_lesson.html','AI_agent_presentation.html']:
    p=Path(name);a=Audit();a.feed(p.read_text())
    reports.append({'file':name,'bytes':p.stat().st_size,'language':a.lang,
        'duplicate_ids':[k for k,v in Counter(a.ids).items() if v>1],
        'missing_local_files':sorted(set(r for r in a.refs if not (p.parent/r).exists())),
        'external_links':len(set(a.external)),
        'remote_scripts':[r for r in a.external if r.endswith('.js')],
        'elements':dict(a.elements)})
lessons=json.loads(Path('assets/ai-agent/lessons.json').read_text())
coverage=runpy.run_path('scripts/check-ai-agent-fonts.py')['cmap']
required={ord(c) for c in json.dumps(lessons,ensure_ascii=False) if '\u0600'<=c<='\u06ff'}
fonts=[]
for p in Path('assets/fonts').iterdir():
    if p.suffix in ['.ttf','.otf']:
        fonts.append({'font':p.name,'missing_arabic_characters':''.join(chr(c) for c in sorted(required-coverage(p)))})
report={'documents':reports,'lesson_count':len(lessons),'lesson_order':[l['id'] for l in lessons],
    'complete_lessons':all(all(k in l for k in ['objective','theme','demo','quiz','detail','rule']) for l in lessons),
    'demo_types':[l['demo']['type'] for l in lessons],
    'font_coverage':fonts,'external_link_note':'Reference links counted, not fetched or asserted available.'}
Path('docs/ai-agent/html-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert all(not d['duplicate_ids'] and not d['missing_local_files'] for d in reports)
print(json.dumps({k:v for k,v in report.items() if k in ['documents','lesson_count','complete_lessons','font_coverage']},ensure_ascii=False,indent=2))
