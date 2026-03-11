# React Wrapper Notes

This directory contains the `@revealjs/react` wrapper. Future changes must preserve the current Reveal/React synchronization model unless the behavior is intentionally redesigned and the tests are updated to match.

## Source Of Truth

- Implementation:
  - `react/src/Deck.tsx`
  - `react/src/Slide.tsx`
  - `react/src/Fragment.tsx`
- Behavioral tests:
  - `react/src/__tests__/Deck.test.tsx`
  - `react/src/__tests__/Slide.test.tsx`
  - `react/src/__tests__/Fragment.test.tsx`
- Public-facing behavior summary:
  - `react/README.md`

## Deck Lifecycle Invariants

- `Deck` creates one `Reveal` instance on mount and destroys it on unmount.
- `Deck` must remain safe under React `StrictMode`; do not reintroduce double initialization.
- Event props are wired with `deck.on()` after initialization and cleaned up with `deck.off()` when callbacks change or the component unmounts.

## `Reveal.sync()` Policy

- `Reveal.sync()` is expensive. Call it rarely.
- `Deck` must not call `sync()` for ordinary React content updates inside existing slides.
  - Example: timers, counters, text changes, or other React-only DOM updates inside a slide should not trigger a full deck sync.
- `Deck` should only call `sync()` when the rendered slide structure changes.
  - Current meaning: slides added, removed, reordered, or regrouped into/out of vertical stacks.
- On first ready render, one deck-level sync is still expected.

## `Reveal.configure()` Policy

- `config` is shallow-compared.
- Recreating the `config` object with the same values must not call `configure()`.
- `configure()` should only be called after the deck is initialized and ready.
- `configure()` performs its own Reveal-side sync, so the wrapper must avoid an immediate redundant `sync()` afterward.
- The current code uses a skip flag for this. If you change that logic, preserve the existing behavior where the skip state is reset safely even if Reveal is briefly not ready during the follow-up render.

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
- If you change the public React API or behavior, update `react/README.md`.
- Prefer adding narrow tests for regressions:
  - content-only rerenders must not trigger full deck sync
  - structural slide changes must still trigger full deck sync
  - slide attribute changes must trigger `syncSlide()` only

## Validation

Run these after React wrapper changes:

- `npm run react:test`
- `npm run react:build`
