import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MatchdayGlobal — The World's Football Operating System",
    template: "%s | MatchdayGlobal",
  },
  description:
    "Live scores, real-time stats, predictions, and community for every football match on Earth. The #1 football platform — powered by AI.",
  keywords: [
    "football",
    "soccer",
    "live scores",
    "Premier League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "Ligue 1",
    "predictions",
    "match stats",
  ],
  openGraph: {
    title: "MatchdayGlobal — The World's Football Operating System",
    description:
      "Live scores, predictions, AI-powered analysis, and the world's best football community.",
    siteName: "MatchdayGlobal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatchdayGlobal",
    description: "The World's Football Operating System",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-mg-bg text-mg-text antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// ---- NAVBAR ----
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-mg-border bg-mg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff88] to-[#4488ff]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-black"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 9.17 4.24-4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
              <path d="m9.17 14.83-4.24 4.24" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">Matchday</span>
            <span className="mg-gradient-text">Global</span>
          </span>
        </a>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/league/8", label: "Premier League" },
            { href: "/league/564", label: "La Liga" },
            { href: "/league/82", label: "Bundesliga" },
            { href: "/league/384", label: "Serie A" },
            { href: "/predictions", label: "Predictions" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-mg-text-muted transition-colors hover:bg-mg-card hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-mg-border bg-mg-card px-4 py-2 text-sm font-medium text-mg-text-muted transition-all hover:border-mg-accent hover:text-mg-accent sm:block">
            Sign In
          </button>
          <button className="rounded-full bg-gradient-to-r from-[#00ff88] to-[#4488ff] px-5 py-2 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-[#00ff88]/20">
            Join Free
          </button>
        </div>
      </div>
    </header>
  );
}

// ---- FOOTER ----
function Footer() {
  return (
    <footer className="border-t border-mg-border bg-mg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-mg-accent">
              Leagues
            </h4>
            <ul className="space-y-2 text-sm text-mg-text-muted">
              <li><a href="/league/8" className="hover:text-white">Premier League</a></li>
              <li><a href="/league/564" className="hover:text-white">La Liga</a></li>
              <li><a href="/league/82" className="hover:text-white">Bundesliga</a></li>
              <li><a href="/league/384" className="hover:text-white">Serie A</a></li>
              <li><a href="/league/301" className="hover:text-white">Ligue 1</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-mg-accent">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-mg-text-muted">
              <li><a href="/predictions" className="hover:text-white">Predictions</a></li>
              <li><a href="#" className="hover:text-white">Live Scores</a></li>
              <li><a href="#" className="hover:text-white">Standings</a></li>
              <li><a href="#" className="hover:text-white">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-mg-accent">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-mg-text-muted">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Affiliate Program</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-mg-accent">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-mg-text-muted">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-mg-border pt-8 md:flex-row">
          <p className="text-sm text-mg-text-muted">
            &copy; 2026 MatchdayGlobal. The World&apos;s Football Operating System.
          </p>
          <div className="flex items-center gap-4 text-mg-text-muted">
            <a href="#" className="transition-colors hover:text-mg-accent" aria-label="X/Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="transition-colors hover:text-mg-accent" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="transition-colors hover:text-mg-accent" aria-label="TikTok">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
