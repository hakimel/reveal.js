# Smart Reveal.js + LLM Runner Startup

Automatically start both Reveal.js and the LLM Runner backend server with a single command!

## Quick Start

### Option 1: npm command (Recommended)
```bash
npm run start:llm
```

### Option 2: Double-click startup (Windows)
Double-click `start-reveal-with-llm.bat`

### Option 3: Shell script (Mac/Linux)
```bash
chmod +x start-reveal-with-llm.sh
./start-reveal-with-llm.sh
```

## What It Does

The smart startup script:

1. **Detects LLM Runner Plugin** - Automatically checks if `plugin/llm-runner/` exists
2. **Starts Both Servers**:
   - Reveal.js presentation server on port **8000**
   - LLM Runner backend server on port **8001**
3. **Shows Helpful Warnings** - Alerts if `.env` file is missing or Python not installed
4. **Graceful Fallback** - If LLM Runner is not installed, starts only Reveal.js
5. **Single Ctrl+C** - Stops both servers together

## Output Example

```
============================================================
Reveal.js Smart Startup
============================================================

✓ LLM Runner plugin detected
✓ LLM Runner configuration found

Starting servers...

[1/2] Starting Reveal.js server (port 8000)...
[Reveal.js] Server started at http://localhost:8000

[2/2] Starting LLM Runner server (port 8001)...
[LLM Runner] Uvicorn running on http://0.0.0.0:8001

============================================================
Servers Ready!
============================================================
Reveal.js:   http://localhost:8000
LLM Runner:  ws://localhost:8001/ws

Press Ctrl+C to stop both servers
```

## Requirements

- **Node.js** (v18+) - Required for Reveal.js
- **Python** (3.8+) - Required for LLM Runner
- **LLM Runner Dependencies** - Run once:
  ```bash
  cd plugin/llm-runner
  pip install -r requirements.txt
  ```

## Configuration

### First-time Setup

1. **Copy environment template:**
   ```bash
   cd plugin/llm-runner
   cp .env.example .env
   ```

2. **Add your API keys** to `.env`:
   ```bash
   ANTHROPIC_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   CLAUDE_MODEL=claude-sonnet-4-5-20250929
   ```

3. **Start servers:**
   ```bash
   npm run start:llm
   ```

## Traditional Start Methods (Still Work)

If you prefer to start servers separately:

### Reveal.js only:
```bash
npm start
```

### LLM Runner only:
```bash
cd plugin/llm-runner
python server.py
```

## Troubleshooting

### "LLM Runner plugin not detected"
- The script only starts LLM Runner if `plugin/llm-runner/server.py` exists
- Falls back to starting only Reveal.js

### "Failed to start LLM Runner server"
Check:
1. Python is installed: `python --version`
2. Dependencies installed: `cd plugin/llm-runner && pip install -r requirements.txt`
3. `.env` file exists with valid API keys

### Port Already in Use
If port 8000 or 8001 is already in use:
1. Stop the conflicting process
2. Or modify the ports in:
   - `gulpfile.js` (Reveal.js port)
   - `plugin/llm-runner/server.py` (LLM Runner port)

### Windows: Script Won't Run
Try running as Administrator or check:
```bash
node --version
python --version
```

## Benefits

✅ **One Command** - No need to remember two separate commands
✅ **Auto-Detection** - Smart enough to know when LLM Runner is available
✅ **Better UX** - Colored output shows what's happening
✅ **Proper Shutdown** - Ctrl+C stops both servers cleanly
✅ **Cross-Platform** - Works on Windows, Mac, and Linux

## How It Works

The `start-with-llm.js` script:

1. Checks if `plugin/llm-runner/server.py` exists
2. If found:
   - Spawns `npm start` for Reveal.js
   - Spawns `python server.py` for LLM Runner
   - Manages both processes
   - Handles cleanup on exit
3. If not found:
   - Falls back to `npm start` only
   - Shows informative message

## Making It Default

To always use smart startup, modify `package.json`:

```json
{
  "scripts": {
    "start": "node start-with-llm.js",
    "start:basic": "gulp serve",
    "start:llm": "node start-with-llm.js"
  }
}
```

Then `npm start` will automatically start both servers!

## Additional Resources

- **LLM Runner Documentation**: `plugin/llm-runner/README.md`
- **Example Presentation**: `examples/llm-runner-demo.html`
- **Reveal.js Docs**: https://revealjs.com/
