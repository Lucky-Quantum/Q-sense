export type BackendGate = {
  name: "H" | "X" | "Y" | "Z" | "CX" | "M";
  qubit?: number;
  control?: number;
  target?: number;
};

export type TutorHistoryItem = {
  role: "user" | "ai";
  text: string;
};

export type TutorRequest = {
  action?: "explain" | "debug" | "optimize";
  message: string;
  page?: string;
  gates?: BackendGate[];
  probabilities?: number[];
  statevector?: Array<{
    basis: string;
    re: number;
    im: number;
    probability: number;
  }>;
  history?: TutorHistoryItem[];
};

export type TutorResponse = {
  text: string;
  provider: string;
};

export type SimulationResponse = {
  backend: string;
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  statevector: Array<{
    basis: string;
    re: number;
    im: number;
    probability: number;
  }>;
  circuit?: string;
  notice?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Backend request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function localTutorResponse(request: TutorRequest): TutorResponse {
  const gates = request.gates ?? [];
  const names = gates.map((gate) => gate.name.toUpperCase());
  const message = request.message.toLowerCase();
  const cxIndex = gates.findIndex((gate) => gate.name === "CX");
  const hasHOnQ0BeforeCX = gates.some(
    (gate, index) => gate.name === "H" && gate.qubit === 0 && (cxIndex < 0 || index < cxIndex)
  );
  const xAfterCXOnQ1 = cxIndex >= 0 && gates.slice(cxIndex + 1).some(
    (gate) => gate.name === "X" && gate.qubit === 1
  );
  const probabilities = request.probabilities ?? [];
  const [p00 = 0, p01 = 0, p10 = 0, p11 = 0] = probabilities;
  const hasBellPlusDistribution = p00 > 0.4 && p11 > 0.4 && p01 < 0.1 && p10 < 0.1;
  const hasPsiDistribution = p01 > 0.4 && p10 > 0.4 && p00 < 0.1 && p11 < 0.1;

  if (request.action === "debug" || /debug|error|issue|analy[sz]e|fix|wrong|changed/.test(message)) {
    if (xAfterCXOnQ1 || hasPsiDistribution) {
      return {
        provider: "local-fallback",
        text: "The circuit context suggests a bit-flip on q₁ after the CNOT. That changes the Bell state from Φ⁺ = (|00⟩ + |11⟩)/√2 to Ψ⁺ = (|01⟩ + |10⟩)/√2. If your simulation shows 01 and 10, those outcomes are consistent with this change. Remove the added X gate and run again to compare.",
      };
    }
    if (cxIndex >= 0 && !hasHOnQ0BeforeCX) {
      return {
        provider: "local-fallback",
        text: "I found a likely issue for a Bell-state experiment: the current circuit has a CNOT but no H gate on q₀ before it. Start from |00⟩, apply H to q₀, then CNOT with q₀ as control and q₁ as target. Run again and inspect the 00/11 probabilities.",
      };
    }
    if (hasBellPlusDistribution) {
      return {
        provider: "local-fallback",
        text: "The latest probabilities are consistent with the expected Bell state Φ⁺: about 50% |00⟩ and 50% |11⟩, with the other outcomes near zero. The H gate creates superposition; CNOT then correlates the qubits. To test debugging, introduce the teaching error, rerun, and compare the distribution.",
      };
    }
    if (gates.length === 0) {
      return {
        provider: "local-fallback",
        text: "I do not have a saved circuit to inspect yet. Open Quantum Lab, run a circuit once, then ask me to analyze it. I can compare the gate sequence with your goal and use the saved measurement probabilities when they are available.",
      };
    }
    return {
      provider: "local-fallback",
      text: `The current circuit contains ${names.join(", ") || "no recognized gates"}. I can't confirm a specific defect from the gate list alone. Run the circuit and compare the expected outcomes with the actual probabilities, then ask again so I can use both the circuit and result.`,
    };
  }

  if (request.action === "optimize" || /optim|simplif|reduce gate|shorter circuit/.test(message)) {
    for (let index = 0; index < gates.length - 1; index += 1) {
      const current = gates[index];
      const next = gates[index + 1];
      if (current.name === next.name && current.qubit === next.qubit && ["H", "X", "Y", "Z"].includes(current.name)) {
        return {
          provider: "local-fallback",
          text: `I found an educational simplification: two consecutive ${current.name} gates on q${current.qubit ?? 0} cancel because ${current.name} is self-inverse. Remove that pair and rerun the circuit to confirm the state is unchanged. This suggestion is based on the current gate sequence.`,
        };
      }
    }
    return {
      provider: "local-fallback",
      text: "For a small learning circuit, optimize only when you can explain why the change is equivalent. Check for adjacent self-inverse gate pairs (H-H, X-X, Y-Y or Z-Z) on the same qubit. I don't see a confirmed cancellation in the current gate list, so compare the statevector before and after any edit.",
    };
  }

  if (/bell|entangl/.test(message)) {
    return {
      provider: "local-fallback",
      text: "A Bell state is a two-qubit entangled state. Starting from |00⟩, apply H to q₀ to create (|00⟩ + |10⟩)/√2 in the two-qubit register, then apply CNOT with q₀ as control and q₁ as target. The ideal Φ⁺ output is (|00⟩ + |11⟩)/√2, so measurement produces correlated 00 and 11 outcomes at about 50% each.",
    };
  }
  if (/hadamard|superposition|\bh gate\b/.test(message)) {
    return {
      provider: "local-fallback",
      text: "The Hadamard (H) gate transforms |0⟩ into (|0⟩ + |1⟩)/√2. The two amplitudes have equal magnitude, so an ideal measurement returns 0 or 1 with probability 1/2 each. It creates superposition; it does not mean the qubit is simply two classical bits at once.",
    };
  }
  if (/cnot|controlled.?x|\bcx\b/.test(message)) {
    return {
      provider: "local-fallback",
      text: "CNOT flips the target qubit only when the control qubit is |1⟩. CNOT by itself does not always create entanglement. In the Bell-state circuit, H first puts q₀ into superposition; CNOT then correlates q₁ with q₀ and creates an entangled state.",
    };
  }
  if (/grover/.test(message)) {
    return {
      provider: "local-fallback",
      text: "Grover's algorithm searches an unstructured space by repeatedly increasing the amplitude of marked states. Its key teaching ideas are an oracle that marks the target and a diffusion step that amplifies its amplitude. For a real algorithm example, open Algorithms and choose Grover, then inspect the circuit and measurement distribution.",
    };
  }
  if (/hint|challenge|answer/.test(message) && request.page?.includes("challenges")) {
    return {
      provider: "local-fallback",
      text: "Hint: identify what the gate or algorithm changes before choosing an answer. For a Bell-state question, trace the circuit in order: initial state → H on q₀ → CNOT q₀→q₁ → measurement. I can explain the underlying concept without selecting an option for you.",
    };
  }

  return {
    provider: "local-fallback",
    text: "I can guide this demo using the current page and any saved circuit results. Try asking about the H gate, CNOT, Bell states, Grover's algorithm, or request a circuit diagnosis after running the Quantum Lab. For open-ended generative tutoring, configure the backend with an OpenRouter API key.",
  };
}

export async function askTutor(request: TutorRequest): Promise<TutorResponse> {
  try {
    return await postJSON<TutorResponse>("/api/ai", request);
  } catch {
    // Keep the screening experience usable even when the Python service isn't running.
    // The response is explicitly labeled as a local fallback, not as an OpenRouter result.
    return localTutorResponse(request);
  }
}

export async function simulateCircuitApi(
  gates: BackendGate[],
  shots = 1024
) {
  return postJSON<SimulationResponse>("/api/simulate", {
    gates,
    shots,
    backend: "Qiskit Aer",
  });
}

export function circuitCellsToBackendGates(
  circuit: Array<Array<string | null>>
): BackendGate[] {
  const gates: BackendGate[] = [];

  for (let column = 0; column < (circuit[0]?.length ?? 0); column += 1) {
    const q0 = circuit[0]?.[column] ?? null;
    const q1 = circuit[1]?.[column] ?? null;

    if (q0 === "CNOT" || q1 === "CNOT") {
      gates.push({ name: "CX", control: 0, target: 1 });
      continue;
    }

    if (q0 === "H" || q0 === "X" || q0 === "Y" || q0 === "Z") {
      gates.push({ name: q0, qubit: 0 });
    }

    if (q1 === "H" || q1 === "X" || q1 === "Y" || q1 === "Z") {
      gates.push({ name: q1, qubit: 1 });
    }
  }

  return gates;
}

export function getStoredCircuit() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("qsense-circuit");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 2) return null;
    return parsed as Array<Array<string | null>>;
  } catch {
    return null;
  }
}

export function getStoredSimulation(): SimulationResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("qsense-last-simulation");
    if (!raw) return null;
    return JSON.parse(raw) as SimulationResponse;
  } catch {
    return null;
  }
}
