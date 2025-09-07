# Themes & Playground for Reveal.js

An advanced module that adds **Theme switching**, **Color Palettes**, an **in-slide Code Playground**, and a **Terminal Simulation** to Reveal.js.

## Features

- Theme switcher (Light, Dark, Solarized, Midnight, Pastel) + Live theme editor
- Color palette generator (HSL rotation, golden-ratio, complementary, triad)
- Save/Load palettes to LocalStorage, import/export JSON
- Code Playground using CodeMirror with HTML/CSS/JS tabs, live run, reset, and share via URL
- Terminal simulation with command history, typing animation, faux filesystem and integration:
  - `help`, `ls`, `cat`, `echo`, `date`, `clear`, `theme set <name>`, `palette new <mode>`, `run sample`
- AI helpers (local heuristic) for palette & theme suggestions (no network/API needed)
- All components are designed to work **inside Reveal.js slides**

## Quick Start

1. Open `index.html` in a modern browser (or serve via a static server).
2. Use arrow keys to navigate slides.
3. Try the **Themes**, **Palettes**, **Code Playground**, and **Terminal** sections.

## Dev Notes

- Uses CDNs for Reveal.js, Prism, and CodeMirror (no build step required).
- Feel free to copy the widgets into your own decks.
- To package: zip the folder or deploy to static hosting.

## License
MIT
