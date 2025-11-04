# LLM Runner Integration - AI Product Discovery Presentation

## Overview

This presentation includes an interactive LLM Runner feature that allows you to execute AI prompts directly from the slides.

## Quick Start

### 1. Start the Server

```bash
npm run start
```

The server will start on `http://localhost:8000`

### 2. Open the Presentation

Navigate to: `http://localhost:8000/examples/presentations/ai-for-product-discovery.html`

### 3. Find Interactive Prompts

Look for slides with prompt boxes (dark gray boxes with text). Interactive prompts have a purple **Run** button in the top-right corner.

**Slides with interactive prompts:**
- **Slide 14:** Prompt Library: Idea Generation (3 prompts)
- **Slide 16:** Scoring Your Ideas (1 prompt)
- **Slide 21:** Validation Tool Prompts (4 prompts)

### 4. Run a Prompt

1. Click the **Run** button on any prompt
2. A drawer slides in from the right with the LLM Runner interface
3. Edit the prompt if needed
4. Click **Run** in the toolbar (or press Shift+Enter)
5. View results in the output area
6. Close with **×**, **Escape key**, or click outside

## Features

- **Automatic Detection:** All prompt boxes get Run buttons automatically
- **Pre-populated Prompts:** Prompt text is automatically loaded
- **Smooth Animations:** Professional slide-in drawer experience
- **Keyboard Shortcuts:** Shift+Enter to run, Shift+C to clear, Escape to close
- **Mobile Friendly:** Responsive design for all screen sizes
- **Context Display:** Shows which slide the prompt came from

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Shift + Enter | Run the prompt |
| Shift + C | Clear output |
| Escape | Close drawer |
| Arrow Keys | Navigate slides |

## Requirements

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Node.js server running on localhost:8000
- WebSocket backend at ws://localhost:8000/ws (for LLM execution)

## Troubleshooting

### No Run buttons appear
- Refresh the page (F5)
- Check browser console for errors
- Verify JavaScript is enabled

### Can't execute prompts
- Ensure backend server is running
- Check WebSocket connection at ws://localhost:8000/ws
- Look for connection status in browser console

### Drawer won't close
- Press Escape key
- Navigate to a different slide
- Refresh the page if needed

## Documentation

For detailed information, see:

- **User Guide:** `../../.docs/LLM-RUNNER-OFFCANVAS-USER-GUIDE.md`
- **Technical Docs:** `../../.docs/LLM-RUNNER-OFFCANVAS.md`
- **Implementation:** `../../.docs/LLM-RUNNER-OFFCANVAS-IMPLEMENTATION-SUMMARY.md`

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Review documentation in `.docs/` folder
3. Verify server is running and accessible

---

**Part of the AI for Products Skills Collection**
© AdaptiveX 2025
