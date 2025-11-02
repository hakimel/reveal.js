#!/usr/bin/env node

/**
 * Smart Reveal.js Startup Script
 *
 * Automatically detects if LLM Runner plugin is installed and starts both:
 * 1. Reveal.js presentation server (npm start)
 * 2. LLM Runner backend server (Python)
 *
 * If LLM Runner is not detected, falls back to just starting reveal.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
    console.log('\n' + '='.repeat(60));
    log(message, colors.bright + colors.cyan);
    console.log('='.repeat(60) + '\n');
}

// Check if LLM Runner plugin exists
const llmRunnerPath = path.join(__dirname, 'plugin', 'llm-runner');
const llmRunnerServerPath = path.join(llmRunnerPath, 'server.py');
const llmRunnerEnvPath = path.join(llmRunnerPath, '.env');
const hasLLMRunner = fs.existsSync(llmRunnerServerPath);

logHeader('Reveal.js Smart Startup');

if (hasLLMRunner) {
    log('✓ LLM Runner plugin detected', colors.green);

    // Check if .env file exists
    if (!fs.existsSync(llmRunnerEnvPath)) {
        log('⚠ Warning: LLM Runner .env file not found', colors.yellow);
        log('  Copy plugin/llm-runner/.env.example to .env and add your API keys', colors.yellow);
    } else {
        log('✓ LLM Runner configuration found', colors.green);
    }

    log('\nStarting servers...', colors.bright);

    // Start Reveal.js server
    log('\n[1/2] Starting Reveal.js server (port 8000)...', colors.blue);
    const revealServer = spawn('npm', ['start'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
    });

    revealServer.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            log(`[Reveal.js] ${output}`, colors.blue);
        }
    });

    revealServer.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output && !output.includes('EADDRINUSE')) {
            log(`[Reveal.js] ${output}`, colors.yellow);
        }
    });

    // Give reveal.js a moment to start
    setTimeout(() => {
        // Start LLM Runner Python server
        log('\n[2/2] Starting LLM Runner server (port 8001)...', colors.magenta);

        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
        const llmServer = spawn(pythonCmd, ['server.py'], {
            cwd: llmRunnerPath,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        llmServer.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                log(`[LLM Runner] ${output}`, colors.magenta);
            }
        });

        llmServer.stderr.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                // Filter out uvicorn info logs to keep output clean
                if (output.includes('INFO:') || output.includes('Uvicorn running')) {
                    log(`[LLM Runner] ${output}`, colors.magenta);
                } else if (!output.includes('WARNING')) {
                    log(`[LLM Runner] ${output}`, colors.yellow);
                }
            }
        });

        llmServer.on('error', (err) => {
            log(`\n✗ Failed to start LLM Runner server: ${err.message}`, colors.yellow);
            log('  Make sure Python and required packages are installed:', colors.yellow);
            log('  cd plugin/llm-runner && pip install -r requirements.txt', colors.yellow);
            log('\n  Reveal.js will continue running without LLM Runner.', colors.yellow);
        });

        llmServer.on('exit', (code) => {
            if (code !== 0 && code !== null) {
                log(`\n✗ LLM Runner server exited with code ${code}`, colors.yellow);
            }
        });

        // Success message
        setTimeout(() => {
            logHeader('Servers Ready!');
            log('Reveal.js:   http://localhost:8000', colors.green);
            log('LLM Runner:  ws://localhost:8001/ws', colors.green);
            log('\nPress Ctrl+C to stop both servers\n', colors.bright);
        }, 2000);

        // Handle shutdown
        let shuttingDown = false;
        const shutdown = () => {
            if (shuttingDown) return;
            shuttingDown = true;

            log('\n\nShutting down servers...', colors.yellow);

            try {
                llmServer.kill();
                log('✓ LLM Runner server stopped', colors.green);
            } catch (e) {
                // Server might already be stopped
            }

            try {
                revealServer.kill();
                log('✓ Reveal.js server stopped', colors.green);
            } catch (e) {
                // Server might already be stopped
            }

            setTimeout(() => process.exit(0), 500);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('exit', shutdown);

    }, 1500);

} else {
    // No LLM Runner, just start reveal.js
    log('ℹ LLM Runner plugin not detected', colors.yellow);
    log('  Starting Reveal.js only...\n', colors.yellow);

    const revealServer = spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: true
    });

    revealServer.on('error', (err) => {
        log(`✗ Failed to start Reveal.js: ${err.message}`, colors.yellow);
        process.exit(1);
    });

    revealServer.on('exit', (code) => {
        process.exit(code || 0);
    });
}
