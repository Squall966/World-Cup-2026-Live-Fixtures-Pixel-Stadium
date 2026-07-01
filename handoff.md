# Handoff — 2026 World Cup Fixtures Wallpaper

_Last updated: 2026-07-02_

## Goal

Keep `fixtures.js` accurate as the 2026 World Cup progresses — replacing bracket stubs with real teams, and ensuring all kick-off times, venues, and bracket pairings are correct so the wallpaper shows the right match at the right time.

---

## Current state (end of session)

The wallpaper is live on Steam Workshop (ID `3746399994`) and functional. All R32 fixtures are now correct — teams, times, venues. R16 first four matchups are confirmed and filled in. QF through Final stubs have correct dates, times, venues, and bracket pairings.

**On the pitch right now (2026-07-02):**
- r32-9 Belgium vs Senegal — was **2–2 at 118'** (extra time) when session ended. Result still TBD. Winner goes to r16-6 (Lumen Field, Seattle, Jul 7 00:00 UTC).
- r32-10 USA vs Bosnia & Herzegovina — kicks off at 00:00 UTC Jul 2 (imminent). Winner goes to r16-6.

### Confirmed R32 results so far

| ID | Match | Result |
|---|---|---|
| r32-1 | South Africa vs Canada | 0–1 Canada |
| r32-2 | Brazil vs Japan | 2–1 Brazil |
| r32-3 | Germany vs Paraguay | 1–1 (Paraguay 4–3 pens) |
| r32-4 | Netherlands vs Morocco | 1–1 (Morocco 3–2 pens) |
| r32-5 | Côte d'Ivoire vs Norway | 1–2 Norway |
| r32-6 | France vs Sweden | 3–0 France |
| r32-7 | Mexico vs Ecuador | 2–0 Mexico |
| r32-8 | England vs DR Congo | 2–1 England |
| r32-9 | Belgium vs Senegal | 2–2 AET (TBD) |
| r32-10 | USA vs Bosnia & Herzegovina | TBD |
| r32-11 | Spain vs Austria | Jul 3 |
| r32-12 | Portugal vs Croatia | Jul 3 |
| r32-13 | Switzerland vs Algeria | Jul 3 |
| r32-14 | Australia vs Egypt | Jul 4 |
| r32-15 | Argentina vs Cabo Verde | Jul 4 |
| r32-16 | Colombia vs Ghana | Jul 4 |

### Confirmed R16 matchups (in fixtures.js)

| ID | Home | Away | UTC | Venue |
|---|---|---|---|---|
| r16-1 | Canada | Morocco | Jul 4 17:00 | NRG Stadium, Houston |
| r16-2 | Paraguay | France | Jul 4 21:00 | Lincoln Financial Field, Philadelphia |
| r16-3 | Brazil | Norway | Jul 5 20:00 | MetLife Stadium, East Rutherford |
| r16-4 | Mexico | England | Jul 6 00:00 | Estadio Azteca, Mexico City |
| r16-5 | W-r32-12 (Por/Cro) | W-r32-11 (Esp/Aut) | Jul 6 19:00 | AT&T Stadium, Dallas |
| r16-6 | W-r32-10 (USA/Bos) | W-r32-9 (Bel/Sen) | Jul 7 00:00 | Lumen Field, Seattle |
| r16-7 | W-r32-14 (Aus/Egy) | W-r32-15 (Arg/Cpv) | Jul 7 16:00 | Mercedes-Benz Stadium, Atlanta |
| r16-8 | W-r32-13 (Swi/Alg) | W-r32-16 (Col/Gha) | Jul 7 20:00 | BC Place, Vancouver |

### QF / SF / Final stubs (dates, times, venues verified against FIFA)

| ID | UTC | Venue |
|---|---|---|
| qf-1 | Jul 9 20:00 | Gillette Stadium, Foxborough |
| qf-2 | Jul 10 19:00 | SoFi Stadium, Inglewood |
| qf-3 | Jul 11 21:00 | Hard Rock Stadium, Miami Gardens |
| qf-4 | Jul 12 01:00 | Arrowhead Stadium, Kansas City |
| sf-1 | Jul 14 19:00 | AT&T Stadium, Dallas |
| sf-2 | Jul 15 19:00 | Mercedes-Benz Stadium, Atlanta |
| 3rd  | Jul 18 21:00 | Hard Rock Stadium, Miami Gardens |
| final | Jul 19 19:00 | MetLife Stadium, East Rutherford |

---

## Files actively edited

- `fixtures.js` — the only file that needs ongoing updates as results come in

---

## What failed this session

### 1. Web search for fixtures (do not use)
Used `WebSearch` to look up R32 bracket — got 5 wrong opponents:
- r32-8: said England vs Senegal (correct: DR Congo)
- r32-9: said Belgium vs South Korea (correct: Senegal)
- r32-12: said Portugal vs Ghana (correct: Croatia)
- r32-13: said Switzerland vs Iran (correct: Algeria)
- r32-16: said Colombia vs Croatia (correct: Ghana)

### 2. WebFetch on FIFA.com
`https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures` — JS-rendered, returns empty content. Can't be scraped.

### 3. WebFetch on DuckDuckGo
Same problem — JS-rendered, no fixture data returned.

---

## Official source

**Always use this URL:**
`https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=NZ&wtw-filter=ALL&sortBy=date`

Since WebFetch can't scrape it, the workflow is:
1. User opens that URL in their browser
2. Opens DevTools console (F12) and runs: `copy(document.body.innerText)`
3. Pastes the clipboard into chat
4. Update `fixtures.js` from the raw text

---

## Next steps

In priority order:

1. **Update Belgium vs Senegal result** (r32-9) — and fill in r16-6 home team once known
2. **Update USA vs Bosnia result** (r32-10) — and fill in r16-6 away team once known
3. **Jul 3 matches** — fill Spain/Austria (r32-11), Portugal/Croatia (r32-12), Switzerland/Algeria (r32-13) → then update r16-5 and r16-8 stubs
4. **Jul 4 matches** — fill Australia/Egypt (r32-14), Argentina/Cabo Verde (r32-15), Colombia/Ghana (r32-16) → then update r16-7 stub
5. **R16 results** — fill qf-1 through qf-4 as R16 finishes (Jul 5–8)
6. **QF results** — fill sf-1, sf-2 (Jul 9–12)
7. **SF results** — fill 3rd and final (Jul 14–15)
8. **After the Final** — consider publishing a post-tournament Steam Workshop update

Each update: paste FIFA page text → I update `fixtures.js` → commit + push.
