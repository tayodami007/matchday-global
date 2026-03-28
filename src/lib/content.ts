// ============================================================
// MATCHDAYGLOBAL — Editorial Content Library
// Curated football news, stories, and transfer rumours
// Eventually fed by automation pipeline (Make.com / n8n)
// ============================================================

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  tag?: string;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
}

export type ArticleCategory =
  | "Breaking"
  | "Transfers"
  | "Premier League"
  | "Champions League"
  | "La Liga"
  | "Bundesliga"
  | "Serie A"
  | "Ligue 1"
  | "International"
  | "Analysis"
  | "Predictions";

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Breaking: "#E63946",
  Transfers: "#FFD700",
  "Premier League": "#8B5CF6",
  "Champions League": "#1E40AF",
  "La Liga": "#EA580C",
  Bundesliga: "#DC2626",
  "Serie A": "#0891B2",
  "Ligue 1": "#059669",
  International: "#16A34A",
  Analysis: "#6366F1",
  Predictions: "#00FF88",
};

// TheSportsDB R2 CDN base
const R2 = "https://r2.thesportsdb.com/images/media";

// ---- PLAYER IMAGES (TheSportsDB CDN — verified working) ----
export const PLAYER_IMAGES = {
  salah: `${R2}/player/thumb/o7y57t1718438615.jpg`,
  haaland: `${R2}/player/thumb/bb1agj1727415216.jpg`,
  mbappe: `${R2}/player/thumb/0yw04y1771265385.jpg`,
  saka: `${R2}/player/thumb/axl31b1769332282.jpg`,
  vinicius: `${R2}/player/thumb/lxf1he1771264845.jpg`,
  palmer: `${R2}/player/thumb/r7yrsa1770541322.jpg`,
  bellingham: `${R2}/player/thumb/rfg8xd1771263826.jpg`,
  kane: `${R2}/player/thumb/0w9up71770542636.jpg`,
  osimhen: `${R2}/player/thumb/snhzzq1702566147.jpg`,
};

// ---- TEAM IMAGES (TheSportsDB CDN) ----
export const TEAM_IMAGES = {
  bayernFanart: `${R2}/team/fanart/09b7u21519406807.jpg`,
  manCityFanart: `${R2}/team/fanart/t7rbvo1731826240.jpg`,
  bayernBanner: `${R2}/team/banner/vv74jg1565115651.jpg`,
};

// ---- EDITORIAL STORIES ----
// These represent what the automation pipeline will eventually produce.
// Each story is editorially written, SEO-optimized, and ready to display.

export const ARTICLES: Article[] = [
  // ---- FEATURED / HERO ----
  {
    id: "salah-liverpool-exit",
    title: "SALAH CONFIRMS LIVERPOOL EXIT — THE END OF AN ERA",
    excerpt:
      "Mohamed Salah has officially confirmed he is leaving Liverpool this summer after nine years, 223 goals, and one of the greatest careers Anfield has ever seen. The Egyptian King's departure marks the end of an era.",
    body: "Mohamed Salah dropped a video on social media that sent shockwaves through the football world. After nine legendary years at Anfield, 223 goals, and 97 assists, the Egyptian King is walking away as a free agent — his contract being cut short by a full year. Sources close to the player reveal a breakdown in his relationship with manager Arne Slot, who dropped Salah from the starting lineup in three consecutive matches. Al-Hilal, PSG, and Bayern Munich are all circling. The Saudi Pro League remains the frontrunner.",
    category: "Breaking",
    tag: "EXCLUSIVE",
    image: PLAYER_IMAGES.salah,
    imageAlt: "Mohamed Salah",
    author: "Matchday Global",
    publishedAt: "2026-03-29T08:30:00Z",
    readTime: 4,
    featured: true,
    breaking: true,
  },

  // ---- PREMIER LEAGUE ----
  {
    id: "arsenal-title-proof",
    title: "Arsenal Have Already Won the League — Here's the Proof",
    excerpt:
      "70 points from 31 games. A nine-point lead over Man City with seven games left. The title race is over and Arsenal are champions-elect.",
    body: "Look at the numbers. 21 wins. Only 3 losses all season. A nine-point gap over a stumbling Man City side with just seven fixtures remaining. Meanwhile, Spurs lost 3-0 to Nottingham Forest, Liverpool dropped points to Brighton, and Chelsea were embarrassed 3-0 by Everton. Everyone else is falling apart. Arsenal are inevitable. Arteta has built a machine.",
    category: "Premier League",
    tag: "HOT TAKE",
    image: PLAYER_IMAGES.saka,
    imageAlt: "Bukayo Saka celebrating",
    author: "Matchday Global",
    publishedAt: "2026-03-29T07:15:00Z",
    readTime: 3,
    trending: true,
  },
  {
    id: "man-utd-transfer-targets",
    title: "Man United's Summer Transfer Targets Revealed: Hall, Ndiaye, Diomande",
    excerpt:
      "Three names have leaked from Old Trafford's summer transfer shortlist — and one of them is going to shock the football world.",
    body: "Manchester United are preparing to spend big this summer. Three primary targets have emerged: Lewis Hall from Newcastle (22, left-back, English international), Iliman Ndiaye from Everton (the one bright spot in a disaster season at Goodison), and the surprise package — Yan Diomande from RB Leipzig, who has exploded in the Bundesliga with 10 goals and 7 assists from a centre-back/defensive midfielder role. Every top club in Europe wants Diomande. United are leading the race.",
    category: "Transfers",
    tag: "INSIDER",
    image: PLAYER_IMAGES.haaland,
    imageAlt: "Transfer window graphic",
    author: "Matchday Global",
    publishedAt: "2026-03-29T06:00:00Z",
    readTime: 5,
    trending: true,
  },
  {
    id: "zidane-man-united",
    title: "Zidane Emerges as Top Candidate for Man United Manager Role",
    excerpt:
      "Zinedine Zidane has held preliminary talks with Manchester United's hierarchy about becoming the club's next permanent manager.",
    body: "The three-time Champions League winning coach is ready to return to management after four years away. United's board have been impressed by Zidane's vision for rebuilding the club and his track record of getting the best out of galactico-level talent. A decision is expected by the end of April.",
    category: "Premier League",
    tag: "BREAKING",
    image: TEAM_IMAGES.manCityFanart,
    imageAlt: "Manchester United stadium",
    author: "Matchday Global",
    publishedAt: "2026-03-28T22:00:00Z",
    readTime: 3,
    breaking: true,
  },
  {
    id: "spurs-crisis-three-defeats",
    title: "Spurs in Crisis: Three Consecutive Defeats Pile Pressure on Management",
    excerpt:
      "Tottenham have lost three matches in a row, conceding eight goals, with fan protests growing louder after each result.",
    body: "The latest 3-0 humiliation at the hands of Nottingham Forest has pushed Tottenham's season to breaking point. Fan protests erupted outside the stadium, with banners demanding change at board level. The squad looks fractured, the defence is leaking goals, and the January signings have failed to make any impact. Sources suggest the board will review the managerial situation during the international break.",
    category: "Premier League",
    image: PLAYER_IMAGES.kane,
    imageAlt: "Tottenham crisis",
    author: "Matchday Global",
    publishedAt: "2026-03-28T21:30:00Z",
    readTime: 4,
  },
  {
    id: "chelsea-everton-disaster",
    title: "Chelsea's Nightmare: 3-0 Everton Loss Exposes Defensive Fragility",
    excerpt:
      "A shocking defeat at Goodison Park has raised serious questions about Chelsea's defensive structure and their top-four ambitions.",
    body: "Chelsea's Champions League hopes took a devastating blow as Everton ran riot at Goodison Park. Three goals in 25 second-half minutes exposed the fundamental fragility that has plagued this Chelsea side all season. The defence was caught out repeatedly on the counter, and the midfield offered zero protection. With Liverpool and Newcastle breathing down their necks, Chelsea's grip on a top-four spot is slipping fast.",
    category: "Premier League",
    image: PLAYER_IMAGES.palmer,
    imageAlt: "Cole Palmer frustrated",
    author: "Matchday Global",
    publishedAt: "2026-03-28T20:45:00Z",
    readTime: 3,
  },

  // ---- CHAMPIONS LEAGUE ----
  {
    id: "arsenal-sporting-tactical",
    title: "Why Arsenal Will Destroy Sporting in the UCL Quarter-Finals",
    excerpt:
      "The Champions League draw handed Arsenal the perfect opponent. Here's the tactical breakdown of why Sporting Lisbon don't stand a chance.",
    body: "Arsenal's 4-3-3 against Sporting's 3-4-3 creates a fundamental mismatch. Sporting's three-at-the-back leaves massive space in the wide areas. Saka and Arsenal's wingers will have a field day running at wing-backs who have to cover the entire flank. Add Arsenal's relentless high press against a team that likes to build from the back, and mistakes are inevitable. Prediction: Arsenal 5-1 on aggregate.",
    category: "Champions League",
    tag: "ANALYSIS",
    image: PLAYER_IMAGES.saka,
    imageAlt: "Arsenal Champions League",
    author: "Matchday Global",
    publishedAt: "2026-03-28T18:00:00Z",
    readTime: 6,
  },
  {
    id: "bellingham-injury-update",
    title: "Bellingham Injury Update: Real Madrid Star Targets Champions League Return",
    excerpt:
      "Jude Bellingham is ahead of schedule in his recovery and is expected to be fit for Real Madrid's Champions League quarter-final first leg.",
    body: "Real Madrid have received a massive boost with Jude Bellingham returning to full training this week. The England international has been sidelined for three weeks with a hamstring issue but medical staff are confident he will be available for the Champions League quarter-final. Bellingham has been in sensational form this season with 14 goals and 11 assists in all competitions.",
    category: "Champions League",
    image: PLAYER_IMAGES.bellingham,
    imageAlt: "Jude Bellingham",
    author: "Matchday Global",
    publishedAt: "2026-03-28T16:30:00Z",
    readTime: 3,
  },

  // ---- TRANSFERS ----
  {
    id: "griezmann-mls-shock",
    title: "Griezmann Set for Shock MLS Move — Multiple Reports Confirm",
    excerpt:
      "Antoine Griezmann is in advanced talks with an MLS franchise, with a move expected to be completed before the summer transfer window opens.",
    body: "The 35-year-old World Cup winner has decided to leave Atletico Madrid after 10 years across two spells. Multiple sources in France and the United States confirm that Griezmann has agreed personal terms with an MLS club, believed to be Inter Miami or LAFC. The deal would make him one of the highest-paid players in MLS history.",
    category: "Transfers",
    tag: "CONFIRMED",
    image: PLAYER_IMAGES.mbappe,
    imageAlt: "Antoine Griezmann transfer",
    author: "Matchday Global",
    publishedAt: "2026-03-28T14:00:00Z",
    readTime: 3,
    trending: true,
  },
  {
    id: "osimhen-psg-saga",
    title: "PSG Reignite Interest in Victor Osimhen as Striker Search Intensifies",
    excerpt:
      "Paris Saint-Germain have returned with an improved offer for Napoli striker Victor Osimhen, with the Nigerian international now open to a move.",
    body: "After months of speculation, PSG are back in the race for Victor Osimhen. The Nigerian striker has been one of the most sought-after forwards in European football, and PSG's need for a clinical number nine has become desperate. Napoli are holding out for their full asking price, but with Osimhen pushing for the move, a compromise could be reached in the coming weeks.",
    category: "Transfers",
    image: PLAYER_IMAGES.osimhen,
    imageAlt: "Victor Osimhen",
    author: "Matchday Global",
    publishedAt: "2026-03-28T12:00:00Z",
    readTime: 4,
  },

  // ---- INTERNATIONAL ----
  {
    id: "italy-northern-ireland-preview",
    title: "Italy vs Northern Ireland: World Cup Playoff Preview — Can the Azzurri Survive?",
    excerpt:
      "Tonight could be the biggest night in Italian football since 2006. Win or go home. The pressure on the four-time World Cup winners is immense.",
    body: "Italy missed the 2018 World Cup. They barely scraped through qualifying this time. If they lose tonight, a four-time World Cup winner stays home while the rest of the world plays in North America. Northern Ireland have nothing to lose — that makes them dangerous. The key battle: Italy's midfield creativity against Northern Ireland's deep defensive block. Prediction: Italy 2-0, but it won't be comfortable.",
    category: "International",
    tag: "MATCH PREVIEW",
    image: TEAM_IMAGES.bayernBanner,
    imageAlt: "World Cup Qualifier",
    author: "Matchday Global",
    publishedAt: "2026-03-28T10:00:00Z",
    readTime: 5,
  },

  // ---- BUNDESLIGA ----
  {
    id: "bayern-rebuild-summer",
    title: "Bayern Munich's Summer Revolution: Five Players Set to Leave",
    excerpt:
      "Bayern Munich are planning a massive squad overhaul this summer with up to five first-team players expected to be sold to fund a rebuild.",
    body: "The Bavarian giants have identified five players who will be made available for transfer this summer as new sporting director Max Eberl looks to reshape the squad. Bayern's disappointing domestic campaign has accelerated plans for a generational rebuild, with the club targeting younger, hungrier players who fit their new pressing-based style under the manager.",
    category: "Bundesliga",
    image: TEAM_IMAGES.bayernFanart,
    imageAlt: "Bayern Munich",
    author: "Matchday Global",
    publishedAt: "2026-03-28T09:00:00Z",
    readTime: 4,
  },

  // ---- LA LIGA ----
  {
    id: "vinicius-ballon-dor-race",
    title: "Vinicius Jr Leads Ballon d'Or Race After Stunning Champions League Form",
    excerpt:
      "The Brazilian winger has been in devastating form for Real Madrid and is now the clear favourite for football's most prestigious individual award.",
    body: "Vinicius Junior has scored 11 goals in his last 9 Champions League appearances, a run of form that has propelled him to the front of the Ballon d'Or conversation. His combination of pace, skill, and end product has been virtually unplayable this season. Real Madrid's Champions League campaign has been largely built on his shoulders.",
    category: "La Liga",
    image: PLAYER_IMAGES.vinicius,
    imageAlt: "Vinicius Junior",
    author: "Matchday Global",
    publishedAt: "2026-03-27T20:00:00Z",
    readTime: 4,
    trending: true,
  },
];

// ---- HELPER FUNCTIONS ----

export function getFeaturedArticle(): Article | undefined {
  return ARTICLES.find((a) => a.featured);
}

export function getBreakingNews(): Article[] {
  return ARTICLES.filter((a) => a.breaking);
}

export function getTrendingArticles(): Article[] {
  return ARTICLES.filter((a) => a.trending);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getLatestArticles(limit: number = 12): Article[] {
  return [...ARTICLES]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getTransferArticles(): Article[] {
  return ARTICLES.filter((a) => a.category === "Transfers");
}

export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
