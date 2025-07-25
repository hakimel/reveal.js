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
    ```

4. Open <http://localhost:8000/liatrio_decks> in your browser to view the template and any decks you create.

### Making a New Deck

1. **Copy the Template File**
   - Duplicate `liatrio_deck_template.html` and rename it for your presentation (e.g., `my_presentation.html`).
   - Note: All HTML files in the `liatrio_decks/` folder are git-ignored except for the template file, so your custom presentations won't be accidentally committed.

2. **Customize Your Deck**
   - Update the title, subtitle, and presenter fields.
   - Replace example slides and content with your own material.
   - Add or remove slides as needed.
   - Replace images/screenshots where indicated.
   - Use the provided code block and callout examples as a starting point for technical content.
   - Store any custom assets (images, logos, etc.) in the `liatrio_decks/custom_assets/` folder - all files in this folder are git-ignored.
   - **Client Logo**: To display a client logo alongside the Liatrio logo on the title slide, add a `client_logo.jpeg` file to `static/images/`. If no client logo is found, only the Liatrio logo will be displayed.

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

1. Open this directory in your IDE along with the code you're working on.
2. Add the [liatrio_decks](liatrio_decks) directory to your AI context
3. Add git logs, PR descriptions, and other relevant references to the AI context
4. Instruct the AI to generate a new deck from the template based on the context
5. Review the generated deck for accuracy and completeness
6. Make any necessary adjustments to the deck

## Exporting to PDF

You can easily export your presentation to PDF using our automated npm task. This approach uses [decktape](https://github.com/astefanutti/decktape) for high-quality PDF generation.

### Basic PDF Export

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

## Additional Tips

- Review the template for example slides, code, callouts, and speaker notes.
- Keep slides focused and concise.
- Use callouts sparingly for maximum impact.
- Reach out to the DevOps Enablement team if you need help or want to contribute improvements.

## Git Ignore Configuration

The repository is configured to ignore:

- All HTML presentation files in `liatrio_decks/` (except `liatrio_deck_template.html`)
- All files in `liatrio_decks/custom_assets/` (except `.keep`)

This ensures that personal presentations and custom assets are not accidentally committed to the repository.

---

For more details on Reveal.js features, see the [Reveal.js documentation](https://revealjs.com/).
