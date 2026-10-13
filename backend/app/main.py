from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Any, Dict, List, Literal, Optional
from dotenv import load_dotenv
import os

from app.quantum.engine import simulate_with_qiskit, local_fallback_simulation
from app.ai.tutor import tutor_response

load_dotenv()

app = FastAPI(title='Q-SENSE Quantum Backend', version='1.0.0')
origins = [x.strip() for x in os.getenv('CORS_ORIGINS','http://localhost:3000').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

class Gate(BaseModel):
    name: Literal['H', 'X', 'Y', 'Z', 'CX', 'M']
    qubit: Optional[int] = Field(default=None, ge=0, le=1)
    control: Optional[int] = Field(default=None, ge=0, le=1)
    target: Optional[int] = Field(default=None, ge=0, le=1)

    @field_validator('name', mode='before')
    @classmethod
    def normalize_name(cls, value):
        return value.upper() if isinstance(value, str) else value

    @model_validator(mode='after')
    def validate_control_target(self):
        if self.name == 'CX':
            control = 0 if self.control is None else self.control
            target = 1 if self.target is None else self.target
            if control == target:
                raise ValueError('CX control and target must be different qubits')
        return self

class SimRequest(BaseModel):
    gates: List[Gate] = Field(default_factory=list)
    shots: int = Field(default=1024, gt=0)
    backend: str = 'Qiskit Aer'

class AIMessage(BaseModel):
    role: Literal['user', 'ai']
    text: str = Field(min_length=1, max_length=4000)


class AIRequest(BaseModel):
    action: Literal['explain', 'debug', 'optimize'] = 'explain'
    message: str = Field(default='', max_length=4000)
    page: str = Field(default='unknown', max_length=120)
    gates: List[Gate] = Field(default_factory=list, max_length=64)
    probabilities: List[float] = Field(default_factory=list, max_length=4)
    statevector: List[Dict[str, Any]] = Field(default_factory=list, max_length=16)
    history: List[AIMessage] = Field(default_factory=list, max_length=12)

@app.get('/health')
def health():
    return {
        'status': 'ok',
        'service': 'qsense-backend',
        'ai_provider': os.getenv('AI_PROVIDER', 'openrouter'),
        'ai_configured': bool(os.getenv('OPENROUTER_API_KEY')),
    }

@app.post('/api/simulate')
def simulate(req: SimRequest):
    payload = [g.model_dump(exclude_none=True) for g in req.gates]
    if req.backend.lower().startswith('qiskit'):
        try:
            return simulate_with_qiskit(payload, req.shots)
        except Exception as exc:
            result = local_fallback_simulation(payload, req.shots)
            result['notice'] = f'Qiskit backend unavailable in this environment; local preview used: {exc.__class__.__name__}'
            return result
    result = local_fallback_simulation(payload, req.shots)
    result['notice'] = f'{req.backend} adapter is prototype-ready; local preview returned until cloud/provider credentials are connected.'
    return result

@app.post('/api/ai')
def ai(req: AIRequest):
    return tutor_response(
        action=req.action,
        message=req.message,
        page=req.page,
        gates=[g.model_dump(exclude_none=True) for g in req.gates],
        probabilities=req.probabilities,
        statevector=req.statevector,
        history=[item.model_dump() for item in req.history],
    )
