import type { Metadata } from "next";
import Link from "next/link";
import { fetchLiveNews } from "@/lib/news";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Matchday Global — The Game Never Stops",
    template: "%s | Matchday Global",
  },
  description:
    "Your home for football news, transfer rumours, match predictions, tactical analysis, and live scores. The world's fastest-growing football media platform.",
  keywords: [
    "football news",
    "soccer news",
    "transfer rumours",
    "Premier League",
    "Champions League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "match predictions",
    "live scores",
    "tactical analysis",
    "football",
  ],
  openGraph: {
    type: "website",
    siteName: "Matchday Global",
    title: "Matchday Global — The Game Never Stops",
    description:
      "Your home for football news, transfer rumours, match predictions, tactical analysis, and live scores.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@MatchdayGlobal",
  },
};

// ---- NAV LINKS ----
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/news?cat=Transfers", label: "Transfers" },
  { href: "/predictions", label: "Predictions" },
  { href: "/leagues", label: "Leagues" },
];

// ---- FOOTER LINKS ----
const FOOTER_COLS = [
  {
    title: "Leagues",
    links: [
      { label: "Premier League", href: "/league/8" },
      { label: "La Liga", href: "/league/564" },
      { label: "Bundesliga", href: "/league/82" },
      { label: "Serie A", href: "/league/384" },
      { label: "Ligue 1", href: "/league/301" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Latest News", href: "/news" },
      { label: "Transfer Rumours", href: "/news?cat=Transfers" },
      { label: "Match Predictions", href: "/predictions" },
      { label: "Tactical Analysis", href: "/news?cat=Analysis" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "TikTok", href: "https://tiktok.com/@matchdayglobal" },
      { label: "Instagram", href: "https://instagram.com/matchdayglobal" },
      { label: "YouTube", href: "https://youtube.com/@matchdayglobal" },
      { label: "X (Twitter)", href: "https://x.com/matchdayglobal" },
    ],
  },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch live headlines for ticker
  let tickerHeadlines: string[] = [];
  try {
    const articles = await fetchLiveNews();
    tickerHeadlines = articles.slice(0, 6).map((a) => a.title);
  } catch {
    tickerHeadlines = [];
  }
  // Fallback if no live news
  if (tickerHeadlines.length === 0) {
    tickerHeadlines = [
      "Welcome to Matchday Global — The Game Never Stops",
      "Follow the latest football news, transfers, and scores",
      "Premier League, Champions League, La Liga & more",
    ];
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ============ NAVBAR (dark header like ESPN/Sky Sports) ============ */}
        <header className="sticky top-0 z-50 bg-[#111827] border-b border-[#1F2937]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Top bar */}
            <div className="flex h-14 items-center justify-between gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-[#34D399] to-[#60A5FA]">
                  <span
                    className="text-sm font-black text-[#111827] leading-none"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    MG
                  </span>
                </div>
                <span
                  className="text-lg font-bold tracking-tight text-white hidden sm:block"
                  style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.04em" }}
                >
                  MATCHDAY
                  <span className="mg-gradient-text-light"> GLOBAL</span>
                </span>
              </Link>

              {/* Nav links */}
              <nav className="hidden md:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mg-nav-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] hidden lg:block">
                  The Game Never Stops
                </span>
                {/* Mobile menu button */}
                <button className="md:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Breaking news ticker */}
          <div className="border-t border-[#1F2937] bg-[#DC2626]/10 overflow-hidden">
            <div className="flex items-center h-7">
              <div className="shrink-0 flex items-center gap-1.5 px-3 bg-[#DC2626] h-full">
                <span className="h-1.5 w-1.5 rounded-full bg-white mg-live-pulse" />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Breaking
                </span>
              </div>
              <div className="overflow-hidden flex-1 relative">
                <div className="mg-ticker flex items-center gap-12 whitespace-nowrap px-4">
                  {tickerHeadlines.map((headline, i) => (
                    <span key={`t1-${i}`} className="flex items-center gap-12">
                      <span className="text-xs text-[#D1D5DB]">{headline}</span>
                      <span className="text-[#34D399] text-xs">•</span>
                    </span>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {tickerHeadlines.map((headline, i) => (
                    <span key={`t2-${i}`} className="flex items-center gap-12">
                      <span className="text-xs text-[#D1D5DB]">{headline}</span>
                      <span className="text-[#34D399] text-xs">•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ============ MAIN CONTENT ============ */}
        <main className="flex-1">{children}</main>

        {/* ============ FOOTER (dark, like header) ============ */}
        <footer className="border-t border-[#1F2937] bg-[#111827] mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Brand col */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-[#34D399] to-[#60A5FA]">
                    <span
                      className="text-sm font-black text-[#111827] leading-none"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      MG
                    </span>
                  </div>
                  <span
                    className="text-base font-bold text-white"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    MATCHDAY GLOBAL
                  </span>
                </div>
                <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
                  The game never stops. Your home for football news, predictions,
                  and analysis — 24/7.
                </p>
                <div className="flex gap-3">
                  {["TikTok", "IG", "YT", "X"].map((platform) => (
                    <span
                      key={platform}
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#1F2937] border border-[#374151] text-xs font-bold text-[#9CA3AF] hover:text-[#34D399] hover:border-[#34D399] transition-colors cursor-pointer"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h4
                    className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {col.title}
                  </h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm text-[#6B7280] hover:text-[#34D399] transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="mt-10 pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#6B7280]">
                &copy; {new Date().getFullYear()} Matchday Global. All rights
                reserved.
              </p>
              <p className="text-xs text-[#6B7280]">
                Powered by{" "}
                <span className="text-[#9CA3AF]">Kairos Financial Systems</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
