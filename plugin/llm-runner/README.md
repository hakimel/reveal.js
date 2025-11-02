# LLM Runner Plugin for reveal.js

A powerful reveal.js plugin that enables interactive LLM-powered chat and Python code execution directly within presentation slides. Perfect for live coding demonstrations, AI-powered presentations, and interactive workshops.

## Features

- **Python Code Execution**: Run Python code directly in your slides with real-time output
- **LLM Integration**: Interactive chat with Claude (Anthropic) and GPT (OpenAI) models
- **Mixed Mode**: Combine Python code with LLM API calls
- **Real-time Streaming**: See LLM responses stream in character-by-character
- **Context Persistence**: Maintain execution context per slide (variables, imports, etc.)
- **Keyboard Shortcuts**: Fast execution with Shift+Enter, clear with Shift+C
- **Compact UI**: Slide-friendly design that fits well at presentation resolutions
- **Model Selection**: Choose between different Claude and GPT models on-the-fly
- **Safe Execution**: Sandboxed Python environment with security restrictions

## Installation

### 1. Plugin Files

The plugin is already installed in `plugin/llm-runner/` with:
- `llm-runner.js` - Main plugin JavaScript
- `llm-runner.css` - UI styles
- `server.py` - FastAPI backend server
- `requirements.txt` - Python dependencies

### 2. Python Setup

Install Python dependencies:

```bash
cd plugin/llm-runner
pip install -r requirements.txt
```

### 3. API Keys

Create a `.env` file in the `plugin/llm-runner/` directory:

```env
# For Claude (Anthropic) models
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# For GPT (OpenAI) models
OPENAI_API_KEY=your_openai_api_key_here
```

You can use either or both API keys depending on which models you want to enable.

**Getting API Keys:**
- Anthropic (Claude): https://console.anthropic.com/
- OpenAI (GPT): https://platform.openai.com/api-keys

### 4. Start the Backend Server

**IMPORTANT: Two servers are required:**

1. **Static file server (port 8000)** - Serves the reveal.js presentation files
2. **LLM Runner server (port 8001)** - Handles WebSocket connections and code execution

**Terminal 1 - Start the presentation server:**
```bash
npm start
# This serves static files on http://localhost:8000
```

**Terminal 2 - Start the LLM Runner backend:**
```bash
cd plugin/llm-runner
python server.py
# This runs the WebSocket/API server on http://localhost:8001
```

You should see:
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

Then open your presentation at: `http://localhost:8000/examples/llm-runner-demo.html`

## Usage

### Basic Setup in HTML

Add the plugin to your reveal.js presentation:

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
            <!-- Your slides here -->
        </div>
    </div>

    <script src="dist/reveal.js"></script>
    <script src="plugin/llm-runner/llm-runner.js"></script>

    <script>
        Reveal.initialize({
            plugins: [ RevealLLMRunner ],
            llmRunner: {
                serverUrl: 'ws://localhost:8001/ws',  // LLM Runner backend on port 8001
                defaultModel: 'claude-3-5-sonnet-20241022',
                autoConnect: true,
                persistContext: true
            }
        });
    </script>
</body>
</html>
```

### Python Code Execution

```html
<section>
    <h2>Python Demo</h2>
    <pre class="llm-runner" data-type="python">
# Calculate Fibonacci sequence
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b

fibonacci(10)
    </pre>
</section>
```

### LLM Prompt

```html
<section>
    <h2>Ask Claude</h2>
    <pre class="llm-runner" data-type="llm" data-model="claude-3-5-sonnet-20241022">
Explain machine learning in 3 sentences suitable for beginners
    </pre>
</section>
```

### Mixed Mode (Python + LLM)

```html
<section>
    <h2>Python with AI</h2>
    <pre class="llm-runner" data-type="mixed" data-model="claude-3-5-sonnet-20241022">
# Calculate something, then ask AI about it
import math
result = math.pi * 100

# This will be enhanced in future versions to support:
# response = await llm.prompt(f"Why is {result} interesting?")
print(f"Result: {result}")
    </pre>
</section>
```

## Configuration Options

```javascript
Reveal.initialize({
    llmRunner: {
        // WebSocket server URL (LLM Runner backend on port 8001)
        serverUrl: 'ws://localhost:8001/ws',

        // Default LLM model
        defaultModel: 'claude-3-5-sonnet-20241022',

        // Auto-connect to server on init
        autoConnect: true,

        // Persist execution context per slide
        persistContext: true,

        // Keyboard shortcuts
        shortcuts: {
            run: 'Shift-Enter',    // Execute code
            clear: 'Shift-C'       // Clear output
        }
    }
});
```

## Available Models

### Anthropic (Claude)
- `claude-3-5-sonnet-20241022` - Most capable, balanced performance (recommended)
- `claude-3-opus-20240229` - Most powerful model for complex tasks

### OpenAI (GPT)
- `gpt-4` - Advanced reasoning and complex tasks
- `gpt-3.5-turbo` - Fast and efficient for simpler tasks

## Keyboard Shortcuts

- **Shift + Enter**: Execute the current code/prompt
- **Shift + C**: Clear output
- **Tab**: Insert 4 spaces (in editor)

## Data Attributes

### Required
- `class="llm-runner"` - Identifies the code block as a runner

### Optional
- `data-type="python|llm|mixed"` - Execution type (default: `python`)
- `data-model="model-name"` - LLM model to use (default: from config)

## Examples

### 1. Data Analysis Demo

```html
<pre class="llm-runner" data-type="python">
import random
from collections import Counter

# Generate random data
data = [random.randint(1, 6) for _ in range(100)]

# Analyze
counter = Counter(data)
print("Dice Roll Results:")
for num, count in sorted(counter.items()):
    print(f"{num}: {'█' * count} ({count})")
</pre>
```

### 2. Interactive Q&A

```html
<pre class="llm-runner" data-type="llm">
What are the three laws of robotics?
</pre>
```

### 3. Math Calculations

```html
<pre class="llm-runner" data-type="python">
import math

# Calculate compound interest
principal = 1000
rate = 0.05
years = 10

amount = principal * (1 + rate) ** years
print(f"Initial: ${principal}")
print(f"After {years} years: ${amount:.2f}")
print(f"Interest earned: ${amount - principal:.2f}")
</pre>
```

## Security Considerations

### Python Execution
- Restricted builtins (no file system access, no network, no subprocess)
- Execution timeout (30 seconds)
- No access to dangerous modules (`os`, `sys`, `subprocess`, etc.)
- Sandboxed environment per slide

### Safe Modules Available
- `math`, `json`, `random`
- `datetime`, `timedelta`
- `Counter`, `defaultdict`
- Basic builtins: `print`, `range`, `len`, `sum`, etc.

### LLM API
- API keys stored in environment variables (not in code)
- Server-side API calls only (keys never exposed to client)
- Optional rate limiting (configure in server)

## Troubleshooting

### Server won't start
1. Check Python version (3.8+ required)
2. Ensure all dependencies installed: `pip install -r requirements.txt`
3. Check port 8001 is not in use (LLM Runner backend)
4. Port 8000 should be used by npm start (presentation server)

### Connection failed
1. Ensure BOTH servers are running:
   - `npm start` (port 8000 - presentation files)
   - `python server.py` (port 8001 - LLM Runner backend)
2. Check WebSocket URL in config is `ws://localhost:8001/ws`
3. Check browser console for errors
4. Verify presentation is accessed via `http://localhost:8000/`

### LLM not working
1. Verify API key in `.env` file
2. Check API key is valid and has credits
3. Check server logs for API errors
4. Ensure correct model name

### Code execution fails
1. Check for syntax errors in Python code
2. Review restricted builtins list
3. Check server logs for detailed errors
4. Try simpler code first to verify connection

## Server API Endpoints

### WebSocket
- `ws://localhost:8001/ws` - Main WebSocket endpoint for runners

### HTTP
- `GET /` - Health check and status
- `POST /reset-context/{slide_id}` - Reset execution context for specific slide
- `POST /reset-all-contexts` - Reset all execution contexts

## Development

### Running in Development
```bash
# Terminal 1: Start presentation server (npm)
npm start
# Runs on http://localhost:8000

# Terminal 2: Start LLM Runner backend with auto-reload
cd plugin/llm-runner
uvicorn server:app --reload --port 8001
```

### Server Logs
The server provides detailed logging:
- Client connections/disconnections
- Execution requests and results
- API errors and responses

### Browser Console
Check browser console for:
- WebSocket connection status
- Plugin initialization
- Message exchange logs

## Performance

### Recommendations
- Keep code blocks small and focused
- Use streaming for better UX with LLMs
- Clear output between executions for cleaner slides
- Use context persistence to build on previous code

### Limitations
- Python execution timeout: 30 seconds
- LLM token limits vary by model
- WebSocket connection required
- Not suitable for CPU-intensive tasks

## Credits

Created for reveal.js presentations with ❤️

- **Backend**: FastAPI, Anthropic SDK, OpenAI SDK
- **Frontend**: Vanilla JavaScript, WebSocket API
- **Styling**: Custom CSS with dark theme

## License

MIT License - feel free to use and modify for your presentations!

## Support

For issues, questions, or contributions:
1. Check troubleshooting section above
2. Review server logs and browser console
3. Ensure latest version of dependencies

## Changelog

### v1.0.0 (2025-01-02)
- Initial release
- Python code execution
- Claude and GPT integration
- Real-time streaming support
- Context persistence
- Keyboard shortcuts
- Compact slide-friendly UI
