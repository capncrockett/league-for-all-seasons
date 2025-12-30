// src/bracket/routingRules.ts

import type { BracketRoutingRule } from './types';

/**
 * Structural routing between bracket slots.
 *
 * This does NOT compute winners/losers; it just says:
 * "When we know who won fromSlotId, put them in this target slot/index."
 */
export const ROUTING_RULES: BracketRoutingRule[] = [
  //
  // CHAMP BOWL
  //

  // Round 1 -> Round 2 + Middling bracket (dynasty)
  {
    fromSlotId: 'champ_r1_g1',
    // Winner plays in Champ R2 G1 (vs seed 1) as the bottom slot
    winnerGoesTo: { slotId: 'champ_r2_g1', positionIndex: 1 },
    // Loser drops into Middling Semi 1 (vs seed 7)
    loserGoesTo: { slotId: 'keeper_splashback1', positionIndex: 0 },
  },
  {
    fromSlotId: 'champ_r1_g2',
    // Winner plays in Champ R2 G2 (vs seed 2) as the bottom slot
    winnerGoesTo: { slotId: 'champ_r2_g2', positionIndex: 1 },
    // Loser drops into Middling Semi 2 (vs seed 8)
    loserGoesTo: { slotId: 'keeper_splashback2', positionIndex: 0 },
  },

  // Round 2 -> Finals + 3rd place
  {
    fromSlotId: 'champ_r2_g1',
    // Winners to Championship (left side)
    winnerGoesTo: { slotId: 'champ_finals', positionIndex: 0 },
    // Losers to 3rd place game (left side)
    loserGoesTo: { slotId: 'champ_3rd', positionIndex: 0 },
  },
  {
    fromSlotId: 'champ_r2_g2',
    // Winners to Championship (right side)
    winnerGoesTo: { slotId: 'champ_finals', positionIndex: 1 },
    // Losers to 3rd place game (right side)
    loserGoesTo: { slotId: 'champ_3rd', positionIndex: 1 },
  },

  //
  // TOILET BOWL (dynasty lottery bracket)
  //
  // Semifinals (9 vs 12, 10 vs 11) -> Final + Consolation
  {
    fromSlotId: 'toilet_r2_g1',
    // Winners move to Toilet Final (9th/10th)
    winnerGoesTo: { slotId: 'toilet_finals', positionIndex: 0 },
    // Losers play in 11th/12th game
    loserGoesTo: { slotId: 'toilet_9th_10th', positionIndex: 0 },
  },
  {
    fromSlotId: 'toilet_r2_g2',
    winnerGoesTo: { slotId: 'toilet_finals', positionIndex: 1 },
    loserGoesTo: { slotId: 'toilet_9th_10th', positionIndex: 1 },
  },
 
  //
  // MIDLING BOWL
  //
  // Middling semis -> 5th/6th and 7th/8th
  {
    fromSlotId: 'keeper_splashback1',
    winnerGoesTo: { slotId: 'keeper_5th_6th', positionIndex: 0 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 0 },
  },
  {
    fromSlotId: 'keeper_splashback2',
    winnerGoesTo: { slotId: 'keeper_5th_6th', positionIndex: 1 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 1 },
  },
];
