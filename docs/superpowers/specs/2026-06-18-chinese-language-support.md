# Chinese Language Support — Design Spec

_Date: 2026-06-18_

## Overview

Add a user-selectable language toggle (English / 中文) to the wallpaper via Wallpaper Engine's native user-properties system. All UI strings, stage abbreviations, and team names switch instantly when the user changes the setting in the WE panel.

---

## Files Changed

| File | Change |
|---|---|
| `project.json` | New file — WE manifest with `language` combo property |
| `index.html` | Add ZCOOL QingKe HuangYou to Google Fonts `<link>` |
| `style.css` | Add `:lang(zh)` rules to apply Chinese font to translated elements |
| `wallpaper.js` | `STRINGS`, `TEAM_ZH`, `_lang`, `setLanguage()`, `wallpaperPropertyListener` |

`bg.js` is not touched — it has no user-visible text.

---

## Data Flow

1. WE reads `project.json` and shows a Language dropdown in the wallpaper settings panel.
2. On wallpaper load (and on every user change), WE calls `window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'en'|'zh' } })`.
3. `setLanguage()` updates `_lang`, sets `document.documentElement.lang` to `'zh-CN'` or `'en'`, and resets `_lastFingerprint` to force a full fixture re-render.
4. Every render function reads `_lang` to pick translated strings — no DOM walking, no data attributes.

---

## `project.json`

```json
{
  "title": "World Cup 2026 — Live Fixtures & Pixel Stadium",
  "type": "web",
  "file": "index.html",
  "preview": "world-cup-2026-logo.png",
  "general": { "supportsaudioprocessing": false },
  "properties": {
    "language": {
      "order": 1,
      "text": "Language",
      "type": "combo",
      "value": "en",
      "options": [
        { "label": "English", "value": "en" },
        { "label": "中文",    "value": "zh" }
      ]
    }
  }
}
```

---

## Translation Data (`wallpaper.js`)

### `STRINGS` object

```js
const STRINGS = {
  en: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    noMatches: 'No matches today or tomorrow',
    live: 'LIVE',
    ft: 'FT',
    startingSoon: 'starting soon',
    countdown: (h, m) => h > 0 ? `in ${h}h ${m}m` : `in ${m}m`,
  },
  zh: {
    today: '今日比赛',
    tomorrow: '明日比赛',
    noMatches: '今明两日没有比赛',
    live: '比赛进行中',
    ft: '终场',
    startingSoon: '即将开始',
    countdown: (h, m) => h > 0 ? `${h}小时${m}分后` : `${m}分钟后`,
  }
};
```

### `stageShort()` — language-aware

English (unchanged behaviour):
- `"Group A"` → `"GRP A"`
- `"Round of 16"` → `"R16"`
- `"Quarter-final"` → `"QF"`
- `"Semi-final"` → `"SF"`
- `"Third Place"` → `"3rd"`

Chinese (format flips):
- `"Group A"` → `"A组"`
- `"Round of 16"` → `"16强"`
- `"Quarter-final"` → `"8强"`
- `"Semi-final"` → `"4强"`
- `"Third Place"` → `"季军赛"`

Knockout bracket placeholders (`"1A"`, `"2B"`, etc.) pass through untranslated in both languages.

### `TEAM_ZH` — 48-entry lookup map

| English | 中文 |
|---|---|
| Mexico | 墨西哥 |
| South Africa | 南非 |
| South Korea | 韩国 |
| Czechia | 捷克 |
| Canada | 加拿大 |
| Bosnia & Herzegovina | 波黑 |
| Switzerland | 瑞士 |
| Qatar | 卡塔尔 |
| Brazil | 巴西 |
| Morocco | 摩洛哥 |
| Haiti | 海地 |
| Scotland | 苏格兰 |
| USA | 美国 |
| Paraguay | 巴拉圭 |
| Australia | 澳大利亚 |
| Türkiye | 土耳其 |
| Germany | 德国 |
| Curaçao | 库拉索 |
| Ivory Coast | 科特迪瓦 |
| Ecuador | 厄瓜多尔 |
| Netherlands | 荷兰 |
| Japan | 日本 |
| Sweden | 瑞典 |
| Tunisia | 突尼斯 |
| Belgium | 比利时 |
| Egypt | 埃及 |
| Iran | 伊朗 |
| New Zealand | 新西兰 |
| Spain | 西班牙 |
| Cape Verde | 佛得角 |
| Saudi Arabia | 沙特阿拉伯 |
| Uruguay | 乌拉圭 |
| France | 法国 |
| Senegal | 塞内加尔 |
| Iraq | 伊拉克 |
| Norway | 挪威 |
| Argentina | 阿根廷 |
| Algeria | 阿尔及利亚 |
| Austria | 奥地利 |
| Jordan | 约旦 |
| Portugal | 葡萄牙 |
| DR Congo | 刚果民主共和国 |
| Uzbekistan | 乌兹别克斯坦 |
| Colombia | 哥伦比亚 |
| England | 英格兰 |
| Croatia | 克罗地亚 |
| Ghana | 加纳 |
| Panama | 巴拿马 |

Team name lookup at render time: `TEAM_ZH[teamName] ?? teamName`. Unknown names (bracket placeholders) fall back to the English value.

---

## WE Integration (`wallpaper.js`)

```js
let _lang = 'en';

function setLanguage(code) {
  _lang = code === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = _lang === 'zh' ? 'zh-CN' : 'en';
  _lastFingerprint = '';  // force full re-render on next tick
}

window.wallpaperPropertyListener = {
  applyUserProperties(props) {
    if (props.language) setLanguage(props.language.value);
  }
};
```

`wallpaperPropertyListener` is assigned via `window.` inside the IIFE so it is globally accessible for WE to call after page load.

---

## Font Handling

**`index.html`** — extend existing Google Fonts `<link>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=ZCOOL+QingKe+HuangYou&display=swap" rel="stylesheet">
```

**`style.css`** — apply Chinese font via `:lang(zh)` selector:
```css
:lang(zh) .team-name,
:lang(zh) .section-label,
:lang(zh) .no-matches,
:lang(zh) .match-badge,
:lang(zh) .match-countdown,
:lang(zh) .match-stage,
:lang(zh) .brand-label {
  font-family: 'ZCOOL QingKe HuangYou', sans-serif;
}
```

Press Start 2P / VT323 remain on all other elements (clock, brand year, etc.). Those fonts have no Chinese glyphs but are not applied to any element that shows Chinese text.

---

## Out of Scope

- Translating the timezone name (auto-detected from the OS, always in English via `Intl`)
- Translating venue names (not displayed in the UI)
- Any language other than English and Chinese
