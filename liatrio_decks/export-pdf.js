#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Check if inquirer is available, if not provide installation instructions
let inquirer;
try {
  inquirer = require('inquirer');
} catch (error) {
  console.error('❌ Inquirer.js is required for the TUI interface.');
  console.error('Please install it by running: npm install inquirer@^8.2.6');
  process.exit(1);
}

const execAsync = promisify(exec);

// Parse command line arguments
const args = process.argv.slice(2);
const showNotes = args.includes('--show-notes');
const overwriteFlag = args.includes('--overwrite');
const portIndex = args.findIndex(arg => arg === '--port');
const customPort = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1]) : null;

// Generate a random port between 8001-9999 to avoid conflicts
const defaultPort = Math.floor(Math.random() * (9999 - 8001 + 1)) + 8001;
const port = customPort || defaultPort;

// Function to get all HTML files in liatrio_decks directory
function getHtmlFiles() {
  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.html') && file !== 'liatrio_deck_template.html')
    .map(file => ({
      name: file,
      value: file
    }));
  
  if (files.length === 0) {
    console.error('❌ No HTML presentation files found in liatrio_decks directory.');
    console.error('Make sure you have .html files in the liatrio_decks folder.');
    process.exit(1);
  }
  
  return files;
}

// Function to check if PDF already exists
function pdfExists(htmlFile) {
  const pdfFile = htmlFile.replace('.html', '.pdf');
  const pdfPath = path.join(__dirname, pdfFile);
  return fs.existsSync(pdfPath);
}

async function extractPresentationTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Try to extract title from <title> tag
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // Try to extract from first h1 or h2 in slides
    const h1Match = content.match(/<h[12][^>]*>([^<]+)<\/h[12]>/i);
    if (h1Match) {
      return h1Match[1].trim();
    }
    
    // Fallback to filename without extension
    return path.basename(filePath, path.extname(filePath));
  } catch (error) {
    console.warn('Could not extract title from presentation, using filename');
    return path.basename(filePath, path.extname(filePath));
  }
}

async function startServer(port) {
  return new Promise((resolve, reject) => {
    console.log(`Starting reveal.js server on port ${port}...`);
    // Run from project root directory
    const server = spawn('npx', ['gulp', 'serve', '--port', port.toString()], { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    
    let serverReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server running') || output.includes(`localhost:${port}`)) {
        if (!serverReady) {
          serverReady = true;
          console.log(`Server is ready on port ${port}!`);
          resolve(server);
        }
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    server.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Server failed to start within 10 seconds'));
      }
    }, 10000);
  });
}

async function generatePDF(deckFile, outputFile, port, showNotes) {
  let url = `http://localhost:${port}/liatrio_decks/${deckFile}`;
  
  // Add showNotes as URL parameter if needed
  if (showNotes) {
    url += '?showNotes=separate-page';
  }
  
  console.log(`\n📄 Generating PDF from ${url}...`);
  
  // Output PDF to liatrio_decks folder
  const outputPath = path.join(__dirname, outputFile);
  
  return new Promise((resolve, reject) => {
    const decktape = spawn('npx', ['decktape', 'reveal', url, outputPath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    decktape.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ PDF successfully generated: ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`Decktape exited with code ${code}`));
      }
    });
    
    decktape.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  let server = null;
  
  try {
    console.log('\n🎯 Reveal.js PDF Export Tool\n');
    
    // Get available HTML files
    const htmlFiles = getHtmlFiles();
    
    // Prompt user to select a file
    const { selectedFile } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFile',
        message: '📁 Select a presentation file to export:',
        choices: htmlFiles,
        pageSize: 10
      }
    ]);
    
    // Check if PDF already exists
    const pdfFile = selectedFile.replace('.html', '.pdf');
    const pdfPath = path.join(__dirname, pdfFile);
    const exists = pdfExists(selectedFile);
    
    if (exists && !overwriteFlag) {
      const { shouldOverwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldOverwrite',
          message: `⚠️  PDF file '${pdfFile}' already exists. Overwrite it?`,
          default: false
        }
      ]);
      
      if (!shouldOverwrite) {
        console.log('\n❌ Export cancelled by user.');
        process.exit(0);
      }
    }
    
    // Prompt for speaker notes inclusion
    const { includeNotes } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeNotes',
        message: '📝 Include speaker notes in the PDF?',
        default: showNotes
      }
    ]);
    
    // Extract presentation title for display
    const deckPath = path.join(__dirname, selectedFile);
    const title = await extractPresentationTitle(deckPath);
    
    console.log(`\n📊 Exporting presentation: ${title}`);
    console.log(`📁 Output file: ${pdfFile}`);
    console.log(`📝 Speaker notes: ${includeNotes ? 'Included' : 'Excluded'}`);
    
    // Start the server
    console.log(`\n🚀 Starting reveal.js server on port ${port}...`);
    server = await startServer(port);
    
    // Wait a moment for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF
    await generatePDF(selectedFile, pdfFile, port, includeNotes);
    
    console.log('\n🎉 PDF export completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during PDF export:', error.message);
    process.exit(1);
  } finally {
    // Clean up: kill the server
    if (server) {
      console.log('\n🛑 Stopping server...');
      server.kill();
    }
  }
}

main();
