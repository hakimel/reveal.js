# LLM Runner - Quick Start Guide

Get up and running with the LLM Runner plugin in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
cd plugin/llm-runner
pip install -r requirements.txt
```

## Step 2: Setup API Keys (2 minutes)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxx...
   OPENAI_API_KEY=sk-xxx...
   ```

   **Get API Keys:**
   - Anthropic: https://console.anthropic.com/
   - OpenAI: https://platform.openai.com/api-keys

   *Note: You only need one API key to get started!*

## Step 3: Start BOTH Servers (1 minute)

**IMPORTANT: You need TWO servers running simultaneously!**

**Terminal 1 - Presentation server (serves HTML/JS/CSS files):**
```bash
# From project root
npm start
# This runs on http://localhost:8000
```

**Terminal 2 - LLM Runner backend (handles Python/LLM execution):**
```bash
# From project root
cd plugin/llm-runner
python server.py
# This runs on http://localhost:8001
```

You should see in Terminal 2:
```
============================================================
LLM Runner Server
============================================================
Anthropic (Claude): ✓ Available
OpenAI (GPT): ✓ Available
============================================================

Starting server on http://localhost:8001
WebSocket endpoint: ws://localhost:8001/ws
```

## Step 4: View the Demo (30 seconds)

Open the demo presentation in your browser:
- URL: http://localhost:8000/examples/llm-runner-demo.html

**Note:** The presentation loads from port 8000 (npm server) but connects to port 8001 (Python backend) for code execution.

## Step 5: Try It! (30 seconds)

1. Wait for both servers to be running
2. Navigate through the slides
3. Find a Python code block
4. Press **Shift + Enter** to run
5. Watch the output appear in real-time!

## Your First Custom Slide

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="dist/reveal.css">
    <link rel="stylesheet" href="dist/theme/black.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section>
                <h2>My First LLM Runner Slide</h2>
                <pre class="llm-runner" data-type="python">
print("Hello, World!")
                </pre>
            </section>
        </div>
    </div>

    <script src="dist/reveal.js"></script>
    <script src="plugin/llm-runner/llm-runner.js"></script>
    <script>
        Reveal.initialize({
            plugins: [ RevealLLMRunner ]
        });
    </script>
</body>
</html>
```

## Common Issues

### Server won't start
- **Issue**: `ModuleNotFoundError`
- **Fix**: Run `pip install -r requirements.txt` again

### "Connection failed"
- **Issue**: Can't connect to WebSocket
- **Fix**: Make sure BOTH servers are running:
  - Terminal 1: `npm start` (port 8000)
  - Terminal 2: `cd plugin/llm-runner && python server.py` (port 8001)

### "API not configured"
- **Issue**: API keys not found
- **Fix**: Check `.env` file exists and has valid keys

## Next Steps

- Read the full [README.md](README.md) for all features
- Explore the [demo presentation](../../examples/llm-runner-demo.html)
- Try different models in the dropdown
- Experiment with LLM prompts

## Need Help?

1. Check server logs for errors
2. Open browser console (F12) for frontend errors
3. Review the README.md troubleshooting section

Happy presenting! 🚀
