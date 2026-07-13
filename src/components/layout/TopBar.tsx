import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'
import { formatMoney, formatNumber, gameDate } from '../../lib/format'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import {
  isMusicEnabled,
  isSfxEnabled,
  setMusicEnabled,
  setSfxEnabled,
} from '../../lib/sound'

function SystemControls() {
  const [sfx, setSfx] = useState(isSfxEnabled())
  const [music, setMusic] = useState(isMusicEnabled())
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  const btn = 'rounded-xl bg-white/5 px-2.5 py-2 text-base hover:bg-white/10'
  return (
    <div className="hidden items-center gap-1 sm:flex">
      <button
        onClick={() => {
          const v = !sfx
          setSfx(v)
          setSfxEnabled(v)
        }}
        className={btn}
        title="Sound effects"
      >
        {sfx ? '🔊' : '🔈'}
      </button>
      <button
        onClick={() => {
          const v = !music
          setMusic(v)
          setMusicEnabled(v)
        }}
        className={`${btn} ${music ? '' : 'opacity-40'}`}
        title="Background music"
      >
        🎵
      </button>
      <button onClick={toggleFs} className={btn} title="Fullscreen">
        {fs ? '🗗' : '⛶'}
      </button>
    </div>
  )
}

function Resource({ icon, value, color }: { icon: string; value: ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5">
      <span className="text-base" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
        {icon}
      </span>
      <span className="font-mono-game text-lg font-bold leading-none" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { player, autoPlay, autoSpeed, setAutoSpeed, toggleAutoPlay, markNotificationsRead, clearNotifications } =
    useGame()
  const { user, signOut } = useAuth()
  const [notesOpen, setNotesOpen] = useState(false)
  const [remaining, setRemaining] = useState(autoSpeed)
  const notesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notesOpen) return
    const onDown = (e: MouseEvent) => {
      if (notesRef.current && !notesRef.current.contains(e.target as Node)) setNotesOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [notesOpen])

  const week = player?.week
  useEffect(() => {
    setRemaining(autoSpeed)
    if (!autoPlay) return
    const t = window.setInterval(() => {
      setRemaining((r) => (r <= 1000 ? autoSpeed : r - 1000))
    }, 1000)
    return () => window.clearInterval(t)
  }, [autoPlay, autoSpeed, week])

  if (!player) return null

  const date = gameDate(player.week)
  const fmtRemaining = (ms: number) => {
    if (ms >= 86400000) return `${Math.ceil(ms / 86400000)}d`
    if (ms >= 3600000) return `${Math.ceil(ms / 3600000)}h`
    return `${Math.ceil(ms / 1000)}s`
  }
  const speeds = [
    { ms: 120000, label: '1x' },
    { ms: 60000, label: '2x' },
    { ms: 30000, label: '4x' },
    { ms: 5000, label: '⚡' },
  ]
  const unread = player.notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-cyan-300/15 bg-ink-900/80 px-3 py-2 backdrop-blur-xl sm:px-4">
      {/* Resource HUD */}
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        <Resource icon="💰" color="#34d399" value={<AnimatedNumber value={player.money} format={formatMoney} />} />
        <Resource icon="👥" color="#f472b6" value={<AnimatedNumber value={player.fans} format={formatNumber} />} />
        <Resource
          icon="🏛️"
          color="#7c5cff"
          value={<AnimatedNumber value={player.studioValue} format={formatMoney} />}
        />
        <Resource icon="⭐" color="#fbbf24" value={player.companyRating.toFixed(1)} />
      </div>

      {/* Week clock + pause/play */}
      <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-ink-800/50 px-3 py-1.5">
        <button
          onClick={toggleAutoPlay}
          className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-sm hover:bg-white/20"
          title={autoPlay ? 'Pause' : 'Play'}
        >
          {autoPlay ? '⏸' : '▶'}
        </button>
        <div className="leading-tight">
          <div className="font-pixel text-[10px] text-accent-cyan">
            WEEK {date.weekOfMonth} · YR {date.year}
          </div>
          <div className="font-mono-game text-[11px] text-white/50">
            {date.month}
            {autoPlay && <span className="text-accent-cyan"> · {fmtRemaining(remaining)}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {autoPlay && (
          <div className="hidden items-center gap-1 rounded-xl bg-white/5 p-1 sm:flex">
            {speeds.map((s) => (
              <button
                key={s.ms}
                onClick={() => setAutoSpeed(s.ms)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  autoSpeed === s.ms ? 'bg-brand-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <button onClick={onOpenSettings} className="rounded-xl bg-white/5 px-3 py-2 text-lg hover:bg-white/10" title="Options">
          ⚙
        </button>
        <SystemControls />
        <div className="rounded-xl bg-gradient-to-r from-brand-500/20 to-accent-cyan/20 px-3 py-1.5 text-sm font-semibold text-white">
          #{player.level} {player.username}
        </div>
        <div className="relative" ref={notesRef}>
          <button
            onClick={() => {
              setNotesOpen((v) => !v)
              if (!notesOpen) markNotificationsRead()
            }}
            className="relative rounded-xl bg-white/5 px-3 py-2 text-lg hover:bg-white/10"
            title="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[11px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="game-panel absolute right-0 top-full z-[70] mt-2 max-h-[70vh] w-80 overflow-y-auto scrollbar-thin p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="hud-title text-sm font-bold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {player.notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
                      >
                        Clear all
                      </button>
                    )}
                    <button onClick={() => setNotesOpen(false)} className="text-white/50 hover:text-white">
                      ✕
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {player.notifications.length === 0 && (
                    <div className="py-8 text-center text-sm text-white/40">
                      <div className="mb-2 text-3xl">🔕</div>
                      No notifications yet.
                    </div>
                  )}
                  {player.notifications.map((n) => {
                    const accent =
                      n.type === 'success'
                        ? 'border-l-accent-green'
                        : n.type === 'warning'
                          ? 'border-l-accent-amber'
                          : n.type === 'event'
                            ? 'border-l-accent-pink'
                            : 'border-l-accent-cyan'
                    return (
                      <div
                        key={n.id}
                        className={`rounded-xl border border-white/10 border-l-4 ${accent} bg-white/5 p-3`}
                      >
                        <div className="text-sm font-semibold text-white">{n.title}</div>
                        <div className="text-xs text-white/60">{n.body}</div>
                        <div className="mt-1 text-[10px] text-white/30">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {user && (
          <button
            onClick={signOut}
            className="hidden rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white sm:block"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  )
}
