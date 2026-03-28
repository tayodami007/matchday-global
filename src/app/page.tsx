// ============================================================
// MATCHDAYGLOBAL — HOMEPAGE
// Football media platform: hero, news grid, sidebar, transfers
// ============================================================

import Image from "next/image";
import Link from "next/link";
import {
  ARTICLES,
  getFeaturedArticle,
  getLatestArticles,
  getTransferArticles,
  getTrendingArticles,
  formatRelativeTime,
  CATEGORY_COLORS,
  type Article,
} from "@/lib/content";
import {
  getFixturesByDate,
  getStandingsByLeague,
  getHomeTeam,
  getAwayTeam,
  getMatchStatus,
  parseScores,
  LEAGUE_META,
} from "@/lib/sportmonks";

export const revalidate = 30;

export default async function HomePage() {
  // Fetch live data (graceful fallback)
  const today = new Date().toISOString().split("T")[0];
  let todayFixtures: Awaited<ReturnType<typeof getFixturesByDate>> = [];
  let plStandings: Awaited<ReturnType<typeof getStandingsByLeague>> = [];
  try {
    todayFixtures = await getFixturesByDate(today);
  } catch {
    todayFixtures = [];
  }
  try {
    plStandings = await getStandingsByLeague(8);
  } catch {
    plStandings = [];
  }

  const featured = getFeaturedArticle();
  const latest = getLatestArticles(12).filter((a) => !a.featured);
  const transfers = getTransferArticles();
  const trending = getTrendingArticles();

  // Sort standings
  const sortedStandings = [...(plStandings || [])]
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .slice(0, 10);

  // Filter fixtures to major leagues
  const majorLeagueIds = Object.keys(LEAGUE_META).map(Number);
  const liveAndRecent = (todayFixtures || [])
    .filter((f) => majorLeagueIds.includes(f.league_id))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* ============ MAIN GRID: Content + Sidebar ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ---- LEFT COLUMN ---- */}
        <div className="min-w-0 space-y-10">
          {/* ==== HERO STORY ==== */}
          {featured && (
            <Link href={`/news#${featured.id}`} className="block">
              <div className="mg-hero relative">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  className="mg-hero-img object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                />
                <div className="mg-hero-overlay absolute inset-0 z-10" />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    {featured.breaking && (
                      <span className="mg-badge bg-mg-red text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white mg-live-pulse" />
                        Breaking
                      </span>
                    )}
                    <span
                      className="mg-badge text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[featured.category] }}
                    >
                      {featured.category}
                    </span>
                    {featured.tag && (
                      <span className="mg-badge bg-mg-gold/20 text-mg-gold">
                        {featured.tag}
                      </span>
                    )}
                  </div>
                  <h1
                    className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {featured.title}
                  </h1>
                  <p className="text-sm sm:text-base text-mg-text-secondary line-clamp-2 max-w-2xl mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-mg-text-muted">
                    <span className="font-semibold text-mg-accent">{featured.author}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(featured.publishedAt)}</span>
                    <span>•</span>
                    <span>{featured.readTime} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ==== TRENDING ==== */}
          {trending.length > 0 && (
            <div>
              <div className="mg-section-header">
                <div className="bar bg-mg-accent" />
                <h2>Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trending.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* ==== LATEST NEWS ==== */}
          <div>
            <div className="mg-section-header">
              <div className="bar bg-mg-blue" />
              <h2>Latest News</h2>
              <Link href="/news">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latest.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* ==== TRANSFER RUMOURS ==== */}
          {transfers.length > 0 && (
            <div>
              <div className="mg-section-header">
                <div className="bar bg-mg-gold" />
                <h2>Transfer Rumours</h2>
                <Link href="/news?cat=Transfers">View All →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {transfers.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* ==== MORE STORIES ==== */}
          <div>
            <div className="mg-section-header">
              <div className="bar bg-mg-purple" />
              <h2>More Stories</h2>
            </div>
            <div className="space-y-3">
              {latest.slice(6, 12).map((article) => (
                <ArticleRowCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* ---- RIGHT COLUMN: Sidebar ---- */}
        <aside className="space-y-5">
          {/* ==== LIVE SCORES ==== */}
          <div className="mg-widget">
            <div className="mg-widget-header">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-mg-red mg-live-pulse" />
                <h3>Scores</h3>
              </div>
              <Link href="/predictions" className="text-xs text-mg-accent font-semibold hover:opacity-80 transition-opacity">
                All Scores →
              </Link>
            </div>
            {liveAndRecent.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-mg-text-muted">No matches today</p>
                <p className="text-xs text-mg-text-dim mt-1">Check back when fixtures resume</p>
              </div>
            ) : (
              <div>
                {liveAndRecent.map((fixture) => {
                  const home = getHomeTeam(fixture);
                  const away = getAwayTeam(fixture);
                  const status = getMatchStatus(fixture);
                  const scores = parseScores(fixture);
                  return (
                    <Link key={fixture.id} href={`/match/${fixture.id}`} className="mg-score-row">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-white truncate">{home?.name || "Home"}</span>
                          <span className={`text-xs font-bold ${status.isLive ? "text-mg-accent" : "text-white"}`}>
                            {status.isFinished || status.isLive ? scores.home : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="text-xs font-medium text-white truncate">{away?.name || "Away"}</span>
                          <span className={`text-xs font-bold ${status.isLive ? "text-mg-accent" : "text-white"}`}>
                            {status.isFinished || status.isLive ? scores.away : ""}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 shrink-0">
                        {status.isLive ? (
                          <span className="mg-badge bg-mg-red/20 text-mg-red text-[10px]">
                            <span className="h-1 w-1 rounded-full bg-mg-red mg-live-pulse" />
                            {status.displayText}
                          </span>
                        ) : status.isFinished ? (
                          <span className="text-[10px] font-bold text-mg-text-dim">FT</span>
                        ) : (
                          <span className="text-[10px] font-medium text-mg-text-muted">{status.displayText}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==== PREMIER LEAGUE TABLE ==== */}
          <div className="mg-widget">
            <div className="mg-widget-header">
              <h3 className="text-mg-purple">Premier League</h3>
              <Link href="/league/8" className="text-xs text-mg-accent font-semibold hover:opacity-80 transition-opacity">
                Full Table →
              </Link>
            </div>
            <div className="mg-standings-row text-[10px] font-bold text-mg-text-dim uppercase tracking-wider">
              <span>#</span>
              <span>Team</span>
              <span className="text-center">P</span>
              <span className="text-center">W</span>
              <span className="text-center">D</span>
              <span className="text-center">L</span>
              <span className="text-center">Pts</span>
            </div>
            {sortedStandings.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-mg-text-muted">Loading standings...</div>
            ) : (
              sortedStandings.map((entry) => (
                <div key={entry.participant_id} className="mg-standings-row">
                  <span className={`text-xs font-bold ${(entry.position ?? 0) <= 4 ? "text-mg-blue" : (entry.position ?? 0) >= 18 ? "text-mg-red" : "text-mg-text-muted"}`}>
                    {entry.position}
                  </span>
                  <span className="text-xs font-medium text-white truncate">
                    {entry.participant?.name || `Team ${entry.participant_id}`}
                  </span>
                  <span className="text-xs text-mg-text-muted text-center">
                    {entry.details?.find((d) => d.type_id === 129)?.value ?? "-"}
                  </span>
                  <span className="text-xs text-mg-text-muted text-center">
                    {entry.details?.find((d) => d.type_id === 130)?.value ?? "-"}
                  </span>
                  <span className="text-xs text-mg-text-muted text-center">
                    {entry.details?.find((d) => d.type_id === 131)?.value ?? "-"}
                  </span>
                  <span className="text-xs text-mg-text-muted text-center">
                    {entry.details?.find((d) => d.type_id === 132)?.value ?? "-"}
                  </span>
                  <span className="text-xs font-bold text-white text-center">{entry.points ?? "-"}</span>
                </div>
              ))
            )}
          </div>

          {/* ==== PREDICTIONS CTA ==== */}
          <div className="mg-cta">
            <div className="text-lg font-bold text-white mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>
              MATCH PREDCCTIONS
            </div>
            <p className="text-sm text-mg-text-muted mb-4">
              Test your football knowledge. Predict scores for upcoming matches.
            </p>
            <Link
              href="/predictions"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              Make Predictions →
            </Link>
          </div>

          {/* ==== POPULAR ==== */}
          <div className="mg-widget">
            <div className="mg-widget-header">
              <h3>Popular</h3>
            </div>
            <div className="divide-y divide-mg-border">
              {ARTICLES.slice(0, 5).map((article, i) => (
                <Link key={article.id} href={`/news#${article.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-mg-surface-2 transition-colors">
                  <span className="text-2xl font-black text-mg-border-light leading-none mt-0.5" style={{ fontFamily: "Oswald, sans-serif" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">{article.title}</p>
                    <span className="text-[10px] text-mg-text-dim mt-1 block">{formatRelativeTime(article.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ==== NEWSLETTER ==== */}
          <div className="mg-card p-5">
            <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>
              NEVER MISS A STORY
            </h3>
            <p className="text-xs text-mg-text-muted mb-3">
              Get breaking news and transfer rumours straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 rounded-lg border border-mg-border bg-mg-surface-2 px-3 py-2 text-sm text-white placeholder:text-mg-text-dim outline-none focus:border-mg-accent"
              />
              <button className="shrink-0 rounded-lg bg-mg-accent px-4 py-2 text-sm font-bold text-black hover:bg-mg-accent-dim transition-colors">
                Join
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// ARTICLE CARD
// ============================================================
function ArticleCard({ article, size = "md" }: { article: Article; size?: "sm" | "md" }) {
  const imgH = size === "sm" ? "h-40" : "h-48";
  return (
    <Link href={`/news#${article.id}`} className="mg-card-link group">
      <div className={`relative ${imgH} overflow-hidden`}>
        <Image src={article.image} alt={article.imageAlt} fill className="mg-card-img object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="mg-badge text-white" style={{ backgroundColor: CATEGORY_COLORS[article.category] }}>{article.category}</span>
          {article.tag && <span className="mg-badge bg-black/50 text-mg-gold backdrop-blur-sm">{article.tag}</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-mg-accent transition-colors">{article.title}</h3>
        {size !== "sm" && <p className="text-xs text-mg-text-muted line-clamp-2 mb-3">{article.excerpt}</p>}
        <div className="flex items-center gap-2 text-[10px] text-mg-text-dim">
          <span className="font-semibold text-mg-accent">{article.author}</span>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime} min</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// ARTICLE ROW CARD
// ============================================================
function ArticleRowCard({ article }: { article: Article }) {
  return (
    <Link href={`/news#${article.id}`} className="mg-card-link group flex gap-4 p-3">
      <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden">
        <Image src={article.image} alt={article.imageAlt} fill className="mg-card-img object-cover" sizes="112px" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="mg-badge text-white" style={{ backgroundColor: CATEGORY_COLORS[article.category] }}>{article.category}</span>
        </div>
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-mg-accent transition-colors">{article.title}</h3>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-mg-text-dim">
          <span>{formatRelativeTime(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
