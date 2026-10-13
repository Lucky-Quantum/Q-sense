"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";

const MODULES = [
  {
    title: "Qubits & Quantum States",
    category: "FOUNDATIONS",
    progress: 100,
    lessons: "6 / 6",
    icon: "◉",
    status: "completed",
  },
  {
    title: "Superposition",
    category: "FOUNDATIONS",
    progress: 100,
    lessons: "5 / 5",
    icon: "◌",
    status: "completed",
  },
  {
    title: "Entanglement",
    category: "CORE CONCEPTS",
    progress: 68,
    lessons: "4 / 6",
    icon: "∞",
    status: "current",
  },
  {
    title: "Quantum Gates",
    category: "CIRCUITS",
    progress: 0,
    lessons: "0 / 7",
    icon: "⌘",
    status: "locked",
  },
  {
    title: "Quantum Algorithms",
    category: "ALGORITHMS",
    progress: 0,
    lessons: "0 / 8",
    icon: "◇",
    status: "locked",
  },
];

const SKILLS = [
  {
    name: "Quantum Fundamentals",
    value: 92,
    description: "Qubits, measurement & states",
  },
  {
    name: "Superposition",
    value: 84,
    description: "Amplitude & probability",
  },
  {
    name: "Entanglement",
    value: 68,
    description: "Multi-qubit reasoning",
  },
  {
    name: "Quantum Circuits",
    value: 42,
    description: "Gate composition & debugging",
  },
  {
    name: "Algorithms",
    value: 18,
    description: "Algorithmic intuition",
  },
];

const ACTIVITY = [
  {
    icon: "✓",
    title: "Completed Superposition",
    detail: "Lesson 5 of 5",
    time: "Today",
    type: "lesson",
  },
  {
    icon: "⚡",
    title: "Completed daily challenge",
    detail: "Quantum practice",
    time: "Today",
    type: "challenge",
  },
  {
    icon: "⌘",
    title: "Built a Bell State",
    detail: "Quantum Lab",
    time: "Yesterday",
    type: "lab",
  },
  {
    icon: "◈",
    title: "Started Entanglement",
    detail: "Lesson 4 of 6",
    time: "2 days ago",
    type: "lesson",
  },
];

const ACHIEVEMENTS = [
  {
    icon: "✦",
    title: "First Quantum Step",
    description: "Complete your first lesson",
    unlocked: true,
  },
  {
    icon: "🔥",
    title: "Streak Starter",
    description: "Maintain a 3-day streak",
    unlocked: true,
  },
  {
    icon: "∞",
    title: "Entanglement Explorer",
    description: "Reach 50% in Entanglement",
    unlocked: true,
  },
  {
    icon: "⌘",
    title: "Circuit Builder",
    description: "Complete 5 circuit labs",
    unlocked: false,
  },
  {
    icon: "◇",
    title: "Algorithm Thinker",
    description: "Complete your first algorithm",
    unlocked: false,
  },
  {
    icon: "⚛",
    title: "Quantum Ready",
    description: "Reach 80% overall progress",
    unlocked: false,
  },
];

function getLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

function getLevelProgress(xp: number) {
  const levelXP = xp % 250;
  return Math.min(100, Math.round((levelXP / 250) * 100));
}

export default function ProgressPage() {
  const router = useRouter();

  const [xp, setXp] = useState(420);
  const [streak, setStreak] = useState(5);
  const [completedChallenges, setCompletedChallenges] =
    useState<number[]>([]);
  const [activeRange, setActiveRange] = useState("Week");

  useEffect(() => {
    const session = localStorage.getItem("qsense-session");

    if (!session) {
      router.replace("/login");
      return;
    }

    const savedXP = localStorage.getItem("qsense-xp");
    const savedStreak = localStorage.getItem("qsense-streak");
    const savedChallenges = localStorage.getItem(
      "qsense-completed-challenges"
    );

    if (savedXP) {
      const parsed = Number(savedXP);
      if (!Number.isNaN(parsed)) {
        setXp(parsed);
      }
    }

    if (savedStreak) {
      const parsed = Number(savedStreak);
      if (!Number.isNaN(parsed)) {
        setStreak(parsed);
      }
    }

    if (savedChallenges) {
      try {
        const parsed = JSON.parse(savedChallenges);

        if (Array.isArray(parsed)) {
          setCompletedChallenges(parsed);
        }
      } catch {
        setCompletedChallenges([]);
      }
    }
  }, [router]);

  const level = useMemo(() => getLevel(xp), [xp]);

  const levelProgress = useMemo(
    () => getLevelProgress(xp),
    [xp]
  );

  const nextLevelXP =
    level * 250;

  const completedLessons = 15;

  const overallProgress = 54;

  const totalLabs =
    Math.max(1, completedChallenges.length + 2);

  const challengeXP = completedChallenges.reduce((sum, challengeId) => sum + 1, 0);

  return (
    <main className="progress-page">
      <div className="progress-grid-bg" />

      <div className="progress-glow progress-glow-one" />
      <div className="progress-glow progress-glow-two" />

      {/* SIDEBAR */}

      <aside className="progress-sidebar">
        <div className="progress-brand">
          <div className="progress-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>Quantum Learning Platform</span>
          </div>
        </div>

        <nav className="progress-nav">
          <ProgressNav
            label="Dashboard"
            icon="⌂"
            href="/dashboard"
          />

          <ProgressNav
            label="Learn"
            icon="◈"
            href="/learn"
          />

          <ProgressNav
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />

          <ProgressNav
            label="Algorithms"
            icon="◇"
            href="/algorithms"
          />

          <ProgressNav
            label="Progress"
            icon="↗"
            href="/progress"
            active
          />

          <ProgressNav
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
          />

          <ProgressNav
            label="Challenges"
            icon="⚡"
            href="/challenges"
          />
        </nav>

        <div className="progress-sidebar-divider" />

        <ProgressNav
          label="Settings"
          icon="⚙"
          href="/settings"
        />

        <ProgressNav
          label="Help"
          icon="?"
          href="/help"
        />

        <div className="progress-sidebar-footer">
          <div className="progress-mini-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Keep going.</strong>
            <br />
            Every concept mastered moves you
            closer to quantum fluency.
          </p>
        </div>
      </aside>

      {/* MAIN */}

      <section className="progress-main">
        {/* TOPBAR */}

        <header className="progress-topbar">
          <div className="progress-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>Progress</strong>
          </div>

          <div className="progress-profile">
            <button className="progress-notification">
              ♢
              <span />
            </button>

            <div className="progress-avatar">
              L
            </div>

            <div className="progress-profile-info">
              <strong>Hello, Lucky</strong>
              <small>Student</small>
            </div>

            <span className="progress-profile-arrow">
              ▾
            </span>
          </div>
        </header>

        {/* CONTENT */}

        <div className="progress-content">
          {/* HEADER */}

          <section className="progress-page-heading">
            <div>
              <p className="progress-eyebrow">
                LEARNING ANALYTICS
              </p>

              <h1>
                Your quantum
                <span> progress.</span>
              </h1>

              <p className="progress-heading-copy">
                Track your learning journey, understand
                your strongest skills and see what to
                focus on next.
              </p>
            </div>

            <div className="progress-level-card">
              <div className="progress-level-orbit">
                <div className="progress-level-core">
                  <strong>LV</strong>
                  <span>{level}</span>
                </div>
              </div>

              <div>
                <small>CURRENT LEVEL</small>
                <h3>Quantum Explorer</h3>

                <div className="progress-level-bar">
                  <div
                    style={{
                      width: `${levelProgress}%`,
                    }}
                  />
                </div>

                <p>
                  {xp} / {nextLevelXP} XP
                </p>
              </div>
            </div>
          </section>

          <div className="progress-demo-data-note">
            <span>DEMO LEARNER PROFILE</span>
            <p>XP, streak and challenge completion are stored in this browser. Curriculum and skill percentages are sample learning-path data, not live classroom analytics.</p>
          </div>

          {/* OVERVIEW STATS */}

          <section className="progress-overview-grid">
            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                ↗
              </div>

              <span>OVERALL PROGRESS</span>

              <strong>{overallProgress}%</strong>

              <div className="progress-stat-line">
                <div
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <small>
                Keep building your foundations
              </small>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                ◈
              </div>

              <span>LESSONS COMPLETED</span>

              <strong>{completedLessons}</strong>

              <div className="progress-stat-secondary">
                <b>+2</b>
                <small>this week</small>
              </div>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                ⌘
              </div>

              <span>LAB SESSIONS</span>

              <strong>{totalLabs}</strong>

              <div className="progress-stat-secondary">
                <b>Quantum Lab</b>
                <small>hands-on practice</small>
              </div>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                🔥
              </div>

              <span>STREAK</span>

              <strong>{streak}</strong>

              <div className="progress-stat-secondary">
                <b>days</b>
                <small>keep it alive</small>
              </div>
            </div>
          </section>

          {/* XP + ACTIVITY */}

          <section className="progress-two-column">
            <div className="progress-panel xp-panel">
              <div className="progress-panel-header">
                <div>
                  <span className="progress-section-label">
                    XP ACTIVITY
                  </span>
                  <h2>Learning momentum</h2>
                </div>

                <div className="progress-range-switch">
                  {["Week", "Month"].map((range) => (
                    <button
                      key={range}
                      className={
                        activeRange === range
                          ? "progress-range-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveRange(range)
                      }
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="progress-chart">
                <div className="progress-chart-y">
                  <span>250</span>
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                <div className="progress-chart-area">
                  <div className="progress-chart-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <svg
                    className="progress-chart-svg"
                    viewBox="0 0 700 240"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="progressChartFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8257f5"
                          stopOpacity="0.32"
                        />
                        <stop
                          offset="100%"
                          stopColor="#8257f5"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 205 C60 195 70 168 125 181 C180 194 205 128 255 147 C302 166 335 99 390 120 C445 140 475 72 520 99 C570 127 605 48 700 66 L700 240 L0 240 Z"
                      fill="url(#progressChartFill)"
                    />

                    <path
                      d="M0 205 C60 195 70 168 125 181 C180 194 205 128 255 147 C302 166 335 99 390 120 C445 140 475 72 520 99 C570 127 605 48 700 66"
                      fill="none"
                      stroke="#946eff"
                      strokeWidth="3"
                    />

                    {[
                      [0, 205],
                      [125, 181],
                      [255, 147],
                      [390, 120],
                      [520, 99],
                      [700, 66],
                    ].map(([cx, cy], index) => (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r="5"
                        fill="#0b0e22"
                        stroke="#a37cff"
                        strokeWidth="3"
                      />
                    ))}
                  </svg>

                  <div className="progress-chart-x">
                    {activeRange === "Week" ? (
                      <>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </>
                    ) : (
                      <>
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="progress-xp-summary">
                <div>
                  <span>Challenges completed</span>
                  <strong>{challengeXP}</strong>
                </div>

                <div>
                  <span>Total XP</span>
                  <strong>{xp} XP</strong>
                </div>

                <div>
                  <span>XP to next level</span>
                  <strong>{nextLevelXP - xp} XP</strong>
                </div>
              </div>
            </div>

            <div className="progress-panel activity-panel">
              <div className="progress-panel-header">
                <div>
                  <span className="progress-section-label">
                    RECENT ACTIVITY
                  </span>
                  <h2>What you&apos;ve done</h2>
                </div>
              </div>

              <div className="progress-activity-list">
                {ACTIVITY.map((item, index) => (
                  <div
                    className="progress-activity-item"
                    key={`${item.title}-${index}`}
                  >
                    <div
                      className={`progress-activity-icon progress-activity-${item.type}`}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>

                    <span>{item.time}</span>
                  </div>
                ))}
              </div>

              <button
                className="progress-view-challenges"
                onClick={() =>
                  router.push("/challenges")
                }
              >
                View Challenges →
              </button>
            </div>
          </section>

          {/* MODULE PROGRESS */}

          <section className="progress-section">
            <div className="progress-section-heading">
              <div>
                <span className="progress-section-label">
                  LEARNING PATH
                </span>

                <h2>Module progress</h2>

                <p>
                  See exactly where you are in your
                  quantum learning journey.
                </p>
              </div>

              <button
                onClick={() => router.push("/learn")}
              >
                Continue Learning →
              </button>
            </div>

            <div className="progress-module-list">
              {MODULES.map((module) => (
                <div
                  className={`progress-module ${
                    module.status === "current"
                      ? "progress-module-current"
                      : ""
                  } ${
                    module.status === "locked"
                      ? "progress-module-locked"
                      : ""
                  }`}
                  key={module.title}
                >
                  <div className="progress-module-icon">
                    {module.icon}
                  </div>

                  <div className="progress-module-main">
                    <div className="progress-module-title">
                      <div>
                        <span>
                          {module.category}
                        </span>

                        <h3>{module.title}</h3>
                      </div>

                      <strong>
                        {module.progress}%
                      </strong>
                    </div>

                    <div className="progress-module-bar">
                      <div
                        style={{
                          width: `${module.progress}%`,
                        }}
                      />
                    </div>

                    <small>
                      {module.lessons} lessons completed
                    </small>
                  </div>

                  <div className="progress-module-status">
                    {module.status === "completed" && (
                      <span className="progress-completed">
                        ✓ Complete
                      </span>
                    )}

                    {module.status === "current" && (
                      <button
                        onClick={() =>
                          router.push("/learn")
                        }
                      >
                        Continue
                      </button>
                    )}

                    {module.status === "locked" && (
                      <span className="progress-locked">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SKILLS */}

          <section className="progress-two-column skills-layout">
            <div className="progress-panel skills-panel">
              <div className="progress-panel-header">
                <div>
                  <span className="progress-section-label">
                    SKILL MATRIX
                  </span>

                  <h2>Quantum skill breakdown</h2>
                </div>
              </div>

              <div className="progress-skills-list">
                {SKILLS.map((skill) => (
                  <div
                    className="progress-skill"
                    key={skill.name}
                  >
                    <div className="progress-skill-heading">
                      <div>
                        <strong>{skill.name}</strong>
                        <small>
                          {skill.description}
                        </small>
                      </div>

                      <b>{skill.value}%</b>
                    </div>

                    <div className="progress-skill-bar">
                      <div
                        style={{
                          width: `${skill.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-panel focus-panel">
              <span className="progress-section-label">
                NEXT FOCUS
              </span>

              <div className="focus-orb">
                <div>∞</div>
              </div>

              <h2>Strengthen Entanglement</h2>

              <p>
                You&apos;re making good progress. Finish
                the remaining Entanglement lessons to
                unlock Quantum Gates.
              </p>

              <div className="focus-progress">
                <div>
                  <span>Current</span>
                  <strong>68%</strong>
                </div>

                <div className="focus-bar">
                  <div style={{ width: "68%" }} />
                </div>
              </div>

              <button
                onClick={() => router.push("/learn")}
              >
                Continue Module →
              </button>
            </div>
          </section>

          {/* ACHIEVEMENTS */}

          <section className="progress-section">
            <div className="progress-section-heading">
              <div>
                <span className="progress-section-label">
                  ACHIEVEMENTS
                </span>

                <h2>Milestones you&apos;re reaching</h2>

                <p>
                  Unlock achievements as your quantum
                  skills grow.
                </p>
              </div>

              <span className="progress-achievement-count">
                {
                  ACHIEVEMENTS.filter(
                    (item) => item.unlocked
                  ).length
                } / {ACHIEVEMENTS.length} unlocked
              </span>
            </div>

            <div className="progress-achievement-grid">
              {ACHIEVEMENTS.map((achievement) => (
                <div
                  className={`progress-achievement ${
                    achievement.unlocked
                      ? "progress-achievement-unlocked"
                      : "progress-achievement-locked"
                  }`}
                  key={achievement.title}
                >
                  <div className="achievement-icon">
                    {achievement.unlocked
                      ? achievement.icon
                      : "•"}
                  </div>

                  <div>
                    <h3>{achievement.title}</h3>

                    <p>
                      {achievement.description}
                    </p>

                    <span>
                      {achievement.unlocked
                        ? "UNLOCKED"
                        : "LOCKED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}

          <section className="progress-bottom-cta">
            <div className="progress-cta-symbol">
              ✦
            </div>

            <div>
              <span>READY FOR THE NEXT STEP?</span>

              <h2>
                Turn progress into understanding.
              </h2>

              <p>
                Head back to the Quantum Lab and put
                your concepts into practice.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/quantum-lab")
              }
            >
              Open Quantum Lab →
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

function ProgressNav({
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
      className={`progress-nav-item ${
        active
          ? "progress-nav-active"
          : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}