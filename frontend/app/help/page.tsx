"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";

const FAQS = [
  {
    category: "Getting Started",
    question: "What is Q-SENSE?",
    answer:
      "Q-SENSE is an interactive quantum learning environment where you can learn concepts, build circuits, simulate quantum systems and receive guided explanations.",
  },
  {
    category: "Getting Started",
    question: "Where should I start learning?",
    answer:
      "Start with the Learn section. The recommended path begins with qubits and quantum states, then moves through superposition, entanglement, gates and algorithms.",
  },
  {
    category: "Quantum Lab",
    question: "What can I do in the Quantum Lab?",
    answer:
      "The Quantum Lab is designed for constructing quantum circuits, experimenting with gates and inspecting simulation results.",
  },
  {
    category: "Quantum Lab",
    question: "Why does my circuit produce a different result?",
    answer:
      "Quantum results depend on the circuit structure, initial state, measurement and simulation settings. Use the AI Tutor to reason through the circuit step by step.",
  },
  {
    category: "AI Tutor",
    question: "What can the AI Tutor help with?",
    answer:
      "The tutor can explain concepts, reason about circuit structure, identify likely mistakes and suggest the next learning experiment.",
  },
  {
    category: "Challenges",
    question: "How does my streak work?",
    answer:
      "Your challenge activity is currently stored locally in this demo workspace. Completing challenges contributes to your XP and keeps your learning activity connected to the dashboard.",
  },
  {
    category: "Progress",
    question: "Does Progress show my real learning data?",
    answer:
      "The current workspace combines local activity data with curriculum-state data. Supabase can be connected to make learning analytics persistent across devices.",
  },
];

const categories = [
  "All",
  "Getting Started",
  "Quantum Lab",
  "AI Tutor",
  "Challenges",
  "Progress",
];

export default function HelpPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [openFAQ, setOpenFAQ] =
    useState<number | null>(0);

  useEffect(() => {
    if (!localStorage.getItem("qsense-session")) {
      router.replace("/login");
    }
  }, [router]);

  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const categoryMatch =
        activeCategory === "All" ||
        faq.category === activeCategory;

      const query =
        search.trim().toLowerCase();

      const searchMatch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <main className="help-page">
      <div className="help-grid-bg" />

      <div className="help-glow help-glow-one" />
      <div className="help-glow help-glow-two" />

      <aside className="help-sidebar">
        <div className="help-brand">
          <div className="help-brand-mark"><BrandAtom /></div>

          <div>
            <strong>Q-SENSE</strong>
            <span>Quantum Learning Platform</span>
          </div>
        </div>

        <nav className="help-nav">
          <HelpNav label="Dashboard" icon="⌂" href="/dashboard" />
          <HelpNav label="Learn" icon="◈" href="/learn" />
          <HelpNav
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />
          <HelpNav
            label="Algorithms"
            icon="◇"
            href="/algorithms"
          />
          <HelpNav
            label="Progress"
            icon="↗"
            href="/progress"
          />
          <HelpNav
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
          />
          <HelpNav
            label="Challenges"
            icon="⚡"
            href="/challenges"
          />
        </nav>

        <div className="help-sidebar-divider" />

        <HelpNav
          label="Settings"
          icon="⚙"
          href="/settings"
        />

        <HelpNav
          label="Help"
          icon="?"
          href="/help"
          active
        />

        <div className="help-sidebar-card">
          <strong>Need guidance?</strong>
          <p>
            Ask the AI Tutor for concept-level help
            while you learn.
          </p>

          <button
            onClick={() =>
              router.push("/ai-tutor")
            }
          >
            Open AI Tutor →
          </button>
        </div>
      </aside>

      <section className="help-main">
        <header className="help-topbar">
          <div className="help-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>Help</strong>
          </div>

          <div className="help-topbar-right">
            <button className="help-notification">
              ♢
              <span />
            </button>

            <div className="help-avatar">L</div>

            <div className="help-user-info">
              <strong>Hello, Lucky</strong>
              <small>Student</small>
            </div>

            <span className="help-arrow">▾</span>
          </div>
        </header>

        <div className="help-content">
          <section className="help-heading">
            <div>
              <p>Q-SENSE SUPPORT CENTER</p>

              <h1>
                Find your
                <span> answer.</span>
              </h1>

              <p>
                Explore common questions about learning,
                circuits, challenges and the AI Tutor.
              </p>
            </div>

            <div className="help-search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search help..."
              />
            </div>
          </section>

          <section className="help-category-row">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "help-category-active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </section>

          <section className="help-layout">
            <div className="help-faq-panel">
              <div className="help-panel-heading">
                <div>
                  <span>FREQUENTLY ASKED</span>
                  <h2>Questions & answers</h2>
                </div>

                <span>
                  {filteredFAQs.length} results
                </span>
              </div>

              <div className="help-faq-list">
                {filteredFAQs.length === 0 ? (
                  <div className="help-empty">
                    <div>⌕</div>
                    <h3>No matching help articles</h3>
                    <p>
                      Try another keyword or choose
                      a different category.
                    </p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => {
                    const isOpen =
                      openFAQ === index;

                    return (
                      <div
                        className={`help-faq ${
                          isOpen
                            ? "help-faq-open"
                            : ""
                        }`}
                        key={faq.question}
                      >
                        <button
                          onClick={() =>
                            setOpenFAQ(
                              isOpen ? null : index
                            )
                          }
                        >
                          <div>
                            <span>
                              {faq.category}
                            </span>
                            <strong>
                              {faq.question}
                            </strong>
                          </div>

                          <b>
                            {isOpen ? "−" : "+"}
                          </b>
                        </button>

                        {isOpen && (
                          <p>{faq.answer}</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="help-side-column">
              <div className="help-support-card">
                <div className="help-support-icon">
                  ✦
                </div>

                <span>AI-FIRST SUPPORT</span>

                <h2>
                  Ask your Quantum Tutor
                </h2>

                <p>
                  Get concept explanations and
                  circuit guidance without leaving
                  your learning workspace.
                </p>

                <button
                  onClick={() =>
                    router.push("/ai-tutor")
                  }
                >
                  Open AI Tutor →
                </button>
              </div>

              <div className="help-shortcuts-card">
                <span>QUICK LINKS</span>

                <HelpShortcut
                  title="Start Learning"
                  description="Open the curriculum"
                  onClick={() =>
                    router.push("/learn")
                  }
                />

                <HelpShortcut
                  title="Build a Circuit"
                  description="Open Quantum Lab"
                  onClick={() =>
                    router.push("/quantum-lab")
                  }
                />

                <HelpShortcut
                  title="Practice Today"
                  description="Open Challenges"
                  onClick={() =>
                    router.push("/challenges")
                  }
                />

                <HelpShortcut
                  title="View Progress"
                  description="Review your journey"
                  onClick={() =>
                    router.push("/progress")
                  }
                />
              </div>
            </div>
          </section>

          <section className="help-bottom">
            <div>
              <span>STILL NEED HELP?</span>
              <h2>
                Start with the AI Tutor.
              </h2>
              <p>
                Q-SENSE is designed so that the
                explanation, experiment and next step
                stay connected.
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/ai-tutor")
              }
            >
              Talk to Tutor →
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

function HelpNav({
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
      className={`help-nav-item ${
        active ? "help-nav-active" : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function HelpShortcut({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      className="help-shortcut"
      onClick={onClick}
    >
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>

      <span>→</span>
    </button>
  );
}