# LLM Runner Plugin - Testing Guide

## Testing the Bug Fixes

This guide helps you verify that both issues (CSS loading and WebSocket connection) have been resolved.

---

## Prerequisites

1. **Install Dependencies**:
   ```bash
   cd plugin/llm-runner
   pip install -r requirements.txt
   ```

2. **Setup API Keys** (optional for testing CSS/WebSocket):
   Create `.env` file in `plugin/llm-runner/`:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ```

---

## Test Procedure

### Step 1: Start the Presentation Server

**Terminal 1:**
```bash
cd D:\Users\scale\Code\revealX
npm start
```

**Expected Output:**
```
> reveal.js@5.x.x start
> gulp serve

[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:8000
    External: http://192.168.x.x:8000
 --------------------------------------
```

**Verification:**
- Server should start on port 8000
- No errors should appear

---

### Step 2: Start the LLM Runner Backend

**Terminal 2:**
```bash
cd D:\Users\scale\Code\revealX\plugin\llm-runner
python server.py
```

**Expected Output:**
```
============================================================
LLM Runner Server
============================================================
Anthropic (Claude): ✓ Available
OpenAI (GPT): ✓ Available
============================================================

Starting server on http://localhost:8001
WebSocket endpoint: ws://localhost:8001/ws

Press Ctrl+C to stop

INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

**Verification:**
- Server should start on port 8001
- Both API keys should show "✓ Available" (if configured)
- No errors should appear

---

### Step 3: Open the Demo in Browser

1. Open your browser
2. Navigate to: `http://localhost:8000/examples/llm-runner-demo.html`
3. Open browser DevTools (F12)
4. Go to the Console tab

**Expected Behavior:**
- Page loads without errors
- You should see: `[LLM Runner] Connected to server`
- No CSS MIME type errors
- No WebSocket connection errors

---

## Test Cases

### Test Case 1: CSS Loading (Fix for Error 1)

**What to Check:**
1. Open browser DevTools → Network tab
2. Filter by "CSS"
3. Look for `llm-runner.css`

**Expected Results:**
- ✅ Request URL: `http://localhost:8000/plugin/llm-runner/llm-runner.css`
- ✅ Status: `200 OK`
- ✅ Type: `text/css`
- ✅ No 404 errors
- ✅ No MIME type warnings in Console

**If Failed:**
- ❌ Status: `404 Not Found`
- ❌ Type: `text/html` (error page instead of CSS)
- ❌ Console error: "Refused to apply style... MIME type 'text/html' is not supported"

---

### Test Case 2: WebSocket Connection (Fix for Error 2)

**What to Check:**
1. Open browser DevTools → Console tab
2. Look for LLM Runner connection messages

**Expected Results:**
- ✅ `[LLM Runner] Connected to server`
- ✅ No WebSocket errors
- ✅ No "Reconnecting..." messages
- ✅ Connection indicator (if visible in UI) shows green/connected

**If Failed:**
- ❌ `WebSocket connection to 'ws://localhost:8001/ws' failed`
- ❌ `[LLM Runner] WebSocket error: Event`
- ❌ `[LLM Runner] Disconnected from server`
- ❌ `[LLM Runner] Reconnecting... (1/5)`

---

### Test Case 3: Python Code Execution

**What to Test:**
1. Navigate to slide with Python code (slide 3: "Demo 1: Python Execution")
2. Click on the code block
3. Press **Shift + Enter**

**Expected Results:**
- ✅ Output appears below the code block
- ✅ Shows "Hello from LLM Runner!"
- ✅ Shows circle area calculation
- ✅ No errors in console
- ✅ Execution completes in < 1 second

**If Failed:**
- ❌ No output appears
- ❌ Error message displayed
- ❌ Console shows WebSocket errors
- ❌ "Not connected" error

---

### Test Case 4: LLM Integration (Optional - Requires API Keys)

**What to Test:**
1. Navigate to slide with LLM prompt (slide 5: "Demo 4: LLM Integration")
2. Click on the prompt text
3. Press **Shift + Enter**

**Expected Results:**
- ✅ Output area shows "Streaming..."
- ✅ Response appears character by character
- ✅ Complete response about machine learning
- ✅ No API errors

**If Failed:**
- ❌ "API not configured" error
- ❌ No streaming response
- ❌ API error messages

---

## Troubleshooting

### Issue: CSS Still Not Loading

**Symptoms:**
- Styled elements don't appear
- MIME type errors in console

**Check:**
1. Verify both servers are running
2. Check browser Network tab for CSS request
3. Verify CSS file exists: `plugin/llm-runner/llm-runner.css`
4. Clear browser cache (Ctrl+Shift+R)

**Solution:**
- Hard refresh the page (Ctrl+Shift+R)
- Check that llm-runner.js properly loads the CSS

---

### Issue: WebSocket Still Failing

**Symptoms:**
- "Connection failed" messages
- Reconnecting attempts

**Check:**
1. Verify Python server is running on port 8001
2. Check Terminal 2 for server errors
3. Verify serverUrl in demo HTML is `ws://localhost:8001/ws`

**Debug Commands:**
```bash
# Check if port 8001 is in use
netstat -an | grep 8001

# Check server logs in Terminal 2
# Should show: "Uvicorn running on http://0.0.0.0:8001"
```

**Solution:**
- Restart Python server (Terminal 2)
- Check firewall isn't blocking port 8001
- Verify WebSocket endpoint: `http://localhost:8001/` should show JSON status

---

### Issue: Python Code Won't Execute

**Symptoms:**
- No output when pressing Shift+Enter
- Errors about connection

**Check:**
1. WebSocket is connected (see Test Case 2)
2. Server logs show execution request
3. Code has no syntax errors

**Debug:**
- Check Terminal 2 for Python errors
- Try simple code: `print("test")`
- Check browser console for errors

---

## Success Checklist

After running all tests, you should have:

- [x] Both servers running (ports 8000 and 8001)
- [x] Demo page loads without errors
- [x] CSS styles applied correctly
- [x] WebSocket connected successfully
- [x] Python code executes and shows output
- [x] No errors in browser console
- [x] No 404 errors in Network tab
- [x] LLM integration works (if API keys configured)

---

## Performance Tests

### Test: Multiple Executions
1. Run Python code 5 times in a row
2. Each execution should complete successfully
3. Context should persist (variables available)

### Test: Navigate Between Slides
1. Execute code on slide 3
2. Navigate to slide 5
3. Navigate back to slide 3
4. Code should still be there with output

### Test: Concurrent Requests
1. Open demo in two browser tabs
2. Execute code in both tabs simultaneously
3. Both should work independently

---

## Regression Tests

These ensure the fixes don't break existing functionality:

### Test: Works from Root-Level HTML
1. Create test HTML in project root (not in examples/)
2. Should still load CSS correctly
3. Should still connect to WebSocket

### Test: Works from Nested Directories
1. Demo already tests this (examples/llm-runner-demo.html)
2. CSS should load from calculated path
3. WebSocket should connect to port 8001

---

## Automated Test Command

Quick verification script:

```bash
# From project root
# Start servers (in background)
npm start &
NPM_PID=$!

cd plugin/llm-runner
python server.py &
PY_PID=$!

# Wait for servers to start
sleep 3

# Test endpoints
curl http://localhost:8000/ # Should return HTML
curl http://localhost:8001/ # Should return JSON status

# Cleanup
kill $NPM_PID $PY_PID
```

---

## Expected Logs

### Normal Operation - Terminal 2 (Python Server):
```
INFO:     127.0.0.1:xxxxx - "WebSocket /ws" [accepted]
INFO:     connection open
[2025-11-02 xx:xx:xx] Client connected
# When code executes:
INFO:     127.0.0.1:xxxxx - "WebSocket /ws" 200 OK
```

### Normal Operation - Browser Console:
```
[LLM Runner] Connected to server
# No other errors
```

---

## Contact & Support

If tests fail after following this guide:
1. Check both servers are running
2. Review browser console for specific errors
3. Check server logs in Terminal 2
4. Verify port 8001 is not blocked
5. Clear browser cache and retry

All tests should pass with the bug fixes applied.
