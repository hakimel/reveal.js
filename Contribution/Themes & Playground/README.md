# Reveal.js — Themes & Playground (Advanced)

> Drop-in bundle that adds a **Theme Switcher**, **Color Palettes**, a **Code Playground** (HTML/CSS/JS live), and a **Terminal Simulation** to any Reveal.js deck.

- **Author**: Generated for your Web Technologies group project
- **Date**: 2025-08-31

## Highlights

- 🎨 **Six production-ready themes** (CSS variables powered) + on-slide theme overrides
- 🌈 **Palette system**: global accent colors with live picker and algorithmic shade generator
- 🧪 **Code Playground**: embedded or overlay editors for HTML/CSS/JS with live preview (iframe sandbox)
- 🖥️ **Terminal Simulation**: demo-friendly CLI inside slides (commands: `help`, `echo`, `theme`, `palette`, `js`, `date`, `clear`, `history`)
- ⚡ **Shortcuts**: `T` (theme/palette panel), `P` (playground overlay), `\`` (terminal toggle)
- 🧩 **Plugins**: `RevealThemeSwitcher`, `RevealPalettes`, `RevealPlayground`, `RevealTerminal`

## Quick Start (CDN demo)

```html
<!-- See demo.html in this folder; minimal snippet: -->
<link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/reveal.css">
<link rel="stylesheet" href="https://unpkg.com/reveal.js/dist/theme/black.css">
<script src="https://unpkg.com/reveal.js/dist/reveal.js"></script>

<link rel="stylesheet" href="./plugin/themes/theme-switcher.css">
<link rel="stylesheet" href="./plugin/palettes/palettes.css">
<link rel="stylesheet" href="./plugin/playground/playground.css">
<link rel="stylesheet" href="./plugin/terminal/terminal.css">

<script src="./plugin/utils/shared.js"></script>
<script src="./plugin/themes/theme-switcher.js"></script>
<script src="./plugin/palettes/palettes.js"></script>
<script src="./plugin/playground/playground.js"></script>
<script src="./plugin/terminal/terminal.js"></script>

<script>
  const deck = new Reveal({ hash: true });
  deck.initialize({
    plugins: [ RevealThemeSwitcher, RevealPalettes, RevealPlayground, RevealTerminal ]
  });
</script>
```

## Using in Your Team Repo

1. Copy the entire `plugin/` and `assets/` folders into your `reveal.js` project (or keep as submodule).
2. In your **demo** or **index.html**, include the CSS/JS files exactly like above, but point to your local paths.
3. Register the plugins in the `Reveal.initialize` call.

## Authoring: Themes & Palettes

- Add `data-theme="neon-night"` on a `<section>` to apply per-slide.
- Switch globally via the **Theme Switcher** UI or terminal command: `theme neon-night`.
- Change accent color palette from UI or terminal: `palette set 312` (H value).

## Authoring: Code Playground

Option A — **Overlay Playground** (keyboard `P` or UI button):
- Type HTML/CSS/JS and click **Run** to render in the live preview.

Option B — **Inline playground slide**:
```html
<section data-playground
  data-html="&lt;h1&gt;Hello&lt;/h1&gt;"
  data-css="h1{{font-family:sans-serif;text-align:center}}"
  data-js="console.log('Hi')">
</section>
```

## Authoring: Terminal Simulation

- Toggle with `\`` (backtick) or UI button.
- Useful commands:
  - `help` — show help
  - `theme <name>` — switch theme (`minimal-dark`, `neon-night`, `solarized-plus`, `aurora`, `paper`, `oceanic`)
  - `palette set <hue>` — set accent hue (0–360)
  - `js <code>` — run JavaScript in the slide context
  - `date`, `echo`, `clear`, `history`

## Extending

- Edit or add new CSS themes under `plugin/themes/`.
- Modify palette generation logic in `plugin/palettes/palettes.js` (HSL → variables).
- Improve editor UX inside `plugin/playground` (you can swap textareas for Monaco/CodeMirror later).

## License

MIT — do anything with attribution.
