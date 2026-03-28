// ============================================================
// MATCHDAYGLOBAL — SportMonks API Client
// Server-side only — API key never exposed to client
// ============================================================

import type {
  ApiResponse,
  Fixture,
  League,
  Standing,
  Participant,
  ParsedScore,
  MatchStatus,
} from "./types";

const API_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || "";

async function fetchApi<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate: number = 60
): Promise<ApiResponse<T>> {
  const url = new URL(`${API_BASE}${endpoint}`);
  url.searchParams.set("api_token", API_TOKEN);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!res.ok) {
    console.error(`SportMonks API error: ${res.status} on ${endpoint}`);
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// ---- LEAGUES ----

export async function getLeagues(): Promise<League[]> {
  try {
    const res = await fetchApi<League[]>("/leagues", {
      include: "country",
    }, 3600);
    return res.data || [];
  } catch {
    return [];
  }
}

// ---- FIXTURES ----

export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  try {
    const res = await fetchApi<Fixture[]>(`/fixtures/date/${date}`, {
      include: "participants;scores;league;state",
      per_page: "50",
    }, 30);
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getLiveScores(): Promise<Fixture[]> {
  try {
    const res = await fetchApi<Fixture[]>("/livescores/inplay", {
      include: "participants;scores;league;state;events",
    }, 15);
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getFixtureById(id: number): Promise<Fixture | null> {
  try {
    const res = await fetchApi<Fixture>(`/fixtures/${id}`, {
      include: "participants;scores;league;state;events.type;events.player;statistics.type;venue",
    }, 30);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getFixturesByLeagueAndSeason(
  seasonId: number
): Promise<Fixture[]> {
  try {
    const res = await fetchApi<Fixture[]>(`/fixtures`, {
      include: "participants;scores;state",
      "filters": `fixtureSeasons:${seasonId}`,
      per_page: "50",
      order: "starting_at",
    }, 300);
    return res.data || [];
  } catch {
    return [];
  }
}

// ---- STANDINGS ----

export async function getStandingsBySeason(
  seasonId: number
): Promise<Standing[]> {
  try {
    const res = await fetchApi<Standing[]>(
      `/standings/seasons/${seasonId}`,
      { include: "participant" },
      300
    );
    return res.data || [];
  } catch {
    return [];
  }
}

// ---- SEASONS ----

export async function getCurrentSeasonByLeague(
  leagueId: number
): Promise<number | null> {
  try {
    const res = await fetchApi<League>(`/leagues/${leagueId}`, {
      include: "currentseason",
    }, 86400);
    return res.data?.currentseason?.id || null;
  } catch {
    return null;
  }
}

// ---- HELPERS ----

export function parseScores(fixture: Fixture): ParsedScore {
  const scores = fixture.scores || [];
  let home = 0;
  let away = 0;

  for (const score of scores) {
    if (score.description === "CURRENT") {
      if (score.score.participant === "home") {
        home = score.score.goals;
      } else {
        away = score.score.goals;
      }
    }
  }

  return { home, away };
}

export function getMatchStatus(fixture: Fixture): MatchStatus {
  const state = fixture.state;
  if (!state) {
    return {
      isLive: false,
      isFinished: false,
      isUpcoming: true,
      isHalfTime: false,
      displayText: formatTime(fixture.starting_at),
    };
  }

  const liveStates = ["1H", "2H", "ET", "LIVE", "PEN_LIVE", "BREAK", "EXTRA_TIME_BREAK"];
  const finishedStates = ["FT", "AET", "FT_PEN"];
  const halfTimeStates = ["HT"];

  const isLive = liveStates.includes(state.short_name);
  const isFinished = finishedStates.includes(state.short_name);
  const isHalfTime = halfTimeStates.includes(state.short_name);

  let displayText = state.short_name;
  if (isLive) displayText = state.short_name;
  else if (isFinished) displayText = "FT";
  else if (isHalfTime) displayText = "HT";
  else if (state.short_name === "NS") displayText = formatTime(fixture.starting_at);
  else displayText = state.short_name;

  return { isLive, isFinished, isUpcoming: !isLive && !isFinished && !isHalfTime, isHalfTime, displayText };
}

export function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

export function getHomeTeam(fixture: Fixture): Participant | undefined {
  return fixture.participants?.find((p) => p.meta?.location === "home");
}

export function getAwayTeam(fixture: Fixture): Participant | undefined {
  return fixture.participants?.find((p) => p.meta?.location === "away");
}

// League metadata for our 7 leagues
export const LEAGUE_META: Record<number, { slug: string; gradient: string; seasonId: number }> = {
  8: { slug: "premier-league", gradient: "from-purple-600 to-pink-500", seasonId: 23614 },
  564: { slug: "la-liga", gradient: "from-orange-500 to-red-500", seasonId: 23746 },
  82: { slug: "bundesliga", gradient: "from-red-600 to-yellow-500", seasonId: 23690 },
  384: { slug: "serie-a", gradient: "from-blue-600 to-cyan-400", seasonId: 23758 },
  301: { slug: "ligue-1", gradient: "from-blue-500 to-green-400", seasonId: 23682 },
  72: { slug: "eredivisie", gradient: "from-orange-500 to-amber-400", seasonId: 23672 },
  462: { slug: "liga-portugal", gradient: "from-green-600 to-red-500", seasonId: 23735 },
};
