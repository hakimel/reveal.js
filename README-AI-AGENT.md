# AI Agent — ئۇيغۇرچە دەرسلىك

18 interactive Uyghur lessons with simulated offline experiments.

Open `AI_agent_lesson.html` directly in a browser, or serve the repository with `npm run start`. Local scripts, CSS and embedded Uyghur fonts are included.

- Main course: `AI_agent_lesson.html`
- Teacher slides: `AI_agent_presentation.html`
- Workbook: `output/pdf/ai-agent-workbook.pdf`
- Lesson content, theme and demo settings: `assets/ai-agent/lessons.json`
- Build: `python3 scripts/build-ai-agent-lesson.py`
- Simulation checks: `node scripts/test-ai-agent-demos.mjs` and `node scripts/test-ai-agent-recommendations.mjs`

The `gh-pages` branch contains the standalone website. Configure GitHub Pages to deploy from that branch and `/ (root)`.

Exercises use synthetic data. No API key is required. Learning progress is stored only in each visitor’s browser.
