// ============================================================
// MATCHDAYGLOBAL — PREDICTIONS PAGE
// Match predictions with betting affiliate CTAs
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getFixturesByDate,
  getHomeTeam,
  getAwayTeam,
  getMatchStatus,
  parseScores,
  formatDate,
  formatTime,
  LEAGUE_META,
} from "@/lib/sportmonks";

export const metadata: Metadata = {
  title: "Match Predictions — Predict Football Scores",
  description:
    "Predict match scores for Premier League, Champions League, La Liga, and more. Test your football knowledge with Matchday Global predictions.",
};

export const revalidate = 120;

export default async function PredictionsPage() {
  const today = new Date();
  const dates = [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  });

  let allFixtures: Awaited<ReturnType<typeof getFixturesByDate>> = [];
  try {
    allFixtures = (
      await Promise.all(dates.map((date) => getFixturesByDate(date)))
    ).flat();
  } catch {
    allFixtures = [];
  }

  const majorLeagueIds = Object.keys(LEAGUE_META).map(Number);
  const fixtures = allFixtures
    .filter((f) => majorLeagueIds.includes(f.league_id))
    .sort(
      (a, b) =>
        new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
    );

  // Group by date
  const grouped: Record<string, typeof fixtures> = {};
  for (const f of fixtures) {
    const date = f.starting_at.split("T")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(f);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-black text-mg-text mb-2"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          MATCH PREDICTIONS
        </h1>
        <p className="text-sm text-mg-text-muted">
          Upcoming fixtures from the top European leagues. Follow the action and
          test your predictions.
        </p>
      </div>

      {/* Betting CTA banner */}
      <div className="mg-cta mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            BACK YOUR PREDICTIONS
          </h2>
          <p className="text-sm text-mg-text-muted">
            Think you know the score? Get the best odds on today&apos;s matches.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#34D399] to-[#60A5FA] px-6 py-3 text-sm font-bold text-[#111827] whitespace-nowrap">
          Best Odds Available →
        </span>
      </div>

      {/* Fixtures by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="mg-card flex flex-col items-center px-8 py-16 text-center">
          <h3 className="text-lg font-bold text-mg-text">
            No upcoming matches found
          </h3>
          <p className="mt-2 text-sm text-mg-text-muted">
            Check back when league fixtures resume.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateFixtures]) => (
            <div key={date}>
              {/* Date header */}
              <div className="mg-section-header">
                <div className="bar bg-mg-accent" />
                <h2>
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h2>
              </div>

              {/* Match cards */}
              <div className="space-y-3">
                {dateFixtures.map((fixture) => {
                  const home = getHomeTeam(fixture);
                  const away = getAwayTeam(fixture);
                  const status = getMatchStatus(fixture);
                  const scores = parseScores(fixture);

                  return (
                    <Link
                      key={fixture.id}
                      href={`/match/${fixture.id}`}
                      className="mg-card-link block"
                    >
                      <div className="flex items-center gap-4 p-4">
                        {/* Home team */}
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {home?.image_path && (
                            <Image
                              src={home.image_path}
                              alt={home.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 shrink-0 object-contain"
                            />
                          )}
                          <span className="truncate text-sm font-bold text-mg-text">
                            {home?.name || "Home"}
                          </span>
                        </div>

                        {/* Score / Time */}
                        <div className="flex items-center gap-3 shrink-0">
                          {status.isFinished || status.isLive ? (
                            <>
                              <span
                                className={`text-xl font-black ${
                                  status.isLive
                                    ? "text-mg-accent"
                                    : "text-mg-text"
                                }`}
                              >
                                {scores.home}
                              </span>
                              <span className="text-xs text-mg-text-dim">
                                -
                              </span>
                              <span
                                className={`text-xl font-black ${
                                  status.isLive
                                    ? "text-mg-accent"
                                    : "text-mg-text"
                                }`}
                              >
                                {scores.away}
                              </span>
                            </>
                          ) : (
                            <span className="text-base font-bold text-mg-text-muted">
                              {formatTime(fixture.starting_at)}
                            </span>
                          )}
                        </div>

                        {/* Away team */}
                        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                          <span className="truncate text-right text-sm font-bold text-white">
                            {away?.name || "Away"}
                          </span>
                          {away?.image_path && (
                            <Image
                              src={away.image_path}
                              alt={away.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 shrink-0 object-contain"
                            />
                          )}
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="flex items-center justify-between border-t border-mg-border bg-mg-surface px-4 py-2">
                        <div className="flex items-center gap-2">
                          {fixture.league?.image_path && (
                            <Image
                              src={fixture.league.image_path}
                              alt={fixture.league?.name || "League"}
                              width={16}
                              height={16}
                              className="h-4 w-4 object-contain"
                            />
                          )}
                          <span className="text-xs text-mg-text-muted">
                            {fixture.league?.name || "League"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {status.isLive && (
                            <span className="mg-badge bg-mg-red/20 text-mg-red text-[10px]">
                              <span className="h-1 w-1 rounded-full bg-mg-red mg-live-pulse" />
                              LIVE {status.displayText}
                            </span>
                          )}
                          {status.isFinished && (
                            <span className="text-[10px] font-bold text-mg-text-dim">
                              FT
                            </span>
                          )}
                          {status.isUpcoming && (
                            <span className="text-[10px] text-mg-text-dim">
                              {formatDate(fixture.starting_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
