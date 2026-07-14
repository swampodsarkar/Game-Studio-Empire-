import { useGame } from '../context/GameContext'
import { Modal } from './ui/Modal'
import { formatMoney, formatNumber } from '../lib/format'

export function WeeklyReportModal() {
  const { weeklyReport, dismissWeeklyReport } = useGame()
  const r = weeklyReport
  const open = !!r

  return (
    <Modal
      open={open}
      onClose={dismissWeeklyReport}
      title={r ? `📅 Weekly Report — Weeks ${r.fromWeek}–${r.toWeek}` : ''}
    >
      {r && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-white/40">Net Cash</div>
              <div className={`font-bold ${r.moneyDelta >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {r.moneyDelta >= 0 ? '+' : '−'}
                {formatMoney(Math.abs(r.moneyDelta))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-white/40">Fans</div>
              <div className={`font-bold ${r.fansDelta >= 0 ? 'text-accent-pink' : 'text-accent-red'}`}>
                {r.fansDelta >= 0 ? '+' : '−'}
                {formatNumber(Math.abs(r.fansDelta))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-white/40">XP</div>
              <div className="font-bold text-accent-cyan">+{formatNumber(r.xpDelta)}</div>
            </div>
          </div>

          {r.releases.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-white">🎮 Releases</h3>
              <div className="space-y-2">
                {r.releases.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm text-white">{g.name}</span>
                    <span
                      className={`text-sm font-bold ${
                        g.score >= 80 ? 'text-accent-green' : g.score >= 60 ? 'text-accent-amber' : 'text-white/60'
                      }`}
                    >
                      {g.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-bold text-white">📰 Highlights</h3>
            {r.notes.length === 0 ? (
              <p className="text-sm text-white/40">A quiet stretch — nothing major happened.</p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin pr-1">
                {r.notes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-semibold text-white">{n.title}</div>
                    <div className="text-xs text-white/60">{n.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
