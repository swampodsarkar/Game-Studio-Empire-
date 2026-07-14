// Core domain types for Game Studio Empire.

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'RPG'
  | 'Strategy'
  | 'Simulation'
  | 'Sports'
  | 'Racing'
  | 'Indie'
  | 'Casual'
  | 'Horror'
  | 'Open World'
  | 'Sandbox'
  | 'Survival'
  | 'Shooter'
  | 'FPS'
  | 'TPS'
  | 'Co-op'
  | 'Online Multiplayer'
  | 'Single Player'
  | 'Story Rich'
  | 'Choices Matter'
  | 'Crafting'
  | 'Building'
  | 'Base Building'
  | 'City Builder'
  | 'Tactical'
  | 'Turn-Based'
  | 'Real-Time'
  | 'Platformer'
  | 'Metroidvania'
  | 'Soulslike'
  | 'Roguelike'
  | 'Roguelite'
  | 'Stealth'
  | 'Puzzle'
  | 'Visual Novel'
  | 'Anime'
  | 'Sci-Fi'
  | 'Fantasy'
  | 'Medieval'
  | 'Post-Apocalyptic'
  | 'Zombie'
  | 'Military'
  | 'Historical'
  | 'Detective'
  | 'Psychological Horror'
  | 'Battle Royale'
  | 'MOBA'
  | 'Hero Shooter'
  | 'Extraction Shooter'
  | 'Parkour'
  | 'Survival Craft'
  | 'Management'
  | 'Tycoon'
  | 'Idle'
  | 'Card Game'
  | 'Deckbuilder'
  | 'Rhythm'
  | 'Football'

export type Theme =
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Modern'
  | 'Historical'
  | 'Zombie'
  | 'Space'
  | 'Military'

// Distribution stores a game can be published to (Steam, Epic, ...).
export type Platform =
  | 'Steam'
  | 'Epic'
  | 'GOG'
  | 'itch.io'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo Switch'
  | 'Google Play'
  | 'App Store'

export type PublishingType = 'self' | 'publisher' | 'exclusive'

export type AwardCategory =
  | 'Best Game'
  | 'Best RPG'
  | 'Best Sports Game'
  | 'Best Indie Game'
  | 'Game of the Year'
  | 'Studio of the Year'

export interface AwardRecord {
  gameId: string
  gameName: string
  year: number
  category: AwardCategory
  won: boolean
}

export interface Stock {
  symbol: string
  name: string
  price: number
  history: number[]
}

export interface StockHolding {
  shares: number
  avgPrice: number
}

export type DevPhase =
  | 'Concept'
  | 'Design'
  | 'Programming'
  | 'Art'
  | 'Testing'
  | 'Marketing'
  | 'Released'

export type EmployeeRole =
  | 'Programmer'
  | 'Artist'
  | 'Designer'
  | 'Writer'
  | 'SoundEngineer'
  | 'Tester'
  | 'Producer'
  | 'MarketingManager'

export interface ReviewComment {
  author: string
  score: number
  text: string
}

export interface Review {
  score: number
  criticScore: number
  userScore: number
  comments: ReviewComment[]
}

export interface SalesData {
  launchDay: number
  weekly: number
  monthly: number
  lifetime: number
  revenue: number
  profit: number
  refunds: number
  piracyPct: number
  fansGained: number
  // Money returned to customers via refunds (subtracted from net profit).
  refundCost: number
  // Normalized per-week unit schedule (launch spike + decay) summing to
  // (lifetime - launchDay). Used by the weekly simulation so actual copies
  // sold and revenue earned converge to the displayed lifetime estimate.
  plan: number[]
  // Running totals that grow week over week after release.
  sold?: number
  revenueToDate?: number
}

export interface GameProject {
  id: string
  name: string
  genre: Genre
  theme: Theme
  // One or more distribution stores the game is published to.
  platforms: Platform[]
  // Extra category tags (genres/categories beyond the primary genre).
  tags?: Genre[]
  engineId: string
  budget: number
  marketingBudget: number
  devTimeWeeks: number
  publishing: PublishingType
  isSequel: boolean
  phase: DevPhase
  progress: number // 0..1 within current phase
  weeksSpent: number
  teamMemberIds: string[]
  createdAt: number
  review?: Review
  sales?: SalesData
  released: boolean
  releasedAt?: number
  weeksSinceRelease?: number
  // Marketing hype accumulated during development (0..100).
  hype?: number
  campaigns?: string[]
  // YouTube trailer released during development (free, once per game) — used to
  // gauge audience interest and give a small hype bump.
  trailer?: { views: number; likes: number; releasedAt: number }
  // Post-launch support.
  bugs?: number
  patches?: number
  dlcCount?: number
  // Franchise: id of the game this is a sequel to.
  sequelOf?: string
}

export interface Employee {
  id: string
  name: string
  role: EmployeeRole
  level: number
  salary: number // weekly
  experience: number
  mood: number // 0..100
  energy: number // 0..100 (drops with overwork, causes burnout)
  productivity: number // 0..100 baseline
  skill: number // 0..100
  specialization: Genre | Theme | 'General'
  hiredAt: number
}

export interface StudioUpgrade {
  id: string
  level: number
}

export interface CustomEngine {
  id: string
  name: string
  graphics: number
  physics: number
  ai: number
  networking: number
  optimization: number
  tools: number
  version: number
  licensedTo: string[]
}

export interface ResearchNode {
  id: string
  unlocked: boolean
}

export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  hidden?: boolean
  reward: { money?: number; xp?: number; fans?: number }
  condition: (s: PlayerState) => boolean
}

export interface PlayerAchievement {
  id: string
  unlockedAt: number
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'event'
  createdAt: number
  read: boolean
}

export interface Mission {
  id: string
  title: string
  description: string
  goal: number
  progress: number
  reward: { money?: number; xp?: number; fans?: number }
  type: 'release' | 'earn' | 'hire' | 'research' | 'fan' | 'upgrade'
  expiresAt: number
  claimed?: boolean
}

export interface AIStudio {
  id: string
  name: string
  founder: string
  value: number
  fans: number
  games: number
  rating: number
}

// A game currently on the market made by other studios — shown in the Market
// "Trending Games" board so the player can see what's popular.
export interface MarketGame {
  id: string
  name: string
  studio: string
  genre: Genre
  tags: Genre[]
  reviewScore: number
  copies: number // downloads / units sold to date
  revenue: number
  appearedWeek: number
  // Momentum score used to rank "hot" titles (rises after a good review drop).
  heat: number
}

export interface GameEventChoice {
  label: string
  // Outcome applied to the player when chosen.
  money?: number
  fans?: number
  xp?: number
  rating?: number
  // Text shown after the player makes this choice.
  result: string
}

export interface GameEvent {
  id: string
  title: string
  body: string
  choices: GameEventChoice[]
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface PlayerState {
  uid: string
  username: string
  avatar: string
  country: string
  level: number
  xp: number
  money: number
  fans: number
  studioValue: number
  companyRating: number
  week: number // in-game week counter
  achievements: PlayerAchievement[]
  notifications: Notification[]
  missions: Mission[]
  lastLogin: number
  streak: number
  lastRank?: number
  employees: Employee[]
  games: GameProject[]
  engines: CustomEngine[]
  research: ResearchNode[]
  upgrades: StudioUpgrade[]
  licenses: Record<string, number> // engineId -> royalty rate (% of weekly revenue)
  loanBalance: number
  stocks: Record<string, StockHolding>
  awards: AwardRecord[]
  season: { id: number; xp: number; claimedTiers: number[] }
  history: {
    revenue: number[]
    fans: number[]
    studioValue: number[]
    weeks: number[]
  }
  difficulty: Difficulty
  createdAt: number
  // transient / derived tracking (also persisted for convenience)
  _rp?: number
  _lastClaimDay?: string
  // An interactive crisis/decision event awaiting the player's choice.
  pendingEvent?: GameEvent
}

export interface LeaderboardEntry {
  uid: string
  username: string
  avatar: string
  studioValue: number
  fans: number
  level: number
  country: string
  founder?: string
}
