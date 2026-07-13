import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { formatMoney, formatNumber } from '../lib/format'
import { Modal } from '../components/ui/Modal'

interface TitleScreenProps {
  onStart: () => void
  onNewGame: () => void
  onOpenHelp: () => void
  onOpenSettings: () => void
}

export function TitleScreen({ onStart, onNewGame, onOpenHelp, onOpenSettings }: TitleScreenProps) {
  const { player } = useGame()
  const [confirmNew, setConfirmNew] = useState(false)

  const menu: { label: string; sub?: string; onClick: () => void; danger?: boolean }[] = player
    ? [
        { label: '▶ Continue', sub: 'Resume your studio', onClick: onStart },
        { label: '✦ New Game', sub: 'Start a fresh studio', onClick: () => setConfirmNew(true), danger: true },
        { label: '？ How To Play', sub: 'Learn the ropes', onClick: onOpenHelp },
        { label: '⚙ Options', sub: 'Settings', onClick: onOpenSettings },
      ]
    : [
        { label: '▶ New Game', sub: 'Start your studio', onClick: onStart },
        { label: '？ How To Play', sub: 'Learn the ropes', onClick: onOpenHelp },
        { label: '⚙ Options', sub: 'Settings', onClick: onOpenSettings },
      ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Floating decorative 2D sprites */}
      <div className="pointer-events-none absolute inset-0">
        {['🎮', '🕹️', '👾', '🎲', '🏆', '💾', '🪙', '🚀'].map((e, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] md:text-5xl"
            style={{ left: `${8 + i * 11}%`, top: `${12 + ((i * 37) % 70)}%` }}
            animate={{ y: [0, -22, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="emblem mb-5 h-24 w-24 text-5xl animate-pulse-glow md:h-32 md:w-32 md:text-7xl"
      >
        🎮
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-pixel neon-text text-center text-[26px] leading-relaxed text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] sm:text-4xl md:text-5xl"
      >
        GAME STUDIO
        <br />
        EMPIRE
      </motion.h1>
      <p className="font-mono-game mt-3 text-lg uppercase tracking-widest text-accent-cyan/80">
        Build · Ship · Dominate
      </p>

      {/* Launcher menu */}
      <div className="mt-9 w-full max-w-sm space-y-2.5">
        {menu.map((m, i) => (
          <motion.button
            key={m.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.98 }}
            onClick={m.onClick}
            className="group flex w-full items-center justify-between rounded-xl border border-cyan-300/20 bg-ink-800/50 px-5 py-3 text-left backdrop-blur-xl transition hover:border-accent-cyan/50 hover:bg-ink-800/80 hover:shadow-[0_0_24px_-8px_rgba(34,211,238,0.7)]"
          >
            <span className={`font-pixel text-xs ${m.danger ? 'text-accent-pink' : 'text-white'}`}>{m.label}</span>
            <span className="font-mono-game text-base text-white/40">{m.sub}</span>
          </motion.button>
        ))}
      </div>

      {/* Save card */}
      {player && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono-game text-base text-white/80"
        >
          <span className="hud-panel px-4 py-2">{player.avatar} {player.username}</span>
          <span className="hud-panel px-4 py-2">$ {formatMoney(player.money)}</span>
          <span className="hud-panel px-4 py-2">{formatNumber(player.fans)} FANS</span>
          <span className="hud-panel px-4 py-2">WEEK {player.week}</span>
        </motion.div>
      )}

      <div className="font-pixel absolute bottom-5 text-[8px] uppercase tracking-widest text-white/30">
        v1.0 · A PC Game Studio Tycoon
      </div>

      <Modal open={confirmNew} onClose={() => setConfirmNew(false)} title="New Game?" maxWidth="max-w-sm">
        <p className="text-sm text-white/70">Starting a new studio will erase your current progress. Continue?</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setConfirmNew(false)} className="btn-game px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirmNew(false)
              onNewGame()
            }}
            className="btn-game px-4 py-2 text-sm !border-accent-pink/60"
          >
            Yes, restart
          </button>
        </div>
      </Modal>
    </div>
  )
}
