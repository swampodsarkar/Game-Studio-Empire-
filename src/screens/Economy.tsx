import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { LineChart } from '../components/charts/Charts'
import { formatMoney } from '../lib/format'
import { marketMood, STOCK_SECTORS } from '../lib/stocks'

export function Economy() {
  const { player, takeLoan, repayLoan, market } = useGame()
  const [loanAmt, setLoanAmt] = useState(5000)
  if (!player) return null

  const mood = marketMood(market.stocks)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <h3 className="mb-3 text-lg font-bold text-white">🏦 Bank & Loans</h3>
          <div className="mb-1 text-sm text-white/60">Outstanding loan</div>
          <div className="mb-4 text-2xl font-bold text-accent-red">{formatMoney(player.loanBalance)}</div>
          <label className="label">Borrow amount</label>
          <input
            type="number"
            className="input mb-3"
            value={loanAmt}
            min={0}
            step={500}
            onChange={(e) => setLoanAmt(+e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => takeLoan(loanAmt)}>Borrow</Button>
            <Button size="sm" variant="ghost" onClick={() => repayLoan(Math.min(loanAmt, player.loanBalance))}>
              Repay {formatMoney(Math.min(loanAmt, player.loanBalance))}
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Loans accrue 0.3% interest weekly. Use them to fund big productions, but don't drown in debt!
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-lg font-bold text-white">💼 Your Portfolio</h3>
          {Object.keys(player.stocks).length === 0 ? (
            <p className="text-sm text-white/40">No shares yet. Buy below to invest.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(player.stocks).map(([sym, h]) => {
                const stock = market.stocks.find((s) => s.symbol === sym)
                const value = h.shares * (stock?.price ?? h.avgPrice)
                return (
                  <div key={sym} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <div>
                      <div className="font-semibold text-white">{sym}</div>
                      <div className="text-xs text-white/50">{h.shares} shares @ {formatMoney(h.avgPrice)}</div>
                    </div>
                    <div className="text-right font-bold text-accent-green">{formatMoney(value)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>

        <GlassCard>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white">📈 Stock Market</h3>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                color: mood.pct >= 0 ? '#34d399' : '#f87171',
                background: mood.pct >= 0 ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
              }}
            >
              Market: {mood.label} {mood.pct >= 0 ? '▲' : '▼'} {Math.abs(mood.pct).toFixed(1)}%
            </span>
          </div>
          <p className="mb-4 text-sm text-white/50">
            Trade shares of fictional game-industry companies. Prices follow earnings momentum, a broad market cycle and
            mean-revert to each firm's fair value.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {market.stocks.map((s) => (
              <StockRow key={s.symbol} symbol={s.symbol} name={s.name} price={s.price} history={s.history} />
            ))}
          </div>
        </GlassCard>
    </div>
  )
}

function StockRow({ symbol, name, price, history }: { symbol: string; name: string; price: number; history: number[] }) {
  const { player, buyStock, sellStock } = useGame()
  const [shares, setShares] = useState(10)
  const held = player?.stocks[symbol]
  const prev = history.length > 1 ? history[history.length - 2] : price
  const change = price - prev
  const pct = prev ? (change / prev) * 100 : 0
  const color = change >= 0 ? '#34d399' : '#f87171'

  const chartData = {
    labels: history.map((_, i) => `${i}`),
    datasets: [{ data: history, borderColor: color, backgroundColor: 'transparent', borderWidth: 2, pointRadius: 0, tension: 0.3 }],
  }

  return (
    <GlassCard>
      <div className="mb-1 flex items-center justify-between">
        <div className="font-bold text-white">{symbol}</div>
        <div className="text-sm font-semibold" style={{ color }}>
          {change >= 0 ? '▲' : '▼'} {pct.toFixed(1)}%
        </div>
      </div>
      <div className="mb-2 text-xs text-white/50">{name} · {STOCK_SECTORS[symbol]}</div>
      <LineChart data={chartData} height={90} />
      <div className="my-2 text-lg font-bold text-white">{formatMoney(price)}</div>
      {held && <div className="mb-2 text-[11px] text-accent-green">You own {held.shares}</div>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="input w-20 py-1"
          value={shares}
          min={1}
          onChange={(e) => setShares(Math.max(1, +e.target.value))}
        />
        <Button size="sm" onClick={() => buyStock(symbol, shares)}>Buy</Button>
        <Button size="sm" variant="ghost" onClick={() => sellStock(symbol, shares)}>Sell</Button>
      </div>
    </GlassCard>
  )
}
