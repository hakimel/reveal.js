# LLM Runner Offcanvas Integration

## Overview

The LLM Runner Offcanvas integration adds interactive "Run" buttons to prompt cards in reveal.js presentations. When clicked, an offcanvas drawer slides in from the right with the LLM Runner interface, pre-populated with the prompt text from the card.

## Features

- **Automatic Detection**: Automatically finds all `.prompt-box` elements and adds Run buttons
- **Smooth Animations**: Offcanvas drawer with smooth slide-in/out transitions
- **Context Awareness**: Displays the slide title and prompt context
- **Keyboard Support**: Press `Escape` to close the drawer
- **Mobile Responsive**: Adapts to smaller screens
- **No Interference**: Automatically closes when navigating between slides

## Implementation Details

### Files Modified

1. **plugin/llm-runner/llm-runner.js**
   - Added `enhanceRunners()` method to public API
   - Allows dynamic initialization of LLM runners in offcanvas elements

2. **examples/presentations/ai-for-product-discovery.html**
   - Added CSS styles for Run buttons and offcanvas drawer
   - Added JavaScript integration script
   - Added RevealLLMRunner plugin to plugin list

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Slide                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  .prompt-box                                          │  │
│  │  ┌────────────────────────────────────┐  [Run]       │  │
│  │  │ MVP Features:                      │              │  │
│  │  │ "Brainstorm 8 MVP features..."     │              │  │
│  │  └────────────────────────────────────┘              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │ Click Run
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Offcanvas Drawer (slides in from right)                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Run Prompt with AI                              [×]   │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ MVP Features:                                         │ │
│  │ Brainstorm 8 MVP features...                          │ │
│  │ From: Prompt Library: Idea Generation                 │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ [LLM Runner Interface]                                │ │
│  │ - Text editor with prompt                             │ │
│  │ - Model selector                                      │ │
│  │ - Run/Clear buttons                                   │ │
│  │ - Output area                                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Usage

### For Presentation Authors

To enable Run buttons on prompt cards, simply use the `.prompt-box` class:

```html
<div class="prompt-box">
    <strong>MVP Features:</strong>
    "Brainstorm 8 MVP features to solve [Problem 1: motivation drop-off].
    Label each as either MVP or experiment."
</div>
```

The integration script will automatically:
1. Detect all `.prompt-box` elements
2. Extract the prompt text (excluding the `<strong>` title)
3. Add a "Run" button in the top-right corner
4. Set up click handlers to open the offcanvas drawer

### For Users

1. Navigate to a slide with prompt cards (e.g., Slide 14)
2. Click the "Run" button on any prompt card
3. The offcanvas drawer opens with the LLM Runner interface
4. The prompt is pre-populated in the editor
5. Click "Run" in the LLM Runner toolbar to execute
6. View results in the output area
7. Close the drawer by:
   - Clicking the × button
   - Clicking the overlay
   - Pressing the Escape key
   - Navigating to another slide

## API Reference

### JavaScript Functions

#### `extractPromptText(element)`
Extracts prompt text and metadata from a prompt box element.

**Parameters:**
- `element` (HTMLElement): The prompt box element

**Returns:**
```javascript
{
    title: string,      // Text from <strong> tag
    text: string,       // Prompt text (excluding title)
    context: {
        slideNumber: number,
        slideTitle: string
    }
}
```

#### `openLLMOffcanvas(promptData)`
Opens the offcanvas drawer with the specified prompt data.

**Parameters:**
- `promptData` (Object): Object with `title`, `text`, and `context` properties

#### `closeLLMOffcanvas()`
Closes the offcanvas drawer.

#### `addRunButtonsToPrompts()`
Scans the current slide for `.prompt-box` elements and adds Run buttons.

### CSS Classes

#### `.prompt-box`
Main container for prompt cards. Must have `position: relative` for Run button positioning.

#### `.run-prompt-btn`
The Run button that appears in the top-right corner of prompt boxes.

#### `.llm-offcanvas`
The offcanvas drawer container.

**States:**
- `.active` - Drawer is visible (slides in from right)

#### `.llm-offcanvas-overlay`
Semi-transparent backdrop behind the drawer.

**States:**
- `.active` - Overlay is visible

#### `.llm-offcanvas-header`
Header section of the drawer with title and close button.

#### `.llm-offcanvas-body`
Scrollable body section containing the prompt display and LLM runner.

#### `.llm-offcanvas-prompt-display`
Displays the prompt context (title, text, source slide).

## Customization

### Changing Drawer Width

Edit the CSS:

```css
.llm-offcanvas {
    width: 650px;        /* Default width */
    right: -650px;       /* Must match width */
}
```

### Changing Drawer Position

The drawer can slide in from any side by modifying:

```css
/* Left side */
.llm-offcanvas {
    left: -650px;
    right: auto;
}
.llm-offcanvas.active {
    left: 0;
}
```

### Customizing Run Button Appearance

```css
.run-prompt-btn {
    background: var(--ax-purple);  /* Button color */
    font-size: 0.75em;             /* Button size */
    top: 8px;                      /* Position from top */
    right: 8px;                    /* Position from right */
}
```

### Changing Animation Speed

```css
.llm-offcanvas {
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Testing Checklist

- [ ] Navigate to Slide 14 in the presentation
- [ ] Verify "Run" buttons appear on all three prompt boxes
- [ ] Click the first Run button (MVP Features)
  - [ ] Offcanvas drawer slides in smoothly
  - [ ] Prompt text is displayed in context box
  - [ ] Prompt text is pre-populated in the editor
  - [ ] Model selector is visible (for LLM type)
  - [ ] Run button works (requires backend server)
- [ ] Close drawer with × button
  - [ ] Drawer slides out smoothly
  - [ ] Overlay fades away
- [ ] Click second Run button (Radical Concepts)
  - [ ] Drawer opens with correct prompt text
- [ ] Close drawer by clicking overlay
- [ ] Click third Run button (UX & Business Models)
- [ ] Close drawer with Escape key
- [ ] Navigate to another slide
  - [ ] Drawer auto-closes if open
- [ ] Test on mobile viewport (< 768px width)
  - [ ] Drawer takes full width
  - [ ] Run buttons are appropriately sized

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- **reveal.js**: Core presentation framework
- **RevealLLMRunner plugin**: Provides the LLM runner interface
- **Backend server**: WebSocket server at `ws://localhost:8000/ws` for LLM execution

## Troubleshooting

### Run buttons don't appear

**Check:**
1. Elements have the `.prompt-box` class
2. JavaScript console for errors
3. `[LLM Offcanvas] Integration initialized` message appears in console

**Solution:**
```javascript
// Manually trigger button addition
Reveal.on('ready', function() {
    setTimeout(() => {
        document.querySelector('.prompt-box') &&
        console.log('Prompt boxes found:',
                   document.querySelectorAll('.prompt-box').length);
    }, 1000);
});
```

### Offcanvas doesn't open

**Check:**
1. Browser console for JavaScript errors
2. Offcanvas element exists in DOM
3. Click event is firing

**Solution:**
```javascript
// Test drawer manually
document.getElementById('llm-offcanvas').classList.add('active');
document.getElementById('llm-offcanvas-overlay').classList.add('active');
```

### LLM Runner doesn't initialize

**Check:**
1. RevealLLMRunner plugin is loaded
2. Plugin is in the plugins array
3. `enhanceRunners()` method exists

**Solution:**
```javascript
// Check plugin availability
const plugins = Reveal.getPlugins();
console.log('LLM Runner plugin:', plugins['llm-runner']);
console.log('Has enhanceRunners:',
           typeof plugins['llm-runner'].enhanceRunners === 'function');
```

### Drawer stays open when changing slides

**Check:**
1. `slidechanged` event listener is registered
2. No JavaScript errors blocking execution

**Solution:**
```javascript
// Manually add slide change handler
Reveal.on('slidechanged', () => {
    document.getElementById('llm-offcanvas')?.classList.remove('active');
    document.getElementById('llm-offcanvas-overlay')?.classList.remove('active');
});
```

## Performance Considerations

1. **Button Injection**: Run buttons are added on slide change, minimal performance impact
2. **DOM Elements**: Only one offcanvas drawer is created (reused for all prompts)
3. **Memory**: Prompt text is extracted on-demand, not cached
4. **Animations**: Hardware-accelerated CSS transforms for smooth 60fps animations

## Future Enhancements

- [ ] Support for multiple runner types (Python, mixed)
- [ ] Prompt history/favorites
- [ ] Prompt template variables (auto-replace [Problem 1], etc.)
- [ ] Export results to clipboard
- [ ] Share prompt + results
- [ ] Collaborative mode (multiple users)
- [ ] Offline mode with local LLM
- [ ] Voice input for prompts
- [ ] Prompt suggestions/auto-complete

## Related Documentation

- [LLM Runner Plugin](../plugin/llm-runner/README.md)
- [SmartArt Plugin](../plugin/smartart/README.md)
- [reveal.js Documentation](https://revealjs.com/)

## License

Same as revealX project license.

## Credits

Developed by AdaptiveX for the AI Product Discovery workshop presentation.
