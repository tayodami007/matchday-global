import { getFixturesByDate, getHomeTeam, getAwayTeam, getMatchStatus, formatDate } from "@/lib/sportmonks";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Predictions — Predict Match Scores & Win",
  description: "Test your football knowledge. Predict match scores, earn XP, climb the global leaderboard, and unlock exclusive badges on MatchdayGlobal.",
};

export const revalidate = 300;

export default async function PredictionsPage() {
  // Get upcoming fixtures for the next 3 days
  const today = new Date();
  const dates = [0, 1, 2].map((offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  });

  const allFixtures = (
    await Promise.all(dates.map((date) => getFixturesByDate(date)))
  ).flat();

  const upcoming = allFixtures.filter((f) => {
    const status = getMatchStatus(f);
    return status.isUpcoming;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-mg-border bg-mg-surface">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[30%] h-[60%] w-[40%] rounded-full bg-[#00ff88]/[0.04] blur-[100px]" />
          <div className="absolute -right-[10%] top-[20%] h-[50%] w-[30%] rounded-full bg-[#8844ff]/[0.04] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mg-accent/20 bg-mg-accent/5 px-4 py-1.5 text-sm font-semibold text-mg-accent">
            Free to Play
          </div>
          <h1 className="text-4xl font-black text-white sm:text-6xl">
            Predict &amp; Win
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mg-text-muted">
            Test your football knowledge. Predict match scores, earn XP, climb
            the global leaderboard, and unlock exclusive badges.
          </p>

          {/* How it works */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Predict",
                desc: "Submit your score prediction before kickoff",
              },
              {
                step: "2",
                title: "Watch",
                desc: "Follow the match live with the community",
              },
              {
                step: "3",
                title: "Win",
                desc: "Earn XP for correct predictions, climb the leaderboard",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="mg-card flex flex-col items-center p-6 text-center"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00ff88] to-[#4488ff] text-lg font-extrabold text-black">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-mg-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mg-card mb-8 overflow-hidden">
          <div className="border-b border-mg-border px-4 py-3">
            <h2 className="text-sm font-bold text-white">Scoring System</h2>
          </div>
          <div className="grid grid-cols-3 divide-x divide-mg-border">
            <div className="p-4 text-center">
              <span className="text-3xl font-black mg-gradient-text">50</span>
              <p className="mt-1 text-xs font-medium text-mg-text-muted">
                Exact Score
              </p>
            </div>
            <div className="p-4 text-center">
              <span className="text-3xl font-black text-mg-blue">15</span>
              <p className="mt-1 text-xs font-medium text-mg-text-muted">
                Correct Result
              </p>
            </div>
            <div className="p-4 text-center">
              <span className="text-3xl font-black text-mg-text-muted">0</span>
              <p className="mt-1 text-xs font-medium text-mg-text-muted">
                Wrong
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Matches */}
        <h2 className="mb-4 text-xl font-extrabold text-white">
          Upcoming Matches
        </h2>

        {upcoming.length === 0 ? (
          <div className="mg-card flex flex-col items-center px-8 py-16 text-center">
            <h3 className="text-lg font-bold text-white">
              No upcoming matches to predict
            </h3>
            <p className="mt-2 text-sm text-mg-text-muted">
              Check back when league fixtures resume.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 20).map((fixture) => {
              const home = getHomeTeam(fixture);
              const away = getAwayTeam(fixture);
              const status = getMatchStatus(fixture);

              return (
                <div key={fixture.id} className="mg-card overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {home?.image_path && (
                        <Image
                          src={home.image_path}
                          alt={home.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 shrink-0 object-contain"
                        />
                      )}
                      <span className="truncate text-sm font-bold text-white">
                        {home?.name || "Home"}
                      </span>
                    </div>

                    {/* Prediction Inputs */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="-"
                        className="h-10 w-12 rounded-lg border border-mg-border bg-mg-surface text-center text-lg font-bold text-white outline-none focus:border-mg-accent"
                        disabled
                      />
                      <span className="text-sm font-light text-mg-text-muted">
                        vs
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="-"
                        className="h-10 w-12 rounded-lg border border-mg-border bg-mg-surface text-center text-lg font-bold text-white outline-none focus:border-mg-accent"
                        disabled
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                      <span className="truncate text-right text-sm font-bold text-white">
                        {away?.name || "Away"}
                      </span>
                      {away?.image_path && (
                        <Image
                          src={away.image_path}
                          alt={away.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 shrink-0 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-mg-border bg-mg-surface px-4 py-2">
                    <span className="text-xs text-mg-text-muted">
                      {formatDate(fixture.starting_at)} &middot;{" "}
                      {status.displayText}
                    </span>
                    <button className="rounded-lg bg-mg-accent/10 px-4 py-1 text-xs font-bold text-mg-accent transition-colors hover:bg-mg-accent/20">
                      Sign up to predict
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
