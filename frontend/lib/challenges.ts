export type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Easy" | "Intermediate" | "Advanced";
  category: string;
  reward: number;
  time: string;
  type: "quiz" | "circuit" | "concept";
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Build a Bell State",
    description:
      "Create an entangled pair using an H gate followed by a CNOT gate.",
    difficulty: "Beginner",
    category: "Circuits",
    reward: 50,
    time: "5 min",
    type: "circuit",
    question: "Which gate sequence is the standard two-qubit Bell-state construction?",
    options: ["H on q0, then CNOT q0→q1", "X on q0, then X on q1", "Z on both qubits", "Two measurements only"],
    answerIndex: 0,
    explanation: "H prepares q0 in superposition; CNOT then correlates q1 with q0.",
  },
  {
    id: 2,
    title: "Superposition Sprint",
    description:
      "Prepare a qubit in equal superposition and identify the resulting probabilities.",
    difficulty: "Beginner",
    category: "Quantum Basics",
    reward: 40,
    time: "4 min",
    type: "quiz",
    question: "What does H|0⟩ produce in the ideal case?",
    options: ["Only |0⟩", "Only |1⟩", "An equal superposition of |0⟩ and |1⟩", "A measured classical bit"],
    answerIndex: 2,
    explanation: "The Hadamard gate maps |0⟩ to (|0⟩ + |1⟩)/√2.",
  },
  {
    id: 3,
    title: "Gate Detective",
    description:
      "Identify the quantum gate that transforms |0⟩ into |1⟩.",
    difficulty: "Easy",
    category: "Quantum Gates",
    reward: 30,
    time: "3 min",
    type: "quiz",
    question: "Which gate maps |0⟩ to |1⟩?",
    options: ["H", "X", "Z", "S"],
    answerIndex: 1,
    explanation: "The Pauli-X gate flips the computational basis state.",
  },
  {
    id: 4,
    title: "Bloch Sphere Mission",
    description:
      "Determine where a qubit moves after applying an X gate.",
    difficulty: "Easy",
    category: "Visualization",
    reward: 40,
    time: "5 min",
    type: "concept",
    question: "Starting from |0⟩, where does an X gate move the state?",
    options: ["|0⟩", "|1⟩", "The equator", "A random point"],
    answerIndex: 1,
    explanation: "X flips |0⟩ to |1⟩.",
  },
  {
    id: 5,
    title: "Circuit Debugger",
    description:
      "Find the missing gate in a two-qubit entanglement circuit.",
    difficulty: "Intermediate",
    category: "Circuits",
    reward: 60,
    time: "7 min",
    type: "circuit",
    question: "A Bell-state circuit produces only 01 and 10. Which single-qubit change could explain a bit-flipped Bell pair?",
    options: ["Add X to q1 after entanglement", "Remove measurement", "Add another H to q0 before the CNOT", "Do nothing"],
    answerIndex: 0,
    explanation: "An X on one member of a Bell pair changes Φ⁺ into Ψ⁺, swapping the correlated outcomes.",
  },
  {
    id: 6,
    title: "Grover Warm-Up",
    description:
      "Understand why amplitude amplification improves quantum search.",
    difficulty: "Intermediate",
    category: "Algorithms",
    reward: 70,
    time: "8 min",
    type: "concept",
    question: "What is Grover’s main quantum advantage?",
    options: ["Amplitude amplification", "Faster floating-point arithmetic", "More classical memory", "Removing measurement"],
    answerIndex: 0,
    explanation: "Grover amplifies the amplitude of marked states, giving a quadratic search advantage in the ideal setting.",
  },
  {
    id: 7,
    title: "Quantum Speed Round",
    description:
      "Answer five rapid-fire questions about qubits, gates and measurement.",
    difficulty: "Advanced",
    category: "Quantum Basics",
    reward: 80,
    time: "10 min",
    type: "quiz",
    question: "Which statement is correct?",
    options: ["A qubit is always both classical bits at once", "Measurement probabilities come from amplitudes squared", "CNOT always creates entanglement", "Quantum gates are irreversible"],
    answerIndex: 1,
    explanation: "For a pure state, measurement probability is the squared magnitude of the corresponding amplitude.",
  },
  {
    id: 8,
    title: "Teleport the Qubit",
    description:
      "Understand the three-step circuit behind quantum teleportation.",
    difficulty: "Advanced",
    category: "Algorithms",
    reward: 100,
    time: "12 min",
    type: "circuit",
    question: "What must be shared before the standard teleportation protocol can transfer an unknown qubit state?",
    options: ["An entangled Bell pair", "A classical bit only", "A third measurement device", "A copied qubit"],
    answerIndex: 0,
    explanation: "Teleportation consumes a shared entangled pair plus two classical bits of measurement information.",
  },
];

export function getDayNumber(date: Date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
      (1000 * 60 * 60 * 24)
  );
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayChallenge(date = new Date()) {
  return CHALLENGES[getDayNumber(date) % CHALLENGES.length];
}

export function getDayDifference(
  previousKey: string,
  currentDate = new Date()
) {
  const previous = new Date(`${previousKey}T00:00:00`);
  return getDayNumber(currentDate) - getDayNumber(previous);
}

export function calculateNextStreak(
  currentStreak: number,
  previousKey?: string | null,
  currentDate = new Date()
) {
  if (!previousKey) return Math.max(currentStreak, 1);

  const difference = getDayDifference(
    previousKey,
    currentDate
  );

  if (difference === 0) return currentStreak;
  if (difference === 1) return currentStreak + 1;
  if (difference > 1) return 1;

  return currentStreak;
}
