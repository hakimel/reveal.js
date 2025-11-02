# SmartArt HERO Layout

Bootstrap-style hero sections for reveal.js presentations with responsive two-column layouts, images, and call-to-action buttons.

## Features

- **Two-Column Responsive Layout** - Content on left, image on right (desktop)
- **Mobile-First Design** - Stacks vertically on tablets and phones
- **Unsplash Integration** - Easy image sourcing with `unsplash:keyword`
- **Direct URL Support** - Use any image URL
- **Dual CTA Buttons** - Primary (solid) and secondary (outline) styles
- **Dark Theme Support** - Adapts to light and dark backgrounds
- **Fluid Typography** - Responsive text scaling using clamp()
- **No Bootstrap Dependency** - Pure CSS Grid/Flexbox

## Basic Syntax

```markdown
::: smartart [Heading Text] HERO
intro: [Description paragraph]
image: [URL or unsplash:keyword]
cta: [Button Label] | [URL]
cta2: [Secondary Button Label] | [URL]
:::
```

## Examples

### Example 1: Unsplash Image with Dual CTAs

```markdown
::: smartart Welcome to Our Platform HERO
intro: Quickly design and customize responsive mobile-first presentations with SmartArt, featuring flexible layouts, beautiful components, and powerful reveal.js integration.
image: unsplash:technology
cta: Get Started | https://example.com/start
cta2: Learn More | https://example.com/docs
:::
```

### Example 2: Direct Image URL

```markdown
::: smartart Transform Your Business HERO
intro: Leverage cutting-edge cloud infrastructure and AI-powered analytics to accelerate digital transformation and drive sustainable growth across your organization.
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop
cta: Start Free Trial | https://example.com/trial
cta2: View Pricing | https://example.com/pricing
:::
```

### Example 3: Dark Theme

```html
<section data-markdown data-background="#0f172a">
  <script type="text/template">
  ::: smartart Innovate with Confidence HERO
  intro: Build next-generation applications with our enterprise-grade developer platform. Deploy globally in seconds with built-in CI/CD, monitoring, and collaboration tools.
  image: unsplash:developer
  cta: Explore Platform | https://example.com/platform
  cta2: Contact Sales | https://example.com/contact
  :::
  </script>
</section>
```

### Example 4: Single CTA

```markdown
::: smartart Education Platform HERO
intro: Empower learners worldwide with interactive courses, live sessions, and AI-powered personalized learning paths designed for maximum engagement and retention.
image: unsplash:education
cta: Browse Courses | https://example.com/courses
:::
```

### Example 5: No Image (Content Only)

```markdown
::: smartart Simple Call to Action HERO
intro: Sometimes less is more. Create clean, focused hero sections with just a heading, description, and call-to-action buttons.
cta: Primary Action | https://example.com/action
cta2: Secondary Option | https://example.com/option
:::
```

## Field Reference

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `heading` | Yes | Main hero heading (H1) | `Welcome to Our Platform` |
| `intro` | No | Lead paragraph text | `intro: Your description here` |
| `image` | No | Image URL or Unsplash shortcut | `image: unsplash:technology` |
| `cta` | No | Primary button (label \| URL) | `cta: Get Started \| /start` |
| `cta2` | No | Secondary button (label \| URL) | `cta2: Learn More \| /docs` |

## Image Handling

### Unsplash Shortcuts

Use the `unsplash:keyword` format to automatically fetch images from Unsplash:

```markdown
image: unsplash:technology
image: unsplash:healthcare
image: unsplash:business
image: unsplash:developer
image: unsplash:analytics
```

This converts to: `https://source.unsplash.com/800x600/?[keyword]`

### Direct URLs

Use any image URL directly:

```markdown
image: https://example.com/photo.jpg
image: https://images.unsplash.com/photo-123?w=800&h=600
```

### Default Dimensions

Unsplash images default to 800x600 for optimal aspect ratio and performance.

## Responsive Behavior

### Desktop (> 768px)
- Two-column grid layout
- Content on left, image on right
- Horizontal button layout
- Font sizes: Heading 2-3rem, Intro 1-1.25rem

### Tablet/Mobile (≤ 768px)
- Single-column stacked layout
- Image appears first (top)
- Content below image
- Vertical button layout (full width)
- Font sizes: Heading 1.75rem, Intro 1rem

### Small Mobile (≤ 480px)
- Further size reduction
- Font sizes: Heading 1.5rem, Intro 0.9rem
- Compact buttons

## Button Styles

### Primary Button (cta)
- Solid blue background (#137fec)
- White text
- Hover: Darker blue, lift effect
- Box shadow on light theme

### Secondary Button (cta2)
- Transparent background
- Blue border and text
- Hover: Light blue background
- No shadow

### Dark Theme Buttons
- Primary: Same blue with enhanced shadow
- Secondary: Light border, light text
- Adaptive hover states

## CSS Classes

The HERO layout uses these CSS classes:

- `.smartart[data-layout="hero"]` - Container
- `.smartart__hero-grid` - Two-column grid
- `.smartart__hero-content` - Left content area
- `.smartart__hero-heading` - H1 heading
- `.smartart__hero-intro` - Lead paragraph
- `.smartart__hero-actions` - Button container
- `.smartart__hero-cta` - Primary button
- `.smartart__hero-cta--secondary` - Secondary button
- `.smartart__hero-image` - Image wrapper
- `.smartart__hero-image img` - Image element

## Accessibility

- Semantic HTML (h1, p, a elements)
- Proper alt text on images (uses heading as fallback)
- Sufficient color contrast
- Keyboard navigable buttons
- External links open in new tab with `rel="noreferrer noopener"`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Requires CSS Grid and clamp() support (2020+ browsers).

## Demo

See `examples/hero-demo.html` for a complete demonstration with multiple hero section examples.

## Integration

The HERO layout is included in the SmartArt plugin by default. No additional configuration needed.

```html
<script src="../plugin/smartart/smartart.js"></script>

<script>
  Reveal.initialize({
    plugins: [ RevealMarkdown, RevealSmartArt ]
  });
</script>
```

## Compatibility

Works alongside existing SmartArt layouts:
- GRID - Responsive card grids
- LINED - List layouts
- LR/RL - Horizontal layouts
- TB/BT - Vertical layouts

## Performance

- Images use lazy loading (`loading="lazy"`)
- Unsplash source provides optimized images
- No JavaScript runtime overhead
- Pure CSS animations and transitions

## Customization

Override CSS custom properties to match your theme:

```css
:root {
  --r-main-color: #111827;           /* Text color */
  --r-muted-foreground: rgba(55, 65, 81, 0.85);  /* Description color */
}
```

Button colors can be customized by overriding `.smartart__hero-cta` styles:

```css
.reveal .smartart__hero-cta {
  background: #your-color;
  border-color: #your-color;
}
```

## Known Limitations

- Images should be landscape orientation for best results
- Very long headings may wrap awkwardly on mobile
- CTA labels should be concise (1-3 words recommended)
- Unsplash source API has rate limits

## Future Enhancements

Potential future additions:
- Background image mode
- Video support
- Custom image positioning
- Animation options
- More button variants

## License

Part of reveal.js SmartArt plugin - MIT License

## Credits

- Inspired by Bootstrap hero sections
- Uses Unsplash Source API for demo images
- Built for reveal.js presentations
