import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { AVATARS, COUNTRIES, DIFFICULTY } from '../config/gameConfig'
import type { Difficulty } from '../types'

export function SetupScreen({ onDone }: { onDone?: () => void }) {
  const { setupProfile } = useGame()
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [country, setCountry] = useState(COUNTRIES[0])
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard glow className="w-full max-w-lg">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan text-3xl shadow-glow">
            {avatar}
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Found Your Studio</h1>
          <p className="text-sm text-white/50">You start with $5,000, one PC and one developer.</p>
        </div>

        <label className="label">Studio / Username</label>
        <input className="input mb-4" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="PixelForge" />

        <label className="label">Avatar</label>
        <div className="mb-4 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition ${
                avatar === a ? 'bg-brand-500/30 ring-2 ring-brand-400' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="label">Country</label>
        <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c} className="bg-ink-800">{c}</option>
          ))}
        </select>

        <label className="label mt-4">Difficulty</label>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {(Object.entries(DIFFICULTY) as [Difficulty, typeof DIFFICULTY[string]][]).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDifficulty(key)}
              className={`rounded-xl border p-3 text-left transition ${
                difficulty === key ? 'border-brand-400 bg-brand-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-semibold text-white">{cfg.label}</div>
              <div className="mt-1 text-[10px] text-white/50">{cfg.desc}</div>
            </button>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={username.trim().length < 2}
          onClick={() => { setupProfile(username.trim(), avatar, country, difficulty); onDone?.() }}
        >
          🚀 Start Empire
        </Button>
      </GlassCard>
    </div>
  )
}
