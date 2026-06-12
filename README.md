# Frontend Mentor — Rock, Paper, Scissors

This is a solution to the [Rock, Paper, Scissors challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rock-paper-scissors-game-pTgwgvgH). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Architecture & design decisions](#architecture--design-decisions)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- Play Rock, Paper, Scissors against the computer
- Play the bonus variant — Rock, Paper, Scissors, Lizard, Spock
- Toggle between game modes without losing state
- Maintain the score after refreshing the browser (persisted to `localStorage`)
- View the rules modal for both game modes
- See interactive hover and active states for all interactive elements
- Experience a responsive layout from 320px mobile through large desktop screens

### Screenshot

| Original mode — Pick phase (mobile) | Bonus mode — Pick phase (mobile) |
|-------------------------------------|-----------------------------------|
| ![](./assets/design/original/mobile-step-1.jpg) | ![](./assets/design/bonus/mobile-step-1-bonus.jpg) |

| Reveal phase (desktop) | Rules modal (desktop) |
|------------------------|----------------------|
| ![](./assets/design/original/desktop-step-3.jpg) | ![](./assets/design/original/desktop-rules-modal.jpg) |

### Links

- Solution URL: [Add your solution URL here](https://your-solution-url.com)
- Live Site URL: [Add your live site URL here](https://your-live-site-url.com)

## My process

### Built with

- **Semantic HTML5** — landmarks, ARIA roles, accessible modal dialog
- **CSS custom properties** — theme tokens, responsive scaling via `clamp()`, mode-specific overrides
- **Flexbox** — scoreboard layout, game board centering, reveal-phase positioning, modal structure
- **CSS `min()` / `max()` / `clamp()`** — fluid typography and sizing without media query breakpoints
- **Mobile-first responsive workflow** — base styles for 375px, progressive enhancement at 768px
- **Vanilla JavaScript (ES modules)** — game logic, DOM manipulation, event delegation, `localStorage` persistence
- **No frameworks, no build step** — the entire project is static HTML + CSS + JS

### Architecture & design decisions

**Dual-mode architecture:** The app supports two distinct game modes sharing a single render pipeline. A `MODES` configuration object drives everything — move sets, rules engines, background SVGs, logos, rules images, and `localStorage` keys. This isolates concerns: adding a new mode is a data change, not a logic change.

**Rules engine:** RPSLS uses an array-based lookup (`rules[player] = [beaten1, beaten2]`) compared to the original's single-beat mapping. The `getResult()` function handles both uniformly via `Array.includes()`, keeping the game logic mode-agnostic.

**Responsive circle sizing:** Game circles derive from a single `--circle-size` custom property. On desktop, `clamp(7.5rem, calc(30vh - 4rem), 16rem)` ties circle dimensions to viewport height — the circles grow on taller screens and shrink on shorter ones. The bonus mode reduces the floor and ceiling proportionally to fit 5 buttons instead of 3.

**Reveal-phase alignment:** Desktop reveal circles are visually offset via CSS `transform: translateX()` so their centers align with the scoreboard's left and right edges. The offset is computed dynamically from `100vw`, the scoreboard width (`min(50vw, 700px)`), and the current circle size — no JS layout measurement needed.

**Proportional gradient rings:** The white inner circle of each choice button uses `calc(100% - var(--circle-size) * 0.2)` — the gradient ring thickness scales with the circle size, maintaining consistent visual proportions across all breakpoints and both modes.

### What I learned

**CSS `clamp()` for fluid component sizing:** Tying `--circle-size` to viewport height with `clamp()` creates a responsive system where game elements scale naturally across device sizes. The formula `calc(30vh - 4rem)` ensures the circles grow at a controlled rate, while the `min`/`max` bounds prevent them from becoming unusably small or comically large.

```css
:root {
  --circle-size: clamp(7.5rem, calc(30vh - 4rem), 16rem);
}
```

**Dynamic button rendering from a data config:** Replacing hardcoded HTML buttons with JS-generated elements driven by a configuration object made the dual-mode toggle trivial. The `renderChoices()` function iterates the current mode's move array, creates buttons with the correct class, icon, and event listener — no conditional branches needed.

```js
function renderChoices() {
  const mode = MODES[currentMode];
  choicesEl.innerHTML = '';
  // SVG background + buttons generated from mode.moves
  for (const move of mode.moves) {
    const btn = document.createElement('button');
    btn.className = `choice ${CHOICE_CONFIG[move].className}`;
    // ...
  }
}
```

**CSS `min()` in `calc()` for layout math:** Using `min(50vw, 700px)` inside a `calc()` expression let me reference the scoreboard's capped width directly in the reveal-circle alignment formula — no media query forks needed for the 700px cap breakpoint.

```css
.reveal__column:first-child {
  transform: translateX(
    calc((100vw - 4rem - var(--reveal-circle-size) - min(50vw, 700px)) / 2)
  );
}
```

**`localStorage` key isolation per mode:** Each game mode uses its own storage key (`rps-score` / `rpsls-score`), preventing scores from colliding when the user toggles between modes. The `setupMode()` function handles key selection through the mode config.

### Continued development

- **Winner glow animation:** Adding the radial gradient ring animation around the winning circle (visible in the design's step-4 screenshots) would complete the visual polish.
- **Accessibility pass:** Testing with screen readers (NVDA, VoiceOver) to ensure the dynamic content updates (choice selection, result announcements) are properly announced via `aria-live` regions.
- **Touch device refinement:** Ensuring the choice buttons have adequate touch targets on small devices and that the mode toggle is easily tappable.
- **Keyboard navigation:** Full keyboard support for the entire game flow — Tab through choices, Enter to select, Escape to close modals.

### Useful resources

- **[CSS `min()`, `max()`, and `clamp()` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)** — Essential reference for fluid responsive sizing without media queries.
- **[ARIA Authoring Practices Guide — Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)** — Used to structure the rules modal with proper focus management and `aria-modal`.
- **[Frontend Mentor Style Guide](./style-guide.md)** — The project's color tokens, font specs, and layout breakpoints that drove the CSS custom property system.
- **[The Big Bang Theory — Rock Paper Scissors Lizard Spock](https://www.youtube.com/watch?v=iSHPVCBsnLw)** — The canonical explanation of the bonus game rules.

### AI Collaboration

This project was built in collaboration with **Claude 4 (via opencode)**, an AI coding assistant.

**How it was used:**
- **Architecture discussion:** The AI and I debated the dual-mode architecture — whether to use two separate button sets or a single dynamic renderer. The AI challenged the static-HTML approach and we settled on JS-driven rendering.
- **CSS responsive strategy:** The AI suggested `clamp()` for `--circle-size` and the proportional gradient ring formula (`calc(100% - var(--circle-size) * 0.2)`), which I hadn't considered.
- **Reveal circle alignment:** The AI derived the `translateX()` offset formula to align circle centers with scoreboard edges — I reviewed the math, identified a `:last-child` vs `:nth-child(2)` selector bug, and corrected it.
- **State management:** The AI proposed the `MODES` configuration object pattern, which kept the toggle logic clean and extensible.
- **Code review:** Every change was reviewed and verified — the AI did not write any code without my direction and approval.

**What worked well:** The AI's ability to explore edge cases (what happens at 320px? what if the scoreboard caps at 700px?) and suggest CSS techniques (`clamp()`, `min()` inside `calc()`) that I might not have reached for. The collaborative debate on positioning strategies led to a cleaner solution than either of us would have arrived at alone.

**What didn't:** The AI occasionally suggested overly complex solutions before I asked for simpler alternatives. Pushing back and asking "is there a simpler way?" consistently led to better outcomes.

## Author

- **Tibamwenda Anthony**
- Frontend Mentor — [@Tibson](https://www.frontendmentor.io/profile/Tibson)
- GitHub — [@Tibson](https://github.com/Tibson)

## Acknowledgments

Thanks to the Frontend Mentor community for the excellent challenge design and to the team at Anthropic for building the AI assistant that helped work through this project's architectural decisions.
