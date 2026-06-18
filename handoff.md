# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-06-19_

## Goal

A Wallpaper Engine **web** wallpaper showing live FIFA World Cup 2026 info over a
pixel-art stadium:
- Live clock (HH:MM:SS) + auto-detected timezone
- Today / Tomorrow fixtures with country flags, kickoff times, countdowns, LIVE/FT badges
- Pixel-art stadium background: night sky, crowd + camera flashes, floodlights, a football
  pitch, and 9 animated "football legend" sprites walking around it (Dave-the-Diver style)
- **English / 中文 language toggle** via Wallpaper Engine settings panel

**Published on Steam Workshop** — ID `3746399994`, URL `steam://url/CommunityFilePage/3746399994`.

---

## Current State

**Published and working.** The wallpaper is live on the Steam Workshop.

Branch `feat/chinese-support` contains all Chinese language support work and is ready to merge to `main` via PR.

**Chinese language support (feat/chinese-support):**
- `wallpaper.js` — `STRINGS`, `TEAM_ZH` (48 teams), `setLanguage()`, `wallpaperPropertyListener`, language-aware `stageShort()` / `formatCountdown()` / `teamName()`
- `style.css` — ZCOOL QingKe HuangYou Google Font + `:lang(zh)` CSS rules
- `index.html` — Google Fonts link updated with the Chinese font family
- `project.json` — WE-generated file (backup copy) with `language` combo property added inside `general.properties`

**`project.json` — important notes:**
- WE generates and manages `project.json` itself. Do NOT create a custom one; it causes WE to crash.
- The copy in this repo is the WE-generated file (includes `workshopid` `3746399994`) with the `language` property manually added inside `general.properties`.
- To add language support to WE's own copy, insert the `language` combo block inside `general` → `properties` alongside `schemecolor`. See README for the exact JSON snippet.
- WE combo property docs: https://docs.wallpaperengine.io/en/web/customization/properties.html

---

## Files actively editing

| File | Status | Notes |
|---|---|---|
| `bg.js` | **Active, uncommitted** | Self-contained IIFE. Injects `<canvas id="bg-canvas">` (z-index 0), pre-renders the static world to an offscreen canvas, animates 9 sprites + crowd flashes via `requestAnimationFrame`. Most-edited file. |
| `project.json` | Needs 1 edit | WE manifest. `title` is currently `"2026 FIFA World Cup Fixtures"`. **Update it to match the chosen Workshop name** before publishing. |
| `handoff.md` | This file | — |
| `index.html` / `wallpaper.js` / `fixtures.js` / `style.css` | Done, committed | Panel, clock, fixtures (104 entries), pixel CSS theme. Unchanged this session. |

---

## What we tried / what failed

**The reported problem: the wallpaper was crashing in Wallpaper Engine.**

Things ruled out (by the user, before this session):
- ❌ Updated NVIDIA driver — did **not** fix the crash.
- ❌ Reinstalled Wallpaper Engine — did **not** fix the crash.
  → These eliminate "stale GPU driver" and "broken WE install" as causes.

Things ruled out (by me, this session, via systematic debugging):
- ❌ JS syntax error — `node --check` clean on all three JS files.
- ❌ JS runtime exception at 1080p — headless CDP probe ran 10s totally clean (see Current State).
- This pointed the root cause at something **environment/resolution-specific** that survives a
  driver reinstall. **Leading unconfirmed suspect:** very high-res or multi-monitor *spanned*
  setups. `init()` (bg.js:484–494) sizes **two** full `window.innerWidth × innerHeight` canvases
  (main + offscreen) and rebuilds the offscreen on **every** `resize` event (listener bg.js:499) —
  on a giant spanned surface this can exhaust canvas/GPU memory → CEF process crash.

**Important gap:** I was about to ask the user 3 discriminating questions (crash timing /
monitor-resolution / what "crash" looks like) when **the user said they found the problem
themselves**. We did **not** capture what the actual cause or fix was. The crash appears resolved
from the user's side, and the session pivoted to publishing.

---

## Next steps

1. **Test the language toggle in WE.** Add the `language` combo property to WE's own `project.json` (see above / README), reload the wallpaper in WE, and confirm the Language dropdown appears and switching to 中文 works.
2. **Merge `feat/chinese-support` → `main`** via the open PR once the language toggle is confirmed working in WE.
3. **Publish update to Steam Workshop** — open the wallpaper in WE and click Publish to push the Chinese support update to subscribers.

---

## Architecture reference (for whoever picks this up)

- **`P`** = pixel-block size, `Math.max(3, floor(min(W,H)/240))`.
- **Offscreen canvas** pre-renders the static world once per `init()`: sky `#06061a`, stars,
  pixel crowd (top/bottom/left/right stands), 10 grass stripes, white pitch lines, 4 corner
  floodlight glows. `tick()` blits it each frame, then draws dynamic layers.
- **`LEGENDS[]`** — 9 sprite configs (`hair`, `hs`, `skin`, `k1` kit, `sh` shorts, `sk` socks,
  `bt` boots, optional traits). `drawSprite()` = 14w×26h block grid, 4-frame walk, `r()` mirrors
  X when `dir < 0`. `shade(hex, amt)` lightens/darkens.
- **`updateFlashes()`** — random crowd camera-flash sparkles (~170 ms life). Bounded array.
- Sprites Y-sorted each frame (painter's algorithm). Whole init gated on `document.fonts.ready`.
- Panel logic (`wallpaper.js`) is independent and untouched: clock, timezone, fixture filtering,
  fingerprint-based re-render, particles. External resources: Google Fonts + flagcdn.com flags.
