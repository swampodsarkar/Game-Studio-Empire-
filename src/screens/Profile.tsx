import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { StatBar } from '../components/ui/StatBar'
import { Stat } from '../components/ui/Stat'
import { AVATARS, COUNTRIES } from '../config/gameConfig'
import { formatMoney, formatNumber } from '../lib/format'
import { xpForLevel } from '../lib/gameLogic'

export function Profile() {
  const { player, globalRank, setAvatar, setCountry } = useGame()
  const { user } = useAuth()
  if (!player) return null
  const xpNeeded = xpForLevel(player.level)

  return (
    <div className="space-y-4">
      <GlassCard glow className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-cyan text-5xl shadow-glow">
          {player.avatar}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl font-bold text-white">{player.username}</h2>
          <div className="text-sm text-white/50">{player.country} · {user?.email ?? (user?.isAnonymous ? 'Guest' : '')}</div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="chip border-brand-400/40 text-brand-400">Level {player.level}</span>
            <span className="chip border-accent-cyan/40 text-accent-cyan">Rank #{globalRank}</span>
            <span className="chip border-accent-amber/40 text-accent-amber">Rating {player.companyRating.toFixed(1)}</span>
            <span className="chip">🏅 {player.achievements.length} achievements</span>
          </div>
          <div className="mt-3 max-w-sm">
            <StatBar value={(player.xp / xpNeeded) * 100} color="#7c5cff" label="XP" showValue={false} />
            <div className="mt-1 text-xs text-white/40">{player.xp} / {xpNeeded} to next level</div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Cash" value={formatMoney(player.money)} icon="💰" accent="#34d399" />
        <Stat label="Fans" value={formatNumber(player.fans)} icon="📣" accent="#f472b6" />
        <Stat label="Studio Value" value={formatMoney(player.studioValue)} icon="🏛️" accent="#7c5cff" />
        <Stat label="Games" value={player.games.filter((g) => g.released).length} icon="🎮" accent="#a78bfa" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Avatar</h3>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${
                  player.avatar === a ? 'bg-brand-500/30 ring-2 ring-brand-400' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Country</h3>
          <select className="input" value={player.country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-ink-800">{c}</option>
            ))}
          </select>
        </GlassCard>
      </div>
    </div>
  )
}
