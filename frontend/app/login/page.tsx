"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTodayKey } from "@/lib/challenges";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoRole, saveDemoSession } from "@/lib/session";

function AtomIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        transform="rotate(60 12 12)"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        transform="rotate(120 12 12)"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 3-1.45 5.55L5 10l5.55 1.45L12 17l1.45-5.55L19 10l-5.55-1.45L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function seedDemoProgress() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getTodayKey(yesterday);

  if (!localStorage.getItem("qsense-streak")) {
    localStorage.setItem("qsense-streak", "5");
  }

  if (!localStorage.getItem("qsense-xp")) {
    localStorage.setItem("qsense-xp", "420");
  }

  if (!localStorage.getItem("qsense-last-challenge")) {
    localStorage.setItem("qsense-last-challenge", yesterdayKey);
  }

  if (!localStorage.getItem("qsense-completed-challenges")) {
    localStorage.setItem("qsense-completed-challenges", "[]");
  }

  if (!localStorage.getItem("qsense-lab-runs")) {
    localStorage.setItem("qsense-lab-runs", "1");
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("student@qsense.demo");
  const [password, setPassword] = useState("quantum123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<DemoRole>("student");

  const enterDemoWorkspace = () => {
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      seedDemoProgress();
      const account = saveDemoSession(role);
      router.push(account.home);
    }, 450);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const account = DEMO_ACCOUNTS[role];
    const valid =
      email.trim().toLowerCase() === account.email &&
      password === DEMO_PASSWORD;

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!valid) {
      setError(`Use ${account.email} / ${DEMO_PASSWORD} for this demo role.`);
      return;
    }

    setLoading(true);
    seedDemoProgress();

    if (remember) {
      localStorage.setItem(
        "qsense-remember",
        JSON.stringify({ email })
      );
    }

    saveDemoSession(role);

    window.setTimeout(() => {
      router.push(account.home);
    }, 450);
  };

  return (
    <main className="login-page">
      <div className="login-background">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />

        <div className="login-orbit orbit-one" />
        <div className="login-orbit orbit-two" />
        <div className="login-orbit orbit-three" />

        <span className="login-particle particle-one" />
        <span className="login-particle particle-two" />
        <span className="login-particle particle-three" />
        <span className="login-particle particle-four" />
      </div>

      {/* Top navigation */}
      <header className="login-nav">
        <Link href="/" className="login-brand">
          <span className="login-brand-mark">
            <AtomIcon size={21} />
          </span>

          <span className="login-brand-copy">
            <strong>Q-SENSE</strong>
            <small>Quantum Learning Platform</small>
          </span>
        </Link>

        <Link href="/" className="back-home">
          Back to home
        </Link>
      </header>

      <section className="login-layout">
        {/* Left side */}
        <div className="login-story">
          <div className="login-badge">
            <SparkIcon />
            Your quantum learning journey starts here
          </div>

          <h1>
            Learn.
            <span>Build.</span>
            Understand.
          </h1>

          <p>
            Explore quantum computing through interactive lessons, circuit
            building, simulation and intelligent guidance — all in one
            learning space.
          </p>

          <div className="login-mini-flow">
            <div className="mini-flow-item">
              <span>01</span>
              <strong>Learn</strong>
            </div>

            <i>→</i>

            <div className="mini-flow-item">
              <span>02</span>
              <strong>Build</strong>
            </div>

            <i>→</i>

            <div className="mini-flow-item">
              <span>03</span>
              <strong>Simulate</strong>
            </div>

            <i>→</i>

            <div className="mini-flow-item">
              <span>04</span>
              <strong>Grow</strong>
            </div>
          </div>

          <div className="login-quote">
            <span className="quote-line" />
            <p>
              "The fastest way to understand a quantum idea is to interact
              with it."
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="login-card-wrap">
          <div className="login-card-glow" />

          <div className="login-card">
            <div className="card-brand">
              <div className="card-brand-icon">
                <AtomIcon size={19} />
              </div>

              <div>
                <strong>Q-SENSE</strong>
                <span>Student Workspace</span>
              </div>
            </div>

            <div className="login-heading">
              <h2>Welcome back</h2>
              <p>Sign in to continue your quantum journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="demo-role-picker" aria-label="Demo workspace role">
                {(Object.keys(DEMO_ACCOUNTS) as DemoRole[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={item === role ? "demo-role-active" : ""}
                    onClick={() => {
                      setRole(item);
                      setEmail(DEMO_ACCOUNTS[item].email);
                      setPassword(DEMO_PASSWORD);
                      setError("");
                    }}
                  >
                    {DEMO_ACCOUNTS[item].title}
                  </button>
                ))}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email or username</label>

                <div className="input-wrapper">
                  <span className="input-prefix">@</span>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="forgot-button"
                    onClick={() =>
                      setError(
                        "For the demo workspace, use password: quantum123."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="input-wrapper">
                  <span className="input-prefix password-dot">••</span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />

                <span className="custom-checkbox">
                  {remember ? "✓" : ""}
                </span>

                <span>Remember me</span>
              </label>

              {error && (
                <div className="login-error">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Entering workspace...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowIcon />
                  </>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span />
              <p>or try demo access</p>
              <span />
            </div>

            <button
              type="button"
              className="demo-workspace"
              onClick={enterDemoWorkspace}
              disabled={loading}
            >
              <span className="demo-icon">
                <SparkIcon />
              </span>

              <span className="demo-copy">
                <strong>Enter Demo Workspace</strong>
                <small>Recommended first · guided student experience · no setup required</small>
              </span>

              <ArrowIcon />
            </button>

            <div className="login-footer-note">
              <span className="secure-dot" />
              Demo mode · No real account required
            </div>

            <div className="login-signup">
              Don't have an account?{" "}
              <Link href="/">Explore Q-SENSE</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}