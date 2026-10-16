"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BrandAtom from "@/components/brand/BrandAtom";
import {
  askTutor,
  circuitCellsToBackendGates,
  getStoredCircuit,
  getStoredSimulation,
} from "@/lib/api";

type TutorMessage = {
  role: "user" | "ai";
  text: string;
};

export default function FloatingTutor() {
  const pathname = usePathname();
  const currentPath = pathname || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("Demo guidance available");
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "ai" as const,
      text: "Hi! I’m your Q-SENSE AI Tutor. Ask me about a quantum concept or your current circuit.",
    },
  ]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Read from localStorage at send time rather than memoizing circuit data.
  // The Lab can change its circuit while this global panel stays mounted.
  function getCurrentContext() {
    const circuit = getStoredCircuit();
    const simulation = getStoredSimulation();
    return {
      gates: circuit ? circuitCellsToBackendGates(circuit) : [],
      probabilities: simulation
        ? ["00", "01", "10", "11"].map((key) => simulation.probabilities?.[key] ?? 0)
        : [],
      statevector: simulation?.statevector ?? [],
    };
  }

  useEffect(() => {
    if (!open) return;
    const context = getCurrentContext();
    if (currentPath.startsWith("/quantum-lab") && context.gates.length > 0) {
      const gateNames = context.gates.map((g) => g.name).join(" → ");
      const hasCx = context.gates.some((g) => g.name === "CX");
      let hint = `Your active circuit: ${gateNames}.`;
      if (!hasCx) {
        hint += " Tip: a CNOT after an H gate on q₀ creates entanglement. Try adding one to build a Bell state.";
      } else if (!context.gates.some((g) => g.name === "H" && g.qubit === 0)) {
        hint += " Tip: the CNOT looks ready — add an H gate on q₀ before it to prepare a Bell state.";
      } else {
        hint += " Tip: run the simulator, then ask me to analyze your results for deeper insight.";
      }
      setMessages((prev) => [...prev, { role: "ai", text: hint }]);
    }
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, currentPath]);

  const quickPrompts = useMemo(() => {
    if (currentPath.startsWith("/quantum-lab")) {
      return ["Analyze my current circuit", "Why did my result change?", "Help me debug this circuit"];
    }
    if (currentPath.startsWith("/learn")) {
      return ["Explain this concept simply", "Give me a quantum example", "What should I try next?"];
    }
    if (currentPath.startsWith("/challenges")) {
      return ["Give me a hint, not the answer", "Explain the key concept", "Why is this option correct?"];
    }
    if (currentPath.startsWith("/algorithms")) {
      return ["Explain Grover's algorithm", "Compare these algorithms", "When would I use this?"];
    }
    return ["Explain Bell states simply", "What can I try first?", "How does Q-SENSE work?"];
  }, [currentPath]);

  async function sendQuestion(rawQuestion: string) {
    const message = rawQuestion.trim();
    if (!message || busy) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setBusy(true);

    const lower = message.toLowerCase();
    const action = /debug|error|issue|analy[sz]e|fix|wrong|changed/.test(lower)
      ? "debug"
      : /optim|simplif|reduce gate|shorter circuit/.test(lower)
        ? "optimize"
        : "explain";

    try {
      const response = await askTutor({
        action,
        message,
        page: currentPath || undefined,
        ...getCurrentContext(),
        history: messages.slice(-6),
      });
      setProvider(
        response.provider === "openrouter"
          ? "OpenRouter connected"
          : response.provider === "backend-local"
            ? "Backend demo guidance"
            : "Local demo guidance · API optional"
      );
      setMessages((prev) => [...prev, { role: "ai", text: response.text }]);
    } catch {
      setProvider("Local demo guidance · API unavailable");
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I couldn't reach the AI service. You can still explore the built-in quantum explanations; start the backend and configure OpenRouter for generative tutoring." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    void sendQuestion(input);
  }

  return (
    <>
      {open && (
        <section className="floating-tutor-panel" aria-label="Q-SENSE AI Tutor">
          <div className="floating-tutor-header">
            <div className="floating-tutor-title">
              <div className="floating-tutor-icon"><BrandAtom /></div>
              <div>
                <strong>Q-SENSE AI Tutor</strong>
                <span>{provider}</span>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI Tutor">×</button>
          </div>

          <div className="floating-tutor-messages">
            {messages.slice(-5).map((message, index) => (
              <div key={`${message.role}-${index}`} className={`floating-tutor-message ${message.role}`}>
                <span>{message.role === "ai" ? "✦" : "YOU"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {busy && <div className="floating-tutor-typing"><i /><i /><i /></div>}
          </div>

          <div className="floating-tutor-prompts" aria-label="Suggested questions">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" disabled={busy} onClick={() => void sendQuestion(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="floating-tutor-input" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submit();
                }
              }}
              rows={1}
              placeholder="Ask a quantum question..."
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send question">→</button>
          </form>

          <button
            type="button"
            className="floating-tutor-full"
            onClick={() => router.push("/ai-tutor")}
          >
            Open full AI Tutor →
          </button>
        </section>
      )}

      <button
        type="button"
        className={`floating-tutor-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open Q-SENSE AI Tutor"
        title="Q-SENSE AI Tutor"
      >
        <span className="floating-tutor-orbit" />
        <BrandAtom />
      </button>
    </>
  );
}
