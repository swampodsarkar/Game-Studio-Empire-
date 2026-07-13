import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { burst } from '../lib/juice'
import { initAudio, playClick, playCoin, playLevelUp, playSuccess } from '../lib/sound'
import { emitToast } from '../lib/toast'

// Watches player state and fires sounds + confetti on notable moments, and
// wires a subtle click sound to every button in the app.
export function JuiceLayer() {
  const { player } = useGame()
  const prev = useRef<{ level: number; money: number; released: number; awardsWon: number } | null>(null)
  const prevEvent = useRef<{ id: string } | null>(null)
  const lastCoin = useRef(0)

  // Global click sound + audio unlock on first gesture.
  useEffect(() => {
    const onPointer = () => initAudio()
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('button, a, [role="button"]')
      if (el) playClick()
    }
    window.addEventListener('pointerdown', onPointer, { once: false })
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    if (!player) return
    const released = player.games.filter((g) => g.released).length
    const awardsWon = player.awards.filter((a) => a.won).length
    const snap = { level: player.level, money: player.money, released, awardsWon }

    if (!prev.current) {
      prev.current = snap
      return
    }
    const p = prev.current

    if (snap.level > p.level) {
      burst('confetti', window.innerWidth / 2, window.innerHeight / 3)
      playLevelUp()
      emitToast({ title: `Level ${snap.level}!`, body: 'Your studio is growing.', type: 'success' })
    }
    if (snap.released > p.released) {
      burst('confetti', window.innerWidth / 2, window.innerHeight / 2.5)
      playSuccess()
      emitToast({ title: '🚀 Game Shipped!', body: 'A new title hit the market.', type: 'success' })
    }
    if (snap.awardsWon > p.awardsWon) {
      burst('stars', window.innerWidth / 2, window.innerHeight / 3)
      playSuccess()
      emitToast({ title: '🏆 Award Won!', type: 'success' })
    }
    if (snap.money - p.money > 100) {
      const now = Date.now()
      if (now - lastCoin.current > 1500) {
        lastCoin.current = now
        burst('coin', window.innerWidth - 120, 70, '💰')
        playCoin()
      }
    }

    // Crisis / decision event popped up — toast it (modal handles the choice).
    if (player.pendingEvent && !prevEvent.current) {
      emitToast({ title: player.pendingEvent.title, body: 'A decision is waiting for you.', type: 'event' })
    }
    prevEvent.current = player.pendingEvent ?? null

    prev.current = snap
  }, [player])

  return null
}
