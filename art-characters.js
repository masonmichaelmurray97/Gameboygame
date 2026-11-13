/* Mosswood — characters and scene composition */

function drawPlayer(player, t) {
  const x = Math.round(player.x), y = Math.round(player.y);
  const moving = !!player.walking;
  const bob = moving ? Math.round(Math.sin(t * 15) * 1) : 0;
  const step = moving ? Math.round(Math.sin(t * 15) * 2) : 0;
  const face = player.face === -1 ? -1 : 1;
  ctx.globalAlpha = 0.22;
  disc(x, y + 1, 9, '#26382e', 2);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(face, 1);
  /* boots & legs */
  r(-7, -7, 5, 7, '#5f4b3b');
  r(2, -7, 5, 7, '#5f4b3b');
  if (moving) {
    r(-7 + step, -7, 5, 7, '#5f4b3b');
    r(2 - step, -7, 5, 7, '#5f4b3b');
  }
  r(-8, -2, 6, 3, '#3f332a');
  r(2, -2, 6, 3, '#3f332a');
  /* jacket */
  r(-7, -20, 14, 13, '#5f7f63');
  r(-7, -20, 3, 13, '#75956f');
  r(4, -20, 3, 13, '#4f6c56');
  r(-7, -9, 14, 3, '#46604d');
  /* backpack */
  r(-10, -19, 4, 10, '#8a6547');
  r(-10, -19, 2, 10, '#a57e5a');
  r(-9, -11, 3, 2, '#5f4a36');
  /* arms */
  r(-9, -18, 3, 9, '#54745b');
  r(6, -18, 3, 9, '#54745b');
  r(-9, -10, 3, 3, '#d7b48d');
  r(6, -10, 3, 3, '#d7b48d');
  /* scarf */
  r(-7, -21, 14, 4, '#d7c39a');
  r(-2, -18, 4, 5, '#c6b187');
  /* head */
  r(-6, -29, 12, 10, '#d8b48c');
  r(-6, -29, 12, 2, '#e8c9a2');
  r(-6, -29, 12, 3, '#5a4434');
  r(-6, -29, 2, 7, '#5a4434');
  r(4, -29, 2, 7, '#5a4434');
  p(1, -25, '#3f4b40', 2);
  p(-4, -25, '#3f4b40', 2);
  p(2, -22, '#bd8c70', 2);
  /* little satchel */
  r(7, -13, 3, 5, '#8c6a4c');
  ctx.restore();
  if (moving) {
    ctx.globalAlpha = 0.25;
    p(x - 8 * face, y - 1, '#d8c79d', 2);
    ctx.globalAlpha = 1;
  }
}

function drawCat(x, y, variant, t, s = 1, sleeping = false) {
  const palettes = {
    orange: { main: '#df9750', dark: '#b97036', light: '#f3c384', eye: '#4d6253' },
    black: { main: '#3a3940', dark: '#26252b', light: '#575661', eye: '#b9c77f' },
    grey: { main: '#8c8e88', dark: '#6e706c', light: '#b2b3ab', eye: '#65775f' }
  };
  const c = palettes[variant] || palettes.orange;
  const sway = Math.round(Math.sin(t * 1.8 + x * 0.1) * 2);
  ctx.globalAlpha = 0.2;
  disc(x, y + 1, 9 * s, '#283a30', 2);
  ctx.globalAlpha = 1;
  /* tail */
  for (let i = 0; i < 7; i++) {
    const tx = x - 8 * s - i * 2 * s;
    const ty = y - 8 * s - Math.sin(i * 0.55 + t * 1.6) * 3 * s - (i > 3 ? 4 * s : 0);
    p(tx, ty, i % 2 ? c.main : c.dark, 2 * s);
  }
  p(x - 22 * s, y - 14 * s + sway, c.light, 2 * s);
  /* body */
  roundRect(x - 9 * s, y - 15 * s, 15 * s, 14 * s, 4 * s, c.main);
  r(x - 7 * s, y - 6 * s, 12 * s, 4 * s, c.dark);
  r(x - 5 * s, y - 13 * s, 7 * s, 9 * s, c.light);
  /* front paws */
  r(x - 5 * s, y - 2 * s, 4 * s, 3 * s, c.light);
  r(x + 2 * s, y - 2 * s, 4 * s, 3 * s, c.light);
  /* head */
  roundRect(x + 1 * s, y - 24 * s, 12 * s, 11 * s, 3 * s, c.main);
  r(x + 3 * s, y - 24 * s, 4 * s, 3 * s, c.light);
  /* ears */
  p(x + 2 * s, y - 27 * s, c.main, 3 * s);
  p(x + 9 * s, y - 27 * s, c.main, 3 * s);
  p(x + 3 * s, y - 26 * s, c.light, 1 * s);
  p(x + 10 * s, y - 26 * s, c.light, 1 * s);
  /* face */
  if (sleeping) {
    r(x + 3 * s, y - 20 * s, 3 * s, 1 * s, c.dark);
    r(x + 8 * s, y - 20 * s, 3 * s, 1 * s, c.dark);
  } else {
    p(x + 3 * s, y - 20 * s, c.eye, 2 * s);
    p(x + 9 * s, y - 20 * s, c.eye, 2 * s);
    p(x + 3 * s, y - 20 * s, '#202a25', 1 * s);
    p(x + 9 * s, y - 20 * s, '#202a25', 1 * s);
  }
  p(x + 7 * s, y - 17 * s, '#d79c8f', 1 * s);
  r(x + 6 * s, y - 15 * s, 3 * s, 1 * s, c.dark);
  /* stripes */
  if (variant === 'orange') {
    r(x + 2 * s, y - 14 * s, 2 * s, 4 * s, c.dark);
    r(x + 6 * s, y - 14 * s, 2 * s, 4 * s, c.dark);
    r(x + 10 * s, y - 14 * s, 2 * s, 3 * s, c.dark);
  }
  if (sleeping) {
    ctx.globalAlpha = 0.55;
    label('z', x + 20 * s, y - 24 * s + sway, 6 * s, '#dfe4c8');
    ctx.globalAlpha = 1;
  }
}

function catVariant(name) {
  if (name === 'Pepper') return 'black';
  if (name === 'Miso') return 'grey';
  return 'orange';
}

function drawCompanion(t) {
  const cat = game.cats[game.cat] || game.cats[0];
  const variant = catVariant(cat.name);
  if (game.place === 'cabin') {
    drawCat(426, 326, variant, t, 1, true);
    if (game.cats.length > 1) drawCat(468, 320, catVariant(game.cats[1].name), t + 2, 0.85, true);
  } else if (game.place === 'backyard') {
    drawCat(260, 340, variant, t, 0.95, true);
  } else if (game.place === 'garden') {
    drawCat(560, 342, variant, t + 1, 0.9, false);
  } else if (game.place === 'woods') {
    drawCat(330, 338, variant, t + 1, 0.9, false);
  } else if (game.place === 'market') {
    drawCat(246, 336, variant, t + 1, 0.9, false);
  }
}

function drawScene(t) {
  ctx.clearRect(0, 0, W, H);
  if (game.place === 'cabin') drawCabin(t);
  else if (game.place === 'garden') drawGarden(t);
  else if (game.place === 'woods') drawWoods(t);
  else if (game.place === 'market') drawMarket(t);
  else drawBackyard(t);
  drawWorldGates();
  drawCompanion(t);
  const p = playerPosition();
  drawPlayer(p, t);
  /* gentle vignette so the pixel art feels framed */
  ctx.globalAlpha = 0.07;
  r(0, 0, W, 5, '#1e2d26');
  r(0, H - 5, W, 5, '#1e2d26');
  r(0, 0, 5, H, '#1e2d26');
  r(W - 5, 0, 5, H, '#1e2d26');
  ctx.globalAlpha = 1;
}
