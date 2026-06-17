# 2026 FIFA World Cup Fixtures Wallpaper — Design Spec

## Overview

A Wallpaper Engine wallpaper that displays a live clock, the user's timezone, and upcoming 2026 FIFA World Cup fixtures grouped by Today and Tomorrow. Pure HTML/CSS/JS, no build tools, no API dependency.

**Visual style:** Gold Trophy — deep espresso dark background, warm gold accents, subtle radial glow.
**Layout:** Centered panel, responsive (clamps between 340px and 480px width).
**Animation level:** Cinematic.

---

## File Structure

```
2026-world-cup-fixtures-wallpaper/
├── index.html               # Wallpaper Engine entry point
├── fixtures.js              # All World Cup 2026 fixtures as a JS array
├── wallpaper.js             # Clock, timezone, filtering, DOM rendering logic
├── style.css                # Gold Trophy theme, responsive layout, keyframe animations
├── world-cup-2026-logo.png  # Used as subtle watermark inside the panel
└── project.json             # Wallpaper Engine manifest (type: web)
```

No bundler, no framework, no network requests. Wallpaper Engine's Chromium renders `index.html` directly.

---

## Data Layer — `fixtures.js`

Declares a single global constant `FIXTURES` — an array of match objects. No logic. Loaded via a `<script>` tag before `wallpaper.js` so `FIXTURES` is available as a global.

### Match object shape

```js
{
  id: "gA1",           // unique string ID
  date: "2026-06-11",  // ISO date string, UTC
  time: "23:00",       // UTC kick-off time, HH:MM
  homeTeam: "Mexico",
  homeFlag: "🇲🇽",
  awayTeam: "Ecuador",
  awayFlag: "🇪🇨",
  stage: "Group A",
  venue: "SoFi Stadium, Los Angeles"
}
```

### Knockout stage stubs

Before matchups are determined, `homeTeam`/`awayTeam` hold bracket placeholders (`"1A"`, `"2B"`, etc.) and flags are `"🏳️"`. Update these two fields per match as results come in — no other changes needed.

### Filtering logic (in `wallpaper.js`)

Each fixture's `date + time` (UTC) is converted to a `Date`, then its local date is compared to today and tomorrow in the user's local timezone. Today matches go into the **Today** section; tomorrow matches into **Tomorrow**. Both sections sorted ascending by kick-off time.

---

## Timezone Detection

Auto-detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` — no user configuration required.

- **Timezone name** (e.g. "Indochina Time"): resolved by formatting a date with `{ timeZoneName: 'long' }` and extracting the named part.
- **UTC offset** (e.g. "UTC+7"): resolved by formatting a date with `{ timeZoneName: 'shortOffset' }` and extracting the offset string.

Both are displayed together as `UTC+7 · Indochina Time`.

---

## UI Layout

The panel is centered on the full viewport using CSS `display: grid; place-items: center`. Panel width: `clamp(340px, 30vw, 480px)`. Height is content-driven.

### Panel structure (top to bottom)

```
┌──────────────────────────────────┐
│  [world-cup-2026-logo.png]       │  watermark, top-right, 20% opacity
│                                  │
│          14:32:47                │  HH:MM:SS, ultra-thin font weight
│     UTC+7 · Indochina Time       │  full timezone name
│                                  │
│  ────── gold shimmer divider ─── │
│                                  │
│  TODAY                           │  section label
│  ┌────────────────────────────┐  │
│  │ 🇧🇷 Brazil  20:00  Argentina 🇦🇷│  next match — glowing border + countdown
│  │          in 5h 28m         │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🇫🇷 France  23:00  England 🏴󠁧󠁢󠁥󠁮󠁧󠁿│  subsequent today matches, dimmer
│  └────────────────────────────┘  │
│                                  │
│  TOMORROW                        │  section label, more muted
│  ┌────────────────────────────┐  │
│  │ 🇩🇪 Germany 05:00  Spain 🇪🇸  │  tomorrow matches, most muted
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Match card states

| State | Condition | Visual |
|---|---|---|
| Next match | Soonest upcoming today | Full opacity, gold border glow pulse, live countdown |
| Other today | Remaining today matches | Medium opacity (~70%), no glow |
| Tomorrow | All tomorrow matches | Low opacity (~40%), no countdown |
| LIVE | Kicked off, <2h elapsed | Amber `● LIVE` badge, countdown replaced |
| FT | >2h after kick-off | Muted `FT` label, fully dimmed (~25%) |

### Empty state

When no matches fall on today or tomorrow: panel shows "No matches scheduled" in muted gold text in place of both sections.

---

## Cinematic Animations

All animations use `transform` and `opacity` only — GPU-composited, 60fps in Wallpaper Engine.

| Element | Animation | Spec |
|---|---|---|
| Clock colon | Blink | `step-end` 1s, opacity 1↔0 |
| Seconds | Instant tick | JS `textContent` update — no CSS transition |
| Gold shimmer divider | Sweep | Highlight band translates across every ~3s |
| Next match card | Border glow pulse | `box-shadow` breathes in/out, 2.5s ease-in-out loop |
| Countdown text | Opacity pulse | 1→0.6→1, 2s loop |
| Floating gold particles | Rise & fade | 6–8 particles, `translateY` + opacity, staggered `animation-delay` |
| Background radial glow | Slow drift | Position shifts very slowly, 60s cycle |
| Panel entrance | Fade + rise | Fades in + rises 16px on load, 800ms ease-out, one-time |

---

## Wallpaper Engine Manifest — `project.json`

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

---

## Match Card Update Cadence

`wallpaper.js` runs a `setInterval` at 1000ms. Each tick:
1. Updates the clock display (HH:MM:SS)
2. Recalculates countdown for the next match
3. Re-checks match states (upcoming → LIVE → FT transitions happen automatically)

Full DOM re-render of the fixture list happens only when the displayed date changes (midnight rollover) or on initial load — not every second, to avoid unnecessary repaints.

---

## Out of Scope

- User-configurable timezone (auto-detect is sufficient)
- Live scores or results
- Fetching data from any external API
- Favourite team filtering
- Sound or audio processing
