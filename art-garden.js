/* Mosswood — garden beds, plant sprites, and the kitchen garden */

function drawFence(x1, y1, x2, y2, t) {
  const posts = 9;
  for (let i = 0; i <= posts; i++) {
    const x = x1 + (x2 - x1) * i / posts;
    const y = y1 + (y2 - y1) * (i / posts);
    r(x - 2, y - 24, 4, 26, '#8a6a4d');
    r(x - 2, y - 24, 1, 26, '#b48c63');
    p(x, y - 26, '#6e513b', 3);
  }
  r(x1, y1 - 16, x2 - x1, 3, '#947052');
  r(x1, y1 - 7, x2 - x1, 3, '#7c5c43');
  for (let i = 0; i < 18; i++) {
    const x = x1 + (x2 - x1) * i / 17;
    p(x, y1 - 19 + (i % 2) * 2, '#5f8060', 2);
  }
}

function drawGreenhouse(x, y, w, h, t) {
  r(x + 4, y + h - 6, w - 8, 8, '#6c7064');
  r(x + 2, y + h - 2, w - 4, 4, '#8f9184');
  r(x, y + 20, w, h - 26, '#a9c7b4');
  vgrad(x + 4, y + 24, w - 8, h - 34, ['#c3d9c1', '#dce4c6']);
  for (let xx = x + 10; xx < x + w - 8; xx += 24) {
    r(xx, y + 24, 2, h - 34, '#7f9a82');
    for (let yy = y + 28; yy < y + h - 12; yy += 18) r(xx, yy, 22, 1, '#93aa90');
  }
  for (let i = 0; i < 5; i++) {
    const px = x + 14 + i * (w - 28) / 4;
    drawPlantSprite(PLANTS[(i + 1) % PLANTS.length], px, y + h - 15, 2, t);
  }
  r(x - 4, y + 18, w + 8, 4, '#6f8a70');
  r(x + 8, y - 10, w - 16, 30, '#88a58b');
  r(x + 18, y - 16, w - 36, 10, '#9bb8a0');
  r(x + 5, y + 16, w - 10, 3, '#f2f4dc');
  for (let i = 0; i < 3; i++) p(x + 18 + i * 30, y + 8, '#e9efd4', 2);
  r(x + w * 0.47, y + 22, 16, h - 30, '#89a58b');
  r(x + w * 0.5, y + 22, 2, h - 30, '#c9d6ba');
}

function drawPlantSprite(def, x, y, stage, t) {
  const sway = Math.round(Math.sin(t * 1.25 + x * 0.09) * (stage + 1));
  const L = def.leaf, L2 = def.leaf2, A = def.accent;
  if (stage === 0) {
    r(x - 1, y - 6, 2, 6, L2);
    p(x - 4, y - 7, L, 3);
    p(x + 2, y - 8, L2, 3);
    p(x - 1, y - 10, L, 2);
    return;
  }
  if (def.kind === 'herb') {
    const h = stage === 1 ? 16 : 25;
    const spread = stage === 1 ? 3 : 5;
    r(x - 1, y - h, 2, h, L2);
    for (let i = 0; i < 3; i++) {
      const yy = y - 5 - i * (h / 4);
      const dir = i % 2 ? 1 : -1;
      r(x + dir * spread - 2, yy, 5, 2, L);
      r(x + dir * (spread + 1) - 2, yy - 2, 3, 2, L2);
    }
    if (def.id === 'lavender') {
      for (let i = 0; i < 3; i++) {
        const xx = x - 5 + i * 5;
        r(xx, y - h - 2, 2, 9, '#7f9d70');
        for (let j = 0; j < 4; j++) p(xx - 1 + (j % 2), y - h - 1 - j * 2, A, 2);
      }
    } else if (def.id === 'rosemary') {
      for (let i = 0; i < 8; i++) p(x - 7 + (i % 3) * 5 + sway, y - 8 - i * 2, i % 2 ? L2 : L, 2);
    } else if (def.id === 'catnip') {
      for (let i = 0; i < 5; i++) p(x - 7 + i * 3 + sway, y - h + (i % 2) * 2, i % 2 ? L : L2, 2);
      p(x - 6, y - h - 2, A, 3); p(x + 4, y - h - 1, A, 3); p(x, y - h - 4, A, 2);
    } else {
      if (stage === 2) {
        p(x - 8 + sway, y - h + 4, A, 2);
        p(x + 7 + sway, y - h + 8, A, 2);
        p(x - 3 + sway, y - h - 3, A, 2);
      }
    }
    return;
  }
  if (def.kind === 'root') {
    const h = stage === 1 ? 15 : 22;
    for (let i = -2; i <= 2; i++) {
      const dir = i === 0 ? 0 : Math.sign(i);
      const len = (14 - Math.abs(i) * 2);
      for (let j = 0; j < len; j += 3) {
        r(x + i * 2 + j * dir * 0.7, y - j * 1.1, 2, 3, j % 2 ? L : L2);
      }
    }
    r(x - 1, y - h, 2, h, L);
    if (stage === 2) {
      disc(x, y - 1, 3, A, 1);
      r(x - 4, y - 4, 8, 4, A);
      p(x - 2, y - 5, mixColor(A, '#ffffff', 0.35), 1);
      p(x + 2, y - 3, mixColor(A, '#000000', 0.2), 1);
    }
    return;
  }
  if (def.kind === 'leafy') {
    if (def.id === 'broccoli') {
      const h = stage === 1 ? 14 : 22;
      r(x - 2, y - h, 4, h, L);
      for (let i = 0; i < 4; i++) p(x - 8 + i * 5, y - h + 2 + (i % 2) * 3, i % 2 ? L : L2, 3);
      if (stage === 2) {
        disc(x, y - h - 4, 9, A, 2);
        disc(x - 5, y - h - 1, 6, L, 2);
        disc(x + 5, y - h - 1, 6, L, 2);
        p(x - 3, y - h - 8, mixColor(A, '#ffffff', 0.2), 2);
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05;
        disc(x + Math.cos(a) * (4 + stage * 3), y - 4 + Math.sin(a) * 2, 4 + stage, i % 2 ? L : L2, 1);
      }
      disc(x, y - 7, 5 + stage * 2, L2, 1);
      if (stage === 2) {
        disc(x - 2, y - 10, 5, A, 1);
        p(x - 5, y - 13, mixColor(A, '#ffffff', 0.25), 2);
      }
    }
    return;
  }
  if (def.kind === 'vine') {
    const y0 = y - 5;
    r(x - 12, y0, 24, 3, L);
    r(x - 18, y0 - 6, 10, 2, L2);
    r(x + 8, y0 - 8, 12, 2, L2);
    for (let i = 0; i < 5; i++) {
      p(x - 15 + i * 8, y0 - 3, i % 2 ? L2 : L, 3);
      p(x - 12 + i * 7, y0 - 8 - (i % 2) * 2, L, 2);
    }
    if (stage === 2) {
      disc(x + 2, y0 - 8, 10, A, 2);
      disc(x - 1, y0 - 11, 7, mixColor(A, '#ffffff', 0.14), 2);
      if (def.id === 'watermelon') {
        for (let i = -1; i <= 1; i++) r(x + 2 + i * 4, y0 - 15, 2, 12, '#3f7046');
      } else if (def.id === 'pumpkin') {
        for (let i = -1; i <= 1; i++) r(x + 2 + i * 5, y0 - 16, 1, 14, mixColor(A, '#000000', 0.18));
        r(x + 7, y0 - 20, 2, 6, '#65733f');
      } else {
        for (let i = 0; i < 4; i++) p(x - 2 + i * 3, y0 - 13, mixColor(A, '#ffffff', 0.22), 1);
      }
    }
    return;
  }
  if (def.kind === 'tall') {
    const h = stage === 1 ? 22 : 38;
    r(x - 1, y - h, 3, h, L);
    for (let i = 0; i < 4; i++) {
      const dir = i % 2 ? 1 : -1;
      r(x + dir * 2, y - 8 - i * 8, dir > 0 ? 10 : -10, 3, i % 2 ? L : L2);
      p(x + dir * 8, y - 10 - i * 8, L2, 3);
    }
    if (stage === 2) {
      if (def.id === 'corn') {
        r(x + 3, y - 25, 4, 11, A);
        for (let i = 0; i < 4; i++) r(x + 3, y - 24 + i * 3, 4, 1, mixColor(A, '#ffffff', 0.3));
        p(x - 4, y - h + 2, '#d9c57b', 3);
      } else {
        for (let i = 0; i < 3; i++) {
          r(x + 5, y - 15 - i * 6, 3, 6, A);
          p(x + 6, y - 14 - i * 6, mixColor(A, '#ffffff', 0.25), 1);
        }
      }
    }
    return;
  }
  /* bush: tomatoes, peppers, berries */
  const h = stage === 1 ? 12 : 21;
  r(x - 1, y - h, 2, h, L);
  disc(x, y - h + 3, stage === 1 ? 7 : 11, L, 2);
  disc(x - 6, y - h + 7, stage === 1 ? 5 : 8, L2, 2);
  disc(x + 6, y - h + 6, stage === 1 ? 5 : 8, L, 2);
  disc(x - 1, y - h - 1, stage === 1 ? 6 : 9, L2, 2);
  for (let i = 0; i < 4; i++) p(x - 9 + i * 6 + sway, y - h + 9 + (i % 2) * 4, i % 2 ? L2 : L, 2);
  if (stage === 2) {
    if (def.id === 'blueberry' || def.id === 'gooseberry') {
      for (let i = 0; i < 8; i++) p(x - 10 + (i % 4) * 6, y - h + 2 + Math.floor(i / 4) * 7, A, 2);
    } else if (def.id === 'raspberry') {
      for (let i = 0; i < 6; i++) p(x - 9 + (i % 3) * 8, y - h + 1 + Math.floor(i / 3) * 8, A, 3);
    } else if (def.id === 'strawberry') {
      for (let i = 0; i < 6; i++) {
        p(x - 10 + (i % 3) * 8, y - 7 - Math.floor(i / 3) * 4, A, 3);
        p(x - 9 + (i % 3) * 8, y - 8 - Math.floor(i / 3) * 4, '#f0d9a0', 1);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        disc(x - 9 + (i % 3) * 9, y - h + 3 + Math.floor(i / 3) * 8, 3, A, 1);
        p(x - 10 + (i % 3) * 9, y - h + 1 + Math.floor(i / 3) * 8, mixColor(A, '#ffffff', 0.3), 1);
      }
    }
  }
}

function drawGardenBed(x, y, w, h, start, t) {
  r(x + 3, y + h, w - 6, 4, '#4f3a2d');
  r(x, y, w, h, '#6c4d37');
  r(x + 3, y + 4, w - 6, h - 8, C.soil);
  r(x + 5, y + 7, w - 10, 3, '#8e6a4c');
  r(x, y, w, 5, '#946b4a');
  r(x, y, w, 2, '#b88a5f');
  r(x, y + h - 4, w, 4, '#513b2e');
  for (let i = 0; i < w; i += 23) {
    r(x + i, y + 2, 9, 2, '#7e5c41');
    p(x + i + 3, y + h - 9, '#88664a', 2);
  }
  const slots = 8;
  for (let j = 0; j < slots; j++) {
    const sx = x + 15 + j * (w - 30) / (slots - 1);
    const sy = y + h - 7;
    const plant = game.plants[start + j];
    if (plant) {
      const def = plantDef(plant);
      const age = game.day - (plant.planted ?? game.day - 1);
      const stage = plantReady(plant) ? 2 : Math.min(1, Math.floor(age / Math.max(1, def.grow) * 2));
      r(sx - 6, sy - 1, 12, 3, '#5d4532');
      drawPlantSprite(def, sx, sy, stage, t);
      if (plantReady(plant)) p(sx + 9, sy - 20, '#f3d98a', 2);
    } else {
      r(sx - 7, sy - 1, 14, 3, '#816148');
      r(sx - 4, sy - 3, 8, 2, '#96724f');
      p(sx, sy - 4, '#9caf7b', 2);
    }
  }
}

function drawGarden(t) {
  vgrad(0, 0, W, 196, ['#9dbfb4', '#bdd2b5', '#d9dfb8', '#ece2c1']);
  drawSun(535, 46, 21, t);
  drawCloud(95, 47, 0.8);
  drawCloud(345, 32, 0.55);
  drawHills(151, '#89a880', '#97b28a');
  r(0, 148, W, 5, '#7d9d73');
  for (let x = -10; x < W; x += 58) drawPine(x, 162 + (x % 3) * 4, 0.7, t);
  r(0, 158, W, 202, C.grass);
  r(0, 172, W, 188, '#7b9e65');
  dither(0, 176, W, 184, '#7b9e65', '#85a76c', 6);
  drawFence(0, 177, W, 171, t);
  /* soft paths and flower border */
  for (let x = 16; x < 620; x += 47) {
    drawFlower(x, 351 + (x % 3) * 2, 0.8, x % 2 ? '#e8cd8b' : '#ddb0ac', '#f0dda8', t);
  }
  drawGreenhouse(490, 104, 132, 132, t);
  drawGardenBed(34, 168, 432, 40, 0, t);
  drawGardenBed(34, 218, 432, 40, 8, t);
  drawGardenBed(34, 268, 432, 40, 16, t);
  /* garden sign */
  r(452, 150, 4, 66, '#79573e');
  r(420, 140, 64, 25, '#e9ddb6');
  r(423, 143, 58, 19, '#f3e9c7');
  label('GROW', 452, 150, 7, '#64745b');
  label('SLOW', 452, 158, 7, '#64745b');
  /* little extras */
  r(486, 292, 36, 20, '#7f654a');
  r(486, 292, 36, 4, '#a17f59');
  r(491, 297, 26, 3, '#a8b67f');
  drawPlantSprite(PLANTS[4], 504, 297, 2, t);
  r(532, 306, 24, 14, '#6f7c6b');
  r(532, 306, 24, 4, '#8f9b86');
  drawPlantSprite(PLANTS[1], 544, 309, 2, t);
  /* watering can */
  r(60, 322, 22, 13, '#7c9380');
  r(63, 319, 16, 4, '#93a891');
  r(81, 322, 9, 3, '#93a891');
  p(68, 316, '#aabda1', 3);
  r(57, 334, 28, 2, '#586b58');
  /* butterflies */
  drawButterfly(210 + Math.sin(t * 0.9) * 34, 156 + Math.cos(t * 1.3) * 8, t, '#e7c47c');
  drawButterfly(380 + Math.sin(t * 0.7 + 2) * 26, 250 + Math.cos(t * 1.1) * 10, t, '#dcb2a0');
  drawButterfly(300 + Math.sin(t * 1.2 + 4) * 60, 322 + Math.cos(t * 0.8) * 8, t, '#e6d59b');
  /* warm foreground grass */
  for (let x = 6; x < W; x += 17) drawGrass(x, 357, 0.8, '#5f8055');
}
