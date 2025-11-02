/**
 * reveal-poll-standalone.js
 * A standalone version of the Reveal.js Poll Plugin
 * Works without a server - stores results locally
 * Good for single-presenter scenarios or demos
 */

(function() {
  'use strict';

  const StandalonePlugin = {
    id: 'poll-standalone',
    
    init: function(reveal) {
      this.Reveal = reveal;
      this.config = reveal.getConfig().poll || {};
      this.polls = new Map();
      this.userId = 'presenter';
      this.userName = 'Presenter';
      
      // Default configuration
      this.settings = {
        theme: this.config.theme || 'default',
        position: this.config.position || 'center',
        ...this.config
      };

      // Initialize components
      this.initializeStyles();
      this.initializePolls();
      this.setupEventListeners();
      this.loadStoredResults();
      
      console.log('✅ Reveal Poll Standalone Plugin initialized');
    },

    /**
     * Initialize polls from slides
     */
    initializePolls() {
      const slides = this.Reveal.getSlides();
      
      slides.forEach((slide, slideIndex) => {
        const pollElements = slide.querySelectorAll('[data-poll-standalone]');
        
        pollElements.forEach((element) => {
          const pollConfig = this.parsePollElement(element);
          pollConfig.slideIndex = slideIndex;
          pollConfig.id = pollConfig.id || `poll-standalone-${slideIndex}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Load stored state
          const storedState = this.getStoredPollState(pollConfig.id);
          
          this.polls.set(pollConfig.id, {
            ...pollConfig,
            state: storedState?.state || 'OPEN',
            results: storedState?.results || {},
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
        correctAnswer: element.dataset.pollCorrect ? 
          element.dataset.pollCorrect.split(',').map(n => parseInt(n)) : null,
        displayResults: element.dataset.pollDisplay || 'live',
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

      const totalVotes = Object.keys(poll.results).length;
      const userVoted = poll.results[this.userId] !== undefined;

      const pollHTML = `
        <div class="reveal-poll-standalone ${poll.displayResults}" data-poll-id="${pollId}">
          <div class="poll-header">
            <h3 class="poll-question">${poll.question}</h3>
            <div class="poll-stats">
              <span class="vote-count">${totalVotes} ${totalVotes === 1 ? 'vote' : 'votes'}</span>
              ${userVoted ? '<span class="voted-badge">✓ Voted</span>' : ''}
            </div>
          </div>
          
          <div class="poll-body">
            <form class="poll-form" data-poll-id="${pollId}">
              ${poll.answers.map((answer, index) => {
                const count = this.getAnswerCount(poll, index);
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isCorrect = this.isCorrectAnswer(poll, index);
                const userSelected = userVoted && poll.results[this.userId].includes(index);
                
                return `
                  <div class="poll-option ${isCorrect ? 'correct' : ''} ${userSelected ? 'selected' : ''}">
                    <label class="poll-label">
                      <input type="${poll.multiple ? 'checkbox' : 'radio'}" 
                             name="poll-${pollId}" 
                             value="${index}"
                             ${userSelected ? 'checked' : ''}
                             ${userVoted ? 'disabled' : ''}>
                      <span class="poll-answer-text">${answer}</span>
                      ${poll.correctAnswer !== null && userVoted && isCorrect ? 
                        '<span class="correct-indicator">✓</span>' : ''}
                    </label>
                    
                    ${poll.displayResults === 'live' || userVoted ? `
                      <div class="poll-result">
                        <div class="result-bar">
                          <div class="result-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="result-text">${count} (${percentage}%)</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </form>
            
            <div class="poll-actions">
              ${!userVoted ? `
                <button type="button" class="poll-submit" data-poll-id="${pollId}">
                  Submit Vote
                </button>
              ` : `
                <button type="button" class="poll-reset" data-poll-id="${pollId}">
                  Reset Results
                </button>
              `}
              <button type="button" class="poll-random" data-poll-id="${pollId}">
                Add Random Vote
              </button>
            </div>
          </div>
        </div>
      `;

      poll.element.innerHTML = pollHTML;
      this.attachPollEventListeners(pollId);
    },

    /**
     * Get count for specific answer
     */
    getAnswerCount(poll, answerIndex) {
      return Object.values(poll.results).filter(result => 
        result.includes(answerIndex)
      ).length;
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
     * Attach event listeners to poll elements
     */
    attachPollEventListeners(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      // Submit button
      const submitBtn = poll.element.querySelector('.poll-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => this.submitVote(pollId));
      }

      // Reset button
      const resetBtn = poll.element.querySelector('.poll-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetPoll(pollId));
      }

      // Random vote button
      const randomBtn = poll.element.querySelector('.poll-random');
      if (randomBtn) {
        randomBtn.addEventListener('click', () => this.addRandomVote(pollId));
      }

      // Form submit prevention
      const form = poll.element.querySelector('.poll-form');
      if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());
      }
    },

    /**
     * Submit vote
     */
    submitVote(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      const form = poll.element.querySelector('.poll-form');
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
        this.showMessage('Please select an answer');
        return;
      }

      // Store vote
      poll.results[this.userId] = answers;
      this.storePollState(pollId, poll);
      
      // Re-render
      this.renderPoll(pollId);
      
      // Show feedback
      this.showFeedback(poll, answers);
    },

    /**
     * Reset poll
     */
    resetPoll(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      if (confirm('Reset all votes for this poll?')) {
        poll.results = {};
        this.storePollState(pollId, poll);
        this.renderPoll(pollId);
        this.showMessage('Poll reset');
      }
    },

    /**
     * Add random vote (for demo purposes)
     */
    addRandomVote(pollId) {
      const poll = this.polls.get(pollId);
      if (!poll) return;

      const randomUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      const answers = [];

      if (poll.multiple) {
        // Select 1-3 random answers
        const numAnswers = Math.floor(Math.random() * 3) + 1;
        const availableIndexes = [...Array(poll.answers.length).keys()];
        for (let i = 0; i < numAnswers && availableIndexes.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableIndexes.length);
          answers.push(availableIndexes.splice(randomIndex, 1)[0]);
        }
      } else {
        // Select one random answer
        answers.push(Math.floor(Math.random() * poll.answers.length));
      }

      poll.results[randomUserId] = answers;
      this.storePollState(pollId, poll);
      this.renderPoll(pollId);
      
      this.showMessage(`Random vote added: ${poll.answers[answers[0]]}`);
    },

    /**
     * Show feedback after voting
     */
    showFeedback(poll, answers) {
      if (poll.correctAnswer === null) {
        this.showMessage('Vote submitted!');
        return;
      }

      const correct = answers.every(a => this.isCorrectAnswer(poll, a));
      if (correct) {
        this.showMessage('✅ Correct!', 'success');
      } else {
        this.showMessage('❌ Incorrect. Try again next time!', 'error');
      }
    },

    /**
     * Show temporary message
     */
    showMessage(text, type = 'info') {
      const existing = document.querySelector('.poll-message');
      if (existing) existing.remove();

      const message = document.createElement('div');
      message.className = `poll-message poll-message-${type}`;
      message.textContent = text;
      document.body.appendChild(message);

      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
      }, 2000);
    },

    /**
     * Store poll state to localStorage
     */
    storePollState(pollId, poll) {
      const state = {
        state: poll.state,
        results: poll.results
      };
      localStorage.setItem(`poll-standalone-${pollId}`, JSON.stringify(state));
    },

    /**
     * Get stored poll state
     */
    getStoredPollState(pollId) {
      const stored = localStorage.getItem(`poll-standalone-${pollId}`);
      return stored ? JSON.parse(stored) : null;
    },

    /**
     * Load all stored results
     */
    loadStoredResults() {
      this.polls.forEach((poll, pollId) => {
        const stored = this.getStoredPollState(pollId);
        if (stored) {
          poll.results = stored.results || {};
          poll.state = stored.state || 'OPEN';
        }
      });
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
      // Update polls when slide changes
      this.Reveal.on('slidechanged', event => {
        // Could trigger animations or other effects here
      });

      // Add keyboard shortcut for clearing all polls
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
          e.preventDefault();
          if (confirm('Reset ALL polls?')) {
            this.resetAllPolls();
          }
        }
      });
    },

    /**
     * Reset all polls
     */
    resetAllPolls() {
      this.polls.forEach((poll, pollId) => {
        poll.results = {};
        this.storePollState(pollId, poll);
        this.renderPoll(pollId);
      });
      this.showMessage('All polls reset');
    },

    /**
     * Initialize styles
     */
    initializeStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* Standalone Poll Styles */
        .reveal-poll-standalone {
          max-width: 700px;
          margin: 1em auto;
          padding: 1.5em;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .poll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5em;
        }

        .poll-question {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3em;
          font-weight: 600;
        }

        .poll-stats {
          display: flex;
          gap: 1em;
          align-items: center;
        }

        .vote-count {
          background: white;
          padding: 0.3em 0.8em;
          border-radius: 20px;
          font-size: 0.9em;
          color: #7f8c8d;
        }

        .voted-badge {
          background: #27ae60;
          color: white;
          padding: 0.3em 0.8em;
          border-radius: 20px;
          font-size: 0.9em;
        }

        .poll-option {
          background: white;
          margin-bottom: 0.8em;
          padding: 1em;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
        }

        .poll-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .poll-option.correct {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 2px solid #28a745;
        }

        .poll-option.selected {
          background: linear-gradient(135deg, #cfe2ff 0%, #b6d0ff 100%);
        }

        .poll-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .poll-label input {
          margin-right: 0.8em;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .poll-answer-text {
          flex: 1;
          color: #2c3e50;
          font-size: 1.05em;
        }

        .correct-indicator {
          color: #28a745;
          font-weight: bold;
          margin-left: 0.5em;
        }

        .poll-result {
          margin-top: 0.8em;
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .result-bar {
          flex: 1;
          height: 20px;
          background: #ecf0f1;
          border-radius: 10px;
          overflow: hidden;
        }

        .result-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 1s ease;
        }

        .result-text {
          min-width: 60px;
          text-align: right;
          color: #7f8c8d;
          font-size: 0.9em;
        }

        .poll-actions {
          display: flex;
          gap: 1em;
          margin-top: 1.5em;
        }

        .poll-actions button {
          flex: 1;
          padding: 0.8em;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .poll-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .poll-reset {
          background: linear-gradient(135deg, #ee5a6f 0%, #f29263 100%);
          color: white;
        }

        .poll-random {
          background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
          color: white;
        }

        .poll-actions button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* Message Styles */
        .poll-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 1em 2em;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          transition: opacity 0.3s ease;
        }

        .poll-message-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .poll-message-success {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
        }

        .poll-message-error {
          background: linear-gradient(135deg, #ee5a6f 0%, #f29263 100%);
        }

        /* Dark theme support */
        .reveal.has-dark-background .reveal-poll-standalone {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .reveal.has-dark-background .poll-option {
          background: rgba(255, 255, 255, 0.1);
        }

        .reveal.has-dark-background .poll-question,
        .reveal.has-dark-background .poll-answer-text {
          color: #ecf0f1;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .reveal-poll-standalone {
            margin: 0.5em;
            padding: 1em;
          }

          .poll-actions {
            flex-direction: column;
          }

          .poll-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5em;
          }
        }

        /* Animation */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal-poll-standalone {
          animation: slideIn 0.5s ease;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Register the plugin with Reveal.js
  window.RevealPollStandalone = StandalonePlugin;
  
})();
