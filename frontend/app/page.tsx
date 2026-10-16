import Link from "next/link";
import FAQAccordion from "@/components/landing/FAQAccordion";
import dynamic from "next/dynamic";
import Reveal from "@/components/landing/Reveal";
import LandingNav from "@/components/landing/LandingNav";
import AlgorithmAutoScroll from "@/components/landing/AlgorithmAutoScroll";

const QuantumLaptop = dynamic(
  () => import("@/components/landing/QuantumLaptop"),
  { ssr: false }
);

const QuantumOrbits = dynamic(
  () => import("@/components/landing/QuantumOrbits"),
  { ssr: false }
);

const features = [
  {
    n: "01",
    title: "Understand what your circuit actually does.",
    text: "Turn abstract gates into visible state changes, probabilities and measurement outcomes you can reason about.",
    visual: "state",
  },
  {
    n: "02",
    title: "Build without being trapped in code.",
    text: "Place gates on multi-qubit wires, run the circuit, and inspect how the output changes.",
    visual: "build",
  },
  {
    n: "03",
    title: "Get guidance that understands your circuit.",
    text: "Ask why a result changed, identify likely mistakes, or get a hint grounded in your active circuit and simulation.",
    visual: "ai",
  },
  {
    n: "04",
    title: "Learn through experimentation.",
    text: "Change a gate, compare the outcome and understand cause-and-effect instead of memorising a predefined path.",
    visual: "whatif",
  },
] as const;

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Play() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />
    </svg>
  );
}

function AtomIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function MiniIcon({ type }: { type: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "book")
    return <svg {...common}><path d="M4 5.5 12 2l8 3.5L12 9 4 5.5Z" /><path d="M6 8.2V14c0 2.1 2.7 4 6 4s6-1.9 6-4V8.2" /><path d="M20 6v6" /></svg>;

  if (type === "build")
    return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="m9 15 2.4-2.4L9 10.2" /><path d="M13.5 16h3.3" /></svg>;

  if (type === "eye")
    return <svg {...common}><path d="M2.5 12s3.2-6.2 9.5-6.2 9.5 6.2 9.5 6.2-3.2 6.2-9.5 6.2S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>;

  if (type === "brain")
    return <svg {...common}><path d="M12 4.5a3 3 0 1 0-6 .4 4 4 0 0 0-2 6.7A4 4 0 0 0 6.5 18a3.5 3.5 0 0 0 5.5-2.8" /><path d="M12 4.5a3 3 0 1 1 6 .4 4 4 0 0 1 2 6.7 4 4 0 0 1-2.5 6.4 3.5 3.5 0 0 1-5.5-2.8" /><path d="M12 6v11" /></svg>;

  if (type === "target")
    return <svg {...common}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></svg>;

  return <svg {...common}><circle cx="8.2" cy="8.2" r="3" /><circle cx="16" cy="8.2" r="3" /><path d="M3.5 20c.5-3 2.2-4.5 4.8-4.5S12.6 17 13 20" /><path d="M11 20c.6-3 2.3-4.5 4.9-4.5S20.5 17 21 20" /></svg>;
}

function BenefitVisual({ type }: { type: string }) {
  if (type === "state") {
    return (
      <div className="benefit-visual state-visual">
        <div className="visual-top">
          <span>Live State Mapping</span>
          <span className="visual-chip">H gate</span>
        </div>
        <div className="state-stage">
          <div className="state-before">
            <span className="state-label">Before</span>
            <strong>|0⟩</strong>
          </div>
          <div className="state-arrow">→</div>
          <div className="state-sphere">
            <div className="sphere-grid" />
            <div className="sphere-vector" />
            <span className="sphere-point" />
          </div>
          <div className="state-after">
            <span className="state-label">After</span>
            <strong>α|0⟩ + β|1⟩</strong>
          </div>
        </div>
      </div>
    );
  }

  if (type === "build") {
    return (
      <div className="benefit-visual build-visual">
        <div className="visual-top">
          <span>Circuit → Code</span>
          <span className="visual-chip">Apply to update</span>
        </div>
        <div className="build-split">
          <div className="mini-circuit">
            <div className="mini-wire"><span className="mini-q">q0</span><i>H</i><b>●</b></div>
            <div className="mini-wire"><span className="mini-q">q1</span><i className="blank" /><b className="target">X</b></div>
          </div>
          <div className="mini-code">
            <code>qc.h(0)</code>
            <code>qc.cx(0, 1)</code>
            <code>qc.measure_all()</code>
          </div>
        </div>
        <div className="drag-pill"><span>＋</span> Drag gate onto circuit</div>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="benefit-visual ai-visual">
        <div className="ai-card-head">
          <span className="ai-orb">✦</span>
          <div><strong>AI Quantum Copilot</strong><small>Circuit-aware</small></div>
          <span className="ai-status">●</span>
        </div>
        <div className="ai-alert">⚠ Unexpected measurement pattern</div>
        <p>Your X gate changes the expected Bell-state outcome.</p>
        <div className="ai-actions"><span>Explain</span><span>Give Hint</span><span>Optimize</span></div>
      </div>
    );
  }

  return (
    <div className="benefit-visual whatif-visual">
      <div className="visual-top">
        <span>What-If Experiment</span>
        <span className="visual-chip">Compare</span>
      </div>
      <div className="compare-row">
        <div className="compare-panel">
          <small>Original · H(q0) → CX(0,1)</small>
          <div className="compare-circuit">q0: H ─ ●<br />q1: ─── ⊕</div>
          <strong>50% <span>|00⟩</span></strong>
          <strong>50% <span>|11⟩</span></strong>
        </div>
        <div className="compare-arrow">↔</div>
        <div className="compare-panel modified">
          <small>Modified · add X(q1)</small>
          <div className="compare-circuit">q0: H ─ ●<br />q1: ─ ⊕ ─ X</div>
          <strong>50% <span>|01⟩</span></strong>
          <strong>50% <span>|10⟩</span></strong>
        </div>
      </div>
      <div className="whatif-note">What changed? <span>An X on q1 flips the Bell-state measurement labels.</span></div>
    </div>
  );
}

const featureTiles = [
  ["book", "Interactive Learning", "Learn concepts through experiments instead of only reading."],
  ["build", "Build & Simulate", "Create circuits visually or with code, then run them."],
  ["eye", "Visualize Quantum States", "See states, probabilities and results as they change."],
  ["brain", "AI Copilot", "Understand, debug and improve with contextual guidance."],
  ["target", "Assess & Practice", "Turn concepts into circuit-building and coding skills."],
  ["people", "For Everyone", "Designed for students, researchers, professionals and educators."],
] as const;

const workflow = [
  ["book", "01", "Learn", "Explore concepts with interactive lessons."],
  ["build", "02", "Build", "Place gates on the circuit wires or edit the supported Qiskit-style code."],
  ["play", "03", "Simulate", "Run experiments using quantum simulators."],
  ["eye", "04", "Visualize", "See states, probabilities and measurement outcomes."],
  ["brain", "05", "Improve", "Get AI guidance and your next best challenge."],
] as const;

export default function Home() {
  return (
    <main className="qsense-page">
      <header className="site-nav">
        <div className="nav-shell">
          <Link href="/" className="nav-brand">
            <span className="brand-mark"><AtomIcon size={20} /></span>
            <span>
              <b>Q-SENSE</b>
              <small>Quantum Learning Platform</small>
            </span>
          </Link>

          <LandingNav />

          <div className="nav-ctas">
            <a href="#features" className="nav-search" aria-label="Explore features">⌕</a>
            <a href="/login" className="nav-signin">Sign In</a>
            <a href="/login" className="nav-start">Try Demo</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-shell">
          <div className="hero-copy">
            <div className="eyebrow">AI-Powered Quantum Learning Platform</div>

            <h1>
              From Qubits to
              <span>Real-World Impact</span>
            </h1>

            <p>
              Learn quantum computing by building, simulating and visualizing
              real quantum circuits — with intelligent guidance that helps you
              understand every step.
            </p>

            <div className="hero-buttons">
              <a href="/login" className="primary-cta">
                Start Learning Free <Arrow />
              </a>
              <a href="#learn" className="secondary-cta">
                <Play /> See How It Works
              </a>
            </div>

            <div className="hero-note">
              <div className="mini-avatars">
                <span>Q</span><span>+</span><span>∞</span>
              </div>
              <div>
                <strong>Learn through experimentation</strong>
                <small><span>★★★★★</span> Interactive • Visual • Guided</small>
              </div>
            </div>
          </div>

          <div className="hero-visual" id="demo">
            <QuantumOrbits />
            <QuantumLaptop />
            <div className="hero-glass-note">
              <div className="tiny-icon">✦</div>
              <div><strong>Circuit-aware guidance</strong><span>Understand what changed and why.</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="section-shell trust-shell">
          <span className="trust-intro">Built around the quantum ecosystem</span>
          <div className="trust-items">
            <span>QUANTUM STATES</span>
            <span>CIRCUIT DESIGN</span>
            <span>SIMULATION</span>
            <span>VISUALIZATION</span>
            <span>AI GUIDANCE</span>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="problem-section">
        <div className="section-shell problem-grid">
          <Reveal className="problem-copy">
            <div className="section-eyebrow">Why Q-SENSE?</div>
            <h2>Quantum computing shouldn't feel like a black box.</h2>
            <p>
              The hardest part isn't finding another explanation. It's
              connecting the explanation to what happens when you actually
              build and run a circuit.
            </p>
          </Reveal>

          <Reveal className="problem-list" delay={100}>
            <div className="problem-item">
              <span>01</span><div><strong>Abstract concepts</strong><p>Superposition and entanglement are difficult to visualize.</p></div>
            </div>
            <div className="problem-item">
              <span>02</span><div><strong>Fragmented learning</strong><p>Lessons, coding and simulators often live in separate tools.</p></div>
            </div>
            <div className="problem-item">
              <span>03</span><div><strong>Black-box execution</strong><p>Running a circuit doesn't always explain the resulting state.</p></div>
            </div>
            <div className="problem-item">
              <span>04</span><div><strong>Generic assistance</strong><p>Static content rarely adapts to a learner's actual mistakes.</p></div>
            </div>
          </Reveal>
        </div>

        <div className="solution-band">
          <div className="section-shell solution-shell">
            <div>
              <div className="section-eyebrow">The Q-SENSE Approach</div>
              <h2>One connected learning experience.</h2>
            </div>
            <div className="solution-flow">
              <span>Learn</span><i>→</i><span>Build</span><i>→</i><span>Simulate</span><i>→</i><span>Visualize</span><i>→</i><span>Improve</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="features" className="benefits-section">
        <div className="section-shell">
          <Reveal className="section-intro">
            <div className="section-eyebrow">Why it feels different</div>
            <h2>Learn by <span>seeing, building and experimenting.</span></h2>
            <p>Four core experiences turn the abstract into something you can actually work with.</p>
          </Reveal>

          <div className="benefit-list">
            {features.map((feature, index) => (
              <Reveal key={feature.n} delay={index * 100} className={`benefit-row ${index % 2 ? "reverse" : ""}`}>
                <div className="benefit-copy">
                  <span className="benefit-number">{feature.n}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <a href="/login">Explore in the demo <Arrow /></a>
                </div>
                <BenefitVisual type={feature.visual} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="learn" className="workflow-section">
        <div className="section-shell workflow-shell">
          <Reveal className="workflow-intro">
            <div>
              <div className="section-eyebrow">How it works</div>
              <h2>Your quantum journey in five simple steps.</h2>
              <p>Your concepts, circuits, simulations and practice stay connected inside one learning loop.</p>
            </div>
            <a href="/login" className="primary-cta small">Start Your Journey <Arrow /></a>
          </Reveal>

          <div className="workflow-steps">
            {workflow.map(([icon, number, title, text], index) => (
              <Reveal key={number} delay={index * 80} className="workflow-step-wrap">
                <div className="workflow-step">
                  <div className="workflow-icon"><MiniIcon type={icon} /></div>
                  <div className="workflow-number">{number}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                {index < workflow.length - 1 && <div className="workflow-arrow">→</div>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ALGORITHMS */}
      <section id="algorithms" className="algorithms-section">
        <div className="section-shell">
          <Reveal className="section-intro split-heading">
            <div>
              <div className="section-eyebrow">Explore Algorithms</div>
              <h2>Go beyond gates.</h2>
            </div>
            <p>Explore standard algorithms through the same learn → build → simulate → visualize workflow.</p>
          </Reveal>

          <div className="algorithm-grid" id="qsense-algorithm-grid">
            {[
              ["Bell State", "Beginner", "Build and understand your first entangled state."],
              ["Deutsch–Jozsa", "Beginner", "Explore a classic algorithm through visual reasoning."],
              ["Grover", "Intermediate", "See amplitude amplification step by step."],
              ["Quantum Teleportation", "Advanced", "Understand how quantum state transfer works without moving the physical qubit."],
              ["QAOA", "Advanced", "Explore the hybrid approach to combinatorial optimization."],
              ["VQE", "Advanced", "See how variational circuits estimate ground-state energies."],
            ].map(([name, level, text], index) => (
              <Reveal key={name} delay={index * 90}>
                <article className="algorithm-card">
                  <div className="algorithm-card-top">
                    <span className="algorithm-symbol"><AtomIcon size={22} /></span>
                    <span className="level">{level}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <a href="/login">Explore <Arrow /></a>
                </article>
              </Reveal>
            ))}
          </div>
          <AlgorithmAutoScroll />
        </div>
      </section>

      {/* IMPACT / SOCIAL PROOF */}
      <section id="about" className="impact-section">
        <div className="section-shell impact-shell">
          <Reveal className="impact-copy">
            <div className="section-eyebrow">Real Impact</div>
            <h2>Bridge the quantum knowledge gap — one learner at a time.</h2>
            <p>
              Q-SENSE is designed around a simple idea: learners understand
              difficult concepts better when they can immediately experiment,
              observe and ask questions.
            </p>

            <div className="impact-points">
              <div><strong>01</strong><span>Interactive<br />Learning</span></div>
              <div><strong>02</strong><span>Hands-on<br />Experimentation</span></div>
              <div><strong>03</strong><span>Personalized<br />Guidance</span></div>
              <div><strong>04</strong><span>Measurable<br />Progress</span></div>
            </div>
          </Reveal>

          <Reveal className="proof-card" delay={120}>
            <p>
              Understand what your circuit does, see why the result changes,
              and know what to try next.
            </p>
            <div className="proof-source">
              <span>Q</span>
              <div><strong>Q-SENSE learning principle</strong><small>Learn • Build • Simulate • Grow</small></div>
            </div>
          </Reveal>

          <Reveal className="impact-art" delay={200}>
            <div className="impact-art-header">
              <span>Guidance</span>
              <span>Progress</span>
            </div>
            <div className="impact-art-orbits">
              <span className="impact-core" />
              <i /><i /><i />
            </div>
            <div className="impact-art-text">
              <strong>Build Today.</strong>
              <span>Understand Tomorrow.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-shell faq-shell">
          <Reveal className="section-intro">
            <div className="section-eyebrow">Frequently asked</div>
            <h2>Questions learners usually have.</h2>
          </Reveal>

          <div className="faq-grid">
            {[
              ["Do I need access to a quantum computer?", "No physical hardware is required to start. The platform is designed around simulator-based experimentation."],
              ["Do I need an advanced physics background?", "No. The learning path starts with foundations and progressively introduces more advanced concepts."],
              ["Can I use code instead of the visual builder?", "Yes. Q-SENSE is designed to support both graphical circuit construction and code-based workflows."],
              ["Which quantum frameworks can I learn with?", "The architecture is designed around major quantum development ecosystems including Qiskit, PennyLane and Cirq."],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={i * 80}>
                <details className="faq-item" name="qsense-faq">
                  <summary>{q}<span>+</span></summary>
                  <p>{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="final-cta-section">
        <div className="section-shell">
          <div className="final-cta">
            <div className="cta-wave wave-one" />
            <div className="cta-wave wave-two" />
            <div className="cta-copy">
              <div className="section-eyebrow">Ready to explore the quantum world?</div>
              <h2>Turn your curiosity into real quantum skills.</h2>
              <p>Learn the concepts. Build the circuit. See what happens.</p>
            </div>

            <a href="/login" className="primary-cta cta-button">Get Started Free <Arrow /></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="section-shell footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-brand">
              <span className="brand-mark"><AtomIcon size={20} /></span>
              <span><b>Q-SENSE</b><small>Quantum Learning Platform</small></span>
            </Link>
            <p>Learn • Build • Simulate • Grow</p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#learn">Learn</a>
            <a href="#algorithms">Algorithms</a>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <a href="/help">Documentation</a>
            <a href="/challenges">Challenges</a>
            <a href="/learn">Learning Guide</a>
            <a href="/help">FAQs</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Q-SENSE</a>
            <a href="/help">Contact & Support</a>
            <a href="/login">Open Demo Workspace</a>
          </div>
        </div>

        <div className="section-shell footer-bottom">
          <span>© 2026 Q-SENSE. Learn · Build · Simulate · Grow.</span>
          <span>Bridging quantum theory and practice.</span>
        </div>
      </footer>
    </main>
  );
}