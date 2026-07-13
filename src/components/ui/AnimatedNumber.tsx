import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  format?: (n: number) => string
  className?: string
  duration?: number
}

// Tweens from the previous value to the new one with an ease-out cubic, so
// cash/fans/value "count up" like a real game HUD readout.
export function AnimatedNumber({ value, format = (n) => String(Math.round(n)), className, duration = 650 }: Props) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const cur = from + (to - from) * eased
      setDisplay(cur)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      fromRef.current = to
    }
  }, [value, duration])

  return <span className={className}>{format(display)}</span>
}
