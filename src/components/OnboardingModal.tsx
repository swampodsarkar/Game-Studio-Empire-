import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    icon: '🎮',
    title: 'Welcome, Studio Head!',
    body: 'You run an indie game studio. Your mission: make hit games, earn money, grow your fanbase, and climb the global leaderboard.',
    tip: 'Time auto-advances in the top bar. Use speed buttons (1x-⚡) to fast-forward.',
  },
  {
    icon: '➕',
    title: 'Step 1 — Create a Game',
    body: 'Go to the Game Dev tab and start your first project. Pick a genre & theme that match for a quality bonus. Budget wisely — you have $5,000.',
    tip: 'The orange bar shows the recommended budget. Spending below it hurts quality.',
  },
  {
    icon: '🧑‍💻',
    title: 'Step 2 — Assign Your Team',
    body: 'Put your Producer on the project. Hire Programmers, Artists, and Designers from the Studio tab — bigger teams make better games.',
    tip: 'Each hire costs 1 week of their salary upfront. Keep morale up with raises & time off.',
  },
  {
    icon: '📣',
    title: 'Step 3 — Build Hype',
    body: 'Before launch, run marketing campaigns in the game detail panel. More hype means bigger launch sales.',
    tip: 'Social Media ($1,200) is the cheapest. Expo ($12,000) is the strongest.',
  },
  {
    icon: '🚀',
    title: 'Step 4 — Release & Grow',
    body: 'Your game ships automatically when development finishes. Watch reviews, patch bugs, release DLC, and start the next hit!',
    tip: 'Sequel to a hit game gets a franchise bonus. Research tech and upgrade your studio between releases.',
  },
]

export function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const s = STEPS[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="mx-4 w-full max-w-lg rounded-2xl border border-cyan-300/20 bg-ink-800 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition ${
                i === step ? 'bg-accent-cyan' : i < step ? 'bg-accent-green' : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 text-center">
              <span className="inline-block text-5xl">{s.icon}</span>
              <h2 className="mt-3 font-pixel text-lg text-white">{s.title}</h2>
            </div>

            <p className="text-sm leading-relaxed text-white/80">{s.body}</p>

            <div className="mt-4 rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 p-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-cyan">Tip</span>
              <p className="mt-0.5 text-sm text-white/70">{s.tip}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onDone}
            className="text-sm text-white/40 hover:text-white/70 transition"
          >
            Skip tutorial
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < STEPS.length - 1) setStep((s) => s + 1)
                else onDone()
              }}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-accent-cyan px-5 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 transition"
            >
              {step < STEPS.length - 1 ? 'Next →' : '🚀 Start Playing!'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
