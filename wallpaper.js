(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const LIVE_WINDOW_MS = 150 * 60 * 1000; // 2.5h covers 90min + extra time + penalties

  let _lastFingerprint = '';
  let _lastDateStr     = '';

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
    if (h > 0) return `in ${h}h ${m}m`;
    if (m > 0) return `in ${m}m`;
    return 'starting soon';
  }

  function formatLocalTime(matchDate) {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ
    }).format(matchDate);
  }

  // ── Timezone display ───────────────────────────────────────────────────

  function initTimezone() {
    const now = new Date();
    const offset = new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value
      .replace('GMT', 'UTC');
    const longName = new Intl.DateTimeFormat('en', { timeZoneName: 'long', timeZone: TZ })
      .formatToParts(now).find(p => p.type === 'timeZoneName').value;
    document.getElementById('timezone').textContent = `${offset} · ${longName}`;
  }

  // ── Clock ──────────────────────────────────────────────────────────────

  function updateClock(now) {
    const parts = new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: TZ
    }).formatToParts(now);
    document.getElementById('clock-h').textContent = parts.find(p => p.type === 'hour').value;
    document.getElementById('clock-m').textContent = parts.find(p => p.type === 'minute').value;
    document.getElementById('clock-s').textContent = parts.find(p => p.type === 'second').value;
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

    if (state === 'live') {
      centerHTML += `<span class="match-badge match-badge--live">LIVE</span>`;
    } else if (state === 'ft') {
      centerHTML += `<span class="match-badge match-badge--ft">FT</span>`;
    } else if (isNext) {
      const cd = formatCountdown(f.matchDate, now);
      if (cd) centerHTML += `<span class="match-countdown">${cd}</span>`;
    }

    return `
      <div class="${classes}">
        <div class="team team--home">
          ${flagImg(f.homeTeam)}
          <span class="team-name">${f.homeTeam}</span>
        </div>
        <div class="match-center">${centerHTML}</div>
        <div class="team team--away">
          <span class="team-name">${f.awayTeam}</span>
          ${flagImg(f.awayTeam)}
        </div>
      </div>`;
  }

  // ── Fixture rendering ──────────────────────────────────────────────────

  function renderFixtures(now) {
    const { today, tomorrow } = filterFixtures(now);
    const el = document.getElementById('fixtures');

    if (!today.length && !tomorrow.length) {
      el.innerHTML = '<div class="no-matches">No matches today or tomorrow</div>';
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
      html += `<div class="section-label">Today</div>${toCards(today, false)}`;
    if (tomorrow.length)
      html += `<div class="section-label section-label--tomorrow">Tomorrow</div>${toCards(tomorrow, true)}`;
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

  // ── Init ───────────────────────────────────────────────────────────────
  initTimezone();
  initParticles();
  devTests();
  tick();
  setInterval(tick, 1000);

})();
