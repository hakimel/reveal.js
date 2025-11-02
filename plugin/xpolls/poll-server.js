/**
 * poll-server.js
 * WebSocket server for Reveal.js Poll Plugin
 * Handles real-time synchronization of poll states and results
 */

const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Data stores
const polls = new Map(); // pollId -> poll data
const users = new Map(); // userId -> user data
const connections = new Map(); // ws -> connection data

// Poll states enum
const PollState = {
  CLEARED: 'CLEARED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

/**
 * Initialize default polls (optional)
 */
function initializePolls() {
  // You can pre-configure polls here if needed
  console.log('Poll server initialized');
}

/**
 * Broadcast message to all connected clients
 */
function broadcast(data, excludeWs = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

/**
 * Broadcast to specific poll participants
 */
function broadcastToPoll(pollId, data, excludeWs = null) {
  const message = JSON.stringify(data);
  connections.forEach((conn, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      // Send to all participants (you could filter by poll here)
      ws.send(message);
    }
  });
}

/**
 * Send message to specific client
 */
function sendToClient(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

/**
 * Handle WebSocket connection
 */
wss.on('connection', (ws, req) => {
  console.log('New connection established');
  
  // Generate connection ID
  const connectionId = Math.random().toString(36).substr(2, 9);
  connections.set(ws, {
    id: connectionId,
    userId: null,
    userName: null,
    isPresenter: false,
    connectedAt: new Date()
  });

  // Send initial state
  sendToClient(ws, {
    type: 'connection-established',
    connectionId: connectionId,
    polls: Array.from(polls.entries()).map(([id, poll]) => ({
      id: id,
      state: poll.state,
      results: sanitizeResults(poll.results, ws)
    }))
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (error) {
      console.error('Error parsing message:', error);
      sendToClient(ws, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    const conn = connections.get(ws);
    if (conn) {
      console.log(`Connection closed: ${conn.id}`);
      connections.delete(ws);
      
      // Notify others if presenter disconnected
      if (conn.isPresenter) {
        broadcast({
          type: 'presenter-disconnected',
          userId: conn.userId
        }, ws);
      }
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(ws, data) {
  const connection = connections.get(ws);
  
  switch(data.type) {
    case 'join':
      handleJoin(ws, data);
      break;
      
    case 'poll-answer':
      handlePollAnswer(ws, data);
      break;
      
    case 'poll-control':
      handlePollControl(ws, data);
      break;
      
    case 'update-user':
      handleUpdateUser(ws, data);
      break;
      
    case 'get-poll-state':
      handleGetPollState(ws, data);
      break;
      
    case 'create-poll':
      handleCreatePoll(ws, data);
      break;
      
    default:
      sendToClient(ws, {
        type: 'error',
        message: `Unknown message type: ${data.type}`
      });
  }
}

/**
 * Handle user join
 */
function handleJoin(ws, data) {
  const connection = connections.get(ws);
  
  connection.userId = data.userId;
  connection.userName = data.userName || 'Anonymous';
  connection.isPresenter = data.isPresenter || false;
  
  // Store/update user data
  users.set(data.userId, {
    userId: data.userId,
    userName: connection.userName,
    isPresenter: connection.isPresenter,
    joinedAt: new Date()
  });
  
  console.log(`User joined: ${connection.userName} (${connection.userId}) - Presenter: ${connection.isPresenter}`);
  
  // Send current state of all polls
  const pollsData = {};
  polls.forEach((poll, pollId) => {
    pollsData[pollId] = {
      state: poll.state,
      results: connection.isPresenter ? poll.results : sanitizeResults(poll.results, ws)
    };
  });
  
  sendToClient(ws, {
    type: 'sync-all',
    polls: pollsData
  });
  
  // Notify others of new user
  broadcast({
    type: 'user-joined',
    userId: data.userId,
    userName: connection.userName,
    isPresenter: connection.isPresenter
  }, ws);
}

/**
 * Handle poll answer submission
 */
function handlePollAnswer(ws, data) {
  const connection = connections.get(ws);
  const { pollId, userId, userName, answer } = data;
  
  // Get or create poll
  if (!polls.has(pollId)) {
    polls.set(pollId, {
      state: PollState.OPEN,
      results: {},
      created: new Date()
    });
  }
  
  const poll = polls.get(pollId);
  
  // Check if poll is open
  if (poll.state !== PollState.OPEN) {
    sendToClient(ws, {
      type: 'error',
      message: 'Poll is not open for voting'
    });
    return;
  }
  
  // Store answer
  poll.results[userId] = {
    answer: answer,
    userName: userName || connection.userName,
    timestamp: new Date()
  };
  
  console.log(`Answer received for poll ${pollId} from ${userName}: ${answer}`);
  
  // Broadcast updated results
  broadcast({
    type: 'poll-answer',
    pollId: pollId,
    userId: userId,
    userName: userName || connection.userName,
    answer: answer
  });
}

/**
 * Handle poll control commands (presenter only)
 */
function handlePollControl(ws, data) {
  const connection = connections.get(ws);
  const { pollId, action, state } = data;
  
  // Check if user is presenter
  if (!connection.isPresenter) {
    sendToClient(ws, {
      type: 'error',
      message: 'Only presenters can control polls'
    });
    return;
  }
  
  // Get or create poll
  if (!polls.has(pollId)) {
    polls.set(pollId, {
      state: PollState.CLEARED,
      results: {},
      created: new Date()
    });
  }
  
  const poll = polls.get(pollId);
  
  // Handle action
  switch(action) {
    case 'open':
      poll.state = PollState.OPEN;
      break;
      
    case 'close':
      poll.state = PollState.CLOSED;
      break;
      
    case 'clear':
      poll.state = PollState.CLEARED;
      poll.results = {};
      break;
      
    case 'reopen':
      poll.state = PollState.OPEN;
      break;
      
    default:
      sendToClient(ws, {
        type: 'error',
        message: `Unknown control action: ${action}`
      });
      return;
  }
  
  console.log(`Poll ${pollId} state changed to ${poll.state} by presenter`);
  
  // Broadcast state change
  broadcast({
    type: 'poll-state',
    pollId: pollId,
    state: poll.state,
    action: action
  });
}

/**
 * Handle user update
 */
function handleUpdateUser(ws, data) {
  const connection = connections.get(ws);
  const { userId, userName } = data;
  
  connection.userName = userName;
  
  // Update user data
  if (users.has(userId)) {
    users.get(userId).userName = userName;
  }
  
  console.log(`User ${userId} updated name to ${userName}`);
  
  // Broadcast user update
  broadcast({
    type: 'user-updated',
    userId: userId,
    userName: userName
  }, ws);
}

/**
 * Handle get poll state request
 */
function handleGetPollState(ws, data) {
  const { pollId } = data;
  const connection = connections.get(ws);
  
  if (!polls.has(pollId)) {
    sendToClient(ws, {
      type: 'poll-state-response',
      pollId: pollId,
      state: null,
      results: null
    });
    return;
  }
  
  const poll = polls.get(pollId);
  
  sendToClient(ws, {
    type: 'poll-state-response',
    pollId: pollId,
    state: poll.state,
    results: connection.isPresenter ? poll.results : sanitizeResults(poll.results, ws)
  });
}

/**
 * Handle create poll request (presenter only)
 */
function handleCreatePoll(ws, data) {
  const connection = connections.get(ws);
  const { pollId, config } = data;
  
  if (!connection.isPresenter) {
    sendToClient(ws, {
      type: 'error',
      message: 'Only presenters can create polls'
    });
    return;
  }
  
  // Create new poll
  polls.set(pollId, {
    state: config.controlled ? PollState.CLEARED : PollState.OPEN,
    results: {},
    config: config,
    created: new Date()
  });
  
  console.log(`Poll ${pollId} created by presenter`);
  
  // Broadcast new poll
  broadcast({
    type: 'poll-created',
    pollId: pollId,
    config: config
  });
}

/**
 * Sanitize results for non-presenter users
 * Hide usernames if needed, show only counts
 */
function sanitizeResults(results, ws) {
  const connection = connections.get(ws);
  
  // If user is presenter, show all details
  if (connection && connection.isPresenter) {
    return results;
  }
  
  // For regular users, you might want to hide some details
  // This is a simplified version - customize based on your needs
  const sanitized = {};
  Object.keys(results).forEach(userId => {
    sanitized[userId] = {
      answer: results[userId].answer,
      // Hide username for anonymous polls
      userName: 'Anonymous',
      timestamp: results[userId].timestamp
    };
  });
  
  return sanitized;
}

/**
 * REST API endpoints for poll management
 */

// Get all polls
app.get('/api/polls', (req, res) => {
  const pollList = Array.from(polls.entries()).map(([id, poll]) => ({
    id: id,
    state: poll.state,
    responseCount: Object.keys(poll.results).length,
    created: poll.created
  }));
  
  res.json(pollList);
});

// Get specific poll
app.get('/api/polls/:id', (req, res) => {
  const pollId = req.params.id;
  
  if (!polls.has(pollId)) {
    return res.status(404).json({ error: 'Poll not found' });
  }
  
  const poll = polls.get(pollId);
  res.json({
    id: pollId,
    state: poll.state,
    results: poll.results,
    created: poll.created
  });
});

// Export poll results as CSV
app.get('/api/polls/:id/export', (req, res) => {
  const pollId = req.params.id;
  
  if (!polls.has(pollId)) {
    return res.status(404).json({ error: 'Poll not found' });
  }
  
  const poll = polls.get(pollId);
  
  // Generate CSV
  let csv = 'User ID,User Name,Answer,Timestamp\n';
  Object.entries(poll.results).forEach(([userId, result]) => {
    csv += `"${userId}","${result.userName}","${result.answer.join(';')}","${result.timestamp}"\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="poll-${pollId}-results.csv"`);
  res.send(csv);
});

// Clear all polls (admin endpoint - add authentication in production)
app.post('/api/polls/clear-all', (req, res) => {
  polls.clear();
  
  // Notify all clients
  broadcast({
    type: 'all-polls-cleared'
  });
  
  res.json({ message: 'All polls cleared' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    connections: connections.size,
    polls: polls.size,
    users: users.size
  });
});

// Initialize server
initializePolls();

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Poll server running on port ${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing connections...');
  
  // Notify all clients
  broadcast({
    type: 'server-shutdown'
  });
  
  // Close WebSocket server
  wss.close(() => {
    console.log('WebSocket server closed');
  });
  
  // Close HTTP server
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
