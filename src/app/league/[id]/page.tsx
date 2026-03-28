import {
  getLeagues,
  getStandingsBySeason,
  getCurrentSeasonByLeague,
  LEAGUE_META,
} from "@/lib/sportmonks";
import type { Standing } from "@/lib/types";
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const leagues = await getLeagues();
  const league = leagues.find((l) => l.id === Number(id));
  return {
    title: league ? `${league.name} — Standings, Fixtures & Stats` : "League",
    description: league
      ? `Live ${league.name} standings, fixtures, results, and statistics on MatchdayGlobal.`
      : "Football league standings and fixtures.",
  };
}

export default async function LeaguePage({ params }: PageProps) {
  const { id } = await params;
  const leagueId = Number(id);
  const leagues = await getLeagues();
  const league = leagues.find((l) => l.id === leagueId);
  const meta = LEAGUE_META[leagueId];

  // Get current season standings
  let seasonId = meta?.seasonId || null;
  if (!seasonId) {
    seasonId = await getCurrentSeasonByLeague(leagueId);
  }

  let standings: Standing[] = [];
  if (seasonId) {
    standings = await getStandingsBySeason(seasonId);
  }

  const sorted = [...standings].sort((a, b) => a.position - b.position);

  return (
    <div>
      {/* League Hero */}
      <section className="relative overflow-hidden border-b border-mg-border bg-mg-surface">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] left-[20%] h-[80%] w-[60%] rounded-full bg-[#4488ff]/[0.04] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="flex items-center gap-6">
            {league?.image_path && (
              <Image
                src={league.image_path}
                alt={league.name}
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            )}
            <div>
              <p className="text-sm font-medium text-mg-text-muted">
                {league?.country?.name || "Europe"}
              </p>
              <h1 className="text-3xl font-black text-white sm:text-5xl">
                {league?.name || "League"}
              </h1>
              <p className="mt-2 text-mg-text-muted">
                2025/26 Season &middot;{" "}
                {sorted.length > 0
                  ? `${sorted.length} teams`
                  : "Loading standings..."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Standings Table */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mg-card overflow-hidden">
          <div className="border-b border-mg-border px-4 py-3">
            <h2 className="text-base font-bold text-white">Standings</h2>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_50px_50px_50px_50px_50px_60px] items-center gap-1 border-b border-mg-border bg-mg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-mg-text-muted">
            <span className="text-center">#</span>
            <span>Team</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GD</span>
            <span className="text-center">Pts</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-mg-border">
            {sorted.map((entry) => {
              // Extract details if available
              const played = entry.details?.find(d => d.standing_type?.code === 'overall_matches_played')?.value;
              const won = entry.details?.find(d => d.standing_type?.code === 'overall_won')?.value;
              const drawn = entry.details?.find(d => d.standing_type?.code === 'overall_draw')?.value;
              const lost = entry.details?.find(d => d.standing_type?.code === 'overall_lost')?.value;
              const gd = entry.details?.find(d => d.standing_type?.code === 'overall_goal_difference')?.value;

              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-[40px_1fr_50px_50px_50px_50px_50px_60px] items-center gap-1 px-4 py-3 transition-colors hover:bg-mg-card-hover"
                >
                  {/* Position */}
                  <span
                    className={`text-center text-sm font-bold ${
                      entry.position <= 4
                        ? "text-mg-blue"
                        : entry.position === 5 || entry.position === 6
                          ? "text-mg-orange"
                          : entry.position >= 18
                            ? "text-mg-red"
                            : "text-mg-text-muted"
                    }`}
                  >
                    {entry.position}
                  </span>

                  {/* Team */}
                  <div className="flex min-w-0 items-center gap-2.5">
                    {entry.participant?.image_path && (
                      <Image
                        src={entry.participant.image_path}
                        alt={entry.participant.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                    )}
                    <span className="truncate text-sm font-semibold text-mg-text">
                      {entry.participant?.name || "Unknown"}
                    </span>
                    {entry.result === "up" && (
                      <svg className="h-3 w-3 shrink-0 text-mg-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4l-8 8h5v8h6v-8h5z"/>
                      </svg>
                    )}
                    {entry.result === "down" && (
                      <svg className="h-3 w-3 shrink-0 text-mg-red" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 20l8-8h-5V4H9v8H4z"/>
                      </svg>
                    )}
                  </div>

                  {/* Stats */}
                  <span className="text-center text-sm text-mg-text-muted">
                    {played ?? "-"}
                  </span>
                  <span className="text-center text-sm text-mg-text-muted">
                    {won ?? "-"}
                  </span>
                  <span className="text-center text-sm text-mg-text-muted">
                    {drawn ?? "-"}
                  </span>
                  <span className="text-center text-sm text-mg-text-muted">
                    {lost ?? "-"}
                  </span>
                  <span
                    className={`text-center text-sm font-medium ${
                      gd && gd > 0
                        ? "text-mg-accent"
                        : gd && gd < 0
                          ? "text-mg-red"
                          : "text-mg-text-muted"
                    }`}
                  >
                    {gd != null ? (gd > 0 ? `+${gd}` : gd) : "-"}
                  </span>
                  <span className="text-center text-sm font-extrabold text-white">
                    {entry.points}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 border-t border-mg-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-mg-text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-mg-blue" />
              Champions League
            </div>
            <div className="flex items-center gap-2 text-xs text-mg-text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-mg-orange" />
              Europa League
            </div>
            <div className="flex items-center gap-2 text-xs text-mg-text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-mg-red" />
              Relegation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
