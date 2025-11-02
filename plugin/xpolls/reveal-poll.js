/**
 * reveal-poll.js
 * A Reveal.js plugin for interactive polls and quizzes
 * Similar to slidev-component-poll but adapted for Reveal.js
 */

(function() {
  'use strict';

  const Plugin = {
    id: 'poll',
    
    init: function(reveal) {
      this.Reveal = reveal;
      this.config = reveal.getConfig().poll || {};
      this.polls = new Map();
      this.userId = this.generateUserId();
      this.userName = localStorage.getItem('reveal-poll-username') || '';
      this.isPresenter = false;
      this.socket = null;
      
      // Default configuration
      this.settings = {
        serverUrl: this.config.serverUrl || 'ws://localhost:3001',
        anonymous: this.config.anonymous || false,
        theme: this.config.theme || 'default',
        position: this.config.position || 'center',
        ...this.config
      };

      // Initialize components
      this.initializeStyles();
      this.initializeWebSocket();
      this.initializePolls();
      this.setupEventListeners();
      this.checkPresenterMode();
      
      // Add keyboard shortcuts
      this.Reveal.addKeyBinding({ keyCode: 80, key: 'P', description: 'Toggle poll panel' }, () => {
        this.togglePollPanel();
      });

      console.log('✅ Reveal Poll Plugin initialized');
    },

    /**
     * Generate unique user ID
     */
    generateUserId() {
      const stored = localStorage.getItem('reveal-poll-userid');
      if (stored) return stored;
      
      const id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('reveal-poll-userid', id);
      return id;
    },

    /**
     * Initialize WebSocket connection for real-time sync
     */
    initializeWebSocket() {
      if (!this.settings.serverUrl) return;

      try {
        this.socket = new WebSocket(this.settings.serverUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.sendMessage({
            type: 'join',
            userId: this.userId,
            userName: this.userName,
            isPresenter: this.isPresenter
          });
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        };

        this.socket.onerror = (error) => {
          console.warn('WebSocket error:', error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          // Attempt reconnection after 5 seconds
          setTimeout(() => this.initializeWebSocket(), 5000);
        };
      } catch (error) {
        console.warn('WebSocket initialization failed:', error);
      }
    },

    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(data) {
      switch(data.type) {
        case 'poll-state':
          this.updatePollState(data.pollId, data.state);
          break;
        case 'poll-answer':
          this.updatePollResults(data.pollId, data.userId, data.answer, data.userName);
          break;
        case 'poll-control':
          this.handlePollControl(data.pollId, data.action);
          break;
        case 'sync-all':
          this.syncAllPolls(data.polls);
          break;
      }
    },

    /**
     * Send WebSocket message
     */
    sendMessage(data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      }
    },

    /**
     * Check if running in presenter mode
     */
    checkPresenterMode() {
      // Check for speaker notes window
      this.isPresenter = window.location.search.includes('receiver') || 
                        this.Reveal.getConfig().showNotes ||
                        window.location.search.includes('presenter');
      
      if (this.isPresenter) {
        document.body.classList.add('reveal-poll-presenter');
      }
    },

    /**
     * Initialize polls from slides
     */
    initializePolls() {
      const slides = this.Reveal.getSlides();
      
      slides.forEach((slide, slideIndex) => {
        const pollElements = slide.querySelectorAll('[data-poll]');
        
        pollElements.forEach((element) => {
          const pollConfig = this.parsePollElement(element);
          pollConfig.slideIndex = slideIndex;
          pollConfig.id = pollConfig.id || `poll-${slideIndex}-${Math.random().toString(36).substr(2, 9)}`;
          
          this.polls.set(pollConfig.id, {
            ...pollConfig,
            state: 'CLEARED',
            results: {},
            element: element
          });

          this.renderPoll(pollConfig.id);
        });
      });
    },

    /**
     * Parse poll configuration from DOM element
     */
    parsePollElement(element) {
      const config = {
        question: element.dataset.pollQuestion || element.querySelector('.poll-question')?.textContent,
        answers: [],
        multiple: element.dataset.pollMultiple === 'true',
        controlled: element.dataset.pollControlled === 'true',
        clearable: element.dataset.pollClearable === 'true',
        reOpenable: element.dataset.pollReopenable === 'true',
        editable: element.dataset.pollEditable === 'true',
        correctAnswer: element.dataset.pollCorrect ? 
          element.dataset.pollCorrect.split(',').map(n => parseInt(n)) : null,
        displayResults: element.dataset.pollDisplay || 'quiz',
        showResults: element.dataset.pollShowResults || 'auto',
        id: element.dataset.pollId
      };

      // Parse answers
      const answerElements = element.querySelectorAll('.poll-answer, [data-poll-answer]');
      if (answerElements.length > 0) {
        config.answers = Array.from(answerElements).map(el => el.textContent.trim());
      } else if (element.dataset.pollAnswers) {
        config.answers = JSON.parse(element.dataset.pollAnswers);
      }

      return config;
    },

    /**
     * Render poll UI
     */
    renderPoll(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      const pollHTML = `
        <div class="reveal-poll-container ${poll.displayResults}" data-poll-id="${pollId}">
          <div class="reveal-poll-header">
            <h3 class="reveal-poll-question">${poll.question}</h3>
            ${this.renderPollControls(poll)}
          </div>
          
          <div class="reveal-poll-body">
            ${poll.state === 'CLEARED' ? this.renderWaitingState() : ''}
            ${poll.state === 'OPEN' ? this.renderAnswerForm(poll) : ''}
            ${poll.state === 'CLOSED' ? this.renderResults(poll) : ''}
            ${poll.showResults === 'free' || (poll.showResults === 'auto' && this.hasAnswered(pollId)) ? 
              this.renderLiveResults(poll) : ''}
          </div>

          ${!this.settings.anonymous && !this.userName ? this.renderNameInput(pollId) : ''}
        </div>
      `;

      poll.element.innerHTML = pollHTML;
      this.attachPollEventListeners(pollId);
    },

    /**
     * Render poll controls for presenter
     */
    renderPollControls(poll) {
      if (!poll.controlled || !this.isPresenter) return '';

      return `
        <div class="reveal-poll-controls">
          ${poll.state === 'CLEARED' ? 
            `<button class="poll-control-btn open" data-action="open">
              <span>📂</span> Open Poll
            </button>` : ''}
          ${poll.state === 'OPEN' ? 
            `<button class="poll-control-btn close" data-action="close">
              <span>🔒</span> Close Poll
            </button>` : ''}
          ${poll.state === 'CLOSED' && poll.clearable ? 
            `<button class="poll-control-btn clear" data-action="clear">
              <span>🗑️</span> Clear Results
            </button>` : ''}
          ${poll.state === 'CLOSED' && poll.reOpenable ? 
            `<button class="poll-control-btn reopen" data-action="reopen">
              <span>🔄</span> Reopen Poll
            </button>` : ''}
        </div>
      `;
    },

    /**
     * Render waiting state
     */
    renderWaitingState() {
      return `
        <div class="reveal-poll-waiting">
          <div class="poll-waiting-icon">⏳</div>
          <p>Waiting for poll to open...</p>
        </div>
      `;
    },

    /**
     * Render answer form
     */
    renderAnswerForm(poll) {
      const inputType = poll.multiple ? 'checkbox' : 'radio';
      const hasAnswered = this.hasAnswered(poll.id);
      const userAnswer = this.getUserAnswer(poll.id);

      return `
        <form class="reveal-poll-form" data-poll-id="${poll.id}">
          <div class="poll-answers">
            ${poll.answers.map((answer, index) => `
              <label class="poll-answer-option">
                <input type="${inputType}" 
                       name="poll-${poll.id}" 
                       value="${index}"
                       ${userAnswer && userAnswer.includes(index) ? 'checked' : ''}
                       ${hasAnswered && !poll.editable ? 'disabled' : ''}>
                <span class="poll-answer-text">${answer}</span>
                ${poll.showResults === 'free' ? 
                  `<span class="poll-answer-count">${this.getAnswerCount(poll, index)}</span>` : ''}
              </label>
            `).join('')}
          </div>
          
          <div class="poll-actions">
            <button type="submit" class="poll-submit-btn" 
                    ${hasAnswered && !poll.editable ? 'disabled' : ''}>
              ${hasAnswered ? (poll.editable ? 'Update Answer' : 'Already Voted') : 'Submit'}
            </button>
          </div>
        </form>
      `;
    },

    /**
     * Render poll results
     */
    renderResults(poll) {
      const totalVotes = this.getTotalVotes(poll);
      const sortedAnswers = this.getSortedAnswers(poll);

      return `
        <div class="reveal-poll-results">
          <div class="poll-stats">
            <span>Total responses: ${totalVotes}</span>
          </div>
          
          <div class="poll-results-list">
            ${sortedAnswers.map(({ index, answer, count, percentage }) => `
              <div class="poll-result-item ${this.isCorrectAnswer(poll, index) ? 'correct' : ''}">
                <div class="poll-result-header">
                  <span class="poll-result-answer">${answer}</span>
                  <span class="poll-result-count">${count} (${percentage}%)</span>
                </div>
                <div class="poll-result-bar">
                  <div class="poll-result-fill" style="width: ${percentage}%"></div>
                </div>
                ${this.shouldShowVoters(poll) ? this.renderVoters(poll, index) : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    /**
     * Render live results (shown during voting)
     */
    renderLiveResults(poll) {
      const totalVotes = this.getTotalVotes(poll);
      
      return `
        <div class="reveal-poll-live-results">
          <div class="poll-live-header">
            <span>Live Results</span>
            <span class="poll-live-count">${totalVotes} votes</span>
          </div>
          <div class="poll-live-bars">
            ${poll.answers.map((answer, index) => {
              const count = this.getAnswerCount(poll, index);
              const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              return `
                <div class="poll-live-item">
                  <div class="poll-live-bar">
                    <div class="poll-live-fill" style="width: ${percentage}%">
                      <span class="poll-live-label">${answer} (${count})</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    /**
     * Render name input for non-anonymous polls
     */
    renderNameInput(pollId) {
      return `
        <div class="reveal-poll-name-input">
          <input type="text" 
                 class="poll-name-field" 
                 placeholder="Enter your name to participate"
                 data-poll-id="${pollId}">
          <button class="poll-name-submit">Set Name</button>
        </div>
      `;
    },

    /**
     * Render voters list
     */
    renderVoters(poll, answerIndex) {
      const voters = this.getVoters(poll, answerIndex);
      if (voters.length === 0) return '';

      return `
        <div class="poll-voters">
          ${voters.map(voter => `
            <span class="poll-voter-chip">${voter}</span>
          `).join('')}
        </div>
      `;
    },

    /**
     * Attach event listeners to poll elements
     */
    attachPollEventListeners(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      // Form submission
      const form = poll.element.querySelector('.reveal-poll-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitAnswer(pollId);
        });
      }

      // Control buttons
      const controlBtns = poll.element.querySelectorAll('.poll-control-btn');
      controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          this.controlPoll(pollId, action);
        });
      });

      // Name input
      const nameSubmit = poll.element.querySelector('.poll-name-submit');
      if (nameSubmit) {
        nameSubmit.addEventListener('click', () => {
          const input = poll.element.querySelector('.poll-name-field');
          if (input && input.value.trim()) {
            this.setUserName(input.value.trim());
            this.renderPoll(pollId);
          }
        });
      }
    },

    /**
     * Submit poll answer
     */
    submitAnswer(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll || poll.state !== 'OPEN') return;

      if (!this.settings.anonymous && !this.userName) {
        alert('Please enter your name first');
        return;
      }

      const form = poll.element.querySelector('.reveal-poll-form');
      const formData = new FormData(form);
      const answers = [];

      if (poll.multiple) {
        form.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
          answers.push(parseInt(input.value));
        });
      } else {
        const selected = form.querySelector('input[type="radio"]:checked');
        if (selected) {
          answers.push(parseInt(selected.value));
        }
      }

      if (answers.length === 0) {
        alert('Please select an answer');
        return;
      }

      // Store answer locally
      this.storeUserAnswer(pollId, answers);

      // Send via WebSocket
      this.sendMessage({
        type: 'poll-answer',
        pollId: pollId,
        userId: this.userId,
        userName: this.userName || 'Anonymous',
        answer: answers
      });

      // Update local state
      this.updatePollResults(pollId, this.userId, answers, this.userName || 'Anonymous');
      this.renderPoll(pollId);
    },

    /**
     * Control poll state (open/close/clear/reopen)
     */
    controlPoll(pollId, action) {
      const poll = this.polls.get(pollId);
      if (!poll || !this.isPresenter) return;

      let newState = poll.state;

      switch(action) {
        case 'open':
          if (poll.state === 'CLEARED') {
            newState = 'OPEN';
          }
          break;
        case 'close':
          if (poll.state === 'OPEN') {
            newState = 'CLOSED';
          }
          break;
        case 'clear':
          if (poll.state === 'CLOSED' && poll.clearable) {
            newState = 'CLEARED';
            poll.results = {};
            this.clearStoredAnswers(pollId);
          }
          break;
        case 'reopen':
          if (poll.state === 'CLOSED' && poll.reOpenable) {
            newState = 'OPEN';
          }
          break;
      }

      if (newState !== poll.state) {
        poll.state = newState;
        
        // Send via WebSocket
        this.sendMessage({
          type: 'poll-control',
          pollId: pollId,
          action: action,
          state: newState
        });

        this.renderPoll(pollId);
      }
    },

    /**
     * Update poll state
     */
    updatePollState(pollId, state) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      poll.state = state;
      this.renderPoll(pollId);
    },

    /**
     * Update poll results
     */
    updatePollResults(pollId, userId, answer, userName) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      if (!poll.results[userId] || poll.editable) {
        poll.results[userId] = {
          answer: answer,
          userName: userName,
          timestamp: Date.now()
        };
      }

      this.renderPoll(pollId);
    },

    /**
     * Get total votes for a poll
     */
    getTotalVotes(poll) {
      return Object.keys(poll.results).length;
    },

    /**
     * Get count for specific answer
     */
    getAnswerCount(poll, answerIndex) {
      return Object.values(poll.results).filter(result => 
        result.answer.includes(answerIndex)
      ).length;
    },

    /**
     * Get sorted answers by vote count
     */
    getSortedAnswers(poll) {
      const totalVotes = this.getTotalVotes(poll);
      
      return poll.answers.map((answer, index) => {
        const count = this.getAnswerCount(poll, index);
        return {
          index,
          answer,
          count,
          percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
        };
      }).sort((a, b) => b.count - a.count);
    },

    /**
     * Check if answer is correct
     */
    isCorrectAnswer(poll, index) {
      if (!poll.correctAnswer) return false;
      return Array.isArray(poll.correctAnswer) ? 
        poll.correctAnswer.includes(index) : 
        poll.correctAnswer === index;
    },

    /**
     * Check if should show voters
     */
    shouldShowVoters(poll) {
      return poll.displayResults === 'publicQuiz' || 
             (poll.displayResults === 'quiz' && this.isPresenter);
    },

    /**
     * Get voters for specific answer
     */
    getVoters(poll, answerIndex) {
      return Object.values(poll.results)
        .filter(result => result.answer.includes(answerIndex))
        .map(result => result.userName);
    },

    /**
     * Check if user has answered
     */
    hasAnswered(pollId) {
      const stored = localStorage.getItem(`poll-answer-${pollId}-${this.userId}`);
      return stored !== null;
    },

    /**
     * Get user's answer
     */
    getUserAnswer(pollId) {
      const stored = localStorage.getItem(`poll-answer-${pollId}-${this.userId}`);
      return stored ? JSON.parse(stored) : null;
    },

    /**
     * Store user's answer
     */
    storeUserAnswer(pollId, answer) {
      localStorage.setItem(`poll-answer-${pollId}-${this.userId}`, JSON.stringify(answer));
    },

    /**
     * Clear stored answers for a poll
     */
    clearStoredAnswers(pollId) {
      // Clear all stored answers for this poll
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`poll-answer-${pollId}-`)) {
          localStorage.removeItem(key);
        }
      });
    },

    /**
     * Set user name
     */
    setUserName(name) {
      this.userName = name;
      localStorage.setItem('reveal-poll-username', name);
      
      // Notify server
      this.sendMessage({
        type: 'update-user',
        userId: this.userId,
        userName: name
      });
    },

    /**
     * Sync all polls from server
     */
    syncAllPolls(pollsData) {
      Object.entries(pollsData).forEach(([pollId, data]) => {
        const poll = this.polls.get(pollId);
        if (poll) {
          poll.state = data.state;
          poll.results = data.results || {};
          this.renderPoll(pollId);
        }
      });
    },

    /**
     * Toggle poll panel (for overview)
     */
    togglePollPanel() {
      const panel = document.querySelector('.reveal-poll-panel');
      if (panel) {
        panel.classList.toggle('visible');
      } else {
        this.createPollPanel();
      }
    },

    /**
     * Create poll overview panel
     */
    createPollPanel() {
      const panel = document.createElement('div');
      panel.className = 'reveal-poll-panel visible';
      
      const pollsList = Array.from(this.polls.entries()).map(([id, poll]) => {
        const totalVotes = this.getTotalVotes(poll);
        return `
          <div class="poll-panel-item">
            <div class="poll-panel-header">
              <span class="poll-panel-question">${poll.question}</span>
              <span class="poll-panel-state ${poll.state.toLowerCase()}">${poll.state}</span>
            </div>
            <div class="poll-panel-stats">
              <span>Slide ${poll.slideIndex + 1}</span>
              <span>${totalVotes} responses</span>
            </div>
          </div>
        `;
      }).join('');

      panel.innerHTML = `
        <div class="poll-panel-header">
          <h2>Polls Overview</h2>
          <button class="poll-panel-close">&times;</button>
        </div>
        <div class="poll-panel-content">
          ${pollsList}
        </div>
      `;

      document.body.appendChild(panel);

      panel.querySelector('.poll-panel-close').addEventListener('click', () => {
        panel.classList.remove('visible');
      });
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
      // Update polls when slide changes
      this.Reveal.on('slidechanged', event => {
        // Check if current slide has polls
        const currentPolls = event.currentSlide.querySelectorAll('[data-poll]');
        currentPolls.forEach(element => {
          const pollId = this.getPollIdFromElement(element);
          const poll = this.polls.get(pollId);
          
          // Auto-open non-controlled polls
          if (poll && !poll.controlled && poll.state === 'CLEARED') {
            poll.state = 'OPEN';
            this.renderPoll(pollId);
          }
        });
      });

      // Handle keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + P to toggle poll panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'p' && this.isPresenter) {
          e.preventDefault();
          this.togglePollPanel();
        }
      });
    },

    /**
     * Get poll ID from element
     */
    getPollIdFromElement(element) {
      const container = element.querySelector('.reveal-poll-container');
      return container ? container.dataset.pollId : null;
    },

    /**
     * Initialize styles
     */
    initializeStyles() {
      const style = document.createElement('style');
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    },

    /**
     * Get CSS styles
     */
    getStyles() {
      return `
        /* Poll Container */
        .reveal-poll-container {
          max-width: 800px;
          margin: 2em auto;
          padding: 1.5em;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .reveal .reveal-poll-container {
          font-size: 0.8em;
        }

        /* Poll Header */
        .reveal-poll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5em;
        }

        .reveal-poll-question {
          margin: 0;
          color: #333;
          font-size: 1.4em;
          font-weight: 600;
        }

        /* Poll Controls */
        .reveal-poll-controls {
          display: flex;
          gap: 0.5em;
        }

        .poll-control-btn {
          padding: 0.5em 1em;
          background: #fff;
          border: 2px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9em;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.3em;
        }

        .poll-control-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .poll-control-btn.open {
          border-color: #4CAF50;
          color: #4CAF50;
        }

        .poll-control-btn.close {
          border-color: #f44336;
          color: #f44336;
        }

        .poll-control-btn.clear {
          border-color: #FF9800;
          color: #FF9800;
        }

        .poll-control-btn.reopen {
          border-color: #2196F3;
          color: #2196F3;
        }

        /* Waiting State */
        .reveal-poll-waiting {
          text-align: center;
          padding: 3em 0;
          color: #666;
        }

        .poll-waiting-icon {
          font-size: 3em;
          margin-bottom: 0.5em;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Poll Form */
        .poll-answers {
          display: flex;
          flex-direction: column;
          gap: 0.8em;
          margin-bottom: 1.5em;
        }

        .poll-answer-option {
          display: flex;
          align-items: center;
          padding: 1em;
          background: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .poll-answer-option:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }

        .poll-answer-option input {
          margin-right: 0.8em;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .poll-answer-text {
          flex: 1;
          color: #333;
          font-size: 1.1em;
        }

        .poll-answer-count {
          background: #007bff;
          color: white;
          padding: 0.2em 0.6em;
          border-radius: 12px;
          font-size: 0.9em;
          margin-left: 1em;
        }

        /* Submit Button */
        .poll-submit-btn {
          padding: 0.8em 2em;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .poll-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .poll-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Poll Results */
        .reveal-poll-results {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .poll-stats {
          text-align: center;
          color: #666;
          margin-bottom: 1.5em;
          font-size: 1.1em;
        }

        .poll-result-item {
          margin-bottom: 1.2em;
          padding: 0.8em;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .poll-result-item.correct {
          background: #d4edda;
          border: 2px solid #28a745;
        }

        .poll-result-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        }

        .poll-result-answer {
          font-weight: 600;
          color: #333;
        }

        .poll-result-count {
          color: #666;
        }

        .poll-result-bar {
          height: 24px;
          background: #e9ecef;
          border-radius: 12px;
          overflow: hidden;
        }

        .poll-result-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 1s ease;
          display: flex;
          align-items: center;
          padding: 0 0.5em;
        }

        /* Live Results */
        .reveal-poll-live-results {
          margin-top: 1.5em;
          padding-top: 1.5em;
          border-top: 2px dashed #dee2e6;
        }

        .poll-live-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;
          color: #666;
        }

        .poll-live-bars {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .poll-live-bar {
          height: 20px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
        }

        .poll-live-fill {
          height: 100%;
          background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
          transition: width 0.5s ease;
          position: relative;
        }

        .poll-live-label {
          position: absolute;
          left: 0.5em;
          color: white;
          font-size: 0.85em;
          white-space: nowrap;
        }

        /* Voters */
        .poll-voters {
          margin-top: 0.5em;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3em;
        }

        .poll-voter-chip {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.2em 0.6em;
          border-radius: 12px;
          font-size: 0.85em;
        }

        /* Name Input */
        .reveal-poll-name-input {
          display: flex;
          gap: 0.5em;
          margin-top: 1.5em;
          padding-top: 1.5em;
          border-top: 2px dashed #dee2e6;
        }

        .poll-name-field {
          flex: 1;
          padding: 0.5em;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          font-size: 1em;
        }

        .poll-name-submit {
          padding: 0.5em 1.5em;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Poll Panel */
        .reveal-poll-panel {
          position: fixed;
          right: -400px;
          top: 0;
          width: 400px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          transition: right 0.3s ease;
          z-index: 1000;
          overflow-y: auto;
        }

        .reveal-poll-panel.visible {
          right: 0;
        }

        .poll-panel-header {
          padding: 1.5em;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .poll-panel-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
        }

        .poll-panel-content {
          padding: 1.5em;
        }

        .poll-panel-item {
          padding: 1em;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          margin-bottom: 1em;
        }

        .poll-panel-question {
          font-weight: 600;
          color: #333;
        }

        .poll-panel-state {
          padding: 0.2em 0.6em;
          border-radius: 4px;
          font-size: 0.85em;
          text-transform: uppercase;
        }

        .poll-panel-state.cleared {
          background: #f8f9fa;
          color: #6c757d;
        }

        .poll-panel-state.open {
          background: #d4edda;
          color: #155724;
        }

        .poll-panel-state.closed {
          background: #f8d7da;
          color: #721c24;
        }

        .poll-panel-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5em;
          color: #666;
          font-size: 0.9em;
        }

        /* Presenter Mode Styles */
        .reveal-poll-presenter .reveal-poll-controls {
          display: flex !important;
        }

        /* Quiz Display Mode */
        .reveal-poll-container.quiz .poll-result-item.correct::before {
          content: "✓";
          position: absolute;
          left: -25px;
          color: #28a745;
          font-size: 1.5em;
        }

        /* Dark Theme Support */
        .reveal.has-dark-background .reveal-poll-container {
          background: rgba(30, 30, 30, 0.95);
        }

        .reveal.has-dark-background .reveal-poll-question,
        .reveal.has-dark-background .poll-answer-text,
        .reveal.has-dark-background .poll-result-answer {
          color: #f0f0f0;
        }

        .reveal.has-dark-background .poll-answer-option {
          background: rgba(255, 255, 255, 0.1);
        }

        .reveal.has-dark-background .poll-answer-option:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .reveal-poll-container {
            padding: 1em;
            margin: 1em;
          }

          .reveal-poll-panel {
            width: 100%;
            right: -100%;
          }

          .poll-control-btn span {
            display: none;
          }
        }
      `;
    }
  };

  // Register the plugin with Reveal.js
  window.RevealPoll = Plugin;
  
})();
