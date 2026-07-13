import type { Stock } from '../types'
import { rand } from './format'

interface CompanyMeta {
  symbol: string
  name: string
  sector: string
  base: number // fundamental fair value the price reverts toward
  vol: number // idiosyncratic weekly volatility
  beta: number // sensitivity to the broad market
  drift: number // long-term earnings momentum (per week)
}

const COMPANIES: CompanyMeta[] = [
  { symbol: 'NXTL', name: 'Nexus Tech', sector: 'Hardware', base: 130, vol: 0.07, beta: 1.2, drift: 0.003 },
  { symbol: 'VRZN', name: 'Vortex Games', sector: 'Games', base: 92, vol: 0.09, beta: 1.4, drift: 0.001 },
  { symbol: 'PIXL', name: 'PixelCorp', sector: 'Games', base: 58, vol: 0.06, beta: 1.0, drift: 0.002 },
  { symbol: 'CUDA', name: 'Cuda Systems', sector: 'Hardware', base: 205, vol: 0.05, beta: 0.9, drift: 0.004 },
  { symbol: 'ATLX', name: 'Atlas Interactive', sector: 'Games', base: 44, vol: 0.12, beta: 1.5, drift: -0.001 },
  { symbol: 'QBIT', name: 'Qubit Labs', sector: 'Tech', base: 112, vol: 0.08, beta: 1.1, drift: 0.003 },
  { symbol: 'HLIO', name: 'Helios Soft', sector: 'Software', base: 76, vol: 0.06, beta: 0.8, drift: 0.001 },
  { symbol: 'ORBT', name: 'Orbit Entertainment', sector: 'Media', base: 162, vol: 0.07, beta: 1.3, drift: 0.002 },
]

const META: Record<string, CompanyMeta> = Object.fromEntries(COMPANIES.map((c) => [c.symbol, c]))

export const STOCK_SECTORS: Record<string, string> = Object.fromEntries(
  COMPANIES.map((c) => [c.symbol, c.sector]),
)

// Broad-market sentiment: a slow bull/bear cycle plus a little noise. Shared by
// every stock so the market sometimes rallies and sometimes corrects together.
function marketSentiment(week: number): number {
  const cycle = Math.sin(week / 9) // -1..1 over ~57 weeks
  return cycle * 0.045 + rand(-0.02, 0.02)
}

export function createStocks(week = 0): Stock[] {
  const sentiment = marketSentiment(week)
  return COMPANIES.map((c) => {
    const price = Math.max(5, Math.round(c.base * (1 + rand(-0.15, 0.15))))
    // Seed a short believable price history ending at the current price.
    const history: number[] = []
    let p = price * (1 + rand(-0.12, 0.12))
    for (let i = 0; i < 14; i++) {
      p = Math.max(5, p * (1 + c.drift * 0.5 + sentiment * c.beta * 0.4 + rand(-c.vol, c.vol)))
      history.push(Math.round(p))
    }
    history.push(price)
    return { symbol: c.symbol, name: c.name, price, history }
  })
}

// Advance every stock one week using a realistic model:
//   nextMove = long-term drift + market sentiment * beta + mean reversion + noise
export function tickStocks(stocks: Stock[], week = 0): Stock[] {
  const sentiment = marketSentiment(week)
  return stocks.map((s) => {
    const m = META[s.symbol] ?? { base: s.price, vol: 0.06, beta: 1, drift: 0 }
    const reversion = ((m.base - s.price) / m.base) * 0.08
    const move = m.drift + sentiment * m.beta + reversion + rand(-m.vol, m.vol)
    const next = Math.max(5, s.price * (1 + move))
    const price = Math.round(next)
    const history = [...s.history, price].slice(-52)
    return { ...s, price, history }
  })
}

// Overall market direction this week, from the average move of all stocks.
export function marketMood(stocks: Stock[]): { pct: number; label: string } {
  if (stocks.length === 0) return { pct: 0, label: 'Flat' }
  let sum = 0
  let n = 0
  for (const s of stocks) {
    if (s.history.length < 2) continue
    const prev = s.history[s.history.length - 2]
    if (prev > 0) {
      sum += (s.price - prev) / prev
      n++
    }
  }
  const pct = n ? (sum / n) * 100 : 0
  const label = pct > 1.5 ? 'Bullish' : pct < -1.5 ? 'Bearish' : 'Neutral'
  return { pct, label }
}
