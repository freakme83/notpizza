/* you are not pizza — top-down pizzeria sim (phase 4: nearest-waiter, garbage, fast waiter, pay animation) */
(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const startScreen = document.getElementById('start');
  const hireMenu = document.getElementById('hireMenu');
  const gameControls = document.getElementById('gameControls');
  const pauseBtn = document.getElementById('pauseBtn');
  const officeButtonTitle = document.getElementById('officeButtonTitle');
  const officeButtonHint = document.getElementById('officeButtonHint');
  const officeBadge = document.getElementById('officeBadge');
  const upgradeNotice = document.getElementById('upgradeNotice');
  const restartBtn = document.getElementById('restartBtn');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const staffNotice = document.getElementById('staffNotice');
  const staffNoticeText = document.getElementById('staffNoticeText');
  const staffRoster = document.getElementById('staffRoster');
  const staffNoticeClose = document.getElementById('staffNoticeClose');
  const staffRehireBtn = document.getElementById('staffRehireBtn');
  const hireSummary = document.getElementById('hireSummary');
  const hireToast = document.getElementById('hireToast');
  const officeTabs = [...document.querySelectorAll('[data-office-tab]')];
  const officePanes = [...document.querySelectorAll('[data-office-pane]')];
  const restartConfirm = document.getElementById('restartConfirm');
  const restartCancelX = document.getElementById('restartCancelX');
  const restartCancelBtn = document.getElementById('restartCancelBtn');
  const restartConfirmBtn = document.getElementById('restartConfirmBtn');
  const breakdownPopup = document.getElementById('breakdownPopup');
  const breakdownTitle = document.getElementById('breakdownTitle');
  const breakdownDetails = document.getElementById('breakdownDetails');
  const breakdownClose = document.getElementById('breakdownClose');
  const regularServiceBtn = document.getElementById('regularServiceBtn');
  const fastServiceBtn = document.getElementById('fastServiceBtn');
  const ingredientDropdown = document.getElementById('ingredientDropdown');
  const ingredientToggle = document.getElementById('ingredientToggle');
  const ingredientOptions = document.getElementById('ingredientOptions');
  const drinkDropdown = document.getElementById('drinkDropdown');
  const drinkToggle = document.getElementById('drinkToggle');
  const drinkOptions = document.getElementById('drinkOptions');
  const dessertDropdown = document.getElementById('dessertDropdown');
  const dessertToggle = document.getElementById('dessertToggle');
  const dessertOptions = document.getElementById('dessertOptions');
  const shiftReport = document.getElementById('shiftReport');
  const reportTitle = document.getElementById('reportTitle');
  const reportStats = document.getElementById('reportStats');
  const shopBudget = document.getElementById('shopBudget');
  const doughUpgradeBtn = document.getElementById('doughUpgrade');
  const ovenUpgradeBtn = document.getElementById('ovenUpgrade');
  const ovenCapacityUpgradeBtn = document.getElementById('ovenCapacityUpgrade');
  const tableUpgradeBtn = document.getElementById('tableUpgrade');
  const sodaUpgradeBtn = document.getElementById('sodaUpgrade');
  const staffDiscountUpgradeBtn = document.getElementById('staffDiscountUpgrade');
  const jukeboxUpgradeBtn = document.getElementById('jukeboxUpgrade');
  const iceCreamUpgradeBtn = document.getElementById('iceCreamUpgrade');
  const sundaeSpeedUpgradeBtn = document.getElementById('sundaeSpeedUpgrade');
  const milkshakeUnlockBtn = document.getElementById('milkshakeUnlock');
  const milkshakeSpeedUpgradeBtn = document.getElementById('milkshakeSpeedUpgrade');
  const nextShiftBtn = document.getElementById('nextShiftBtn');
  const recipeButtons = [...document.querySelectorAll('.recipe-choice')];
  const W = 960, H = 620;
  const PLAYER_SPRITE_CELL = 313;
  const playerSprite = new Image();
  let playerSpriteReady = false;
  playerSprite.addEventListener('load', () => { playerSpriteReady = true; });
  playerSprite.addEventListener('error', () => { playerSpriteReady = false; });
  playerSprite.src = 'assets/player-sprite-sheet-v2.png';
  const floorTiles = new Image();
  let floorTilesReady = false;
  floorTiles.addEventListener('load', () => { floorTilesReady = true; });
  floorTiles.addEventListener('error', () => { floorTilesReady = false; });
  floorTiles.src = 'assets/floor-tiles-v1.png';
  const jukeboxSprite = new Image();
  let jukeboxSpriteReady = false;
  jukeboxSprite.addEventListener('load', () => { jukeboxSpriteReady = true; });
  jukeboxSprite.addEventListener('error', () => { jukeboxSpriteReady = false; });
  jukeboxSprite.src = 'assets/jukebox-sprite-v1.png';
  const ovenSprite = new Image();
  let ovenSpriteReady = false;
  ovenSprite.addEventListener('load', () => { ovenSpriteReady = true; });
  ovenSprite.addEventListener('error', () => { ovenSpriteReady = false; });
  ovenSprite.src = 'assets/oven-sprite-sheet-v1.png';
  const prepSprite = new Image();
  let prepSpriteReady = false;
  prepSprite.addEventListener('load', () => { prepSpriteReady = true; });
  prepSprite.addEventListener('error', () => { prepSpriteReady = false; });
  prepSprite.src = 'assets/prep-station-v1.png';
  const prepIngredientsSprite = new Image();
  let prepIngredientsSpriteReady = false;
  prepIngredientsSprite.addEventListener('load', () => { prepIngredientsSpriteReady = true; });
  prepIngredientsSprite.addEventListener('error', () => { prepIngredientsSpriteReady = false; });
  prepIngredientsSprite.src = 'assets/prep-ingredient-overlays-v2.png';

  /* ---------- palette (warm pizzeria) ---------- */
  const C = {
    floor1: '#e9d6ab', floor2: '#dec590',
    wall: '#c69e6e', wallTrim: '#b3865a',
    counter: '#9a6740', counterTop: '#bb8254',
    dough: '#f3e3bf', sauce: '#c63b2f', cheese: '#f4cf3a', oven: '#5b3a28', ovenMouth: '#ff8c2a',
    table: '#a96038', tableTop: '#c47a4c', chair: '#87513a',
    player: '#2c3e50', skin: '#e8b98f', apron: '#fafafa', hat: '#ffffff',
    pizzaDough: '#f3dcae', pizzaSauce: '#c63b2f', pizzaCheese: '#f4d84a', pizzaBaked: '#e3ad4b',
    text: '#3a2a1a', textInv: '#fff7ec', ui: '#241a12',
    good: '#7cb342', bad: '#e53935', bubble: '#fff8ec', dim: '#8a6f4e',
    waiter: '#6b5b95', waiterFast: '#2a9d8f', waiterApron: '#e9e9ef', tray: '#f4ead0',
    trash: '#9a8f7a', trashPaper: '#e8e0cc', bin: '#4a4038', binLid: '#6b5d4a',
    money: '#4caf50',
  };

  /* ---------- layout ---------- */
  const STATIONS = [
    { id: 'prep', label: 'Prep', cx: 300, w: 300, h: 92, use: { x: 300, y: 182 } },
    { id: 'oven', label: 'Oven', cx: 660, w: 300, h: 92, use: { x: 660, y: 182 },
      slots: [
        { pizza: null, timer: 0, baking: false, done: false, claimedBy: null },
        { pizza: null, timer: 0, baking: false, done: false, claimedBy: null },
        { pizza: null, timer: 0, baking: false, done: false, claimedBy: null },
      ] },
  ];
  const BASE_KNEAD_DUR = 3.5, SAUCE_DUR = 1.5, CHEESE_DUR = 1.5, TOPPING_DUR = 1.2, BASE_BAKE_DUR = 4.5;
  const RECIPES = {
    margherita: { name: 'Margherita', price: 9, unlockCost: 0, ingredients: ['dough', 'sauce', 'cheese'] },
    pepperoni: { name: 'Pepperoni', price: 12, unlockCost: 60, ingredients: ['dough', 'sauce', 'cheese', 'pepperoni'] },
    funghi: { name: 'Funghi', price: 12, unlockCost: 60, ingredients: ['dough', 'sauce', 'cheese', 'mushroom'] },
    zucchini: { name: 'Zucchini', price: 15, unlockCost: 70, ingredients: ['dough', 'sauce', 'cheese', 'zucchini'] },
  };

  /* ---------- extensible ingredient system ---------- */
  const INGREDIENTS = [
    { id: 'dough', name: 'Dough', requires: [], dur: BASE_KNEAD_DUR, isBase: true, iconX: 220 },
    { id: 'sauce', name: 'Sauce', requires: ['dough'], dur: SAUCE_DUR, iconX: 260 },
    { id: 'cheese', name: 'Cheese', requires: ['sauce'], dur: CHEESE_DUR, iconX: 300 },
    { id: 'pepperoni', name: 'Pepperoni', requires: ['cheese'], dur: TOPPING_DUR, iconX: 340 },
    { id: 'mushroom', name: 'Mushroom', requires: ['cheese'], dur: TOPPING_DUR, iconX: 380 },
    { id: 'zucchini', name: 'Zucchini', requires: ['cheese'], dur: TOPPING_DUR, iconX: 420 },
  ];
  const ING_MAP = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));
  const ING_ICON_Y = 126;
  const WAITER_COST = 20, FAST_WAITER_COST = 25, DRINKS_WAITER_COST = 25, WAITER_DURATION = 420;
  const CHEF_COST = 80, CHEF_DURATION = 420, HOST_COST = 30, HOST_DURATION = 420;
  const MAINTENANCE_COST = 40, MAINTENANCE_DURATION = 420, MAINTENANCE_TASK_DURATION = 15;
  const SERVICE_REGULAR_COST = 25, SERVICE_FAST_COST = 45;
  const DRINKS = {
    coke: { name: 'Coke', price: 2, color: '#c0392b' },
    water: { name: 'Water', price: 1, color: '#70b7d8' },
    dew: { name: 'Dew', price: 2, color: '#77b83f' },
  };
  const DESSERTS = {
    sundae: { name: 'Sundae', price: 4 },
    milkshake: { name: 'Milkshake', price: 6 },
  };

  // trash bin next to oven (just right of the oven counter)
  const BIN = { x: 836, y: 252, r: 20, count: 0, capacity: 20, claimedBy: null };

  const TABLES = [];
  [[360, 372], [620, 372], [740, 490]].forEach(([tx, cy], ti) => {
    const table = { id: ti, x: tx, y: cy, r: 37, seats: null };
    const seats = [
      { x: tx, y: cy - 52, side: 'n', occupied: false, cust: null, table },
      { x: tx, y: cy + 52, side: 's', occupied: false, cust: null, table },
      { x: tx + 54, y: cy, side: 'e', occupied: false, cust: null, table },
      { x: tx - 54, y: cy, side: 'w', occupied: false, cust: null, table },
    ];
    table.seats = seats; TABLES.push(table);
  });

  const PICKUP = { x: 30, y: 463, w: 100, h: 34, use: { x: 80, y: 565 } };
  const SODA = { x: 886, y: 178, w: 58, h: 72, use: { x: 864, y: 268 } };
  const ICE_CREAM = { x: 886, y: 304, w: 58, h: 78, use: { x: 864, y: 400 } };
  const TAKEAWAY_SPOTS = [
    { x: 80, y: 545, occupied: false, cust: null },
    { x: 80, y: 585, occupied: false, cust: null },
  ];
  const ENTRANCE = { x: 480, y: 612 };
  const CUSTOMER_QUEUE_SPOTS = [{ x: 540, y: 585 }, { x: 574, y: 585 }, { x: 608, y: 585 }];
  const MAX_CUSTOMER_QUEUE = CUSTOMER_QUEUE_SPOTS.length;
  const WAITER_IDLE_SPOTS = [{ x: 540, y: 250 }, { x: 600, y: 250 }, { x: 660, y: 250 }, { x: 720, y: 250 }];
  const RUNNER_IDLE_SPOTS = [{ x: 810, y: 270 }, { x: 810, y: 310 }, { x: 810, y: 350 }];
  const CHEF_IDLE_SPOTS = [{ x: 180, y: 235 }, { x: 240, y: 235 }, { x: 300, y: 235 }, { x: 360, y: 235 }, { x: 420, y: 235 }];
  const CHEF_PREP_SPOTS = [{ x: 180, y: 182 }, { x: 240, y: 182 }, { x: 300, y: 182 }, { x: 360, y: 182 }, { x: 420, y: 182 }];
  const MAINTENANCE_IDLE = { x: 920, y: 580 };

  function overflowStaffSpot(spots, index, rowGap = 28) {
    if (index < spots.length) return spots[index];
    const base = spots[index % spots.length];
    return { x: base.x, y: base.y + (Math.floor(index / spots.length) * rowGap) };
  }
  const waiterIdlePoint = (w) => overflowStaffSpot(w.drinksOnly ? RUNNER_IDLE_SPOTS : WAITER_IDLE_SPOTS, w.roleSlot, w.drinksOnly ? 24 : 28);
  const chefIdlePoint = (chef) => overflowStaffSpot(CHEF_IDLE_SPOTS, chef.idleSlot, 28);
  function ovenWorkPoint(slotIndex) {
    const count = progress.ovenSlots;
    const spacing = count === 3 ? 84 : count === 2 ? 104 : 0;
    return { x: oven().cx + (slotIndex - (count - 1) / 2) * spacing, y: oven().use.y };
  }
  function claimChefPrepSpot(chef) {
    if (chef.prepSpot >= 0) return;
    const used = new Set(state.chefs.filter((other) => other !== chef && other.prepSpot >= 0).map((other) => other.prepSpot));
    let index = 0;
    while (used.has(index)) index++;
    chef.prepSpot = index;
  }
  const chefPrepPoint = (chef) => overflowStaffSpot(CHEF_PREP_SPOTS, Math.max(0, chef.prepSpot), 28);
  function stationWorkPoint(station, w) {
    const offsets = [-22, 0, 22];
    return { x: station.use.x - 12, y: station.use.y + offsets[w.roleSlot % offsets.length] };
  }

  /* ---------- state ---------- */
  let waiterSeq = 0, chefSeq = 0;
  const state = {
    cash: 0, served: 0,
    player: { x: 480, y: 500, r: 15, speed: 195, pizzas: [null, null], drink: null, dessert: null, trash: [null, null], action: null, dir: 1, walk: 0, moving: false },
    customers: [], waiters: [], chefs: [], trash: [],
    spawnTimer: 3.5, time: 0, trafficMultiplier: 1.25, trafficTarget: 1.25, trafficRampRemaining: 0, cheatFlashTimer: 0,
  };
  const progress = {
    doughLevel: 1, ovenLevel: 1, ovenSlots: 1, tableCount: 2, staffDiscountLevel: 0, sodaCabinet: false, jukebox: false,
    iceCreamCabinet: false, milkshakeUnlocked: false, sundaeFast: false, milkshakeFast: false,
    unlockedRecipes: new Set(['margherita']),
  };
  const shift = {
    elapsed: 0, showingReport: false, shoppingStartCash: 0,
    reputation: 50, reputationRemainder: 0, peakReputation: 50, lowRepTimer: 0, lostStreak: 0,
    serviceStreak: 0, bestServiceStreak: 0, repFlash: 0, repFlashTimer: 0,
    stats: null,
  };
  const freshShiftStats = () => ({ revenue: 0, tips: 0, wasteCosts: 0, staffCosts: 0, served: 0, lost: 0, totalWait: 0, dineIn: 0, takeaway: 0 });
  shift.stats = freshShiftStats();
  let hostActive = false, hostTimer = 0;
  let maintenanceTech = null, pendingBreakdown = null, jukeboxWearTimer = 0;
  function makeEquipment(id, label, kind, safeUses, criticalUses) {
    return { id, label, kind, safeUses, criticalUses, uses: 0, broken: false, serviceTimer: 0, maintenanceReserved: false };
  }
  const equipment = {
    ovens: [
      makeEquipment('oven-1', 'Oven 1', 'oven', 15, 45),
      makeEquipment('oven-2', 'Oven 2', 'oven', 15, 45),
      makeEquipment('oven-3', 'Oven 3', 'oven', 15, 45),
    ],
    soda: makeEquipment('soda', 'Soda cabinet', 'soda', 20, 60),
    iceCream: makeEquipment('ice-cream', 'Ice cream station', 'iceCream', 12, 35),
    jukebox: makeEquipment('jukebox', 'Jukebox', 'jukebox', 8, 24),
  };
  const allEquipment = () => [...equipment.ovens.slice(0, progress.ovenSlots), ...(progress.sodaCabinet ? [equipment.soda] : []), ...(progress.iceCreamCabinet ? [equipment.iceCream] : []), ...(progress.jukebox ? [equipment.jukebox] : [])];
  function equipmentRisk(item) {
    if (!item || item.uses <= item.safeUses) return 0;
    const ratio = clamp((item.uses - item.safeUses) / Math.max(1, item.criticalUses - item.safeUses), 0, 1);
    return 0.12 * ratio * ratio;
  }
  const equipmentUnavailable = (item) => !item || item.broken || item.serviceTimer > 0 || item.maintenanceReserved;
  const jukeboxWorking = () => progress.jukebox && !equipmentUnavailable(equipment.jukebox);
  let officeHintShown = false, officeNoticeTimer = null;
  const unlockedRecipeIds = () => [...progress.unlockedRecipes];
  const availableIngredients = () => {
    const ids = new Set(unlockedRecipeIds().flatMap((id) => RECIPES[id].ingredients));
    return INGREDIENTS.filter((ingredient) => ids.has(ingredient.id));
  };
  const recipeForPizza = (pz) => {
    if (!pz) return null;
    const ids = [...pz.added];
    return unlockedRecipeIds().find((id) => {
      const required = RECIPES[id].ingredients;
      return required.length === ids.length && required.every((ingredient) => pz.added.has(ingredient));
    }) || null;
  };
  const pizzaRecipeId = (pz) => pz && (pz.recipeId || recipeForPizza(pz));
  const MAX_UPGRADE_LEVEL = 5;
  const DOUGH_UPGRADE_COSTS = { 2: 50, 3: 80, 4: 130, 5: 205 };
  const OVEN_UPGRADE_COSTS = { 2: 70, 3: 110, 4: 180, 5: 285 };
  const STAFF_DISCOUNT_COSTS = { 1: 50, 2: 80, 3: 130, 4: 205, 5: 325 };
  const speedMultiplier = (level) => 1 + Math.max(0, level - 1) * 0.2;
  const kneadDuration = () => BASE_KNEAD_DUR / speedMultiplier(progress.doughLevel);
  const bakeDuration = () => BASE_BAKE_DUR / speedMultiplier(progress.ovenLevel);
  const activeOvenSlots = (ov = oven()) => ov.slots.slice(0, progress.ovenSlots);
  const OVEN_SLOT_COSTS = { 2: 100, 3: 400 };
  const OVEN_TRAFFIC_MULTIPLIERS = { 1: 1.25, 2: 1, 3: 0.85 };
  const activeTables = () => TABLES.slice(0, progress.tableCount);
  const dessertDuration = (id) => (id === 'sundae' ? progress.sundaeFast : progress.milkshakeFast) ? 2 : 3;
  const availableDessertIds = () => progress.iceCreamCabinet ? ['sundae'].concat(progress.milkshakeUnlocked ? ['milkshake'] : []) : [];
  const discountedStaffCost = (baseCost) => Math.max(1, Math.round(baseCost * (1 - progress.staffDiscountLevel * 0.1)));
  const money = (value) => String.fromCharCode(36) + Math.round(value);
  const clampReputation = (value) => clamp(Math.round(value), 0, 100);
  function changeReputation(delta) {
    if (!delta || shift.showingReport) return;
    let applied = delta;
    if (delta > 0) {
      const diminishingFactor = Math.max(0.1, 1 - shift.reputation / 120);
      shift.reputationRemainder += delta * diminishingFactor;
      applied = Math.floor(shift.reputationRemainder);
      shift.reputationRemainder -= applied;
      if (applied <= 0) return;
    }
    shift.reputation = clampReputation(shift.reputation + applied);
    shift.peakReputation = Math.max(shift.peakReputation, shift.reputation);
    shift.repFlash = applied;
    shift.repFlashTimer = 1.8;
    if (shift.reputation <= 0) showGameOver();
  }
  function recordSuccessfulVisit(c) {
    const complete = (!c.orderedDrink || c.drinkDelivered) && (!c.orderedDessert || c.dessertDelivered);
    const excellent = complete && c.tipEligible && c.pizzaServiceAt <= 20;
    const delta = c.enteredRed ? 0 : excellent ? 2 : 1;
    shift.lostStreak = 0;
    shift.serviceStreak++;
    shift.bestServiceStreak = Math.max(shift.bestServiceStreak, shift.serviceStreak);
    if (delta) changeReputation(delta);
  }
  function recordLostVisit() {
    shift.lostStreak++;
    shift.serviceStreak = 0;
    changeReputation(shift.lostStreak === 1 ? -8 : shift.lostStreak === 2 ? -10 : -12);
  }
  function formatRunTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return mins + ':' + secs;
  }

  /* ---------- input ---------- */
  const Input = { keys: {}, pressed: {} };
  const MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
  let cheatBuffer = '';
  addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
      cheatBuffer = (cheatBuffer + e.key.toUpperCase()).slice(-8);
      if (cheatBuffer === 'CASH1000') {
        state.cash += 1000;
        state.cheatFlashTimer = 2.5;
        cheatBuffer = '';
        SND.cash();
        if (started) { syncHireUI(); syncOfficeCue(); if (paused) refreshReportOptions(); }
      }
    }
    if (!restartConfirm.classList.contains('hidden')) {
      e.preventDefault();
      if (e.code === 'Escape') closeRestartConfirm();
      return;
    }
    if (!breakdownPopup.classList.contains('hidden')) {
      e.preventDefault();
      if (e.code === 'Escape') closeBreakdownPopup();
      return;
    }
    if (!staffNotice.classList.contains('hidden')) {
      e.preventDefault();
      if (e.code === 'Escape') closeStaffNotice();
      return;
    }
    if ((e.code === 'KeyP' || e.code === 'Escape') && started) {
      e.preventDefault();
      togglePause();
      return;
    }
    if (paused) return;
    if (MOVE_KEYS.includes(e.code) || e.code === 'KeyE' || e.code === 'Space') e.preventDefault();
    if (!Input.keys[e.code]) Input.pressed[e.code] = true;
    Input.keys[e.code] = true;
  });
  addEventListener('keyup', (e) => { Input.keys[e.code] = false; });
  function clearHeldInput() {
    Input.keys = {};
    Input.pressed = {};
  }
  addEventListener('blur', clearHeldInput);
  document.addEventListener('visibilitychange', () => {
    clearHeldInput();
    if (document.hidden && started && !paused && !shift.showingReport) setPaused(true);
  });

  /* ---------- audio ---------- */
  let audioCtx = null;
  function sfx(freq, dur = 0.12, type = 'sine', vol = 0.18, slide = 0) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + dur);
  }
  const SND = {
    step: () => sfx(220, 0.09, 'square', 0.05),
    done: () => sfx(660, 0.12, 'triangle', 0.16, 220),
    cash: () => { sfx(880, 0.1, 'triangle', 0.16); setTimeout(() => sfx(1320, 0.12, 'triangle', 0.14), 70); },
    angry: () => sfx(140, 0.3, 'sawtooth', 0.14, -60),
    hire: () => { sfx(520, 0.1, 'triangle', 0.14); setTimeout(() => sfx(780, 0.12, 'triangle', 0.14), 90); },
    bin: () => sfx(180, 0.14, 'square', 0.1, -40),
  };

  /* ---------- utils ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const rand = (a, b) => a + Math.random() * (b - a);
  const oven = () => STATIONS.find((s) => s.id === 'oven');
  const prep = () => STATIONS.find((s) => s.id === 'prep');

  /* ---------- pizza model ---------- */
  const newPizza = (base, targetRecipeId = null) => ({ added: new Set(base ? [base] : []), baked: false, recipeId: null, targetRecipeId });
  const canAddIngredient = (pz, ing) => {
    if (!pz || pz.baked || pz.added.has(ing.id) || !ing.requires.every((r) => pz.added.has(r))) return false;
    const next = new Set([...pz.added, ing.id]);
    return unlockedRecipeIds().some((id) => {
      const recipe = RECIPES[id].ingredients;
      return [...next].every((ingredient) => recipe.includes(ingredient));
    });
  };
  const pizzaReadyToBake = (pz) => {
    if (!pz || pz.baked) return false;
    if (!pz.targetRecipeId) return !!recipeForPizza(pz);
    const target = RECIPES[pz.targetRecipeId].ingredients;
    return target.length === pz.added.size && target.every((ingredient) => pz.added.has(ingredient));
  };
  function pizzaStage(pz) {
    if (!pz) return null;
    if (pz.baked) return 'baked-' + (pizzaRecipeId(pz) || 'margherita');
    if (pz.added.has('pepperoni')) return 'pepperoni';
    if (pz.added.has('mushroom')) return 'mushroom';
    if (pz.added.has('zucchini')) return 'zucchini';
    if (pz.added.has('cheese')) return 'cheese';
    if (pz.added.has('sauce')) return 'sauce';
    return 'dough';
  }

  /* ---------- hand helpers ---------- */
  const firstFreeHand = () => state.player.pizzas.findIndex((x) => !x);
  const firstCarriedBaked = (recipeId = null) => state.player.pizzas.findIndex((x) => x && x.baked && (!recipeId || pizzaRecipeId(x) === recipeId));
  const firstCarriedReady = () => state.player.pizzas.findIndex((x) => pizzaReadyToBake(x));
  const hasFreeHand = (w) => w.hands.findIndex((h) => !h);
  const carriedPizzaHand = (w) => w.hands.findIndex((h) => h && h.t === 'pizza');
  const carriedTrashHand = (w) => w.hands.findIndex((h) => h && h.t === 'trash');
  const carriedBinBagHand = (w) => w.hands.findIndex((h) => h && h.t === 'binbag');
  const carriedDrinkHand = (w) => w.hands.findIndex((h) => h && h.t === 'drink');
  const carriedDessertHand = (w) => w.hands.findIndex((h) => h && h.t === 'dessert');
  const binIsFull = () => BIN.count >= BIN.capacity;
  function depositPlayerTrash() {
    const p = state.player;
    for (let i = 0; i < p.trash.length && !binIsFull(); i++) {
      if (!p.trash[i] || p.trash[i].t !== 'trash') continue;
      p.trash[i] = null;
      BIN.count++;
      SND.bin();
    }
  }
  function takeBinBag(handOwner, handIndex, ownerId = null, requireFull = false) {
    if (BIN.count <= 0 || (requireFull && !binIsFull()) || handIndex < 0 || (BIN.claimedBy !== null && BIN.claimedBy !== ownerId)) return false;
    handOwner[handIndex] = { t: 'binbag' };
    BIN.count = 0;
    BIN.claimedBy = null;
    SND.done();
    return true;
  }
  function depositWaiterTrash(w) {
    for (let i = 0; i < w.hands.length && !binIsFull(); i++) {
      if (!w.hands[i] || w.hands[i].t !== 'trash') continue;
      w.hands[i] = null;
      BIN.count++;
      SND.bin();
    }
  }

  /* ---------- interaction range ---------- */
  function inStationRange(p, s) {
    const half = s.w / 2 + 30;
    return p.x > s.cx - half && p.x < s.cx + half && p.y > 158 && p.y < 262;
  }
  const inBinRange = (p) => dist(p.x, p.y, BIN.x, BIN.y) < 58;
  const inSodaRange = (p) => progress.sodaCabinet && dist(p.x, p.y, SODA.use.x, SODA.use.y) < 72;
  const inIceCreamRange = (p) => progress.iceCreamCabinet && dist(p.x, p.y, ICE_CREAM.use.x, ICE_CREAM.use.y) < 72;
  const inJukeboxRange = (p) => progress.jukebox && dist(p.x, p.y, 904, 500) < 68;
  const DELIVER_RADIUS = 72;

  /* ---------- requirements (player) ---------- */
  function nextActionForPizza(pz) {
    const target = RECIPES[pz.targetRecipeId] || RECIPES.margherita;
    for (const id of target.ingredients) {
      if (!pz.added.has(id)) {
        const ing = ING_MAP[id];
        if (ing.requires.every((r) => pz.added.has(r))) return { ing, action: 'Add ' + ing.name };
        return null;
      }
    }
    return null;
  }
  function prepRequirement(pizzas) {
    for (let i = 0; i < pizzas.length; i++) {
      const pz = pizzas[i];
      if (pz && !pz.baked) {
        const nx = nextActionForPizza(pz);
        if (nx) return { ok: true, action: nx.action, dur: nx.ing.dur, slot: i, add: nx.ing.id };
      }
    }
    const free = firstFreeHand();
    if (free >= 0) return { ok: true, action: 'Knead dough', dur: kneadDuration(), slot: free, make: 'dough' };
    if (pizzas.some((x) => x && x.baked)) return { ok: false, hint: 'deliver' };
    if (pizzas.some((x) => pizzaReadyToBake(x))) return { ok: false, hint: 'to oven' };
    return { ok: false, hint: 'hands full' };
  }
  function ovenRequirement(pizzas, ov) {
    const readyHand = firstCarriedReady();
    const slots = activeOvenSlots(ov);
    const freeOven = slots.findIndex((s, index) => !s.pizza && !equipmentUnavailable(equipment.ovens[index]));
    if (readyHand >= 0 && freeOven >= 0) return { ok: true, action: 'Bake', mode: 'place', oSlot: freeOven, hSlot: readyHand };
    const bakedOven = slots.findIndex((s) => s.pizza && s.done);
    const freeHand = firstFreeHand();
    if (bakedOven >= 0 && freeHand >= 0) {
      const recipeId = pizzaRecipeId(slots[bakedOven].pizza);
      const recipeName = RECIPES[recipeId] ? RECIPES[recipeId].name : 'Pizza';
      return { ok: true, action: 'Collect ' + recipeName, mode: 'collect', oSlot: bakedOven, hSlot: freeHand };
    }
    if (readyHand >= 0) return { ok: false, hint: 'oven full' };
    if (bakedOven >= 0) return { ok: false, hint: 'hands full' };
    if (slots.some((s) => s.pizza && !s.done)) return { ok: false, hint: 'baking...' };
    return { ok: false, hint: 'need cheese' };
  }

  function nearestWaiting(x, y, range, recipeId = null, allowClaimed = false) {
    let best = null, bd = range;
    for (const c of state.customers) {
      if (c.state !== 'waiting' || c.pizzaDelivered || (!allowClaimed && c.claimedBy !== null) || (recipeId && c.recipeId !== recipeId)) continue;
      const d = dist(x, y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  function nearestDrinkCustomer(x, y, range, drinkId = null, ownerId = null, allowClaimed = false) {
    let best = null, bd = range;
    for (const c of state.customers) {
      const canReceive = c.state === 'waiting' || c.state === 'eating';
      const claimAvailable = allowClaimed || c.drinkClaimedBy === null || c.drinkClaimedBy === ownerId;
      if (!canReceive || !c.drinkId || c.drinkDelivered || !claimAvailable || (drinkId && c.drinkId !== drinkId)) continue;
      const d = dist(x, y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  function mostUrgentDrinkCustomer(drinkId = null, ownerId = null) {
    return state.customers
      .filter((c) => {
        const canReceive = c.state === 'waiting' || c.state === 'eating';
        const claimAvailable = c.drinkClaimedBy === null || c.drinkClaimedBy === ownerId;
        return canReceive && c.drinkId && !c.drinkDelivered && claimAvailable && (!drinkId || c.drinkId === drinkId);
      })
      .sort(compareCustomerUrgency)[0] || null;
  }
  function nearestDessertCustomer(x, y, range, dessertId = null, ownerId = null, allowClaimed = false) {
    let best = null, bd = range;
    for (const c of state.customers) {
      const claimAvailable = allowClaimed || c.dessertClaimedBy === null || c.dessertClaimedBy === ownerId;
      if (c.state !== 'waiting' || !c.dessertId || c.dessertDelivered || !claimAvailable || (dessertId && c.dessertId !== dessertId)) continue;
      const d = dist(x, y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  function mostUrgentDessertCustomer(dessertId = null, ownerId = null) {
    return state.customers
      .filter((c) => c.state === 'waiting' && c.dessertId && !c.dessertDelivered && (c.dessertClaimedBy === null || c.dessertClaimedBy === ownerId) && (!dessertId || c.dessertId === dessertId))
      .sort(compareCustomerUrgency)[0] || null;
  }
  function deliverDessert(c, carrier, ownerId = null) {
    if (!c || c.state !== 'waiting' || !c.dessertId || c.dessertDelivered || !carrier || carrier.id !== c.dessertId) return false;
    if (ownerId === null) releaseWaiterAssignment(c.dessertClaimedBy, c, 'dessert');
    recordFirstService(c);
    c.dessertDelivered = true;
    c.dessertClaimedBy = null;
    advanceCompletedOrder(c);
    SND.done();
    return true;
  }
  function deliverDrink(c, carrier, ownerId = null) {
    if (!c || !c.drinkId || c.drinkDelivered || (c.state !== 'waiting' && c.state !== 'eating')) return false;
    if (!carrier || carrier.id !== c.drinkId) return false;
    if (ownerId === null) releaseWaiterAssignment(c.drinkClaimedBy, c, 'drink');
    if (c.state === 'waiting') {
      boostCustomerPatience(c);
    }
    recordFirstService(c);
    c.drinkDelivered = true;
    c.drinkClaimedBy = null;
    advanceCompletedOrder(c);
    SND.done();
    return true;
  }

  function releaseWaiterAssignment(waiterId, customer, kind) {
    if (waiterId === null || waiterId === undefined) return;
    const waiter = state.waiters.find((candidate) => candidate.id === waiterId);
    if (!waiter) return;
    if (kind === 'pizza') {
      if (waiter.targetCust === customer) waiter.targetCust = null;
      customer.claimedBy = null;
    } else if (kind === 'drink') {
      if (waiter.targetDrinkCust === customer) waiter.targetDrinkCust = null;
      customer.drinkClaimedBy = null;
    } else {
      if (waiter.targetDessertCust === customer) waiter.targetDessertCust = null;
      customer.dessertClaimedBy = null;
    }
    if (waiter.state !== 'leave') waiter.state = 'seek';
  }

  function nearestTrash(x, y, range, includeClaimed = false) {
    let best = null, bd = range;
    for (const t of state.trash) {
      if (!includeClaimed && t.claimedBy !== null) continue;
      const d = dist(x, y, t.x, t.y);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }
  function mostImpatientUnclaimed(recipeId = null) {
    let best = null;
    for (const c of state.customers) {
      if (c.state !== 'waiting' || c.pizzaDelivered || c.claimedBy !== null || (recipeId && c.recipeId !== recipeId)) continue;
      if (!best || compareCustomerUrgency(c, best) < 0) best = c;
    }
    return best;
  }
  function compareCustomerUrgency(a, b) {
    const aRed = a.enteredRed || a.patience / a.maxPatience <= 0.4;
    const bRed = b.enteredRed || b.patience / b.maxPatience <= 0.4;
    if (aRed !== bRed) return aRed ? -1 : 1;
    const ratioDiff = a.patience / a.maxPatience - b.patience / b.maxPatience;
    return Math.abs(ratioDiff) > 0.001 ? ratioDiff : a.patience - b.patience;
  }
  function preferredCustomerForPizza(pz) {
    if (pz && pz.targetCustomerId !== null && pz.targetCustomerId !== undefined) {
      const reserved = state.customers.find((c) => c.id === pz.targetCustomerId);
      if (reserved && reserved.state === 'waiting' && !reserved.pizzaDelivered && reserved.claimedBy === null && reserved.recipeId === pizzaRecipeId(pz)) return reserved;
    }
    return mostImpatientUnclaimed(pizzaRecipeId(pz));
  }
  function nearestTrashUnclaimed() {
    let best = null, bd = 1e9;
    for (const t of state.trash) {
      if (t.claimedBy !== null) continue;
      const d = dist(660, 250, t.x, t.y);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  function getContext() {
    const p = state.player;
    if (p.action) return null;
    const brokenOven = activeOvenSlots().findIndex((slot, index) => equipment.ovens[index].broken && equipment.ovens[index].serviceTimer <= 0);
    if (inStationRange(p, oven()) && brokenOven >= 0) return { kind: 'call-service', ok: true, text: 'E: Service ' + equipment.ovens[brokenOven].label, equipment: equipment.ovens[brokenOven] };
    if (inSodaRange(p) && equipment.soda.broken && equipment.soda.serviceTimer <= 0) return { kind: 'call-service', ok: true, text: 'E: Service soda cabinet', equipment: equipment.soda };
    if (inIceCreamRange(p) && equipment.iceCream.broken && equipment.iceCream.serviceTimer <= 0) return { kind: 'call-service', ok: true, text: 'E: Service ice cream station', equipment: equipment.iceCream };
    if (inJukeboxRange(p) && equipment.jukebox.broken && equipment.jukebox.serviceTimer <= 0) return { kind: 'call-service', ok: true, text: 'E: Service jukebox', equipment: equipment.jukebox };
    for (let hand = 0; hand < p.pizzas.length; hand++) {
      const pizza = p.pizzas[hand];
      if (!pizza || !pizza.baked) continue;
      const c = nearestWaiting(p.x, p.y, DELIVER_RADIUS, pizzaRecipeId(pizza), true);
      if (c) return { kind: 'deliver', ok: true, text: 'E: Deliver ' + RECIPES[c.recipeId].name, target: c, hand };
    }
    if (p.drink) {
      const drinkCustomer = nearestDrinkCustomer(p.x, p.y, DELIVER_RADIUS, p.drink.id, null, true);
      if (drinkCustomer) return { kind: 'deliver-drink', ok: true, text: 'E: Deliver ' + DRINKS[p.drink.id].name, target: drinkCustomer };
    }
    if (p.dessert) {
      const dessertCustomer = nearestDessertCustomer(p.x, p.y, DELIVER_RADIUS, p.dessert.id, null, true);
      if (dessertCustomer) return { kind: 'deliver-dessert', ok: true, text: 'E: Deliver ' + DESSERTS[p.dessert.id].name, target: dessertCustomer };
    }
    if (inBinRange(p) && BIN.count > 0) {
      const hand = p.trash.findIndex((item) => !item);
      return hand >= 0
        ? { kind: 'take-bin-bag', ok: true, text: 'E: Take trash bag (' + BIN.count + '/' + BIN.capacity + ') to door', hand }
        : { kind: 'take-bin-bag', ok: false, text: 'Free a hand to take the trash bag' };
    }
    if (inBinRange(p) && (p.drink || p.dessert || p.pizzas.some(Boolean))) {
      const item = p.drink ? 'drink' : p.dessert ? 'dessert' : 'pizza';
      const loss = item === 'drink' ? 1 : 3;
      return { kind: 'discard-held', ok: true, text: 'E: Discard ' + item + ' (-' + money(loss) + ')', item };
    }
    if (p.trash.some((item) => !item)) {
      const t = nearestTrash(p.x, p.y, 56, true);
      if (t) return { kind: 'pickup', ok: true, text: 'E: Pick up trash', target: t };
    }
    if (inSodaRange(p)) {
      if (equipmentUnavailable(equipment.soda)) return { kind: 'drink-menu', ok: false, text: equipment.soda.serviceTimer > 0 ? 'Soda cabinet is being repaired' : 'Soda cabinet unavailable' };
      return p.drink
        ? { kind: 'drink-menu', ok: false, text: 'Already carrying ' + DRINKS[p.drink.id].name }
        : { kind: 'drink-menu', ok: true, text: 'E: Choose drink' };
    }
    if (inIceCreamRange(p)) {
      if (equipmentUnavailable(equipment.iceCream)) return { kind: 'dessert-menu', ok: false, text: equipment.iceCream.serviceTimer > 0 ? 'Ice cream station is being repaired' : 'Ice cream station unavailable' };
      return p.dessert
        ? { kind: 'dessert-menu', ok: false, text: 'Already carrying ' + DESSERTS[p.dessert.id].name }
        : { kind: 'dessert-menu', ok: true, text: 'E: Make frozen treat' };
    }
    const ov = oven();
    if (inStationRange(p, ov)) {
      const r = ovenRequirement(p.pizzas, ov);
      return Object.assign({ kind: 'oven', target: ov }, r, { text: r.ok ? 'E: ' + r.action : r.hint });
    }
    const pr = prep();
    if (inStationRange(p, pr)) {
      const r = prepRequirement(p.pizzas);
      if (firstFreeHand() >= 0) return { kind: 'prep-menu', target: pr, ok: true, text: 'E: Start pizza' };
      return { kind: 'prep-step', target: pr, ok: false, text: r.hint || 'Hands full' };
    }
    return null;
  }

  /* ---------- actions ---------- */
  function applyPrep(c) {
    const p = state.player;
    if (c.make) p.pizzas[c.slot] = newPizza(c.make);
    else if (p.pizzas[c.slot]) p.pizzas[c.slot].added.add(c.add);
    SND.done();
  }
  function takeReadyOvenSlot(slotIndex, ownerId, force = false) {
    const s = oven().slots[slotIndex];
    if (!s || !s.pizza || !s.done || (!force && s.claimedBy !== null && s.claimedBy !== ownerId)) return null;
    if (force && s.claimedBy !== null) {
      const waiter = state.waiters.find((candidate) => candidate.id === s.claimedBy);
      if (waiter && waiter.state !== 'leave') { waiter.targetSlot = -1; waiter.state = 'seek'; }
    }
    const pz = s.pizza;
    s.pizza = null; s.baking = false; s.done = false; s.timer = 0; s.claimedBy = null;
    return pz;
  }
  function ovenInteract(c) {
    const p = state.player;
    if (c.mode === 'place') {
      const s = c.target.slots[c.oSlot];
      s.pizza = p.pizzas[c.hSlot]; s.pizza.recipeId = recipeForPizza(s.pizza); s.baking = true; s.done = false; s.timer = 0; s.claimedBy = null;
      p.pizzas[c.hSlot] = null; SND.step();
    } else {
      const pz = takeReadyOvenSlot(c.oSlot, null, true);
      if (pz) { p.pizzas[c.hSlot] = pz; SND.done(); }
    }
  }
  // customer served → eats (dine-in) or pays now (takeaway). cash is added on pay completion.
  function recordFirstService(c) {
    if (c.firstServiceAt !== null) return;
    c.firstServiceAt = c.serviceElapsed;
    c.tipEligible = c.firstServiceAt <= 15;
    c.mood = c.patience / c.maxPatience > 0.4 ? 'happy' : 'neutral';
  }

  function advanceCompletedOrder(c) {
    if (!c.pizzaDelivered || (c.orderedDrink && !c.drinkDelivered)) return false;
    if (!c.dessertDecisionMade) {
      c.dessertDecisionMade = true;
      const dessertIds = availableDessertIds();
      if (dessertIds.length && Math.random() < 0.3) {
        c.dessertId = dessertIds[(Math.random() * dessertIds.length) | 0];
        c.orderedDessert = true;
        return false;
      }
    }
    if (c.orderedDessert && !c.dessertDelivered) return false;
    c.claimedBy = null;
    c.drinkClaimedBy = null;
    c.dessertClaimedBy = null;
    if (c.takeaway) { c.state = 'paying'; c.payTimer = 1.3; }
    else { c.state = 'eating'; c.eatTimer = 3; }
    return true;
  }

  function serveCustomer(c) {
    recordFirstService(c);
    c.pizzaServiceAt = c.serviceElapsed;
    boostCustomerPatience(c);
    c.pizzaDelivered = true;
    c.chefOrderClaimedBy = null;
    advanceCompletedOrder(c);
  }
  function boostCustomerPatience(c) {
    if (!c || c.state !== 'waiting') return;
    const missingPatience = Math.max(0, c.maxPatience - c.patience);
    const patienceBoost = Math.round(clamp(c.maxPatience * 0.1 + missingPatience * 0.25, 5, 14));
    c.patience = Math.min(c.maxPatience, c.patience + patienceBoost);
  }
  function deliver(c, handIndex) {
    const p = state.player;
    const idx = Number.isInteger(handIndex) ? handIndex : firstCarriedBaked(c.recipeId);
    if (idx < 0 || c.state !== 'waiting' || c.pizzaDelivered || pizzaRecipeId(p.pizzas[idx]) !== c.recipeId) return;
    releaseWaiterAssignment(c.claimedBy, c, 'pizza');
    p.pizzas[idx] = null;
    serveCustomer(c); SND.done();
  }
  function deliverByWaiter(c, w, handIdx) {
    const h = w.hands[handIdx];
    if (!h || h.t !== 'pizza' || c.state !== 'waiting' || c.pizzaDelivered || pizzaRecipeId(h.pz) !== c.recipeId) { if (c.claimedBy === w.id) c.claimedBy = null; return; }
    w.hands[handIdx] = null; c.claimedBy = null;
    serveCustomer(c); SND.done();
  }
  function returnPizzaToOven(pz) {
    const s = activeOvenSlots().find((sl, index) => !sl.pizza && !equipmentUnavailable(equipment.ovens[index]));
    if (s) { s.pizza = pz; s.baking = false; s.done = true; s.timer = bakeDuration(); s.claimedBy = null; }
  }
  function spawnTrash(x, y, tableId = null) {
    if (state.trash.length > 40) return;
    state.trash.push({ x, y: y + 6, claimedBy: null, tableId });
  }

  function tryInteract() {
    const p = state.player;
    if (p.action) return;
    const c = getContext();
    if (!c || c.ok === false) return;
    if (c.kind === 'prep-menu') toggleIngredientDropdown();
    else if (c.kind === 'call-service') showBreakdown(c.equipment);
    else if (c.kind === 'oven') ovenInteract(c);
    else if (c.kind === 'deliver') deliver(c.target, c.hand);
    else if (c.kind === 'deliver-drink') {
      if (deliverDrink(c.target, p.drink)) p.drink = null;
    }
    else if (c.kind === 'deliver-dessert') {
      if (deliverDessert(c.target, p.dessert)) p.dessert = null;
    }
    else if (c.kind === 'drink-menu') toggleDrinkDropdown();
    else if (c.kind === 'dessert-menu') toggleDessertDropdown();
    else if (c.kind === 'take-bin-bag') {
      if (BIN.claimedBy !== null) {
        const waiter = state.waiters.find((candidate) => candidate.id === BIN.claimedBy);
        if (waiter && waiter.state === 'tofullbin') waiter.state = 'seek';
        BIN.claimedBy = null;
      }
      takeBinBag(p.trash, c.hand);
    }
    else if (c.kind === 'discard-held') {
      if (c.item === 'drink') { p.drink = null; state.cash -= 1; shift.stats.wasteCosts += 1; }
      else if (c.item === 'dessert') { p.dessert = null; state.cash -= 1; shift.stats.wasteCosts += 1; }
      else {
        const slot = p.pizzas.findIndex(Boolean);
        if (slot >= 0) p.pizzas[slot] = null;
        state.cash -= 3; shift.stats.wasteCosts += 3;
      }
      SND.bin();
    }
    else if (c.kind === 'pickup') {
      if (c.target) {
        const slot = p.trash.findIndex((item) => !item);
        if (slot >= 0) {
          if (c.target.claimedBy !== null) {
            const waiter = state.waiters.find((candidate) => candidate.id === c.target.claimedBy);
            if (waiter && waiter.targetTrash === c.target) { waiter.targetTrash = null; waiter.state = 'seek'; }
          }
          p.trash[slot] = { t: 'trash' };
          const i = state.trash.indexOf(c.target);
          if (i >= 0) state.trash.splice(i, 1);
          SND.done();
        }
      }
    }
  }
  function continuePlayerPizza(slot) {
    const p = state.player;
    const pizza = p.pizzas[slot];
    if (!pizza || pizza.baked) return;
    const next = nextActionForPizza(pizza);
    if (!next) {
      pizza.recipeId = recipeForPizza(pizza);
      SND.done();
      return;
    }
    p.action = {
      label: next.action,
      duration: next.ing.dur,
      elapsed: 0,
      onComplete: () => {
        const current = p.pizzas[slot];
        if (!current || current.baked) return;
        current.added.add(next.ing.id);
        continuePlayerPizza(slot);
      }
    };
  }
  function startPlayerPizza(recipeId) {
    const p = state.player;
    if (p.action || !inStationRange(p, prep())) return;
    const free = firstFreeHand();
    if (free < 0 || !RECIPES[recipeId] || !unlockedRecipeIds().includes(recipeId)) return;
    const recipeName = RECIPES[recipeId].name;
    p.action = {
      label: 'Knead ' + recipeName,
      duration: kneadDuration(),
      elapsed: 0,
      onComplete: () => {
        p.pizzas[free] = newPizza('dough', recipeId);
        continuePlayerPizza(free);
      }
    };
  }
  const ingredientButtons = new Map();
  let ingredientMenuSignature = '';

  function rebuildIngredientDropdown(recipeIds) {
    ingredientOptions.innerHTML = '';
    ingredientButtons.clear();
    for (const recipeId of recipeIds) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = RECIPES[recipeId].name;
      button.addEventListener('click', () => {
        startPlayerPizza(recipeId);
        ingredientOptions.classList.add('hidden');
        ingredientToggle.setAttribute('aria-expanded', 'false');
      });
      ingredientButtons.set(recipeId, button);
      ingredientOptions.appendChild(button);
    }
  }

  function syncIngredientDropdown() {
    const atPrep = started && !paused && !shift.showingReport && inStationRange(state.player, prep());
    const canStart = atPrep && !state.player.action && firstFreeHand() >= 0;
    ingredientDropdown.classList.toggle('available', canStart);
    if (!canStart) {
      ingredientOptions.classList.add('hidden');
      ingredientToggle.setAttribute('aria-expanded', 'false');
    }

    const recipeIds = unlockedRecipeIds();
    const signature = recipeIds.join('|');
    if (signature !== ingredientMenuSignature) {
      ingredientMenuSignature = signature;
      rebuildIngredientDropdown(recipeIds);
    }

    for (const recipeId of recipeIds) {
      const button = ingredientButtons.get(recipeId);
      if (button) button.disabled = !canStart;
    }
  }
  function toggleIngredientDropdown() {
    if (!inStationRange(state.player, prep())) return;
    syncIngredientDropdown();
    const opening = ingredientOptions.classList.contains('hidden');
    ingredientOptions.classList.toggle('hidden', !opening);
    ingredientToggle.setAttribute('aria-expanded', String(opening));
  }
  ingredientToggle.addEventListener('click', toggleIngredientDropdown);

  canvas.addEventListener('click', () => {
    if (!startScreen.classList.contains('hidden')) return;
    tryInteract();
  });


  function syncDrinkDropdown() {
    const available = started && !paused && !shift.showingReport && inSodaRange(state.player) && !equipmentUnavailable(equipment.soda);
    drinkDropdown.classList.toggle('available', available);
    if (!available) {
      drinkOptions.classList.add('hidden');
      drinkToggle.setAttribute('aria-expanded', 'false');
    }
    for (const button of drinkOptions.querySelectorAll('button')) button.disabled = !!state.player.drink;
  }
  function toggleDrinkDropdown() {
    if (!inSodaRange(state.player) || equipmentUnavailable(equipment.soda) || state.player.drink) return;
    const opening = drinkOptions.classList.contains('hidden');
    drinkOptions.classList.toggle('hidden', !opening);
    drinkToggle.setAttribute('aria-expanded', String(opening));
  }
  for (const [id, drink] of Object.entries(DRINKS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = drink.name + ' · $' + drink.price;
    button.addEventListener('click', () => {
      if (!state.player.drink && inSodaRange(state.player) && !equipmentUnavailable(equipment.soda)) {
        state.player.drink = { id };
        registerEquipmentUse(equipment.soda);
      }
      drinkOptions.classList.add('hidden');
      drinkToggle.setAttribute('aria-expanded', 'false');
    });
    drinkOptions.appendChild(button);
  }
  drinkToggle.addEventListener('click', toggleDrinkDropdown);

  let dessertMenuSignature = '';
  function rebuildDessertDropdown(ids) {
    dessertOptions.innerHTML = '';
    for (const id of ids) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = DESSERTS[id].name + ' · ' + dessertDuration(id) + 's';
      button.addEventListener('click', () => {
        if (!inIceCreamRange(state.player) || equipmentUnavailable(equipment.iceCream) || state.player.action || state.player.dessert) return;
        dessertOptions.classList.add('hidden'); dessertToggle.setAttribute('aria-expanded', 'false');
        state.player.action = { label: 'Make ' + DESSERTS[id].name, duration: dessertDuration(id), elapsed: 0, onComplete: () => { state.player.dessert = { id }; registerEquipmentUse(equipment.iceCream); SND.done(); } };
      });
      dessertOptions.appendChild(button);
    }
  }
  function syncDessertDropdown() {
    const available = started && !paused && !shift.showingReport && inIceCreamRange(state.player) && !equipmentUnavailable(equipment.iceCream) && !state.player.action && !state.player.dessert;
    dessertDropdown.classList.toggle('available', available);
    if (!available) { dessertOptions.classList.add('hidden'); dessertToggle.setAttribute('aria-expanded', 'false'); }
    const ids = availableDessertIds();
    const signature = ids.join('|') + '|' + progress.sundaeFast + '|' + progress.milkshakeFast;
    if (signature !== dessertMenuSignature) { dessertMenuSignature = signature; rebuildDessertDropdown(ids); }
    for (const button of dessertOptions.querySelectorAll('button')) button.disabled = !available;
  }
  function toggleDessertDropdown() {
    syncDessertDropdown();
    if (!inIceCreamRange(state.player) || state.player.action || state.player.dessert) return;
    const opening = dessertOptions.classList.contains('hidden');
    dessertOptions.classList.toggle('hidden', !opening); dessertToggle.setAttribute('aria-expanded', String(opening));
  }
  dessertToggle.addEventListener('click', toggleDessertDropdown);

  /* ---------- customers ---------- */
  const CUST_COLORS = ['#d96b4a', '#5b8c5a', '#7b6cb0', '#c98a3a', '#4a90b0', '#b05a7a', '#6a8a3a'];
  function freeSeat() {
    for (const t of activeTables()) for (const s of t.seats)
      if (!s.occupied && !state.trash.some((tr) => tr.tableId === t.id)) return s;
    return null;
  }
  function freeTakeaway() { return TAKEAWAY_SPOTS.find((s) => !s.occupied) || null; }
  const queuedCustomers = () => state.customers.filter((c) => c.state === 'queued' && !c.remove);
  const insideCustomerCount = () => state.customers.filter((c) => !c.remove && c.state !== 'queued' && c.state !== 'leaving').length;
  function seatCustomer(c, seat) {
    seat.occupied = true;
    seat.cust = c;
    c.seat = seat;
    c.tx = seat.x;
    c.ty = seat.y;
    c.side = seat.side || 'n';
    c.table = seat.table || null;
    c.state = 'entering';
  }
  function spawnCustomer() {
    const takeaway = Math.random() < 0.33;
    const queue = queuedCustomers();
    const seat = queue.length === 0 ? (takeaway ? freeTakeaway() : freeSeat()) : null;
    if (!seat && queue.length >= MAX_CUSTOMER_QUEUE) return false;
    const recipeIds = unlockedRecipeIds();
    const recipeId = recipeIds[(Math.random() * recipeIds.length) | 0];
    const drinkIds = Object.keys(DRINKS);
    const drinkId = progress.sodaCabinet && Math.random() < 0.5 ? drinkIds[(Math.random() * drinkIds.length) | 0] : null;
    const c = {
      id: Math.random(), recipeId, x: ENTRANCE.x, y: ENTRANCE.y, tx: ENTRANCE.x, ty: ENTRANCE.y,
      seat: null, takeaway, side: 'n', table: null, state: seat ? 'entering' : 'queued',
      color: CUST_COLORS[(Math.random() * CUST_COLORS.length) | 0],
      patience: (takeaway ? 42 : 55) * (hostActive ? 1.25 : 1),
      maxPatience: (takeaway ? 42 : 55) * (hostActive ? 1.25 : 1),
      eatTimer: 0, payTimer: 0, bob: Math.random() * 6, claimedBy: null,
      drinkId, orderedDrink: !!drinkId, pizzaDelivered: false, drinkDelivered: false, drinkClaimedBy: null, chefOrderClaimedBy: null,
      dessertId: null, orderedDessert: false, dessertDelivered: false, dessertClaimedBy: null, dessertDecisionMade: false,
      serviceElapsed: 0, firstServiceAt: null, pizzaServiceAt: Infinity,
      tipEligible: false, enteredRed: false, mood: null,
      queueElapsed: 0, queuePatience: rand(20, 25) * (hostActive ? 1.25 : 1),
    };
    if (seat) seatCustomer(c, seat);
    state.customers.push(c);
    return true;
  }
  function admitQueuedCustomers() {
    while (true) {
      const queue = queuedCustomers();
      let admitted = false;
      for (const c of queue) {
        const seat = c.takeaway ? freeTakeaway() : freeSeat();
        if (!seat) continue;
        seatCustomer(c, seat);
        admitted = true;
        break;
      }
      if (!admitted) break;
    }
  }
  function updateCustomer(c, dt) {
    c.bob += dt * 6;
    if (c.firstServiceAt === null && (c.state === 'entering' || c.state === 'waiting' || c.state === 'eating')) c.serviceElapsed += dt;
    if (c.state === 'queued') {
      const queue = queuedCustomers();
      const index = Math.max(0, queue.indexOf(c));
      const spot = CUSTOMER_QUEUE_SPOTS[Math.min(index, CUSTOMER_QUEUE_SPOTS.length - 1)];
      moveToward(c, spot.x, spot.y, 78, dt);
      c.queueElapsed += dt;
      if (c.queueElapsed >= c.queuePatience) {
        c.state = 'leaving'; c.mood = 'angry'; shift.stats.lost++;
        changeReputation(-2);
        SND.angry();
      }
    } else if (c.state === 'entering') {
      moveToward(c, c.tx, c.ty, 78, dt);
      if (dist(c.x, c.y, c.tx, c.ty) < 4) { c.x = c.tx; c.y = c.ty; c.state = 'waiting'; c.waitElapsed = 0; }
    } else if (c.state === 'waiting') {
      c.waitElapsed = (c.waitElapsed || 0) + dt;
      c.patience -= dt * (jukeboxWorking() ? 0.75 : 1);
      if (c.patience / c.maxPatience <= 0.4) c.enteredRed = true;
      if (c.patience <= 0) {
        c.state = 'leaving'; c.claimedBy = null; c.mood = 'angry'; shift.stats.lost++;
        recordLostVisit();
        if (c.seat) { c.seat.occupied = false; c.seat.cust = null; c.seat = null; }
        SND.angry();
      }
    } else if (c.state === 'eating') {
      c.eatTimer -= dt;
      if (c.eatTimer <= 0) {
        c.state = 'paying'; c.payTimer = 1.3;
      }
    } else if (c.state === 'paying') {
      c.payTimer -= dt;
      if (c.payTimer <= 0) {
        const salePrice = RECIPES[c.recipeId].price + (c.drinkDelivered && c.drinkId ? DRINKS[c.drinkId].price : 0) + (c.dessertDelivered && c.dessertId ? DESSERTS[c.dessertId].price : 0);
        const tip = c.tipEligible ? Math.round(salePrice * 0.2) : 0;
        state.cash += salePrice + tip; state.served++; shift.stats.revenue += salePrice; shift.stats.tips += tip; shift.stats.served++;
        shift.stats.totalWait += c.waitElapsed || 0;
        if (c.takeaway) shift.stats.takeaway++; else shift.stats.dineIn++;
        if (!c.takeaway) spawnTrash(c.x, c.y, c.table ? c.table.id : null); SND.cash();
        recordSuccessfulVisit(c);
        if (c.seat) { c.seat.occupied = false; c.seat.cust = null; c.seat = null; }
        c.state = 'leaving';
      }
    } else if (c.state === 'leaving') {
      moveToward(c, ENTRANCE.x, ENTRANCE.y, 95, dt);
      if (dist(c.x, c.y, ENTRANCE.x, ENTRANCE.y) < 6) c.remove = true;
    }
  }
  function moveToward(e, tx, ty, speed, dt) {
    const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
    if (d < 0.5) return;
    const step = Math.min(d, speed * dt);
    e.x += (dx / d) * step; e.y += (dy / d) * step;
  }
  function segmentClearOfTables(ax, ay, bx, by, entity) {
    const vx = bx - ax, vy = by - ay;
    const lengthSq = vx * vx + vy * vy;
    for (const table of activeTables()) {
      const radius = table.r + entity.r + 1;
      const projection = lengthSq > 0 ? clamp(((table.x - ax) * vx + (table.y - ay) * vy) / lengthSq, 0, 1) : 0;
      const closestX = ax + vx * projection, closestY = ay + vy * projection;
      if (dist(closestX, closestY, table.x, table.y) < radius) return false;
    }
    return true;
  }
  function tableRoute(entity, tx, ty) {
    const start = { x: entity.x, y: entity.y };
    const target = { x: tx, y: ty };
    if (segmentClearOfTables(start.x, start.y, tx, ty, entity)) return [target];

    const nodes = [start, target];
    for (const table of activeTables()) {
      const radius = table.r + entity.r + 13;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const point = {
          x: clamp(table.x + Math.cos(angle) * radius, 28, W - 28),
          y: clamp(table.y + Math.sin(angle) * radius, 180, H - 18),
        };
        const blocked = activeTables().some((other) => dist(point.x, point.y, other.x, other.y) < other.r + entity.r + 1);
        if (!blocked) nodes.push(point);
      }
    }

    const distanceTo = Array(nodes.length).fill(Infinity);
    const previous = Array(nodes.length).fill(-1);
    const visited = Array(nodes.length).fill(false);
    distanceTo[0] = 0;
    for (let step = 0; step < nodes.length; step++) {
      let current = -1;
      for (let i = 0; i < nodes.length; i++) {
        if (!visited[i] && (current < 0 || distanceTo[i] < distanceTo[current])) current = i;
      }
      if (current < 0 || distanceTo[current] === Infinity || current === 1) break;
      visited[current] = true;
      for (let next = 1; next < nodes.length; next++) {
        if (next === current || visited[next]) continue;
        if (!segmentClearOfTables(nodes[current].x, nodes[current].y, nodes[next].x, nodes[next].y, entity)) continue;
        const candidate = distanceTo[current] + dist(nodes[current].x, nodes[current].y, nodes[next].x, nodes[next].y);
        if (candidate < distanceTo[next]) {
          distanceTo[next] = candidate;
          previous[next] = current;
        }
      }
    }
    if (distanceTo[1] === Infinity) return [target];
    const route = [];
    for (let at = 1; at > 0; at = previous[at]) route.unshift(nodes[at]);
    return route;
  }
  function moveEntity(e, tx, ty, dt) {
    const targetChanged = !e.nav || dist(e.nav.tx, e.nav.ty, tx, ty) > 3;
    if (targetChanged) e.nav = { tx, ty, points: tableRoute(e, tx, ty) };
    while (e.nav.points.length > 1 && dist(e.x, e.y, e.nav.points[0].x, e.nav.points[0].y) < 3) e.nav.points.shift();
    const waypoint = e.nav.points[0] || { x: tx, y: ty };
    const finalPoint = e.nav.points.length <= 1;
    const dx = waypoint.x - e.x, dy = waypoint.y - e.y, d = Math.hypot(dx, dy);
    if (finalPoint && dist(e.x, e.y, tx, ty) < 1) { e.nav = null; return true; }
    if (d < 0.5) {
      e.nav = { tx, ty, points: tableRoute(e, tx, ty) };
      return false;
    }
    const step = Math.min(d, e.speed * dt);
    let nx = e.x + (dx / d) * step, ny = e.y + (dy / d) * step;
    nx = clamp(nx, 28, W - 28); ny = clamp(ny, 180, H - 18);
    for (const t of activeTables()) {
      const dd = dist(nx, ny, t.x, t.y), min = t.r + e.r - 2;
      if (dd < min && dd > 0) { const a = Math.atan2(ny - t.y, nx - t.x); nx = t.x + Math.cos(a) * min; ny = t.y + Math.sin(a) * min; }
    }
    if (nx > PICKUP.x - 6 && nx < PICKUP.x + PICKUP.w + 6 && ny > PICKUP.y - e.r - 6 && ny < PICKUP.y + PICKUP.h + e.r + 6) ny = e.y < PICKUP.y ? PICKUP.y - e.r - 6 : PICKUP.y + PICKUP.h + e.r + 6;
    e.x = nx; e.y = ny;
    return false;
  }

  /* ---------- oven ---------- */
  function resetEquipment(item) {
    item.uses = 0;
    item.broken = false;
    item.serviceTimer = 0;
    item.maintenanceReserved = false;
  }
  function showBreakdown(item) {
    if (!item) return;
    setPaused(true);
    pendingBreakdown = item;
    breakdownTitle.textContent = item.label + ' broke down';
    breakdownDetails.textContent = 'Choose service now or close this window and call later from the device.';
    regularServiceBtn.disabled = state.cash < SERVICE_REGULAR_COST || item.serviceTimer > 0;
    fastServiceBtn.disabled = state.cash < SERVICE_FAST_COST || item.serviceTimer > 0;
    breakdownPopup.classList.remove('hidden');
  }
  function closeBreakdownPopup() {
    breakdownPopup.classList.add('hidden');
    pendingBreakdown = null;
  }
  function breakEquipment(item) {
    if (!item || item.broken || item.serviceTimer > 0 || item.maintenanceReserved) return;
    item.broken = true;
    showBreakdown(item);
  }
  function registerEquipmentUse(item) {
    if (!item || equipmentUnavailable(item)) return;
    item.uses++;
    const risk = equipmentRisk(item);
    if (risk > 0 && Math.random() < risk) breakEquipment(item);
  }
  function callService(fast) {
    const item = pendingBreakdown;
    const cost = fast ? SERVICE_FAST_COST : SERVICE_REGULAR_COST;
    if (!item || !item.broken || item.serviceTimer > 0 || state.cash < cost) return;
    state.cash -= cost;
    item.serviceTimer = fast ? 30 : 60;
    closeBreakdownPopup();
    refreshReportOptions();
  }
  breakdownClose.addEventListener('click', closeBreakdownPopup);
  regularServiceBtn.addEventListener('click', () => callService(false));
  fastServiceBtn.addEventListener('click', () => callService(true));

  function equipmentIdle(item) {
    if (item.kind === 'oven') {
      const index = equipment.ovens.indexOf(item), slot = oven().slots[index];
      return !!slot && !slot.pizza && !slot.baking && !slot.done && slot.claimedBy === null;
    }
    if (item.kind === 'iceCream') {
      const playerBusy = state.player.action && /^Make /.test(state.player.action.label);
      const waiterBusy = state.waiters.some((w) => w.state === 'makingdessert' || w.state === 'toicecreamcabinet');
      return !playerBusy && !waiterBusy;
    }
    return true;
  }
  function maintenancePriority(item) {
    if (item.kind === 'oven') return progress.ovenSlots === 1 ? 0 : 1;
    if (item.kind === 'soda') return 2;
    if (item.kind === 'iceCream') return 3;
    return 4;
  }
  function maintenanceWorkPoint(item) {
    if (item.kind === 'oven') return ovenWorkPoint(equipment.ovens.indexOf(item));
    if (item.kind === 'soda') return SODA.use;
    if (item.kind === 'iceCream') return ICE_CREAM.use;
    return { x: 870, y: 500 };
  }
  function chooseMaintenanceTarget() {
    return allEquipment()
      .filter((item) => !item.broken && item.serviceTimer <= 0 && !item.maintenanceReserved && equipmentIdle(item) && equipmentRisk(item) >= 0.1)
      .sort((a, b) => maintenancePriority(a) - maintenancePriority(b) || equipmentRisk(b) - equipmentRisk(a))[0] || null;
  }
  function hireMaintenance() {
    const cost = discountedStaffCost(MAINTENANCE_COST);
    if ((maintenanceTech && maintenanceTech.state !== 'leave') || state.cash < cost) return;
    if (maintenanceTech && maintenanceTech.state === 'leave') maintenanceTech = null;
    state.cash -= cost; shift.stats.staffCosts += cost;
    maintenanceTech = { x: ENTRANCE.x, y: ENTRANCE.y, r: 13, speed: state.player.speed * 0.72, timer: MAINTENANCE_DURATION, state: 'enter', target: null, actionElapsed: 0, walk: 0 };
    SND.hire();
  }
  function updateMaintenance(dt) {
    const tech = maintenanceTech;
    if (!tech) return;
    tech.walk += dt * 5;
    if (tech.state !== 'leave') {
      tech.timer -= dt;
      if (tech.timer <= 0) {
        if (tech.target) tech.target.maintenanceReserved = false;
        tech.target = null; tech.state = 'leave'; tech.timer = 0;
        showStaffShiftNotice('maintenance');
        return;
      }
    }
    if (tech.state === 'enter') { if (moveEntity(tech, MAINTENANCE_IDLE.x, MAINTENANCE_IDLE.y, dt)) tech.state = 'idle'; return; }
    if (tech.state === 'leave') { if (moveEntity(tech, ENTRANCE.x, H - 18, dt)) maintenanceTech = null; return; }
    if (tech.state === 'idle') {
      const target = chooseMaintenanceTarget();
      if (target) { target.maintenanceReserved = true; tech.target = target; tech.state = 'to-device'; }
      else moveEntity(tech, MAINTENANCE_IDLE.x, MAINTENANCE_IDLE.y, dt);
      return;
    }
    if (tech.state === 'to-device') {
      if (!tech.target || tech.target.broken || tech.target.serviceTimer > 0) {
        if (tech.target) tech.target.maintenanceReserved = false;
        tech.target = null; tech.state = 'idle'; return;
      }
      const point = maintenanceWorkPoint(tech.target);
      if (moveEntity(tech, point.x, point.y, dt)) { tech.actionElapsed = 0; tech.state = 'maintaining'; }
      return;
    }
    if (tech.state === 'maintaining') {
      tech.actionElapsed += dt;
      if (tech.actionElapsed >= MAINTENANCE_TASK_DURATION) {
        resetEquipment(tech.target);
        tech.target = null; tech.actionElapsed = 0; tech.state = 'idle'; SND.done();
      }
    }
  }
  function updateEquipment(dt) {
    for (const item of allEquipment()) {
      if (item.serviceTimer > 0) {
        item.serviceTimer = Math.max(0, item.serviceTimer - dt);
        if (item.serviceTimer === 0) resetEquipment(item);
      }
    }
    if (jukeboxWorking()) {
      jukeboxWearTimer += dt;
      while (jukeboxWearTimer >= 30) { jukeboxWearTimer -= 30; registerEquipmentUse(equipment.jukebox); }
    }
  }

  function updateOven(dt) {
    activeOvenSlots().forEach((s, index) => {
      if (s.baking) {
        s.timer += dt;
        if (s.timer >= bakeDuration()) {
          s.baking = false; s.done = true; if (s.pizza) s.pizza.baked = true; SND.done();
          registerEquipmentUse(equipment.ovens[index]);
        }
      }
    });
  }

  /* ---------- waiters ---------- */
  function hireWaiter(type) {
    const fast = type === 'fast';
    const drinksOnly = type === 'drinks';
    const baseCost = drinksOnly ? DRINKS_WAITER_COST : fast ? FAST_WAITER_COST : WAITER_COST;
    const cost = discountedStaffCost(baseCost);
    if ((drinksOnly && !progress.sodaCabinet && !progress.iceCreamCabinet) || state.cash < cost) return;
    state.cash -= cost; shift.stats.staffCosts += cost;
    const base = state.player.speed / 2;
    const usedRoleSlots = new Set(state.waiters.filter((waiter) => waiter.drinksOnly === drinksOnly && !waiter.remove).map((waiter) => waiter.roleSlot));
    let roleSlot = 0;
    while (usedRoleSlots.has(roleSlot)) roleSlot++;
    const w = {
      id: ++waiterSeq, x: ENTRANCE.x, y: ENTRANCE.y, r: 13,
      speed: base * (fast ? 1.3 : 1), fast, drinksOnly,
      hands: [null, null], state: 'enter', action: null, targetSlot: -1, targetCust: null, targetTrash: null, targetDrinkCust: null, targetDessertCust: null,
      timer: WAITER_DURATION, walk: 0, roleSlot,
    };
    state.waiters.push(w); SND.hire();
  }

  function hireHost() {
    const cost = discountedStaffCost(HOST_COST);
    if (hostActive || state.cash < cost) return;
    state.cash -= cost;
    shift.stats.staffCosts += cost;
    hostActive = true;
    hostTimer = HOST_DURATION;
    SND.hire();
  }

  // central, single pizza-assignment path: nearest eligible free waiter per ready slot
  function assignJobs() {
    const ov = oven();
    const readySlots = activeOvenSlots(ov).map((slot, index) => ({ slot, index })).filter(({ slot }) => slot.pizza && slot.done && slot.claimedBy === null);
    readySlots.sort((a, b) => {
      const ac = preferredCustomerForPizza(a.slot.pizza), bc = preferredCustomerForPizza(b.slot.pizza);
      if (!ac) return 1; if (!bc) return -1;
      return compareCustomerUrgency(ac, bc);
    });
    for (const { slot: s, index: i } of readySlots) {
      let best = null, bd = 1e9;
      for (const w of state.waiters) {
        if (w.remove || w.state !== 'seek' || w.drinksOnly) continue;
        if (hasFreeHand(w) < 0) continue;
        const d = dist(w.x, w.y, ov.use.x, ov.use.y);
        if (d < bd) { bd = d; best = w; }
      }
      if (best) { s.claimedBy = best.id; best.targetSlot = i; best.state = 'tooven'; }
    }
  }

  function pickWaiterJob(w, dt) {
    const drinkHand = carriedDrinkHand(w);
    const dessertHand = carriedDessertHand(w);
    if (w.drinksOnly) {
      if (drinkHand >= 0) { w.state = 'todrinkcust'; return; }
      if (dessertHand >= 0) { w.state = 'todessertcust'; return; }
      if (progress.sodaCabinet && !equipmentUnavailable(equipment.soda) && hasFreeHand(w) >= 0) {
        const drinkTarget = mostUrgentDrinkCustomer(null, w.id);
        if (drinkTarget) { drinkTarget.drinkClaimedBy = w.id; w.targetDrinkCust = drinkTarget; w.state = 'todrinkcabinet'; return; }
      }
      if (progress.iceCreamCabinet && !equipmentUnavailable(equipment.iceCream) && hasFreeHand(w) >= 0) {
        const dessertTarget = mostUrgentDessertCustomer(null, w.id);
        if (dessertTarget) { dessertTarget.dessertClaimedBy = w.id; w.targetDessertCust = dessertTarget; w.state = 'toicecreamcabinet'; return; }
      }
      if (carriedTrashHand(w) >= 0 && hasFreeHand(w) >= 0 && state.trash.some((t) => t.claimedBy === null)) { w.state = 'totrash'; return; }
      if (carriedTrashHand(w) >= 0) { w.state = 'tobin'; return; }
      if (hasFreeHand(w) >= 0 && state.trash.some((t) => t.claimedBy === null)) { w.state = 'totrash'; return; }
      const idle = waiterIdlePoint(w);
      moveEntity(w, idle.x, idle.y, dt); return;
    }
    if (!w.drinksOnly && carriedPizzaHand(w) >= 0) { w.state = 'tocust'; return; }
    if (!w.drinksOnly && carriedBinBagHand(w) >= 0) { w.state = 'tobagdoor'; return; }
    if (!w.drinksOnly && binIsFull() && BIN.claimedBy === null && hasFreeHand(w) >= 0) {
      BIN.claimedBy = w.id;
      w.state = 'tofullbin';
      return;
    }
    if (!w.drinksOnly && carriedTrashHand(w) >= 0 && hasFreeHand(w) >= 0 && state.trash.some((t) => t.claimedBy === null)) { w.state = 'totrash'; return; }
    if (!w.drinksOnly && carriedTrashHand(w) >= 0) { w.state = 'tobin'; return; }
    if (!w.drinksOnly && hasFreeHand(w) >= 0 && state.trash.some((t) => t.claimedBy === null)) { w.state = 'totrash'; return; }
    if (drinkHand >= 0) { w.state = 'todrinkcust'; return; }
    if (progress.sodaCabinet && !equipmentUnavailable(equipment.soda) && hasFreeHand(w) >= 0) {
      const target = mostUrgentDrinkCustomer(null, w.id);
      if (target) {
        target.drinkClaimedBy = w.id;
        w.targetDrinkCust = target;
        w.state = 'todrinkcabinet';
        return;
      }
    }
    if (dessertHand >= 0) { w.state = 'todessertcust'; return; }
    if (progress.iceCreamCabinet && !equipmentUnavailable(equipment.iceCream) && hasFreeHand(w) >= 0) {
      const target = mostUrgentDessertCustomer(null, w.id);
      if (target) { target.dessertClaimedBy = w.id; w.targetDessertCust = target; w.state = 'toicecreamcabinet'; return; }
    }
    const idle = waiterIdlePoint(w);
    moveEntity(w, idle.x, idle.y, dt);
  }

  function updateWaiter(w, dt) {
    w.walk += dt * 6;
    if (w.state !== 'leave') {
      w.timer -= dt;
      if (w.timer <= 0) {
        w.timer = 0;
        w.state = 'leave';
        showStaffShiftNotice(w.drinksOnly ? 'drinks' : w.fast ? 'fast' : 'normal');
        return;
      }
    }

    if (w.state === 'enter') { const idle = waiterIdlePoint(w); if (moveEntity(w, idle.x, idle.y, dt)) w.state = 'seek'; return; }

    if (w.state === 'makingdessert') {
      const target = w.targetDessertCust;
      if (!target || target.state !== 'waiting' || target.dessertDelivered || target.dessertClaimedBy !== w.id) { w.action = null; w.targetDessertCust = null; w.state = 'seek'; return; }
      w.action.elapsed += dt;
      if (w.action.elapsed >= w.action.duration) {
        const hand = hasFreeHand(w);
        if (hand >= 0) w.hands[hand] = { t: 'dessert', id: target.dessertId };
        w.action = null; w.state = 'todessertcust'; registerEquipmentUse(equipment.iceCream); SND.done();
      }
      return;
    }

    if (w.state === 'leave') {
      // release any oven slot claim so assignJobs can reassign it
      if (w.targetSlot >= 0) { const s = oven().slots[w.targetSlot]; if (s && s.claimedBy === w.id) s.claimedBy = null; w.targetSlot = -1; }
      // return any carried items before leaving
      if (w.hands.some((h) => h)) {
        for (let i = 0; i < w.hands.length; i++) {
          const h = w.hands[i];
          if (!h) continue;
          if (h.t === 'pizza') returnPizzaToOven(h.pz);
          else if (h.t === 'trash') state.trash.push({ x: w.x, y: w.y + 6, claimedBy: null });
          else if (h.t === 'drink' && w.targetDrinkCust && w.targetDrinkCust.drinkClaimedBy === w.id) w.targetDrinkCust.drinkClaimedBy = null;
          else if (h.t === 'dessert' && w.targetDessertCust && w.targetDessertCust.dessertClaimedBy === w.id) w.targetDessertCust.dessertClaimedBy = null;
          w.hands[i] = null;
        }
      }
      if (w.targetCust && w.targetCust.claimedBy === w.id) w.targetCust.claimedBy = null;
      if (w.targetTrash && w.targetTrash.claimedBy === w.id) w.targetTrash.claimedBy = null;
      if (w.targetDrinkCust && w.targetDrinkCust.drinkClaimedBy === w.id) w.targetDrinkCust.drinkClaimedBy = null;
      if (w.targetDessertCust && w.targetDessertCust.dessertClaimedBy === w.id) w.targetDessertCust.dessertClaimedBy = null;
      if (BIN.claimedBy === w.id) BIN.claimedBy = null;
      if (moveEntity(w, ENTRANCE.x, H - 18, dt)) w.remove = true;
      return;
    }

    if (w.state === 'tooven') {
      const ov = oven(); const s = ov.slots[w.targetSlot];
      if (!s || !s.pizza || !s.done || s.claimedBy !== w.id) { w.targetSlot = -1; w.state = 'seek'; return; }
      const work = ovenWorkPoint(w.targetSlot);
      if (moveEntity(w, work.x, work.y, dt)) {
        const pz = takeReadyOvenSlot(w.targetSlot, w.id);
        if (pz) { const fh = hasFreeHand(w); if (fh >= 0) w.hands[fh] = { t: 'pizza', pz }; SND.done(); }
        w.targetSlot = -1; w.state = 'seek';
      }
      return;
    }

    if (w.state === 'tocust') {
      const ph = carriedPizzaHand(w);
      if (ph < 0) { w.state = 'seek'; return; }
      if (!w.targetCust || w.targetCust.state !== 'waiting' || w.targetCust.pizzaDelivered || w.targetCust.claimedBy !== w.id) {
        if (w.targetCust && w.targetCust.claimedBy === w.id) w.targetCust.claimedBy = null;
        const pick = preferredCustomerForPizza(w.hands[ph].pz);
        if (!pick) { w.targetCust = null; w.state = 'discard'; return; }
        pick.claimedBy = w.id; w.targetCust = pick;
      }
      const tgt = w.targetCust;
      const arrived = moveEntity(w, tgt.x, tgt.y, dt) || dist(w.x, w.y, tgt.x, tgt.y) < 42;
      if (arrived) {
        if (tgt.state === 'waiting') deliverByWaiter(tgt, w, ph);
        else if (tgt.claimedBy === w.id) tgt.claimedBy = null;
        w.targetCust = null; w.state = 'seek';
      }
      return;
    }

    if (w.state === 'totrash') {
      if (!w.targetTrash || !state.trash.includes(w.targetTrash) || w.targetTrash.claimedBy !== w.id) {
        if (w.targetTrash && w.targetTrash.claimedBy === w.id) w.targetTrash.claimedBy = null;
        const tp = nearestTrashUnclaimed();
        if (!tp) { w.targetTrash = null; w.state = 'seek'; return; }
        tp.claimedBy = w.id; w.targetTrash = tp;
      }
      const tp = w.targetTrash;
      if (moveEntity(w, tp.x, tp.y, dt) || dist(w.x, w.y, tp.x, tp.y) < 40) {
        const fh = hasFreeHand(w);
        if (fh >= 0) w.hands[fh] = { t: 'trash' };
        const idx = state.trash.indexOf(tp); if (idx >= 0) state.trash.splice(idx, 1);
        w.targetTrash = null; w.state = 'seek';
      }
      return;
    }

    if (w.state === 'tobin') {
      if (moveEntity(w, BIN.x, BIN.y, dt) || dist(w.x, w.y, BIN.x, BIN.y) < 46) {
        depositWaiterTrash(w);
        w.state = 'seek';
      }
      return;
    }

    if (w.state === 'tofullbin') {
      if (!binIsFull() || (BIN.claimedBy !== null && BIN.claimedBy !== w.id)) {
        if (BIN.claimedBy === w.id) BIN.claimedBy = null;
        w.state = 'seek';
        return;
      }
      if (moveEntity(w, BIN.x, BIN.y, dt) || dist(w.x, w.y, BIN.x, BIN.y) < 46) {
        const hand = hasFreeHand(w);
        if (hand >= 0 && takeBinBag(w.hands, hand, w.id, true)) w.state = 'tobagdoor';
        else w.state = 'seek';
      }
      return;
    }

    if (w.state === 'tobagdoor') {
      const hand = carriedBinBagHand(w);
      if (hand < 0) { w.state = 'seek'; return; }
      if (moveEntity(w, ENTRANCE.x, H - 18, dt)) {
        w.hands[hand] = null;
        SND.bin();
        w.state = 'seek';
      }
      return;
    }

    if (w.state === 'todrinkcabinet') {
      if (equipmentUnavailable(equipment.soda)) { if (w.targetDrinkCust && w.targetDrinkCust.drinkClaimedBy === w.id) w.targetDrinkCust.drinkClaimedBy = null; w.targetDrinkCust = null; w.state = 'seek'; return; }
      const target = w.targetDrinkCust;
      if (!target || !target.drinkId || target.drinkDelivered || (target.state !== 'waiting' && target.state !== 'eating')) {
        if (target && target.drinkClaimedBy === w.id) target.drinkClaimedBy = null;
        w.targetDrinkCust = null; w.state = 'seek'; return;
      }
      const work = stationWorkPoint(SODA, w);
      if (moveEntity(w, work.x, work.y, dt)) {
        const hand = hasFreeHand(w);
        if (hand >= 0) { w.hands[hand] = { t: 'drink', id: target.drinkId }; registerEquipmentUse(equipment.soda); }
        w.state = 'todrinkcust';
      }
      return;
    }

    if (w.state === 'todrinkcust') {
      const hand = carriedDrinkHand(w);
      const target = w.targetDrinkCust;
      if (hand < 0) { w.targetDrinkCust = null; w.state = 'seek'; return; }
      if (!target || !target.drinkId || target.drinkDelivered || (target.state !== 'waiting' && target.state !== 'eating')) {
        if (target && target.drinkClaimedBy === w.id) target.drinkClaimedBy = null;
        const replacement = mostUrgentDrinkCustomer(w.hands[hand].id, w.id);
        if (replacement) {
          replacement.drinkClaimedBy = w.id;
          w.targetDrinkCust = replacement;
        } else {
          w.targetDrinkCust = null; w.state = 'discard';
        }
        return;
      }
      if (moveEntity(w, target.x, target.y, dt) || dist(w.x, w.y, target.x, target.y) < 42) {
        if (deliverDrink(target, w.hands[hand], w.id)) w.hands[hand] = null;
        w.targetDrinkCust = null; w.state = 'seek';
      }
      return;
    }

    if (w.state === 'toicecreamcabinet') {
      if (equipmentUnavailable(equipment.iceCream)) { if (w.targetDessertCust && w.targetDessertCust.dessertClaimedBy === w.id) w.targetDessertCust.dessertClaimedBy = null; w.targetDessertCust = null; w.state = 'seek'; return; }
      const target = w.targetDessertCust;
      if (!target || target.state !== 'waiting' || !target.dessertId || target.dessertDelivered || target.dessertClaimedBy !== w.id) {
        if (target && target.dessertClaimedBy === w.id) target.dessertClaimedBy = null;
        w.targetDessertCust = null; w.state = 'seek'; return;
      }
      const work = stationWorkPoint(ICE_CREAM, w);
      if (moveEntity(w, work.x, work.y, dt)) {
        w.action = { elapsed: 0, duration: dessertDuration(target.dessertId), label: 'Make ' + DESSERTS[target.dessertId].name };
        w.state = 'makingdessert';
      }
      return;
    }

    if (w.state === 'todessertcust') {
      const hand = carriedDessertHand(w), target = w.targetDessertCust;
      if (hand < 0) { w.targetDessertCust = null; w.state = 'seek'; return; }
      if (!target || target.state !== 'waiting' || target.dessertDelivered) {
        if (target && target.dessertClaimedBy === w.id) target.dessertClaimedBy = null;
        const replacement = mostUrgentDessertCustomer(w.hands[hand].id, w.id);
        if (replacement) { replacement.dessertClaimedBy = w.id; w.targetDessertCust = replacement; }
        else { w.targetDessertCust = null; w.state = 'discard'; }
        return;
      }
      if (moveEntity(w, target.x, target.y, dt) || dist(w.x, w.y, target.x, target.y) < 42) {
        if (deliverDessert(target, w.hands[hand], w.id)) w.hands[hand] = null;
        w.targetDessertCust = null; w.state = 'seek';
      }
      return;
    }

    if (w.state === 'discard') {
      const pizzaHand = carriedPizzaHand(w);
      const drinkHand = carriedDrinkHand(w);
      const dessertHand = carriedDessertHand(w);
      if (pizzaHand >= 0) {
        const recipeId = pizzaRecipeId(w.hands[pizzaHand].pz);
        const renewed = mostImpatientUnclaimed(recipeId);
        if (renewed) {
          renewed.claimedBy = w.id; w.targetCust = renewed; w.state = 'tocust'; return;
        }
      }
      if (drinkHand >= 0) {
        const renewed = mostUrgentDrinkCustomer(w.hands[drinkHand].id, w.id);
        if (renewed) {
          renewed.drinkClaimedBy = w.id; w.targetDrinkCust = renewed; w.state = 'todrinkcust'; return;
        }
      }
      if (dessertHand >= 0) {
        const renewed = mostUrgentDessertCustomer(w.hands[dessertHand].id, w.id);
        if (renewed) { renewed.dessertClaimedBy = w.id; w.targetDessertCust = renewed; w.state = 'todessertcust'; return; }
      }
      if (moveEntity(w, BIN.x, BIN.y, dt) || dist(w.x, w.y, BIN.x, BIN.y) < 46) {
        if (pizzaHand >= 0) { w.hands[pizzaHand] = null; state.cash -= 3; shift.stats.wasteCosts += 3; }
        else if (drinkHand >= 0) { w.hands[drinkHand] = null; state.cash -= 1; shift.stats.wasteCosts += 1; }
        else if (dessertHand >= 0) { w.hands[dessertHand] = null; state.cash -= 1; shift.stats.wasteCosts += 1; }
        SND.bin(); w.state = 'seek';
      }
      return;
    }

    if (w.state === 'seek') { pickWaiterJob(w, dt); return; }
  }

  /* ---------- chefs ---------- */
  function hireChef() {
    const cost = discountedStaffCost(CHEF_COST);
    if (state.cash < cost) return;
    state.cash -= cost; shift.stats.staffCosts += cost;
    const usedIdleSlots = new Set(state.chefs.filter((chef) => !chef.remove).map((chef) => chef.idleSlot));
    let idleSlot = 0;
    while (usedIdleSlots.has(idleSlot)) idleSlot++;
    state.chefs.push({
      id: ++chefSeq, x: ENTRANCE.x, y: ENTRANCE.y, r: 13, speed: state.player.speed * 0.8,
      hands: [null, null], state: 'enter', action: null, pending: null, targetSlot: -1, handSlot: -1,
      timer: CHEF_DURATION, walk: 0, idleSlot, prepSpot: -1,
    });
    SND.hire();
  }
  function chefOrderEstimateSeconds(recipeId, customer) {
    const recipe = RECIPES[recipeId];
    if (!recipe || !customer) return Infinity;
    const prepSeconds = (kneadDuration() + recipe.ingredients.slice(1).reduce((sum, id) => sum + ING_MAP[id].dur, 0)) * 1.2;
    const fastestWaiter = state.waiters.filter((w) => !w.remove && w.state !== 'leave' && !w.drinksOnly).reduce((speed, w) => Math.max(speed, w.speed), 0);
    const deliverySpeed = Math.max(state.player.speed, fastestWaiter);
    const deliverySeconds = dist(oven().use.x, oven().use.y, customer.x, customer.y) / deliverySpeed + 1.5;
    return prepSeconds + bakeDuration() + deliverySeconds + 2;
  }
  function chefCanReachCustomer(customer) {
    const patienceDrain = jukeboxWorking() ? 0.75 : 1;
    return customer.patience / patienceDrain > chefOrderEstimateSeconds(customer.recipeId, customer);
  }
  function claimableChefCustomer() {
    return state.customers
      .filter((c) => c.state === 'waiting' && !c.pizzaDelivered && c.chefOrderClaimedBy === null && chefCanReachCustomer(c))
      .sort(compareCustomerUrgency)[0] || null;
  }
  // chef picks its next task each frame while in 'seekwork'
  function chefNext(chef) {
    const ov = oven();
    const slots = activeOvenSlots(ov);
    const ovenFull = slots.every((s, index) => s.pizza || equipmentUnavailable(equipment.ovens[index]));
    const readyHand = chef.hands.findIndex((h) => h && h.t === 'pizza' && pizzaReadyToBake(h.pz));
    if (readyHand >= 0) {
      const freeOven = slots.findIndex((s, index) => !s.pizza && !equipmentUnavailable(equipment.ovens[index]));
      if (freeOven >= 0) { chef.state = 'tooven'; chef.targetSlot = freeOven; chef.handSlot = readyHand; return; }
      return; // oven full: hold the ready pizza and wait
    }
    if (ovenFull) return; // both ovens busy: stop until a slot frees
    const wipHand = chef.hands.findIndex((h) => h && h.t === 'pizza' && !pizzaReadyToBake(h.pz));
    if (wipHand >= 0) {
      const nx = nextActionForPizza(chef.hands[wipHand].pz);
      if (nx) { chef.state = 'toprep'; chef.pending = { type: 'add', handIdx: wipHand, ingId: nx.ing.id, label: nx.action, dur: nx.ing.dur }; return; }
    }
    const freeHand = chef.hands.findIndex((h) => !h);
    if (freeHand >= 0) {
      const target = claimableChefCustomer();
      if (!target) return;
      target.chefOrderClaimedBy = chef.id;
      chef.state = 'toprep';
      chef.pending = { type: 'knead', handIdx: freeHand, recipeId: target.recipeId, targetCustomerId: target.id, label: 'Knead ' + RECIPES[target.recipeId].name, dur: kneadDuration() };
      return;
    }
  }
  function startChefPrep(chef) {
    const p = chef.pending; chef.pending = null;
    if (!p) { chef.state = 'seekwork'; return; }
    const dur = p.dur * 1.2; // 20% slower than the player
    if (p.type === 'knead') {
      chef.action = { label: p.label, duration: dur, elapsed: 0, targetCustomerId: p.targetCustomerId, onComplete: () => {
        const pizza = newPizza('dough', p.recipeId);
        pizza.targetCustomerId = p.targetCustomerId;
        chef.hands[p.handIdx] = { t: 'pizza', pz: pizza };
        SND.done();
      } };
    } else {
      const idx = p.handIdx, id = p.ingId;
      chef.action = { label: p.label, duration: dur, elapsed: 0, onComplete: () => { if (chef.hands[idx] && chef.hands[idx].pz) chef.hands[idx].pz.added.add(id); SND.done(); } };
    }
    chef.state = 'prepping';
  }
  function placeChefPizza(chef) {
    const s = oven().slots[chef.targetSlot];
    if (s && !s.pizza && !equipmentUnavailable(equipment.ovens[chef.targetSlot]) && chef.hands[chef.handSlot] && chef.hands[chef.handSlot].t === 'pizza') {
      s.pizza = chef.hands[chef.handSlot].pz; s.pizza.recipeId = recipeForPizza(s.pizza); s.baking = true; s.done = false; s.timer = 0; s.claimedBy = null;
      chef.hands[chef.handSlot] = null; SND.step();
    }
    chef.targetSlot = -1; chef.handSlot = -1;
  }
  function updateChef(chef, dt) {
    chef.walk += dt * 6;
    if (chef.state !== 'leave') {
      chef.timer -= dt;
      if (chef.timer <= 0) {
        chef.timer = 0;
        const pendingCustomerId = chef.pending && chef.pending.targetCustomerId;
        const actionCustomerId = chef.action && chef.action.targetCustomerId;
        const customerId = pendingCustomerId !== undefined ? pendingCustomerId : actionCustomerId;
        if (customerId !== undefined) {
          const customer = state.customers.find((c) => c.id === customerId);
          if (customer && customer.chefOrderClaimedBy === chef.id) customer.chefOrderClaimedBy = null;
        }
        chef.state = 'leave';
        chef.prepSpot = -1;
        showStaffShiftNotice('chef');
        return;
      }
    }
    if (chef.state === 'enter') { const idle = chefIdlePoint(chef); if (moveEntity(chef, idle.x, idle.y, dt)) chef.state = 'seekwork'; return; }
    if (chef.state === 'leave') {
      for (let i = 0; i < chef.hands.length; i++) { const h = chef.hands[i]; if (h && h.t === 'pizza') { if (pizzaReadyToBake(h.pz)) returnPizzaToOven(h.pz); chef.hands[i] = null; } }
      if (chef.action) chef.action = null; if (chef.pending) chef.pending = null; chef.prepSpot = -1;
      if (moveEntity(chef, ENTRANCE.x, H - 18, dt)) chef.remove = true;
      return;
    }
    if (chef.state === 'prepping') {
      chef.action.elapsed += dt;
      if (chef.action.elapsed >= chef.action.duration) { const cb = chef.action.onComplete; chef.action = null; chef.prepSpot = -1; chef.state = 'seekwork'; cb && cb(); }
      return;
    }
    if (chef.state === 'toprep') { claimChefPrepSpot(chef); const work = chefPrepPoint(chef); if (moveEntity(chef, work.x, work.y, dt)) startChefPrep(chef); return; }
    if (chef.state === 'tooven') { const work = ovenWorkPoint(chef.targetSlot); if (moveEntity(chef, work.x, work.y, dt)) { placeChefPizza(chef); chef.state = 'seekwork'; } return; }
    if (chef.state === 'seekwork') { chefNext(chef); if (chef.state === 'seekwork') { const idle = chefIdlePoint(chef); moveEntity(chef, idle.x, idle.y, dt); } return; }
  }

  /* ---------- player update ---------- */
  function updatePlayer(dt) {
    const p = state.player;
    if (p.action) {
      p.moving = false;
      p.action.elapsed += dt;
      if (p.action.elapsed >= p.action.duration) { const cb = p.action.onComplete; p.action = null; cb && cb(); }
      return;
    }
    let vx = 0, vy = 0;
    if (Input.keys['KeyA'] || Input.keys['ArrowLeft']) vx -= 1;
    if (Input.keys['KeyD'] || Input.keys['ArrowRight']) vx += 1;
    if (Input.keys['KeyW'] || Input.keys['ArrowUp']) vy -= 1;
    if (Input.keys['KeyS'] || Input.keys['ArrowDown']) vy += 1;
    const moving = vx || vy;
    p.moving = !!moving;
    if (moving) {
      const m = Math.hypot(vx, vy); vx /= m; vy /= m;
      if (vx < 0) p.dir = -1; else if (vx > 0) p.dir = 1;
      let nx = p.x + vx * p.speed * dt, ny = p.y + vy * p.speed * dt;
      nx = clamp(nx, 28, W - 28); ny = clamp(ny, 180, H - 18);
      for (const t of activeTables()) {
        const d = dist(nx, ny, t.x, t.y), min = t.r + p.r - 2;
        if (d < min && d > 0) { const a = Math.atan2(ny - t.y, nx - t.x); nx = t.x + Math.cos(a) * min; ny = t.y + Math.sin(a) * min; }
      }
      if (nx > PICKUP.x - 6 && nx < PICKUP.x + PICKUP.w + 6 && ny > PICKUP.y - p.r - 6 && ny < PICKUP.y + PICKUP.h + p.r + 6) ny = p.y < PICKUP.y ? PICKUP.y - p.r - 6 : PICKUP.y + PICKUP.h + p.r + 6;
      p.x = nx; p.y = ny; p.walk += dt * 10;
    }
    if (inBinRange(p) && p.trash.some((item) => item && item.t === 'trash') && !binIsFull()) depositPlayerTrash();
    if (dist(p.x, p.y, ENTRANCE.x, ENTRANCE.y) < 42) {
      let removedBag = false;
      for (let i = 0; i < p.trash.length; i++) {
        if (p.trash[i] && p.trash[i].t === 'binbag') { p.trash[i] = null; removedBag = true; }
      }
      if (removedBag) SND.bin();
    }
    if (Input.pressed['KeyE'] || Input.pressed['Space']) tryInteract();
  }

  /* ---------- rendering ---------- */
  function drawFloor() {
    const ts = 48;
    for (let y = 0; y < H; y += ts) for (let x = 0; x < W; x += ts) {
      if (floorTilesReady) {
        const tx = x / ts, ty = y / ts;
        const variant = Math.abs(tx * 17 + ty * 31 + tx * ty * 7) % 4;
        ctx.drawImage(floorTiles, (variant % 2) * ts, Math.floor(variant / 2) * ts, ts, ts, x, y, ts, ts);
      } else {
        ctx.fillStyle = (((x / ts) + (y / ts)) | 0) % 2 ? C.floor1 : C.floor2;
        ctx.fillRect(x, y, ts, ts);
      }
    }
    ctx.fillStyle = C.wall; ctx.fillRect(0, 0, W, 60);
    ctx.fillStyle = C.wallTrim; ctx.fillRect(0, 58, W, 5);
    ctx.fillStyle = '#7a4a2e'; ctx.fillRect(ENTRANCE.x - 34, H - 14, 68, 14);
    ctx.fillStyle = '#5e3722'; ctx.fillRect(ENTRANCE.x - 28, H - 11, 56, 8);
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawIngredient(name, cx, cy, r) {
    if (name === 'dough') {
      ctx.fillStyle = '#ead7a8'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.strokeStyle = '#cdb98a'; ctx.lineWidth = 2; ctx.stroke();
    } else if (name === 'sauce') {
      ctx.fillStyle = '#a52a20'; roundRect(cx - r, cy - r * 0.8, r * 2, r * 1.6, 4); ctx.fill();
      ctx.fillStyle = C.sauce; ctx.beginPath(); ctx.arc(cx, cy + 1, r - 3, 0, 7); ctx.fill();
    } else if (name === 'cheese') {
      ctx.fillStyle = '#e6c12e'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff2a0';
      ctx.beginPath(); ctx.arc(cx - 3, cy - 3, 2.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4, cy + 3, 2.6, 0, 7); ctx.fill();
    } else if (name === 'pepperoni') {
      ctx.fillStyle = '#b83a2f'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = '#f08a72'; ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 2, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4, cy + 3, 2, 0, 7); ctx.fill();
    } else if (name === 'mushroom') {
      ctx.fillStyle = '#d8c5aa'; ctx.beginPath(); ctx.arc(cx, cy - 2, r, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#a98f72'; ctx.fillRect(cx - 3, cy - 2, 6, r);
    } else if (name === 'zucchini') {
      ctx.fillStyle = '#6f9f3d'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = '#c4db72'; ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#547b31'; ctx.beginPath(); ctx.arc(cx, cy, 2, 0, 7); ctx.fill();
    }
  }
  function drawBin() {
    // body
    ctx.fillStyle = binIsFull() ? '#8f2f2a' : C.bin; roundRect(BIN.x - 13, BIN.y - 12, 26, 26, 4); ctx.fill();
    ctx.fillStyle = binIsFull() ? '#c44b42' : C.binLid; roundRect(BIN.x - 15, BIN.y - 14, 30, 6, 3); ctx.fill();
    // ribs
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(BIN.x - 11, BIN.y - 4 + i * 7); ctx.lineTo(BIN.x + 11, BIN.y - 4 + i * 7); ctx.stroke(); }
    ctx.fillStyle = C.text; ctx.font = "700 9px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(binIsFull() ? 'FULL · TO DOOR' : 'Trash ' + BIN.count + '/' + BIN.capacity, BIN.x, BIN.y + 22);
  }
  function drawTrashPiles() {
    for (const t of state.trash) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.ellipse(t.x, t.y + 3, 9, 3, 0, 0, 7); ctx.fill();
      ctx.fillStyle = C.trash; roundRect(t.x - 7, t.y - 3, 9, 6, 2); ctx.fill();
      ctx.fillStyle = C.trashPaper; roundRect(t.x + 1, t.y - 5, 7, 5, 2); ctx.fill();
      ctx.fillStyle = '#cfc4a8'; ctx.beginPath(); ctx.arc(t.x - 2, t.y + 2, 2, 0, 7); ctx.fill();
    }
  }
  function drawStation(s) {
    const x = s.cx - s.w / 2, y = 70;
    if (s.id === 'oven' && ovenSpriteReady) {
      drawSpriteOven(s);
      return;
    }
    if (s.id === 'prep' && prepSpriteReady) {
      drawSpritePrep(s);
      return;
    }
    ctx.fillStyle = C.counter; roundRect(x, y, s.w, s.h, 10); ctx.fill();
    ctx.fillStyle = C.counterTop; roundRect(x, y, s.w, 22, 10); ctx.fill(); ctx.fillRect(x, y + 8, s.w, 14);
    ctx.fillStyle = s.id === 'oven' ? C.oven : '#f0e3c0';
    roundRect(x + 10, y + 28, s.w - 20, s.h - 38, 8); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = "700 15px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s.label, s.cx, y + 14);
    if (s.id === 'prep') {
      const atPrep = inStationRange(state.player, s);
      availableIngredients().forEach((ing) => {
        const addable = atPrep && !state.player.action && (
          (ing.isBase && firstFreeHand() >= 0) || state.player.pizzas.some((pz) => canAddIngredient(pz, ing))
        );
        let canEver = true;
        if (!ing.isBase) canEver = state.player.pizzas.some((pz) => pz && !pz.baked && ing.requires.every((r) => pz.added.has(r)) && !pz.added.has(ing.id));
        if (addable) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(ing.iconX, ING_ICON_Y, 16, 0, 7); ctx.fill(); }
        ctx.globalAlpha = (!ing.isBase && atPrep && !canEver && !addable) ? 0.4 : 1;
        drawIngredient(ing.id, ing.iconX, ING_ICON_Y, 13);
        ctx.globalAlpha = 1;
      });
    } else drawOvenSlots(s, y);
  }
  function drawSpritePrep(station) {
    const layout = { sx: 39, sy: 98, sw: 690, sh: 341, dw: 220, dh: 108, x: station.cx - 110, y: 88 };
    ctx.drawImage(prepSprite, layout.sx, layout.sy, layout.sw, layout.sh, layout.x, layout.y, layout.dw, layout.dh);
    const socketRects = [
      { x: 122, y: 119, w: 94, h: 40 },
      { x: 226, y: 119, w: 92, h: 40 },
      { x: 330, y: 119, w: 92, h: 40 },
      { x: 433, y: 119, w: 91, h: 40 },
      { x: 535, y: 119, w: 91, h: 40 },
      { x: 638, y: 119, w: 90, h: 40 },
    ];
    const available = new Set(availableIngredients().map((ingredient) => ingredient.id));
    INGREDIENTS.forEach((ingredient, index) => {
      if (!available.has(ingredient.id) || !prepIngredientsSpriteReady) return;
      const socket = socketRects[index];
      const dx = layout.x + ((socket.x - layout.sx) / layout.sw) * layout.dw;
      const dy = layout.y + ((socket.y - layout.sy) / layout.sh) * layout.dh;
      const dw = (socket.w / layout.sw) * layout.dw;
      const dh = (socket.h / layout.sh) * layout.dh;
      const inset = 1.5;
      ctx.drawImage(prepIngredientsSprite, index * 96 + 8, 9, 80, 30, dx + inset, dy + inset, dw - inset * 2, dh - inset * 2);
    });
    if (inStationRange(state.player, station)) {
      const nextIngredientIds = new Set();
      if (firstFreeHand() >= 0) nextIngredientIds.add('dough');
      state.player.pizzas.forEach((pizza) => {
        if (!pizza || pizza.baked) return;
        const next = nextActionForPizza(pizza);
        if (next) nextIngredientIds.add(next.ing.id);
      });
      INGREDIENTS.forEach((ingredient, index) => {
        if (!nextIngredientIds.has(ingredient.id) || !available.has(ingredient.id)) return;
        const socket = socketRects[index];
        const cx = layout.x + (((socket.x + socket.w / 2) - layout.sx) / layout.sw) * layout.dw;
        const cy = layout.y + (((socket.y + socket.h / 2) - layout.sy) / layout.sh) * layout.dh;
        ctx.strokeStyle = 'rgba(126,190,75,0.9)'; ctx.lineWidth = 2;
        roundRect(cx - 16, cy - 8, 32, 16, 5); ctx.stroke();
      });
    }
  }
  function ovenSpriteLayout(count = progress.ovenSlots) {
    const layouts = {
      1: { sx: 105, sy: 28, sw: 300, sh: 225, dw: 108, dh: 81, y: 113, mouths: [0.502] },
      2: { sx: 60, sy: 273, sw: 390, sh: 235, dw: 165, dh: 100, y: 94, mouths: [0.276, 0.731] },
      3: { sx: 25, sy: 523, sw: 460, sh: 230, dw: 210, dh: 105, y: 89, mouths: [0.217, 0.505, 0.793] },
    };
    const layout = layouts[count] || layouts[1];
    return Object.assign({ x: oven().cx - layout.dw / 2 }, layout);
  }
  function drawReadySmoke(x, chimneyY) {
    ctx.save();
    for (let i = 0; i < 4; i++) {
      const phase = (state.time * 0.36 + i * 0.23) % 1;
      const px = x + Math.sin(state.time * 1.7 + i * 1.4) * (3 + phase * 5);
      const py = chimneyY - phase * 34;
      ctx.globalAlpha = Math.sin(phase * Math.PI) * 0.32;
      ctx.fillStyle = '#efe8dd';
      ctx.beginPath();
      ctx.arc(px, py, 3 + phase * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawSpriteOven(ov) {
    const layout = ovenSpriteLayout();
    ctx.drawImage(ovenSprite, layout.sx, layout.sy, layout.sw, layout.sh, layout.x, layout.y, layout.dw, layout.dh);
    const slots = activeOvenSlots(ov);
    const mouthY = layout.y + layout.dh * 0.64;
    slots.forEach((slot, index) => {
      const cx = layout.x + layout.dw * layout.mouths[index];
      if (slot.pizza) {
        drawPizza(cx, mouthY, pizzaStage(slot.pizza), progress.ovenSlots === 1 ? 0.62 : 0.55);
        if (slot.baking) {
          const width = progress.ovenSlots === 1 ? 36 : 31;
          const pct = clamp(slot.timer / bakeDuration(), 0, 1);
          ctx.fillStyle = 'rgba(0,0,0,0.55)'; roundRect(cx - width / 2, mouthY + 16, width, 4, 2); ctx.fill();
          ctx.fillStyle = C.good; roundRect(cx - width / 2, mouthY + 16, width * pct, 4, 2); ctx.fill();
        }
        if (slot.done) {
          ctx.strokeStyle = '#ffd98a'; ctx.lineWidth = 2;
          ctx.globalAlpha = 0.55 + Math.sin(state.time * 6) * 0.25;
          ctx.beginPath(); ctx.arc(cx, mouthY, 11, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      drawEquipmentStatus(equipment.ovens[index], cx, layout.y + layout.dh * 0.34);
    });
    if (slots.some((slot) => slot.done)) drawReadySmoke(ov.cx, layout.y + 8);
  }
  // Vector fallback placeholder: each unlocked mouth can later map to an oven-slot sprite/frame.
  function drawOvenSlots(ov, y) {
    const slotW = 66, slotH = 46, cy = y + 58;
    const slots = activeOvenSlots(ov);
    slots.forEach((s, index) => {
      const spacing = slots.length === 3 ? 84 : slots.length === 2 ? 104 : 0;
      const cx = ov.cx + (index - (slots.length - 1) / 2) * spacing;
      const sx = cx - slotW / 2, sy = cy - slotH / 2;
      ctx.fillStyle = '#3a2517'; roundRect(sx, sy, slotW, slotH, 6); ctx.fill();
      ctx.fillStyle = C.ovenMouth; ctx.globalAlpha = s.baking ? 0.85 : 0.25;
      roundRect(sx + 5, sy + 5, slotW - 10, slotH - 10, 4); ctx.fill(); ctx.globalAlpha = 1;
      if (s.pizza) {
        drawPizza(cx, cy, pizzaStage(s.pizza), 1.0);
        if (s.baking) {
          const pct = s.timer / bakeDuration();
          ctx.fillStyle = 'rgba(0,0,0,0.5)'; roundRect(sx + 6, sy + slotH - 8, slotW - 12, 4, 2); ctx.fill();
          ctx.fillStyle = C.good; roundRect(sx + 6, sy + slotH - 8, (slotW - 12) * pct, 4, 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          for (let k = 0; k < 3; k++) { const t = (state.time * 1.5 + k * 0.4) % 1; ctx.globalAlpha = (1 - t) * 0.3; ctx.beginPath(); ctx.arc(cx + (k - 1) * 6, sy - t * 14, 3, 0, 7); ctx.fill(); }
          ctx.globalAlpha = 1;
        }
        if (s.done) { ctx.strokeStyle = '#ffd9a0'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6 + Math.sin(state.time * 6) * 0.3; ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
      }
      drawEquipmentStatus(equipment.ovens[index], cx, sy - 7);
    });
  }
  // Vector fallback placeholder: replace this function with table sprites without changing game state.
  function drawTables() {
    for (const t of activeTables()) {
      for (const s of t.seats) { ctx.fillStyle = s.occupied ? '#6b3f2c' : C.chair; roundRect(s.x - 11, s.y - 11, 22, 22, 5); ctx.fill(); }
      ctx.fillStyle = C.table; ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, 7); ctx.fill();
      ctx.fillStyle = C.tableTop; ctx.beginPath(); ctx.arc(t.x, t.y, t.r - 6, 0, 7); ctx.fill();
    }
  }
  function drawPickup() {
    ctx.fillStyle = C.counter; roundRect(PICKUP.x, PICKUP.y, PICKUP.w, PICKUP.h, 8); ctx.fill();
    ctx.fillStyle = C.counterTop; roundRect(PICKUP.x, PICKUP.y, PICKUP.w, 10, 8); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = "700 12px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Pickup', PICKUP.x + PICKUP.w / 2, PICKUP.y + PICKUP.h / 2 + 2);
  }
  function drawSodaCabinet() {
    if (!progress.sodaCabinet) return;
    ctx.fillStyle = '#35434a'; roundRect(SODA.x, SODA.y, SODA.w, SODA.h, 8); ctx.fill();
    ctx.fillStyle = '#8ed0e8'; roundRect(SODA.x + 7, SODA.y + 8, SODA.w - 14, 34, 5); ctx.fill();
    ctx.fillStyle = '#1f292e'; roundRect(SODA.x + 7, SODA.y + 48, SODA.w - 14, 16, 4); ctx.fill();
    ctx.fillStyle = C.textInv; ctx.font = "700 9px 'Inter', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('DRINKS', SODA.x + SODA.w / 2, SODA.y + 58);
    drawEquipmentStatus(equipment.soda, SODA.x + SODA.w / 2, SODA.y - 8);
  }
  function drawIceCreamCabinet() {
    if (!progress.iceCreamCabinet) return;
    ctx.fillStyle = '#6d5a78'; roundRect(ICE_CREAM.x, ICE_CREAM.y, ICE_CREAM.w, ICE_CREAM.h, 8); ctx.fill();
    ctx.fillStyle = '#d9eef2'; roundRect(ICE_CREAM.x + 7, ICE_CREAM.y + 8, ICE_CREAM.w - 14, 38, 5); ctx.fill();
    ctx.fillStyle = '#47384e'; roundRect(ICE_CREAM.x + 7, ICE_CREAM.y + 52, ICE_CREAM.w - 14, 18, 4); ctx.fill();
    drawDessertIcon('sundae', ICE_CREAM.x + ICE_CREAM.w / 2, ICE_CREAM.y + 27);
    ctx.fillStyle = C.textInv; ctx.font = "700 8px 'Inter', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('ICE CREAM', ICE_CREAM.x + ICE_CREAM.w / 2, ICE_CREAM.y + 64);
    drawEquipmentStatus(equipment.iceCream, ICE_CREAM.x + ICE_CREAM.w / 2, ICE_CREAM.y - 8);
  }
  function drawJukebox() {
    if (!progress.jukebox) return;
    const x = 904, y = 500;
    ctx.fillStyle = 'rgba(35,24,20,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y + 35, 24, 6, 0, 0, Math.PI * 2); ctx.fill();
    if (jukeboxSpriteReady) {
      ctx.drawImage(jukeboxSprite, x - 25, y - 40, 50, 75);
    } else {
      ctx.fillStyle = '#5a2f32'; roundRect(x - 18, y - 28, 36, 56, 10); ctx.fill();
      ctx.fillStyle = '#e8b04a'; ctx.beginPath(); ctx.arc(x, y - 10, 12, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#303b46'; roundRect(x - 11, y - 10, 22, 22, 4); ctx.fill();
      ctx.fillStyle = '#f2d15d'; ctx.beginPath(); ctx.arc(x, y + 1, 7, 0, 7); ctx.fill();
    }
    if (!jukeboxWorking()) { drawEquipmentStatus(equipment.jukebox, x, y - 48); return; }
    ctx.save();
    ctx.font = "900 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 4; i++) {
      const phase = (state.time * 0.42 + i * 0.24) % 1;
      const noteX = x - 14 + i * 9 + Math.sin(state.time * 2.2 + i * 1.8) * 4;
      const noteY = y - 35 - phase * 34;
      ctx.globalAlpha = Math.sin(phase * Math.PI) * 0.82;
      ctx.fillStyle = i % 2 ? '#70d95b' : '#4fbf69';
      ctx.fillText(i % 2 ? '\u266a' : '\u266b', noteX, noteY);
    }
    ctx.restore();
  }
  function drawEquipmentStatus(item, x, y) {
    if (!equipmentUnavailable(item)) return;
    const text = item.serviceTimer > 0 ? 'REPAIR ' + Math.ceil(item.serviceTimer) + 's' : item.maintenanceReserved ? 'MAINTENANCE' : 'BROKEN';
    ctx.font = "900 9px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const width = ctx.measureText(text).width + 12;
    ctx.fillStyle = item.broken ? 'rgba(199,54,61,0.94)' : 'rgba(39,126,112,0.94)';
    roundRect(x - width / 2, y - 8, width, 16, 6); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(text, x, y);
  }
  function drawDrinkIcon(id, x, y) {
    const drink = DRINKS[id]; if (!drink) return;
    ctx.fillStyle = drink.color; roundRect(x - 4, y - 8, 8, 16, 2); ctx.fill();
    ctx.fillStyle = '#eef7fa'; ctx.fillRect(x - 3, y - 6, 6, 2);
  }
  function drawDessertIcon(id, x, y) {
    if (id === 'milkshake') {
      ctx.fillStyle = '#f0c7d8'; roundRect(x - 5, y - 8, 10, 17, 3); ctx.fill();
      ctx.strokeStyle = '#f7f0df'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 2, y - 7); ctx.lineTo(x + 6, y - 15); ctx.stroke();
    } else {
      ctx.fillStyle = '#fff0dc'; ctx.beginPath(); ctx.arc(x, y - 5, 7, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#d995b5'; ctx.beginPath(); ctx.arc(x, y - 9, 5, 0, 7); ctx.fill();
      ctx.fillStyle = '#8d5b43'; roundRect(x - 5, y - 4, 10, 10, 2); ctx.fill();
    }
  }
  function drawPizza(cx, cy, stage, scale = 1) {
    const r = 13 * scale;
    if (stage === 'dough') {
      ctx.fillStyle = C.pizzaDough; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.strokeStyle = '#d9c290'; ctx.lineWidth = 1.5; ctx.stroke();
    } else if (stage === 'sauce') {
      ctx.fillStyle = C.pizzaDough; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = C.pizzaSauce; ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, 7); ctx.fill();
    } else if (stage === 'cheese') {
      ctx.fillStyle = C.pizzaDough; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = C.pizzaCheese; ctx.beginPath(); ctx.arc(cx, cy, r - 2.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 1.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4, cy + 2, 1.6, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    } else if (stage === 'pepperoni' || stage === 'mushroom' || stage === 'zucchini' || stage.startsWith('baked-')) {
      const baked = stage.startsWith('baked-');
      const recipe = baked ? stage.slice(6) : stage;
      ctx.fillStyle = baked ? C.pizzaBaked : C.pizzaDough; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = baked ? '#d3543a' : C.pizzaCheese; ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, 7); ctx.fill();
      if (recipe === 'pepperoni') {
        ctx.fillStyle = '#9f2f27';
        [[-4,-3],[4,2],[-1,5]].forEach(([dx,dy]) => { ctx.beginPath(); ctx.arc(cx + dx * scale, cy + dy * scale, 2.4 * scale, 0, 7); ctx.fill(); });
      } else if (recipe === 'funghi' || recipe === 'mushroom') {
        ctx.fillStyle = '#d8c5aa';
        [[-4,-3],[4,2],[-1,5]].forEach(([dx,dy]) => { ctx.beginPath(); ctx.arc(cx + dx * scale, cy + dy * scale, 2.2 * scale, Math.PI, 0); ctx.fill(); });
      } else if (recipe === 'zucchini') {
        ctx.fillStyle = '#79a942';
        [[-4,-3],[4,2],[-1,5]].forEach(([dx,dy]) => { ctx.beginPath(); ctx.arc(cx + dx * scale, cy + dy * scale, 2.2 * scale, 0, 7); ctx.fill(); });
      } else {
        ctx.fillStyle = '#f0d84a'; ctx.beginPath(); ctx.arc(cx - 3, cy - 1, 2.4, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 3, cy + 2, 2.4, 0, 7); ctx.fill();
      }
    }
  }
  function drawTrashIcon(cx, cy) {
    ctx.fillStyle = C.trash; roundRect(cx - 6, cy - 4, 9, 7, 2); ctx.fill();
    ctx.fillStyle = C.trashPaper; roundRect(cx + 1, cy - 6, 6, 5, 2); ctx.fill();
  }
  function drawBinBagIcon(cx, cy) {
    ctx.fillStyle = '#302b28';
    ctx.beginPath(); ctx.moveTo(cx - 8, cy + 7); ctx.lineTo(cx - 6, cy - 5); ctx.lineTo(cx - 2, cy - 9); ctx.lineTo(cx + 2, cy - 9); ctx.lineTo(cx + 6, cy - 5); ctx.lineTo(cx + 8, cy + 7); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#8f8176'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - 3, cy - 8); ctx.lineTo(cx + 3, cy - 8); ctx.stroke();
  }
  function drawPerson(x, y, color, opts = {}) {
    const bob = opts.bob ? Math.sin(opts.bob) * 1.4 : 0, bodyY = y + bob;
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x, y + 16, 12, 4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = color; roundRect(x - 10, bodyY - 2, 20, 18, 7); ctx.fill();
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(x, bodyY - 9, 8, 0, 7); ctx.fill();
    if (opts.hat) { ctx.fillStyle = C.hat; ctx.beginPath(); ctx.arc(x, bodyY - 11, 9, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 11, bodyY - 12, 22, 3); }
  }
  function playerSpritePose(p) {
    const frame = p.moving ? Math.floor(p.walk * 0.8) % 4 : Math.floor(state.time * 1.6) % 4;
    return { row: p.moving ? 1 : 0, frame };
  }
  function drawPlayerSprite(p, carried) {
    const pose = playerSpritePose(p);
    const size = 78;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 16, 13, 4, 0, 0, 7); ctx.fill();
    ctx.save();
    ctx.translate(p.x, 0);
    ctx.scale(p.dir, 1);
    ctx.drawImage(
      playerSprite,
      pose.frame * PLAYER_SPRITE_CELL,
      pose.row * PLAYER_SPRITE_CELL,
      PLAYER_SPRITE_CELL,
      PLAYER_SPRITE_CELL,
      -size / 2,
      p.y - 58,
      size,
      size
    );
    ctx.restore();

    if (carried.length && !p.action) {
      const trayX = p.x + p.dir * 13;
      ctx.fillStyle = C.tray;
      ctx.beginPath(); ctx.ellipse(trayX, p.y - 18, carried.length === 1 ? 14 : 18, 10, 0, 0, 7); ctx.fill();
      carried.forEach((pz, i) => {
        const off = carried.length === 1 ? 0 : i === 0 ? -7 : 7;
        drawPizza(trayX + off, p.y - 20, pizzaStage(pz), carried.length === 1 ? 0.9 : 0.66);
      });
    }
  }
  function drawPlayer() {
    const p = state.player, acting = !!p.action;
    const carried = p.pizzas.filter(Boolean);
    if (playerSpriteReady) drawPlayerSprite(p, carried);
    else {
      drawPerson(p.x, p.y, C.player, { hat: true, bob: !acting ? p.walk : 0 });
      ctx.fillStyle = C.apron; roundRect(p.x - 6, p.y + 1, 12, 11, 3); ctx.fill();
      carried.forEach((pz, i) => { const off = carried.length === 1 ? 0 : i === 0 ? -9 : 9; drawPizza(p.x + p.dir * 4 + off, p.y - 16, pizzaStage(pz), 0.85); });
    }
    const carriedTrash = p.trash.filter(Boolean);
    carriedTrash.forEach((item, i) => {
      const offset = carriedTrash.length === 1 ? -12 : i === 0 ? -14 : 2;
      if (item.t === 'binbag') drawBinBagIcon(p.x + offset, p.y - 16);
      else drawTrashIcon(p.x + offset, p.y - 14);
    });
    if (p.drink) drawDrinkIcon(p.drink.id, p.x + 12, p.y - 16);
    if (p.dessert) drawDessertIcon(p.dessert.id, p.x - 12, p.y - 18);
    if (p.action) {
      const pct = p.action.elapsed / p.action.duration, bw = 52, bx = p.x - bw / 2, by = p.y - (playerSpriteReady ? 70 : 44);
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; roundRect(bx - 2, by - 2, bw + 4, 12, 6); ctx.fill();
      ctx.fillStyle = C.good; roundRect(bx, by, bw * pct, 8, 4); ctx.fill();
      ctx.font = "700 11px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const lw = ctx.measureText(p.action.label).width + 14, ly = by - 11;
      ctx.fillStyle = 'rgba(36,26,18,0.92)'; roundRect(p.x - lw / 2, ly - 8, lw, 16, 8); ctx.fill();
      ctx.fillStyle = C.textInv; ctx.fillText(p.action.label, p.x, ly);
    }
  }
  function drawHost() {
    if (!hostActive) return;
    drawPerson(480, 578, '#d87845', { bob: state.time * 2 });
    ctx.fillStyle = '#fff7ec'; ctx.font = "800 9px 'Inter', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('HOST', 480, 600);
  }
  function drawMaintenanceTech() {
    const tech = maintenanceTech;
    if (!tech) return;
    drawPerson(tech.x, tech.y, '#3b8f84', { bob: tech.state === 'maintaining' ? 0 : tech.walk });
    ctx.fillStyle = '#f2c94c'; roundRect(tech.x - 7, tech.y + 1, 14, 5, 2); ctx.fill();
    ctx.fillStyle = '#263238'; ctx.font = "900 8px 'Inter', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('TECH', tech.x, tech.y + 5);
    if (tech.target && (tech.state === 'to-device' || tech.state === 'maintaining')) {
      const task = 'Maintain ' + tech.target.label;
      ctx.font = "italic 600 9px 'Inter', sans-serif";
      const width = ctx.measureText(task).width + 14, y = tech.y - 38;
      ctx.fillStyle = 'rgba(220,250,244,0.72)'; roundRect(tech.x - width / 2, y - 9, width, 18, 7); ctx.fill();
      ctx.fillStyle = 'rgba(26,71,65,0.8)'; ctx.fillText(task, tech.x, y);
    }
    if (tech.state === 'maintaining') {
      const pct = tech.actionElapsed / MAINTENANCE_TASK_DURATION;
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; roundRect(tech.x - 27, tech.y - 28, 54, 6, 3); ctx.fill();
      ctx.fillStyle = '#68e3bd'; roundRect(tech.x - 27, tech.y - 28, 54 * pct, 6, 3); ctx.fill();
    }
    const pct = clamp(tech.timer / MAINTENANCE_DURATION, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; roundRect(tech.x - 12, tech.y + 18, 24, 3, 2); ctx.fill();
    ctx.fillStyle = pct > 0.33 ? C.good : pct > 0.15 ? '#e0a93a' : C.bad; roundRect(tech.x - 12, tech.y + 18, 24 * pct, 3, 2); ctx.fill();
  }
  function drawChef(chef) {
    drawPerson(chef.x, chef.y, '#f2f2f2', { bob: chef.walk });
    ctx.fillStyle = '#c0392b'; roundRect(chef.x - 6, chef.y - 2, 12, 4, 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(chef.x - 7, chef.y - 15, 14, 3);
    ctx.beginPath(); ctx.arc(chef.x, chef.y - 19, 7, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(chef.x - 5, chef.y - 18, 4, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(chef.x + 5, chef.y - 18, 4, 0, 7); ctx.fill();
    const carried = chef.hands.filter(Boolean);
    carried.forEach((h, i) => { const off = carried.length === 1 ? 0 : i === 0 ? -9 : 9; const cx = chef.x + off, cy = chef.y - 26; ctx.fillStyle = C.tray; roundRect(cx - 10, cy - 3, 20, 6, 3); ctx.fill(); if (h.t === 'pizza') drawPizza(cx, cy - 6, pizzaStage(h.pz), 0.8); });
    if (chef.action) {
      const pct = chef.action.elapsed / chef.action.duration, bw = 52, bx = chef.x - bw / 2, by = chef.y - 44;
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; roundRect(bx - 2, by - 2, bw + 4, 12, 6); ctx.fill();
      ctx.fillStyle = C.good; roundRect(bx, by, bw * pct, 8, 4); ctx.fill();
      ctx.font = "700 11px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const lw = ctx.measureText(chef.action.label).width + 14, ly = by - 11;
      ctx.fillStyle = 'rgba(36,26,18,0.92)'; roundRect(chef.x - lw / 2, ly - 8, lw, 16, 8); ctx.fill();
      ctx.fillStyle = C.textInv; ctx.fillText(chef.action.label, chef.x, ly);
    }
    const pct = clamp(chef.timer / CHEF_DURATION, 0, 1), bw = 24, bx = chef.x - bw / 2, by = chef.y + 18;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; roundRect(bx, by, bw, 3, 2); ctx.fill();
    ctx.fillStyle = pct > 0.33 ? C.good : pct > 0.15 ? '#e0a93a' : C.bad; roundRect(bx, by, bw * pct, 3, 2); ctx.fill();
  }
  function drawWaiter(w) {
    drawPerson(w.x, w.y, w.fast ? C.waiterFast : C.waiter, { bob: w.walk });
    ctx.fillStyle = C.waiterApron; roundRect(w.x - 6, w.y + 1, 12, 11, 3); ctx.fill();
    ctx.fillStyle = '#2c2342'; roundRect(w.x - 5, w.y - 1, 10, 4, 2); ctx.fill();
    if (w.fast) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(w.x + 7, w.y - 14); ctx.lineTo(w.x + 13, w.y - 6); ctx.lineTo(w.x + 9, w.y - 6); ctx.lineTo(w.x + 12, w.y); ctx.lineTo(w.x + 5, w.y - 9); ctx.lineTo(w.x + 9, w.y - 9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 0.8; ctx.stroke(); }
    const carried = w.hands.filter(Boolean);
    carried.forEach((h, i) => {
      const off = carried.length === 1 ? 0 : i === 0 ? -9 : 9;
      const cx = w.x + off, cy = w.y - 26;
      ctx.fillStyle = C.tray; roundRect(cx - 10, cy - 3, 20, 6, 3); ctx.fill();
      if (h.t === 'pizza') drawPizza(cx, cy - 6, pizzaStage(h.pz), 0.8);
      else if (h.t === 'drink') drawDrinkIcon(h.id, cx, cy - 8);
      else if (h.t === 'dessert') drawDessertIcon(h.id, cx, cy - 8);
      else if (h.t === 'binbag') drawBinBagIcon(cx, cy - 8);
      else drawTrashIcon(cx, cy - 8);
    });
    const pct = clamp(w.timer / WAITER_DURATION, 0, 1), bw = 24, bx = w.x - bw / 2, by = w.y + 18;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; roundRect(bx, by, bw, 3, 2); ctx.fill();
    ctx.fillStyle = pct > 0.33 ? C.good : pct > 0.15 ? '#e0a93a' : C.bad; roundRect(bx, by, bw * pct, 3, 2); ctx.fill();

    const taskLabels = {
      tocust: 'Serve pizza',
      tobin: 'Take trash out',
      totrash: 'Clear table',
      tofullbin: 'Collect full bag',
      tobagdoor: 'Bag to door',
      todrinkcust: 'Serve drink',
      todrinkcabinet: 'Get drink',
      toicecreamcabinet: 'Make dessert',
      makingdessert: 'Making dessert',
      todessertcust: 'Serve dessert',
      discard: 'Discard item',
      leave: 'Clocking out'
    };
    const task = taskLabels[w.state];
    if (task) {
      ctx.font = "italic 600 9px 'Inter', sans-serif";
      const bubbleW = ctx.measureText(task).width + 14;
      const bubbleY = w.y - (carried.length ? 48 : 36);
      ctx.fillStyle = 'rgba(255,250,239,0.68)';
      roundRect(w.x - bubbleW / 2, bubbleY - 9, bubbleW, 18, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w.x - 3, bubbleY + 8);
      ctx.lineTo(w.x + 3, bubbleY + 8);
      ctx.lineTo(w.x, bubbleY + 13);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(58,42,26,0.72)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(task, w.x, bubbleY);
    }
  }
  function drawCustomer(c) {
    drawPerson(c.x, c.y, c.color, { bob: c.state === 'waiting' || c.state === 'queued' ? c.bob : (c.state === 'entering' || c.state === 'leaving' ? c.bob * 2 : 0) });
    if (c.state === 'queued') {
      const remaining = Math.max(0, Math.ceil(c.queuePatience - c.queueElapsed));
      ctx.font = "700 9px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,248,236,0.82)'; roundRect(c.x - 22, c.y - 36, 44, 17, 6); ctx.fill();
      ctx.fillStyle = C.text; ctx.fillText('Queue ' + remaining + 's', c.x, c.y - 28);
    } else if (c.state === 'waiting') {
      const off = { n: { x: 0, y: -34 }, s: { x: 0, y: 34 }, e: { x: 42, y: 0 }, w: { x: -42, y: 0 } }[c.side] || { x: 0, y: -34 };
      const bx = c.x + off.x, by = c.y + off.y;
      const pendingItems = [];
      if (!c.pizzaDelivered) pendingItems.push(RECIPES[c.recipeId].name);
      if (c.drinkId && !c.drinkDelivered) pendingItems.push(DRINKS[c.drinkId].name);
      if (c.dessertId && !c.dessertDelivered) pendingItems.push(DESSERTS[c.dessertId].name);
      const txt = pendingItems.join(' + ') + (c.takeaway ? ' · to go' : '');
      ctx.font = "800 10px 'Inter', sans-serif"; const tw = ctx.measureText(txt).width + 14;
      ctx.fillStyle = C.bubble; roundRect(bx - tw / 2, by - 11, tw, 20, 7); ctx.fill();
      ctx.beginPath();
      if (c.side === 'n') { ctx.moveTo(bx - 4, by + 8); ctx.lineTo(bx + 4, by + 8); ctx.lineTo(bx, by + 14); }
      else if (c.side === 's') { ctx.moveTo(bx - 4, by - 8); ctx.lineTo(bx + 4, by - 8); ctx.lineTo(bx, by - 14); }
      else if (c.side === 'e') { ctx.moveTo(bx - tw / 2, by - 4); ctx.lineTo(bx - tw / 2, by + 4); ctx.lineTo(bx - tw / 2 - 6, by); }
      else { ctx.moveTo(bx + tw / 2, by - 4); ctx.lineTo(bx + tw / 2, by + 4); ctx.lineTo(bx + tw / 2 + 6, by); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.text; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, bx, by - 1);
      const pct = clamp(c.patience / c.maxPatience, 0, 1);
      const ry = c.y + (c.side === 'n' ? -22 : c.side === 's' ? 22 : 18);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; roundRect(c.x - 14, ry, 28, 4, 2); ctx.fill();
      ctx.fillStyle = pct > 0.4 ? C.good : C.bad; roundRect(c.x - 14, ry, 28 * pct, 4, 2); ctx.fill();
    } else if (c.state === 'eating') {
      ctx.fillStyle = C.good; ctx.font = "800 11px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('•••', c.x, c.y - 26);
    } else if (c.state === 'paying') {
      // floating green $ bill, rises + fades
      const prog = 1 - clamp(c.payTimer / 1.3, 0, 1);
      const fy = c.y - 24 - prog * 16;
      ctx.globalAlpha = 1 - prog * 0.7;
      ctx.fillStyle = C.money; roundRect(c.x - 9, fy - 7, 18, 14, 3); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = "800 11px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const paid = RECIPES[c.recipeId].price + (c.drinkDelivered && c.drinkId ? DRINKS[c.drinkId].price : 0) + (c.dessertDelivered && c.dessertId ? DESSERTS[c.dessertId].price : 0);
      const tip = c.tipEligible ? Math.round(paid * 0.2) : 0;
      ctx.fillText(money(paid + tip), c.x, fy);
      ctx.globalAlpha = 1;
    } else if (c.state === 'leaving' && c.mood) {
      drawMoodFace(c.x, c.y - 31, c.mood);
    }
  }
  function drawMoodFace(x, y, mood) {
    ctx.fillStyle = mood === 'angry' ? '#e53935' : mood === 'happy' ? '#7cb342' : '#f4c542';
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2c241b';
    ctx.beginPath(); ctx.arc(x - 3.5, y - 2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 3.5, y - 2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2c241b'; ctx.lineWidth = 1.5; ctx.beginPath();
    if (mood === 'happy') ctx.arc(x, y + 1, 4.5, 0.15 * Math.PI, 0.85 * Math.PI);
    else if (mood === 'angry') ctx.arc(x, y + 7, 4.5, 1.15 * Math.PI, 1.85 * Math.PI);
    else { ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y + 4); }
    ctx.stroke();
  }
  function drawHUD() {
    ctx.fillStyle = 'rgba(26,20,16,0.82)'; roundRect(12, 12, 230, 34, 8); ctx.fill();
    ctx.fillStyle = C.textInv; ctx.font = "700 17px 'Barlow Condensed', sans-serif"; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('you are not pizza', 24, 29);
    ctx.fillStyle = 'rgba(26,20,16,0.82)'; roundRect(W - 138, 12, 126, 34, 8); ctx.fill();
    ctx.fillStyle = '#ffd9a0'; ctx.font = "800 18px 'Inter', sans-serif"; ctx.textAlign = 'right';
    ctx.fillText(money(state.cash), W - 24, 29);
    ctx.fillStyle = 'rgba(26,20,16,0.82)'; roundRect(12, 54, 230, 30, 8); ctx.fill();
    ctx.fillStyle = C.textInv; ctx.font = "700 13px 'Inter', sans-serif"; ctx.textAlign = 'left';
    ctx.fillText('REP ' + shift.reputation, 24, 69);
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; roundRect(78, 64, 82, 10, 5); ctx.fill();
    ctx.fillStyle = shift.reputation > 40 ? C.good : shift.reputation > 20 ? '#e0a93a' : C.bad;
    roundRect(78, 64, 82 * shift.reputation / 100, 10, 5); ctx.fill();
    ctx.fillStyle = C.textInv;
    ctx.textAlign = 'right';
    ctx.fillText(formatRunTime(shift.elapsed), 230, 69);
    if (shift.repFlashTimer > 0) {
      ctx.globalAlpha = Math.min(1, shift.repFlashTimer);
      ctx.fillStyle = shift.repFlash > 0 ? C.good : C.bad;
      ctx.textAlign = 'left';
      ctx.fillText((shift.repFlash > 0 ? '+' : '') + shift.repFlash, 166, 69);
      ctx.globalAlpha = 1;
    }
    const waiting = state.customers.filter((c) => c.state === 'waiting').length;
    const queueLength = queuedCustomers().length;
    if (waiting > 0 || queueLength > 0) {
      const orderText = 'Orders: ' + waiting + (queueLength ? ' · Queue: ' + queueLength : '');
      const hudWidth = queueLength ? 154 : 112;
      ctx.fillStyle = 'rgba(26,20,16,0.82)'; roundRect(W / 2 - hudWidth / 2, 54, hudWidth, 30, 8); ctx.fill();
      ctx.fillStyle = C.textInv; ctx.font = "700 13px 'Inter', sans-serif"; ctx.textAlign = 'center';
      ctx.fillText(orderText, W / 2, 69);
    }
    if (binIsFull()) {
      ctx.fillStyle = 'rgba(173,45,39,0.94)'; roundRect(W / 2 - 118, 91, 236, 28, 8); ctx.fill();
      ctx.fillStyle = C.textInv; ctx.font = "800 12px 'Inter', sans-serif"; ctx.textAlign = 'center';
      ctx.fillText('TRASH FULL · TAKE BAG TO DOOR', W / 2, 105);
    }
    if (state.cheatFlashTimer > 0) {
      ctx.globalAlpha = Math.min(1, state.cheatFlashTimer);
      ctx.fillStyle = 'rgba(76,175,80,0.96)'; roundRect(W - 250, 54, 238, 30, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = "800 12px 'Inter', sans-serif"; ctx.textAlign = 'center';
      ctx.fillText('TEST CASH +$1000', W - 131, 69); ctx.globalAlpha = 1;
    }
  }
  function drawContext() {
    const c = getContext(); if (!c) return;
    const p = state.player, y = p.y - (playerSpriteReady ? 78 : 50);
    ctx.font = "800 13px 'Inter', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(c.text).width + 22;
    ctx.fillStyle = c.ok === false ? 'rgba(60,40,24,0.6)' : 'rgba(124,179,66,0.92)'; roundRect(p.x - w / 2, y - 11, w, 22, 7); ctx.fill();
    ctx.fillStyle = c.ok === false ? C.dim : C.textInv; ctx.fillText(c.text, p.x, y);
  }

  /* ---------- hire menu UI ---------- */
  let hireToastTimer = null;
  function activeStaffFor(type) {
    if (type === 'chef') return state.chefs.filter((chef) => !chef.remove && chef.state !== 'leave').map((chef) => chef.timer);
    if (type === 'host') return hostActive ? [hostTimer] : [];
    if (type === 'maintenance') return maintenanceTech && maintenanceTech.state !== 'leave' ? [maintenanceTech.timer] : [];
    return state.waiters
      .filter((waiter) => !waiter.remove && waiter.state !== 'leave'
        && (type === 'drinks' ? waiter.drinksOnly : type === 'fast' ? waiter.fast && !waiter.drinksOnly : !waiter.fast && !waiter.drinksOnly))
      .map((waiter) => waiter.timer);
  }
  function showHireConfirmation(type, button) {
    const label = staffLabel(type);
    button.dataset.cooldown = 'true';
    button.classList.add('just-hired');
    button.querySelector('strong').textContent = '\u2713 ' + label.replace(/\b\w/g, (letter) => letter.toUpperCase()) + ' hired';
    hireToast.textContent = label.replace(/\b\w/g, (letter) => letter.toUpperCase()) + ' hired!';
    hireToast.classList.remove('hidden');
    if (hireToastTimer) clearTimeout(hireToastTimer);
    hireToastTimer = setTimeout(() => hireToast.classList.add('hidden'), 2000);
    setTimeout(() => {
      delete button.dataset.cooldown;
      button.classList.remove('just-hired');
      syncHireUI();
    }, 1000);
  }
  function syncHireUI() {
    if (!hireMenu) return;
    let totalActive = 0;
    hireMenu.querySelectorAll('button').forEach((b) => {
      const t = b.dataset.type;
      const baseCost = t === 'chef' ? CHEF_COST : t === 'host' ? HOST_COST : t === 'maintenance' ? MAINTENANCE_COST : t === 'drinks' ? DRINKS_WAITER_COST : t === 'fast' ? FAST_WAITER_COST : WAITER_COST;
      const cost = discountedStaffCost(baseCost);
      const activeTimers = activeStaffFor(t);
      totalActive += activeTimers.length;
      if (!b.dataset.cooldown) b.querySelector('strong').textContent = (activeTimers.length && t !== 'maintenance' ? 'Hire another ' : '') + (t === 'chef' ? 'Chef' : t === 'host' ? 'Host' : t === 'maintenance' ? 'Maintenance tech' : t === 'drinks' ? 'Drinks runner' : t === 'fast' ? 'Fast waiter' : 'Waiter');
      b.querySelector('span').textContent = money(cost) + ' · 7 minute shift';
      b.querySelector('.hire-active').textContent = activeTimers.length
        ? 'Active: ' + activeTimers.length + ' · ' + activeTimers.map(staffTime).join(' · ') + ' remaining'
        : 'None active';
      const unavailable = b.dataset.cooldown === 'true' || state.cash < cost || (t === 'drinks' && !progress.sodaCabinet && !progress.iceCreamCabinet) || (t === 'host' && hostActive) || (t === 'maintenance' && maintenanceTech && maintenanceTech.state !== 'leave');
      b.disabled = unavailable;
      b.classList.toggle('off', unavailable);
    });
    hireSummary.innerHTML = '<strong>' + totalActive + ' staff active</strong><span>Total wages paid: ' + money(shift.stats.staffCosts) + '</span>';
  }
  if (hireMenu) hireMenu.querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const cashBefore = state.cash;
      if (b.dataset.type === 'chef') hireChef();
      else if (b.dataset.type === 'host') hireHost();
      else if (b.dataset.type === 'maintenance') hireMaintenance();
      else hireWaiter(b.dataset.type);
      refreshReportOptions();
      if (state.cash < cashBefore) showHireConfirmation(b.dataset.type, b);
    });
  });

  officeTabs.forEach((tab) => tab.addEventListener('click', () => {
    const target = tab.dataset.officeTab;
    officeTabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    officePanes.forEach((pane) => pane.classList.toggle('active', pane.dataset.officePane === target));
  }));


  /* ---------- endless chaos, reputation and upgrades ---------- */
  function reputationSpawnRange() {
    const rep = shift.reputation;
    let range;
    if (rep <= 20) range = [14, 18];
    else if (rep <= 40) range = [10, 14];
    else if (rep <= 60) range = [7, 11];
    else if (rep <= 80) range = [5, 8];
    else range = [3.5, 6];
    const menuFactor = Math.max(0.8, 1 - (unlockedRecipeIds().length - 1) * 0.05);
    const onboardingFactor = shift.elapsed < 75 ? 1 + 0.2 * (1 - shift.elapsed / 75) : 1;
    const factor = menuFactor * state.trafficMultiplier * onboardingFactor;
    return [range[0] * factor, range[1] * factor];
  }
  function activeCustomerCount() { return insideCustomerCount(); }
  function updateChaos(dt) {
    shift.elapsed += dt;
    shift.repFlashTimer = Math.max(0, shift.repFlashTimer - dt);
    state.cheatFlashTimer = Math.max(0, state.cheatFlashTimer - dt);
    if (state.trafficRampRemaining > 0) {
      const step = Math.min(dt, state.trafficRampRemaining);
      state.trafficMultiplier += (state.trafficTarget - state.trafficMultiplier) * (step / state.trafficRampRemaining);
      state.trafficRampRemaining -= step;
      if (state.trafficRampRemaining <= 0) state.trafficMultiplier = state.trafficTarget;
    }
    if (hostActive) {
      hostTimer -= dt;
      if (hostTimer <= 0) {
        hostTimer = 0;
        hostActive = false;
        showStaffShiftNotice('host');
      }
    }
    if (shift.reputation < 20) {
      shift.lowRepTimer += dt;
      if (shift.lowRepTimer >= 20) {
        shift.lowRepTimer -= 20;
        changeReputation(-1);
      }
    } else {
      shift.lowRepTimer = 0;
    }
  }
  function showGameOver() {
    if (shift.showingReport) return;
    shift.showingReport = true; Input.keys = {}; Input.pressed = {};
    pauseOverlay.classList.add('hidden');
    updateOfficeButton(false, 0);
    paused = false;
    reportTitle.textContent = 'Chaos run report';
    const avgWait = shift.stats.served ? Math.round(shift.stats.totalWait / shift.stats.served) : 0;
    const net = Math.round(shift.stats.revenue + shift.stats.tips - shift.stats.staffCosts - shift.stats.wasteCosts);
    reportStats.innerHTML =
      '<div><span>Time survived</span><strong>' + formatRunTime(shift.elapsed) + '</strong></div>' +
      '<div><span>Customers served</span><strong>' + shift.stats.served + '</strong></div>' +
      '<div><span>Customers lost</span><strong>' + shift.stats.lost + '</strong></div>' +
      '<div><span>Peak reputation</span><strong>' + shift.peakReputation + '</strong></div>' +
      '<div><span>Best service streak</span><strong>' + shift.bestServiceStreak + '</strong></div>' +
      '<div><span>Recipes unlocked</span><strong>' + unlockedRecipeIds().length + '</strong></div>' +
      '<div><span>Revenue</span><strong>' + money(shift.stats.revenue) + '</strong></div>' +
      '<div><span>Staff costs</span><strong>-' + money(shift.stats.staffCosts) + '</strong></div>' +
      '<div><span>Waste</span><strong>-' + money(shift.stats.wasteCosts) + '</strong></div>' +
      '<div><span>Tips</span><strong>' + money(shift.stats.tips) + '</strong></div>' +
      '<div><span>Net run result</span><strong>' + (net < 0 ? '-' + money(Math.abs(net)) : money(net)) + '</strong></div>' +
      '<div><span>Average wait</span><strong>' + avgWait + 's</strong></div>';
    nextShiftBtn.textContent = 'Try again';
    shiftReport.classList.remove('hidden');
  }
  function refreshReportOptions() {
    const doughNext = progress.doughLevel + 1;
    const ovenNext = progress.ovenLevel + 1;
    const doughCost = DOUGH_UPGRADE_COSTS[doughNext] || 0;
    const ovenCost = OVEN_UPGRADE_COSTS[ovenNext] || 0;
    const doughMaxed = progress.doughLevel >= MAX_UPGRADE_LEVEL;
    const ovenMaxed = progress.ovenLevel >= MAX_UPGRADE_LEVEL;
    doughUpgradeBtn.disabled = doughMaxed || state.cash < doughCost;
    ovenUpgradeBtn.disabled = ovenMaxed || state.cash < ovenCost;
    const ovenSlotNext = progress.ovenSlots + 1;
    const ovenSlotCost = OVEN_SLOT_COSTS[ovenSlotNext] || 0;
    const ovenCapacityMaxed = progress.ovenSlots >= 3;
    ovenCapacityUpgradeBtn.disabled = ovenCapacityMaxed || state.cash < ovenSlotCost;
    tableUpgradeBtn.disabled = progress.tableCount >= 3 || progress.ovenSlots < 3 || state.cash < 300;
    sodaUpgradeBtn.disabled = progress.sodaCabinet || state.cash < 150;
    const staffNext = progress.staffDiscountLevel + 1;
    const staffCost = STAFF_DISCOUNT_COSTS[staffNext] || 0;
    const staffMaxed = progress.staffDiscountLevel >= MAX_UPGRADE_LEVEL;
    staffDiscountUpgradeBtn.disabled = staffMaxed || state.cash < staffCost;
    jukeboxUpgradeBtn.disabled = progress.jukebox || state.cash < 100;
    iceCreamUpgradeBtn.disabled = progress.iceCreamCabinet || state.cash < 300;
    sundaeSpeedUpgradeBtn.disabled = !progress.iceCreamCabinet || progress.sundaeFast || state.cash < 100;
    milkshakeUnlockBtn.disabled = !progress.iceCreamCabinet || progress.milkshakeUnlocked || state.cash < 100;
    milkshakeSpeedUpgradeBtn.disabled = !progress.milkshakeUnlocked || progress.milkshakeFast || state.cash < 120;
    doughUpgradeBtn.classList.toggle('purchased', doughMaxed);
    ovenUpgradeBtn.classList.toggle('purchased', ovenMaxed);
    ovenCapacityUpgradeBtn.classList.toggle('purchased', ovenCapacityMaxed);
    tableUpgradeBtn.classList.toggle('purchased', progress.tableCount >= 3);
    sodaUpgradeBtn.classList.toggle('purchased', progress.sodaCabinet);
    staffDiscountUpgradeBtn.classList.toggle('purchased', staffMaxed);
    jukeboxUpgradeBtn.classList.toggle('purchased', progress.jukebox);
    iceCreamUpgradeBtn.classList.toggle('purchased', progress.iceCreamCabinet);
    sundaeSpeedUpgradeBtn.classList.toggle('purchased', progress.sundaeFast);
    milkshakeUnlockBtn.classList.toggle('purchased', progress.milkshakeUnlocked);
    milkshakeSpeedUpgradeBtn.classList.toggle('purchased', progress.milkshakeFast);
    doughUpgradeBtn.querySelector('strong').textContent = 'Faster dough · Level ' + progress.doughLevel;
    ovenUpgradeBtn.querySelector('strong').textContent = 'Faster oven · Level ' + progress.ovenLevel;
    doughUpgradeBtn.querySelector('span').textContent = doughMaxed ? 'Maximum level · +80% speed' : 'Upgrade to Level ' + doughNext + ' · +20% speed · ' + money(doughCost);
    ovenUpgradeBtn.querySelector('span').textContent = ovenMaxed ? 'Maximum level · +80% speed' : 'Upgrade to Level ' + ovenNext + ' · +20% speed · ' + money(ovenCost);
    ovenCapacityUpgradeBtn.querySelector('strong').textContent = 'Oven capacity · ' + progress.ovenSlots + (progress.ovenSlots === 1 ? ' slot' : ' slots');
    ovenCapacityUpgradeBtn.querySelector('span').textContent = ovenCapacityMaxed ? 'Maximum oven capacity · bake 3 pizzas at once' : 'Unlock slot ' + ovenSlotNext + ' · ' + money(ovenSlotCost) + ' · bake one more pizza at once';
    tableUpgradeBtn.querySelector('span').textContent = progress.tableCount >= 3 ? 'Purchased · 12 dining seats' : progress.ovenSlots < 3 ? 'Requires 3 oven slots · $300' : 'Add 4 more dining seats · $300';
    sodaUpgradeBtn.querySelector('span').textContent = progress.sodaCabinet ? 'Purchased · Coke, Water, Dew' : 'Permanent drinks service · $150';
    staffDiscountUpgradeBtn.querySelector('strong').textContent = 'Cheaper staff · Level ' + progress.staffDiscountLevel;
    staffDiscountUpgradeBtn.querySelector('span').textContent = staffMaxed ? 'Maximum level · 50% total discount' : 'Upgrade to Level ' + staffNext + ' · +10% total discount · ' + money(staffCost);
    jukeboxUpgradeBtn.querySelector('span').textContent = progress.jukebox ? 'Purchased · Patience drains 25% slower' : 'Customers lose patience 25% slower · $100';
    iceCreamUpgradeBtn.querySelector('span').textContent = progress.iceCreamCabinet ? 'Purchased · Sundae service active' : 'Unlock Sundae service · $300';
    sundaeSpeedUpgradeBtn.querySelector('span').textContent = progress.sundaeFast ? 'Purchased · Prep time 2s' : progress.iceCreamCabinet ? 'Prep time 3s → 2s · $100' : 'Requires ice cream cabinet';
    milkshakeUnlockBtn.querySelector('span').textContent = progress.milkshakeUnlocked ? 'Purchased · Sells for $6' : progress.iceCreamCabinet ? 'Unlock Milkshake · $100' : 'Requires ice cream cabinet';
    milkshakeSpeedUpgradeBtn.querySelector('span').textContent = progress.milkshakeFast ? 'Purchased · Prep time 2s' : progress.milkshakeUnlocked ? 'Prep time 3s → 2s · $120' : 'Requires Milkshake';
    recipeButtons.forEach((button) => {
      const id = button.dataset.recipe, unlocked = progress.unlockedRecipes.has(id);
      const cost = RECIPES[id].unlockCost || 0;
      button.disabled = unlocked || state.cash < cost;
      button.classList.toggle('purchased', unlocked);
      button.textContent = unlocked ? RECIPES[id].name + ' · Unlocked' : 'Unlock ' + RECIPES[id].name + ' · ' + money(cost);
    });
    shopBudget.innerHTML = '<span>Cash</span><strong>' + money(state.cash) + '</strong>';
    syncHireUI();
    syncOfficeCue();
  }

  function affordableOfficePurchases() {
    let count = 0;
    const doughCost = DOUGH_UPGRADE_COSTS[progress.doughLevel + 1];
    const ovenCost = OVEN_UPGRADE_COSTS[progress.ovenLevel + 1];
    if (doughCost && state.cash >= doughCost) count++;
    if (ovenCost && state.cash >= ovenCost) count++;
    const ovenSlotCost = OVEN_SLOT_COSTS[progress.ovenSlots + 1];
    if (ovenSlotCost && state.cash >= ovenSlotCost) count++;
    if (progress.ovenSlots >= 3 && progress.tableCount < 3 && state.cash >= 300) count++;
    if (!progress.sodaCabinet && state.cash >= 150) count++;
    const staffCost = STAFF_DISCOUNT_COSTS[progress.staffDiscountLevel + 1];
    if (staffCost && state.cash >= staffCost) count++;
    if (!progress.jukebox && state.cash >= 100) count++;
    if (!progress.iceCreamCabinet && state.cash >= 300) count++;
    if (progress.iceCreamCabinet && !progress.sundaeFast && state.cash >= 100) count++;
    if (progress.iceCreamCabinet && !progress.milkshakeUnlocked && state.cash >= 100) count++;
    if (progress.milkshakeUnlocked && !progress.milkshakeFast && state.cash >= 120) count++;
    for (const id of Object.keys(RECIPES)) {
      if (!progress.unlockedRecipes.has(id) && state.cash >= (RECIPES[id].unlockCost || 0)) count++;
    }
    return count;
  }

  function updateOfficeButton(isPaused = paused, available = affordableOfficePurchases()) {
    officeButtonTitle.textContent = isPaused ? 'Resume game' : 'Office / Upgrades';
    officeButtonHint.textContent = isPaused ? 'Back to chaos' : 'Pause game';
    const showBadge = !isPaused && available > 0;
    officeBadge.textContent = String(available);
    officeBadge.classList.toggle('hidden', !showBadge);
    pauseBtn.classList.toggle('upgrade-ready', showBadge);
  }

  function syncOfficeCue() {
    const available = affordableOfficePurchases();
    updateOfficeButton(paused, available);
    if (!paused && available > 0 && !officeHintShown) {
      officeHintShown = true;
      upgradeNotice.classList.remove('hidden');
      if (officeNoticeTimer) clearTimeout(officeNoticeTimer);
      officeNoticeTimer = setTimeout(() => upgradeNotice.classList.add('hidden'), 5200);
    }
  }
  doughUpgradeBtn.addEventListener('click', () => {
    const level = progress.doughLevel + 1;
    const cost = DOUGH_UPGRADE_COSTS[level];
    if (!cost || state.cash < cost) return;
    state.cash -= cost; progress.doughLevel = level; refreshReportOptions();
  });
  ovenUpgradeBtn.addEventListener('click', () => {
    const level = progress.ovenLevel + 1;
    const cost = OVEN_UPGRADE_COSTS[level];
    if (!cost || state.cash < cost) return;
    state.cash -= cost; progress.ovenLevel = level; refreshReportOptions();
  });
  ovenCapacityUpgradeBtn.addEventListener('click', () => {
    const next = progress.ovenSlots + 1;
    const cost = OVEN_SLOT_COSTS[next];
    if (!cost || state.cash < cost) return;
    state.cash -= cost;
    progress.ovenSlots = next;
    state.trafficTarget = OVEN_TRAFFIC_MULTIPLIERS[next];
    state.trafficRampRemaining = 30;
    refreshReportOptions();
  });
  tableUpgradeBtn.addEventListener('click', () => {
    if (progress.tableCount >= 3 || progress.ovenSlots < 3 || state.cash < 300) return;
    state.cash -= 300;
    progress.tableCount = 3;
    refreshReportOptions();
  });
  sodaUpgradeBtn.addEventListener('click', () => {
    if (progress.sodaCabinet || state.cash < 150) return;
    state.cash -= 150;
    progress.sodaCabinet = true;
    refreshReportOptions();
  });
  staffDiscountUpgradeBtn.addEventListener('click', () => {
    const level = progress.staffDiscountLevel + 1;
    const cost = STAFF_DISCOUNT_COSTS[level];
    if (!cost || state.cash < cost) return;
    state.cash -= cost;
    progress.staffDiscountLevel = level;
    refreshReportOptions(); syncHireUI();
  });
  jukeboxUpgradeBtn.addEventListener('click', () => {
    if (progress.jukebox || state.cash < 100) return;
    state.cash -= 100;
    progress.jukebox = true;
    refreshReportOptions();
  });
  iceCreamUpgradeBtn.addEventListener('click', () => {
    if (progress.iceCreamCabinet || state.cash < 300) return;
    state.cash -= 300; progress.iceCreamCabinet = true; refreshReportOptions(); syncHireUI();
  });
  sundaeSpeedUpgradeBtn.addEventListener('click', () => {
    if (!progress.iceCreamCabinet || progress.sundaeFast || state.cash < 100) return;
    state.cash -= 100; progress.sundaeFast = true; refreshReportOptions();
  });
  milkshakeUnlockBtn.addEventListener('click', () => {
    if (!progress.iceCreamCabinet || progress.milkshakeUnlocked || state.cash < 100) return;
    state.cash -= 100; progress.milkshakeUnlocked = true; refreshReportOptions();
  });
  milkshakeSpeedUpgradeBtn.addEventListener('click', () => {
    if (!progress.milkshakeUnlocked || progress.milkshakeFast || state.cash < 120) return;
    state.cash -= 120; progress.milkshakeFast = true; refreshReportOptions();
  });

  recipeButtons.forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.recipe;
    const cost = RECIPES[id].unlockCost || 0;
    if (progress.unlockedRecipes.has(id) || state.cash < cost) return;
    state.cash -= cost;
    progress.unlockedRecipes.add(id);
    refreshReportOptions();
  }));
  nextShiftBtn.addEventListener('click', () => window.location.reload());

  /* ---------- main loop ---------- */
  let last = 0;
  let started = false;
  let paused = false;

  function waiterRole(waiter) {
    return waiter.drinksOnly ? 'drinks runner' : waiter.fast ? 'fast waiter' : 'waiter';
  }
  function staffTime(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    return Math.floor(safe / 60) + ':' + String(safe % 60).padStart(2, '0');
  }
  function refreshStaffRoster() {
    const rows = [];
    for (const waiter of state.waiters) {
      if (waiter.remove || waiter.state === 'leave') continue;
      rows.push('<div><span>' + waiterRole(waiter) + '</span><strong>' + staffTime(waiter.timer) + '</strong></div>');
    }
    for (const chef of state.chefs) {
      if (chef.remove || chef.state === 'leave') continue;
      rows.push('<div><span>chef</span><strong>' + staffTime(chef.timer) + '</strong></div>');
    }
    if (hostActive) rows.push('<div><span>host</span><strong>' + staffTime(hostTimer) + '</strong></div>');
    if (maintenanceTech && maintenanceTech.state !== 'leave') rows.push('<div><span>maintenance tech</span><strong>' + staffTime(maintenanceTech.timer) + '</strong></div>');
    staffRoster.innerHTML = rows.length ? rows.join('') : '<div class="empty-roster">No other staff on shift</div>';
  }
  let expiredStaffType = null;
  function staffLabel(type) {
    return type === 'chef' ? 'chef' : type === 'host' ? 'host' : type === 'maintenance' ? 'maintenance tech' : type === 'drinks' ? 'drinks runner' : type === 'fast' ? 'fast waiter' : 'waiter';
  }
  function staffCostFor(type) {
    const base = type === 'chef' ? CHEF_COST : type === 'host' ? HOST_COST : type === 'maintenance' ? MAINTENANCE_COST : type === 'drinks' ? DRINKS_WAITER_COST : type === 'fast' ? FAST_WAITER_COST : WAITER_COST;
    return discountedStaffCost(base);
  }
  function showStaffShiftNotice(type) {
    setPaused(true);
    expiredStaffType = type;
    const role = staffLabel(type);
    const cost = staffCostFor(type);
    staffNoticeText.textContent = 'The ' + role + "'s shift is over.";
    staffRehireBtn.textContent = 'Hire again · ' + money(cost);
    staffRehireBtn.disabled = state.cash < cost || (type === 'host' && hostActive) || (type === 'maintenance' && maintenanceTech && maintenanceTech.state !== 'leave') || (type === 'drinks' && !progress.sodaCabinet && !progress.iceCreamCabinet);
    refreshStaffRoster();
    staffNotice.classList.remove('hidden');
  }

  function closeStaffNotice() {
    staffNotice.classList.add('hidden');
    expiredStaffType = null;
  }
  staffNoticeClose.addEventListener('click', closeStaffNotice);
  staffRehireBtn.addEventListener('click', () => {
    if (!expiredStaffType || staffRehireBtn.disabled) return;
    const type = expiredStaffType;
    const cashBefore = state.cash;
    if (type === 'chef') hireChef();
    else if (type === 'host') hireHost();
    else if (type === 'maintenance') hireMaintenance();
    else hireWaiter(type);
    closeStaffNotice();
    refreshReportOptions();
    const button = hireMenu.querySelector('[data-type="' + type + '"]');
    if (button && state.cash < cashBefore) showHireConfirmation(type, button);
  });

  function setPaused(nextPaused) {
    if (!started || shift.showingReport || paused === nextPaused) return;
    paused = nextPaused;
    Input.keys = {};
    Input.pressed = {};
    updateOfficeButton(paused);
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseOverlay.classList.toggle('hidden', !paused);
    upgradeNotice.classList.add('hidden');
    staffNotice.classList.add('hidden');
    if (paused) {
      shift.shoppingStartCash = Math.round(state.cash);
      refreshReportOptions();
    }
    ingredientOptions.classList.add('hidden');
    drinkOptions.classList.add('hidden');
    dessertOptions.classList.add('hidden');
    last = performance.now();
    if (!paused && audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  }

  function togglePause() {
    setPaused(!paused);
  }

  pauseBtn.addEventListener('click', togglePause);
  let restartWasPaused = false;
  function openRestartConfirm() {
    restartWasPaused = paused;
    if (!paused) setPaused(true);
    restartConfirm.classList.remove('hidden');
    restartConfirmBtn.focus();
  }
  function closeRestartConfirm() {
    restartConfirm.classList.add('hidden');
    if (!restartWasPaused) setPaused(false);
  }
  restartBtn.addEventListener('click', openRestartConfirm);
  restartCancelX.addEventListener('click', closeRestartConfirm);
  restartCancelBtn.addEventListener('click', closeRestartConfirm);
  restartConfirmBtn.addEventListener('click', () => window.location.reload());

  function frame(t) {
    if (!started) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (!paused && !shift.showingReport) {
      state.time += dt;
      update(dt);
    }
    render();
    Input.pressed = {};
    requestAnimationFrame(frame);
  }
  function update(dt) {
    updateChaos(dt);
    if (shift.showingReport || paused) return;
    updateEquipment(dt);
    if (paused) return;
    updatePlayer(dt);
    syncIngredientDropdown();
    syncDrinkDropdown();
    syncDessertDropdown();
    syncOfficeCue();
    updateOven(dt);
    assignJobs();
    for (const w of state.waiters) {
      updateWaiter(w, dt);
      if (paused) break;
    }
    if (paused) { syncHireUI(); return; }
    state.waiters = state.waiters.filter((w) => !w.remove);
    for (const ch of state.chefs) {
      updateChef(ch, dt);
      if (paused) break;
    }
    if (paused) { syncHireUI(); return; }
    state.chefs = state.chefs.filter((c) => !c.remove);
    updateMaintenance(dt);
    if (paused) { syncHireUI(); return; }
    admitQueuedCustomers();
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      if (queuedCustomers().length < MAX_CUSTOMER_QUEUE) {
        const spawned = spawnCustomer();
        const range = reputationSpawnRange();
        state.spawnTimer = spawned ? rand(range[0], range[1]) : 0.75;
      } else {
        state.spawnTimer = 0.75;
      }
    }
    for (const c of state.customers) {
      updateCustomer(c, dt);
      if (shift.showingReport) break;
    }
    state.customers = state.customers.filter((c) => !c.remove);
    syncHireUI();
  }
  function render() {
    drawFloor(); drawBin(); drawPickup(); drawSodaCabinet(); drawIceCreamCabinet(); drawJukebox(); drawTables(); drawTrashPiles();
    for (const s of STATIONS) drawStation(s);
    const people = [];
    for (const c of state.customers) people.push({ y: c.y, d: () => drawCustomer(c) });
    for (const w of state.waiters) people.push({ y: w.y, d: () => drawWaiter(w) });
    for (const ch of state.chefs) people.push({ y: ch.y, d: () => drawChef(ch) });
    if (maintenanceTech) people.push({ y: maintenanceTech.y, d: drawMaintenanceTech });
    if (hostActive) people.push({ y: 578, d: drawHost });
    people.push({ y: state.player.y, d: drawPlayer });
    people.sort((a, b) => a.y - b.y).forEach((p) => p.d());
    drawHUD(); drawContext();
  }

  /* ---------- start ---------- */
  function start() {
    if (started) return;
    started = true;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    } catch (e) {
      audioCtx = null;
    }
    startScreen.classList.add('hidden');
    if (gameControls) gameControls.classList.remove('hidden');
    if (ingredientDropdown) ingredientDropdown.classList.remove('hidden');
    if (drinkDropdown) drinkDropdown.classList.remove('hidden');
    if (dessertDropdown) dessertDropdown.classList.remove('hidden');
    last = performance.now();
    requestAnimationFrame(frame);
  }
  startScreen.addEventListener('click', start);
  startScreen.addEventListener('keydown', (e) => { if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); start(); } });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {});
})();
