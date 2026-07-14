import { createContext, useContext } from 'react'
import type {
  AIStudio,
  CustomEngine,
  Difficulty,
  Employee,
  EmployeeRole,
  Genre,
  MarketGame,
  Notification,
  Platform,
  PlayerState,
  PublishingType,
  Theme,
} from '../types'
import type { MarketTrends } from '../lib/aiStudios'
import type { Stock } from '../types'
import type { WeeklyReport } from './GameProvider'

export interface CreateGameInput {
  name: string
  genre: Genre
  theme: Theme
  platforms: Platform[]
  tags?: Genre[]
  engineId: string
  budget: number
  marketingBudget: number
  devTimeWeeks: number
  publishing: PublishingType
  isSequel?: boolean
  sequelOf?: string
  teamMemberIds: string[]
}

export interface GameContextValue {
  player: PlayerState | null
  loading: boolean
  market: { studios: AIStudio[]; trends: MarketTrends; stocks: Stock[]; games: MarketGame[] }
  // actions
  createGame: (input: CreateGameInput) => string
  advanceWeek: () => void
  advanceWeeks: (n: number) => void
  weeklyReport: WeeklyReport | null
  dismissWeeklyReport: () => void
  autoPlay: boolean
  toggleAutoPlay: () => void
  autoSpeed: number
  setAutoSpeed: (ms: number) => void
  hireEmployee: (role: EmployeeRole) => Employee | null
  fireEmployee: (id: string) => void
  trainEmployee: (id: string) => void
  promoteEmployee: (id: string) => void
  giveRaise: (id: string) => void
  giveVacation: (id: string) => void
  runCampaign: (gameId: string, campaignId: string) => void
  releaseTrailer: (gameId: string) => void
  patchGame: (gameId: string) => void
  releaseDLC: (gameId: string) => void
  buyUpgrade: (id: string) => boolean
  researchNode: (id: string) => boolean
  createEngine: (name: string, stats: Omit<CustomEngine, 'id' | 'version' | 'licensedTo' | 'name'>) => void
  upgradeEngine: (engineId: string) => void
  claimLoginReward: () => number
  notify: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationsRead: () => void
  clearNotifications: () => void
  resetGame: () => void
  setupProfile: (username: string, avatar: string, country: string, difficulty?: Difficulty) => void
  setAvatar: (avatar: string) => void
  setCountry: (country: string) => void
  takeLoan: (amount: number) => void
  repayLoan: (amount: number) => void
  acquireStudio: (studioId: string) => boolean
  resolveEvent: (choiceIndex: number) => void
  buyStock: (symbol: string, shares: number) => void
  sellStock: (symbol: string, shares: number) => void
  licenseEngine: (engineId: string, rate: number) => void
  claimSeasonTier: (tier: number) => boolean
  globalRank: number
}

export const GameContext = createContext<GameContextValue | null>(null)

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
