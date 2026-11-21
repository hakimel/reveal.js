# Live background adapted to Deep Sea Institute

Restored the earlier promo background's drifting gradient mesh and upward particles, recolored to the current mint, teal, dusk-violet and coral palette. The sea nettle, glass cards and current reading layout remain intact.

The background uses 80 small particles on desktop and 36 on phones. A shallow pointer response applies only on fine-pointer devices. All layers are decorative, ignore pointer events and stay behind content. Animation uses transform and opacity; no remote assets, services or microphone are used.

Motion pause and OS reduced motion stop the mesh, particles and pointer response. Focus mode dims and pauses the restored layers. Checks cover actual animation changes, pointer response, responsive particle counts, controls remaining clickable, a manual lesson step, pause, focus and reduced motion. The existing deep-sea suite also passed, and desktop/phone screenshots were reviewed.

Implementation: `setupAmbient`, `driftCurrent` and `resetCurrent` in `js/ai-agent-ocean.js`, plus the `ocean-current`, `ocean-aurora` and `ocean-motes` rules in `css/ai-agent/deep-sea.css`.
