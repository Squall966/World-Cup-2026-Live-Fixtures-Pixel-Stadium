# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-06-20_

## Current state: `main` is clean and up to date

All work from the last two sessions is merged. There is no active feature branch. The wallpaper is in a shippable state.

---

## What was shipped (merged to main 2026-06-20)

### 1. 12h / 24h time format toggle
- `project.json` — `timeformat` combo property (order 2), default `24h`
- `wallpaper.js` — `_timeFormat` state var; `setTimeFormat(fmt)` resets fingerprint to force re-render; `updateClock()` and `formatLocalTime()` both use `hour12: _timeFormat === '12h'`; wired into `wallpaperPropertyListener`; 5 devTest assertions added

### 2. AM/PM on the main clock in 12h mode
- `index.html` — `<span id="clock-ampm"></span>` added inline after `#clock-s`
- `wallpaper.js` — `updateClock()` extracts `dayPeriod` from `formatToParts()` and writes it to `#clock-ampm`; cleared in 24h mode
- `style.css` — `#clock-ampm` styled at `font-size: 0.4em`, `vertical-align: top`, `margin-left: 0.2em`, slightly dimmer gold (`rgba(255,215,0,0.75)`)

### 3. Panel always vertically centered
- `style.css` — `.panel` switched from `position: relative` to `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)`
- `@keyframes panel-enter` — both `from` and `to` keyframes now include `translate(-50%, -50%)` alongside their scale values, so the entry animation doesn't wipe out the centering transform
- Effect: panel re-centers automatically (pure CSS) whenever match cards are added or removed

### 4. Fixed 5 group stage kickoff times (UTC)
| ID | Match | Old | Fix |
|---|---|---|---|
| gC4 | Brazil vs Haiti | `01:00` | `00:30` (8:30pm EDT) |
| gD1 | USA vs Paraguay | `2026-06-12 22:00` | `2026-06-13 01:00` (6pm PDT) |
| gD2 | Australia vs Türkiye | `2026-06-13 04:00` | `2026-06-14 04:00` (9pm PDT) |
| gD4 | Türkiye vs Paraguay | `04:00` | `03:00` (8pm PDT) |
| gF2 | Sweden vs Tunisia | `00:00` | `02:00` (8pm CST Monterrey) |

### 5. README updated
- Added Time Format section with WE instructions + browser console test steps
- Updated `project.json` reference section to include both `language` and `timeformat` blocks

---

## How to test

**Time format toggle (browser):**
```js
window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '12h' } });
// clock shows HH:MM:SS AM/PM; kick-off times also switch
window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '24h' } });
// AM/PM disappears, all times back to 24h
```

**Language toggle:**
```js
window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'zh' } });
window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'en' } });
```

**Dev tests:** `✓ wallpaper.js dev tests passed` in console on every page load.

---

## What's next (nothing urgent — ideas only)

- **Knockout bracket fills** — as round-of-32 results come in, update `homeTeam`, `awayTeam`, `homeFlag`, `awayFlag` in `fixtures.js` for knockout entries. Add any new team names to `FLAG_CODES` in `wallpaper.js`.
- **Steam Workshop update** — after any fixture/feature change, re-publish via Wallpaper Engine editor (Workshop ID `3746399994`).
- **No planned features** — the wallpaper is feature-complete for the group stage.

---

## Project background

A **Wallpaper Engine web wallpaper** for the 2026 FIFA World Cup.

**Published on Steam Workshop** — ID `3746399994`, URL `steam://url/CommunityFilePage/3746399994`.

The wallpaper shows:
- Live clock (HH:MM:SS + AM/PM in 12h mode) + auto-detected timezone
- Today / Tomorrow fixtures with country flags, kickoff times, countdowns, LIVE/FT badges
- Pixel-art stadium background with 9 animated football legends
- **English / 中文 language toggle** + **12h / 24h time format toggle** via Wallpaper Engine settings panel

### Architecture reference

See `CLAUDE.md` for full architecture docs. Key notes:
- `bg.js` loads before the panel div — injects canvas via `document.body.prepend(canvas)`
- `fixtures.js` must load before `wallpaper.js` (FIXTURES global)
- `setInterval(tick, 1000)` drives everything; fingerprint diff avoids full re-render every second
- `project.json` — WE generates/manages this file; add new properties inside `general.properties`
- Mexico is permanently UTC-6 (abolished DST in 2023) — important for Monterrey/Guadalajara/Mexico City venue times
