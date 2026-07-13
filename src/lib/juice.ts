// Tiny event bus so any part of the app can trigger a confetti burst or a
// floating coin-pop without prop drilling.
export type JuiceKind = 'confetti' | 'coin' | 'stars'

type Listener = (kind: JuiceKind, x: number, y: number, text?: string) => void

const listeners = new Set<Listener>()

export function onJuice(l: Listener): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function burst(kind: JuiceKind = 'confetti', x?: number, y?: number, text?: string) {
  const cx = x ?? window.innerWidth / 2
  const cy = y ?? window.innerHeight / 3
  listeners.forEach((l) => l(kind, cx, cy, text))
}
