/* Mosswood — free-roam controls, interactions & game loop */

const walkBounds = {
  cabin: { minY: 266, maxY: 352 },
  garden: { minY: 162, maxY: 352 },
  woods: { minY: 210, maxY: 352 },
  market: { minY: 246, maxY: 352 },
  backyard: { minY: 266, maxY: 352 }
};
const homePositions = {
  cabin: { x: 200, y: 344 },
  garden: { x: 320, y: 348 },
  woods: { x: 320, y: 344 },
  market: { x: 320, y: 346 },
  backyard: { x: 400, y: 348 }
};
const sceneObstacles = {
  cabin: [
    [0, 208, 184, 304], [204, 48, 476, 254], [486, 0, 640, 312],
    [460, 266, 490, 314], [246, 297, 324, 337], [326, 303, 414, 341],
    [414, 297, 486, 337], [286, 336, 402, 360], [498, 268, 558, 320]
  ],
  garden: [
    [28, 162, 472, 212], [28, 212, 472, 262], [28, 262, 472, 312],
    [484, 96, 628, 242], [416, 136, 486, 220], [480, 286, 526, 316]
  ],
  woods: [
    [0, 238, 100, 360], [34, 54, 58, 312], [134, 82, 150, 294],
    [236, 106, 248, 280], [400, 74, 420, 298], [534, 44, 562, 314],
    [612, 96, 626, 286], [178, 262, 218, 300], [292, 306, 392, 336],
    [418, 304, 490, 350], [492, 294, 532, 326]
  ],
  market: [
    [82, 68, 558, 282], [114, 256, 198, 304], [424, 262, 534, 322],
    [70, 280, 106, 314]
  ],
  backyard: [
    [88, 42, 384, 220], [404, 36, 570, 318], [312, 286, 378, 328],
    [120, 298, 210, 350], [204, 304, 304, 352], [292, 302, 370, 344],
    [526, 284, 598, 338]
  ]
};
const cameraByPlace = {};
const CAMERA_ZOOM = 1.08;
const movementStick = { x: 0, y: 0, active: false };
const worldRoutes = {
  cabin: { east: 'garden' },
  garden: { west: 'cabin', east: 'woods' },
  woods: { west: 'garden', east: 'market' },
  market: { west: 'woods', east: 'backyard' },
  backyard: { west: 'market' }
};
let blockedExit = null;

function drawWorldGates() {
  const routes = worldRoutes[game.place] || {};
  for (const [side, destination] of Object.entries(routes)) {
    const x = side === 'west' ? 3 : W - 35;
    ctx.globalAlpha = 0.88;
    r(x, 326, 32, 30, '#d7c89a');
    r(x + 4, 330, 24, 22, '#eadfb8');
    r(x + 8, 334, 16, 14, '#78956e');
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff8dc';
    ctx.strokeStyle = '#536b4c';
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.strokeText(side === 'west' ? '‹' : '›', x + 16, 345);
    ctx.fillText(side === 'west' ? '‹' : '›', x + 16, 345);
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = '#fff8dc';
    ctx.strokeStyle = '#405744';
    ctx.lineWidth = 2;
    ctx.strokeText(destination.toUpperCase(), x + 16, 320);
    ctx.fillText(destination.toUpperCase(), x + 16, 320);
  }
  ctx.textAlign = 'start';
}

function enterThrough(side, destination) {
  setMovement(0, 0);
  movementStick.source = null;
  go(destination);
  const p = playerPosition();
  p.x = side === 'east' ? 34 : 606;
  p.y = Math.max(326, Math.min(350, p.y));
  delete p.tx;
  delete p.ty;
  delete p.auto;
  p.walking = false;
  save();
  toast(`A little trail leads into ${destination}.`);
}

function tryEnterWorldRoute() {
  const p = playerPosition();
  if (p.y < 318) return false;
  const side = p.x <= 8 ? 'west' : p.x >= W - 8 ? 'east' : null;
  const destination = side && worldRoutes[game.place]?.[side];
  if (destination) {
    enterThrough(side, destination);
    return true;
  }
  if (side) p.x = side === 'west' ? 8 : W - 8;
  return false;
}

function setMovement(x, y, source = null) {
  movementStick.x = x;
  movementStick.y = y;
  movementStick.active = !!(x || y);
  movementStick.source = source;
  if (movementStick.active) {
    const p = playerPosition();
    delete p.tx;
    delete p.ty;
    delete p.auto;
  }
}

const sceneObjects = {
  cabin: [
    { x: 78, y: 248, name: 'Kitchen stove', run: () => cook() },
    { x: 474, y: 296, name: 'Woodpile', run: () => chop() },
    { x: 340, y: 238, name: 'Inflatable screen', run: () => movie() },
    { x: 426, y: 326, name: 'Your companion', run: () => petAction('pet') },
    { x: 552, y: 298, name: 'Stone hearth', run: () => fire() },
    { x: 300, y: 238, name: 'DVD shelf', run: () => movie() },
    { x: 90, y: 155, name: 'The window', run: () => openJournal('The window') },
    { x: 90, y: 296, name: 'Popcorn cart', run: () => toast('The popcorn cart is warm and ready for the next film. 🍿'), when: () => game.furniture.includes('Popcorn cart') }
  ],
  garden: [
    { x: 250, y: 300, name: 'Garden beds', run: () => gardenMenu() },
    { x: 452, y: 214, name: 'Garden sign', run: () => openJournal('The garden') },
    { x: 554, y: 240, name: 'Greenhouse', run: () => plant() },
    { x: 70, y: 332, name: 'Watering can', run: () => tend() }
  ],
  woods: [
    { x: 196, y: 292, name: 'Berry bush', run: () => forage() },
    { x: 470, y: 300, name: 'Ferny clearing', run: () => explore() },
    { x: 340, y: 332, name: 'Mossy log', run: () => forage() },
    { x: 52, y: 300, name: 'Little stream', run: () => toast('The water is cold, clear, and in no hurry at all.') }
  ],
  market: [
    { x: 196, y: 220, name: 'Market window', run: () => shop('supplies') },
    { x: 449, y: 220, name: 'Homewares window', run: () => shop('home') },
    { x: 510, y: 292, name: 'Plant stand', run: () => shop('plants') },
    { x: 324, y: 244, name: 'Fern & Fable door', run: () => shop('supplies') },
    { x: 150, y: 292, name: 'Produce crates', run: () => shop('supplies') }
  ],
  backyard: [
    { x: 235, y: 220, name: 'Big inflatable screen', run: () => movie() },
    { x: 486, y: 292, name: 'Stone fireplace', run: () => fire() },
    { x: 346, y: 312, name: 'Projector', run: () => movie() },
    { x: 562, y: 320, name: 'Snack crate', run: () => smores() },
    { x: 218, y: 336, name: 'Blanket pile', run: () => movie() }
  ]
};

function playerPosition() {
  if (!game.player[game.place]) game.player[game.place] = { ...homePositions[game.place] };
  return game.player[game.place];
}

function moveTo(x, y, auto = false) {
  const p = playerPosition();
  const b = walkBounds[game.place] || { minY: 20, maxY: 350 };
  p.tx = Math.max(0, Math.min(W, x));
  p.ty = Math.max(b.minY, Math.min(b.maxY, y));
  p.auto = auto;
}

function nearObject() {
  const p = playerPosition();
  const list = (sceneObjects[game.place] || []).filter(o => !o.when || o.when());
  return list.map(o => ({ ...o, d: Math.hypot(o.x - p.x, o.y - p.y) })).sort((a, b) => a.d - b.d)[0];
}

function interact() {
  const o = nearObject();
  if (o && o.d < 62) { o.run(); return; }
  toast('Wander a little closer to a spot that catches your eye.');
}

function tickWalk(dt) {
  const p = playerPosition();
  if (movementStick.active) {
    const length = Math.hypot(movementStick.x, movementStick.y) || 1;
    const speed = 0.14 * dt * Math.min(1, length);
    const bounds = walkBounds[game.place] || { minY: 20, maxY: 350 };
    p.x = Math.max(0, Math.min(W, p.x + movementStick.x / length * speed));
    p.y = Math.max(bounds.minY, Math.min(bounds.maxY, p.y + movementStick.y / length * speed));
    p.walking = true;
    if (movementStick.x) p.face = movementStick.x < 0 ? -1 : 1;
    if (tryEnterWorldRoute()) return;
    return;
  }
  if (p.tx == null) { p.walking = false; return; }
  const dx = p.tx - p.x, dy = p.ty - p.y;
  const d = Math.hypot(dx, dy);
  const step = Math.min(0.18 * dt, d);
  if (d < 1.5) {
    p.x = p.tx; p.y = p.ty;
    delete p.tx; delete p.ty;
    p.walking = false;
    if (tryEnterWorldRoute()) return;
    if (p.auto) { delete p.auto; interact(); }
    save();
    return;
  }
  p.x += dx / d * step;
  p.y += dy / d * step;
  p.walking = true;
  if (Math.abs(dx) > 1) p.face = dx < 0 ? -1 : 1;
  tryEnterWorldRoute();
}

function act(actionLabel) {
  switch (actionLabel) {
    case 'Cook': return cook();
    case 'Coffee': return drink();
    case 'Chop wood': return chop();
    case 'Movie night': return movie();
    case 'Decorate': return decorate();
    case 'Plant seeds': return plant();
    case 'Harvest': return harvest();
    case 'Tend garden': return tend();
    case 'Forage': return forage();
    case 'Look for cats': return explore();
    case 'Gather wood': return chop();
    case 'Shop supplies': return shop('supplies');
    case 'Shop plants': return shop('plants');
    case 'Shop home': return shop('home');
    case 'Meet cats': return shop('cats');
    case 'Projector night': return movie();
    case 'Light fireplace': return fire();
    case 'Make s’mores': return smores();
    case 'Rest': return rest();
  }
}

/* ----------------------------- inputs ----------------------------- */
$$('.rail-btn[data-place]').forEach(b => b.addEventListener('click', () => go(b.dataset.place)));
$('.brand').addEventListener('click', e => { e.preventDefault(); go('cabin'); });
$('#quickActions').addEventListener('click', e => {
  const b = e.target.closest('[data-action-label]');
  if (b) act(b.dataset.actionLabel);
});
$('.cat-actions').addEventListener('click', e => {
  const b = e.target.closest('[data-action]');
  if (b) petAction(b.dataset.action);
});
$('#taskList').addEventListener('click', e => {
  const t = e.target.closest('[data-task]');
  if (!t) return;
  if (game.done.includes(t.dataset.task)) return toast('Already done, and lovely work!');
  const id = t.dataset.task;
  const actions = {
    breakfast: () => { go('cabin'); cook(); },
    garden: () => { go('garden'); gardenMenu(); },
    woods: () => { go('woods'); forage(); },
    cat: () => petAction('pet'),
    fire: () => { go('cabin'); chop(); },
    drink: () => { go('cabin'); drink(); },
    movie: () => { go('backyard'); movie(); }
  };
  actions[id]?.();
});

canvas.addEventListener('click', e => {
  if ($('#modalRoot').innerHTML) return;
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * W / r.width;
  const y = (e.clientY - r.top) * H / r.height;
  const list = (sceneObjects[game.place] || []).filter(o => !o.when || o.when());
  const near = list.map(o => ({ ...o, d: Math.hypot(o.x - x, o.y - y) })).sort((a, b) => a.d - b.d)[0];
  if (near && near.d < 46) moveTo(near.x, near.y, true);
  else moveTo(x, y, false);
});
canvas.addEventListener('dblclick', () => {
  if (game.energy === 0 && game.place === 'cabin') rest();
});

const moveKeys = {
  ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1, 0], d: [1, 0], D: [1, 0]
};
document.addEventListener('keydown', e => {
  if ($('#modalRoot').innerHTML) {
    if (e.key === 'Escape') closeModal();
    return;
  }
  if (e.key === 'Escape') { closeModal(); return; }
  if (moveKeys[e.key]) {
    e.preventDefault();
    const v = moveKeys[e.key];
    setMovement(v[0], v[1], e.key);
  } else if (e.key.toLowerCase() === 'e') {
    e.preventDefault();
    interact();
  } else if (e.key.toLowerCase() === 'r' && game.energy === 0 && game.place === 'cabin') {
    rest();
  }
});
document.addEventListener('keyup', e => {
  if (movementStick.source === e.key) setMovement(0, 0);
});
window.addEventListener('blur', () => setMovement(0, 0));

function addTouchPad() {
  const wrap = $('.scene-wrap');
  if (!wrap || $('#walkPad')) return;

  const controls = document.createElement('div');
  controls.id = 'walkPad';
  controls.className = 'joystick-controls';

  const group = document.createElement('div');
  group.className = 'joystick-group';
  const label = document.createElement('span');
  label.className = 'joystick-label';
  label.textContent = 'DRAG TO WALK';

  const pad = document.createElement('button');
  pad.type = 'button';
  pad.className = 'joystick';
  pad.setAttribute('aria-label', 'Movement joystick. Drag in any direction to walk.');
  pad.setAttribute('aria-describedby', 'joystickHelp');
  const knob = document.createElement('span');
  knob.className = 'joystick-knob';
  pad.append(knob);
  group.append(label, pad);

  const help = document.createElement('span');
  help.id = 'joystickHelp';
  help.className = 'visually-hidden';
  help.textContent = 'You can also move with the arrow keys or WASD.';
  group.append(help);

  const use = document.createElement('button');
  use.type = 'button';
  use.className = 'walk-use';
  use.innerHTML = '<span class="walk-use-icon">✦</span><span>INTERACT</span>';
  use.setAttribute('aria-label', 'Interact with the nearest spot');
  use.addEventListener('click', interact);
  const tip = document.createElement('span');
  tip.className = 'joystick-tip';
  tip.textContent = 'MOVE WITH ARROWS / WASD';
  controls.append(group, use, tip);

  let activePointer = null;
  const moveStick = e => {
    if (activePointer !== e.pointerId) return;
    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxTravel = Math.max(1, rect.width * 0.32);
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance > maxTravel) {
      dx = dx / distance * maxTravel;
      dy = dy / distance * maxTravel;
    }
    const x = dx / maxTravel;
    const y = dy / maxTravel;
    pad.style.setProperty('--stick-x', `${dx}px`);
    pad.style.setProperty('--stick-y', `${dy}px`);
    setMovement(x, y, pad);
  };
  const centerStick = e => {
    if (e && activePointer !== e.pointerId) return;
    setMovement(0, 0);
    activePointer = null;
    pad.style.setProperty('--stick-x', '0px');
    pad.style.setProperty('--stick-y', '0px');
    pad.classList.remove('is-active');
    if (e && pad.hasPointerCapture?.(e.pointerId)) pad.releasePointerCapture(e.pointerId);
  };

  pad.addEventListener('pointerdown', e => {
    if (activePointer !== null) return;
    e.preventDefault();
    activePointer = e.pointerId;
    pad.classList.add('is-active');
    pad.setPointerCapture?.(e.pointerId);
    moveStick(e);
  });
  pad.addEventListener('pointermove', moveStick);
  pad.addEventListener('pointerup', centerStick);
  pad.addEventListener('pointercancel', centerStick);
  pad.addEventListener('lostpointercapture', centerStick);
  pad.addEventListener('click', e => e.preventDefault());

  wrap.insertAdjacentElement('afterend', controls);
}

/* ----------------------------- side panel & menus ----------------------------- */
$('#activityBtn').onclick = () => {
  if (game.place === 'cabin') { if (movieDef()) movie(); else cook(); }
  else if (game.place === 'garden') plant();
  else if (game.place === 'woods') forage();
  else if (game.place === 'market') shop('supplies');
  else movie();
};
$('#catMore').onclick = () => {
  const cat = game.cats[game.cat];
  openModal('A little about ' + cat.name, `${cat.name} has been with you for ${cat.hearts + 1} lovely moments. Their trust grows with every meal, game, and gentle hello.`, [
    { emoji: '♡', name: 'Give a gentle cuddle', desc: 'A soft, no-pressure hello.', run: () => { closeModal(); petAction('pet'); } },
    {
      emoji: '📖', name: 'Meet your other companions', desc: game.cats.length > 1 ? game.cats.map(c => c.name).join(' · ') : 'There may be a new friend out in the woods.',
      run: () => {
        closeModal();
        if (game.cats.length > 1) {
          openModal('Your little companions', 'Choose who to spend a little time with.', game.cats.map((c, i) => ({
            emoji: c.emoji, name: c.name, desc: c.mood, cost: i === game.cat ? 'WITH YOU NOW' : 'Come say hello',
            run: () => { game.cat = i; closeModal(); save(); toast(`${c.name} trots over to say hello ♡`); }
          })));
        } else go('woods');
      }
    }
  ]);
};
$('#helpBtn').onclick = () => openModal('Welcome to Mosswood', 'A tiny woodland life, at your own pace. There is no way to lose, and no wrong way to spend a day.', [
  { emoji: '⌂', name: 'Explore your little world', desc: 'Visit the cabin, garden, woods, market, and the backyard picture show.', run: () => closeModal() },
  { emoji: '🌱', name: 'Grow 23 kinds of plants', desc: 'Herbs, veggies, and fruit. Plant with seeds, harvest when ready.', run: () => { closeModal(); go('garden'); plant(); } },
  { emoji: '🎬', name: 'Have a Studio Ghibli night', desc: 'The DVD shelf has 25 films. The screen is already inflated.', run: () => { closeModal(); go('cabin'); movie(); } },
  { emoji: '✦', name: 'Earn dew drops', desc: 'Complete the three little daily tasks for points.', run: () => closeModal() },
  { emoji: '☾', name: 'Rest when you need to', desc: 'When the day is done, rest at home to begin a fresh morning.', run: () => { closeModal(); rest(); } }
], 'Your game saves automatically in this browser.');
$('#soundBtn').onclick = () => toast('The woods are quiet today. Imagine the birdsong and the projector’s soft hum ♫');
$('#journalBtn').onclick = () => openJournal();
$('#resetBtn').onclick = () => openModal('A fresh start?', 'This will begin a new little save. Your cabin will be waiting just the same.', [{
  emoji: '🌱', name: 'Start a new save', desc: 'Your current progress will be cleared from this browser.',
  run: () => {
    localStorage.removeItem('mosswood-save');
    game = { ...initial, inventory: { ...initial.inventory }, cats: [...initial.cats], tasks: pickTasks(), done: [], unlocks: ['backyard'], furniture: [], watched: [], movie: null, player: {}, stats: { recipes: 0, drinks: 0, harvests: 0, movies: 0 } };
    closeModal();
    save();
    toast('A new beginning, and a lovely one at that.');
  }
}]);

/* ----------------------------- game loop ----------------------------- */
let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(60, now - lastFrame);
  lastFrame = now;
  tickWalk(dt);
  drawScene(now / 1000);
  requestAnimationFrame(frame);
}

function boot() {
  Object.keys(homePositions).forEach(place => {
    if (!game.player[place]) game.player[place] = { ...homePositions[place] };
  });
  addTouchPad();
  renderUI();
  requestAnimationFrame(frame);
}

window.__mosswood = {
  get game() { return game; },
  go, movie, plant, harvest, rest, save, moveTo, drawScene, act,
  GHIBLI, PLANTS
};

boot();
