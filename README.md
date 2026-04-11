# Ordregn

Ordregn is a small browser typing game. Words fall from the top of the screen, and your job is to type them before they hit the ground.

The game is designed to be easy to run and easy to understand: open it through a local static server and play directly in the browser.

## Run Locally

Open the game from a static web server, for example:
- `python -m http.server 8000`

Then open `http://localhost:8000` and start playing.

## How The Game Works

Words appear over time and slowly fall downward.

Type letters on the keyboard to match active words on the screen.

When your current input matches a full active word:
- the word disappears
- your score increases
- your streaks can improve your reward
- you earn 1 Gold

If a word reaches the bottom:
- you lose one heart
- your streaks reset

The round ends when all hearts are gone.

## Game Options

Before starting, choose:

- Language: Norwegian or English
- Difficulty: Adults, Kids, or Small Kids

Difficulty changes the falling speed:

- Adults: normal speed
- Kids: 50% speed
- Small Kids: 25% speed

## Lives

Lives are shown as hearts at the top of the screen.

- You start with 10 hearts.
- Each missed word removes 1 heart.
- If you lose all hearts, the game is over.
- Hearts can be restored from the shop, up to a maximum of 10.

## Typing Controls

The `Typed` field shows your current input.

- Type letters to match falling words.
- Norwegian letters such as `æ`, `ø`, and `å` are supported.
- `Backspace` removes one typed character.
- `Escape` clears your current typed input.

If your typed input no longer matches the start of any active word:
- your input is cleared
- your streaks reset

## Streaks

Ordregn uses two streak systems.

### Word Streak

Increases when you complete words cleanly in sequence.

Resets when:
- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

### Char Streak

Increases for each correct character typed while your input remains valid.

Resets when:
- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

## Accuracy

Accuracy is shown as a percentage in the top HUD.

It is calculated from:
- correct typed characters
- total attempted typed characters

Correct letters improve accuracy. Wrong letters lower it.

Backspace and clearing input do not count as new attempts.

## Score

Score is based on completed words, but streaks make successful words more valuable.

Each completed word grants:
- a base score reward
- extra bonus from Word Streak
- extra bonus from Char Streak

Clean, mistake-free typing is worth much more than simply surviving.

## Gold and Silver

The game has two currencies:

- `Gold`
- `Silver`

### Gold

You earn `1 Gold` for every completed word.

Gold is used in the shop.

### Silver

You earn `1 Silver` for every correct typed character.

When Silver reaches `100`:
- Silver resets to `0`
- you automatically gain `1 Gold`

Silver is a secondary progress currency that slowly converts into Gold.

## Abilities

At the bottom of the screen there is an action bar with four options:

- `1` TNT
- `2` Slow
- `3` Pause
- `4` Shop

You can press the number key or click the buttons.

### TNT

Removes all active words from the screen immediately.

Use it when the board becomes too crowded.

### Slow

Halves falling speed for 10 seconds.

Use it to buy time on difficult word clusters.

### Pause

Stops word movement and spawning for 10 seconds.

You can still type and clear words during Pause, so it is a catch-up tool.

### Shop

Opens the upgrade menu and pauses the game.

While the shop is open:
- gameplay is paused
- words do not move
- you cannot continue solving words until you close it

## Starting Ability Charges

At the beginning of each game, you start with:

- 1 TNT charge
- 1 Slow charge
- 1 Pause charge

Additional charges can be bought in the shop.

## Shop

The shop lets you spend Gold on extra charges and recovery.

Available purchases:
- TNT charge
- Slow charge
- Pause charge
- 1 Heart

Current shop prices:
- TNT: 15 Gold
- Slow: 5 Gold
- Pause: 10 Gold
- Heart: 5 Gold

If your hearts are already full, you cannot buy another heart.

## Notes

The game currently supports Norwegian and English word sets and includes an easy mode for younger players.


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
