# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **Wallpaper Engine web wallpaper** for the 2026 FIFA World Cup. No bundler, no framework, no npm. Wallpaper Engine renders `index.html` directly in its embedded Chromium. The wallpaper also works in any modern browser for development.

Published on Steam Workshop: `workshopid: 3746399994`

## How to Develop and Test

Open `index.html` directly in Chrome or Edge — no server, no build step. Dev tests (`devTests()` in `wallpaper.js`) run on every page load and log `✓ wallpaper.js dev tests passed` to the browser console.

To verify the fixture count:
```bash
node -e "eval(require('fs').readFileSync('fixtures.js','utf8')); console.log(FIXTURES.length)"
# Expected: 104
```

To test properties manually via DevTools console:
```js
// Language
window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'zh' } });
// Time format
window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '12h' } });
```

## Architecture

### File responsibilities

| File | Role |
|---|---|
| `index.html` | DOM skeleton — loads `bg.js` first (before the panel div), then `fixtures.js` + `wallpaper.js` |
| `bg.js` | Pixel art animated stadium — injects a `<canvas>` via `document.body.prepend()` immediately on script load |
| `fixtures.js` | Declares global `FIXTURES` array (104 entries: 72 group + 32 knockout). No logic. |
| `wallpaper.js` | Clock, timezone, filtering, card rendering, particles, language switching |
| `style.css` | Gold Trophy theme, responsive `clamp()` sizing, all GPU-composited keyframe animations |
| `project.json` | Wallpaper Engine manifest — defines user-configurable properties (`language`, `timeformat`). WE manages this file; add new properties inside `general.properties` only. |

### Script loading order matters

`bg.js` runs inline before the panel `<div>` exists — it calls `document.body.prepend(canvas)` so the canvas sits behind the panel. `fixtures.js` must load before `wallpaper.js` because `wallpaper.js` reads the `FIXTURES` global.

### Rendering strategy in `wallpaper.js`

A `setInterval(tick, 1000)` drives everything. Each tick:
1. Updates the clock DOM elements directly (no re-render)
2. Computes `buildFingerprint()` — a string of `id:state` pairs for all today/tomorrow fixtures
3. Only triggers `renderFixtures()` (full innerHTML replacement) when the fingerprint changes (match state transition or midnight rollover). Otherwise only patches the countdown text via `updateCountdown()`.

### Match state logic

- `LIVE_WINDOW_MS = 150 * 60 * 1000` — 2.5 hours covers 90 min + extra time + penalties
- States: `upcoming` → `live` → `ft`
- `localDateStr()` uses `en-CA` locale to always produce `YYYY-MM-DD` regardless of the user's system locale

### Wallpaper Engine properties

Both properties are wired into `window.wallpaperPropertyListener.applyUserProperties`:

- **`language`** (`en`/`zh`) — drives `setLanguage()`. `STRINGS` holds UI strings; `TEAM_ZH` maps English team names to Chinese. Timezone long name is also locale-aware (`zh-CN` locale when Chinese).
- **`timeformat`** (`24h`/`12h`) — drives `setTimeFormat()`, which resets `_lastFingerprint` to force a card re-render. Both `updateClock()` and `formatLocalTime()` respect `_timeFormat`. In 12h mode, the `#clock-ampm` span shows AM/PM.

### Flag rendering

`flagImg(teamName)` in `wallpaper.js` renders flags via `flagcdn.com` using `FLAG_CODES` (ISO 3166-1 alpha-2 codes). The `homeFlag`/`awayFlag` emoji fields in `fixtures.js` are human-readable markers only — they are not used in rendering.

## Updating Fixtures for Knockout Rounds

As match results come in, update only `homeTeam` and `awayTeam` for the relevant knockout entries in `fixtures.js`. Bracket stub values (e.g. `"1A"`, `"W-r32-1"`, `"3rd"`) get replaced with the actual team name.

Also update `homeFlag`/`awayFlag` to the correct country flag emoji (for human readability in the data file).

Add an entry to `FLAG_CODES` in `wallpaper.js` for any new team name not already present — this is what actually controls flag display.

The `stage` field must match one of the values handled by `stageShort()`: `"Group A"–"Group L"`, `"Round of 32"`, `"Round of 16"`, `"Quarter-final"`, `"Semi-final"`, `"Third Place"`, `"Final"`.

## Design Constraints

- All animations use `transform` and `opacity` only (GPU-composited — no layout thrash)
- Panel width: `clamp(340px, 30vw, 480px)` — never touch this without checking both narrow and ultrawide viewports
- `bg.js` sprites draw on `canvas` with pixel-block primitives (block size `P = max(3, floor(min(W,H)/240))`) — sprite coordinates are in block units, not pixels
- Mexico abolished DST in 2023 and is permanently UTC-6 — relevant when verifying kick-off times for Monterrey, Guadalajara, and Mexico City venues
