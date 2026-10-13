"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import { getDemoSession } from "@/lib/session";

const CONTENT = [
  {
    title: "Qubits & Quantum States",
    type: "Module",
    status: "Published",
    updated: "Today",
  },
  {
    title: "Bell State Challenge",
    type: "Challenge",
    status: "Published",
    updated: "Yesterday",
  },
  {
    title: "Grover's Algorithm",
    type: "Algorithm",
    status: "Draft",
    updated: "2 days ago",
  },
  {
    title: "Quantum Gates",
    type: "Module",
    status: "Published",
    updated: "3 days ago",
  },
];

export default function AdminPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] =
    useState("Overview");

  const [maintenance, setMaintenance] =
    useState(false);

  useEffect(() => {
    const session = getDemoSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "admin") {
      router.replace(session.role === "instructor" ? "/instructor" : "/dashboard");
      return;
    }

    setMaintenance(
      localStorage.getItem(
        "qsense-maintenance"
      ) === "true"
    );
  }, [router]);

  const toggleMaintenance = () => {
    const next = !maintenance;
    setMaintenance(next);

    localStorage.setItem(
      "qsense-maintenance",
      String(next)
    );
  };

  return (
    <main className="admin-page">
      <div className="admin-grid-bg" />
      <div className="admin-glow admin-glow-one" />
      <div className="admin-glow admin-glow-two" />

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark"><BrandAtom /></div>

          <div>
            <strong>Q-SENSE</strong>
            <span>Admin Workspace</span>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            ["Overview", "⌂"],
            ["Learners", "◉"],
            ["Content", "◇"],
            ["System", "⚙"],
          ].map(([label, icon]) => (
            <button
              key={label}
              className={`admin-nav-item ${
                activeSection === label
                  ? "admin-nav-active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection(label)
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-divider" />

        <a
          href="/instructor"
          className="admin-workspace-link"
        >
          <span>◈</span>
          Instructor Workspace
        </a>

        <a
          href="/dashboard"
          className="admin-workspace-link"
        >
          <span>←</span>
          Student Dashboard
        </a>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>Admin</strong>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-notification">
              ♢
              <span />
            </button>

            <div className="admin-avatar">L</div>

            <div className="admin-user-info">
              <strong>Hello, Lucky</strong>
              <small>Administrator</small>
            </div>

            <span>▾</span>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-heading">
            <div>
              <p>PLATFORM ADMINISTRATION</p>

              <h1>
                Keep the quantum
                <span> workspace healthy.</span>
              </h1>

              <p>
                Manage learning content, review platform
                activity and control the operational
                state of Q-SENSE.
              </p>
            </div>

            <div className="admin-system-status">
              <span />
              <div>
                <strong>Frontend demo ready</strong>
                <small>
                  Frontend workspace operational
                </small>
              </div>
            </div>
          </section>

          {activeSection === "Overview" && (
            <>
              <section className="admin-stats">
                <AdminStat
                  icon="◉"
                  label="LEARNER ACCOUNTS"
                  value="Workspace"
                  detail="Ready for Supabase integration"
                />

                <AdminStat
                  icon="◇"
                  label="CONTENT ITEMS"
                  value={String(CONTENT.length)}
                  detail="Current curriculum records"
                />

                <AdminStat
                  icon="⌘"
                  label="QUANTUM ENGINE"
                  value="Ready"
                  detail="Backend integration pending"
                />

                <AdminStat
                  icon="✦"
                  label="AI TUTOR"
                  value="Ready"
                  detail="API integration pending"
                />
              </section>

              <section className="admin-two-column">
                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span>PLATFORM ACTIVITY</span>
                      <h2>
                        Workspace health
                      </h2>
                    </div>
                  </div>

                  <SystemRow
                    name="Frontend application"
                    status="Operational"
                    progress={100}
                  />

                  <SystemRow
                    name="Authentication"
                    status="Demo local state"
                    progress={72}
                  />

                  <SystemRow
                    name="Supabase backend"
                    status="Integration stage"
                    progress={38}
                  />

                  <SystemRow
                    name="Quantum simulation"
                    status="Integration stage"
                    progress={35}
                  />

                  <SystemRow
                    name="AI Tutor API"
                    status="Integration stage"
                    progress={30}
                  />
                </div>

                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span>QUICK CONTROLS</span>
                      <h2>
                        Platform controls
                      </h2>
                    </div>
                  </div>

                  <div className="admin-control-row">
                    <div className="admin-control-icon">
                      ⚙
                    </div>

                    <div>
                      <strong>
                        Maintenance mode
                      </strong>

                      <small>
                        Save a local demo flag only; this does not take the app offline.
                      </small>
                    </div>

                    <button
                      className={`admin-switch ${
                        maintenance
                          ? "admin-switch-on"
                          : ""
                      }`}
                      onClick={
                        toggleMaintenance
                      }
                    >
                      <span />
                    </button>
                  </div>

                  <div className="admin-control-row">
                    <div className="admin-control-icon">
                      ◇
                    </div>

                    <div>
                      <strong>
                        Content workspace
                      </strong>

                      <small>
                        Open curriculum and challenge
                        management.
                      </small>
                    </div>

                    <button
                      onClick={() =>
                        setActiveSection("Content")
                      }
                    >
                      Open →
                    </button>
                  </div>

                  <div className="admin-control-row">
                    <div className="admin-control-icon">
                      ◉
                    </div>

                    <div>
                      <strong>
                        Instructor tools
                      </strong>

                      <small>
                        Review learner-facing teaching
                        controls.
                      </small>
                    </div>

                    <button
                      onClick={() =>
                        router.push("/instructor")
                      }
                    >
                      Open →
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeSection === "Learners" && (
            <section className="admin-panel admin-full-panel">
              <div className="admin-panel-heading">
                <div>
                  <span>ACCOUNT MANAGEMENT</span>
                  <h2>Learner workspace</h2>
                </div>
              </div>

              <div className="admin-notice">
                <div>◉</div>

                <p>
                  <strong>
                    Learner management preview
                  </strong>

                  <br />

                  This frontend is prepared for the
                  Supabase learner table, role management
                  and authenticated account controls.
                </p>
              </div>

              {[
                "Student accounts",
                "Instructor accounts",
                "Role permissions",
                "Activity history",
              ].map((item) => (
                <div
                  className="admin-management-row"
                  key={item}
                >
                  <span>◈</span>

                  <strong>{item}</strong>

                  <small>
                    Supabase integration pending
                  </small>
                </div>
              ))}
            </section>
          )}

          {activeSection === "Content" && (
            <section className="admin-panel admin-full-panel">
              <div className="admin-panel-heading">
                <div>
                  <span>CONTENT MANAGEMENT</span>
                  <h2>Learning library</h2>
                </div>

                <span className="admin-demo-pill">CONTENT API NOT CONNECTED</span>
              </div>

              <div className="admin-content-table">
                <div className="admin-content-head">
                  <span>Content</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Updated</span>
                </div>

                {CONTENT.map((item) => (
                  <div
                    className="admin-content-row"
                    key={item.title}
                  >
                    <strong>{item.title}</strong>

                    <span>{item.type}</span>

                    <em
                      className={
                        item.status ===
                        "Published"
                          ? "admin-published"
                          : "admin-draft"
                      }
                    >
                      {item.status}
                    </em>

                    <span>{item.updated}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "System" && (
            <section className="admin-panel admin-full-panel">
              <div className="admin-panel-heading">
                <div>
                  <span>SYSTEM CONFIGURATION</span>
                  <h2>Technical readiness</h2>
                </div>
              </div>

              <div className="admin-system-grid">
                {[
                  [
                    "Supabase",
                    "Database + Authentication",
                    "Pending integration",
                  ],
                  [
                    "Qiskit",
                    "Quantum circuit simulation",
                    "Pending integration",
                  ],
                  [
                    "OpenRouter",
                    "AI Tutor model layer",
                    "Pending integration",
                  ],
                  [
                    "Vercel",
                    "Frontend deployment",
                    "Ready",
                  ],
                ].map(
                  ([name, purpose, status]) => (
                    <div
                      className="admin-system-card"
                      key={name}
                    >
                      <div className="admin-system-card-icon">
                        ◇
                      </div>

                      <span>{name}</span>

                      <h3>{purpose}</h3>

                      <p>{status}</p>

                      <div
                        className={
                          status === "Ready"
                            ? "admin-ready-dot"
                            : "admin-pending-dot"
                        }
                      />
                    </div>
                  )
                )}
              </div>

              <div className="admin-maintenance-banner">
                <div>
                  <strong>
                    Integration phase
                  </strong>

                  <p>
                    The frontend is complete enough
                    for the backend and Supabase
                    integration phase.
                  </p>
                </div>

                <button
                  onClick={toggleMaintenance}
                >
                  {maintenance
                    ? "Disable Maintenance"
                    : "Enable Maintenance"}
                </button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

function AdminStat({
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
    <div className="admin-stat">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function SystemRow({
  name,
  status,
  progress,
}: {
  name: string;
  status: string;
  progress: number;
}) {
  return (
    <div className="admin-system-row">
      <div>
        <strong>{name}</strong>
        <small>{status}</small>
      </div>

      <span>{progress}%</span>

      <div className="admin-system-bar">
        <i style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}