# World Cup 2026 — Live Fixtures & Pixel Stadium

A Wallpaper Engine web wallpaper showing live 2026 FIFA World Cup fixture info over an animated pixel-art stadium.

## Features

- Live clock (HH:MM:SS) with auto-detected local timezone
- Today and tomorrow's fixtures with country flags, kick-off times in your local timezone, and live countdowns
- LIVE / FT badges that update automatically
- Pixel-art stadium background with animated crowd camera flashes and floodlights
- 9 animated football legend sprites walking around the pitch (Dave the Diver style)
- **Language toggle: English / 中文** — switch in the Wallpaper Engine settings panel
- **Time format toggle: 24-hour / 12-hour** — switch in the Wallpaper Engine settings panel

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

## Time Format (24-hour / 12-hour)

Open the settings panel in Wallpaper Engine and set the **Time Format** dropdown to **12-hour**. The main clock and all match kick-off times switch to 12-hour format with AM/PM. Default is 24-hour.

### Test it in a browser (without Wallpaper Engine)

1. Open `index.html` in Chrome or Edge
2. Open DevTools → Console
3. Run:
   ```js
   window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '12h' } })
   ```
4. Clock and kick-off times switch to 12-hour format (e.g. `07:00 AM`)
5. To revert:
   ```js
   window.wallpaperPropertyListener.applyUserProperties({ timeformat: { value: '24h' } })
   ```

## Importing into Wallpaper Engine

This wallpaper is already published on the Steam Workshop (ID `3746399994`). You can subscribe directly, or load it locally:

1. Open **Wallpaper Engine**
2. Click **Workshop** in the top menu, then **Create Wallpaper**
3. Select **Web** as the wallpaper type
4. Click **Browse** and navigate to this folder — select `index.html`
5. Wallpaper Engine will load the wallpaper and display it in the preview
6. To access settings (including the Language dropdown), click the **gear icon** on the wallpaper in the preview

### About `project.json`

Wallpaper Engine generates and manages `project.json` itself when you create or publish a wallpaper. The copy committed in this repo is the WE-generated file (including `workshopid`, `workshopurl`, etc.) with the `language` and `timeformat` properties added inside `general.properties`. It serves as a reference backup — **do not replace WE's copy with a custom one**, as this can cause WE to crash.

To add these properties to WE's own `project.json`, insert the following blocks inside `general` → `properties` alongside `schemecolor`:

```json
"language" :
{
    "order" : 1,
    "text" : "Language",
    "type" : "combo",
    "value" : "en",
    "options" :
    [
        { "label" : "English", "value" : "en" },
        { "label" : "中文",    "value" : "zh" }
    ]
},
"timeformat" :
{
    "order" : 2,
    "text" : "Time Format",
    "type" : "combo",
    "value" : "24h",
    "options" :
    [
        { "label" : "24-hour", "value" : "24h" },
        { "label" : "12-hour", "value" : "12h" }
    ]
}
```

Official WE property docs: https://docs.wallpaperengine.io/en/web/customization/properties.html

> The wallpaper requires an internet connection at load time to fetch country flag images (flagcdn.com) and Google Fonts. It works fully offline after the first load if fonts are cached.

## File Overview

| File | Purpose |
|---|---|
| `index.html` | Entry point loaded by Wallpaper Engine |
| `wallpaper.js` | Clock, timezone, fixture filtering, i18n, DOM rendering |
| `fixtures.js` | All 104 World Cup 2026 fixtures as a static JS array |
| `bg.js` | Pixel-art stadium canvas background and legend sprite animation |
| `style.css` | Gold Trophy theme, responsive layout, keyframe animations |
| `project.json` | WE-generated manifest (backup copy) — includes the Language combo property |
| `world-cup-2026-logo.png` | Logo displayed in the panel header |

## Updating Fixtures

Knockout stage matchups are filled in as results come in. Edit `fixtures.js` and update the `homeTeam` and `awayTeam` fields for each knockout match (placeholder values are `"1A"`, `"2B"`, etc.). No other changes needed.
