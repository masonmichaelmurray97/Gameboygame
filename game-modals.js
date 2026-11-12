/* Mosswood — the seed catalogue, the garden basket & the Ghibli shelf */

function plant() { plantModal(); }

function seedCard(def) {
  const seeds = game.inventory.Seeds || 0;
  const free = 24 - game.plants.length;
  const can = seeds > 0 && free > 0;
  const catName = def.cat === 'herb' ? 'HERB' : def.cat === 'veg' ? 'VEGGIE' : 'FRUIT';
  return `<button class="seed-card" data-plant="${def.id}" ${can ? '' : 'disabled'}>
    <span class="seed-art" style="--leaf:${def.leaf};--leaf2:${def.leaf2};--accent:${def.accent}"><b>${def.emoji}</b><i></i><i></i><i></i></span>
    <span class="seed-copy"><b>${def.name}</b><small>${catName} · ${def.grow} day${def.grow === 1 ? '' : 's'} · +${def.yield}</small><em>${def.blurb}</em></span>
    <span class="seed-price">${seeds > 0 ? '1 seed' : 'need seeds'}</span>
  </button>`;
}

function plantModal() {
  const free = 24 - game.plants.length;
  if (free <= 0) {
    toast('Every bed is full. Harvest something before planting more 🌱');
    return;
  }
  const body = `<div class="seed-tabs" id="seedTabs">
      <button class="active" data-cat="all">All 23</button>
      <button data-cat="herb">Herbs</button>
      <button data-cat="veg">Veggies</button>
      <button data-cat="fruit">Fruit</button>
      <span class="seed-status">${free} spots free · ${game.inventory.Seeds || 0} seeds</span>
    </div>
    <div class="seed-grid" id="seedGrid">${PLANTS.map(seedCard).join('')}</div>
    <div class="modal-note">Each planting uses one seed. Herbs are quick; melons and pumpkins take a little longer. Rain helps.</div>`;
  shellModal({
    eyebrow: 'THE KITCHEN GARDEN · 23 THINGS TO GROW',
    title: 'What shall we grow?',
    desc: 'Mint and basil for the kitchen, catnip for your companion, and enough veggies and fruit to fill a whole summer.',
    body,
    foot: 'Plant · water · wait for a sunny morning.',
    wide: true
  });
  const grid = $('#seedGrid');
  const draw = cat => { grid.innerHTML = PLANTS.filter(d => cat === 'all' || d.cat === cat).map(seedCard).join(''); bind(); };
  const bind = () => {
    $$('#seedGrid .seed-card').forEach(btn => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const def = PLANTS.find(d => d.id === btn.dataset.plant);
        if (!def) return;
        if ((game.inventory.Seeds || 0) < 1) return toast('You are out of seeds. Fern & Fable has seed tins.');
        if (game.plants.length >= 24) return toast('Every bed is full right now.');
        game.inventory.Seeds--;
        game.plants.push({ id: def.id, planted: game.day, ready: game.day + def.grow, slot: game.plants.length });
        complete('garden');
        toast(`${def.name} planted. ${def.grow} day${def.grow === 1 ? '' : 's'} of quiet growing.`);
        closeModal();
        save();
      };
    });
  };
  $$('#seedTabs button').forEach(b => {
    b.onclick = () => {
      $$('#seedTabs button').forEach(x => x.classList.toggle('active', x === b));
      draw(b.dataset.cat);
    };
  });
  bind();
}

function harvest() {
  const ready = readyPlants();
  if (!ready.length) {
    toast(game.plants.length ? 'Not quite ready yet. Give them a little more time 🌱' : 'Nothing to pick just yet. Try planting seeds!');
    return;
  }
  const rows = ready.map(p => {
    const def = plantDef(p);
    return `<div class="harvest-row"><span>${def.emoji}</span><b>${def.name}</b><small>+${def.yield} ${def.cat === 'herb' ? 'bundle' + (def.yield === 1 ? '' : 's') : 'harvest'}</small></div>`;
  }).join('');
  shellModal({
    eyebrow: 'THE GARDEN BASKET',
    title: 'A lovely little harvest',
    desc: `${ready.length} plant${ready.length === 1 ? ' is' : 's are'} ready. Bring them in while the light is good.`,
    body: `<div class="harvest-list">${rows}</div><button class="ritual-button" id="harvestAll">Gather everything 🧺</button>`,
    foot: 'Harvesting uses 1 energy.',
    wide: ready.length > 8
  });
  $('#harvestAll').onclick = () => {
    if (!spend()) return;
    const counts = {};
    ready.forEach(p => {
      const def = plantDef(p);
      game.inventory[def.name] = (game.inventory[def.name] || 0) + def.yield;
      counts[def.name] = (counts[def.name] || 0) + def.yield;
      if (def.id === 'catnip') game.cats[game.cat].hearts = Math.min(5, game.cats[game.cat].hearts + 1);
      const idx = game.plants.indexOf(p);
      if (idx >= 0) game.plants.splice(idx, 1);
    });
    game.stats.harvests = (game.stats.harvests || 0) + ready.length;
    complete('garden');
    if (game.stats.harvests >= 8) announceAchievement('green-thumb', 'Green Thumb', 'Gathered eight garden harvests');
    const uniq = new Set(game.plants.map(p => plantDef(p).id));
    if (uniq.size >= 6) announceAchievement('botanist', 'Little Botanist', 'Grew six different kinds of plants');
    toast(`Into the basket: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · ')} 🧺`);
    closeModal();
    save();
  };
}

function movie() {
  const watched = game.watched || [];
  const body = `<div class="shelf-tabs" id="shelfTabs">
      <button class="active" data-tag="all">All ${GHIBLI.length}</button>
      <button data-tag="cozy">Cozy</button>
      <button data-tag="adventure">Adventure</button>
      <button data-tag="fantasy">Fantasy</button>
      <button data-tag="quiet">Quiet</button>
      <span class="seed-status">${watched.length} watched</span>
    </div>
    <div class="dvd-grid" id="dvdGrid">${GHIBLI.map((m, i) => `<button class="dvd-card ${watched.includes(i) ? 'watched' : ''}" data-film="${i}" data-tag="${m.tag}" style="--a:${m.palette[0]};--b:${m.palette[1]};--c:${m.palette[2]}"><span class="dvd-art"><b>${m.emoji}</b><i>${m.year}</i></span><span class="dvd-copy"><b>${m.title}</b><small>${m.blurb}</small></span></button>`).join('')}</div>
    <div class="modal-note">Every film on this shelf is a Studio Ghibli DVD. Pick one and the inflatable screen will hum to life.</div>`;
  shellModal({
    eyebrow: 'THE DVD SHELF · STUDIO GHIBLI',
    title: 'Choose tonight’s film',
    desc: game.place === 'backyard'
      ? 'Crickets, stars, and the big inflatable screen beside the stone fireplace.'
      : 'The cabin is warm, the screen is huge, and the best cushion is already taken by a cat.',
    body,
    foot: `Watching uses 1 energy · ${watched.length} of ${GHIBLI.length} films watched`,
    wide: true
  });
  const grid = $('#dvdGrid');
  const draw = tag => {
    grid.innerHTML = GHIBLI.map((m, i) => ({ m, i })).filter(({ m }) => tag === 'all' || m.tag === tag).map(({ m, i }) => `<button class="dvd-card ${watched.includes(i) ? 'watched' : ''}" data-film="${i}" data-tag="${m.tag}" style="--a:${m.palette[0]};--b:${m.palette[1]};--c:${m.palette[2]}"><span class="dvd-art"><b>${m.emoji}</b><i>${m.year}</i></span><span class="dvd-copy"><b>${m.title}</b><small>${m.blurb}</small></span></button>`).join('');
    bind();
  };
  const bind = () => {
    $$('#dvdGrid .dvd-card').forEach(btn => {
      btn.onclick = () => watchMovie(+btn.dataset.film);
    });
  };
  $$('#shelfTabs button').forEach(b => {
    b.onclick = () => {
      $$('#shelfTabs button').forEach(x => x.classList.toggle('active', x === b));
      draw(b.dataset.tag);
    };
  });
  bind();
}

function watchMovie(i) {
  const film = GHIBLI[i];
  if (!film) return;
  if (!spend(1)) return;
  const first = !game.watched.includes(i);
  if (first) game.watched.push(i);
  game.movie = i;
  game.stats.movies = (game.stats.movies || 0) + 1;
  game.time = 20;
  game.points += first ? 12 : 7;
  complete('movie');
  if (game.watched.length >= 3) announceAchievement('projectionist', 'Projectionist', 'Watched three Studio Ghibli films');
  if (game.watched.length >= 10) announceAchievement('cinephile', 'Little Cinephile', 'Watched ten Studio Ghibli films');
  const where = game.place === 'backyard' ? 'The backyard screen glows.' : 'The big inflatable screen glows beside the hearth.';
  toast(`Now showing: ${film.title} ${film.emoji} ${where} +${first ? 12 : 7} drops`);
  closeModal();
  save();
}

function openJournal(title = 'A page from your journal') {
  const season = getSeason();
  const watched = (game.watched || []).map(i => GHIBLI[i]?.title).filter(Boolean);
  const recent = watched.slice(-4).reverse();
  const plantTypes = [...new Set(game.plants.map(p => plantDef(p).name))];
  const body = `<div class="journal-grid">
    <div class="journal-card"><span>DAY</span><b>${game.day}</b><small>${season} · ${getWeather()}</small></div>
    <div class="journal-card"><span>GARDEN</span><b>${game.plants.length}/24</b><small>${readyPlants().length} ready · ${plantTypes.length} varieties</small></div>
    <div class="journal-card"><span>FILMS</span><b>${watched.length}/${GHIBLI.length}</b><small>${recent[0] || 'The shelf is waiting'}</small></div>
    <div class="journal-card"><span>COMPANIONS</span><b>${game.cats.length}</b><small>${game.cats.map(c => c.name).join(' · ')}</small></div>
  </div>
  <div class="journal-lists">
    <div><h4>Little things done</h4><p>${game.done.length ? game.tasks.filter(id => game.done.includes(id)).map(id => taskPool.find(t => t.id === id)?.name).join(' · ') : 'The day is still wide open.'}</p></div>
    <div><h4>Keepsakes</h4><p>${game.achievements.length ? game.achievements.join(' · ') : 'Your story is just beginning.'}</p></div>
    <div><h4>In the garden</h4><p>${plantTypes.length ? plantTypes.join(' · ') : 'Nothing planted yet — the seed tins are full of possibility.'}</p></div>
    <div><h4>Recently watched</h4><p>${recent.length ? recent.join(' · ') : 'No film nights yet. The inflatable screen is very patient.'}</p></div>
  </div>`;
  shellModal({
    eyebrow: 'YOUR LITTLE JOURNAL',
    title,
    desc: 'A few things you might like to remember.',
    body,
    foot: 'The quiet days count, too.',
    wide: true
  });
}
