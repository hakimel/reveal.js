/*!
 * reveal.js Feedback plugin
 * Adds slide-level feedback system with thumbs-down button and reporting
 */

const FEEDBACK_API_BASE = '/api/feedback'; // Backend API endpoint (configurable)

const ICONS = {
	thumbsDown: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>`,
	report: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
	close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
	upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
	image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
};

/**
 * Get current presentation path from URL or meta tag
 */
function getPresentationPath() {
	// Try to get from meta tag first
	const metaTag = document.querySelector('meta[name="presentation-path"]');
	if (metaTag) {
		return metaTag.getAttribute('content');
	}

	// Fallback to URL path
	return window.location.pathname;
}

/**
 * Get current slide indices
 */
function getCurrentSlideInfo(reveal) {
	const indices = reveal.getIndices();
	return {
		slideNumber: indices.h + (indices.v > 0 ? '.' + indices.v : ''),
		horizontalIndex: indices.h,
		verticalIndex: indices.v
	};
}

/**
 * Create modal overlay
 */
function createModal(title, content, className = '') {
	const overlay = document.createElement('div');
	overlay.className = `reveal-feedback-overlay ${className}`;
	overlay.innerHTML = `
		<div class="reveal-feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
			<div class="reveal-feedback-modal-header">
				<h3 id="feedback-modal-title" class="reveal-feedback-modal-title">${title}</h3>
				<button class="reveal-feedback-close" aria-label="Close modal">
					${ICONS.close}
				</button>
			</div>
			<div class="reveal-feedback-modal-content">
				${content}
			</div>
		</div>
	`;

	// Close on overlay click
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			closeModal(overlay);
		}
	});

	// Close button
	const closeBtn = overlay.querySelector('.reveal-feedback-close');
	closeBtn.addEventListener('click', () => closeModal(overlay));

	// Escape key to close
	const escapeHandler = (e) => {
		if (e.key === 'Escape') {
			closeModal(overlay);
			document.removeEventListener('keydown', escapeHandler);
		}
	};
	document.addEventListener('keydown', escapeHandler);

	return overlay;
}

/**
 * Close and remove modal
 */
function closeModal(overlay) {
	overlay.classList.add('closing');
	setTimeout(() => {
		overlay.remove();
	}, 200);
}

/**
 * Create feedback form modal
 */
function createFeedbackModal(reveal, config) {
	const slideInfo = getCurrentSlideInfo(reveal);
	const presentationPath = getPresentationPath();

	const formContent = `
		<form class="reveal-feedback-form" id="feedbackForm">
			<div class="reveal-feedback-field">
				<label class="reveal-feedback-label">Presentation</label>
				<input type="text" class="reveal-feedback-input" value="${presentationPath}" readonly />
			</div>

			<div class="reveal-feedback-field">
				<label class="reveal-feedback-label">Slide</label>
				<input type="text" class="reveal-feedback-input" value="${slideInfo.slideNumber}" readonly />
			</div>

			<div class="reveal-feedback-field">
				<label class="reveal-feedback-label" for="issue-description">
					Issue Description <span class="reveal-feedback-required">*</span>
				</label>
				<textarea
					id="issue-description"
					name="description"
					class="reveal-feedback-textarea"
					placeholder="Describe the issue you found..."
					required
					rows="4"
				></textarea>
			</div>

			<div class="reveal-feedback-field">
				<label class="reveal-feedback-label" for="suggestion">
					Suggestion (Optional)
				</label>
				<textarea
					id="suggestion"
					name="suggestion"
					class="reveal-feedback-textarea"
					placeholder="How would you improve this?"
					rows="3"
				></textarea>
			</div>

			<div class="reveal-feedback-field">
				<label class="reveal-feedback-label">
					Screenshot / Attachment (Optional)
				</label>
				<div class="reveal-feedback-upload-area" id="uploadArea">
					<input
						type="file"
						id="screenshot-upload"
						name="screenshot"
						accept="image/*,.pdf"
						class="reveal-feedback-file-input"
					/>
					<label for="screenshot-upload" class="reveal-feedback-upload-label">
						${ICONS.upload}
						<span>Click to upload or drag and drop</span>
						<span class="reveal-feedback-upload-hint">PNG, JPG, PDF (max 5MB)</span>
					</label>
					<div class="reveal-feedback-file-preview" id="filePreview" style="display: none;">
						<div class="reveal-feedback-file-info">
							${ICONS.image}
							<span class="reveal-feedback-file-name"></span>
						</div>
						<button type="button" class="reveal-feedback-file-remove" aria-label="Remove file">
							${ICONS.close}
						</button>
					</div>
				</div>
			</div>

			<div class="reveal-feedback-actions">
				<button type="button" class="reveal-feedback-btn reveal-feedback-btn-secondary" id="cancelBtn">
					Cancel
				</button>
				<button type="submit" class="reveal-feedback-btn reveal-feedback-btn-primary">
					Submit Feedback
				</button>
			</div>

			<div class="reveal-feedback-status" id="feedbackStatus"></div>
		</form>
	`;

	const modal = createModal('Report Issue', formContent, 'reveal-feedback-form-modal');

	// Handle file upload preview
	const fileInput = modal.querySelector('#screenshot-upload');
	const uploadArea = modal.querySelector('#uploadArea');
	const filePreview = modal.querySelector('#filePreview');
	const fileName = modal.querySelector('.reveal-feedback-file-name');
	const removeFileBtn = modal.querySelector('.reveal-feedback-file-remove');

	let selectedFile = null;

	fileInput.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				showStatus(modal, 'File size must be less than 5MB', 'error');
				fileInput.value = '';
				return;
			}
			selectedFile = file;
			fileName.textContent = file.name;
			uploadArea.style.display = 'none';
			filePreview.style.display = 'flex';
		}
	});

	removeFileBtn.addEventListener('click', () => {
		selectedFile = null;
		fileInput.value = '';
		uploadArea.style.display = 'block';
		filePreview.style.display = 'none';
	});

	// Drag and drop
	const uploadLabel = modal.querySelector('.reveal-feedback-upload-label');
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		uploadLabel.addEventListener(eventName, preventDefaults, false);
	});

	function preventDefaults(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	['dragenter', 'dragover'].forEach(eventName => {
		uploadLabel.addEventListener(eventName, () => {
			uploadLabel.classList.add('drag-over');
		});
	});

	['dragleave', 'drop'].forEach(eventName => {
		uploadLabel.addEventListener(eventName, () => {
			uploadLabel.classList.remove('drag-over');
		});
	});

	uploadLabel.addEventListener('drop', (e) => {
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			fileInput.files = files;
			fileInput.dispatchEvent(new Event('change'));
		}
	});

	// Cancel button
	modal.querySelector('#cancelBtn').addEventListener('click', () => {
		closeModal(modal);
	});

	// Form submission
	const form = modal.querySelector('#feedbackForm');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('presentationPath', presentationPath);
		formData.append('slideNumber', slideInfo.slideNumber);
		formData.append('horizontalIndex', slideInfo.horizontalIndex);
		formData.append('verticalIndex', slideInfo.verticalIndex);
		formData.append('description', form.elements.description.value);
		formData.append('suggestion', form.elements.suggestion.value);

		if (selectedFile) {
			formData.append('screenshot', selectedFile);
		}

		try {
			const apiEndpoint = config.apiEndpoint || FEEDBACK_API_BASE;
			const response = await fetch(apiEndpoint, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			showStatus(modal, 'Feedback submitted successfully!', 'success');

			setTimeout(() => {
				closeModal(modal);
				if (config.onSubmitSuccess) {
					config.onSubmitSuccess(result);
				}
			}, 1500);

		} catch (error) {
			console.error('Feedback submission error:', error);
			showStatus(modal, 'Failed to submit feedback. Please try again.', 'error');

			if (config.onSubmitError) {
				config.onSubmitError(error);
			}
		}
	});

	return modal;
}

/**
 * Show status message in modal
 */
function showStatus(modal, message, type = 'info') {
	const statusEl = modal.querySelector('#feedbackStatus');
	if (statusEl) {
		statusEl.textContent = message;
		statusEl.className = `reveal-feedback-status reveal-feedback-status-${type}`;
		statusEl.style.display = 'block';
	}
}

/**
 * Create feedback report modal
 */
async function createReportModal(config) {
	// Show loading state
	const loadingModal = createModal('Feedback Report', '<div class="reveal-feedback-loading">Loading feedback...</div>', 'reveal-feedback-report-modal');
	document.body.appendChild(loadingModal);

	try {
		const apiEndpoint = config.apiEndpoint || FEEDBACK_API_BASE;
		const presentationPath = getPresentationPath();
		const response = await fetch(`${apiEndpoint}?presentation=${encodeURIComponent(presentationPath)}`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const feedbackData = await response.json();

		// Close loading modal
		closeModal(loadingModal);

		// Create report content
		const reportContent = createReportContent(feedbackData);
		const reportModal = createModal('Feedback Report', reportContent, 'reveal-feedback-report-modal');

		// Add image preview handlers
		reportModal.addEventListener('click', (e) => {
			if (e.target.classList.contains('reveal-feedback-screenshot-thumb')) {
				const imageUrl = e.target.src;
				showImagePreview(imageUrl);
			}
		});

		document.body.appendChild(reportModal);

	} catch (error) {
		console.error('Failed to load feedback report:', error);
		closeModal(loadingModal);

		const errorModal = createModal(
			'Feedback Report',
			'<div class="reveal-feedback-error">Failed to load feedback. Please try again.</div>',
			'reveal-feedback-report-modal'
		);
		document.body.appendChild(errorModal);
	}
}

/**
 * Create report content HTML
 */
function createReportContent(feedbackData) {
	if (!feedbackData || feedbackData.length === 0) {
		return '<div class="reveal-feedback-empty">No feedback submitted yet.</div>';
	}

	// Group feedback by slide
	const groupedBySlide = {};
	feedbackData.forEach(item => {
		const slideKey = item.slideNumber || 'unknown';
		if (!groupedBySlide[slideKey]) {
			groupedBySlide[slideKey] = [];
		}
		groupedBySlide[slideKey].push(item);
	});

	// Sort slide keys numerically
	const sortedSlides = Object.keys(groupedBySlide).sort((a, b) => {
		const parseSlide = (s) => {
			const parts = s.split('.').map(Number);
			return parts[0] * 1000 + (parts[1] || 0);
		};
		return parseSlide(a) - parseSlide(b);
	});

	let html = '<div class="reveal-feedback-report-list">';

	sortedSlides.forEach(slideNumber => {
		const items = groupedBySlide[slideNumber];
		html += `
			<div class="reveal-feedback-slide-group">
				<h4 class="reveal-feedback-slide-header">Slide ${slideNumber}</h4>
				<div class="reveal-feedback-items">
		`;

		items.forEach((item, index) => {
			const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown date';
			html += `
				<div class="reveal-feedback-item">
					<div class="reveal-feedback-item-header">
						<span class="reveal-feedback-item-number">#${index + 1}</span>
						<span class="reveal-feedback-item-date">${timestamp}</span>
					</div>
					<div class="reveal-feedback-item-content">
						<div class="reveal-feedback-item-section">
							<strong>Issue:</strong>
							<p>${escapeHtml(item.description || 'No description')}</p>
						</div>
						${item.suggestion ? `
							<div class="reveal-feedback-item-section">
								<strong>Suggestion:</strong>
								<p>${escapeHtml(item.suggestion)}</p>
							</div>
						` : ''}
						${item.screenshotUrl ? `
							<div class="reveal-feedback-item-section">
								<strong>Screenshot:</strong>
								<img
									src="${escapeHtml(item.screenshotUrl)}"
									alt="Feedback screenshot"
									class="reveal-feedback-screenshot-thumb"
									loading="lazy"
								/>
							</div>
						` : ''}
					</div>
				</div>
			`;
		});

		html += `
				</div>
			</div>
		`;
	});

	html += '</div>';
	return html;
}

/**
 * Show full-size image preview
 */
function showImagePreview(imageUrl) {
	const overlay = document.createElement('div');
	overlay.className = 'reveal-feedback-image-overlay';
	overlay.innerHTML = `
		<button class="reveal-feedback-image-close" aria-label="Close preview">
			${ICONS.close}
		</button>
		<img src="${escapeHtml(imageUrl)}" alt="Screenshot preview" class="reveal-feedback-image-full" />
	`;

	overlay.addEventListener('click', (e) => {
		if (e.target === overlay || e.target.classList.contains('reveal-feedback-image-close')) {
			overlay.remove();
		}
	});

	document.body.appendChild(overlay);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Add feedback button to reveal.js controls
 */
function addFeedbackButton(reveal, config) {
	const controls = reveal.getRevealElement().querySelector('.controls');
	if (!controls) {
		console.warn('Reveal.js controls not found. Feedback button not added.');
		return;
	}

	// Create feedback button
	const feedbackBtn = document.createElement('button');
	feedbackBtn.className = 'reveal-feedback-control enabled';
	feedbackBtn.setAttribute('aria-label', 'Report issue with this slide');
	feedbackBtn.innerHTML = ICONS.thumbsDown;
	feedbackBtn.title = 'Report Issue';

	feedbackBtn.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		const modal = createFeedbackModal(reveal, config);
		document.body.appendChild(modal);
	});

	controls.appendChild(feedbackBtn);

	// Create report button
	const reportBtn = document.createElement('button');
	reportBtn.className = 'reveal-feedback-report-control enabled';
	reportBtn.setAttribute('aria-label', 'View feedback report');
	reportBtn.innerHTML = ICONS.report;
	reportBtn.title = 'View Feedback Report';

	reportBtn.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		createReportModal(config);
	});

	controls.appendChild(reportBtn);
}

/**
 * Initialize the feedback plugin
 */
const FeedbackPlugin = {
	id: 'feedback',

	init: function(reveal) {
		// Get plugin config
		const config = reveal.getConfig().feedback || {};

		// Add feedback button to controls when ready
		reveal.on('ready', () => {
			addFeedbackButton(reveal, config);
		});

		// Expose public API
		return {
			openFeedbackForm: () => {
				const modal = createFeedbackModal(reveal, config);
				document.body.appendChild(modal);
			},
			openReport: () => {
				createReportModal(config);
			}
		};
	}
};

export default () => FeedbackPlugin;
