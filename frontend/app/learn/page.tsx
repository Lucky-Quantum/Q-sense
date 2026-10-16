"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import BrandAtom from "@/components/brand/BrandAtom";
import MobileMenuToggle from "@/components/shared/MobileMenuToggle";

type Module = {
  number: string;
  title: string;
  description: string;
  lessons: number;
  progress: number;
  status: "completed" | "current" | "locked";
  accent: string;
};

const modules: Module[] = [
  {
    number: "01",
    title: "Qubits",
    description:
      "Understand the fundamental unit of quantum information and how qubits differ from classical bits.",
    lessons: 5,
    progress: 100,
    status: "completed",
    accent: "violet",
  },
  {
    number: "02",
    title: "Superposition",
    description:
      "Learn how a quantum system can exist in a combination of states before measurement.",
    lessons: 6,
    progress: 100,
    status: "completed",
    accent: "cyan",
  },
  {
    number: "03",
    title: "Entanglement",
    description:
      "Explore correlations between qubits and build your first Bell State circuit.",
    lessons: 7,
    progress: 68,
    status: "current",
    accent: "purple",
  },
  {
    number: "04",
    title: "Quantum Gates",
    description:
      "Master H, X, Y, Z, CNOT and controlled operations through interactive circuits.",
    lessons: 8,
    progress: 0,
    status: "locked",
    accent: "blue",
  },
  {
    number: "05",
    title: "Measurement",
    description:
      "Understand quantum measurement, probabilities and how observation changes a system.",
    lessons: 5,
    progress: 0,
    status: "locked",
    accent: "indigo",
  },
  {
    number: "06",
    title: "Quantum Algorithms",
    description:
      "Move from fundamentals into Grover's Algorithm, Deutsch-Jozsa and more.",
    lessons: 10,
    progress: 0,
    status: "locked",
    accent: "violet",
  },
];

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

export default function LearnPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"All" | "In Progress" | "Completed">("All");

  const visibleModules = modules.filter((module) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "In Progress") return module.status === "current";
    return module.status === "completed";
  });

  return (
    <main className="learn-page">
      <MobileMenuToggle sidebarClassName="learn-sidebar" brandHref="/dashboard" brandLabel="Q-SENSE" />
      <div className="learn-bg-grid" />
      <div className="learn-glow learn-glow-one" />
      <div className="learn-glow learn-glow-two" />

      {/* SIDEBAR */}
      <aside className="learn-sidebar">
        <Link
          href="/dashboard"
          className="learn-brand"
        >
          <div className="learn-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <div className="learn-brand-name">
              Q-SENSE
            </div>

            <div className="learn-brand-subtitle">
              Quantum Learning Platform
            </div>
          </div>
        </Link>

        <nav className="learn-nav">
          {navItems.map((item) => {
            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`learn-nav-item ${
                  active
                    ? "learn-nav-active"
                    : ""
                }`}
              >
                <span className="learn-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="learn-sidebar-divider" />

        <Link
          href="/settings"
          className={`learn-nav-item ${
            pathname === "/settings"
              ? "learn-nav-active"
              : ""
          }`}
        >
          <span className="learn-nav-icon">
            ⚙
          </span>

          <span>Settings</span>
        </Link>

        <Link
          href="/help"
          className={`learn-nav-item ${
            pathname === "/help"
              ? "learn-nav-active"
              : ""
          }`}
        >
          <span className="learn-nav-icon">
            ?
          </span>

          <span>Help</span>
        </Link>

        <div className="learn-sidebar-bottom">
          <div className="learn-sidebar-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Learn deeply.</strong>
            <br />
            Build confidently.
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <section className="learn-main">
        {/* TOPBAR */}
        <header className="learn-topbar">
          <div className="learn-breadcrumb">
            <Link href="/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <strong>Learn</strong>
          </div>

          <div className="learn-topbar-right">
            <button
              className="learn-notification"
              type="button"
            >
              ♢
              <span />
            </button>

            <Link
              href="/settings"
              className="learn-profile"
            >
              <div className="learn-avatar">
                L
              </div>

              <div>
                <strong>Hello, Lucky</strong>
                <small>Student</small>
              </div>

              <span>▾</span>
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <div className="learn-content">
          {/* HERO */}
          <section className="learn-hero">
            <div>
              <span className="learn-eyebrow">
                QUANTUM LEARNING PATH
              </span>

              <h1>
                Build your quantum
                <br />
                knowledge, <em>step by step.</em>
              </h1>

              <p>
                Learn the concepts, experiment with
                circuits, and build the intuition needed
                to understand quantum computing.
              </p>
            </div>

            <div className="learn-overview-card">
              <div className="learn-overview-orbit">
                <span />
                <span />
                <span />
              </div>

              <div className="learn-overview-content">
                <span>OVERALL PROGRESS</span>

                <strong>68%</strong>

                <div className="learn-overview-track">
                  <div />
                </div>

                <small>
                  3 of 6 modules unlocked
                </small>
              </div>
            </div>
          </section>

          {/* CONTINUE */}
          <section className="learn-continue-card">
            <div className="learn-continue-icon">
              ✦
            </div>

            <div className="learn-continue-main">
              <span>
                CONTINUE WHERE YOU LEFT OFF
              </span>

              <h2>
                Entanglement — Bell States
              </h2>

              <p>
                Lesson 4 of 7 · Approximately 8 min
                remaining
              </p>

              <div className="learn-small-progress">
                <div style={{ width: "68%" }} />
              </div>
            </div>

            <Link
              href="/quantum-lab"
              className="learn-continue-button"
            >
              Continue
              <span>→</span>
            </Link>
          </section>

          {/* MODULE HEADER */}
          <section className="learn-section-heading">
            <div>
              <span>YOUR CURRICULUM</span>

              <h2>Quantum Foundations</h2>
            </div>

            <div className="learn-filter">
              {(["All", "In Progress", "Completed"] as const).map((filter) => (
                <button
                  key={filter}
                  className={activeFilter === filter ? "learn-filter-active" : ""}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          {/* MODULES */}
          <section className="learn-module-grid">
            {visibleModules.map((module) => (
              <article
                key={module.number}
                className={`learn-module-card module-${module.status}`}
              >
                <div className="learn-module-top">
                  <div
                    className={`learn-module-number ${module.accent}`}
                  >
                    {module.number}
                  </div>

                  <div className="learn-module-status">
                    {module.status ===
                    "completed"
                      ? "✓ Completed"
                      : module.status ===
                        "current"
                      ? "● In Progress"
                      : "◌ Locked"}
                  </div>
                </div>

                <h3>{module.title}</h3>

                <p>
                  {module.description}
                </p>

                <div className="learn-module-footer">
                  <span>
                    {module.lessons} lessons
                  </span>

                  <strong>
                    {module.progress}%
                  </strong>
                </div>

                <div className="learn-module-track">
                  <div
                    style={{
                      width: `${module.progress}%`,
                    }}
                  />
                </div>

                <div className="learn-module-action">
                  {module.status === "current" ? (
                    <Link href="/quantum-lab">
                      Continue →
                    </Link>
                  ) : module.status ===
                    "completed" ? (
                    <button type="button" onClick={() => router.push("/ai-tutor")}>
                      Review with AI →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                    >
                      Locked
                    </button>
                  )}
                </div>

                {module.status ===
                  "locked" && (
                  <div className="learn-lock">
                    🔒
                  </div>
                )}
              </article>
            ))}
          </section>

          {/* DAILY CHALLENGE */}
          <section className="learn-challenge-card">
            <div className="learn-challenge-art">
              <div className="challenge-ring ring-a" />
              <div className="challenge-ring ring-b" />

              <div className="challenge-center">
                ⚡
              </div>
            </div>

            <div className="learn-challenge-content">
              <span>
                DAILY QUANTUM CHALLENGE
              </span>

              <h2>
                Keep your learning streak alive.
              </h2>

              <p>
                Complete one short quantum challenge
                every day and earn XP while building
                stronger intuition.
              </p>

              <div className="learn-challenge-meta">
                <span>🔥 5 Day Streak</span>
                <span>✦ 420 XP</span>
              </div>

              <Link
                href="/challenges"
                className="learn-challenge-button"
              >
                View Today's Challenge →
              </Link>
            </div>
          </section>

          {/* LEARNING PRINCIPLES */}
          <section className="learn-principles">
            <div>
              <span>HOW Q-SENSE TEACHES</span>

              <h2>
                Don't just memorize quantum.
                <br />
                <em>Understand it.</em>
              </h2>
            </div>

            <div className="learn-principle-grid">
              <div>
                <span>01</span>
                <strong>Learn</strong>
                <p>
                  Clear explanations that build
                  intuition before mathematics.
                </p>
              </div>

              <div>
                <span>02</span>
                <strong>Build</strong>
                <p>
                  Turn concepts into actual quantum
                  circuits.
                </p>
              </div>

              <div>
                <span>03</span>
                <strong>Simulate</strong>
                <p>
                  Run your circuits and visualize
                  what happens.
                </p>
              </div>

              <div>
                <span>04</span>
                <strong>Master</strong>
                <p>
                  Practice, get feedback and track
                  your progress.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}