# World Cup 2026 — Live Fixtures & Pixel Stadium

A Wallpaper Engine web wallpaper showing live 2026 FIFA World Cup fixture info over an animated pixel-art stadium.

## Features

- Live clock (HH:MM:SS) with auto-detected local timezone
- Today and tomorrow's fixtures with country flags, kick-off times in your local timezone, and live countdowns
- LIVE / FT badges that update automatically
- Pixel-art stadium background with animated crowd camera flashes and floodlights
- 9 animated football legend sprites walking around the pitch (Dave the Diver style)
- **Language toggle: English / 中文** — switch in the Wallpaper Engine settings panel

## Language Support (English / 中文)

After importing the wallpaper, open its settings panel in Wallpaper Engine and set the **Language** dropdown to **中文**. All UI labels, section headers, stage abbreviations, and team names switch instantly.

### Test it in a browser (without Wallpaper Engine)

1. Open `index.html` in Chrome or Edge
2. Open DevTools → Console
3. Run:
   ```js
   window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'zh' } })
   ```
4. Section labels change to **今日比赛 / 明日比赛**, team names switch to Chinese
5. To revert:
   ```js
   window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'en' } })
   ```

## Importing into Wallpaper Engine

1. Open **Wallpaper Engine**
2. Click **Workshop** in the top menu, then **Create Wallpaper**
3. Select **Web** as the wallpaper type
4. Click **Browse** and navigate to this folder — select `index.html`
5. Wallpaper Engine will load the wallpaper and display it in the preview
6. To access settings (including the Language dropdown), click the **gear icon** on the wallpaper in the preview
7. To publish to the Steam Workshop, click **Publish** and fill in the title and description

> The wallpaper requires an internet connection at load time to fetch country flag images (flagcdn.com) and Google Fonts. It works fully offline after the first load if fonts are cached.

## File Overview

| File | Purpose |
|---|---|
| `index.html` | Entry point loaded by Wallpaper Engine |
| `wallpaper.js` | Clock, timezone, fixture filtering, i18n, DOM rendering |
| `fixtures.js` | All 104 World Cup 2026 fixtures as a static JS array |
| `bg.js` | Pixel-art stadium canvas background and legend sprite animation |
| `style.css` | Gold Trophy theme, responsive layout, keyframe animations |
| `project.json` | Wallpaper Engine manifest — defines the Language setting |
| `world-cup-2026-logo.png` | Logo displayed in the panel header |

## Updating Fixtures

Knockout stage matchups are filled in as results come in. Edit `fixtures.js` and update the `homeTeam` and `awayTeam` fields for each knockout match (placeholder values are `"1A"`, `"2B"`, etc.). No other changes needed.
