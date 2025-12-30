// src/components/bracket/KeeperBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const renderKeeperInfoRow = (label: string) => (
  <div className="flex-1 max-w-full overflow-hidden min-w-0 flex items-center justify-center">
    <div className="text-[0.65rem] md:text-sm font-semibold text-base-content/90 leading-tight text-center">
      {label}
    </div>
  </div>
);

const KEEPER_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Seeding',
    // Info cards explaining how Middling Bowl Round 2 is seeded.
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'keeper_round1_matchup1',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderKeeperInfoRow('Middling Semi 1: Champ R1 loser (3 vs 6) vs Seed 7')}
            {renderKeeperInfoRow('W → 5th/6th (picks 1.05/1.06), L → 7th/8th (1.07/1.08)')}
          </>
        ),
      },
      {
        id: 'keeper_round1_matchup2',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderKeeperInfoRow('Middling Semi 2: Champ R1 loser (4 vs 5) vs Seed 8')}
            {renderKeeperInfoRow('Same path: winners play for 5th/6th, losers for 7th/8th')}
          </>
        ),
      },
      {
        id: 'keeper_round1_spacer',
        slotId: null,
      },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    itemsContainerClassName: 'justify-between',
    items: [
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1' },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2' },
      {
        id: 'keeper_round2_spacer',
        slotId: null,
      },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'keeper_finals_spacer_top',
        slotId: null,
        ghostBodyClassName: 'h-[65px] md:h-[75px]',
      },
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th' },
      {
        id: 'keeper_finals_spacer',
        slotId: null,
        ghostBodyClassName: 'h-[85px] md:h-[100px]',
      },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th' },
    ],
  },
];

export const KeeperBracket: FC<KeeperBracketProps> = ({
  slots,
  teamsById,
  byeWeekPointsByTeamId,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={KEEPER_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      scoreOverridesByTeamId={byeWeekPointsByTeamId}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[300px] md:min-h-[360px]"
    />
  );
};
