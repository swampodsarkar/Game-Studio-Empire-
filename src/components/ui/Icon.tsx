// Custom line-art icon set so the UI reads like a game, not an emoji web app.
// Every icon inherits `currentColor` so callers control the tint.
import type { ReactNode } from 'react'

type IconName =
  | 'dashboard'
  | 'games'
  | 'studio'
  | 'research'
  | 'market'
  | 'analytics'
  | 'economy'
  | 'awards'
  | 'season'
  | 'missions'
  | 'achievements'
  | 'leaderboard'
  | 'profile'
  | 'admin'
  | 'bank'
  | 'cash'
  | 'fans'
  | 'star'
  | 'trophy'
  | 'gamepad'
  | 'users'
  | 'globe'

const PATHS: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  games: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <line x1="11" y1="9" x2="11" y2="15" />
      <line x1="8" y1="12" x2="14" y2="12" />
      <circle cx="6.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  studio: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1.5" />
      <line x1="6" y1="8" x2="18" y2="8" />
      <line x1="6" y1="13" x2="18" y2="13" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </>
  ),
  research: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
      <line x1="7.5" y1="15" x2="16.5" y2="15" />
    </>
  ),
  market: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3c3 3 3 15 0 18c-3-3-3-15 0-18Z" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M5 16l5-6 4 3 7-9" />
      <circle cx="21" cy="4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  economy: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  awards: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3" />
      <path d="M10 13.5V17h4v-3.5" />
      <path d="M8.5 20h7l-1-3h-5l-1 3Z" />
    </>
  ),
  season: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <line x1="14" y1="6" x2="14" y2="18" />
    </>
  ),
  missions: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
      <line x1="8" y1="9" x2="8" y2="9" />
      <circle cx="8" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <line x1="11" y1="9" x2="16" y2="9" />
      <circle cx="8" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <line x1="11" y1="14" x2="16" y2="14" />
    </>
  ),
  achievements: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 14l-2 7 5-3 5 3-2-7" />
    </>
  ),
  leaderboard: (
    <>
      <rect x="4" y="13" width="5" height="8" />
      <rect x="10" y="8" width="5" height="13" />
      <rect x="16" y="16" width="4" height="5" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  admin: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9c-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9l9-5 9 5" />
      <path d="M4 9v9" />
      <path d="M20 9v9" />
      <path d="M4 13h16" />
      <path d="M4 18h16" />
    </>
  ),
  cash: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M9.5 10.2c0-1.2 1.1-1.8 2.5-1.8s2.5.7 2.5 1.9c0 2.4-5 1.1-5 3.3c0 1.2 1.1 1.9 2.5 1.9s2.5-.7 2.5-1.9" />
    </>
  ),
  fans: (
    <>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M18 9a3 3 0 0 1 0 6" />
    </>
  ),
  star: (
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z" />
  ),
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3" />
      <path d="M10 13.5V17h4v-3.5" />
      <path d="M8 20h8" />
      <path d="M9 17h6v3H9z" />
    </>
  ),
  gamepad: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <circle cx="7" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <line x1="11" y1="9.5" x2="11" y2="14.5" />
      <line x1="8.5" y1="12" x2="13.5" y2="12" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.5 14.5a5 5 0 0 1 5.5 5.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3c3 3 3 15 0 18c-3-3-3-15 0-18Z" />
    </>
  ),
}

export type { IconName }

export function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.8,
}: {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  )
}
