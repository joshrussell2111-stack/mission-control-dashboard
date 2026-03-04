const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const WORKSPACE_DIR = path.join(__dirname);

// WebSocket setup
const wss = new WebSocketServer({ server, path: '/ws' });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe') {
        ws.subscribedChannels = ws.subscribedChannels || [];
        ws.subscribedChannels.push(data.channel);
      }
    } catch (err) {
      console.error('Invalid WebSocket message:', err);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket client disconnected');
  });
  
  // Send initial connection success
  ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }));
});

// Broadcast to all subscribed clients
function broadcast(channel, data) {
  clients.forEach((client) => {
    if (client.readyState === 1 && client.subscribedChannels?.includes(channel)) {
      client.send(JSON.stringify(data));
    }
  });
}

// Simulate model updates
setInterval(() => {
  const models = ['kimi', 'claude', 'openrouter'];
  const randomModel = models[Math.floor(Math.random() * models.length)];
  
  broadcast('models', {
    type: 'model.latency',
    modelId: randomModel,
    latency: Math.floor(Math.random() * 150) + 20,
  });
}, 5000);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Authentication Middleware
const requireAuth = (req, res, next) => {
  if (!process.env.PASSWORD || process.env.PASSWORD === '') {
    return next();
  }

  const providedPassword = req.cookies?.password || req.headers.password;

  if (!providedPassword || providedPassword !== process.env.PASSWORD) {
    res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Login</title><style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0A0A0F; color: #e0e0e0; }
        .login-form-container { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 12px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); text-align: center; }
        h2 { color: #00D4FF; margin-bottom: 25px; }
        input[type="password"] { width: calc(100% - 20px); padding: 12px 10px; margin-bottom: 20px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #e0e0e0; font-size: 1em; }
        button { background-color: #00D4FF; color: #0A0A0F; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: 600; transition: all 0.2s ease; }
        button:hover { background-color: #33DDFF; transform: translateY(-2px); }
      </style></head>
      <body>
      <div class="login-form-container">
      <h2>Mission Control Login</h2>
      <input type="password" id="password" placeholder="Enter password"><br>
      <button onclick="handleLogin()">Access Dashboard</button>
      </div>
      <script>
        function handleLogin() {
          const password = document.getElementById('password').value;
          document.cookie = "password=" + password + "; path=/";
          window.location.reload();
        }
        document.getElementById('password').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleLogin();
        });
      </script>
      </body>
      </html>
    `);
  } else {
    next();
  }
};

// SSE endpoint for server-sent events
app.get('/api/events', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial data
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  
  // Send heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
  }, 30000);
  
  // Send session stats every 10 seconds
  const statsInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      type: 'session.stats',
      activeSessions: Math.floor(Math.random() * 20) + 5,
      totalRequests: 1247 + Math.floor(Math.random() * 100),
      avgResponseTime: 89 + Math.floor(Math.random() * 20),
    })}\n\n`);
  }, 10000);
  
  req.on('close', () => {
    clearInterval(heartbeat);
    clearInterval(statsInterval);
  });
});

// API Routes
app.get('/api/usage', requireAuth, (req, res) => {
  exec('openrouter usage --since "2024-01-01" --until "$(date +%Y-%m-%d)"', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Failed to get usage report: ${stderr || error.message}`);
    }
    res.send(stdout);
  });
});

app.get('/api/config', requireAuth, (req, res) => {
  const configPath = path.join(WORKSPACE_DIR, '..', 'config.yaml');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading config.yaml at ${configPath}: ${err}`);
      return res.status(500).send('Error reading configuration file.');
    }
    res.send(data);
  });
});

app.post('/api/config/patch', requireAuth, (req, res) => {
  const { key, value } = req.body;
  console.warn(`Attempting to patch config: ${key}=${value}.`);
  res.send({ message: `Configuration change request for '${key}' received.` });
});

app.get('/api/gateway/status', requireAuth, (req, res) => {
  exec('openclaw gateway status', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error: ${stderr || error.message}`);
    res.send(stdout);
  });
});

app.post('/api/gateway/:action', requireAuth, (req, res) => {
  const { action } = req.params;
  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).send('Invalid gateway action.');
  }
  exec(`openclaw gateway ${action}`, { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error: ${stderr || error.message}`);
    res.send({ message: `Gateway ${action} command executed.`, output: stdout });
  });
});

app.get('/api/logs/openclaw', requireAuth, (req, res) => {
  const logFilePath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.log');
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      const fallbackLogPath = path.join(WORKSPACE_DIR, '..', 'openclaw.log');
      fs.readFile(fallbackLogPath, 'utf8', (err2, data2) => {
        if (err2) {
          return res.status(500).send('Error reading openclaw.log.');
        }
        res.send(data2);
      });
      return;
    }
    res.send(data);
  });
});

app.get('/api/cron/list', requireAuth, (req, res) => {
  exec('openclaw cron list', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(`Error listing cron jobs: ${stderr || error.message}`);
    res.send(stdout);
  });
});

app.get('/api/calendar/events', requireAuth, (req, res) => {
  res.send({ message: 'Calendar events feature requires gog skill integration.' });
});

app.get('/api/sessions/metrics', requireAuth, (req, res) => {
  res.json({
    activeSessions: Math.floor(Math.random() * 20) + 5,
    totalRequests: 1247 + Math.floor(Math.random() * 100),
    avgResponseTime: 89 + Math.floor(Math.random() * 20),
    tokensIn: 456000 + Math.floor(Math.random() * 10000),
    tokensOut: 189000 + Math.floor(Math.random() * 5000),
    costEstimate: 2.45 + Math.random() * 0.5,
  });
});

// Serve static files from dist directory (built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes (SPA)
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Mission Control Dashboard v2.0 running on http://localhost:${PORT}`);
  console.log('WebSocket server active at /ws');
  console.log('SSE endpoint active at /api/events');
});
