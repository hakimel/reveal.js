<p align="center">
  <a href="https://revealjs.com">
    <img src="https://hakim-static.s3.amazonaws.com/reveal-js/logo/v1/reveal-black-text-sticker.png" alt="reveal.js" width="500">
  </a>
</p>

# @revealjs/vue

`@revealjs/vue` is a thin Vue 3 wrapper around the [Reveal.js](https://revealjs.com) presentation framework. Describe your slides as Vue components and let the wrapper handle the rest.

## Installation

Install the package along with its peer dependencies:

```bash
npm i @revealjs/vue reveal.js vue
# or
yarn add @revealjs/vue reveal.js vue
```

The package ships only the Vue bindings. You still need to import Reveal CSS, themes, and any plugins your deck uses.

## Set up a deck

Render a `Deck` with one or more `Slide` children and import the core Reveal styles:

```vue
<script setup lang="ts">
import { Deck, Slide } from '@revealjs/vue';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
</script>

<template>
  <Deck>
    <Slide>
      <h1>Hello</h1>
      <p>My first Reveal deck in Vue.</p>
    </Slide>

    <Slide background="#111827">
      <h2>Second slide</h2>
    </Slide>
  </Deck>
</template>
```

## Components

Alongside `Deck` and `Slide`, the package ships a few components for common slide patterns. `Fragment` reveals content one step at a time, `Code` renders a syntax-highlighted block via the highlight plugin, and `Stack` groups slides into a vertical column.

*Note: In Vue, `Fragment` uses the `as` prop to render a specific native element, instead of the React `asChild` pattern.*

```vue
<script setup lang="ts">
import { Deck, Slide, Stack, Fragment, Code } from '@revealjs/vue';
import RevealHighlight from 'reveal.js/plugin/highlight';
import 'reveal.js/plugin/highlight/monokai.css';
</script>

<template>
  <Deck :plugins="[RevealHighlight]">
    <Slide>
      <h2>Step by step</h2>
      <Fragment animation="fade-up" as="p">First point</Fragment>
      <Fragment animation="fade-up" as="div">
        Second point
      </Fragment>
      <Code language="javascript" lineNumbers>
        {{ `console.log('Hello, world!');` }}
      </Code>
    </Slide>

    <Stack>
      <Slide>Vertical 1</Slide>
      <Slide>Vertical 2</Slide>
    </Stack>
  </Deck>
</template>
```

## Configure Reveal

Pass any Reveal configuration through the `config` prop on `Deck`. Plugins are registered separately via `plugins` and are applied once at initialization time, matching Reveal's plugin lifecycle.

```vue
<script setup lang="ts">
import { Deck, Slide } from '@revealjs/vue';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import RevealHighlight from 'reveal.js/plugin/highlight';
</script>

<template>
  <Deck
    :config="{
      width: 1280,
      height: 720,
      hash: true,
      controls: true,
      progress: true,
      transition: 'slide',
    }"
    :plugins="[RevealHighlight]"
  >
    <Slide>Configured deck</Slide>
  </Deck>
</template>
```

`config` maps directly to [Reveal's configuration object](https://revealjs.com/config/). `Slide` supports convenient Reveal slide props such as `background`, `backgroundImage`, `backgroundColor`, `visibility`, `autoAnimate`, `transition`, `transitionSpeed`, `autoSlide`, `notes`, `backgroundInteractive`, and `preload`, while still passing through raw `data-*` attributes to the rendered `<section>` element.

## Subscribe to events

Use event listeners (`@ready`, `@sync` or standard vue convention `@slidechanged`) or pass callbacks via props to respond to Reveal lifecycle and navigation events. We follow standard Vue 3 `@eventName` conventions where possible.

```vue
<script setup lang="ts">
import { Deck, Slide } from '@revealjs/vue';

function onReady(deck) {
  console.log('Reveal ready', deck);
}
function onSync() {
  console.log('Deck synced');
}
function onSlideChanged(event) {
  console.log('Slide changed', event.indexh, event.indexv);
}
function onFragmentShown(event) {
  console.log('Fragment shown', event.fragment);
}
</script>

<template>
  <Deck
    @ready="onReady"
    @sync="onSync"
    @slidechanged="onSlideChanged"
    @fragmentshown="onFragmentShown"
  >
    <Slide>Intro</Slide>
    <Slide>Next</Slide>
  </Deck>
</template>
```

## Access the Reveal API

Use `useReveal()` inside the deck tree to call the Reveal API from your own components. It returns the injected Reveal instance.

```vue
<!-- NextButton.vue -->
<script setup lang="ts">
import { useReveal } from '@revealjs/vue';

const deck = useReveal();

function goNext() {
  deck.value?.next();
}
</script>

<template>
  <button @click="goNext">Next slide</button>
</template>
```

To access the Reveal instance outside of the component tree, use a template ref:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Deck, Slide } from '@revealjs/vue';

const deckRef = ref();

// Access the instance on the component expose
// e.g. deckRef.value?.reveal
</script>

<template>
  <Deck ref="deckRef">
    <Slide>Hello</Slide>
  </Deck>
</template>
```

## How it works

- `Deck` creates one Reveal instance on mount and destroys it on unmount. Initialization is asynchronous — `ready` event fires once `reveal.initialize()` resolves, after which the instance is also accessible via `useReveal()`.
- `Deck` calls `reveal.sync()` when the rendered slide structure changes, such as slides being added, removed, reordered, or regrouped into stacks.
- `Slide` handles slide-level `data-*` attribute updates locally with `reveal.syncSlide()`, so ordinary Vue content updates inside a slide do not trigger a full deck sync.
- `config` changes are monitored using Vue's reactivity system so that `reveal.configure()` is only called when a value actually changes.
- `plugins` are initialization-only, matching Reveal's plugin lifecycle.
- Event listeners are wired with `deck.on()` after initialization and cleaned up with `deck.off()`.

---

<div align="center">
  MIT licensed | Copyright © 2011-2026 Hakim El Hattab, https://hakim.se
</div>
