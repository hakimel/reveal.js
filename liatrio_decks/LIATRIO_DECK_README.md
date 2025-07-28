# Liatrio Reveal.js Deck Template

This directory contains a template for Liatrio presentations using Reveal.js. It includes all of the styling and assets from the [Liatrio brand guide](https://www.liatrio.com/brand).

Use this template to quickly create new, branded Liatrio presentations with consistent style and best practices.

## How to Use the Template

### Prerequisites

1. Clone this repository

    ```bash
    git clone git@github.com:liatrio/reveal.js.git
    cd reveal.js
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Start the development server

    ```bash
    npm start
    # or to run on a custom port:
    npm start -- --port 8080
    ```

4. Open <http://localhost:8000/liatrio_decks> in your browser to view the template and any decks you create.

### Making a New Deck

1. **Copy the Template File**
   - Duplicate `liatrio_deck_template.html` and rename it for your presentation (e.g., `my_presentation.html`).
   - Note: All HTML files in the `liatrio_decks/` folder are git-ignored except for the template file, so your custom presentations won't be accidentally committed.

2. **Customize Your Deck**
   - Update the `<title>` tag in the `<head>` section to your presentation title
   - Update the title, subtitle, and presenter fields in the Title Slide section
   - Replace example slides and content with your own material
   - Add or remove slides as needed
   - Replace images/screenshots where indicated
   - Use the provided code block and callout examples as a starting point for technical content
   - Store any custom assets (images, logos, etc.) in the `liatrio_decks/custom_assets/` folder - all files in this folder are git-ignored
   - **Client Logo**: To display a client logo alongside the Liatrio logo on the title slide, add a `client_logo.jpeg` file to `custom_assets/`. The logo will automatically appear with a "+" sign between the Liatrio and client logos

3. **Speaker Notes**
   - Add your talking points using `<aside class="notes">...</aside>` blocks under each slide.
   - Press `S` during your presentation to open the speaker notes window.

4. **Preview Your Deck**
   - Open your HTML file in a web browser to view and present your slides.
   - For best results, use a modern browser (Chrome, Firefox, Edge).

5. **Styling & Branding**
   - The template uses Liatrio's custom theme and code highlighting for a consistent look.
   - You can further customize styles in `static/liatrio.css` if needed.

## Using AI to Generate a Deck

### Preparation

1. Copy `liatrio_deck_template.html` and rename it to your presentation title
2. Update the Challenge, Solution, and Benefits sections in the HTML comments at the top of the file with a high-level overview of your presentation
3. Open this directory in your IDE or AI editor
    - Optional: also open the code you're working on to provide context to the AI
4. Add the `liatrio_decks` directory to your AI context
5. Add git logs, screenshots, web pages, files, and other relevant references to the AI context

### Context Engineering: The Key to Better Presentations

Modern AI models work best when provided with rich context rather than perfect prompts. **Context is more important than prompt perfection.** The more relevant information you provide, the more targeted and effective your presentation will be.

**Add specific context about:**

- **Your audience:** Who are you presenting to? What's their background and experience level?
- **The situation:** What problem are you solving? What's the current state vs. desired state?
- **Your goal:** What do you want the audience to do or understand after your presentation?
- **Constraints:** Time limits, technical restrictions, or organizational considerations

**Example context:**

```text
I'm presenting to client developers who currently use manual release creation
with datestamps. They've never used automated releases before. The goal is to
demonstrate how Semantic Release would benefit them, but this represents a
completely new way of working. The audience is skeptical of change and needs
to see concrete benefits and a clear migration path.
```

This context will produce a much more targeted presentation than a generic prompt about Semantic Release.

### Example AI Prompt

```markdown
You are a presentation expert with a deep understanding of software development and delivery.

CONTEXT: [Add your specific context here - audience, situation, goals, constraints]

Your goal is to review and update a Reveal.js presentation deck based on the provided context and attached files. Follow these detailed steps:

1. Analyze the 'Challenge,' 'Solution,' and 'Benefits' sections at the top of the current deck, as well as the content in the attached files (if any).
2. Consider the specific audience, situation, and goals provided in the CONTEXT section above.
3. Identify key points, gaps, or outdated information in each section.
4. Incorporate relevant insights from the attached files to enrich and clarify each section.
5. Tailor the content to address the specific audience needs and concerns mentioned in the context.
6. Ensure the updated sections are concise, clear, and aligned with the overall presentation goal.
7. Keep the content structured so the deck can be delivered in a 15 minute presentation.
8. Be sure to include notes and talking points for each slide.
9. Search the web for any relevant resources and information as necessary

CONTENT LIMITS (CRITICAL for 1920x1080 displays):
- Maximum 4 bullet points per slide
- Use only ONE content type per slide (code OR image OR list, not multiple)
- For code slides: ONE code block maximum per slide, keep code concise (under 15 lines)
- For lists with 3+ items: add style="font-size: 0.8em" to the <ul> element
- Keep paragraphs to 2-3 sentences maximum
- Images should have style="max-height: 60vh; object-fit: contain" constraint
- Callout slides: header + callout + maximum 2 bullet points
- Avoid combining multiple content types on the same slide
```

### Post-Generation

1. Review the generated deck for accuracy and completeness.
2. Remove the instruction comments from the top of your presentation file.
3. Make any necessary adjustments to the deck.
4. Be sure the title slide has the correct title, subtitle, and presenter name.
5. Export the deck to PDF for easy sharing after you've completed your presentation (see below).

## Exporting to PDF

You can easily export your presentation to PDF using our automated export tool. This approach uses [decktape](https://github.com/astefanutti/decktape) for high-quality PDF generation.

### Interactive PDF Export (Recommended)

```bash
npm run export-pdf
```

This will launch an interactive terminal interface that:

- Shows a list of all available presentations
- Lets you select which presentation to export
- Asks if you want to include speaker notes
- Confirms before overwriting existing PDFs
- Provides clear status updates throughout the process

### Command Line PDF Export

```bash
npm run export-pdf my_presentation.html
```

This command will:

1. Automatically start the reveal.js server
2. Generate a PDF with the same name as your presentation title
3. Clean up and stop the server when complete

### Including Speaker Notes

To include your speaker notes on separate pages in the PDF:

```bash
npm run export-pdf my_presentation.html --show-notes
```

The script will temporarily configure reveal.js to show notes on separate pages, generate the PDF, then restore the original configuration.

### How It Works

The export script:

- **Extracts the presentation title** from your HTML file's `<title>` tag or first heading
- **Generates a clean filename** by sanitizing the title (e.g., "My Great Presentation" becomes "My-Great-Presentation.pdf")
- **Handles server management** automatically - no need to manually start/stop the server
- **Manages configuration** - temporarily enables speaker notes if requested, then restores settings

### Advanced Options

**Custom Port**: By default, the script uses a random port (8001-9999) to avoid conflicts. You can specify a custom port:

```bash
npm run export-pdf my_presentation.html --port 8080
```

**Force Overwrite**: Skip the confirmation prompt when overwriting existing PDFs:

```bash
npm run export-pdf my_presentation.html --overwrite
```

### Examples

```bash
# Export without speaker notes (uses random port)
npm run export-pdf client_demo.html
# Output: Client-Demo.pdf

# Export with speaker notes on separate pages
npm run export-pdf team_training.html --show-notes
# Output: Team-Training.pdf (with notes)

# Export using a specific port
npm run export-pdf my_deck.html --port 3000
# Output: My-Deck.pdf

# Combine all options
npm run export-pdf presentation.html --show-notes --port 8080
# Output: Presentation.pdf (with notes, using port 8080)
```

## Template Features

### Slide Types

1. **Title Slide**: Includes Liatrio logo, optional client logo, title, subtitle, and presenter name
2. **Content Slides**: Standard slides with headers and bullet points
3. **Image Slides**: For screenshots and diagrams
4. **Code Slides**: Syntax-highlighted code blocks with optional filenames
5. **Callout Slides**: Special emphasis boxes for important information
6. **Summary Slides**: For key takeaways and next steps

### Special Features

- **Fragments**: Add `class="fragment"` to list items to reveal them one by one
- **Speaker Notes**: Add notes using `<aside class="notes">...</aside>` blocks
- **Transitions**: Control slide transitions with `data-transition="fade"` (or slide, convex, concave, zoom)
- **Background Colors**: Use `data-background-color="#hexcolor"` on sections
- **Code Highlighting**: Supports multiple languages with line numbers
- **Reminder Slide**: Template includes a reminder to use speaker notes (press 'S')

## Additional Tips

- Review the template for example slides, code, callouts, and speaker notes
- Keep slides focused and concise
- Use callouts sparingly for maximum impact
- Test your presentation in presenter mode (press 'S') to see speaker notes
- Reach out to the DevOps Enablement team if you need help or want to contribute improvements
- Preview your presentation in the format you will present (for example, a 1920x1080 resolution) to be sure it looks correct and content fits on the slides

## Git Ignore Configuration

The repository is configured to ignore:

- All HTML presentation files in `liatrio_decks/` (except `liatrio_deck_template.html`)
- All files in `liatrio_decks/custom_assets/` (except `.keep`)

This ensures that personal presentations and custom assets are not accidentally committed to the repository.

---

For more details on Reveal.js features, see the [Reveal.js documentation](https://revealjs.com/).
