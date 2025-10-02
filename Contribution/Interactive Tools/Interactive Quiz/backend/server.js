// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

// helper to get local IP
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Questions list: change or extend up to 10 questions here
const questions = [
  {
    id: 1,
    text: "Which HTML element is used to define the largest heading?",
    options: ["<heading>", "<h1>", "<h6>", "<title>"],
    correct: 1
  },
  {
    id: 2,
    text: "Which CSS property is used to change text color?",
    options: ["font-color", "color", "text-color", "fg-color"],
    correct: 1
  },
  {
    id: 3,
    text: "Which JavaScript method logs output to the browser console?",
    options: ["print()", "console.log()", "echo()", "log()"],
    correct: 1
  }
];

// players: socketId -> { name, answers: { qIndex: choiceIndex }, score }
const players = {};

// helper: compute stats for a question index (0-based)
function computeQuestionStats(qIndex) {
  const counts = [0, 0, 0, 0];
  let answered = 0;
  for (const id in players) {
    const p = players[id];
    if (p.answers && typeof p.answers[qIndex] === 'number') {
      const c = p.answers[qIndex];
      if (c >= 0 && c < 4) counts[c]++;
      answered++;
    }
  }
  return { counts, answered };
}

// ✅ helper: build sorted leaderboard array with ranks
function buildLeaderboard() {
  const arr = Object.values(players).map(p => ({
    name: p.name,
    score: p.score || 0
  }));

  // sort by score desc, then name asc
  arr.sort((a, b) => {
    if (b.score === a.score) return a.name.localeCompare(b.name);
    return b.score - a.score;
  });

  // assign ranks (ties share same rank)
  let currentRank = 0;
  let lastScore = null;
  arr.forEach((p, idx) => {
    if (p.score !== lastScore) {
      currentRank = idx + 1;
      lastScore = p.score;
    }
    p.rank = currentRank;
  });

  return arr;
}

// serve static
app.use(express.static(path.join(__dirname, '..', 'public')));

// API: return public questions (no 'correct' field)
app.get('/questions', (req, res) => {
  const publicQ = questions.map(q => ({
    id: q.id, text: q.text, options: q.options
  }));
  res.json(publicQ);
});

// Web socket logic
io.on('connection', socket => {
  console.log('socket connected', socket.id);

  // client registers as presenter or participant
  socket.on('join', (payload) => {
    if (payload && payload.role === 'participant') {
      players[socket.id] = { name: payload.name || 'Anonymous', answers: {}, score: 0 };
      console.log(`participant joined: ${players[socket.id].name}`);
      socket.emit('joined', { success: true });
      io.emit('leaderboard', buildLeaderboard());
    } else {
      socket.data.role = 'presenter';
      console.log('presenter connected');
      const statsAll = questions.map((q, idx) => computeQuestionStats(idx));
      socket.emit('initialStats', { statsAll, leaderboard: buildLeaderboard() });
    }
  });

  // handle answer submission
  socket.on('answer', ({ qIndex, choiceIndex }) => {
    if (!players[socket.id]) {
      socket.emit('errorMsg', 'Player not registered.');
      return;
    }
    if (typeof players[socket.id].answers[qIndex] !== 'undefined') {
      socket.emit('errorMsg', 'Answer already submitted for this question.');
      return;
    }

    players[socket.id].answers[qIndex] = choiceIndex;

    let isCorrect = false;
    const correctAnswer = questions[qIndex]?.correct;

    // update score if correct
    if (questions[qIndex] && choiceIndex === correctAnswer) {
      players[socket.id].score = (players[socket.id].score || 0) + 1;
      isCorrect = true;
    }

    // send detailed result only to this participant
    socket.emit('answerResult', {
      qIndex,
      choiceIndex,
      correctAnswer,
      isCorrect,
      score: players[socket.id].score
    });

    // also send personal score update
    socket.emit('yourScore', { score: players[socket.id].score });

    // broadcast updated stats + leaderboard
    const qStats = computeQuestionStats(qIndex);
    io.emit('questionStats', { qIndex, qStats });
    io.emit('leaderboard', buildLeaderboard());
  });

  // presenter can request full stats
  socket.on('requestFullStats', () => {
    const statsAll = questions.map((q, idx) => computeQuestionStats(idx));
    socket.emit('initialStats', { statsAll, leaderboard: buildLeaderboard() });
  });

  socket.on('disconnect', () => {
    if (players[socket.id]) {
      console.log('player disconnected:', players[socket.id].name);
      delete players[socket.id];
      io.emit('leaderboard', buildLeaderboard());
    } else {
      console.log('socket disconnected', socket.id);
    }
  });
});

// helper endpoint for QR
const laptopIP = getLocalIP();
app.get('/ip', (req, res) => {
  res.json({ url: `http://${laptopIP}:3000/quiz.html` });
});

server.listen(3000, '0.0.0.0', () => {
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:3000`);
  console.log(`- Network: http://${laptopIP}:3000`);
});
