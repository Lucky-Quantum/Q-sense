# Q-SENSE MVP Flowchart

```mermaid
flowchart TD
    A[Landing Page] --> A0[Try Demo / How It Works]
    A0 --> B[Demo Login]
    B --> C[Student Dashboard / Start Here Guide]

    C --> D[Learn]
    D --> E[Quantum Lab]
    E --> F{Choose editing mode}
    F --> F1[Visual Gate Canvas]
    F --> F2[Restricted Qiskit-style Code Editor]
    F1 --> G[Run Simulation]
    F2 --> G1[Validate and Apply Code]
    G1 --> G[Run Simulation]
    G --> H[Measurement Probabilities from Simulation]
    G --> I[Statevector / Amplitudes]
    G --> J0[Show Backend or Local Preview Source]
    H --> J[AI Tutor Context]
    I --> J
    J0 --> J

    J --> K[Explain / Debug / Optimize]
    K --> L[Fix Circuit]
    L --> G

    C --> M[Daily Challenges]
    M --> N[Challenge Completion]
    N --> O[XP + Streak]
    O --> P[Progress]

    C --> Q[Algorithms]
    Q --> E

    C --> R[AI Tutor]
    R --> J

    S[Instructor Workspace] --> T[Learner Monitoring]
    S --> U[Assignments]
    V[Admin Workspace] --> W[Content Management]
    V --> X[System Readiness]

    subgraph Frontend
      A
      B
      C
      D
      E
      M
      P
      R
      S
      V
    end

    subgraph Backend
      G
      H
      I
      J
      K
    end

    subgraph AI
      Y[OpenRouter] --> K
      Z[Local Fallback] --> K
    end

    subgraph Persistence
      AA[Supabase]
    end

    P --> AA
    C --> AA
    M --> AA
    S --> AA
