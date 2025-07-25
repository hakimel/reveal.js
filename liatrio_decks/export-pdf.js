#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Parse command line arguments
const args = process.argv.slice(2);
const showNotes = args.includes('--show-notes');
const portIndex = args.findIndex(arg => arg === '--port');
const customPort = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1]) : null;
const deckFile = args.find(arg => !arg.startsWith('--') && arg !== (customPort ? customPort.toString() : ''));

// Generate a random port between 8001-9999 to avoid conflicts
const defaultPort = Math.floor(Math.random() * (9999 - 8001 + 1)) + 8001;
const port = customPort || defaultPort;

if (!deckFile) {
  console.error('Usage: npm run export-pdf <deck-file> [--show-notes] [--port <port>]');
  console.error('Example: npm run export-pdf my_presentation.html --show-notes');
  console.error('Example: npm run export-pdf my_presentation.html --port 8080');
  process.exit(1);
}

// Ensure the deck file exists (now in same directory)
const deckPath = path.join(__dirname, deckFile);
if (!fs.existsSync(deckPath)) {
  console.error(`Error: Deck file ${deckFile} not found in liatrio_decks directory`);
  process.exit(1);
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
  
  console.log(`Generating PDF from ${url}...`);
  
  return new Promise((resolve, reject) => {
    const decktape = spawn('npx', ['decktape', 'reveal', url, outputFile], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    decktape.on('close', (code) => {
      if (code === 0) {
        console.log(`PDF successfully generated: ${outputFile}`);
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
    // Extract presentation title for PDF filename
    const title = await extractPresentationTitle(deckPath);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
    const outputFile = `${sanitizedTitle}.pdf`;
    
    console.log(`Exporting presentation: ${title}`);
    console.log(`Output file: ${outputFile}`);
    
    // Start the server
    server = await startServer(port);
    
    // Wait a moment for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF
    await generatePDF(deckFile, outputFile, port, showNotes);
    
    console.log('PDF export completed successfully!');
    
  } catch (error) {
    console.error('Error during PDF export:', error.message);
    process.exit(1);
  } finally {
    // Clean up: kill the server
    if (server) {
      console.log('Stopping server...');
      server.kill();
    }
    

  }
}

main();
