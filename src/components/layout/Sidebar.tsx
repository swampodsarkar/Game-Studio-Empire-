import { motion } from 'framer-motion'
import { Icon, type IconName } from '../ui/Icon'

export type ScreenId =
  | 'dashboard'
  | 'games'
  | 'studio'
  | 'research'
  | 'market'
  | 'analytics'
  | 'economy'
  | 'awards'
  | 'missions'
  | 'achievements'
  | 'leaderboard'
  | 'profile'
  | 'admin'

const NAV: { id: ScreenId; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'games', label: 'Game Dev', icon: 'games' },
  { id: 'studio', label: 'Studio', icon: 'studio' },
  { id: 'research', label: 'Research', icon: 'research' },
  { id: 'market', label: 'Market', icon: 'market' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'economy', label: 'Economy', icon: 'economy' },
  { id: 'awards', label: 'Awards', icon: 'awards' },
  { id: 'missions', label: 'Missions', icon: 'missions' },
  { id: 'achievements', label: 'Achievements', icon: 'achievements' },
  { id: 'leaderboard', label: 'Rankings', icon: 'leaderboard' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
]

export function Sidebar({
  active,
  onNavigate,
  isAdmin,
}: {
  active: ScreenId
  onNavigate: (s: ScreenId) => void
  isAdmin: boolean
}) {
  const items = isAdmin ? [...NAV, { id: 'admin' as ScreenId, label: 'Admin', icon: 'admin' as IconName }] : NAV
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-cyan-300/10 bg-ink-800/40 p-3 backdrop-blur-xl md:flex">
      <div className="mb-4 flex items-center gap-2 px-2 py-3">
        <div className="emblem h-9 w-9 text-base animate-pulse-glow">🎲</div>
        <div className="hud-title text-[13px] font-extrabold leading-tight text-white">
          Game Studio
          <br />
          <span className="neon-text bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">
            Empire
          </span>
        </div>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-hud text-sm font-semibold uppercase tracking-wide transition ${
            active === item.id
              ? 'border border-cyan-300/20 bg-cyan-300/10 text-white shadow-neon'
              : 'border border-transparent text-white/55 hover:bg-white/5 hover:text-white'
          }`}
        >
          {active === item.id && (
            <motion.div
              layoutId="nav-active"
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-accent-cyan"
            />
          )}
          <Icon name={item.icon} size={18} className="shrink-0" />
          {item.label}
        </button>
      ))}
      <div className="mt-auto px-2 py-3 text-[11px] text-white/30">v1.0 · Solo Empire Sim</div>
    </aside>
  )
}

export function MobileNav({
  active,
  onNavigate,
  isAdmin,
}: {
  active: ScreenId
  onNavigate: (s: ScreenId) => void
  isAdmin: boolean
}) {
  const items = isAdmin ? [...NAV, { id: 'admin' as ScreenId, label: 'Admin', icon: 'admin' as IconName }] : NAV
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto border-t border-white/10 bg-ink-800/90 backdrop-blur-xl md:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex min-w-[64px] flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
            active === item.id ? 'text-brand-400' : 'text-white/50'
          }`}
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </button>
      ))}
    </nav>
  )
}
