# XShadcn Plugin - Build Documentation

## Overview

This document describes the webpack build system for the XShadcn Reveal.js plugin. The build system bundles the plugin source code and React components into a single ES module file for distribution.

## Build Configuration

### Files

- **webpack.config.cjs** - Main webpack configuration
- **.babelrc** - Babel configuration for JSX transformation
- **package.json** - Dependencies and build scripts
- **plugin/** - Source files
- **dist/** - Built output files

### Output Structure

```
plugin/xshadcn/
├── plugin/                    # Source files
│   ├── xshadcn.js            # Main plugin entry point
│   └── components/           # React components
│       ├── index.js          # Component implementations
│       ├── registry.js       # Component registry
│       ├── theme-provider.js # Theme context provider
│       └── utils.js          # Utility functions
├── dist/                      # Build output (generated)
│   ├── xshadcn.js            # Bundled plugin (ES module)
│   ├── xshadcn.js.map        # Source map
│   └── xshadcn.js.LICENSE.txt # License information
├── webpack.config.cjs         # Webpack configuration
├── .babelrc                   # Babel configuration
└── package.json              # Project dependencies
```

## Build Process

### Prerequisites

All dependencies are already installed. The key dev dependencies are:

- webpack ^5.89.0
- webpack-cli ^5.1.4
- babel-loader ^9.1.3
- @babel/core ^7.23.0
- @babel/preset-react ^7.23.0

### Build Commands

#### Production Build
```bash
npm run build
```
- Creates optimized, minified output
- Generates source maps
- Output: `dist/xshadcn.js`

#### Development Build
```bash
npm run dev
```
- Creates unminified output with detailed source maps
- Watches for file changes
- Auto-rebuilds on save

#### Development Server
```bash
npm run serve
```
- Starts webpack dev server on port 9000
- Hot module replacement enabled
- Serves files with CORS headers

## Configuration Details

### Entry Point
```javascript
entry: './plugin/xshadcn.js'
```

### Output Configuration
```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'xshadcn.js',
  library: {
    type: 'module'  // ES module output
  }
}
```

### External Dependencies

The following dependencies are marked as external (must be loaded via CDN):

- **react** - React library
- **react-dom** - ReactDOM library
- **react-dom/client** - ReactDOM client for React 18
- **clsx** - Class name utility
- **tailwind-merge** - Tailwind CSS class merging

These must be available in the HTML file before loading the plugin.

### Babel Configuration

JSX is transformed using @babel/preset-react with automatic runtime:

```json
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

This means:
- No need to import React in component files
- JSX is automatically transformed
- Smaller bundle size

## Usage

### Loading in HTML

```html
<!-- 1. Load external dependencies -->
<script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>

<!-- 2. Load Reveal.js -->
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>

<!-- 3. Load the plugin as ES module -->
<script type="module">
  import XShadcnPlugin from './dist/xshadcn.js';

  Reveal.initialize({
    plugins: [ XShadcnPlugin() ]
  });
</script>
```

### Alternative: Using importmap

For better dependency management, you can use import maps:

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "clsx": "https://esm.sh/clsx@2.0.0",
    "tailwind-merge": "https://esm.sh/tailwind-merge@2.0.0"
  }
}
</script>

<script type="module">
  import XShadcnPlugin from './dist/xshadcn.js';

  Reveal.initialize({
    plugins: [ XShadcnPlugin() ]
  });
</script>
```

## Optimization

### Production Optimizations

The production build includes:

1. **Minification** - Code is minified for smaller file size
2. **Tree Shaking** - Unused code is eliminated
3. **Source Maps** - Debugging support with original source locations
4. **Module Concatenation** - Modules are merged for better performance

### Bundle Size

Current production build:
- Main bundle: ~22 KB (minified)
- Source map: ~67 KB
- License info: ~249 bytes

### Performance Tips

1. **Use CDN for dependencies** - React and ReactDOM are large; load from CDN
2. **Enable caching** - The built file has a stable output for browser caching
3. **Use production builds** - Always use production builds in deployment
4. **Defer loading** - Load the plugin after Reveal.js is ready

## Development Workflow

### Making Changes

1. Edit source files in `plugin/` directory
2. Run `npm run dev` to watch for changes
3. Refresh your browser to see updates

### Adding New Components

1. Add component to `plugin/components/index.js`
2. Register in `plugin/components/registry.js`
3. Build with `npm run build`
4. Test in example HTML file

### Debugging

Enable debug mode in Reveal.js config:

```javascript
Reveal.initialize({
  xshadcn: {
    debug: true  // Enables console logging
  }
});
```

Use source maps for debugging:
- Chrome DevTools will show original source files
- Set breakpoints in unminified code
- Step through original JSX code

## Troubleshooting

### Build Fails

**Error: "Can't resolve './src'"**
- Solution: Entry point is `./plugin/xshadcn.js`, not `./src`
- Check `webpack.config.cjs` entry setting

**Error: "require is not defined in ES module scope"**
- Solution: Use `.cjs` extension for webpack config
- Package.json has `"type": "module"`

**Error: "Cannot read properties of undefined"**
- Solution: Check external dependencies configuration
- Use `externalsType: 'module'` for ES module output

### Runtime Issues

**Components not rendering**
- Check React/ReactDOM are loaded before plugin
- Verify correct version (18.x)
- Check browser console for errors

**Module not found**
- Ensure `type="module"` in script tag
- Check file paths are correct
- Verify server supports ES modules

## CI/CD Integration

### Build Script for Deployment

```bash
#!/bin/bash
cd plugin/xshadcn
npm ci              # Install exact dependencies
npm run build       # Build production bundle
# Copy dist/ to deployment location
```

### GitHub Actions Example

```yaml
name: Build Plugin
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd plugin/xshadcn && npm ci
      - name: Build
        run: cd plugin/xshadcn && npm run build
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: xshadcn-dist
          path: plugin/xshadcn/dist/
```

## Version Management

When releasing new versions:

1. Update version in `package.json`
2. Run `npm run build`
3. Commit both source and dist files
4. Tag the release: `git tag v1.0.0`
5. Push: `git push --tags`

## License

The built output includes license information in `xshadcn.js.LICENSE.txt` which is automatically generated from package dependencies.
