import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { sendGlobalNotification } from '../repository'

export function Admin() {
  const { player } = useGame()
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  if (!user?.isAdmin) {
    return (
      <GlassCard>
        <h3 className="text-lg font-bold text-white">Admin Panel</h3>
        <p className="mt-2 text-sm text-white/50">
          Admin access required. Add your Firebase UID to <code>VITE_ADMIN_UIDS</code> to gain access.
        </p>
      </GlassCard>
    )
  }
  if (!player) return null

  async function send() {
    await sendGlobalNotification({ title, body, type: 'event' })
    setSent(true)
    setTitle('')
    setBody('')
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="space-y-4">
      <GlassCard glow>
        <h3 className="text-lg font-bold text-white">🛡️ Admin Panel</h3>
        <p className="text-sm text-white/50">Manage the global game ecosystem.</p>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-3">
        <GlassCard>
          <div className="text-sm text-white/50">Total Players (local)</div>
          <div className="text-2xl font-bold text-white">1</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-white/50">AI Competitors</div>
          <div className="text-2xl font-bold text-white">{200}+</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-white/50">Current Season</div>
          <div className="text-2xl font-bold text-white">Season 1</div>
        </GlassCard>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <GlassCard>
          <h4 className="mb-2 font-semibold text-white">Notifications</h4>
          <p className="mb-3 text-xs text-white/50">Broadcast an event to all players.</p>
          <Button size="sm" onClick={() => setNotifOpen(true)}>📢 Send Notification</Button>
        </GlassCard>
        <GlassCard>
          <h4 className="mb-2 font-semibold text-white">Events</h4>
          <p className="mb-3 text-xs text-white/50">Game Expo, Dev Conf, Awards — auto-trigger during play.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="chip">🎪 Game Expo</span>
            <span className="chip">🎤 Dev Conference</span>
            <span className="chip">🏆 Awards</span>
            <span className="chip">⚙️ Tech Summit</span>
          </div>
        </GlassCard>
      </div>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Broadcast Notification">
        <label className="label">Title</label>
        <input className="input mb-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Special Event!" />
        <label className="label">Body</label>
        <textarea className="input mb-3" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details..." />
        <Button onClick={send} disabled={!title || !body}>Send</Button>
        {sent && <span className="ml-3 text-sm text-accent-green">Sent ✓</span>}
      </Modal>
    </div>
  )
}
