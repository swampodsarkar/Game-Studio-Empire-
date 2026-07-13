import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'

export function Awards() {
  const { player } = useGame()
  if (!player) return null

  const won = player.awards.filter((a) => a.won)
  const nominated = player.awards.filter((a) => !a.won)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <GlassCard><div className="text-xs text-white/50">Total Awards</div><div className="text-2xl font-bold text-accent-amber">{player.awards.length}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Won</div><div className="text-2xl font-bold text-accent-green">{won.length}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Nominations</div><div className="text-2xl font-bold text-white">{nominated.length}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Best Game</div><div className="text-2xl font-bold text-white">{won.filter((a) => a.category === 'Best Game').length}</div></GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-3 text-lg font-bold text-white">🏆 trophy Cabinet</h3>
        {player.awards.length === 0 ? (
          <p className="text-sm text-white/40">Release games scoring 70+ to get nominated. Score 88+ to win!</p>
        ) : (
          <div className="space-y-2">
            {[...player.awards].reverse().map((a, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl p-3 ${
                  a.won ? 'border border-accent-amber/30 bg-accent-amber/10' : 'bg-white/5'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">{a.gameName}</div>
                  <div className="text-xs text-white/50">{a.category} · {a.year}</div>
                </div>
                <div className={`text-sm font-bold ${a.won ? 'text-accent-amber' : 'text-white/50'}`}>
                  {a.won ? '🏆 Won' : '🎬 Nominated'}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
