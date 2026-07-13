import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { ACHIEVEMENTS } from '../lib/achievements'
import { formatMoney, formatNumber } from '../lib/format'

export function Achievements() {
  const { player } = useGame()
  if (!player) return null
  const unlocked = new Set(player.achievements.map((a) => a.id))

  const total = ACHIEVEMENTS.length
  const got = ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length

  return (
    <div>
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Achievements</h3>
          <div className="text-sm text-white/60">{got} / {total} unlocked</div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan" style={{ width: `${(got / total) * 100}%` }} />
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const done = unlocked.has(a.id)
          return (
            <GlassCard
              key={a.id}
              className={`${done ? 'border-accent-amber/30' : a.hidden && !done ? 'blur-[3px]' : ''}`}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className={`text-3xl ${done ? '' : 'grayscale opacity-40'}`}>{done ? a.icon : a.hidden ? '❓' : a.icon}</span>
                <div>
                  <div className="font-bold text-white">{done || !a.hidden ? a.name : 'Hidden Achievement'}</div>
                  <div className="text-xs text-white/50">{a.description}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {a.reward.money ? <span className="chip text-accent-green">+{formatMoney(a.reward.money)}</span> : null}
                {a.reward.xp ? <span className="chip text-brand-400">+{a.reward.xp} XP</span> : null}
                {a.reward.fans ? <span className="chip text-accent-pink">+{formatNumber(a.reward.fans)} fans</span> : null}
                {done && <span className="chip border-accent-green/40 text-accent-green">✓ Unlocked</span>}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
