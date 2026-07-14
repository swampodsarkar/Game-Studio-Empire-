import type { AIStudio, Genre } from '../types'
import { GENRES } from '../config/gameConfig'
import { randomStudioName, randomPersonName } from './names'
import { rand, randInt } from './format'

export interface MarketTrends {
  // Popularity multiplier per genre, fluctuates yearly.
  genrePopularity: Record<Genre, number>
  year: number
}

export function createMarket(): { studios: AIStudio[]; trends: MarketTrends } {
  const studios: AIStudio[] = []
  const count = 240
  for (let i = 0; i < count; i++) {
    studios.push({
      id: `ai_${i}`,
      name: randomStudioName(),
      founder: randomPersonName(),
      value: randInt(50_000, 9_000_000),
      fans: randInt(500, 1_200_000),
      games: randInt(1, 40),
      rating: randInt(35, 92),
    })
  }
  studios.sort((a, b) => b.value - a.value)

  const genrePopularity = {} as Record<Genre, number>
  for (const g of GENRES) genrePopularity[g] = rand(0.7, 1.3)
  return { studios, trends: { genrePopularity, year: 2025 } }
}

// Progress the market one week. AI studios slowly grow; trends drift.
export function tickMarket(
  studios: AIStudio[],
  trends: MarketTrends,
  week: number,
): { studios: AIStudio[]; trends: MarketTrends } {
  const year = 2025 + Math.floor((week - 1) / 52)
  let newTrends = trends
  if (year !== trends.year) {
    // Yearly trend reshuffle.
    const gp = {} as Record<Genre, number>
    for (const g of GENRES) gp[g] = rand(0.7, 1.35)
    newTrends = { genrePopularity: gp, year }
  } else {
    // Weekly drift.
    const gp = { ...trends.genrePopularity }
    for (const g of GENRES) {
      gp[g] = Math.max(0.6, Math.min(1.5, gp[g] + rand(-0.02, 0.02)))
    }
    newTrends = { ...trends, genrePopularity: gp }
  }

  const next = studios.map((s) => {
    const growth = rand(0.97, 1.05)
    const value = Math.round(s.value * growth + randInt(-2000, 8000))
    return {
      ...s,
      value: Math.max(10000, value),
      fans: Math.max(100, s.fans + randInt(-500, 1500)),
      rating: Math.max(20, Math.min(99, s.rating + randInt(-1, 1))),
    }
  })
  next.sort((a, b) => b.value - a.value)
  return { studios: next, trends: newTrends }
}

export function rankAmongStudios(
  studios: AIStudio[],
  playerValue: number,
): { rank: number; total: number } {
  let rank = 1
  for (const s of studios) {
    if (s.value > playerValue) rank++
  }
  return { rank, total: studios.length + 1 }
}
