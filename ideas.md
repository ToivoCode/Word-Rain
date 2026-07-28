Ideas

New IDEA: Rolling ignites if a word is completed in a certain time?


Scoring system exploration

Goals

- Reward longer words
- Reward word streaks
- Reward character streaks
- Keep the formula easy to explain
- Avoid one rare extra-long word breaking the balance

Current draft

```text
((wordLength * 10) + (wordStreak * 10) + charStreak) * (accuracy / 100)
```

Example:

```text
((5 * 10) + (20 * 10) + 129) * 95 / 100
= (50 + 200 + 129) * 0.95
= 360.05
```

What the current game already does

- Score is awarded only when a word is completed
- `wordStreak` increases when a word is completed
- `charStreak` increases on every correct character
- Both streaks reset on:
  - wrong character
  - `Backspace`
  - a word hitting the bottom
- Accuracy is already tracked as `correctChars / attemptedChars`

Balance notes from the current word lists

- English words are mostly 4-8 characters and average about 5.6
- Norwegian words are mostly 3-6 characters and average about 5.0
- Norwegian also contains at least one very long outlier: `deoksyribonukleinsyre` with 21 characters

That means rewarding length is good, but pure linear length scoring can spike very hard on rare outliers.

Recommended plan

1. Keep score gain on word completion only

This keeps the game readable and matches the current flow. Character streak still matters, but it pays out when the player successfully closes a word.

2. Keep the 3 scoring pillars

- Length score: rewards harder words
- Word streak bonus: rewards clean chains of completed words
- Character streak bonus: rewards continuous accurate typing across words

3. Use accuracy as a multiplier, but soften the punishment

Using raw accuracy is good because it connects score to clean typing.
To avoid score feeling dead after a few mistakes, use a floor.

Suggested rule:

```text
accuracyMultiplier = max(0.60, accuracy / 100)
```

4. Soft-cap extreme word lengths

This still rewards long words, but stops the 21-character outlier from completely dominating the leaderboard.

Suggested rule:

```text
effectiveLength = min(wordLength, 8) + max(wordLength - 8, 0) * 0.5
```

Proposed formula

```js
const effectiveLength = Math.min(wordLength, 8) + Math.max(wordLength - 8, 0) * 0.5;
const lengthScore = Math.round(effectiveLength * 10);
const wordStreakBonus = wordStreak * 10;
const charStreakBonus = Math.min(charStreak, 50) + Math.floor(Math.max(charStreak - 50, 0) / 2);
const accuracyMultiplier = Math.max(0.60, accuracy / 100);

const scoreGain = Math.round(
  (lengthScore + wordStreakBonus + charStreakBonus) * accuracyMultiplier
);
```

Why this version is safer than the raw draft

- Longer words still matter a lot
- Word streak remains a major reward source
- Character streak keeps growing, but not infinitely at full speed
- Accuracy still matters on every score event
- Rare extra-long words feel special without blowing up the scoring curve

If we want to stay closer to the original draft, we can remove the soft caps later after playtesting.

Implementation plan

1. Add a `calculateScoreGain()` helper in `game.js`

Inputs:

- `wordLength`
- `wordStreak`
- `charStreak`
- `accuracy`

Output:

- rounded score gain for the completed word

2. Use the completed word length in `trySubmitTypedWord()`

The completed word is already available as `matchedWord`, so the length can come from `matchedWord.text.length`.

3. Replace the current formula

Current formula:

```js
const scoreGain = SCORE_PER_WORD + (state.wordStreak * 3) + Math.floor(state.charStreak / 5);
```

Replace it with the helper result.

4. Keep the HUD the same for now

The existing HUD already shows:

- score
- word streak
- char streak
- accuracy

That is enough for the first version.

5. Version the leaderboard when shipping this

Stored scores will no longer be comparable to the old formula.

Suggested change:

```text
LEADERBOARD_STORAGE_KEY = 'ordregn-leaderboard-v2'
```

6. Update README after implementation

The Score section should describe:

- length reward
- word streak reward
- char streak reward
- accuracy multiplier

Playtest checks

- Does a normal 5-letter word feel meaningfully better than a 3-letter word?
- Does `wordStreak * 10` grow too fast after 10-15 clean words?
- Does char streak dominate too much in long perfect runs?
- Does the accuracy multiplier feel fair after recovering from mistakes?
- Does the 21-character Norwegian outlier still feel exciting without being broken?

Good first test target

- Play 3-5 runs in English
- Play 3-5 runs in Norwegian
- Compare average end scores
- Compare whether leaderboard scores feel readable and competitive

Recommendation

Use the proposed formula first, then tune only these 3 knobs during playtesting:

- length multiplier
- word streak multiplier
- char streak soft cap

That keeps the system stable while making balancing easier.
