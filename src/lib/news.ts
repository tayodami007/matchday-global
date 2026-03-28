// ============================================================
// MATCHDAYGLOBAL — Live News Fetcher
// Fetches real football news from RSS feeds (server-side)
// Falls back to static content if feeds are unavailable
// ============================================================

import type { Article, ArticleCategory } from "./content";

// RSS Feed sources (fetched server-side on Netlify — no CORS)
const RSS_FEEDS = [
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
];

// ---- IMAGE MAPPING ----
// TheSportsDB R2 CDN base
const R2 = "https://r2.thesportsdb.com/images/media";

// Team-based image mapping — maps keywords in headlines to relevant images
const TEAM_IMAGE_MAP: Record<string, string> = {
  // Premier League
  arsenal: `${R2}/team/fanart/efb6oc1731826270.jpg`,
  liverpool: `${R2}/team/fanart/kxl2ya1731826235.jpg`,
  "man city": `${R2}/team/fanart/t7rbvo1731826240.jpg`,
  "manchester city": `${R2}/team/fanart/t7rbvo1731826240.jpg`,
  chelsea: `${R2}/team/fanart/kfhxjw1731826191.jpg`,
  "man united": `${R2}/team/fanart/jm3omy1731826249.jpg`,
  "manchester united": `${R2}/team/fanart/jm3omy1731826249.jpg`,
  tottenham: `${R2}/team/fanart/5bvh0v1731826256.jpg`,
  spurs: `${R2}/team/fanart/5bvh0v1731826256.jpg`,
  newcastle: `${R2}/team/fanart/xdg1gj1731826224.jpg`,
  "aston villa": `${R2}/team/fanart/v2lzij1731826181.jpg`,
  everton: `${R2}/team/fanart/5v1z031731826199.jpg`,
  "west ham": `${R2}/team/fanart/8cnwqa1731826263.jpg`,
  brighton: `${R2}/team/fanart/02wjgj1731826186.jpg`,
  wolves: `${R2}/team/fanart/gzj7ps1731826277.jpg`,
  wolverhampton: `${R2}/team/fanart/gzj7ps1731826277.jpg`,
  "crystal palace": `${R2}/team/fanart/x90gkw1731826195.jpg`,
  bournemouth: `${R2}/team/fanart/6ywlq61731826183.jpg`,
  fulham: `${R2}/team/fanart/5qjvk31731826205.jpg`,
  brentford: `${R2}/team/fanart/m7f62c1731826188.jpg`,
  "nottingham forest": `${R2}/team/fanart/ksozf71731826245.jpg`,
  forest: `${R2}/team/fanart/ksozf71731826245.jpg`,
  // European clubs
  "real madrid": `${R2}/team/fanart/frmpwx1731826391.jpg`,
  barcelona: `${R2}/team/fanart/d2fxsk1731826371.jpg`,
  "bayern munich": `${R2}/team/fanart/09b7u21519406807.jpg`,
  bayern: `${R2}/team/fanart/09b7u21519406807.jpg`,
  psg: `${R2}/team/fanart/ggmq1s1731826413.jpg`,
  "paris saint": `${R2}/team/fanart/ggmq1s1731826413.jpg`,
  juventus: `${R2}/team/fanart/gijpho1731826385.jpg`,
  inter: `${R2}/team/fanart/fy95gs1731826381.jpg`,
  milan: `${R2}/team/fanart/z4hhdq1731826402.jpg`,
  atletico: `${R2}/team/fanart/qnp8iy1731826365.jpg`,
  dortmund: `${R2}/team/fanart/0lqoxs1731826377.jpg`,
  // Player images for player-specific stories
  salah: `${R2}/player/thumb/o7y57t1718438615.jpg`,
  haaland: `${R2}/player/thumb/bb1agj1727415216.jpg`,
  mbappe: `${R2}/player/thumb/0yw04y1771265385.jpg`,
  saka: `${R2}/player/thumb/axl31b1769332282.jpg`,
  vinicius: `${R2}/player/thumb/lxf1he1771264845.jpg`,
  palmer: `${R2}/player/thumb/r7yrsa1770541322.jpg`,
  bellingham: `${R2}/player/thumb/rfg8xd1771263826.jpg`,
  kane: `${R2}/player/thumb/0w9up71770542636.jpg`,
  osimhen: `${R2}/player/thumb/snhzzq1702566147.jpg`,
  rashford: `${R2}/player/thumb/ycgnnp1702485116.jpg`,
  rice: `${R2}/player/thumb/7b5r741691932399.jpg`,
  foden: `${R2}/player/thumb/6bbpui1726504965.jpg`,
  // National teams / competitions
  england: `${R2}/team/fanart/qfk3dq1731828161.jpg`,
  scotland: `${R2}/team/fanart/wqvsx41731828240.jpg`,
  wales: `${R2}/team/fanart/8f3vu31731828280.jpg`,
  ireland: `${R2}/team/fanart/rxg49p1731828228.jpg`,
  france: `${R2}/team/fanart/ry6z0p1731828178.jpg`,
  germany: `${R2}/team/fanart/7lml0e1731828185.jpg`,
  spain: `${R2}/team/fanart/0f2u4a1731828246.jpg`,
  italy: `${R2}/team/fanart/52zas81731828195.jpg`,
  brazil: `${R2}/team/fanart/n2yu0y1731828139.jpg`,
  "champions league": `${R2}/league/fanart/Champions_League.jpg`,
  "europa league": `${R2}/league/fanart/Europa_League.jpg`,
  "world cup": `${R2}/league/fanart/FIFA_World_Cup.jpg`,
  "women": `${R2}/league/fanart/Womens_Super_League.jpg`,
  wsl: `${R2}/league/fanart/Womens_Super_League.jpg`,
};

// Fallback images for when no keyword matches
const FALLBACK_IMAGES = [
  `${R2}/league/fanart/English_Premier_League.jpg`,
  `${R2}/league/fanart/Spanish_La_Liga.jpg`,
  `${R2}/league/fanart/German_Bundesliga.jpg`,
  `${R2}/league/fanart/Italian_Serie_A.jpg`,
  `${R2}/league/fanart/French_Ligue_1.jpg`,
];

// ---- CATEGORY DETECTION ----
function detectCategory(title: string, description: string): ArticleCategory {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("transfer") || text.includes("sign") || text.includes("deal") || text.includes("bid") || text.includes("gossip") || text.includes("move")) return "Transfers";
  if (text.includes("champions league") || text.includes("ucl")) return "Champions League";
  if (text.includes("europa league") || text.includes("conference league")) return "Champions League";
  if (text.includes("la liga") || text.includes("real madrid") || text.includes("barcelona") || text.includes("atletico")) return "La Liga";
  if (text.includes("bundesliga") || text.includes("bayern") || text.includes("dortmund")) return "Bundesliga";
  if (text.includes("serie a") || text.includes("juventus") || text.includes("inter milan") || text.includes("napoli")) return "Serie A";
  if (text.includes("ligue 1") || text.includes("psg") || text.includes("marseille")) return "Ligue 1";
  if (text.includes("world cup") || text.includes("euro 20") || text.includes("nations league") || text.includes("international") || text.includes("qualifier") || text.includes("friendly")) return "International";
  if (text.includes("tactical") || text.includes("analysis") || text.includes("xg") || text.includes("stats")) return "Analysis";
  // Default to Premier League for BBC Sport (their primary coverage)
  return "Premier League";
}

// ---- IMAGE MATCHING ----
function findBestImage(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Check each keyword — longest match first for specificity
  const sortedKeys = Object.keys(TEAM_IMAGE_MAP).sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeys) {
    if (text.includes(keyword)) {
      return TEAM_IMAGE_MAP[keyword];
    }
  }

  // Fallback: rotate through generic football images
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

// ---- RSS PARSER ----
function parseRSSItem(itemXml: string): Partial<Article> | null {
  const getTag = (tag: string): string => {
    // Handle CDATA
    const cdataMatch = itemXml.match(new RegExp(`<${tag}>[\\s]*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>[\\s]*</${tag}>`));
    if (cdataMatch) return cdataMatch[1].trim();
    // Handle plain text
    const plainMatch = itemXml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "s"));
    if (plainMatch) return plainMatch[1].trim();
    return "";
  };

  const title = getTag("title");
  if (!title) return null;

  const description = getTag("description");
  const link = getTag("link");
  const pubDate = getTag("pubDate");
  const guid = getTag("guid");

  // Extract media:thumbnail if present
  const thumbMatch = itemXml.match(/url="(https?:\/\/[^"]+)"/);
  const mediaUrl = thumbMatch ? thumbMatch[1] : "";

  // Generate a slug ID
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);

  const category = detectCategory(title, description);
  const image = mediaUrl || findBestImage(title, description);

  return {
    id,
    title: title.length > 90 ? title.substring(0, 87) + "..." : title,
    excerpt: description.length > 200 ? description.substring(0, 197) + "..." : description,
    body: description,
    category,
    image,
    imageAlt: title,
    author: "BBC Sport",
    publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    readTime: Math.max(2, Math.ceil(description.split(" ").length / 50)),
  };
}

function parseRSSFeed(xml: string): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const parsed = parseRSSItem(match[1]);
    if (parsed && parsed.id && parsed.title) {
      items.push(parsed as Article);
    }
  }

  return items;
}

// ---- MAIN FETCH FUNCTION ----
// Called server-side during SSR/ISR on Netlify
export async function fetchLiveNews(): Promise<Article[]> {
  const allArticles: Article[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "MatchdayGlobal/1.0 (football news aggregator)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      clearTimeout(timeout);

      if (!response.ok) continue;

      const xml = await response.text();
      const articles = parseRSSFeed(xml);
      allArticles.push(...articles);
    } catch {
      // Feed unavailable — skip silently
      continue;
    }
  }

  if (allArticles.length === 0) return [];

  // Mark first article as featured, first 3 as trending
  if (allArticles[0]) {
    allArticles[0].featured = true;
    allArticles[0].breaking = true;
  }
  for (let i = 0; i < Math.min(4, allArticles.length); i++) {
    allArticles[i].trending = true;
  }

  // Sort by publish date (newest first)
  allArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return allArticles;
}
