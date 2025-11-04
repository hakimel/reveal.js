# LLM Runner Offcanvas - User Guide

## Quick Start

### Accessing the Feature

1. **Open the Presentation**
   - Navigate to: `http://localhost:8000/examples/presentations/ai-for-product-discovery.html`
   - Or use the full URL: `http://127.0.0.1:5500/examples/presentations/ai-for-product-discovery.html`

2. **Find Slides with Prompts**
   - Slide 14: "Prompt Library: Idea Generation" (3 prompts)
   - Slide 16: "Scoring Your Ideas" (1 prompt)
   - Slide 21: "Validation Tool Prompts" (4 prompts)

3. **Identify Interactive Prompts**
   - Look for dark gray boxes with text
   - Interactive prompts have a purple "Run" button in the top-right corner

## Using the Feature

### Step 1: Navigate to a Prompt Slide

```
Keyboard: Arrow keys or Page Down/Up
Mouse: Click arrows or swipe
URL: Add #/13 to jump directly to Slide 14
```

### Step 2: Click the Run Button

```
┌─────────────────────────────────────────┐
│  MVP Features:                    [Run] │
│  "Brainstorm 8 MVP features..."         │
└─────────────────────────────────────────┘
                                     ↑
                              Click here
```

### Step 3: Review the Offcanvas Drawer

The drawer slides in from the right side:

```
┌──────────────────────────────────────────────────┐
│ Run Prompt with AI                       [×]     │
├──────────────────────────────────────────────────┤
│ MVP Features:                                    │
│ Brainstorm 8 MVP features...                     │
│ From: Prompt Library: Idea Generation            │
├──────────────────────────────────────────────────┤
│ [LLM Runner Interface]                           │
│                                                  │
│ Model: Claude 3.5 Sonnet ▼                       │
│ Status: Ready          [Run] [Clear]             │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ Brainstorm 8 MVP features to solve          │ │
│ │ [Problem 1: motivation drop-off]. Label     │ │
│ │ each as either MVP or experiment.           │ │
│ │                                              │ │
│ │ [Cursor here - edit if needed]              │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Output:                                          │
│ ┌──────────────────────────────────────────────┐ │
│ │ (Results appear here)                        │ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Step 4: Edit the Prompt (Optional)

- Click in the text area to edit
- Modify the prompt as needed
- Use Tab key for indentation
- The original prompt is preserved

### Step 5: Select AI Model (Optional)

- Click the model dropdown
- Choose from available models:
  - Claude 3.5 Sonnet (default)
  - Claude 3 Opus
  - GPT-4
  - GPT-3.5 Turbo

### Step 6: Run the Prompt

**Option 1: Click Run Button**
```
Click the [Run] button in the toolbar
```

**Option 2: Keyboard Shortcut**
```
Press Shift + Enter
```

### Step 7: View Results

- Results appear in the output area below
- Streaming responses show in real-time
- Scroll to view long outputs

### Step 8: Close the Drawer

**Option 1: Close Button**
```
Click the [×] button in the header
```

**Option 2: Click Overlay**
```
Click anywhere on the dark area outside the drawer
```

**Option 3: Keyboard**
```
Press the Escape key
```

**Option 4: Navigate Away**
```
Use arrow keys to go to next/previous slide
(Drawer auto-closes)
```

## Advanced Features

### Clearing Output

To clear previous results:

**Option 1: Click Clear Button**
```
Click the [Clear] button in the toolbar
```

**Option 2: Keyboard Shortcut**
```
Press Shift + C
```

### Running Multiple Prompts

You can run different prompts sequentially:

1. Click Run on first prompt → Review results
2. Close drawer (Esc or ×)
3. Click Run on second prompt → Review results
4. Repeat as needed

### Editing and Re-running

To iterate on a prompt:

1. Run initial prompt
2. Review results
3. Edit prompt text
4. Click Clear to remove previous output
5. Click Run again with modified prompt

### Context Preservation

The drawer maintains context:
- Shows which slide the prompt came from
- Displays the prompt title
- Preserves full prompt text
- Indicates current slide location

## Keyboard Shortcuts Reference

| Key Combination | Action |
|----------------|--------|
| Shift + Enter | Run the current prompt |
| Shift + C | Clear output |
| Escape | Close offcanvas drawer |
| Tab | Indent in editor (4 spaces) |
| Arrow Keys | Navigate slides (when drawer closed) |

## Example Workflows

### Workflow 1: Quick Prompt Execution

```
1. Navigate to Slide 14
2. Click [Run] on "MVP Features" prompt
3. Wait for results (5-10 seconds)
4. Review generated features
5. Press Escape to close
6. Move to next prompt
```

**Time:** ~30 seconds per prompt

### Workflow 2: Iterative Refinement

```
1. Click [Run] on any prompt
2. Review initial results
3. Edit prompt to be more specific
4. Click [Clear] to reset output
5. Click [Run] again
6. Compare new results
7. Repeat until satisfied
```

**Time:** 1-3 minutes per prompt

### Workflow 3: Multi-Prompt Session

```
1. Navigate to Slide 14
2. Run "MVP Features" → Note best ideas
3. Run "Radical Concepts" → Note novel approaches
4. Run "UX & Business Models" → Note alternatives
5. Navigate to Slide 16
6. Run "Scoring Prompt" with collected ideas
```

**Time:** 5-10 minutes for full session

## Tips and Best Practices

### Getting Better Results

1. **Be Specific**
   - Replace placeholder text like [Problem 1] with actual problems
   - Add context from your domain
   - Specify desired output format

2. **Iterate**
   - Start with the default prompt
   - Refine based on initial results
   - Add constraints or examples

3. **Use Multiple Prompts**
   - Run several variations
   - Combine different prompt types
   - Cross-reference outputs

### Maximizing Efficiency

1. **Prepare Context**
   - Know your problem statements
   - Have domain specifics ready
   - Define success criteria upfront

2. **Batch Similar Prompts**
   - Run related prompts in sequence
   - Keep drawer open for edits
   - Clear between prompts if needed

3. **Save Good Results**
   - Copy important outputs immediately
   - Take screenshots if needed
   - Document prompt variations that work

### Avoiding Common Issues

1. **Empty Results**
   - Check WebSocket connection
   - Verify server is running
   - Look for error messages in output

2. **Slow Responses**
   - Large prompts take longer
   - Check network connection
   - Try simpler model (GPT-3.5)

3. **Drawer Won't Close**
   - Press Escape key
   - Click overlay area
   - Navigate to different slide

## Mobile Usage

The feature works on mobile devices with adaptations:

### Mobile Differences

- Drawer takes full screen width
- Touch-friendly button sizes
- Swipe to close (click overlay)
- On-screen keyboard appears when editing

### Mobile Tips

1. **Portrait Mode Recommended**
   - Better vertical space for editor
   - More readable output

2. **Two-Finger Scroll**
   - Scroll within drawer
   - Prevents slide navigation

3. **Tap Outside to Close**
   - Easier than clicking small × button

## Troubleshooting

### Run Buttons Don't Appear

**Symptoms:**
- No purple Run buttons on prompt boxes

**Solutions:**
1. Refresh the page (F5)
2. Check browser console for errors
3. Verify JavaScript is enabled
4. Try a different browser

### Drawer Doesn't Open

**Symptoms:**
- Click Run but nothing happens

**Solutions:**
1. Check browser console for errors
2. Verify reveal.js loaded correctly
3. Refresh the page
4. Clear browser cache

### Can't Execute Prompts

**Symptoms:**
- Drawer opens but Run button disabled
- Error messages in output

**Solutions:**
1. Check WebSocket server is running
2. Verify server URL: ws://localhost:8000/ws
3. Check browser network tab for connection
4. Restart backend server

### Results Don't Appear

**Symptoms:**
- Prompt executes but no output

**Solutions:**
1. Wait longer (some prompts take time)
2. Check status indicator (should say "Running...")
3. Look for error messages
4. Try a different prompt

### Drawer Stuck Open

**Symptoms:**
- Can't close drawer with any method

**Solutions:**
1. Refresh the page
2. Use browser back button
3. Close and reopen browser tab

## Getting Help

### Check These Resources First

1. **Browser Console**
   - Press F12 to open DevTools
   - Look for red error messages
   - Check Network tab for failed requests

2. **Documentation**
   - `.docs/LLM-RUNNER-OFFCANVAS.md` - Technical details
   - `.docs/LLM-RUNNER-OFFCANVAS-IMPLEMENTATION-SUMMARY.md` - Implementation info

3. **Server Logs**
   - Check terminal running the backend
   - Look for connection errors
   - Verify WebSocket handshake

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "WebSocket not connected" | Backend server not running | Start server: `npm run start` |
| "Connection failed" | Wrong URL or firewall | Check server URL and firewall |
| "Model not available" | Invalid model selected | Choose different model |
| "Timeout" | Prompt too complex | Simplify prompt or wait longer |

## Feedback and Suggestions

This feature is part of the AI Product Discovery workshop presentation. Feedback welcome!

### What to Report

- Feature requests
- Bug reports
- Usability issues
- Performance problems
- Documentation gaps

---

**Happy prompting!**

For the best experience, ensure you have:
- Modern browser (Chrome, Firefox, Safari, Edge)
- Backend server running on localhost:8000
- JavaScript enabled
- Stable internet connection (for AI models)
