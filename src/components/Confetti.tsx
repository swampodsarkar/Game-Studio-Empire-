import { useEffect, useRef } from 'react'
import { onJuice, type JuiceKind } from '../lib/juice'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vrot: number
  life: number
  maxLife: number
  kind: JuiceKind
  text?: string
}

const COLORS = ['#7c5cff', '#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#ffffff']

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const raf = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (kind: JuiceKind, x: number, y: number, text?: string) => {
      if (kind === 'coin') {
        particles.current.push({
          x, y, vx: 0, vy: -1.4, size: 18, color: '#fbbf24', rot: 0, vrot: 0,
          life: 0, maxLife: 60, kind: 'coin', text: text ?? '💰',
        })
        return
      }
      const count = kind === 'stars' ? 18 : 90
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 4 + Math.random() * 8
        particles.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: 4 + Math.random() * 6,
          color: kind === 'stars' ? '#fbbf24' : COLORS[(Math.random() * COLORS.length) | 0],
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.4,
          life: 0,
          maxLife: 70 + Math.random() * 40,
          kind,
        })
      }
    }

    const off = onJuice(spawn)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const list = particles.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.life++
        if (p.kind === 'coin') {
          p.vy += 0.04
          p.y += p.vy
          const alpha = 1 - p.life / p.maxLife
          ctx.globalAlpha = Math.max(0, alpha)
          ctx.font = `${p.size}px sans-serif`
          ctx.fillText(p.text ?? '💰', p.x, p.y)
        } else {
          p.vy += 0.18
          p.vx *= 0.99
          p.x += p.vx
          p.y += p.vy
          p.rot += p.vrot
          const alpha = 1 - p.life / p.maxLife
          ctx.globalAlpha = Math.max(0, alpha)
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          ctx.restore()
        }
        if (p.life >= p.maxLife || p.y > canvas.height + 40) list.splice(i, 1)
      }
      ctx.globalAlpha = 1
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      off()
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  )
}
