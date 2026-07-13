// Full-screen animated backdrop that makes the app read like a 2D neon-arcade
// game: a synthwave perspective grid floor scrolling toward the viewer, a
// glowing horizon, a twinkling starfield and drifting 2D sprites (controllers,
// cubes, coins). Pure CSS/SVG — no external art assets.
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      {/* Deep synthwave wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 700px at 50% 8%, rgba(124,92,255,0.30), transparent 60%),' +
            'radial-gradient(900px 600px at 110% 0%, rgba(34,211,238,0.20), transparent 55%),' +
            'radial-gradient(800px 600px at 0% 100%, rgba(244,114,182,0.16), transparent 55%),' +
            'linear-gradient(180deg, #0a0a1f 0%, #0b0a24 45%, #120a2e 100%)',
        }}
      />

      {/* Horizon sun glow */}
      <div
        className="absolute left-1/2 top-[34%] h-72 w-72 -translate-x-1/2 rounded-full opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(255,120,200,0.55), rgba(124,92,255,0.15) 60%, transparent 70%)' }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 opacity-80">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white animate-twinkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s`, opacity: s.o }}
          />
        ))}
      </div>

      {/* Perspective neon grid floor */}
      <div className="arcade-floor" aria-hidden>
        <div className="arcade-floor-grid" />
        <div className="arcade-floor-grid arcade-floor-grid--far" />
      </div>

      {/* Drifting 2D sprites */}
      <div className="absolute inset-0">
        {SPRITES.map((sp, i) => (
          <span
            key={i}
            className="absolute text-3xl md:text-5xl animate-sprite-float drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            style={{ left: `${sp.x}%`, top: `${sp.y}%`, animationDelay: `${sp.d}s`, animationDuration: `${sp.t}s` }}
          >
            {sp.e}
          </span>
        ))}
      </div>

      {/* Scanlines + vignette */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
      />
    </div>
  )
}

const STARS = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 42,
  o: 0.3 + Math.random() * 0.7,
  d: (Math.random() * 4).toFixed(2),
}))

const SPRITES = [
  { e: '🎮', x: 10, y: 18, d: 0, t: 7 },
  { e: '👾', x: 82, y: 14, d: 1.2, t: 8 },
  { e: '🕹️', x: 24, y: 60, d: 2.1, t: 9 },
  { e: '🪙', x: 68, y: 52, d: 0.6, t: 6 },
  { e: '🎲', x: 46, y: 22, d: 3.0, t: 7.5 },
  { e: '💾', x: 90, y: 40, d: 1.8, t: 8.5 },
  { e: '🏆', x: 6, y: 44, d: 2.6, t: 9.5 },
  { e: '⚡', x: 56, y: 62, d: 0.9, t: 6.5 },
]
