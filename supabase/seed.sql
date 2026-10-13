insert into learning_modules (slug,title,description,difficulty) values
('qubits','Qubits','Understand basis states, amplitudes and measurement.','Beginner'),
('superposition','Superposition','Experiment with the Hadamard gate.','Beginner'),
('entanglement','Entanglement','Build and inspect a Bell state.','Beginner'),
('gates','Quantum Gates','Master H, X, Y, Z and controlled operations.','Beginner'),
('measurement','Measurement','Connect amplitudes to probabilities and observation.','Beginner'),
('algorithms','Quantum Algorithms','Explore Grover, Deutsch-Jozsa and other standard algorithms.','Intermediate')
on conflict (slug) do nothing;

insert into challenges (slug,title,difficulty,xp,prompt) values
('bell-state','Build a Bell State','Beginner',50,'Create an entangled pair with H on q0 followed by CNOT q0→q1.'),
('superposition-sprint','Superposition Sprint','Beginner',40,'Identify the measurement probabilities after applying H to |0⟩.'),
('gate-detective','Gate Detective','Easy',30,'Identify the gate that maps |0⟩ to |1⟩.'),
('bloch-sphere-mission','Bloch Sphere Mission','Easy',40,'Determine the state reached after applying X to |0⟩.'),
('circuit-debugger','Circuit Debugger','Intermediate',60,'Find the gate causing a bit-flipped Bell-state distribution.'),
('grover-warm-up','Grover Warm-Up','Intermediate',70,'Explain why amplitude amplification helps quantum search.'),
('quantum-speed-round','Quantum Speed Round','Advanced',80,'Answer rapid-fire questions about qubits, gates and measurement.'),
('teleport-the-qubit','Teleport the Qubit','Advanced',100,'Understand the entanglement and classical communication used in teleportation.')
on conflict (slug) do nothing;
