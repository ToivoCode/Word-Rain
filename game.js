const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
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

const START_LIVES = 10;
const BASE_SPAWN_MS = 2100;
const MIN_SPAWN_MS = 850;
const FALL_SPEED = 42;
const SCORE_PER_WORD = 10;
const ABILITY_DURATION_MS = 10000;

const COMMANDS = {
  1: { keyword: 'tnt', label: 'TNT', inventoryKey: 'tnt' },
  2: { keyword: 'slow', label: 'Slow', inventoryKey: 'slow' },
  3: { keyword: 'pause', label: 'Pause', inventoryKey: 'pause' },
  4: { keyword: 'shop', label: 'Shop', inventoryKey: null }
};

const SHOP_ITEMS = {
  tnt: { wordCost: 4, charCost: 18 },
  slow: { wordCost: 3, charCost: 14 },
  pause: { wordCost: 5, charCost: 22 },
  heart: { wordCost: 2, charCost: 10 }
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

  let text = 'No active effect';
  let kind = '';

  if (state.statusMessage) {
    text = state.statusMessage;
    kind = state.statusKind;
  } else if (state.shopOpen) {
    text = 'Shop open. Game paused.';
    kind = 'warn';
  } else {
    const parts = [];
    if (state.pauseTimer > 0) {
      parts.push(`Pause ${formatSeconds(state.pauseTimer)}`);
    }
    if (state.slowTimer > 0) {
      parts.push(`Slow ${formatSeconds(state.slowTimer)}`);
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
    commandPromptEl.textContent = 'Shop is open. Use the buttons or press Escape to close.';
    return;
  }

  commandPromptEl.textContent = 'Press 1, 2, 3, or 4 to trigger TNT, Slow, Pause, or Shop.';
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
  if (!Array.isArray(window.NORWEGIAN_WORDS) || window.NORWEGIAN_WORDS.length === 0) {
    return 'ord';
  }

  if (state.usedWords.length >= window.NORWEGIAN_WORDS.length) {
    state.usedWords = [];
  }

  const availableWords = window.NORWEGIAN_WORDS.filter((word) => !state.usedWords.includes(word));
  const source = availableWords.length > 0 ? availableWords : window.NORWEGIAN_WORDS;
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
    normalizedText: text.toLocaleLowerCase('no-NO'),
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
  return text.toLocaleLowerCase('no-NO');
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

function getAccuracyPercent() {
  if (state.attemptedChars === 0) {
    return 100;
  }

  return Math.round((state.correctChars / state.attemptedChars) * 100);
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
    showStatus('Shop opened.', 'good', 1400);
    return;
  }

  const key = command.inventoryKey;
  if (state.inventory[key] <= 0) {
    showStatus(`No ${command.label} charges left.`, 'bad');
    return;
  }

  state.inventory[key] -= 1;

  if (slot === 1) {
    state.typedText = '';
    clearAllWords();
    showStatus('TNT cleared the board.', 'good');
  } else if (slot === 2) {
    state.slowTimer = ABILITY_DURATION_MS;
    showStatus('Slow active for 10 seconds.', 'good');
  } else if (slot === 3) {
    state.pauseTimer = ABILITY_DURATION_MS;
    showStatus('Pause active for 10 seconds.', 'warn');
  }

  updateWordHighlights();
  renderHud();
}

function buyShopItem(itemKey, currency) {
  const item = SHOP_ITEMS[itemKey];
  if (!item) {
    return;
  }

  const usingWordPoints = currency === 'word';
  const cost = usingWordPoints ? item.wordCost : item.charCost;
  const currentPoints = usingWordPoints ? state.wordPoints : state.charPoints;

  if (currentPoints < cost) {
    showStatus(`Not enough ${usingWordPoints ? 'Gold' : 'Silver'} for that purchase.`, 'bad');
    renderHud();
    return;
  }

  if (itemKey === 'heart' && state.lives >= START_LIVES) {
    showStatus('Hearts are already full.', 'bad');
    renderHud();
    return;
  }

  if (usingWordPoints) {
    state.wordPoints -= cost;
  } else {
    state.charPoints -= cost;
  }

  if (itemKey === 'heart') {
    state.lives += 1;
  } else {
    state.inventory[itemKey] += 1;
  }

  showStatus(`Bought ${itemKey} with ${usingWordPoints ? 'Gold' : 'Silver'}.`, 'good');
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
  state.wordPoints += state.wordStreak;
  const scoreGain = SCORE_PER_WORD + (state.wordStreak * 3) + Math.floor(state.charStreak / 5);
  state.score += scoreGain;
  state.typedText = '';
  showStatus(`+${scoreGain} score`, 'good', 1200);
  renderHud();
  updateWordHighlights();
}

function handleWrongCharacter() {
  state.attemptedChars += 1;
  state.typedText = '';
  resetStreaks();
  showStatus('Wrong character. Streak reset.', 'bad');
  renderHud();
  updateWordHighlights();
}

function damagePlayer() {
  state.lives -= 1;
  state.typedText = '';
  resetStreaks();
  showStatus('A word hit the bottom. Streak reset.', 'bad');
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

  state.spawnTimer += deltaMs;
  if (state.spawnTimer >= state.spawnInterval) {
    state.spawnTimer = 0;
    spawnWord();
  }

  updateDifficulty(deltaMs);
  const speedMultiplier = state.slowTimer > 0 ? 0.5 : 1;
  updateFallingWords(deltaSeconds * speedMultiplier);
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
      showStatus('Backspace reset the streak.', 'warn');
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

  if (!/^[a-zA-Z\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]$/.test(event.key)) {
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
    buyShopItem(button.dataset.shopItem, button.dataset.currency);
  });
});
window.addEventListener('keydown', handleKeydown);
window.addEventListener('resize', () => {
  state.words.forEach((word) => updateWordPosition(word));
});

setScreen('start');
renderHud();
