// results.js (presenter view - simplified)
(function(){
  const socket = io();

  // join as presenter
  socket.emit('join', { role: 'presenter' });

  // Render leaderboard only
  function renderLeaderboard(leaderboard) {
    const div = document.getElementById('leaderboard');
    let html = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    leaderboard.forEach((p, i) => {
      html += `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.score}</td></tr>`;
    });
    html += "</table>";
    div.innerHTML = html;
  }

  // Initial full stats when presenter connects
  socket.on('initialStats', ({ leaderboard }) => {
    renderLeaderboard(leaderboard);
  });

  // Update leaderboard
  socket.on('leaderboard', (leaderboard) => {
    renderLeaderboard(leaderboard);
  });

  socket.on('errorMsg', (m) => alert(m));
})();
