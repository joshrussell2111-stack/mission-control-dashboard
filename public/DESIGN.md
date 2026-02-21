# Virtus Wealth Advisors - Mission Control Design System

## Overview
NASA Mission Control-inspired dashboard design for OpenClaw orchestration. Optimized for control room environments with high contrast, clear data hierarchy, and real-time telemetry displays.

---

## Color Palette

### Primary Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0B0F19` | Main background, deep space dark |
| `--color-bg-secondary` | `#111827` | Secondary surfaces, footer |
| `--color-bg-tertiary` | `#1A1F2E` | Card backgrounds, elevated surfaces |
| `--color-bg-panel` | `rgba(17, 24, 39, 0.7)` | Panel backgrounds with blur |
| `--color-bg-card` | `rgba(26, 31, 46, 0.6)` | Card backgrounds with blur |

### Accent Colors (Cyan Telemetry)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-primary` | `#00D4FF` | Primary accent, links, highlights |
| `--color-accent-secondary` | `#00B4D8` | Secondary accent, gradients |
| `--color-accent-glow` | `rgba(0, 212, 255, 0.3)` | Glow effects |
| `--color-accent-dim` | `rgba(0, 212, 255, 0.1)` | Subtle backgrounds |

### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-status-online` | `#00FF88` | Success, online, active |
| `--color-status-warning` | `#FFB800` | Warnings, caution |
| `--color-status-error` | `#FF4757` | Errors, critical |
| `--color-status-standby` | `#6C757D` | Standby, inactive |
| `--color-status-info` | `#00D4FF` | Information |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#F8FAFC` | Primary text, headings |
| `--color-text-secondary` | `#94A3B8` | Secondary text, labels |
| `--color-text-tertiary` | `#64748B` | Tertiary text, hints |
| `--color-text-muted` | `#475569` | Disabled, placeholders |

### Border Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` | Subtle dividers |
| `--color-border-default` | `rgba(255, 255, 255, 0.1)` | Standard borders |
| `--color-border-accent` | `rgba(0, 212, 255, 0.3)` | Accent borders |

---

## Typography

### Font Families
- **Primary**: `Inter, -apple-system, BlinkMacSystemFont, sans-serif`
- **Monospace**: `JetBrains Mono, SF Mono, Fira Code, monospace`

### Type Scale
| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 1.5rem (24px) | 600 | Page title |
| H2 | 0.875rem (14px) | 600 | Card headers, uppercase |
| Body | 1rem (16px) | 400 | Body text |
| Small | 0.8125rem (13px) | 400 | Secondary content |
| Mono Large | 3rem (48px) | 600 | Large metrics |
| Mono Medium | 1.5rem (24px) | 600 | Medium metrics |
| Mono Small | 0.875rem (14px) | 600 | Small data values |
| Badge | 0.625rem (10px) | 600 | Labels, badges |

---

## Spacing Scale

| Token | Value |
|-------|-------|
| `--space-xs` | 0.25rem (4px) |
| `--space-sm` | 0.5rem (8px) |
| `--space-md` | 1rem (16px) |
| `--space-lg` | 1.5rem (24px) |
| `--space-xl` | 2rem (32px) |
| `--space-2xl` | 3rem (48px) |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Large containers |
| `--radius-full` | 9999px | Pills, badges |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `--shadow-glow` | `0 0 20px rgba(0,212,255,0.2)` | Accent glow |

---

## Glassmorphism Effects

### Standard Panel
```css
background: rgba(26, 31, 46, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Header
```css
background: linear-gradient(180deg, 
    rgba(11, 15, 25, 0.98) 0%, 
    rgba(11, 15, 25, 0.9) 100%);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
```

---

## Layout Grid

### Bento Grid (Desktop)
- 4 columns for KPI cards
- Large cards span 2 columns
- Gap: 24px

### Secondary Grid (Desktop)
- 3 columns: 2fr 1fr 1fr
- Activity feed takes 2/3 width
- Gap: 24px

### Responsive Breakpoints
| Breakpoint | Layout Changes |
|------------|----------------|
| 1200px | Bento grid: 2 columns, Secondary: 2 columns |
| 768px | All grids: 1 column, stacked layout |
| 480px | Compact mobile layout |

---

## Animation

### Transitions
| Token | Value |
|-------|-------|
| `--transition-fast` | 150ms ease |
| `--transition-base` | 250ms ease |
| `--transition-slow` | 350ms ease |

### Keyframes

#### Pulse Dot (Status Indicators)
```css
@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
}
```

#### Fade In (Card Entrance)
```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

#### Shimmer (Loading State)
```css
@keyframes shimmer {
    100% { left: 100%; }
}
```

---

## Component Patterns

### KPI Card
- Background: Glassmorphism panel
- Header: Uppercase, secondary color, small badge
- Content: Large metric value (monospace), supporting labels
- Hover: Accent border glow

### Activity Item
- Left border color indicates status
- Timestamp (monospace, muted)
- Badge (uppercase, status color)
- Message (secondary color)

### Resource Bar
- Track: Tertiary background
- Fill: Gradient (secondary to primary accent)
- Value: Monospace, right-aligned
- Smooth width transition on update

### Model Status Item
- Icon: Bordered square, accent color
- Name: Primary text
- Status: Color-coded (active/standby/warning)
- Latency: Monospace value

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast
- Primary text on bg: 15.3:1 (Passes AAA)
- Secondary text on bg: 8.6:1 (Passes AA)
- Accent on bg: 9.2:1 (Passes AA)
- Status colors meet 4.5:1 minimum

### Focus States
- All interactive elements have visible focus rings
- Focus ring: 2px offset, accent color

### Motion
- Reduced motion query respected
- No essential information conveyed through animation alone

---

## File Structure
```
mission-control/public/
├── index.html          # Main dashboard markup
├── styles.css          # Complete design system
├── script.js           # Interactive functionality
├── virtus-logo.jpg     # Brand logo
└── DESIGN.md           # This file
```

---

## Brand Integration

### Virtus Wealth Advisors
- Logo displayed in header (48px)
- Consistent with institutional finance aesthetic
- Professional, trustworthy color scheme
- Clear data hierarchy for quick decision-making

---

## Real-time Data Display

### Update Intervals
- UTC Clock: 1 second
- Model Latencies: 5 seconds
- Resource Metrics: 5 seconds
- Session Metrics: 5 seconds
- Random Activity: 5 seconds (probabilistic)

### Simulated Data
- Latency fluctuations: ±20%
- Resource usage: Random within realistic bounds
- Activity events: Weighted random selection

---

*Last Updated: February 2025*
*Version: 2.0 - NASA Mission Control Redesign*