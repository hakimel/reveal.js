# SmartArt ROADMAP Layout - Quick Start Guide

## Basic Syntax

```markdown
::: smartart [Heading] ROADMAP
intro: [Optional description]
- [status] [Title] | [Description] | icon=[icon-name]
:::
```

## Status Markers

| Marker | Status | Color | Badge Text |
|--------|--------|-------|------------|
| `[x]` or `[X]` | Completed | Blue (#137fec) | "Completed" |
| `[~]` or `[>]` | In Progress | Orange (#f59e0b) | "In Progress" |
| `[ ]` or `-` | Planned | Gray (#94a3b8) | "Planned" |

## Quick Examples

### 1. Simple Roadmap
```markdown
::: smartart Project Timeline ROADMAP
- [x] Planning | Initial research completed
- [~] Development | Currently building features
- [ ] Launch | Scheduled for Q4
:::
```

### 2. With Introduction
```markdown
::: smartart 2024 Goals ROADMAP
intro: Our strategic objectives for the year.
- [x] Q1 | Foundation setup
- [x] Q2 | Core product launch
- [~] Q3 | Market expansion
- [ ] Q4 | Scale and optimize
:::
```

### 3. With Icons
```markdown
::: smartart Product Roadmap ROADMAP
intro: Major milestones on our journey.
- [x] Research | Market analysis | icon=lucide:search
- [x] Design | UI/UX mockups | icon=lucide:palette
- [~] Build | Development phase | icon=lucide:hammer
- [ ] Test | QA and testing | icon=lucide:check-circle
- [ ] Deploy | Production release | icon=lucide:rocket
:::
```

### 4. Dark Theme
```markdown
<section data-markdown data-background="#0f172a">
    <script type="text/template">
    ## Development Roadmap

    ::: smartart 2024 Milestones ROADMAP
    - [x] Phase 1 | MVP complete | icon=lucide:check
    - [~] Phase 2 | Beta testing | icon=lucide:flask
    - [ ] Phase 3 | Public launch | icon=lucide:rocket
    :::
    </script>
</section>
```

### 5. Compact Version
```markdown
::: smartart Quick Tasks ROADMAP
- [x] Setup | Done
- [x] Code | Done
- [~] Test | Ongoing
- [ ] Ship | Pending
:::
```

## Layout Behavior

### Desktop (>768px)
- Horizontal timeline
- Cards alternate above/below the line
- 20px circular dots on timeline
- Progress bar shows completion percentage

### Mobile (≤768px)
- Vertical timeline (left side)
- Cards stacked vertically
- 24px circular dots
- Full-width cards

## Icon Options

Use any Lucide icon via Iconify:
- `icon=lucide:check-circle`
- `icon=lucide:rocket`
- `icon=lucide:lightbulb`
- `icon=lucide:code`
- `icon=lucide:smartphone`
- `icon=lucide:globe`
- `icon=lucide:brain`
- `icon=lucide:zap`

Browse icons at: https://icon-sets.iconify.design/lucide/

## Tips

1. **Progress Calculation**: Automatically calculated as (completed items / total items) × 100
2. **Status Colors**: Match your theme by modifying CSS variables
3. **Responsive**: Automatically adapts to screen size
4. **Accessibility**: Uses semantic HTML and proper ARIA roles
5. **Performance**: Icons lazy-load from Iconify CDN

## Common Use Cases

- Product development roadmaps
- Project timelines
- Feature rollout plans
- Sprint planning
- Release schedules
- Goal tracking
- Quarterly objectives
- Implementation phases

## Styling Customization

### Override Badge Colors
```css
.smartart__roadmap-badge--completed {
    background: rgba(0, 200, 0, 0.15);
    color: #00c800;
}
```

### Change Timeline Color
```css
.smartart__roadmap-progress {
    background: #ff6b6b; /* Custom color */
}
```

### Adjust Card Spacing
```css
.smartart__roadmap-items {
    gap: 3rem; /* Increase spacing */
}
```

## Testing Your Roadmap

1. Build the project:
   ```bash
   npm run build
   ```

2. Start local server:
   ```bash
   npx http-server -p 8080
   ```

3. Open browser:
   - Examples: `http://localhost:8080/examples/smartart.html`
   - Test file: `http://localhost:8080/test-roadmap.html`

## Troubleshooting

### Roadmap not displaying
- Ensure you have `ROADMAP` keyword (case-insensitive)
- Check that SmartArt plugin is loaded
- Verify markdown plugin is initialized first

### Icons not loading
- Check internet connection (uses Iconify CDN)
- Verify icon name syntax: `icon=lucide:icon-name`
- Try different icon if one doesn't exist

### Layout issues on mobile
- Check responsive breakpoint (768px)
- Verify viewport meta tag exists
- Test in browser dev tools mobile view

### Progress bar not showing
- Ensure at least one item has `[x]` status
- Check that items are properly parsed
- Verify no JavaScript console errors

## Support

For issues or questions:
1. Check `ROADMAP_IMPLEMENTATION.md` for technical details
2. Review examples in `examples/smartart.html`
3. Inspect browser console for errors
4. Verify reveal.js and SmartArt plugin versions

## Version
SmartArt Plugin v5.2.1 with ROADMAP layout support
