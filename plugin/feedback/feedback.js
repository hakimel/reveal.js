/**
 * Reveal.js Slide-Level Feedback Plugin
 *
 * Allows users to submit feedback, comments, and screenshots for individual slides
 * Features:
 * - Per-slide feedback collection
 * - Screenshot capture
 * - Real-time submission to backend API
 * - Feedback overlay UI
 */

const SlideFeedback = {
    id: 'feedback',

    init: function(deck) {
        this.deck = deck;
        this.config = deck.getConfig().feedback || {};

        // Configuration with defaults
        this.apiUrl = this.config.apiUrl || 'http://localhost:8002/api';
        this.enabled = this.config.enabled !== false;
        this.shortcut = this.config.shortcut || 'F';
        this.sessionId = this.config.sessionId || this.generateSessionId();

        if (!this.enabled) return;

        // Initialize UI
        this.createUI();
        this.attachEventListeners();

        console.log('[Feedback Plugin] Initialized', {
            apiUrl: this.apiUrl,
            sessionId: this.sessionId
        });
    },

    generateSessionId: function() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    createUI: function() {
        // Create feedback button
        const button = document.createElement('button');
        button.id = 'feedback-trigger';
        button.className = 'feedback-trigger';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Feedback</span>
        `;
        button.title = `Give feedback on this slide (Press ${this.shortcut})`;
        document.body.appendChild(button);

        // Create feedback modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'feedback-overlay';
        overlay.className = 'feedback-overlay';
        overlay.innerHTML = `
            <div class="feedback-modal">
                <div class="feedback-header">
                    <h3>Slide Feedback</h3>
                    <button class="feedback-close" aria-label="Close">&times;</button>
                </div>
                <div class="feedback-body">
                    <div class="feedback-slide-info">
                        <strong>Slide:</strong> <span id="feedback-slide-num"></span>
                    </div>

                    <div class="feedback-form">
                        <div class="form-group">
                            <label for="feedback-name">Name (optional)</label>
                            <input type="text" id="feedback-name" placeholder="Your name">
                        </div>

                        <div class="form-group">
                            <label for="feedback-email">Email (optional)</label>
                            <input type="email" id="feedback-email" placeholder="your@email.com">
                        </div>

                        <div class="form-group">
                            <label for="feedback-type">Feedback Type</label>
                            <select id="feedback-type">
                                <option value="comment">Comment</option>
                                <option value="question">Question</option>
                                <option value="issue">Issue/Error</option>
                                <option value="suggestion">Suggestion</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="feedback-message">Message <span class="required">*</span></label>
                            <textarea id="feedback-message" rows="5"
                                placeholder="Share your thoughts on this slide..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="feedback-screenshot">
                                Include screenshot of current slide
                            </label>
                        </div>

                        <div id="feedback-screenshot-preview" class="screenshot-preview"></div>
                    </div>
                </div>
                <div class="feedback-footer">
                    <button class="btn btn-secondary" id="feedback-cancel">Cancel</button>
                    <button class="btn btn-primary" id="feedback-submit">Submit Feedback</button>
                </div>
                <div class="feedback-status"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    attachEventListeners: function() {
        const trigger = document.getElementById('feedback-trigger');
        const overlay = document.getElementById('feedback-overlay');
        const closeBtn = overlay.querySelector('.feedback-close');
        const cancelBtn = document.getElementById('feedback-cancel');
        const submitBtn = document.getElementById('feedback-submit');
        const screenshotCheckbox = document.getElementById('feedback-screenshot');

        // Open feedback modal
        trigger.addEventListener('click', () => this.openFeedback());

        // Close modal
        const closeModal = () => this.closeFeedback();
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Submit feedback
        submitBtn.addEventListener('click', () => this.submitFeedback());

        // Screenshot toggle
        screenshotCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.captureScreenshot();
            } else {
                this.clearScreenshot();
            }
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === this.shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.openFeedback();
                }
            }

            // ESC to close
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.closeFeedback();
            }
        });
    },

    openFeedback: function() {
        const overlay = document.getElementById('feedback-overlay');
        const slideInfo = document.getElementById('feedback-slide-num');

        const indices = this.deck.getIndices();
        const slideNumber = `${indices.h + 1}${indices.v !== undefined ? `.${indices.v + 1}` : ''}`;
        slideInfo.textContent = slideNumber;

        overlay.classList.add('active');
        document.getElementById('feedback-message').focus();

        // Auto-capture screenshot if checkbox is already checked
        if (document.getElementById('feedback-screenshot').checked) {
            this.captureScreenshot();
        }
    },

    closeFeedback: function() {
        const overlay = document.getElementById('feedback-overlay');
        overlay.classList.remove('active');
        this.clearForm();
    },

    captureScreenshot: async function() {
        const preview = document.getElementById('feedback-screenshot-preview');
        preview.innerHTML = '<div class="loading">Capturing screenshot...</div>';

        try {
            const canvas = document.querySelector('.reveal');

            // Use html2canvas if available, otherwise use canvas API
            if (window.html2canvas) {
                const screenshot = await html2canvas(canvas, {
                    backgroundColor: '#ffffff',
                    scale: 2
                });

                const dataUrl = screenshot.toDataURL('image/png');
                this.currentScreenshot = dataUrl;

                preview.innerHTML = `
                    <div class="screenshot-thumbnail">
                        <img src="${dataUrl}" alt="Slide screenshot">
                        <span class="screenshot-size">${this.formatBytes(dataUrl.length)}</span>
                    </div>
                `;
            } else {
                // Fallback: inform user that screenshot library is not available
                preview.innerHTML = '<div class="error">Screenshot library not loaded</div>';
                document.getElementById('feedback-screenshot').checked = false;
            }
        } catch (error) {
            console.error('[Feedback] Screenshot capture failed:', error);
            preview.innerHTML = '<div class="error">Failed to capture screenshot</div>';
            document.getElementById('feedback-screenshot').checked = false;
        }
    },

    clearScreenshot: function() {
        const preview = document.getElementById('feedback-screenshot-preview');
        preview.innerHTML = '';
        this.currentScreenshot = null;
    },

    submitFeedback: async function() {
        const message = document.getElementById('feedback-message').value.trim();

        if (!message) {
            this.showStatus('Please enter a message', 'error');
            return;
        }

        const submitBtn = document.getElementById('feedback-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const indices = this.deck.getIndices();
            const slideNumber = `${indices.h + 1}${indices.v !== undefined ? `.${indices.v + 1}` : ''}`;

            const feedbackData = {
                sessionId: this.sessionId,
                slideIndex: { h: indices.h, v: indices.v },
                slideNumber: slideNumber,
                timestamp: new Date().toISOString(),
                name: document.getElementById('feedback-name').value.trim(),
                email: document.getElementById('feedback-email').value.trim(),
                type: document.getElementById('feedback-type').value,
                message: message,
                screenshot: this.currentScreenshot || null,
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            const response = await fetch(`${this.apiUrl}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            this.showStatus('Feedback submitted successfully! Thank you.', 'success');

            setTimeout(() => {
                this.closeFeedback();
            }, 2000);

        } catch (error) {
            console.error('[Feedback] Submission failed:', error);
            this.showStatus(`Failed to submit feedback: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
        }
    },

    showStatus: function(message, type = 'info') {
        const status = document.querySelector('.feedback-status');
        status.textContent = message;
        status.className = `feedback-status ${type}`;
        status.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    },

    clearForm: function() {
        document.getElementById('feedback-name').value = '';
        document.getElementById('feedback-email').value = '';
        document.getElementById('feedback-type').value = 'comment';
        document.getElementById('feedback-message').value = '';
        document.getElementById('feedback-screenshot').checked = false;
        this.clearScreenshot();

        const status = document.querySelector('.feedback-status');
        status.style.display = 'none';
    },

    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Register plugin
if (typeof Reveal !== 'undefined') {
    Reveal.registerPlugin('feedback', SlideFeedback);
}

export default SlideFeedback;
