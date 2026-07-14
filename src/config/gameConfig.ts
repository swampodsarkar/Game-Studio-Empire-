import type { EmployeeRole, Genre, Platform, Theme } from '../types'

export const GENRES: Genre[] = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Indie',
  'Casual',
  'Horror',
  'Open World',
  'Sandbox',
  'Survival',
  'Shooter',
  'FPS',
  'TPS',
  'Co-op',
  'Online Multiplayer',
  'Single Player',
  'Story Rich',
  'Choices Matter',
  'Crafting',
  'Building',
  'Base Building',
  'City Builder',
  'Tactical',
  'Turn-Based',
  'Real-Time',
  'Platformer',
  'Metroidvania',
  'Soulslike',
  'Roguelike',
  'Roguelite',
  'Stealth',
  'Puzzle',
  'Visual Novel',
  'Anime',
  'Sci-Fi',
  'Fantasy',
  'Medieval',
  'Post-Apocalyptic',
  'Zombie',
  'Military',
  'Historical',
  'Detective',
  'Psychological Horror',
  'Battle Royale',
  'MOBA',
  'Hero Shooter',
  'Extraction Shooter',
  'Parkour',
  'Survival Craft',
  'Management',
  'Tycoon',
  'Idle',
  'Card Game',
  'Deckbuilder',
  'Rhythm',
  'Football',
]

export const THEMES: Theme[] = [
  'Fantasy',
  'Sci-Fi',
  'Modern',
  'Historical',
  'Zombie',
  'Space',
  'Military',
]

// Distribution stores a game can be published to.
export const PLATFORMS: Platform[] = [
  'Steam',
  'Epic',
  'GOG',
  'itch.io',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Google Play',
  'App Store',
]

export const STORE_ICON: Record<Platform, string> = {
  Steam: '🟦',
  Epic: '🟪',
  GOG: '🟫',
  'itch.io': '🩷',
  PlayStation: '🎮',
  Xbox: '🟢',
  'Nintendo Switch': '🔴',
  'Google Play': '🤖',
  'App Store': '🍎',
}

export const ROLES: EmployeeRole[] = [
  'Programmer',
  'Artist',
  'Designer',
  'Writer',
  'SoundEngineer',
  'Tester',
  'Producer',
  'MarketingManager',
]

export const ROLE_LABELS: Record<EmployeeRole, string> = {
  Programmer: 'Programmer',
  Artist: 'Artist',
  Designer: 'Designer',
  Writer: 'Writer',
  SoundEngineer: 'Sound Engineer',
  Tester: 'Tester',
  Producer: 'Producer',
  MarketingManager: 'Marketing Manager',
}

// How much each store multiplies reach / sales potential.
export const PLATFORM_MULT: Record<Platform, number> = {
  Steam: 1.0,
  Epic: 1.05,
  GOG: 0.8,
  'itch.io': 0.7,
  PlayStation: 1.5,
  Xbox: 1.5,
  'Nintendo Switch': 1.4,
  'Google Play': 1.3,
  'App Store': 1.25,
}

// Relative porting / dev cost multiplier per store (console ports cost more).
export const PLATFORM_DEV_COST: Record<Platform, number> = {
  Steam: 1.0,
  Epic: 1.05,
  GOG: 0.85,
  'itch.io': 0.6,
  PlayStation: 1.8,
  Xbox: 1.7,
  'Nintendo Switch': 1.6,
  'Google Play': 0.8,
  'App Store': 0.9,
}

// Typical retail price per store (used to estimate revenue).
export const PLATFORM_PRICE: Record<Platform, number> = {
  Steam: 24,
  Epic: 25,
  GOG: 22,
  'itch.io': 15,
  PlayStation: 38,
  Xbox: 36,
  'Nintendo Switch': 34,
  'Google Play': 4,
  'App Store': 6,
}

// Which genres favour a theme (genre/theme affinity boosts review score).
// Partial so newly added genres without a defined affinity simply get no bonus.
export const GENRE_THEME_AFFINITY: Partial<Record<Genre, Theme[]>> = {
  RPG: ['Fantasy', 'Sci-Fi', 'Historical'],
  Action: ['Military', 'Modern', 'Sci-Fi'],
  Sports: ['Modern'],
  Racing: ['Modern', 'Sci-Fi'],
  Simulation: ['Modern', 'Historical'],
  Strategy: ['Historical', 'Military', 'Sci-Fi'],
  Horror: ['Zombie', 'Space'],
  Adventure: ['Fantasy', 'Space', 'Historical'],
  Puzzle: ['Modern', 'Sci-Fi'],
  Shooter: ['Military', 'Sci-Fi', 'Modern'],
  FPS: ['Military', 'Sci-Fi', 'Modern'],
  Survival: ['Zombie'],
  Stealth: ['Military', 'Modern'],
  'Battle Royale': ['Military', 'Modern'],
  MOBA: ['Sci-Fi', 'Fantasy'],
  'City Builder': ['Historical', 'Modern'],
  Tycoon: ['Modern', 'Historical'],
  Management: ['Modern', 'Historical'],
  'Visual Novel': ['Fantasy', 'Sci-Fi'],
  Anime: ['Fantasy', 'Sci-Fi'],
}

export const DEV_PHASES = [
  'Concept',
  'Design',
  'Programming',
  'Art',
  'Testing',
  'Marketing',
] as const

export interface UpgradeDef {
  id: string
  name: string
  description: string
  icon: string
  baseCost: number
  costGrowth: number
  maxLevel: number
  effectLabel: (lvl: number) => string
  // Multiplier applied to game quality / capacity at a given level.
  effect: (lvl: number) => number
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'office',
    name: 'Office Space',
    description: 'Larger offices let you hire more staff.',
    icon: '🏢',
    baseCost: 2500,
    costGrowth: 1.8,
    maxLevel: 12,
    effectLabel: (l) => `Max employees: ${4 + l * 2}`,
    effect: (l) => 4 + l * 2,
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Comfortable furniture improves mood and productivity.',
    icon: '🪑',
    baseCost: 1500,
    costGrowth: 1.6,
    maxLevel: 10,
    effectLabel: (l) => `+${l * 2}% mood`,
    effect: (l) => 1 + l * 0.02,
  },
  {
    id: 'internet',
    name: 'Internet',
    description: 'Faster internet speeds up development.',
    icon: '🌐',
    baseCost: 1200,
    costGrowth: 1.7,
    maxLevel: 10,
    effectLabel: (l) => `+${l * 5}% dev speed`,
    effect: (l) => 1 + l * 0.05,
  },
  {
    id: 'computers',
    name: 'Computers',
    description: 'Better PCs improve engine and art quality.',
    icon: '🖥️',
    baseCost: 3000,
    costGrowth: 1.75,
    maxLevel: 10,
    effectLabel: (l) => `+${l * 3}% graphics`,
    effect: (l) => 1 + l * 0.03,
  },
  {
    id: 'servers',
    name: 'Servers',
    description: 'Dedicated servers support online features.',
    icon: '🗄️',
    baseCost: 4000,
    costGrowth: 1.8,
    maxLevel: 8,
    effectLabel: (l) => `+${l * 4}% networking`,
    effect: (l) => 1 + l * 0.04,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Reduces piracy losses.',
    icon: '🔒',
    baseCost: 2000,
    costGrowth: 1.7,
    maxLevel: 8,
    effectLabel: (l) => `-${l * 3}% piracy`,
    effect: (l) => 1 - l * 0.02,
  },
  {
    id: 'meeting',
    name: 'Meeting Rooms',
    description: 'Better planning improves design quality.',
    icon: '📊',
    baseCost: 1800,
    costGrowth: 1.6,
    maxLevel: 8,
    effectLabel: (l) => `+${l * 3}% design`,
    effect: (l) => 1 + l * 0.03,
  },
  {
    id: 'mocap',
    name: 'Motion Capture Room',
    description: 'Boost animation and art quality.',
    icon: '🎬',
    baseCost: 6000,
    costGrowth: 1.8,
    maxLevel: 6,
    effectLabel: (l) => `+${l * 5}% art`,
    effect: (l) => 1 + l * 0.05,
  },
  {
    id: 'qa',
    name: 'QA Lab',
    description: 'Rigorous testing reduces bugs and refunds.',
    icon: '🧪',
    baseCost: 3500,
    costGrowth: 1.7,
    maxLevel: 8,
    effectLabel: (l) => `-${Math.round(l * 0.8)}% refunds`,
    effect: (l) => 1 - l * 0.03,
  },
  {
    id: 'research',
    name: 'Research Lab',
    description: 'Speeds up technology research.',
    icon: '🔬',
    baseCost: 5000,
    costGrowth: 1.8,
    maxLevel: 8,
    effectLabel: (l) => `+${l * 6}% research`,
    effect: (l) => 1 + l * 0.06,
  },
]

export interface ResearchDef {
  id: string
  name: string
  description: string
  icon: string
  cost: number // research points
  prereq: string[]
  bonus: string
}

export const RESEARCH_TREE: ResearchDef[] = [
  { id: '3d', name: '3D Graphics', description: 'Unlock modern 3D rendering.', icon: '🧊', cost: 100, prereq: [], bonus: '+15% graphics' },
  { id: 'multiplayer', name: 'Online Multiplayer', description: 'Build connected experiences.', icon: '🛜', cost: 180, prereq: ['3d'], bonus: '+20% networking' },
  { id: 'raytracing', name: 'Ray Tracing', description: 'Cinematic lighting.', icon: '💡', cost: 320, prereq: ['3d'], bonus: '+25% graphics' },
  { id: 'cloud', name: 'Cloud Gaming', description: 'Stream your games.', icon: '☁️', cost: 400, prereq: ['multiplayer'], bonus: '+15% reach' },
  { id: 'ainpc', name: 'AI NPCs', description: 'Believable characters.', icon: '🤖', cost: 450, prereq: ['3d'], bonus: '+25% AI' },
  { id: 'vr', name: 'VR', description: 'Immersive virtual reality.', icon: '🥽', cost: 500, prereq: ['raytracing'], bonus: '+30% innovation' },
  { id: 'ar', name: 'AR', description: 'Augmented reality worlds.', icon: '📱', cost: 520, prereq: ['raytracing'], bonus: '+30% innovation' },
  { id: 'physics', name: 'Advanced Physics', description: 'Realistic simulation.', icon: '⚙️', cost: 360, prereq: ['3d'], bonus: '+20% physics' },
]

export const STARTING_MONEY = 5000

export const DIFFICULTY: Record<string, { label: string; desc: string; revenueMult: number; expenseMult: number; startMoney: number }> = {
  easy: { label: 'Easy', desc: '1.2x revenue, 0.8x expenses, start with $10K', revenueMult: 1.2, expenseMult: 0.8, startMoney: 10_000 },
  medium: { label: 'Medium', desc: '1.0x revenue, 1.0x expenses, start with $5K', revenueMult: 1.0, expenseMult: 1.0, startMoney: 5_000 },
  hard: { label: 'Hard', desc: '0.7x revenue, 1.3x expenses, start with $2K', revenueMult: 0.7, expenseMult: 1.3, startMoney: 2_000 },
}

export const COUNTRIES = [
  'USA', 'UK', 'Germany', 'Japan', 'Brazil', 'Canada', 'France',
  'South Korea', 'India', 'Australia', 'Spain', 'Sweden', 'Netherlands', 'Mexico',
]

// Publishing models: how revenue / advances are handled at release.
export interface PublishingDef {
  id: 'self' | 'publisher' | 'exclusive'
  name: string
  icon: string
  description: string
  revenueShare: number // fraction of revenue the studio keeps
  advanceMult: number // upfront cash as a multiple of budget
  ratingBonus: number
  fanMult: number
}

export const PUBLISHING: PublishingDef[] = [
  {
    id: 'self',
    name: 'Self-Publish',
    icon: '🚀',
    description: 'Keep 100% of revenue. You eat all the marketing risk.',
    revenueShare: 1,
    advanceMult: 0,
    ratingBonus: 0,
    fanMult: 1,
  },
  {
    id: 'publisher',
    name: 'Publisher Deal',
    icon: '🤝',
    description: 'Get an advance up front, but the publisher takes a 30% cut.',
    revenueShare: 0.7,
    advanceMult: 0.6,
    ratingBonus: 0,
    fanMult: 1,
  },
  {
    id: 'exclusive',
    name: 'Exclusive Contract',
    icon: '🔒',
    description: 'Platform pays a big bonus and boosts sales, but locks you to one platform.',
    revenueShare: 1,
    advanceMult: 1.0,
    ratingBonus: 3,
    fanMult: 0.8,
  },
]

// Season / Battle Pass tiers.
export interface SeasonTier {
  tier: number
  xpNeeded: number
  reward: { money?: number; fans?: number; xp?: number }
  label: string
}

export const SEASON_TIERS: SeasonTier[] = [
  { tier: 1, xpNeeded: 0, reward: { money: 1000 }, label: 'Rookie' },
  { tier: 2, xpNeeded: 150, reward: { money: 2500 }, label: 'Indie' },
  { tier: 3, xpNeeded: 400, reward: { fans: 5000 }, label: 'Rising' },
  { tier: 4, xpNeeded: 800, reward: { money: 8000 }, label: 'Pro' },
  { tier: 5, xpNeeded: 1400, reward: { fans: 20000 }, label: 'Veteran' },
  { tier: 6, xpNeeded: 2200, reward: { money: 25000 }, label: 'Legend' },
  { tier: 7, xpNeeded: 3200, reward: { fans: 75000, money: 20000 }, label: 'Tycoon' },
  { tier: 8, xpNeeded: 4500, reward: { fans: 200000, money: 50000 }, label: 'Empire' },
]

export const SEASON_LENGTH_WEEKS = 12

export const AWARD_CATEGORIES: { id: string; label: string }[] = [
  { id: 'best_game', label: 'Best Game' },
  { id: 'best_rpg', label: 'Best RPG' },
  { id: 'best_sports', label: 'Best Sports Game' },
  { id: 'best_indie', label: 'Best Indie Game' },
  { id: 'goty', label: 'Game of the Year' },
  { id: 'studio', label: 'Studio of the Year' },
]

export const AVATARS = ['🦊', '🐼', '🐉', '🦅', '🐺', '🦁', '🐙', '🦈', '🐢', '🦄', '👾', '🤖']

// Marketing campaigns raise a game's hype while it is in development. More hype
// means a bigger launch and stronger lifetime sales.
export interface CampaignDef {
  id: string
  name: string
  icon: string
  description: string
  cost: number
  hype: number
}

export const CAMPAIGNS: CampaignDef[] = [
  { id: 'social', name: 'Social Media Push', icon: '📣', description: 'Posts, memes and community buzz.', cost: 1200, hype: 12 },
  { id: 'trailer', name: 'Cinematic Trailer', icon: '🎞️', description: 'A polished reveal trailer.', cost: 3500, hype: 24 },
  { id: 'influencer', name: 'Influencer Deals', icon: '🌟', description: 'Streamers and creators cover your game.', cost: 6000, hype: 34 },
  { id: 'expo', name: 'Expo Booth', icon: '🎪', description: 'Show the game off at a major expo.', cost: 12000, hype: 55 },
]

// Office rent scales with your office upgrade level and headcount.
export const OFFICE_BASE_RENT = 150
export const OFFICE_RENT_PER_HEAD = 40
export const OFFICE_RENT_PER_LEVEL = 120
