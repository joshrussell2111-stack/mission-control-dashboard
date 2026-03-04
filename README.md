# Mission Control Dashboard v2.0

**OpenClaw Orchestration Dashboard** for Virtus Wealth Advisors

A real-time, React-based mission control dashboard featuring live model routing, session metrics, token usage tracking, subagent activity heatmaps, and comprehensive logging.

---

## 🚀 Quick Start

```bash
# Start the dashboard (development mode)
./launch.sh dev

# Or run directly with npm
npm run dev
```

The dashboard will be available at:
- **Client**: http://localhost:3001
- **API Server**: http://localhost:3000

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

---

## 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `./launch.sh dev` | Start development server with hot reload |
| `./launch.sh build` | Build production bundle |
| `./launch.sh start` | Start production server |
| `./launch.sh preview` | Preview production build locally |
| `./launch.sh clean` | Clean build artifacts |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express server only (with nodemon) |

---

## 🎯 Features

### Core Components

| Component | Description | Keyboard Shortcut |
|-----------|-------------|-------------------|
| **Sidebar** | Collapsible navigation with fire-red styling | `⌘B` - Toggle |
| **Command Palette** | Quick action menu with fuzzy search | `⌘K` - Open |
| **DataTable** | Sortable, filterable, paginated tables | - |
| **ActivityHeatmap** | Visual subagent activity tracking | `⌘H` - Open |
| **MetricCard** | KPI cards with sparklines | `⌘M` - Open |
| **Breadcrumbs** | Navigation trail | - |
| **LiveModeToggle** | Real-time updates toggle | - |

### Widgets

- **Model Routing** - Live model status, latency, token usage
- **Session Metrics** - Active sessions, requests, response times
- **Token Usage** - Monthly usage tracking with visual gauge
- **Activity Feed** - Real-time event stream
- **Quick Actions** - Common operations
- **Resources** - System resource monitoring

---

## 🏗 Architecture

### Tech Stack

- **Frontend**: React 19, Vite 7, Zustand (state management)
- **Backend**: Express.js, WebSocket, Server-Sent Events (SSE)
- **Styling**: CSS Variables, Glassmorphism design
- **Real-time**: WebSocket + SSE for live updates

### Directory Structure

```
mission-control/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── DataTable.jsx
│   │   ├── ActivityHeatmap.jsx
│   │   ├── MetricCard.jsx
│   │   ├── Breadcrumbs.jsx
│   │   └── LiveModeToggle.jsx
│   ├── widgets/             # Dashboard widgets
│   ├── stores/              # Zustand state stores
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── App.jsx              # Main application
│   └── main.jsx             # Entry point
├── dist/                    # Production build
├── app.js                   # Express server
├── launch.sh                # Launch script
└── package.json
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open Command Palette |
| `⌘B` | Toggle Sidebar |
| `⌘L` | Toggle Request Logs |
| `⌘H` | Toggle Activity Heatmap |
| `⌘M` | Toggle Metrics Panel |

---

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/events` | SSE stream for real-time updates |
| `GET /api/sessions/metrics` | Session statistics |
| `GET /api/usage` | OpenRouter usage data |
| `GET /api/config` | Configuration file |
| `GET /api/gateway/status` | Gateway daemon status |
| `POST /api/gateway/:action` | Gateway control (start/stop/restart) |
| `WS /ws` | WebSocket for live updates |

---

## 🎨 Theming

The dashboard uses CSS variables for theming:

```css
:root {
  --bg-primary: #0A0A0F;
  --accent-cyan: #00D4FF;
  --accent-gold: #FFD700;
  --accent-green: #00FF88;
  --accent-red: #FF4444;
}
```

---

## 📝 Environment Variables

Create a `.env` file for configuration:

```env
PORT=3000                    # Server port
PASSWORD=your_password       # Optional password protection
```

---

## 🧪 Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 🐛 Troubleshooting

### Build Issues

If you encounter build errors:

```bash
# Clean and reinstall
./launch.sh clean
npm install
npm run build
```

### Port Already in Use

If port 3000 or 3001 is already in use:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

---

## 📄 License

ISC License - Virtus Wealth Advisors

---

## 🙏 Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)

---

**Version**: 2.0.0  
**Last Updated**: 2026-03-04
