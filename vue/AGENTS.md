# Vue Wrapper Notes

This directory contains the `@revealjs/vue` wrapper. Keep the guidance here high level and update it when the public API, source layout, or Reveal/Vue synchronization model changes.

## Current Layout

- Source lives under `vue/src/`.
- Components live in `vue/src/components/` and use PascalCase filenames with `.vue` extension.
- Shared helpers live in `vue/src/utils/`.
- Public exports are defined in `vue/src/index.ts`.
- Shared types live in `vue/src/types.ts`.
- The Reveal instance context lives in `vue/src/reveal-context.ts`.
- Component tests live in `vue/src/__tests__/` as `*.test.ts`.
- Test setup remains in `vue/src/__tests__/setup.ts`.
- The demo app lives in `vue/demo/src/`.

## Source Of Truth

- Implementation:
  - `vue/src/components/Deck.vue`
  - `vue/src/components/Slide.vue`
  - `vue/src/components/Stack.vue`
  - `vue/src/components/Fragment.vue`
  - `vue/src/components/Code.vue`
  - `vue/src/components/Markdown.vue`
- Shared helpers:
  - `vue/src/utils/slide-attributes.ts`
  - `vue/src/utils/markdown.ts`
- Behavioral tests:
  - `vue/src/__tests__/Deck.test.ts`
  - `vue/src/__tests__/Slide.test.ts`
  - `vue/src/__tests__/Fragment.test.ts`
  - `vue/src/__tests__/Code.test.ts`
  - `vue/src/__tests__/Markdown.test.ts`
- Public-facing behavior summary:
  - `vue/README.md`

## Deck Lifecycle Invariants

- `Deck` creates one `Reveal` instance on mount and destroys it on unmount.
- `Deck` must remain safe under hot module replacement; do not reintroduce double initialization.
- Event props are wired with `deck.on()` after initialization and cleaned up with `deck.off()` when callbacks change or the component unmounts.

## Sync Policy

- `Reveal.sync()` is expensive. Call it rarely.
- `Deck` should only call `sync()` when the rendered slide structure changes.
  - Example: slides added, removed, reordered, or regrouped into or out of vertical stacks.
- Ordinary Vue content updates inside an existing slide must not trigger a full deck sync.
- One deck-level sync is still expected once the deck is ready.

## Configure Policy

- `config` is shallow-compared.
- Recreating a config object with the same shallow values must not call `configure()`.
- `configure()` should only run after the deck is initialized and ready.
- `configure()` performs its own Reveal-side sync, so the wrapper must avoid an immediate redundant `sync()` afterward.

## Component Responsibilities

- `Deck` owns Reveal lifecycle, config application, event wiring, and structure-level sync.
- `Slide` owns slide-local attribute mapping and calls `syncSlide()` only when the effective slide `data-*` attributes change after mount.
- `Markdown` mirrors the core Reveal Markdown plugin behavior in Vue.
  - It is responsible for markdown parsing, separator support, notes support, and comment-based `.slide:` and `.element:` attributes.
  - It should keep markdown-specific DOM post-processing local rather than expanding deck-wide sync behavior.
- `Code` owns explicit code block rendering and Reveal highlight integration for non-markdown code blocks.
- `Stack` and `Fragment` should stay lightweight unless there is a strong reason otherwise.

## Markdown And Highlighting Notes

- Markdown behavior should stay aligned with the core Reveal Markdown plugin unless the Vue API intentionally diverges.
- Markdown slide parsing and comment-based attribute helpers belong in `vue/src/utils/markdown.ts`.
- Markdown code highlighting should recover on rerender and after Reveal becomes available, without requiring a full deck sync.

## When Changing Behavior

- If sync, configure, markdown, or highlight behavior changes, update the relevant colocated tests in the same change.
- If the public Vue API or documented behavior changes, update `vue/README.md`.
- Prefer focused regression tests over broad snapshots.

## Validation

Run these after Vue wrapper changes:

- `npm test --prefix vue`
- `npm run build --prefix vue`
