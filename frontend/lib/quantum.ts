export type GateName = 'H' | 'X' | 'Y' | 'Z' | 'CX' | 'M'
export type Gate = { name: GateName; qubit?: number; control?: number; target?: number }

export const defaultCircuit: Gate[] = [
  { name: 'H', qubit: 0 },
  { name: 'CX', control: 0, target: 1 },
  { name: 'M', qubit: 0 },
  { name: 'M', qubit: 1 },
]

function complex(re = 0, im = 0) { return { re, im } }
function add(a: any, b: any) { return complex(a.re + b.re, a.im + b.im) }
function mul(a: any, b: any) { return complex(a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re) }
const SQRT2 = Math.sqrt(2)
const gateMatrices: Record<string, any[][]> = {
  H: [[complex(1/SQRT2), complex(1/SQRT2)], [complex(1/SQRT2), complex(-1/SQRT2)]],
  X: [[complex(0), complex(1)], [complex(1), complex(0)]],
  Y: [[complex(0), complex(0,-1)], [complex(0,1), complex(0)]],
  Z: [[complex(1), complex(0)], [complex(0), complex(-1)]],
}

export function simulate2Q(gates: Gate[]) {
  let state = [complex(1), complex(0), complex(0), complex(0)]
  for (const g of gates) {
    if (g.name === 'M') continue
    if (g.name === 'CX') {
      const next = [...state]
      const c = g.control ?? 0
      const t = g.target ?? 1
      for (let i=0;i<4;i++) {
        const cb = (i >> (1-c)) & 1
        const tb = (i >> (1-t)) & 1
        const j = cb ? (i ^ (1 << (1-t))) : i
        next[j] = state[i]
      }
      state = next
    } else {
      const q = g.qubit ?? 0
      const next = [...state]
      for (let basis=0; basis<4; basis++) {
        const bit = (basis >> (1-q)) & 1
        const partner = basis ^ (1 << (1-q))
        const row = bit
        next[basis] = add(mul(gateMatrices[g.name][row][0], state[bit===0 ? basis : partner]), mul(gateMatrices[g.name][row][1], state[bit===0 ? partner : basis]))
      }
      state = next
    }
  }
  const probs = state.map((c:any)=> c.re*c.re + c.im*c.im)
  return { state, probabilities: probs }
}

export function formatComplex(c:any) {
  const r = Math.abs(c.re) < 1e-7 ? 0 : c.re
  const i = Math.abs(c.im) < 1e-7 ? 0 : c.im
  if (i === 0) return `${r.toFixed(3)}`
  if (r === 0) return `${i.toFixed(3)}i`
  return `${r.toFixed(3)} ${i >= 0 ? '+' : '-'} ${Math.abs(i).toFixed(3)}i`
}
