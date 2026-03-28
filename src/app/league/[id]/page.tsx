// ============================================================
// MATCHDAYGLOBAL — LEAGUE DETAIL PAGE
// Full standings table for a specific league
// ============================================================

import {
  getStandingsByLeague,
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
