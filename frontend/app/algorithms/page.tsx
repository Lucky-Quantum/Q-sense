"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import MobileMenuToggle from "@/components/shared/MobileMenuToggle";

type Algorithm = {
  name: string;
  shortName: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  description: string;
  concept: string;
  time: string;
  accent: string;
};

const ALGORITHMS: Algorithm[] = [
  {
    name: "Grover's Algorithm",
    shortName: "Grover",
    category: "Search",
    difficulty: "Intermediate",
    progress: 0,
    description:
      "Learn how amplitude amplification can search an unsorted space faster than classical brute force.",
    concept: "Amplitude Amplification",
    time: "20 min",
    accent: "purple",
  },
  {
    name: "Deutsch-Jozsa Algorithm",
    shortName: "Deutsch-Jozsa",
    category: "Foundations",
    difficulty: "Beginner",
    progress: 35,
    description:
      "Explore how quantum interference can determine whether a function is constant or balanced.",
    concept: "Quantum Interference",
    time: "15 min",
    accent: "cyan",
  },
  {
    name: "Bernstein-Vazirani",
    shortName: "Bernstein-Vazirani",
    category: "Foundations",
    difficulty: "Beginner",
    progress: 0,
    description:
      "Discover how a quantum circuit can identify a hidden binary string with a single query.",
    concept: "Oracle Queries",
    time: "15 min",
    accent: "blue",
  },
  {
    name: "Quantum Teleportation",
    shortName: "Teleportation",
    category: "Communication",
    difficulty: "Intermediate",
    progress: 0,
    description:
      "Understand how an unknown quantum state can be transferred using entanglement and classical communication.",
    concept: "Entanglement",
    time: "25 min",
    accent: "pink",
  },
  {
    name: "Quantum Fourier Transform",
    shortName: "QFT",
    category: "Transform",
    difficulty: "Advanced",
    progress: 0,
    description:
      "Build an intuition for the quantum Fourier transform and its role in major quantum algorithms.",
    concept: "Fourier Transform",
    time: "30 min",
    accent: "indigo",
  },
  {
    name: "Superdense Coding",
    shortName: "Superdense",
    category: "Communication",
    difficulty: "Intermediate",
    progress: 0,
    description:
      "Learn how two classical bits of information can be transmitted using a shared entangled state.",
    concept: "Entanglement",
    time: "20 min",
    accent: "green",
  },
  {
    name: "Quantum Approximate Optimization Algorithm",
    shortName: "QAOA",
    category: "Optimization",
    difficulty: "Advanced",
    progress: 0,
    description:
      "Explore a hybrid quantum-classical approach that alternates problem and mixer operations to seek strong approximate solutions.",
    concept: "Combinatorial Optimization",
    time: "30 min",
    accent: "cyan",
  },
  {
    name: "Variational Quantum Eigensolver",
    shortName: "VQE",
    category: "Variational",
    difficulty: "Advanced",
    progress: 0,
    description:
      "Understand how a parameterized quantum circuit and a classical optimizer work together to estimate a system's ground-state energy.",
    concept: "Variational Circuits",
    time: "30 min",
    accent: "pink",
  },
];

const categories = [
  "All",
  "Foundations",
  "Search",
  "Communication",
  "Transform",
  "Optimization",
  "Variational",
];

export default function AlgorithmsPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter((algorithm) => {
      const categoryMatch =
        activeCategory === "All" ||
        algorithm.category === activeCategory;

      const searchMatch =
        algorithm.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        algorithm.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        algorithm.concept
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const openLab = () => {
    router.push("/quantum-lab");
  };

  return (
    <main className="algorithms-page">
      <MobileMenuToggle sidebarClassName="algorithms-sidebar" brandHref="/dashboard" brandLabel="Q-SENSE" />
      <div className="algorithms-bg-grid" />
      <div className="algorithms-glow algorithms-glow-one" />
      <div className="algorithms-glow algorithms-glow-two" />

      {/* SIDEBAR */}
      <aside className="algorithms-sidebar">
        <div className="algorithms-brand">
          <div className="algorithms-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>
              Quantum Learning Platform
            </span>
          </div>
        </div>

        <nav className="algorithms-nav">
          <NavItem
            label="Dashboard"
            icon="⌂"
            href="/dashboard"
          />

          <NavItem
            label="Learn"
            icon="◈"
            href="/learn"
          />

          <NavItem
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />

          <NavItem
            label="Algorithms"
            icon="◇"
            href="/algorithms"
            active
          />

          <NavItem
            label="Progress"
            icon="↗"
            href="/progress"
          />

          <NavItem
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
          />

          <NavItem
            label="Challenges"
            icon="⚡"
            href="/challenges"
          />
        </nav>

        <div className="algorithms-sidebar-divider" />

        <NavItem
          label="Settings"
          icon="⚙"
          href="/settings"
        />

        <NavItem
          label="Help"
          icon="?"
          href="/help"
        />

        <div className="algorithms-sidebar-footer">
          <div className="algorithms-footer-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Think quantum.</strong>
            <br />
            Build beyond limits.
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <section className="algorithms-main">
        {/* TOPBAR */}
        <header className="algorithms-topbar">
          <div className="algorithms-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>Algorithms</strong>
          </div>

          <div className="algorithms-profile">
            <button
              type="button"
              className="algorithms-notification"
              aria-label="Notifications"
            >
              ♢
              <span />
            </button>

            <div className="algorithms-user-profile">
              <div className="algorithms-avatar">
                L
              </div>

              <div className="algorithms-profile-text">
                <strong>Hello, Lucky</strong>
                <small>Student</small>
              </div>

              <span className="algorithms-user-arrow">▾</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="algorithms-content">
          {/* HERO */}
          <section className="algorithms-hero">
            <div>
              <p className="algorithms-eyebrow">
                QUANTUM ALGORITHM LIBRARY
              </p>

              <h1>
                Turn quantum concepts
                <br />
                into <span>algorithms.</span>
              </h1>

              <p className="algorithms-hero-copy">
                Understand how quantum algorithms
                work, build their circuits, and
                experiment with them inside the
                Quantum Lab.
              </p>

              <div className="algorithms-hero-actions">
                <button
                  className="algorithms-primary-button"
                  onClick={openLab}
                >
                  Explore Quantum Lab
                  <span>→</span>
                </button>

                <button
                  className="algorithms-secondary-button"
                  onClick={() =>
                    router.push("/quantum-lab")
                  }
                >
                  Open Quantum Lab
                </button>
              </div>
            </div>

            {/* HERO CIRCUIT */}
            <div className="algorithm-hero-visual">
              <div className="hero-quantum-orbit orbit-one" />
              <div className="hero-quantum-orbit orbit-two" />

              <div className="hero-circuit">
                <div>
                  <span>q₀</span>
                  <i />
                  <b>H</b>
                  <i />
                  <b className="oracle">U</b>
                  <i />
                  <b>H</b>
                </div>

                <div>
                  <span>q₁</span>
                  <i />
                  <b>H</b>
                  <i />
                  <b className="oracle">U</b>
                  <i />
                  <b>H</b>
                </div>

                <div>
                  <span>q₂</span>
                  <i />
                  <b>H</b>
                  <i />
                  <b className="oracle">U</b>
                  <i />
                  <b>H</b>
                </div>
              </div>

              <div className="hero-visual-label">
                QUANTUM CIRCUIT
              </div>
            </div>
          </section>

          {/* PROGRESS */}
          <section className="algorithm-progress-card">
            <div className="algorithm-progress-icon">
              ✦
            </div>

            <div className="algorithm-progress-info">
              <span>ALGORITHM LIBRARY</span>

              <strong>
                8 concept guides available
              </strong>

              <div className="algorithm-progress-track">
                <div style={{ width: "100%" }} />
              </div>
            </div>

            <div className="algorithm-progress-percent">
              <span>CATALOG</span>
              8
            </div>
          </section>

          {/* FILTER */}
          <section className="algorithm-library-header">
            <div>
              <span className="algorithms-eyebrow">
                EXPLORE
              </span>

              <h2>Algorithm Library</h2>

              <p>
                Explore standard algorithms through their core ideas, then use the Quantum Lab to experiment with circuit-building blocks.
              </p>
            </div>

            <div className="algorithm-library-tools">
              <div className="algorithm-library-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search algorithms..."
                  aria-label="Search algorithms"
                />
              </div>

              <div className="algorithm-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={
                      activeCategory === category
                        ? "algorithm-filter-active"
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

          {/* FEATURED */}
          <section className="featured-algorithm">
            <div className="featured-content">
              <div className="featured-label">
                ⭐ FEATURED ALGORITHM
              </div>

              <h2>Grover's Algorithm</h2>

              <p>
                Search an unsorted database with
                quantum amplitude amplification.
                Learn why Grover's algorithm can
                provide a quadratic speedup over
                classical search.
              </p>

              <div className="featured-tags">
                <span>Intermediate</span>
                <span>Amplitude Amplification</span>
                <span>20 min</span>
              </div>

              <div className="featured-actions">
                <button
                  className="algorithms-primary-button"
                  onClick={openLab}
                >
                  Build in Quantum Lab
                  <span>→</span>
                </button>

                <button
                  className="featured-learn-button"
                  onClick={() => router.push("/learn")}
                >
                  Start Learning
                </button>
              </div>
            </div>

            <div className="grover-visual">
              <div className="grover-ring ring-one" />
              <div className="grover-ring ring-two" />
              <div className="grover-ring ring-three" />

              <div className="grover-center">
                <span>U</span>
                <small>ORACLE</small>
              </div>

              <div className="grover-particle p-one" />
              <div className="grover-particle p-two" />
              <div className="grover-particle p-three" />
              <div className="grover-particle p-four" />
            </div>
          </section>

          {/* LIBRARY */}
          <section className="algorithm-grid">
            {filteredAlgorithms.map(
              (algorithm) => (
                <article
                  key={algorithm.name}
                  className={`algorithm-card algorithm-${algorithm.accent}`}
                >
                  <div className="algorithm-card-top">
                    <span className="algorithm-category">
                      {algorithm.category}
                    </span>

                    <span
                      className={`algorithm-difficulty difficulty-${algorithm.difficulty.toLowerCase()}`}
                    >
                      {algorithm.difficulty}
                    </span>
                  </div>

                  <div className="algorithm-icon">
                    {algorithm.shortName ===
                      "Grover"
                      ? "G"
                      : algorithm.shortName ===
                        "QFT"
                        ? "F"
                        : algorithm.shortName
                          .charAt(0)}
                  </div>

                  <h3>{algorithm.name}</h3>

                  <p>
                    {algorithm.description}
                  </p>

                  <div className="algorithm-card-meta">
                    <span>
                      ◉ {algorithm.concept}
                    </span>

                    <span>
                      ◷ {algorithm.time}
                    </span>
                  </div>

                  <div className="algorithm-card-progress">
                    <div>
                      <span>Progress</span>
                      <strong>
                        {algorithm.progress}%
                      </strong>
                    </div>

                    <div className="algorithm-mini-track">
                      <span
                        style={{
                          width: `${algorithm.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="algorithm-card-actions">
                    <button
                      onClick={openLab}
                    >
                      Open Lab
                      <span>→</span>
                    </button>

                    <button
                      className="algorithm-more"
                      onClick={() => router.push("/learn")}
                    >
                      Learning Path
                    </button>
                  </div>
                </article>
              )
            )}
          </section>

          {filteredAlgorithms.length === 0 && (
            <div className="algorithm-empty">
              <span>⌕</span>

              <h3>
                No algorithms found
              </h3>

              <p>
                Try another search or category.
              </p>
            </div>
          )}

          {/* NEXT STEP */}
          <section className="algorithm-next-card">
            <div>
              <span className="algorithms-eyebrow">
                RECOMMENDED NEXT STEP
              </span>

              <h2>
                Ready to see an algorithm
                come alive?
              </h2>

              <p>
                Follow an algorithm's concepts, then open the general two-qubit lab to experiment with individual gates. Algorithm-specific templates are not loaded into the lab in this demo.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/quantum-lab")
              }
            >
              Enter Quantum Lab
              <span>→</span>
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

function NavItem({
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
      className={`algorithms-nav-item ${active
          ? "algorithms-nav-active"
          : ""
        }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}