"""Read Unicode cmap format 4/12 coverage directly; no third-party dependency."""
import json
import struct
from pathlib import Path


def cmap(font):
    data = font.read_bytes()
    u16 = lambda offset: struct.unpack_from('>H', data, offset)[0]
    u32 = lambda offset: struct.unpack_from('>I', data, offset)[0]
    start = None
    for i in range(u16(4)):
        row = 12 + 16 * i
        if data[row:row+4] == b'cmap':
            start = u32(row+8)
    if start is None:
        raise ValueError('No cmap table')
    result = set()
    for i in range(u16(start+2)):
        row = start + 4 + 8 * i
        platform, encoding, relative = struct.unpack_from('>HHI', data, row)
        if platform not in (0, 3):
            continue
        offset = start + relative
        format_id = u16(offset)
        if format_id == 12:
            for group in range(u32(offset+12)):
                a, b, glyph = struct.unpack_from('>III', data, offset+16+group*12)
                result.update(c for c in range(a,b+1) if glyph + c-a != 0)
        elif format_id == 4:
            count = u16(offset+6)//2
            ends = offset+14
            starts = ends + count*2 + 2
            deltas = starts + count*2
            ranges = deltas + count*2
            for seg in range(count):
                first, last = u16(starts+seg*2), u16(ends+seg*2)
                delta, distance = u16(deltas+seg*2), u16(ranges+seg*2)
                for char in range(first, last+1):
                    if char == 0xffff:
                        continue
                    if distance:
                        glyph = u16(ranges+seg*2+distance+(char-first)*2)
                        glyph = (glyph+delta)&0xffff if glyph else 0
                    else:
                        glyph = (char+delta)&0xffff
                    if glyph:
                        result.add(char)
    return result


if __name__ == '__main__':
    text = Path('assets/ai-agent/lessons.json').read_text() + Path('assets/ai-agent/workshops.json').read_text()
    required = {ord(c) for c in text if '\u0600' <= c <= '\u06ff'}
    report = []
    for name in ['Bahij-Helvetica-Neue-Roman.ttf','alkatip-rukki.ttf']:
        supported = cmap(Path('assets/fonts')/name)
        missing = ''.join(chr(c) for c in sorted(required-supported))
        report.append({'font':name,'required_arabic_codepoints':len(required),'missing':missing})
    path = Path('docs/ai-agent/font-coverage.json')
    path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(path.read_text())
    raise SystemExit(1 if any(row['missing'] for row in report) else 0)
