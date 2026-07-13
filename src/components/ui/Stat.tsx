import type { ReactNode } from 'react'

interface StatProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  accent?: string
  hint?: string
}

export function Stat({ label, value, icon, accent = '#7c5cff', hint }: StatProps) {
  return (
    <div className="game-panel flex items-center gap-3 p-4">
      {icon && (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}22`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}33` }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-xs uppercase tracking-wider text-white/50">{label}</div>
        <div className="truncate text-lg font-bold text-white">{value}</div>
        {hint && <div className="truncate text-[11px] text-white/40">{hint}</div>}
      </div>
    </div>
  )
}
