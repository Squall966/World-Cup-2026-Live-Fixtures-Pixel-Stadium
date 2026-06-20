(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const LIVE_WINDOW_MS = 150 * 60 * 1000; // 2.5h covers 90min + extra time + penalties

  let _lastFingerprint = '';
  let _lastDateStr     = '';
  let _lang            = 'en';
  let _timeFormat      = '24h';

  const STRINGS = {
    en: {
      brandLabel:   'FIFA World Cup',
      today:        'Today',
      tomorrow:     'Tomorrow',
      noMatches:    'No matches today or tomorrow',
      live:         'LIVE',
      ft:           'FT',
      startingSoon: 'starting soon',
      countdown:    (h, m) => h > 0 ? `in ${h}h ${m}m` : `in ${m}m`,
    },
    zh: {
      brandLabel:   'FIFA世界杯',
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

  // ── Flag image lookup (ISO 3166-1 alpha-2 codes for flagcdn.com) ────────
  const FLAG_CODES = {
    // Group A
    'Mexico': 'mx', 'South Africa': 'za', 'South Korea': 'kr', 'Czechia': 'cz',
    // Group B
    'Canada': 'ca', 'Bosnia & Herzegovina': 'ba', 'Switzerland': 'ch', 'Qatar': 'qa',
    // Group C
    'Brazil': 'br', 'Morocco': 'ma', 'Haiti': 'ht', 'Scotland': 'gb-sct',
    // Group D
    'USA': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Türkiye': 'tr',
    // Group E
    'Germany': 'de', 'Curaçao': 'cw', 'Ivory Coast': 'ci', 'Ecuador': 'ec',
    // Group F
    'Netherlands': 'nl', 'Japan': 'jp', 'Sweden': 'se', 'Tunisia': 'tn',
    // Group G
    'Belgium': 'be', 'Egypt': 'eg', 'Iran': 'ir', 'New Zealand': 'nz',
    // Group H
    'Spain': 'es', 'Cape Verde': 'cv', 'Saudi Arabia': 'sa', 'Uruguay': 'uy',
    // Group I
    'France': 'fr', 'Senegal': 'sn', 'Iraq': 'iq', 'Norway': 'no',
    // Group J
    'Argentina': 'ar', 'Algeria': 'dz', 'Austria': 'at', 'Jordan': 'jo',
    // Group K
    'Portugal': 'pt', 'DR Congo': 'cd', 'Uzbekistan': 'uz', 'Colombia': 'co',
    // Group L
    'England': 'gb-eng', 'Croatia': 'hr', 'Ghana': 'gh', 'Panama': 'pa',
  };

  function flagImg(teamName) {
    const code = FLAG_CODES[teamName];
    if (!code) return '<span class="flag-placeholder"></span>';
    return `<img class="team-flag" src="https://flagcdn.com/w40/${code}.png" alt="${teamName}" decoding="async">`;
  }

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

  // ── Utilities ──────────────────────────────────────────────────────────

  function localDateStr(date) {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ
    }).format(date);
  }

  function toMatchDate(f) {
    return new Date(`${f.date}T${f.time}:00Z`);
  }

  function matchState(matchDate, now) {
    const diff = matchDate - now;
    if (diff > 0)                return 'upcoming';
    if (diff >= -LIVE_WINDOW_MS) return 'live';
    return 'ft';
  }

  function formatCountdown(matchDate, now) {
    const ms = matchDate - now;
    if (ms <= 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const S = STRINGS[_lang];
    if (h > 0 || m > 0) return S.countdown(h, m);
    return S.startingSoon;
  }

  function formatLocalTime(matchDate) {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit',
      hour12: _timeFormat === '12h', timeZone: TZ
    }).format(matchDate);
  }

  // ── Language ──────────────────────────────────────────────────────────

  function setTimeFormat(fmt) {
    _timeFormat = fmt === '12h' ? '12h' : '24h';
    _lastFingerprint = '';  // force match card re-render
  }

  function setLanguage(code) {
    _lang = code === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = _lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelector('.brand-label').textContent = STRINGS[_lang].brandLabel;
    renderTimezone();
    _lastFingerprint = '';
  }

  // ── Timezone display ───────────────────────────────────────────────────

  function renderTimezone() {
    const now = new Date();
    const locale = _lang === 'zh' ? 'zh-CN' : 'en';
    const offset = new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value
      .replace('GMT', 'UTC');
    const longName = new Intl.DateTimeFormat(locale, { timeZoneName: 'long', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value;
    document.getElementById('timezone').textContent = `${offset} · ${longName}`;
  }

  function initTimezone() {
    renderTimezone();
  }

  // ── Clock ──────────────────────────────────────────────────────────────

  function updateClock(now) {
    const parts = new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: _timeFormat === '12h', timeZone: TZ
    }).formatToParts(now);
    document.getElementById('clock-h').textContent = parts.find(p => p.type === 'hour').value;
    document.getElementById('clock-m').textContent = parts.find(p => p.type === 'minute').value;
    document.getElementById('clock-s').textContent = parts.find(p => p.type === 'second').value;
    document.getElementById('clock-ampm').textContent =
      _timeFormat === '12h' ? (parts.find(p => p.type === 'dayPeriod')?.value ?? '') : '';
  }

  // ── Filtering ──────────────────────────────────────────────────────────

  function filterFixtures(now) {
    const todayStr    = localDateStr(now);
    const tomorrowStr = localDateStr(new Date(now.getTime() + 86400000));
    const today = [], tomorrow = [];
    for (const f of FIXTURES) {
      const matchDate = toMatchDate(f);
      const d = localDateStr(matchDate);
      const enriched = Object.assign({}, f, { matchDate });
      if (d === todayStr)         today.push(enriched);
      else if (d === tomorrowStr) tomorrow.push(enriched);
    }
    today.sort((a, b) => a.matchDate - b.matchDate);
    tomorrow.sort((a, b) => a.matchDate - b.matchDate);
    return { today, tomorrow };
  }

  // ── State fingerprint ──────────────────────────────────────────────────

  function buildFingerprint(today, tomorrow, now) {
    return [...today, ...tomorrow]
      .map(f => `${f.id}:${matchState(f.matchDate, now)}`)
      .join('|');
  }

  function teamName(name) {
    return _lang === 'zh' ? (TEAM_ZH[name] ?? name) : name;
  }

  // ── Match card HTML ────────────────────────────────────────────────────

  function matchCardHTML(f, state, isNext, isTomorrow, now) {
    const localTime = formatLocalTime(f.matchDate);
    const classes = [
      'match-card', `state-${state}`,
      isNext     ? 'match-next'     : '',
      isTomorrow ? 'match-tomorrow' : ''
    ].filter(Boolean).join(' ');

    let centerHTML =
      `<span class="match-stage">${stageShort(f.stage)}</span>` +
      `<span class="match-time">${localTime}</span>`;

    const S = STRINGS[_lang];
    if (state === 'live') {
      centerHTML += `<span class="match-badge match-badge--live">${S.live}</span>`;
    } else if (state === 'ft') {
      centerHTML += `<span class="match-badge match-badge--ft">${S.ft}</span>`;
    } else if (isNext) {
      const cd = formatCountdown(f.matchDate, now);
      if (cd) centerHTML += `<span class="match-countdown">${cd}</span>`;
    }

    return `
      <div class="${classes}">
        <div class="team team--home">
          ${flagImg(f.homeTeam)}
          <span class="team-name">${teamName(f.homeTeam)}</span>
        </div>
        <div class="match-center">${centerHTML}</div>
        <div class="team team--away">
          <span class="team-name">${teamName(f.awayTeam)}</span>
          ${flagImg(f.awayTeam)}
        </div>
      </div>`;
  }

  // ── Fixture rendering ──────────────────────────────────────────────────

  function renderFixtures(now) {
    const { today, tomorrow } = filterFixtures(now);
    const el = document.getElementById('fixtures');

    const S = STRINGS[_lang];
    if (!today.length && !tomorrow.length) {
      el.innerHTML = `<div class="no-matches">${S.noMatches}</div>`;
      return;
    }

    const allUpcoming = [...today, ...tomorrow]
      .filter(f => matchState(f.matchDate, now) === 'upcoming');
    const nextId = allUpcoming[0]?.id ?? null;

    const toCards = (matches, isTomorrow) => matches.map(f =>
      matchCardHTML(f, matchState(f.matchDate, now), f.id === nextId, isTomorrow, now)
    ).join('');

    let html = '';
    if (today.length)
      html += `<div class="section-label">${S.today}</div>${toCards(today, false)}`;
    if (tomorrow.length)
      html += `<div class="section-label section-label--tomorrow">${S.tomorrow}</div>${toCards(tomorrow, true)}`;
    el.innerHTML = html;
  }

  // ── Countdown-only update (avoids full re-render every second) ─────────

  function updateCountdown(now, today, tomorrow) {
    const el = document.querySelector('.match-next .match-countdown');
    if (!el) return;
    const next = [...today, ...tomorrow].find(f => matchState(f.matchDate, now) === 'upcoming');
    if (next) el.textContent = formatCountdown(next.matchDate, now) ?? '';
  }

  // ── Particles ──────────────────────────────────────────────────────────

  function initParticles() {
    const panel = document.querySelector('.panel');
    [
      { size: 3, x: '12%', dur: '5.2s', delay: '0.0s', drift:  '8px'  },
      { size: 2, x: '28%', dur: '6.8s', delay: '1.4s', drift: '-6px'  },
      { size: 2, x: '44%', dur: '5.6s', delay: '2.9s', drift:  '9px'  },
      { size: 3, x: '58%', dur: '4.4s', delay: '0.7s', drift: '-8px'  },
      { size: 2, x: '70%', dur: '7.2s', delay: '3.6s', drift:  '6px'  },
      { size: 3, x: '82%', dur: '5.0s', delay: '2.0s', drift: '-5px'  },
      { size: 2, x: '20%', dur: '6.4s', delay: '4.5s', drift:  '7px'  },
      { size: 2, x: '64%', dur: '4.8s', delay: '1.8s', drift: '-9px'  },
      { size: 3, x: '90%', dur: '5.8s', delay: '3.1s', drift:  '5px'  },
      { size: 2, x: '36%', dur: '7.4s', delay: '0.4s', drift: '-7px'  },
    ].forEach(({ size, x, dur, delay, drift }) => {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `width:${size}px;height:${size}px;left:${x};bottom:8px;--dur:${dur};--delay:${delay};--drift:${drift};`;
      panel.appendChild(p);
    });
  }

  // ── Dev tests ──────────────────────────────────────────────────────────

  function devTests() {
    const ok = (label, cond) => console.assert(cond, 'FAIL: ' + label);
    const t0 = new Date('2026-06-15T10:00:00Z');
    ok('upcoming',    matchState(new Date(t0.getTime() + 2*3600001), t0) === 'upcoming');
    ok('live-immed',  matchState(new Date(t0.getTime() - 1000),      t0) === 'live');
    ok('live-1h',     matchState(new Date(t0.getTime() - 3600000),   t0) === 'live');
    ok('ft-3h',       matchState(new Date(t0.getTime() - 3*3600000), t0) === 'ft');
    ok('cd-hm',  formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === 'in 5h 28m');
    ok('cd-m',   formatCountdown(new Date(t0.getTime() + 45*60000), t0) === 'in 45m');
    ok('cd-null',formatCountdown(new Date(t0.getTime() - 1000),     t0) === null);
    const savedLang = _lang;
    setLanguage('zh');
    ok('zh-strings-brandLabel', STRINGS.zh.brandLabel === 'FIFA世界杯');
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
    ok('en-strings-brandLabel', STRINGS.en.brandLabel === 'FIFA World Cup');
    ok('en-stage-groupA',    stageShort('Group A') === 'GRP A');
    ok('en-stage-r16',       stageShort('Round of 16') === 'R16');
    ok('en-cd-hm',           formatCountdown(new Date(t0.getTime() + 5*3600000 + 28*60000), t0) === 'in 5h 28m');
    ok('en-cd-m',            formatCountdown(new Date(t0.getTime() + 45*60000), t0) === 'in 45m');
    ok('en-teamname-brazil', teamName('Brazil') === 'Brazil');
    setLanguage(savedLang);
    const savedFmt = _timeFormat;
    setTimeFormat('12h');
    ok('12h-format-var',       _timeFormat === '12h');
    ok('12h-formatLocalTime',  typeof formatLocalTime(new Date('2026-06-20T12:00:00Z')) === 'string');
    ok('12h-fingerprint-reset', _lastFingerprint === '');
    setTimeFormat('24h');
    ok('24h-format-restored',  _timeFormat === '24h');
    setTimeFormat('invalid');
    ok('invalid-falls-back-24h', _timeFormat === '24h');
    setTimeFormat(savedFmt);
    console.log('%c✓ wallpaper.js dev tests passed', 'color:#d4af37');
  }

  // ── Main tick ──────────────────────────────────────────────────────────

  function tick() {
    const now = new Date();
    updateClock(now);

    const dateStr = localDateStr(now);
    if (dateStr !== _lastDateStr) {
      _lastDateStr = dateStr;
      _lastFingerprint = '';       // force full re-render on midnight rollover
    }

    const { today, tomorrow } = filterFixtures(now);
    const fp = buildFingerprint(today, tomorrow, now);
    if (fp !== _lastFingerprint) {
      _lastFingerprint = fp;
      renderFixtures(now);         // state changed — full re-render
    } else {
      updateCountdown(now, today, tomorrow);  // only patch the countdown text
    }
  }

  // ── Wallpaper Engine property listener ────────────────────────────────
  window.wallpaperPropertyListener = {
    applyUserProperties(props) {
      if (props.language)   setLanguage(props.language.value);
      if (props.timeformat) setTimeFormat(props.timeformat.value);
    }
  };

  // ── Init ───────────────────────────────────────────────────────────────
  initTimezone();
  initParticles();
  devTests();
  tick();
  setInterval(tick, 1000);

})();
