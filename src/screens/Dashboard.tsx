import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Stat } from '../components/ui/Stat'
import { StatBar } from '../components/ui/StatBar'
import { Icon } from '../components/ui/Icon'
import { AnimatedNumber } from '../components/ui/AnimatedNumber'
import { formatMoney, formatNumber, formatDate } from '../lib/format'

export function Dashboard() {
  const { player, globalRank } = useGame()
  if (!player) return null

  const active = player.games.filter((g) => !g.released)
  const released = player.games.filter((g) => g.released)

  const depts = [
    { role: 'Programmer', icon: '🧑‍💻', label: 'DEV', color: '#22d3ee', count: player.employees.filter((e) => e.role === 'Programmer').length },
    { role: 'Artist', icon: '🎨', label: 'ART', color: '#f472b6', count: player.employees.filter((e) => e.role === 'Artist').length },
    { role: 'Designer', icon: '🎲', label: 'DESIGN', color: '#a78bfa', count: player.employees.filter((e) => e.role === 'Designer').length },
    { role: 'Producer', icon: '📋', label: 'PROD', color: '#34d399', count: player.employees.filter((e) => e.role === 'Producer').length },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-pixel text-base text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] sm:text-xl">
            COMMAND CENTER
          </h2>
          <p className="font-mono-game mt-1 text-base text-white/50">Studio HQ · Week {player.week}</p>
        </div>
        <span className="hud-panel px-3 py-1.5 font-mono-game text-base text-accent-cyan/80">RANK #{globalRank}</span>
      </div>

      {/* Resource stat grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Studio Value" value={<AnimatedNumber value={player.studioValue} format={formatMoney} />} icon={<Icon name="bank" size={20} />} accent="#7c5cff" />
        <Stat label="Cash" value={<AnimatedNumber value={player.money} format={formatMoney} />} icon={<Icon name="cash" size={20} />} accent="#34d399" />
        <Stat label="Fans" value={<AnimatedNumber value={player.fans} format={formatNumber} />} icon={<Icon name="fans" size={20} />} accent="#f472b6" />
        <Stat label="Rating" value={<AnimatedNumber value={player.companyRating} format={(n) => n.toFixed(1)} />} icon={<Icon name="star" size={20} />} accent="#fbbf24" />
        <Stat label="Global Rank" value={`#${globalRank}`} icon={<Icon name="trophy" size={20} />} accent="#22d3ee" />
        <Stat label="Games" value={released.length} icon={<Icon name="gamepad" size={20} />} accent="#a78bfa" />
        <Stat label="Employees" value={player.employees.length} icon={<Icon name="users" size={20} />} accent="#60a5fa" />
        <Stat label="Country" value={player.country} icon={<Icon name="globe" size={20} />} accent="#f87171" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* 2D Studio Hub — stylized command map (no literal office scene) */}
          <GlassCard glow>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-pixel text-[11px] uppercase text-accent-cyan">Studio Hub</h3>
              <span className="font-mono-game text-base text-white/40">{player.employees.length} crew on deck</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {depts.map((d) => (
                <div
                  key={d.role}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3"
                  style={{ boxShadow: `inset 0 0 0 1px ${d.color}22` }}
                >
                  <div className="text-2xl">{d.icon}</div>
                  <div className="mt-1 font-pixel text-[9px] uppercase tracking-wider" style={{ color: d.color }}>
                    {d.label}
                  </div>
                  <div className="font-mono-game text-2xl font-bold text-white">{d.count}</div>
                  <div className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-20 blur-xl" style={{ background: d.color }} />
                </div>
              ))}
            </div>
            <div className="relative mt-3 flex h-24 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/10 bg-ink-900/40">
              <div className="emblem h-12 w-12 text-2xl">🎮</div>
              {['👾', '🪙', '⚡', '💾'].map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl opacity-60 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  style={{ left: `${12 + i * 24}%` }}
                  animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  {s}
                </motion.span>
              ))}
              <div className="absolute bottom-1 font-mono-game text-sm text-white/40">{player.username} HQ</div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">In Development</h3>
              <span className="text-xs text-white/40">{active.length} active</span>
            </div>
              {active.length === 0 ? (
                <p className="text-sm text-white/40">No games in development. Head to Game Dev to start one!</p>
              ) : (
                <div className="max-h-[38vh] space-y-3 overflow-y-auto scrollbar-thin pr-1">
                  {active.map((g) => (
                    <div key={g.id} className="rounded-xl bg-white/5 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-white">{g.name}</span>
                        <span className="chip">{g.phase}</span>
                      </div>
                      <StatBar value={Math.round(g.progress * 100)} color="#22d3ee" label="Phase Progress" />
                      <div className="mt-1 text-xs text-white/40">
                        {g.genre} · {g.theme} · {g.platforms.join(', ')} · Week {g.weeksSpent}/{g.devTimeWeeks}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
        </div>

        <div className="lg:col-span-1 flex items-center">
          <GlassCard className="w-full">
            <h3 className="mb-3 text-lg font-bold text-white">Top Released Games</h3>
            {released.length === 0 ? (
              <p className="text-sm text-white/40">Release your first game to see performance here.</p>
            ) : (
              <div className="max-h-[38vh] space-y-2 overflow-y-auto scrollbar-thin pr-1">
                {[...released]
                  .sort((a, b) => (b.sales?.revenue ?? 0) - (a.sales?.revenue ?? 0))
                  .slice(0, 5)
                  .map((g) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                    >
                      <div>
                        <div className="font-semibold text-white">{g.name}</div>
                        <div className="text-xs text-white/40">{g.genre} · {formatDate(player.week)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent-green">{formatMoney(g.sales?.revenue ?? 0)}</div>
                        <div className="text-xs text-white/50">Score {g.review?.score ?? '—'}</div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
