"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import MobileMenuToggle from "@/components/shared/MobileMenuToggle";

export default function SettingsPage() {
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [challengeReminders, setChallengeReminders] =
    useState(true);

  const [aiSuggestions, setAiSuggestions] =
    useState(true);

  const [compactMode, setCompactMode] =
    useState(false);
  const [learningLevel, setLearningLevel] = useState("Beginner");
  const [explanationStyle, setExplanationStyle] = useState("Step by step");

  useEffect(() => {
    const session =
      localStorage.getItem("qsense-session");

    if (!session) { localStorage.setItem("qsense-session", JSON.stringify({ role: "student", email: "student@qsense.demo", name: "Lucky", demo: true })); }

    setEmailNotifications(
      localStorage.getItem(
        "qsense-email-notifications"
      ) !== "false"
    );

    setChallengeReminders(
      localStorage.getItem(
        "qsense-challenge-reminders"
      ) !== "false"
    );

    setAiSuggestions(
      localStorage.getItem(
        "qsense-ai-suggestions"
      ) !== "false"
    );

    setCompactMode(
      localStorage.getItem(
        "qsense-compact-mode"
      ) === "true"
    );
    setLearningLevel(localStorage.getItem("qsense-learning-level") || "Beginner");
    setExplanationStyle(localStorage.getItem("qsense-explanation-style") || "Step by step");
  }, [router]);

  const updateSetting = (
    key: string,
    value: boolean,
    setter: (value: boolean) => void
  ) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  const logout = () => {
    localStorage.removeItem("qsense-session");
    router.replace("/login");
  };

  return (
    <main className="settings-page">
      <MobileMenuToggle sidebarClassName="settings-sidebar" brandHref="/dashboard" brandLabel="Q-SENSE" />
      <div className="settings-grid-bg" />

      <div className="settings-glow settings-glow-one" />
      <div className="settings-glow settings-glow-two" />

      {/* SIDEBAR */}

      <aside className="settings-sidebar">
        <div className="settings-brand">
          <div className="settings-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>Quantum Learning Platform</span>
          </div>
        </div>

        <nav className="settings-nav">
          <SettingsNav
            label="Dashboard"
            icon="⌂"
            href="/dashboard"
          />
          <SettingsNav
            label="Learn"
            icon="◈"
            href="/learn"
          />
          <SettingsNav
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />
          <SettingsNav
            label="Algorithms"
            icon="◇"
            href="/algorithms"
          />
          <SettingsNav
            label="Progress"
            icon="↗"
            href="/progress"
          />
          <SettingsNav
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
          />
          <SettingsNav
            label="Challenges"
            icon="⚡"
            href="/challenges"
          />
        </nav>

        <div className="settings-sidebar-divider" />

        <SettingsNav
          label="Settings"
          icon="⚙"
          href="/settings"
          active
        />

        <SettingsNav
          label="Help"
          icon="?"
          href="/help"
        />

        <div className="settings-sidebar-card">
          <div className="settings-mini-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Your workspace.</strong>
            <br />
            Personalize how you learn quantum.
          </p>
        </div>
      </aside>

      {/* MAIN */}

      <section className="settings-main">
        <header className="settings-topbar">
          <div className="settings-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>Settings</strong>
          </div>

          <div className="settings-topbar-right">
            <button className="settings-notification">
              ♢
              <span />
            </button>

            <div className="settings-avatar">L</div>

            <div className="settings-user-info">
              <strong>Hello, Lucky</strong>
              <small>Student</small>
            </div>

            <span className="settings-arrow">▾</span>
          </div>
        </header>

        <div className="settings-content">
          <section className="settings-heading">
            <div>
              <p>ACCOUNT & WORKSPACE</p>

              <h1>
                Make Q-SENSE
                <span> yours.</span>
              </h1>

              <span>
                Manage your local preferences,
                notifications and learning workspace.
              </span>
            </div>

            <div className="settings-profile-card">
              <div className="settings-large-avatar">
                L
              </div>

              <div>
                <strong>Lucky</strong>
                <span>Student account</span>
                <small>student@qsense.demo</small>
              </div>
            </div>
          </section>

          <section className="settings-layout">
            <div className="settings-panel">
              <div className="settings-panel-heading">
                <span>GENERAL</span>
                <h2>Learning preferences</h2>
              </div>

              <SettingRow
                icon="◈"
                title="Email notifications"
                description="Receive important learning and account updates."
                enabled={emailNotifications}
                onChange={(value) =>
                  updateSetting(
                    "qsense-email-notifications",
                    value,
                    setEmailNotifications
                  )
                }
              />

              <SettingRow
                icon="⚡"
                title="Challenge reminders"
                description="Get reminders to keep your daily challenge streak active."
                enabled={challengeReminders}
                onChange={(value) =>
                  updateSetting(
                    "qsense-challenge-reminders",
                    value,
                    setChallengeReminders
                  )
                }
              />

              <SettingRow
                icon="✦"
                title="AI Tutor suggestions"
                description="Allow contextual recommendations from your AI Tutor."
                enabled={aiSuggestions}
                onChange={(value) =>
                  updateSetting(
                    "qsense-ai-suggestions",
                    value,
                    setAiSuggestions
                  )
                }
              />

              <SettingRow
                icon="≡"
                title="Compact learning mode"
                description="Reduce spacing to fit more learning content on screen."
                enabled={compactMode}
                onChange={(value) =>
                  updateSetting(
                    "qsense-compact-mode",
                    value,
                    setCompactMode
                  )
                }
              />
            </div>

            <div className="settings-panel">
              <div className="settings-panel-heading">
                <span>LEARNING</span>
                <h2>Study configuration</h2>
              </div>

              <div className="settings-select-row">
                <div>
                  <strong>Learning level</strong>
                  <small>
                    Saved for future adaptive recommendations; it does not change the curriculum in this prototype.
                  </small>
                </div>

                <select
                  value={learningLevel}
                  onChange={(event) => {
                    setLearningLevel(event.target.value);
                    localStorage.setItem("qsense-learning-level", event.target.value);
                  }}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="settings-select-row">
                <div>
                  <strong>Preferred explanation style</strong>
                  <small>
                    Saved locally; the AI response style is not yet driven by this preference.
                  </small>
                </div>

                <select
                  value={explanationStyle}
                  onChange={(event) => {
                    setExplanationStyle(event.target.value);
                    localStorage.setItem("qsense-explanation-style", event.target.value);
                  }}
                >
                  <option>Step by step</option>
                  <option>Concise</option>
                  <option>Deep dive</option>
                </select>
              </div>

              <div className="settings-select-row">
                <div>
                  <strong>Interface language</strong>
                  <small>
                    The current prototype interface is available in English.
                  </small>
                </div>

                <span className="settings-session-badge">ENGLISH</span>
              </div>
            </div>
          </section>

          <section className="settings-panel">
            <div className="settings-panel-heading">
              <span>SECURITY</span>
              <h2>Account & session</h2>
            </div>

            <div className="settings-account-row">
              <div>
                <strong>Signed in as</strong>
                <small>student@qsense.demo</small>
              </div>

              <span className="settings-session-badge">
                SESSION ACTIVE
              </span>
            </div>

            <div className="settings-danger-zone">
              <div>
                <strong>Sign out</strong>
                <small>
                  End your current Q-SENSE session on
                  this device.
                </small>
              </div>

              <button onClick={logout}>
                Sign Out
              </button>
            </div>
          </section>

          <section className="settings-bottom">
            <div>
              <span>Q-SENSE PREFERENCES</span>
              <h2>
                Your settings are saved on this
                device.
              </h2>
              <p>
                These preferences currently use local
                browser storage and can later be synced
                with your Supabase profile.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SettingsNav({
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
      className={`settings-nav-item ${
        active ? "settings-nav-active" : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-row-icon">{icon}</div>

      <div className="settings-row-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </div>

      <button
        className={`settings-toggle ${
          enabled ? "settings-toggle-on" : ""
        }`}
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
      >
        <span />
      </button>
    </div>
  );
}