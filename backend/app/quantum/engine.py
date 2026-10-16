from collections import Counter
import math


def simulate_with_qiskit(gates, shots=1024):
    from qiskit import QuantumCircuit
    from qiskit_aer import AerSimulator

    n = 2
    qc = QuantumCircuit(n, n)
    for gate in gates:
        name = gate['name'].upper()
        if name == 'H': qc.h(gate.get('qubit', 0))
        elif name == 'X': qc.x(gate.get('qubit', 0))
        elif name == 'Y': qc.y(gate.get('qubit', 0))
        elif name == 'Z': qc.z(gate.get('qubit', 0))
        elif name == 'S': qc.s(gate.get('qubit', 0))
        elif name == 'T': qc.t(gate.get('qubit', 0))
        elif name == 'CX': qc.cx(gate.get('control',0), gate.get('target',1))
        elif name == 'M': pass
    qc.measure([0,1],[0,1])
    sim = AerSimulator()
    result = sim.run(qc, shots=shots).result()
    # Qiskit prints classical bits in reverse qubit order (q1 q0), while the
    # Q-SENSE circuit canvas labels q0 on the top wire and displays q0 q1.
    # Normalize counts here so backend and browser-preview results use one convention.
    raw_counts = result.get_counts(qc)
    labels = ['00', '01', '10', '11']
    counts = {label: int(raw_counts.get(label[::-1], 0)) for label in labels}
    histogram = {label: counts[label] / shots for label in labels}

    # Statevector before measurement for the pedagogical display. Reorder the
    # amplitudes by displayed q0q1 labels too, not by Qiskit's little-endian index.
    from qiskit.quantum_info import Statevector
    sv_qc = QuantumCircuit(n)
    for gate in gates:
        name = gate['name'].upper()
        if name == 'H': sv_qc.h(gate.get('qubit',0))
        elif name == 'X': sv_qc.x(gate.get('qubit',0))
        elif name == 'Y': sv_qc.y(gate.get('qubit',0))
        elif name == 'Z': sv_qc.z(gate.get('qubit',0))
        elif name == 'S': sv_qc.s(gate.get('qubit',0))
        elif name == 'T': sv_qc.t(gate.get('qubit',0))
        elif name == 'CX': sv_qc.cx(gate.get('control',0), gate.get('target',1))
    state = Statevector.from_instruction(sv_qc)
    amps = sorted(
        [
            {'basis': format(i, '02b')[::-1], 're': float(v.real), 'im': float(v.imag), 'probability': float(abs(v)**2)}
            for i, v in enumerate(state.data)
        ],
        key=lambda item: item['basis'],
    )
    return {'backend':'Qiskit Aer','shots':shots,'counts':counts,'probabilities':histogram,'statevector':amps,'circuit':qc.draw(output='text')}


def local_fallback_simulation(gates, shots=1024):
    # Deterministic 2-qubit fallback simulator for local development.
    amp = [complex(1,0),0j,0j,0j]
    def apply_single(amp, q, m):
        out = amp[:]
        pairs = [(0,2),(1,3)] if q == 0 else [(0,1),(2,3)]
        for a,b in pairs:
            va,vb = amp[a],amp[b]
            out[a] = m[0][0]*va + m[0][1]*vb
            out[b] = m[1][0]*va + m[1][1]*vb
        return out
    s2 = 1/math.sqrt(2)
    mats={'H':((s2,s2),(s2,-s2)), 'X':((0,1),(1,0)), 'Y':((0,-1j),(1j,0)), 'Z':((1,0),(0,-1)), 'S':((1,0),(0,1j)), 'T':((1,0),(0,complex(s2,s2)))}
    for g in gates:
        n=g['name'].upper()
        if n in mats: amp=apply_single(amp, g.get('qubit',0), mats[n])
        elif n=='CX':
            c,t=g.get('control',0),g.get('target',1)
            out=amp[:]
            for i,v in enumerate(amp):
                control=(i >> (1-c)) & 1
                if control: out[i ^ (1 << (1-t))]=v
                else: out[i]=v
            amp=out
    raw = [max(0.0, (abs(x) ** 2)) for x in amp]
    total = sum(raw) or 1.0
    raw = [p / total for p in raw]
    exact = [p * shots for p in raw]
    counts_list = [math.floor(x) for x in exact]
    remainder = shots - sum(counts_list)
    order = sorted(range(4), key=lambda i: exact[i] - counts_list[i], reverse=True)
    for i in order[:remainder]:
        counts_list[i] += 1
    labels = ['00','01','10','11']
    counts = dict(zip(labels, counts_list))
    return {
        'backend':'Local preview',
        'shots':shots,
        'counts':counts,
        'probabilities':dict(zip(labels, raw)),
        'statevector':[{'basis':format(i,'02b'),'re':x.real,'im':x.imag,'probability':raw[i]} for i,x in enumerate(amp)]
    }
