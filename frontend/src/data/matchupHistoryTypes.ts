export type StoredMatchup = {
  /** Sleeper league id this matchup belongs to (helps if we ever support multiple leagues). */
  leagueId?: string;
  /** Season year as reported by Sleeper (e.g. 2025). */
  season?: number;
  week: number;
  team: string;
  opponent: string;
  pointsFor: number;
  pointsAgainst: number;
  margin: number;
  finished: boolean;
};

export type MatchupHistory = StoredMatchup[];
