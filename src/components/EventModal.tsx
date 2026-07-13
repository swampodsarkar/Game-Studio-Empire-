import { useGame } from '../context/GameContext'

// Interactive crisis / decision event. Blocks auto-play until the player
// picks a choice (handled in GameProvider by pausing the simulation loop).
export function EventModal() {
  const { player, resolveEvent } = useGame()
  const ev = player?.pendingEvent
  if (!player || !ev) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="game-panel w-full max-w-md p-0">
        <div className="flex items-center gap-2 border-b border-red-500/30 bg-red-500/10 px-5 py-3">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-lg font-bold uppercase tracking-wide text-red-200">{ev.title}</h2>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-white/80">{ev.body}</p>
          <div className="space-y-2">
            {ev.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => resolveEvent(i)}
                className="btn-game w-full"
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-center text-[11px] text-white/40">Time is paused until you decide.</p>
        </div>
      </div>
    </div>
  )
}
