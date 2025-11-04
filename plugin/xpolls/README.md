# Reveal.js Poll Plugin

A powerful, real-time polling and quiz plugin for [Reveal.js](https://revealjs.com/) presentations. Create interactive polls, quizzes, and surveys that engage your audience with live results and presenter controls.

## Features

- 🎯 **Real-time Synchronization**: Instant updates between presenter and audience via WebSocket
- 📊 **Multiple Poll Types**: Simple polls, quizzes with correct answers, multiple choice questions
- 🎮 **Presenter Controls**: Open, close, clear, and reopen polls from speaker view
- 📈 **Live Results**: Show results as they come in or after voting closes
- 👥 **Named or Anonymous**: Support for both identified and anonymous voting
- 🎨 **Customizable Themes**: Adapts to your presentation style
- 📱 **Mobile Friendly**: Responsive design works on all devices
- 💾 **Persistent Storage**: Remembers user votes across page refreshes
- 📋 **Export Results**: REST API for exporting poll data as CSV

## Installation

### 1. Include the Plugin

#### Option A: Download Files
```bash
# Clone or download the plugin files
git clone https://github.com/yourusername/reveal-poll-plugin.git
```

#### Option B: Use CDN (when available)
```html
<script src="https://cdn.jsdelivr.net/npm/reveal-poll-plugin/reveal-poll.js"></script>
```

### 2. Set Up the WebSocket Server

```bash
# Navigate to plugin directory
cd reveal-poll-plugin

# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

The server will run on `http://localhost:3001` by default.

### 3. Configure Reveal.js

```html
<!doctype html>
<html>
<head>
    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="reveal.css">
    <link rel="stylesheet" href="theme/white.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <!-- Your slides here -->
        </div>
    </div>

    <!-- Reveal.js -->
    <script src="reveal.js"></script>
    
    <!-- Poll Plugin -->
    <script src="reveal-poll.js"></script>
    
    <script>
        Reveal.initialize({
            // Poll plugin configuration
            poll: {
                serverUrl: 'ws://localhost:3001',
                anonymous: false,
                theme: 'default'
            },
            
            plugins: [ RevealPoll ]
        });
    </script>
</body>
</html>
```

## Usage

### Basic Poll

```html
<section>
    <h2>Quick Poll</h2>
    <div data-poll 
         data-poll-question="Do you like polls?"
         data-poll-answers='["Yes", "No", "Maybe"]'>
    </div>
</section>
```

### Quiz with Correct Answer

```html
<section>
    <div data-poll 
         data-poll-question="What is 2 + 2?"
         data-poll-answers='["3", "4", "5", "6"]'
         data-poll-correct="1"
         data-poll-display="quiz">
    </div>
</section>
```

### Multiple Choice

```html
<section>
    <div data-poll 
         data-poll-question="Select all that apply"
         data-poll-answers='["Option A", "Option B", "Option C"]'
         data-poll-multiple="true">
    </div>
</section>
```

### Controlled Poll (Presenter Opens/Closes)

```html
<section>
    <div data-poll 
         data-poll-question="Rate this presentation"
         data-poll-answers='["1 ⭐", "2 ⭐⭐", "3 ⭐⭐⭐", "4 ⭐⭐⭐⭐", "5 ⭐⭐⭐⭐⭐"]'
         data-poll-controlled="true"
         data-poll-clearable="true"
         data-poll-reopenable="true">
    </div>
</section>
```

### HTML-based Definition

```html
<section>
    <div data-poll data-poll-controlled="true">
        <div class="poll-question">Your question here?</div>
        <div class="poll-answer">First option</div>
        <div class="poll-answer">Second option</div>
        <div class="poll-answer">Third option</div>
    </div>
</section>
```

## Poll Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-poll-question` | string | Required | The question to ask |
| `data-poll-answers` | JSON array | Required | Array of answer options |
| `data-poll-id` | string | Auto-generated | Unique identifier for the poll |
| `data-poll-multiple` | boolean | false | Allow multiple answer selection |
| `data-poll-controlled` | boolean | false | Require presenter to open/close poll |
| `data-poll-clearable` | boolean | false | Allow clearing results (controlled polls only) |
| `data-poll-reopenable` | boolean | false | Allow reopening after closing |
| `data-poll-editable` | boolean | false | Allow users to change their answer |
| `data-poll-correct` | number/array | null | Index(es) of correct answer(s) |
| `data-poll-display` | string | 'quiz' | Display mode: 'poll', 'quiz', 'publicQuiz' |
| `data-poll-show-results` | string | 'auto' | When to show results: 'free', 'auto', 'none' |

## Display Modes

### `poll`
- Shows results as bar charts
- No emphasis on correct/incorrect answers
- Good for opinion gathering

### `quiz`
- Highlights correct answers
- Shows participant names to presenter only
- Good for knowledge testing

### `publicQuiz`
- Like quiz but shows participant names to everyone
- Good for competitive scenarios

## Show Results Options

### `free`
- Participants can see live results before voting
- Good for transparent polling

### `auto`
- Results shown only after participant submits
- Default behavior

### `none`
- Results only visible to presenter
- Good for surprise reveals

## Configuration Options

```javascript
Reveal.initialize({
    poll: {
        // WebSocket server URL
        serverUrl: 'ws://localhost:3001',
        
        // Allow anonymous voting (no name required)
        anonymous: false,
        
        // Visual theme
        theme: 'default',
        
        // Poll position on slide
        position: 'center'
    }
});
```

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `P` | Toggle poll overview panel | Anytime |
| `Ctrl/Cmd + P` | Toggle poll overview panel | Anytime |
| `S` | Open speaker view | Presentation mode |

## Presenter Features

When in speaker view (press `S`):

1. **Poll Controls**: Open, close, clear, and reopen polls
2. **Live Monitoring**: See results update in real-time
3. **Participant Names**: View who voted for what (in quiz modes)
4. **Overview Panel**: See all polls status at a glance

## REST API

The WebSocket server also provides REST endpoints:

### Get All Polls
```bash
GET http://localhost:3001/api/polls
```

### Get Specific Poll
```bash
GET http://localhost:3001/api/polls/{pollId}
```

### Export Poll Results as CSV
```bash
GET http://localhost:3001/api/polls/{pollId}/export
```

### Health Check
```bash
GET http://localhost:3001/health
```

## Events

The plugin emits custom events you can listen to:

```javascript
// Poll answered
document.addEventListener('poll-answered', function(event) {
    console.log('Poll ID:', event.detail.pollId);
    console.log('Answer:', event.detail.answer);
});

// Poll state changed
document.addEventListener('poll-state-changed', function(event) {
    console.log('Poll ID:', event.detail.pollId);
    console.log('New State:', event.detail.state);
});

// User joined
document.addEventListener('poll-user-joined', function(event) {
    console.log('User:', event.detail.userName);
});
```

## Styling

The plugin uses CSS classes you can override:

```css
/* Main container */
.reveal-poll-container { }

/* Poll question */
.reveal-poll-question { }

/* Answer options */
.poll-answer-option { }

/* Results bar */
.poll-result-fill { }

/* Correct answer highlight */
.poll-result-item.correct { }

/* Dark theme support */
.reveal.has-dark-background .reveal-poll-container { }
```

## Server Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start poll-server.js --name reveal-poll

# Save PM2 config
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "poll-server.js"]
```

```bash
# Build and run
docker build -t reveal-poll-server .
docker run -p 3001:3001 reveal-poll-server
```

### Environment Variables

```bash
# Port configuration
PORT=3001

# CORS settings (for production)
CORS_ORIGIN=https://yourpresentation.com
```

## Security Considerations

1. **Authentication**: Add presenter authentication for production
2. **CORS**: Configure appropriate CORS settings
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **SSL/TLS**: Use WSS and HTTPS in production
5. **Input Validation**: The server validates all input, but review for your use case

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Troubleshooting

### WebSocket Connection Failed
- Check if the server is running: `npm start`
- Verify the serverUrl in configuration
- Check browser console for errors
- Ensure no firewall is blocking port 3001

### Polls Not Appearing
- Verify poll attributes are correctly formatted
- Check that JSON arrays use single quotes around the attribute
- Ensure the plugin is loaded after Reveal.js

### Results Not Syncing
- Check WebSocket connection status
- Verify all clients connect to the same server
- Clear browser cache and localStorage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use in your presentations!

## Credits

Inspired by [slidev-component-poll](https://github.com/Smile-SA/slidev-component-poll) for Slidev.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
