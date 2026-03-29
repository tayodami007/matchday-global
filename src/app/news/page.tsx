// ============================================================
// MATCHDAYGLOBAL — NEWS PAGE
// All football news, filterable by category
// ============================================================

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ARTICLES as STATIC_ARTICLES,
  getLatestArticles as getStaticLatest,
  formatRelativeTime,
  CATEGORY_COLORS,
  type Article,
  type ArticleCategory,
} from "@/lib/content";
import { fetchLiveNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Football News — Latest Transfer Rumours, Match Reports & Analysis",
  description:
    "Breaking football news, transfer rumours, tactical analysis, and match reports from the Premier League, Champions League, La Liga, and beyond.",
};

export const revalidate = 300;

const CATEGORIES: ArticleCategory[] = [
  "Breaking",
  "Transfers",
  "Premier League",
  "Champions League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "International",
  "Analysis",
];

export default async function NewsPage() {
  // Fetch live news, fall back to static
  let liveArticles: Article[] = [];
  try {
    liveArticles = await fetchLiveNews();
  } catch {
    liveArticles = [];
  }
  const allArticles = liveArticles.length >= 5
    ? liveArticles
    : getStaticLatest(50);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-black text-mg-text mb-2"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          FOOTBALL NEWS
        </h1>
        <p className="text-sm text-mg-text-muted">
          Breaking stories, transfer rumours, tactical analysis, and match
          reports from across world football.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="mg-badge bg-mg-accent text-white cursor-pointer">
          All
        </span>
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="mg-badge text-white cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allArticles.map((article) => (
          <div key={article.id} id={article.id}>
            <NewsArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsArticleCard({ article }: { article: Article }) {
  const linkUrl = article.sourceUrl || `/news#${article.id}`;
  const isExternal = !!article.sourceUrl;
  return (
    <a href={linkUrl} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="mg-card-link group block cursor-pointer">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          className="mg-card-img object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {article.breaking && (
            <span className="mg-badge bg-mg-red text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white mg-live-pulse" />
              Breaking
            </span>
          )}
          <span
            className="mg-badge text-white"
            style={{ backgroundColor: CATEGORY_COLORS[article.category] }}
          >
            {article.category}
          </span>
          {article.tag && (
            <span className="mg-badge bg-black/50 text-mg-gold backdrop-blur-sm">
              {article.tag}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-base font-bold text-mg-text leading-snug line-clamp-2 mb-2 group-hover:text-mg-accent transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-mg-text-muted line-clamp-3 mb-4 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Body preview */}
        <p className="text-xs text-mg-text-dim line-clamp-3 mb-4 leading-relaxed border-l-2 border-mg-border pl-3">
          {article.body}
        </p>

        <div className="flex items-center gap-2 text-[11px] text-mg-text-dim">
          <span className="font-semibold text-mg-accent">
            {article.author}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </a>
  );
}
