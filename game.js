const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultyInputs = Array.from(document.querySelectorAll('input[name="difficulty"]'));
const languageInputs = Array.from(document.querySelectorAll('input[name="language"]'));
const themeInputs = Array.from(document.querySelectorAll('input[name="theme"]'));
const scoreEl = document.getElementById('score');
const heartsEl = document.getElementById('hearts');
const wordStreakEl = document.getElementById('word-streak');
const charStreakEl = document.getElementById('char-streak');
const accuracyEl = document.getElementById('accuracy');
const wordPointsEl = document.getElementById('word-points');
const charPointsEl = document.getElementById('char-points');
const typedDisplayEl = document.getElementById('typed-display');
const finalScoreEl = document.getElementById('final-score');
const effectStatusEl = document.getElementById('effect-status');
const commandPromptEl = document.getElementById('command-prompt');
const countTntEl = document.getElementById('count-tnt');
const countSlowEl = document.getElementById('count-slow');
const countPauseEl = document.getElementById('count-pause');
const actionButtons = Array.from(document.querySelectorAll('.action-button'));
const shopOverlay = document.getElementById('shop-overlay');
const shopCloseButton = document.getElementById('shop-close');
const shopBackdrop = document.querySelector('.shop-backdrop');
const shopButtons = Array.from(document.querySelectorAll('[data-shop-item]'));
const wordLayer = document.getElementById('word-layer');
const translatableEls = Array.from(document.querySelectorAll('[data-i18n]'));

const START_LIVES = 10;
const BASE_SPAWN_MS = 2100;
const MIN_SPAWN_MS = 850;
const FALL_SPEED = 42;
const SCORE_PER_WORD = 10;
const ABILITY_DURATION_MS = 10000;

const COMMANDS = {
  1: { labelKey: 'ability.tnt', inventoryKey: 'tnt' },
  2: { labelKey: 'ability.slow', inventoryKey: 'slow' },
  3: { labelKey: 'ability.pause', inventoryKey: 'pause' },
  4: { labelKey: 'ability.shop', inventoryKey: null }
};

const SHOP_ITEMS = {
  tnt: { goldCost: 15 },
  slow: { goldCost: 5 },
  pause: { goldCost: 10 },
  heart: { goldCost: 5 }
};

const DIFFICULTIES = {
  adult: { speedMultiplier: 1 },
  kids: { speedMultiplier: 0.5 },
  'small-kids': { speedMultiplier: 0.25 }
};

const TRANSLATIONS = {
  no: {
    'start.eyebrow': 'Norsk skrivelek',
    'start.title': 'Ordregn',
    'start.lead': 'Skriv ordene før de treffer bakken. Bygg opp rekker, tjen valuta og bruk hjelpeevner når skjermen blir full.',
    'start.languageLegend': 'Språk',
    'start.language.no': 'Norsk',
    'start.language.noMeta': 'Standard',
    'start.language.en': 'English',
    'start.language.enMeta': 'Alternativ',
    'start.difficultyLegend': 'Vanskelighetsgrad',
    'difficulty.adult': 'Voksne',
    'difficulty.adultMeta': '100%',
    'difficulty.kids': 'Barn',
    'difficulty.kidsMeta': '50% fart',
    'difficulty.smallKids': 'Små barn',
    'difficulty.smallKidsMeta': '25% fart',
    'start.themeLegend': 'Tema',
    'theme.light': 'Lys',
    'theme.lightMeta': 'Nåværende stil',
    'theme.dark': 'Mørk',
    'theme.darkMeta': 'Moderne nattstil',
    'start.button': 'Start spill',
    'hud.score': 'Poeng',
    'hud.hearts': 'Hjerter',
    'hud.wordStreak': 'Ordrekke',
    'hud.charStreak': 'Tegnrekke',
    'hud.accuracy': 'Nøyaktighet',
    'hud.typed': 'Skriver',
    'ability.tnt': 'TNT',
    'ability.slow': 'Sakte',
    'ability.pause': 'Pause',
    'ability.shop': 'Butikk',
    'ability.open': 'åpne',
    'currency.gold': 'Gull',
    'currency.silver': 'Sølv',
    'shop.paused': 'Pausert',
    'shop.title': 'Butikk',
    'shop.close': 'Lukk',
    'shop.help': 'Kjøp én ladning med Gull. Sølv blir automatisk til Gull ved 100 Sølv.',
    'shop.tntTitle': 'TNT-ladning',
    'shop.tntDesc': 'Fjerner alle aktive ord.',
    'shop.slowTitle': 'Sakte-ladning',
    'shop.slowDesc': 'Halverer farten i 10 sekunder.',
    'shop.pauseTitle': 'Pause-ladning',
    'shop.pauseDesc': 'Stopper nye ord og bevegelse i 10 sekunder.',
    'shop.heartTitle': 'Hjerte',
    'shop.heartDesc': 'Gjenoppretter ett hjerte opp til maks 10.',
    'shop.buy': 'Kjøp',
    'gameOver.eyebrow': 'Runden er over',
    'gameOver.title': 'Spillet er slutt',
    'gameOver.finalScore': 'Sluttpoeng:',
    'gameOver.restart': 'Start på nytt',
    'title.document': 'Ordregn',
    'status.noActive': 'Ingen aktiv effekt',
    'status.shopOpenPaused': 'Butikken er åpen. Spillet er pauset.',
    'status.shopPrompt': 'Butikken er åpen. Bruk knappene eller trykk Escape for å lukke.',
    'status.commandPrompt': 'Trykk 1, 2, 3 eller 4 for TNT, Sakte, Pause eller Butikk.',
    'status.silverConvert': '100 Sølv ble gjort om til 1 Gull.',
    'status.shopOpened': 'Butikken er åpnet.',
    'status.noCharges': 'Ingen {item}-ladninger igjen.',
    'status.tntCleared': 'TNT ryddet brettet.',
    'status.slowActive': 'Sakte er aktiv i 10 sekunder.',
    'status.pauseActive': 'Pause er aktiv i 10 sekunder.',
    'status.notEnoughGold': 'Ikke nok Gull til dette kjøpet.',
    'status.heartsFull': 'Hjerter er allerede fulle.',
    'status.bought': 'Kjøpte {item} med Gull.',
    'status.scoreGain': '+{score} poeng',
    'status.wrongCharacter': 'Feil tegn. Rekken ble nullstilt.',
    'status.wordBottom': 'Et ord traff bakken. Rekken ble nullstilt.',
    'status.backspaceReset': 'Backspace nullstilte rekken.'
  },
  en: {
    'start.eyebrow': 'Typing game',
    'start.title': 'Word Rain',
    'start.lead': 'Type the falling words before they hit the ground. Build streaks, earn currency, and use abilities when the screen gets crowded.',
    'start.languageLegend': 'Language',
    'start.language.no': 'Norwegian',
    'start.language.noMeta': 'Default',
    'start.language.en': 'English',
    'start.language.enMeta': 'Alternative',
    'start.difficultyLegend': 'Difficulty',
    'difficulty.adult': 'Adults',
    'difficulty.adultMeta': '100%',
    'difficulty.kids': 'Kids',
    'difficulty.kidsMeta': '50% speed',
    'difficulty.smallKids': 'Small kids',
    'difficulty.smallKidsMeta': '25% speed',
    'start.themeLegend': 'Theme',
    'theme.light': 'Light',
    'theme.lightMeta': 'Current style',
    'theme.dark': 'Dark',
    'theme.darkMeta': 'Modern night style',
    'start.button': 'Start Game',
    'hud.score': 'Score',
    'hud.hearts': 'Hearts',
    'hud.wordStreak': 'Word Streak',
    'hud.charStreak': 'Char Streak',
    'hud.accuracy': 'Accuracy',
    'hud.typed': 'Typed',
    'ability.tnt': 'TNT',
    'ability.slow': 'Slow',
    'ability.pause': 'Pause',
    'ability.shop': 'Shop',
    'ability.open': 'open',
    'currency.gold': 'Gold',
    'currency.silver': 'Silver',
    'shop.paused': 'Paused',
    'shop.title': 'Shop',
    'shop.close': 'Close',
    'shop.help': 'Buy one charge with Gold. Silver automatically converts into Gold at 100 Silver.',
    'shop.tntTitle': 'TNT Charge',
    'shop.tntDesc': 'Deletes all active words.',
    'shop.slowTitle': 'Slow Charge',
    'shop.slowDesc': 'Cuts speed in half for 10 seconds.',
    'shop.pauseTitle': 'Pause Charge',
    'shop.pauseDesc': 'Stops new words and movement for 10 seconds.',
    'shop.heartTitle': 'Heart',
    'shop.heartDesc': 'Restore one heart up to the max of 10.',
    'shop.buy': 'Buy',
    'gameOver.eyebrow': 'Round complete',
    'gameOver.title': 'Game Over',
    'gameOver.finalScore': 'Final score:',
    'gameOver.restart': 'Restart',
    'title.document': 'Word Rain',
    'status.noActive': 'No active effect',
    'status.shopOpenPaused': 'Shop open. Game paused.',
    'status.shopPrompt': 'Shop is open. Use the buttons or press Escape to close.',
    'status.commandPrompt': 'Press 1, 2, 3, or 4 to trigger TNT, Slow, Pause, or Shop.',
    'status.silverConvert': '100 Silver converted into 1 Gold.',
    'status.shopOpened': 'Shop opened.',
    'status.noCharges': 'No {item} charges left.',
    'status.tntCleared': 'TNT cleared the board.',
    'status.slowActive': 'Slow active for 10 seconds.',
    'status.pauseActive': 'Pause active for 10 seconds.',
    'status.notEnoughGold': 'Not enough Gold for that purchase.',
    'status.heartsFull': 'Hearts are already full.',
    'status.bought': 'Bought {item} with Gold.',
    'status.scoreGain': '+{score} score',
    'status.wrongCharacter': 'Wrong character. Streak reset.',
    'status.wordBottom': 'A word hit the bottom. Streak reset.',
    'status.backspaceReset': 'Backspace reset the streak.'
  }
};

const state = {
  screen: 'start',
  score: 0,
  lives: START_LIVES,
  typedText: '',
  wordStreak: 0,
  charStreak: 0,
  correctChars: 0,
  attemptedChars: 0,
  wordPoints: 0,
  charPoints: 0,
  difficultyKey: 'adult',
  languageKey: 'no',
  themeKey: 'light',
  statusMessage: '',
  statusKind: '',
  statusUntil: 0,
  slowTimer: 0,
  pauseTimer: 0,
  shopOpen: false,
  words: [],
  nextWordId: 1,
  lastFrameTime: 0,
  spawnTimer: 0,
  spawnInterval: BASE_SPAWN_MS,
  difficultyTimer: 0,
  loopId: null,
  usedWords: [],
  inventory: {
    tnt: 1,
    slow: 1,
    pause: 1
  }
};

function setScreen(name) {
  state.screen = name;
  startScreen.classList.toggle('active', name === 'start');
  gameScreen.classList.toggle('active', name === 'playing');
  gameOverScreen.classList.toggle('active', name === 'game-over');
}

function t(key, replacements = {}) {
  const table = TRANSLATIONS[state.languageKey] || TRANSLATIONS.no;
  let value = table[key] || TRANSLATIONS.en[key] || key;

  Object.entries(replacements).forEach(([token, replacement]) => {
    value = value.replace(`{${token}}`, String(replacement));
  });

  return value;
}

function getSelectedDifficultyKey() {
  const selected = difficultyInputs.find((input) => input.checked);
  return selected ? selected.value : 'adult';
}

function getSelectedLanguageKey() {
  const selected = languageInputs.find((input) => input.checked);
  return selected ? selected.value : 'no';
}

function getSelectedThemeKey() {
  const selected = themeInputs.find((input) => input.checked);
  return selected ? selected.value : 'light';
}

function getDifficulty() {
  return DIFFICULTIES[state.difficultyKey] || DIFFICULTIES.adult;
}

function getWordList() {
  return state.languageKey === 'en' ? window.ENGLISH_WORDS : window.NORWEGIAN_WORDS;
}

function getItemLabel(itemKey) {
  if (itemKey === 'heart') {
    return t('shop.heartTitle');
  }

  return t(`ability.${itemKey}`);
}

function applyLanguage() {
  document.documentElement.lang = state.languageKey === 'en' ? 'en' : 'no';
  document.title = t('title.document');
  translatableEls.forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  renderHud();
}

function applyTheme() {
  document.body.dataset.theme = state.themeKey;
}

function formatSeconds(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function showStatus(message, kind = '', duration = 1800) {
  state.statusMessage = message;
  state.statusKind = kind;
  state.statusUntil = performance.now() + duration;
  renderStatus();
}

function clearStatusIfExpired(now = performance.now()) {
  if (state.statusMessage && now >= state.statusUntil) {
    state.statusMessage = '';
    state.statusKind = '';
  }
}

function renderHearts() {
  heartsEl.innerHTML = '';

  for (let i = 0; i < START_LIVES; i += 1) {
    const heart = document.createElement('span');
    heart.className = `heart${i < state.lives ? '' : ' empty'}`;
    heart.textContent = '\u2665';
    heartsEl.appendChild(heart);
  }
}

function renderStatus() {
  clearStatusIfExpired();

  let text = t('status.noActive');
  let kind = '';

  if (state.statusMessage) {
    text = state.statusMessage;
    kind = state.statusKind;
  } else if (state.shopOpen) {
    text = t('status.shopOpenPaused');
    kind = 'warn';
  } else {
    const parts = [];
    if (state.pauseTimer > 0) {
      parts.push(`${t('ability.pause')} ${formatSeconds(state.pauseTimer)}`);
    }
    if (state.slowTimer > 0) {
      parts.push(`${t('ability.slow')} ${formatSeconds(state.slowTimer)}`);
    }
    if (parts.length > 0) {
      text = parts.join(' | ');
      kind = 'warn';
    }
  }

  effectStatusEl.textContent = text;
  effectStatusEl.className = `status-chip${kind ? ` ${kind}` : ''}`;
}

function renderCommandPrompt() {
  if (state.shopOpen) {
    commandPromptEl.textContent = t('status.shopPrompt');
    return;
  }

  commandPromptEl.textContent = t('status.commandPrompt');
}

function renderActionButtons() {
  countTntEl.textContent = `x${state.inventory.tnt}`;
  countSlowEl.textContent = `x${state.inventory.slow}`;
  countPauseEl.textContent = `x${state.inventory.pause}`;
}

function renderShop() {
  shopOverlay.classList.toggle('active', state.shopOpen);
  shopOverlay.setAttribute('aria-hidden', String(!state.shopOpen));
}

function getAccuracyPercent() {
  if (state.attemptedChars === 0) {
    return 100;
  }

  return Math.round((state.correctChars / state.attemptedChars) * 100);
}

function renderHud() {
  scoreEl.textContent = String(state.score);
  wordStreakEl.textContent = String(state.wordStreak);
  charStreakEl.textContent = String(state.charStreak);
  accuracyEl.textContent = `${getAccuracyPercent()}%`;
  wordPointsEl.textContent = String(state.wordPoints);
  charPointsEl.textContent = String(state.charPoints);
  typedDisplayEl.textContent = state.typedText || '-';
  renderHearts();
  renderStatus();
  renderCommandPrompt();
  renderActionButtons();
  renderShop();
}

function resetGame() {
  state.score = 0;
  state.lives = START_LIVES;
  state.typedText = '';
  state.wordStreak = 0;
  state.charStreak = 0;
  state.correctChars = 0;
  state.attemptedChars = 0;
  state.wordPoints = 0;
  state.charPoints = 0;
  state.statusMessage = '';
  state.statusKind = '';
  state.statusUntil = 0;
  state.slowTimer = 0;
  state.pauseTimer = 0;
  state.shopOpen = false;
  state.words = [];
  state.nextWordId = 1;
  state.lastFrameTime = 0;
  state.spawnTimer = 0;
  state.spawnInterval = BASE_SPAWN_MS;
  state.difficultyTimer = 0;
  state.usedWords = [];
  state.inventory = { tnt: 1, slow: 1, pause: 1 };
  wordLayer.innerHTML = '';
  renderHud();
}

function startGame() {
  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  if (state.screen === 'start') {
    state.difficultyKey = getSelectedDifficultyKey();
    state.languageKey = getSelectedLanguageKey();
    state.themeKey = getSelectedThemeKey();
    applyLanguage();
    applyTheme();
  }

  resetGame();
  setScreen('playing');
  spawnWord();
  spawnWord();
  state.loopId = window.requestAnimationFrame(gameLoop);
}

function endGame() {
  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  state.shopOpen = false;
  finalScoreEl.textContent = String(state.score);
  renderHud();
  setScreen('game-over');
}

function createWordElement(text) {
  const element = document.createElement('div');
  element.className = 'word';
  element.textContent = text;
  return element;
}

function pickWord() {
  const wordList = getWordList();
  if (!Array.isArray(wordList) || wordList.length === 0) {
    return 'word';
  }

  if (state.usedWords.length >= wordList.length) {
    state.usedWords = [];
  }

  const availableWords = wordList.filter((word) => !state.usedWords.includes(word));
  const source = availableWords.length > 0 ? availableWords : wordList;
  const choice = source[Math.floor(Math.random() * source.length)];
  state.usedWords.push(choice);
  return choice;
}

function spawnWord() {
  const text = pickWord();
  const element = createWordElement(text);
  const arenaWidth = wordLayer.clientWidth;
  const leftPadding = 60;
  const maxX = Math.max(leftPadding, arenaWidth - leftPadding);
  const x = leftPadding + Math.random() * (maxX - leftPadding);
  const word = {
    id: state.nextWordId++,
    text,
    normalizedText: text.toLocaleLowerCase(state.languageKey === 'en' ? 'en-US' : 'no-NO'),
    x,
    y: -20,
    speed: FALL_SPEED + Math.random() * 18,
    element
  };

  element.style.left = `${word.x}px`;
  element.style.top = `${word.y}px`;
  wordLayer.appendChild(element);
  state.words.push(word);
  updateWordHighlights();
}

function updateWordPosition(word) {
  word.element.style.top = `${word.y}px`;
  word.element.style.left = `${word.x}px`;
  const dangerThreshold = wordLayer.clientHeight - 120;
  word.element.classList.toggle('warning', word.y >= dangerThreshold);
}

function removeWord(wordId) {
  const index = state.words.findIndex((word) => word.id === wordId);
  if (index === -1) {
    return null;
  }

  const [word] = state.words.splice(index, 1);
  word.element.remove();
  return word;
}

function clearAllWords() {
  state.words.forEach((word) => word.element.remove());
  state.words = [];
  updateWordHighlights();
}

function normalizeInput(text) {
  return text.toLocaleLowerCase(state.languageKey === 'en' ? 'en-US' : 'no-NO');
}

function findPrefixMatches(prefix) {
  if (!prefix) {
    return [];
  }

  return state.words.filter((word) => word.normalizedText.startsWith(prefix));
}

function findExactMatch(text) {
  if (!text) {
    return null;
  }

  return state.words.find((word) => word.normalizedText === text) || null;
}

function updateWordHighlights() {
  const typed = normalizeInput(state.typedText);
  state.words.forEach((word) => {
    const isMatch = typed.length > 0 && word.normalizedText.startsWith(typed);
    word.element.classList.toggle('matching', isMatch);
  });
}

function resetStreaks() {
  state.wordStreak = 0;
  state.charStreak = 0;
}

function convertSilverIfNeeded() {
  if (state.charPoints < 100) {
    return;
  }

  state.charPoints = 0;
  state.wordPoints += 1;
  showStatus(t('status.silverConvert'), 'good', 1400);
}

function openShop() {
  state.shopOpen = true;
  state.typedText = '';
  updateWordHighlights();
  renderHud();
}

function closeShop() {
  state.shopOpen = false;
  renderHud();
}

function applyAbility(slot) {
  const command = COMMANDS[slot];
  if (!command) {
    return;
  }

  if (slot === 4) {
    openShop();
    showStatus(t('status.shopOpened'), 'good', 1400);
    return;
  }

  const key = command.inventoryKey;
  if (state.inventory[key] <= 0) {
    showStatus(t('status.noCharges', { item: getItemLabel(key) }), 'bad');
    return;
  }

  state.inventory[key] -= 1;

  if (slot === 1) {
    state.typedText = '';
    clearAllWords();
    showStatus(t('status.tntCleared'), 'good');
  } else if (slot === 2) {
    state.slowTimer = ABILITY_DURATION_MS;
    showStatus(t('status.slowActive'), 'good');
  } else if (slot === 3) {
    state.pauseTimer = ABILITY_DURATION_MS;
    showStatus(t('status.pauseActive'), 'warn');
  }

  updateWordHighlights();
  renderHud();
}

function buyShopItem(itemKey) {
  const item = SHOP_ITEMS[itemKey];
  if (!item) {
    return;
  }

  if (state.wordPoints < item.goldCost) {
    showStatus(t('status.notEnoughGold'), 'bad');
    renderHud();
    return;
  }

  if (itemKey === 'heart' && state.lives >= START_LIVES) {
    showStatus(t('status.heartsFull'), 'bad');
    renderHud();
    return;
  }

  state.wordPoints -= item.goldCost;

  if (itemKey === 'heart') {
    state.lives += 1;
  } else {
    state.inventory[itemKey] += 1;
  }

  showStatus(t('status.bought', { item: getItemLabel(itemKey) }), 'good');
  renderHud();
}

function trySubmitTypedWord() {
  const typed = normalizeInput(state.typedText);
  const matchedWord = findExactMatch(typed);
  if (!matchedWord) {
    return;
  }

  removeWord(matchedWord.id);
  state.wordStreak += 1;
  state.wordPoints += 1;
  const scoreGain = SCORE_PER_WORD + (state.wordStreak * 3) + Math.floor(state.charStreak / 5);
  state.score += scoreGain;
  state.typedText = '';
  showStatus(t('status.scoreGain', { score: scoreGain }), 'good', 1200);
  renderHud();
  updateWordHighlights();
}

function handleWrongCharacter() {
  state.attemptedChars += 1;
  state.typedText = '';
  resetStreaks();
  showStatus(t('status.wrongCharacter'), 'bad');
  renderHud();
  updateWordHighlights();
}

function damagePlayer() {
  state.lives -= 1;
  state.typedText = '';
  resetStreaks();
  showStatus(t('status.wordBottom'), 'bad');
  renderHud();
  updateWordHighlights();

  if (state.lives <= 0) {
    endGame();
  }
}

function updateFallingWords(deltaSeconds) {
  const bottomLimit = wordLayer.clientHeight - 36;
  const escapedWordIds = [];

  state.words.forEach((word) => {
    word.y += word.speed * deltaSeconds;
    updateWordPosition(word);

    if (word.y >= bottomLimit) {
      escapedWordIds.push(word.id);
    }
  });

  escapedWordIds.forEach((wordId) => {
    removeWord(wordId);
    if (state.screen === 'playing') {
      damagePlayer();
    }
  });
}

function updateDifficulty(deltaMs) {
  state.difficultyTimer += deltaMs;
  if (state.difficultyTimer < 6000) {
    return;
  }

  state.difficultyTimer = 0;
  state.spawnInterval = Math.max(MIN_SPAWN_MS, state.spawnInterval - 120);
}

function gameLoop(timestamp) {
  if (state.screen !== 'playing') {
    return;
  }

  if (!state.lastFrameTime) {
    state.lastFrameTime = timestamp;
  }

  clearStatusIfExpired(timestamp);

  const deltaMs = timestamp - state.lastFrameTime;
  const deltaSeconds = deltaMs / 1000;
  state.lastFrameTime = timestamp;

  if (state.shopOpen) {
    renderHud();
    state.loopId = window.requestAnimationFrame(gameLoop);
    return;
  }

  if (state.pauseTimer > 0) {
    state.pauseTimer = Math.max(0, state.pauseTimer - deltaMs);
    renderHud();
    state.loopId = window.requestAnimationFrame(gameLoop);
    return;
  }

  if (state.slowTimer > 0) {
    state.slowTimer = Math.max(0, state.slowTimer - deltaMs);
  }

  const difficultySpeed = getDifficulty().speedMultiplier;

  state.spawnTimer += deltaMs * difficultySpeed;
  if (state.spawnTimer >= state.spawnInterval) {
    state.spawnTimer = 0;
    spawnWord();
  }

  updateDifficulty(deltaMs * difficultySpeed);
  const speedMultiplier = state.slowTimer > 0 ? 0.5 : 1;
  updateFallingWords(deltaSeconds * speedMultiplier * difficultySpeed);
  updateWordHighlights();
  renderHud();
  state.loopId = window.requestAnimationFrame(gameLoop);
}

function handleNormalTyping(event) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    if (state.typedText.length > 0) {
      state.typedText = state.typedText.slice(0, -1);
      resetStreaks();
      showStatus(t('status.backspaceReset'), 'warn');
      renderHud();
      updateWordHighlights();
    }
    return;
  }

  if (event.key === 'Escape') {
    state.typedText = '';
    renderHud();
    updateWordHighlights();
    return;
  }

  if (event.key.length !== 1) {
    return;
  }

  const allowedPattern = state.languageKey === 'en'
    ? /^[a-zA-Z]$/
    : /^[a-zA-Z\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]$/;

  if (!allowedPattern.test(event.key)) {
    return;
  }

  const nextTyped = normalizeInput(`${state.typedText}${event.key}`);
  const matches = findPrefixMatches(nextTyped);

  if (matches.length === 0) {
    handleWrongCharacter();
    return;
  }

  state.attemptedChars += 1;
  state.correctChars += 1;
  state.typedText = nextTyped;
  state.charStreak += 1;
  state.charPoints += 1;
  convertSilverIfNeeded();
  renderHud();
  trySubmitTypedWord();
  updateWordHighlights();
}

function handleKeydown(event) {
  if (state.screen !== 'playing') {
    return;
  }

  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (state.shopOpen) {
    if (event.key === 'Escape') {
      closeShop();
    }
    return;
  }

  if (/^[1-4]$/.test(event.key)) {
    applyAbility(Number(event.key));
    return;
  }

  handleNormalTyping(event);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
shopCloseButton.addEventListener('click', closeShop);
shopBackdrop.addEventListener('click', closeShop);
actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (state.screen === 'playing' && !state.shopOpen) {
      applyAbility(Number(button.dataset.slot));
    }
  });
});
shopButtons.forEach((button) => {
  button.addEventListener('click', () => {
    buyShopItem(button.dataset.shopItem);
  });
});
languageInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.languageKey = getSelectedLanguageKey();
      applyLanguage();
    }
  });
});
themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.themeKey = getSelectedThemeKey();
      applyTheme();
    }
  });
});
window.addEventListener('keydown', handleKeydown);
window.addEventListener('resize', () => {
  state.words.forEach((word) => updateWordPosition(word));
});

setScreen('start');
applyLanguage();
applyTheme();
