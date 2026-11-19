# Human screen-reader check — not yet performed

Use VoiceOver, NVDA or another screen reader with the browser you will use for teaching. Record browser, screen reader and date when completing this checklist. No human result is claimed in the automated reports.

- Start from the home page. Confirm that the course title, start/resume control, progress and contents have useful names.
- Use only Tab, Shift+Tab, Enter, Space and Escape. Confirm that focus remains visible and the fixed header/footer does not hide the focused control.
- Open a lesson through the contents. Confirm that the new lesson heading and current lesson are announced meaningfully without reading the entire page automatically.
- Read a paragraph containing Uyghur, an English term, a source ID and a numeric expression. Check reading order and punctuation.
- In prediction mode, confirm that the result is not announced before a prediction and run. Check the reason after a wrong prediction.
- Switch to free exploration. Type JSON slowly and quickly; confirm that partial-input errors are debounced rather than announced for every keystroke.
- Try permission waiting, denial, invalid input and success. Confirm that the state is understandable without color or animation.
- Pause motion, then use manual workflow steps. Repeat with the operating system's reduced-motion preference.
- Open and close the phone contents and progress dialog. Confirm that the dialog name is announced, focus is contained while open and Escape restores focus sensibly.
- Submit each type of quiz response: no choice, incorrect choice and correct choice. Confirm that feedback and the completion requirement are understandable.
- Export progress, cancel a reset, confirm a reset and import the saved file. Try an invalid import and confirm that the error is announced while existing progress remains intact.
- Close and reopen the page. Confirm that the saved lesson and progress are understandable.

If any item fails, record the lesson, exact control, expected announcement and actual announcement in `docs/ai-agent/`. Keep this checklist marked pending until a human has completed it.
