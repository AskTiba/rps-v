# Decisions Log

> Architecture, technology, and process decisions, including overridden disagreements
> and git conventions.

## Decision Records

| Date | Decision | Persona | Reasoning | Alternatives Considered | User Override? |
|---|---|---|---|---|---|
| 2026-06-10 | Bootstrap `.devpartner/` state files per Senior Dev Partner protocol | Staff Engineer / Process | Establish session continuity and audit trail before any work begins | — | No |
| 2026-06-10 | Flatten `rock-paper-scissors-master/rock-paper-scissors-master/` double nesting | Staff Engineer | Standard project hygiene; deep nesting adds no value | Keep as-is | No |
| 2026-06-10 | Tech stack: Vanilla TypeScript + Vite + CSS custom properties + flat semantic classes | Staff Frontend Architect | Game is small enough that a framework adds overhead for no benefit. Custom properties map 1:1 with style guide. Vite gives HMR + TS support trivially. | React, Vue, Tailwind, BEM | No |
| 2026-06-10 | Mobile-first responsive workflow | Staff Frontend Architect | 375px base, layer up with `min-width` queries. Simpler-first avoids fighting the cascade. | Desktop-first | No |

## Git Commit Conventions for This Project

| Aspect | Convention |
|---|---|
| Commit message format | TBD (suggest Conventional Commits) |
| Default branch | main |
| Force-push allowed on | N/A (solo project until shared) |
| Amend policy notes | Follow Senior Dev Partner §8 rules |
