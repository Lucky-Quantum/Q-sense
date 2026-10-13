"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DragEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import BrandAtom from "@/components/brand/BrandAtom";
import { circuitCellsToBackendGates, simulateCircuitApi } from "@/lib/api";

type Gate = "H" | "X" | "Y" | "Z" | "CNOT" | "ERASE";

type Complex = {
  re: number;
  im: number;
};

type Cell = Gate | null;

const COLUMNS = 8;

const initialCircuit: Cell[][] = [
  [
    null,
    "H",
    null,
    "CNOT",
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    "CNOT",
    null,
    null,
    null,
    null,
  ],
];

const navItems = [
  {
    label: "Dashboard",
    icon: "⌂",
    href: "/dashboard",
  },
  {
    label: "Learn",
    icon: "◈",
    href: "/learn",
  },
  {
    label: "Quantum Lab",
    icon: "⌘",
    href: "/quantum-lab",
  },
  {
    label: "Algorithms",
    icon: "◇",
    href: "/algorithms",
  },
  {
    label: "Progress",
    icon: "↗",
    href: "/progress",
  },
  {
    label: "AI Tutor",
    icon: "✦",
    href: "/ai-tutor",
  },
  {
    label: "Challenges",
    icon: "⚡",
    href: "/challenges",
  },
];

function complexMultiply(
  a: Complex,
  b: Complex
): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function complexAdd(
  a: Complex,
  b: Complex
): Complex {
  return {
    re: a.re + b.re,
    im: a.im + b.im,
  };
}

function probability(value: Complex) {
  return value.re * value.re + value.im * value.im;
}

function magnitude(value: Complex) {
  return Math.sqrt(probability(value));
}

function formatComplex(value: Complex) {
  const epsilon = 0.0001;

  const re =
    Math.abs(value.re) < epsilon
      ? 0
      : value.re;

  const im =
    Math.abs(value.im) < epsilon
      ? 0
      : value.im;

  const format = (n: number) =>
    Number(n.toFixed(3));

  if (im === 0) {
    return `${format(re)}`;
  }

  if (re === 0) {
    return `${format(im)}i`;
  }

  return `${format(re)} ${im >= 0 ? "+" : "-"
    } ${Math.abs(format(im))}i`;
}

function applySingleQubitGate(
  state: Complex[],
  qubit: number,
  matrix: Complex[][]
) {
  const result = state.map((value) => ({
    re: value.re,
    im: value.im,
  }));

  const step = 1 << (1 - qubit);

  for (
    let base = 0;
    base < 4;
    base += step * 2
  ) {
    for (
      let offset = 0;
      offset < step;
      offset++
    ) {
      const i0 = base + offset;
      const i1 = i0 + step;

      const a = state[i0];
      const b = state[i1];

      result[i0] = complexAdd(
        complexMultiply(matrix[0][0], a),
        complexMultiply(matrix[0][1], b)
      );

      result[i1] = complexAdd(
        complexMultiply(matrix[1][0], a),
        complexMultiply(matrix[1][1], b)
      );
    }
  }

  return result;
}

function applyCNOT(
  state: Complex[],
  control: number,
  target: number
) {
  const result = state.map((value) => ({
    re: value.re,
    im: value.im,
  }));

  for (let index = 0; index < 4; index++) {
    const controlBit =
      (index >> (1 - control)) & 1;

    if (controlBit === 0) continue;

    const targetMask =
      1 << (1 - target);

    const targetIndex =
      index ^ targetMask;

    if (index < targetIndex) {
      result[index] = state[targetIndex];
      result[targetIndex] = state[index];
    }
  }

  return result;
}

function simulateCircuit(
  circuit: Cell[][]
) {
  let state: Complex[] = [
    { re: 1, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
  ];

  const h = [
    [
      {
        re: 1 / Math.sqrt(2),
        im: 0,
      },
      {
        re: 1 / Math.sqrt(2),
        im: 0,
      },
    ],
    [
      {
        re: 1 / Math.sqrt(2),
        im: 0,
      },
      {
        re: -1 / Math.sqrt(2),
        im: 0,
      },
    ],
  ];

  const x = [
    [
      { re: 0, im: 0 },
      { re: 1, im: 0 },
    ],
    [
      { re: 1, im: 0 },
      { re: 0, im: 0 },
    ],
  ];

  const y = [
    [
      { re: 0, im: 0 },
      { re: 0, im: -1 },
    ],
    [
      { re: 0, im: 1 },
      { re: 0, im: 0 },
    ],
  ];

  const z = [
    [
      { re: 1, im: 0 },
      { re: 0, im: 0 },
    ],
    [
      { re: 0, im: 0 },
      { re: -1, im: 0 },
    ],
  ];

  for (
    let column = 0;
    column < COLUMNS;
    column++
  ) {
    const top = circuit[0][column];
    const bottom = circuit[1][column];

    if (top === "CNOT" && bottom === "CNOT") {
      state = applyCNOT(
        state,
        0,
        1
      );
      continue;
    }

    if (
      top !== "CNOT" &&
      bottom !== "CNOT"
    ) {
      if (top === "H") {
        state = applySingleQubitGate(
          state,
          0,
          h
        );
      }

      if (top === "X") {
        state = applySingleQubitGate(
          state,
          0,
          x
        );
      }

      if (top === "Y") {
        state = applySingleQubitGate(
          state,
          0,
          y
        );
      }

      if (top === "Z") {
        state = applySingleQubitGate(
          state,
          0,
          z
        );
      }

      if (bottom === "H") {
        state = applySingleQubitGate(
          state,
          1,
          h
        );
      }

      if (bottom === "X") {
        state = applySingleQubitGate(
          state,
          1,
          x
        );
      }

      if (bottom === "Y") {
        state = applySingleQubitGate(
          state,
          1,
          y
        );
      }

      if (bottom === "Z") {
        state = applySingleQubitGate(
          state,
          1,
          z
        );
      }
    }
  }

  return state;
}

function sameNumber(
  a: number,
  b: number
) {
  return Math.abs(a - b) < 0.001;
}

function circuitToQiskitCode(circuit: Cell[][]): string {
  const lines = [
    "from qiskit import QuantumCircuit",
    "qc = QuantumCircuit(2, 2)",
  ];

  const gates = circuitCellsToBackendGates(circuit);
  for (const gate of gates) {
    if (gate.name === "CX") {
      lines.push(`qc.cx(${gate.control ?? 0}, ${gate.target ?? 1})`);
    } else if (["H", "X", "Y", "Z"].includes(gate.name)) {
      lines.push(`qc.${gate.name.toLowerCase()}(${gate.qubit ?? 0})`);
    }
  }

  lines.push("qc.measure_all()");
  return lines.join("\n");
}

type ParsedCircuit = { circuit?: Cell[][]; error?: string };

function parseQiskitCode(source: string): ParsedCircuit {
  const next: Cell[][] = [
    Array.from({ length: COLUMNS }, () => null),
    Array.from({ length: COLUMNS }, () => null),
  ];
  let column = 0;

  for (const [index, originalLine] of source.split(/\r?\n/).entries()) {
    const line = originalLine.split("#", 1)[0].trim();
    if (!line) continue;
    if (/^from\s+qiskit\s+import\s+QuantumCircuit$/i.test(line)) continue;
    if (/^qc\s*=\s*QuantumCircuit\(\s*2\s*,\s*2\s*\)$/i.test(line)) continue;
    if (/^qc\.measure_all\(\s*\)$/i.test(line)) continue;

    const single = line.match(/^qc\.(h|x|y|z)\(\s*([01])\s*\)$/i);
    if (single) {
      if (column >= COLUMNS) {
        return { error: `Line ${index + 1}: this demo supports up to ${COLUMNS} gate operations.` };
      }
      const row = Number(single[2]);
      next[row][column] = single[1].toUpperCase() as Cell;
      column += 1;
      continue;
    }

    const controlled = line.match(/^qc\.cx\(\s*([01])\s*,\s*([01])\s*\)$/i);
    if (controlled) {
      const control = Number(controlled[1]);
      const target = Number(controlled[2]);
      if (control === target) {
        return { error: `Line ${index + 1}: CNOT control and target must be different qubits.` };
      }
      if (control !== 0 || target !== 1) {
        return { error: `Line ${index + 1}: this visual circuit currently supports qc.cx(0, 1), with q₀ as control and q₁ as target.` };
      }
      if (column >= COLUMNS) {
        return { error: `Line ${index + 1}: this demo supports up to ${COLUMNS} gate operations.` };
      }
      next[control][column] = "CNOT";
      next[target][column] = "CNOT";
      column += 1;
      continue;
    }

    return {
      error: `Line ${index + 1}: unsupported statement. Use qc.h(0), qc.x(1), qc.y(0), qc.z(1), qc.cx(0, 1), and qc.measure_all().`,
    };
  }

  return { circuit: next };
}

function hasTargetXAfterCnot(circuit: Cell[][]): boolean {
  const cnotColumn = circuit[0].findIndex(
    (cell, column) => cell === "CNOT" && circuit[1][column] === "CNOT"
  );
  return cnotColumn >= 0 && circuit[1].some(
    (cell, column) => column > cnotColumn && cell === "X"
  );
}

export default function QuantumLabPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [circuit, setCircuit] =
    useState<Cell[][]>(() =>
      initialCircuit.map((line) => [...line])
    );
  const [circuitLoaded, setCircuitLoaded] = useState(false);

  const [selectedGate, setSelectedGate] =
    useState<Gate>("H");
  const [workspaceMode, setWorkspaceMode] = useState<"visual" | "code">("visual");
  const [codeDraft, setCodeDraft] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeNotice, setCodeNotice] = useState("");

  const [hasRun, setHasRun] =
    useState(false);

  const [runCount, setRunCount] =
    useState(0);

  const [errorInjected, setErrorInjected] =
    useState(false);
  const [simulationBackend, setSimulationBackend] = useState("Local preview");
  const [simulationNotice, setSimulationNotice] = useState(
    "Initial state is a local preview. Run the simulator to request backend results."
  );

  const [draggedGate, setDraggedGate] =
    useState<Gate | null>(null);

  const [simulatedState, setSimulatedState] =
    useState<Complex[]>(
      simulateCircuit(initialCircuit)
    );
  const [measuredProbabilities, setMeasuredProbabilities] = useState<number[] | null>(null);
  const [measurementShots, setMeasurementShots] = useState<number | null>(null);

  useEffect(() => {
    const session =
      localStorage.getItem(
        "qsense-session"
      );

    if (!session) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    try {
      const savedRuns = Number(localStorage.getItem("qsense-lab-runs") || "0");
      if (Number.isFinite(savedRuns)) setRunCount(savedRuns);

      const savedSimulation = localStorage.getItem("qsense-last-simulation");
      if (savedSimulation) {
        const parsedSimulation = JSON.parse(savedSimulation);
        if (Array.isArray(parsedSimulation?.statevector)) {
          setSimulatedState(parsedSimulation.statevector.map((item: any) => ({ re: Number(item.re) || 0, im: Number(item.im) || 0 })));
          setHasRun(true);
          setSimulationBackend(typeof parsedSimulation.backend === "string" ? parsedSimulation.backend : "Local preview");
          setSimulationNotice(typeof parsedSimulation.notice === "string" ? parsedSimulation.notice : "Results loaded from your last simulation run.");
          if (parsedSimulation.probabilities && typeof parsedSimulation.probabilities === "object") {
            setMeasuredProbabilities(["00", "01", "10", "11"].map((label) => Number(parsedSimulation.probabilities[label]) || 0));
            setMeasurementShots(Number(parsedSimulation.shots) || 1024);
          }
        }
      }

      const saved = localStorage.getItem("qsense-circuit");
      if (saved) {
        const parsed = JSON.parse(saved);
        const isValidCircuit =
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed.every(
            (row) =>
              Array.isArray(row) &&
              row.length === COLUMNS &&
              row.every(
                (cell) =>
                  cell === null ||
                  cell === "H" ||
                  cell === "X" ||
                  cell === "Y" ||
                  cell === "Z" ||
                  cell === "CNOT"
              )
          );

        if (isValidCircuit) {
          const restoredCircuit = parsed as Cell[][];
          setCircuit(restoredCircuit);
          setSimulatedState(simulateCircuit(restoredCircuit));
          setErrorInjected(hasTargetXAfterCnot(restoredCircuit));
        }
      }
    } catch {
      // Keep the demo circuit when stored state is invalid.
    }

    setCircuitLoaded(true);
  }, []);

  useEffect(() => {
    if (!circuitLoaded) return;

    localStorage.setItem(
      "qsense-circuit",
      JSON.stringify(circuit)
    );
  }, [circuit, circuitLoaded]);

  const probabilities = useMemo(() => {
    return simulatedState.map(probability);
  }, [simulatedState]);

  const totalProbability = probabilities.reduce(
    (sum, value) => sum + value,
    0
  );
  const displayedMeasurementProbabilities = measuredProbabilities ?? probabilities;

  const bellProbabilities =
    sameNumber(probabilities[0], 0.5) &&
    sameNumber(probabilities[3], 0.5) &&
    sameNumber(probabilities[1], 0) &&
    sameNumber(probabilities[2], 0);

  const relativePhase =
    simulatedState[0].re * simulatedState[3].re +
    simulatedState[0].im * simulatedState[3].im;

  const bellPlusState =
    bellProbabilities && relativePhase > 0.4;

  const bellMinusState =
    bellProbabilities && relativePhase < -0.4;

  const psiPlusState =
    sameNumber(probabilities[1], 0.5) &&
    sameNumber(probabilities[2], 0.5);
  const targetXAfterCnot = hasTargetXAfterCnot(circuit);

  const aiInsight = useMemo(() => {
    if (!hasRun) {
      return {
        type: "info",
        title: "Run required for a fresh result",
        text: "The circuit has changed since the last run. Run the simulator to refresh the statevector and measurement distribution before interpreting the result.",
      };
    }

    if (bellMinusState) {
      return {
        type: "warning",
        title:
          "Phase change detected",
        text:
          "The measurement probabilities remain 50% |00⟩ and 50% |11⟩, but the relative phase has flipped. Check the Z gate added after entanglement.",
      };
    }

    if (
      targetXAfterCnot &&
      psiPlusState
    ) {
      return {
        type: "warning",
        title:
          "Bit-flip detected on q₁",
        text:
          "The X gate changes the Bell state from Φ⁺ to Ψ⁺. Your circuit now produces |01⟩ and |10⟩ instead of |00⟩ and |11⟩.",
      };
    }

    if (bellPlusState) {
      return {
        type: "success",
        title:
          "Bell State detected",
        text:
          "Your circuit prepares the entangled Bell state Φ⁺ = (|00⟩ + |11⟩)/√2. The simulator predicts 50% |00⟩ and 50% |11⟩ measurements.",
      };
    }

    return {
      type: "info",
      title:
        "Circuit ready for analysis",
      text:
        "Run the simulator to inspect the statevector and measurement distribution. Add more gates to explore how the quantum state changes.",
    };
  }, [
    bellPlusState,
    bellMinusState,
    hasRun,
    psiPlusState,
    targetXAfterCnot,
  ]);

  const placeGate = (
    row: number,
    column: number,
    gate: Gate
  ) => {
    const next = circuit.map((line) => [...line]);

    if (gate === "ERASE") {
      if (next[0][column] === "CNOT" || next[1][column] === "CNOT") {
        next[0][column] = null;
        next[1][column] = null;
      } else {
        next[row][column] = null;
      }
    } else if (gate === "CNOT") {
      next[0][column] = "CNOT";
      next[1][column] = "CNOT";
    } else {
      if (next[0][column] === "CNOT" || next[1][column] === "CNOT") {
        next[0][column] = null;
        next[1][column] = null;
      }
      next[row][column] = gate;
    }

    setCircuit(next);
    setSimulatedState(simulateCircuit(next));
    setErrorInjected(hasTargetXAfterCnot(next));
    setHasRun(false);
    setMeasuredProbabilities(null);
    setMeasurementShots(null);
    setSimulationBackend("Not run");
    setSimulationNotice("Circuit changed. Run the simulator again to refresh the results.");
    localStorage.removeItem("qsense-last-simulation");
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    row: number,
    column: number
  ) => {
    event.preventDefault();

    const gate =
      draggedGate ||
      (event.dataTransfer.getData(
        "text/plain"
      ) as Gate);

    if (!gate) return;

    placeGate(
      row,
      column,
      gate
    );

    setDraggedGate(null);
  };

  const runSimulation = async () => {
    const localResult = simulateCircuit(circuit);
    const nextRunCount = runCount + 1;

    try {
      const response = await simulateCircuitApi(
        circuitCellsToBackendGates(circuit),
        1024
      );
      setSimulationBackend(response.backend || "Unknown backend");
      setSimulationNotice(response.notice || "Simulation completed successfully.");
      setMeasuredProbabilities(["00", "01", "10", "11"].map((label) => {
        const probabilityValue = response.probabilities?.[label];
        if (typeof probabilityValue === "number") return probabilityValue;
        return (response.counts?.[label] ?? 0) / (response.shots || 1024);
      }));
      setMeasurementShots(response.shots || 1024);
      const backendState = response.statevector.map((item) => ({
        re: item.re,
        im: item.im,
      }));
      setSimulatedState(backendState.length ? backendState : localResult);
      localStorage.setItem("qsense-last-simulation", JSON.stringify(response));
    } catch {
      const fallbackProbabilities = ["00", "01", "10", "11"].map((label, index) => ({
        label,
        value: probability(localResult[index]),
      }));
      const exactCounts = fallbackProbabilities.map((item) => item.value * 1024);
      const fallbackCounts = exactCounts.map((value) => Math.floor(value));
      let remainder = 1024 - fallbackCounts.reduce((sum, value) => sum + value, 0);
      exactCounts
        .map((value, index) => ({ index, fraction: value - fallbackCounts[index] }))
        .sort((a, b) => b.fraction - a.fraction)
        .forEach(({ index }) => {
          if (remainder > 0) {
            fallbackCounts[index] += 1;
            remainder -= 1;
          }
        });
      const fallback = {
        backend: "Local preview",
        shots: 1024,
        counts: Object.fromEntries(
          fallbackProbabilities.map((item, index) => [item.label, fallbackCounts[index]])
        ),
        probabilities: Object.fromEntries(
          fallbackProbabilities.map((item) => [item.label, item.value])
        ),
        statevector: localResult.map((value, index) => ({
          basis: ["00", "01", "10", "11"][index],
          re: value.re,
          im: value.im,
          probability: probability(value),
        })),
        notice: "Backend unavailable; local preview used."
      };
      setSimulatedState(localResult);
      setMeasuredProbabilities(["00", "01", "10", "11"].map((label) => Number(fallback.probabilities[label]) || 0));
      setMeasurementShots(fallback.shots);
      setSimulationBackend("Local preview");
      setSimulationNotice("The API could not be reached, so the browser-side teaching simulator produced this result.");
      localStorage.setItem("qsense-last-simulation", JSON.stringify(fallback));
    }

    setHasRun(true);
    setRunCount(nextRunCount);
    localStorage.setItem("qsense-lab-runs", String(nextRunCount));
  };

  const openCodeEditor = () => {
    setCodeDraft(circuitToQiskitCode(circuit));
    setCodeError("");
    setCodeNotice("Edit the supported two-qubit Qiskit-style statements, then apply them to update the visual circuit.");
    setWorkspaceMode("code");
  };

  const applyCodeToCircuit = () => {
    const parsed = parseQiskitCode(codeDraft);
    if (!parsed.circuit) {
      setCodeError(parsed.error || "Could not parse this circuit code.");
      setCodeNotice("");
      return;
    }

    setCircuit(parsed.circuit);
    setSimulatedState(simulateCircuit(parsed.circuit));
    setErrorInjected(hasTargetXAfterCnot(parsed.circuit));
    setHasRun(false);
    setMeasuredProbabilities(null);
    setMeasurementShots(null);
    setSimulationBackend("Not run");
    setSimulationNotice("Code applied. Run the simulator to calculate results for this circuit.");
    localStorage.removeItem("qsense-last-simulation");
    setCodeError("");
    setCodeNotice("Code applied successfully. The visual circuit is updated; run the simulator to inspect the result.");
    setWorkspaceMode("visual");
  };

  const resetCircuit = () => {
    setCircuit(
      initialCircuit.map((line) => [
        ...line,
      ])
    );

    const result =
      simulateCircuit(initialCircuit);

    setSimulatedState(result);
    setHasRun(false);
    setErrorInjected(false);
    setMeasuredProbabilities(null);
    setMeasurementShots(null);
    setSimulationBackend("Not run");
    setSimulationNotice("Circuit reset to the Bell-state example. Run the simulator to refresh results.");
    localStorage.removeItem("qsense-last-simulation");
  };

  const introduceError = () => {
    if (errorInjected) {
      setSimulationNotice("A target X error is already in the circuit. Remove it with the Eraser or reset the circuit before injecting another.");
      return;
    }

    const next = circuit.map((line) => [...line]);
    const cnotColumn = next[0].findIndex(
      (cell, column) => cell === "CNOT" && next[1][column] === "CNOT"
    );

    let errorColumn = next[1].findIndex(
      (cell, column) => column > cnotColumn && cell === null
    );
    if (errorColumn < 0) {
      errorColumn = next[1].findIndex((cell) => cell === null);
    }

    if (errorColumn < 0) {
      setSimulationNotice("No empty cell is available on q₁. Remove a gate before introducing the teaching error.");
      return;
    }

    next[1][errorColumn] = "X";
    setCircuit(next);
    setSimulatedState(simulateCircuit(next));
    setErrorInjected(true);
    setHasRun(false);
    setMeasuredProbabilities(null);
    setMeasurementShots(null);
    setSimulationBackend("Not run");
    setSimulationNotice("Teaching error added: an X gate was placed on q₁. Run again to observe the changed outcomes.");
    localStorage.removeItem("qsense-last-simulation");
  };

  return (
    <main className="quantum-lab-page">
      <div className="ql-bg-grid" />

      <div className="ql-glow ql-glow-one" />
      <div className="ql-glow ql-glow-two" />

      {/* =====================================================
          SIDEBAR
         ===================================================== */}

      <aside className="ql-sidebar">
        <Link
          href="/dashboard"
          className="ql-brand"
        >
          <div className="ql-brand-mark">
            <BrandAtom />
          </div>

          <div>
            <div className="ql-brand-name">
              Q-SENSE
            </div>

            <div className="ql-brand-subtitle">
              Quantum Learning Platform
            </div>
          </div>
        </Link>

        <nav className="ql-nav">
          {navItems.map((item) => {
            const active =
              pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`ql-nav-item ${active
                  ? "ql-nav-active"
                  : ""
                  }`}
              >
                <span className="ql-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ql-sidebar-divider" />

        <Link
          href="/settings"
          className="ql-nav-item"
        >
          <span className="ql-nav-icon">
            ⚙
          </span>

          <span>Settings</span>
        </Link>

        <Link
          href="/help"
          className="ql-nav-item"
        >
          <span className="ql-nav-icon">
            ?
          </span>

          <span>Help</span>
        </Link>

        <div className="ql-sidebar-bottom">
          <div className="ql-mini-atom">
            <span />
            <span />
            <span />
          </div>

          <p>
            <strong>Think.</strong>{" "}
            Build.{" "}
            <strong>Simulate.</strong>
          </p>
        </div>
      </aside>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <section className="ql-main">
        <header className="ql-topbar">
          <div className="ql-breadcrumb">
            <Link href="/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <strong>
              Quantum Lab
            </strong>
          </div>

          <div className="ql-top-right">
            <button
              className="ql-notification"
              type="button"
            >
              ♢

              <span />
            </button>

            <Link
              href="/settings"
              className="ql-profile"
            >
              <div className="ql-avatar">
                L
              </div>

              <div>
                <strong>
                  Hello, Lucky
                </strong>

                <small>
                  Student
                </small>
              </div>

              <span>▾</span>
            </Link>
          </div>
        </header>

        <div className="ql-content">
          {/* HEADER */}

          <section className="ql-heading">
            <div>
              <span className="ql-eyebrow">
                QUANTUM EXPERIMENTATION
              </span>

              <h1>
                Quantum Lab
              </h1>

              <p>
                Build circuits, simulate quantum
                states, and understand what happens
                under the hood.
              </p>
            </div>

            <div className="ql-run-status">
              <span
                className={
                  hasRun
                    ? "status-dot status-ready"
                    : "status-dot status-waiting"
                }
              />

              <div>
                <strong>
                  {hasRun
                    ? "Simulation ready"
                    : simulationBackend === "Local preview"
                      ? "Local preview ready"
                      : "Changes not simulated"}
                </strong>

                <small>
                  Runs completed: {runCount}
                </small>
              </div>
            </div>
          </section>

          <section className="ql-screening-guide" aria-label="First experiment guide">
            <div className="ql-screening-copy">
              <span>YOUR FIRST EXPERIMENT · FOLLOW ALONG</span>
              <h2>Build entanglement. Break it. Understand why.</h2>
              <p>1. Run the Bell-state circuit. 2. Introduce an X error on q₁ and run again. 3. Ask Q-SENSE to explain the changed distribution. 4. Use Eraser on the added X and run once more to restore the Bell-state outcomes.</p>
              <div className="ql-result-source">
                <span className={simulationBackend.toLowerCase().includes("qiskit") ? "ql-source-dot ql-source-live" : "ql-source-dot"} />
                <strong>Result source: {simulationBackend}</strong>
                <small>{simulationNotice}</small>
              </div>
            </div>
            <div className="ql-screening-actions">
              <button type="button" onClick={runSimulation}>
                {hasRun ? "Run Again" : "Run Simulation"} <span>→</span>
              </button>
              <button type="button" onClick={introduceError}>
                Introduce Error <span>⚡</span>
              </button>
              <button type="button" onClick={() => router.push("/ai-tutor")}>
                Ask Q-SENSE <span>✦</span>
              </button>
            </div>
          </section>

          {/* WORKSPACE */}

          <section className="ql-workspace">
            {/* GATE PALETTE */}

            <aside className="ql-gate-panel">
              <div className="ql-panel-title">
                <span>GATE PALETTE</span>

                <small>
                  Drag or select
                </small>
              </div>

              <div className="ql-gate-list">
                {[
                  {
                    gate: "H" as Gate,
                    name: "Hadamard",
                    desc:
                      "Create superposition",
                  },
                  {
                    gate: "X" as Gate,
                    name: "Pauli-X",
                    desc:
                      "Bit flip",
                  },
                  {
                    gate: "Y" as Gate,
                    name: "Pauli-Y",
                    desc:
                      "Bit + phase flip",
                  },
                  {
                    gate: "Z" as Gate,
                    name: "Pauli-Z",
                    desc:
                      "Phase flip",
                  },
                  {
                    gate: "CNOT" as Gate,
                    name: "CNOT",
                    desc:
                      "Controlled NOT",
                  },
                ].map((item) => (
                  <button
                    key={item.gate}
                    type="button"
                    draggable
                    onDragStart={() =>
                      setDraggedGate(
                        item.gate
                      )
                    }
                    onClick={() =>
                      setSelectedGate(
                        item.gate
                      )
                    }
                    className={`ql-gate-option ${selectedGate ===
                      item.gate
                      ? "ql-gate-selected"
                      : ""
                      }`}
                  >
                    <span className="ql-gate-symbol">
                      {item.gate === "CNOT"
                        ? "⊕"
                        : item.gate}
                    </span>

                    <span>
                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        {item.desc}
                      </small>
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  className={`ql-gate-option ql-erase ${selectedGate === "ERASE"
                    ? "ql-gate-selected"
                    : ""
                    }`}
                  onClick={() =>
                    setSelectedGate("ERASE")
                  }
                >
                  <span className="ql-gate-symbol">
                    ×
                  </span>

                  <span>
                    <strong>
                      Eraser
                    </strong>

                    <small>
                      Remove a gate
                    </small>
                  </span>
                </button>
              </div>

              <div className="ql-palette-tip">
                <span>⌁</span>

                <p>
                  Select a gate, then click any
                  circuit cell to place it.
                </p>
              </div>
            </aside>

            {/* CIRCUIT */}

            <div className="ql-circuit-panel">
              <div className="ql-circuit-header">
                <div>
                  <span>
                    CIRCUIT BUILDER
                  </span>

                  <h2>
                    Bell State
                  </h2>
                </div>

                <div className="ql-circuit-actions">
                  <button
                    type="button"
                    onClick={resetCircuit}
                    className="ql-reset-button"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={introduceError}
                    className="ql-error-button"
                  >
                    Introduce Error
                  </button>

                  <button
                    type="button"
                    onClick={runSimulation}
                    className="ql-run-button"
                  >
                    ▶ Run Simulation
                  </button>
                </div>
              </div>

              <div className="ql-circuit-description">
                Build the Bell State using H + CNOT,
                then run the simulator to observe
                entanglement.
              </div>

              <div className="ql-workspace-switch" role="tablist" aria-label="Circuit editing mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceMode === "visual"}
                  className={workspaceMode === "visual" ? "ql-workspace-tab ql-workspace-tab-active" : "ql-workspace-tab"}
                  onClick={() => {
                    if (workspaceMode === "code" && codeDraft.trim() !== circuitToQiskitCode(circuit)) {
                      const discard = window.confirm("Discard unapplied code edits and return to the current visual circuit?");
                      if (!discard) return;
                    }
                    setWorkspaceMode("visual");
                  }}
                >
                  Visual Builder
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceMode === "code"}
                  disabled={workspaceMode === "code"}
                  className={workspaceMode === "code" ? "ql-workspace-tab ql-workspace-tab-active" : "ql-workspace-tab"}
                  onClick={openCodeEditor}
                >
                  Code Editor
                </button>
              </div>

              {workspaceMode === "visual" ? (
                <>
              <div className="ql-circuit-board">
                <div className="ql-column-labels">
                  <span className="ql-wire-label" />

                  {Array.from(
                    { length: COLUMNS },
                    (_, index) => (
                      <span key={index}>
                        {index + 1}
                      </span>
                    )
                  )}
                </div>

                {[0, 1].map((row) => (
                  <div
                    className="ql-wire-row"
                    key={row}
                  >
                    <span className="ql-wire-label">
                      q{row}
                    </span>

                    {circuit[row].map(
                      (cell, column) => (
                        <div
                          key={column}
                          className={`ql-cell ${cell
                            ? "ql-cell-filled"
                            : ""
                            }`}
                          onClick={() =>
                            placeGate(
                              row,
                              column,
                              selectedGate
                            )
                          }
                          onDragOver={(event) =>
                            event.preventDefault()
                          }
                          onDrop={(event) =>
                            handleDrop(
                              event,
                              row,
                              column
                            )
                          }
                        >
                          <div className="ql-wire" />

                          {cell === "CNOT" ? (
                            <div
                              className={`ql-cnot-mark ${row === 0
                                ? "ql-control"
                                : "ql-target"
                                }`}
                            >
                              {row === 0
                                ? "●"
                                : "⊕"}
                            </div>
                          ) : cell ? (
                            <div className="ql-circuit-gate">
                              {cell}
                            </div>
                          ) : null}
                        </div>
                      )
                    )}
                  </div>
                ))}

                <div className="ql-cnot-connection">
                  <span />
                </div>

                <div className="ql-measurement-row">
                  <span>Measure</span>

                  <div>
                    <span>▣</span>
                    <span>▣</span>
                  </div>
                </div>
              </div>

              <div className="ql-circuit-legend">
                <span>
                  <i className="legend-control" />
                  Control
                </span>

                <span>
                  <i className="legend-target">
                    ⊕
                  </i>
                  Target
                </span>

                <span>
                  Click cells to edit
                </span>
              </div>
                </>
              ) : (
                <div className="ql-code-editor-panel">
                  <div className="ql-code-editor-head">
                    <div>
                      <strong>Qiskit-style Python</strong>
                      <span>Supported two-qubit teaching subset</span>
                    </div>
                    <span className="ql-code-language">PYTHON</span>
                  </div>
                  <textarea
                    className="ql-code-editor-input"
                    value={codeDraft}
                    onChange={(event) => {
                      setCodeDraft(event.target.value);
                      setCodeError("");
                      setCodeNotice("Code edits are not applied until you select Apply to Circuit.");
                    }}
                    spellCheck={false}
                    aria-label="Quantum circuit Python code"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                  <p className="ql-code-editor-help">
                    Supports H, X, Y and Z on q0/q1, CNOT via qc.cx(control, target), comments, and qc.measure_all(). Up to {COLUMNS} sequential gate operations.
                  </p>
                  {codeError && <p className="ql-code-error" role="alert">{codeError}</p>}
                  {codeNotice && !codeError && <p className="ql-code-notice" role="status">{codeNotice}</p>}
                  <div className="ql-code-editor-actions">
                    <button type="button" onClick={() => { setCodeDraft(circuitToQiskitCode(circuit)); setCodeError(""); setCodeNotice("Code reset to match the current visual circuit."); }}>Reset Code</button>
                    <button type="button" onClick={applyCodeToCircuit}>Apply to Circuit →</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* RESULTS */}

          <section className="ql-results-grid">
            {/* STATEVECTOR */}

            <div className="ql-result-card">
              <div className="ql-result-header">
                <div>
                  <span>
                    STATEVECTOR
                  </span>

                  <h2>
                    Quantum State
                  </h2>
                </div>

                <div className="ql-normalized">
                  <span>✓</span>
                  Normalized
                </div>
              </div>

              <div className="ql-statevector">
                {simulatedState.map(
                  (value, index) => (
                    <div
                      className="ql-state-row"
                      key={index}
                    >
                      <span>
                        |{index
                          .toString(2)
                          .padStart(
                            2,
                            "0"
                          )}⟩
                      </span>

                      <strong>
                        {formatComplex(
                          value
                        )}
                      </strong>

                      <div className="ql-amplitude-track">
                        <div
                          style={{
                            width: `${Math.max(
                              3,
                              magnitude(
                                value
                              ) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="ql-state-footer">
                Total probability:{" "}
                <strong>
                  {totalProbability.toFixed(3)}
                </strong>
              </div>
            </div>

            {/* PROBABILITIES */}

            <div className="ql-result-card">
              <div className="ql-result-header">
                <div>
                  <span>
                    MEASUREMENT
                  </span>

                  <h2>
                    Probabilities
                  </h2>
                </div>

                <div className="ql-shot-count">
                  {measurementShots
                    ? `${measurementShots.toLocaleString()} shots`
                    : "Statevector estimate"}
                </div>
              </div>

              <div className="ql-probabilities">
                {displayedMeasurementProbabilities.map(
                  (value, index) => {
                    const label =
                      index
                        .toString(2)
                        .padStart(
                          2,
                          "0"
                        );

                    return (
                      <div
                        key={label}
                        className="ql-prob-row"
                      >
                        <span>
                          |{label}⟩
                        </span>

                        <div className="ql-prob-track">
                          <div
                            style={{
                              width: `${value * 100}%`,
                            }}
                          />
                        </div>

                        <strong>
                          {(
                            value * 100
                          ).toFixed(1)}
                          %
                        </strong>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="ql-measurement-summary">
                <div>
                  <span>Dominant states</span>

                  <strong>
                    {displayedMeasurementProbabilities
                      .map(
                        (
                          value,
                          index
                        ) => ({
                          value,
                          index,
                        })
                      )
                      .filter(
                        (item) =>
                          item.value >
                          0.01
                      )
                      .map(
                        (item) =>
                          `|${item.index
                            .toString(
                              2
                            )
                            .padStart(
                              2,
                              "0"
                            )}⟩`
                      )
                      .join(
                        " + "
                      )}
                  </strong>
                </div>
              </div>
            </div>

            {/* BLOCH */}

            <div className="ql-result-card ql-bloch-card">
              <div className="ql-result-header">
                <div>
                  <span>
                    VISUALIZATION
                  </span>

                  <h2>
                    Bloch Sphere
                  </h2>
                </div>
              </div>

              <div className="ql-bloch">
                <div className="ql-bloch-circle">
                  <div className="bloch-axis bloch-x" />
                  <div className="bloch-axis bloch-y" />
                  <div className="bloch-axis bloch-z" />

                  <div
                    className={`bloch-point ${bellProbabilities || psiPlusState
                      ? "bloch-point-bell"
                      : ""
                      }`}
                  />

                  <span className="bloch-label-top">
                    |0⟩
                  </span>

                  <span className="bloch-label-bottom">
                    |1⟩
                  </span>

                  <span className="bloch-label-right">
                    X
                  </span>

                  <span className="bloch-label-left">
                    -X
                  </span>
                </div>
              </div>

              <p className="ql-bloch-note">
                Visualization updates after each simulation. For an entangled pair, each individual qubit can appear mixed; use the joint statevector and measurement correlations to inspect the full state.
              </p>
            </div>
          </section>

          {/* AI */}

          <section
            className={`ql-ai-card ql-ai-${aiInsight.type}`}
          >
            <div className="ql-ai-icon">
              ✦
            </div>

            <div className="ql-ai-content">
              <div className="ql-ai-top">
                <span>
                  AI CIRCUIT INSIGHT
                </span>

                <small>
                  Context-aware analysis
                </small>
              </div>

              <h2>
                {aiInsight.title}
              </h2>

              <p>
                {aiInsight.text}
              </p>
            </div>

            <Link
              href="/ai-tutor"
              className="ql-ai-button"
            >
              Ask Q-SENSE →
            </Link>
          </section>

          {/* ERROR DEMO */}

          <section className="ql-error-demo">
            <div>
              <span>
                DEBUGGING MODE
              </span>

              <h2>
                See how Q-SENSE finds mistakes.
              </h2>

              <p>
                Introduce a deliberate gate error,
                run the circuit again, and compare
                the resulting quantum state.
              </p>
            </div>

            <div className="ql-debug-flow">
              <div>
                <strong>
                  Expected
                </strong>

                <span>
                  Φ⁺
                </span>

                <small>
                  |00⟩ + |11⟩
                </small>
              </div>

              <span className="ql-flow-arrow">
                →
              </span>

              <div
                className={
                  errorInjected
                    ? "debug-active"
                    : ""
                }
              >
                <strong>
                  Actual
                </strong>

                <span>
                  {errorInjected
                    ? "Ψ⁺"
                    : "—"}
                </span>

                <small>
                  {errorInjected
                    ? "|01⟩ + |10⟩"
                    : "Run after error"}
                </small>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}