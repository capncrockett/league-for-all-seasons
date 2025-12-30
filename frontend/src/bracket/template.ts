// src/bracket/template.ts
import type { BracketSlot } from './types';

export const BRACKET_TEMPLATE: BracketSlot[] = [
  //
  // CHAMP BOWL
  //
  {
    id: 'champ_r1_g1',
    bracketId: 'champ',
    round: 'champ_round_1',
    label: 'Champ R1 G1 (4 vs 5)',
    positions: [{ seed: 4 }, { seed: 5 }],
  },
  {
    id: 'champ_r1_g2',
    bracketId: 'champ',
    round: 'champ_round_1',
    label: 'Champ R1 G2 (3 vs 6)',
    positions: [{ seed: 3 }, { seed: 6 }],
  },
  {
    id: 'champ_r2_g1',
    bracketId: 'champ',
    round: 'champ_round_2',
    label: 'Champ R2 G1 (1 vs winner R1 G1)',
    positions: [{ seed: 1 }, null],
  },
  {
    id: 'champ_r2_g2',
    bracketId: 'champ',
    round: 'champ_round_2',
    label: 'Champ R2 G2 (2 vs winner R1 G2)',
    positions: [{ seed: 2 }, null],
  },
  {
    id: 'champ_finals',
    bracketId: 'champ',
    round: 'champ_finals',
    label: 'Championship',
    positions: [null, null],
    rewardTitle: 'League Champion',
    rewardText: 'W = 1st (title + top payout, pick 1.12) | L = 2nd (payout, pick 1.11)',
  },
  {
    id: 'champ_3rd',
    bracketId: 'champ',
    round: 'champ_misc',
    label: '3rd Place Game',
    positions: [null, null],
    rewardTitle: '3rd / 4th',
    rewardText: 'W = 3rd (pick 1.10) | L = 4th (pick 1.09)',
  },

  //
  // KEEPER BOWL
  //
  {
    id: 'keeper_floater1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Middling info (reserved)',
    positions: [null, null],
  },
  {
    id: 'keeper_splashback1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Middling Semi 1 (Champ R1 loser vs 7)',
    // Position 0 is filled by Champ Round 1 loser; position 1 is static seed 7.
    positions: [null, { seed: 7 }],
  },
  {
    id: 'keeper_floater2',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Middling info (reserved)',
    positions: [null, null],
  },
  {
    id: 'keeper_splashback2',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Middling Semi 2 (Champ R1 loser vs 8)',
    // Position 0 is filled by Champ Round 1 loser; position 1 is static seed 8.
    positions: [null, { seed: 8 }],
  },
  {
    id: 'keeper_5th_6th',
    bracketId: 'keeper',
    round: 'keeper_misc',
    label: '5th / 6th Game',
    positions: [null, null],
    rewardTitle: 'Middling Champ',
    rewardText: 'W = 5th (pick 1.05) | L = 6th (pick 1.06)',
  },
  {
    id: 'keeper_7th_8th',
    bracketId: 'keeper',
    round: 'keeper_misc',
    label: '7th / 8th Game',
    positions: [null, null],
    rewardTitle: '7th / 8th',
    rewardText: 'W = 7th (pick 1.07) | L = 8th (pick 1.08)',
  },

  //
  // TOILET BOWL
  //
  {
    id: 'toilet_r1_g1',
    bracketId: 'toilet',
    round: 'toilet_round_1',
    label: 'Toilet R1 (seeding/info)',
    positions: [null, null],
  },
  {
    id: 'toilet_r1_g2',
    bracketId: 'toilet',
    round: 'toilet_round_1',
    label: 'Toilet R1 (seeding/info)',
    positions: [null, null],
  },
  {
    id: 'toilet_r2_g1',
    bracketId: 'toilet',
    round: 'toilet_round_2',
    label: 'Toilet Semi 1 (9 vs 12)',
    positions: [{ seed: 9 }, { seed: 12 }],
  },
  {
    id: 'toilet_r2_g2',
    bracketId: 'toilet',
    round: 'toilet_round_2',
    label: 'Toilet Semi 2 (10 vs 11)',
    positions: [{ seed: 10 }, { seed: 11 }],
  },
  {
    id: 'toilet_finals',
    bracketId: 'toilet',
    round: 'toilet_finals',
    label: 'Toilet Final (9th / 10th)',
    positions: [null, null],
    rewardTitle: 'Toilet Final',
    rewardText: 'W = 9th (15 lottery tickets for 1.01–1.04) | L = 10th (8 lottery tickets)',
  },
  {
    id: 'toilet_9th_10th',
    bracketId: 'toilet',
    round: 'toilet_misc',
    label: '11th / 12th Game',
    positions: [null, null],
    rewardTitle: 'Toilet Consolation',
    rewardText: 'W = 11th (5 lottery tickets) | L = 12th (3 lottery tickets)',
  },
];
