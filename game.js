const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const highScoreScreen = document.getElementById('high-score-screen');
const scoresDifficulty = document.getElementById('scores-difficulty');
const scoresList = document.getElementById('scores-list');
let leaderboardSessionStore = null;
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultyInputs = Array.from(document.querySelectorAll('input[name="difficulty"]'));
const languageInputs = Array.from(document.querySelectorAll('input[name="language"]'));
const themeInputs = Array.from(document.querySelectorAll('input[name="theme"]'));
const soundInputs = Array.from(document.querySelectorAll('input[name="sound"]'));
const playerNameInput = document.getElementById('player-name');
const scoreEl = document.getElementById('score');
const heartsEl = document.getElementById('hearts');
const wordStreakEl = document.getElementById('word-streak');
const charStreakEl = document.getElementById('char-streak');
const accuracyEl = document.getElementById('accuracy');
const mobileGoldEl = document.getElementById('mobile-gold');
const wordPointsEl = document.getElementById('word-points');
const charPointsEl = document.getElementById('char-points');
const shopWordPointsEl = document.getElementById('shop-word-points');
const shopCharPointsEl = document.getElementById('shop-char-points');
const typedDisplayEl = document.getElementById('typed-display');
const mobileTypingInput = document.getElementById('mobile-typing-input');
const leaderboardResultEl = document.getElementById('leaderboard-result');
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
const shopOwnedEls = Array.from(document.querySelectorAll('[data-shop-owned]'));
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
const MOBILE_BREAKPOINT = 600;

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
    const themeKey = ['light', 'dark'].includes(parsed.themeKey) ? parsed.themeKey : 'dark';

    return { difficultyKey, languageKey, themeKey };
  } catch {
    return { difficultyKey: 'adult', languageKey: 'no', themeKey: 'dark' };
  }
}

const storedSettings = loadStoredSettings();

const TRANSLATIONS = {
  no: {
    'start.eyebrow': 'Norsk skrivelek',
    "scores.viewAll": "Se alle resultater",
    "scores.description": "Dine beste resultater, sortert etter høyest poengsum.",
    "scores.playAgain": "Start nytt spill",
    "scores.mainMenu": "Gå til hovedmenyen",
    "scores.empty": "Ingen runder ennå. Spill en runde og sett den første rekorden!",
    "scores.localNote": "Resultatene lagres lokalt i denne nettleseren.",
    "scores.latest": "Din siste runde",
    "scores.typing": "Skriving",
    "scores.abilities": "Bruk av ferdigheter",
    "scores.lives": "Liv",
    "scores.economy": "Økonomi",
    "scores.heartsBought": "Hjerter kjøpt",
    "scores.roundResult": "{name} · {score} poeng · plass {rank}",
    "scores.browse": "Finn din neste rekord.",
    "scores.unknownDate": "Tidspunkt ikke registrert",
    "scores.sessionOnly": "Lagring er utilgjengelig. Resultatet vises bare i denne økten.",
    'start.settings': 'Innstillinger',
    'start.makeItYours': 'Finn din flyt',
    'start.languageHint': 'Hvilke ord skal falle?',
    'start.difficultyHint': 'Velg tempoet som passer deg',
    'start.themeHint': 'Utseende og farger',
    'start.soundHint': 'Lydeffekter underveis',
    'start.nameHint': 'Hva skal vi kalle deg?',
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
    'theme.lightMeta': 'Lys og elegant',
    'theme.dark': 'Mørk',
    'theme.darkMeta': 'Moderne nattstil',
    'start.soundLegend': 'Lyd',
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
    'hud.mobileTypeLabel': 'Skriv ordene',
    'hud.mobileTypePlaceholder': 'Skriv ordene',
    'ability.tnt': 'TNT',
    'ability.slow': 'Sakte',
    'ability.pause': 'Pause',
    'ability.shop': 'Butikk',
    'ability.open': 'åpne',
    'currency.gold': 'Gull',
    'currency.silver': 'Sølv',
    'shop.paused': 'Pause',
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
    'shop.owned': 'Eier',
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
    "scores.viewAll": "View all scores",
    "scores.description": "Your best rounds, ranked by highest score.",
    "scores.playAgain": "Start new game",
    "scores.mainMenu": "Go to main menu",
    "scores.empty": "No rounds yet. Play a round and set the first record!",
    "scores.localNote": "Scores are saved locally in this browser.",
    "scores.latest": "Your latest round",
    "scores.typing": "Typing",
    "scores.abilities": "Ability use",
    "scores.lives": "Lives",
    "scores.economy": "Economy",
    "scores.heartsBought": "Hearts bought",
    "scores.roundResult": "{name} · {score} points · rank {rank}",
    "scores.browse": "Find your next personal best.",
    "scores.unknownDate": "Date not recorded",
    "scores.sessionOnly": "Storage is unavailable. This result is only available in this session.",
    'start.settings': 'Settings',
    'start.makeItYours': 'Find your flow',
    'start.languageHint': 'Which words will fall?',
    'start.difficultyHint': 'Choose your own pace',
    'start.themeHint': 'Set the mood',
    'start.soundHint': 'Sounds while you play',
    'start.nameHint': 'What should we call you?',
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
    'theme.lightMeta': 'Light and elegant',
    'theme.dark': 'Dark',
    'theme.darkMeta': 'Modern night style',
    'start.soundLegend': 'Sound',
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
    'hud.mobileTypeLabel': 'Type the words',
    'hud.mobileTypePlaceholder': 'Type the words',
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
    'shop.owned': 'Owned',
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
  heartsBought: 0,
  lastResult: null,
  scoreSaved: true,
  tntUsed: 0,
  slowUsed: 0,
  pauseUsed: 0,
  goldEarned: 0,
  silverEarned: 0,
  goldSpent: 0,
  loopId: null,
  wordBags: { no: [], en: [] },
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
  soundInputs.forEach((input) => {
    input.checked = input.value === (state.soundEnabled ? 'on' : 'off');
  });

  if (playerNameInput) {
    playerNameInput.value = state.playerName;
  }
}

function loadLeaderboardStore() {
  if (leaderboardSessionStore) return leaderboardSessionStore;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEADERBOARD_STORAGE_KEY) || '{}');
    return {
      adult: normalizeScores(parsed.adult),
      kids: normalizeScores(parsed.kids),
      'small-kids': normalizeScores(parsed['small-kids'])
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
  leaderboardSessionStore = store;
  try {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    // Keep results visible in this session when persistent storage is unavailable.
    return false;
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
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: getPlayerName(),
    score: state.score,
    bestWordStreak: state.bestWordStreak,
    bestCharStreak: state.bestCharStreak,
    accuracy: getAccuracyPercent(),
    heartsLost: state.heartsLost,
    heartsBought: state.heartsBought,
    tntUsed: state.tntUsed,
    slowUsed: state.slowUsed,
    pauseUsed: state.pauseUsed,
    goldEarned: state.goldEarned,
    silverEarned: state.silverEarned,
    goldSpent: state.goldSpent,
    timeSpentMs: state.elapsedMs,
    createdAt: Date.now()
  };

  const nextEntries = [...store[difficultyKey], entry].sort(compareScores);
  store[difficultyKey] = nextEntries;
  state.scoreSaved = saveLeaderboardStore(store);
  state.lastResult = { id: entry.id, difficultyKey };
  return nextEntries.findIndex((item) => item.id === entry.id) + 1;
}

function compareScores(left, right) {
  return right.score - left.score || right.accuracy - left.accuracy || left.timeSpentMs - right.timeSpentMs;
}

function normalizeScores(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => entry && typeof entry === 'object').map((entry, index) => {
    const clean = { ...entry, id: typeof entry.id === 'string' ? entry.id : `legacy-${entry.createdAt}-${index}`, name: sanitizePlayerName(typeof entry.name === 'string' ? entry.name : '') };
    ['score', 'accuracy', 'bestWordStreak', 'bestCharStreak', 'heartsLost', 'tntUsed', 'slowUsed', 'pauseUsed', 'goldEarned', 'silverEarned', 'goldSpent', 'timeSpentMs', 'createdAt'].forEach((key) => {
      clean[key] = Number.isFinite(entry[key]) ? Math.max(0, entry[key]) : 0;
    });
    clean.accuracy = Math.min(100, clean.accuracy);
    clean.heartsBought = Number.isFinite(entry.heartsBought) ? Math.max(0, entry.heartsBought) : null;
    return clean;
  }).sort(compareScores);
}

function scoreNode(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatScoreDate(timestamp) {
  const date = new Date(timestamp);
  return timestamp && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(state.languageKey === 'no' ? 'nb-NO' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : t('scores.unknownDate');
}

function scoreSummary(entry, rank) {
  const row = scoreNode('div', 'score-summary');
  const medal = scoreNode('span', `score-medal medal-${Math.min(rank, 4)}`, String(rank));
  medal.setAttribute('aria-label', `${t('leaderboard.rank')} ${rank}`);
  const identity = scoreNode('div', 'score-identity');
  identity.append(scoreNode('span', 'score-date', formatScoreDate(entry.createdAt)), scoreNode('strong', 'score-player', entry.name || t('start.playerNamePlaceholder')));
  const duration = scoreNode('div', 'score-duration');
  duration.append(scoreNode('span', 'score-caption', t('leaderboard.timeSpent')), scoreNode('strong', '', formatDuration(entry.timeSpentMs)));
  const points = scoreNode('div', 'score-points');
  points.append(scoreNode('span', 'score-caption', t('leaderboard.score')), scoreNode('strong', '', String(entry.score)));
  row.append(medal, identity, duration, points);
  return row;
}

function renderLeaderboard() {
  const difficultyKey = state.screen === 'start' ? getSelectedDifficultyKey() : state.difficultyKey;
  const entries = loadLeaderboardStore()[difficultyKey] || [];
  leaderboardDifficultyEl.textContent = getDifficultyLabel(difficultyKey);
  leaderboardListEl.replaceChildren();
  leaderboardEmptyEl.textContent = t('leaderboard.empty');
  leaderboardEmptyEl.hidden = entries.length > 0;
  if (entries[0]) {
    const item = scoreNode('li', 'menu-best-score');
    item.append(scoreSummary(entries[0], 1));
    leaderboardListEl.append(item);
  }
  if (state.screen === 'scores') renderHighScores();
}

function renderHighScores() {
  const difficultyKey = scoresDifficulty.value;
  const entries = loadLeaderboardStore()[difficultyKey] || [];
  scoresList.replaceChildren();
  document.getElementById('scores-empty').hidden = entries.length > 0;
  let currentRank = 0;
  entries.forEach((entry, index) => {
    const isLatest = state.lastResult?.difficultyKey === difficultyKey && entry.id === state.lastResult.id;
    const item = scoreNode('li', 'score-entry' + (isLatest ? ' is-latest' : ''));
    const details = scoreNode('details', 'score-details');
    details.open = isLatest || (!state.lastResult && index === 0);
    const summary = scoreNode('summary', 'score-toggle');
    summary.append(scoreSummary(entry, index + 1));
    if (isLatest) {
      currentRank = index + 1;
      summary.querySelector('.score-identity').append(scoreNode('span', 'score-latest-badge', t('scores.latest')));
      item.setAttribute('aria-current', 'true');
    }
    const sections = scoreNode('div', 'score-breakdown');
    const groups = [
      ['typing', [['accuracy', 'leaderboard.accuracy', 'accuracy'], ['bestWordStreak', 'leaderboard.bestWord', 'flame'], ['bestCharStreak', 'leaderboard.bestChar', 'spark']]],
      ['abilities', [['tntUsed', 'leaderboard.tntUsed', 'tnt'], ['slowUsed', 'leaderboard.slowUsed', 'slow'], ['pauseUsed', 'leaderboard.pauseUsed', 'pause']]],
      ['lives', [['heartsLost', 'leaderboard.heartsLost', 'heart'], ['heartsBought', 'scores.heartsBought', 'heart']]],
      ['economy', [['goldEarned', 'leaderboard.goldEarned', 'score'], ['silverEarned', 'leaderboard.silverEarned', 'spark'], ['goldSpent', 'leaderboard.goldSpent', 'shop']]]
    ];
    groups.forEach(([name, metrics]) => {
      const group = scoreNode('section', 'score-stat-group');
      group.append(scoreNode('h3', '', t(`scores.${name}`)));
      const grid = scoreNode('dl', 'score-stat-grid');
      metrics.forEach(([key, label, icon]) => {
        const metric = scoreNode('div', 'score-stat');
        const art = scoreNode('span', `score-stat-icon stat-${icon}`);
        art.setAttribute('aria-hidden', 'true');
        const value = entry[key] == null ? '—' : String(entry[key]) + (key === 'accuracy' ? '%' : '');
        metric.append(art, scoreNode('dt', '', t(label)), scoreNode('dd', '', value));
        grid.append(metric);
      });
      group.append(grid);
      sections.append(group);
    });
    details.append(summary, sections);
    item.append(details);
    scoresList.append(item);
  });
  if (currentRank) {
    const entry = entries[currentRank - 1];
    leaderboardResultEl.textContent = t('scores.roundResult', { name: entry.name, score: entry.score, rank: currentRank }) + (state.scoreSaved ? '' : ` · ${t('scores.sessionOnly')}`);
  } else {
    leaderboardResultEl.textContent = t('scores.browse');
  }
}

function showHighScores(updateRoute = true) {
  scoresDifficulty.value = state.difficultyKey;
  setScreen('scores');
  renderHighScores();
  if (updateRoute && location.hash !== '#high-scores') history.pushState(null, '', '#high-scores');
  document.getElementById('high-score-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    if (state.screen !== 'scores') return;
    const current = scoresList.querySelector('.is-latest');
    if (current) {
      current.querySelector('summary').focus({ preventScroll: true });
      current.scrollIntoView({ block: 'start' });
    }
  });
}

function setScreen(name) {
  state.screen = name;
  startScreen.classList.toggle('active', name === 'start');
  gameScreen.classList.toggle('active', name === 'playing');
  highScoreScreen.classList.toggle('active', name === 'scores');
  document.body.classList.toggle('viewing-scores', name === 'scores');
  document.body.classList.toggle('game-playing', name === 'playing');

  if (name !== 'playing') {
    blurMobileTypingInput();
  }

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
  return selected ? selected.value : 'dark';
}

function getSelectedSoundEnabled() {
  const selected = soundInputs.find((input) => input.checked);
  return selected ? selected.value !== 'off' : true;
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
  if (mobileTypingInput) {
    mobileTypingInput.placeholder = t('hud.mobileTypePlaceholder');
  }
  renderLeaderboard();
  renderHud();
}

function applyTheme() {
  document.body.dataset.theme = state.themeKey;
}

function persistSoundPreference() {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, state.soundEnabled ? 'on' : 'off');
  } catch {
    // Ignore storage issues and keep the in-memory preference.
  }
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
    case 'unavailable':
      playTone({ type: 'square', frequency: 180, endFrequency: 115, gain: 0.035, attack: 0.005, release: 0.12 });
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
  heartsEl.setAttribute('aria-label', `${t('hud.hearts')}: ${state.lives}`);

  const heartSummary = document.createElement('span');
  heartSummary.className = 'heart-summary';
  heartSummary.textContent = '\u2665';

  const heartTotal = document.createElement('strong');
  heartTotal.className = 'heart-total';
  heartTotal.textContent = String(state.lives);
  heartSummary.appendChild(heartTotal);
  heartsEl.appendChild(heartSummary);

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

  actionButtons.forEach((button) => {
    const slot = Number(button.dataset.slot);
    const command = COMMANDS[slot];
    const isActive = (slot === 2 && state.slowTimer > 0) || (slot === 3 && state.pauseTimer > 0);
    const isUnavailable = command.inventoryKey && state.inventory[command.inventoryKey] <= 0;
    button.classList.toggle('active', isActive);
    button.classList.toggle('is-unavailable', isUnavailable);
    button.disabled = isUnavailable;
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderShop() {
  shopOverlay.classList.toggle('active', state.shopOpen);
  shopOverlay.setAttribute('aria-hidden', String(!state.shopOpen));
  shopOwnedEls.forEach((element) => {
    const itemKey = element.dataset.shopOwned;
    element.textContent = String(itemKey === 'heart' ? state.lives : state.inventory[itemKey]);
  });
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
  mobileGoldEl.textContent = String(state.wordPoints);
  wordPointsEl.textContent = String(state.wordPoints);
  charPointsEl.textContent = String(state.charPoints);
  shopWordPointsEl.textContent = String(state.wordPoints);
  shopCharPointsEl.textContent = String(state.charPoints);
  typedDisplayEl.textContent = state.typedText || '-';
  syncMobileTypingInput();
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
  state.heartsBought = 0;
  state.lastResult = null;
  state.tntUsed = 0;
  state.slowUsed = 0;
  state.pauseUsed = 0;
  state.goldEarned = 0;
  state.silverEarned = 0;
  state.goldSpent = 0;
  state.inventory = { tnt: 1, slow: 1, pause: 1 };
  wordLayer.innerHTML = '';
  renderHud();
}

function startGame() {
  if (state.screen === 'scores') {
    state.difficultyKey = scoresDifficulty.value;
    syncStartInputs();
    persistSettings();
    history.replaceState(null, '', location.pathname + location.search);
  }
  ensureAudioReady();

  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  if (state.screen === 'start') {
    state.difficultyKey = getSelectedDifficultyKey();
    state.languageKey = getSelectedLanguageKey();
    state.themeKey = getSelectedThemeKey();
    state.soundEnabled = getSelectedSoundEnabled();
    persistSoundPreference();
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
  focusMobileTypingInput();
  state.loopId = window.requestAnimationFrame(gameLoop);
}

function returnToMainMenu(updateRoute = true) {
  if (updateRoute && location.hash) history.pushState(null, '', location.pathname + location.search);
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
  startButton.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function endGame() {
  if (state.screen !== 'playing') return;
  if (state.loopId) {
    window.cancelAnimationFrame(state.loopId);
    state.loopId = null;
  }

  state.shopOpen = false;
  state.leaderboardRank = saveLeaderboardEntry();
  playSoundEffect('gameOver');
  renderHud();
  renderLeaderboard();
  showHighScores();
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

  // Keep an independent shuffled bag for each language across rounds.
  // Refill only after every word has had a turn; never mutate the source list.
  const languageKey = state.languageKey === 'en' ? 'en' : 'no';
  const bag = state.wordBags[languageKey];
  if (bag.length === 0) {
    bag.push(...new Set(wordList));
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  return bag.pop();
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
  blurMobileTypingInput();
  state.shopOpen = true;
  state.typedText = '';
  updateWordHighlights();
  renderHud();
}

function closeShop() {
  state.shopOpen = false;
  renderHud();
  focusMobileTypingInput();
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
    playSoundEffect('unavailable');
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
    state.heartsBought += 1;
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

function isAllowedCharacter(character) {
  const allowedPattern = state.languageKey === 'en'
    ? /^[a-zA-Z]$/
    : /^[a-zA-Z\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]$/;

  return allowedPattern.test(character);
}

function removeTypedCharacters(count = 1) {
  if (state.typedText.length === 0) {
    return;
  }

  state.typedText = state.typedText.slice(0, Math.max(0, state.typedText.length - count));
  resetStreaks();
  showStatus(t('status.backspaceReset'), 'warn');
  renderHud();
  updateWordHighlights();
}

function handleTypedCharacter(character) {
  if (!isAllowedCharacter(character)) {
    return;
  }

  const nextTyped = normalizeInput(`${state.typedText}${character}`);
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

function handleNormalTyping(event) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    removeTypedCharacters();
    return;
  }

  if (event.key === 'Escape') {
    state.typedText = '';
    renderHud();
    updateWordHighlights();
    return;
  }

  if (event.key.length === 1) {
    handleTypedCharacter(event.key);
  }
}

function isMobileLayout() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

function shouldUseMobileTypingInput() {
  return Boolean(mobileTypingInput) && state.screen === 'playing' && !state.shopOpen && isMobileLayout();
}

function syncMobileTypingInput() {
  if (mobileTypingInput && mobileTypingInput.value !== state.typedText) {
    mobileTypingInput.value = state.typedText;
  }
}

function focusMobileTypingInput() {
  if (shouldUseMobileTypingInput()) {
    mobileTypingInput.focus({ preventScroll: true });
  }
}

function blurMobileTypingInput() {
  if (mobileTypingInput && document.activeElement === mobileTypingInput) {
    mobileTypingInput.blur();
  }
}

function handleMobileTypingInput(event) {
  if (!shouldUseMobileTypingInput() || event.isComposing) {
    return;
  }

  ensureAudioReady();

  if (event.inputType && event.inputType.startsWith('delete')) {
    const normalizedValue = normalizeInput(mobileTypingInput.value);
    const removedCount = Math.max(1, state.typedText.length - normalizedValue.length);
    removeTypedCharacters(removedCount);
    return;
  }

  const insertedText = event.data || '';
  if (insertedText) {
    Array.from(insertedText).forEach((character) => handleTypedCharacter(character));
  }

  syncMobileTypingInput();
}

function syncMobileViewportHeight() {
  const viewport = window.visualViewport;
  const height = viewport ? viewport.height : window.innerHeight;
  const root = document.documentElement;
  // iOS keeps the home-indicator inset when the keyboard covers it.
  // Only remove that inset when the visible viewport is substantially reduced.
  const keyboardOpen = Math.max(window.innerHeight, root.clientHeight) - height > 120;
  root.style.setProperty('--mobile-viewport-height', `${height}px`);
  root.style.setProperty('--mobile-viewport-top', `${viewport ? viewport.offsetTop : 0}px`);
  root.classList.toggle('keyboard-open', keyboardOpen);
}

function handleKeydown(event) {
  if (state.screen !== 'playing') {
    return;
  }

  if (event.target === mobileTypingInput) {
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
restartButton.addEventListener('click', startGame);
document.getElementById('scores-main-menu').addEventListener('click', () => returnToMainMenu());
document.getElementById('high-scores-link').addEventListener('click', (event) => {
  event.preventDefault();
  state.difficultyKey = getSelectedDifficultyKey();
  showHighScores();
});
scoresDifficulty.addEventListener('change', renderHighScores);
window.addEventListener('popstate', () => {
  if (state.loopId) cancelAnimationFrame(state.loopId);
  resetGame();
  if (location.hash === '#high-scores') showHighScores(false);
  else returnToMainMenu(false);
});
shopCloseButton.addEventListener('click', closeShop);
shopBackdrop.addEventListener('click', closeShop);
actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (state.screen === 'playing' && !state.shopOpen) {
      ensureAudioReady();
      const slot = Number(button.dataset.slot);
      applyAbility(slot);
      if (slot !== 4) {
        focusMobileTypingInput();
      }
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
soundInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (state.screen === 'start') {
      state.soundEnabled = getSelectedSoundEnabled();
      persistSoundPreference();
    }
  });
});
playerNameInput.addEventListener('input', () => {
  state.playerName = sanitizePlayerName(playerNameInput.value);
  persistPlayerName();
});
mobileTypingInput.addEventListener('input', handleMobileTypingInput);
window.addEventListener('keydown', handleKeydown);
window.addEventListener('resize', () => {
  state.words.forEach((word) => updateWordPosition(word));
  syncMobileViewportHeight();
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncMobileViewportHeight);
  window.visualViewport.addEventListener('scroll', syncMobileViewportHeight);
}

window.addEventListener('gesturestart', (event) => {
  if (isMobileLayout()) {
    event.preventDefault();
  }
});
window.addEventListener('touchstart', (event) => {
  if (isMobileLayout() && event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

setScreen('start');
syncStartInputs();
applyLanguage();
applyTheme();
syncMobileViewportHeight();

if (location.hash === "#high-scores") showHighScores(false);

