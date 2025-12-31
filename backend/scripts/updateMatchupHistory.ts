import {
  getLeague,
  getLeagueMatchupsForWeek,
  getLeagueRosters,
  getLeagueUsers,
  type SleeperMatchup,
  type SleeperRoster,
  type SleeperUser,
} from '../../frontend/src/api/sleeper.ts';
import {
  getMatchupStore,
  type MatchupHistoryStore,
  type StoreConfig,
} from '../matchupHistoryStore.ts';
import type { StoredMatchup } from '../../frontend/src/data/matchupHistoryTypes';

const DEFAULT_LEAGUE_ID = '1225292474453336064';

type CliMode = 'explicit' | 'regular' | 'playoffs';

type CliOptions = {
  weeks: number[];
  leagueId: string;
  markFinished: boolean;
  mode: CliMode;
  allSeasons: boolean;
};

const round = (value: number): number => Number(value.toFixed(2));

function parseArgs(): CliOptions {
  let weeks: number[] = [];
  let leagueId = DEFAULT_LEAGUE_ID;
  let markFinished = true;
  let mode: CliMode = 'explicit';
  let allSeasons = false;

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--week=')) {
      weeks.push(Number(arg.split('=')[1]));
    } else if (arg.startsWith('--weeks=')) {
      weeks = weeks.concat(
        arg
          .split('=')[1]
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => !Number.isNaN(value)),
      );
    } else if (arg.startsWith('--range=')) {
      const [start, end] = arg
        .split('=')[1]
        .split('-')
        .map((value) => Number(value.trim()));
      if (!Number.isNaN(start) && !Number.isNaN(end) && start > 0 && end >= start) {
        for (let week = start; week <= end; week += 1) {
          weeks.push(week);
        }
      }
    } else if (arg === '--finished=false' || arg === '--unfinished') {
      markFinished = false;
    } else if (arg.startsWith('--league=')) {
      leagueId = arg.split('=')[1];
    } else if (arg === '--playoffs-only') {
      mode = 'playoffs';
    } else if (arg === '--regular-season-only' || arg === '--regular-only') {
      mode = 'regular';
    } else if (arg === '--all-seasons') {
      allSeasons = true;
    }
  });

  const uniqueWeeks = Array.from(new Set(weeks)).filter((week) => week > 0);
  uniqueWeeks.sort((a, b) => a - b);

  if (mode === 'explicit' && !allSeasons) {
    if (uniqueWeeks.length === 0 || uniqueWeeks.some((week) => Number.isNaN(week))) {
      throw new Error(
        'Pass target weeks with --week={number}, --weeks=1,2,3, --range=start-end, or use --playoffs-only/--regular-season-only',
      );
    }
  }

  return { weeks: uniqueWeeks, leagueId, markFinished, mode, allSeasons };
}

function rosterIdToTeamName(users: SleeperUser[], rosters: SleeperRoster[]): Map<number, string> {
  const userNameById = new Map<string, string>();
  users.forEach((user) => {
    const teamName = user.metadata?.team_name || user.display_name || user.username;
    if (teamName) userNameById.set(user.user_id, teamName);
  });

  const map = new Map<number, string>();
  rosters.forEach((roster) => {
    const name =
      userNameById.get(roster.owner_id) ?? `Roster ${roster.roster_id.toString()}`;
    map.set(roster.roster_id, name);
  });
  return map;
}

const scoreFor = (matchup: SleeperMatchup): number =>
  round(typeof matchup.custom_points === 'number' ? matchup.custom_points : matchup.points);

const resolveTeamName = (nameMap: Map<number, string>, rosterId: number): string => {
  const found = nameMap.get(rosterId);
  return found !== undefined ? found : `Roster ${rosterId.toString()}`;
};

function buildMatchups(
  week: number,
  matchups: SleeperMatchup[],
  nameMap: Map<number, string>,
  finished: boolean,
  leagueId: string,
  season: number | null,
): StoredMatchup[] {
  const groups = new Map<number, SleeperMatchup[]>();
  matchups.forEach((matchup) => {
    const current = groups.get(matchup.matchup_id) ?? [];
    current.push(matchup);
    groups.set(matchup.matchup_id, current);
  });

  const entries: StoredMatchup[] = [];

  for (const [matchupId, games] of groups.entries()) {
    if (games.length !== 2) {
      const idLabel = matchupId != null ? String(matchupId) : 'unknown';
      console.warn(
        `Skipping matchup ${idLabel} (expected 2 rosters, found ${String(games.length)})`,
      );
      continue;
    }

    const [a, b] = games;
    const pointsA = scoreFor(a);
    const pointsB = scoreFor(b);
    const teamA = resolveTeamName(nameMap, a.roster_id);
    const teamB = resolveTeamName(nameMap, b.roster_id);

    entries.push({
      leagueId,
      season: season ?? undefined,
      week,
      team: teamA,
      opponent: teamB,
      pointsFor: pointsA,
      pointsAgainst: pointsB,
      margin: round(pointsA - pointsB),
      finished,
    });
    entries.push({
      leagueId,
      season: season ?? undefined,
      week,
      team: teamB,
      opponent: teamA,
      pointsFor: pointsB,
      pointsAgainst: pointsA,
      margin: round(pointsB - pointsA),
      finished,
    });
  }

  return entries;
}

async function fetchSeasonForLeague(
  store: MatchupHistoryStore,
  baseOptions: CliOptions,
  leagueId: string,
): Promise<{ written: number; weeks: number[] }> {
  const [league, users, rosters] = await Promise.all([
    getLeague(leagueId),
    getLeagueUsers(leagueId),
    getLeagueRosters(leagueId),
  ]);

  const seasonNumber =
    typeof league.season === 'string' ? Number.parseInt(league.season, 10) : league.season ?? null;

  const nameMap = rosterIdToTeamName(users, rosters);

  // Determine target weeks. If none were passed explicitly, derive them from the league
  // settings based on the requested mode.
  let targetWeeks = baseOptions.weeks;
  if (targetWeeks.length === 0) {
    const playoffStartRaw = (league.settings as { playoff_week_start?: unknown }).playoff_week_start;
    const playoffStart =
      typeof playoffStartRaw === 'number' && playoffStartRaw > 0 ? playoffStartRaw : 15;

    if (baseOptions.mode === 'regular') {
      const end = Math.max(1, playoffStart - 1);
      targetWeeks = Array.from({ length: end }, (_v, idx) => idx + 1);
    } else if (baseOptions.mode === 'playoffs') {
      const candidates = [playoffStart, playoffStart + 1, playoffStart + 2];
      targetWeeks = candidates.filter((w) => Number.isFinite(w) && w > 0 && w <= 18);
    } else {
      // Fallback: all NFL weeks 1–18
      targetWeeks = Array.from({ length: 18 }, (_v, idx) => idx + 1);
    }
  }

  console.log(
    `Fetching Sleeper matchups for league ${leagueId} (season ${
      seasonNumber ?? 'unknown'
    }) week(s): ${targetWeeks.join(', ')}...`,
  );

  let totalWritten = 0;
  const touchedWeeks = new Set<number>();

  for (const week of targetWeeks) {
    const matchups = await getLeagueMatchupsForWeek(leagueId, week);
    const entries = buildMatchups(
      week,
      matchups,
      nameMap,
      baseOptions.markFinished,
      leagueId,
      seasonNumber,
    );
    if (entries.length === 0) {
      console.warn(`No matchup entries created for week ${week.toString()}; skipping write.`);
      continue;
    }

    const updated = await store.appendWeek(week, entries);
    touchedWeeks.add(week);
    totalWritten += entries.length;
    const weeks = Array.from(new Set(updated.map((m) => m.week))).sort((a, b) => a - b);
    console.log(
      `Wrote ${entries.length.toString()} rows for week ${week.toString()} to ${store.describe()}`,
    );
    console.log(`Store now covers weeks: ${weeks.join(', ')}`);
  }

  const touchedWeekList = Array.from(touchedWeeks).sort((a, b) => a - b);
  if (touchedWeekList.length > 0) {
    console.log(
      `Completed update for league ${leagueId} (season ${
        seasonNumber ?? 'unknown'
      }) weeks [${touchedWeekList.join(', ')}]; total rows written: ${totalWritten.toString()}`,
    );
  }

  return { written: totalWritten, weeks: touchedWeekList };
}

async function main(storeConfig: StoreConfig = {}) {
  const options = parseArgs();

  const store: MatchupHistoryStore = await getMatchupStore(storeConfig);
  console.log(`Using matchup store: ${store.describe()}`);

  if (options.allSeasons) {
    // Walk the previous_league_id chain backward to fetch all historical seasons.
    const visitedLeagueIds = new Set<string>();
    let currentLeagueId: string | undefined = options.leagueId;
    let depth = 0;
    let grandTotal = 0;

    while (currentLeagueId && !visitedLeagueIds.has(currentLeagueId) && depth < 32) {
      visitedLeagueIds.add(currentLeagueId);
      depth += 1;

      const { written, weeks } = await fetchSeasonForLeague(store, options, currentLeagueId);
      grandTotal += written;

      const league = await getLeague(currentLeagueId);
      const prevId = league.previous_league_id;
      if (!prevId) break;
      currentLeagueId = prevId;
      console.log(`Discovered previous league id ${prevId}; continuing traversal...`);
    }

    console.log(
      `All-seasons update complete. Visited ${visitedLeagueIds.size.toString()} league ids; total rows written: ${grandTotal.toString()}`,
    );
    return;
  }

  // Single-league mode (default): just fetch for the provided league id.
  await fetchSeasonForLeague(store, options, options.leagueId);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
