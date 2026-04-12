const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultyInputs = Array.from(document.querySelectorAll('input[name="difficulty"]'));
const languageInputs = Array.from(document.querySelectorAll('input[name="language"]'));
const themeInputs = Array.from(document.querySelectorAll('input[name="theme"]'));
const playerNameInput = document.getElementById('player-name');
const scoreEl = document.getElementById('score');
const heartsEl = document.getElementById('hearts');
const wordStreakEl = document.getElementById('word-streak');
const charStreakEl = document.getElementById('char-streak');
const accuracyEl = document.getElementById('accuracy');
const wordPointsEl = document.getElementById('word-points');
const charPointsEl = document.getElementById('char-points');
const typedDisplayEl = document.getElementById('typed-display');
const finalScoreEl = document.getElementById('final-score');
const leaderboardResultEl = document.getElementById('leaderboard-result');
const effectStatusEl = document.getElementById('effect-status');
const commandPromptEl = document.getElementById('command-prompt');
const soundToggleButton = document.getElementById('sound-toggle');
const countTntEl = document.getElementById('count-tnt');
const countSlowEl = document.getElementById('count-slow');
const countPauseEl = document.getElementById('count-pause');
const actionButtons = Array.from(document.querySelectorAll('.action-button'));
const shopOverlay = document.getElementById('shop-overlay');
const shopCloseButton = document.getElementById('shop-close');
const shopBackdrop = document.querySelector('.shop-backdrop');
const shopButtons = Array.from(document.querySelectorAll('[data-shop-item]'));
const wordLayer = document.getElementById('word-layer');
const leaderboardDifficultyEl = document.getElementById('leaderboard-difficulty');
const leaderboardEmptyEl = document.getElementById('leaderboard-empty');
const leaderboardListEl = document.getElementById('leaderboard-list');
const translatableEls = Array.from(document.querySelectorAll('[data-i18n]'));

const START_LIVES = 10;
const BASE_SPAWN_MS = 2100;
const MIN_SPAWN_MS = 850;
const FALL_SPEED = 42;
const SCORE_PER_WORD = 10;
const ABILITY_DURATION_MS = 10000;
const SOUND_STORAGE_KEY = 'ordregn-sound-enabled';
const PLAYER_NAME_STORAGE_KEY = 'ordregn-player-name';
const SETTINGS_STORAGE_KEY = 'ordregn-settings-v1';
const LEADERBOARD_STORAGE_KEY = 'ordregn-leaderboard-v1';
const MAX_LEADERBOARD_ENTRIES = 10;

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

function loadStoredSoundEnabled() {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function loadStoredPlayerName() {
  try {
    return window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function loadStoredSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    const difficultyKey = ['adult', 'kids', 'small-kids'].includes(parsed.difficultyKey) ? parsed.difficultyKey : 'adult';
    const languageKey = ['no', 'en'].includes(parsed.languageKey) ? parsed.languageKey : 'no';
    const themeKey = ['light', 'dark'].includes(parsed.themeKey) ? parsed.themeKey : 'light';

    return { difficultyKey, languageKey, themeKey };
  } catch {
    return { difficultyKey: 'adult', languageKey: 'no', themeKey: 'light' };
  }
}

const storedSettings = loadStoredSettings();

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
    'start.playerNameLabel': 'Spillernavn',
    'start.playerNamePlaceholder': 'Spiller',
    'start.button': 'Start spill',
    'sound.on': 'Lyd på',
    'sound.off': 'Lyd av',
    'leaderboard.eyebrow': 'Lokal toppliste',
    'leaderboard.title': 'Beste runder',
    'leaderboard.empty': 'Ingen resultater ennå for denne vanskelighetsgraden.',
    'leaderboard.rank': 'Plass',
    'leaderboard.score': 'Poeng',
    'leaderboard.accuracy': 'Nøyaktighet',
    'leaderboard.bestWord': 'Beste ordrekke',
    'leaderboard.bestChar': 'Beste tegnrekke',
    'leaderboard.heartsLost': 'Mistede hjerter',
    'leaderboard.tntUsed': 'TNT brukt',
    'leaderboard.slowUsed': 'Sakte brukt',
    'leaderboard.pauseUsed': 'Pause brukt',
    'leaderboard.goldEarned': 'Gull tjent',
    'leaderboard.silverEarned': 'Sølv tjent',
    'leaderboard.goldSpent': 'Gull brukt',
    'leaderboard.timeSpent': 'Tid',
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
    'gameOver.savedRank': '{name} er nå nummer {rank} på topplisten for {difficulty}.',
    'gameOver.savedUnranked': 'Resultatet til {name} ble lagret for {difficulty}.',
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
    'start.playerNameLabel': 'Player name',
    'start.playerNamePlaceholder': 'Player',
    'start.button': 'Start Game',
    'sound.on': 'Sound On',
    'sound.off': 'Sound Off',
    'leaderboard.eyebrow': 'Local leaderboard',
    'leaderboard.title': 'Best runs',
    'leaderboard.empty': 'No scores yet for this difficulty.',
    'leaderboard.rank': 'Rank',
    'leaderboard.score': 'Score',
    'leaderboard.accuracy': 'Accuracy',
    'leaderboard.bestWord': 'Best word streak',
    'leaderboard.bestChar': 'Best char streak',
    'leaderboard.heartsLost': 'Hearts lost',
    'leaderboard.tntUsed': 'TNT used',
    'leaderboard.slowUsed': 'Slow used',
    'leaderboard.pauseUsed': 'Pause used',
    'leaderboard.goldEarned': 'Gold earned',
    'leaderboard.silverEarned': 'Silver earned',
    'leaderboard.goldSpent': 'Gold spent',
    'leaderboard.timeSpent': 'Time',
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
    'gameOver.savedRank': '{name} is now number {rank} on the {difficulty} leaderboard.',
    'gameOver.savedUnranked': '{name} was saved on the {difficulty} leaderboard.',
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
  playerName: loadStoredPlayerName(),
  difficultyKey: storedSettings.difficultyKey,
  languageKey: storedSettings.languageKey,
  themeKey: storedSettings.themeKey,
  soundEnabled: loadStoredSoundEnabled(),
  leaderboardRank: null,
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
  elapsedMs: 0,
  bestWordStreak: 0,
  bestCharStreak: 0,
  heartsLost: 0,
  tntUsed: 0,
  slowUsed: 0,
  pauseUsed: 0,
  goldEarned: 0,
  silverEarned: 0,
  goldSpent: 0,
  loopId: null,
  usedWords: [],
  inventory: {
    tnt: 1,
    slow: 1,
    pause: 1
  }
};

const audioState = {
  context: null,
  noiseBuffer: null
};

function sanitizePlayerName(name) {
  return (name || '').trim().slice(0, 24);
}

function getPlayerName() {
  return sanitizePlayerName(state.playerName) || t('start.playerNamePlaceholder');
}

function persistPlayerName() {
  try {
    window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, getPlayerName());
  } catch {
    // Ignore storage issues and keep the in-memory name.
  }
}

function persistSettings() {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
      difficultyKey: state.difficultyKey,
      languageKey: state.languageKey,
      themeKey: state.themeKey
    }));
  } catch {
    // Ignore storage issues and keep the current session playable.
  }
}

function syncStartInputs() {
  difficultyInputs.forEach((input) => {
    input.checked = input.value === state.difficultyKey;
  });
  languageInputs.forEach((input) => {
    input.checked = input.value === state.languageKey;
  });
  themeInputs.forEach((input) => {
    input.checked = input.value === state.themeKey;
  });

  if (playerNameInput) {
    playerNameInput.value = state.playerName;
  }
}

function loadLeaderboardStore() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEADERBOARD_STORAGE_KEY) || '{}');
    return {
      adult: Array.isArray(parsed.adult) ? parsed.adult : [],
      kids: Array.isArray(parsed.kids) ? parsed.kids : [],
      'small-kids': Array.isArray(parsed['small-kids']) ? parsed['small-kids'] : []
    };
  } catch {
    return {
      adult: [],
      kids: [],
      'small-kids': []
    };
  }
}

function saveLeaderboardStore(store) {
  try {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures and keep the current session playable.
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getDifficultyLabel(difficultyKey = state.difficultyKey) {
  if (difficultyKey === 'kids') {
    return t('difficulty.kids');
  }

  if (difficultyKey === 'small-kids') {
    return t('difficulty.smallKids');
  }

  return t('difficulty.adult');
}

function saveLeaderboardEntry() {
  const store = loadLeaderboardStore();
  const difficultyKey = state.difficultyKey;
  const entry = {
    name: getPlayerName(),
    score: state.score,
    bestWordStreak: state.bestWordStreak,
    bestCharStreak: state.bestCharStreak,
    accuracy: getAccuracyPercent(),
    heartsLost: state.heartsLost,
    tntUsed: state.tntUsed,
    slowUsed: state.slowUsed,
    pauseUsed: state.pauseUsed,
    goldEarned: state.goldEarned,
    silverEarned: state.silverEarned,
    goldSpent: state.goldSpent,
    timeSpentMs: state.elapsedMs,
    createdAt: Date.now()
  };

  const nextEntries = [...store[difficultyKey], entry]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      if (right.accuracy !== left.accuracy) {
        return right.accuracy - left.accuracy;
      }
      return left.timeSpentMs - right.timeSpentMs;
    })
    .slice(0, MAX_LEADERBOARD_ENTRIES);

  store[difficultyKey] = nextEntries;
  saveLeaderboardStore(store);

  const rank = nextEntries.findIndex((item) => item.createdAt === entry.createdAt) + 1;
  return rank > 0 ? rank : null;
}

function renderLeaderboard() {
  if (!leaderboardListEl || !leaderboardEmptyEl || !leaderboardDifficultyEl) {
    return;
  }

  const difficultyKey = state.screen === 'start' ? getSelectedDifficultyKey() : state.difficultyKey;
  const entries = loadLeaderboardStore()[difficultyKey] || [];

  leaderboardDifficultyEl.textContent = getDifficultyLabel(difficultyKey);
  leaderboardListEl.innerHTML = '';
  leaderboardEmptyEl.textContent = t('leaderboard.empty');
  leaderboardEmptyEl.hidden = entries.length > 0;

  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'leaderboard-item';

    const main = document.createElement('div');
    main.className = 'leaderboard-main';
    main.innerHTML = `
      <div>
        <div class="leaderboard-rank">${t('leaderboard.rank')} ${index + 1}</div>
        <div class="leaderboard-name"></div>
      </div>
      <div class="leaderboard-score">${t('leaderboard.score')}: ${entry.score}</div>
    `;
    main.querySelector('.leaderboard-name').textContent = entry.name;

    const stats = document.createElement('div');
    stats.className = 'leaderboard-stats';
    stats.innerHTML = `
      <div>${t('leaderboard.accuracy')}: ${entry.accuracy}% · ${t('leaderboard.bestWord')}: ${entry.bestWordStreak} · ${t('leaderboard.bestChar')}: ${entry.bestCharStreak}</div>
      <div>${t('leaderboard.heartsLost')}: ${entry.heartsLost} · ${t('leaderboard.tntUsed')}: ${entry.tntUsed} · ${t('leaderboard.slowUsed')}: ${entry.slowUsed} · ${t('leaderboard.pauseUsed')}: ${entry.pauseUsed}</div>
      <div>${t('leaderboard.goldEarned')}: ${entry.goldEarned} · ${t('leaderboard.silverEarned')}: ${entry.silverEarned} · ${t('leaderboard.goldSpent')}: ${entry.goldSpent} · ${t('leaderboard.timeSpent')}: ${formatDuration(entry.timeSpentMs)}</div>
    `;

    item.append(main, stats);
    leaderboardListEl.appendChild(item);
  });
}

function setScreen(name) {
  state.screen = name;
  startScreen.classList.toggle('active', name === 'start');
  gameScreen.classList.toggle('active', name === 'playing');
  gameOverScreen.classList.toggle('active', name === 'game-over');
  renderLeaderboardResult();
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
  if (playerNameInput) {
    playerNameInput.placeholder = t('start.playerNamePlaceholder');
    playerNameInput.value = state.playerName;
  }
  renderLeaderboard();
  renderLeaderboardResult();
  renderHud();
}

function applyTheme() {
  document.body.dataset.theme = state.themeKey;
}

function renderLeaderboardResult() {
  if (!leaderboardResultEl) {
    return;
  }

  if (state.screen !== 'game-over') {
    leaderboardResultEl.textContent = '';
    leaderboardResultEl.hidden = true;
    return;
  }

  const replacements = {
    name: getPlayerName(),
    difficulty: getDifficultyLabel(state.difficultyKey),
    rank: state.leaderboardRank
  };
  leaderboardResultEl.textContent = state.leaderboardRank
    ? t('gameOver.savedRank', replacements)
    : t('gameOver.savedUnranked', replacements);
  leaderboardResultEl.hidden = false;
}

function persistSoundPreference() {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, state.soundEnabled ? 'on' : 'off');
  } catch {
    // Ignore storage issues and keep the in-memory preference.
  }
}

function renderSoundToggle() {
  if (!soundToggleButton) {
    return;
  }

  const icon = state.soundEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07';
  const label = t(state.soundEnabled ? 'sound.on' : 'sound.off');
  soundToggleButton.textContent = `${icon} ${label}`;
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.35, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2) - 1;
  }
  return buffer;
}

async function ensureAudioReady() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioState.context) {
    audioState.context = new AudioContextClass();
    audioState.noiseBuffer = createNoiseBuffer(audioState.context);
  }

  if (audioState.context.state === 'suspended') {
    try {
      await audioState.context.resume();
    } catch {
      return null;
    }
  }

  return audioState.context;
}

function scheduleEnvelope(gainNode, now, peakGain, attack, release) {
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(peakGain, now + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
}

function playTone(options = {}) {
  if (!state.soundEnabled || !audioState.context) {
    return;
  }

  const context = audioState.context;
  const now = context.currentTime + (options.delay || 0);
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(options.frequency || 440, now);

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, now + (options.attack || 0.01) + (options.release || 0.12));
  }

  scheduleEnvelope(
    gainNode,
    now,
    options.gain || 0.05,
    options.attack || 0.01,
    options.release || 0.12
  );

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (options.attack || 0.01) + (options.release || 0.12) + 0.04);
}

function playNoiseBurst(options = {}) {
  if (!state.soundEnabled || !audioState.context || !audioState.noiseBuffer) {
    return;
  }

  const context = audioState.context;
  const now = context.currentTime + (options.delay || 0);
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gainNode = context.createGain();

  source.buffer = audioState.noiseBuffer;
  filter.type = options.filterType || 'lowpass';
  filter.frequency.setValueAtTime(options.frequency || 900, now);
  filter.Q.value = options.q || 1.2;

  scheduleEnvelope(
    gainNode,
    now,
    options.gain || 0.08,
    options.attack || 0.005,
    options.release || 0.18
  );

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(now);
  source.stop(now + (options.attack || 0.005) + (options.release || 0.18) + 0.05);
}

function playSoundEffect(effectName) {
  if (!state.soundEnabled || !audioState.context) {
    return;
  }

  switch (effectName) {
    case 'wordComplete':
      playTone({ type: 'triangle', frequency: 520, endFrequency: 780, gain: 0.045, release: 0.1 });
      playTone({ type: 'triangle', frequency: 700, gain: 0.03, delay: 0.05, release: 0.08 });
      break;
    case 'wrongCharacter':
      playTone({ type: 'square', frequency: 240, endFrequency: 170, gain: 0.03, attack: 0.005, release: 0.09 });
      break;
    case 'heartLost':
      playTone({ type: 'sawtooth', frequency: 280, endFrequency: 120, gain: 0.05, attack: 0.005, release: 0.28 });
      break;
    case 'tnt':
      playNoiseBurst({ frequency: 700, gain: 0.12, release: 0.28 });
      playTone({ type: 'sawtooth', frequency: 140, endFrequency: 48, gain: 0.09, attack: 0.005, release: 0.32 });
      playNoiseBurst({ frequency: 380, gain: 0.06, delay: 0.04, release: 0.2 });
      break;
    case 'slow':
      playTone({ type: 'sine', frequency: 460, endFrequency: 290, gain: 0.035, attack: 0.01, release: 0.22 });
      break;
    case 'pause':
      playTone({ type: 'triangle', frequency: 430, gain: 0.035, attack: 0.01, release: 0.1 });
      playTone({ type: 'triangle', frequency: 350, gain: 0.03, delay: 0.08, attack: 0.01, release: 0.14 });
      break;
    case 'shopOpen':
      playTone({ type: 'triangle', frequency: 360, gain: 0.025, attack: 0.01, release: 0.08 });
      playTone({ type: 'triangle', frequency: 480, gain: 0.025, delay: 0.06, attack: 0.01, release: 0.08 });
      break;
    case 'buy':
      playTone({ type: 'square', frequency: 620, gain: 0.02, attack: 0.004, release: 0.06 });
      playTone({ type: 'square', frequency: 840, gain: 0.025, delay: 0.04, attack: 0.004, release: 0.08 });
      break;
    case 'silverConvert':
      playTone({ type: 'triangle', frequency: 520, gain: 0.02, attack: 0.01, release: 0.08 });
      playTone({ type: 'triangle', frequency: 780, gain: 0.03, delay: 0.05, attack: 0.01, release: 0.1 });
      break;
    case 'gameOver':
      playTone({ type: 'sine', frequency: 320, endFrequency: 240, gain: 0.03, release: 0.18 });
      playTone({ type: 'sine', frequency: 220, endFrequency: 150, gain: 0.03, delay: 0.12, release: 0.24 });
      break;
    default:
      break;
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  persistSoundPreference();
  renderSoundToggle();

  if (state.soundEnabled) {
    ensureAudioReady().then(() => {
      playTone({ type: 'triangle', frequency: 520, gain: 0.025, release: 0.08 });
    });
  }
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
  renderSoundToggle();
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
  state.leaderboardRank = null;
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
  state.elapsedMs = 0;
  state.bestWordStreak = 0;
  state.bestCharStreak = 0;
  state.heartsLost = 0;
  state.tntUsed = 0;
  state.slowUsed = 0;
  state.pauseUsed = 0;
  state.goldEarned = 0;
  state.silverEarned = 0;
  state.goldSpent = 0;
  state.usedWords = [];
  state.inventory = { tnt: 1, slow: 1, pause: 1 };
  wordLayer.innerHTML = '';
  renderHud();
}

function startGame() {
  ensureAudioReady();

  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  if (state.screen === 'start') {
    state.difficultyKey = getSelectedDifficultyKey();
    state.languageKey = getSelectedLanguageKey();
    state.themeKey = getSelectedThemeKey();
    state.playerName = sanitizePlayerName(playerNameInput ? playerNameInput.value : state.playerName);
    persistSettings();
    persistPlayerName();
    applyLanguage();
    applyTheme();
  }

  resetGame();
  setScreen('playing');
  spawnWord();
  spawnWord();
  state.loopId = window.requestAnimationFrame(gameLoop);
}

function returnToMainMenu() {
  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  resetGame();
  syncStartInputs();
  persistSettings();
  persistPlayerName();
  setScreen('start');
  applyLanguage();
  applyTheme();
}

function endGame() {
  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  state.shopOpen = false;
  state.leaderboardRank = saveLeaderboardEntry();
  playSoundEffect('gameOver');
  finalScoreEl.textContent = String(state.score);
  renderHud();
  setScreen('game-over');
  renderLeaderboardResult();
  renderLeaderboard();
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
  playSoundEffect('silverConvert');
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
    playSoundEffect('shopOpen');
    showStatus(t('status.shopOpened'), 'good', 1400);
    return;
  }

  const key = command.inventoryKey;
  if (state.inventory[key] <= 0) {
    playSoundEffect('wrongCharacter');
    showStatus(t('status.noCharges', { item: getItemLabel(key) }), 'bad');
    return;
  }

  state.inventory[key] -= 1;

  if (slot === 1) {
    state.typedText = '';
    clearAllWords();
    state.tntUsed += 1;
    playSoundEffect('tnt');
    showStatus(t('status.tntCleared'), 'good');
  } else if (slot === 2) {
    state.slowTimer = ABILITY_DURATION_MS;
    state.slowUsed += 1;
    playSoundEffect('slow');
    showStatus(t('status.slowActive'), 'good');
  } else if (slot === 3) {
    state.pauseTimer = ABILITY_DURATION_MS;
    state.pauseUsed += 1;
    playSoundEffect('pause');
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
    playSoundEffect('wrongCharacter');
    showStatus(t('status.notEnoughGold'), 'bad');
    renderHud();
    return;
  }

  if (itemKey === 'heart' && state.lives >= START_LIVES) {
    playSoundEffect('wrongCharacter');
    showStatus(t('status.heartsFull'), 'bad');
    renderHud();
    return;
  }

  state.wordPoints -= item.goldCost;
  state.goldSpent += item.goldCost;

  if (itemKey === 'heart') {
    state.lives += 1;
  } else {
    state.inventory[itemKey] += 1;
  }

  playSoundEffect('buy');
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
  state.goldEarned += 1;
  state.bestWordStreak = Math.max(state.bestWordStreak, state.wordStreak);
  const scoreGain = SCORE_PER_WORD + (state.wordStreak * 3) + Math.floor(state.charStreak / 5);
  state.score += scoreGain;
  state.typedText = '';
  playSoundEffect('wordComplete');
  showStatus(t('status.scoreGain', { score: scoreGain }), 'good', 1200);
  renderHud();
  updateWordHighlights();
}

function handleWrongCharacter() {
  state.attemptedChars += 1;
  state.typedText = '';
  resetStreaks();
  playSoundEffect('wrongCharacter');
  showStatus(t('status.wrongCharacter'), 'bad');
  renderHud();
  updateWordHighlights();
}

function damagePlayer() {
  state.lives -= 1;
  state.heartsLost += 1;
  state.typedText = '';
  resetStreaks();
  playSoundEffect('heartLost');
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
  state.elapsedMs += deltaMs;

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
  state.silverEarned += 1;
  state.bestCharStreak = Math.max(state.bestCharStreak, state.charStreak);
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

  ensureAudioReady();

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
restartButton.addEventListener('click', returnToMainMenu);
soundToggleButton.addEventListener('click', () => {
  ensureAudioReady().finally(toggleSound);
});
shopCloseButton.addEventListener('click', closeShop);
shopBackdrop.addEventListener('click', closeShop);
actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (state.screen === 'playing' && !state.shopOpen) {
      ensureAudioReady();
      applyAbility(Number(button.dataset.slot));
    }
  });
});
shopButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ensureAudioReady();
    buyShopItem(button.dataset.shopItem);
  });
});
difficultyInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.difficultyKey = getSelectedDifficultyKey();
      persistSettings();
      renderLeaderboard();
    }
  });
});
languageInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.languageKey = getSelectedLanguageKey();
      persistSettings();
      applyLanguage();
    }
  });
});
themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.themeKey = getSelectedThemeKey();
      persistSettings();
      applyTheme();
    }
  });
});
playerNameInput.addEventListener('input', () => {
  state.playerName = sanitizePlayerName(playerNameInput.value);
  persistPlayerName();
});
window.addEventListener('keydown', handleKeydown);
window.addEventListener('resize', () => {
  state.words.forEach((word) => updateWordPosition(word));
});

setScreen('start');
syncStartInputs();
applyLanguage();
applyTheme();
