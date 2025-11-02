# XShadcn Plugin for Reveal.js

A powerful Reveal.js plugin that seamlessly integrates shadcn/ui components using React Portals. Build interactive, beautiful presentations with production-ready UI components.

## Features

- 🎨 **30+ shadcn/ui Components**: Buttons, Cards, Forms, Charts, and more
- ⚛️ **React Portals Integration**: Clean separation between Reveal.js and React
- 🎭 **Interactive Components**: Full interactivity in presentation mode
- 🔄 **State Management**: Share state between components and slides
- 🎯 **Fragment Support**: Components work with reveal.js fragments
- 🌙 **Theme Support**: Light/dark mode with full theming
- ⚡ **Performance Optimized**: Components mount/unmount based on slide visibility
- 📱 **Responsive**: All components are mobile-friendly

## Installation

### Using npm

```bash
npm install xshadcn-plugin
```

### Manual Installation

1. Download the plugin files
2. Include React, ReactDOM, and Tailwind CSS
3. Import the plugin in your presentation

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="reveal.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <!-- Inline component -->
            <section>
                <h2>Interactive Demo</h2>
                <span data-xshadcn="button">Click Me</span>
            </section>
            
            <!-- Component with configuration -->
            <section>
                <span data-xshadcn='{"component":"Card","props":{"className":"p-6"}}'>
                    Card Content
                </span>
            </section>
            
            <!-- Slide-level component -->
            <section data-xshadcn-slide='{"component":"Card"}'>
                <h1>Wrapped in Card</h1>
            </section>
        </div>
    </div>
    
    <script src="react.production.min.js"></script>
    <script src="react-dom.production.min.js"></script>
    <script src="reveal.js"></script>
    <script type="module">
        import XShadcn from './plugin/xshadcn.js';
        
        Reveal.initialize({
            plugins: [ XShadcn ],
            xshadcn: {
                theme: 'light',
                interactive: true
            }
        });
    </script>
</body>
</html>
```

## Component Usage

### Inline Components

Use `data-xshadcn` attribute on any element:

```html
<!-- Simple component -->
<span data-xshadcn="button">Click Me</span>

<!-- With variant -->
<span data-xshadcn="button:primary">Primary Button</span>

<!-- With full configuration -->
<span data-xshadcn='{
    "component": "Button",
    "variant": "outline",
    "props": {
        "size": "lg",
        "className": "custom-class"
    }
}'>Large Outline Button</span>
```

### Slide-Level Components

Wrap entire slides with components:

```html
<section data-xshadcn-slide='{"component":"Card"}'>
    <h1>This slide is wrapped in a Card</h1>
    <p>All content appears inside the card</p>
</section>
```

### Fragment Support

Components work with reveal.js fragments:

```html
<section>
    <h2>Progressive Reveal</h2>
    <div class="fragment">
        <span data-xshadcn="button">Appears on click</span>
    </div>
</section>
```

## Available Components

### Core Components
- **Button**: Interactive buttons with multiple variants
- **Card**: Container component with header/footer
- **Badge**: Status indicators and labels
- **Alert**: Notification messages

### Form Components
- **Input**: Text input field
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Toggle checkbox
- **Switch**: Toggle switch
- **Slider**: Range slider
- **RadioGroup**: Radio button group

### Data Display
- **Table**: Data tables
- **Chart**: Bar and line charts
- **Progress**: Progress bars
- **Metrics**: Metric cards with trends

### Feedback
- **Toast**: Toast notifications
- **Dialog**: Modal dialogs
- **Sheet**: Side sheets
- **Popover**: Popover content
- **Tooltip**: Hover tooltips

### Custom Presentation Components
- **Terminal**: Terminal/console display
- **Timeline**: Timeline visualization
- **StatCard**: Statistics display card
- **LiveCode**: Live code editor
- **Browser**: Browser mockup

## Configuration

### Plugin Options

```javascript
Reveal.initialize({
    xshadcn: {
        // Theme: 'light', 'dark', or 'system'
        theme: 'light',
        
        // Default animation: 'fade', 'slide', 'zoom', 'none'
        defaultAnimation: 'fade',
        
        // Animation duration in milliseconds
        animationDuration: 300,
        
        // Allow user interaction with components
        interactive: true,
        
        // Enable data binding between components
        dataBinding: true,
        
        // Unmount components when leaving slide
        unmountOnExit: false,
        
        // Initial global state
        globalState: {
            counter: 0,
            userName: ''
        },
        
        // Debug mode
        debug: false
    }
});
```

## State Management

### Global State

Share state between components across slides:

```javascript
// In your initialization
xshadcn: {
    globalState: {
        counter: 0
    }
}

// Components can bind to global state
<span data-xshadcn='{
    "component": "Button",
    "props": {
        "bindToGlobal": true
    }
}'>Updates Global State</span>
```

### Accessing State Programmatically

```javascript
const xshadcn = Reveal.getPlugin('xshadcn');

// Get global state
const state = xshadcn.getGlobalState();
const counter = xshadcn.getGlobalState('counter');

// Set global state
xshadcn.setGlobalState('counter', 5);

// Update component props
xshadcn.updateComponentProps('0-0', { 
    disabled: true 
});
```

## Component Examples

### Interactive Button with Counter

```html
<span data-xshadcn='{
    "component": "Button",
    "props": {
        "onClick": "console.log(\"Clicked!\")"
    }
}'>Click Counter</span>
```

### Metrics Dashboard

```html
<div class="grid grid-cols-3 gap-4">
    <span data-xshadcn='{
        "component": "Metrics",
        "props": {
            "title": "Revenue",
            "value": "$45,231",
            "change": 12.5
        }
    }'></span>
    
    <span data-xshadcn='{
        "component": "Metrics",
        "props": {
            "title": "Users",
            "value": "2,350",
            "change": -4.3
        }
    }'></span>
</div>
```

### Chart Visualization

```html
<span data-xshadcn='{
    "component": "Chart",
    "props": {
        "type": "bar",
        "data": [
            {"label": "Q1", "value": 65},
            {"label": "Q2", "value": 85},
            {"label": "Q3", "value": 75},
            {"label": "Q4", "value": 95}
        ]
    }
}'></span>
```

### Terminal Component

```html
<span data-xshadcn='{
    "component": "Terminal",
    "props": {
        "commands": [
            {"prompt": true, "text": "npm install"},
            {"type": "output", "text": "Installing dependencies..."},
            {"type": "output", "text": "✓ Complete"}
        ]
    }
}'></span>
```

## API Reference

### Plugin Methods

#### `mountComponent(componentId)`
Manually mount a component.

#### `unmountComponent(componentId)`
Manually unmount a component.

#### `updateComponentProps(componentId, props)`
Update component properties.

#### `getGlobalState(key?)`
Get global state or specific key.

#### `setGlobalState(key, value)`
Set global state value.

### Events

The plugin emits custom events:

```javascript
// Component mounted
Reveal.on('xshadcn-mounted', (event) => {
    console.log('Mounted:', event.data.componentId);
});

// Component unmounted
Reveal.on('xshadcn-unmounted', (event) => {
    console.log('Unmounted:', event.data.componentId);
});
```

## Styling

### Custom Styles

Components use Tailwind CSS classes. Customize with:

```css
/* Override component styles */
.xshadcn-container .btn {
    /* Your custom styles */
}

/* Theme-specific styles */
.dark .xshadcn-container {
    /* Dark mode overrides */
}
```

### CSS Variables

Customize shadcn/ui theme variables:

```css
:root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --accent: 210 40% 96.1%;
    --radius: 0.5rem;
}
```

## Advanced Usage

### Creating Custom Components

Add your own components to the registry:

```javascript
// In your component file
export const CustomComponent = ({ title, ...props }) => {
    return (
        <div className="custom-component" {...props}>
            <h3>{title}</h3>
        </div>
    );
};

// Register the component
import { ComponentRegistry } from './plugin/components/registry.js';
ComponentRegistry['CustomComponent'] = CustomComponent;
```

### Component Composition

Combine multiple components:

```html
<div class="flex gap-4">
    <span data-xshadcn="input:email"></span>
    <span data-xshadcn="button:primary">Subscribe</span>
</div>
```

## Best Practices

1. **Performance**: Use `unmountOnExit` for presentations with many components
2. **Accessibility**: Components maintain ARIA attributes
3. **Responsive**: Test on different screen sizes
4. **State**: Use global state sparingly for better performance
5. **Animations**: Match animation duration with slide transitions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires React 18+
- Requires Reveal.js 5.0+

## Troubleshooting

### Components Not Rendering
- Ensure React and ReactDOM are loaded before the plugin
- Check console for errors
- Verify component names in registry

### Styling Issues
- Tailwind CSS must be loaded
- Check for CSS conflicts with reveal.js themes
- Use specific class names to override styles

### State Not Updating
- Ensure `dataBinding` is enabled
- Check component has `bindToGlobal` prop
- Verify state key names match

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- Built for [Reveal.js](https://revealjs.com)
- Components from [shadcn/ui](https://ui.shadcn.com)
- Powered by [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## Support

- [GitHub Issues](https://github.com/yourusername/xshadcn-plugin/issues)
- [Documentation](https://xshadcn-docs.com)
- [Examples](https://github.com/yourusername/xshadcn-plugin/tree/main/examples)
