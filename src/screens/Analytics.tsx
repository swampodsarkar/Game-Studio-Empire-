import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { LineChart, BarChart, DoughnutChart } from '../components/charts/Charts'
import { formatMoney, formatNumber } from '../lib/format'
import { GENRES } from '../config/gameConfig'

export function Analytics() {
  const { player } = useGame()
  if (!player) return null

  const h = player.history
  const labels = h.weeks.map((w) => `W${w}`)

  const revenueData = {
    labels,
    datasets: [
      {
        label: 'Studio Value',
        data: h.studioValue,
        borderColor: '#7c5cff',
        backgroundColor: 'rgba(124,92,255,0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  }

  const fansData = {
    labels,
    datasets: [
      {
        label: 'Fans',
        data: h.fans,
        borderColor: '#f472b6',
        backgroundColor: 'rgba(244,114,182,0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  }

  const released = player.games.filter((g) => g.released && g.sales)
  const topGames = [...released].sort((a, b) => (b.sales!.revenue) - (a.sales!.revenue)).slice(0, 8)
  const gameBar = {
    labels: topGames.map((g) => g.name),
    datasets: [
      {
        label: 'Revenue',
        data: topGames.map((g) => g.sales!.revenue),
        backgroundColor: '#22d3ee',
        borderRadius: 6,
      },
    ],
  }

  // Revenue by genre doughnut.
  const byGenre: Record<string, number> = {}
  for (const g of released) {
    byGenre[g.genre] = (byGenre[g.genre] ?? 0) + g.sales!.revenue
  }
  const genreColors = GENRES.map((_, i) => `hsl(${(i * 360) / GENRES.length},70%,60%)`)
  const genreData = {
    labels: Object.keys(byGenre),
    datasets: [
      {
        data: Object.values(byGenre),
        backgroundColor: Object.keys(byGenre).map((g) => genreColors[GENRES.indexOf(g as any)]),
        borderColor: 'rgba(0,0,0,0.3)',
      },
    ],
  }

  const totalRevenue = released.reduce((s, g) => s + (g.sales!.revenue), 0)
  const totalUnits = released.reduce((s, g) => s + (g.sales!.lifetime), 0)
  const avgScore = released.length
    ? Math.round(released.reduce((s, g) => s + (g.review!.score), 0) / released.length)
    : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <GlassCard><div className="text-xs text-white/50">Total Revenue</div><div className="text-xl font-bold text-accent-green">{formatMoney(totalRevenue)}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Total Units</div><div className="text-xl font-bold text-white">{formatNumber(totalUnits)}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Avg Score</div><div className="text-xl font-bold text-accent-amber">{avgScore}</div></GlassCard>
        <GlassCard><div className="text-xs text-white/50">Games Shipped</div><div className="text-xl font-bold text-white">{released.length}</div></GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Studio Value Growth</h3>
          <LineChart data={revenueData} />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Fan Growth</h3>
          <LineChart data={fansData} />
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Top Games by Revenue</h3>
          <BarChart data={gameBar} />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">Revenue by Genre</h3>
          {Object.keys(byGenre).length === 0 ? (
            <p className="text-sm text-white/40">Release games to populate this chart.</p>
          ) : (
            <DoughnutChart data={genreData} />
          )}
        </GlassCard>
      </div>
    </div>
  )
}
