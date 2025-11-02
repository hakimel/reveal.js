# XBackground Plugin for Reveal.js

A powerful Reveal.js plugin that enables React-powered animated backgrounds using React Portals. Create stunning presentations with live, interactive backgrounds inspired by effects from reactbits.dev.

## Features

- 🎨 **React-Powered Backgrounds**: Use any React component as a slide background
- 🚀 **React Portals**: Seamlessly integrate React components into the Reveal.js DOM
- 🎭 **Multiple Effects**: Includes 8+ pre-built animated backgrounds
- ⚡ **Performance Optimized**: Lazy loading, preloading, and automatic cleanup
- 🎛️ **Highly Configurable**: Presets and custom configurations for each background
- 🔄 **Smooth Transitions**: Fade effects between slide backgrounds
- 📱 **Responsive**: Backgrounds adapt to window resizing

## Installation

### Using npm

```bash
npm install reveal-xbackground
```

### Manual Installation

1. Download the plugin files
2. Include React and ReactDOM in your HTML
3. Import the plugin in your presentation

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="reveal.css">
    <link rel="stylesheet" href="theme/black.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <!-- Simple usage with preset -->
            <section data-xbackground="hyperspeed">
                <h1>Hyperspeed Background</h1>
            </section>
            
            <!-- With preset configuration -->
            <section data-xbackground="aurora:vibrant">
                <h2>Aurora with Vibrant Preset</h2>
            </section>
            
            <!-- Custom JSON configuration -->
            <section data-xbackground='{"type":"dot-grid","config":{"spacing":40}}'>
                <h2>Custom Dot Grid</h2>
            </section>
        </div>
    </div>
    
    <script src="react.production.min.js"></script>
    <script src="react-dom.production.min.js"></script>
    <script src="reveal.js"></script>
    <script type="module">
        import XBackground from './plugin/xbackground.js';
        
        Reveal.initialize({
            plugins: [ XBackground ],
            xbackground: {
                lazy: true,
                preload: 1,
                transitionDuration: 1000
            }
        });
    </script>
</body>
</html>
```

## Available Backgrounds

### 1. Hyperspeed
A star field effect with motion trails, perfect for futuristic themes.

```html
<section data-xbackground="hyperspeed">
<!-- or with presets: -->
<section data-xbackground="hyperspeed:fast">
<section data-xbackground="hyperspeed:slow">
<section data-xbackground="hyperspeed:dense">
```

### 2. Aurora
Northern lights effect with flowing color gradients.

```html
<section data-xbackground="aurora:vibrant">
<section data-xbackground="aurora:subtle">
<section data-xbackground="aurora:warm">
<section data-xbackground="aurora:cool">
```

### 3. Dark Veil
Mysterious particle effect with depth.

```html
<section data-xbackground="dark-veil:heavy">
<section data-xbackground="dark-veil:medium">
<section data-xbackground="dark-veil:light">
```

### 4. Dot Grid
Connected dot network with pulsing animation.

```html
<section data-xbackground="dot-grid:dense">
<section data-xbackground="dot-grid:normal">
<section data-xbackground="dot-grid:sparse">
```

### 5. Faulty Terminal
Retro terminal effect with glitch aesthetics.

```html
<section data-xbackground="faulty-terminal:glitchy">
<section data-xbackground="faulty-terminal:stable">
<section data-xbackground="faulty-terminal:retro">
```

### 6. Iridescence
Color-shifting rainbow effect.

```html
<section data-xbackground="iridescence:rainbow">
<section data-xbackground="iridescence:pastel">
<section data-xbackground="iridescence:deep">
```

### 7. Liquid Ether
Fluid dynamics simulation.

```html
<section data-xbackground="liquid-ether:calm">
<section data-xbackground="liquid-ether:flowing">
<section data-xbackground="liquid-ether:turbulent">
```

### 8. Dither
Retro pixel art style rendering.

```html
<section data-xbackground="dither:fine">
<section data-xbackground="dither:medium">
<section data-xbackground="dither:coarse">
<section data-xbackground="dither:retro">
```

## Configuration

### Plugin Configuration

Initialize the plugin with custom settings:

```javascript
Reveal.initialize({
    plugins: [ XBackground ],
    xbackground: {
        // Selector for slides with backgrounds
        selector: '[data-xbackground]',
        
        // Transition type: 'fade', 'slide', 'zoom'
        transition: 'fade',
        
        // Transition duration in milliseconds
        transitionDuration: 1000,
        
        // Lazy load backgrounds (recommended for performance)
        lazy: true,
        
        // Number of slides to preload ahead
        preload: 1,
        
        // Show backgrounds in overview mode
        showInOverview: true,
        
        // Debug mode (logs to console)
        debug: false
    }
});
```

### Custom Background Configuration

Use JSON format for detailed configuration:

```html
<section data-xbackground='{
    "type": "hyperspeed",
    "config": {
        "speed": 2,
        "stars": 500,
        "trails": true
    }
}'>
```

## API

Access the plugin API for programmatic control:

```javascript
const xbg = Reveal.getPlugin('xbackground');

// Manually activate a background
xbg.activateBackground(slideElement);

// Deactivate a background
xbg.deactivateBackground(slideElement);

// Mount a background (if lazy loaded)
xbg.mountBackground(slideElement);

// Unmount a background (free memory)
xbg.unmountBackground(slideElement);
```

## Creating Custom Backgrounds

Add your own React components as backgrounds:

```javascript
// 1. Create your React component
const CustomBackground = ({ color, speed, isVisible }) => {
    return (
        <div style={{ 
            background: color, 
            animation: isVisible ? `pulse ${speed}s infinite` : 'none' 
        }}>
            Custom Background Content
        </div>
    );
};

// 2. Register the component
import { BackgroundRegistry } from './backgrounds/index.js';
BackgroundRegistry['custom'] = CustomBackground;

// 3. Use in your slides
<section data-xbackground='{"type":"custom","config":{"color":"blue","speed":2}}'>
```

## Performance Optimization

### Lazy Loading
By default, backgrounds are loaded only when needed:

```javascript
xbackground: {
    lazy: true,  // Enable lazy loading
    preload: 1   // Preload next slide
}
```

### Memory Management
The plugin automatically cleans up distant slides to save memory:
- Active slide background is always loaded
- Configurable number of slides preloaded ahead
- Distant slides are unmounted when not in view

### Best Practices
1. Use lazy loading for presentations with many backgrounds
2. Keep `preload` value low (1-2) for better performance
3. Use subtle effects for text-heavy slides
4. Test performance on target devices

## Styling

### Ensure Text Readability

Add text shadows for better contrast:

```css
.reveal h1, .reveal h2, .reveal h3 {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.reveal p, .reveal li {
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}
```

### Custom Background Container Styles

```css
.xbackground-container {
    /* Customize container styles */
    filter: blur(2px);
    opacity: 0.7;
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires React 18+
- Requires Reveal.js 5.0+

## Troubleshooting

### Background Not Appearing
- Check console for errors
- Ensure React and ReactDOM are loaded before the plugin
- Verify the background type exists in the registry

### Performance Issues
- Enable lazy loading
- Reduce preload count
- Simplify complex animations
- Use CSS transforms instead of JavaScript animations when possible

### Text Not Readable
- Add text shadows
- Adjust background opacity
- Use subtle presets for text-heavy slides

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- Inspired by backgrounds from [reactbits.dev](https://reactbits.dev)
- Built for [Reveal.js](https://revealjs.com)
- Powered by [React](https://react.dev)

## Links

- [GitHub Repository](https://github.com/yourusername/reveal-xbackground)
- [Demo Presentation](https://yourusername.github.io/reveal-xbackground/demo)
- [Report Issues](https://github.com/yourusername/reveal-xbackground/issues)
