
# OpenClaw Mission Control - User Guide

Welcome to your personalized OpenClaw Mission Control dashboard! This web interface allows you to manage OpenClaw configurations, control the gateway, monitor usage, manage cron jobs, and more, all from a secure, browser-based UI.

## ✨ Features

*   **Password Protected Access:** Secure your dashboard with a chosen password.
*   **Editable Configuration:** Directly load, view, and update your `config.yaml` (requires backend implementation for specific field edits).
*   **Gateway Control:** Easily start, stop, restart, and check the status of your OpenClaw Gateway.
*   **Monitoring:** View OpenRouter usage reports and tail the `openclaw.log` file.
*   **Cron Job Management:** List cron jobs. (Add/Edit/Delete functionality requires further backend implementation).
*   **Calendar Events:** View upcoming events from your configured calendar (requires 'gog' skill setup).
*   **Safe Command Execution:** Run predefined, frequently used CLI commands directly from the dashboard.
*   **Apple-Style Liquid Glass UI:** A beautiful, intuitive interface with earth tones.

## 🚀 Quick Start (Local Access)

This guide assumes you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### 1. Setup the Project

   a. **Navigate to your workspace directory:**
      Open your terminal and run:
      ```bash
      cd /Users/joshrussell/.openclaw/workspace
      ```

   b. **Create the Mission Control directory:**
      *(This step is handled by the agent. The files are created in `/Users/joshrussell/.openclaw/workspace/mission-control/`)*

   c. **Install Dependencies:**
      Navigate into the `mission-control` directory and run:
      ```bash
      cd mission-control
      npm install
      ```
      *Note: If `npm install` fails, ensure Node.js and npm are properly installed and accessible in your PATH.*

### 2. Secure Your Dashboard

   a. **Copy the example environment file:**
      ```bash
      cp .env.example .env
      ```

   b. **Set Your Password:**
      Open the newly created `.env` file in a text editor (e.g., `nano .env` or use a GUI editor) and replace `YOUR_SUPER_SECRET_PASSWORD_HERE` with a strong, memorable password.
      **Example `.env` content:**
      ```
      PASSWORD=MySecureDashboardPass123!
      PORT=3000
      ```
      You can also change the `PORT` if 3000 is already in use, but ensure it's a valid port number.

### 3. Start the Server Server

   a. **Run the Node.js application:**
      In the `mission-control` directory (where you ran `npm install`), run:
      ```bash
      node app.js
      ```
      You should see a message like: `Mission Control Dashboard server running on http://localhost:3000`

### 4. Access the Dashboard

   a. **Open your web browser** and navigate to:
      `http://localhost:3000`
      *(Replace 3000 with your chosen PORT if you changed it in `.env`)*

   b. **Enter your password** when prompted.

---

## 🌐 Remote Access (Optional)

To access your dashboard from other devices (phone, work laptop), you can use a tunneling service like `ngrok`.

### 1. Install ngrok (if you haven't already)

   On macOS, you can use Homebrew:
   ```bash
   brew install --cask ngrok
   ```
   Or download it from [ngrok.com](https://ngrok.com/download).

### 2. Start the Dashboard Server (as in Step 3 above)

   Ensure `node app.js` is running in *one* terminal window.

### 3. Start the ngrok Tunnel

   Open a *new* terminal window, navigate to the `mission-control` directory, and run:
   ```bash
   ngrok http 3000
   ```
   *(Use the PORT number specified in your `.env` file if it's not 3000.)*

   `ngrok` will display a public URL (e.g., `https://abcdef123456.ngrok.io`).

### 4. Access Remotely

   Use the `ngrok` public URL on your other devices. Remember to enter your dashboard password when prompted.

   **Security Warning:** When using `ngrok` or any tunnel, anyone with the public URL can access your dashboard. Keep the URL private and stop `ngrok` (`Ctrl+C` in its terminal) when you are finished using it remotely.

---

## ⚙️ Advanced Configuration & Troubleshooting

*   **Configuration Editing:** The "Save Changes" button for configuration currently sends a generic request. For actual editing of `config.yaml`, the backend logic needs to be extended to parse YAML, identify specific settings (like `default_model` or `logging.level`), update them, and re-save the file.
*   **Log File Path:** The `openclaw.log` path is assumed to be at `~/.openclaw/openclaw.log` or in the parent directory of `mission-control`. Adjust the `app.js` file if your log location differs.
*   **Arbitrary Commands:** The "Safe Commands" section is for commands you trust. Use with caution to avoid unexpected system changes.
*   **Errors:** If you encounter issues, check the console output in *both* your browser's developer tools and the terminal where `node app.js` is running for error messages.

---

This dashboard is designed to be your central command center for OpenClaw. Enjoy!
