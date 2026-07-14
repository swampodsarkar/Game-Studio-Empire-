export function formatMoney(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n)}`
}

export function formatNumber(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${Math.round(n)}`
}

export function formatDate(week: number): string {
  // Game starts year 2025, week 1 (48 weeks/year, 4 weeks/month).
  const startYear = 2025
  const weeksPerYear = 48
  const year = startYear + Math.floor((week - 1) / weeksPerYear)
  const wk = ((week - 1) % weeksPerYear) + 1
  return `W${wk}, ${year}`
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export interface GameDate {
  year: number
  month: string
  monthIndex: number
  weekOfMonth: number
}

// Calendar model: 4 weeks = 1 month, 12 months = 1 year (48 weeks/year).
export function gameDate(week: number, startYear = 2025): GameDate {
  const idx = Math.max(0, week - 1)
  const weeksPerYear = 48
  const year = startYear + Math.floor(idx / weeksPerYear)
  const inYear = idx % weeksPerYear
  const monthIndex = Math.floor(inYear / 4)
  const weekOfMonth = (inYear % 4) + 1
  return { year, month: MONTHS[monthIndex], monthIndex, weekOfMonth }
}

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1))
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
