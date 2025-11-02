/*!
 * reveal.js LLM Runner plugin
 * Enables interactive LLM-powered chat and Python code execution in slides
 */
(function(root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.RevealLLMRunner = factory();
    }
}(this, function() {

    const Plugin = () => {
        let deck;
        let config = {
            serverUrl: 'ws://localhost:8000/ws',
            defaultModel: 'claude-3-5-sonnet-20241022',
            autoConnect: true,
            persistContext: true,
            shortcuts: {
                run: 'Shift-Enter',
                clear: 'Shift-KeyC'
            }
        };

        let ws = null;
        let isConnected = false;
        let reconnectAttempts = 0;
        let maxReconnectAttempts = 5;
        let slideContexts = new Map(); // Store execution contexts per slide
        // Streaming text buffer per runner to normalize line breaks
        const streamBuffers = new Map();
        let customMessageHandlers = new Map(); // Store custom handlers for runPrompt calls

        /**
         * Initialize WebSocket connection to backend server
         */
        function connectWebSocket() {
            if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
                return;
            }

            try {
                ws = new WebSocket(config.serverUrl);

                ws.onopen = () => {
                    console.log('[LLM Runner] Connected to server');
                    isConnected = true;
                    reconnectAttempts = 0;
                    updateAllConnectionStatus(true);
                };

                ws.onmessage = (event) => {
                    handleServerMessage(JSON.parse(event.data));
                };

                ws.onerror = (error) => {
                    console.error('[LLM Runner] WebSocket error:', error);
                    isConnected = false;
                    updateAllConnectionStatus(false);
                };

                ws.onclose = () => {
                    console.log('[LLM Runner] Disconnected from server');
                    isConnected = false;
                    updateAllConnectionStatus(false);

                    // Attempt to reconnect
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        setTimeout(() => {
                            console.log(`[LLM Runner] Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
                            connectWebSocket();
                        }, 2000 * reconnectAttempts);
                    }
                };
            } catch (error) {
                console.error('[LLM Runner] Failed to create WebSocket:', error);
            }
        }

        /**
         * Send message to server via WebSocket
         */
        function sendToServer(message) {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                console.error('[LLM Runner] WebSocket not connected');
                return false;
            }

            ws.send(JSON.stringify(message));
            return true;
        }

        /**
         * Handle incoming messages from server
         */
        function handleServerMessage(message) {
            // Check if this message is for a custom handler (from runPrompt)
            if (customMessageHandlers.has(message.runnerId)) {
                const handler = customMessageHandlers.get(message.runnerId);
                handler(message);
                return;
            }

            // Regular runner element handling
            const wrapper = document.querySelector(`[data-runner-id="${message.runnerId}"]`);
            if (!wrapper) return;

            const outputArea = wrapper.querySelector('.llm-runner-output');
            const statusIndicator = wrapper.querySelector('.llm-runner-status');

            switch (message.type) {
                case 'output':
                    appendOutput(outputArea, message.data, message.stream);
                    break;

                case 'error':
                    appendOutput(outputArea, message.data, false, true);
                    setStatus(statusIndicator, 'error', message.data);
                    break;

                case 'complete':
                    setStatus(statusIndicator, 'ready', 'Ready');
                        // Clear buffer for this runner
                        streamBuffers.delete(message.runnerId);
                    break;

                case 'streaming':
                    appendOutput(outputArea, message.data, true);
                    setStatus(statusIndicator, 'running', 'Streaming...');
                    break;
            }
        }

        /**
         * Update connection status for all runners
         */
        function updateAllConnectionStatus(connected) {
            document.querySelectorAll('.llm-runner-status').forEach(status => {
                if (connected) {
                    status.classList.remove('disconnected');
                    status.textContent = 'Ready';
                } else {
                    status.classList.add('disconnected');
                    status.textContent = 'Disconnected';
                }
            });
        }

        /**
         * Append output to output area
         */
        function appendOutput(outputArea, text, isStreaming = false, isError = false) {
            if (isStreaming) {
                // For streaming, update the last line or create new one
                let lastLine = outputArea.querySelector('.stream-line:last-child');
                if (!lastLine) {
                    lastLine = document.createElement('div');
                    lastLine.className = 'stream-line';
                    outputArea.appendChild(lastLine);
                }
                lastLine.textContent += text;
            } else {
                const line = document.createElement('div');
                line.className = isError ? 'error-line' : 'output-line';
                line.textContent = text;
                outputArea.appendChild(line);
            }

            // Auto-scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        }

        /**
         * Set status indicator
         */
        function setStatus(statusIndicator, state, text) {
            statusIndicator.className = 'llm-runner-status ' + state;
            statusIndicator.textContent = text;
        }

        /**
         * Clear output area
         */
        function clearOutput(wrapper) {
            const outputArea = wrapper.querySelector('.llm-runner-output');
            outputArea.innerHTML = '';
        }

        /**
         * Execute code or send LLM prompt
         */
        function executeRunner(wrapper) {
            const runnerId = wrapper.dataset.runnerId;
            const type = wrapper.dataset.type;
            const editor = wrapper.querySelector('.llm-runner-editor');
            const code = editor.value;
            const statusIndicator = wrapper.querySelector('.llm-runner-status');
            const outputArea = wrapper.querySelector('.llm-runner-output');

            if (!code.trim()) return;

            // Get slide index for context
            const slide = wrapper.closest('.slides section');
            const slideIndex = deck.getIndices(slide);
            const slideId = `${slideIndex.h}-${slideIndex.v || 0}`;

            setStatus(statusIndicator, 'running', 'Running...');

            // Clear previous output
            outputArea.innerHTML = '';

            // Build message; do NOT send model so backend uses .env default
            const message = {
                type: type,
                runnerId: runnerId,
                code: code,
                slideId: slideId,
                persistContext: config.persistContext
            };

            if (!sendToServer(message)) {
                setStatus(statusIndicator, 'error', 'Connection failed');
                appendOutput(outputArea, 'Error: Not connected to server', false, true);
            }
        }

        /**
         * Create UI wrapper for a runner block
         */
        function createRunnerUI(element, index) {
            const type = element.dataset.type || 'python';
            const code = element.textContent.trim();
            const runnerId = `runner-${Date.now()}-${index}`;

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'llm-runner-wrapper';
            wrapper.dataset.runnerId = runnerId;
            wrapper.dataset.type = type;
            // Intentionally omit model dataset to defer to backend .env default

            // Create toolbar
            const toolbar = document.createElement('div');
            toolbar.className = 'llm-runner-toolbar';

            // Type indicator
            const typeLabel = document.createElement('span');
            typeLabel.className = 'llm-runner-type';
            typeLabel.textContent = type === 'python' ? 'Python' : type === 'llm' ? 'LLM' : 'Mixed';
            toolbar.appendChild(typeLabel);

            // Removed model selector: model is taken from backend .env

            // Status indicator
            const status = document.createElement('span');
            status.className = 'llm-runner-status';
            status.textContent = isConnected ? 'Ready' : 'Disconnected';
            if (!isConnected) status.classList.add('disconnected');
            toolbar.appendChild(status);

            wrapper.appendChild(toolbar);

            // Create editor area
            const editor = document.createElement('textarea');
            editor.className = 'llm-runner-editor';
            editor.value = code;
            editor.spellcheck = false;
            editor.placeholder = type === 'python' ? 'Enter Python code...' :
                               type === 'llm' ? 'Enter your prompt...' :
                               'Enter Python code with LLM calls...';

            // Add keyboard shortcuts
            editor.addEventListener('keydown', (e) => {
                // Shift+Enter to run
                if (e.shiftKey && e.key === 'Enter') {
                    e.preventDefault();
                    executeRunner(wrapper);
                }
                // Shift+C to clear
                if (e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    clearOutput(wrapper);
                }
                // Tab key for indentation
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 4;
                }
            });

            wrapper.appendChild(editor);

            // Actions row (buttons below editor, above output)
            const actions = document.createElement('div');
            actions.className = 'llm-runner-actions';

            const runBtn = document.createElement('button');
            runBtn.className = 'llm-runner-btn llm-runner-btn-primary';
            runBtn.textContent = 'Run';
            runBtn.title = 'Run code (Shift+Enter)';
            runBtn.addEventListener('click', () => executeRunner(wrapper));
            actions.appendChild(runBtn);

            const clearBtn = document.createElement('button');
            clearBtn.className = 'llm-runner-btn llm-runner-btn-ghost';
            clearBtn.textContent = 'Clear';
            clearBtn.title = 'Clear output (Shift+C)';
            clearBtn.addEventListener('click', () => clearOutput(wrapper));
            actions.appendChild(clearBtn);

            wrapper.appendChild(actions);

            // Create output area
            const outputArea = document.createElement('div');
            outputArea.className = 'llm-runner-output';
            wrapper.appendChild(outputArea);

            // Replace original element
            element.parentNode.replaceChild(wrapper, element);
        }

        /**
         * Initialize all runner blocks on the current slide
         */
        function initializeRunners() {
            const runners = deck.getRevealElement().querySelectorAll('pre.llm-runner:not([data-initialized])');

            runners.forEach((runner, index) => {
                runner.dataset.initialized = 'true';
                createRunnerUI(runner, index);
            });
        }

        /**
         * Public method to enhance dynamically added runners
         * Useful for offcanvas or modal integrations
         */
        function enhanceRunners() {
            const runners = document.querySelectorAll('pre.llm-runner:not([data-initialized])');

            runners.forEach((runner, index) => {
                runner.dataset.initialized = 'true';
                createRunnerUI(runner, index);
            });
        }

        /**
         * Inject CSS styles
         */
        function injectStyles() {
            if (document.getElementById('llm-runner-styles')) return;

            // Get the path to this script to calculate CSS path
            const scripts = document.getElementsByTagName('script');
            let scriptPath = '';
            for (let script of scripts) {
                if (script.src && script.src.includes('llm-runner.js')) {
                    scriptPath = script.src.substring(0, script.src.lastIndexOf('/'));
                    break;
                }
            }

            const link = document.createElement('link');
            link.id = 'llm-runner-styles';
            link.rel = 'stylesheet';
            // Use the same directory as the JS file
            link.href = scriptPath + '/llm-runner.css';
            document.head.appendChild(link);
        }

        return {
            id: 'llm-runner',

            init: function(reveal) {
                try {
                    deck = reveal;

                    // Merge user config
                    const userConfig = deck.getConfig().llmRunner || {};
                    config = { ...config, ...userConfig };

                    console.log('[LLM Runner] Config:', config);

                    // Inject styles
                    injectStyles();

                    // Connect to WebSocket server
                    if (config.autoConnect) {
                        console.log('[LLM Runner] Auto-connecting to:', config.serverUrl);
                        connectWebSocket();
                    }

                    // Initialize runners
                    initializeRunners();

                    // Re-initialize on slide change (for dynamically loaded slides)
                    deck.on('slidechanged', () => {
                        initializeRunners();
                    });

                    // Cleanup on Reveal.js destroy
                    deck.on('destroy', () => {
                        if (ws) {
                            ws.close();
                        }
                    });

                    console.log('[LLM Runner] Plugin initialized successfully');
                } catch (error) {
                    console.error('[LLM Runner] Initialization error:', error);
                    throw error;
                }
            },

            // Public API
            connect: connectWebSocket,
            disconnect: () => {
                if (ws) ws.close();
            },
            isConnected: () => isConnected,
            enhanceRunners: enhanceRunners,

            /**
             * Run a prompt directly through the LLM
             * @param {string} prompt - The prompt text to send
             * @param {object} options - Options including model and callbacks
             * @returns {Promise} Resolves when complete
             */
            runPrompt: function(prompt, options = {}) {
                return new Promise((resolve, reject) => {
                    if (!ws || ws.readyState !== WebSocket.OPEN) {
                        reject(new Error('WebSocket not connected'));
                        return;
                    }

                    const runnerId = 'offcanvas-' + Date.now();
                    const model = options.model || config.defaultModel;
                    let fullResponse = '';

                    console.log('[LLM Runner] runPrompt - Registering handler for:', runnerId);

                    // Register custom message handler
                    customMessageHandlers.set(runnerId, (message) => {
                        console.log('[LLM Runner] Received message:', message.type, message);

                        if (message.type === 'stream' || message.type === 'streaming') {
                            const chunk = message.chunk || message.data || '';
                            fullResponse += chunk;
                            if (options.onChunk) {
                                options.onChunk(chunk);
                            }
                        } else if (message.type === 'complete') {
                            customMessageHandlers.delete(runnerId);
                            console.log('[LLM Runner] Stream complete, full response length:', fullResponse.length);
                            resolve(fullResponse);
                        } else if (message.type === 'error') {
                            customMessageHandlers.delete(runnerId);
                            reject(new Error(message.message || message.data || 'LLM execution failed'));
                        }
                    });

                    // Send the prompt
                    const message = {
                        type: 'llm',
                        runnerId: runnerId,
                        model: model,
                        code: prompt,
                        slideId: Reveal.getIndices().h + '-' + Reveal.getIndices().v,
                        persistContext: false
                    };

                    console.log('[LLM Runner] Sending message:', message);
                    ws.send(JSON.stringify(message));
                });
            }
        };
    };

    return Plugin;
}));
