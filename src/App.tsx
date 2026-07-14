import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './context/AuthContext'
import { GameProvider } from './context/GameProvider'
import { useGame } from './context/GameContext'
import { Sidebar, MobileNav, type ScreenId } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { Dashboard } from './screens/Dashboard'
import { GameDev } from './screens/GameDev'
import { Studio } from './screens/Studio'
import { Research } from './screens/Research'
import { Market } from './screens/Market'
import { Analytics } from './screens/Analytics'
import { Economy } from './screens/Economy'
import { Awards } from './screens/Awards'
import { Season } from './screens/Season'
import { Missions } from './screens/Missions'
import { Profile } from './screens/Profile'
import { Achievements } from './screens/Achievements'
import { Leaderboard } from './screens/Leaderboard'
import { Admin } from './screens/Admin'
import { AuthScreen } from './screens/AuthScreen'
import { SetupScreen } from './screens/SetupScreen'
import { TitleScreen } from './screens/TitleScreen'
import { WeeklyReportModal } from './components/WeeklyReportModal'
import { EventModal } from './components/EventModal'
import { SettingsModal } from './components/SettingsModal'
import { HowToPlayModal } from './components/HowToPlayModal'
import { OnboardingModal } from './components/OnboardingModal'
import { ToastLayer } from './components/ToastLayer'
import { StudioSplash } from './components/StudioSplash'
import { loadPrefs, applyPrefs, type UiPrefs } from './lib/uiPrefs'
import { AnimatedBackground } from './components/AnimatedBackground'
import { Confetti } from './components/Confetti'
import { JuiceLayer } from './components/JuiceLayer'
import { GameFrame } from './components/GameFrame'
import { isFirebaseConfigured } from './firebase/config'

const BOOT_LINES = [
  'INITIALIZING STUDIO CORE',
  'LOADING ASSETS',
  'SYNCING MARKET DATA',
  'CALIBRATING ENGINE',
  'WELCOME, STUDIO HEAD',
]

function Splash() {
  const [pct, setPct] = useState(0)
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t1 = window.setInterval(() => setPct((p) => Math.min(99, p + Math.random() * 14 + 5)), 200)
    const t2 = window.setInterval(() => setLine((l) => (l + 1) % BOOT_LINES.length), 650)
    return () => {
      window.clearInterval(t1)
      window.clearInterval(t2)
    }
  }, [])
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="emblem mb-6 h-24 w-24 animate-pulse-glow text-5xl md:h-32 md:w-32 md:text-7xl"
      >
        🎮
      </motion.div>
      <h1 className="font-pixel neon-text text-[26px] leading-relaxed text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] sm:text-4xl md:text-5xl">
        GAME STUDIO
        <br />
        EMPIRE
      </h1>
      <div className="boot-bar mt-10">
        <div className="boot-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="font-mono-game mt-3 text-lg text-accent-cyan/90">{pct}% LOADED</div>
      <div className="font-mono-game mt-2 h-5 text-base uppercase tracking-widest text-white/50">
        {BOOT_LINES[line]}
      </div>
    </div>
  )
}

const ONBOARD_KEY = 'gse_onboarded'

function GameRoot() {
  const { player, loading, claimLoginReward, resetGame, setAutoSpeed } = useGame()
  const [screen, setScreen] = useState<ScreenId>('dashboard')
  const [started, setStarted] = useState(false)
  const [prefs, setPrefs] = useState<UiPrefs>(loadPrefs)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) !== '1' } catch { return true }
  })
  const { user } = useAuth()
  const isAdmin = !!user?.isAdmin

  useEffect(() => {
    if (player && player._lastClaimDay !== new Date().toDateString()) {
      claimLoginReward()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.uid])

  useEffect(() => {
    applyPrefs(prefs)
  }, [prefs])

  // Real-Time mode: 1 in-game week = 7 real days.
  useEffect(() => {
    if (prefs.realTime) setAutoSpeed(7 * 24 * 60 * 60 * 1000)
  }, [prefs.realTime, setAutoSpeed])

  // Week-transition banner + screen shake for game-like "time advancing" juice.
  const [weekFlash, setWeekFlash] = useState<number | null>(null)
  const [shaking, setShaking] = useState(false)
  const prevWeek = useRef(player?.week ?? 0)
  useEffect(() => {
    if (!player) return
    if (player.week !== prevWeek.current) {
      prevWeek.current = player.week
      setWeekFlash(player.week)
      setShaking(true)
      const t1 = window.setTimeout(() => setWeekFlash(null), 1500)
      const t2 = window.setTimeout(() => setShaking(false), 480)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }
  }, [player?.week])

  if (loading) return <Splash />
  if (!player) return <SetupScreen onDone={() => setStarted(true)} />
  if (!started)
    return (
      <>
        <TitleScreen
          onStart={() => setStarted(true)}
          onNewGame={() => {
            resetGame()
            setStarted(true)
          }}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} prefs={prefs} setPrefs={setPrefs} />
      </>
    )

  const screens: Record<ScreenId, ReactNode> = {
    dashboard: <Dashboard />,
    games: <GameDev />,
    studio: <Studio />,
    research: <Research />,
    market: <Market />,
    analytics: <Analytics />,
    economy: <Economy />,
    awards: <Awards />,
    season: <Season />,
    missions: <Missions />,
    profile: <Profile />,
    achievements: <Achievements />,
    leaderboard: <Leaderboard />,
    admin: <Admin />,
  }

  return (
    <div className={`flex h-screen overflow-hidden ${shaking ? 'animate-shake' : ''}`}>
      <JuiceLayer />
      <ToastLayer />
      {weekFlash !== null && (
        <div className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center">
          <div key={weekFlash} className="week-flash font-pixel text-center text-white">
            <div className="text-sm text-accent-cyan">TIME ADVANCES</div>
            <div className="text-5xl text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] md:text-7xl">
              WEEK {weekFlash}
            </div>
          </div>
        </div>
      )}
      <Sidebar active={screen} onNavigate={setScreen} isAdmin={isAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenSettings={() => setSettingsOpen(true)} onOpenHelp={() => setHelpOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto max-w-6xl"
            >
              {screens[screen]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav active={screen} onNavigate={setScreen} isAdmin={isAdmin} />
      {showOnboarding && (
        <OnboardingModal
          onDone={() => {
            setShowOnboarding(false)
            try { localStorage.setItem(ONBOARD_KEY, '1') } catch {}
          }}
        />
      )}
      <WeeklyReportModal />
      <EventModal />
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} prefs={prefs} setPrefs={setPrefs} />
    </div>
  )
}

function Root({ studioDone, ready }: { studioDone: boolean; ready: boolean }) {
  const { user, loading } = useAuth()
  // Hold the whole app until the studio intro has played, so the splash
  // screen shows first, then the loading screen (kept visible for a minimum
  // beat), then the main menu.
  if (!studioDone) return null
  if (loading || !ready) return <Splash />
  if (!user) {
    if (isFirebaseConfigured) return <AuthScreen />
    // Offline mode: create a local anonymous user immediately via AuthProvider effect.
    return <Splash />
  }
  return (
    <GameProvider>
      <GameRoot />
    </GameProvider>
  )
}

export default function App() {
  const [showStudio, setShowStudio] = useState(true)
  const [studioDone, setStudioDone] = useState(false)
  const [ready, setReady] = useState(false)

  // After the studio intro, keep the loading screen up for a clear ~1.2s beat
  // (with its progress bar) before revealing the main menu.
  useEffect(() => {
    if (!studioDone) return
    const t = window.setTimeout(() => setReady(true), 15000)
    return () => window.clearTimeout(t)
  }, [studioDone])

  return (
    <AuthProvider>
      <AnimatedBackground />
      <GameFrame />
      <Confetti />
      <Root studioDone={studioDone} ready={ready} />
      <AnimatePresence>
        {showStudio && (
          <StudioSplash
            onDone={() => {
              setShowStudio(false)
              setStudioDone(true)
            }}
          />
        )}
      </AnimatePresence>
    </AuthProvider>
  )
}
