# Vue Wrapper Notes

This directory contains the `@revealjs/vue` wrapper. Future changes must preserve the current Reveal/Vue synchronization model unless the behavior is intentionally redesigned and the tests are updated to match.

## Source Of Truth

- Implementation:
  - `vue/src/Deck.vue`
  - `vue/src/Slide.vue`
  - `vue/src/Fragment.vue`
- Behavioral tests:
  - `vue/src/__tests__/Deck.test.ts`
  - `vue/src/__tests__/Slide.test.ts`
  - `vue/src/__tests__/Fragment.test.ts`
- Public-facing behavior summary:
  - `vue/README.md`

## Deck Lifecycle Invariants

- `Deck` creates one `Reveal` instance on mount (`onMounted`) and destroys it on unmount (`onUnmounted`).
- Event props are wired with `deck.on()` after initialization and cleaned up with `deck.off()` when callbacks change or the component unmounts.

## `Reveal.sync()` Policy

- `Reveal.sync()` is expensive. Call it rarely.
- `Deck` must not call `sync()` for ordinary Vue content updates inside existing slides.
  - Example: timers, counters, text changes, or other Vue-only DOM updates inside a slide should not trigger a full deck sync.
- `Deck` should only call `sync()` when the rendered slide structure changes.
  - Current meaning: slides added, removed, reordered, or regrouped into/out of vertical stacks.
- On first ready render, one deck-level sync is still expected.

## `Reveal.configure()` Policy

- `config` changes must be monitored using `watch`.
- `configure()` should only be called after the deck is initialized and ready.
- `configure()` performs its own Reveal-side sync, so the wrapper must avoid an immediate redundant `sync()` afterward.

## Slide-Level Sync Policy

- `Slide` renders a `<section>` and owns slide-level attribute syncing via `deck.syncSlide(slide)`.
- `Slide` should only call `syncSlide()` when the slide's effective `data-*` attribute signature changes after mount.
- `Slide` must not call `syncSlide()` on first render; the initial deck-level sync handles first-time registration.

## Responsibility Split

- Keep responsibilities narrow:
  - `Deck` handles Reveal instance lifecycle, config, plugin capture, event wiring, and structure-level sync.
  - `Slide` handles slide-local attribute mapping and `syncSlide()`.
  - `Stack`, `Code`, and `Fragment` should stay lightweight unless there is a strong reason otherwise.
- Avoid solving slide-local problems with deck-wide `sync()` when a narrower mechanism is possible.

## When Changing Behavior

- If you change sync/config/plugin behavior, update the relevant tests first or in the same change.
- If you change the public Vue API or behavior, update `vue/README.md`.
- Prefer adding narrow tests for regressions:
  - content-only rerenders must not trigger full Vue deck sync
  - structural slide changes must still trigger full deck sync
  - slide attribute changes must trigger `syncSlide()` only

## Validation

Run these after Vue wrapper changes:

- `npm run test`
- `npm run build`
