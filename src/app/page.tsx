import {
  getLeagues,
  getFixturesByDate,
  getLiveScores,
  getStandingsBySeason,
  parseScores,
  getMatchStatus,
  getHomeTeam,
  getAwayTeam,
  LEAGUE_META,
} from "@/lib/sportmonks";
import type { Fixture, League, Standing } from "@/lib/types";
import Image from "next/image";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0];

  // Fetch data in parallel
  const [leagues, todayFixtures, liveFixtures, plStandings] = await Promise.all(
    [
      getLeagues(),
      getFixturesByDate(today),
      getLiveScores(),
      getStandingsBySeason(23614), // Premier League 2025/26
    ]
  );

  // Merge live fixtures with today's fixtures (live ones replace static ones)
  const liveIds = new Set(liveFixtures.map((f) => f.id));
  const mergedFixtures = [
    ...liveFixtures,
    ...todayFixtures.filter((f) => !liveIds.has(f.id)),
  ].sort(
    (a, b) =>
      new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
  );

  // Group fixtures by league
  const fixturesByLeague = mergedFixtures.reduce(
    (acc, fixture) => {
      const leagueId = fixture.league_id;
      if (!acc[leagueId]) acc[leagueId] = [];
      acc[leagueId].push(fixture);
      return acc;
    },
    {} as Record<number, Fixture[]>
  );

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        liveCount={liveFixtures.length}
        totalToday={mergedFixtures.length}
      />

      {/* Live Scores Ticker */}
      {liveFixtures.length > 0 && <LiveTicker fixtures={liveFixtures} />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content — Fixtures */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Today's Matches"
              subtitle={today}
              count={mergedFixtures.length}
            />

            {mergedFixtures.length === 0 ? (
              <NoMatchesCard />
            ) : (
              <div className="space-y-6">
                {Object.entries(fixturesByLeague).map(
                  ([leagueId, fixtures]) => (
                    <LeagueFixtureGroup
                      key={leagueId}
                      leagueId={Number(leagueId)}
                      fixtures={fixtures}
                      leagues={leagues}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Standings + Leagues */}
          <aside className="space-y-6">
            {/* Premier League Standings */}
            <StandingsWidget standings={plStandings} />

            {/* Browse Leagues */}
            <LeaguesWidget leagues={leagues} />

            {/* Predictions CTA */}
            <PredictionsCTA />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection({
  liveCount,
  totalToday,
}: {
  liveCount: number;
  totalToday: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-mg-border bg-mg-surface">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-[#00ff88]/[0.03] blur-[100px]" />
        <div className="absolute -right-[20%] -bottom-[40%] h-[80%] w-[60%] rounded-full bg-[#4488ff]/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Live badge */}
          {liveCount > 0 && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mg-red/30 bg-mg-red/10 px-4 py-1.5 text-sm font-semibold text-mg-red">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mg-red opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mg-red" />
              </span>
              {liveCount} {liveCount === 1 ? "Match" : "Matches"} Live Now
            </div>
          )}

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">The World&apos;s</span>
            <br />
            <span className="mg-gradient-text">Football Operating System</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-mg-text-muted sm:text-xl">
            Live scores, real-time stats, predictions, and the most passionate
            football community on Earth. Covering every match across{" "}
            <span className="text-white font-semibold">7 top leagues</span>.
          </p>

          {/* Stats bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <StatPill
              value={totalToday > 0 ? totalToday.toString() : "--"}
              label="Matches Today"
            />
            <StatPill value="7" label="Top Leagues" />
            <StatPill value="AI" label="Powered Analysis" />
            <StatPill value="Free" label="Forever" />
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/predictions"
              className="rounded-full bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-8 py-3.5 text-base font-bold text-black shadow-lg shadow-[#00ff88]/20 transition-all hover:shadow-xl hover:shadow-[#00ff88]/30"
            >
              Start Predicting — It&apos;s Free
            </a>
            <a
              href="#todays-matches"
              className="rounded-full border border-mg-border bg-mg-card px-8 py-3.5 text-base font-semibold text-mg-text transition-all hover:border-mg-accent hover:text-mg-accent"
            >
              View Live Scores
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-extrabold text-white sm:text-3xl">
        {value}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-mg-text-muted">
        {label}
      </span>
    </div>
  );
}

// ============================================================
// LIVE TICKER
// ============================================================
function LiveTicker({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="overflow-hidden border-b border-mg-border bg-mg-live/5">
      <div className="flex items-center">
        <div className="flex shrink-0 items-center gap-2 border-r border-mg-border bg-mg-red/10 px-4 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mg-red opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mg-red" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-mg-red">
            Live
          </span>
        </div>
        <div className="mg-ticker flex items-center gap-6 whitespace-nowrap px-4 py-2.5">
          {[...fixtures, ...fixtures].map((fixture, i) => {
            const home = getHomeTeam(fixture);
            const away = getAwayTeam(fixture);
            const scores = parseScores(fixture);
            const status = getMatchStatus(fixture);
            return (
              <a
                key={`${fixture.id}-${i}`}
                href={`/match/${fixture.id}`}
                className="inline-flex items-center gap-3 text-sm"
              >
                <span className="font-medium text-white">
                  {home?.short_code || "???"}
                </span>
                <span className="rounded bg-mg-card px-2 py-0.5 font-mono font-bold text-white">
                  {scores.home} - {scores.away}
                </span>
                <span className="font-medium text-white">
                  {away?.short_code || "???"}
                </span>
                <span className="text-xs font-semibold text-mg-red">
                  {status.displayText}
                </span>
                <span className="text-mg-border">|</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================
function SectionHeader({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count: number;
}) {
  return (
    <div id="todays-matches" className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
        <p className="mt-1 text-sm text-mg-text-muted">
          {subtitle} &middot; {count} {count === 1 ? "match" : "matches"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-mg-border bg-mg-card px-3 py-1.5 text-xs font-medium text-mg-text-muted hover:text-white">
          Yesterday
        </button>
        <button className="rounded-lg border border-mg-accent/30 bg-mg-accent/10 px-3 py-1.5 text-xs font-semibold text-mg-accent">
          Today
        </button>
        <button className="rounded-lg border border-mg-border bg-mg-card px-3 py-1.5 text-xs font-medium text-mg-text-muted hover:text-white">
          Tomorrow
        </button>
      </div>
    </div>
  );
}

// ============================================================
// LEAGUE FIXTURE GROUP
// ============================================================
function LeagueFixtureGroup({
  leagueId,
  fixtures,
  leagues,
}: {
  leagueId: number;
  fixtures: Fixture[];
  leagues: League[];
}) {
  const league =
    fixtures[0]?.league || leagues.find((l) => l.id === leagueId);
  const meta = LEAGUE_META[leagueId];

  return (
    <div className="mg-card overflow-hidden">
      {/* League Header */}
      <a
        href={`/league/${leagueId}`}
        className="flex items-center gap-3 border-b border-mg-border px-4 py-3 transition-colors hover:bg-mg-card-hover"
      >
        {league?.image_path && (
          <Image
            src={league.image_path}
            alt={league?.name || "League"}
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        )}
        <span className="text-sm font-bold text-white">
          {league?.name || "Unknown League"}
        </span>
        {league?.country && (
          <span className="text-xs text-mg-text-muted">
            {league.country.name}
          </span>
        )}
        <svg
          className="ml-auto h-4 w-4 text-mg-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>

      {/* Fixtures */}
      <div className="divide-y divide-mg-border">
        {fixtures.map((fixture) => (
          <FixtureRow key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FIXTURE ROW
// ============================================================
function FixtureRow({ fixture }: { fixture: Fixture }) {
  const home = getHomeTeam(fixture);
  const away = getAwayTeam(fixture);
  const scores = parseScores(fixture);
  const status = getMatchStatus(fixture);

  return (
    <a
      href={`/match/${fixture.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mg-card-hover"
    >
      {/* Status */}
      <div className="w-12 shrink-0 text-center">
        {status.isLive ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-mg-red">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mg-red opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mg-red" />
            </span>
            {status.displayText}
          </span>
        ) : status.isFinished ? (
          <span className="text-xs font-semibold text-mg-text-muted">FT</span>
        ) : (
          <span className="text-xs font-medium text-mg-text-muted">
            {status.displayText}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Home Team */}
        <div className="flex items-center gap-2">
          {home?.image_path && (
            <Image
              src={home.image_path}
              alt={home.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          )}
          <span
            className={`truncate text-sm font-semibold ${home?.meta?.winner ? "text-white" : "text-mg-text"}`}
          >
            {home?.name || "TBD"}
          </span>
        </div>
        {/* Away Team */}
        <div className="flex items-center gap-2">
          {away?.image_path && (
            <Image
              src={away.image_path}
              alt={away.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          )}
          <span
            className={`truncate text-sm font-semibold ${away?.meta?.winner ? "text-white" : "text-mg-text"}`}
          >
            {away?.name || "TBD"}
          </span>
        </div>
      </div>

      {/* Scores */}
      {(status.isLive || status.isFinished || status.isHalfTime) && (
        <div className="flex flex-col items-center gap-1.5">
          <span
            className={`w-7 rounded text-center font-mono text-sm font-bold ${status.isLive ? "text-white" : "text-mg-text"}`}
          >
            {scores.home}
          </span>
          <span
            className={`w-7 rounded text-center font-mono text-sm font-bold ${status.isLive ? "text-white" : "text-mg-text"}`}
          >
            {scores.away}
          </span>
        </div>
      )}

      {/* Predict button */}
      {status.isUpcoming && (
        <button
          className="shrink-0 rounded-lg border border-mg-accent/20 bg-mg-accent/5 px-3 py-1.5 text-xs font-bold text-mg-accent transition-all hover:bg-mg-accent/10"
          onClick={(e) => e.preventDefault()}
        >
          Predict
        </button>
      )}
    </a>
  );
}

// ============================================================
// NO MATCHES CARD
// ============================================================
function NoMatchesCard() {
  return (
    <div className="mg-card flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mg-surface">
        <svg
          className="h-8 w-8 text-mg-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white">No Matches Today</h3>
      <p className="mt-2 max-w-sm text-sm text-mg-text-muted">
        There are no scheduled matches for today. Check back tomorrow or browse
        the latest league standings below.
      </p>
    </div>
  );
}

// ============================================================
// STANDINGS WIDGET (Sidebar)
// ============================================================
function StandingsWidget({ standings }: { standings: Standing[] }) {
  const sorted = [...standings].sort((a, b) => a.position - b.position);
  const top10 = sorted.slice(0, 10);

  return (
    <div className="mg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-mg-border px-4 py-3">
        <h3 className="text-sm font-bold text-white">Premier League</h3>
        <a
          href="/league/8"
          className="text-xs font-medium text-mg-accent hover:underline"
        >
          Full Table
        </a>
      </div>
      <div className="divide-y divide-mg-border">
        {top10.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-2.5 px-4 py-2.5"
          >
            <span
              className={`w-5 text-center text-xs font-bold ${
                entry.position <= 4
                  ? "text-mg-blue"
                  : entry.position >= 18
                    ? "text-mg-red"
                    : "text-mg-text-muted"
              }`}
            >
              {entry.position}
            </span>
            {entry.participant?.image_path && (
              <Image
                src={entry.participant.image_path}
                alt={entry.participant.name}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            )}
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-mg-text">
              {entry.participant?.name || "Unknown"}
            </span>
            <span className="text-sm font-bold text-white">
              {entry.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LEAGUES WIDGET (Sidebar)
// ============================================================
function LeaguesWidget({ leagues }: { leagues: League[] }) {
  return (
    <div className="mg-card overflow-hidden">
      <div className="border-b border-mg-border px-4 py-3">
        <h3 className="text-sm font-bold text-white">Leagues</h3>
      </div>
      <div className="divide-y divide-mg-border">
        {leagues.map((league) => (
          <a
            key={league.id}
            href={`/league/${league.id}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mg-card-hover"
          >
            {league.image_path && (
              <Image
                src={league.image_path}
                alt={league.name}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-mg-text">
                {league.name}
              </p>
              <p className="text-xs text-mg-text-muted">
                {league.country?.name}
              </p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-mg-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PREDICTIONS CTA (Sidebar)
// ============================================================
function PredictionsCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-mg-accent/20 bg-gradient-to-br from-mg-accent/5 to-mg-blue/5 p-6">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-mg-accent/10 blur-2xl" />
      <div className="relative">
        <h3 className="text-lg font-bold text-white">
          Predict &amp; Win
        </h3>
        <p className="mt-2 text-sm text-mg-text-muted">
          Test your football knowledge. Predict match scores, earn XP, climb the
          leaderboard, and unlock exclusive badges.
        </p>
        <a
          href="/predictions"
          className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-6 py-2.5 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-[#00ff88]/20"
        >
          Start Predicting
        </a>
      </div>
    </div>
  );
}
