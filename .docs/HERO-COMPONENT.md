# HERO Component - SmartArt Plugin

The HERO component supports two variants:

## 1. Full-Viewport Background Image Variant (NEW)

Creates a full-screen hero section with a background image and centered text overlay.

### Syntax:
```markdown
::: smartart Hero Title HERO
background: path/to/image.jpg
heading: Your Main Heading
subtitle: Supporting text or description
cta: Button Text | https://example.com
:::
```

### Parameters:
- **background** (required): URL or path to background image
- **heading**: Main heading text (optional, can also be in first line)
- **subtitle** OR **intro**: Supporting text below heading
- **cta**: Call-to-action button in format `Label | URL`

### Example:
```markdown
::: smartart Transform Your Business HERO
background: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920
heading: Transform Your Business
subtitle: Leverage cutting-edge technology to drive innovation
cta: Get Started | https://example.com
:::
```

### Features:
- Full viewport coverage (85vh minimum height)
- Dark gradient overlay for text readability (rgba(0,0,0,0.4-0.6))
- Centered content with white text and text shadows
- Responsive design with mobile breakpoints
- Purple brand-colored CTA button (#6B46C1)
- Background-size: cover with center positioning

## 2. Two-Column Layout Variant (Original)

Creates a split layout with text on the left and image on the right.

### Syntax:
```markdown
::: smartart Hero Title HERO
intro: Description text
image: path/to/image.jpg
cta: Primary Button | https://example.com
cta2: Secondary Button | https://example.com/more
:::
```

### Parameters:
- **image** (required): URL or path to side image
- **heading**: Main heading text
- **intro**: Description text
- **cta**: Primary call-to-action button
- **cta2**: Secondary call-to-action button (optional)

## Detection Logic

The component automatically detects which variant to use:
- If `background` parameter is present → Full-viewport background variant
- If `image` parameter is present → Two-column layout variant

## CSS Classes

### Background Variant:
- `.smartart--hero` - Main container
- `.smartart__hero-background` - Background image layer
- `.smartart__hero-overlay` - Dark gradient overlay
- `.smartart__hero-content-centered` - Centered content wrapper
- `.smartart__hero-heading-centered` - Main heading
- `.smartart__hero-subtitle` - Subtitle text
- `.smartart__hero-cta-centered` - Call-to-action button

### Two-Column Variant:
- `.smartart__hero-grid` - Two-column grid container
- `.smartart__hero-content` - Left column content
- `.smartart__hero-heading` - Main heading
- `.smartart__hero-intro` - Description text
- `.smartart__hero-actions` - Button container
- `.smartart__hero-cta` - Primary button
- `.smartart__hero-cta--secondary` - Secondary button
- `.smartart__hero-image` - Right column image wrapper

## Responsive Behavior

### Desktop (>768px):
- Full viewport height (85vh)
- Large heading (2.5-4rem)
- Subtitle (1.1-1.5rem)

### Tablet (≤768px):
- Reduced height (70vh)
- Heading: 2rem
- Subtitle: 1.1rem

### Mobile (≤480px):
- Compact height (60vh)
- Heading: 1.75rem
- Subtitle: 1rem

## Accessibility

- Semantic HTML structure
- Proper color contrast with text shadows
- Keyboard-navigable CTA buttons
- External links open in new tabs with rel="noreferrer noopener"

## Browser Compatibility

- Modern browsers supporting CSS3 (flexbox, clamp, gradients)
- Fallback values for older browsers
- Works with reveal.js scaling
