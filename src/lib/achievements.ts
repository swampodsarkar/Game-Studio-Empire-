import type { AchievementDef, PlayerState } from '../types'

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_game',
    name: 'First Steps',
    description: 'Release your first game.',
    icon: '🎮',
    reward: { xp: 50, money: 500 },
    condition: (s) => s.games.filter((g) => g.released).length >= 1,
  },
  {
    id: 'hit_game',
    name: 'Critical Darling',
    description: 'Release a game with a score of 80+.',
    icon: '⭐',
    reward: { xp: 120, fans: 2000 },
    condition: (s) => s.games.some((g) => g.released && (g.review?.score ?? 0) >= 80),
  },
  {
    id: 'masterpiece',
    name: 'Masterpiece',
    description: 'Release a game with a score of 95+.',
    icon: '👑',
    reward: { xp: 400, fans: 10000, money: 5000 },
    condition: (s) => s.games.some((g) => g.released && (g.review?.score ?? 0) >= 95),
  },
  {
    id: 'first_million',
    name: 'Millionaire',
    description: 'Reach $1,000,000 in cash.',
    icon: '💰',
    reward: { xp: 200 },
    condition: (s) => s.money >= 1_000_000,
  },
  {
    id: 'fanbase',
    name: 'Cult Following',
    description: 'Reach 100,000 fans.',
    icon: '📣',
    reward: { xp: 150, money: 2000 },
    condition: (s) => s.fans >= 100_000,
  },
  {
    id: 'million_fans',
    name: 'Global Icon',
    description: 'Reach 1,000,000 fans.',
    icon: '🌍',
    reward: { xp: 500, money: 10000 },
    condition: (s) => s.fans >= 1_000_000,
  },
  {
    id: 'hire_team',
    name: 'Growing Pains',
    description: 'Hire 5 employees.',
    icon: '👥',
    reward: { xp: 80 },
    condition: (s) => s.employees.length >= 5,
  },
  {
    id: 'big_team',
    name: 'Studio Powerhouse',
    description: 'Hire 20 employees.',
    icon: '🏭',
    reward: { xp: 300 },
    condition: (s) => s.employees.length >= 20,
  },
  {
    id: 'ten_games',
    name: 'Prolific',
    description: 'Release 10 games.',
    icon: '📚',
    reward: { xp: 250, money: 3000 },
    condition: (s) => s.games.filter((g) => g.released).length >= 10,
  },
  {
    id: 'research_3d',
    name: 'Into the Third Dimension',
    description: 'Unlock 3D Graphics research.',
    icon: '🧊',
    reward: { xp: 60 },
    condition: (s) => s.research.some((r) => r.id === '3d' && r.unlocked),
  },
  {
    id: 'research_all',
    name: 'Future Proof',
    description: 'Unlock every research node.',
    icon: '🔬',
    reward: { xp: 600, money: 8000 },
    condition: (s) => s.research.filter((r) => r.unlocked).length >= 8,
  },
  {
    id: 'upgrade_office',
    name: 'Moving On Up',
    description: 'Upgrade your office.',
    icon: '🏢',
    reward: { xp: 40 },
    condition: (s) => s.upgrades.some((u) => u.id === 'office' && u.level >= 1),
  },
  {
    id: 'level_10',
    name: 'Veteran',
    description: 'Reach level 10.',
    icon: '🎖️',
    reward: { xp: 0, money: 5000 },
    condition: (s) => s.level >= 10,
  },
  {
    id: 'level_25',
    name: 'Industry Legend',
    description: 'Reach level 25.',
    icon: '🏆',
    reward: { xp: 0, money: 25000 },
    condition: (s) => s.level >= 25,
  },
  {
    id: 'console_release',
    name: 'Big Screen',
    description: 'Release a game on Console.',
    icon: '🕹️',
    reward: { xp: 100, fans: 3000 },
    condition: (s) => s.games.some((g) => g.released && g.platforms.includes('PlayStation')),
  },
  {
    id: 'custom_engine',
    name: 'Engine Builder',
    description: 'Create a custom game engine.',
    icon: '⚙️',
    reward: { xp: 150 },
    condition: (s) => s.engines.length >= 1,
  },
  {
    id: 'flop',
    name: 'We All Start Somewhere',
    description: 'Release a game scoring below 40.',
    icon: '💀',
    hidden: true,
    reward: { xp: 20 },
    condition: (s) => s.games.some((g) => g.released && (g.review?.score ?? 100) < 40),
  },
  {
    id: 'profit_100k',
    name: 'In the Black',
    description: 'Earn $100k profit from a single game.',
    icon: '📈',
    hidden: true,
    reward: { xp: 200, money: 1000 },
    condition: (s) => s.games.some((g) => g.released && (g.sales?.profit ?? 0) >= 100_000),
  },
  {
    id: 'studio_value_10m',
    name: 'Empire',
    description: 'Reach a studio value of $10M.',
    icon: '🏛️',
    reward: { xp: 400 },
    condition: (s) => s.studioValue >= 10_000_000,
  },
  {
    id: 'streak_7',
    name: 'Dedicated',
    description: 'Log in 7 days in a row.',
    icon: '🔥',
    reward: { xp: 100 },
    condition: (s) => s.streak >= 7,
  },
]

export function checkAchievements(player: PlayerState): string[] {
  const unlocked = new Set(player.achievements.map((a) => a.id))
  const newly: string[] = []
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.has(a.id) && a.condition(player)) newly.push(a.id)
  }
  return newly
}

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
