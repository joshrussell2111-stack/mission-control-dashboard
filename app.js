
// app.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Added for cookie handling
const path = require('path');
const { exec } = require('child_process'); // Using Node's exec for simplicity in demonstration
const fs = require('fs');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const WORKSPACE_DIR = path.join(__dirname); // Assuming app.js is in the root of mission-control

// --- Middleware ---
// 1. Basic parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Enable cookie parsing

// --- Authentication Middleware Definition ---
const requireAuth = (req, res, next) => {
    // MODIFIED LOGIC: If PASSWORD is not set (or is empty) in .env, bypass authentication.
    if (!process.env.PASSWORD || process.env.PASSWORD === '') {
        console.log("Password protection is disabled (PASSWORD not set or empty in .env). Proceeding without authentication.");
        return next(); // Bypass authentication entirely
    }

    // If PASSWORD IS set, check if providedPassword matches.
    const providedPassword = req.cookies?.password || req.headers.password;

    if (!providedPassword || providedPassword !== process.env.PASSWORD) {
        // Send password prompt HTML
        res.status(401).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Login</title><style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-image: url('data:image/svg+xml;utf8,<svgxmlns="http://www.w3.org/2000/svg"width="100%"height="100%"viewBox="0 0 100 100"preserveAspectRatio="xMidYMid slice"><defs><radialGradientid="grad"cx="50%"cy="50%"r="50%"fx="50%"fy="50%"><stopoffset="0%"style="stop-color:rgba(50,40,30,0.5);stop-opacity:1"/><stopoffset="100%"style="stop-color:rgba(10,5,0,0.8);stop-opacity:1"/></radialGradient></defs><rectwidth="100"height="100"fill="url(%23grad)"/></svg>'); background-size: cover; background-position: center; background-color: #1a1a1a; color: #e0e0e0;}
                .login-form-container { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 12px; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2); text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                h2 { color: #f0e6d6; margin-bottom: 25px; }
                input[type="password"] { width: calc(100% - 20px); padding: 12px 10px; margin-bottom: 20px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #e0e0e0; font-family: inherit; font-size: 1em; box-sizing: border-box; }
                button { background-color: #8b4513; color: #fff; padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: background-color 0.3s ease, transform 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                button:hover { background-color: #a0522d; transform: translateY(-2px); }
                button:active { transform: translateY(0); }
            </style></head>
            <body>
            <div class="login-form-container">
            <h2>Enter Dashboard Password</h2>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Access Dashboard</button>
            </div>
            <script>
                function handleLogin(event) {
                    event.preventDefault();
                    const password = document.getElementById('password').value;
                    document.cookie = "password=" + password + "; path=/"; // Store in cookie
                    window.location.reload(); // Reload to check auth
                }
            </script>
            </body>
            </html>
        `);
    } else {
        next(); // Password is correct, proceed
    }
};

// --- Protected API Routes ---
// Apply requireAuth to all API routes.
app.get('/api/*', requireAuth, (req, res, next) => { next(); });
app.post('/api/*', requireAuth, (req, res, next) => { next(); });

// --- API Route Definitions ---
app.get('/api/usage', (req, res) => {
    exec('openrouter usage --since "2024-01-01" --until "$(date +%Y-%m-%d)"', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Failed to get usage report: ${stderr || error.message}`);
        }
        res.send(stdout);
    });
});

app.get('/api/config', (req, res) => {
    const configPath = path.join(WORKSPACE_DIR, '..', 'config.yaml');
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading config.yaml at ${configPath}: ${err}`);
            return res.status(500).send('Error reading configuration file.');
        }
        res.send(data);
    });
});

app.post('/api/config/patch', (req, res) => {
    const { key, value } = req.body;
    console.warn(`Attempting to patch config: ${key}=${value}. Full YAML edit logic is complex and not implemented here.`);
    res.send({ message: `Configuration change request for '${key}' received. Manual application or advanced backend logic may be required.` });
});

app.get('/api/gateway/status', (req, res) => {
    exec('openclaw gateway status', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) return res.status(500).send(`Error: ${stderr || error.message}`);
        res.send(stdout);
    });
});

app.post('/api/gateway/:action', (req, res) => {
    const { action } = req.params;
    if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).send('Invalid gateway action.');
    }
    exec(`openclaw gateway ${action}`, { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) return res.status(500).send(`Error: ${stderr || error.message}`);
        res.send({ message: `Gateway ${action} command executed.`, output: stdout });
    });
});

app.get('/api/logs/openclaw', (req, res) => {
    const logFilePath = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.log');
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading log file at ${logFilePath}: ${err}`);
            const fallbackLogPath = path.join(WORKSPACE_DIR, '..', 'openclaw.log');
            fs.readFile(fallbackLogPath, 'utf8', (err2, data2) => {
                if (err2) {
                    console.error(`Fallback read failed for ${fallbackLogPath}: ${err2}`);
                    return res.status(500).send('Error reading openclaw.log. Please ensure the path is correct and the file exists.');
                }
                res.send(data2);
            });
            return;
        }
        res.send(data);
    });
});

app.get('/api/cron/list', (req, res) => {
    exec('openclaw cron list', { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) return res.status(500).send(`Error listing cron jobs: ${stderr || error.message}`);
        res.send(stdout);
    });
});

app.post('/api/cron/add', (req, res) => {
    const { jobData } = req.body;
     console.warn(`Attempting to add cron job with data: ${JSON.stringify(jobData)}. Real implementation needed for parsing and execution.`);
    res.send({ message: 'Cron job add endpoint reached. Full implementation for parsing and execution is pending.' });
});

app.get('/api/calendar/events', (req, res) => {
    console.warn("Calendar events endpoint hit. Full implementation needs 'gog' skill integration and CLI commands.");
    res.send({ message: 'Calendar events feature requires integration with the gog skill and proper CLI commands. Ensure gog is configured.' });
});

app.post('/api/run/command', (req, res) => {
    const { command } = req.body;
    if (!command) {
        return res.status(400).send('Command is required.');
    }
    console.warn(`Executing arbitrary command: "${command}". Ensure this is a safe command.`);
    exec(command, { cwd: WORKSPACE_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec command error: ${error}`);
            return res.status(500).send(`Command failed: ${stderr || error.message}`);
        }
        res.send({ output: stdout });
    });
});

// --- Protected SPA Routes and Static File Serving ---
// This order is critical for proper authentication and static file serving.
// The sequence is: Basic Middleware -> Protected API Routes -> Protected SPA Routes -> Static File Serving (last).

// 1. Basic parsing middleware (done above).
// 2. Authentication Middleware definition (done above).

// 3. Protected API Routes (defined above, implicitly protected by app.get/post('/api/*', requireAuth, ...)).

// 4. Protected SPA Routes ('/' and '*' catch-all)
// These routes MUST be authenticated and serve index.html. They must come BEFORE static files are served
// for these specific paths to ensure authentication is checked.
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('*', requireAuth, (req, res) => {
    // This catch-all handles all other SPA paths not explicitly matched (e.g., /settings, /about).
    // It is also protected by requireAuth.
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Serve Static Files (UNPROTECTED)
// This MUST be the LAST middleware. It serves assets like /script.js, /styles.css, images.
// Requests matching these files will be served directly without authentication IF they weren't caught by previous routes.
// This ensures that when index.html requests these assets, they are served correctly.
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
    console.log(`Mission Control Dashboard server running on http://localhost:${PORT}`);
    console.log('Access it via your browser at http://localhost:${PORT}');
    console.log('Ensure .env file has your PASSWORD and PORT (if not 3000).');
});
