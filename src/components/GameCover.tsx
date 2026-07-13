import type { GameProject } from '../types'
import { GENRE_ART, PLATFORM_ICON, THEME_ICON, hashUnit } from '../lib/gameArt'

// Steam-style procedural capsule art for a game. Colours + layout come from the
// genre, with a deterministic angle/motif per game so each looks unique.
export function GameCover({
  game,
  className = '',
}: {
  game: GameProject
  className?: string
}) {
  const art = GENRE_ART[game.genre] ?? GENRE_ART.Action!
  const seed = hashUnit(game.id || game.name)
  const angle = Math.round(90 + seed * 180)
  const score = game.review?.score

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl ${className}`}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${art.from}, ${art.via} 55%, ${art.to})`,
      }}
    >
      {/* radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${30 + seed * 40}% 30%, rgba(255,255,255,0.28), transparent 60%)`,
        }}
      />
      {/* diagonal shine */}
      <div className="absolute -inset-x-4 top-0 h-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* big genre glyph */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="select-none text-6xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          style={{ transform: `rotate(${(seed - 0.5) * 16}deg)` }}
        >
          {art.icon}
        </span>
      </div>

      {/* theme + store chips */}
      <div className="absolute left-2 top-2 flex flex-wrap gap-1">
        <span className="rounded-md bg-black/35 px-1.5 py-0.5 text-sm backdrop-blur-sm">
          {THEME_ICON[game.theme] ?? '✨'}
        </span>
        {game.platforms.map((p) => (
          <span key={p} className="rounded-md bg-black/35 px-1.5 py-0.5 text-sm backdrop-blur-sm" title={p}>
            {PLATFORM_ICON[p] ?? '🎮'}
          </span>
        ))}
      </div>

      {/* score badge */}
      {score != null && (
        <div
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-extrabold text-white shadow-lg backdrop-blur-sm"
          style={{
            borderColor:
              score >= 85 ? '#34d399' : score >= 65 ? '#fbbf24' : '#f87171',
            backgroundColor:
              score >= 85
                ? 'rgba(16,185,129,0.35)'
                : score >= 65
                  ? 'rgba(251,191,36,0.3)'
                  : 'rgba(239,68,68,0.3)',
          }}
        >
          {score}
        </div>
      )}

      {/* title scrim */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-2 pt-6">
        <div className="hud-title truncate text-sm font-extrabold uppercase tracking-wide text-white drop-shadow">
          {game.name}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
          {game.genre} · {game.theme}
        </div>
      </div>
    </div>
  )
}
