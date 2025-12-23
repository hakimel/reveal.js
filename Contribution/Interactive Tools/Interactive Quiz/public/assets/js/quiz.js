// quiz.js
(function(){
  const socket = io();

  let questions = [];
  let userName = '';
  let currentIndex = 0;
  const TIME_PER_Q = 60; // seconds
  let timeLeft = TIME_PER_Q;
  let timerInterval = null;
  let answeredThisQuestion = false;

  // DOM
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startBtn');
  const nameInput = document.getElementById('nameInput');

  const questionScreen = document.getElementById('questionScreen');
  const qText = document.getElementById('questionText');
  const optionsDiv = document.getElementById('options');
  const timeSpan = document.getElementById('timeLeft');

  const endScreen = document.getElementById('endScreen');
  const finalMsg = document.getElementById('finalMsg');

  // load questions
  fetch('/questions')
    .then(r => r.json())
    .then(data => questions = data)
    .catch(err => { console.error('failed to load questions', err); alert('Failed to load questions'); });

  function startTimer() {
    timeLeft = TIME_PER_Q;
    timeSpan.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timeSpan.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitAnswer(null); // timed out
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  startBtn.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (!userName) { alert('Please enter your name'); return; }
    socket.emit('join', { role: 'participant', name: userName });
    startScreen.style.display = 'none';
    questionScreen.style.display = 'block';
    showQuestion(currentIndex);
    startTimer();
  });

  function showQuestion(idx) {
    answeredThisQuestion = false;
    const q = questions[idx];
    if (!q) {
      finishQuiz();
      return;
    }
    qText.textContent = `Q${idx+1}. ${q.text}`;
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('div');
      btn.className = 'option';
      btn.textContent = opt;
      btn.onclick = () => {
        if (answeredThisQuestion) return;
        answeredThisQuestion = true;
        submitAnswer(i);
      };
      optionsDiv.appendChild(btn);
    });
  }

  function submitAnswer(choiceIndex) {
    stopTimer();
    socket.emit('answer', { qIndex: currentIndex, choiceIndex: choiceIndex === null ? -1 : choiceIndex });
  }

  // 👇 Handle answer feedback from server
  socket.on('answerResult', ({ qIndex, choiceIndex, correctAnswer, isCorrect, score }) => {
    if (qIndex !== currentIndex) return; // ignore late events

    const optionElems = optionsDiv.querySelectorAll('.option');

    // highlight correct answer (green)
    if (optionElems[correctAnswer]) {
      optionElems[correctAnswer].classList.add('correct');
    }

    // highlight wrong choice (red)
    if (choiceIndex !== correctAnswer && choiceIndex >= 0) {
      if (optionElems[choiceIndex]) {
        optionElems[choiceIndex].classList.add('wrong');
      }
    }

    // small delay → move to next question
    setTimeout(() => {
      currentIndex++;
      if (currentIndex < questions.length) {
        showQuestion(currentIndex);
        startTimer();
      } else {
        finishQuiz(score);
      }
    }, 1500);
  });

  function finishQuiz(finalScore) {
    questionScreen.style.display = 'none';
    endScreen.style.display = 'block';
    if (typeof finalScore === 'number') {
      finalMsg.innerHTML = `<h3>Your Score: ${finalScore} / ${questions.length}</h3>`;
    } else {
      finalMsg.innerHTML = '<p>Submitting your answers... please wait.</p>';
    }
  }

  // fallback if server pushes score separately
  socket.on('yourScore', ({ score }) => {
    finalMsg.innerHTML = `<h3>Your Score: ${score} / ${questions.length}</h3>`;
  });

  socket.on('errorMsg', (m) => alert(m));
})();
