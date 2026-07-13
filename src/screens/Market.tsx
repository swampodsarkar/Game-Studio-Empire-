import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Modal } from '../components/ui/Modal'
import { GENRES } from '../config/gameConfig'
import { formatMoney, formatNumber } from '../lib/format'
import type { AIStudio, Genre } from '../types'

export function Market() {
  const { player, market, globalRank, acquireStudio } = useGame()
  const [view, setView] = useState<AIStudio | null>(null)
  const [acqMsg, setAcqMsg] = useState<string | null>(null)
  const [genreFilter, setGenreFilter] = useState<Genre | 'All'>('All')
  if (!player) return null

  const trending = [...(market.games ?? [])]
    .filter((g) => genreFilter === 'All' || g.genre === genreFilter || g.tags.includes(genreFilter))
    .sort((a, b) => b.heat - a.heat)

  const top = market.studios.slice(0, 12)
  const rankOf = (s: AIStudio) => market.studios.filter((x) => x.value > s.value).length + 1

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <GlassCard glow>
          <div className="text-sm text-white/50">Your Global Rank</div>
          <div className="text-3xl font-bold text-white">#{globalRank}</div>
          <div className="text-xs text-white/40">out of {market.studios.length + 1} studios</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-white/50">Your Studio Value</div>
          <div className="text-2xl font-bold text-accent-green">{formatMoney(player.studioValue)}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-white/50">Competitors</div>
          <div className="text-2xl font-bold text-white">{market.studios.length}</div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Top Genre Trends ({market.trends.year})</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {[...GENRES]
              .sort((a, b) => (market.trends.genrePopularity[b] ?? 1) - (market.trends.genrePopularity[a] ?? 1))
              .slice(0, 5)
              .map((g) => {
                const pop = market.trends.genrePopularity[g]
                const pct = (pop - 1) * 100
                const color = pct >= 0 ? '#34d399' : '#f87171'
                return (
                  <div key={g} className="rounded-xl bg-white/5 p-3">
                    <div className="text-sm font-semibold text-white">{g}</div>
                    <div className="text-lg font-bold" style={{ color }}>
                      {pct >= 0 ? '+' : ''}
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                )
              })}
          </div>
        </GlassCard>

        <GlassCard glow>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white">🔥 Trending Games</h3>
            <select
              className="input w-auto py-1 text-sm"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value as Genre | 'All')}
            >
              <option value="All" className="bg-ink-800">All categories</option>
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-ink-800">{g}</option>
              ))}
            </select>
          </div>
          <p className="mb-3 text-xs text-white/40">
            Live releases from other studios. Watch their review scores and downloads to spot what's hot.
          </p>
          <div className="max-h-[44vh] space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {trending.slice(0, 10).map((g, i) => {
              const rc = g.reviewScore >= 80 ? '#34d399' : g.reviewScore >= 60 ? '#fbbf24' : '#f87171'
              return (
                <div key={g.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white/80">#{i + 1}</span>
                      <span className="truncate font-semibold text-white">{g.name}</span>
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[11px] font-bold"
                        style={{ color: rc, border: `1px solid ${rc}55`, background: `${rc}1a` }}
                      >
                        {g.reviewScore}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-xs text-white/40">
                      {g.studio} · {g.genre}
                      {g.tags.slice(0, 3).map((t) => (
                        <span key={t} className="ml-1 rounded bg-white/10 px-1 text-[10px] text-white/50">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-3 flex shrink-0 flex-col items-end text-xs">
                    <span className="font-semibold text-accent-cyan">⬇ {formatNumber(g.copies)}</span>
                    <span className="text-accent-green">{formatMoney(g.revenue)}</span>
                    <span className="text-white/40">heat {g.heat}</span>
                  </div>
                </div>
              )
            })}
            {trending.length === 0 && (
              <div className="py-6 text-center text-sm text-white/40">No games in this category right now.</div>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Top 5 Studios</h3>
          <div className="space-y-2">
            {top.slice(0, 5).map((s, i) => (
              <button
                key={s.id}
                onClick={() => setView(s)}
                className="flex w-full items-center justify-between rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white/80">#{i + 1}</span>
                  <span className="text-white/80">{s.name}</span>
                </div>
                <div className="font-semibold text-accent-green">{formatMoney(s.value)}</div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Top Competitors</h3>
          <div className="max-h-[44vh] space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {top.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setView(s)}
                className="flex w-full items-center justify-between rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10"
              >
                <div>
                  <span className="mr-2 font-bold text-white/80">#{i + 1}</span>
                  <span className="text-white/80">{s.name}</span>
                </div>
                <div className="flex gap-4 text-xs text-white/50">
                  <span>{formatNumber(s.fans)} fans</span>
                  <span className="font-semibold text-accent-green">{formatMoney(s.value)}</span>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name} maxWidth="max-w-md">
        {view && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Global Rank</span><div className="font-bold text-white">#{rankOf(view)}</div></div>
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Studio Value</span><div className="font-bold text-accent-green">{formatMoney(view.value)}</div></div>
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Fans</span><div className="font-bold text-white">{formatNumber(view.fans)}</div></div>
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Games Shipped</span><div className="font-bold text-white">{view.games}</div></div>
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Rating</span><div className="font-bold text-accent-amber">{view.rating}</div></div>
              <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Type</span><div className="font-bold text-white">AI Studio</div></div>
            </div>
            <p className="text-xs text-white/40">Visit other studios is a preview of competitor stats. Friend lists, live chat and co-op visits require Firebase realtime sync.</p>
            <div className="border-t border-white/10 pt-3">
              <div className="mb-2 text-xs text-white/50">Acquisition (M&amp;A)</div>
              <div className="mb-2 text-sm text-white/70">
                Buyout cost: <span className="font-bold text-accent-green">{formatMoney(Math.round(view.value * 0.6))}</span>
              </div>
              {acqMsg && <div className="mb-2 text-xs text-accent-amber">{acqMsg}</div>}
              <button
                disabled={player.money < Math.round(view.value * 0.6)}
                onClick={() => {
                  const ok = acquireStudio(view.id)
                  if (ok) {
                    setAcqMsg(`Acquired ${view.name}! Fans and value absorbed.`)
                    setView(null)
                  } else {
                    setAcqMsg('Not enough cash to acquire this studio.')
                  }
                }}
                className="btn-game w-full"
              >
                🤝 Acquire Studio
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
