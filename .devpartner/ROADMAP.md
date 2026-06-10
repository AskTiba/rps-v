# Roadmap

## Vision

A polished, responsive Rock-Paper-Scissors game (with optional RPSLS bonus mode) that matches the Frontend Mentor design spec. Score persists across sessions via localStorage.

## Non-Functional Requirements

| Dimension | Target | Notes |
|---|---|---|
| Expected scale | Single user, local only | No backend |
| Latency budget | Animation < 300ms, no perceivable JS delay | Game logic is trivial |
| Uptime / reliability | 100% (static site, no dependencies) | |
| Concurrency expectations | 1 user | |
| Other constraints | Must work offline once loaded (no network needed) | All assets are local SVGs |

## Milestones

| Milestone | Status | Target | Notes |
|---|---|---|---|
| Project restructure & scaffold | In Progress | Session 1 | Flatten dirs, create src/assets, wire up HTML/CSS/JS |
| Original RPS game (step 1-4) | Not started | Session 2 | Core game loop, rules, UI |
| Bonus RPSLS game mode | Not started | Session 3 | Extended rules, pentagon layout |
| Score persistence (localStorage) | Not started | Session 2 | Secondary to core game |
| Responsive polish & animations | Not started | Session 3 | Match design mockups |
| Accessibility audit | Not started | Session 3 | ARIA, keyboard nav, screen reader |

## Tech Debt & Risk Register

| Date Identified | Item | Risk if Unaddressed | Deferred Because | Revisit When |
|---|---|---|---|---|

## Backlog (Unscheduled)

- Add unit tests for game logic functions
- Extract CSS custom properties into design tokens
- Add PWA manifest for offline play
