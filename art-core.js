/* Mosswood — pixel drawing primitives, nature, hearth & cinema */
const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const W = 640, H = 360;

const C = {
  ink: '#2f4337', deep: '#263a30', pine: '#3f5c49', leaf: '#6e9164',
  leaf2: '#8dae78', lime: '#b6c98b', grass: '#789a64', grass2: '#688b58',
  soil: '#6d513c', soil2: '#84644a', wood: '#a1734e', wood2: '#7d593f',
  wood3: '#5d4231', cream: '#f1e6c8', paper: '#fbf4dc', stone: '#8b8d82',
  stone2: '#a8a99c', stone3: '#6c7068', water: '#7fb2b0', water2: '#a6cfc2',
  gold: '#e8c278', flame: '#ffb347', ember: '#e8663c', pink: '#dc9a9a'
};

function r(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function p(x, y, c, s = 2) { r(x, y, s, s, c); }
function disc(cx, cy, rad, c, step = 2) {
  for (let y = -rad; y <= rad; y += step) {
    const span = Math.floor(Math.sqrt(Math.max(0, rad * rad - y * y)));
    r(cx - span, cy + y, span * 2 + 1, step, c);
  }
}
function mixColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const R = Math.round(ar + (br - ar) * t), G = Math.round(ag + (bg - ag) * t), B = Math.round(ab + (bb - ab) * t);
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}
function vgrad(x, y, w, h, stops) {
  const n = stops.length - 1;
  for (let yy = 0; yy < h; yy += 2) {
    const t = (yy / Math.max(1, h - 1)) * n;
    const i = Math.min(n - 1, Math.floor(t));
    r(x, y + yy, w, Math.min(2, h - yy), mixColor(stops[i], stops[i + 1], t - i));
  }
}
function dither(x, y, w, h, a, b, gap = 4) {
  r(x, y, w, h, a);
  for (let yy = 0; yy < h; yy += 2) {
    for (let xx = ((yy / 2) % 2) * 2; xx < w; xx += gap) r(x + xx, y + yy, 2, 2, b);
  }
}
function roundRect(x, y, w, h, rad, c) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h); rad = Math.round(rad);
  r(x + rad, y, w - rad * 2, h, c);
  r(x, y + rad, w, h - rad * 2, c);
  for (let i = 0; i < rad; i++) {
    const dx = rad - Math.floor(Math.sqrt(Math.max(0, rad * rad - (rad - i) * (rad - i))));
    r(x + dx, y + i, w - dx * 2, 1, c);
    r(x + dx, y + h - 1 - i, w - dx * 2, 1, c);
  }
}
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function label(text, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.save();
  ctx.font = weight + ' ' + size + 'px "DM Mono", monospace';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, Math.round(x), Math.round(y));
  ctx.restore();
}
function wrapLabel(text, x, y, maxWidth, size, color, lineHeight) {
  const words = text.split(' ');
  const maxChars = Math.max(6, Math.floor(maxWidth / (size * 0.62)));
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (test.length > maxChars && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  lines.forEach((ln, i) => label(ln, x, y + i * lineHeight, size, color));
  return lines.length;
}
function shadow(x, y, w, c = '#2b3f32', a = 0.24) {
  ctx.globalAlpha = a;
  disc(x, y, w, c, 2);
  ctx.globalAlpha = 1;
}

/* ----------------------------- nature ----------------------------- */
function drawCloud(x, y, s, light = '#f4f0da', shade = '#d8dec9') {
  disc(x, y, 12 * s, shade, 2);
  disc(x - 14 * s, y + 3 * s, 9 * s, shade, 2);
  disc(x + 15 * s, y + 2 * s, 10 * s, shade, 2);
  disc(x - 1 * s, y - 3 * s, 9 * s, light, 2);
  disc(x - 13 * s, y + 1 * s, 6 * s, light, 2);
  disc(x + 12 * s, y, 7 * s, light, 2);
}

function drawSun(x, y, rad, t) {
  ctx.globalAlpha = 0.12;
  disc(x, y, rad * 1.55, '#fff0b0', 2);
  ctx.globalAlpha = 1;
  disc(x, y, rad, '#f5d685', 2);
  disc(x - 3, y - 3, rad * 0.72, '#ffe6a3', 2);
}

function drawMoon(x, y, rad) {
  ctx.globalAlpha = 0.14;
  disc(x, y, rad * 1.6, '#ffe9bb', 2);
  ctx.globalAlpha = 1;
  disc(x, y, rad, '#f4e9c3', 2);
  disc(x - rad * 0.3, y - rad * 0.2, rad * 0.72, '#fff6d8', 2);
  p(x + 4, y - 2, '#ddd2ac', 2);
  p(x - 5, y + 4, '#ddd2ac', 3);
}

function starField(t, seed = 7) {
  const rng = makeRng(seed);
  for (let i = 0; i < 46; i++) {
    const x = Math.floor(rng() * W), y = 8 + Math.floor(rng() * 180);
    const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.3 + i * 1.7));
    ctx.globalAlpha = tw;
    p(x, y, i % 6 === 0 ? '#fff4c8' : '#e9e5c7', i % 5 === 0 ? 2 : 1);
  }
  ctx.globalAlpha = 1;
}

function drawHills(baseY, tone, tone2) {
  disc(70, baseY, 110, tone, 2);
  disc(205, baseY + 5, 92, tone, 2);
  disc(355, baseY - 4, 120, tone2, 2);
  disc(515, baseY + 2, 100, tone, 2);
  disc(620, baseY - 2, 85, tone2, 2);
}

function drawTree(x, y, s = 1, tone = 0, t = 0) {
  const sway = Math.sin(t * 0.8 + x * 0.07) * 1.5 * s;
  const th = 26 * s, tw = Math.max(4, Math.round(6 * s));
  shadow(x, y + 2, 16 * s, '#2e4634', 0.2);
  r(x - tw / 2, y - th, tw, th, tone ? '#6d503a' : C.wood2);
  r(x - tw / 2 + 1, y - th, Math.max(1, tw / 3), th, tone ? '#87664a' : '#b2875c');
  p(x - tw / 2 + 2, y - th * 0.62, '#5c4433', 2);
  p(x + 1, y - th * 0.4, '#5c4433', 2);
  const cx = x + sway, cy = y - th - 14 * s;
  const dark = tone ? '#3e5f4b' : '#476b4d';
  const mid = tone ? '#527659' : '#62875a';
  const hi = tone ? '#6f9367' : '#84a56c';
  disc(cx, cy, 23 * s, dark, 2);
  disc(cx - 17 * s, cy + 5 * s, 15 * s, dark, 2);
  disc(cx + 17 * s, cy + 4 * s, 16 * s, dark, 2);
  disc(cx + 2 * s, cy + 11 * s, 15 * s, dark, 2);
  disc(cx - 2 * s, cy - 1 * s, 18 * s, mid, 2);
  disc(cx - 13 * s, cy + 4 * s, 10 * s, mid, 2);
  disc(cx + 12 * s, cy + 2 * s, 11 * s, mid, 2);
  disc(cx - 6 * s, cy - 8 * s, 10 * s, hi, 2);
  disc(cx + 7 * s, cy - 5 * s, 7 * s, hi, 2);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    p(cx + Math.cos(a) * 17 * s, cy + Math.sin(a) * 12 * s, i % 2 ? hi : mid, 2);
  }
}

function drawPine(x, y, s = 1, t = 0) {
  const sway = Math.sin(t * 0.7 + x) * s;
  shadow(x, y + 2, 12 * s, '#2f4438', 0.18);
  r(x - 2 * s, y - 16 * s, 4 * s, 17 * s, '#6a4c38');
  for (let i = 0; i < 3; i++) {
    const yy = y - (14 + i * 12) * s;
    const ww = (26 - i * 6) * s;
    for (let row = 0; row < 10 * s; row += 2) {
      const w2 = Math.max(2, Math.round(ww * (1 - row / (11 * s))));
      r(x + sway * (i / 3) - w2 / 2, yy + row, w2, 2, i % 2 ? '#3f604b' : '#4c7055');
    }
    p(x - ww * 0.18, yy + 4, '#769869', 3);
  }
  p(x - 1, y - 46 * s, '#5b7d5c', 4);
}

function drawBush(x, y, s = 1, berry = null, t = 0) {
  disc(x, y - 6 * s, 13 * s, '#4f7353', 2);
  disc(x - 10 * s, y - 2 * s, 9 * s, '#4f7353', 2);
  disc(x + 10 * s, y - 2 * s, 9 * s, '#4f7353', 2);
  disc(x - 2, y - 8 * s, 10 * s, '#66885c', 2);
  disc(x - 9 * s, y - 4 * s, 6 * s, '#7c9c6b', 2);
  disc(x + 8 * s, y - 5 * s, 5 * s, '#7c9c6b', 2);
  if (berry) {
    const rng = makeRng(Math.round(x * 13 + y));
    for (let i = 0; i < 7; i++) p(x - 10 * s + rng() * 20 * s, y - 12 * s + rng() * 12 * s, berry, 2);
  }
}

function drawFlower(x, y, s = 1, petal = '#e7c886', eye = '#f2dc9b', t = 0) {
  const sway = Math.round(Math.sin(t * 1.6 + x * 0.1) * s);
  r(x, y - 8 * s, 1, 8 * s, '#5f8055');
  p(x - 2 * s, y - 4 * s, '#6f925f', 2);
  p(x + 1, y - 6 * s, '#6f925f', 2);
  disc(x + sway, y - 9 * s, 2 * s, petal, 1);
  disc(x + sway, y - 12 * s, 2 * s, petal, 1);
  disc(x - 2 * s + sway, y - 10 * s, 2 * s, petal, 1);
  disc(x + 2 * s + sway, y - 10 * s, 2 * s, petal, 1);
  p(x + sway - 1, y - 11 * s, eye, s);
}

function drawGrass(x, y, s = 1, c = '#6c8d5d') {
  p(x, y - 5 * s, c, 1);
  p(x + 2, y - 8 * s, c, 1);
  p(x - 2, y - 6 * s, c, 1);
  p(x + 4, y - 4 * s, c, 1);
}

function drawStone(x, y, s = 1, t = 0) {
  disc(x, y, 6 * s, '#777b70', 1);
  disc(x - 1, y - 1, 4 * s, '#96988b', 1);
  p(x - 2, y - 2, '#b0b1a3', 2);
  p(x + 3, y + 2, '#5f665e', 2);
}

function drawMushroom(x, y, s = 1, red = true) {
  r(x, y - 5 * s, 2 * s, 5 * s, '#e8dcc0');
  disc(x + s, y - 6 * s, 4 * s, red ? '#b9574e' : '#c49b66', 1);
  disc(x + s, y - 7 * s, 3 * s, red ? '#cf6d5d' : '#d7ae75', 1);
  p(x, y - 7 * s, '#f0e5cc', s);
  p(x + 3 * s, y - 6 * s, '#f0e5cc', s);
}

function drawFern(x, y, s = 1) {
  for (let i = -2; i <= 2; i++) {
    const dir = i === 0 ? -1 : Math.sign(i);
    const len = (10 - Math.abs(i) * 2) * s;
    for (let j = 0; j < len; j += 2) {
      r(x + j * dir * 0.8, y - j * 1.1, 2, 2, j % 3 ? '#5d8359' : '#7d9d68');
      if (j > 2) p(x + j * dir * 0.8 + (dir > 0 ? 2 : -2), y - j * 1.1 + 1, '#8eab78', 2);
    }
  }
}

function drawButterfly(x, y, t, color = '#e6c47e') {
  const f = Math.sin(t * 7 + x) > 0 ? 1 : 0;
  p(x - 3, y - (f ? 2 : 1), color, 2);
  p(x - 1, y - 2, color, 2);
  p(x + 1, y - 2, color, 2);
  p(x + 3, y - (f ? 2 : 1), color, 2);
  p(x, y, '#5c6d55', 1);
}

function drawStringLights(x1, y1, x2, y2, count, t, seed = 1) {
  const sag = 18 + (seed % 3) * 4;
  let px = x1, py = y1;
  for (let i = 1; i <= count; i++) {
    const q = i / count;
    const x = x1 + (x2 - x1) * q;
    const y = y1 + (y2 - y1) * q + Math.sin(Math.PI * q) * sag;
    r(px, py, Math.max(1, x - px), 1, '#4b4838');
    px = x; py = y;
    const tw = 0.55 + 0.45 * Math.sin(t * 2.2 + i * 1.4);
    ctx.globalAlpha = 0.18 + tw * 0.2;
    disc(x, y + 5, 5, '#ffe6a3', 2);
    ctx.globalAlpha = 1;
    r(x - 1, y + 1, 2, 3, '#756b4a');
    p(x - 1, y + 4, tw > 0.75 ? '#fff1b8' : '#e9cf8c', 3);
  }
}

/* ------------------------- fire & inflatable screen ------------------------- */
function drawFire(cx, baseY, w, h, t, scaleGlow = 1) {
  ctx.globalAlpha = 0.12 * scaleGlow;
  disc(cx, baseY - h * 0.2, w * 0.9, '#ffb347', 2);
  ctx.globalAlpha = 0.07 * scaleGlow;
  disc(cx, baseY - h * 0.1, w * 1.55, '#ffcf72', 2);
  ctx.globalAlpha = 1;
  r(cx - w * 0.6, baseY - 5, w * 1.2, 5, '#543424');
  r(cx - w * 0.48, baseY - 8, w * 0.96, 4, '#6d432a');
  r(cx - w * 0.3, baseY - 10, w * 0.6, 3, '#8a5932');
  const cols = 7;
  for (let i = 0; i < cols; i++) {
    const q = i / (cols - 1);
    const edge = 1 - Math.abs(q - 0.5) * 1.4;
    const flick = 0.55 + 0.45 * Math.abs(Math.sin(t * 5.2 + i * 2.1));
    const fh = h * (0.45 + 0.55 * flick) * Math.max(0.25, edge);
    const xx = cx - w * 0.43 + q * w * 0.86;
    for (let yy = 0; yy < fh; yy += 2) {
      const taper = Math.max(0.08, 1 - yy / fh);
      const ww = Math.max(2, Math.round(w * 0.16 * taper));
      const col = yy < fh * 0.35 ? '#ffe6a0' : yy < fh * 0.7 ? '#ffbd57' : '#e8663c';
      r(xx - ww / 2, baseY - 6 - yy, ww, 2, col);
    }
  }
  p(cx - 2, baseY - 12, '#ffe9a8', 3);
  for (let i = 0; i < 4; i++) {
    const sy = baseY - 16 - ((t * 20 + i * 13) % 34);
    p(cx + Math.sin(t * 2 + i * 3) * 8, sy, i % 2 ? '#ffcf72' : '#ff9b4a', 1);
  }
}

function drawHearth(x, y, w, h, t, outdoor = false) {
  const stoneA = '#85887d', stoneB = '#9c9e91', stoneC = '#6e7268';
  r(x + 6, y - 12, w - 12, 14, '#5f5a4c');
  r(x + 2, y, w, h, stoneC);
  for (let yy = 4; yy < h; yy += 12) {
    const off = (Math.floor(yy / 12) % 2) * 10;
    for (let xx = -off; xx < w; xx += 22) {
      const bw = 17 + ((xx * 7 + yy * 3) % 5);
      const cc = ((xx + yy) % 3 === 0) ? stoneB : stoneA;
      r(x + 4 + xx, y + yy, bw, 9, cc);
      r(x + 4 + xx, y + yy, bw, 2, '#b3b4a7');
      r(x + 4 + xx, y + yy + 7, bw, 2, '#5d625b');
    }
  }
  r(x - 6, y + 8, w + 12, 8, '#6d5039');
  r(x - 6, y + 8, w + 12, 2, '#a87e58');
  r(x + 2, y + 18, w - 4, 4, '#6d5039');
  const fx = x + w * 0.17, fw = w * 0.66, fy = y + h * 0.4;
  roundRect(fx, fy, fw, h * 0.55, 7, '#342c28');
  roundRect(fx + 4, fy + 4, fw - 8, h * 0.55 - 6, 5, '#1e2425');
  r(fx + 4, fy + 18, fw - 8, 3, '#4a3a30');
  drawFire(x + w * 0.5, y + h - 8, fw * 0.7, h * 0.42, t, outdoor ? 1.25 : 0.9);
  r(x + w * 0.08, y + h + 1, w * 0.84, 4, '#6a6d63');
  r(x + w * 0.08, y + h + 1, w * 0.84, 1, '#a2a496');
  r(x - 2, y + 34, w + 4, 5, '#7c5b40');
  r(x - 2, y + 34, w + 4, 1, '#b78a5d');
  if (outdoor) {
    p(x + 3, y + 13, '#c7c8ba', 2);
    p(x + w - 8, y + 48, '#5d625b', 2);
  }
}

function drawScreen(x, y, w, h, t, film, movieNumber = null) {
  const blush = 0.5 + 0.5 * Math.sin(t * 3.2);
  if (film) {
    ctx.globalAlpha = 0.1 + blush * 0.05;
    disc(x + w / 2, y + h / 2, w * 0.58, '#9ec7c6', 2);
    ctx.globalAlpha = 1;
  }
  r(x + w * 0.22, y + h + 4, 8, 13, '#303a38');
  r(x + w * 0.74, y + h + 4, 8, 13, '#303a38');
  r(x + w * 0.18, y + h + 15, w * 0.64, 4, '#38453f');
  r(x + w * 0.44, y + h + 19, w * 0.12, 8, '#4a574d');
  r(x + w * 0.47, y + h + 24, w * 0.06, 3, '#7e8a72');
  roundRect(x, y, w, h, 10, '#d9d6c4');
  roundRect(x + 1, y + 1, w - 2, 4, 3, '#f7f2df');
  r(x + 7, y + h - 5, w - 14, 3, '#b8b7a8');
  roundRect(x + 7, y + 6, w - 14, h - 12, 6, '#2d4248');
  const ax = x + 12, ay = y + 11, aw = w - 24, ah = h - 22;
  if (film) {
    vgrad(ax, ay, aw, ah, [film.palette[0], film.palette[1]]);
    const sunX = ax + aw * 0.73, sunY = ay + ah * 0.3;
    ctx.globalAlpha = 0.2; disc(sunX, sunY, ah * 0.17, film.palette[2], 2); ctx.globalAlpha = 1;
    disc(sunX, sunY, ah * 0.1, film.palette[2], 2);
    const hz = ay + ah * 0.66;
    disc(ax + aw * 0.22, hz + ah * 0.3, ah * 0.38, mixColor(film.palette[1], '#30493f', 0.5), 2);
    disc(ax + aw * 0.72, hz + ah * 0.31, ah * 0.43, mixColor(film.palette[2], '#30493f', 0.6), 2);
    for (let i = 0; i < 4; i++) {
      const cx = ax + aw * (0.16 + i * 0.23) + Math.sin(t * 0.3 + i) * 4;
      const cy = ay + ah * (0.22 + (i % 2) * 0.12);
      ctx.globalAlpha = 0.7; disc(cx, cy, 5, '#eef0dc', 2); disc(cx - 5, cy + 2, 4, '#eef0dc', 2); disc(cx + 5, cy + 2, 4, '#eef0dc', 2); ctx.globalAlpha = 1;
    }
    for (let i = 0; i < 6; i++) {
      const q = i / 5;
      p(ax + aw * (0.15 + q * 0.7), ay + ah * (0.6 + Math.sin(i) * 0.03), '#f4eccb', 1);
    }
    ctx.globalAlpha = 0.13;
    r(ax, ay, aw, ah, '#0e2228');
    for (let sy = ay + 2; sy < ay + ah; sy += 4) r(ax, sy, aw, 1, '#ffffff');
    ctx.globalAlpha = 1;
    r(ax, ay + ah - 15, aw, 15, '#1b2d31');
    ctx.globalAlpha = 0.82;
    wrapLabel(film.title, ax + aw / 2, ay + ah - 9, aw - 10, Math.max(6, Math.min(9, aw / 27)), '#f7ecc9', 9);
    ctx.globalAlpha = 1;
    label(String(film.year), ax + aw - 10, ay + 10, 6, '#e8ddb9', 'right');
  } else {
    vgrad(ax, ay, aw, ah, ['#29454d', '#1d333c']);
    for (let i = 0; i < 8; i++) {
      const q = (i + Math.sin(t * 0.7 + i) * 0.3) / 8;
      p(ax + aw * (0.12 + q * 0.76), ay + ah * (0.18 + (i % 3) * 0.1), '#9ec1b9', 1);
    }
    disc(ax + aw * 0.5, ay + ah * 0.45, Math.min(aw, ah) * 0.17, '#3d6567', 2);
    disc(ax + aw * 0.5, ay + ah * 0.45, Math.min(aw, ah) * 0.13, '#26484d', 2);
    label('SELECT A DVD', ax + aw / 2, ay + ah * 0.7, Math.max(6, aw / 34), '#e7dfbf');
    label('STUDIO GHIBLI NIGHT', ax + aw / 2, ay + ah * 0.79, Math.max(4, aw / 52), '#a9c0b4');
  }
  for (let i = 0; i < 5; i++) {
    const sx = x + 12 + i * (w - 24) / 4;
    r(sx, y + 2, 1, 4, '#b9b5a4');
    r(sx, y + h - 6, 1, 4, '#a9a798');
  }
  p(x + 5, y + h * 0.5, '#b7b5a6', 4);
  disc(x + w + 1, y + h * 0.52, 3, '#c7c4b3', 1);
  r(x + w - 2, y + h * 0.47, 3, 7, '#8e8d7f');
  r(x + w * 0.49, y + h - 2, w * 0.03, 3, '#77796c');
  if (game.furniture && game.furniture.includes('Ghibli posters') && movieNumber === null) {
    /* posters are scene furniture; nothing extra here */
  }
}

function drawProjector(x, y, t, lensX, lensY) {
  r(x - 18, y + 8, 36, 4, '#4b3b2f');
  r(x - 14, y + 12, 4, 12, '#3b2f27');
  r(x + 10, y + 12, 4, 12, '#3b2f27');
  r(x - 12, y - 2, 24, 12, '#3d4548');
  r(x - 10, y - 1, 20, 3, '#5e696a');
  r(x - 13, y + 1, 3, 6, '#242d30');
  disc(lensX, lensY, 4, '#253033', 1);
  disc(lensX, lensY, 2, '#9fd4c8', 1);
  ctx.globalAlpha = 0.75;
  p(lensX, lensY - 2, '#e8f1d4', 1);
  ctx.globalAlpha = 1;
  p(x + 8, y + 2, '#d8b26d', 2);
  p(x + 8, y + 6, '#6a7c64', 2);
}

function projectorBeam(lensX, lensY, x, y, w, h) {
  ctx.globalAlpha = 0.075 + Math.sin(performance.now() / 240) * 0.012;
  ctx.fillStyle = '#ffeaaa';
  ctx.beginPath();
  ctx.moveTo(lensX, lensY);
  ctx.lineTo(x, y + 8);
  ctx.lineTo(x, y + h - 8);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(lensX, lensY);
  ctx.lineTo(x + w * 0.12, y);
  ctx.lineTo(x + w * 0.12, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawDVDshelf(x, y, w, h, t) {
  r(x, y, w, h, '#6d4d37');
  r(x, y, w, 3, '#a57a53');
  r(x + 2, y + h - 3, w - 4, 3, '#4e372b');
  const rng = makeRng(Math.round(x + y * 7));
  const colors = ['#a85b4e', '#5e7e92', '#c19a5e', '#6f8a63', '#95728f', '#b57154', '#7d9aa0', '#c6a26d'];
  for (let i = 0; i < Math.floor(w / 7); i++) {
    const bw = 4 + Math.floor(rng() * 2);
    const bh = Math.floor(h * (0.55 + rng() * 0.3));
    r(x + 5 + i * 7, y + h - bh - 3, bw, bh, colors[(i + Math.round(x)) % colors.length]);
    p(x + 5 + i * 7, y + h - bh + 1, '#f2e5c4', 1);
  }
  r(x + 3, y + 5, w - 6, 2, '#4f382b');
  p(x + w - 13, y + 9, '#d9c38d', 2);
}

function drawCushion(x, y, w, h, c1, c2) {
  roundRect(x, y, w, h, 5, c1);
  r(x + 4, y + 3, w - 8, 2, c2);
  r(x + 6, y + h - 5, w - 12, 2, mixColor(c1, '#000000', 0.12));
  p(x + 4, y + 6, c2, 2);
  p(x + w - 6, y + 6, c2, 2);
}

function drawRug(cx, cy, w, h, c1, c2, c3) {
  for (let i = 0; i < h; i += 2) {
    const q = Math.abs((i - h / 2) / (h / 2));
    const ww = w * Math.sqrt(Math.max(0.02, 1 - q * q));
    const col = (i % 10 < 2) ? c3 : (i % 16 < 4 ? c2 : c1);
    r(cx - ww / 2, cy - h / 2 + i, ww, 2, col);
  }
}
