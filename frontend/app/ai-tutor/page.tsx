"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import { askTutor, circuitCellsToBackendGates, getStoredCircuit, getStoredSimulation } from "@/lib/api";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

const QUICK_PROMPTS = [
  "Explain Bell states simply",
  "Why does H create superposition?",
  "Find an issue in my circuit",
  "How does CNOT create entanglement?",
];

export default function AITutorPage() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState("local fallback");
  const [contextLabel, setContextLabel] = useState("Learning context");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text:
        "Hey Lucky 👋 I’m your Q-SENSE Quantum Tutor. Ask a question, or let me inspect the circuit you last ran in Quantum Lab.",
    },
  ]);

  useEffect(() => {
    if (!localStorage.getItem("qsense-session")) {
      router.replace("/login");
    }

    const savedCircuit = getStoredCircuit();
    setContextLabel(savedCircuit ? "Current Lab circuit connected" : "Learning context ready");
  }, [router]);

  const getContext = () => {
    const circuit = getStoredCircuit();
    const simulation = getStoredSimulation();
    return {
      gates: circuit ? circuitCellsToBackendGates(circuit) : [],
      probabilities: simulation
        ? ["00", "01", "10", "11"].map((key) => simulation.probabilities?.[key] ?? 0)
        : [],
      statevector: simulation?.statevector ?? [],
    };
  };

  const sendMessage = async (customText?: string) => {
    const question = (customText ?? input).trim();
    if (!question || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: question,
    };
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await askTutor({
        action: "explain",
        message: question,
        page: "/ai-tutor",
        ...getContext(),
        history: messages.slice(-8).map((item) => ({ role: item.role, text: item.text })),
      });
      setProvider(response.provider === "openrouter" ? "OpenRouter connected" : "Local fallback");
      setMessages((previous) => [
        ...previous,
        { id: Date.now() + 1, role: "ai", text: response.text },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "I couldn’t reach the Q-SENSE backend. Start the backend and check NEXT_PUBLIC_API_BASE_URL.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const analyzeCircuit = async () => {
    setIsTyping(true);
    try {
      const response = await askTutor({
        action: "debug",
        message: "Analyze my current circuit and explain whether it matches the intended Bell-state experiment. Mention any concrete issue supported by the simulation context.",
        page: "/ai-tutor",
        ...getContext(),
        history: messages.slice(-6).map((item) => ({ role: item.role, text: item.text })),
      });
      setProvider(response.provider === "openrouter" ? "OpenRouter connected" : "Local fallback");
      setMessages((previous) => [
        ...previous,
        { id: Date.now(), role: "ai", text: response.text },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        { id: Date.now(), role: "ai", text: "The circuit analysis service is unavailable right now." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <main className="ai-tutor-page">
      <div className="ai-tutor-grid-bg" />

      <div className="ai-tutor-glow ai-tutor-glow-one" />
      <div className="ai-tutor-glow ai-tutor-glow-two" />

      {/* SIDEBAR */}

      <aside className="ai-tutor-sidebar">
        <div className="ai-tutor-brand">
          <div className="ai-tutor-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <strong>Q-SENSE</strong>
            <span>
              Quantum Learning Platform
            </span>
          </div>
        </div>

        <nav className="ai-tutor-nav">
          <AITutorNav
            label="Dashboard"
            icon="⌂"
            href="/dashboard"
          />

          <AITutorNav
            label="Learn"
            icon="◈"
            href="/learn"
          />

          <AITutorNav
            label="Quantum Lab"
            icon="⌘"
            href="/quantum-lab"
          />

          <AITutorNav
            label="Algorithms"
            icon="◇"
            href="/algorithms"
          />

          <AITutorNav
            label="Progress"
            icon="↗"
            href="/progress"
          />

          <AITutorNav
            label="AI Tutor"
            icon="✦"
            href="/ai-tutor"
            active
          />

          <AITutorNav
            label="Challenges"
            icon="⚡"
            href="/challenges"
          />
        </nav>

        <div className="ai-tutor-sidebar-divider" />

        <AITutorNav
          label="Settings"
          icon="⚙"
          href="/settings"
        />

        <AITutorNav
          label="Help"
          icon="?"
          href="/help"
        />

        <div className="ai-tutor-sidebar-card">
          <div className="ai-tutor-mini-orbit">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Ask better questions.</strong>
            <br />
            Your curiosity is part of the learning
            process.
          </p>
        </div>
      </aside>

      {/* MAIN */}

      <section className="ai-tutor-main">
        {/* SAME TOPBAR STYLE AS LEARN */}

        <header className="ai-tutor-topbar">
          <div className="ai-tutor-breadcrumb">
            <span>Dashboard</span>
            <b>/</b>
            <strong>AI Tutor</strong>
          </div>

          <div className="ai-tutor-topbar-right">
            <button className="ai-tutor-notification">
              ♢
              <span />
            </button>

            <div className="ai-tutor-avatar">
              L
            </div>

            <div className="ai-tutor-user-info">
              <strong>Hello, Lucky</strong>
              <small>Student</small>
            </div>

            <span className="ai-tutor-user-arrow">
              ▾
            </span>
          </div>
        </header>

        <div className="ai-tutor-content">
          {/* HEADER */}

          <section className="ai-tutor-page-heading">
            <div>
              <p className="ai-tutor-eyebrow">
                AI QUANTUM TUTOR
              </p>

              <h1>
                Learn quantum
                <br />
                <span>with guidance.</span>
              </h1>

              <p>
                Ask questions, inspect circuits and
                build intuition with an AI tutor designed
                around your quantum learning journey.
              </p>
            </div>

            <div className="ai-tutor-status">
              <div className="ai-tutor-status-dot" />

              <div>
                <strong>Tutor Ready</strong>
                <span>{contextLabel}</span>
              </div>
            </div>
          </section>

          {/* WORKSPACE */}

          <section className="ai-tutor-workspace">
            {/* CHAT */}

            <div className="ai-chat-panel">
              <div className="ai-chat-header">
                <div className="ai-chat-title">
                  <div className="ai-chat-icon">
                    ✦
                  </div>

                  <div>
                    <strong>Quantum Tutor</strong>
                    <span>
                      Concept + circuit guidance
                    </span>
                  </div>
                </div>

                <span className="ai-chat-online">
                  {provider}
                </span>
              </div>

              <div className="ai-chat-messages">
                {messages.map((message) => (
                  <div
                    className={`ai-message ${
                      message.role === "user"
                        ? "ai-message-user"
                        : "ai-message-tutor"
                    }`}
                    key={message.id}
                  >
                    {message.role === "ai" && (
                      <div className="ai-message-avatar">
                        ✦
                      </div>
                    )}

                    <div className="ai-message-body">
                      <span className="ai-message-role">
                        {message.role === "ai"
                          ? "Q-SENSE TUTOR"
                          : "YOU"}
                      </span>

                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="ai-message ai-message-tutor">
                    <div className="ai-message-avatar">
                      ✦
                    </div>

                    <div className="ai-message-body">
                      <span className="ai-message-role">
                        Q-SENSE TUTOR
                      </span>

                      <div className="ai-typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK PROMPTS */}

              <div className="ai-quick-prompts">
                <span>TRY ASKING</span>

                <div>
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() =>
                        sendMessage(prompt)
                      }
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT */}

              <div className="ai-chat-input-wrap">
                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask your quantum question..."
                  rows={1}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className={
                    input.trim()
                      ? "ai-send-active"
                      : ""
                  }
                >
                  →
                </button>
              </div>

              <small className="ai-chat-disclaimer">
                Q-SENSE Tutor is designed to guide your
                reasoning. Verify important results through
                simulation.
              </small>
            </div>

            {/* RIGHT COLUMN */}

            <div className="ai-tutor-context-column">
              {/* CURRENT CIRCUIT */}

              <div className="ai-context-card ai-circuit-card">
                <div className="ai-context-header">
                  <div>
                    <span>ACTIVE CONTEXT</span>
                    <h2>Connected Circuit</h2>
                  </div>

                  <span className="ai-context-badge">
                    LEARNING CONTEXT
                  </span>
                </div>

                <div className="ai-circuit-preview">
                  <div className="ai-circuit-row">
                    <label>q₀</label>

                    <i />

                    <b>H</b>

                    <i />

                    <em>●</em>

                    <i />
                  </div>

                  <div className="ai-circuit-row">
                    <label>q₁</label>

                    <i />

                    <span />

                    <i />

                    <em>⊕</em>

                    <i />
                  </div>

                  <div className="ai-circuit-connector" />
                </div>

                <div className="ai-circuit-footer">
                  <div>
                    <span>GATES</span>
                    <strong>H + CNOT</strong>
                  </div>

                  <div>
                    <span>QUBITS</span>
                    <strong>2</strong>
                  </div>
                </div>

                <button
                  className="ai-analyze-button"
                  onClick={analyzeCircuit}
                >
                  <span>✦</span>
                  {isTyping ? "Analyzing…" : "Analyze My Circuit"}
                  <b>→</b>
                </button>
              </div>

              {/* ANALYSIS */}

              <div className="ai-context-card ai-analysis-card">
                <div className="ai-analysis-heading">
                  <div className="ai-insight-icon">
                    ◇
                  </div>

                  <div>
                    <span>AI INSIGHTS</span>
                    <h2>
                      What&apos;s happening?
                    </h2>
                  </div>
                </div>

                <div className="ai-insight-list">
                  <div>
                    <span>01</span>
                    <div>
                      <strong>
                        State preparation
                      </strong>

                      <p>
                        H can place q₀ into
                        a superposition of |0⟩ and |1⟩.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span>02</span>
                    <div>
                      <strong>
                        Correlation
                      </strong>

                      <p>
                        CNOT transfers the control
                        qubit&apos;s influence to q₁.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span>03</span>
                    <div>
                      <strong>
                        Measurement
                      </strong>

                      <p>
                        For the Bell-state example,
                        ideal measurement produces correlated
                        00 / 11 outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT STEP */}

              <div className="ai-next-step">
                <div className="ai-next-icon">
                  →
                </div>

                <div>
                  <span>NEXT RECOMMENDATION</span>

                  <h3>
                    Introduce an error
                  </h3>

                  <p>
                    Remove the H gate and ask the tutor
                    how the measurement probabilities
                    change.
                  </p>
                </div>

                <button
                  onClick={() =>
                    sendMessage(
                      "What changes if I remove the H gate?"
                    )
                  }
                >
                  Explore
                </button>
              </div>
            </div>
          </section>

          {/* TUTOR CAPABILITIES */}

          <section className="ai-capabilities">
            <div className="ai-section-heading">
              <span>WHAT YOUR TUTOR CAN DO</span>

              <h2>
                More than answering questions.
              </h2>
            </div>

            <div className="ai-capability-grid">
              <div className="ai-capability-card">
                <div>◈</div>

                <h3>
                  Explain Concepts
                </h3>

                <p>
                  Turn abstract quantum ideas into
                  intuitive, step-by-step explanations.
                </p>
              </div>

              <div className="ai-capability-card">
                <div>⌘</div>

                <h3>
                  Inspect Circuits
                </h3>

                <p>
                  Reason about gates, qubits and the
                  structure of your current circuit.
                </p>
              </div>

              <div className="ai-capability-card">
                <div>⚡</div>

                <h3>
                  Debug Mistakes
                </h3>

                <p>
                  Understand what went wrong and why
                  a change affects your result.
                </p>
              </div>

              <div className="ai-capability-card">
                <div>↗</div>

                <h3>
                  Guide Your Next Step
                </h3>

                <p>
                  Move from concept to experiment to
                  challenge without losing context.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}

          <section className="ai-tutor-bottom-cta">
            <div className="ai-cta-orbit">
              <span />
              <span />
            </div>

            <div>
              <span>KEEP EXPERIMENTING</span>

              <h2>
                Ask a question. Run an experiment.
                Learn why.
              </h2>

              <p>
                The fastest way to understand quantum
                computing is to connect theory with
                something you can actually build.
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

function AITutorNav({
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
      className={`ai-tutor-nav-item ${
        active ? "ai-tutor-nav-active" : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}