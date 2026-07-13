import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Brief publisher-style intro shown once at launch, before the main menu.
export function StudioSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 10000)
    return () => window.clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 22, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
        transition={{ delay: 0.25, duration: 1 }}
        className="font-pixel neon-text text-3xl text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.85)] sm:text-5xl"
      >
        SM STUDIO
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.9 }}
        className="mt-4 font-mono-game text-base uppercase tracking-[0.45em] text-accent-cyan/80 sm:text-xl"
      >
        Presents
      </motion.div>
    </motion.div>
  )
}
