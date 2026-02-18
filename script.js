
// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initial checks or setup can be done here
    // For example, checking if a password cookie exists and redirecting if not,
    // but the current backend handles password prompt on API calls.
});

// Helper to display messages in status divs
function showStatus(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (!el) {
        console.warn(`Status element not found: ${elementId}`);
        return;
    }
    el.textContent = message;
    el.className = `status-message ${type}`; // 'info', 'success', 'error'
}

// Generic fetch function for API calls
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
        // API calls are relative to the current URL, which should be http://localhost:PORT
        const response = await fetch(`/api/${endpoint}`, options);
        
        if (response.status === 401) {
             // If unauthorized, refresh the page to show the login prompt
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
        throw error; // Re-throw to be handled by caller
    }
}

// --- Section Interaction Functions ---

// Configuration Section
async function loadConfig() {
    showStatus('configStatus', 'Loading configuration...');
    try {
        // Fetching the entire config content as text
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const configText = await response.text();
        
        document.getElementById('configContent').value = configText;
        showStatus('configStatus', 'Configuration loaded.', 'success');
    } catch (e) {
        showStatus('configStatus', `Error: ${e.message}`, 'error');
    }
}

async function saveConfig() {
    showStatus('configStatus', 'Saving configuration...');
    const configContent = document.getElementById('configContent').value;
    // NOTE: This is a placeholder. For robust config editing, this function
    // should parse the configContent into JSON/YAML, modify specific fields,
    // and then send ONLY those changes to the backend.
    // The current backend `/api/config/patch` expects { key, value }
    // Sending the whole raw text would require a different backend endpoint/logic.
    // For now, we'll simulate sending a generic request.
    try {
        // Awaiting a POST to a theoretically implemented patch endpoint.
        // In a real app, you'd parse configContent, extract fields, and send them.
        // Example:
        // const configObj = yaml.load(configContent); // If using a YAML parser
        // await fetchData('config/patch', 'POST', { key: 'default_model', value: configObj.default_model });
        
        // Simulating the call and message
        await fetchData('config/patch', 'POST'); // Sending without specific key/value for simulation
        showStatus('configStatus', "Configuration save request sent. Check backend logs for actual application.", 'success');
    } catch (e) {
        showStatus('configStatus', `Error saving configuration: ${e.message}`, 'error');
    }
}


// Gateway Control Section
async function gatewayAction(action) {
    showStatus('gatewayStatus', `${action}ing gateway...`);
    try {
        const result = await fetchData(`gateway/${action}`, 'POST');
        document.getElementById('gatewayOutput').textContent = result.output || `Gateway ${action} command executed.`;
        showStatus('gatewayStatus', `Gateway ${action} successful.`, 'success');
    } catch (e) {
        document.getElementById('gatewayOutput').textContent = `Error: ${e.message}`;
        showStatus('gatewayStatus', `Error ${action}ing gateway.`, 'error');
    }
}

// Monitoring Section
async function getUsageReport() {
    showStatus('monitoringStatus', 'Fetching usage report...');
    try {
        const report = await fetchData('usage');
        document.getElementById('usageReport').textContent = report;
        showStatus('monitoringStatus', 'Usage report fetched.', 'success');
    } catch (e) {
        document.getElementById('usageReport').textContent = `Error: ${e.message}`;
        showStatus('monitoringStatus', 'Failed to fetch usage report.', 'error');
    }
}

async function fetchOpenclawLog() {
    showStatus('monitoringStatus', 'Fetching OpenClaw log...');
    try {
        const log = await fetchData('logs/openclaw');
        document.getElementById('openclawLog').textContent = log;
        showStatus('monitoringStatus', 'OpenClaw log fetched.', 'success');
    } catch (e) {
        document.getElementById('openclawLog').textContent = `Error: ${e.message}`;
        showStatus('monitoringStatus', 'Failed to fetch OpenClaw log. Check path in server logs.', 'error');
    }
}

// Cron Jobs Section
async function listCronJobs() {
    showStatus('cronStatus', 'Fetching cron jobs...');
    try {
        const jobs = await fetchData('cron/list');
        document.getElementById('cronJobsOutput').textContent = jobs;
        showStatus('cronStatus', 'Cron jobs listed.', 'success');
    } catch (e) {
        document.getElementById('cronJobsOutput').textContent = `Error: ${e.message}`;
        showStatus('cronStatus', 'Failed to list cron jobs.', 'error');
    }
}

// Calendar Events Section
async function fetchCalendarEvents() {
    showStatus('calendarStatus', 'Fetching calendar events...');
    try {
        const events = await fetchData('calendar/events');
        // Assuming events are returned as JSON, stringify for display
        document.getElementById('calendarEventsOutput').textContent = JSON.stringify(events, null, 2);
        showStatus('calendarStatus', 'Calendar events fetched.', 'success');
    } catch (e) {
        document.getElementById('calendarEventsOutput').textContent = `Error: ${e.message}`;
        showStatus('calendarStatus', 'Failed to fetch calendar events. Ensure gog skill is configured.', 'error');
    }
}

// Safe Commands Section
async function runSafeCommand(command) {
    showStatus('safeCommandsStatus', `Running command: "${command}"...`);
    try {
        const result = await fetchData('run/command', 'POST', { command });
        document.getElementById('safeCommandsOutput').textContent = result.output;
        showStatus('safeCommandsStatus', `Command "${command}" executed successfully.`, 'success');
    } catch (e) {
        document.getElementById('safeCommandsOutput').textContent = `Error: ${e.message}`;
        showStatus('safeCommandsStatus', `Failed to run command "${command}".`, 'error');
    }
}
