# Chinese Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an English/Chinese language toggle to the wallpaper, controlled via a Wallpaper Engine user property combo dropdown.

**Architecture:** A `STRINGS` constant and `TEAM_ZH` lookup map inside `wallpaper.js` provide all translated text. A module-level `_lang` variable drives rendering. `window.wallpaperPropertyListener` receives the WE property change and calls `setLanguage()`, which updates `_lang`, sets `document.documentElement.lang`, and resets `_lastFingerprint` to trigger a full re-render on the next tick.

**Tech Stack:** Vanilla JS (ES6 IIFE), HTML5, CSS3, Wallpaper Engine CEF (Chromium-based), Google Fonts (ZCOOL QingKe HuangYou for Chinese glyphs)

## Global Constraints

- No build tools, no npm, no frameworks — plain files loaded directly by WE/browser
- All JS changes are inside the existing IIFE in `wallpaper.js`
- `window.wallpaperPropertyListener` must be assigned via `window.` inside the IIFE to be globally accessible
- Default language is English (`_lang = 'en'`)
- Bracket placeholders (`"1A"`, `"2B"`, etc.) pass through untranslated in both languages — `teamName()` falls back to the input string
- Font: ZCOOL QingKe HuangYou added to both `index.html` `<link>` tag AND `style.css` `@import` (both exist in the current codebase for the same fonts)
- `bg.js` is not touched — it has no user-visible text

---

### Task 1: Create `project.json`

**Files:**
- Create: `project.json`

**Interfaces:**
- Produces: WE manifest with `language` combo property (`"en"` default, `"zh"` option); WE reads this on wallpaper load and calls `window.wallpaperPropertyListener.applyUserProperties` with the saved value

- [ ] **Step 1: Create `project.json`**

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

- [ ] **Step 2: Verify JSON is valid**

Run:
```
node -e "JSON.parse(require('fs').readFileSync('project.json', 'utf8')); console.log('valid')"
```
Expected output: `valid`

- [ ] **Step 3: Commit**

```bash
git add project.json
git commit -m "feat: add project.json with language combo property"
```

---

### Task 2: Add Chinese font to `index.html` and `style.css`

**Files:**
- Modify: `index.html` — Google Fonts `<link>` tag (line 9)
- Modify: `style.css` — `@import` line 1, plus new `:lang(zh)` block at end of file

**Interfaces:**
- Produces: ZCOOL QingKe HuangYou font available in the page; `:lang(zh)` CSS rules apply it to translated elements when `<html lang="zh-CN">` is set

- [ ] **Step 1: Update Google Fonts `<link>` in `index.html`**

Replace line 9:
```html
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```
With:
```html
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=ZCOOL+QingKe+HuangYou&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update `@import` in `style.css`**

Replace line 1:
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
```
With:
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=ZCOOL+QingKe+HuangYou&display=swap');
```

- [ ] **Step 3: Append `:lang(zh)` rules to end of `style.css`**

Add after the closing `}` of the `@media (max-width: 640px)` block:
```css

/* ─── Chinese language font overrides ────────────────────────────────── */
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

- [ ] **Step 4: Verify font loads**

Open `index.html` in a browser. DevTools → Network tab → filter "ZCOOL" → reload.
Expected: a request to `fonts.googleapis.com` containing `ZCOOL+QingKe+HuangYou` returns 200.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: add ZCOOL QingKe HuangYou Chinese font"
```

---

### Task 3: Add i18n infrastructure to `wallpaper.js`

**Files:**
- Modify: `wallpaper.js`

**Interfaces:**
- Produces:
  - `STRINGS` — `{ en: { today, tomorrow, noMatches, live, ft, startingSoon, countdown }, zh: { ... } }`; `countdown` is a function `(h, m) => string`
  - `TEAM_ZH` — `{ [englishName: string]: string }` — 48-entry lookup map
  - `let _lang` — `'en' | 'zh'` — module-level variable, defaults to `'en'`
  - `setLanguage(code: string): void` — updates `_lang` and `document.documentElement.lang`, resets `_lastFingerprint`
  - `window.wallpaperPropertyListener` — WE calls `applyUserProperties({ language: { value: 'en'|'zh' } })` on load and on change

- [ ] **Step 1: Add `_lang`, `STRINGS`, and `TEAM_ZH` after the existing state variables**

In `wallpaper.js`, find:
```js
  let _lastFingerprint = '';
  let _lastDateStr     = '';
```
Replace with:
```js
  let _lastFingerprint = '';
  let _lastDateStr     = '';
  let _lang            = 'en';

  const STRINGS = {
    en: {
      today:        'Today',
      tomorrow:     'Tomorrow',
      noMatches:    'No matches today or tomorrow',
      live:         'LIVE',
      ft:           'FT',
      startingSoon: 'starting soon',
      countdown:    (h, m) => h > 0 ? `in ${h}h ${m}m` : `in ${m}m`,
    },
    zh: {
      today:        '今日比赛',
      tomorrow:     '明日比赛',
      noMatches:    '今明两日没有比赛',
      live:         '比赛进行中',
      ft:           '终场',
      startingSoon: '即将开始',
      countdown:    (h, m) => h > 0 ? `${h}小时${m}分后` : `${m}分钟后`,
    }
  };

  const TEAM_ZH = {
    'Mexico': '墨西哥', 'South Africa': '南非', 'South Korea': '韩国', 'Czechia': '捷克',
    'Canada': '加拿大', 'Bosnia & Herzegovina': '波黑', 'Switzerland': '瑞士', 'Qatar': '卡塔尔',
    'Brazil': '巴西', 'Morocco': '摩洛哥', 'Haiti': '海地', 'Scotland': '苏格兰',
    'USA': '美国', 'Paraguay': '巴拉圭', 'Australia': '澳大利亚', 'Türkiye': '土耳其',
    'Germany': '德国', 'Curaçao': '库拉索', 'Ivory Coast': '科特迪瓦', 'Ecuador': '厄瓜多尔',
    'Netherlands': '荷兰', 'Japan': '日本', 'Sweden': '瑞典', 'Tunisia': '突尼斯',
    'Belgium': '比利时', 'Egypt': '埃及', 'Iran': '伊朗', 'New Zealand': '新西兰',
    'Spain': '西班牙', 'Cape Verde': '佛得角', 'Saudi Arabia': '沙特阿拉伯', 'Uruguay': '乌拉圭',
    'France': '法国', 'Senegal': '塞内加尔', 'Iraq': '伊拉克', 'Norway': '挪威',
    'Argentina': '阿根廷', 'Algeria': '阿尔及利亚', 'Austria': '奥地利', 'Jordan': '约旦',
    'Portugal': '葡萄牙', 'DR Congo': '刚果民主共和国', 'Uzbekistan': '乌兹别克斯坦', 'Colombia': '哥伦比亚',
    'England': '英格兰', 'Croatia': '克罗地亚', 'Ghana': '加纳', 'Panama': '巴拿马',
  };
```

- [ ] **Step 2: Add `setLanguage()` function**

In `wallpaper.js`, find the comment line `// ── Timezone display ───`:

Insert BEFORE that comment:
```js
  // ── Language ──────────────────────────────────────────────────────────

  function setLanguage(code) {
    _lang = code === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = _lang === 'zh' ? 'zh-CN' : 'en';
    _lastFingerprint = '';
  }

```

- [ ] **Step 3: Add `window.wallpaperPropertyListener`**

In `wallpaper.js`, find the `// ── Init ───` comment at the bottom. Insert BEFORE `initTimezone();`:
```js
  // ── Wallpaper Engine property listener ────────────────────────────────
  window.wallpaperPropertyListener = {
    applyUserProperties(props) {
      if (props.language) setLanguage(props.language.value);
    }
  };

```

- [ ] **Step 4: Add infrastructure assertions to `devTests()`**

In `wallpaper.js`, inside `devTests()`, add these lines immediately BEFORE the final `console.log(...)` line:
```js
    const savedLang = _lang;
    setLanguage('zh');
    ok('zh-strings-today',    STRINGS.zh.today === '今日比赛');
    ok('zh-strings-tomorrow', STRINGS.zh.tomorrow === '明日比赛');
    ok('zh-strings-live',     STRINGS.zh.live === '比赛进行中');
    ok('zh-strings-ft',       STRINGS.zh.ft === '终场');
    ok('zh-team-brazil',      TEAM_ZH['Brazil'] === '巴西');
    ok('zh-team-england',     TEAM_ZH['England'] === '英格兰');
    ok('zh-team-usa',         TEAM_ZH['USA'] === '美国');
    ok('zh-lang-var',         _lang === 'zh');
    ok('zh-html-lang',        document.documentElement.lang === 'zh-CN');
    setLanguage('en');
    ok('en-lang-restored',    _lang === 'en');
    ok('en-html-lang',        document.documentElement.lang === 'en');
    setLanguage(savedLang);
```

- [ ] **Step 5: Verify devTests pass**

Open `index.html` in a browser. DevTools → Console.
Expected: `✓ wallpaper.js dev tests passed` with zero `FAIL:` lines.

- [ ] **Step 6: Commit**

```bash
git add wallpaper.js
git commit -m "feat: add STRINGS, TEAM_ZH, setLanguage, wallpaperPropertyListener"
```

---

### Task 4: Wire translations into all render functions

**Files:**
- Modify: `wallpaper.js`

**Interfaces:**
- Consumes:
  - `_lang` — `'en' | 'zh'`
  - `STRINGS[_lang]` — `{ today, tomorrow, noMatches, live, ft, startingSoon, countdown }`
  - `TEAM_ZH` — `{ [englishName: string]: string }`
  - `setLanguage(code: string): void`

- [ ] **Step 1: Make `stageShort()` language-aware**

Replace the entire `stageShort` function:
```js
  function stageShort(stage) {
    return stage
      .replace('Group ', 'GRP ')
      .replace('Round of ', 'R')
      .replace('Quarter-final', 'QF')
      .replace('Semi-final', 'SF')
      .replace('Third Place', '3rd');
  }
```
With:
```js
  function stageShort(stage) {
    if (_lang === 'zh') {
      if (stage.startsWith('Group '))    return stage.replace('Group ', '') + '组';
      if (stage.startsWith('Round of ')) return stage.replace('Round of ', '') + '强';
      if (stage === 'Quarter-final')     return '8强';
      if (stage === 'Semi-final')        return '4强';
      if (stage === 'Third Place')       return '季军赛';
      return stage;
    }
    return stage
      .replace('Group ', 'GRP ')
      .replace('Round of ', 'R')
      .replace('Quarter-final', 'QF')
      .replace('Semi-final', 'SF')
      .replace('Third Place', '3rd');
  }
```

- [ ] **Step 2: Make `formatCountdown()` use `STRINGS`**

Replace the entire `formatCountdown` function:
```js
  function formatCountdown(matchDate, now) {
    const ms = matchDate - now;
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `in ${h}h ${m}m`;
    if (m > 0) return `in ${m}m`;
    return 'starting soon';
  }
```
With:
```js
  function formatCountdown(matchDate, now) {
    const ms = matchDate - now;
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const S = STRINGS[_lang];
    if (h > 0 || m > 0) return S.countdown(h, m);
    return S.startingSoon;
  }
```

- [ ] **Step 3: Add `teamName()` helper before `matchCardHTML()`**

In `wallpaper.js`, find the comment `// ── Match card HTML ──`. Insert BEFORE it:
```js
  function teamName(name) {
    return _lang === 'zh' ? (TEAM_ZH[name] ?? name) : name;
  }

```

- [ ] **Step 4: Wire badge strings in `matchCardHTML()`**

In `matchCardHTML`, find:
```js
    if (state === 'live') {
      centerHTML += `<span class="match-badge match-badge--live">LIVE</span>`;
    } else if (state === 'ft') {
      centerHTML += `<span class="match-badge match-badge--ft">FT</span>`;
    } else if (isNext) {
```
Replace with:
```js
    const S = STRINGS[_lang];
    if (state === 'live') {
      centerHTML += `<span class="match-badge match-badge--live">${S.live}</span>`;
    } else if (state === 'ft') {
      centerHTML += `<span class="match-badge match-badge--ft">${S.ft}</span>`;
    } else if (isNext) {
```

- [ ] **Step 5: Wire team names in `matchCardHTML()`**

In `matchCardHTML`, find:
```js
          <span class="team-name">${f.homeTeam}</span>
```
Replace with:
```js
          <span class="team-name">${teamName(f.homeTeam)}</span>
```

Find:
```js
          <span class="team-name">${f.awayTeam}</span>
```
Replace with:
```js
          <span class="team-name">${teamName(f.awayTeam)}</span>
```

- [ ] **Step 6: Wire section labels and no-matches in `renderFixtures()`**

In `renderFixtures`, find:
```js
    if (!today.length && !tomorrow.length) {
      el.innerHTML = '<div class="no-matches">No matches today or tomorrow</div>';
      return;
    }
```
Replace with:
```js
    const S = STRINGS[_lang];
    if (!today.length && !tomorrow.length) {
      el.innerHTML = `<div class="no-matches">${S.noMatches}</div>`;
      return;
    }
```

Find:
```js
    if (today.length)
      html += `<div class="section-label">Today</div>${toCards(today, false)}`;
    if (tomorrow.length)
      html += `<div class="section-label section-label--tomorrow">Tomorrow</div>${toCards(tomorrow, true)}`;
```
Replace with:
```js
    if (today.length)
      html += `<div class="section-label">${S.today}</div>${toCards(today, false)}`;
    if (tomorrow.length)
      html += `<div class="section-label section-label--tomorrow">${S.tomorrow}</div>${toCards(tomorrow, true)}`;
```

- [ ] **Step 7: Add render function assertions to `devTests()`**

In `wallpaper.js`, inside `devTests()`, add these lines AFTER the assertions added in Task 3 (still before the final `console.log`):
```js
    setLanguage('zh');
    ok('zh-stage-groupA',    stageShort('Group A') === 'A组');
    ok('zh-stage-groupB',    stageShort('Group B') === 'B组');
    ok('zh-stage-r16',       stageShort('Round of 16') === '16强');
    ok('zh-stage-r32',       stageShort('Round of 32') === '32强');
    ok('zh-stage-qf',        stageShort('Quarter-final') === '8强');
    ok('zh-stage-sf',        stageShort('Semi-final') === '4强');
    ok('zh-stage-3rd',       stageShort('Third Place') === '季军赛');
    ok('zh-cd-hm',           formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === '5小时28分后');
    ok('zh-cd-m',            formatCountdown(new Date(t0.getTime() + 45*60000), t0) === '45分钟后');
    ok('zh-cd-soon',         formatCountdown(new Date(t0.getTime() + 30000), t0) === '即将开始');
    ok('zh-cd-null',         formatCountdown(new Date(t0.getTime() - 1000), t0) === null);
    ok('zh-teamname-brazil', teamName('Brazil') === '巴西');
    ok('zh-teamname-stub',   teamName('1A') === '1A');
    setLanguage('en');
    ok('en-stage-groupA',    stageShort('Group A') === 'GRP A');
    ok('en-stage-r16',       stageShort('Round of 16') === 'R16');
    ok('en-cd-hm',           formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === 'in 5h 28m');
    ok('en-cd-m',            formatCountdown(new Date(t0.getTime() + 45*60000), t0) === 'in 45m');
    ok('en-teamname-brazil', teamName('Brazil') === 'Brazil');
    setLanguage(savedLang);
```

- [ ] **Step 8: Verify all devTests pass**

Open `index.html` in a browser. DevTools → Console.
Expected: `✓ wallpaper.js dev tests passed` with zero `FAIL:` lines.

- [ ] **Step 9: Verify language switching end-to-end in browser**

In DevTools console, run:
```js
window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'zh' } })
```
Expected:
- Section labels change to `今日比赛` / `明日比赛`
- Team names change to Chinese (e.g. Brazil → 巴西)
- Stage abbreviations change (e.g. GRP A → A组)
- DevTools Elements panel shows `<html lang="zh-CN">`

Then run:
```js
window.wallpaperPropertyListener.applyUserProperties({ language: { value: 'en' } })
```
Expected: all text reverts to English, `<html lang="en">`.

- [ ] **Step 10: Commit**

```bash
git add wallpaper.js
git commit -m "feat: wire Chinese translations into all render functions"
```
