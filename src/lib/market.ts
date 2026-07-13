import type { Genre, MarketGame } from '../types'
import { GENRES } from '../config/gameConfig'
import { randomGameName, randomStudioName } from './names'
import { pick, randInt, rand } from './format'

const MAX_MARKET_GAMES = 16

function pickTags(genre: Genre, n: number): Genre[] {
  const pool = GENRES.filter((g) => g !== genre)
  const out: Genre[] = []
  while (out.length < n && pool.length) {
    const t = pick(pool)
    if (!out.includes(t)) out.push(t)
  }
  return out
}

export function generateMarketGames(week: number, count = MAX_MARKET_GAMES): MarketGame[] {
  const games: MarketGame[] = []
  for (let i = 0; i < count; i++) games.push(makeMarketGame(week))
  return games
}

function makeMarketGame(week: number): MarketGame {
  const genre = pick(GENRES)
  const reviewScore = randInt(42, 96)
  const copies = Math.round(Math.pow(reviewScore, 2) * rand(180, 1300))
  const price = randInt(8, 30)
  const revenue = copies * price
  return {
    id: `mg_${week}_${Math.random().toString(36).slice(2, 8)}`,
    name: randomGameName(),
    studio: randomStudioName(),
    genre,
    tags: pickTags(genre, randInt(2, 4)),
    reviewScore,
    copies,
    revenue,
    appearedWeek: week,
    heat: randInt(20, 100),
  }
}

// Advance the market games one week: existing titles keep selling, old ones
// rotate out, and fresh releases join the charts.
export function tickMarketGames(games: MarketGame[], week: number): MarketGame[] {
  const kept = games
    .filter((g) => g.appearedWeek > week - 44)
    .map((g) => {
      const growth = rand(0.01, 0.07) * (g.reviewScore / 80)
      const sold = Math.round(g.copies * growth)
      const price = g.revenue / Math.max(1, g.copies)
      return {
        ...g,
        copies: g.copies + sold,
        revenue: Math.round(g.revenue + sold * price),
        heat: Math.max(5, Math.min(100, g.heat + (g.reviewScore > 80 ? randInt(2, 8) : randInt(-6, 2)))),
      }
    })

  let next = kept.filter((g) => g.heat > 12 || g.appearedWeek > week - 20)
  while (next.length < MAX_MARKET_GAMES) next.push(makeMarketGame(week))
  return next.slice(0, MAX_MARKET_GAMES + 4)
}
