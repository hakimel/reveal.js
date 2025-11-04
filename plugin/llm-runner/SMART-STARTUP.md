# Smart Startup for LLM Runner

The LLM Runner plugin includes automatic detection and startup when you run Reveal.js!

## TL;DR - Quick Start

From the project root:
```bash
npm run start:llm
```

Both servers start automatically! 🎉

## How It Works

When you run `npm run start:llm`, the smart startup script:

1. ✅ Detects if LLM Runner plugin exists (`plugin/llm-runner/server.py`)
2. ✅ Starts Reveal.js on port **8000**
3. ✅ Starts LLM Runner on port **8001**
4. ✅ Shows colored console output for both
5. ✅ Stops both with single Ctrl+C

## Benefits

### Before (Manual)
```bash
# Terminal 1
npm start

# Terminal 2
cd plugin/llm-runner
python server.py
```

### After (Automatic)
```bash
# Single terminal
npm run start:llm
```

## Alternative Methods

### Double-Click (Windows)
```
start-reveal-with-llm.bat
```

### Shell Script (Mac/Linux)
```bash
chmod +x start-reveal-with-llm.sh
./start-reveal-with-llm.sh
```

## What You'll See

```
============================================================
Reveal.js Smart Startup
============================================================

✓ LLM Runner plugin detected
✓ LLM Runner configuration found

Starting servers...

[1/2] Starting Reveal.js server (port 8000)...
[2/2] Starting LLM Runner server (port 8001)...

============================================================
Servers Ready!
============================================================
Reveal.js:   http://localhost:8000
LLM Runner:  ws://localhost:8001/ws

Press Ctrl+C to stop both servers
```

## Requirements

- Node.js 18+ (for Reveal.js)
- Python 3.8+ (for LLM Runner)
- Dependencies installed:
  ```bash
  cd plugin/llm-runner
  pip install -r requirements.txt
  ```

## Configuration Check

The script checks for:
- ✅ `plugin/llm-runner/server.py` exists
- ⚠️ `plugin/llm-runner/.env` exists (warns if missing)
- ⚠️ Python is installed (warns if missing)

If any checks fail, it shows helpful warnings but continues.

## Graceful Fallback

If LLM Runner isn't installed:
```
ℹ LLM Runner plugin not detected
  Starting Reveal.js only...
```

The script automatically falls back to starting just Reveal.js.

## Making It Default

Want `npm start` to always start both? Edit `package.json`:

```json
{
  "scripts": {
    "start": "node start-with-llm.js",
    "start:basic": "gulp serve"
  }
}
```

## Technical Details

### Implementation
- **Script**: `start-with-llm.js`
- **Uses**: Node.js `child_process.spawn()`
- **Manages**: Two concurrent processes
- **Handles**: SIGINT/SIGTERM for clean shutdown

### Process Management
```javascript
// Spawns npm start
const revealServer = spawn('npm', ['start']);

// Spawns python server.py
const llmServer = spawn('python', ['server.py']);

// Cleanup on exit
process.on('SIGINT', () => {
    llmServer.kill();
    revealServer.kill();
});
```

## Troubleshooting

### "Cannot find module"
Run from project root:
```bash
cd /path/to/revealX
npm run start:llm
```

### "Port already in use"
Something is already running on port 8000 or 8001. Stop it first.

### Python not found
Install Python: https://www.python.org/

### Dependencies not installed
```bash
cd plugin/llm-runner
pip install -r requirements.txt
```

## See Also

- Full documentation: `/START-WITH-LLM.md`
- LLM Runner README: `README.md`
- Example presentation: `/examples/llm-runner-demo.html`
