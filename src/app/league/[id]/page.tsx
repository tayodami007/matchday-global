// ============================================================
// MATCHDAYGLOBAL — LEAGUE DETAIL PAGE
// Full standings table for a specific league
// ============================================================

import {
  getStandingsBySeason,
  LEAGUE_META,
} from "@/lib/sportmonks";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const LEAGUE_NAMES: Record<number, { name: string; country: string; gradient: string }> = {
  8: { name: "Premier League", country: "England", gradient: "from-purple-600 to-pink-500" },
  564: { name: "La Liga", country: "Spain", gradient: "from-orange-500 to-red-500" },
  82: { name: "Bundesliga", country: "Germany", gradient: "from-red-600 to-yellow-500" },
  384: { name: "Serie A", country: "Italy", gradient: "from-blue-600 to-cyan-400" },
  301: { name: "Ligue 1", country: "France", gradient: "from-blue-500 to-green-400" },
  72: { name: "Eredivisie", country: "Netherlands", gradient: "from-orange-500 to-amber-400" },
  462: { name: "Liga Portugal", country: "Portugal", gradient: "from-green-600 to-red-500" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const leagueId = parseInt(id, 10);
  const info = LEAGUE_NAMES[leagueId];
  return {
    title: info ? `${info.name} Standings — ${info.country}` : "League Standings",
    description: info
      ? `Full ${info.name} standings table for the 2025/26 season.`
      : "League standings and table.",
  };
}

export const revalidate = 300;

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leagueId = parseInt(id, 10);
  const meta = LEAGUE_META[leagueId];
  const info = LEAGUE_NAMES[leagueId];

  if (!meta || !info) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">League not found</h1>
        <p className="mt-2 text-mg-text-muted">
          This league is not currently supported.
        </p>
        <Link href="/leagues" className="mt-4 inline-block text-mg-accent">
          ← Back to Leagues
        </Link>
      </div>
    );
  }

  let standings;
  try {
    standings = await getStandingsBySeason(meta.seasonId);
  } catch {
    standings = [];
  }

  const sorted = [...standings].sort(
    (a, b) => (a.position ?? 99) - (b.position ?? 99)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-mg-text-dim mb-6">
        <Link href="/" className="hover:text-mg-accent transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/leagues" className="hover:text-mg-accent transition-colors">
          Leagues
        </Link>
        <span>/</span>
        <span className="text-mg-text-muted">{info.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-mg-text-dim uppercase tracking-wider">
            {info.country} • 2025/26
          </span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-black text-white"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          {info.name.toUpperCase()}
        </h1>
      </div>

      {/* Standings table */}
      <div className="mg-widget">
        <div className="mg-widget-header">
          <h3>Standings</h3>
          <span className="text-xs text-mg-text-dim">
            {sorted.length} teams
          </span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[36px_1fr_40px_40px_40px_40px_40px_48px] items-center px-4 py-2 text-[10px] font-bold text-mg-text-dim uppercase tracking-wider border-b border-mg-border">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center">L</span>
          <span className="text-center">GD</span>
          <span className="text-center">Pts</span>
        </div>

        {sorted.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-mg-text-muted">
            Standings data unavailable. Please try again later.
          </div>
        ) : (
          sorted.map((entry) => {
            const pos = entry.position ?? 0;
            // Zone colors
            let posColor = "text-mg-text-muted";
            let rowBorder = "";
            if (pos <= 4) {
              posColor = "text-mg-blue";
              rowBorder = "border-l-2 border-l-[#4488ff]";
            } else if (pos >= 18) {
              posColor = "text-mg-red";
              rowBorder = "border-l-2 border-l-[#E63946]";
            } else if (pos <= 6) {
              posColor = "text-mg-orange";
              rowBorder = "border-l-2 border-l-[#F59E0B]";
            }

            const played = entry.details?.find((d) => d.type_id === 129)?.value ?? "-";
            const won = entry.details?.find((d) => d.type_id === 130)?.value ?? "-";
            const drawn = entry.details?.find((d) => d.type_id === 131)?.value ?? "-";
            const lost = entry.details?.find((d) => d.type_id === 132)?.value ?? "-";
            const gf = entry.details?.find((d) => d.type_id === 133)?.value ?? 0;
            const ga = entry.details?.find((d) => d.type_id === 134)?.value ?? 0;
            const gd = typeof gf === "number" && typeof ga === "number" ? gf - ga : "-";

            return (
              <div
                key={entry.participant_id}
                className={`grid grid-cols-[36px_1fr_40px_40px_40px_40px_40px_48px] items-center px-4 py-2.5 text-sm border-b border-mg-border/50 hover:bg-mg-surface-2 transition-colors ${rowBorder}`}
              >
                <span className={`font-bold ${posColor}`}>{pos}</span>
                <div className="flex items-center gap-2.5 min-w-0">
                  {entry.participant?.image_path && (
                    <Image
                      src={entry.participant.image_path}
                      alt={entry.participant.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 object-contain"
                    />
                  )}
                  <span className="font-medium text-white truncate text-sm">
                    {entry.participant?.name || `Team ${entry.participant_id}`}
                  </span>
                </div>
                <span className="text-center text-mg-text-muted">{played}</span>
                <span className="text-center text-mg-text-muted">{won}</span>
                <span className="text-center text-mg-text-muted">{drawn}</span>
                <span className="text-center text-mg-text-muted">{lost}</span>
                <span
                  className={`text-center font-medium ${
                    typeof gd === "number" && gd > 0
                      ? "text-mg-accent"
                      : typeof gd === "number" && gd < 0
                        ? "text-mg-red"
                        : "text-mg-text-muted"
                  }`}
                >
                  {typeof gd === "number" && gd > 0 ? `+${gd}` : gd}
                </span>
                <span className="text-center font-bold text-white">
                  {entry.points ?? "-"}
                </span>
              </div>
            );
          })
        )}

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
  );
}
