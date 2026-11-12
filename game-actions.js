/* Mosswood — kitchen, woods, market & daily actions */

function kitchenModal(title, subtitle, body) {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop"><section class="modal kitchen-modal" role="dialog" aria-modal="true">
    <div class="modal-top"><div><div class="eyebrow">A HANDS-ON LITTLE RITUAL</div><h2>${title}</h2><p>${subtitle}</p></div><button class="modal-close" aria-label="Close">×</button></div>
    <div class="kitchen-content">${body}</div>
    <div class="modal-foot"><span>Take your time. You can close this whenever you like.</span><strong>✦ ${game.points} drops</strong></div>
  </section></div>`;
  $('#modalRoot .modal-close').onclick = closeModal;
  $('#modalRoot .modal-backdrop').onclick = e => { if (e.target.classList.contains('modal-backdrop')) closeModal(); };
}

function startKitchenGame(kind, recipe) {
  const espresso = kind === 'espresso';
  const drink = kind === 'drink';
  const state = { step: 0, prep: 0, bar: 0, direction: 1, started: false, quality: 0 };
  const stages = espresso
    ? ['Grind the beans', 'Tamp the grounds', 'Pull the espresso']
    : drink
      ? ['Warm the water', 'Steep the leaves', 'Pour it slowly']
      : ['Gather your ingredients', 'Prepare the batter', 'Cook it just right'];
  const subs = espresso
    ? ['Tap the grinder three times for a fine, even grind.', 'Press down once to tamp your coffee bed.', 'Stop the pour while the marker is in the green zone.']
    : drink
      ? ['Tap the kettle three times to bring the water up to temperature.', 'Tap the pot three times and let the leaves open.', 'Stop the pour while the marker is in the green zone.']
      : ['Tap each ingredient to set it on the counter.', 'Stir the bowl three times until the batter is smooth.', 'Stop the pan while the marker is in the green zone.'];
  function show() {
    const step = state.step;
    let content = '';
    if (step < 2) {
      const needed = espresso && step === 1 ? 1 : 3;
      content = `<div class="ritual-scene"><span>${espresso ? ['☕', '⚙️', '🫘'][step] : drink ? ['🫖', '🌿', '🫗'][step] : recipe.emoji}</span></div>
        <p class="ritual-instruction">${stages[step]}</p>
        <p class="ritual-sub">${subs[step]}</p>
        <div class="prep-dots">${Array.from({ length: needed }, (_, i) => `<i class="${i < state.prep ? 'filled' : ''}"></i>`).join('')}</div>
        <button class="ritual-button" id="ritualNext">${state.prep >= needed ? 'Continue →' : 'Tap to prepare'}</button>`;
    } else if (step === 2) {
      content = `<div class="ritual-scene"><span>${espresso ? '☕' : drink ? '🫖' : '🍳'}</span></div>
        <p class="ritual-instruction">${espresso ? 'Find the sweet spot' : drink ? 'A patient pour' : 'A little golden, not too long'}</p>
        <p class="ritual-sub">Press <b>Stop</b> while the marker is in the green zone.</p>
        <div class="timing-track"><i class="sweet-spot"></i><span id="timingMarker" style="left:0%"></span></div>
        <button class="ritual-button" id="ritualStop">${espresso ? 'Stop the pour' : drink ? 'Stop the pour' : 'Take it off the heat'}</button>`;
    } else {
      content = `<div class="ritual-scene"><span>${espresso ? '🧋' : drink ? '🫖' : recipe.emoji}</span></div>
        <p class="ritual-instruction">${state.quality >= 2 ? 'Lovely timing!' : 'Made with care'}</p>
        <p class="ritual-sub">${espresso ? 'Silky, fragrant, and ready to enjoy.' : recipe.name + ' is ready' + (kind === 'cook' ? ', with a little portion for your companion.' : '.')}</p>
        <button class="ritual-button" id="ritualServe">Serve it up ♡</button>`;
    }
    kitchenModal(recipe.name, `STEP ${Math.min(step + 1, 3)} OF 3 · ${stages[Math.min(step, 2)]}`, content);
    if (step < 2) {
      $('#ritualNext').onclick = () => {
        const needed = espresso && step === 1 ? 1 : 3;
        if (state.prep < needed) { state.prep++; show(); }
        else { state.step++; state.prep = 0; show(); }
      };
    } else if (step === 2) {
      const marker = $('#timingMarker');
      const timer = setInterval(() => {
        if (!marker || !marker.isConnected) { clearInterval(timer); return; }
        state.bar += state.direction * 2.7;
        if (state.bar >= 100 || state.bar <= 0) state.direction *= -1;
        marker.style.left = `${state.bar}%`;
      }, 28);
      $('#ritualStop').onclick = () => {
        clearInterval(timer);
        state.quality = state.bar >= 40 && state.bar <= 64 ? 3 : state.bar >= 25 && state.bar <= 78 ? 2 : 1;
        state.step = 3;
        show();
      };
    } else {
      $('#ritualServe').onclick = () => finishKitchenGame(kind, recipe, state.quality);
    }
  }
  show();
}

function finishKitchenGame(kind, recipe, quality) {
  if (!spend()) { closeModal(); return; }
  consume(recipe.cost || {});
  const reward = (recipe.reward || 12) + quality * 2;
  game.points += reward;
  if (kind === 'cook') {
    game.inventory['Cat food'] = (game.inventory['Cat food'] || 0) + 1;
    game.stats.recipes = (game.stats.recipes || 0) + 1;
    if (game.stats.recipes >= 5) announceAchievement('homecook', 'Home Kitchen', 'Made five recipes');
  } else {
    game.stats.drinks = (game.stats.drinks || 0) + 1;
    if (game.stats.drinks >= 5) announceAchievement('barista', 'Little Barista', 'Made five specialty drinks');
  }
  if (recipe.task) complete(recipe.task);
  const extra = kind === 'cook' ? ` A little portion is saved for ${game.cats[game.cat].name}.` : '';
  toast(`${recipe.name} is ready!${extra} +${reward} drops`);
  closeModal();
  save();
}

function cook() {
  openModal('What sounds good?', 'Choose a recipe, then make it with your own hands.', recipes.map(r => ({
    emoji: r.emoji,
    name: r.name,
    desc: r.desc,
    cost: canPay(r.cost) ? Object.entries(r.cost).map(([k, v]) => `${v} ${k}`).join(' · ') : 'Need ' + Object.keys(r.cost).filter(k => (game.inventory[k] || 0) < r.cost[k]).join(', '),
    disabled: !canPay(r.cost),
    run: () => { closeModal(); startKitchenGame('cook', r); }
  })), 'Gather ingredients · prepare · watch the pan. Cooking uses 1 energy when you serve.');
}

function drink() {
  const options = [
    { emoji: '🧋', name: 'Honey oat iced espresso', desc: 'Grind, tamp, and pull a silky little shot.', cost: { Beans: 1 }, reward: 16, task: 'drink', kind: 'espresso' },
    { emoji: '☕', name: 'Pour-over, slow & easy', desc: 'A warm cup for a thoughtful morning.', cost: { Beans: 1 }, reward: 12, task: 'drink', kind: 'espresso' },
    { emoji: '🫖', name: 'Fresh mint tea', desc: 'Garden mint, hot water, and a little quiet.', cost: { Mint: 1 }, reward: 14, task: 'drink', kind: 'drink' },
    { emoji: '🫐', name: 'Blueberry iced tea', desc: 'Cold-steeped berries with a sprig of mint.', cost: { Blueberry: 1, Mint: 1 }, reward: 18, task: 'drink', kind: 'drink' }
  ];
  openModal('A little drink ritual', 'A specialty drink, one small step at a time.', options.map(r => ({
    emoji: r.emoji,
    name: r.name,
    desc: r.desc,
    cost: canPay(r.cost) ? Object.entries(r.cost).map(([k, v]) => `${v} ${k}`).join(' · ') : 'Need ' + Object.keys(r.cost).filter(k => (game.inventory[k] || 0) < r.cost[k]).join(', '),
    disabled: !canPay(r.cost),
    run: () => { closeModal(); startKitchenGame(r.kind, r); }
  })));
}

function chop() {
  openModal('A little wood for later', 'The chopping block is dry. One good bundle is plenty.', [{
    emoji: '🪓', name: 'Chop a bundle of firewood', desc: 'Good for the hearth or the backyard fireplace.', cost: '1 energy',
    run: () => {
      if (!spend()) return;
      game.inventory.Wood = (game.inventory.Wood || 0) + 2;
      complete('fire');
      toast('Two neat bundles for the woodpile.');
      closeModal();
      save();
    }
  }]);
}

function forage() {
  openModal('A walk in the woods', 'You tuck your hands into your pockets and follow the mossy path.', [
    {
      emoji: '🍄', name: 'Follow the fern trail', desc: 'Look for berries, herbs, mushrooms, and other forest treasures.', cost: '1 energy',
      run: () => {
        if (!spend()) return;
        const finds = [['Berries', 2], ['Herbs', 2], ['Apple', 1], ['Mushrooms', 2], ['Mint', 2], ['Blueberry', 2], ['Catnip', 1], ['Sticks', 2]];
        const [n, q] = finds[Math.floor(Math.random() * finds.length)];
        game.inventory[n] = (game.inventory[n] || 0) + q;
        complete('woods');
        toast(`You found ${q} ${n.toLowerCase()}! 🌿`);
        closeModal();
        save();
      }
    },
    {
      emoji: '🪵', name: 'Gather fallen branches', desc: 'Only take what the forest has already let go.', cost: '1 energy',
      run: () => {
        if (!spend()) return;
        game.inventory.Wood = (game.inventory.Wood || 0) + 1;
        complete('woods');
        toast('One good dry branch for the firewood pile.');
        closeModal();
        save();
      }
    }
  ]);
}

function explore() {
  if (game.cats.length < 2 && game.day >= 3) {
    openModal('A tiny rustle in the ferns', 'A little black cat watches you from the path. They look cautious, but curious.', [{
      emoji: '🐈‍⬛', name: 'Leave a little fish nearby', desc: 'Give this shy newcomer a reason to trust you.', cost: canPay({ Fish: 1 }) ? '1 fish' : 'Find or buy fish first',
      disabled: !canPay({ Fish: 1 }),
      run: () => {
        if (!spend()) return;
        consume({ Fish: 1 });
        game.cats.push({ name: 'Pepper', emoji: '🐈‍⬛', mood: 'shy · secretly a sweetheart', quote: '“I was only here for the fish. And perhaps your company.”', hearts: 1 });
        complete('woods');
        toast('Pepper has decided to come home with you! 🖤');
        closeModal();
        save();
      }
    }], 'New friends arrive when they are ready.');
    return;
  }
  openModal('A tiny rustle in the ferns', 'You hear something between the roots. Maybe a friend, maybe just a very determined squirrel.', [
    {
      emoji: '🐾', name: 'Leave a little snack', desc: 'A gentle hello, with no pressure to stay.', cost: canPay({ 'Cat food': 1 }) ? '1 cat meal' : 'Make a meal at home first',
      disabled: !canPay({ 'Cat food': 1 }),
      run: () => {
        if (!spend()) return;
        consume({ 'Cat food': 1 });
        game.cats[game.cat].hearts = Math.min(5, game.cats[game.cat].hearts + 1);
        toast('A small pawprint by the trail. Someone appreciated that.');
        complete('woods');
        closeModal();
        save();
      }
    },
    {
      emoji: '🌿', name: 'Sit and listen', desc: 'The forest does not need anything from you today.', cost: '1 energy',
      run: () => {
        if (!spend()) return;
        game.inventory.Herbs = (game.inventory.Herbs || 0) + 1;
        toast('You sit until the birds come back. One bundle of wild herbs.');
        complete('woods');
        closeModal();
        save();
      }
    }
  ]);
}

function shop(type) {
  const heading = { supplies: 'Pantry & little essentials', plants: 'Seeds & garden starts', home: 'Make it feel like yours', cats: 'A new friend, in their own time' }[type];
  const desc = type === 'plants'
    ? 'Every packet is a small promise. Plant them in the garden and give them a few days.'
    : 'A small village shop with thoughtful things. The shopkeeper always says to come back soon.';
  openModal(heading, desc, stock[type].map(([emoji, name, description, cost, item]) => {
    const owned = typeof item === 'string' && game.furniture.includes(item);
    const hasCat = item === 'cat' && game.cats.some(c => c.name === 'Pepper');
    return {
      emoji, name, desc: description,
      cost: owned || hasCat ? 'Already yours' : `${cost} ✦`,
      disabled: owned || hasCat || game.points < cost,
      run: () => {
        if (game.points < cost) return toast('A few more dew drops needed. Try a little task!');
        game.points -= cost;
        if (item === 'cat') {
          game.cats.push({ name: 'Pepper', emoji: '🐈‍⬛', mood: 'shy · secretly a sweetheart', quote: '“I was only here for the fish. And perhaps your company.”', hearts: 1 });
          toast('Pepper has found a home with you! 🖤');
        } else if (typeof item === 'string') {
          game.furniture.push(item);
          toast(`${name} is right at home!`);
        } else {
          Object.entries(item).forEach(([k, v]) => game.inventory[k] = (game.inventory[k] || 0) + v);
          toast(`${name} added to your bag!`);
        }
        closeModal();
        save();
      }
    };
  }), 'The market restocks every morning · dew drops are earned by being here.');
}

function fire() {
  if (!canPay({ Wood: 1 })) return toast('You need a bundle of firewood first.');
  if (!spend()) return;
  consume({ Wood: 1 });
  toast(game.place === 'cabin' ? 'The hearth crackles. The whole room turns golden. 🔥' : 'The stone fireplace glows. The stars come out. 🔥');
  save();
}

function smores() {
  if (!canPay({ Berries: 1 })) return toast('Pick up some berries for campfire s’mores!');
  if (!spend()) return;
  consume({ Berries: 1 });
  game.inventory["S'mores"] = (game.inventory["S'mores"] || 0) + 2;
  toast('Two gooey berry s’mores, one for each of you. 🍡');
  save();
}

function decorate() { shop('home'); }

function petAction(type) {
  const cat = game.cats[game.cat];
  if (type === 'feed') {
    const food = game.inventory['Cat food'] ? 'Cat food' : game.inventory.Fish ? 'Fish' : game.inventory.Treats ? 'Treats' : null;
    if (!food) {
      openModal('A hungry little friend', 'You are out of cat snacks. Cook something in the cabin, or pick up a treat at Fern & Fable.', [
        { emoji: '🍳', name: 'Head to the kitchen', desc: 'Make a meal to share.', run: () => { closeModal(); go('cabin'); cook(); } },
        { emoji: '🧺', name: 'Visit the village market', desc: 'Pick out something special.', run: () => { closeModal(); go('market'); shop('supplies'); } }
      ]);
      return;
    }
    game.inventory[food]--;
    cat.hearts = Math.min(5, cat.hearts + 1);
    cat.mood = 'content · very well fed';
    cat.quote = '“I have always liked you. I was just being subtle.”';
    toast(`${cat.name} is very pleased with the ${food.toLowerCase()}!`);
    complete('cat');
    save();
  } else if (type === 'play') {
    if (game.inventory.Catnip) {
      game.inventory.Catnip--;
      cat.hearts = Math.min(5, cat.hearts + 1);
      cat.mood = 'giddy · deeply suspicious of the rug';
      cat.quote = '“The rug moved. I saw it. I am completelyfine.”';
      toast(`${cat.name} rolls through the catnip, absolutely delighted.`);
      complete('cat');
      save();
      return;
    }
    if (game.inventory.Toys) {
      game.inventory.Toys--;
      cat.hearts = Math.min(5, cat.hearts + 1);
      cat.mood = 'playful · victorious';
      cat.quote = '“The mouse never stood a chance.”';
      toast(`${cat.name} has defeated the catnip mouse again.`);
      complete('cat');
      save();
      return;
    }
    openModal('A playful little afternoon', 'Your cat would love a toy. Fern & Fable has a few, or maybe a crinkly leaf will do.', [
      { emoji: '🍂', name: 'Play with a fallen leaf', desc: 'The simplest things are the most fun.', cost: '1 energy', run: () => { if (!spend()) return; cat.hearts = Math.min(5, cat.hearts + 1); cat.mood = 'playful · delightfully distracted'; toast(`${cat.name} pounced on the leaf. You are both very proud.`); complete('cat'); closeModal(); save(); } },
      { emoji: '🧺', name: 'Look for a proper toy', desc: 'Visit Fern & Fable for a catnip mouse.', run: () => { closeModal(); go('market'); shop('supplies'); } }
    ]);
  } else {
    cat.hearts = Math.min(5, cat.hearts + 1);
    cat.mood = 'purring · right where they belong';
    cat.quote = '“I am absolutely not purring. That is the floorboards.”';
    toast(`${cat.name} leans into your hand. ♡`);
    complete('cat');
    save();
  }
}

function rest() {
  game.day++;
  game.energy = 6;
  game.time = 8;
  game.done = [];
  game.tasks = pickTasks();
  game.visited = {};
  if (game.day % 7 === 0) game.streak++;
  if (getWeather() === 'soft rain') {
    game.plants.forEach(p => { p.ready = Math.max(game.day, (p.ready || game.day) - 1); });
  }
  if (game.furniture.includes('Popcorn cart')) game.inventory.Popcorn = (game.inventory.Popcorn || 0) + 2;
  toast(`Day ${game.day}. The kettle is on, and the light is lovely. ☀`);
  go('cabin');
  save();
}

function tend() {
  if (!spend()) return;
  game.plants.forEach(p => { p.ready = Math.max(game.day, (p.ready || game.day) - 1); });
  game.inventory.Herbs = (game.inventory.Herbs || 0) + 1;
  complete('garden');
  toast('You pulled a few weeds, watered the beds, and snipped some herbs 🌿');
  save();
}

function gardenMenu() {
  openModal('A little garden time', 'Choose a gentle thing to do among the beds.', [
    { emoji: '🌰', name: 'Plant seeds', desc: 'Herbs, veggies, and fruit — 23 kinds to choose from.', run: () => { closeModal(); plant(); } },
    { emoji: '🧺', name: 'Harvest', desc: 'Gather anything that is ready.', run: () => { closeModal(); harvest(); } },
    { emoji: '🌿', name: 'Tend the beds', desc: 'Pull weeds, water, and gather fresh herbs.', run: () => { closeModal(); tend(); } },
    { emoji: '🧺', name: 'Seed shop', desc: 'Pick up more seed tins at Fern & Fable.', run: () => { closeModal(); go('market'); shop('plants'); } }
  ]);
}
