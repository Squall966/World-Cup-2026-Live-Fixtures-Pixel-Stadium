# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-06-17_

## Goal

A Wallpaper Engine **web** wallpaper showing live FIFA World Cup 2026 info over a
pixel-art stadium:
- Live clock (HH:MM:SS) + auto-detected timezone
- Today / Tomorrow fixtures with country flags, kickoff times, countdowns, LIVE/FT badges
- Pixel-art stadium background: night sky, crowd + camera flashes, floodlights, a football
  pitch, and 9 animated "football legend" sprites walking around it (Dave-the-Diver style)

**Immediate goal this session: publish to the Steam Workshop** (the code is considered done).
Loads via: Wallpaper Engine → Workshop → Create Wallpaper → Web → browse to this folder.

---

## Current State

**Code works.** This session verified `bg.js` + the panel run cleanly:
- `node --check` passes on `bg.js`, `wallpaper.js`, `fixtures.js`.
- A headless-Chrome CDP probe at 1920×1080 (Chromium = same engine as WE's CEF) ran for 10s:
  **no exceptions, no console errors**, `bg-canvas` built (1904×985), 10 fixture cards
  rendered, clock ticking, JS heap only ~10 MB. So there is **no JS bug at normal resolution**.

**Uncommitted:** `bg.js` (the legend-art pass — see below) and `handoff.md` are modified but
not yet committed. Everything else is committed.

> ⚠️ The other deletions shown in `git status` (`.../Tassal/dev/app-b/...`, `stallion-fieldays`)
> are **unrelated files from other projects** sharing this git repo — leave them alone.

### Legend-art pass (uncommitted, all in `bg.js`)
- Shirt numbers replace name labels: 3×5 pixel-digit font (`DIGITS`), small/centred on chest,
  never mirrored, auto-contrast ink via `lum()`.
- Per-legend face traits: `sideburns` (Pelé), `stubble` (Maradona/Zidane/CR7/Batistuta),
  `teeth` grin (R9/Ronaldinho), `beard` (Messi); hairstyles `r9cut`, `messi`, bald Zidane.
- Pitch inset with crowd on all four sides (`pitchLeft`/`pitchW` globals; `drawCrowd()` takes
  an x-range).

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

## Next step

1. **Record the real fix.** Ask the user what they found/changed that stopped the crash, and note
   it here — right now the root cause is officially unknown (my multi-monitor hypothesis was never
   confirmed). If it was a resolution/memory issue, consider hardening `bg.js` (cap canvas pixel
   size, debounce the `resize→init` rebuild) so it can't recur for other users on big displays.
2. **Pick the Workshop name + description.** Options were proposed this session; recommended name:
   **"World Cup 2026 — Live Fixtures & Pixel Stadium"** with the full feature-list description.
3. **Update `project.json` `title`** to match the chosen name.
4. **Commit** the uncommitted `bg.js` legend-art pass + this handoff (only this project's files).
5. **Publish** to the Steam Workshop from Wallpaper Engine; set tags (sports/football/clock/pixel).

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
