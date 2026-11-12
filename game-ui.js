/* Mosswood — interface & core feedback */

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

function spend(n = 1) {
  if (game.energy < n) {
    toast('You are all tuckered out. Rest at home when you are ready 🌙');
    return false;
  }
  game.energy -= n;
  game.time = Math.min(21, game.time + 1);
  return true;
}

function complete(id) {
  if (!game.tasks.includes(id) || game.done.includes(id)) return;
  const t = taskPool.find(x => x.id === id);
  if (!t) return;
  game.done.push(id);
  game.points += t.reward;
  toast(`Little thing done! +${t.reward} dew drops ✨`);
}

function announceAchievement(id, title, detail) {
  if (game.achievements.includes(id)) return;
  game.achievements.push(id);
  game.lastAchievement = detail;
  toast(`New keepsake: ${title} ✨`);
}

function canPay(cost) {
  return Object.entries(cost || {}).every(([k, v]) => (game.inventory[k] || 0) >= v);
}
function consume(cost) {
  Object.entries(cost || {}).forEach(([k, v]) => {
    game.inventory[k] = (game.inventory[k] || 0) - v;
  });
}

function openModal(title, desc, options, foot = 'Take your time. There is no wrong way to spend a day.') {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">
    <div class="modal-top"><div><div class="eyebrow">A MOMENT TO YOURSELF</div><h2>${title}</h2><p>${desc}</p></div><button class="modal-close" aria-label="Close">×</button></div>
    <div class="modal-options">${options.map((o, i) => `<button class="option" data-opt="${i}" ${o.disabled ? 'disabled' : ''} style="${o.disabled ? 'opacity:.48;cursor:default' : ''}"><span class="option-emoji">${o.emoji || '✿'}</span><span class="option-copy"><b>${o.name}</b><small>${o.desc || ''}</small></span><span class="option-cost">${o.cost || '↗'}</span></button>`).join('')}</div>
    <div class="modal-foot"><span>${foot}</span><strong>✦ ${game.points} drops</strong></div>
  </div></div>`;
  $('#modalRoot .modal-close').onclick = closeModal;
  $('#modalRoot .modal-backdrop').onclick = e => { if (e.target.classList.contains('modal-backdrop')) closeModal(); };
  $$('#modalRoot .option').forEach(b => {
    b.onclick = () => {
      const o = options[+b.dataset.opt];
      if (!o.disabled) o.run();
    };
  });
}

function shellModal({ eyebrow = 'A MOMENT TO YOURSELF', title, desc = '', body = '', foot = '', wide = false }) {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop"><section class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">
    <div class="modal-top"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ''}</div><button class="modal-close" aria-label="Close">×</button></div>
    <div class="modal-body">${body}</div>
    <div class="modal-foot"><span>${foot}</span><strong>✦ ${game.points} drops</strong></div>
  </section></div>`;
  $('#modalRoot .modal-close').onclick = closeModal;
  $('#modalRoot .modal-backdrop').onclick = e => { if (e.target.classList.contains('modal-backdrop')) closeModal(); };
  return $('#modalRoot .modal');
}

function closeModal() { $('#modalRoot').innerHTML = ''; }

function getSeason() { return ['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor((game.day - 1) / 7) % 4]; }
function getWeather() { return ['clear skies', 'soft rain', 'cloudy', 'golden sunshine', 'misty'][((game.day * 7 + Math.floor(game.day / 3)) % 5)]; }

function activity() {
  const cat = game.cats[game.cat] || game.cats[0];
  const film = movieDef();
  let a;
  if (game.place === 'cabin') {
    a = film
      ? ['🎬', 'Now showing · ' + film.title, `${cat.name} has claimed the softest cushion. The inflatable screen glows beside the hearth.`]
      : ['☕', 'A slow morning', `The kettle is warm and ${cat.name} is keeping you company.`];
  } else if (game.place === 'garden') {
    const ready = readyPlants().length;
    a = ready
      ? ['🧺', `${ready} thing${ready === 1 ? '' : 's'} ready to pick`, 'Herbs, veggies and fruit are all doing their own quiet thing.']
      : ['🌱', 'A little patch of green', `${game.plants.length} of 24 bed spots planted. The bees approve.`];
  } else if (game.place === 'woods') {
    a = ['🍄', 'A walk beneath the trees', 'The woods are quiet, except for birdsong and one suspicious rustle.'];
  } else if (game.place === 'market') {
    a = ['🧺', 'A friendly little shop', 'The shelves are full of useful, lovely things.'];
  } else {
    a = film
      ? ['📽️', 'Now showing · ' + film.title, 'Crickets, stars, and a very large inflatable screen beside the stone fireplace.']
      : ['✦', 'An evening under the stars', 'The big screen is ready. All it needs is a DVD and someone to share the blanket.'];
  }
  $('#activityIcon').textContent = a[0];
  $('#activityTitle').textContent = a[1];
  $('#activityText').textContent = a[2];
}

function renderActions() {
  const actions = {
    cabin: [['🍳', 'Cook'], ['☕', 'Coffee'], ['🪵', 'Chop wood'], ['🎬', 'Movie night'], ['✿', 'Decorate']],
    garden: [['🌰', 'Plant seeds'], ['🧺', 'Harvest'], ['🌿', 'Tend garden']],
    woods: [['🍄', 'Forage'], ['🐾', 'Look for cats'], ['🪵', 'Gather wood']],
    market: [['🧺', 'Shop supplies'], ['🪴', 'Shop plants'], ['🪑', 'Shop home'], ['🐈', 'Meet cats']],
    backyard: [['📽️', 'Projector night'], ['🔥', 'Light fireplace'], ['🍡', 'Make s’mores']]
  }[game.place] || [];
  $('#quickActions').innerHTML = actions.map(([e, n]) => `<button data-action-label="${n}">${e} ${n}</button>`).join('') + (game.place === 'cabin' ? '<button data-action-label="Rest">☾ Rest</button>' : '');
}

function renderUI() {
  const cat = game.cats[game.cat] || game.cats[0];
  $('#points').textContent = game.points;
  $('#dayNum').textContent = String(game.day).padStart(2, '0');
  $('#energyText').textContent = `${game.energy} / 6`;
  $('#energyFill').style.width = `${game.energy / 6 * 100}%`;
  $('#streak').textContent = game.streak;
  $('#catName').textContent = cat.name;
  $('#catMood').textContent = cat.mood;
  $('#catQuote').textContent = '“' + cat.quote.replace(/[“”]/g, '') + '”';
  $('#catPortrait span').textContent = cat.emoji;
  $('#hearts').innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="${i >= cat.hearts ? 'empty' : ''}">${i >= cat.hearts ? '♡' : '♥'}</span>`).join(' ');
  $('#taskList').innerHTML = game.tasks.map(id => {
    const t = taskPool.find(x => x.id === id);
    const d = game.done.includes(id);
    return `<div class="task ${d ? 'done' : ''}" data-task="${id}"><span class="task-check">${d ? '✓' : ''}</span><span class="task-copy"><b>${t.name}</b><small>${t.sub}</small></span><span class="task-reward">${d ? '✓' : '+' + t.reward + ' ✦'}</span></div>`;
  }).join('');
  $('#taskCount').textContent = `${game.done.length} / 3`;
  const inv = Object.entries(game.inventory).filter(x => x[1] > 0);
  $('#inventory').innerHTML = inv.map(([k, v]) => `<span class="item-chip">${itemEmoji[k] || '✿'} ${k} ×${v}</span>`).join('') || '<span class="item-chip">Your pockets are empty</span>';
  const l = locations[game.place];
  $('#sceneTitle').textContent = l[0];
  $('#sceneEyebrow').textContent = l[1];
  $('#locationText').innerHTML = `${l[2]} <small>${l[3]}</small>`;
  $('#sceneCaption').textContent = l[4];
  $('#sceneHint').textContent = game.energy === 0 && game.place === 'cabin'
    ? 'YOU DESERVE A REST · PRESS R OR CLICK REST'
    : 'WASD / ARROWS TO WANDER · E TO INTERACT · CLICK TO WALK';
  $('#clock').textContent = `${String(game.time).padStart(2, '0')}:24 ${game.time < 12 ? 'AM' : 'PM'}`;
  const season = getSeason(), weather = getWeather();
  const temp = [17, 23, 12, 3][['Spring', 'Summer', 'Autumn', 'Winter'].indexOf(season)];
  $('.weather b').textContent = season;
  $('.weather small').innerHTML = `Day <i id="dayNum">${String(game.day).padStart(2, '0')}</i> · ${temp}°C · ${weather}`;
  $$('.rail-btn[data-place]').forEach(b => b.classList.toggle('active', b.dataset.place === game.place));
  renderActions();
  activity();
}

function go(place) {
  if (!locations[place]) return;
  game.place = place;
  game.visited = game.visited || {};
  game.visited[place] = true;
  if (Object.keys(game.visited).length >= 3) announceAchievement('wanderer', 'Little Wanderer', 'Visited three places');
  save();
}
