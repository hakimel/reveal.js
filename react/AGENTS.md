# React Wrapper Notes

This directory contains the `@revealjs/react` wrapper. Keep the guidance here high level and update it when the public API, source layout, or Reveal/React synchronization model changes.

## Current Layout

- Source lives under `react/src/`.
- Components live in `react/src/components/` and use kebab-case filenames.
- Shared helpers live in `react/src/utils/`.
- Public exports are defined in `react/src/index.ts`.
- Shared types live in `react/src/types.ts`.
- The Reveal instance context lives in `react/src/reveal-context.ts`.
- Component tests are colocated with their components as `*.test.tsx`.
- Test setup remains in `react/src/__tests__/setup.ts`.
- The demo app lives in `react/demo/src/`.

## Source Of Truth

- Implementation:
  - `react/src/components/deck.tsx`
  - `react/src/components/slide.tsx`
  - `react/src/components/stack.tsx`
  - `react/src/components/fragment.tsx`
  - `react/src/components/code.tsx`
  - `react/src/components/markdown.tsx`
- Shared helpers:
  - `react/src/utils/slide-attributes.ts`
  - `react/src/utils/markdown.ts`
- Behavioral tests:
  - `react/src/components/deck.test.tsx`
  - `react/src/components/slide.test.tsx`
  - `react/src/components/fragment.test.tsx`
  - `react/src/components/code.test.tsx`
  - `react/src/components/markdown.test.tsx`
- Public-facing behavior summary:
  - `react/README.md`

## Deck Lifecycle Invariants

- `Deck` creates one `Reveal` instance on mount and destroys it on unmount.
- `Deck` must remain safe under React `StrictMode`; do not reintroduce double initialization.
- Event props are wired with `deck.on()` after initialization and cleaned up with `deck.off()` when callbacks change or the component unmounts.

## Sync Policy

- `Reveal.sync()` is expensive. Call it rarely.
- `Deck` should only call `sync()` when the rendered slide structure changes.
  - Example: slides added, removed, reordered, or regrouped into or out of vertical stacks.
- Ordinary React content updates inside an existing slide must not trigger a full deck sync.
- One deck-level sync is still expected once the deck is ready.

## Configure Policy

- `config` is shallow-compared.
- Recreating a config object with the same shallow values must not call `configure()`.
- `configure()` should only run after the deck is initialized and ready.
- `configure()` performs its own Reveal-side sync, so the wrapper must avoid an immediate redundant `sync()` afterward.

## Component Responsibilities

- `Deck` owns Reveal lifecycle, config application, event wiring, and structure-level sync.
- `Slide` owns slide-local attribute mapping and calls `syncSlide()` only when the effective slide `data-*` attributes change after mount.
- `Markdown` mirrors the core Reveal Markdown plugin behavior in React.
  - It is responsible for markdown parsing, separator support, notes support, and comment-based `.slide:` and `.element:` attributes.
  - It should keep markdown-specific DOM post-processing local rather than expanding deck-wide sync behavior.
- `Code` owns explicit code block rendering and Reveal highlight integration for non-markdown code blocks.
- `Stack` and `Fragment` should stay lightweight unless there is a strong reason otherwise.

## Markdown And Highlighting Notes

- Markdown behavior should stay aligned with the core Reveal Markdown plugin unless the React API intentionally diverges.
- Markdown slide parsing and comment-based attribute helpers belong in `react/src/utils/markdown.ts`.
- Markdown code highlighting should recover on rerender and after Reveal becomes available, without requiring a full deck sync.

## When Changing Behavior

- If sync, configure, markdown, or highlight behavior changes, update the relevant colocated tests in the same change.
- If the public React API or documented behavior changes, update `react/README.md`.
- Prefer focused regression tests over broad snapshots.

## Validation

Run these after React wrapper changes:

- `npm test --prefix react`
- `npm run build --prefix react`
