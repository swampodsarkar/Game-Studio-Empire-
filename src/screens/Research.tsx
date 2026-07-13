import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { RESEARCH_TREE } from '../config/gameConfig'

export function Research() {
  const { player, researchNode } = useGame()
  if (!player) return null
  const rp = Math.floor(player._rp ?? 0)

  return (
    <div>
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Research Lab</h3>
            <p className="text-sm text-white/50">Earn research points each week from your lab and programmers.</p>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-brand-500/20 to-accent-cyan/20 px-4 py-2 text-center">
            <div className="text-2xl font-bold text-white">{rp}</div>
            <div className="text-xs text-white/50">Research Points</div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {RESEARCH_TREE.map((node) => {
          const state = player.research.find((r) => r.id === node.id)
          const unlocked = state?.unlocked
          const prereqMet = node.prereq.every((pr) => player.research.find((r) => r.id === pr)?.unlocked)
          const canAfford = rp >= node.cost
          const locked = !unlocked && !prereqMet
          return (
            <GlassCard
              key={node.id}
              className={unlocked ? 'border-accent-green/30' : locked ? 'opacity-60' : ''}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{node.icon}</span>
                <div className="font-bold text-white">{node.name}</div>
              </div>
              <p className="mb-2 text-xs text-white/50">{node.description}</p>
              <div className="mb-2 rounded-lg bg-white/5 p-2 text-xs text-accent-amber">Bonus: {node.bonus}</div>
              {node.prereq.length > 0 && (
                <div className="mb-2 text-[11px] text-white/40">
                  Requires: {node.prereq.join(', ')}
                </div>
              )}
              {unlocked ? (
                <div className="rounded-lg bg-accent-green/20 py-2 text-center text-sm font-semibold text-accent-green">
                  ✓ Unlocked
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  disabled={locked || !canAfford}
                  onClick={() => researchNode(node.id)}
                >
                  {locked ? 'Locked' : `Research · ${node.cost} RP`}
                </Button>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
