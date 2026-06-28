# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-06-28_

## Current state: `update/knock-out-32` — ready for PR

All Round of 32 fixtures have been confirmed and committed. The branch is pushed and awaiting merge.

---

## What was shipped (this session)

### 1. Round of 32 fixtures — confirmed bracket
- All 16 R32 entries in `fixtures.js` replaced from placeholder stubs (`1A`, `2C`, `3rd` etc.) to real teams, correct UTC kick-off times, and correct venues.
- Times verified across **Fox Sports**, **NBC Sports**, **Sky Sports**, and **CBS Sports**. FIFA.com was attempted but returned no content.
- One previously ambiguous match (USA vs Bosnia & Herzegovina, r32-10) confirmed at `2026-07-02 00:00 UTC` (8 PM ET July 1) — consistent across Fox and NBC.
- R32 now runs **June 28 – July 4 (01:30 UTC)**; r32-16 (Colombia vs Croatia) is the last match at Arrowhead, Kansas City.

| r32 # | Home | Away | UTC | Venue |
|---|---|---|---|---|
| r32-1 | South Africa | Canada | Jun 28 19:00 | SoFi Stadium, Inglewood |
| r32-2 | Brazil | Japan | Jun 29 17:00 | NRG Stadium, Houston |
| r32-3 | Germany | Paraguay | Jun 29 20:30 | Gillette Stadium, Foxborough |
| r32-4 | Netherlands | Morocco | Jun 30 01:00 | Estadio BBVA, Monterrey |
| r32-5 | Ivory Coast | Norway | Jun 30 17:00 | AT&T Stadium, Arlington |
| r32-6 | France | Sweden | Jun 30 21:00 | MetLife Stadium, East Rutherford |
| r32-7 | Mexico | Ecuador | Jul 1 01:00 | Estadio Azteca, Mexico City |
| r32-8 | England | Senegal | Jul 1 16:00 | Mercedes-Benz Stadium, Atlanta |
| r32-9 | Belgium | South Korea | Jul 1 20:00 | Lumen Field, Seattle |
| r32-10 | USA | Bosnia & Herzegovina | Jul 2 00:00 | Levi's Stadium, Santa Clara |
| r32-11 | Spain | Austria | Jul 2 19:00 | SoFi Stadium, Inglewood |
| r32-12 | Portugal | Ghana | Jul 2 23:00 | BMO Field, Toronto |
| r32-13 | Switzerland | Iran | Jul 3 03:00 | BC Place, Vancouver |
| r32-14 | Australia | Egypt | Jul 3 18:00 | AT&T Stadium, Arlington |
| r32-15 | Argentina | Cape Verde | Jul 3 22:00 | Hard Rock Stadium, Miami Gardens |
| r32-16 | Colombia | Croatia | Jul 4 01:30 | Arrowhead Stadium, Kansas City |

### 2. CLAUDE.md expanded
- Added `timeformat` Wallpaper Engine property documentation (was missing despite being shipped last session).
- Added WE-manages-`project.json` constraint.
- Clarified `homeFlag`/`awayFlag` emoji in `fixtures.js` are human-readable only — `FLAG_CODES`/`flagImg()` controls actual rendering.
- Added `stageShort()` known-values constraint.
- Added Mexico UTC-6/no-DST note for fixture time verification.

---

## How to test

Open `index.html` in Chrome. Today's match (r32-1, South Africa vs Canada) should show at the top of the panel with a live countdown or LIVE badge depending on current time. Check the console for `✓ wallpaper.js dev tests passed`.

---

## What's next

- **R32 results** — as matches complete, no fixture edits needed; the wallpaper auto-transitions to FT state.
- **Round of 16 bracket fills** — R16 stubs (`W-r32-1` etc.) need updating once all R32 results are in (July 4–5). Follow the same process: update `homeTeam`, `awayTeam`, `homeFlag`, `awayFlag` and add any new team names to `FLAG_CODES` in `wallpaper.js`.
- **R16 dates/venues** — the R16 stubs (July 4–7) have placeholder venues from before the schedule was announced. Verify and correct them the same way R32 was done this session.
- **Steam Workshop update** — re-publish via Wallpaper Engine editor after merging (Workshop ID `3746399994`).

---

## Project background

A **Wallpaper Engine web wallpaper** for the 2026 FIFA World Cup.

**Published on Steam Workshop** — ID `3746399994`, URL `steam://url/CommunityFilePage/3746399994`.

The wallpaper shows:
- Live clock (HH:MM:SS + AM/PM in 12h mode) + auto-detected timezone
- Today / Tomorrow fixtures with country flags, kickoff times, live "in 2h 14m" countdowns, and LIVE / FT badges
- Pixel-art stadium background with 9 animated football legends
- **English / 中文 language toggle** + **12h / 24h time format toggle** via Wallpaper Engine settings panel

### Architecture reference

See `CLAUDE.md` for full architecture docs. Key notes:
- `bg.js` loads before the panel div — injects canvas via `document.body.prepend(canvas)`
- `fixtures.js` must load before `wallpaper.js` (FIXTURES global)
- `setInterval(tick, 1000)` drives everything; fingerprint diff avoids full re-render every second
- `project.json` — WE generates/manages this file; add new properties inside `general.properties`
- Mexico is permanently UTC-6 (abolished DST in 2023) — important for Monterrey/Guadalajara/Mexico City venue times
