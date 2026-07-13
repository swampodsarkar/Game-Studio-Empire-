import { db, isFirebaseConfigured } from '../firebase/config'
import {
  ref,
  set,
  get,
  child,
  push,
  update,
} from 'firebase/database'
import type { LeaderboardEntry, PlayerState } from '../types'

const LOCAL_PREFIX = 'gse_player_'

export async function savePlayer(player: PlayerState): Promise<void> {
  if (isFirebaseConfigured && db) {
    await set(ref(db, `users/${player.uid}`), player)
  } else {
    localStorage.setItem(LOCAL_PREFIX + player.uid, JSON.stringify(player))
  }
}

export async function loadPlayer(uid: string): Promise<PlayerState | null> {
  if (isFirebaseConfigured && db) {
    const snap = await get(child(ref(db), `users/${uid}`))
    return snap.exists() ? (snap.val() as PlayerState) : null
  }
  const raw = localStorage.getItem(LOCAL_PREFIX + uid)
  return raw ? (JSON.parse(raw) as PlayerState) : null
}

export async function saveLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
  if (isFirebaseConfigured && db) {
    await update(ref(db, `leaderboards/${entry.uid}`), entry)
  }
  // Offline mode keeps leaderboard local-only via the market simulation.
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isFirebaseConfigured && db) {
    const snap = await get(child(ref(db), 'leaderboards'))
    if (!snap.exists()) return []
    const val = snap.val() as Record<string, LeaderboardEntry>
    return Object.values(val).sort((a, b) => b.studioValue - a.studioValue)
  }
  return []
}

// Admin helpers (Firebase only).
export async function sendGlobalNotification(notification: {
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'event'
}): Promise<void> {
  if (isFirebaseConfigured && db) {
    await push(ref(db, 'notifications/global'), {
      ...notification,
      createdAt: Date.now(),
    })
  }
}
