#!/usr/bin/env node

/**
 * Custom presentation generator for toilet clogging presentation
 * Uses AdaptiveX theme and image-factory integration
 */

const fs = require('fs');
const path = require('path');

// Load dotenv to get environment variables from image-factory
require('dotenv').config({ path: path.join(__dirname, '../../.claude/skills/image-factory/.env') });

// Try to load image-factory
let ImageFactory;
try {
  ImageFactory = require('../../.claude/skills/image-factory/scripts/index.js');
} catch (error) {
  console.warn('Warning: image-factory not available, continuing without images');
  ImageFactory = null;
}

/**
 * Convert image to base64
 */
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Failed to convert image: ${error.message}`);
    return null;
  }
}

/**
 * Generate AdaptiveX themed HTML template
 */
function generateAdaptiveXTemplate(markdownContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toilet Clog Resolution - Quick Presentation</title>

  <!-- Reveal.js core CSS -->
  <link rel="stylesheet" href="../../dist/reset.css">
  <link rel="stylesheet" href="../../dist/reveal.css">

  <!-- AdaptiveX theme -->
  <link rel="stylesheet" href="../../dist/theme/adaptivex.css">

  <!-- Syntax highlighting -->
  <link rel="stylesheet" href="../../plugin/highlight/monokai.css">

  <style>
    /* Custom styling for presentation */
    .reveal .slides {
      text-align: left;
    }

    .reveal h1, .reveal h2, .reveal h3 {
      text-align: center;
    }

    .reveal section {
      height: auto;
      max-height: 90vh;
      overflow: hidden;
      padding: 20px 40px;
    }

    .reveal h1 {
      font-size: 2.2em;
      margin-bottom: 0.3em;
    }

    .reveal h2 {
      font-size: 1.6em;
      margin-bottom: 0.4em;
      margin-top: 0.4em;
    }

    .reveal h3 {
      font-size: 1.2em;
      margin-bottom: 0.3em;
    }

    .reveal ul, .reveal ol {
      margin-top: 0.8em;
      margin-bottom: 0.8em;
    }

    .reveal li {
      margin-bottom: 0.4em;
      font-size: 0.9em;
      line-height: 1.4;
    }

    .reveal p {
      font-size: 0.9em;
      line-height: 1.4;
      margin-bottom: 0.6em;
    }

    .hero-image {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      box-shadow: 0 4px 20px rgba(107, 63, 160, 0.3);
    }

    .side-image {
      width: 300px;
      max-height: 250px;
      object-fit: cover;
      float: right;
      margin-left: 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(107, 63, 160, 0.3);
    }

    .reveal .accent {
      color: #F9C80E;
      font-weight: 600;
    }

    .reveal strong {
      color: #6B3FA0;
      font-weight: 600;
    }

    /* Ensure content doesn't overflow */
    .reveal .slides > section > * {
      max-width: 100%;
    }

    /* Title slide adjustments */
    .reveal .slides > section:first-child h1 {
      margin-top: 0.2em;
    }

    /* Prevent text wrapping issues */
    .reveal .slides section {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section data-markdown data-separator="^---" data-separator-vertical="^--">
        <textarea data-template>
${markdownContent}
        </textarea>
      </section>
    </div>
  </div>

  <script src="../../dist/reveal.js"></script>
  <script src="../../plugin/markdown/markdown.js"></script>
  <script src="../../plugin/highlight/highlight.js"></script>
  <script src="../../plugin/notes/notes.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      controls: true,
      progress: true,
      center: false,
      transition: 'slide',
      slideNumber: true,
      plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ],
      markdown: {
        smartypants: true
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Generate markdown content for toilet clog presentation
 */
function generateToiletMarkdown(heroImageBase64 = null, solutionImageBase64 = null) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let markdown = `# Toilet Clog Resolution

### A Systematic Approach to Plumbing Emergencies

${today}
`;

  // Add hero image if available
  if (heroImageBase64) {
    markdown += `\n![Hero Image](${heroImageBase64})\n<!-- .element: class="hero-image" -->\n`;
  }

  markdown += `
---

## The Challenge

Clogged toilets present critical obstacles:

- Immediate disruption to daily operations
- Potential water damage and overflow risks
- Stress and inconvenience for building occupants
- Risk of escalation without proper intervention

Note: Discuss the urgency and impact of plumbing emergencies on productivity

---

## Our Solution
`;

  // Add solution image if available
  if (solutionImageBase64) {
    markdown += `\n![Solution Image](${solutionImageBase64})\n<!-- .element: class="side-image" -->\n`;
  }

  markdown += `
A comprehensive approach that addresses:

- **Immediate Response**: Professional assessment within 30 minutes
- **Proven Techniques**: Multiple resolution methods from basic to advanced
- **Preventive Measures**: Long-term solutions to prevent recurrence

Note: Highlight our systematic methodology and professional expertise

---

## Key Benefits

- **Fast Resolution**: <span class="accent">90%</span> of clogs cleared within 15 minutes
- **Cost Effective**: <span class="accent">$150</span> average service cost vs. <span class="accent">$2,500</span> flood damage
- **Peace of Mind**: <span class="accent">100%</span> satisfaction guaranteed with follow-up support

Note: Share success stories and emphasize value proposition

---

## Next Steps

### Ready to Resolve Your Issue?

1. **Call Now**: 24/7 emergency hotline at 1-800-PLUMBER
2. **Assess Severity**: Our team evaluates and provides immediate guidance
3. **Schedule Service**: Same-day appointments available

**Don't let a clog become a catastrophe - Contact us today!**

Note: End with clear call to action and emergency contact information
`;

  return markdown;
}

/**
 * Main function to generate the presentation
 */
async function generatePresentation() {
  console.log('🚽 Generating Toilet Clog Resolution Presentation...\n');

  const startTime = Date.now();
  let heroImageBase64 = null;
  let solutionImageBase64 = null;
  const imageDetails = [];

  // Generate images if image-factory is available
  if (ImageFactory) {
    try {
      console.log('Initializing image-factory...');
      const factory = new ImageFactory();

      // Generate hero image
      console.log('Generating hero image...');
      try {
        const heroPrompt = 'modern bathroom interior with elegant fixtures and clean design, professional photography';
        const heroResult = await factory.generateImage(heroPrompt, 'photorealistic', '16:9');
        heroImageBase64 = imageToBase64(heroResult.localPath);
        imageDetails.push({
          type: 'hero',
          prompt: heroPrompt,
          cached: heroResult.cached
        });
        console.log(`✓ Hero image ${heroResult.cached ? '(cached)' : '(generated)'}`);
      } catch (error) {
        console.warn(`⚠ Hero image failed: ${error.message}`);
      }

      // Generate solution image
      console.log('Generating solution image...');
      try {
        const solutionPrompt = 'professional plumber with tools solving plumbing problem, illustration style, clean and professional';
        const solutionResult = await factory.generateImage(solutionPrompt, 'illustration', '16:9');
        solutionImageBase64 = imageToBase64(solutionResult.localPath);
        imageDetails.push({
          type: 'solution',
          prompt: solutionPrompt,
          cached: solutionResult.cached
        });
        console.log(`✓ Solution image ${solutionResult.cached ? '(cached)' : '(generated)'}`);
      } catch (error) {
        console.warn(`⚠ Solution image failed: ${error.message}`);
      }
    } catch (error) {
      console.error(`Image generation error: ${error.message}`);
      console.log('Continuing without images...');
    }
  } else {
    console.log('⚠ Image-factory not available, generating presentation without images\n');
  }

  // Generate markdown content
  console.log('Generating markdown content...');
  const markdownContent = generateToiletMarkdown(heroImageBase64, solutionImageBase64);

  // Generate HTML
  console.log('Generating HTML with AdaptiveX theme...');
  const html = generateAdaptiveXTemplate(markdownContent);

  // Ensure output directory exists
  const outputDir = __dirname;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write HTML file
  const outputPath = path.join(outputDir, 'toilet-presentation.html');
  fs.writeFileSync(outputPath, html, 'utf8');

  // Calculate metrics
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const fileSize = fs.statSync(outputPath).size;
  const fileSizeKB = (fileSize / 1024).toFixed(1);

  // Output summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ PRESENTATION GENERATED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 File Size: ${fileSizeKB}KB`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`🖼️  Images: ${imageDetails.length}/2 generated`);
  console.log(`🎨 Theme: AdaptiveX`);
  console.log(`📄 Slides: 5`);

  if (imageDetails.length > 0) {
    console.log('\nImage Details:');
    imageDetails.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img.type}: ${img.cached ? 'cached' : 'generated'}`);
    });
  }

  console.log('\n📖 To view: Open the file in your browser or run:');
  console.log(`   start ${outputPath}`);
  console.log('='.repeat(60) + '\n');

  return {
    outputPath,
    fileSize: fileSizeKB + 'KB',
    duration: duration + 's',
    imagesGenerated: imageDetails.length,
    theme: 'adaptivex'
  };
}

// Run if executed directly
if (require.main === module) {
  generatePresentation()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error generating presentation:', error);
      process.exit(1);
    });
}

module.exports = generatePresentation;
