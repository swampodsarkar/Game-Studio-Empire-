import { Modal } from './ui/Modal'
import { useGame } from '../context/GameContext'
import type { UiPrefs } from '../lib/uiPrefs'

const SPEEDS = [
  { ms: 120000, label: '1x · Relaxed' },
  { ms: 60000, label: '2x' },
  { ms: 30000, label: '4x · Fast' },
  { ms: 5000, label: '⚡ Turbo' },
]

const REAL_WEEK_MS = 7 * 24 * 60 * 60 * 1000 // 1 in-game week = 7 real days

export function SettingsModal({
  open,
  onClose,
  prefs,
  setPrefs,
}: {
  open: boolean
  onClose: () => void
  prefs: UiPrefs
  setPrefs: (p: UiPrefs) => void
}) {
  const { autoSpeed, setAutoSpeed, autoPlay, toggleAutoPlay } = useGame()

  const toggle = (key: keyof UiPrefs) => setPrefs({ ...prefs, [key]: !prefs[key] })

  const setRealTime = (on: boolean) => {
    setPrefs({ ...prefs, realTime: on })
    if (on) {
      if (!autoPlay) toggleAutoPlay()
      setAutoSpeed(REAL_WEEK_MS)
    } else {
      setAutoSpeed(120000)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="⚙ Options" maxWidth="max-w-md">
      <div className="space-y-5">
        <div>
          <div className="label">Simulation Speed</div>
          <div className="grid grid-cols-2 gap-2">
            {SPEEDS.map((s) => (
              <button
                key={s.ms}
                onClick={() => setAutoSpeed(s.ms)}
                className={`btn-game px-3 py-2 text-sm ${autoSpeed === s.ms ? 'ring-2 ring-accent-cyan' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div>
            <div className="text-sm font-semibold text-white">CRT Scanlines</div>
            <div className="text-xs text-white/50">Retro monitor overlay</div>
          </div>
          <button
            onClick={() => toggle('scanlines')}
            className={`relative h-7 w-14 rounded-full transition ${prefs.scanlines ? 'bg-accent-cyan/70' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${prefs.scanlines ? 'left-8' : 'left-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div>
            <div className="text-sm font-semibold text-white">Reduced Motion</div>
            <div className="text-xs text-white/50">Calm animations (accessibility)</div>
          </div>
          <button
            onClick={() => toggle('reduceMotion')}
            className={`relative h-7 w-14 rounded-full transition ${prefs.reduceMotion ? 'bg-accent-cyan/70' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${prefs.reduceMotion ? 'left-8' : 'left-1'}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div>
            <div className="text-sm font-semibold text-white">Real-Time Mode</div>
            <div className="text-xs text-white/50">1 in-game week = 7 real days (slow, lifelike pace)</div>
          </div>
          <button
            onClick={() => setRealTime(!prefs.realTime)}
            className={`relative h-7 w-14 rounded-full transition ${prefs.realTime ? 'bg-accent-cyan/70' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${prefs.realTime ? 'left-8' : 'left-1'}`}
            />
          </button>
        </div>

        <p className="text-xs text-white/40">Sound &amp; fullscreen controls are in the top bar.</p>
      </div>
    </Modal>
  )
}
