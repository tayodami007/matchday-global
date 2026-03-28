// ============================================================
// MATCHDAYGLOBAL — MATCH DETAIL PAGE
// Detailed view of a single fixture
// ============================================================

import {
  getFixtureById,
  parseScores,
  getMatchStatus,
  getHomeTeam,
  getAwayTeam,
  formatDate,
  formatTime,
} from "@/lib/sportmonks";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fixture = await getFixtureById(parseInt(id, 10));
  if (!fixture) return { title: "Match Not Found" };
  const home = getHomeTeam(fixture);
  const away = getAwayTeam(fixture);
  return {
    title: `${home?.name || "Home"} vs ${away?.name || "Away"} — Match Details`,
    description: `Live score, events, and statistics for ${home?.name} vs ${away?.name}.`,
  };
}

export const revalidate = 30;

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fixture = await getFixtureById(parseInt(id, 10));

  if (!fixture) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Match not found</h1>
        <p className="mt-2 text-mg-text-muted">
          This match may not exist or the data is unavailable.
        </p>
        <Link href="/" className="mt-4 inline-block text-mg-accent">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const home = getHomeTeam(fixture);
  const away = getAwayTeam(fixture);
  const status = getMatchStatus(fixture);
  const scores = parseScores(fixture);

  // Sort events by minute
  const events = [...(fixture.events || [])].sort(
    (a, b) => a.minute - b.minute
  );

  // Event icon helper
  function getEventIcon(typeName: string) {
    const name = typeName.toLowerCase();
    if (name.includes("goal")) return "⚽";
    if (name.includes("yellowcard") || name.includes("yellow")) return "🟨";
    if (name.includes("redcard") || name.includes("red")) return "🟥";
    if (name.includes("substitution")) return "🔄";
    if (name.includes("penalty") && name.includes("missed")) return "❌";
    return "📋";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-mg-text-dim mb-6">
        <Link href="/" className="hover:text-mg-accent transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/predictions"
          className="hover:text-mg-accent transition-colors"
        >
          Matches
        </Link>
        <span>/</span>
        <span className="text-mg-text-muted">
          {home?.name} vs {away?.name}
        </span>
      </div>

      {/* Match header card */}
      <div className="mg-card mb-6">
        {/* League info */}
        <div className="flex items-center justify-center gap-2 border-b border-mg-border px-4 py-2">
          {fixture.league?.image_path && (
            <Image
              src={fixture.league.image_path}
              alt={fixture.league?.name || ""}
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
          )}
          <span className="text-xs text-mg-text-muted">
            {fixture.league?.name || "League"}
          </span>
          <span className="text-xs text-mg-text-dim">•</span>
          <span className="text-xs text-mg-text-dim">
            {formatDate(fixture.starting_at)}
          </span>
        </div>

        {/* Score area */}
        <div className="flex items-center justify-center gap-8 py-10 px-6">
          {/* Home */}
          <div className="flex flex-col items-center gap-3 flex-1">
            {home?.image_path && (
              <Image
                src={home.image_path}
                alt={home.name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] object-contain"
              />
            )}
            <span className="text-base font-bold text-white text-center">
              {home?.name || "Home"}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            {status.isFinished || status.isLive ? (
              <div className="flex items-center gap-4">
                <span
                  className={`text-5xl font-black ${
                    status.isLive ? "text-mg-accent" : "text-white"
                  }`}
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {scores.home}
                </span>
                <span className="text-2xl text-mg-text-dim font-light">:</span>
                <span
                  className={`text-5xl font-black ${
                    status.isLive ? "text-mg-accent" : "text-white"
                  }`}
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {scores.away}
                </span>
              </div>
            ) : (
              <span
                className="text-3xl font-bold text-mg-text-muted"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {formatTime(fixture.starting_at)}
              </span>
            )}
            <div className="mt-1">
              {status.isLive ? (
                <span className="mg-badge bg-mg-red text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mg-live-pulse" />
                  LIVE {status.displayText}
                </span>
              ) : status.isFinished ? (
                <span className="mg-badge bg-mg-surface-3 text-mg-text-muted">
                  Full Time
                </span>
              ) : (
                <span className="mg-badge bg-mg-surface-3 text-mg-text-muted">
                  Upcoming
                </span>
              )}
            </div>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-3 flex-1">
            {away?.image_path && (
              <Image
                src={away.image_path}
                alt={away.name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] object-contain"
              />
            )}
            <span className="text-base font-bold text-white text-center">
              {away?.name || "Away"}
            </span>
          </div>
        </div>
      </div>

      {/* Match events */}
      {events.length > 0 && (
        <div className="mg-widget mb-6">
          <div className="mg-widget-header">
            <h3>Match Events</h3>
          </div>
          <div className="divide-y divide-mg-border">
            {events.map((event) => {
              const isHome =
                home && event.participant_id === home.id;
              const icon = getEventIcon(
                event.type?.developer_name || event.type?.name || ""
              );
              return (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                    isHome ? "" : "flex-row-reverse text-right"
                  }`}
                >
                  <span className="text-xs font-bold text-mg-accent w-8 shrink-0 text-center">
                    {event.minute}&apos;
                    {event.extra_minute ? `+${event.extra_minute}` : ""}
                  </span>
                  <span className="text-base">{icon}</span>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-white">
                      {event.player_name || event.player?.display_name || ""}
                    </span>
                    {event.related_player_name && (
                      <span className="text-xs text-mg-text-dim ml-2">
                        ({event.related_player_name})
                      </span>
                    )}
                    {event.result && (
                      <span className="text-xs text-mg-text-dim ml-2">
                        {event.result}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statistics */}
      {fixture.statistics && fixture.statistics.length > 0 && (
        <div className="mg-widget mb-6">
          <div className="mg-widget-header">
            <h3>Statistics</h3>
          </div>
          <div className="p-4 space-y-3">
            {(() => {
              // Group stats by type
              const statMap: Record<
                string,
                { name: string; home: number | string; away: number | string }
              > = {};
              for (const stat of fixture.statistics) {
                const key = stat.type?.name || `stat-${stat.type_id}`;
                if (!statMap[key]) {
                  statMap[key] = { name: key, home: 0, away: 0 };
                }
                if (stat.location === "home") {
                  statMap[key].home = stat.data.value;
                } else {
                  statMap[key].away = stat.data.value;
                }
              }
              return Object.values(statMap).map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs text-mg-text-muted mb-1">
                    <span className="font-medium text-white">{String(s.home)}</span>
                    <span>{s.name}</span>
                    <span className="font-medium text-white">{String(s.away)}</span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    <div
                      className="bg-mg-accent rounded-full"
                      style={{
                        width: `${
                          (Number(s.home) /
                            (Number(s.home) + Number(s.away) || 1)) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="bg-mg-blue rounded-full"
                      style={{
                        width: `${
                          (Number(s.away) /
                            (Number(s.home) + Number(s.away) || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Betting CTA */}
      <div className="mg-cta">
        <h3
          className="text-lg font-bold text-white mb-1"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          WANT MORE MATCH INSIGHTS?
        </h3>
        <p className="text-sm text-mg-text-muted mb-3">
          Follow Matchday Global for predictions, analysis, and the best odds on
          every match.
        </p>
        <Link
          href="/predictions"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
        >
          View All Predictions →
        </Link>
      </div>
    </div>
  );
}
