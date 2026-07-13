import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  children?: ReactNode
}

export function Tabs({ tabs, active, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active === t.id
                ? 'bg-brand-500 text-white shadow-glow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t.icon && <span>{t.icon}</span>}
            {t.label}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}

export function useTabState(initial: string) {
  const [tab, setTab] = useState(initial)
  return [tab, setTab] as const
}
