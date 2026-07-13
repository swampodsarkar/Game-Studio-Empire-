interface StatBarProps {
  value: number
  max?: number
  color?: string
  label?: string
  showValue?: boolean
}

export function StatBar({ value, max = 100, color = '#7c5cff', label, showValue = true }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-white/60">{label}</span>
          {showValue && <span className="font-semibold text-white/90">{Math.round(value)}</span>}
        </div>
      )}
      <div className="game-meter" style={{ color }}>
        <div
          className="game-meter-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
