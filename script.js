/**
 * Virtus Wealth Advisors - Mission Control Dashboard
 * NASA Mission Control Aesthetic - Real-time Data Management
 */

// ============================================
// STATE MANAGEMENT
// ============================================
const DashboardState = {
    isActivityPaused: false,
    activityLog: [],
    maxActivityItems: 50,
    refreshInterval: null,
    modelStatuses: {
        kimi: { active: true, latency: 45 },
        claude: { active: false, latency: null },
        openrouter: { active: true, latency: 120 }
    },
    subagents: [
        { name: 'market-analysis', status: 'running', progress: 67 },
        { name: 'portfolio-report', status: 'completed', progress: 100 },
        { name: 'risk-assessment', status: 'queued', progress: 0 }
    ]
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    startRealtimeUpdates();
    addActivityLog('Dashboard initialized', 'info');
});

function initializeDashboard() {
    updateUTCTime();
    setInterval(updateUTCTime, 1000);
    renderSubagentList();
    initializeModelStatus();
}

// ============================================
// TIME & TELEMETRY
// ============================================
function updateUTCTime() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const timeEl = document.getElementById('utcTime');
    if (timeEl) {
        timeEl.textContent = timeString;
    }
}

// ============================================
// REAL-TIME UPDATES
// ============================================
function startRealtimeUpdates() {
    // Update metrics every 5 seconds
    DashboardState.refreshInterval = setInterval(() => {
        updateModelLatencies();
        updateResourceMetrics();
        updateSessionMetrics();
        simulateRandomActivity();
    }, 5000);
}

function updateModelLatencies() {
    // Simulate latency fluctuations
    const models = ['kimi', 'claude', 'openrouter'];
    models.forEach(model => {
        const status = DashboardState.modelStatuses[model];
        if (status.active) {
            // Random fluctuation ±20%
            const fluctuation = 0.8 + Math.random() * 0.4;
            const baseLatency = model === 'kimi' ? 45 : model === 'claude' ? 52 : 120;
            status.latency = Math.round(baseLatency * fluctuation);
            
            const el = document.getElementById(`${model}-latency`);
            if (el) {
                el.textContent = `${status.latency}ms`;
                // Color code based on latency
                if (status.latency > 150) {
                    el.style.color = 'var(--color-status-warning)';
                } else if (status.latency > 200) {
                    el.style.color = 'var(--color-status-error)';
                } else {
                    el.style.color = 'var(--color-text-primary)';
                }
            }
        }
    });
}

function updateResourceMetrics() {
    // Simulate resource fluctuations
    const resources = [
        { id: 'cpu-usage', min: 20, max: 65, suffix: '%' },
        { id: 'mem-usage', min: 2.0, max: 3.5, suffix: 'GB', decimal: 1 },
        { id: 'disk-usage', min: 40, max: 50, suffix: '%' },
        { id: 'net-usage', min: 5, max: 25, suffix: 'MB/s' }
    ];
    
    resources.forEach(res => {
        const el = document.getElementById(res.id);
        if (el) {
            const value = res.min + Math.random() * (res.max - res.min);
            const displayValue = res.decimal ? value.toFixed(res.decimal) : Math.round(value);
            el.textContent = `${displayValue}${res.suffix}`;
            
            // Update progress bar if exists
            const bar = el.closest('.resource-item')?.querySelector('.resource-fill');
            if (bar) {
                const percentage = ((value - res.min) / (res.max - res.min)) * 100;
                bar.style.width = `${Math.min(percentage, 100)}%`;
            }
        }
    });
}

function updateSessionMetrics() {
    // Simulate session metric changes
    const requestsEl = document.getElementById('total-requests');
    if (requestsEl) {
        const current = parseInt(requestsEl.textContent.replace(',', ''));
        const increment = Math.floor(Math.random() * 5);
        requestsEl.textContent = (current + increment).toLocaleString();
    }
    
    const latencyEl = document.getElementById('avg-response');
    if (latencyEl) {
        const baseLatency = 89;
        const fluctuation = Math.floor(Math.random() * 20) - 10;
        latencyEl.textContent = `${baseLatency + fluctuation}ms`;
    }
}

function simulateRandomActivity() {
    const events = [
        { message: 'Heartbeat received from gateway', type: 'info', weight: 0.4 },
        { message: 'API request completed successfully', type: 'success', weight: 0.3 },
        { message: 'Token usage updated', type: 'info', weight: 0.2 },
        { message: 'Subagent task queued', type: 'info', weight: 0.15 },
        { message: 'Cache refreshed', type: 'success', weight: 0.1 }
    ];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const event of events) {
        cumulative += event.weight;
        if (random <= cumulative) {
            addActivityLog(event.message, event.type);
            break;
        }
    }
}

// ============================================
// MODEL STATUS
// ============================================
function initializeModelStatus() {
    // Add click handlers to model items for toggling
    document.querySelectorAll('.model-item').forEach(item => {
        item.addEventListener('click', () => {
            const model = item.dataset.model;
            toggleModelStatus(model);
        });
    });
}

function toggleModelStatus(model) {
    const status = DashboardState.modelStatuses[model];
    status.active = !status.active;
    
    const item = document.querySelector(`[data-model="${model}"]`);
    if (item) {
        const statusEl = item.querySelector('.model-status');
        const latencyEl = document.getElementById(`${model}-latency`);
        
        if (status.active) {
            statusEl.textContent = 'Active';
            statusEl.className = 'model-status active';
            latencyEl.textContent = 'calculating...';
            addActivityLog(`${model.toUpperCase()} model activated`, 'success');
        } else {
            statusEl.textContent = 'Standby';
            statusEl.className = 'model-status standby';
            latencyEl.textContent = '--';
            addActivityLog(`${model.toUpperCase()} model set to standby`, 'info');
        }
    }
}

// ============================================
// SUBAGENT MANAGEMENT
// ============================================
function renderSubagentList() {
    const container = document.getElementById('subagent-list');
    if (!container) return;
    
    container.innerHTML = DashboardState.subagents.map(agent => `
        <div class="subagent-mini-item">
            <span class="subagent-mini-name">${agent.name}</span>
            <span class="subagent-mini-status ${agent.status}">${agent.status}</span>
        </div>
    `).join('');
    
    // Update counts
    const running = DashboardState.subagents.filter(a => a.status === 'running').length;
    const queued = DashboardState.subagents.filter(a => a.status === 'queued').length;
    const completed = DashboardState.subagents.filter(a => a.status === 'completed').length;
    
    document.getElementById('running-subagents').textContent = running;
    document.getElementById('queued-subagents').textContent = queued;
    document.getElementById('completed-subagents').textContent = completed;
}

// ============================================
// ACTIVITY FEED
// ============================================
function addActivityLog(message, type = 'info') {
    if (DashboardState.isActivityPaused) return;
    
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    
    const activity = {
        time: timeString,
        message,
        type,
        id: Date.now()
    };
    
    DashboardState.activityLog.unshift(activity);
    
    // Trim to max items
    if (DashboardState.activityLog.length > DashboardState.maxActivityItems) {
        DashboardState.activityLog = DashboardState.activityLog.slice(0, DashboardState.maxActivityItems);
    }
    
    renderActivityLog();
}

function renderActivityLog() {
    const container = document.getElementById('activity-feed');
    if (!container) return;
    
    container.innerHTML = DashboardState.activityLog.map(item => `
        <li class="activity-item ${item.type}">
            <span class="activity-time">${item.time}</span>
            <span class="activity-badge">${item.type.toUpperCase()}</span>
            <span class="activity-message">${item.message}</span>
        </li>
    `).join('');
}

function clearActivityFeed() {
    DashboardState.activityLog = [];
    renderActivityLog();
    addActivityLog('Activity feed cleared', 'info');
}

function pauseActivityFeed() {
    DashboardState.isActivityPaused = !DashboardState.isActivityPaused;
    const btn = document.querySelector('[onclick="pauseActivityFeed()"]');
    if (btn) {
        btn.textContent = DashboardState.isActivityPaused ? '▶' : '⏸';
        btn.title = DashboardState.isActivityPaused ? 'Resume feed' : 'Pause feed';
    }
    addActivityLog(DashboardState.isActivityPaused ? 'Activity feed paused' : 'Activity feed resumed', 'info');
}

// ============================================
// TERMINAL / OUTPUT PANEL
// ============================================
function updateTerminal(content, isError = false) {
    const terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const prefix = isError ? '<span style="color: var(--color-status-error)">[ERROR]</span>' : '<span style="color: var(--color-accent-primary)">$</span>';
    
    terminal.innerHTML += `\n<span class="terminal-timestamp" style="color: var(--color-text-tertiary)">[${timestamp}]</span> ${prefix} ${content}`;
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    const terminal = document.getElementById('terminal-output');
    if (terminal) {
        terminal.innerHTML = '<span class="terminal-prompt">$</span> Ready for commands...';
    }
}

function copyTerminal() {
    const terminal = document.getElementById('terminal-output');
    if (terminal) {
        navigator.clipboard.writeText(terminal.innerText).then(() => {
            addActivityLog('Terminal output copied to clipboard', 'success');
        });
    }
}

// ============================================
// API INTERACTIONS
// ============================================
async function fetchData(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        updateTerminal(`Fetching /api/${endpoint}...`);
        const response = await fetch(`/api/${endpoint}`, options);
        
        if (response.status === 401) {
            window.location.reload();
            throw new Error('Authentication required.');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        updateTerminal(error.message, true);
        throw error;
    }
}

// Gateway Control
async function gatewayAction(action) {
    addActivityLog(`Gateway ${action} initiated...`, 'info');
    
    try {
        if (action === 'status') {
            const result = await fetchData('gateway/status');
            updateTerminal(`Gateway status: ${result.output || result}`);
            addActivityLog('Gateway status check completed', 'success');
        } else {
            const result = await fetchData(`gateway/${action}`, 'POST');
            updateTerminal(`Gateway ${action}: ${result.output || result.message}`);
            addActivityLog(`Gateway ${action} completed`, 'success');
        }
    } catch (e) {
        addActivityLog(`Gateway ${action} failed: ${e.message}`, 'error');
    }
}

// Configuration
async function loadConfig() {
    addActivityLog('Loading configuration...', 'info');
    
    try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const configText = await response.text();
        
        document.getElementById('configContent').value = configText;
        updateTerminal('Configuration loaded successfully');
        addActivityLog('Configuration loaded', 'success');
    } catch (e) {
        updateTerminal(`Failed to load config: ${e.message}`, true);
        addActivityLog('Configuration load failed', 'error');
    }
}

async function saveConfig() {
    const configContent = document.getElementById('configContent').value;
    addActivityLog('Saving configuration...', 'info');
    
    try {
        await fetchData('config/patch', 'POST');
        updateTerminal('Configuration save request sent');
        addActivityLog('Configuration saved', 'success');
    } catch (e) {
        updateTerminal(`Failed to save config: ${e.message}`, true);
        addActivityLog('Configuration save failed', 'error');
    }
}

// Usage Report
async function getUsageReport() {
    addActivityLog('Fetching usage report...', 'info');
    
    try {
        const report = await fetchData('usage');
        updateTerminal('=== OpenRouter Usage Report ===\n' + report);
        addActivityLog('Usage report fetched', 'success');
    } catch (e) {
        updateTerminal(`Failed to fetch usage: ${e.message}`, true);
        addActivityLog('Usage report fetch failed', 'error');
    }
}

// Logs
async function fetchOpenclawLog() {
    addActivityLog('Fetching OpenClaw logs...', 'info');
    
    try {
        const log = await fetchData('logs/openclaw');
        updateTerminal('=== OpenClaw Log ===\n' + log.slice(-2000)); // Last 2000 chars
        addActivityLog('Logs fetched', 'success');
    } catch (e) {
        updateTerminal(`Failed to fetch logs: ${e.message}`, true);
        addActivityLog('Log fetch failed', 'error');
    }
}

// Cron Jobs
async function listCronJobs() {
    addActivityLog('Fetching cron jobs...', 'info');
    
    try {
        const jobs = await fetchData('cron/list');
        updateTerminal('=== Cron Jobs ===\n' + jobs);
        addActivityLog('Cron jobs listed', 'success');
    } catch (e) {
        updateTerminal(`Failed to list cron jobs: ${e.message}`, true);
        addActivityLog('Cron list failed', 'error');
    }
}

// Calendar Events
async function fetchCalendarEvents() {
    addActivityLog('Fetching calendar events...', 'info');
    
    try {
        const events = await fetchData('calendar/events');
        updateTerminal('=== Calendar Events ===\n' + JSON.stringify(events, null, 2));
        addActivityLog('Calendar events fetched', 'success');
    } catch (e) {
        updateTerminal(`Failed to fetch calendar: ${e.message}`, true);
        addActivityLog('Calendar fetch failed', 'error');
    }
}

// Safe Commands
async function runSafeCommand(command) {
    addActivityLog(`Executing: ${command}`, 'info');
    
    try {
        const result = await fetchData('run/command', 'POST', { command });
        updateTerminal(`$ ${command}\n${result.output}`);
        addActivityLog(`Command executed: ${command}`, 'success');
    } catch (e) {
        updateTerminal(`Command failed: ${e.message}`, true);
        addActivityLog(`Command failed: ${command}`, 'error');
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear terminal
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearTerminal();
    }
    
    // Ctrl/Cmd + Shift + C to copy terminal
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyTerminal();
    }
});

// ============================================
// WINDOW EVENTS
// ============================================
window.addEventListener('beforeunload', () => {
    if (DashboardState.refreshInterval) {
        clearInterval(DashboardState.refreshInterval);
    }
});

// Handle visibility change to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, could reduce update frequency
        addActivityLog('Dashboard backgrounded', 'info');
    } else {
        // Page is visible again
        addActivityLog('Dashboard active', 'info');
    }
});