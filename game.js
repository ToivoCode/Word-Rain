const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const typedDisplayEl = document.getElementById('typed-display');
const finalScoreEl = document.getElementById('final-score');
const wordLayer = document.getElementById('word-layer');

const START_LIVES = 5;
const BASE_SPAWN_MS = 2100;
const MIN_SPAWN_MS = 850;
const FALL_SPEED = 42;
const SCORE_PER_WORD = 10;

const state = {
  screen: 'start',
  score: 0,
  lives: START_LIVES,
  typedText: '',
  words: [],
  nextWordId: 1,
  lastFrameTime: 0,
  spawnTimer: 0,
  spawnInterval: BASE_SPAWN_MS,
  difficultyTimer: 0,
  loopId: null,
  usedWords: []
};

function setScreen(name) {
  state.screen = name;
  startScreen.classList.toggle('active', name === 'start');
  gameScreen.classList.toggle('active', name === 'playing');
  gameOverScreen.classList.toggle('active', name === 'game-over');
}

function resetGame() {
  state.score = 0;
  state.lives = START_LIVES;
  state.typedText = '';
  state.words = [];
  state.nextWordId = 1;
  state.lastFrameTime = 0;
  state.spawnTimer = 0;
  state.spawnInterval = BASE_SPAWN_MS;
  state.difficultyTimer = 0;
  state.usedWords = [];
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

  finalScoreEl.textContent = String(state.score);
  setScreen('game-over');
}

function renderHud() {
  scoreEl.textContent = String(state.score);
  livesEl.textContent = String(state.lives);
  typedDisplayEl.textContent = state.typedText || '-';
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
    return;
  }

  const [word] = state.words.splice(index, 1);
  word.element.remove();
}

function normalizeInput(text) {
  return text.toLocaleLowerCase('no-NO');
}

function updateWordHighlights() {
  const typed = normalizeInput(state.typedText);
  state.words.forEach((word) => {
    const isMatch = typed.length > 0 && word.normalizedText.startsWith(typed);
    word.element.classList.toggle('matching', isMatch);
  });
}

function trySubmitTypedWord() {
  const typed = normalizeInput(state.typedText);
  if (!typed) {
    return;
  }

  const matchedWord = state.words.find((word) => word.normalizedText === typed);
  if (!matchedWord) {
    return;
  }

  removeWord(matchedWord.id);
  state.score += SCORE_PER_WORD;
  state.typedText = '';
  renderHud();
  updateWordHighlights();
}

function damagePlayer() {
  state.lives -= 1;
  renderHud();

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

  const deltaMs = timestamp - state.lastFrameTime;
  const deltaSeconds = deltaMs / 1000;
  state.lastFrameTime = timestamp;

  state.spawnTimer += deltaMs;
  if (state.spawnTimer >= state.spawnInterval) {
    state.spawnTimer = 0;
    spawnWord();
  }

  updateDifficulty(deltaMs);
  updateFallingWords(deltaSeconds);
  trySubmitTypedWord();
  updateWordHighlights();

  if (state.screen === 'playing') {
    state.loopId = window.requestAnimationFrame(gameLoop);
  }
}

function handleKeydown(event) {
  if (state.screen !== 'playing') {
    return;
  }

  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    state.typedText = state.typedText.slice(0, -1);
    renderHud();
    updateWordHighlights();
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

  state.typedText += event.key;
  renderHud();
  trySubmitTypedWord();
  updateWordHighlights();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
window.addEventListener('keydown', handleKeydown);
window.addEventListener('resize', () => {
  state.words.forEach((word) => updateWordPosition(word));
});

setScreen('start');
renderHud();
