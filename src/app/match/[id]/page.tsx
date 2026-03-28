import {
  getFixtureById,
  parseScores,
  getMatchStatus,
  getHomeTeam,
  getAwayTeam,
  formatDate,
} from "@/lib/sportmonks";
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 30;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const fixture = await getFixtureById(Number(id));
  if (!fixture) return { title: "Match Not Found" };
  const home = getHomeTeam(fixture);
  const away = getAwayTeam(fixture);
  return {
    title: `${home?.name || "Home"} vs ${away?.name || "Away"} — Live Score & Stats`,
    description: `Follow ${home?.name} vs ${away?.name} live on MatchdayGlobal. Real-time score, events, statistics, and community.`,
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const fixture = await getFixtureById(Number(id));

  if (!fixture) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Match Not Found</h1>
          <p className="mt-2 text-mg-text-muted">
            This match doesn&apos;t exist or isn&apos;t available.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-mg-card px-6 py-2.5 text-sm font-semibold text-mg-accent hover:bg-mg-card-hover"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const home = getHomeTeam(fixture);
  const away = getAwayTeam(fixture);
  const scores = parseScores(fixture);
  const status = getMatchStatus(fixture);
  const events = fixture.events || [];

  // Sort events by minute
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  // Get statistics
  const stats = fixture.statistics || [];
  const homeStats = stats.filter(
    (s) => s.participant_id === home?.id
  );
  const awayStats = stats.filter(
    (s) => s.participant_id === away?.id
  );

  return (
    <div>
      {/* Match Hero */}
      <section className="relative overflow-hidden border-b border-mg-border bg-mg-surface">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-[#00ff88]/[0.02] blur-[100px]" />
          <div className="absolute -right-[20%] top-[20%] h-[60%] w-[40%] rounded-full bg-[#4488ff]/[0.02] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          {/* League + Date */}
          <div className="mb-8 flex items-center justify-center gap-3">
            {fixture.league?.image_path && (
              <Image
                src={fixture.league.image_path}
                alt={fixture.league.name}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-mg-text-muted">
              {fixture.league?.name}
            </span>
            <span className="text-mg-border">&middot;</span>
            <span className="text-sm text-mg-text-muted">
              {formatDate(fixture.starting_at)}
            </span>
          </div>

          {/* Scoreboard */}
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 text-center">
              {home?.image_path && (
                <Image
                  src={home.image_path}
                  alt={home.name}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px]"
                />
              )}
              <span className="max-w-[120px] text-sm font-bold text-white sm:text-base">
                {home?.name || "Home"}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2">
              {status.isLive && (
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mg-red opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-mg-red" />
                  </span>
                  <span className="text-xs font-bold uppercase text-mg-red">
                    Live
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-white sm:text-7xl">
                  {status.isUpcoming ? "-" : scores.home}
                </span>
                <span className="text-2xl font-light text-mg-text-muted sm:text-3xl">
                  :
                </span>
                <span className="text-5xl font-black text-white sm:text-7xl">
                  {status.isUpcoming ? "-" : scores.away}
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  status.isLive
                    ? "text-mg-red"
                    : status.isFinished
                      ? "text-mg-text-muted"
                      : "text-mg-accent"
                }`}
              >
                {status.displayText}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 text-center">
              {away?.image_path && (
                <Image
                  src={away.image_path}
                  alt={away.name}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px]"
                />
              )}
              <span className="max-w-[120px] text-sm font-bold text-white sm:text-base">
                {away?.name || "Away"}
              </span>
            </div>
          </div>

          {/* Prediction CTA */}
          {status.isUpcoming && (
            <div className="mt-8 flex justify-center">
              <button className="rounded-full bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-8 py-3 text-sm font-bold text-black shadow-lg shadow-[#00ff88]/20">
                Predict This Match
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Match Events Timeline */}
          <div className="mg-card overflow-hidden">
            <div className="border-b border-mg-border px-4 py-3">
              <h2 className="text-sm font-bold text-white">Match Events</h2>
            </div>
            {sortedEvents.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-mg-text-muted">
                {status.isUpcoming
                  ? "Events will appear here once the match starts."
                  : "No events recorded for this match."}
              </div>
            ) : (
              <div className="divide-y divide-mg-border">
                {sortedEvents.map((event) => {
                  const isHome = event.participant_id === home?.id;
                  const typeName =
                    event.type?.developer_name || event.type?.name || "";
                  const icon = getEventIcon(typeName);

                  return (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 px-4 py-3 ${isHome ? "" : "flex-row-reverse text-right"}`}
                    >
                      <div className="flex shrink-0 flex-col items-center">
                        <span className="text-xs font-bold text-mg-accent">
                          {event.minute}&apos;
                          {event.extra_minute
                            ? `+${event.extra_minute}`
                            : ""}
                        </span>
                      </div>
                      <span className="text-base">{icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {event.player_name || "Unknown Player"}
                        </p>
                        {event.related_player_name && (
                          <p className="text-xs text-mg-text-muted">
                            {event.info || "Assist:"}{" "}
                            {event.related_player_name}
                          </p>
                        )}
                        <p className="text-xs text-mg-text-muted">
                          {event.type?.name || typeName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Match Statistics */}
          <div className="mg-card overflow-hidden">
            <div className="border-b border-mg-border px-4 py-3">
              <h2 className="text-sm font-bold text-white">Statistics</h2>
            </div>
            {homeStats.length === 0 && awayStats.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-mg-text-muted">
                {status.isUpcoming
                  ? "Statistics will appear here once the match starts."
                  : "No statistics available for this match."}
              </div>
            ) : (
              <div className="divide-y divide-mg-border px-4">
                {getStatPairs(homeStats, awayStats).map((pair) => (
                  <StatBar
                    key={pair.label}
                    label={pair.label}
                    homeValue={pair.homeValue}
                    awayValue={pair.awayValue}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Community Section Placeholder */}
        <div className="mt-8 mg-card overflow-hidden">
          <div className="border-b border-mg-border px-4 py-3">
            <h2 className="text-sm font-bold text-white">Match Discussion</h2>
          </div>
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mg-accent/10">
              <svg className="h-6 w-6 text-mg-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white">
              Join the conversation
            </h3>
            <p className="mt-1 max-w-xs text-sm text-mg-text-muted">
              Sign up to discuss this match with fans from around the world.
            </p>
            <button className="mt-4 rounded-full bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-6 py-2 text-sm font-bold text-black">
              Join Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: get event icon
function getEventIcon(typeName: string): string {
  const lower = typeName.toLowerCase();
  if (lower.includes("goal")) return "\u26BD";
  if (lower.includes("yellowcard") || lower.includes("yellow_card")) return "\uD83D\uDFE8";
  if (lower.includes("redcard") || lower.includes("red_card")) return "\uD83D\uDFE5";
  if (lower.includes("substitution")) return "\uD83D\uDD04";
  if (lower.includes("var")) return "\uD83D\uDCFA";
  if (lower.includes("penalty")) return "\uD83C\uDFAF";
  return "\u2022";
}

// Helper: pair home/away stats
function getStatPairs(
  homeStats: { type_id: number; data: { value: number | string }; type?: { name: string } }[],
  awayStats: { type_id: number; data: { value: number | string }; type?: { name: string } }[]
) {
  const pairs: {
    label: string;
    homeValue: number;
    awayValue: number;
  }[] = [];

  const homeMap = new Map(homeStats.map((s) => [s.type_id, s]));

  for (const hs of homeStats) {
    const as = awayStats.find((a) => a.type_id === hs.type_id);
    if (as) {
      pairs.push({
        label: hs.type?.name || `Stat ${hs.type_id}`,
        homeValue: Number(hs.data.value) || 0,
        awayValue: Number(as.data.value) || 0,
      });
    }
  }

  return pairs.slice(0, 10); // Limit to 10 stats
}

// Stat bar component
function StatBar({
  label,
  homeValue,
  awayValue,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
}) {
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;
  const awayPercent = (awayValue / total) * 100;

  return (
    <div className="py-3">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">{homeValue}</span>
        <span className="text-xs font-medium text-mg-text-muted">{label}</span>
        <span className="font-semibold text-white">{awayValue}</span>
      </div>
      <div className="flex gap-1 overflow-hidden rounded-full">
        <div
          className="h-1.5 rounded-full bg-mg-blue transition-all"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="h-1.5 rounded-full bg-mg-text-muted/30 transition-all"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}
