# Improvements following the learner review

The review identifies useful learning and accessibility problems. Its score is subjective; the implementation addresses the five concrete issues rather than claiming a new rating.

| Finding | Change |
| --- | --- |
| Answers could be guessed from implausible distractors | Replaced all 18 quizzes with scenarios requiring a decision. Distractors reflect partial but inadequate strategies, with a specific explanation for every option. |
| Later topics need more beginner support | Added a plain-language bridge, earlier-lesson links, a small bilingual glossary and a labeled worked example to every lesson. The home page explains the foundation, application and extension stages. |
| Platform examples dominate general concepts | Generalized required framework/search explanations. Preserved original Microsoft examples in optional details and separated platform references in the teaching deck. |
| Some Uyghur letters appear disconnected | Removed inherited letter-spacing from Arabic-script text, retained contextual ligatures, supplied the local Bahij font for mixed-script labels and kept code/LTR identifiers isolated. |
| Small screens hide content | Header/footer heights now follow actual wrapped content. Controls and quiz labels wrap. Long native select labels have a full-text helper. Dense slides scroll with touch, wheel and keyboard. |

Compact typography, colors, decorative motion, reduced-motion behavior, local simulations and Google authentication remain available. An optional comfort-reading setting enlarges explanatory text without changing the default compact layout.

Question revision 2 prevents old answers from being silently applied to different questions. Reading/practice history remains; a local backup preserves the previous progress file. Revised questions must be answered again before completion. Progress is still scoped per account and local to the browser; this change does not add cloud progress sync.

## Validation

- 145 simulator assertions and 202 content/progress assertions passed.
- All 18 lessons: demos, per-choice feedback, completion, offline opening, keyboard operation, reduced motion and resume.
- 216 lesson layouts: 18 lessons × 6 viewports × 2 reading modes, including 320px phones and short landscape.
- 84 additional slide layouts: all 42 companion slides at 320×568 and 844×390; keyboard scrolling verified.
- Existing 42-slide presentation suite passed at four screen sizes.
- Google PKCE/session restoration and account-isolation regression checks passed using synthetic responses and the bundled SDK. No real Google login or emails were sent by automated tests.
- Phone screenshot reviewed visually. Workbook regenerated and all 26 PDF pages reviewed as contact sheets, with a full-size text sample checked.

Automated layout checks do not replace user testing with an actual phone or a screen reader. The new distractors should be evaluated with learners to establish their difficulty; no measured learning-outcome claim is made.

## Maintenance

Lesson content, quiz revisions, themes, demo settings and learning support are in `assets/ai-agent/lessons.json`. Run the two build scripts after changes. Bump a question's `quiz.revision` when its meaning or choices change. `css/ai-agent/rtl-reading.css` handles shared script shaping; `polish.css` handles the course refinements.
