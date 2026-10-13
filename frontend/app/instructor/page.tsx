"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import { getDemoSession } from "@/lib/session";

const LEARNERS = [
  {
    name: "Aarav Sharma",
    level: "Quantum Explorer",
    progress: 82,
    streak: 12,
    lastActive: "Today",
    status: "Active",
  },
  {
    name: "Meera Kapoor",
    level: "Circuit Builder",
    progress: 71,
    streak: 8,
    lastActive: "Today",
    status: "Active",
  },
  {
    name: "Rohan Singh",
    level: "Quantum Explorer",
    progress: 54,
    streak: 5,
    lastActive: "Yesterday",
    status: "Active",
  },
  {
    name: "Diya Patel",
    level: "Foundations",
    progress: 39,
    streak: 2,
    lastActive: "3 days ago",
    status: "Needs attention",
  },
];

const ASSIGNMENTS = [
  {
    title: "Bell State Lab",
    module: "Entanglement",
    due: "Today",
    completion: 68,
  },
  {
    title: "Gate Detective",
    module: "Quantum Gates",
    due: "Tomorrow",
    completion: 44,
  },
  {
    title: "Grover Warm-Up",
    module: "Algorithms",
    due: "Friday",
    completion: 26,
  },
];

export default function InstructorPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const session = getDemoSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "instructor") {
      router.replace("/dashboard");
    }
  }, [router]);

  const filteredLearners = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return LEARNERS;

    return LEARNERS.filter((learner) =>
      learner.name
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  return (
    <main className="instructor-page">
      <div className="instructor-grid-bg" />
      <div className="instructor-glow instructor-glow-one" />
      <div className="instructor-glow instructor-glow-two" />

      <aside className="instructor-sidebar">
        <div className="instructor-brand">
          <div className="instructor-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>Instructor Workspace</span>
          </div>
        </div>

        <nav className="instructor-nav">
          <InstructorNav
            label="Overview"
            icon="⌂"
            active={activeTab === "Overview"}
            onClick={() =>
              setActiveTab("Overview")
            }
          />

          <InstructorNav
            label="Learners"
            icon="◉"
            active={activeTab === "Learners"}
            onClick={() =>
              setActiveTab("Learners")
            }
          />

          <InstructorNav
            label="Assignments"
            icon="◇"
            active={activeTab === "Assignments"}
            onClick={() =>
              setActiveTab("Assignments")
            }
          />

          <InstructorNav
            label="Curriculum"
            icon="◈"
            active={activeTab === "Curriculum"}
            onClick={() =>
              setActiveTab("Curriculum")
            }
          />
        </nav>

        <div className="instructor-divider" />

        <a
          href="/admin"
          className="instructor-admin-link"
        >
          <span>⚙</span>
          Admin Workspace
        </a>

        <a
          href="/dashboard"
          className="instructor-back-link"
        >
          ← Student Dashboard
        </a>
      </aside>

      <section className="instructor-main">
        <header className="instructor-topbar">
          <div className="instructor-breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>Instructor</strong>
          </div>

          <div className="instructor-topbar-right">
            <button className="instructor-notification">
              ♢
              <span />
            </button>

            <div className="instructor-avatar">
              L
            </div>

            <div className="instructor-user-info">
              <strong>Hello, Lucky</strong>
              <small>Instructor</small>
            </div>

            <span>▾</span>
          </div>
        </header>

        <div className="instructor-content">
          <section className="instructor-heading">
            <div>
              <p>INSTRUCTOR WORKSPACE</p>

              <h1>
                Guide the next
                <span> quantum learner.</span>
              </h1>

              <p>
                Monitor learner progress, organize
                assignments and identify where
                additional guidance is needed.
              </p>
            </div>

            <span className="instructor-demo-pill">DEMO WORKSPACE · SAMPLE RECORDS</span>
          </section>

          <div className="instructor-demo-data-note">
            DEMO WORKSPACE · Learner names, progress, and assignment completion below are illustrative sample records, not live student data.
          </div>

          {activeTab === "Overview" && (
            <>
              <section className="instructor-stats">
                <InstructorStat
                  icon="◉"
                  label="LEARNERS"
                  value="4"
                  detail="Current workspace"
                />

                <InstructorStat
                  icon="↗"
                  label="AVG. PROGRESS"
                  value="62%"
                  detail="Across curriculum"
                />

                <InstructorStat
                  icon="⚡"
                  label="ASSIGNMENTS"
                  value="3"
                  detail="Active activities"
                />

                <InstructorStat
                  icon="✦"
                  label="AI INSIGHTS"
                  value="6"
                  detail="Items to review"
                />
              </section>

              <section className="instructor-two-column">
                <div className="instructor-panel">
                  <div className="instructor-panel-heading">
                    <div>
                      <span>LEARNER ACTIVITY</span>
                      <h2>
                        Where learners are
                      </h2>
                    </div>

                    <button
                      onClick={() =>
                        setActiveTab("Learners")
                      }
                    >
                      View all →
                    </button>
                  </div>

                  <div className="instructor-learner-list">
                    {LEARNERS.map((learner) => (
                      <LearnerRow
                        learner={learner}
                        key={learner.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="instructor-panel">
                  <div className="instructor-panel-heading">
                    <div>
                      <span>
                        ASSIGNMENT OVERVIEW
                      </span>

                      <h2>
                        Current activities
                      </h2>
                    </div>
                  </div>

                  <div className="instructor-assignment-list">
                    {ASSIGNMENTS.map(
                      (assignment) => (
                        <div
                          className="instructor-assignment"
                          key={assignment.title}
                        >
                          <div className="assignment-icon">
                            ◈
                          </div>

                          <div>
                            <strong>
                              {assignment.title}
                            </strong>

                            <small>
                              {assignment.module} · Due{" "}
                              {assignment.due}
                            </small>

                            <div className="assignment-bar">
                              <div
                                style={{
                                  width: `${assignment.completion}%`,
                                }}
                              />
                            </div>
                          </div>

                          <b>
                            {assignment.completion}%
                          </b>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>

              <section className="instructor-insight">
                <div className="instructor-insight-icon">
                  ✦
                </div>

                <div>
                  <span>TEACHING INSIGHT</span>

                  <h2>
                    Entanglement is the next
                    important checkpoint.
                  </h2>

                  <p>
                    Learners are progressing through
                    foundations, while practical
                    multi-qubit reasoning is where
                    additional guided practice can
                    help.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActiveTab("Assignments")
                  }
                >
                  Create Practice →
                </button>
              </section>
            </>
          )}

          {activeTab === "Learners" && (
            <section className="instructor-panel instructor-full-panel">
              <div className="instructor-panel-heading">
                <div>
                  <span>LEARNER DIRECTORY</span>
                  <h2>
                    Sample learner directory
                  </h2>
                </div>

                <div className="instructor-table-search">
                  <span>⌕</span>

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search learners..."
                  />
                </div>
              </div>

              <div className="instructor-table">
                <div className="instructor-table-head">
                  <span>Learner</span>
                  <span>Level</span>
                  <span>Progress</span>
                  <span>Streak</span>
                  <span>Last active</span>
                  <span>Status</span>
                </div>

                {filteredLearners.map((learner) => (
                  <div
                    className="instructor-table-row"
                    key={learner.name}
                  >
                    <strong>{learner.name}</strong>
                    <span>{learner.level}</span>
                    <span>
                      <b>{learner.progress}%</b>
                    </span>
                    <span>
                      🔥 {learner.streak}
                    </span>
                    <span>
                      {learner.lastActive}
                    </span>
                    <em
                      className={
                        learner.status ===
                        "Active"
                          ? "instructor-status-active"
                          : "instructor-status-attention"
                      }
                    >
                      {learner.status}
                    </em>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "Assignments" && (
            <section className="instructor-panel instructor-full-panel">
              <div className="instructor-panel-heading">
                <div>
                  <span>ASSIGNMENT CENTER</span>
                  <h2>
                    Learning activities
                  </h2>
                  <p className="instructor-panel-note">Illustrative sample assignments; creation and grading are not connected to a live classroom database yet.</p>
                </div>

                <span className="instructor-demo-pill">SAMPLE ASSIGNMENTS · LOCAL PREVIEW</span>
              </div>

              <div className="instructor-assignment-large-list">
                {ASSIGNMENTS.map(
                  (assignment) => (
                    <div
                      className="assignment-large"
                      key={assignment.title}
                    >
                      <div className="assignment-large-icon">
                        ◇
                      </div>

                      <div className="assignment-large-main">
                        <span>
                          {assignment.module}
                        </span>

                        <h3>
                          {assignment.title}
                        </h3>

                        <p>
                          Assigned learning activity
                          for the current curriculum
                          stage.
                        </p>

                        <div className="assignment-bar">
                          <div
                            style={{
                              width: `${assignment.completion}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="assignment-large-meta">
                        <strong>
                          {assignment.completion}%
                        </strong>

                        <small>
                          Due {assignment.due}
                        </small>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {activeTab === "Curriculum" && (
            <section className="instructor-panel instructor-full-panel">
              <div className="instructor-panel-heading">
                <div>
                  <span>CURRICULUM CONTROL</span>
                  <h2>
                    Q-SENSE learning path
                  </h2>
                </div>
              </div>

              <div className="instructor-curriculum">
                {[
                  ["01", "Qubits & States", "Completed"],
                  ["02", "Superposition", "Completed"],
                  ["03", "Entanglement", "In progress"],
                  ["04", "Quantum Gates", "Upcoming"],
                  ["05", "Quantum Algorithms", "Upcoming"],
                ].map(
                  ([number, title, status]) => (
                    <div
                      className="instructor-curriculum-item"
                      key={title}
                    >
                      <span>{number}</span>

                      <div>
                        <strong>{title}</strong>
                        <small>
                          {status}
                        </small>
                      </div>

                      <b>{status === "Completed" ? "✓" : "→"}</b>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

function InstructorNav({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`instructor-nav-item ${
        active ? "instructor-nav-active" : ""
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function InstructorStat({
  icon,
  label,
  value,
  detail,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="instructor-stat">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function LearnerRow({
  learner,
}: {
  learner: (typeof LEARNERS)[number];
}) {
  return (
    <div className="instructor-learner-row">
      <div className="learner-avatar">
        {learner.name.charAt(0)}
      </div>

      <div className="learner-main">
        <strong>{learner.name}</strong>
        <small>{learner.level}</small>
      </div>

      <div className="learner-progress">
        <span>{learner.progress}%</span>

        <div>
          <i
            style={{
              width: `${learner.progress}%`,
            }}
          />
        </div>
      </div>

      <span className="learner-streak">
        🔥 {learner.streak}
      </span>
    </div>
  );
}