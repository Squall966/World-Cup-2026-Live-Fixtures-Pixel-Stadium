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

To test language switching manually, open DevTools console and call `window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'zh' } })`.

## Architecture

### File responsibilities

| File | Role |
|---|---|
| `index.html` | DOM skeleton — loads `bg.js` first (before the panel div), then `fixtures.js` + `wallpaper.js` |
| `bg.js` | Pixel art animated stadium — injects a `<canvas>` via `document.body.prepend()` immediately on script load |
| `fixtures.js` | Declares global `FIXTURES` array (104 entries: 72 group + 32 knockout). No logic. |
| `wallpaper.js` | Clock, timezone, filtering, card rendering, particles, language switching |
| `style.css` | Gold Trophy theme, responsive `clamp()` sizing, all GPU-composited keyframe animations |
| `project.json` | Wallpaper Engine manifest — defines the `language` combo property (en/zh) |

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

### Language support

`STRINGS` object in `wallpaper.js` holds `en` and `zh` UI strings. `TEAM_ZH` maps English team names to Chinese. The Wallpaper Engine `language` combo property drives `setLanguage()` via `window.wallpaperPropertyListener.applyUserProperties`. Timezone long name is also locale-aware (uses `zh-CN` locale when language is Chinese).

## Updating Fixtures for Knockout Rounds

As match results come in, update only `homeTeam`, `awayTeam`, `homeFlag`, and `awayFlag` for the relevant knockout entries in `fixtures.js`. The rendering logic handles all other display. Bracket stub entries (e.g. `"1A"`, `"W-r32-1"`) have `homeFlag`/`awayFlag` set to `"🏳️"`.

`FLAG_CODES` in `wallpaper.js` maps team names to ISO 3166-1 alpha-2 codes for flag images. Add an entry there for any new team name introduced.

## Design Constraints

- All animations use `transform` and `opacity` only (GPU-composited — no layout thrash)
- Panel width: `clamp(340px, 30vw, 480px)` — never touch this without checking both narrow and ultrawide viewports
- `bg.js` sprites draw on `canvas` with pixel-block primitives (block size `P = max(3, floor(min(W,H)/240))`) — sprite coordinates are in block units, not pixels
