# Deep Sea Institute interface

The course uses an asymmetric glass bento dashboard: a sea nettle inside a fisheye sphere, a clickable listening pearl, a depth progress panel, and staggered lesson cards. The palette falls from dusk violet into deep teal and abyss blue, with pearl text, mint actions and coral anatomy.

The new identity applies to the interactive lesson at `AI_agent_lesson.html` and the public root. The separate teacher presentation and printable workbook retain their teaching layouts.

## Visual implementation

- `js/ai-agent-ocean.js` creates a locally rendered SVG sea nettle, glass habitat, pearl and progress panels. No remote images, WebGL dependency, microphone, model call or API key is needed for the visual experience.
- `css/ai-agent/deep-sea.css` supplies the glass layers, depth shadows, perspective tilt, soft caustic light, pulsing bell, swaying tentacles, floating pearl and sequential card entrances.
- Existing local Bahij typography remains. Body and practice text stays 12px by default; lesson titles stay 13px. The existing optional comfort-reading mode remains available.
- The desktop bento uses a 12-column composition; the lesson introduction has a compact companion orb. Phone layouts stack the dashboard and reduce the lesson orb to a small status companion.

## Interaction

The pearl responds to mouse, touch or keyboard activation with translated text. Its listening state represents interface interaction; it does not record sound. The agent follows actual lesson state: awaiting a prediction, executing workflow steps, waiting for approval, completing a result or prompting the learner to review a blocked decision. Completion counts update the depth chart and remain scoped to the existing browser/account progress.

Reduced motion and the existing motion button stop the new ambient, biological, entrance and tilt effects. Feedback text, lesson controls and manual simulation steps remain usable. Hover tilt is limited to a fine pointer. Card text stays flat while the glass surface receives shallow perspective.

## Validation

The full lesson interaction, progress export/import and auth regression suites pass. The editorial suite checks 216 lesson layouts across six screen sizes and two reading modes. The dedicated ocean suite verifies home layouts at ten sizes, actual agent reactions, keyboard pearl feedback, saved depth progress, pointer tilt, motion pause and offline operation. Desktop and phone screenshots are reviewed visually.

`deep-sea.css` is loaded last. Keep theme/demo/content data in `assets/ai-agent/lessons.json`; the new design does not change lesson order, quiz revisions or simulation rules.
