(function () {
  'use strict';

  // ── Canvas ──────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let W, H, P, pitchTop, pitchH, pitchLeft, pitchW;
  let offscreen = null;
  let STARS = [];
  let players = [];
  let flashes = [];
  let lastTs = 0;

  // Sprite grid (pixel-blocks). Dave-the-Diver chibi proportions:
  // a big rounded head over a small chunky body.
  const SW = 14;   // sprite width  in blocks
  const SH = 26;   // sprite height in blocks (art ≈ 25 rows + label)
  const OL = '#160d04'; // soft dark outline (no pure black)

  // ── Colour helper — lighten (amt>0) / darken (amt<0) a hex colour ────────
  function shade(hex, amt) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
    else { const m = 1 + amt; r *= m; g *= m; b *= m; }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }

  // ── Legend configs ───────────────────────────────────────────────────────
  // hs (hair style): short | curly | long | dreads | mohawk | slick | bald | r9cut
  // face traits: sideburns | stubble | teeth | beard ;  num = shirt number
  // k1=kit, sh=shorts, sk=socks, bt=boots
  const SL = '#d6b07e', SM = '#b9885a', SD = '#8a5a34';

  const LEGENDS = [
    { id: 'pele',       name: 'PELÉ',       num: 10, hair: '#1a0e02', hs: 'short',  skin: SD, k1: '#FECE5A', sh: '#1e8a1e', sk: '#FECE5A', bt: '#161616', sideburns: true },
    { id: 'maradona',   name: 'MARADONA',   num: 10, hair: '#1a0e02', hs: 'curly',  skin: SD, k1: '#74ACDF', sh: '#161616', sk: '#74ACDF', bt: '#161616', stripes: true, stubble: true },
    { id: 'r9',         name: 'RONALDO R9', num: 9,  hair: '#161616', hs: 'r9cut',  skin: SM, k1: '#FECE5A', sh: '#1e8a1e', sk: '#FECE5A', bt: '#eee', teeth: true },
    { id: 'zidane',     name: 'ZIDANE',     num: 10, hair: '#2e2a26', hs: 'bald',   skin: SL, k1: '#0a3bbf', sh: '#fff',    sk: '#0a3bbf', bt: '#161616', stubble: true },
    { id: 'ronaldinho', name: 'RONALDINHO', num: 10, hair: '#1a0e02', hs: 'dreads', skin: SD, k1: '#FECE5A', sh: '#161616', sk: '#FECE5A', bt: '#161616', teeth: true },
    { id: 'messi',      name: 'MESSI',      num: 10, hair: '#4a3318', hs: 'messi',  skin: SM, k1: '#74ACDF', sh: '#222',    sk: '#74ACDF', bt: '#2a2a2a', stripes: true, beard: true },
    { id: 'cr7',        name: 'CRISTIANO',  num: 7,  hair: '#161616', hs: 'slick',  skin: SL, k1: '#CC0000', sh: '#CC0000', sk: '#CC0000', bt: '#eee', stubble: true },
    { id: 'beckham',    name: 'BECKHAM',    num: 7,  hair: '#d9b24a', hs: 'mohawk', skin: SL, k1: '#FFFFFF', sh: '#161616', sk: '#FFFFFF', bt: '#161616' },
    { id: 'batistuta',  name: 'BATISTUTA',  num: 9,  hair: '#4a3216', hs: 'long',   skin: SM, k1: '#74ACDF', sh: '#161616', sk: '#74ACDF', bt: '#161616', stripes: true, stubble: true },
  ];

  // ── 3×5 pixel digit font (for shirt numbers) ─────────────────────────────
  const DIGITS = {
    '0': ['111', '101', '101', '101', '111'],
    '1': ['010', '110', '010', '010', '111'],
    '2': ['111', '001', '111', '100', '111'],
    '3': ['111', '001', '111', '001', '111'],
    '4': ['101', '101', '111', '001', '001'],
    '5': ['111', '100', '111', '001', '111'],
    '6': ['111', '100', '111', '101', '111'],
    '7': ['111', '001', '001', '001', '001'],
    '8': ['111', '101', '111', '101', '111'],
    '9': ['111', '101', '111', '001', '111'],
  };

  // Relative luminance of a hex colour (0–255) — picks dark/light number ink.
  function lum(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
  }

  // ── Sprite drawing ───────────────────────────────────────────────────────
  function drawSprite(ox, oy, frame, cfg, dir) {
    function r(bx, by, bw, bh, c) {
      if (!c) return;
      ctx.fillStyle = c;
      const rx = dir < 0 ? ox + (SW - bx - bw) * P : ox + bx * P;
      ctx.fillRect(rx, oy + by * P, bw * P, bh * P);
    }

    const skn = cfg.skin, sknH = shade(skn, 0.16), sknS = shade(skn, -0.22);
    const kit = cfg.k1,  kitH = shade(kit, 0.14), kitS = shade(kit, -0.22);
    const hairH = shade(cfg.hair, 0.22);

    // ── Ground contact shadow ──
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(ox + 3 * P, oy + 24 * P, (SW - 6) * P, Math.max(2, P));

    // ════ HEAD ════
    // Outline silhouette (rounded), then skin fill inset by 1 block.
    r(4, 0, 6, 1, OL);
    r(3, 1, 8, 1, OL);
    r(2, 2, 10, 5, OL);
    r(3, 7, 8, 1, OL);
    r(4, 8, 6, 1, OL);
    // Skin
    r(4, 1, 6, 1, skn);
    r(3, 2, 8, 5, skn);
    r(4, 7, 6, 1, skn);
    // Face shading — light from upper-left
    r(3, 2, 1, 4, sknH);
    r(9, 3, 1, 4, sknS);
    r(4, 7, 6, 1, sknS);

    // ── Hair ──
    const hc = cfg.hair;
    switch (cfg.hs) {
      case 'long': // Batistuta — flowing to shoulders
        r(3, 0, 8, 1, hc); r(2, 1, 10, 2, hc); r(3, 3, 8, 1, hc);
        r(2, 3, 2, 7, hc); r(10, 3, 2, 7, hc);
        r(3, 0, 6, 1, hairH);
        break;
      case 'dreads': // Ronaldinho — tied back, side locks
        r(4, 0, 6, 1, hc); r(4, 1, 6, 1, hc); r(3, 2, 8, 2, hc);
        r(2, 4, 1, 6, hc); r(11, 4, 1, 6, hc);
        break;
      case 'curly': // Maradona — wide puff
        r(3, 0, 8, 1, hc); r(2, 1, 10, 2, hc); r(3, 3, 8, 1, hc);
        r(2, 3, 2, 2, hc); r(10, 3, 2, 2, hc);
        r(3, 0, 6, 1, hairH);
        break;
      case 'mohawk': // Beckham — central fin, shaved sides
        r(6, 0, 2, 4, hc); r(5, 1, 1, 1, hc); r(8, 1, 1, 1, hc);
        r(6, 0, 2, 1, hairH);
        r(3, 3, 1, 1, shade(hc, -0.3)); r(10, 3, 1, 1, shade(hc, -0.3));
        break;
      case 'slick': // CR7 — neat side-part
        r(4, 1, 6, 1, hc); r(3, 2, 8, 1, hc); r(3, 3, 6, 1, hc);
        r(7, 1, 1, 2, hairH);
        break;
      case 'bald': // Zidane — bald dome, short fringe only around the sides
        r(2, 4, 1, 3, hc); r(11, 4, 1, 3, hc);       // short fringe by the ears
        r(3, 5, 1, 1, hc); r(10, 5, 1, 1, hc);       // wraps toward the back
        r(4, 1, 3, 1, sknH); r(4, 2, 1, 1, sknH);    // shiny bald-dome highlight
        break;
      case 'r9cut': // Ronaldo 2002 — shaved head + central forehead tuft
        r(6, 1, 2, 2, hc); r(7, 0, 1, 1, hc);
        r(6, 1, 1, 1, hairH);
        break;
      case 'messi': // Messi — medium brown, side-parted, sideburns into beard
        r(4, 0, 6, 1, hc); r(3, 1, 8, 2, hc);          // neat top cap
        r(2, 3, 1, 4, hc); r(11, 3, 1, 4, hc);         // sideburns down to the jaw
        r(3, 3, 1, 2, hc); r(10, 3, 1, 2, hc);
        r(4, 1, 4, 1, hairH);                          // highlight
        r(8, 1, 1, 2, shade(hc, -0.18));               // soft side part
        break;
      default: // short — Pelé, R9, Messi
        r(4, 1, 6, 1, hc); r(3, 2, 8, 2, hc);
        r(4, 1, 5, 1, hairH);
    }

    // ── Face features ──
    // Eyebrows
    r(4, 3, 2, 1, hc); r(8, 3, 2, 1, hc);
    // Eyes — white sclera + dark pupil (Dave-the-Diver style)
    r(4, 4, 2, 2, '#f4f4f4'); r(8, 4, 2, 2, '#f4f4f4');
    r(5, 5, 1, 1, '#1a1208'); r(8, 5, 1, 1, '#1a1208');
    // Nose shadow
    r(6, 6, 1, 1, sknS);
    // Mouth — toothy grin (R9 / Ronaldinho) or normal smile
    if (cfg.teeth) {
      r(5, 7, 4, 1, '#f6f6f6');                   // bright teeth
      r(5, 6, 1, 1, sknS); r(8, 6, 1, 1, sknS);   // raised corners
    } else {
      r(5, 7, 4, 1, shade(skn, -0.38));
    }
    // Sideburns (Pelé) — hair strips by the ears
    if (cfg.sideburns) { r(3, 4, 1, 3, hc); r(10, 4, 1, 3, hc); }
    // Stubble — faint jaw shadow (Maradona, Zidane, CR7, Batistuta)
    if (cfg.stubble) {
      const stub = shade(skn, -0.30);
      r(3, 6, 1, 2, stub); r(10, 6, 1, 2, stub);
      r(4, 7, 1, 1, stub); r(9, 7, 1, 1, stub);
    }
    // Beard (Messi) — full beard framing the face, small mouth gap left visible
    if (cfg.beard) {
      const brdH = shade(cfg.hair, 0.14);
      r(3, 5, 1, 3, hc); r(10, 5, 1, 3, hc);   // jaw sides (meet the sideburns)
      r(4, 6, 1, 2, hc); r(9, 6, 1, 2, hc);    // cheeks
      r(4, 7, 2, 1, hc); r(8, 7, 2, 1, hc);    // chin sides (gap 6–7 = mouth)
      r(5, 6, 1, 1, hc); r(8, 6, 1, 1, hc);    // moustache hints
      r(4, 5, 1, 1, brdH); r(9, 5, 1, 1, brdH);
    }

    // ════ TORSO ════
    // Neck
    r(6, 8, 2, 1, sknS);
    // Outline
    r(3, 9, 8, 1, OL);
    r(2, 10, 10, 6, OL);
    r(3, 16, 8, 1, OL);
    // Kit fill + shading
    r(3, 10, 8, 6, kit);
    r(3, 10, 1, 6, kitH);   // left highlight
    r(10, 10, 1, 6, kitS);  // right shadow
    r(4, 15, 6, 1, kitS);
    if (cfg.stripes) {
      r(5, 10, 1, 6, '#f2f2f2'); r(8, 10, 1, 6, '#f2f2f2');
    }

    // ── Shirt number — small crest, centred on the chest, never mirrored ──
    if (cfg.num != null) {
      const digs = String(cfg.num).split('');
      const np   = Math.max(1, Math.round(P * 0.7));   // smaller than body blocks
      const dw = 3, dh = 5, gap = 1;
      const totalW = (digs.length * dw + (digs.length - 1) * gap) * np;
      const totalH = dh * np;
      const cxp = ox + 7 * P;          // torso centre x
      const cyp = oy + 12.5 * P;       // torso centre y
      let x0 = Math.round(cxp - totalW / 2);
      const y0 = Math.round(cyp - totalH / 2);
      ctx.fillStyle = lum(cfg.k1) > 140 ? '#16160f' : '#f4f4f4';
      digs.forEach(d => {
        const pat = DIGITS[d];
        if (pat) {
          for (let ry = 0; ry < dh; ry++)
            for (let cx = 0; cx < dw; cx++)
              if (pat[ry][cx] === '1')
                ctx.fillRect(x0 + cx * np, y0 + ry * np, np, np);
        }
        x0 += (dw + gap) * np;
      });
    }

    // ── Arms ── (back arm darker, front arm lit)
    // Left (back)
    r(0, 10, 3, 6, OL);
    r(0, 10, 2, 2, kitS);
    r(0, 12, 2, 3, sknS);
    // Right (front)
    r(11, 10, 3, 6, OL);
    r(12, 10, 2, 2, kit);
    r(12, 12, 2, 3, skn);

    // ════ SHORTS ════
    const shS = shade(cfg.sh, -0.22);
    r(3, 17, 8, 2, OL);
    r(4, 17, 6, 2, cfg.sh);
    r(9, 17, 1, 2, shS);

    // ════ LEGS — 4-frame walk cycle ════
    const f  = frame % 4;
    const lx = f === 1 ? -1 : f === 3 ? 1 : 0;
    const rx = -lx;
    const sckS = shade(cfg.sk, -0.22);

    // Left leg (back)
    r(3 + lx, 19, 5, 6, OL);
    r(4 + lx, 19, 3, 1, sknS);          // thigh
    r(4 + lx, 20, 3, 3, shade(cfg.sk, -0.10)); // sock
    r(3 + lx, 23, 4, 2, shade(cfg.bt, -0.12)); // boot
    // Right leg (front)
    r(6 + rx, 19, 5, 6, OL);
    r(7 + rx, 19, 3, 1, skn);
    r(7 + rx, 20, 3, 3, cfg.sk);
    r(7 + rx, 20, 1, 3, shade(cfg.sk, 0.18)); // sock highlight
    r(6 + rx, 23, 4, 2, cfg.bt);
  }

  // ── Player movement ──────────────────────────────────────────────────────
  function initPlayers() {
    const pL  = pitchLeft + pitchW * 0.03;
    const pR  = pitchLeft + pitchW * 0.97 - SW * P;
    const pT  = pitchTop + pitchH * 0.10;
    const pBt = pitchTop + pitchH * 0.80 - SH * P;
    const pW  = pR - pL;
    const pH  = pBt - pT;

    players = LEGENDS.map((cfg, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      return {
        cfg,
        x:   pL + (col / 3 + (0.15 + Math.random() * 0.7) / 3) * pW,
        y:   pT + (row / 3 + (0.15 + Math.random() * 0.7) / 3) * pH,
        vx:  (Math.random() - 0.5) * 0.38,
        vy:  (Math.random() - 0.5) * 0.18,
        dir: 1,
      };
    });
  }

  // ── Camera flashes in the crowd ──────────────────────────────────────────
  function updateFlashes(dt) {
    // Spawn — a few sparkles per second, biased across all four stands
    if (Math.random() < 0.18) {
      const pitchBot = pitchTop + pitchH;
      const r = Math.random();
      let x, y;
      if (r < 0.38) {                 // top stand
        x = Math.random() * W;
        y = Math.random() * pitchTop * 0.92;
      } else if (r < 0.76) {          // bottom stand
        x = Math.random() * W;
        y = pitchBot + Math.random() * (H - pitchBot) * 0.92;
      } else if (r < 0.88) {          // left stand
        x = Math.random() * pitchLeft * 0.9;
        y = pitchTop + Math.random() * pitchH;
      } else {                        // right stand
        x = (pitchLeft + pitchW) + Math.random() * pitchLeft * 0.9;
        y = pitchTop + Math.random() * pitchH;
      }
      flashes.push({ x, y, life: 1 });
    }
    for (const fl of flashes) fl.life -= dt / 170; // ~170 ms pop
    flashes = flashes.filter(fl => fl.life > 0);

    const sz = P;
    for (const fl of flashes) {
      const a = fl.life;
      const g = ctx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, sz * 3.2);
      g.addColorStop(0,   `rgba(255,255,245,${0.85 * a})`);
      g.addColorStop(0.4, `rgba(255,255,230,${0.22 * a})`);
      g.addColorStop(1,   'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(fl.x - sz * 3.2, fl.y - sz * 3.2, sz * 6.4, sz * 6.4);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(fl.x - sz / 2, fl.y - sz / 2, sz, sz);
    }
  }

  // ── Static world (offscreen) ─────────────────────────────────────────────
  function buildOffscreen() {
    offscreen = document.createElement('canvas');
    offscreen.width  = W;
    offscreen.height = H;
    const oc = offscreen.getContext('2d');
    oc.imageSmoothingEnabled = false;

    oc.fillStyle = '#06061a';
    oc.fillRect(0, 0, W, H);

    for (const s of STARS) {
      oc.fillStyle = `rgba(255,255,255,${s.b ? 0.55 : 1})`;
      oc.fillRect(s.x, s.y, s.sz, s.sz);
    }

    const pitchBot = pitchTop + pitchH;
    const pitchRight = pitchLeft + pitchW;
    // Crowd wraps the pitch: full-width top & bottom stands + left & right stands.
    drawCrowd(oc, 0, 0, W, pitchTop);
    drawCrowd(oc, 0, pitchBot, W, H);
    drawCrowd(oc, 0, pitchTop, pitchLeft, pitchBot);
    drawCrowd(oc, pitchRight, pitchTop, W, pitchBot);

    if (H > W) {
      // Portrait — horizontal grass bands
      const sh = pitchH / 10;
      for (let i = 0; i < 10; i++) {
        oc.fillStyle = i % 2 === 0 ? '#0a3d0a' : '#0d4d0d';
        oc.fillRect(pitchLeft, pitchTop + i * sh, pitchW, Math.ceil(sh) + 1);
      }
      drawPitchLinesPortrait(oc);
    } else {
      // Landscape — vertical grass stripes
      const sw = pitchW / 10;
      for (let i = 0; i < 10; i++) {
        oc.fillStyle = i % 2 === 0 ? '#0a3d0a' : '#0d4d0d';
        oc.fillRect(pitchLeft + i * sw, pitchTop, Math.ceil(sw) + 1, pitchH);
      }
      drawPitchLines(oc);
    }

    const corners = [
      [pitchLeft,  pitchTop],
      [pitchRight, pitchTop],
      [pitchLeft,  pitchBot],
      [pitchRight, pitchBot],
    ];
    for (const [lx, ly] of corners) {
      const g = oc.createRadialGradient(lx, ly, 0, lx, ly, Math.max(W, H) * 0.42);
      g.addColorStop(0,    'rgba(255,240,160,0.12)');
      g.addColorStop(0.35, 'rgba(255,240,160,0.04)');
      g.addColorStop(1,    'transparent');
      oc.fillStyle = g;
      oc.fillRect(0, 0, W, H);
    }
  }

  function initStars() {
    STARS = [];
    for (let i = 0; i < 80; i++) {
      const inTop = Math.random() < 0.65;
      STARS.push({
        x:  Math.random() * W,
        y:  inTop
              ? Math.random() * pitchTop * 0.85
              : (pitchTop + pitchH) + Math.random() * (H - pitchTop - pitchH) * 0.88,
        sz: Math.random() < 0.22 ? 2 : 1,
        b:  Math.random() > 0.65,
      });
    }
  }

  function drawCrowd(oc, xLeft, yTop, xRight, yBot) {
    if (yBot <= yTop || xRight <= xLeft) return;
    const PAL = ['#1a1a40', '#22224a', '#2a1a44', '#1a2a48', '#30203a', '#0e0e2e'];
    const fh  = Math.max(4, Math.floor(pitchH * 0.042));
    const fw  = Math.max(3, Math.floor(fh * 0.65));
    const rows = Math.floor((yBot - yTop) / (fh + 1));
    const cols = Math.floor((xRight - xLeft) / (fw + 1));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        oc.fillStyle = PAL[(row * 31 + col * 17 + row * col * 7) % PAL.length];
        const fx = xLeft + col * (fw + 1);
        const fy = yTop + row * (fh + 1);
        oc.fillRect(fx + Math.floor(fw * 0.2), fy, Math.floor(fw * 0.6), Math.floor(fh * 0.4));
        oc.fillRect(fx, fy + Math.floor(fh * 0.4), fw, Math.floor(fh * 0.6));
      }
    }
  }

  function drawPitchLines(oc) {
    const lw  = Math.max(2, Math.round(W / 640));
    const m   = Math.floor(pitchW * 0.02);
    const pL  = pitchLeft + m,  pR = pitchLeft + pitchW - m;
    const pT  = pitchTop + Math.floor(pitchH * 0.03);
    const pB  = pitchTop + pitchH - Math.floor(pitchH * 0.03);
    const pW  = pR - pL, pH = pB - pT;
    const cx  = pitchLeft + pitchW / 2,  cy = pitchTop + pitchH / 2;

    oc.fillStyle = 'rgba(255,255,255,0.72)';

    strokeBox(oc, pL, pT, pW, pH, lw);
    oc.fillRect(cx - lw / 2, pT, lw, pH);
    pixelCircle(oc, cx, cy, pH * 0.17, lw);
    oc.fillRect(cx - lw, cy - lw, lw * 2, lw * 2);

    const paW = pW * 0.14, paH = pH * 0.54, paTop = cy - paH / 2;
    strokeBox(oc, pL,       paTop, paW, paH, lw);
    strokeBox(oc, pR - paW, paTop, paW, paH, lw);

    const gaW = pW * 0.05, gaH = pH * 0.22, gaTop = cy - gaH / 2;
    strokeBox(oc, pL,       gaTop, gaW, gaH, lw);
    strokeBox(oc, pR - gaW, gaTop, gaW, gaH, lw);
  }

  function drawPitchLinesPortrait(oc) {
    const lw = Math.max(2, Math.round(H / 640));
    const mx = Math.floor(pitchW * 0.03);
    const my = Math.floor(pitchH * 0.02);
    const pL = pitchLeft + mx,  pR = pitchLeft + pitchW - mx;
    const pT = pitchTop  + my,  pB = pitchTop  + pitchH - my;
    const pW = pR - pL,         pH = pB - pT;
    const cx = pitchLeft + pitchW / 2,  cy = pitchTop + pitchH / 2;

    oc.fillStyle = 'rgba(255,255,255,0.72)';

    strokeBox(oc, pL, pT, pW, pH, lw);          // boundary
    oc.fillRect(pL, cy - lw / 2, pW, lw);       // center line (horizontal)
    pixelCircle(oc, cx, cy, pW * 0.17, lw);     // center circle
    oc.fillRect(cx - lw, cy - lw, lw * 2, lw * 2); // center spot

    // Top & bottom penalty areas
    const paD = pH * 0.14,  paW = pW * 0.54,  paX = cx - paW / 2;
    strokeBox(oc, paX, pT,       paW, paD, lw);
    strokeBox(oc, paX, pB - paD, paW, paD, lw);

    // Top & bottom goal areas
    const gaD = pH * 0.05,  gaW = pW * 0.22,  gaX = cx - gaW / 2;
    strokeBox(oc, gaX, pT,       gaW, gaD, lw);
    strokeBox(oc, gaX, pB - gaD, gaW, gaD, lw);
  }

  function strokeBox(oc, x, y, w, h, lw) {
    oc.fillRect(x,          y,          w,  lw);
    oc.fillRect(x,          y + h - lw, w,  lw);
    oc.fillRect(x,          y,          lw, h);
    oc.fillRect(x + w - lw, y,          lw, h);
  }

  function pixelCircle(oc, cx, cy, r, lw) {
    for (let a = 0; a < 360; a += 2) {
      const rad = a * Math.PI / 180;
      oc.fillRect(
        Math.round(cx + r * Math.cos(rad)) - lw / 2,
        Math.round(cy + r * Math.sin(rad)) - lw / 2,
        lw, lw
      );
    }
  }

  // ── Animation loop ───────────────────────────────────────────────────────
  function tick(ts) {
    const dt = lastTs ? Math.min(64, ts - lastTs) : 16;
    lastTs = ts;
    const frame = Math.floor(ts / 220) % 4;

    const pL  = pitchLeft + pitchW * 0.03;
    const pR  = pitchLeft + pitchW * 0.97 - SW * P;
    const pT  = pitchTop + pitchH * 0.08;
    const pBt = pitchTop + pitchH * 0.78 - (SH + 2) * P;

    for (const pl of players) {
      pl.x += pl.vx;
      pl.y += pl.vy;
      if (pl.x < pL) { pl.x = pL; pl.vx =  Math.abs(pl.vx); pl.dir =  1; }
      if (pl.x > pR) { pl.x = pR; pl.vx = -Math.abs(pl.vx); pl.dir = -1; }
      if (pl.y < pT)  { pl.y = pT;  pl.vy =  Math.abs(pl.vy); }
      if (pl.y > pBt) { pl.y = pBt; pl.vy = -Math.abs(pl.vy); }
    }

    ctx.drawImage(offscreen, 0, 0);
    updateFlashes(dt);
    if (H <= W) {
      [...players]
        .sort((a, b) => a.y - b.y)
        .forEach(pl => drawSprite(Math.round(pl.x), Math.round(pl.y), frame, pl.cfg, pl.dir));
    }

    requestAnimationFrame(tick);
  }

  // ── Init ────────────────────────────────────────────────────────────────
  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    P = Math.max(3, Math.floor(Math.min(W, H) / 240));
    if (H > W) {
      // Portrait — tall narrow pitch running top-to-bottom
      pitchLeft = Math.floor(W * 0.05);
      pitchW    = W - 2 * pitchLeft;
      pitchTop  = Math.floor(H * 0.10);
      pitchH    = H - 2 * pitchTop;
    } else {
      // Landscape — wide pitch, crowd on all four sides
      pitchTop  = Math.floor(H * 0.14);
      pitchH    = Math.floor(H * 0.72);
      pitchLeft = Math.floor(W * 0.085);
      pitchW    = W - 2 * pitchLeft;
    }
    initStars();
    buildOffscreen();
    initPlayers();
  }

  document.fonts.ready.then(() => {
    init();
    requestAnimationFrame(tick);
    window.addEventListener('resize', init);
  });

})();
