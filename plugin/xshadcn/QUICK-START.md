# XShadcn Plugin - Quick Start Guide

## Build the Plugin

```bash
cd plugin/xshadcn
npm run build
```

Output: `dist/xshadcn.js` (22 KB minified)

## Development Mode

Watch for changes and auto-rebuild:

```bash
npm run dev
```

## Build Commands Reference

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run build` | Production build (minified) | `dist/xshadcn.js` |
| `npm run dev` | Development build (watch mode) | `dist/xshadcn.js` |
| `npm run serve` | Dev server with HMR | `http://localhost:9000` |

## File Structure

```
plugin/xshadcn/
├── plugin/               # Source code (edit these)
│   ├── xshadcn.js       # Main plugin
│   └── components/      # React components
├── dist/                # Build output (generated)
│   └── xshadcn.js      # Bundled file
├── webpack.config.cjs   # Build configuration
├── .babelrc            # JSX transformation
└── package.json        # Dependencies
```

## What Got Fixed

1. **Created webpack.config.cjs** - Proper ES module output configuration
2. **Created .babelrc** - JSX transformation with automatic runtime
3. **Fixed circular dependencies** - Created `utils.js` for shared utilities
4. **Configured externals** - React/ReactDOM loaded from CDN
5. **Set up source maps** - For debugging in production

## Key Configuration Details

### Webpack Config (`webpack.config.cjs`)

- **Entry**: `./plugin/xshadcn.js`
- **Output**: ES module format (`type: 'module'`)
- **Externals**: react, react-dom, clsx, tailwind-merge
- **Babel**: Automatic JSX runtime (no React import needed)

### External Dependencies

Must be loaded via CDN before the plugin:
- React 18.2.0
- ReactDOM 18.2.0
- clsx 2.0.0
- tailwind-merge 2.0.0

### Source Maps

- **Production**: Full source maps (`.map` files)
- **Development**: Eval source maps (faster rebuilds)

## Testing the Build

Open `test-build.html` in a browser:

```bash
# Start a local server
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000/test-build.html
```

## Common Issues

### Build fails with "Can't resolve"
- Check import paths in source files
- Verify all files exist

### "require is not defined"
- Config file must be `.cjs` not `.js`
- Package.json has `"type": "module"`

### Components don't render
- Ensure React/ReactDOM loaded before plugin
- Check browser console for errors
- Verify script tag has `type="module"`

## Next Steps

1. ✅ Build succeeds: `npm run build`
2. ✅ Output is ES module: Check `dist/xshadcn.js`
3. ✅ Source maps generated: Check `dist/xshadcn.js.map`
4. Test in browser: Open `test-build.html`
5. Deploy: Copy `dist/xshadcn.js` to your server

## Production Deployment

```bash
# Build production version
npm run build

# Copy to deployment location
cp dist/xshadcn.js /path/to/deployment/

# Or use in HTML
<script type="module">
  import XShadcnPlugin from './dist/xshadcn.js';
  Reveal.initialize({
    plugins: [ XShadcnPlugin() ]
  });
</script>
```

## Build Performance

- **Production build**: ~500-900ms
- **Output size**: ~22 KB (minified)
- **Source map**: ~67 KB
- **Total assets**: 3 files

## Additional Resources

- **BUILD.md** - Comprehensive build documentation
- **README.md** - Plugin usage and API
- **webpack.config.cjs** - Build configuration details
