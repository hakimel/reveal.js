// Quiz data - correct answers for each question
const correctAnswers = [0, 2, 2, 0, 0];

// Track user answers and score
let userAnswers = Array(correctAnswers.length).fill(null);
let score = 0;

// Check answer function
function checkAnswer(questionIndex, selectedOption) {
    // Prevent answering multiple times
    if (userAnswers[questionIndex] !== null) return;
    
    // Get all buttons for this question
    const buttons = document.querySelectorAll(`.quiz-options`)[questionIndex].children;
    
    // Store user's answer
    userAnswers[questionIndex] = selectedOption;
    
    // Check if answer is correct
    const isCorrect = selectedOption === correctAnswers[questionIndex];
    
    // Update score if correct
    if (isCorrect) {
        score++;
    }
    
    // Visual feedback
    for (let i = 0; i < buttons.length; i++) {
        if (i === correctAnswers[questionIndex]) {
            // Correct answer
            buttons[i].style.backgroundColor = '#4CAF50';
        } else if (i === selectedOption && !isCorrect) {
            // Incorrect user selection
            buttons[i].style.backgroundColor = '#F44336';
        } else {
            // Other options
            buttons[i].style.backgroundColor = '#9e9e9e';
        }
        
        // Disable all buttons after selection
        buttons[i].disabled = true;
    }
    
    // Show feedback message
    const feedbackElement = document.getElementById(`feedback-${questionIndex}`);
    feedbackElement.textContent = isCorrect ? 'Correct! ✅' : 'Incorrect! ❌';
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    // Auto-advance to next slide after a delay if not the last question
    if (questionIndex < correctAnswers.length - 1) {
        setTimeout(() => {
            Reveal.next();
        }, 1500);
    } else {
        // If it's the last question, update the results and advance to results slide
        setTimeout(() => {
            updateResults();
            Reveal.next();
        }, 1500);
    }
}

// Update results on the results slide
function updateResults() {
    document.getElementById('score').textContent = score;
    
    const scoreMessage = document.getElementById('score-message');
    if (score === 5) {
        scoreMessage.textContent = 'Perfect! You got all answers correct! 🎉';
    } else if (score >= 3) {
        scoreMessage.textContent = 'Good job! You passed the quiz! 👍';
    } else {
        scoreMessage.textContent = 'Keep learning and try again! 💪';
    }
}

// Restart quiz function
function restartQuiz() {
    // Reset score and answers
    score = 0;
    userAnswers = Array(correctAnswers.length).fill(null);
    
    // Reset all buttons and feedback
    const buttons = document.querySelectorAll('.quiz-btn');
    buttons.forEach(button => {
        button.style.backgroundColor = '#2b8cbe';
        button.disabled = false;
    });
    
    const feedbacks = document.querySelectorAll('.feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '';
        feedback.className = 'feedback';
    });
    
    // Go back to first question
    Reveal.slide(1);
}