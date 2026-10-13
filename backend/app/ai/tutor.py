import json
import os
from typing import Any, Dict, List, Optional

import requests

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "google/gemma-4-26b-a4b-it:free"


def _build_system_prompt() -> str:
    return """You are Q-SENSE Quantum Tutor, an accurate and encouraging quantum-computing learning assistant.

Rules:
- Ground every explanation in the supplied circuit and simulation context when available.
- Never claim that hardware was used unless the context explicitly says so.
- Prefer simple intuition first, then concise technical detail.
- For debugging, identify only concrete issues supported by the circuit/result.
- For optimization, suggest safe educational simplifications and explain why.
- When probabilities/statevector are supplied, use them instead of inventing results.
- If the context is insufficient, say what is missing and ask one useful follow-up question.
- Keep answers concise enough for a learning workspace (usually 80-180 words).
"""


def build_prompt(
    action: str,
    message: str,
    page: str,
    gates: List[Dict[str, Any]],
    probabilities: List[float],
    statevector: List[Dict[str, Any]],
    history: Optional[List[Dict[str, str]]] = None,
) -> str:
    history = history or []
    compact_history = history[-8:]
    return json.dumps(
        {
            "action": action,
            "student_question": message,
            "page": page,
            "circuit_gates": gates,
            "measurement_probabilities": probabilities,
            "statevector": statevector,
            "recent_conversation": compact_history,
        },
        ensure_ascii=False,
    )


def local_answer(
    action: str,
    message: str,
    gates: List[Dict[str, Any]],
    probabilities: List[float],
) -> Dict[str, str]:
    normalized_gates = [
        {**gate, "name": str(gate.get("name", "")).upper()}
        for gate in gates
    ]
    names = [gate["name"] for gate in normalized_gates]
    lower = message.lower()
    cx_index = next(
        (index for index, gate in enumerate(normalized_gates) if gate["name"] in {"CX", "CNOT"}),
        -1,
    )
    has_h0_before_cx = any(
        gate["name"] == "H"
        and gate.get("qubit", 0) == 0
        and (cx_index < 0 or index < cx_index)
        for index, gate in enumerate(normalized_gates)
    )
    bit_flip_after_cx = next(
        (
            gate.get("qubit", 0)
            for gate in normalized_gates[cx_index + 1 :]
            if cx_index >= 0 and gate["name"] == "X"
        ),
        None,
    )
    probs = [float(value) for value in probabilities[:4]]
    while len(probs) < 4:
        probs.append(0.0)
    p00, p01, p10, p11 = probs
    bell_plus_distribution = p00 > 0.4 and p11 > 0.4 and p01 < 0.1 and p10 < 0.1
    psi_distribution = p01 > 0.4 and p10 > 0.4 and p00 < 0.1 and p11 < 0.1

    # Debugging must take precedence over concept keywords in the prompt.
    if action == "debug" or any(word in lower for word in ("debug", "error", "issue", "analyze", "analyse", "fix", "wrong", "changed")):
        if bit_flip_after_cx is not None or psi_distribution:
            qubit = bit_flip_after_cx if bit_flip_after_cx is not None else 1
            text = (
                f"The circuit context indicates a likely bit-flip on q{qubit} after entanglement. "
                "That changes the Bell state from Φ⁺ = (|00⟩ + |11⟩)/√2 to a Ψ-type state. "
                "If your measured outcomes are 01 and 10, the result is consistent with this change. "
                "Remove the added X gate and run again to compare the outcomes."
            )
        elif cx_index >= 0 and not has_h0_before_cx:
            text = (
                "For a Bell-state experiment, the current circuit has a CNOT but no H gate on q0 before it. "
                "Starting from |00⟩, apply H to q0, then CNOT with q0 as control and q1 as target. "
                "Run again and inspect whether 00 and 11 occur with approximately equal probability."
            )
        elif bell_plus_distribution:
            text = (
                "The latest probabilities are consistent with the expected Bell state Φ⁺: about 50% |00⟩ "
                "and 50% |11⟩, with the other outcomes near zero. H creates superposition and CNOT correlates "
                "the qubits. To test debugging, introduce the teaching error, rerun, and compare the distribution."
            )
        elif not normalized_gates:
            text = (
                "I do not have a saved circuit to inspect yet. Open Quantum Lab, build or load a circuit, run it once, "
                "then ask me to analyze it. I can compare the gate sequence with the intended experiment and use saved probabilities."
            )
        else:
            text = (
                f"The current circuit contains {', '.join(names) or 'no recognized gates'}. "
                "I cannot confirm a specific defect from the gate list alone. Run the circuit and compare expected outcomes "
                "with the actual probabilities, then ask again so I can use both the circuit and result."
            )
        return {"text": text, "provider": "local-fallback"}

    if action == "optimize" or any(word in lower for word in ("optimize", "optimise", "simplify", "reduce gate")):
        for index in range(len(normalized_gates) - 1):
            current = normalized_gates[index]
            following = normalized_gates[index + 1]
            if (
                current["name"] == following["name"]
                and current.get("qubit", 0) == following.get("qubit", 0)
                and current["name"] in {"H", "X", "Y", "Z"}
            ):
                gate_name = current["name"]
                qubit = current.get("qubit", 0)
                return {
                    "text": f"A possible teaching simplification is two consecutive {gate_name} gates on q{qubit}. {gate_name} is self-inverse, so that pair cancels. Remove the pair, run the circuit again, and compare the statevector to verify the equivalence.",
                    "provider": "local-fallback",
                }
        return {
            "text": "For a small teaching circuit, look for adjacent self-inverse pairs (H-H, X-X, Y-Y or Z-Z) on the same qubit. I do not see a confirmed cancellation in this gate sequence, so compare the statevector before and after any edit.",
            "provider": "local-fallback",
        }

    if "bell" in lower or "entangle" in lower:
        text = (
            "A Bell state is a two-qubit entangled state. Starting from |00⟩, apply H to q0 to create superposition, "
            "then apply CNOT with q0 as control and q1 as target. The ideal Φ⁺ output is "
            "(|00⟩ + |11⟩)/√2, so measurement produces correlated 00 and 11 outcomes at about 50% each."
        )
    elif "hadamard" in lower or "superposition" in lower or "h gate" in lower:
        text = (
            "The Hadamard (H) gate transforms |0⟩ into (|0⟩ + |1⟩)/√2. The two amplitudes have equal magnitude, "
            "so an ideal measurement returns 0 or 1 with probability 1/2 each. It creates superposition; it does not mean the qubit is simply two classical bits at once."
        )
    elif "cnot" in lower or "cx" in lower or "controlled-x" in lower:
        text = (
            "CNOT flips the target qubit only when the control qubit is |1⟩. CNOT by itself does not always create entanglement. "
            "In the Bell-state circuit, H first puts q0 into superposition; CNOT then correlates q1 with q0 and creates an entangled state."
        )
    elif "grover" in lower:
        text = (
            "Grover's algorithm searches an unstructured space by repeatedly increasing the amplitude of marked states. "
            "Its core ideas are an oracle that marks the target and a diffusion step that amplifies its amplitude."
        )
    elif "hint" in lower or "challenge" in lower or "answer" in lower:
        text = (
            "Hint: identify what the gate or algorithm changes before choosing an answer. For a Bell-state question, trace the circuit in order: "
            "initial state → H on q0 → CNOT q0→q1 → measurement. I can explain the concept without selecting an option for you."
        )
    else:
        text = (
            "I can explain a concept, inspect your circuit, reason about a simulation result, or suggest a safe experiment. "
            "Ask about H, CNOT, superposition, entanglement, Grover, or request a circuit diagnosis after running Quantum Lab."
        )

    return {"text": text, "provider": "local-fallback"}


def _extract_content(data: Dict[str, Any]) -> str:
    choices = data.get("choices") or []
    if not choices:
        return ""
    message = choices[0].get("message") or {}
    content = message.get("content", "")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: List[str] = []
        for part in content:
            if isinstance(part, dict) and isinstance(part.get("text"), str):
                parts.append(part["text"])
        return "".join(parts).strip()
    return str(content).strip()


def tutor_response(
    action: str,
    message: str,
    page: str,
    gates: List[Dict[str, Any]],
    probabilities: List[float],
    statevector: List[Dict[str, Any]],
    history: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, str]:
    provider = os.getenv("AI_PROVIDER", "openrouter").strip().lower()

    if provider == "openrouter" and os.getenv("OPENROUTER_API_KEY"):
        model = os.getenv("OPENROUTER_MODEL", DEFAULT_MODEL)
        headers = {
            "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
            "Content-Type": "application/json",
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "Q-SENSE Quantum Learning"),
        }
        site_url = os.getenv("OPENROUTER_SITE_URL", "").strip()
        if site_url:
            headers["HTTP-Referer"] = site_url

        body = {
            "model": model,
            "messages": [
                {"role": "system", "content": _build_system_prompt()},
                {
                    "role": "user",
                    "content": build_prompt(
                        action,
                        message,
                        page,
                        gates,
                        probabilities,
                        statevector,
                        history,
                    ),
                },
            ],
            "temperature": 0.2,
            "max_tokens": 300,
        }

        try:
            response = requests.post(
                OPENROUTER_URL,
                headers=headers,
                json=body,
                timeout=float(os.getenv("OPENROUTER_TIMEOUT", "30")),
            )
            response.raise_for_status()
            content = _extract_content(response.json())
            if content:
                return {"text": content, "provider": "openrouter"}
        except requests.RequestException:
            pass
        except (ValueError, KeyError, TypeError):
            pass

    return local_answer(action, message, gates, probabilities)
