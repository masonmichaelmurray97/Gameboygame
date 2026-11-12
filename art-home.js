/* Mosswood — the cabin interior and the backyard picture show */

function drawWindow(x, y, w, h, t) {
  r(x - 5, y - 5, w + 10, h + 10, '#5c4333');
  r(x - 3, y - 3, w + 6, h + 6, '#8b6648');
  vgrad(x, y, w, h, ['#a7c7bd', '#c8d9b8', '#e4dfb9']);
  disc(x + w * 0.72, y + h * 0.24, 8, '#f3dda0', 2);
  disc(x + w * 0.18, y + h * 0.86, 34, '#82a27b', 2);
  disc(x + w * 0.7, y + h * 0.94, 42, '#72936d', 2);
  drawPine(x + w * 0.2, y + h * 0.84, 0.55, t);
  drawPine(x + w * 0.84, y + h * 0.8, 0.62, t);
  ctx.globalAlpha = 0.18;
  r(x, y, w, h, '#fff4c9');
  ctx.globalAlpha = 1;
  r(x + w / 2 - 2, y, 4, h, '#6b4e38');
  r(x, y + h / 2 - 2, w, 4, '#6b4e38');
  r(x - 9, y, 7, h, '#b97f68');
  r(x - 9, y, 3, h, '#d49a7e');
  r(x + w + 2, y, 7, h, '#b97f68');
  r(x + w + 6, y, 3, h, '#d49a7e');
  r(x - 10, y + h + 4, w + 20, 5, '#a87c55');
  r(x - 10, y + h + 4, w + 20, 1, '#d0a272');
  drawPlantSprite(PLANTS[1], x + 14, y + h + 4, 2, t);
}

function drawKitchen(t) {
  /* tiles */
  for (let yy = 126; yy < 214; yy += 12) {
    for (let xx = 0; xx < 198; xx += 14) {
      r(xx, yy, 12, 10, (xx / 14 + yy / 12) % 2 ? '#d9d2b3' : '#e5ddc1');
    }
    r(0, yy + 10, 198, 2, '#bdb89d');
  }
  /* shelves */
  r(106, 84, 92, 5, '#79583d');
  r(106, 122, 92, 5, '#79583d');
  for (let i = 0; i < 5; i++) {
    const jx = 112 + i * 17;
    r(jx, 100 - (i % 2) * 3, 11, 15 + (i % 2) * 3, ['#b56e59', '#7d9a78', '#d8b26c', '#8e6f89', '#b58b5d'][i]);
    r(jx + 2, 103 - (i % 2) * 3, 3, 5, '#f0e3bf');
  }
  r(112, 110, 18, 12, '#cdb583');
  r(112, 110, 18, 3, '#e6d2a5');
  p(120, 108, '#6f8c67', 3);
  /* hanging utensils */
  r(20, 30, 3, 16, '#5e4633');
  r(14, 44, 16, 3, '#7c5d41');
  for (let i = 0; i < 3; i++) {
    r(16 + i * 5, 47, 2, 17, '#8f9284');
    disc(17 + i * 5, 65, 3, '#6e736a', 1);
  }
  /* counter + cabinets */
  r(0, 214, 184, 8, '#a87b53');
  r(0, 214, 184, 2, '#d0a170');
  r(0, 222, 184, 74, '#8a6547');
  for (let i = 0; i < 3; i++) {
    const xx = 5 + i * 59;
    r(xx, 228, 52, 58, '#7a583f');
    r(xx + 3, 231, 46, 52, '#8e6a4b');
    r(xx + 24, 252, 6, 2, '#d2ad77');
    p(xx + 27, 258, '#d2ad77', 2);
  }
  r(0, 296, 184, 8, '#5c4332');
  /* stove */
  r(24, 188, 70, 26, '#4c5450');
  r(24, 188, 70, 4, '#6d7770');
  r(29, 194, 12, 3, '#2d3331');
  r(46, 194, 12, 3, '#2d3331');
  r(63, 194, 12, 3, '#2d3331');
  r(75, 194, 12, 3, '#2d3331');
  r(30, 201, 58, 9, '#343b38');
  r(35, 203, 48, 2, '#59645d');
  /* kettle */
  disc(60, 184, 8, '#8e9b8d', 1);
  r(55, 177, 10, 5, '#a8b3a2');
  r(65, 179, 8, 3, '#7e8c7e');
  p(60, 174, '#c3cbb8', 3);
  ctx.globalAlpha = 0.3;
  p(64, 168, '#e8dfc5', 2); p(67, 161, '#e8dfc5', 1);
  ctx.globalAlpha = 1;
  /* sink */
  r(118, 207, 54, 8, '#7c8a82');
  r(122, 209, 46, 4, '#4e5c56');
  r(142, 197, 3, 12, '#9aa89e');
  r(145, 197, 8, 3, '#9aa89e');
  /* little shelf plants */
  drawPlantSprite(PLANTS[0], 176, 206, 1, t);
  r(168, 206, 16, 8, '#a3644f');
}

function drawCabin(t) {
  /* wall & floor */
  vgrad(0, 0, W, 254, ['#916d50', '#8a6449', '#7c5a42']);
  for (let y = 0; y < 254; y += 18) {
    r(0, y, W, 2, '#73543d');
    r(0, y + 2, W, 1, '#9b7555');
    for (let x = (y / 18 % 2) * 30; x < W; x += 64) r(x, y, 1, 18, '#805e44');
  }
  vgrad(0, 254, W, 106, ['#6f513b', '#624631']);
  for (let y = 258; y < 360; y += 15) {
    r(0, y, W, 2, '#533a2b');
    for (let x = (y % 30) * 3; x < W; x += 78) p(x, y + 4, '#7b5b41', 2);
    r(0, y + 2, W, 1, '#88674a');
  }
  /* beams */
  r(0, 0, W, 15, '#4d3a2d');
  r(0, 15, W, 4, '#6d513b');
  r(200, 0, 10, 254, '#5c4333');
  r(200, 0, 2, 254, '#876349');
  r(476, 0, 10, 254, '#5c4333');
  r(476, 0, 2, 254, '#876349');
  r(0, 74, 640, 5, '#684a36');
  /* window + kitchen */
  drawWindow(34, 52, 112, 86, t);
  drawKitchen(t);
  /* hearth & chimney */
  r(524, 0, 92, 150, '#777b71');
  for (let yy = 4; yy < 146; yy += 12) {
    for (let xx = 528 + (yy % 24 === 0 ? 0 : 9); xx < 610; xx += 20) {
      r(xx, yy, 17, 9, (xx + yy) % 3 ? '#8a8d81' : '#9b9d90');
      r(xx, yy, 17, 2, '#aaac9f');
    }
  }
  drawHearth(492, 150, 140, 156, t, false);
  r(520, 138, 92, 13, '#5d4231');
  r(520, 138, 92, 3, '#8a6749');
  r(534, 126, 8, 12, '#b47a58');
  r(534, 120, 8, 7, '#d9a06f');
  p(538, 115, '#f0ce86', 2);
  drawPlantSprite(PLANTS[6], 594, 138, 2, t);
  /* the big inflatable screen next to the hearth */
  drawScreen(212, 54, 258, 150, t, movieDef(), game.movie);
  drawDVDshelf(230, 210, 158, 38, t);
  r(394, 208, 72, 40, '#6e4e37');
  r(394, 208, 72, 4, '#9e754f');
  for (let i = 0; i < 3; i++) {
    r(399 + i * 23, 215, 17, 5, ['#b86d55', '#6f8a6b', '#c4a267'][i]);
    r(399 + i * 23, 223, 17, 5, ['#708795', '#a77b63', '#8b7d9c'][i]);
  }
  p(458, 228, '#c4a267', 2);
  r(470, 270, 10, 42, '#7a583f');
  r(464, 280, 22, 7, '#8d6747');
  r(462, 292, 26, 6, '#8d6747');
  r(466, 304, 20, 6, '#7a583f');
  /* projector on a little tripod */
  projectorBeam(182, 218, 212, 54, 258, 150);
  r(166, 234, 22, 4, '#57412f');
  r(172, 238, 4, 22, '#4c392a');
  r(182, 238, 4, 22, '#4c392a');
  drawProjector(178, 214, t, 192, 220);
  /* rug, cushions, cat */
  drawRug(348, 320, 300, 66, '#a8655a', '#d3a27e', '#f0dcb0');
  drawCushion(246, 304, 76, 32, '#6d8a76', '#93ab8b');
  drawCushion(326, 310, 86, 34, '#b8795f', '#d3a080');
  drawCushion(414, 304, 70, 30, '#7f799d', '#a9a2be');
  r(262, 332, 180, 8, '#d4b78b');
  r(268, 330, 168, 3, '#ead1a6');
  for (let i = 0; i < 6; i++) p(278 + i * 28, 336, i % 2 ? '#b8795f' : '#7f799d', 3);
  /* coffee table and snacks */
  r(292, 340, 106, 5, '#8d6747');
  r(298, 345, 5, 9, '#6d4e37');
  r(386, 345, 5, 9, '#6d4e37');
  r(308, 332, 15, 8, '#e8dcc0');
  p(314, 329, '#b86d55', 2);
  r(352, 333, 12, 7, '#cf9b64');
  r(352, 333, 12, 2, '#f0c98c');
  p(374, 337, '#d9c89e', 3);
  /* furniture details */
  if (game.furniture.includes('String lights')) drawStringLights(14, 23, 626, 24, 21, t, 2);
  if (game.furniture.includes('Fern wall shelf')) {
    r(118, 145, 66, 5, '#8b6648');
    drawPlantSprite(PLANTS[0], 132, 145, 2, t);
    drawPlantSprite(PLANTS[3], 158, 145, 2, t);
    r(128, 136, 12, 9, '#b17156');
  }
  if (game.furniture.includes('Wicker chair')) {
    r(506, 278, 48, 38, '#b18a55');
    r(510, 270, 40, 14, '#c39a62');
    for (let i = 0; i < 5; i++) r(512 + i * 8, 279, 3, 34, '#9e7748');
    r(504, 312, 52, 5, '#8b6a43');
    drawCushion(512, 288, 36, 18, '#7f9275', '#a1af8e');
  }
  if (game.furniture.includes('Floor cushions')) {
    drawCushion(214, 330, 56, 23, '#c9a26a', '#e4c28d');
    drawCushion(452, 330, 52, 21, '#879b8b', '#a9bc9f');
  }
  if (game.furniture.includes('Popcorn cart')) {
    r(58, 286, 52, 42, '#b45246');
    r(58, 286, 52, 5, '#d4735e');
    for (let i = 0; i < 4; i++) r(65 + i * 11, 294, 6, 18, '#f0e4c4');
    r(54, 328, 60, 4, '#7e3e36');
    disc(66, 334, 6, '#4d3e34', 1);
    disc(102, 334, 6, '#4d3e34', 1);
    r(112, 274, 5, 18, '#7c5b3f');
    p(114, 270, '#e8c278', 5);
  }
  if (game.furniture.includes('Ghibli posters')) {
    for (let i = 0; i < 3; i++) {
      r(214 + i * 38, 28, 30, 22, '#e8ddb6');
      r(217 + i * 38, 31, 24, 16, ['#7c9c7c', '#b48872', '#8196a4'][i]);
      p(225 + i * 38, 38, '#f0dfb3', 2);
    }
  }
  /* warm firelight on the floor */
  ctx.globalAlpha = 0.08;
  disc(552, 306, 86, '#ffb347', 2);
  ctx.globalAlpha = 1;
}

function drawBackyard(t) {
  vgrad(0, 0, W, 250, ['#25324a', '#3b4a62', '#6f6a7b', '#c88a70']);
  starField(t, 13);
  drawMoon(555, 48, 19);
  drawCloud(110, 72, 0.8, '#6b7286', '#586478');
  drawCloud(390, 48, 0.5, '#6b7286', '#586478');
  /* distant tree line */
  r(0, 206, W, 44, '#263c38');
  for (let x = -10; x < 660; x += 46) drawPine(x, 219 + (x % 3) * 4, 0.75, t);
  drawHills(228, '#374c43', '#3f5549');
  r(0, 238, W, 122, '#425b48');
  r(0, 250, W, 110, '#49634e');
  dither(0, 250, W, 110, '#49634e', '#526b54', 6);
  for (let x = 12; x < W; x += 39) drawGrass(x, 348, 0.9, '#3c5843');
  /* string lights behind the screen */
  drawStringLights(8, 54, 632, 53, 23, t, 3);
  /* projector beam before the screen */
  projectorBeam(344, 285, 96, 56, 278, 160);
  drawScreen(96, 54, 278, 162, t, movieDef(), game.movie);
  /* outdoor stone fireplace, right beside the screen */
  r(486, 42, 62, 106, '#64695f');
  for (let yy = 46; yy < 146; yy += 12) {
    for (let xx = 489 + ((yy / 12) % 2) * 8; xx < 544; xx += 18) {
      r(xx, yy, 15, 9, (xx + yy) % 3 ? '#7c8074' : '#8c9082');
      r(xx, yy, 15, 2, '#9da092');
    }
  }
  drawHearth(414, 148, 148, 166, t, true);
  r(488, 130, 66, 22, '#3e3330');
  ctx.globalAlpha = 0.12;
  disc(486, 300, 120, '#ffb347', 2);
  ctx.globalAlpha = 1;
  /* projector on its crate */
  r(322, 294, 50, 28, '#6f513b');
  r(322, 294, 50, 4, '#95704c');
  r(328, 300, 38, 3, '#5d4432');
  drawProjector(346, 274, t, 360, 280);
  /* seating + blanket */
  drawRug(218, 322, 210, 52, '#5c4850', '#8d6c68', '#c29b7e');
  drawCushion(130, 314, 78, 32, '#6d7d91', '#94a2b2');
  drawCushion(214, 320, 86, 34, '#a8705b', '#c7967b');
  drawCushion(300, 314, 66, 28, '#7d8b67', '#a3af85');
  r(168, 334, 168, 8, '#d8b98d');
  r(174, 332, 156, 3, '#ead2a8');
  for (let i = 0; i < 7; i++) p(186 + i * 25, 338, i % 2 ? '#a8705b' : '#6d7d91', 3);
  /* snack crate */
  r(534, 302, 58, 30, '#7a5a40');
  r(534, 302, 58, 4, '#a47a52');
  r(540, 293, 18, 10, '#d9c18c');
  r(543, 289, 12, 5, '#f2e3bd');
  r(562, 292, 12, 12, '#8fa27c');
  r(566, 286, 4, 8, '#e5dfc0');
  r(578, 295, 10, 9, '#b56e59');
  r(580, 288, 3, 8, '#e8ddb8');
  p(548, 286, '#d9c18c', 2);
  /* fireflies */
  for (let i = 0; i < 9; i++) {
    const x = 40 + (i * 67) % 560 + Math.sin(t * 1.2 + i) * 12;
    const y = 196 + (i * 37) % 120 + Math.cos(t * 1.5 + i) * 8;
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2.4 + i);
    disc(x, y, 2, '#f3dfa0', 1);
    ctx.globalAlpha = 1;
  }
  /* tree silhouettes at the edges */
  drawTree(20, 320, 1.35, 1, t);
  drawTree(622, 318, 1.25, 1, t);
  drawBush(70, 336, 1.2, null, t);
  drawBush(602, 338, 1.1, null, t);
}
