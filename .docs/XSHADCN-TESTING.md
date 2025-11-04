# XShadcn Plugin Testing Guide

## Quick Test

1. **Start Local Server**:
   ```bash
   cd D:\Users\scale\Code\revealX
   python -m http.server 8080
   ```

2. **Open Test Files**:
   - Minimal Test: http://localhost:8080/examples/xshadcn-minimal-test.html
   - Full Demo: http://localhost:8080/examples/xshadcn-demo.html

3. **Check for Errors**:
   - Open browser DevTools (F12)
   - Look for errors in the Console tab
   - Should see: "✓ XShadcn plugin loaded"

## Expected Results

### Minimal Test Page
- Title: "XShadcn Test"
- One blue "Click Me" button
- Console shows:
  ```
  XShadcn module loaded: {id: "xshadcn", init: ƒ, destroy: ƒ, ...}
  ✓ Reveal.js ready
  ✓ XShadcn plugin loaded
  ```

### Full Demo Page
- Multiple slides with various components
- Buttons, cards, badges, charts, etc.
- All components should be interactive
- No console errors

## Common Issues & Solutions

### Issue 1: Import Map Not Supported
**Error**: `Uncaught TypeError: Failed to resolve module specifier "react"`

**Solution**: Use a modern browser:
- Chrome 89+
- Edge 89+
- Firefox 108+
- Safari 16.4+

### Issue 2: Module Not Found
**Error**: `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"`

**Solution**:
- Ensure you're using a web server (not file://)
- Check server configuration for .js MIME type

### Issue 3: CORS Errors
**Error**: `Access to fetch at 'https://esm.sh/react@18.2.0' from origin 'http://localhost:8080' has been blocked by CORS`

**Solution**: This should not occur with esm.sh, but if it does:
- Check your internet connection
- Try a different CDN
- Or bundle dependencies into the plugin

### Issue 4: Cached Old Version
**Symptom**: Still seeing old errors after applying fix

**Solution**:
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or clear browser cache completely
- Or open in incognito/private window

## Testing Checklist

- [ ] Server running on http://localhost:8080
- [ ] xshadcn-minimal-test.html loads without errors
- [ ] Button component renders
- [ ] xshadcn-demo.html loads without errors
- [ ] All slides display components
- [ ] Components are interactive (clickable)
- [ ] No console errors
- [ ] Hard refresh tested
- [ ] Works in Chrome/Edge/Firefox

## Browser DevTools Debugging

### Check Module Loading
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "JS"
4. Look for:
   - `xshadcn.js` - should load successfully
   - `react@18.2.0` - should load from esm.sh
   - `react-dom@18.2.0` - should load from esm.sh

### Check Console Messages
Expected console output:
```
XShadcn module loaded: {id: "xshadcn", init: ƒ, ...}
XShadcn Plugin initialized with config: {theme: "light", ...}
✓ Reveal.js ready
✓ XShadcn plugin loaded
Component mounted: 0-0
Component mounted: 0-1
...
```

### Check for Errors
Common error patterns to look for:
- ❌ `SyntaxError: Invalid left-hand side in assignment` - OLD ERROR (should be fixed)
- ❌ `Failed to resolve module specifier` - Import map issue
- ❌ `is not a function` - Wrong React version or loading issue

## Performance Notes

The first load may be slower because:
1. esm.sh needs to transpile modules on-demand
2. Multiple CDN requests for dependencies
3. No caching on first visit

Subsequent loads should be fast due to browser caching.

## Production Considerations

For production deployments, consider:

1. **Bundle Dependencies**: Don't rely on import maps, bundle everything
   ```bash
   # Modify webpack config to remove externals
   cd plugin/xshadcn
   npm run build
   ```

2. **Self-Host Dependencies**: Download React and other deps
   ```html
   <script type="importmap">
   {
       "imports": {
           "react": "/vendor/react.js",
           "react-dom": "/vendor/react-dom.js"
       }
   }
   </script>
   ```

3. **Use a Build Tool**: Vite, Parcel, or Rollup for optimized builds

## Troubleshooting Commands

### Check File Timestamps
```bash
ls -la D:\Users\scale\Code\revealX\plugin\xshadcn\dist\xshadcn.js
```
Last modified should be recent if you rebuilt.

### Verify Plugin Build
```bash
cd D:\Users\scale\Code\revealX\plugin\xshadcn
npm run build
```
Should complete without errors.

### Check Server Logs
```bash
tail -f server.log
```
Look for 404 errors or other issues.

### Test Import Map Separately
Create test-importmap.html:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Import Map Test</title>
</head>
<body>
    <h1>Import Map Test</h1>
    <script type="importmap">
    {
        "imports": {
            "react": "https://esm.sh/react@18.2.0"
        }
    }
    </script>
    <script type="module">
        import React from 'react';
        console.log('React loaded:', React);
        document.body.innerHTML += '<p>React version: ' + React.version + '</p>';
    </script>
</body>
</html>
```

## Success Criteria

✓ Page loads without blank screen
✓ No console errors
✓ Components render correctly
✓ Components are interactive
✓ Navigation between slides works
✓ Fragments work (components appear/disappear)
✓ State management works (counter example)

## Contact

If you continue to experience issues:
1. Check browser version
2. Try a different browser
3. Check internet connection (CDN access)
4. Review the XSHADCN-FIX-SUMMARY.md document
5. Check webpack build output for errors
