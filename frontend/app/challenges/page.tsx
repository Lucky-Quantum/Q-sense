"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CHALLENGES, calculateNextStreak, getDayNumber, getTodayChallenge, getTodayKey } from "@/lib/challenges";
import type { Challenge } from "@/lib/challenges";
import BrandAtom from "@/components/brand/BrandAtom";

const categories = [
  "All",
  "Quantum Basics",
  "Quantum Gates",
  "Circuits",
  "Algorithms",
  "Visualization",
];

export default function ChallengesPage() {
  const router = useRouter();

  const [streak, setStreak] = useState(5);
  const [xp, setXp] = useState(420);
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] =
    useState("All");
  const [search, setSearch] = useState("");
  const [lastChallengeDate, setLastChallengeDate] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "wrong">("idle");

  const dailyChallenge = useMemo(() => getTodayChallenge(), []);

  useEffect(() => {
    const session =
      localStorage.getItem("qsense-session");

    if (!session) {
      router.replace("/login");
      return;
    }

    const savedStreak =
      localStorage.getItem("qsense-streak");

    const savedXP =
      localStorage.getItem("qsense-xp");

    const savedCompleted =
      localStorage.getItem(
        "qsense-completed-challenges"
      );

    const savedLastChallenge =
      localStorage.getItem("qsense-last-challenge");

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

    if (savedXP) {
      setXp(Number(savedXP));
    }

    if (savedCompleted) {
      try {
        setCompleted(
          JSON.parse(savedCompleted)
        );
      } catch {
        setCompleted([]);
      }
    }

    setLastChallengeDate(savedLastChallenge);
  }, [router]);

  const beginChallenge = (challenge: Challenge) => {
    if (completed.includes(challenge.id)) return;
    setActiveChallenge(challenge);
    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  const submitChallenge = () => {
    if (!activeChallenge || selectedAnswer === null) return;
    if (selectedAnswer === activeChallenge.answerIndex) {
      setAnswerState("correct");
      completeChallenge(activeChallenge);
    } else {
      setAnswerState("wrong");
    }
  };

  const completeChallenge = (
    challenge: Challenge
  ) => {
    if (completed.includes(challenge.id)) {
      return;
    }

    const nextCompleted = [
      ...completed,
      challenge.id,
    ];

    const nextXP = xp + challenge.reward;
    const isDaily = challenge.id === dailyChallenge.id;
    const todayKey = getTodayKey();
    const nextStreak = isDaily
      ? calculateNextStreak(
          streak,
          lastChallengeDate,
          new Date()
        )
      : streak;

    setCompleted(nextCompleted);
    setXp(nextXP);
    if (isDaily) {
      setStreak(nextStreak);
      setLastChallengeDate(todayKey);
    }

    localStorage.setItem(
      "qsense-completed-challenges",
      JSON.stringify(nextCompleted)
    );

    localStorage.setItem(
      "qsense-xp",
      String(nextXP)
    );

    if (isDaily) {
      localStorage.setItem(
        "qsense-last-challenge",
        todayKey
      );

      localStorage.setItem(
        "qsense-streak",
        String(nextStreak)
      );
    }
  };

  const filteredChallenges =
    CHALLENGES.filter((challenge) => {
      const categoryMatch =
        activeCategory === "All" ||
        challenge.category === activeCategory;

      const searchMatch =
        challenge.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        challenge.description
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });

  const completedCount = completed.length;
  const weekDays = useMemo(() => {
    const now = new Date();
    const weekdayOffset = (now.getDay() + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - weekdayOffset);
    const lastCompletedDay = lastChallengeDate
      ? getDayNumber(new Date(`${lastChallengeDate}T00:00:00`))
      : Number.NEGATIVE_INFINITY;
    const labels = ["M", "T", "W", "T", "F", "S", "S"];

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const offsetFromLast = lastCompletedDay - getDayNumber(date);
      return {
        label: labels[index],
        date: date.getDate(),
        done: offsetFromLast >= 0 && offsetFromLast < streak,
      };
    });
  }, [lastChallengeDate, streak]);

  return (
    <main className="challenges-page">
      <div className="challenges-bg-grid" />
      <div className="challenges-glow challenges-glow-one" />
      <div className="challenges-glow challenges-glow-two" />

      {/* SIDEBAR */}

      <aside className="challenges-sidebar">
        <div className="challenges-brand">
          <div className="challenges-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>
              Quantum Learning Platform
            </span>
          </div>
        </div>

        <nav className="challenges-nav">
          <ChallengeNav
            label="Dashboard"
            icon="⌂"
            href="/dashboard"
          />

          <ChallengeNav
            label="Learn"
            icon="◈"
            href="/learn"
          />

          <ChallengeNav
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />

          <ChallengeNav
            label="Algorithms"
            icon="◇"
            href="/algorithms"
          />

          <ChallengeNav
            label="Progress"
            icon="↗"
            href="/progress"
          />

          <ChallengeNav
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
          />
        </nav>

        <div className="challenges-sidebar-divider" />

        <ChallengeNav
          label="Challenges"
          icon="⚡"
          href="/challenges"
          active
        />

        <ChallengeNav
          label="Settings"
          icon="⚙"
          href="/settings"
        />

        <ChallengeNav
          label="Help"
          icon="?"
          href="/help"
        />

        <div className="challenges-sidebar-footer">
          <div className="challenge-footer-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Stay curious.</strong>
            <br />
            Keep your quantum streak alive.
          </p>
        </div>
      </aside>

      {/* MAIN */}

      <section className="challenges-main">
        {/* TOPBAR */}

        <header className="challenges-topbar">
          <div className="challenges-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>Challenges</strong>
          </div>

          <div className="challenges-profile">
            <button className="challenge-notification">
              ♢
              <span />
            </button>

            <div className="challenge-avatar">
              L
            </div>

            <div className="challenge-profile-info">
              <strong>Hello, Lucky</strong>
              <small>Student</small>
            </div>

            <span>▾</span>
          </div>
        </header>

        <div className="challenges-content">
          {/* HERO */}

          <section className="challenges-hero">
            <div>
              <p className="challenges-eyebrow">
                DAILY QUANTUM PRACTICE
              </p>

              <h1>
                Learn a little.
                <br />
                <span>Think quantum.</span>
                <br />
                Every day.
              </h1>

              <p className="challenges-hero-copy">
                Complete short quantum challenges,
                earn XP and protect your daily streak
                while building real intuition.
              </p>
            </div>

            <div className="challenge-hero-orb">
              <div className="challenge-orb-ring ring-a" />
              <div className="challenge-orb-ring ring-b" />
              <div className="challenge-orb-ring ring-c" />

              <div className="challenge-orb-core">
                <span>🔥</span>
                <strong>{streak}</strong>
                <small>DAY STREAK</small>
              </div>
            </div>
          </section>

          {/* STATS */}

          <section className="challenge-stats">
            <div>
              <span>🔥</span>
              <strong>{streak}</strong>
              <small>Current Streak</small>
            </div>

            <div>
              <span>✦</span>
              <strong>{xp}</strong>
              <small>Total XP</small>
            </div>

            <div>
              <span>✓</span>
              <strong>{completedCount}</strong>
              <small>Challenges Done</small>
            </div>

            <div>
              <span>⚡</span>
              <strong>
                {Math.max(
                  0,
                  8 - completedCount
                )}
              </strong>
              <small>Remaining</small>
            </div>
          </section>

          {/* TODAY'S CHALLENGE */}

          <section className="today-challenge">
            <div className="today-challenge-content">
              <div className="today-badge">
                ⚡ TODAY&apos;S CHALLENGE
              </div>

              <h2>{dailyChallenge.title}</h2>

              <p>
                {dailyChallenge.description}
              </p>

              <div className="today-meta">
                <span>
                  ◉ {dailyChallenge.difficulty}
                </span>

                <span>
                  ◌ {dailyChallenge.category}
                </span>

                <span>
                  ⏱ {dailyChallenge.time}
                </span>

                <span className="today-xp">
                  ✦ +{dailyChallenge.reward} XP
                </span>
              </div>

              <button
                className="start-challenge-button"
                onClick={() => beginChallenge(dailyChallenge)}
                disabled={completed.includes(dailyChallenge.id)}
              >
                {completed.includes(
                  dailyChallenge.id
                )
                  ? "✓ Completed Today"
                  : "Start Today's Challenge"}

                {!completed.includes(
                  dailyChallenge.id
                ) && <span>→</span>}
              </button>
            </div>

            <div className="today-challenge-visual">
              <div className="challenge-circuit">
                <div>
                  <span>q₀</span>
                  <i />
                  <b>H</b>
                  <i />
                  <b>●</b>
                  <i />
                </div>

                <div>
                  <span>q₁</span>
                  <i />
                  <i />
                  <b>⊕</b>
                  <i />
                </div>
              </div>

              <div className="challenge-visual-glow" />
            </div>
          </section>

          {/* WEEK */}

          <section className="weekly-card">
            <div className="weekly-card-header">
              <div>
                <span className="challenges-eyebrow">
                  YOUR WEEK
                </span>

                <h2>
                  Protect your streak
                </h2>
              </div>

              <strong>
                {streak} day streak 🔥
              </strong>
            </div>

            <div className="weekly-days">
              {weekDays.map((day, index) => (
                <div
                  className={
                    day.done
                      ? "weekly-day weekly-day-done"
                      : "weekly-day"
                  }
                  key={`${day.label}-${day.date}-${index}`}
                  aria-label={`${day.label} ${day.date}${day.done ? ", completed in current streak" : ""}`}
                >
                  <span>{day.label}</span>
                  <div>{day.done ? "✓" : day.date}</div>
                </div>
              ))}
            </div>

            <p>
              One small challenge every day keeps
              your quantum momentum alive.
            </p>
          </section>

          {/* LIBRARY HEADER */}

          <section className="challenge-library-heading">
            <div>
              <span className="challenges-eyebrow">
                CHALLENGE LIBRARY
              </span>

              <h2>
                Test your quantum thinking
              </h2>

              <p>
                Choose a challenge and sharpen a
                different part of your quantum
                intuition.
              </p>
            </div>

            <div className="challenge-library-tools">
              <div className="challenges-search challenge-library-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search challenges..."
                  aria-label="Search challenges"
                />
              </div>

              <div className="challenge-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "challenge-filter-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
              </div>
            </div>
          </section>

          {/* CHALLENGE GRID */}

          <section className="challenge-grid">
            {filteredChallenges.map(
              (challenge) => {
                const isCompleted =
                  completed.includes(
                    challenge.id
                  );

                return (
                  <article
                    className="challenge-card"
                    key={challenge.id}
                  >
                    <div className="challenge-card-top">
                      <div className="challenge-type-icon">
                        {challenge.type ===
                        "circuit"
                          ? "⌘"
                          : challenge.type ===
                            "quiz"
                          ? "?"
                          : "◈"}
                      </div>

                      <span
                        className={`challenge-difficulty challenge-${challenge.difficulty.toLowerCase()}`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <span className="challenge-category">
                      {challenge.category}
                    </span>

                    <h3>{challenge.title}</h3>

                    <p>
                      {challenge.description}
                    </p>

                    <div className="challenge-card-meta">
                      <span>
                        ⏱ {challenge.time}
                      </span>

                      <span>
                        ✦ +{challenge.reward} XP
                      </span>
                    </div>

                    <button
                      className={
                        isCompleted
                          ? "challenge-card-completed"
                          : ""
                      }
                      onClick={() => beginChallenge(challenge)}
                      disabled={isCompleted}
                    >
                      {isCompleted
                        ? "✓ Completed"
                        : "Start Challenge"}

                      {!isCompleted && (
                        <span>→</span>
                      )}
                    </button>
                  </article>
                );
              }
            )}
          </section>

          {activeChallenge && (
            <div className="challenge-modal-backdrop" role="dialog" aria-modal="true">
              <section className="challenge-modal">
                <button
                  type="button"
                  className="challenge-modal-close"
                  onClick={() => setActiveChallenge(null)}
                  aria-label="Close challenge"
                >
                  ×
                </button>

                <span className="challenges-eyebrow">{activeChallenge.category.toUpperCase()}</span>
                <h2>{activeChallenge.title}</h2>
                <p className="challenge-modal-description">{activeChallenge.question}</p>

                <div className="challenge-options">
                  {activeChallenge.options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={selectedAnswer === index ? "challenge-option-selected" : ""}
                      onClick={() => {
                        setSelectedAnswer(index);
                        if (answerState !== "idle") setAnswerState("idle");
                      }}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>

                {answerState === "wrong" && (
                  <div className="challenge-answer-feedback wrong">Not quite. Re-read the circuit idea and try again.</div>
                )}

                {answerState === "correct" && (
                  <div className="challenge-answer-feedback correct">Correct. {activeChallenge.explanation}</div>
                )}

                <div className="challenge-modal-actions">
                  {activeChallenge.type === "circuit" && (
                    <button type="button" className="challenge-lab-link" onClick={() => router.push("/quantum-lab")}>Open Quantum Lab →</button>
                  )}

                  <button
                    type="button"
                    className="challenge-submit-button"
                    onClick={submitChallenge}
                    disabled={selectedAnswer === null || answerState === "correct"}
                  >
                    {answerState === "correct" ? "Completed ✓" : "Check Answer"}
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* MOTIVATION */}

          <section className="challenge-motivation">
            <div className="motivation-symbol">
              ✦
            </div>

            <div>
              <span>
                YOUR NEXT QUANTUM LEAP
              </span>

              <h2>
                Consistency beats complexity.
              </h2>

              <p>
                You don&apos;t need to master
                quantum computing in one day.
                Just solve one challenge today.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/dashboard")
              }
            >
              Back to Dashboard →
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

function ChallengeNav({
  label,
  icon,
  href,
  active = false,
}: {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`challenges-nav-item ${
        active
          ? "challenges-nav-active"
          : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}