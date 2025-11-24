# Mathematical Presentation Template

A custom reveal.js template for creating beautiful mathematical presentations with styled environments for theorems, definitions, and propositions.

## Quick Start

1. Open `index.html` in your browser to see the template
2. Edit `index.html` to create your own presentation
3. Save and refresh to see changes

## Features

- **4:3 Aspect Ratio**: Classic presentation format (1024x768)
- **System Fonts**: Uses native system fonts for optimal rendering
- **Math Support**: Full LaTeX math support via MathJax 2
- **Three Styled Environments**: Theorem (blue), Definition (green), Proposition (purple)
- **Dark Preview Background**: Easy to see slide boundaries during editing

## Creating Slides

Each slide is a `<section>` element inside `<div class="slides">`:

```html
<section>
    <h2>Slide Title</h2>
    <p>Your content here</p>
</section>
```

## Mathematical Environments

### Theorem (Blue)

```html
<div class="theorem">
    <div class="env-label">Theorem 1</div>
    <div class="env-content">
        For any real numbers \(a\) and \(b\), we have
        \[(a + b)^2 = a^2 + 2ab + b^2\]
    </div>
</div>
```

### Definition (Green)

```html
<div class="definition">
    <div class="env-label">Definition 1</div>
    <div class="env-content">
        A <strong>group</strong> is a set \(G\) together with a binary operation
        \(\cdot : G \times G \to G\) that satisfies associativity, identity,
        and inverse properties.
    </div>
</div>
```

### Proposition (Purple)

```html
<div class="proposition">
    <div class="env-label">Proposition 1</div>
    <div class="env-content">
        Every finite group of prime order is cyclic.
    </div>
</div>
```

## Writing Mathematics

The template uses MathJax 2 for rendering LaTeX math:

### Inline Math
```html
<p>Euler's identity states that \(e^{i\pi} + 1 = 0\)</p>
```

### Display Math
```html
\[\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}\]
```

### Predefined Macros

The following LaTeX macros are available:
- `\R` → ℝ (real numbers)
- `\N` → ℕ (natural numbers)
- `\Z` → ℤ (integers)
- `\Q` → ℚ (rationals)
- `\C` → ℂ (complex numbers)

Example:
```latex
\[f: \R \to \C\]
```

## Color Palette

The template uses a professional color scheme:

| Environment | Border/Label | Background |
|-------------|--------------|------------|
| Theorem     | `#1e40af` (deep blue) | `#dbeafe` (light blue) |
| Definition  | `#15803d` (forest green) | `#dcfce7` (light green) |
| Proposition | `#7e22ce` (royal purple) | `#f3e8ff` (light lavender) |

## Navigation

During presentation:
- **Arrow keys** or **Space**: Navigate slides
- **F**: Fullscreen mode
- **S**: Speaker notes view
- **ESC**: Overview mode
- **B** or **.**: Blackout screen

## Customization

### Changing Colors

Edit the CSS variables in `dist/theme/math-template.css`:

```css
:root {
    --theorem-border: #1e40af;
    --theorem-bg: #dbeafe;

    --definition-border: #15803d;
    --definition-bg: #dcfce7;

    --proposition-border: #7e22ce;
    --proposition-bg: #f3e8ff;
}
```

### Changing Font Size

Edit in `dist/theme/math-template.css`:

```css
--r-main-font-size: 32px;  /* Default body text size */
```

### Changing Transitions

Edit in `index.html`:

```javascript
Reveal.initialize({
    transition: 'fade',  // Options: 'none', 'fade', 'slide', 'convex', 'concave', 'zoom'
    transitionSpeed: 'fast',  // Options: 'default', 'fast', 'slow'
    // ...
});
```

### Adding More LaTeX Macros

Edit the `mathjax2` configuration in `index.html`:

```javascript
mathjax2: {
    config: 'TeX-AMS_HTML-full',
    TeX: {
        Macros: {
            R: '\\mathbb{R}',
            N: '\\mathbb{N}',
            // Add your own:
            eps: '\\varepsilon',
            norm: ['\\left\\|#1\\right\\|', 1],
        }
    }
},
```

## Complete Example

```html
<section>
    <h2>The Fundamental Theorem of Calculus</h2>

    <div class="theorem">
        <div class="env-label">Theorem 1 (FTC Part 1)</div>
        <div class="env-content">
            If \(f\) is continuous on \([a,b]\) and \(F(x) = \int_a^x f(t)\, dt\), then
            \[F'(x) = f(x)\]
        </div>
    </div>

    <p class="fragment">This connects differentiation and integration!</p>
</section>
```

## Multiple Environments Per Slide

You can include multiple environments on a single slide:

```html
<section>
    <h2>Related Concepts</h2>

    <div class="definition">
        <div class="env-label">Definition 1</div>
        <div class="env-content">
            A function \(f: X \to Y\) is <strong>injective</strong> if
            \(f(x_1) = f(x_2)\) implies \(x_1 = x_2\).
        </div>
    </div>

    <div class="proposition">
        <div class="env-label">Proposition 1</div>
        <div class="env-content">
            If \(f: X \to Y\) is injective, then \(|X| \leq |Y|\).
        </div>
    </div>
</section>
```

## Development Server

To run a local development server:

```bash
npm install
npm start
```

Then open `http://localhost:8000/`

## Exporting to PDF

1. Add `?print-pdf` to the URL: `index.html?print-pdf`
2. Open print dialog (Cmd/Ctrl + P)
3. Choose "Save as PDF"
4. Set margins to "None"

## Tips for Great Presentations

1. **One idea per slide**: Keep slides focused and uncluttered
2. **Use fragments**: Add `class="fragment"` to elements to reveal them incrementally
3. **Limit text**: Use bullet points and math, avoid long paragraphs
4. **Consistent numbering**: Number your theorems, definitions, and propositions consistently
5. **Speaker notes**: Add `<aside class="notes">` for presenter-only notes

## License

Based on reveal.js by Hakim El Hattab
