import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

export function AuthScreen() {
  const { signIn, signUp, signInAnon } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setErr('')
    setBusy(true)
    try {
      if (mode === 'signin') await signIn(email, password)
      else await signUp(email, password)
    } catch (e: any) {
      setErr(e?.message ?? 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard glow className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan text-3xl shadow-glow">
            🎲
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Game Studio Empire</h1>
          <p className="text-sm text-white/50">Build a gaming empire from your bedroom.</p>
        </div>

        <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
                mode === m ? 'bg-brand-500 text-white' : 'text-white/60'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <input className="input mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <div className="mb-3 rounded-lg bg-accent-red/20 p-2 text-sm text-accent-red">{err}</div>}
        <Button className="w-full" onClick={submit} disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
        <div className="my-3 text-center text-xs text-white/30">or</div>
        <Button variant="ghost" className="w-full" onClick={signInAnon}>
          Continue as Guest
        </Button>
      </GlassCard>
    </div>
  )
}
