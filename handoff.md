# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-06-20_

## Current branch: `feat/24hr-12hr-time-format`

**Feature complete — ready to PR/merge.**

### What was implemented

A **12 hr / 24 hr time format toggle** exposed as a Wallpaper Engine combo property.

| File | Change |
|---|---|
| `project.json` | Added `timeformat` combo property (order 2) inside `general.properties` — values `24h` (default) / `12h` |
| `wallpaper.js` | Added `_timeFormat = '24h'` state var; `setTimeFormat(fmt)` function (resets fingerprint to force re-render); updated `formatLocalTime()` and `updateClock()` to use `hour12: _timeFormat === '12h'`; wired into `wallpaperPropertyListener`; added 5 devTest assertions covering 12h toggle, fallback, and fingerprint reset |

### How to test

Open `index.html` in Chrome. In DevTools console:
```js
// Switch to 12-hour
window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '12h' } });
// Switch back
window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '24h' } });
```

Clock and match kick-off times both switch. Invalid values fall back to 24h. Combining with `language` works correctly.

### Dev tests

All pass on page load: `✓ wallpaper.js dev tests passed` in console. New tests: `12h-format-var`, `12h-formatLocalTime`, `12h-fingerprint-reset`, `24h-format-restored`, `invalid-falls-back-24h`.

### Note on AM/PM locale

`formatLocalTime()` uses `'en'` locale — so in 12h mode, AM/PM is always English regardless of language setting. This is intentional.

---

## Project background

A **Wallpaper Engine web wallpaper** for the 2026 FIFA World Cup.

**Published on Steam Workshop** — ID `3746399994`, URL `steam://url/CommunityFilePage/3746399994`.

The wallpaper shows:
- Live clock (HH:MM:SS) + auto-detected timezone
- Today / Tomorrow fixtures with country flags, kickoff times, countdowns, LIVE/FT badges
- Pixel-art stadium background with 9 animated football legends
- **English / 中文 language toggle** + now **12h / 24h time format toggle** via Wallpaper Engine settings

### Architecture reference

See `CLAUDE.md` for full architecture docs. Key notes:
- `bg.js` loads before the panel div, injects canvas via `document.body.prepend(canvas)`
- `fixtures.js` must load before `wallpaper.js` (FIXTURES global)
- `setInterval(tick, 1000)` drives everything; fingerprint diff avoids full re-render every second
- `project.json` — WE generates/manages this file. Add new properties inside `general.properties`

### Updating fixtures for knockout rounds

As results come in, update `homeTeam`, `awayTeam`, `homeFlag`, `awayFlag` in `fixtures.js` for knockout entries. Add new team names to `FLAG_CODES` in `wallpaper.js`.
