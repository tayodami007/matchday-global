// ============================================================
// MATCHDAYGLOBAL — LEAGUES PAGE
// Overview of all supported leagues with links to full tables
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLeagues, LEAGUE_META } from "@/lib/sportmonks";

export const metadata: Metadata = {
  title: "Leagues — Premier League, La Liga, Bundesliga & More",
  description:
    "Full standings, fixtures, and results for the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Eredivisie, and Liga Portugal.",
};

export const revalidate = 3600;

const LEAGUE_INFO: Record<
  number,
  { name: string; country: string; color: string; gradient: string }
> = {
  8: {
    name: "Premier League",
    country: "England",
    color: "#8B5CF6",
    gradient: "from-purple-600 to-pink-500",
  },
  564: {
    name: "La Liga",
    country: "Spain",
    color: "#EA580C",
    gradient: "from-orange-500 to-red-500",
  },
  82: {
    name: "Bundesliga",
    country: "Germany",
    color: "#DC2626",
    gradient: "from-red-600 to-yellow-500",
  },
  384: {
    name: "Serie A",
    country: "Italy",
    color: "#0891B2",
    gradient: "from-blue-600 to-cyan-400",
  },
  301: {
    name: "Ligue 1",
    country: "France",
    color: "#059669",
    gradient: "from-blue-500 to-green-400",
  },
  72: {
    name: "Eredivisie",
    country: "Netherlands",
    color: "#F59E0B",
    gradient: "from-orange-500 to-amber-400",
  },
  462: {
    name: "Liga Portugal",
    country: "Portugal",
    color: "#16A34A",
    gradient: "from-green-600 to-red-500",
  },
};

export default async function LeaguesPage() {
  let leagues;
  try {
    leagues = await getLeagues();
  } catch {
    leagues = [];
  }

  const supportedIds = Object.keys(LEAGUE_META).map(Number);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-black text-white mb-2"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          LEAGUES
        </h1>
        <p className="text-sm text-mg-text-muted">
          Full standings, fixtures, and results from Europe&apos;s top football
          leagues.
        </p>
      </div>

      {/* League cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {supportedIds.map((id) => {
          const info = LEAGUE_INFO[id];
          const leagueData = leagues.find((l) => l.id === id);

          return (
            <Link
              key={id}
              href={`/league/${id}`}
              className="mg-card-link group"
            >
              {/* Gradient header */}
              <div
                className={`relative h-32 bg-gradient-to-br ${info.gradient} flex items-center justify-center overflow-hidden`}
              >
                {leagueData?.image_path && (
                  <Image
                    src={leagueData.image_path}
                    alt={info.name}
                    width={80}
                    height={80}
                    className="object-contain opacity-90 drop-shadow-lg"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Info */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white group-hover:text-mg-accent transition-colors">
                  {info.name}
                </h2>
                <p className="text-sm text-mg-text-muted mt-1">
                  {info.country}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-mg-text-dim">
                    2025/26 Season
                  </span>
                  <span className="text-xs font-semibold text-mg-accent">
                    View Table →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
