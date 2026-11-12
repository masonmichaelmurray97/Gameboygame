/* Mosswood — the mossy woods and the village market */

function drawTrunk(x, top, bottom, w, tone, t) {
  const sway = Math.sin(t * 0.5 + x * 0.1) * 1;
  r(x - w / 2 + sway, top, w, bottom - top, tone);
  r(x - w / 2 + 1 + sway, top, Math.max(2, w * 0.28), bottom - top, mixColor(tone, '#ffffff', 0.12));
  for (let y = top + 8; y < bottom; y += 17) {
    p(x - w / 2 + 3 + sway, y, mixColor(tone, '#000000', 0.22), 2);
    p(x + w / 2 - 6 + sway, y + 6, mixColor(tone, '#ffffff', 0.1), 2);
  }
  r(x - w / 2 - 3 + sway, bottom - 20, w + 6, 20, mixColor(tone, '#2f4a38', 0.45));
}

function drawWoods(t) {
  vgrad(0, 0, W, 230, ['#a7c49b', '#8bad86', '#739474']);
  ctx.globalAlpha = 0.18;
  disc(505, 40, 90, '#fff0b3', 2);
  ctx.globalAlpha = 1;
  /* far treeline */
  drawHills(178, '#6e8f70', '#668767');
  for (let x = 12; x < 650; x += 39) drawPine(x, 194 + (x % 4) * 7, 0.9, t);
  /* canopy */
  for (let i = 0; i < 16; i++) {
    const x = i * 43 - 20, y = 4 + (i % 3) * 12;
    disc(x, y, 34, i % 2 ? '#3f664f' : '#466e53', 2);
    disc(x + 10, y + 8, 24, '#557b57', 2);
    disc(x - 8, y - 4, 18, '#6a8d62', 2);
  }
  /* trunks */
  drawTrunk(46, 54, 310, 20, '#5b4636', t);
  drawTrunk(142, 82, 292, 13, '#66503d', t);
  drawTrunk(242, 106, 278, 10, '#715a43', t);
  drawTrunk(410, 74, 296, 15, '#5f4938', t);
  drawTrunk(548, 44, 312, 24, '#584434', t);
  drawTrunk(618, 96, 284, 11, '#6b553f', t);
  /* ground */
  vgrad(0, 202, W, 158, ['#607f5b', '#54734f', '#466343']);
  dither(0, 210, W, 150, '#567650', '#5f7f58', 6);
  r(0, 202, W, 4, '#789666');
  /* winding path */
  for (let i = 0; i < 20; i++) {
    const yy = 198 + i * 8;
    const cx = 320 + Math.sin(i * 0.22) * 38;
    const ww = 64 + i * 4;
    r(cx - ww / 2, yy, ww, 9, i % 3 === 0 ? '#a89a74' : '#b2a47c');
    r(cx - ww / 2 + 4, yy, ww - 8, 2, '#c5b78d');
  }
  for (let i = 0; i < 16; i++) {
    const yy = 208 + i * 9;
    p(300 + Math.sin(i * 0.9) * 24 + (i * 13) % 40, yy, i % 2 ? '#8f8465' : '#c1b286', 2);
  }
  /* stream on the left */
  r(0, 238, 116, 122, '#3f5b4c');
  r(0, 244, 96, 116, '#55737a');
  vgrad(0, 246, 88, 114, ['#5f8a8c', '#6f9a95', '#7fa89b']);
  for (let i = 0; i < 12; i++) {
    const yy = 248 + i * 10;
    r(8 + Math.sin(i * 0.7) * 12, yy, 52 + Math.cos(i) * 14, 2, i % 2 ? '#a3c5b5' : '#8db7ad');
  }
  for (let i = 0; i < 7; i++) {
    drawStone(12 + i * 15, 246 + (i % 3) * 3, 0.55, t);
    drawStone(4 + i * 14, 352 - (i % 4) * 4, 0.7, t);
  }
  drawFern(122, 300, 1.1);
  drawFern(150, 342, 0.9);
  /* berry bush + mushrooms */
  drawBush(196, 278, 1.05, '#b5555a', t);
  drawBush(270, 320, 0.8, '#6c76a8', t);
  drawMushroom(238, 288, 1, true);
  drawMushroom(252, 292, 0.8, false);
  drawMushroom(224, 294, 0.7, true);
  drawMushroom(360, 336, 1, true);
  drawMushroom(378, 341, 0.8, false);
  /* log */
  r(300, 314, 86, 18, '#75563e');
  r(300, 314, 86, 5, '#96704e');
  disc(386, 323, 9, '#8b6847', 1);
  disc(386, 323, 5, '#b08a5f', 1);
  r(310, 318, 18, 4, '#617e55');
  p(330, 319, '#718d5e', 3);
  drawMushroom(316, 314, 0.7, false);
  /* rocks, ferns, foreground */
  drawStone(452, 316, 1.4, t);
  drawStone(478, 328, 0.9, t);
  drawStone(432, 336, 0.8, t);
  drawFern(420, 348, 1.1);
  drawFern(560, 346, 1.3);
  drawFern(600, 330, 0.9);
  drawBush(512, 306, 0.85, '#8a6d9d', t);
  for (let x = 0; x < W; x += 22) drawGrass(x, 357, 0.9, '#3f5c40');
  /* light shafts */
  ctx.globalAlpha = 0.055;
  ctx.fillStyle = '#fff0b3';
  ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(560, 0); ctx.lineTo(330, 360); ctx.lineTo(270, 360); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(140, 0); ctx.lineTo(190, 0); ctx.lineTo(80, 360); ctx.lineTo(30, 360); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  /* fireflies & falling leaves */
  for (let i = 0; i < 10; i++) {
    const x = 50 + (i * 59) % 560 + Math.sin(t * 0.8 + i) * 14;
    const y = 150 + (i * 31) % 160 + Math.cos(t * 1.2 + i) * 10;
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
    disc(x, y, 2, '#eadf9e', 1);
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 6; i++) {
    const x = (i * 111 + t * 6) % 640;
    const y = 100 + ((i * 53 + t * 9) % 220);
    p(x, y, i % 2 ? '#b9c275' : '#d8c07e', 2);
  }
  ctx.globalAlpha = 1;
  /* shy Pepper waits by the clearing */
  if (game.cats.length < 2) drawCat(492, 294, 'black', t, 1);
  drawButterfly(330 + Math.sin(t * 0.8) * 30, 222 + Math.cos(t) * 7, t, '#e5d391');
}

function cobbles() {
  for (let y = 296; y < 360; y += 14) {
    for (let x = (y % 28) * 2 - 20; x < 660; x += 25) {
      disc(x, y, 10, (x + y) % 3 ? '#9b9b88' : '#a9a995', 1);
      r(x - 5, y - 4, 9, 2, '#b7b7a2');
      p(x + 4, y + 3, '#777a6c', 2);
    }
  }
}

function marketWindow(x, y, w, h, t) {
  r(x - 5, y - 5, w + 10, h + 10, '#5f4533');
  r(x - 2, y - 2, w + 4, h + 4, '#8d6848');
  vgrad(x, y, w, h, ['#c3d9c4', '#e0dfba']);
  r(x, y + h - 18, w, 18, '#8a6849');
  for (let i = 0; i < 4; i++) {
    const xx = x + 9 + i * (w - 20) / 3;
    r(xx, y + 14, 16, 22, ['#b46e55', '#d1ac62', '#7d9876', '#a17e99'][i]);
    r(xx + 2, y + 17, 4, 8, '#f2e4bd');
    disc(xx + 8, y + 40, 4, '#5e7656', 1);
  }
  r(x, y + 66, w, 3, '#9b7551');
  for (let i = 0; i < 3; i++) {
    disc(x + 16 + i * 22, y + 58, 7, ['#c8836a', '#d3bd66', '#8ca277'][i], 1);
    p(x + 14 + i * 22, y + 54, '#f0e2b4', 2);
  }
  r(x + w / 2 - 2, y, 4, h, '#8d6848');
  r(x, y + h / 2 - 2, w, 4, '#8d6848');
  /* reflection */
  ctx.globalAlpha = 0.18;
  r(x + 8, y + 8, 10, 30, '#ffffff');
  ctx.globalAlpha = 1;
  p(x + 12, y + 16, '#f7f4da', 2);
}

function drawMarket(t) {
  vgrad(0, 0, W, 210, ['#a4c3b6', '#c1d4b5', '#dddbb8', '#eee1c0']);
  drawSun(72, 42, 18, t);
  drawCloud(250, 42, 0.6);
  drawCloud(500, 30, 0.75);
  drawHills(176, '#8ba680', '#97af89');
  for (let x = 10; x < 650; x += 61) drawTree(x, 190 + (x % 4) * 5, 0.75, 1, t);
  r(0, 184, W, 176, '#8b9d76');
  vgrad(0, 240, W, 120, ['#a09d84', '#94927c']);
  /* bunting */
  const flags = ['#c98570', '#e2c070', '#7f9c7a', '#a68cae'];
  for (let i = 0; i < 12; i++) {
    const x = 92 + i * 40, y = 58 + Math.sin(i / 2) * 4;
    p(x, y, '#6e5a44', 1);
    r(x, y + 2, 14, 10, flags[i % 4]);
    p(x + 5, y + 12, flags[i % 4], 3);
  }
  /* shop */
  r(102, 82, 442, 208, '#c9ad82');
  r(102, 82, 442, 7, '#e0c89d');
  r(96, 68, 454, 20, '#6b5643');
  r(88, 86, 470, 8, '#87694c');
  for (let x = 96; x < 552; x += 18) {
    r(x, 70, 15, 8, (x / 18) % 2 ? '#5d4c3d' : '#77604b');
    p(x + 3, 79, '#4d3e33', 2);
  }
  /* sign */
  r(228, 24, 188, 42, '#f0e4c0');
  r(234, 30, 176, 30, '#f8efd1');
  label('FERN & FABLE', 322, 45, 14, '#5d7259');
  label('GENERAL GOODS · SINCE 1998', 322, 57, 5, '#9a9b7f');
  r(246, 66, 4, 10, '#7b5a3f');
  r(398, 66, 4, 10, '#7b5a3f');
  /* awning */
  for (let i = 0; i < 9; i++) {
    const xx = 112 + i * 47;
    r(xx, 96, 47, 19, i % 2 ? '#e8ddba' : '#66846b');
    p(xx + 10, 115, i % 2 ? '#e8ddba' : '#66846b', 4);
    p(xx + 26, 115, i % 2 ? '#e8ddba' : '#66846b', 4);
  }
  r(106, 93, 434, 4, '#4e6b56');
  /* timber frame */
  r(106, 120, 8, 170, '#6b4d39');
  r(532, 120, 8, 170, '#6b4d39');
  r(276, 120, 8, 170, '#6b4d39');
  r(362, 120, 8, 170, '#6b4d39');
  marketWindow(130, 140, 132, 86, t);
  marketWindow(380, 140, 138, 86, t);
  /* door */
  r(296, 138, 56, 152, '#5f4533');
  r(302, 144, 44, 140, '#8c6447');
  r(308, 150, 32, 52, '#c8d9bd');
  r(308, 150, 32, 3, '#8b6a4c');
  r(322, 150, 4, 52, '#8b6a4c');
  disc(338, 222, 3, '#e0b96f', 1);
  r(302, 212, 44, 4, '#6d4c37');
  p(324, 246, '#6c8a5e', 2);
  /* window boxes */
  for (let i = 0; i < 5; i++) {
    drawFlower(142 + i * 26, 232, 0.9, i % 2 ? '#d59a92' : '#e3c57b', '#f1dda4', t);
    drawFlower(392 + i * 25, 232, 0.8, i % 2 ? '#b99ac2' : '#dfb07c', '#f1dda4', t);
  }
  r(132, 230, 132, 5, '#7d5d42');
  r(380, 230, 138, 5, '#7d5d42');
  /* crates of produce */
  r(120, 262, 74, 38, '#8b6846');
  r(120, 262, 74, 5, '#ae855b');
  for (let i = 0; i < 4; i++) {
    disc(130 + i * 17, 278, 7, i % 2 ? '#c98452' : '#d3a64f', 1);
    p(127 + i * 17, 273, '#e8d9a5', 2);
  }
  r(128, 288, 58, 3, '#6e513a');
  r(430, 268, 66, 34, '#7e6042');
  r(430, 268, 66, 5, '#a37c51');
  for (let i = 0; i < 3; i++) {
    disc(444 + i * 18, 286, 8, ['#a7b46a', '#d0a35d', '#c47b62'][i], 1);
    p(441 + i * 18, 280, '#e9dfb1', 2);
  }
  /* barrel & potted plants */
  r(496, 276, 34, 42, '#7c5a3e');
  r(496, 276, 34, 4, '#9f7850');
  r(496, 292, 34, 3, '#604630');
  r(496, 308, 34, 3, '#604630');
  disc(513, 274, 16, '#9cb087', 1);
  drawPlantSprite(PLANTS[2], 505, 274, 2, t);
  drawPlantSprite(PLANTS[6], 521, 274, 2, t);
  r(76, 286, 26, 22, '#a56d53');
  drawPlantSprite(PLANTS[1], 89, 287, 2, t);
  /* shop cat asleep on the crate */
  drawCat(174, 260, 'grey', t, 0.8, true);
  /* ground details */
  cobbles();
  for (let x = 20; x < 620; x += 47) {
    drawFlower(x, 354, 0.8, x % 2 ? '#d8aa9c' : '#e3c47b', '#f1dda4', t);
  }
  /* birds */
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 3; i++) {
    const x = 190 + i * 34 + Math.sin(t * 0.4 + i) * 6, y = 100 + i * 8;
    p(x, y, '#5f7062', 1); p(x + 2, y - 1, '#5f7062', 1); p(x + 4, y, '#5f7062', 1);
  }
  ctx.globalAlpha = 1;
}
