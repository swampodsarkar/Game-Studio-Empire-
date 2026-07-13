import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { StatBar } from '../components/ui/StatBar'
import { Button } from '../components/ui/Button'
import { formatMoney } from '../lib/format'
import { xpForLevel } from '../lib/gameLogic'

export function Missions() {
  const { player, claimLoginReward } = useGame()
  if (!player) return null

  const done = player.missions.filter((m) => m.progress >= m.goal).length
  const xpNeeded = xpForLevel(player.level)
  const lastClaim = player._lastClaimDay === new Date().toDateString()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-pixel text-base text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] sm:text-xl">
            QUEST LOG
          </h2>
          <p className="font-mono-game mt-1 text-base text-white/50">
            {done}/{player.missions.length} missions complete
          </p>
        </div>
        <span className="hud-panel px-3 py-1.5 font-mono-game text-base text-accent-cyan/80">WEEK {player.week}</span>
      </div>

      <GlassCard glow>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <div className="font-pixel text-[10px] uppercase tracking-wider text-accent-cyan">Daily Reward</div>
            <div className="text-sm text-white/60">Login streak</div>
            <div className="text-2xl font-bold text-white">{player.streak} days</div>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
        <Button className="mt-2 w-full" disabled={lastClaim} onClick={() => claimLoginReward()}>
          {lastClaim ? 'Claimed today ✓' : 'Claim Reward'}
        </Button>
        <div className="mt-4">
          <StatBar value={(player.xp / xpNeeded) * 100} color="#7c5cff" label={`Level ${player.level} XP`} showValue={false} />
          <div className="mt-1 text-xs text-white/40">
            {player.xp} / {xpNeeded} XP
          </div>
        </div>
      </GlassCard>

      <div className="grid max-h-[60vh] gap-4 overflow-y-auto scrollbar-thin pr-1 md:grid-cols-2">
        {player.missions.map((m) => {
          const complete = m.progress >= m.goal
          return (
            <GlassCard key={m.id} className={complete ? 'ring-1 ring-accent-green/40' : ''}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="font-pixel text-[10px] uppercase tracking-wider text-accent-cyan">Mission</div>
                  <h3 className="text-lg font-bold text-white">{m.title}</h3>
                </div>
                <span className={`chip ${complete ? 'border-accent-green/40 text-accent-green' : 'text-white/60'}`}>
                  {complete ? '✓ Done' : `${m.progress}/${m.goal}`}
                </span>
              </div>
              <p className="mb-3 text-sm text-white/60">{m.description}</p>
              <StatBar value={(m.progress / m.goal) * 100} color={complete ? '#34d399' : '#22d3ee'} showValue={false} />
              <div className="mt-3 text-[11px] text-accent-amber">
                Reward: +{m.reward.xp ?? 0} XP {m.reward.money ? `· ${formatMoney(m.reward.money)}` : ''}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
