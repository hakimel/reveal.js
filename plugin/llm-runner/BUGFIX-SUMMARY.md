# LLM Runner Plugin - Bug Fix Summary

## Date: 2025-11-02

## Issues Fixed

### 1. CSS MIME Type Error (404 Not Found)

**Problem:**
```
Refused to apply style from 'http://localhost:8000/examples/plugin/llm-runner/llm-runner.css'
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Root Cause:**
The JavaScript file (`llm-runner.js`) hardcoded the CSS path as `plugin/llm-runner/llm-runner.css`, which is relative to the project root. When the demo HTML file is located in `examples/llm-runner-demo.html`, the browser tried to load the CSS from the wrong path, resulting in a 404 error (HTML error page returned instead of CSS).

**Solution:**
Modified `llm-runner.js` to dynamically calculate the CSS path based on the script's own location:

```javascript
// Before (hardcoded path from root):
link.href = 'plugin/llm-runner/llm-runner.css';

// After (dynamic path resolution):
const scripts = document.getElementsByTagName('script');
let scriptPath = '';
for (let script of scripts) {
    if (script.src && script.src.includes('llm-runner.js')) {
        scriptPath = script.src.substring(0, script.src.lastIndexOf('/'));
        break;
    }
}
link.href = scriptPath + '/llm-runner.css';
```

This ensures the CSS is always loaded from the same directory as the JavaScript file, regardless of where the HTML file is located.

**File Modified:**
- `D:\Users\scale\Code\revealX\plugin\llm-runner\llm-runner.js` (lines 354-373)

---

### 2. WebSocket Connection Failures

**Problem:**
```
WebSocket connection to 'ws://localhost:8000/ws' failed
[LLM Runner] WebSocket error: Event
[LLM Runner] Disconnected from server
[LLM Runner] Reconnecting... (1/5)
```

**Root Cause:**
Port conflict - the npm server (running `npm start`) serves static files on port 8000 but doesn't have WebSocket support or the `/ws` endpoint. The LLM Runner backend (Python FastAPI server) was also configured to run on port 8000, causing a conflict. Users typically ran only the npm server, leaving no WebSocket endpoint available.

**Solution:**
Separated concerns by running two servers on different ports:
1. **Port 8000**: npm server for static files (HTML, CSS, JS)
2. **Port 8001**: Python FastAPI server for WebSocket and code execution

**Files Modified:**

1. **server.py** - Changed port from 8000 to 8001:
   ```python
   # Before:
   uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

   # After:
   uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
   ```
   Location: `D:\Users\scale\Code\revealX\plugin\llm-runner\server.py` (line 478)

2. **llm-runner-demo.html** - Updated WebSocket URL:
   ```javascript
   // Before:
   serverUrl: 'ws://localhost:8000/ws',

   // After:
   serverUrl: 'ws://localhost:8001/ws',
   ```
   Location: `D:\Users\scale\Code\revealX\examples\llm-runner-demo.html` (line 432)

3. **README.md** - Added dual-server setup instructions
   Location: `D:\Users\scale\Code\revealX\plugin\llm-runner\README.md`

4. **QUICKSTART.md** - Clarified two-server requirement
   Location: `D:\Users\scale\Code\revealX\plugin\llm-runner\QUICKSTART.md`

---

## How to Test the Fixes

### Terminal 1 - Start the presentation server:
```bash
npm start
# Serves static files on http://localhost:8000
```

### Terminal 2 - Start the LLM Runner backend:
```bash
cd plugin/llm-runner
python server.py
# Runs WebSocket/API server on http://localhost:8001
```

### Open in browser:
```
http://localhost:8000/examples/llm-runner-demo.html
```

### Expected Results:
1. ✅ CSS loads correctly (no MIME type errors)
2. ✅ WebSocket connects successfully to port 8001
3. ✅ Python code execution works (press Shift+Enter on code blocks)
4. ✅ LLM prompts work (streaming responses from Claude/GPT)

---

## Key Architecture Changes

### Before:
- Single server confusion (port 8000)
- Hardcoded CSS paths from project root
- Documentation unclear about server requirements

### After:
- **Port 8000**: npm server (static files only)
- **Port 8001**: Python FastAPI (WebSocket + Python/LLM execution)
- Dynamic CSS path resolution
- Clear dual-server documentation

---

## Prevention Recommendations

1. **For Future Plugins**: Always use dynamic path resolution for assets (CSS, images) based on script location
2. **Documentation**: Always clarify when multiple servers are required and which ports they use
3. **Error Messages**: Consider adding better error messages in the plugin when WebSocket connection fails (e.g., "Make sure the backend server is running on port 8001")
4. **Health Check**: Could add a visual indicator in the UI showing connection status

---

## Related Files

### Modified:
- `plugin/llm-runner/llm-runner.js` - Fixed CSS path loading
- `plugin/llm-runner/server.py` - Changed port to 8001
- `examples/llm-runner-demo.html` - Updated WebSocket URL to port 8001
- `plugin/llm-runner/README.md` - Added dual-server setup instructions
- `plugin/llm-runner/QUICKSTART.md` - Clarified two-server requirement

### Unchanged:
- `plugin/llm-runner/llm-runner.css` - No changes needed
- `plugin/llm-runner/requirements.txt` - No changes needed
