"""Shared, dependency-free asset font embedding for every HTML output."""
import base64
from pathlib import Path

FONTS = [('Bahij', 'Bahij-Helvetica-Neue-Roman'), ('Alkatip', 'alkatip-rukki')]

def asset_font_style():
    faces=[]
    for family, stem in FONTS:
        candidate=Path('assets/fonts/optimized')/(stem+'.woff2')
        kind='woff2'
        if not candidate.exists():
            candidate=Path('assets/fonts')/(stem+'.ttf');kind='truetype'
        mime='font/woff2' if kind=='woff2' else 'font/ttf'
        data=base64.b64encode(candidate.read_bytes()).decode('ascii')
        faces.append('@font-face{font-family:'+family+';src:url(data:'+mime+';base64,'+data+") format('"+kind+"');font-display:swap}")
    return '<style id="assetFonts">'+''.join(faces)+'</style>'
