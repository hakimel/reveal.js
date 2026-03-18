<p align="center">
  <a href="https://revealjs.com">
    <img src="https://hakim-static.s3.amazonaws.com/reveal-js/logo/v1/reveal-black-text-sticker.png" alt="reveal.js" width="500">
  </a>
</p>

# @revealjs/react

`@revealjs/react` is a thin React wrapper around the [Reveal.js](https://revealjs.com) presentation framework. Describe your slides as React components and let the wrapper handle the rest.

## Installation

Install the package along with its peer dependencies:

```bash
npm i @revealjs/react reveal.js react react-dom
# or
yarn add @revealjs/react reveal.js react react-dom
```

The package ships only the React bindings. You still need to import Reveal CSS, themes, and any plugins your deck uses.

## Set up a deck

Render a `Deck` with one or more `Slide` children and import the core Reveal styles:

```tsx
import { Deck, Slide } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';

export function Presentation() {
  return (
    <Deck>
      <Slide>
        <h1>Hello</h1>
        <p>My first Reveal deck in React.</p>
      </Slide>

      <Slide background="#111827">
        <h2>Second slide</h2>
      </Slide>
    </Deck>
  );
}
```

## Components

Alongside `Deck` and `Slide`, the package ships a few components for common slide patterns. `Fragment` reveals content one step at a time, `Code` renders a syntax-highlighted block via the highlight plugin, `Stack` groups slides into a vertical column, and `Markdown` renders Reveal-compatible markdown slides without registering the Reveal markdown plugin:

```tsx
import { Deck, Slide, Stack, Markdown, Fragment, Code } from '@revealjs/react';
import RevealHighlight from 'reveal.js/plugin/highlight';
import 'reveal.js/plugin/highlight/monokai.css';

export function Presentation() {
  return (
    <Deck plugins={[RevealHighlight]}>
      <Slide>
        <h2>Step by step</h2>
        <Fragment animation="fade-up" as="p">First point</Fragment>
        <Fragment animation="fade-up" asChild>
          <div>Second point</div>
        </Fragment>
        <Code language="javascript" lineNumbers>
          {`console.log('Hello, world!');`}
        </Code>
      </Slide>

      <Stack>
        <Slide>Vertical 1</Slide>
        <Slide>Vertical 2</Slide>
      </Stack>

      <Markdown
        separator="^\n---\n$"
        verticalSeparator="^\n--\n$"
        options={{ smartypants: true, animateLists: true }}
      >
        {`
## Markdown 1.1
- First item <!-- .element: class="fragment" -->
- Second item <!-- .element: class="fragment" -->

--

## Markdown 1.2

Notes:
These become speaker notes.

---

<!-- .slide: data-background="#111827" -->
## Markdown 2
        `}
      </Markdown>
    </Deck>
  );
}
```

`Markdown` accepts string children, a `markdown` prop, or `src` for external markdown. Use the first-class `separator`, `verticalSeparator`, `notesSeparator`, `elementAttributesSeparator`, and `slideAttributesSeparator` props to mirror Reveal's markdown options, and pass any other markdown/Marked settings through `options`.

## Configure Reveal

Pass any Reveal configuration through the `config` prop on `Deck`. Plugins are registered separately via `plugins` and are applied once at initialization time, matching Reveal's plugin lifecycle.

```tsx
import { Deck, Slide } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import RevealHighlight from 'reveal.js/plugin/highlight';

export function Presentation() {
  return (
    <Deck
      config={{
        width: 1280,
        height: 720,
        hash: true,
        controls: true,
        progress: true,
        transition: 'slide',
      }}
      plugins={[RevealHighlight]}
    >
      <Slide>Configured deck</Slide>
    </Deck>
  );
}
```

`config` maps directly to [Reveal's configuration object](https://revealjs.com/config/). `Slide` and `Markdown` both support convenient Reveal slide props such as `background`, `backgroundImage`, `backgroundColor`, `visibility`, `autoAnimate`, `transition`, `transitionSpeed`, `autoSlide`, `notes`, `backgroundInteractive`, and `preload`, while still passing through raw `data-*` attributes to the rendered `<section>` element.

## Subscribe to events

Use event props on `Deck` to respond to Reveal lifecycle and navigation events:

```tsx
import { Deck, Slide } from '@revealjs/react';

export function Presentation() {
  return (
    <Deck
      onReady={(deck) => {
        console.log('Reveal ready', deck);
      }}
      onSync={() => {
        console.log('Deck synced');
      }}
      onSlideChange={(event) => {
        console.log('Slide changed', event.indexh, event.indexv);
      }}
      onFragmentShown={(event) => {
        console.log('Fragment shown', event.fragment);
      }}
    >
      <Slide>Intro</Slide>
      <Slide>Next</Slide>
    </Deck>
  );
}
```

## Access the Reveal API

Use `useReveal()` inside the deck tree to call the Reveal API from your own components:

```tsx
import { Deck, Slide, useReveal } from '@revealjs/react';

function NextButton() {
  const deck = useReveal();

  return <button onClick={() => deck?.next()}>Next slide</button>;
}

export function Presentation() {
  return (
    <Deck>
      <Slide>
        <h2>Controlled from React</h2>
        <NextButton />
      </Slide>
    </Deck>
  );
}
```

To access the Reveal instance outside of the component tree, pass a `deckRef` to `Deck`:

```tsx
import { useRef } from 'react';
import { Deck, Slide } from '@revealjs/react';
import type { RevealApi } from 'reveal.js';

export function Presentation() {
  const deckRef = useRef<RevealApi | null>(null);

  return (
    <Deck deckRef={deckRef}>
      <Slide>Hello</Slide>
    </Deck>
  );
}
```

## How it works

- `Deck` creates one Reveal instance on mount and destroys it on unmount. Initialization is asynchronous — `onReady` fires once `reveal.initialize()` resolves, after which the instance is also accessible via `useReveal()` and `deckRef`.
- `Deck` calls `reveal.sync()` when the rendered slide structure changes, such as slides being added, removed, reordered, or regrouped into stacks.
- `Slide` handles slide-level `data-*` attribute updates locally with `reveal.syncSlide()`, so ordinary React content updates inside a slide do not trigger a full deck sync.
- `Markdown` uses `marked` plus the same separator and comment-attribute conventions as Reveal's core markdown plugin, including `.slide:` and `.element:` comment syntax.
- `config` is shallow-compared on each render so that `reveal.configure()` is only called when a value actually changes.
- `plugins` are initialization-only, matching Reveal's plugin lifecycle. The prop is captured once on first mount and ignored on subsequent renders.
- Event props are wired with `deck.on()` after initialization and cleaned up with `deck.off()`. Changing a callback between renders swaps the listener automatically.

---

<div align="center">
  MIT licensed | Copyright © 2011-2026 Hakim El Hattab, https://hakim.se
</div>
