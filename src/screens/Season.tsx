import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { StatBar } from '../components/ui/StatBar'
import { SEASON_TIERS, SEASON_LENGTH_WEEKS } from '../config/gameConfig'
import { formatMoney, formatNumber } from '../lib/format'

export function Season() {
  const { player, claimSeasonTier } = useGame()
  if (!player) return null
  const season = player.season
  const nextTier = SEASON_TIERS.find((t) => !season.claimedTiers.includes(t.tier) && season.xp >= t.xpNeeded)
  const maxXp = SEASON_TIERS[SEASON_TIERS.length - 1].xpNeeded

  return (
    <div className="space-y-4">
      <GlassCard glow>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">🎟️ Season {season.id} Battle Pass</h3>
            <p className="text-sm text-white/50">Earn season XP by releasing games, researching and upgrading. Reset every {SEASON_LENGTH_WEEKS} weeks.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{season.xp} XP</div>
            <div className="text-xs text-white/40">of {maxXp} to max</div>
          </div>
        </div>
        <div className="mt-3">
          <StatBar value={(season.xp / maxXp) * 100} color="#7c5cff" showValue={false} />
        </div>
        {nextTier && (
          <Button className="mt-3" onClick={() => claimSeasonTier(nextTier.tier)}>
            Claim next reward ({nextTier.label})
          </Button>
        )}
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {SEASON_TIERS.map((t) => {
          const unlocked = season.xp >= t.xpNeeded
          const claimed = season.claimedTiers.includes(t.tier)
          return (
            <GlassCard key={t.tier} className={claimed ? 'border-accent-green/30' : unlocked ? 'border-brand-400/40' : ''}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-white">Tier {t.tier}</span>
                <span className="text-xs text-white/40">{t.label}</span>
              </div>
              <div className="mb-2 text-xs text-white/50">Needs {t.xpNeeded} XP</div>
              <div className="space-y-1 text-[11px]">
                {t.reward.money ? <div className="text-accent-green">+{formatMoney(t.reward.money)}</div> : null}
                {t.reward.fans ? <div className="text-accent-pink">+{formatNumber(t.reward.fans)} fans</div> : null}
                {t.reward.xp ? <div className="text-brand-400">+{t.reward.xp} XP</div> : null}
              </div>
              <div className="mt-3">
                {claimed ? (
                  <div className="rounded-lg bg-accent-green/20 py-1.5 text-center text-xs font-semibold text-accent-green">✓ Claimed</div>
                ) : unlocked ? (
                  <Button size="sm" className="w-full" onClick={() => claimSeasonTier(t.tier)}>Claim</Button>
                ) : (
                  <div className="rounded-lg bg-white/5 py-1.5 text-center text-xs text-white/40">Locked</div>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
