"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDayNumber, getTodayChallenge, getTodayKey } from "@/lib/challenges";
import BrandAtom from "@/components/brand/BrandAtom";
import MobileMenuToggle from "@/components/shared/MobileMenuToggle";

function getTimeGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDashboardWeekDays(lastChallengeDate: string | null, streak: number, now = new Date()) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const offset = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
  const completedDate = lastChallengeDate
    ? new Date(`${lastChallengeDate}T00:00:00`)
    : null;
  const lastCompletedDay = completedDate && !Number.isNaN(completedDate.getTime())
    ? getDayNumber(completedDate)
    : Number.NEGATIVE_INFINITY;

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const daysSinceCompletion = lastCompletedDay - getDayNumber(date);
    return {
      label: labels[index],
      date: date.getDate(),
      done: daysSinceCompletion >= 0 && daysSinceCompletion < streak,
    };
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [streak, setStreak] = useState(5);
  const [xp, setXp] = useState(420);
  const [greeting, setGreeting] = useState("Good evening");
  const [aiPrompt, setAiPrompt] = useState("");
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(true);
  const [weekDays, setWeekDays] = useState(() =>
    ["M", "T", "W", "T", "F", "S", "S"].map((label) => ({ label, date: 0, done: false }))
  );


  const [challenge, setChallenge] = useState(() => ({
    ...getTodayChallenge(new Date(0)),
    // Keep the first render deterministic; replace it with today's challenge after mount.
  }));

  useEffect(() => {
    setGreeting(getTimeGreeting());
    setChallenge(getTodayChallenge());
    setShowDemoGuide(
      localStorage.getItem("qsense-screening-guide-dismissed") !== "true"
    );

    // Preserve the existing demo flow, while keeping all browser storage access
    // inside the effect so the initial render remains deterministic.
    const session = localStorage.getItem("qsense-session");
    if (!session) {
      localStorage.setItem(
        "qsense-session",
        JSON.stringify({
          role: "student",
          email: "student@qsense.demo",
          name: "Lucky",
          demo: true,
        })
      );
    }

    const savedStreak = localStorage.getItem("qsense-streak");
    const savedXP = localStorage.getItem("qsense-xp");
    const completedDate = localStorage.getItem("qsense-last-challenge");

    const parsedStreak = savedStreak === null ? 5 : Number(savedStreak);
    const safeStreak = Number.isFinite(parsedStreak) && parsedStreak >= 0
      ? Math.floor(parsedStreak)
      : 5;

    const parsedXP = savedXP === null ? 420 : Number(savedXP);
    const safeXP = Number.isFinite(parsedXP) && parsedXP >= 0
      ? Math.floor(parsedXP)
      : 420;

    setStreak(safeStreak);
    setXp(safeXP);
    setWeekDays(getDashboardWeekDays(completedDate || null, safeStreak, new Date()));
    setChallengeCompleted(completedDate === getTodayKey());
  }, [router]);

  const trimmedAiPrompt = aiPrompt.trim().slice(0, 500);
  const aiTutorHref = trimmedAiPrompt
    ? `/ai-tutor?prompt=${encodeURIComponent(trimmedAiPrompt)}`
    : "/ai-tutor";

  const navItems = [
    {
      label: "Dashboard",
      icon: "⌂",
      href: "/dashboard",
    },
    {
      label: "Learn",
      icon: "◈",
      href: "/learn",
    },
    {
      label: "Quantum Lab",
      icon: "⌘",
      href: "/quantum-lab",
    },
    {
      label: "Algorithms",
      icon: "◇",
      href: "/algorithms",
    },
    {
      label: "Progress",
      icon: "↗",
      href: "/progress",
    },
    {
      label: "AI Tutor",
      icon: "✦",
      href: "/ai-tutor",
    },
    {
      label: "Challenges",
      icon: "⚡",
      href: "/challenges",
    },
  ];

  return (
      <main className="dashboard-page">
        <MobileMenuToggle sidebarClassName="dashboard-sidebar" brandHref="/dashboard" brandLabel="Q-SENSE" />
        <div className="dashboard-bg-grid" />

      <div className="dashboard-glow dashboard-glow-one" />

      <div className="dashboard-glow dashboard-glow-two" />

      {/* =====================================================
          SIDEBAR
         ===================================================== */}

      <aside className="dashboard-sidebar">
        {/* BRAND */}

        <Link
          href="/dashboard"
          className="dashboard-brand dashboard-brand-link"
        >
          <div className="dashboard-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <div className="dashboard-brand-name">
              Q-SENSE
            </div>

            <div className="dashboard-brand-subtitle">
              Quantum Learning Platform
            </div>
          </div>
        </Link>

        {/* MAIN NAV */}

        <nav className="dashboard-nav">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`dashboard-nav-item ${isActive
                  ? "dashboard-nav-active"
                  : ""
                  }`}
              >
                <span className="dashboard-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* DIVIDER */}

        <div className="dashboard-sidebar-divider" />

        {/* SETTINGS */}

        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={`dashboard-nav-item ${pathname === "/settings"
            ? "dashboard-nav-active"
            : ""
            }`}
        >
          <span className="dashboard-nav-icon">
            ⚙
          </span>

          <span>Settings</span>
        </Link>

        {/* HELP */}

        <Link
          href="/help"
          aria-current={pathname === "/help" ? "page" : undefined}
          className={`dashboard-nav-item ${pathname === "/help"
            ? "dashboard-nav-active"
            : ""
            }`}
        >
          <span className="dashboard-nav-icon">
            ?
          </span>

          <span>Help</span>
        </Link>

        {/* SIDEBAR FOOTER */}

        <div className="dashboard-sidebar-bottom">
          <div className="sidebar-orbit">
            <span />
            <span />
            <span />
          </div>

          <div className="sidebar-bottom-text">
            <strong>Small steps.</strong>
            <br />
            Big quantum leaps.
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN APP
         ===================================================== */}

      <section className="dashboard-main">
        {/* TOPBAR */}

        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
            <strong>Dashboard</strong>
          </div>

          <div className="dashboard-topbar-right">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Notifications"
            >
              ♢

              <span className="dashboard-notification-dot" />
            </button>

            <Link
              href="/settings"
              className="dashboard-profile"
            >
              <div className="dashboard-avatar">
                L
              </div>

              <div className="dashboard-profile-info">
                <span>Hello, Lucky</span>
                <small>Student</small>
              </div>

              <span className="dashboard-profile-arrow">
                ▾
              </span>
            </Link>
          </div>
        </header>

        {/* =====================================================
            CONTENT
           ===================================================== */}

        <div className="dashboard-content">
          {/* GREETING */}

          <section className="dashboard-greeting">
            <div>
              <p className="dashboard-eyebrow">
                YOUR QUANTUM JOURNEY
              </p>

              <h1>
                {greeting}, Lucky{" "}
                <span>👋</span>
              </h1>

              <p className="dashboard-greeting-copy">
                Continue your quantum journey.
                You&apos;re doing great!
              </p>
            </div>

            <div className="dashboard-greeting-side">
              <div className="mini-orbit-system">
                <span className="mini-orbit-line orbit-a" />
                <span className="mini-orbit-line orbit-b" />

                <span className="mini-orbit-dot dot-a" />
                <span className="mini-orbit-dot dot-b" />
                <span className="mini-orbit-dot dot-c" />
              </div>

              <p>
                “Your future self will thank you
                for learning quantum today.”
              </p>
            </div>
          </section>

          {/* SELF-GUIDED SCREENING JOURNEY */}
          {showDemoGuide && (
            <section className="dashboard-demo-guide" aria-labelledby="dashboard-demo-title">
              <div className="dashboard-demo-guide-main">
                <span className="dashboard-demo-kicker">START HERE · 3-MINUTE EXPLORATION</span>
                <h2 id="dashboard-demo-title">Your first quantum experiment</h2>
                <p>
                  Follow one small experiment from concept to result. You do not need quantum hardware or prior setup.
                </p>
                <div className="dashboard-demo-steps">
                  <Link href="/learn" className="dashboard-demo-step">
                    <span>01</span><div><strong>Understand</strong><small>Learn entanglement</small></div><b>→</b>
                  </Link>
                  <Link href="/quantum-lab" className="dashboard-demo-step">
                    <span>02</span><div><strong>Experiment</strong><small>Run H + CNOT</small></div><b>→</b>
                  </Link>
                  <Link href="/ai-tutor" className="dashboard-demo-step">
                    <span>03</span><div><strong>Investigate</strong><small>Ask why the result changed</small></div><b>→</b>
                  </Link>
                  <Link href="/challenges" className="dashboard-demo-step">
                    <span>04</span><div><strong>Check yourself</strong><small>Answer a short challenge</small></div><b>→</b>
                  </Link>
                </div>
              </div>
              <div className="dashboard-demo-guide-actions">
                <Link href="/quantum-lab" className="dashboard-demo-primary">Start with the Bell State <span>→</span></Link>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("qsense-screening-guide-dismissed", "true");
                    setShowDemoGuide(false);
                  }}
                >
                  Dismiss guide
                </button>
              </div>
            </section>
          )}

          {/* =================================================
              CONTINUE + QUICK LAB
             ================================================= */}

          <section className="dashboard-top-cards">
            {/* CONTINUE LEARNING */}

            <div className="dashboard-card continue-card">
              <div className="card-header-row">
                <div>
                  <span className="card-label">
                    CONTINUE LEARNING
                  </span>

                  <h2>Entanglement</h2>
                </div>

                <div className="card-percent">
                  68%
                </div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  role="progressbar"
                  aria-label="Entanglement lesson progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={68}
                  style={{ width: "68%" }}
                />
              </div>

              <p className="card-description">
                Explore how particles can be
                connected across any distance.
              </p>

              <Link
                href="/learn"
                className="primary-dashboard-button"
              >
                Continue Lesson
                <span>→</span>
              </Link>

              <div className="entanglement-visual">
                <div className="entangle-node node-one" />
                <div className="entangle-node node-two" />

                <div className="entangle-wave wave-one" />
                <div className="entangle-wave wave-two" />
                <div className="entangle-wave wave-three" />
              </div>
            </div>

            {/* QUICK LAB */}

            <div className="dashboard-card quick-lab-card">
              <span className="card-label">
                QUICK LAB
              </span>

              <h2>Build a Bell State</h2>

              <p className="card-description">
                Get hands-on with quantum circuits
                and see entanglement happen live.
              </p>

              <div className="mini-circuit">
                <div className="circuit-row">
                  <span>q₀</span>
                  <i />

                  <b>H</b>

                  <i />

                  <b className="cnot">
                    ●
                  </b>

                  <i />
                </div>

                <div className="circuit-row">
                  <span>q₁</span>
                  <i />
                  <i />

                  <b className="cnot target">
                    ⊕
                  </b>

                  <i />
                </div>

                <div className="circuit-connector" />
              </div>

              <Link
                href="/quantum-lab"
                className="secondary-dashboard-button"
              >
                Open Lab
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* =================================================
              DAILY CHALLENGE
             ================================================= */}

          <section className="daily-challenge-card dashboard-card">
            <div className="daily-challenge-left">
              <div className="daily-challenge-badge">
                ⚡ DAILY QUANTUM CHALLENGE
              </div>

              <div className="daily-challenge-title-row">
                <div>
                  <h2>{challenge.title}</h2>

                  <p>
                    {challenge.description}
                  </p>
                </div>

                <div className="daily-reward">
                  <span>✦</span>
                  +{challenge.reward} XP
                </div>
              </div>

              <div className="daily-meta">
                <span>
                  ◉ {challenge.difficulty}
                </span>

                <span>
                  ◌ {challenge.category}
                </span>

                <span>⏱ {challenge.time}</span>
              </div>

              <Link
                href="/challenges"
                className={`challenge-button ${challengeCompleted
                  ? "challenge-completed"
                  : ""
                  }`}
              >
                {challengeCompleted
                  ? "✓ Challenge Completed"
                  : "Start Today's Challenge"}

                {!challengeCompleted && (
                  <span>→</span>
                )}
              </Link>
            </div>

            {/* STREAK */}

            <div className="daily-challenge-right">
              <div className="streak-orb">
                <div className="streak-ring ring-one" />
                <div className="streak-ring ring-two" />
                <div className="streak-ring ring-three" />

                <div className="streak-core">
                  <span>🔥</span>

                  <strong>{streak}</strong>

                  <small>DAY STREAK</small>
                </div>
              </div>

              <div className="weekly-streak">
                <div className="weekly-streak-header">
                  <span>KEEP IT GOING</span>

                  <strong>
                    {streak} days
                  </strong>
                </div>

                <div className="week-dots">
                  {weekDays.map((day, index) => (
                    <div
                      key={`${day.label}-${day.date}-${index}`}
                      className={`week-day ${day.done ? "week-day-done" : ""}`}
                      aria-label={`${day.label} ${day.date}${day.done ? ", completed in current streak" : ""}`}
                    >
                      <span>{day.label}</span>
                      <div className="week-day-circle">
                        {day.done ? "✓" : day.date || "·"}
                      </div>
                    </div>
                  ))}
                </div>

                <p>
                  Complete one challenge every
                  day to protect your streak.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              LEARNING PATH
             ================================================= */}

          <section className="dashboard-card learning-path-card">
            <div className="section-heading-row">
              <div>
                <span className="card-label">
                  YOUR LEARNING PATH
                </span>

                <h2>
                  Master quantum computing step
                  by step.
                </h2>
              </div>

              <Link
                href="/learn"
                className="text-button"
              >
                View Full Path →
              </Link>
            </div>

            <div className="learning-path">
              <div className="path-line" />

              {[
                {
                  title: "Qubits",
                  progress: 100,
                  state: "done",
                },
                {
                  title: "Superposition",
                  progress: 100,
                  state: "done",
                },
                {
                  title: "Entanglement",
                  progress: 68,
                  state: "current",
                },
                {
                  title: "Quantum Gates",
                  progress: 0,
                  state: "locked",
                },
                {
                  title: "Quantum Algorithms",
                  progress: 0,
                  state: "locked",
                },
              ].map((item, index) => (
                <div
                  className={`path-item path-${item.state}`}
                  key={item.title}
                >
                  <div className="path-node">
                    {item.state === "done"
                      ? "✓"
                      : index + 1}
                  </div>

                  <div className="path-item-content">
                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.progress === 100
                        ? "Completed"
                        : item.progress > 0
                          ? `${item.progress}% complete`
                          : "Coming next"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              RECOMMENDED + AI TUTOR
             ================================================= */}

          <section className="dashboard-bottom-grid">
            {/* RECOMMENDED */}

            <div className="dashboard-card recommended-card">
              <span className="card-label">
                RECOMMENDED FOR YOU
              </span>

              <h2>
                Practice controlled gates before
                starting Grover&apos;s Algorithm.
              </h2>

              <p>
                Your recent activity shows that
                controlled operations are the next
                concept worth strengthening.
              </p>

              <Link
                href="/learn"
                className="secondary-dashboard-button"
              >
                Start Practice
                <span>→</span>
              </Link>

              <div className="wave-visual">
                <div />
                <div />
                <div />
              </div>
            </div>

            {/* AI TUTOR */}

            <div className="dashboard-card ai-tutor-card">
              <div className="ai-tutor-top">
                <div className="ai-icon">
                  ✦
                </div>

                <div>
                  <span className="card-label">
                    AI TUTOR
                  </span>

                  <h2>Ask Q-SENSE</h2>
                </div>

                <span className="ai-online">
                  ● Online
                </span>
              </div>

              <p>
                Ask anything about quantum
                computing. I&apos;ll explain it at
                your level.
              </p>

              <div className="ai-input">
                <input
                  aria-label="Ask Q-SENSE a question"
                  value={aiPrompt}
                  maxLength={500}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      router.push(aiTutorHref);
                    }
                  }}
                  placeholder="Explain entanglement in simple terms..."
                />

                <Link href={aiTutorHref} aria-label="Send question to Q-SENSE">
                  →
                </Link>
              </div>

              <div className="ai-prompts">
                <Link href="/ai-tutor?prompt=What%20is%20a%20qubit%3F">
                  What is a qubit?
                </Link>

                <Link href="/ai-tutor?prompt=Explain%20superposition">
                  Explain superposition
                </Link>

                <Link href="/ai-tutor?prompt=Show%20Bell%20state%20circuit">
                  Show Bell state circuit
                </Link>
              </div>
            </div>
          </section>

          {/* =================================================
              STATS
             ================================================= */}

          <section className="dashboard-stats">
            <div className="dashboard-stat">
              <span className="stat-icon">
                ✓
              </span>

              <div>
                <strong>3</strong>

                <span>
                  Lessons Completed
                </span>
              </div>
            </div>

            <div className="dashboard-stat">
              <span className="stat-icon">
                ⌘
              </span>

              <div>
                <strong>1</strong>

                <span>
                  Lab Experiments
                </span>
              </div>
            </div>

            <div className="dashboard-stat">
              <span className="stat-icon">
                ◔
              </span>

              <div>
                <strong>68%</strong>

                <span>
                  Overall Progress
                </span>
              </div>
            </div>

            <div className="dashboard-stat">
              <span className="stat-icon">
                🔥
              </span>

              <div>
                <strong>{streak}</strong>

                <span>
                  Day Streak
                </span>
              </div>
            </div>

            <div className="dashboard-stat">
              <span className="stat-icon">
                ✦
              </span>

              <div>
                <strong>{xp}</strong>

                <span>XP Earned</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}