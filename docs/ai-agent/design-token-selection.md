# Course design token selection

Reviewed the user-provided files: 50 aesthetics, 20 palettes, 34 effects, 10 font pairings, and 5 layouts. CSV snippets are design references rather than build instructions.

- Style: Developer Docs for reading hierarchy, Enterprise Tech for experiment panels.
- Palette: Midnight Aurora — #0a0f1c background, #0d1529 surfaces, #e8f4fd primary text, #94a3b8 secondary text, #00d4ff interface accent, #1e2d4a borders. Per-lesson experiment colors remain in lessons.json.
- Layout: compact RTL sidebar and main column; split controls/results on desktop; stacked controls/results on phones. Dashboard and editorial patterns are adapted to a reading course.
- Type: local Bahij retained, with 16px lesson titles/icons and 13–14px reading text. The supplied remote font imports are not loaded.
- Effects: static dot grid only on the homepage illustration; existing short process reveals and real completion progress. Motion pause and reduced-motion settings remain available.

Selected source rows and independently calculated contrast ratios are saved in assets/ai-agent/design-system-selection.json. The palette's single supplied WCAG number is not treated as verification of all color pairs.

Edit css/ai-agent/design-tokens.css to change the overall palette. Edit assets/ai-agent/lessons.json for lesson-specific themes and demos. Rebuild the HTML with python3 scripts/build-ai-agent-lesson.py when changing its links or source content.

## Promo reference update

At the user's request, the live appearance now follows examples/skills-slides-promo.html: cyan #00d4ff and pink #ff2d78, navy #0a0f1c / #0d1529 / #111d3a, cyan translucent borders, gradient titles and buttons, glow shadows, background mesh and particles, entrance animations and desktop card tilt. The mesh animates transform and opacity. Particles are capped at 36 on phones and 80 on desktop.

The exact promo accent is used throughout the interface; result statuses keep their semantic colors. Local Bahij, 16px lesson titles/icons, 13–14px reading text, scrolling lessons, and existing exercises are retained. The supplied viewport base was reviewed as reference: its slide clipping, large headings and global wheel interception are not applied to the long reading lessons.

Effects live in js/ai-agent-promo-effects.js and css/ai-agent/design-tokens.css, linked by the lesson build script. Motion pause and system reduced motion apply to the new effects. All assets remain local.
