# Reveal.js Poll Plugin - Deployment Guide

## Quick Start Decision Tree

```
Do you need real-time sync between multiple users?
├─ NO → Use reveal-poll-standalone.js (no server required)
└─ YES → Do you have a Node.js server?
    ├─ NO → Deploy poll-server.js first
    └─ YES → Use reveal-poll.js with WebSocket server
```

## Deployment Scenarios

### 1. Local Testing / Single User (Simplest)

Use the **standalone version** - no server required!

```html
<!-- Just include the standalone plugin -->
<script src="reveal-poll-standalone.js"></script>

<script>
Reveal.initialize({
    plugins: [ RevealPollStandalone ]
});
</script>
```

**Pros:**
- Zero setup required
- Works offline
- Saves votes locally
- Perfect for demos

**Cons:**
- No real-time sync
- Single user only

### 2. Conference / Workshop (Local Network)

Run the WebSocket server on presenter's laptop:

```bash
# On presenter's machine
npm install
npm start

# Server runs at ws://[YOUR-IP]:3001
```

```javascript
// In presentation
Reveal.initialize({
    poll: {
        serverUrl: 'ws://192.168.1.100:3001' // Presenter's IP
    },
    plugins: [ RevealPoll ]
});
```

**Tips:**
- Share your local IP with participants
- Ensure firewall allows port 3001
- Use a memorable URL shortener

### 3. Online Presentation (Cloud Deployment)

#### Option A: Heroku

```json
// package.json
{
    "scripts": {
        "start": "node poll-server.js"
    }
}
```

```javascript
// poll-server.js - modify port
const PORT = process.env.PORT || 3001;
```

```bash
# Deploy
heroku create your-poll-server
git push heroku main
```

```javascript
// In presentation
Reveal.initialize({
    poll: {
        serverUrl: 'wss://your-poll-server.herokuapp.com'
    }
});
```

#### Option B: Docker + Cloud Run

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "poll-server.js"]
```

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/poll-server
gcloud run deploy --image gcr.io/PROJECT-ID/poll-server --platform managed
```

#### Option C: AWS EC2 / DigitalOcean

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd reveal-poll-plugin
npm install

# Use PM2 for production
npm install -g pm2
pm2 start poll-server.js
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt-get install nginx
```

```nginx
# /etc/nginx/sites-available/poll
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. GitHub Pages (Static Hosting)

For presentations without backend:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup
        run: |
          mkdir public
          cp demo-standalone.html public/index.html
          cp reveal-poll-standalone.js public/
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Security Configuration

### 1. Authentication (Production)

Add authentication to poll-server.js:

```javascript
// Simple token auth
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your-secret-token';

wss.on('connection', (ws, req) => {
    const token = req.headers['authorization'];
    if (token !== `Bearer ${AUTH_TOKEN}`) {
        ws.close(1008, 'Unauthorized');
        return;
    }
    // ... rest of connection handling
});
```

Client configuration:
```javascript
// Custom WebSocket with auth
class AuthWebSocket extends WebSocket {
    constructor(url) {
        super(url, {
            headers: {
                'Authorization': 'Bearer your-secret-token'
            }
        });
    }
}
```

### 2. CORS Configuration

```javascript
// poll-server.js
const cors = require('cors');
app.use(cors({
    origin: ['https://your-presentation.com', 'https://backup-domain.com'],
    credentials: true
}));
```

### 3. Rate Limiting

```javascript
// Add rate limiting
const rateLimit = new Map();

function checkRateLimit(userId) {
    const now = Date.now();
    const userLimits = rateLimit.get(userId) || [];
    const recentActions = userLimits.filter(time => now - time < 60000);
    
    if (recentActions.length >= 10) {
        return false; // Too many actions
    }
    
    recentActions.push(now);
    rateLimit.set(userId, recentActions);
    return true;
}
```

### 4. SSL/TLS (Production Required)

```javascript
// HTTPS/WSS setup
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    cert: fs.readFileSync('/path/to/cert.pem'),
    key: fs.readFileSync('/path/to/key.pem')
}, app);

const wss = new WebSocket.Server({ server });
```

## Performance Optimization

### 1. Connection Pooling

```javascript
// Limit connections per IP
const connectionsByIP = new Map();
const MAX_CONNECTIONS_PER_IP = 5;

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    const connections = connectionsByIP.get(ip) || 0;
    
    if (connections >= MAX_CONNECTIONS_PER_IP) {
        ws.close(1008, 'Too many connections');
        return;
    }
    
    connectionsByIP.set(ip, connections + 1);
    
    ws.on('close', () => {
        connectionsByIP.set(ip, connectionsByIP.get(ip) - 1);
    });
});
```

### 2. Message Compression

```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({
    server,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        threshold: 1024
    }
});
```

### 3. Database Storage (For Large Scale)

```javascript
// Use Redis for scalability
const Redis = require('ioredis');
const redis = new Redis();

async function storePollResult(pollId, userId, answer) {
    const key = `poll:${pollId}:results`;
    await redis.hset(key, userId, JSON.stringify({
        answer,
        timestamp: Date.now()
    }));
}

async function getPollResults(pollId) {
    const key = `poll:${pollId}:results`;
    const results = await redis.hgetall(key);
    return Object.entries(results).reduce((acc, [userId, data]) => {
        acc[userId] = JSON.parse(data);
        return acc;
    }, {});
}
```

## Monitoring & Analytics

### 1. Health Checks

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
    const health = {
        uptime: process.uptime(),
        responseTime: process.hrtime(),
        message: 'OK',
        timestamp: Date.now(),
        connections: wss.clients.size,
        memory: process.memoryUsage(),
        polls: polls.size
    };
    
    res.status(200).send(health);
});
```

### 2. Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Log important events
logger.info('Poll created', { pollId, userId });
logger.error('WebSocket error', { error: error.message });
```

### 3. Analytics Dashboard

```javascript
// Analytics endpoint
app.get('/api/analytics', (req, res) => {
    const analytics = {
        totalPolls: polls.size,
        activeUsers: connections.size,
        totalVotes: Array.from(polls.values()).reduce((sum, poll) => 
            sum + Object.keys(poll.results).length, 0),
        pollsPerSlide: calculatePollsPerSlide(),
        averageResponseTime: calculateAverageResponseTime(),
        popularAnswers: getPopularAnswers()
    };
    
    res.json(analytics);
});
```

## Testing

### Unit Tests

```javascript
// test/poll.test.js
const { expect } = require('chai');

describe('Poll Plugin', () => {
    it('should create a poll', () => {
        const poll = createPoll({
            question: 'Test?',
            answers: ['Yes', 'No']
        });
        expect(poll.question).to.equal('Test?');
    });
    
    it('should validate answers', () => {
        const valid = validateAnswer([0, 1], { multiple: true });
        expect(valid).to.be.true;
    });
});
```

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create test scenario
cat > load-test.yml << EOF
config:
  target: "ws://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - engine: ws
    flow:
      - send: '{"type":"join","userId":"test"}'
      - think: 1
      - send: '{"type":"poll-answer","pollId":"test","answer":[0]}'
EOF

# Run load test
artillery run load-test.yml
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| WebSocket won't connect | Check firewall, ensure server is running, verify URL |
| Votes not syncing | Check WebSocket connection in browser console |
| High latency | Consider geographical server location, enable compression |
| Memory leaks | Implement connection cleanup, limit poll history |
| CORS errors | Configure CORS properly on server |

### Debug Mode

```javascript
// Enable debug logging
Reveal.initialize({
    poll: {
        debug: true, // Enable console logging
        serverUrl: 'ws://localhost:3001'
    }
});
```

### Browser Console Commands

```javascript
// Useful debugging commands
RevealPoll.polls; // Show all polls
RevealPoll.socket.readyState; // Check connection (1 = open)
RevealPoll.resetAllPolls(); // Clear all local data
```

## Best Practices

1. **Always use WSS in production** (not WS)
2. **Implement reconnection logic** for network issues
3. **Set appropriate timeouts** for operations
4. **Clean up old poll data** regularly
5. **Monitor WebSocket connections** for memory leaks
6. **Use CDN for static assets** when possible
7. **Implement graceful shutdown** handlers
8. **Keep presenter controls** secure
9. **Test with various network conditions**
10. **Document your deployment** process

## Support

- GitHub Issues: [your-repo/issues]
- Documentation: [your-docs-site]
- Email: support@example.com
