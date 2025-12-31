# League For All Seasons Playoffs

Playoff visualization and bracket UI for a Sleeper dynasty league.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- DaisyUI
- ESLint + Prettier (soon)

## Testing

- Unit/integration: `cd frontend && npm test` (Jest + RTL, jsdom). See `TESTING.md` for roadmap.
- E2E smoke: `cd frontend && npm run test:e2e` (Playwright). Configure base URL via `E2E_BASE_URL` in `.env` (root uses the deployed Vercel URL by default).

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Playoff seeding

- Playoffs begin Week 15 and conclude in Week 17.
- Six-team championship bracket; seeds 1 and 2 earn first-round byes.
- Seeds 1-3: Division winners, ordered by record (wins/losses/ties) > Points For.
- Seeds 4-5: Next two best records regardless of division > Points For.
- Seed 6: Highest Points For among teams not already seeded (ignores record/division).

## Bracket rules (routing)

- Champ Bowl

  - Seeds 1 and 2 get byes into Round 2.
  - Round 1: 4 vs 5 (top), and 3 vs 6 (bottom). Winners stay in Champ; losers drop into the Middling Bowl semifinals.
  - Round 2: 1 plays winner of 4/5; 2 plays winner of 3/6.
  - Finals: Round 2 winners play for 1st/2nd; Round 2 losers play to determine 3rd/4th. Champ finishers draft in reverse order (1.12–1.09).

- Middling Bowl

  - Round 2: two semifinals.
    - Semi 1: Champ R1 loser (3 vs 6) vs Seed 7.
    - Semi 2: Champ R1 loser (4 vs 5) vs Seed 8.
  - Round 3:
    - Winners play for 5th/6th (picks 1.05 and 1.06).
    - Losers play for 7th/8th (picks 1.07 and 1.08).

- Toilet Bowl (lottery bracket)
  - Seeds 9–12 form a four-team bracket.
  - Round 2: semifinals.
    - Semi 1: 9 vs 12.
    - Semi 2: 10 vs 11.
  - Round 3:
    - Winners play for 9th/10th and earn 15 and 8 lottery tickets respectively for the 1.01–1.04 draft picks.
    - Losers play for 11th/12th and earn 5 and 3 lottery tickets respectively.
