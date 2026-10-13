# Q-SENSE — Screening Checklist

Use this in a fresh browser session before sharing the prototype.

## Start the services

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend (a separate terminal)

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Copy backend/.env.example to backend/.env; the OpenRouter key is optional for the demo fallback.
uvicorn app.main:app --reload --port 8000
```

Check `http://localhost:8000/health` returns a JSON status of `ok`.

## Demo credentials

All three demo roles use `quantum123`:

- Student: `student@qsense.demo`
- Instructor: `instructor@qsense.demo`
- Admin: `admin@qsense.demo`

These are local prototype accounts, not production authentication.

## Judge self-guided journey (3–5 minutes)

1. Open `/` and select **Try Demo**.
2. Sign in as Student and follow **Start here · 3-minute exploration**.
3. Open Learn and read the Entanglement section.
4. Open Quantum Lab and select **Run** on the default Bell circuit.
5. Confirm `00` and `11` outcomes are close to 50% each. The deterministic local preview produces 512 each for 1,024 shots.
6. Select **Introduce X error** and run again. Confirm `01` and `10` are close to 50% each (512 each for deterministic local preview).
7. Open the floating Q-SENSE AI Tutor and choose a debug prompt. It should identify the q1 bit-flip from the saved circuit and results. Check its label: `OpenRouter connected` means the remote model answered; a `Local demo guidance` label means the built-in fallback answered.
8. Remove the extra X with Eraser and run again. Expected outcomes return to `00` and `11`.
9. Open Code Editor; change one supported line such as `qc.h(0)` to `qc.x(0)`, apply, and run. Unsupported statements should show a line-specific validation error and should not execute.
10. Open Challenges. Answer a challenge correctly to receive XP; an incorrect answer must not grant XP. Open Progress to confirm XP and completed challenge state update.

## Important interpretation notes

- The UI explicitly labels **Qiskit Aer** vs **Local preview** as the result source. Qiskit Aer is used only when its packages are installed and the backend can execute it.
- The local fallback is a deterministic two-qubit teaching simulator for screening. It is not hardware execution and must not be described as such.
- The code editor supports a limited two-qubit Qiskit-style subset (H, X, Y, Z and `qc.cx(0, 1)`); it does not execute arbitrary Python.
- OpenRouter needs `OPENROUTER_API_KEY` in `backend/.env`. Never put the key into the frontend or commit it. If absent, the labelled local tutor fallback still supports the Bell-state/error demo.
- PennyLane, Cirq and qBraid are not runnable adapters in this package yet.
- Student activity is stored in browser `localStorage`. Instructor/admin records and some curriculum skill metrics are sample data, not live multi-user analytics. Supabase schema is present but full persistence/auth integration is not wired into the demo.
- This source package was checked with TypeScript/TSX parse/transpile checks, CSS parsing and backend smoke tests. A complete Next.js production build was not run in this environment; run `npm run build` locally after `npm install` before deployment.
