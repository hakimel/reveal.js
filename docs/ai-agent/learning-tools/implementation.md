# Learning improvements

Five additions extend the Deep Sea Institute course without changing the 18-lesson order, original decision rules or compact typography.

- The first-visit guide explains reading, simulation and assessment in three short steps. It can be dismissed, resumes its current step, and can be reopened from the header.
- Every lesson has three authored Uyghur hints in `learningSupport.hints` in `assets/ai-agent/lessons.json`. The pearl reveals one at a time. Revealed hints survive reload and progress export/import within the existing account scope.
- The prominent continue card identifies the next unfinished practice, question or completion action, then the next unfinished lesson. It also resumes an unfinished final mission.
- A four-stage final mission combines calculation, exact source comparison, untrusted-document handling, explicit approval and result verification. The default timeout scenario fails before writing and permits one bounded retry using the same operation ID. A direct-success scenario requires read-back. Missing information, failed validation, denial and completion remain distinct. Simulated receipts prevent duplicate writes. Mission progress and downloadable results are separate from the 18-lesson completion count.
- Focus mode dims the agent and ambient light, pauses decorative motion, and emphasizes reading panels. It has its own saved preference and does not change the motion-button setting or disable practice.

The mission is deterministic and offline. It does not call a model, read private data, use a microphone or modify real files/services. Its local draft, hints, tour and focus preference use the existing scoped progress store. Progress is browser-local; there is no new cloud sync.

## Files and checks

`js/ai-agent-learning-tools.js` owns the new UI. `js/ai-agent-mission.js` owns mission validation and simulation; `css/ai-agent/learning-tools.css` supplies the responsive styling. The existing course builder loads these assets locally.

105 dedicated unit assertions cover mission gates, both recovery scenarios, duplicate prevention, import normalization, legacy defaults and account scoping. The new browser suite covers the guide, hints, resume targets, focus persistence, mission branches/export and 36 combinations of new-page layouts across six viewports and two reading modes. Existing offline lesson, interaction/progress, editorial layout and authentication suites also pass. Desktop and phone screenshots were reviewed for Uyghur shaping, mixed-script direction and clipping.

Automated tests use synthetic authentication responses, not a real Google login. Screen-reader use and learning outcomes have not been measured with users.
