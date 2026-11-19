"""Optional font maintenance: pip install 'fonttools[woff]' in a suitable environment.
Normal HTML builds need no font conversion dependency.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
import json

report=[]
for name in ['Bahij-Helvetica-Neue-Roman.ttf','alkatip-rukki.ttf']:
    source=Path('assets/fonts')/name
    original=TTFont(source)
    coverage=set(original.getBestCmap())
    destination=source.parent/'optimized'/(source.stem+'.woff2')
    destination.parent.mkdir(exist_ok=True)
    original.flavor='woff2'
    original.save(destination)
    assert coverage==set(TTFont(destination).getBestCmap())
    report.append({'source':str(source),'output':str(destination),
        'source_bytes':source.stat().st_size,'output_bytes':destination.stat().st_size,
        'all_unicode_codepoints_preserved':True})
Path('docs/ai-agent/font-optimization.json').write_text(json.dumps(report,indent=2)+'\n')
