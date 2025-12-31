import {
  findMatchupForTeam,
  getLatestCompletedWeek,
  getMatchupMarginsForWeek,
} from './matchupHistory';
import type { StoredMatchup } from './matchupHistoryTypes';

describe('matchupHistory store', () => {
  it('normalizes names when building margins', () => {
    const sample: StoredMatchup[] = [
      {
        leagueId: 'league-a',
        season: 2025,
        week: 1,
        team: "Big Ol' TDs",
        opponent: 'Opponent',
        pointsFor: 100,
        pointsAgainst: 90,
        margin: 10,
        finished: true,
      },
    ];

    const margins = getMatchupMarginsForWeek(1, sample);
    expect(margins.get("Big Ol' TDs")).toBeDefined();
    expect(margins.get("big ol' tds")).toEqual(margins.get("Big Ol' TDs"));
  });

  it('finds matchups by week and falls back to earliest entry', () => {
    const sample: StoredMatchup[] = [
      {
        week: 1,
        team: 'Alpha',
        opponent: 'Beta',
        pointsFor: 100,
        pointsAgainst: 90,
        margin: 10,
        finished: true,
      },
      {
        week: 2,
        team: 'Gamma',
        opponent: 'Beta',
        pointsFor: 101,
        pointsAgainst: 110,
        margin: -9,
        finished: true,
      },
      {
        week: 1,
        team: 'Beta',
        opponent: 'Alpha',
        pointsFor: 90,
        pointsAgainst: 100,
        margin: -10,
        finished: true,
      },
      {
        week: 2,
        team: 'Beta',
        opponent: 'Gamma',
        pointsFor: 110,
        pointsAgainst: 101,
        margin: 9,
        finished: true,
      },
    ];

    expect(findMatchupForTeam('beta', { week: 1, matchups: sample })?.opponent).toBe('Alpha');
    expect(findMatchupForTeam('beta', { matchups: sample })?.week).toBe(1);
  });

  it('ignores unfinished weeks when determining latest completed week', () => {
    const base: StoredMatchup[] = [
      {
        week: 1,
        team: 'Alpha',
        opponent: 'Beta',
        pointsFor: 100,
        pointsAgainst: 90,
        margin: 10,
        finished: true,
      },
      {
        week: 1,
        team: 'Beta',
        opponent: 'Alpha',
        pointsFor: 90,
        pointsAgainst: 100,
        margin: -10,
        finished: true,
      },
      {
        week: 2,
        team: 'Gamma',
        opponent: 'Delta',
        pointsFor: 110,
        pointsAgainst: 105,
        margin: 5,
        finished: true,
      },
      {
        week: 2,
        team: 'Delta',
        opponent: 'Gamma',
        pointsFor: 105,
        pointsAgainst: 110,
        margin: -5,
        finished: true,
      },
      {
        week: 3,
        team: 'Alpha',
        opponent: 'Gamma',
        pointsFor: 95,
        pointsAgainst: 100,
        margin: -5,
        finished: false,
      },
      {
        week: 3,
        team: 'Gamma',
        opponent: 'Alpha',
        pointsFor: 100,
        pointsAgainst: 95,
        margin: 5,
        finished: false,
      },
    ];

    expect(getLatestCompletedWeek(base)).toBe(2);

    const completedWeek = base.map((matchup) =>
      matchup.week === 3 ? { ...matchup, finished: true } : matchup,
    );
    expect(getLatestCompletedWeek(completedWeek)).toBe(3);
  });
});
