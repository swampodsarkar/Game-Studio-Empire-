import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { StatBar } from '../components/ui/StatBar'
import { Modal } from '../components/ui/Modal'
import { Tabs, useTabState } from '../components/ui/Tabs'
import { GameCover } from '../components/GameCover'
import {
  CAMPAIGNS,
  GENRES,
  GENRE_THEME_AFFINITY,
  PLATFORMS,
  PUBLISHING,
  STORE_ICON,
  THEMES,
} from '../config/gameConfig'
import type { Genre, Platform, Theme } from '../types'
import { formatMoney, formatNumber } from '../lib/format'
import { recommendedBudget } from '../lib/gameLogic'
import { randomGameName } from '../lib/names'

export function GameDev() {
  const { player } = useGame()
  const [tab, setTab] = useTabState('create')
  if (!player) return null

  return (
    <div>
      <Tabs
        tabs={[
          { id: 'create', label: 'Create Game', icon: '➕' },
          { id: 'library', label: 'Game Library', icon: '📚' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-4">
        {tab === 'create' ? <CreateGameForm /> : <GameLibrary />}
      </div>
    </div>
  )
}

function CreateGameForm() {
  const { player, createGame } = useGame()
  const [name, setName] = useState('')
  const [genre, setGenre] = useState<Genre>('RPG')
  const [theme, setTheme] = useState<Theme>('Fantasy')
  const [platforms, setPlatforms] = useState<Platform[]>(['Steam'])
  const [engineId, setEngineId] = useState<string>('builtin')
  const [budget, setBudget] = useState(2000)
  const [marketing, setMarketing] = useState(1000)
  const [devTime, setDevTime] = useState(6)
  const [team, setTeam] = useState<string[]>([])
  const [publishing, setPublishing] = useState<string>('self')
  const [error, setError] = useState('')

  if (!player) return null

  const engines = [{ id: 'builtin', name: 'Studio Built-in Engine' }, ...player.engines]
  const rec = useMemo(
    () => recommendedBudget({ platforms, devTimeWeeks: devTime } as any),
    [platforms, devTime],
  )

  function togglePlatform(p: Platform) {
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))
  }

  function toggleMember(id: string) {
    setTeam((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
  }

  function submit() {
    if (platforms.length === 0) {
      setError('Select at least one store to publish to.')
      return
    }
    const cost = budget + marketing
    if (cost > player!.money) {
      setError(`You need ${formatMoney(cost)} but only have ${formatMoney(player!.money)}.`)
      return
    }
    createGame({
      name: name.trim() || randomGameName(),
      genre,
      theme,
      platforms,
      engineId,
      budget,
      marketingBudget: marketing,
      devTimeWeeks: devTime,
      publishing: publishing as any,
      teamMemberIds: team,
    })
    setError('')
    setName('')
    setTeam([])
  }

  return (
    <GlassCard>
      <h3 className="mb-4 text-lg font-bold text-white">New Game Production</h3>
      {error && <div className="mb-3 rounded-lg bg-accent-red/20 p-2 text-sm text-accent-red">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Game Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={randomGameName()} />
        </div>
        <div>
          <label className="label">Engine</label>
          <select className="input" value={engineId} onChange={(e) => setEngineId(e.target.value)}>
            {engines.map((e) => (
              <option key={e.id} value={e.id} className="bg-ink-800">
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Genre</label>
          <select className="input" value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-ink-800">{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Theme</label>
          <select className="input" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            {THEMES.map((t) => (
              <option key={t} value={t} className="bg-ink-800">{t}</option>
            ))}
          </select>
          {(GENRE_THEME_AFFINITY[genre] ?? []).includes(theme) && (
            <div className="mt-1 text-[11px] text-accent-green">✓ Great genre/theme match</div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="label">Stores ({platforms.length} selected)</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`chip transition ${
                  platforms.includes(p)
                    ? 'border-brand-400 bg-brand-500/20 text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                {STORE_ICON[p]} {p}
              </button>
            ))}
          </div>
          {platforms.length === 0 && (
            <div className="mt-1 text-[11px] text-accent-amber">Pick at least one store to publish to.</div>
          )}
        </div>
        <div>
          <label className="label">Development Time: {devTime} weeks</label>
          <input type="range" min={3} max={24} value={devTime} onChange={(e) => setDevTime(+e.target.value)} className="w-full accent-brand-500" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Publishing</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PUBLISHING.map((pub) => (
              <button
                key={pub.id}
                type="button"
                onClick={() => setPublishing(pub.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  publishing === pub.id ? 'border-brand-400 bg-brand-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  {pub.icon} {pub.name}
                </div>
                <div className="mt-1 text-[11px] text-white/50">{pub.description}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Budget: {formatMoney(budget)} (rec {formatMoney(rec)})</label>
          <input type="range" min={500} max={Math.max(500, player.money)} step={500} value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full accent-brand-500" />
        </div>
        <div>
          <label className="label">Marketing: {formatMoney(marketing)}</label>
          <input type="range" min={0} max={Math.max(500, player.money)} step={500} value={marketing} onChange={(e) => setMarketing(+e.target.value)} className="w-full accent-accent-cyan" />
        </div>
      </div>

      <div className="mt-4">
        <label className="label">Assign Team ({team.length} selected)</label>
        <div className="flex flex-wrap gap-2">
          {player.employees.map((e) => (
            <button
              key={e.id}
              onClick={() => toggleMember(e.id)}
              className={`chip transition ${
                team.includes(e.id) ? 'border-brand-400 bg-brand-500/20 text-white' : 'hover:bg-white/10'
              }`}
            >
              {e.role === 'Producer' ? '🧑‍💼' : '👤'} {e.name} · {e.role}
            </button>
          ))}
          {player.employees.length === 0 && <span className="text-sm text-white/40">No employees yet.</span>}
        </div>
      </div>

      <Button className="mt-5" onClick={submit} disabled={player.money < budget + marketing || platforms.length === 0}>
        🚀 Start Development ({formatMoney(budget + marketing)})
      </Button>
    </GlassCard>
  )
}

function GameLibrary() {
  const { player } = useGame()
  const [openId, setOpenId] = useState<string | null>(null)
  if (!player) return null
  const game = player.games.find((g) => g.id === openId)

  if (player.games.length === 0) {
    return <GlassCard><p className="text-sm text-white/40">No games yet. Create your first masterpiece!</p></GlassCard>
  }

  return (
    <div className="max-h-[64vh] grid gap-3 overflow-y-auto scrollbar-thin pr-1 md:grid-cols-2 lg:grid-cols-3">
      {player.games.map((g) => (
        <GlassCard key={g.id} className="cursor-pointer overflow-hidden p-0" onClick={() => setOpenId(g.id)}>
          <div className="relative">
            <GameCover game={g} className="rounded-none" />
            <span
              className={`chip absolute bottom-2 right-2 backdrop-blur-sm ${
                g.released
                  ? 'border-accent-green/40 bg-black/40 text-accent-green'
                  : 'border-accent-cyan/40 bg-black/40 text-accent-cyan'
              }`}
            >
              {g.released ? 'Released' : g.phase}
            </span>
          </div>
          <div className="p-4 pt-3">
          <div className="text-xs text-white/50">{g.platforms.join(', ')}</div>
          {!g.released ? (
            <div className="mt-3">
              <StatBar value={Math.round(g.progress * 100)} color="#22d3ee" label="Progress" />
              <div className="mt-1 text-xs text-white/40">Week {g.weeksSpent}/{g.devTimeWeeks}</div>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-white/40">Score</span> <span className="font-bold text-white">{g.review?.score}</span></div>
              <div><span className="text-white/40">Revenue</span> <span className="font-bold text-accent-green">{formatMoney(g.sales?.revenueToDate ?? 0)}</span></div>
              <div>
                <span className="text-white/40">Copies</span>{' '}
                <span className="font-bold text-white">{formatNumber(g.sales?.sold ?? g.sales?.launchDay ?? 0)}</span>
                {g.sales && (g.sales.sold ?? 0) < g.sales.lifetime && (
                  <span className="ml-1 text-[10px] text-accent-cyan">▲</span>
                )}
              </div>
              <div><span className="text-white/40">Profit</span> <span className="font-bold text-white">{formatMoney(g.sales?.profit ?? 0)}</span></div>
            </div>
          )}
          </div>
        </GlassCard>
      ))}

      <Modal open={!!game} onClose={() => setOpenId(null)} title={game?.name} maxWidth="max-w-2xl">
        {game && <GameDetail gameId={game.id} />}
      </Modal>
    </div>
  )
}

function GameDetail({ gameId }: { gameId: string }) {
  const { player, createGame, notify, runCampaign, patchGame, releaseDLC } = useGame()
  const g = player?.games.find((x) => x.id === gameId)
  if (!g) return null
  const bugs = g.bugs ?? 0

  function makeSequel() {
    if (!g || !g.released) return
    const name = g.name.match(/\s#?\d+$/) ? g.name.replace(/\s#?\d+$/, '') : g.name
    const seqNum = (g.name.match(/#?(\d+)$/)?.[1] ?? '1').trim()
    const nextNum = parseInt(seqNum, 10) + 1
    const seqName = `${name} ${nextNum}`
    createGame({
      name: seqName,
      genre: g.genre,
      theme: g.theme,
      platforms: g.platforms,
      tags: g.tags,
      engineId: g.engineId,
      budget: g.budget,
      marketingBudget: Math.round(g.marketingBudget * 1.2),
      devTimeWeeks: Math.max(3, g.devTimeWeeks - 1),
      publishing: g.publishing,
      isSequel: true,
      sequelOf: g.id,
      teamMemberIds: g.teamMemberIds,
    })
    notify({ title: '🎬 Sequel in production!', body: `${seqName} is now in development.`, type: 'success' })
  }
   return (
    <div className="space-y-4">
      <GameCover game={g} />
      {g.sequelOf && (() => {
        const pred = player?.games.find((x) => x.id === g.sequelOf)
        return pred ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            🎬 Sequel to <span className="font-semibold text-amber-100">{pred.name}</span>
            {pred.review && <span className="text-amber-300/80">· franchise bonus active</span>}
          </div>
        ) : null
      })()}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Genre</span><div className="font-semibold text-white">{g.genre}</div></div>
        <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Theme</span><div className="font-semibold text-white">{g.theme}</div></div>
        <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Stores</span><div className="font-semibold text-white">{g.platforms.join(', ')}</div></div>
        <div className="rounded-xl bg-white/5 p-3"><span className="text-white/40">Dev Time</span><div className="font-semibold text-white">{g.devTimeWeeks} wks</div></div>
      </div>

      {!g.released ? (
        <div className="space-y-4">
          <StatBar value={Math.round(g.progress * 100)} color="#22d3ee" label={`${g.phase} progress`} />
          <div>
            <StatBar value={Math.round(g.hype ?? 0)} color="#f472b6" label="Hype" />
            <div className="mb-2 mt-3 text-sm font-semibold text-white">📣 Marketing Campaigns</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CAMPAIGNS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => runCampaign(g.id, c.id)}
                  disabled={(player?.money ?? 0) < c.cost}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10 disabled:opacity-40"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{c.icon} {c.name}</div>
                    <div className="text-[11px] text-white/50">{c.description}</div>
                  </div>
                  <div className="ml-2 text-right">
                    <div className="text-xs font-bold text-accent-pink">+{c.hype}</div>
                    <div className="text-[11px] text-white/50">{formatMoney(c.cost)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-white/5 p-4">
            <div className="mb-2 text-lg font-bold text-white">Review: {g.review?.score}/100</div>
            <div className="mb-3 flex gap-4 text-sm text-white/60">
              <span>Critic {g.review?.criticScore}</span>
              <span>User {g.review?.userScore}</span>
            </div>
            <div className="space-y-2">
              {g.review?.comments.map((c, i) => (
                <div key={i} className="rounded-lg bg-white/5 p-2 text-sm">
                  <span className="font-semibold text-white">{c.author}</span>{' '}
                  <span className="text-accent-amber">({c.score})</span>
                  <div className="text-white/60">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
          {g.sales && (
            <>
              <div className="rounded-xl bg-white/5 p-4">
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-sm font-semibold text-white">📈 Copies Sold</span>
                  <span className="font-bold text-accent-cyan">
                    {formatNumber(g.sales.sold ?? g.sales.launchDay)}
                    <span className="text-xs text-white/40"> / {formatNumber(g.sales.lifetime)}</span>
                  </span>
                </div>
                <StatBar
                  value={Math.round(((g.sales.sold ?? g.sales.launchDay) / Math.max(1, g.sales.lifetime)) * 100)}
                  color="#22d3ee"
                />
                <div className="mt-2 text-xs text-white/50">
                  Revenue to date:{' '}
                  <span className="font-semibold text-accent-green">
                    {formatMoney(g.sales.revenueToDate ?? 0)}
                  </span>
                  {(g.sales.sold ?? 0) < g.sales.lifetime && (
                    <span className="ml-2 text-accent-cyan">still selling ▲</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <Metric label="Launch Day" value={formatNumber(g.sales.launchDay)} />
                <Metric label="Weekly" value={formatNumber(g.sales.weekly)} />
                <Metric label="Lifetime Est." value={formatNumber(g.sales.lifetime)} />
                <Metric label="Total Revenue" value={formatMoney(g.sales.revenue)} />
                <Metric label="Profit" value={formatMoney(g.sales.profit)} />
                <Metric label="Refunds" value={formatNumber(g.sales.refunds)} />
                <Metric label="Piracy" value={`${g.sales.piracyPct}%`} />
              </div>
            </>
          )}
          <div className="rounded-xl bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">🐛 Post-Launch Support</span>
              <span className={`text-sm font-bold ${bugs > 6 ? 'text-accent-red' : bugs > 0 ? 'text-accent-amber' : 'text-accent-green'}`}>
                {bugs > 0 ? `${bugs} known bugs` : 'Stable ✓'}
              </span>
            </div>
            <div className="mb-3 flex gap-4 text-xs text-white/50">
              <span>Patches: {g.patches ?? 0}</span>
              <span>DLC released: {g.dlcCount ?? 0}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => patchGame(g.id)} disabled={bugs <= 0}>
                🩹 Release Patch{bugs > 0 ? ` (${formatMoney(500 + bugs * 120)})` : ''}
              </Button>
              <Button variant="ghost" onClick={() => releaseDLC(g.id)}>
                📦 Release DLC ({formatMoney(Math.round(g.budget * 0.4) + 1000)})
              </Button>
            </div>
          </div>
          {g.isSequel && <div className="text-xs text-accent-cyan">🔗 This is a sequel — it benefits from the franchise's fanbase.</div>}
          <Button variant="ghost" onClick={makeSequel}>🎬 Make Sequel</Button>
        </>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="text-xs text-white/40">{label}</div>
      <div className="font-bold text-white">{value}</div>
    </div>
  )
}
