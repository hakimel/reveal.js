/**
 * Feedback MVP Plugin for Reveal.js
 * Simple localStorage-based feedback system with controls integration
 */

const FeedbackMVP = {
    id: 'feedback-mvp',

    init: function(deck) {
        this.deck = deck;
        this.presentationPath = this.getPresentationPath();

        // Add control buttons
        this.addControlButtons();

        // Initialize localStorage key
        this.storageKey = 'revealjs-feedback';

        // Define issue themes with templates
        this.issueThemes = {
            'viewport-overflow': {
                label: '1. Viewport Overflow / Content Density',
                template: 'PROBLEM: Content extending beyond viewport, footer cut off\n\nSOLUTION IDEAS:\n- Add ultra-compact class\n- Reduce font sizes (0.85em - 0.9em)\n- Tighter margins (0.2em - 0.3em)\n- Consider two-column layout\n\nDETAILS: '
            },
            'footer-positioning': {
                label: '2. Footer Positioning / CSS Box Model',
                template: 'PROBLEM: Footer appearing off-screen or not visible\n\nSOLUTION IDEAS:\n- Check overflow: visible\n- Verify min-height instead of height: 100%\n- Ensure proper padding-bottom for footer space\n- Adjust footer logo size if too small\n\nDETAILS: '
            },
            'background-transparency': {
                label: '3. Background Color / Transparency',
                template: 'PROBLEM: Black background showing through, or gradient slides appearing blank\n\nSOLUTION IDEAS:\n- Change transparent to background-color: #fff !important\n- Check gradient declarations on section dividers\n- Verify reveal/slides/sections background colors\n\nDETAILS: '
            },
            'typography-visibility': {
                label: '4. Typography Visibility / Contrast',
                template: 'PROBLEM: Text invisible or low contrast (e.g., white on white, colored on colored)\n\nSOLUTION IDEAS:\n- Add color: white !important for text on colored backgrounds\n- Check checkbox/icon colors for visibility\n- Verify timeline/module text contrast\n\nDETAILS: '
            },
            'excessive-spacing': {
                label: '5. Excessive Vertical Spacing',
                template: 'PROBLEM: Too much gap between headers and body content\n\nSOLUTION IDEAS:\n- Reduce h2 margins (0.2em - 0.3em)\n- Add negative margins to counteract SmartArt padding\n- Apply margin-top on .smartart__intro\n- Reduce default padding values\n\nDETAILS: '
            },
            'layout-inefficiency': {
                label: '6. Layout Inefficiency / Horizontal Space',
                template: 'PROBLEM: Single-column layout causing vertical scrolling, horizontal space wasted\n\nSOLUTION IDEAS:\n- Convert to two-column layout\n- Split content across columns (e.g., text + image, list split)\n- Adjust gap between columns\n\nDETAILS: '
            },
            'smartart-scaling': {
                label: '7. SmartArt Component Scaling',
                template: 'PROBLEM: SmartArt components (accordion, checklist, timeline) too large\n\nSOLUTION IDEAS:\n- Add font-size: 0.85em - 0.9em to SmartArt containers\n- Split accordion items across columns\n- Reduce padding in ultra-compact mode\n- Adjust component-specific spacing\n\nDETAILS: '
            },
            'other': {
                label: 'Other Issue',
                template: ''
            }
        };

        return this;
    },

    /**
     * Get presentation path from meta tag or URL
     */
    getPresentationPath: function() {
        const metaPath = document.querySelector('meta[name="presentation-path"]');
        if (metaPath) {
            return metaPath.getAttribute('content');
        }
        return window.location.pathname;
    },

    /**
     * Add feedback and report buttons to page
     */
    addControlButtons: function() {
        // Create feedback button (thumbs-down)
        const feedbackBtn = document.createElement('button');
        feedbackBtn.className = 'feedback-trigger-btn';
        feedbackBtn.setAttribute('aria-label', 'Report an issue');
        feedbackBtn.innerHTML = this.getThumbsDownIcon();
        feedbackBtn.onclick = () => this.openFeedbackModal();

        // Create report button
        const reportBtn = document.createElement('button');
        reportBtn.className = 'feedback-report-btn';
        reportBtn.setAttribute('aria-label', 'View feedback report');
        reportBtn.innerHTML = this.getReportIcon();
        reportBtn.onclick = () => this.openReportModal();

        // Add to body
        document.body.appendChild(feedbackBtn);
        document.body.appendChild(reportBtn);
    },

    /**
     * Get thumbs-down SVG icon
     */
    getThumbsDownIcon: function() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
        </svg>`;
    },

    /**
     * Get report SVG icon
     */
    getReportIcon: function() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>`;
    },

    /**
     * Get close SVG icon
     */
    getCloseIcon: function() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
    },

    /**
     * Get copy SVG icon
     */
    getCopyIcon: function() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
    },

    /**
     * Get trash/clear SVG icon
     */
    getTrashIcon: function() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>`;
    },

    /**
     * Open feedback form modal
     */
    openFeedbackModal: function() {
        const indices = this.deck.getIndices();

        // Only include vertical index if it exists and is greater than 0
        const hasVerticalSlides = indices.v !== undefined && indices.v > 0;
        const slideNumber = hasVerticalSlides ? `${indices.h}.${indices.v}` : `${indices.h}`;

        // Calculate human-readable slide number (1-indexed)
        const humanSlideNumber = hasVerticalSlides
            ? `${indices.h + 1}.${indices.v + 1}`
            : `${indices.h + 1}`;

        // Build issue theme options
        const themeOptions = Object.keys(this.issueThemes).map(key => {
            const theme = this.issueThemes[key];
            return `<option value="${key}">${theme.label}</option>`;
        }).join('');

        const modal = this.createModal(`
            <div class="feedback-modal-header">
                <h3>Report an Issue</h3>
                <button class="feedback-close-btn" onclick="FeedbackMVP.closeModal()">${this.getCloseIcon()}</button>
            </div>
            <div class="feedback-modal-body">
                <form id="feedbackForm">
                    <div class="feedback-form-group">
                        <label>Slide Number</label>
                        <input type="text" value="Slide ${humanSlideNumber} (URL: #/${slideNumber})" readonly class="feedback-input-readonly">
                    </div>

                    <div class="feedback-form-group">
                        <label>Issue Theme <span class="feedback-required">*</span></label>
                        <select id="feedbackTheme" class="feedback-select" required>
                            <option value="">-- Select an issue theme --</option>
                            ${themeOptions}
                        </select>
                    </div>

                    <div class="feedback-form-group">
                        <label>Message <span class="feedback-required">*</span></label>
                        <textarea id="feedbackMessage" rows="8" class="feedback-textarea" required placeholder="Select an issue theme above to pre-populate this field, or describe the issue directly..."></textarea>
                    </div>

                    <div class="feedback-status" id="feedbackStatus"></div>

                    <div class="feedback-form-actions">
                        <button type="button" class="feedback-btn feedback-btn-secondary" onclick="FeedbackMVP.closeModal()">Cancel</button>
                        <button type="submit" class="feedback-btn feedback-btn-primary">Submit Feedback</button>
                    </div>
                </form>
            </div>
        `);

        // Handle theme selection
        const themeSelect = modal.querySelector('#feedbackTheme');
        const messageField = modal.querySelector('#feedbackMessage');

        themeSelect.onchange = (e) => {
            const selectedTheme = e.target.value;
            if (selectedTheme && this.issueThemes[selectedTheme]) {
                messageField.value = this.issueThemes[selectedTheme].template;
                // Move cursor to end
                messageField.focus();
                messageField.setSelectionRange(messageField.value.length, messageField.value.length);
            }
        };

        // Handle form submission
        const form = modal.querySelector('#feedbackForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.submitFeedback(slideNumber, humanSlideNumber);
        };

        // Focus on theme select
        setTimeout(() => {
            themeSelect.focus();
        }, 100);
    },

    /**
     * Submit feedback to localStorage
     */
    submitFeedback: function(slideNumber, humanSlideNumber) {
        const themeKey = document.getElementById('feedbackTheme').value;
        const message = document.getElementById('feedbackMessage').value.trim();
        const statusEl = document.getElementById('feedbackStatus');

        // Validate
        if (!themeKey) {
            this.showStatus(statusEl, 'Please select an issue theme', 'error');
            return;
        }

        if (!message) {
            this.showStatus(statusEl, 'Please enter a message', 'error');
            return;
        }

        // Get theme label
        const themeLabel = this.issueThemes[themeKey] ? this.issueThemes[themeKey].label : 'Unknown';

        // Create feedback object
        const feedback = {
            id: Date.now(),
            presentationPath: this.presentationPath,
            slideNumber: slideNumber,
            humanSlideNumber: humanSlideNumber,
            theme: themeLabel,
            themeKey: themeKey,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        try {
            const existing = this.getAllFeedback();
            existing.push(feedback);
            localStorage.setItem(this.storageKey, JSON.stringify(existing));

            this.showStatus(statusEl, 'Feedback submitted successfully!', 'success');

            // Close modal after delay
            setTimeout(() => {
                this.closeModal();
            }, 1500);
        } catch (error) {
            console.error('Error saving feedback:', error);
            this.showStatus(statusEl, 'Error saving feedback. Please try again.', 'error');
        }
    },

    /**
     * Get all feedback from localStorage
     */
    getAllFeedback: function() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading feedback:', error);
            return [];
        }
    },

    /**
     * Get feedback for current presentation
     */
    getPresentationFeedback: function() {
        const allFeedback = this.getAllFeedback();
        return allFeedback.filter(f => f.presentationPath === this.presentationPath);
    },

    /**
     * Open report modal showing all feedback
     */
    openReportModal: function() {
        const feedback = this.getPresentationFeedback();

        if (feedback.length === 0) {
            const modal = this.createModal(`
                <div class="feedback-modal-header">
                    <h3>Feedback Report</h3>
                    <button class="feedback-close-btn" onclick="FeedbackMVP.closeModal()">${this.getCloseIcon()}</button>
                </div>
                <div class="feedback-modal-body">
                    <p class="feedback-empty">No feedback submitted yet.</p>
                </div>
            `);
            return;
        }

        // Group by slide number
        const grouped = this.groupBySlide(feedback);

        const reportHtml = `
            <div class="feedback-modal-header">
                <h3>Feedback Report (${feedback.length} items)</h3>
                <div class="feedback-header-actions">
                    <button class="feedback-action-btn feedback-copy-btn" onclick="FeedbackMVP.copyAllFeedback()" title="Copy all feedback to clipboard">
                        ${this.getCopyIcon()}
                        <span>Copy</span>
                    </button>
                    <button class="feedback-action-btn feedback-clear-btn" onclick="FeedbackMVP.clearAllFeedback()" title="Clear all feedback">
                        ${this.getTrashIcon()}
                        <span>Clear</span>
                    </button>
                    <button class="feedback-close-btn" onclick="FeedbackMVP.closeModal()">${this.getCloseIcon()}</button>
                </div>
            </div>
            <div class="feedback-modal-body">
                <div class="feedback-report">
                    ${this.renderGroupedFeedback(grouped)}
                </div>
            </div>
        `;

        this.createModal(reportHtml);
    },

    /**
     * Group feedback by slide number
     */
    groupBySlide: function(feedback) {
        const grouped = {};
        feedback.forEach(item => {
            // Use human-readable slide number if available, otherwise fall back to slideNumber
            const displaySlide = item.humanSlideNumber || item.slideNumber;
            if (!grouped[displaySlide]) {
                grouped[displaySlide] = [];
            }
            grouped[displaySlide].push(item);
        });
        return grouped;
    },

    /**
     * Render grouped feedback
     */
    renderGroupedFeedback: function(grouped) {
        const slides = Object.keys(grouped).sort((a, b) => {
            const aNum = parseFloat(a);
            const bNum = parseFloat(b);
            return aNum - bNum;
        });

        return slides.map(slideNum => {
            const items = grouped[slideNum];
            const itemsHtml = items.map(item => this.renderFeedbackItem(item)).join('');

            // Get URL reference from first item (for backwards compatibility)
            const urlRef = items[0].slideNumber ? ` (URL: #/${items[0].slideNumber})` : '';

            return `
                <div class="feedback-slide-group">
                    <h4 class="feedback-slide-title">Slide ${slideNum}${urlRef} (${items.length} ${items.length === 1 ? 'item' : 'items'})</h4>
                    <div class="feedback-items">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render single feedback item
     */
    renderFeedbackItem: function(item) {
        const date = new Date(item.timestamp).toLocaleString();

        // Support both old format (type/name/email) and new format (theme)
        const displayTheme = item.theme || (item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Unknown');
        const themeClass = item.themeKey || item.type || 'other';

        return `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <span class="feedback-item-type feedback-type-${themeClass}">${this.escapeHtml(displayTheme)}</span>
                    <span class="feedback-item-date">${date}</span>
                </div>
                <div class="feedback-item-message">${this.escapeHtml(item.message)}</div>
            </div>
        `;
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Create and show modal
     */
    createModal: function(content) {
        // Remove existing modal
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.className = 'feedback-overlay';
        overlay.id = 'feedbackOverlay';

        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = content;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        };

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modal;
    },

    /**
     * Close modal
     */
    closeModal: function() {
        const overlay = document.getElementById('feedbackOverlay');
        if (overlay) {
            overlay.remove();
        }
    },

    /**
     * Show status message
     */
    showStatus: function(element, message, type) {
        element.textContent = message;
        element.className = 'feedback-status feedback-status-' + type;
        element.style.display = 'block';
    },

    /**
     * Copy all feedback to clipboard
     */
    copyAllFeedback: function() {
        const feedback = this.getPresentationFeedback();

        if (feedback.length === 0) {
            alert('No feedback to copy.');
            return;
        }

        // Format feedback as text
        let text = `Feedback Report for: ${this.presentationPath}\n`;
        text += `Total Items: ${feedback.length}\n`;
        text += `Generated: ${new Date().toLocaleString()}\n`;
        text += `\n${'='.repeat(80)}\n\n`;

        // Group by slide
        const grouped = this.groupBySlide(feedback);
        const slides = Object.keys(grouped).sort((a, b) => {
            const aNum = parseFloat(a.replace('.', '.'));
            const bNum = parseFloat(b.replace('.', '.'));
            return aNum - bNum;
        });

        slides.forEach(slideNum => {
            const items = grouped[slideNum];

            // Get URL reference from first item
            const urlRef = items[0].slideNumber ? ` (URL: #/${items[0].slideNumber})` : '';

            text += `SLIDE ${slideNum}${urlRef} (${items.length} ${items.length === 1 ? 'item' : 'items'})\n`;
            text += `${'-'.repeat(80)}\n\n`;

            items.forEach((item, index) => {
                // Support both old format (type/name/email) and new format (theme)
                const displayTheme = item.theme || (item.type ? item.type.toUpperCase() : 'UNKNOWN');

                text += `[${index + 1}] ${displayTheme}\n`;
                text += `Date: ${new Date(item.timestamp).toLocaleString()}\n`;

                // Include old format fields if they exist
                if (item.name && item.name !== 'Anonymous') {
                    text += `Author: ${item.name}\n`;
                }
                if (item.email) {
                    text += `Email: ${item.email}\n`;
                }

                text += `Message:\n${item.message}\n\n`;
            });

            text += '\n';
        });

        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const btn = document.querySelector('.feedback-copy-btn span');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    },

    /**
     * Clear all feedback (with confirmation)
     */
    clearAllFeedback: function() {
        const feedback = this.getPresentationFeedback();

        if (feedback.length === 0) {
            alert('No feedback to clear.');
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to delete all ${feedback.length} feedback items?\n\n` +
            'This action cannot be undone.'
        );

        if (!confirmed) {
            return;
        }

        try {
            // Get all feedback
            const allFeedback = this.getAllFeedback();

            // Filter out feedback for this presentation
            const remaining = allFeedback.filter(f => f.presentationPath !== this.presentationPath);

            // Save filtered feedback
            localStorage.setItem(this.storageKey, JSON.stringify(remaining));

            // Close modal and reopen to show empty state
            this.closeModal();

            // Show success message
            alert('All feedback has been cleared.');
        } catch (error) {
            console.error('Error clearing feedback:', error);
            alert('Error clearing feedback. Please try again.');
        }
    }
};

// Make FeedbackMVP available globally for inline onclick handlers
window.FeedbackMVP = FeedbackMVP;

// Export as Reveal.js plugin
export default () => FeedbackMVP;
