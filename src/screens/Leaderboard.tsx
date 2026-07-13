import { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { loadLeaderboard } from '../repository'
import type { LeaderboardEntry } from '../types'
import { formatMoney, formatNumber } from '../lib/format'

export function Leaderboard() {
  const { player, market } = useGame()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    loadLeaderboard().then((global) => {
      // Merge Firebase leaderboard with AI market studios and the player.
      const ai: LeaderboardEntry[] = market.studios.slice(0, 80).map((s) => ({
        uid: s.id,
        username: s.name,
        avatar: '🏢',
        studioValue: s.value,
        fans: s.fans,
        level: Math.round(s.rating / 4),
        country: '—',
      }))
      const all = [...global, ...ai]
      if (player) {
        all.push({
          uid: player.uid,
          username: player.username + ' (You)',
          avatar: player.avatar,
          studioValue: player.studioValue,
          fans: player.fans,
          level: player.level,
          country: player.country,
        })
      }
      all.sort((a, b) => b.studioValue - a.studioValue)
      setEntries(all.slice(0, 100))
    })
  }, [market, player])

  if (!player) return null

  return (
    <div>
      <GlassCard className="mb-4">
        <h3 className="text-lg font-bold text-white">Global Rankings</h3>
        <p className="text-sm text-white/50">Top studios by studio value. {entries.length} studios tracked.</p>
      </GlassCard>
      <GlassCard className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase text-white/40">
                <th className="p-3">#</th>
                <th className="p-3">Studio</th>
                <th className="p-3">Country</th>
                <th className="p-3 text-right">Level</th>
                <th className="p-3 text-right">Fans</th>
                <th className="p-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const isYou = e.uid === player.uid
                return (
                  <tr
                    key={e.uid}
                    className={`border-b border-white/5 ${isYou ? 'bg-brand-500/15' : 'hover:bg-white/5'}`}
                  >
                    <td className="p-3 font-bold text-white/70">{i + 1}</td>
                    <td className="p-3">
                      <span className="mr-2">{e.avatar}</span>
                      <span className="font-semibold text-white">{e.username}</span>
                    </td>
                    <td className="p-3 text-white/60">{e.country}</td>
                    <td className="p-3 text-right text-white/70">{e.level}</td>
                    <td className="p-3 text-right text-white/70">{formatNumber(e.fans)}</td>
                    <td className="p-3 text-right font-bold text-accent-green">{formatMoney(e.studioValue)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
