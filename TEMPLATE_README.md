# Mathematical Presentation Template

This is a custom reveal.js template designed for mathematical presentations with built-in environments for theorems, definitions, and propositions.

## Files Created

- `template.html` - The main template file you can copy and modify for your presentations
- `dist/theme/math-template.css` - Custom theme with mathematical environment styling

## Getting Started

1. Copy `template.html` to a new file (e.g., `my-presentation.html`)
2. Edit the content in your new file
3. Open it in a browser to view your presentation

## Mathematical Environments

The template includes three styled environments:

### Theorem (Blue)
```html
<div class="theorem">
  <div class="env-label">Theorem 1</div>
  <div class="env-content">
    Your theorem statement here with math: \(x^2 + y^2 = z^2\)
  </div>
</div>
```

### Definition (Green)
```html
<div class="definition">
  <div class="env-label">Definition 1</div>
  <div class="env-content">
    Your definition here...
  </div>
</div>
```

### Proposition (Purple)
```html
<div class="proposition">
  <div class="env-label">Proposition 1</div>
  <div class="env-content">
    Your proposition here...
  </div>
</div>
```

## Using Math

The template uses MathJax 2 for rendering mathematics:

- Inline math: `\(x + y = z\)`
- Display math: `\[x^2 + y^2 = z^2\]`

### Predefined Macros

The following LaTeX macros are available:
- `\R` - Real numbers (ℝ)
- `\N` - Natural numbers (ℕ)
- `\Z` - Integers (ℤ)
- `\Q` - Rationals (ℚ)
- `\C` - Complex numbers (ℂ)

You can add more macros in the `mathjax2` configuration section of the HTML file.

## Creating Slides

Each slide is a `<section>` element:

```html
<section>
  <h2>Slide Title</h2>
  <p>Regular content</p>

  <div class="theorem">
    <div class="env-label">Theorem 1</div>
    <div class="env-content">
      Theorem statement
    </div>
  </div>
</section>
```

## Viewing Your Presentation

Simply open the HTML file in a web browser. Navigate using:
- Arrow keys or space bar to move between slides
- 'F' for fullscreen
- 'S' for speaker notes
- 'ESC' for overview mode

## Starting a Development Server

If you need to serve the files locally:

```bash
npm install
npm start
```

Then navigate to `http://localhost:8000/template.html`

## Customization

### Colors
You can modify the environment colors in `dist/theme/math-template.css`:
- Theorems: Search for `#2a76dd` (blue)
- Definitions: Search for `#22c55e` (green)
- Propositions: Search for `#a855f7` (purple)

### Fonts and Sizes
Adjust the CSS variables in the `:root` section of `dist/theme/math-template.css`

### Transitions
Change the `transition` option in the `Reveal.initialize()` call in your HTML file. Options include: 'slide', 'fade', 'convex', 'concave', 'zoom'

## Additional Features

The template includes:
- Syntax highlighting for code
- Markdown support
- Speaker notes
- Math rendering
- All standard reveal.js features
