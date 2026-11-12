/* Mosswood — content & save data */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const initial = {
  day: 3, points: 120, energy: 6, place: 'cabin', time: 9,
  inventory: { Egg: 2, Berries: 2, Herbs: 2, Beans: 2, Wood: 1, Seeds: 4 },
  cats: [{ name: 'Juniper', emoji: '🐈', mood: 'sleepy · a little nosy', quote: '“That mug looks suspiciously warm. I will investigate.”', hearts: 3 }],
  cat: 0, plants: [], tasks: [], done: [], streak: 3,
  unlocks: ['backyard'], furniture: [], visited: {},
  player: {}, stats: { recipes: 0, drinks: 0, harvests: 0, movies: 0 },
  achievements: [], watched: [], movie: null
};

const taskPool = [
  { id: 'breakfast', name: 'Make a little something', sub: 'Cook a recipe at home', reward: 20 },
  { id: 'garden', name: 'Check on the garden', sub: 'Plant, tend, or pick something', reward: 15 },
  { id: 'woods', name: 'Take the long way', sub: 'Find something in the woods', reward: 20 },
  { id: 'cat', name: 'Make a friend feel loved', sub: 'Spend time with your cat', reward: 15 },
  { id: 'fire', name: 'Gather for later', sub: 'Chop a little firewood', reward: 15 },
  { id: 'drink', name: 'A proper coffee break', sub: 'Make a specialty drink', reward: 15 },
  { id: 'movie', name: 'Make tonight special', sub: 'Watch a film on the big screen', reward: 20 }
];

const locations = {
  cabin: ['The cabin', 'FIRELIGHT, WARM DRINKS, A VERY BIG SCREEN', 'PINECONE CABIN', 'YOUR HOME, SWEET HOME', 'THE INFLATABLE SCREEN IS HUMMING SOFTLY'],
  garden: ['The garden', 'GROW A LITTLE SOMETHING', 'THE KITCHEN GARDEN', 'HERBS · VEGGIES · FRUIT', 'THE BEES KNOW THE WAY'],
  woods: ['The woods', 'A PATH WITH NO PARTICULAR PLACE TO BE', 'MOSSY TRAIL', 'TAKE THE LONG WAY HOME', 'WHO KNOWS WHAT YOU MIGHT FIND'],
  market: ['Fern & Fable', 'THE LITTLE VILLAGE MARKET', 'FERN & FABLE', 'A FEW GOOD THINGS, JUST A SHORT WALK AWAY', 'LOCAL GOODS · KIND PEOPLE'],
  backyard: ['The backyard', 'TONIGHT, THE STARS ARE THE CEILING', 'THE BACKYARD PICTURE SHOW', 'BIG SCREEN · STONE FIREPLACE', 'SLOW EVENINGS, WARM LIGHTS']
};

const itemEmoji = {
  Egg: '🥚', Berries: '🫐', Herbs: '🌿', Beans: '☕', Wood: '🪵', Seeds: '🌰',
  Tomato: '🍅', Carrot: '🥕', Apple: '🍎', 'Cat food': '🥣', Treats: '🍪',
  Catnip: '🌱', Milk: '🥛', Fish: '🐟', "S'mores": '🍡', Popcorn: '🍿',
  Mint: '🌿', Basil: '🌿', Rosemary: '🌿', Thyme: '🌿', Sage: '🌿', Lavender: '💜',
  Pumpkin: '🎃', Lettuce: '🥬', 'Bell pepper': '🫑', 'Snap pea': '🫛', Radish: '🌶️',
  Corn: '🌽', Zucchini: '🥒', Broccoli: '🥦', Strawberry: '🍓',
  Blueberry: '🫐', Raspberry: '🍒', Watermelon: '🍉', Melon: '🍈', Gooseberry: '🫐',
  Mushrooms: '🍄', Toys: '🐭'
};

/* Every plant: category, sprite type, grow time in days, harvest yield. */
const PLANTS = [
  { id: 'mint', name: 'Mint', cat: 'herb', kind: 'herb', emoji: '🌿', grow: 1, yield: 3, leaf: '#5d9b64', leaf2: '#8bc47b', accent: '#c4e5a2', blurb: 'Cool, bright leaves for tea and tall glasses.' },
  { id: 'basil', name: 'Basil', cat: 'herb', kind: 'herb', emoji: '🌿', grow: 1, yield: 3, leaf: '#4f8b50', leaf2: '#79b15e', accent: '#d5e7a4', blurb: 'Sweet, peppery leaves made for warm bread.' },
  { id: 'catnip', name: 'Catnip', cat: 'herb', kind: 'herb', emoji: '🌱', grow: 2, yield: 3, leaf: '#77a56c', leaf2: '#a0c483', accent: '#c8a6e8', blurb: 'A little garden luxury for a very good cat.' },
  { id: 'rosemary', name: 'Rosemary', cat: 'herb', kind: 'herb', emoji: '🌿', grow: 2, yield: 2, leaf: '#527f62', leaf2: '#77a67b', accent: '#b7d3ad', blurb: 'Rosemary for remembrance — and roast potatoes.' },
  { id: 'thyme', name: 'Thyme', cat: 'herb', kind: 'herb', emoji: '🌿', grow: 1, yield: 3, leaf: '#698c69', leaf2: '#96b78a', accent: '#d3dfb3', blurb: 'Tiny leaves that make a whole kitchen smell lovely.' },
  { id: 'sage', name: 'Sage', cat: 'herb', kind: 'herb', emoji: '🌿', grow: 2, yield: 2, leaf: '#7b9273', leaf2: '#a9b99a', accent: '#d7dfc7', blurb: 'Soft grey-green leaves with a generous spirit.' },
  { id: 'lavender', name: 'Lavender', cat: 'herb', kind: 'herb', emoji: '💜', grow: 3, yield: 3, leaf: '#718c72', leaf2: '#9aae8a', accent: '#b491d7', blurb: 'Tall purple spikes. The bees are already lining up.' },
  { id: 'tomato', name: 'Tomato', cat: 'veg', kind: 'bush', emoji: '🍅', grow: 2, yield: 3, leaf: '#5f8f56', leaf2: '#87b36c', accent: '#d95e45', blurb: 'Sun-warmed little tomatoes, still warm from the vine.' },
  { id: 'carrot', name: 'Carrot', cat: 'veg', kind: 'root', emoji: '🥕', grow: 2, yield: 3, leaf: '#6d9a5d', leaf2: '#9ac078', accent: '#e88a3f', blurb: 'Crunchy roots hiding under a ruff of green.' },
  { id: 'pumpkin', name: 'Pumpkin', cat: 'veg', kind: 'vine', emoji: '🎃', grow: 4, yield: 2, leaf: '#537f58', leaf2: '#86a969', accent: '#dc8e3e', blurb: 'A sprawling vine with a golden surprise underneath.' },
  { id: 'lettuce', name: 'Lettuce', cat: 'veg', kind: 'leafy', emoji: '🥬', grow: 1, yield: 3, leaf: '#78a85e', leaf2: '#a6c97d', accent: '#d1e5ae', blurb: 'A ruffled rosette, ready for the salad bowl.' },
  { id: 'pepper', name: 'Bell pepper', cat: 'veg', kind: 'bush', emoji: '🫑', grow: 3, yield: 2, leaf: '#55874f', leaf2: '#7eae62', accent: '#e0b84e', blurb: 'Glossy peppers that glow in the afternoon light.' },
  { id: 'pea', name: 'Snap pea', cat: 'veg', kind: 'tall', emoji: '🫛', grow: 3, yield: 3, leaf: '#6b9b5e', leaf2: '#94bf75', accent: '#b7d88d', blurb: 'Sweet pods climbing a little willow trellis.' },
  { id: 'radish', name: 'Radish', cat: 'veg', kind: 'root', emoji: '🌶️', grow: 1, yield: 4, leaf: '#6f9c60', leaf2: '#9ac07a', accent: '#d95d68', blurb: 'Quick, peppery, and very pleased with themselves.' },
  { id: 'corn', name: 'Corn', cat: 'veg', kind: 'tall', emoji: '🌽', grow: 3, yield: 2, leaf: '#6b9a4f', leaf2: '#9ac06c', accent: '#e8c75e', blurb: 'Tall green stalks that whisper in the wind.' },
  { id: 'zucchini', name: 'Zucchini', cat: 'veg', kind: 'bush', emoji: '🥒', grow: 2, yield: 3, leaf: '#5c8c54', leaf2: '#87b06d', accent: '#7f9f53', blurb: 'One plant is plenty. Two is a neighborhood event.' },
  { id: 'broccoli', name: 'Broccoli', cat: 'veg', kind: 'leafy', emoji: '🥦', grow: 2, yield: 2, leaf: '#557f54', leaf2: '#7da66c', accent: '#5c8f56', blurb: 'A little tree you can eat. The cat remains unimpressed.' },
  { id: 'strawberry', name: 'Strawberry', cat: 'fruit', kind: 'bush', emoji: '🍓', grow: 2, yield: 4, leaf: '#5d9258', leaf2: '#89b96e', accent: '#e04f4f', blurb: 'Sweet red berries tucked under a low green canopy.' },
  { id: 'blueberry', name: 'Blueberry', cat: 'fruit', kind: 'bush', emoji: '🫐', grow: 3, yield: 4, leaf: '#557f5c', leaf2: '#7ca47a', accent: '#5a6fb0', blurb: 'Dusky blue berries with a foggy morning flavor.' },
  { id: 'raspberry', name: 'Raspberry', cat: 'fruit', kind: 'bush', emoji: '🍒', grow: 3, yield: 3, leaf: '#628c58', leaf2: '#8fb474', accent: '#c75c75', blurb: 'Jewel-bright berries on arching canes.' },
  { id: 'watermelon', name: 'Watermelon', cat: 'fruit', kind: 'vine', emoji: '🍉', grow: 4, yield: 1, leaf: '#5c8a57', leaf2: '#89ad6a', accent: '#5f9d5a', blurb: 'A whole summer, hiding under one striped rind.' },
  { id: 'melon', name: 'Melon', cat: 'fruit', kind: 'vine', emoji: '🍈', grow: 4, yield: 1, leaf: '#638f5c', leaf2: '#91b878', accent: '#d9b96c', blurb: 'Fragrant and golden. Best eaten over the sink.' },
  { id: 'gooseberry', name: 'Gooseberry', cat: 'fruit', kind: 'bush', emoji: '🫐', grow: 2, yield: 4, leaf: '#5c865a', leaf2: '#87ad70', accent: '#a9c25c', blurb: 'Tart little lanterns on a prickly old bush.' }
];

const GHIBLI = [
  { title: 'Nausicaä of the Valley of the Wind', year: 1984, emoji: '🪁', tag: 'adventure', blurb: 'Windswept valleys, giant insects, and a brave heart.', palette: ['#6e8f7c', '#c9b98a', '#e6d7a8'] },
  { title: 'Castle in the Sky', year: 1986, emoji: '☁️', tag: 'adventure', blurb: 'A floating city, sky pirates, and one bright blue stone.', palette: ['#7aa6bb', '#d5d9a8', '#f0e5b4'] },
  { title: 'My Neighbor Totoro', year: 1988, emoji: '🌳', tag: 'cozy', blurb: 'Rain, a country house, and a very large friend.', palette: ['#799f6a', '#cfd98b', '#f2e2a6'] },
  { title: 'Grave of the Fireflies', year: 1988, emoji: '🪰', tag: 'quiet', blurb: 'A tender, heartbreaking story of two siblings.', palette: ['#5b4c4c', '#b58a6c', '#e6c58d'] },
  { title: "Kiki's Delivery Service", year: 1989, emoji: '🧹', tag: 'cozy', blurb: 'A seaside town, a black cat, and a brand-new broom.', palette: ['#7fa9ba', '#d8c9a1', '#f2dfad'] },
  { title: 'Only Yesterday', year: 1991, emoji: '🌾', tag: 'quiet', blurb: 'Country fields, old memories, and a slower kind of summer.', palette: ['#86a27a', '#d9c89a', '#f0ddb0'] },
  { title: 'Porco Rosso', year: 1992, emoji: '🛩️', tag: 'adventure', blurb: 'Adriatic skies, red seaplanes, and a gentleman pig.', palette: ['#6b96b1', '#d7b98f', '#f2d59e'] },
  { title: 'Ocean Waves', year: 1993, emoji: '🌊', tag: 'quiet', blurb: 'Salt air, school days, and feelings that arrive late.', palette: ['#6f9bb0', '#c4cfae', '#ecd9b2'] },
  { title: 'Pom Poko', year: 1994, emoji: '🦝', tag: 'fantasy', blurb: 'Mischievous tanuki, moonlit parades, and a changing valley.', palette: ['#6f8a62', '#c7b17d', '#ebd39a'] },
  { title: 'Whisper of the Heart', year: 1995, emoji: '✍️', tag: 'quiet', blurb: 'A library, an antique shop, and a song taking shape.', palette: ['#8a9b83', '#d6c6a2', '#f0dfb5'] },
  { title: 'Princess Mononoke', year: 1997, emoji: '🐺', tag: 'fantasy', blurb: 'Forest gods, iron towns, and a wolf at your side.', palette: ['#58745f', '#b8a06a', '#dfc98e'] },
  { title: 'My Neighbors the Yamadas', year: 1999, emoji: '🎋', tag: 'cozy', blurb: 'Everyday family chaos, drawn like a gentle comic strip.', palette: ['#8fa479', '#d8d39c', '#f0e7ba'] },
  { title: 'Spirited Away', year: 2001, emoji: '🏮', tag: 'fantasy', blurb: 'A bathhouse for spirits and a girl finding her courage.', palette: ['#8b5b57', '#d0906a', '#f0c88c'] },
  { title: 'The Cat Returns', year: 2002, emoji: '🐈', tag: 'fantasy', blurb: 'A very polite cat kingdom and one unexpected detour.', palette: ['#9b8a6b', '#d8bd91', '#f2ddb1'] },
  { title: "Howl's Moving Castle", year: 2004, emoji: '🏰', tag: 'fantasy', blurb: 'A walking castle, a fire demon, and a cursed hatmaker.', palette: ['#6d8a8c', '#c9aa83', '#ecd29b'] },
  { title: 'Tales from Earthsea', year: 2006, emoji: '🐉', tag: 'fantasy', blurb: 'Dragons, dry plains, and a long road toward balance.', palette: ['#7b7a63', '#bbaa7c', '#dfd0a0'] },
  { title: 'Ponyo', year: 2008, emoji: '🐠', tag: 'cozy', blurb: 'A goldfish princess, a stormy sea, and a little red bucket.', palette: ['#5e9ab3', '#9ec7b7', '#f1d6a4'] },
  { title: 'Arrietty', year: 2010, emoji: '🌼', tag: 'cozy', blurb: 'Borrowers under the floorboards and a garden in bloom.', palette: ['#7b9c6f', '#c8d49a', '#ead9ae'] },
  { title: 'From Up on Poppy Hill', year: 2011, emoji: '🚩', tag: 'quiet', blurb: 'A harbor town, a school clubhouse, and a daily flag.', palette: ['#7699a2', '#c2c6a2', '#e9d7ae'] },
  { title: 'The Wind Rises', year: 2013, emoji: '✈️', tag: 'quiet', blurb: 'Blue skies, beautiful machines, and a gentle love story.', palette: ['#7fa7bd', '#d0c5a0', '#efe0b3'] },
  { title: 'The Tale of the Princess Kaguya', year: 2013, emoji: '🌙', tag: 'fantasy', blurb: 'Charcoal lines, bamboo, and a princess from the moon.', palette: ['#a18f7c', '#d8c7a7', '#f3e5c8'] },
  { title: 'When Marnie Was There', year: 2014, emoji: '🏚️', tag: 'quiet', blurb: 'A marsh house, a mysterious friend, and the seaside.', palette: ['#7d99a0', '#cabf9d', '#e9dcb8'] },
  { title: 'The Red Turtle', year: 2016, emoji: '🐢', tag: 'quiet', blurb: 'Wordless waves, a desert island, and a strange visitor.', palette: ['#6d97a0', '#c8b889', '#ecd7a1'] },
  { title: 'Earwig and the Witch', year: 2020, emoji: '🧹', tag: 'fantasy', blurb: 'A curious girl, a strange house, and a talking cat.', palette: ['#7c7f92', '#c7b49a', '#e9d6b5'] },
  { title: 'The Boy and the Heron', year: 2023, emoji: '🕊️', tag: 'fantasy', blurb: 'A tower, a heron, and a world between worlds.', palette: ['#557a83', '#b89375', '#e5c58f'] }
];

const recipes = [
  { name: 'Wild berry pancakes', emoji: '🥞', desc: 'Fluffy, with garden berries & a drizzle of honey.', cost: { Egg: 1, Berries: 1 }, reward: 24, task: 'breakfast' },
  { name: 'Herby garden omelette', emoji: '🍳', desc: 'Eggs folded with whatever is growing.', cost: { Egg: 1, Herbs: 1 }, reward: 18, task: 'breakfast' },
  { name: 'Tomato basil toast', emoji: '🍞', desc: 'Ripe tomato, torn basil, and a little olive oil.', cost: { Tomato: 1, Basil: 1 }, reward: 22, task: 'breakfast' },
  { name: 'Mint & pea bowl', emoji: '🥗', desc: 'Sweet peas, cool mint, and a handful of leaves.', cost: { 'Snap pea': 1, Mint: 1, Lettuce: 1 }, reward: 24, task: 'breakfast' },
  { name: 'Pumpkin soup', emoji: '🥣', desc: 'Velvety pumpkin with oat milk and a swirl of cream.', cost: { Pumpkin: 1, Milk: 1 }, reward: 28, task: 'breakfast' },
  { name: 'Strawberry shortcake', emoji: '🍰', desc: 'Soft cake, garden strawberries, and far too much cream.', cost: { Strawberry: 2, Egg: 1 }, reward: 30, task: 'breakfast' },
  { name: 'Blueberry crumble', emoji: '🫐', desc: 'Warm berries under a buttery crumb.', cost: { Blueberry: 2, Berries: 1 }, reward: 26, task: 'breakfast' },
  { name: 'Campfire berry hand pie', emoji: '🥧', desc: 'A tiny pie with warm berries and wild herbs.', cost: { Berries: 2, Herbs: 1 }, reward: 28, task: 'breakfast' }
];

const stock = {
  supplies: [
    ['🥚', 'Farm eggs', 'A half-dozen from the neighbor’s hens.', 12, { Egg: 3 }],
    ['🫐', 'Wild blueberries', 'Picked just up the ridge.', 10, { Berries: 3 }],
    ['☕', 'Coffee beans', 'Dark roast from a kind local.', 16, { Beans: 3 }],
    ['🥛', 'Oat milk', 'For something lovely over ice.', 9, { Milk: 2 }],
    ['🐟', 'Little fish', 'For a new friend in the ferns.', 18, { Fish: 1 }],
    ['🌿', 'Garden herbs', 'A fragrant little bundle.', 8, { Herbs: 3 }],
    ['🥣', 'Cat supper', 'A wholesome pantry staple.', 14, { 'Cat food': 2 }],
    ['🌰', 'Seed packet', 'A surprise mix for your beds.', 10, { Seeds: 4 }],
    ['🍪', 'Salmon treats', 'A tiny treat for a very good cat.', 12, { Treats: 2 }],
    ['🐭', 'Catnip mouse', 'A crinkly little toy for an energetic friend.', 18, { Toys: 1 }],
    ['🌱', 'Catnip seeds', 'For a happy garden cat.', 10, { Catnip: 2 }],
    ['🍿', 'Popcorn kit', 'A paper bag of kernels and silly amounts of butter.', 8, { Popcorn: 2 }]
  ],
  plants: [
    ['🌿', 'Herb seed tin', 'Mint, basil, thyme, sage & friends.', 14, { Seeds: 6 }],
    ['🥕', 'Veggie seed tin', 'Roots, greens, and something for the stew pot.', 14, { Seeds: 6 }],
    ['🍓', 'Fruit seed tin', 'Berries, melons, and other sweet ambitions.', 16, { Seeds: 6 }],
    ['🌱', 'Catnip packet', 'A garden luxury for your companion.', 10, { Catnip: 2 }],
    ['🌰', 'Heirloom seed box', 'A generous box of this season’s best.', 26, { Seeds: 12 }]
  ],
  home: [
    ['🪴', 'Fern wall shelf', 'A tiny home for a little plant.', 55, 'Fern wall shelf'],
    ['✨', 'String lights', 'A warm twinkle for slow evenings.', 70, 'String lights'],
    ['🪑', 'Wicker reading chair', 'The perfect rainy-day corner.', 80, 'Wicker chair'],
    ['🛋️', 'Floor cushions', 'Extra-soft seating for the very front row.', 45, 'Floor cushions'],
    ['🍿', 'Popcorn cart', 'A little cart that makes movie nights official.', 65, 'Popcorn cart'],
    ['🖼️', 'Ghibli poster wall', 'Framed hand-drawn worlds above the screen.', 60, 'Ghibli posters']
  ],
  cats: [
    ['🐈‍⬛', 'Meet Pepper', 'A shy friend with a brave little heart.', 40, 'cat']
  ]
};

function pickTasks() {
  return [...taskPool].sort(() => Math.random() - 0.5).slice(0, 3).map(t => t.id);
}

function plantDef(p) {
  if (!p) return PLANTS[0];
  return PLANTS.find(x => x.id === p.id) || PLANTS.find(x => x.name === p.name) || PLANTS[0];
}

function plantReady(p) {
  if (!p) return false;
  return game.day >= (p.ready || p.day || game.day + 1);
}

function readyPlants() {
  return game.plants.filter(plantReady);
}

function movieDef() {
  return typeof game.movie === 'number' ? GHIBLI[game.movie] : null;
}

let game;
try {
  const saved = JSON.parse(localStorage.getItem('mosswood-save') || '{}');
  game = { ...initial, ...saved };
  game.inventory = { ...initial.inventory, ...(game.inventory || {}) };
  game.cats = game.cats && game.cats.length ? game.cats : initial.cats;
  game.done = game.done || [];
  game.unlocks = [...new Set([...(game.unlocks || []), 'backyard'])];
  game.furniture = game.furniture || [];
  game.watched = game.watched || [];
  game.achievements = game.achievements || [];
  game.stats = { ...initial.stats, ...(game.stats || {}) };
  game.player = game.player || {};
  game.plants = (game.plants || []).map((p, i) => {
    if (p.id) return p;
    const def = PLANTS.find(x => x.name === p.name) || PLANTS[0];
    return { id: def.id, planted: Math.max(1, (p.day || game.day) - def.grow), ready: p.day || game.day + def.grow, slot: i };
  });
  if (typeof game.movie !== 'number') game.movie = null;
} catch (e) {
  game = { ...initial, inventory: { ...initial.inventory }, cats: [...initial.cats], tasks: pickTasks(), done: [] };
}
if (!game.tasks || !game.tasks.length) game.tasks = pickTasks();

function save() {
  localStorage.setItem('mosswood-save', JSON.stringify(game));
  if (typeof renderUI === 'function') renderUI();
}
