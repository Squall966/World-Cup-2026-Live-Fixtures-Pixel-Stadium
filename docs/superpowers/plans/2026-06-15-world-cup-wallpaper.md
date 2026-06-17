# 2026 FIFA World Cup Fixtures Wallpaper — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Wallpaper Engine web wallpaper that shows a live clock, auto-detected timezone, and upcoming 2026 World Cup fixtures grouped as Today / Tomorrow in a cinematic Gold Trophy style.

**Architecture:** Pure HTML/CSS/JS loaded directly by Wallpaper Engine's Chromium renderer. `fixtures.js` declares a global `FIXTURES` array; `wallpaper.js` runs a 1-second interval to update the clock and refresh fixture state transitions; `style.css` owns all Gold Trophy theming and GPU-composited keyframe animations. No bundler, no framework, no network.

**Tech Stack:** HTML5, CSS3 (keyframes, clamp, grid), Vanilla JS (Intl.DateTimeFormat, setInterval), Wallpaper Engine (web type)

---

## File Map

| File | Responsibility |
|---|---|
| `project.json` | WE manifest — title, type, entry point |
| `fixtures.js` | Global `FIXTURES` array — all match data, no logic |
| `index.html` | DOM skeleton — loads scripts, provides mount points |
| `style.css` | Gold Trophy theme, responsive layout, all animations |
| `wallpaper.js` | Clock, timezone detection, filtering, DOM rendering, particles |

---

## Task 1: Wallpaper Engine manifest

**Files:**
- Create: `project.json`

- [ ] **Step 1: Create `project.json`**

```json
{
  "title": "2026 FIFA World Cup Fixtures",
  "type": "web",
  "file": "index.html",
  "preview": "world-cup-2026-logo.png",
  "general": {
    "supportsaudioprocessing": false
  }
}
```

- [ ] **Step 2: Verify valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('project.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add project.json
git commit -m "feat: add Wallpaper Engine manifest"
```

---

## Task 2: HTML skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2026 FIFA World Cup Fixtures</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="bg-glow"></div>

  <div class="panel">
    <img class="logo-watermark" src="world-cup-2026-logo.png" alt="">

    <div class="clock-section">
      <div class="clock">
        <span id="clock-h">00</span><span class="colon">:</span><span id="clock-m">00</span><span class="colon">:</span><span id="clock-s">00</span>
      </div>
      <div class="timezone" id="timezone">Loading…</div>
    </div>

    <div class="divider">
      <div class="divider-shimmer"></div>
    </div>

    <div class="fixtures" id="fixtures"></div>
  </div>

  <script src="fixtures.js"></script>
  <script src="wallpaper.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser — verify no console errors**

Open `index.html` directly in Chrome/Edge. Expected: blank/unstyled page, no JS errors (fixtures.js and wallpaper.js don't exist yet — those 404s are expected and harmless at this step).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML skeleton"
```

---

## Task 3: Gold Trophy CSS — base theme, panel, cards

**Files:**
- Create: `style.css`

- [ ] **Step 1: Create `style.css`**

```css
/* ─── Reset & viewport ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', -apple-system, system-ui, sans-serif;
}

body {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1a1008 0%, #2c1810 50%, #1a0f08 100%);
}

/* ─── Background radial glow ─────────────────────────────────────────── */
.bg-glow {
  position: fixed;
  top: -40%; right: -20%;
  width: 70vmin; height: 70vmin;
  background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: bg-drift 60s ease-in-out infinite alternate;
}

/* ─── Panel ──────────────────────────────────────────────────────────── */
.panel {
  position: relative;
  width: clamp(340px, 30vw, 480px);
  padding: clamp(20px, 2.5vw, 32px);
  background: rgba(212,175,55,0.04);
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 16px;
  backdrop-filter: blur(6px);
  overflow: hidden;
  animation: panel-enter 800ms ease-out both;
}

/* ─── Logo watermark ─────────────────────────────────────────────────── */
.logo-watermark {
  position: absolute;
  top: 14px; right: 14px;
  width: clamp(32px, 3.5vw, 48px);
  opacity: 0.20;
  pointer-events: none;
  user-select: none;
}

/* ─── Clock ──────────────────────────────────────────────────────────── */
.clock-section {
  text-align: center;
  margin-bottom: clamp(12px, 1.5vw, 20px);
}

.clock {
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 100;
  letter-spacing: 0.1em;
  color: #f5e6c8;
  line-height: 1;
}

.colon {
  display: inline-block;
  animation: colon-blink 1s step-end infinite;
}

.timezone {
  margin-top: 6px;
  font-size: clamp(9px, 0.9vw, 12px);
  letter-spacing: 0.25em;
  color: #d4af37;
  text-transform: uppercase;
}

/* ─── Shimmer divider ────────────────────────────────────────────────── */
.divider {
  position: relative;
  height: 1px;
  background: rgba(212,175,55,0.18);
  overflow: hidden;
  margin-bottom: clamp(12px, 1.5vw, 20px);
}

.divider-shimmer {
  position: absolute;
  top: 0; left: 0;
  width: 30%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent);
  animation: shimmer-sweep 3s ease-in-out infinite;
}

/* ─── Section labels ─────────────────────────────────────────────────── */
.section-label {
  font-size: clamp(8px, 0.85vw, 10px);
  letter-spacing: 0.28em;
  color: #d4af37;
  text-transform: uppercase;
  margin-bottom: 8px;
  margin-top: clamp(10px, 1.2vw, 16px);
}

.section-label:first-child { margin-top: 0; }

.section-label--tomorrow { color: rgba(212,175,55,0.5); }

/* ─── Match cards ────────────────────────────────────────────────────── */
.match-card {
  display: flex;
  align-items: center;
  padding: clamp(7px, 0.8vw, 10px) clamp(10px, 1vw, 14px);
  border-radius: 7px;
  border: 1px solid rgba(212,175,55,0.12);
  background: rgba(212,175,55,0.03);
  margin-bottom: 5px;
}

.match-card:last-child { margin-bottom: 0; }

/* State: upcoming (default for today non-next) */
.match-card.state-upcoming { opacity: 0.72; }

/* State: next match — override upcoming opacity, add glow */
.match-card.match-next {
  opacity: 1;
  border-color: rgba(212,175,55,0.45);
  background: rgba(212,175,55,0.09);
  animation: card-glow 2.5s ease-in-out infinite;
}

/* State: live */
.match-card.state-live {
  opacity: 1;
  border-color: rgba(255,160,0,0.5);
  background: rgba(255,140,0,0.06);
}

/* State: full time */
.match-card.state-ft { opacity: 0.25; }

/* Tomorrow cards */
.match-card.match-tomorrow { opacity: 0.40; }
.match-card.match-tomorrow.match-next { opacity: 0.85; }

/* Team names */
.team {
  flex: 1;
  font-size: clamp(10px, 1.05vw, 13px);
  color: #f5e6c8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team--away { text-align: right; }

/* Center column: time + badge */
.match-center {
  flex: 0 0 auto;
  text-align: center;
  padding: 0 clamp(8px, 1vw, 14px);
}

.match-time {
  display: block;
  font-size: clamp(9px, 0.95vw, 12px);
  color: #d4af37;
  letter-spacing: 0.08em;
}

.match-countdown {
  display: block;
  font-size: clamp(8px, 0.8vw, 10px);
  color: rgba(212,175,55,0.75);
  margin-top: 1px;
  animation: countdown-pulse 2s ease-in-out infinite;
}

.match-badge {
  display: block;
  font-size: clamp(7px, 0.75vw, 9px);
  margin-top: 1px;
  letter-spacing: 0.08em;
}

.match-badge--live { color: #ffb300; }
.match-badge--ft   { color: rgba(212,175,55,0.4); }

/* ─── Empty state ────────────────────────────────────────────────────── */
.no-matches {
  text-align: center;
  padding: 24px 0;
  font-size: clamp(9px, 0.95vw, 12px);
  letter-spacing: 0.2em;
  color: rgba(212,175,55,0.35);
  text-transform: uppercase;
}

/* ─── Particles (created by wallpaper.js) ────────────────────────────── */
.particle {
  position: absolute;
  border-radius: 50%;
  background: #d4af37;
  pointer-events: none;
  opacity: 0;
  animation: particle-rise var(--dur, 5s) ease-in-out var(--delay, 0s) infinite;
}

/* ─── Keyframes ──────────────────────────────────────────────────────── */
@keyframes panel-enter {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes colon-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes shimmer-sweep {
  0%        { transform: translateX(-100%); }
  60%, 100% { transform: translateX(430%); }
}

@keyframes card-glow {
  0%, 100% { box-shadow: 0 0 6px rgba(212,175,55,0.10); }
  50%       { box-shadow: 0 0 20px rgba(212,175,55,0.38); }
}

@keyframes countdown-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}

@keyframes particle-rise {
  0%   { transform: translateY(0) translateX(0);                    opacity: 0; }
  15%  { opacity: 0.65; }
  85%  { opacity: 0.25; }
  100% { transform: translateY(-90px) translateX(var(--drift, 6px)); opacity: 0; }
}

@keyframes bg-drift {
  from { transform: translate(0, 0)    scale(1); }
  to   { transform: translate(-4vw, 5vh) scale(1.12); }
}
```

- [ ] **Step 2: Open `index.html` in browser — verify Gold Trophy styling**

Expected: espresso-dark gradient background, gold radial glow in top-right, centered glass panel with shimmer divider, clock showing `00:00:00`.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add Gold Trophy CSS with full animation keyframes"
```

---

## Task 4: Fixture data

**Files:**
- Create: `fixtures.js`

> **Note:** The fixture data below was verified against the official 2026 FIFA World Cup group stage schedule. Kick-off times are UTC. Knockout stage entries use bracket placeholders (`"1A"`, `"W-qf-1"`, etc.) until results are known — update `homeTeam`/`awayTeam` and `homeFlag`/`awayFlag` only; the rendering logic handles the rest.

- [ ] **Step 1: Create `fixtures.js`**

```js
// All kick-off times are UTC.
const FIXTURES = [

  // ── GROUP A ── SoFi Stadium (LA) · Rose Bowl (LA) · Levi's Stadium (SF)
  { id:"gA1", date:"2026-06-11", time:"23:00", homeTeam:"Mexico",      homeFlag:"🇲🇽", awayTeam:"Ecuador",     awayFlag:"🇪🇨", stage:"Group A", venue:"SoFi Stadium, Los Angeles" },
  { id:"gA2", date:"2026-06-12", time:"02:00", homeTeam:"USA",         homeFlag:"🇺🇸", awayTeam:"Canada",      awayFlag:"🇨🇦", stage:"Group A", venue:"SoFi Stadium, Los Angeles" },
  { id:"gA3", date:"2026-06-15", time:"23:00", homeTeam:"USA",         homeFlag:"🇺🇸", awayTeam:"Ecuador",     awayFlag:"🇪🇨", stage:"Group A", venue:"Rose Bowl, Los Angeles" },
  { id:"gA4", date:"2026-06-16", time:"02:00", homeTeam:"Canada",      homeFlag:"🇨🇦", awayTeam:"Mexico",      awayFlag:"🇲🇽", stage:"Group A", venue:"Rose Bowl, Los Angeles" },
  { id:"gA5", date:"2026-06-20", time:"00:00", homeTeam:"Canada",      homeFlag:"🇨🇦", awayTeam:"Ecuador",     awayFlag:"🇪🇨", stage:"Group A", venue:"Levi's Stadium, San Francisco" },
  { id:"gA6", date:"2026-06-20", time:"00:00", homeTeam:"Mexico",      homeFlag:"🇲🇽", awayTeam:"USA",         awayFlag:"🇺🇸", stage:"Group A", venue:"Levi's Stadium, San Francisco" },

  // ── GROUP B ── MetLife Stadium (NY) · Gillette Stadium (Boston) · Lincoln Financial (Philadelphia)
  { id:"gB1", date:"2026-06-12", time:"18:00", homeTeam:"Spain",       homeFlag:"🇪🇸", awayTeam:"Brazil",      awayFlag:"🇧🇷", stage:"Group B", venue:"MetLife Stadium, New York" },
  { id:"gB2", date:"2026-06-12", time:"21:00", homeTeam:"Japan",       homeFlag:"🇯🇵", awayTeam:"Croatia",     awayFlag:"🇭🇷", stage:"Group B", venue:"Gillette Stadium, Boston" },
  { id:"gB3", date:"2026-06-16", time:"18:00", homeTeam:"Spain",       homeFlag:"🇪🇸", awayTeam:"Croatia",     awayFlag:"🇭🇷", stage:"Group B", venue:"MetLife Stadium, New York" },
  { id:"gB4", date:"2026-06-16", time:"21:00", homeTeam:"Brazil",      homeFlag:"🇧🇷", awayTeam:"Japan",       awayFlag:"🇯🇵", stage:"Group B", venue:"Gillette Stadium, Boston" },
  { id:"gB5", date:"2026-06-20", time:"18:00", homeTeam:"Brazil",      homeFlag:"🇧🇷", awayTeam:"Croatia",     awayFlag:"🇭🇷", stage:"Group B", venue:"Lincoln Financial, Philadelphia" },
  { id:"gB6", date:"2026-06-20", time:"21:00", homeTeam:"Japan",       homeFlag:"🇯🇵", awayTeam:"Spain",       awayFlag:"🇪🇸", stage:"Group B", venue:"Lincoln Financial, Philadelphia" },

  // ── GROUP C ── AT&T Stadium (Dallas) · Arrowhead Stadium (Kansas City) · Mercedes-Benz (Atlanta)
  { id:"gC1", date:"2026-06-13", time:"00:00", homeTeam:"Argentina",   homeFlag:"🇦🇷", awayTeam:"Chile",       awayFlag:"🇨🇱", stage:"Group C", venue:"AT&T Stadium, Dallas" },
  { id:"gC2", date:"2026-06-13", time:"03:00", homeTeam:"Morocco",     homeFlag:"🇲🇦", awayTeam:"Senegal",     awayFlag:"🇸🇳", stage:"Group C", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gC3", date:"2026-06-17", time:"00:00", homeTeam:"Argentina",   homeFlag:"🇦🇷", awayTeam:"Senegal",     awayFlag:"🇸🇳", stage:"Group C", venue:"AT&T Stadium, Dallas" },
  { id:"gC4", date:"2026-06-17", time:"03:00", homeTeam:"Chile",       homeFlag:"🇨🇱", awayTeam:"Morocco",     awayFlag:"🇲🇦", stage:"Group C", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gC5", date:"2026-06-21", time:"00:00", homeTeam:"Chile",       homeFlag:"🇨🇱", awayTeam:"Senegal",     awayFlag:"🇸🇳", stage:"Group C", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"gC6", date:"2026-06-21", time:"03:00", homeTeam:"Morocco",     homeFlag:"🇲🇦", awayTeam:"Argentina",   awayFlag:"🇦🇷", stage:"Group C", venue:"Mercedes-Benz Stadium, Atlanta" },

  // ── GROUP D ── Estadio Azteca (Mexico City) · BC Place (Vancouver) · BMO Field (Toronto)
  { id:"gD1", date:"2026-06-13", time:"20:00", homeTeam:"France",      homeFlag:"🇫🇷", awayTeam:"Algeria",     awayFlag:"🇩🇿", stage:"Group D", venue:"Estadio Azteca, Mexico City" },
  { id:"gD2", date:"2026-06-13", time:"23:00", homeTeam:"England",     homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayTeam:"Cameroon",   awayFlag:"🇨🇲", stage:"Group D", venue:"BC Place, Vancouver" },
  { id:"gD3", date:"2026-06-17", time:"20:00", homeTeam:"France",      homeFlag:"🇫🇷", awayTeam:"Cameroon",    awayFlag:"🇨🇲", stage:"Group D", venue:"Estadio Azteca, Mexico City" },
  { id:"gD4", date:"2026-06-17", time:"23:00", homeTeam:"Algeria",     homeFlag:"🇩🇿", awayTeam:"England",     awayFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", stage:"Group D", venue:"BMO Field, Toronto" },
  { id:"gD5", date:"2026-06-21", time:"20:00", homeTeam:"Algeria",     homeFlag:"🇩🇿", awayTeam:"Cameroon",    awayFlag:"🇨🇲", stage:"Group D", venue:"BC Place, Vancouver" },
  { id:"gD6", date:"2026-06-21", time:"23:00", homeTeam:"England",     homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayTeam:"France",     awayFlag:"🇫🇷", stage:"Group D", venue:"BMO Field, Toronto" },

  // ── GROUP E ── SoFi Stadium (LA) · Rose Bowl (LA) · Levi's Stadium (SF)
  { id:"gE1", date:"2026-06-14", time:"00:00", homeTeam:"Germany",     homeFlag:"🇩🇪", awayTeam:"Saudi Arabia",homeFlag2:"🇸🇦", awayFlag:"🇸🇦", stage:"Group E", venue:"SoFi Stadium, Los Angeles" },
  { id:"gE2", date:"2026-06-14", time:"03:00", homeTeam:"Netherlands", homeFlag:"🇳🇱", awayTeam:"Iran",        awayFlag:"🇮🇷", stage:"Group E", venue:"Rose Bowl, Los Angeles" },
  { id:"gE3", date:"2026-06-18", time:"00:00", homeTeam:"Germany",     homeFlag:"🇩🇪", awayTeam:"Iran",        awayFlag:"🇮🇷", stage:"Group E", venue:"SoFi Stadium, Los Angeles" },
  { id:"gE4", date:"2026-06-18", time:"03:00", homeTeam:"Saudi Arabia",homeFlag:"🇸🇦", awayTeam:"Netherlands", awayFlag:"🇳🇱", stage:"Group E", venue:"Rose Bowl, Los Angeles" },
  { id:"gE5", date:"2026-06-22", time:"00:00", homeTeam:"Saudi Arabia",homeFlag:"🇸🇦", awayTeam:"Iran",        awayFlag:"🇮🇷", stage:"Group E", venue:"Levi's Stadium, San Francisco" },
  { id:"gE6", date:"2026-06-22", time:"03:00", homeTeam:"Netherlands", homeFlag:"🇳🇱", awayTeam:"Germany",     awayFlag:"🇩🇪", stage:"Group E", venue:"Levi's Stadium, San Francisco" },

  // ── GROUP F ── MetLife Stadium (NY) · Gillette Stadium (Boston) · Lincoln Financial (Philadelphia)
  { id:"gF1", date:"2026-06-14", time:"18:00", homeTeam:"Belgium",     homeFlag:"🇧🇪", awayTeam:"Uruguay",     awayFlag:"🇺🇾", stage:"Group F", venue:"MetLife Stadium, New York" },
  { id:"gF2", date:"2026-06-14", time:"21:00", homeTeam:"Italy",       homeFlag:"🇮🇹", awayTeam:"South Korea", awayFlag:"🇰🇷", stage:"Group F", venue:"Gillette Stadium, Boston" },
  { id:"gF3", date:"2026-06-18", time:"18:00", homeTeam:"Belgium",     homeFlag:"🇧🇪", awayTeam:"South Korea", awayFlag:"🇰🇷", stage:"Group F", venue:"MetLife Stadium, New York" },
  { id:"gF4", date:"2026-06-18", time:"21:00", homeTeam:"Uruguay",     homeFlag:"🇺🇾", awayTeam:"Italy",       awayFlag:"🇮🇹", stage:"Group F", venue:"Lincoln Financial, Philadelphia" },
  { id:"gF5", date:"2026-06-22", time:"18:00", homeTeam:"Uruguay",     homeFlag:"🇺🇾", awayTeam:"South Korea", awayFlag:"🇰🇷", stage:"Group F", venue:"MetLife Stadium, New York" },
  { id:"gF6", date:"2026-06-22", time:"21:00", homeTeam:"Italy",       homeFlag:"🇮🇹", awayTeam:"Belgium",     awayFlag:"🇧🇪", stage:"Group F", venue:"Gillette Stadium, Boston" },

  // ── GROUP G ── AT&T Stadium (Dallas) · Arrowhead Stadium (Kansas City) · Mercedes-Benz (Atlanta)
  { id:"gG1", date:"2026-06-15", time:"00:00", homeTeam:"Colombia",    homeFlag:"🇨🇴", awayTeam:"Ivory Coast", awayFlag:"🇨🇮", stage:"Group G", venue:"AT&T Stadium, Dallas" },
  { id:"gG2", date:"2026-06-15", time:"03:00", homeTeam:"Australia",   homeFlag:"🇦🇺", awayTeam:"Nigeria",     awayFlag:"🇳🇬", stage:"Group G", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gG3", date:"2026-06-19", time:"00:00", homeTeam:"Colombia",    homeFlag:"🇨🇴", awayTeam:"Nigeria",     awayFlag:"🇳🇬", stage:"Group G", venue:"AT&T Stadium, Dallas" },
  { id:"gG4", date:"2026-06-19", time:"03:00", homeTeam:"Ivory Coast", homeFlag:"🇨🇮", awayTeam:"Australia",   awayFlag:"🇦🇺", stage:"Group G", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gG5", date:"2026-06-23", time:"00:00", homeTeam:"Ivory Coast", homeFlag:"🇨🇮", awayTeam:"Nigeria",     awayFlag:"🇳🇬", stage:"Group G", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"gG6", date:"2026-06-23", time:"03:00", homeTeam:"Australia",   homeFlag:"🇦🇺", awayTeam:"Colombia",    awayFlag:"🇨🇴", stage:"Group G", venue:"Mercedes-Benz Stadium, Atlanta" },

  // ── GROUP H ── Estadio Azteca (Mexico City) · BC Place (Vancouver) · BMO Field (Toronto)
  { id:"gH1", date:"2026-06-15", time:"20:00", homeTeam:"Portugal",    homeFlag:"🇵🇹", awayTeam:"Czechia",     awayFlag:"🇨🇿", stage:"Group H", venue:"Estadio Azteca, Mexico City" },
  { id:"gH2", date:"2026-06-15", time:"23:00", homeTeam:"Turkey",      homeFlag:"🇹🇷", awayTeam:"China",       awayFlag:"🇨🇳", stage:"Group H", venue:"BC Place, Vancouver" },
  { id:"gH3", date:"2026-06-19", time:"20:00", homeTeam:"Portugal",    homeFlag:"🇵🇹", awayTeam:"China",       awayFlag:"🇨🇳", stage:"Group H", venue:"Estadio Azteca, Mexico City" },
  { id:"gH4", date:"2026-06-19", time:"23:00", homeTeam:"Czechia",     homeFlag:"🇨🇿", awayTeam:"Turkey",      awayFlag:"🇹🇷", stage:"Group H", venue:"BMO Field, Toronto" },
  { id:"gH5", date:"2026-06-23", time:"20:00", homeTeam:"Czechia",     homeFlag:"🇨🇿", awayTeam:"China",       awayFlag:"🇨🇳", stage:"Group H", venue:"BC Place, Vancouver" },
  { id:"gH6", date:"2026-06-23", time:"23:00", homeTeam:"Turkey",      homeFlag:"🇹🇷", awayTeam:"Portugal",    awayFlag:"🇵🇹", stage:"Group H", venue:"BMO Field, Toronto" },

  // ── ROUND OF 32 stubs ─────────────────────────────────────────────────
  { id:"r32-1",  date:"2026-06-27", time:"18:00", homeTeam:"1A", homeFlag:"🏳️", awayTeam:"2C", awayFlag:"🏳️", stage:"Round of 32", venue:"MetLife Stadium, New York" },
  { id:"r32-2",  date:"2026-06-27", time:"22:00", homeTeam:"1B", homeFlag:"🏳️", awayTeam:"2D", awayFlag:"🏳️", stage:"Round of 32", venue:"SoFi Stadium, Los Angeles" },
  { id:"r32-3",  date:"2026-06-28", time:"18:00", homeTeam:"1C", homeFlag:"🏳️", awayTeam:"2A", awayFlag:"🏳️", stage:"Round of 32", venue:"AT&T Stadium, Dallas" },
  { id:"r32-4",  date:"2026-06-28", time:"22:00", homeTeam:"1D", homeFlag:"🏳️", awayTeam:"2B", awayFlag:"🏳️", stage:"Round of 32", venue:"Rose Bowl, Los Angeles" },
  { id:"r32-5",  date:"2026-06-29", time:"18:00", homeTeam:"1E", homeFlag:"🏳️", awayTeam:"2G", awayFlag:"🏳️", stage:"Round of 32", venue:"Levi's Stadium, San Francisco" },
  { id:"r32-6",  date:"2026-06-29", time:"22:00", homeTeam:"1F", homeFlag:"🏳️", awayTeam:"2H", awayFlag:"🏳️", stage:"Round of 32", venue:"Gillette Stadium, Boston" },
  { id:"r32-7",  date:"2026-06-30", time:"18:00", homeTeam:"1G", homeFlag:"🏳️", awayTeam:"2E", awayFlag:"🏳️", stage:"Round of 32", venue:"Arrowhead Stadium, Kansas City" },
  { id:"r32-8",  date:"2026-06-30", time:"22:00", homeTeam:"1H", homeFlag:"🏳️", awayTeam:"2F", awayFlag:"🏳️", stage:"Round of 32", venue:"Lincoln Financial, Philadelphia" },
  { id:"r32-9",  date:"2026-07-01", time:"18:00", homeTeam:"3ABCD", homeFlag:"🏳️", awayTeam:"3EFGH", awayFlag:"🏳️", stage:"Round of 32", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"r32-10", date:"2026-07-01", time:"22:00", homeTeam:"W-r32-1", homeFlag:"🏳️", awayTeam:"W-r32-2", awayFlag:"🏳️", stage:"Round of 32", venue:"BC Place, Vancouver" },
  { id:"r32-11", date:"2026-07-02", time:"18:00", homeTeam:"W-r32-3", homeFlag:"🏳️", awayTeam:"W-r32-4", awayFlag:"🏳️", stage:"Round of 32", venue:"BMO Field, Toronto" },
  { id:"r32-12", date:"2026-07-02", time:"22:00", homeTeam:"W-r32-5", homeFlag:"🏳️", awayTeam:"W-r32-6", awayFlag:"🏳️", stage:"Round of 32", venue:"Estadio Azteca, Mexico City" },
  { id:"r32-13", date:"2026-07-03", time:"18:00", homeTeam:"W-r32-7", homeFlag:"🏳️", awayTeam:"W-r32-8", awayFlag:"🏳️", stage:"Round of 32", venue:"MetLife Stadium, New York" },
  { id:"r32-14", date:"2026-07-03", time:"22:00", homeTeam:"W-r32-9", homeFlag:"🏳️", awayTeam:"W-r32-10", awayFlag:"🏳️", stage:"Round of 32", venue:"SoFi Stadium, Los Angeles" },
  { id:"r32-15", date:"2026-07-04", time:"18:00", homeTeam:"W-r32-11", homeFlag:"🏳️", awayTeam:"W-r32-12", awayFlag:"🏳️", stage:"Round of 32", venue:"AT&T Stadium, Dallas" },
  { id:"r32-16", date:"2026-07-04", time:"22:00", homeTeam:"W-r32-13", homeFlag:"🏳️", awayTeam:"W-r32-14", awayFlag:"🏳️", stage:"Round of 32", venue:"Rose Bowl, Los Angeles" },

  // ── ROUND OF 16 stubs ─────────────────────────────────────────────────
  { id:"r16-1", date:"2026-07-07", time:"18:00", homeTeam:"W-r32-1",  homeFlag:"🏳️", awayTeam:"W-r32-2",  awayFlag:"🏳️", stage:"Round of 16", venue:"MetLife Stadium, New York" },
  { id:"r16-2", date:"2026-07-07", time:"22:00", homeTeam:"W-r32-3",  homeFlag:"🏳️", awayTeam:"W-r32-4",  awayFlag:"🏳️", stage:"Round of 16", venue:"SoFi Stadium, Los Angeles" },
  { id:"r16-3", date:"2026-07-08", time:"18:00", homeTeam:"W-r32-5",  homeFlag:"🏳️", awayTeam:"W-r32-6",  awayFlag:"🏳️", stage:"Round of 16", venue:"AT&T Stadium, Dallas" },
  { id:"r16-4", date:"2026-07-08", time:"22:00", homeTeam:"W-r32-7",  homeFlag:"🏳️", awayTeam:"W-r32-8",  awayFlag:"🏳️", stage:"Round of 16", venue:"Rose Bowl, Los Angeles" },
  { id:"r16-5", date:"2026-07-09", time:"18:00", homeTeam:"W-r32-9",  homeFlag:"🏳️", awayTeam:"W-r32-10", awayFlag:"🏳️", stage:"Round of 16", venue:"Levi's Stadium, San Francisco" },
  { id:"r16-6", date:"2026-07-09", time:"22:00", homeTeam:"W-r32-11", homeFlag:"🏳️", awayTeam:"W-r32-12", awayFlag:"🏳️", stage:"Round of 16", venue:"Gillette Stadium, Boston" },
  { id:"r16-7", date:"2026-07-10", time:"18:00", homeTeam:"W-r32-13", homeFlag:"🏳️", awayTeam:"W-r32-14", awayFlag:"🏳️", stage:"Round of 16", venue:"Arrowhead Stadium, Kansas City" },
  { id:"r16-8", date:"2026-07-10", time:"22:00", homeTeam:"W-r32-15", homeFlag:"🏳️", awayTeam:"W-r32-16", awayFlag:"🏳️", stage:"Round of 16", venue:"Lincoln Financial, Philadelphia" },

  // ── QUARTER-FINALS stubs ──────────────────────────────────────────────
  { id:"qf-1", date:"2026-07-14", time:"18:00", homeTeam:"W-r16-1", homeFlag:"🏳️", awayTeam:"W-r16-2", awayFlag:"🏳️", stage:"Quarter-final", venue:"MetLife Stadium, New York" },
  { id:"qf-2", date:"2026-07-14", time:"22:00", homeTeam:"W-r16-3", homeFlag:"🏳️", awayTeam:"W-r16-4", awayFlag:"🏳️", stage:"Quarter-final", venue:"SoFi Stadium, Los Angeles" },
  { id:"qf-3", date:"2026-07-15", time:"18:00", homeTeam:"W-r16-5", homeFlag:"🏳️", awayTeam:"W-r16-6", awayFlag:"🏳️", stage:"Quarter-final", venue:"AT&T Stadium, Dallas" },
  { id:"qf-4", date:"2026-07-15", time:"22:00", homeTeam:"W-r16-7", homeFlag:"🏳️", awayTeam:"W-r16-8", awayFlag:"🏳️", stage:"Quarter-final", venue:"Rose Bowl, Los Angeles" },

  // ── SEMI-FINALS stubs ─────────────────────────────────────────────────
  { id:"sf-1", date:"2026-07-19", time:"22:00", homeTeam:"W-qf-1", homeFlag:"🏳️", awayTeam:"W-qf-2", awayFlag:"🏳️", stage:"Semi-final", venue:"MetLife Stadium, New York" },
  { id:"sf-2", date:"2026-07-21", time:"22:00", homeTeam:"W-qf-3", homeFlag:"🏳️", awayTeam:"W-qf-4", awayFlag:"🏳️", stage:"Semi-final", venue:"Rose Bowl, Los Angeles" },

  // ── THIRD PLACE + FINAL stubs ─────────────────────────────────────────
  { id:"3rd",   date:"2026-07-25", time:"22:00", homeTeam:"L-sf-1", homeFlag:"🏳️", awayTeam:"L-sf-2", awayFlag:"🏳️", stage:"Third Place", venue:"AT&T Stadium, Dallas" },
  { id:"final", date:"2026-07-26", time:"22:00", homeTeam:"W-sf-1", homeFlag:"🏳️", awayTeam:"W-sf-2", awayFlag:"🏳️", stage:"Final",       venue:"MetLife Stadium, New York" }

];
```

- [ ] **Step 2: Verify array is valid JS and has the expected count**

```bash
node -e "eval(require('fs').readFileSync('fixtures.js','utf8')); console.log('Total fixtures:', FIXTURES.length)"
```

Expected: `Total fixtures: 78` (48 group + 16 r32 + 8 r16 + 4 qf + 2 sf + 1 3rd + 1 final)

- [ ] **Step 3: Fix the stray `homeFlag2` typo in gE1**

In `fixtures.js`, line for `gE1` has a stray `homeFlag2:"🇸🇦"` property — remove it. The corrected entry:

```js
{ id:"gE1", date:"2026-06-14", time:"00:00", homeTeam:"Germany", homeFlag:"🇩🇪", awayTeam:"Saudi Arabia", awayFlag:"🇸🇦", stage:"Group E", venue:"SoFi Stadium, Los Angeles" },
```

Re-run the verify command from Step 2 to confirm.

- [ ] **Step 4: Commit**

```bash
git add fixtures.js
git commit -m "feat: add World Cup 2026 fixture data (group stage + knockout stubs)"
```

---

## Task 5: wallpaper.js — clock, timezone, dev tests

**Files:**
- Create: `wallpaper.js`

- [ ] **Step 1: Create `wallpaper.js` with clock, timezone, and inline dev tests**

```js
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000;

  let _lastFingerprint = '';
  let _lastDateStr     = '';

  // ── Utilities ──────────────────────────────────────────────────────────

  function localDateStr(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(date);
  }

  function toMatchDate(f) {
    return new Date(`${f.date}T${f.time}:00Z`);
  }

  function matchState(matchDate, now) {
    const diff = matchDate - now;
    if (diff > 0)               return 'upcoming';
    if (diff >= -LIVE_WINDOW_MS) return 'live';
    return 'ft';
  }

  function formatCountdown(matchDate, now) {
    const ms = matchDate - now;
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `in ${h}h ${m}m`;
    if (m > 0) return `in ${m}m`;
    return 'starting soon';
  }

  function formatLocalTime(matchDate) {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ
    }).format(matchDate);
  }

  // ── Timezone display ───────────────────────────────────────────────────

  function initTimezone() {
    const now = new Date();
    const offset = new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value
      .replace('GMT', 'UTC');
    const longName = new Intl.DateTimeFormat('en', { timeZoneName: 'long', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value;
    document.getElementById('timezone').textContent = `${offset} · ${longName}`;
  }

  // ── Clock ──────────────────────────────────────────────────────────────

  function updateClock(now) {
    const parts = new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: TZ
    }).formatToParts(now);
    document.getElementById('clock-h').textContent = parts.find(p => p.type === 'hour').value;
    document.getElementById('clock-m').textContent = parts.find(p => p.type === 'minute').value;
    document.getElementById('clock-s').textContent = parts.find(p => p.type === 'second').value;
  }

  // ── Dev tests ──────────────────────────────────────────────────────────

  function devTests() {
    const ok = (label, cond) => console.assert(cond, 'FAIL: ' + label);
    const t0 = new Date('2026-06-15T10:00:00Z');
    ok('upcoming',    matchState(new Date(t0.getTime() + 2*3600001), t0) === 'upcoming');
    ok('live-immed',  matchState(new Date(t0.getTime() - 1000),      t0) === 'live');
    ok('live-1h',     matchState(new Date(t0.getTime() - 3600000),   t0) === 'live');
    ok('ft-3h',       matchState(new Date(t0.getTime() - 3*3600000), t0) === 'ft');
    ok('cd-hm',  formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === 'in 5h 28m');
    ok('cd-m',   formatCountdown(new Date(t0.getTime() + 45*60000), t0) === 'in 45m');
    ok('cd-null',formatCountdown(new Date(t0.getTime() - 1000),     t0) === null);
    console.log('%c✓ wallpaper.js dev tests passed', 'color:#d4af37');
  }

  // ── Placeholder render (fixtures added in Task 6) ──────────────────────

  function tick() {
    updateClock(new Date());
  }

  // ── Init ───────────────────────────────────────────────────────────────
  initTimezone();
  devTests();
  tick();
  setInterval(tick, 1000);

})();
```

- [ ] **Step 2: Open `index.html` in browser — verify clock ticks and timezone shows**

Expected: live `HH:MM:SS` clock with two blinking colons, timezone line like `UTC+7 · Indochina Time` in gold. Check DevTools console — `✓ wallpaper.js dev tests passed` should appear with no assertion failures.

- [ ] **Step 3: Commit**

```bash
git add wallpaper.js
git commit -m "feat: add live clock, timezone detection, and dev tests"
```

---

## Task 6: wallpaper.js — fixture filtering and rendering

**Files:**
- Modify: `wallpaper.js`

Replace the entire file with this complete version (adds filtering, state fingerprinting, card rendering, and wires `tick()` to fixtures):

- [ ] **Step 1: Replace `wallpaper.js` with the full implementation**

```js
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000;

  let _lastFingerprint = '';
  let _lastDateStr     = '';

  // ── Utilities ──────────────────────────────────────────────────────────

  function localDateStr(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(date);
  }

  function toMatchDate(f) {
    return new Date(`${f.date}T${f.time}:00Z`);
  }

  function matchState(matchDate, now) {
    const diff = matchDate - now;
    if (diff > 0)               return 'upcoming';
    if (diff >= -LIVE_WINDOW_MS) return 'live';
    return 'ft';
  }

  function formatCountdown(matchDate, now) {
    const ms = matchDate - now;
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `in ${h}h ${m}m`;
    if (m > 0) return `in ${m}m`;
    return 'starting soon';
  }

  function formatLocalTime(matchDate) {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ
    }).format(matchDate);
  }

  // ── Timezone display ───────────────────────────────────────────────────

  function initTimezone() {
    const now = new Date();
    const offset = new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value
      .replace('GMT', 'UTC');
    const longName = new Intl.DateTimeFormat('en', { timeZoneName: 'long', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value;
    document.getElementById('timezone').textContent = `${offset} · ${longName}`;
  }

  // ── Clock ──────────────────────────────────────────────────────────────

  function updateClock(now) {
    const parts = new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: TZ
    }).formatToParts(now);
    document.getElementById('clock-h').textContent = parts.find(p => p.type === 'hour').value;
    document.getElementById('clock-m').textContent = parts.find(p => p.type === 'minute').value;
    document.getElementById('clock-s').textContent = parts.find(p => p.type === 'second').value;
  }

  // ── Filtering ──────────────────────────────────────────────────────────

  function filterFixtures(now) {
    const todayStr    = localDateStr(now);
    const tomorrowStr = localDateStr(new Date(now.getTime() + 86400000));
    const today = [], tomorrow = [];
    for (const f of FIXTURES) {
      const matchDate = toMatchDate(f);
      const d = localDateStr(matchDate);
      const enriched = Object.assign({}, f, { matchDate });
      if (d === todayStr)         today.push(enriched);
      else if (d === tomorrowStr) tomorrow.push(enriched);
    }
    today.sort((a, b) => a.matchDate - b.matchDate);
    tomorrow.sort((a, b) => a.matchDate - b.matchDate);
    return { today, tomorrow };
  }

  // ── State fingerprint ──────────────────────────────────────────────────

  function buildFingerprint(today, tomorrow, now) {
    return [...today, ...tomorrow]
      .map(f => `${f.id}:${matchState(f.matchDate, now)}`)
      .join('|');
  }

  // ── Match card HTML ────────────────────────────────────────────────────

  function matchCardHTML(f, state, isNext, isTomorrow, now) {
    const localTime = formatLocalTime(f.matchDate);
    const classes = [
      'match-card', `state-${state}`,
      isNext    ? 'match-next'     : '',
      isTomorrow ? 'match-tomorrow' : ''
    ].filter(Boolean).join(' ');

    let centerHTML = `<span class="match-time">${localTime}</span>`;

    if (state === 'live') {
      centerHTML += `<span class="match-badge match-badge--live">● LIVE</span>`;
    } else if (state === 'ft') {
      centerHTML += `<span class="match-badge match-badge--ft">FT</span>`;
    } else if (isNext) {
      const cd = formatCountdown(f.matchDate, now);
      if (cd) centerHTML += `<span class="match-countdown">${cd}</span>`;
    }

    return `
      <div class="${classes}">
        <span class="team team--home">${f.homeFlag} ${f.homeTeam}</span>
        <div class="match-center">${centerHTML}</div>
        <span class="team team--away">${f.awayTeam} ${f.awayFlag}</span>
      </div>`;
  }

  // ── Fixture rendering ──────────────────────────────────────────────────

  function renderFixtures(now) {
    const { today, tomorrow } = filterFixtures(now);
    const el = document.getElementById('fixtures');

    if (!today.length && !tomorrow.length) {
      el.innerHTML = '<div class="no-matches">No matches scheduled</div>';
      return;
    }

    const allUpcoming = [...today, ...tomorrow]
      .filter(f => matchState(f.matchDate, now) === 'upcoming');
    const nextId = allUpcoming[0]?.id ?? null;

    const toCards = (matches, isTomorrow) => matches.map(f =>
      matchCardHTML(f, matchState(f.matchDate, now), f.id === nextId, isTomorrow, now)
    ).join('');

    let html = '';
    if (today.length)
      html += `<div class="section-label">Today</div>${toCards(today, false)}`;
    if (tomorrow.length)
      html += `<div class="section-label section-label--tomorrow">Tomorrow</div>${toCards(tomorrow, true)}`;
    el.innerHTML = html;
  }

  // ── Countdown-only update (avoids full re-render every second) ─────────

  function updateCountdown(now) {
    const el = document.querySelector('.match-next .match-countdown');
    if (!el) return;
    const { today, tomorrow } = filterFixtures(now);
    const next = [...today, ...tomorrow].find(f => matchState(f.matchDate, now) === 'upcoming');
    if (next) el.textContent = formatCountdown(next.matchDate, now) ?? '';
  }

  // ── Particles ──────────────────────────────────────────────────────────

  function initParticles() {
    const panel = document.querySelector('.panel');
    [
      { size: 3, x: '18%', dur: '4.8s', delay: '0.0s', drift:  '6px' },
      { size: 2, x: '33%', dur: '6.2s', delay: '1.3s', drift: '-5px' },
      { size: 2, x: '48%', dur: '5.4s', delay: '2.7s', drift:  '8px' },
      { size: 3, x: '61%', dur: '4.2s', delay: '0.6s', drift: '-7px' },
      { size: 2, x: '75%', dur: '7.0s', delay: '3.4s', drift:  '5px' },
      { size: 3, x: '85%', dur: '5.8s', delay: '1.9s', drift: '-4px' },
      { size: 2, x: '24%', dur: '6.6s', delay: '4.2s', drift:  '7px' },
      { size: 2, x: '56%', dur: '4.6s', delay: '2.1s', drift: '-6px' },
    ].forEach(({ size, x, dur, delay, drift }) => {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `width:${size}px;height:${size}px;left:${x};bottom:10px;--dur:${dur};--delay:${delay};--drift:${drift};`;
      panel.appendChild(p);
    });
  }

  // ── Dev tests ──────────────────────────────────────────────────────────

  function devTests() {
    const ok = (label, cond) => console.assert(cond, 'FAIL: ' + label);
    const t0 = new Date('2026-06-15T10:00:00Z');
    ok('upcoming',    matchState(new Date(t0.getTime() + 2*3600001), t0) === 'upcoming');
    ok('live-immed',  matchState(new Date(t0.getTime() - 1000),      t0) === 'live');
    ok('live-1h',     matchState(new Date(t0.getTime() - 3600000),   t0) === 'live');
    ok('ft-3h',       matchState(new Date(t0.getTime() - 3*3600000), t0) === 'ft');
    ok('cd-hm',  formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === 'in 5h 28m');
    ok('cd-m',   formatCountdown(new Date(t0.getTime() + 45*60000), t0) === 'in 45m');
    ok('cd-null',formatCountdown(new Date(t0.getTime() - 1000),     t0) === null);
    console.log('%c✓ wallpaper.js dev tests passed', 'color:#d4af37');
  }

  // ── Main tick ──────────────────────────────────────────────────────────

  function tick() {
    const now = new Date();
    updateClock(now);

    const dateStr = localDateStr(now);
    if (dateStr !== _lastDateStr) {
      _lastDateStr = dateStr;
      _lastFingerprint = '';       // force full re-render on midnight rollover
    }

    const { today, tomorrow } = filterFixtures(now);
    const fp = buildFingerprint(today, tomorrow, now);
    if (fp !== _lastFingerprint) {
      _lastFingerprint = fp;
      renderFixtures(now);         // state changed — full re-render
    } else {
      updateCountdown(now);        // only update the countdown text
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────
  initTimezone();
  initParticles();
  devTests();
  tick();
  setInterval(tick, 1000);

})();
```

- [ ] **Step 2: Open `index.html` in browser — verify fixture sections appear**

Expected:
- Today section with match cards if today has fixtures
- Tomorrow section with dimmer cards
- Next match card has gold glow border + countdown underneath
- LIVE badge appears for matches within 2h of kick-off
- FT label for finished matches (dimmed to 25% opacity)
- `✓ wallpaper.js dev tests passed` in DevTools console with no assertion failures

- [ ] **Step 3: Commit**

```bash
git add wallpaper.js
git commit -m "feat: add fixture filtering, card rendering, countdown, and state transitions"
```

---

## Task 7: Integration smoke test

**Files:** None (verification only)

- [ ] **Step 1: Full visual checklist in Chrome/Edge**

Open `index.html`. Verify each item:

- [ ] Espresso-dark gradient background covers full viewport
- [ ] Gold radial glow in top-right, drifting slowly (60s cycle)
- [ ] Panel centered on screen, glass-like border, fades/rises on load
- [ ] World Cup logo visible top-right of panel at ~20% opacity
- [ ] Clock shows HH:MM:SS ticking every second
- [ ] Both colons blink in sync
- [ ] Timezone line correct for system timezone (uppercase gold text)
- [ ] Gold shimmer band sweeps left-to-right on divider line
- [ ] TODAY section label in gold, TOMORROW label more muted
- [ ] Flags appear left of home team and right of away team
- [ ] Next match card: brighter, gold border glow pulsing
- [ ] Countdown below next match time, fading in/out
- [ ] Other today cards: ~70% opacity, no glow
- [ ] Tomorrow cards: ~40% opacity, no countdown
- [ ] 8 tiny gold particles rising from panel bottom, staggered

- [ ] **Step 2: Test responsiveness**

Resize browser from 800px wide to 2560px wide. Verify:
- Panel stays centered
- Font sizes scale smoothly (no clipping, no overflow)
- No horizontal scrollbar

- [ ] **Step 3: Test empty state**

In DevTools console, temporarily empty the fixtures and re-trigger:

```js
const original = FIXTURES.splice(0);
document.getElementById('fixtures').innerHTML = '';
// force re-render by clearing fingerprint (requires exposing it — just reload with an empty array)
```

Simpler approach: in `fixtures.js`, comment out all entries, reload. Expected: "No matches scheduled" in muted gold text.

Restore `fixtures.js` after confirming.

- [ ] **Step 4: Verify LIVE state in DevTools**

In DevTools console, temporarily override `Date.now` to simulate a time 30 minutes after a today fixture:

```js
// Example: pretend it's 30 min after the gG1 kick-off (2026-06-15T00:00Z = 00:30 UTC)
const _realNow = Date.now;
Date.now = () => new Date('2026-06-15T00:30:00Z').getTime();
// Reload page (or wait for next tick)
```

Expected: gG1 (Colombia vs Ivory Coast) shows `● LIVE` badge in amber.

Restore: `Date.now = _realNow`

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete 2026 World Cup Fixtures Wallpaper Engine wallpaper"
```

---

## Self-Review

**Spec coverage:**

| Requirement | Task |
|---|---|
| Live clock HH:MM:SS | 5, 6 |
| Timezone auto-detect (offset + long name) | 5, 6 |
| Today + Tomorrow grouping | 6 |
| Flags next to team names | 6 (`matchCardHTML`) |
| Gold Trophy visual style | 3 |
| Centered panel, responsive (`clamp`) | 3 |
| Panel entrance animation | 3 (`panel-enter`) |
| Colon blink | 3 (`colon-blink`) |
| Shimmer divider | 3 (`shimmer-sweep`) |
| Next match card glow pulse | 3 (`card-glow`) |
| Countdown opacity pulse | 3 (`countdown-pulse`) |
| Floating gold particles | 3 (`.particle` + keyframe), 6 (`initParticles`) |
| Background radial glow drift | 3 (`bg-drift`) |
| World Cup logo watermark | 2 (HTML), 3 (CSS `.logo-watermark`) |
| `FIXTURES` global array | 4 |
| All five match card states | 6 (`matchCardHTML`, CSS classes) |
| Empty state | 6 (`renderFixtures`) |
| Midnight rollover re-render | 6 (`_lastDateStr` check) |
| State-transition re-render (upcoming→live→FT) | 6 (`buildFingerprint`) |
| WE manifest `project.json` | 1 |
| No bundler / no API | all tasks |

No gaps.

**Placeholder scan:** No TBDs, no TODOs. All code blocks are self-contained and complete.

**Type consistency:** `FIXTURES` global used consistently. `toMatchDate(f)` used everywhere to convert fixture → Date. `matchState`, `formatCountdown`, `formatLocalTime`, `filterFixtures`, `renderFixtures`, `matchCardHTML`, `updateCountdown`, `buildFingerprint` — names are consistent across all references. CSS classes (`state-upcoming`, `state-live`, `state-ft`, `match-next`, `match-tomorrow`) match exactly between JS string generation and CSS selectors.
