# XShadcn Plugin Integration Guide

## Overview

The XShadcn plugin has been successfully integrated into your RevealX project! This plugin enables interactive shadcn/ui components in your Reveal.js presentations using React Portals.

## 🎯 Quick Start

### Adding to Existing Presentations

Add these lines to any existing presentation HTML file:

```html
<!-- In the <head> section, add Tailwind CSS (if not already included) -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet">

<!-- Before closing </body> tag, add React dependencies -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Import and initialize the plugin -->
<script type="module">
    import XShadcn from '../plugin/xshadcn/dist/xshadcn.js';

    Reveal.initialize({
        // Your existing config...

        // Add XShadcn configuration
        xshadcn: {
            theme: 'light',
            interactive: true,
            defaultAnimation: 'fade'
        },

        // Add to plugins array
        plugins: [ /* your existing plugins */, XShadcn ]
    });
</script>
```

## 📦 Plugin Structure

```
plugin/xshadcn/
├── dist/
│   └── xshadcn.js          # Built plugin (22 KB) - USE THIS
├── plugin/
│   ├── xshadcn.js          # Source code
│   └── components/          # Component implementations
├── webpack.config.cjs       # Build configuration
├── package.json
└── README.md               # Full documentation
```

## 🎨 Component Usage Examples

### 1. Interactive Buttons

```html
<!-- Simple button -->
<span data-xshadcn="button">Click Me</span>

<!-- Button with variant -->
<span data-xshadcn="button:primary">Primary Button</span>

<!-- Button with full configuration -->
<span data-xshadcn='{
    "component": "Button",
    "variant": "outline",
    "props": {
        "size": "lg",
        "className": "custom-class"
    }
}'>Large Outline Button</span>
```

### 2. Cards

```html
<!-- Simple card wrapper -->
<section data-xshadcn-slide='{"component":"Card"}'>
    <h1>This slide is wrapped in a Card</h1>
    <p>All content appears inside the card</p>
</section>

<!-- Inline card -->
<span data-xshadcn='{"component":"Card","props":{"className":"p-6 max-w-md"}}'>
    Card Content Here
</span>
```

### 3. Form Components

```html
<!-- Input field -->
<span data-xshadcn='{
    "component":"Input",
    "props":{"placeholder":"Enter your name"}
}'></span>

<!-- Switch toggle -->
<span data-xshadcn="switch"></span>

<!-- Slider -->
<span data-xshadcn='{
    "component":"Slider",
    "props":{"min":0,"max":100}
}'></span>
```

### 4. Data Visualization

```html
<!-- Metrics card -->
<span data-xshadcn='{
    "component":"Metrics",
    "props":{
        "title":"Revenue",
        "value":"$45,231",
        "change":12.5
    }
}'></span>

<!-- Bar chart -->
<span data-xshadcn='{
    "component":"Chart",
    "props":{
        "type":"bar",
        "data":[
            {"label":"Q1","value":65},
            {"label":"Q2","value":85},
            {"label":"Q3","value":75},
            {"label":"Q4","value":95}
        ]
    }
}'></span>
```

### 5. Terminal Component

```html
<span data-xshadcn='{
    "component":"Terminal",
    "props":{
        "commands":[
            {"prompt":true,"text":"npm install"},
            {"type":"output","text":"Installing dependencies..."},
            {"type":"output","text":"✓ Complete"}
        ]
    }
}'></span>
```

### 6. Timeline

```html
<span data-xshadcn='{
    "component":"Timeline",
    "props":{
        "events":[
            {"date":"2024-01","title":"Project Started","description":"Initial planning phase"},
            {"date":"2024-03","title":"MVP Launch","description":"First public release"},
            {"date":"2024-06","title":"Major Update","description":"Added new features"}
        ]
    }
}'></span>
```

## 🔧 Available Components

### Core Components
- **Button**: Interactive buttons with variants (default, outline, ghost, destructive)
- **Card**: Container component with header/footer
- **Badge**: Status indicators and labels
- **Alert**: Notification messages

### Form Components
- **Input**: Text input field
- **Switch**: Toggle switch
- **Slider**: Range slider
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Checkbox toggle
- **RadioGroup**: Radio button group

### Data Display
- **Chart**: Bar and line charts
- **Progress**: Progress bars
- **Metrics**: Metric cards with trends
- **Table**: Data tables
- **StatCard**: Statistics display card

### Presentation Components
- **Terminal**: Terminal/console display
- **Timeline**: Timeline visualization
- **LiveCode**: Live code editor display

## ⚙️ Configuration Options

```javascript
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
```

## 💡 Integration with Existing Presentations

### For AI Product Discovery Presentation

Add interactive components to enhance your presentation:

```html
<!-- Add metrics dashboard -->
<section>
    <h2>Impact Metrics</h2>
    <div class="grid grid-cols-3 gap-4">
        <span data-xshadcn='{
            "component":"Metrics",
            "props":{"title":"Time Saved","value":"40%","change":15}
        }'></span>
        <span data-xshadcn='{
            "component":"Metrics",
            "props":{"title":"Ideas Generated","value":"120+","change":25}
        }'></span>
        <span data-xshadcn='{
            "component":"Metrics",
            "props":{"title":"Success Rate","value":"85%","change":10}
        }'></span>
    </div>
</section>

<!-- Add interactive demo -->
<section>
    <h2>Try It Yourself</h2>
    <div class="flex gap-4 justify-center">
        <span data-xshadcn='{
            "component":"Input",
            "props":{"placeholder":"Enter a product idea"}
        }'></span>
        <span data-xshadcn='{
            "component":"Button",
            "variant":"default"
        }'>Generate Insights</span>
    </div>
</section>
```

## 🔨 Development

### Building the Plugin

```bash
# Navigate to plugin directory
cd plugin/xshadcn

# Install dependencies
npm install

# Production build
npm run build

# Development build with watch mode
npm run dev

# Development server with HMR
npm run serve
```

### File Structure

- **Source**: `plugin/xshadcn/plugin/xshadcn.js`
- **Components**: `plugin/xshadcn/plugin/components/`
- **Built Output**: `plugin/xshadcn/dist/xshadcn.js`
- **Build Config**: `plugin/xshadcn/webpack.config.cjs`

## 📚 Examples

### Full Demo
View the complete demo at: `examples/xshadcn-demo.html`

Open in browser:
```
http://localhost:8000/examples/xshadcn-demo.html
```

### Minimal Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="../dist/reveal.css">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section>
                <h2>Interactive Demo</h2>
                <span data-xshadcn="button">Click Me</span>
            </section>
        </div>
    </div>

    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="../dist/reveal.js"></script>

    <script type="module">
        import XShadcn from '../plugin/xshadcn/dist/xshadcn.js';
        Reveal.initialize({ plugins: [ XShadcn ] });
    </script>
</body>
</html>
```

## 🎯 Best Practices

1. **Performance**: Use `unmountOnExit: true` for presentations with many components
2. **Accessibility**: Components maintain ARIA attributes
3. **Responsive**: Test on different screen sizes
4. **State**: Use global state sparingly for better performance
5. **Animations**: Match animation duration with slide transitions

## 🐛 Troubleshooting

### Components Not Rendering
- Ensure React and ReactDOM are loaded before the plugin
- Check browser console for errors
- Verify component names match registry

### Styling Issues
- Tailwind CSS must be loaded
- Check for CSS conflicts with reveal.js themes
- Use specific class names to override styles

### Build Errors
- Run `npm install` in plugin/xshadcn directory
- Check webpack.config.cjs for correct paths
- Verify all dependencies are installed

## 📖 Documentation

- **Full README**: `plugin/xshadcn/README.md`
- **Build Guide**: `plugin/xshadcn/BUILD.md`
- **Quick Start**: `plugin/xshadcn/QUICK-START.md`
- **Webpack Setup**: `plugin/xshadcn/WEBPACK-SETUP-SUMMARY.md`

## 🚀 Next Steps

1. Test the demo presentation at `examples/xshadcn-demo.html`
2. Add interactive components to your existing presentations
3. Customize component styles with Tailwind classes
4. Explore the full component library in the README

## 📝 Notes

- The plugin is built and ready to use - no additional setup required
- All dependencies are properly configured
- Components are fully interactive and work with Reveal.js fragments
- The plugin uses React Portals for clean DOM management
- Source maps are included for debugging

Happy presenting! 🎉
