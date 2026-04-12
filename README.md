# Ordregn

Ordregn is a small browser typing game where words fall from the top of the screen and must be typed before they hit the ground.

It runs entirely in the browser and is meant for quick local play from a simple static server.

## Start Menu

Before each round, you can choose:

- Language: Norwegian or English
- Difficulty:
  - Adults = 100% speed
  - Kids = 50% speed
  - Small kids = 25% speed
- Theme:
  - Light = the original bright style
  - Dark = the darker modern style
- Player name

The player name is saved locally in the browser and used for the leaderboard.

## Goal

Words appear over time and fall downward.

Type a full active word exactly to remove it before it reaches the bottom. If a word hits the ground, you lose one heart.

The round ends when all hearts are gone.

## Hearts

- You start with 10 hearts.
- Each missed word removes 1 heart.
- Hearts are shown at the top of the screen.
- Hearts can be restored in the shop, up to a maximum of 10.

## Typing

The `Typed` field shows your current input.

- Type letters to match active words.
- `Backspace` removes one letter and resets both streaks.
- `Escape` clears your current input.
- Norwegian letters such as `æ`, `ø`, and `å` are supported when Norwegian is selected.

If your input no longer matches the beginning of any active word:

- the input is cleared
- both streaks reset

## Score

Completing a word gives points.

Each completed word uses:

- a base score value
- a bonus from Word Streak
- a bonus from Char Streak

Clean, consistent typing gives better scores than simply surviving.

## Streaks

### Word Streak

Word Streak counts how many words you complete in a row without breaking the flow.

It resets when:

- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

### Char Streak

Char Streak counts consecutive correct character inputs while your typing stays clean.

It resets when:

- you type a wrong character
- you use `Backspace`
- a word reaches the bottom

## Accuracy

Accuracy is shown as a percentage in the top HUD.

It is based on:

- correct typed characters
- total attempted typed characters

Correct letters improve accuracy. Wrong letters reduce it.

## Gold And Silver

The game has two currencies:

- `Gold`
- `Silver`

### Gold

- You earn `1 Gold` for each completed word.
- Gold is used in the shop.

### Silver

- You earn `1 Silver` for each correct typed character.
- When Silver reaches `100`, it automatically converts into `1 Gold`.
- After conversion, Silver resets to `0`.

Silver is passive progress. Gold is what you spend.

## Abilities

The action bar at the bottom has four options:

- `1` TNT
- `2` Slow
- `3` Pause
- `4` Shop

You can use the number keys or click the buttons.

### TNT

Deletes all active words on the screen.

### Slow

Reduces falling speed by 50% for 10 seconds.

### Pause

Stops spawning and falling for 10 seconds.

You can still type and clear words during Pause, so it works as a catch-up tool when the screen gets crowded.

### Shop

Opens the shop overlay and pauses the board while it is open.

While the shop is open:

- falling stops
- spawning stops
- you cannot keep solving words until you close it

## Starting Charges

Each new round starts with:

- 1 TNT charge
- 1 Slow charge
- 1 Pause charge

## Shop Prices

The shop uses Gold only.

Current prices:

- TNT: 15 Gold
- Pause: 10 Gold
- Slow: 5 Gold
- Heart: 5 Gold

If your hearts are already full, you cannot buy another heart.

## Sound

The game includes simple built-in sound effects for successful words, mistakes, heart loss, TNT, shop actions, and other important events.

Sound can be turned on or off from the action area.

## Leaderboard

Ordregn includes a browser-local leaderboard stored in `localStorage`.

Important rules:

- The leaderboard is separate for each difficulty level.
- Score is the main value and is used to sort the list.
- Higher scores appear above lower scores.
- The player name is stored with every result.

Each saved result also stores round statistics:

- best word streak
- best character streak
- accuracy
- hearts lost
- TNT used
- Slow used
- Pause used
- Gold earned
- Silver earned
- Gold spent
- time spent

The leaderboard shown on the start screen updates when you switch difficulty.

## Difficulty Ramp

The game becomes harder over time by spawning words more frequently.

The chosen difficulty level changes how fast the game pressure builds:

- Adults keeps the original pace
- Kids slows the game to half speed
- Small kids slows the game to one quarter speed

## Controls

### During Play

- Type letters to solve words
- `Backspace` removes one character and resets streaks
- `Escape` clears the current typed input
- `1` uses TNT
- `2` uses Slow
- `3` uses Pause
- `4` opens the Shop

### In The Shop

- Click buttons to buy charges or a heart
- `Escape` closes the shop

## Run Locally

From the project folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Files

- `index.html` contains the page structure
- `styles.css` contains the layout and themes
- `game.js` contains the gameplay logic, sound, and leaderboard handling
- `words-no.js` contains the Norwegian word list
- `words-en.js` contains the English word list

## Tech Notes

Ordregn uses plain:

- HTML
- CSS
- vanilla JavaScript

There are no frameworks, no backend, and no external dependencies.
