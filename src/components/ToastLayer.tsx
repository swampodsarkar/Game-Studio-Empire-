import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useToasts, type ToastType } from '../lib/toast'

const STYLE: Record<ToastType, { border: string; icon: string; glow: string }> = {
  success: { border: 'border-l-accent-green', icon: '🏆', glow: 'shadow-[0_0_24px_-8px_rgba(52,211,153,0.7)]' },
  warning: { border: 'border-l-accent-amber', icon: '⚠️', glow: 'shadow-[0_0_24px_-8px_rgba(251,191,36,0.7)]' },
  info: { border: 'border-l-accent-cyan', icon: '💡', glow: 'shadow-[0_0_24px_-8px_rgba(34,211,238,0.7)]' },
  event: { border: 'border-l-accent-pink', icon: '🎲', glow: 'shadow-[0_0_24px_-8px_rgba(244,114,182,0.7)]' },
}

// Transient, game-style toasts (top-center). The persistent notification
// dropdown in the top bar is kept; this is the juicy "pop" layer.
export function ToastLayer() {
  const { toasts, dismiss } = useToasts()

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((t) => window.setTimeout(() => dismiss(t.id), 3600))
    return () => timers.forEach(clearTimeout)
  }, [toasts, dismiss])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const s = STYLE[t.type]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              onClick={() => dismiss(t.id)}
              className={`game-panel pointer-events-auto flex w-full max-w-sm items-start gap-3 border-l-4 ${s.border} ${s.glow} cursor-pointer p-3`}
            >
              <span className="text-xl">{s.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white">{t.title}</div>
                {t.body && <div className="text-xs text-white/70">{t.body}</div>}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
