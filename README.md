# Ordregn

Ordregn is a small browser typing game. Norwegian words fall from the top of the screen, and your job is to type them before they reach the ground.

The game is designed to be easy to run and easy to understand: open it through a small local static server and play directly in the browser.

## How The Game Works

Words appear over time and slowly fall downward.

You type letters on the keyboard to match active words on the screen.

When your current input matches a full active word:
- that word disappears
- your score increases
- your streaks can improve your reward

If a word reaches the bottom:
- you lose one heart
- your streaks reset

The round ends when all hearts are gone.

## Main Goal

The main goal is to survive as long as possible while building score through clean typing and smart use of abilities.

You are rewarded both for:
- finishing full words correctly
- maintaining long runs of correct characters without mistakes

## Lives

Lives are shown as hearts at the top of the screen.

- You start with 10 hearts.
- Each missed word removes 1 heart.
- If you lose all hearts, the game is over.
- Hearts can be restored from the shop, up to the maximum of 10.

## Typing

The `Typed` field shows your current input.

General typing behavior:
- Type letters normally to match falling words.
- Norwegian letters such as `æ`, `ø`, and `å` are supported.
- `Backspace` removes one typed character.
- `Escape` clears your current typed input.

If your typed input no longer matches the start of any active word:
- your input is cleared
- your streaks reset

## Streaks

Ordregn uses two different streak systems.

### Word Streak

Word Streak increases when you complete words cleanly in sequence.

It rewards consistency across whole words.

Word Streak resets when:
- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

### Char Streak

Char Streak increases for each correct character typed while your input remains valid.

It rewards precision and uninterrupted typing.

Char Streak resets when:
- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

## Score

Score is based on completed words, but streaks make successful words more valuable.

Each completed word gives:
- a base score reward
- an extra bonus from Word Streak
- an extra bonus from Char Streak

This means clean, mistake-free typing is worth much more than simply surviving.

## Gold And Silver

The game has two currencies:

- `🪙 Gold`
- `⬤ Silver`

### Gold

Gold is tied more closely to successful word completion and streak progress.

### Silver

Silver is tied more closely to clean character-by-character typing.

Both currencies are used in the shop.

## Abilities

At the bottom of the screen there is an action bar with four abilities:

- `1` TNT
- `2` Slow
- `3` Pause
- `4` Shop

You only need to press the number key. No extra typing is required.

You can also click the buttons in the action bar.

### TNT

TNT removes all active words from the screen immediately.

Use it when the board becomes too crowded.

### Slow

Slow reduces falling speed by 50% for 10 seconds.

This gives you more time to clear difficult clusters of words.

### Pause

Pause stops words from falling and stops new words from spawning for 10 seconds.

Important:
- you can still type and clear words during Pause
- this makes Pause a catch-up tool rather than a full stop

### Shop

Shop opens the upgrade menu.

While the shop is open:
- gameplay is paused
- words do not move
- you cannot continue solving words until you close it

## Starting Ability Charges

At the beginning of a new game, you start with:

- 1 TNT charge
- 1 Slow charge
- 1 Pause charge

Additional charges can be bought in the shop.

## Shop

The shop lets you spend Gold or Silver on extra charges and recovery.

Available purchases:

- TNT charge
- Slow charge
- Pause charge
- 1 Heart

Current shop prices:

- TNT: `4 Gold` or `18 Silver`
- Slow: `3 Gold` or `14 Silver`
- Pause: `5 Gold` or `22 Silver`
- Heart: `2 Gold` or `10 Silver`

If your hearts are already full, you cannot buy another heart.

## Difficulty

The game becomes harder over time.

Difficulty increases by making words spawn more frequently as the round continues.

That means:
- the screen gets busier the longer you survive
- abilities become more important later in a run

## Controls

### During Play

- Type letters to match words
- `Backspace` removes one character and resets streaks
- `Escape` clears your current typed input
- `1` uses TNT
- `2` uses Slow
- `3` uses Pause
- `4` opens Shop

### In The Shop

- Click purchase buttons to buy upgrades
- `Escape` closes the shop

## Running The Game

From the project folder, start a simple local static server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Files

- `index.html` contains the page structure
- `styles.css` contains the layout and visual styling
- `game.js` contains the gameplay logic
- `words-no.js` contains the Norwegian word list

## Tech Notes

The game uses:

- HTML
- CSS
- vanilla JavaScript

There are no frameworks, no backend, and no external dependencies.
