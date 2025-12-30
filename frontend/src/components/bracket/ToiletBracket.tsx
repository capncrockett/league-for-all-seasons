// src/components/bracket/ToiletBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ToiletBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const renderToiletInfoRow = (label: string) => (
  <div className="flex-1 max-w-full overflow-hidden min-w-0 flex items-center justify-center">
    <div className="text-[0.65rem] md:text-sm font-semibold text-base-content/90 leading-tight text-center">
      {label}
    </div>
  </div>
);

const TOILET_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Seeding',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'toilet_round1_info1',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderToiletInfoRow('Seeds: Toilet Semi 1 (9 vs 12) → card to the right')}
          </>
        ),
      },
      {
        id: 'toilet_round1_info2',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderToiletInfoRow('Seeds: Toilet Semi 2 (10 vs 11) → card to the right')}
          </>
        ),
      },
      {
        id: 'toilet_round1_spacer',
        slotId: null,
      },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    itemsContainerClassName: 'justify-between',
    items: [
      { id: 'toilet_r2_g1', slotId: 'toilet_r2_g1' },
      { id: 'toilet_r2_g2', slotId: 'toilet_r2_g2' },
      {
        id: 'toilet_round2_spacer',
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
        id: 'toilet_finals_spacer_top',
        slotId: null,
        ghostBodyClassName: 'h-[65px] md:h-[75px]',
      },
      { id: 'toilet_finals', slotId: 'toilet_finals' },
      {
        id: 'toilet_finals_spacer',
        slotId: null,
        ghostBodyClassName: 'h-[85px] md:h-[100px]',
      },
      { id: 'toilet_9th_10th', slotId: 'toilet_9th_10th' },
    ],
  },
];

export const ToiletBracket: FC<ToiletBracketProps> = ({
  slots,
  teamsById,
  byeWeekPointsByTeamId,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={TOILET_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      scoreOverridesByTeamId={byeWeekPointsByTeamId}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[300px] md:min-h-[360px]"
    />
  );
};
