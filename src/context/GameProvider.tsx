import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { GameContext, type CreateGameInput, type GameContextValue } from './GameContext'
import { useAuth } from './AuthContext'
import type {
  AIStudio,
  AwardRecord,
  CustomEngine,
  Difficulty,
  Employee,
  EmployeeRole,
  GameProject,
  Notification,
  Platform,
  PlayerState,
  Stock,
} from '../types'
import {
  AWARD_CATEGORIES,
  PUBLISHING,
  RESEARCH_TREE,
  ROLE_LABELS,
  SEASON_LENGTH_WEEKS,
  SEASON_TIERS,
  UPGRADES,
} from '../config/gameConfig'
import {
  advanceProject,
  computeBugs,
  computeCompanyRating,
  computeSales,
  computeStudioValue,
  getEngineStats,
  salaryBurn,
  upgradeEffect,
  upgradeLevel,
  weeklyResearchPoints,
  xpForLevel,
} from '../lib/gameLogic'
import { checkAchievements, getAchievement } from '../lib/achievements'
import { createMarket, rankAmongStudios, tickMarket, type MarketTrends } from '../lib/aiStudios'
import { generateMarketGames, tickMarketGames } from '../lib/market'
import type { MarketGame } from '../types'
import { createStocks, tickStocks } from '../lib/stocks'
import { randomEmployeeForRole, randomGameName } from '../lib/names'
import { generateMissions, loginRewardForStreak } from '../lib/missions'
import { generateEvent } from '../lib/events'
import { createInitialPlayer } from '../lib/initialState'
import { loadPlayer, saveLeaderboardEntry, savePlayer } from '../repository'
import { clamp, pick, formatMoney, formatNumber } from '../lib/format'
import {
  CAMPAIGNS,
  DIFFICULTY,
  OFFICE_BASE_RENT,
  OFFICE_RENT_PER_HEAD,
  OFFICE_RENT_PER_LEVEL,
} from '../config/gameConfig'

function uid(prefix: string): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 10)
}

// Build a full notification object.
function mkNote(n: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  return { ...n, id: uid('n'), createdAt: Date.now(), read: false }
}

// Return a copy of the player state with notes prepended. Used INSIDE state
// updaters so we never call setState from within another setState (which breaks
// under React StrictMode's double-invocation and caused duplicate/lost notes).
function withNotes(p: PlayerState, ...notes: Notification[]): PlayerState {
  return { ...p, notifications: [...notes, ...p.notifications].slice(0, 50) }
}

const EVENTS = [
  { title: 'Game Expo', body: 'A major expo is boosting genre interest this season.', type: 'event' as const },
  { title: 'Developer Conference', body: 'New tools announced — engine quality trends up.', type: 'event' as const },
  { title: 'Industry Awards', body: 'The annual awards could lift your studio rating.', type: 'event' as const },
  { title: 'Tech Summit', body: 'Research progress is accelerated this week.', type: 'event' as const },
]

type MarketSnapshot = { studios: AIStudio[]; trends: MarketTrends; stocks: Stock[]; games: MarketGame[] }

export interface WeeklyReport {
  fromWeek: number
  toWeek: number
  weeks: number
  moneyDelta: number
  fansDelta: number
  xpDelta: number
  releases: { name: string; score: number }[]
  notes: Notification[]
}

// Pure one-week simulation. Advances every project, runs sales, applies the
// economy (salaries, loan interest, licensing royalties, season XP), ticks the
// market + stock prices, evaluates achievements, and returns the next state.
function simulateOneWeek(
  p: PlayerState,
  market: MarketSnapshot,
): { player: PlayerState; market: MarketSnapshot; notes: Notification[] } {
  const diff = DIFFICULTY[p.difficulty ?? 'medium']
  let money = p.money
  let fans = p.fans
  let xp = p.xp
  const games = p.games.map((g) => ({ ...g }))
  const notifications: Notification[] = []
  const awards: AwardRecord[] = [...p.awards]
  let seasonXpGain = 0
  const shippedMembers = new Set<string>()
  const addNote = (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) =>
    notifications.push({ ...n, id: uid('n'), createdAt: Date.now(), read: false })

  // Pay salaries (adjusted for difficulty).
  money -= Math.round(salaryBurn(p) * diff.expenseMult)

  // Earn research points.
  let rp = (p._rp ?? 0) + weeklyResearchPoints(p)

  // Advance each project.
  for (let i = 0; i < games.length; i++) {
    const g = games[i]
    if (g.released) {
      if (g.sales) {
        const wsr = g.weeksSinceRelease ?? 0
        const sold = g.sales.sold ?? g.sales.launchDay
        // Keep selling until we reach the projected lifetime total.
        if (sold < g.sales.lifetime) {
          // Shipped bugs eat into ongoing sales and slowly cost you fans until
          // they are patched out.
          const bugPenalty = clamp(1 - (g.bugs ?? 0) * 0.02, 0.4, 1)
          // Walk the precomputed sales plan so actual copies sold (and the
          // revenue earned) converge to the displayed lifetime estimate.
          const planned = g.sales.plan?.[wsr]
          const rawUnits = planned != null ? planned : Math.round(g.sales.weekly * (1 - wsr / 30))
          let units = Math.max(0, Math.round(rawUnits * bugPenalty))
          units = Math.min(units, g.sales.lifetime - sold)
          const perUnit = g.sales.revenue / Math.max(1, g.sales.lifetime)
          const weekRevenue = Math.round(units * perUnit * diff.revenueMult)
          money += weekRevenue
          fans += Math.round(g.sales.fansGained * 0.05 * bugPenalty)
          if ((g.bugs ?? 0) > 6) fans -= Math.round((g.bugs ?? 0) * 8)
          games[i] = {
            ...g,
            weeksSinceRelease: wsr + 1,
            sales: {
              ...g.sales,
              sold: sold + units,
              revenueToDate: (g.sales.revenueToDate ?? 0) + weekRevenue,
            },
          }
        }
      }
      continue
    }
    const engine = p.engines.find((e) => e.id === g.engineId)
    const engineStats = getEngineStats(engine, p.upgrades)
    const pred = g.sequelOf ? p.games.find((x) => x.id === g.sequelOf) : undefined
    const franchiseBonus = pred?.review ? clamp((pred.review.score - 55) / 4, 0, 25) : 0
    const franchiseMult = pred?.review ? clamp(1 + (pred.review.score - 50) / 120, 1, 1.8) : 1
    const res = advanceProject(g, p.employees, p.upgrades, engineStats, p.research, franchiseBonus)
    games[i] = res.project
    if (res.justReleased && res.review) {
      const pub = PUBLISHING.find((x) => x.id === g.publishing) ?? PUBLISHING[0]
      const sales = computeSales(g, res.review, p, pub, franchiseMult)
      const bugs = computeBugs(g, p.employees, p.upgrades)
      games[i] = { ...games[i], sales, bugs, weeksSinceRelease: 0 }
      const launchRevenue = Math.round((sales.launchDay / Math.max(1, sales.lifetime)) * sales.revenue * diff.revenueMult)
      money += launchRevenue
      const advance = Math.round(g.budget * pub.advanceMult)
      if (advance > 0) money += advance
      // Refunds are a real cost returned to customers — net it out up front so
      // the player's cash flow stays consistent with the reported profit.
      money -= sales.refundCost
      fans += Math.round(sales.fansGained * 0.15)
      xp += 30 + Math.round(res.review.score / 2)
      seasonXpGain += 50
      addNote({
        title: `🎉 ${g.name} released!`,
        body: `Review score: ${res.review.score}/100. Launch day units: ${sales.launchDay.toLocaleString()}.${advance > 0 ? ` Advance: $${advance}.` : ''}`,
        type: 'success',
      })
      if (bugs > 6) {
        addNote({
          title: `🐛 ${g.name} shipped with bugs`,
          body: `Players are reporting ${bugs} major issues. Release a patch to protect sales and reputation.`,
          type: 'warning',
        })
      }
      // Team members gain experience from shipping.
      g.teamMemberIds.forEach((id) => shippedMembers.add(id))
      if (res.review.score >= 70) {
        const yr = 2025 + Math.floor(p.week / 52)
        const cats = ['best_game']
        if (res.review.score >= 80) cats.push('goty')
        if (g.budget < 8000) cats.push('best_indie')
        if (g.genre === 'RPG') cats.push('best_rpg')
        if (g.genre === 'Football' || g.genre === 'Sports') cats.push('best_sports')
        if (p.companyRating >= 70) cats.push('studio')
        for (const c of cats) {
          const label = AWARD_CATEGORIES.find((a) => a.id === c)?.label ?? c
          const won = res.review.score >= 88
          const award: AwardRecord = {
            gameId: g.id,
            gameName: g.name,
            year: yr,
            category: label as AwardRecord['category'],
            won,
          }
          awards.push(award)
          if (won) {
            money += 3000 + res.review.score * 80
            fans += 2000
            xp += 150
            addNote({ title: `🏆 Won ${label}!`, body: `${g.name} took home the award.`, type: 'success' })
          } else {
            addNote({ title: `🎬 Nominated: ${label}`, body: `${g.name} is up for ${label}.`, type: 'info' })
          }
        }
      }
    }
  }

  const week = p.week + 1

  // Employee life: overworked staff lose energy/mood, idle staff recover.
  // Comfortable furniture softens the burnout.
  const activeIds = new Set(
    p.games.filter((g) => !g.released).flatMap((g) => g.teamMemberIds),
  )
  const comfort = upgradeEffect(p.upgrades, 'furniture')
  let employees = p.employees.map((e) => {
    const working = activeIds.has(e.id)
    let energy = e.energy ?? 100
    let mood = e.mood
    if (working) {
      energy = clamp(energy - 9 + (comfort - 1) * 40, 0, 100)
      mood = clamp(mood - (energy < 25 ? 6 : 3) + (comfort - 1) * 30, 0, 100)
    } else {
      energy = clamp(energy + 16, 0, 100)
      mood = clamp(mood + 5 + (comfort - 1) * 20, 0, 100)
    }
    const shippedBonus = shippedMembers.has(e.id) ? Math.round(e.skill < 80 ? 0.75 : 0.3) : 0
    return { ...e, energy, mood, skill: Math.min(100, e.skill + shippedBonus), experience: e.experience + (shippedBonus > 0 ? 1 : 0) }
  })

  // Resignations: badly burnt-out staff (never the founder) may quit.
  const survivors: typeof employees = []
  for (const e of employees) {
    const critical = e.mood < 18 || (e.energy ?? 100) < 8
    if (e.id !== 'emp_self' && critical && Math.random() < 0.35) {
      addNote({
        title: `😞 ${e.name} resigned`,
        body: `Burnout got the better of your ${e.role}. Keep morale up with raises and time off.`,
        type: 'warning',
      })
      continue
    }
    survivors.push(e)
  }
  employees = survivors

  // Loan interest (weekly, 0.3% of outstanding balance).
  if (p.loanBalance > 0) money -= Math.round(p.loanBalance * 0.003)

  // Office rent scales with office size and headcount.
  const officeLvl = upgradeLevel(p.upgrades, 'office')
  const rent = OFFICE_BASE_RENT + officeLvl * OFFICE_RENT_PER_LEVEL + employees.length * OFFICE_RENT_PER_HEAD
  money -= Math.round(rent * diff.expenseMult)

  // Engine licensing royalties.
  for (const rate of Object.values(p.licenses)) money += Math.round(rate * 200)

  // Bankruptcy safety net: if money goes negative, auto-take a loan to cover
  // the deficit plus a small buffer so the player can recover.
  let loanBalance = p.loanBalance ?? 0
  if (money < 0) {
    const deficit = Math.abs(money) + 500
    money += deficit
    loanBalance += deficit
    addNote({
      title: '🏦 Emergency Loan',
      body: `Your studio ran out of cash. An automatic loan of $${deficit.toLocaleString()} was approved.`,
      type: 'warning',
    })
  }

  // Season XP accrual + reset.
  let season = { ...p.season, xp: p.season.xp + 10 + seasonXpGain }
  if (week % SEASON_LENGTH_WEEKS === 0) {
    season = { id: season.id + 1, xp: 0, claimedTiers: [] }
    addNote({ title: `🎟️ Season ${season.id} started!`, body: 'A new battle pass is live — earn XP and claim tiers.', type: 'event' })
  }

  // Weekly market + stock tick.
  const mkt = tickMarket(market.studios, market.trends, week)
  const nextMarket: MarketSnapshot = {
    ...mkt,
    stocks: tickStocks(market.stocks, week),
    games: tickMarketGames(market.games ?? [], week),
  }

  // Occasional events.
  if (week % 8 === 0) addNote(pick(EVENTS))

  // Mission expiry & refresh.
  let missions = p.missions
  if (missions.some((m) => m.expiresAt < week)) missions = generateMissions(week)
  // Progress for cumulative missions is derived from state each week so they
  // can actually be completed (previously `earn`/`fan` missions never moved).
  const totalProfit = games.reduce((s, g) => s + (g.sales?.profit ?? 0), 0)
  missions = missions.map((m) => {
    if (m.type === 'earn') return { ...m, progress: Math.min(m.goal, Math.max(m.progress, Math.round(totalProfit))) }
    if (m.type === 'fan') return { ...m, progress: Math.min(m.goal, Math.max(m.progress, fans)) }
    return m
  })

  let next: PlayerState = {
    ...p,
    money,
    fans,
    xp,
    week,
    games,
    employees,
    missions,
    awards,
    season,
    _rp: rp,
    loanBalance,
    notifications: [...notifications, ...p.notifications].slice(0, 50),
  }

  next.studioValue = computeStudioValue(next)
  next.companyRating = computeCompanyRating(next)

  while (next.xp >= xpForLevel(next.level)) {
    next.xp -= xpForLevel(next.level)
    next.level += 1
    addNote({ title: `⬆ Level ${next.level}!`, body: 'Your studio is growing in reputation.', type: 'success' })
  }

  const newly = checkAchievements(next)
  for (const id of newly) {
    const def = getAchievement(id)
    if (def) {
      next.money += def.reward.money ?? 0
      next.xp += def.reward.xp ?? 0
      next.fans += def.reward.fans ?? 0
      addNote({ title: `🏅 ${def.name}`, body: def.description, type: 'success' })
    }
  }

  if (week % 4 === 0) {
    next.history = {
      revenue: [...next.history.revenue, money].slice(-40),
      fans: [...next.history.fans, fans].slice(-40),
      studioValue: [...next.history.studioValue, next.studioValue].slice(-40),
      weeks: [...next.history.weeks, week].slice(-40),
    }
  }

  // Occasionally surface an interactive crisis/decision event. Don't stack
  // events — only roll when none is already pending.
  if (week % 13 === 0 && !next.pendingEvent) {
    const ev = generateEvent()
    next.pendingEvent = ev
    notifications.push(
      mkNote({ title: '⚠️ ' + ev.title, body: 'A decision is waiting for you in the studio.', type: 'warning' }),
    )
  }

  // Rebuild notifications to capture level-up / achievement / event notes
  // that were generated after the initial `next` construction.
  next.notifications = [...notifications, ...p.notifications].slice(0, 50)

  return { player: next, market: nextMarket, notes: notifications }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [market, setMarket] = useState<{ studios: AIStudio[]; trends: MarketTrends; stocks: Stock[]; games: MarketGame[] }>(() => ({
    ...createMarket(),
    stocks: createStocks(1),
    games: generateMarketGames(1),
  }))
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const [autoPlay, setAutoPlay] = useState(true)
  const [autoSpeed, setAutoSpeed] = useState(120000)
  const marketRef = useRef(market)
  const playerRef = useRef(player)
  const advancing = useRef(false)
  const saveTimer = useRef<number | null>(null)

  // Keep refs in sync so multi-week fast-forward reads fresh data.
  useEffect(() => {
    marketRef.current = market
  }, [market])
  useEffect(() => {
    playerRef.current = player
  }, [player])

  // Load player when auth user is ready.
  useEffect(() => {
    let cancelled = false
    if (!user) {
      setPlayer(null)
      setLoading(false)
      return
    }
    setLoading(true)
    loadPlayer(user.uid).then((p) => {
      if (cancelled) return
      if (p) {
        // Migrate older saves: backfill fields added in later updates so the
        // simulation never hits missing arrays/objects.
        const research = Array.isArray(p.research) ? p.research : []
        const existing = new Set(research.map((r) => r.id))
        const mergedResearch = [
          ...research,
          ...RESEARCH_TREE.filter((r) => !existing.has(r.id)).map((r) => ({ id: r.id, unlocked: false })),
        ]
        const migrated: PlayerState = {
          ...p,
          research: mergedResearch,
          awards: Array.isArray(p.awards) ? p.awards : [],
          upgrades: Array.isArray(p.upgrades) ? p.upgrades : [],
          engines: Array.isArray(p.engines) ? p.engines : [],
          games: (Array.isArray(p.games) ? p.games : []).map((g) => ({
            ...g,
            platforms: Array.isArray(g.platforms) && g.platforms.length
              ? g.platforms
              : [(g as unknown as { platform?: Platform }).platform ?? 'Steam'],
            tags: Array.isArray(g.tags) ? g.tags : [],
          })),
          employees: (Array.isArray(p.employees) ? p.employees : []).map((e) => ({
            ...e,
            energy: e.energy ?? 100,
          })),
          missions: Array.isArray(p.missions) ? p.missions : [],
          notifications: Array.isArray(p.notifications) ? p.notifications : [],
          achievements: Array.isArray(p.achievements) ? p.achievements : [],
          licenses: p.licenses ?? {},
          stocks: p.stocks ?? {},
          loanBalance: p.loanBalance ?? 0,
          season: p.season ?? { id: 1, xp: 0, claimedTiers: [] },
          history: p.history ?? { revenue: [0], fans: [0], studioValue: [p.studioValue ?? 0], weeks: [p.week ?? 1] },
        }
        setPlayer(migrated)
      }
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  // Debounced persistence.
  useEffect(() => {
    if (!player) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      savePlayer(player)
      saveLeaderboardEntry({
        uid: player.uid,
        username: player.username,
        avatar: player.avatar,
        studioValue: player.studioValue,
        fans: player.fans,
        level: player.level,
        country: player.country,
      })
    }, 600)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [player])

  const setupProfile = useCallback(
    (username: string, avatar: string, country: string, difficulty: Difficulty = 'medium') => {
      if (!user) return
      const cfg = DIFFICULTY[difficulty]
      const initial = createInitialPlayer(user.uid, username, avatar, country, difficulty)
      initial.money = cfg.startMoney
      initial.studioValue = cfg.startMoney
      setPlayer(initial)
    },
    [user],
  )

  const notify = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const note = mkNote(n)
    setPlayer((p) => (p ? withNotes(p, note) : p))
  }, [])

  const markNotificationsRead = useCallback(() => {
    setPlayer((p) =>
      p ? { ...p, notifications: p.notifications.map((n) => (n.read ? n : { ...n, read: true })) } : p,
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setPlayer((p) => (p ? { ...p, notifications: [] } : p))
  }, [])

  const createGame = useCallback(
    (input: CreateGameInput): string => {
      const id = uid('game')
      setPlayer((p) => {
        if (!p) return p
        const cost = input.budget + input.marketingBudget
        if (p.money < cost) {
          return withNotes(p, mkNote({ title: 'Not enough cash', body: 'You need more money for this production.', type: 'warning' }))
        }
        const project: GameProject = {
          id,
          name: input.name || randomGameName(),
          genre: input.genre,
          theme: input.theme,
          platforms: input.platforms?.length ? input.platforms : ['Steam'],
          tags: input.tags ?? [],
          engineId: input.engineId,
          budget: input.budget,
          marketingBudget: input.marketingBudget,
          devTimeWeeks: input.devTimeWeeks,
          publishing: input.publishing,
          isSequel: input.isSequel ?? false,
          sequelOf: input.sequelOf,
          phase: 'Concept',
          progress: 0,
          weeksSpent: 0,
          teamMemberIds: input.teamMemberIds,
          createdAt: Date.now(),
          released: false,
          hype: 0,
          campaigns: [],
          bugs: 0,
          patches: 0,
          dlcCount: 0,
        }
        const missions = p.missions.map((m) =>
          m.type === 'release' ? { ...m, progress: Math.min(m.goal, m.progress + 1) } : m,
        )
        const note = mkNote({
          title: `🚧 ${project.name} in production`,
          body: `${project.genre} · ${project.theme} · ${project.platforms.join(', ')}. Dev time ${project.devTimeWeeks} weeks.`,
          type: 'info',
        })
        return withNotes(
          { ...p, money: p.money - cost, games: [project, ...p.games], missions },
          note,
        )
      })
      return id
    },
    [],
  )

  const hireEmployee = useCallback(
    (role: EmployeeRole): Employee | null => {
      const r = randomEmployeeForRole(role)
      const emp: Employee = {
        id: uid('emp'),
        name: r.name,
        role,
        level: r.level,
        salary: r.salary,
        experience: 0,
        mood: 75,
        energy: 100,
        productivity: 60,
        skill: r.skill,
        specialization: 'General',
        hiredAt: Date.now(),
      }
      let created: Employee | null = null
      setPlayer((p) => {
        if (!p) return p
        const maxEmp = upgradeEffect(p.upgrades, 'office')
        if (p.employees.length >= maxEmp) {
          return withNotes(p, mkNote({ title: 'Office full', body: 'Upgrade your office to hire more staff.', type: 'warning' }))
        }
        const hireCost = 50
        if (p.money < hireCost) {
          return withNotes(p, mkNote({ title: 'Not enough cash', body: `Hiring costs ${formatMoney(hireCost)} upfront.`, type: 'warning' }))
        }
        created = emp
        const missions = p.missions.map((m) =>
          m.type === 'hire' ? { ...m, progress: Math.min(m.goal, m.progress + 1) } : m,
        )
        const note = mkNote({ title: `🧑‍💻 Hired ${emp.name}`, body: `${ROLE_LABELS[role]} joined your studio. Salary $${emp.salary}/wk.`, type: 'success' })
        return withNotes(
          { ...p, money: p.money - hireCost, employees: [...p.employees, emp], missions, season: { ...p.season, xp: p.season.xp + 20 } },
          note,
        )
      })
      return created
    },
    [],
  )

  const fireEmployee = useCallback((id: string) => {
    if (id === 'emp_self') return
    setPlayer((p) => (p ? { ...p, employees: p.employees.filter((e) => e.id !== id) } : p))
  }, [])

  const trainEmployee = useCallback((id: string) => {
    setPlayer((p) => {
      if (!p) return p
      const e = p.employees.find((x) => x.id === id)
      if (!e) return p
      const cost = 800
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: 'Training costs $800', body: 'Not enough cash.', type: 'warning' }))
      }
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          employees: p.employees.map((x) =>
            x.id === id
              ? { ...x, skill: Math.min(100, x.skill + 3), experience: x.experience + 1, mood: Math.max(0, x.mood - 4) }
              : x,
          ),
        },
        mkNote({ title: `📚 Trained ${e.name}`, body: 'Skill improved by +3.', type: 'success' }),
      )
    })
  }, [])

  const promoteEmployee = useCallback((id: string) => {
    setPlayer((p) => {
      if (!p) return p
      const e = p.employees.find((x) => x.id === id)
      if (!e) return p
      const cost = 1500 * e.level
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: `Promotion costs $${cost}`, body: 'Not enough cash.', type: 'warning' }))
      }
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          employees: p.employees.map((x) =>
            x.id === id
              ? { ...x, level: x.level + 1, skill: Math.min(100, x.skill + 5), salary: Math.round(x.salary * 1.12) }
              : x,
          ),
        },
        mkNote({ title: `⭐ Promoted ${e.name}`, body: `Now level ${e.level + 1}.`, type: 'success' }),
      )
    })
  }, [])

  const giveRaise = useCallback((id: string) => {
    setPlayer((p) => {
      if (!p) return p
      const e = p.employees.find((x) => x.id === id)
      if (!e) return p
      const cost = Math.max(400, Math.round(e.salary * 4))
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: `Raise costs $${cost}`, body: 'Not enough cash.', type: 'warning' }))
      }
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          employees: p.employees.map((x) =>
            x.id === id
              ? { ...x, salary: Math.round(x.salary * 1.15) + 20, mood: Math.min(100, x.mood + 25) }
              : x,
          ),
        },
        mkNote({ title: `💸 Raise for ${e.name}`, body: 'Morale boosted!', type: 'success' }),
      )
    })
  }, [])

  const giveVacation = useCallback((id: string) => {
    setPlayer((p) => {
      if (!p) return p
      const e = p.employees.find((x) => x.id === id)
      if (!e) return p
      const cost = 600
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: 'Time off costs $600', body: 'Not enough cash.', type: 'warning' }))
      }
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          employees: p.employees.map((x) =>
            x.id === id ? { ...x, energy: 100, mood: Math.min(100, x.mood + 35) } : x,
          ),
        },
        mkNote({ title: `🌴 ${e.name} took time off`, body: 'They come back refreshed.', type: 'success' }),
      )
    })
  }, [])

  const runCampaign = useCallback((gameId: string, campaignId: string) => {
    setPlayer((p) => {
      if (!p) return p
      const g = p.games.find((x) => x.id === gameId)
      const def = CAMPAIGNS.find((c) => c.id === campaignId)
      if (!g || !def) return p
      if (g.released) {
        return withNotes(p, mkNote({ title: 'Already released', body: 'Campaigns only work before launch.', type: 'warning' }))
      }
      if (p.money < def.cost) {
        return withNotes(p, mkNote({ title: 'Not enough cash', body: `${def.name} costs $${def.cost}.`, type: 'warning' }))
      }
      return withNotes(
        {
          ...p,
          money: p.money - def.cost,
          games: p.games.map((x) =>
            x.id === gameId
              ? { ...x, hype: clamp((x.hype ?? 0) + def.hype, 0, 100), campaigns: [...(x.campaigns ?? []), def.id] }
              : x,
          ),
        },
        mkNote({ title: `${def.icon} ${def.name}`, body: `Hype rising for ${g.name}!`, type: 'success' }),
      )
    })
  }, [])

  const patchGame = useCallback((gameId: string) => {
    setPlayer((p) => {
      if (!p) return p
      const g = p.games.find((x) => x.id === gameId)
      if (!g || !g.released) return p
      const bugs = g.bugs ?? 0
      if (bugs <= 0) {
        return withNotes(p, mkNote({ title: 'No bugs to fix', body: `${g.name} is already stable.`, type: 'info' }))
      }
      const cost = 500 + bugs * 120
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: `Patch costs $${cost}`, body: 'Not enough cash.', type: 'warning' }))
      }
      const fixed = Math.min(bugs, Math.max(4, Math.round(bugs * 0.7)))
      const remaining = bugs - fixed
      const bump = remaining === 0 && g.review ? Math.min(3, 100 - g.review.score) : 0
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          fans: p.fans + fixed * 40,
          games: p.games.map((x) =>
            x.id === gameId
              ? {
                  ...x,
                  bugs: remaining,
                  patches: (x.patches ?? 0) + 1,
                  review: x.review ? { ...x.review, score: Math.min(100, x.review.score + bump) } : x.review,
                }
              : x,
          ),
        },
        mkNote({
          title: `🩹 Patched ${g.name}`,
          body: `Fixed ${fixed} bugs.${bump > 0 ? ` Review nudged +${bump}.` : ''}`,
          type: 'success',
        }),
      )
    })
  }, [])

  const releaseDLC = useCallback((gameId: string) => {
    setPlayer((p) => {
      if (!p) return p
      const g = p.games.find((x) => x.id === gameId)
      if (!g || !g.released || !g.sales) return p
      const cost = Math.round(g.budget * 0.4) + 1000
      if (p.money < cost) {
        return withNotes(p, mkNote({ title: `DLC costs $${cost}`, body: 'Not enough cash.', type: 'warning' }))
      }
      const quality = (g.review?.score ?? 60) / 100
      const revenue = Math.round(g.sales.lifetime * quality * 6)
      const fansGain = Math.round(g.sales.fansGained * 0.3)
      return withNotes({
        ...p,
        money: p.money - cost + revenue,
        fans: p.fans + fansGain,
        games: p.games.map((x) =>
          x.id === gameId && x.sales
            ? {
                ...x,
                dlcCount: (x.dlcCount ?? 0) + 1,
                weeksSinceRelease: Math.max(0, (x.weeksSinceRelease ?? 0) - 8),
                sales: {
                  ...x.sales,
                  // DLC revives the sales curve: more copies to sell + revenue.
                  lifetime: Math.round(x.sales.lifetime * 1.25),
                  revenue: x.sales.revenue + revenue,
                  revenueToDate: (x.sales.revenueToDate ?? 0) + revenue,
                },
              }
            : x,
        ),
      },
      mkNote({
        title: `📦 DLC for ${g.name}`,
        body: `New content earned $${revenue.toLocaleString()} and revived interest.`,
        type: 'success',
      }))
    })
  }, [])

  const buyUpgrade = useCallback(
    (id: string): boolean => {
      let ok = false
      setPlayer((p) => {
        if (!p) return p
        const def = UPGRADES.find((u) => u.id === id)
        if (!def) return p
        const lvl = upgradeLevel(p.upgrades, id)
        if (lvl >= def.maxLevel) {
          return withNotes(p, mkNote({ title: 'Max level', body: `${def.name} is already maxed.`, type: 'warning' }))
        }
        const cost = Math.round(def.baseCost * Math.pow(def.costGrowth, lvl))
        if (p.money < cost) {
          return withNotes(p, mkNote({ title: 'Not enough cash', body: `${def.name} costs $${cost}.`, type: 'warning' }))
        }
        ok = true
        const upgrades = p.upgrades.filter((u) => u.id !== id)
        upgrades.push({ id, level: lvl + 1 })
        const missions = p.missions.map((m) =>
          m.type === 'upgrade' ? { ...m, progress: Math.min(m.goal, m.progress + 1) } : m,
        )
        return withNotes(
          { ...p, money: p.money - cost, upgrades, missions, season: { ...p.season, xp: p.season.xp + 20 } },
          mkNote({ title: '🏢 Upgrade complete', body: `${def.name} is now level ${lvl + 1}.`, type: 'success' }),
        )
      })
      return ok
    },
    [],
  )

  const researchNode = useCallback(
    (id: string): boolean => {
      let ok = false
      setPlayer((p) => {
        if (!p) return p
        const def = RESEARCH_TREE.find((r) => r.id === id)
        if (!def) return p
        const node = p.research.find((r) => r.id === id)
        if (node?.unlocked) return p
        if (!def.prereq.every((pr) => p.research.find((r) => r.id === pr)?.unlocked)) {
          return withNotes(p, mkNote({ title: 'Locked', body: 'Unlock prerequisites first.', type: 'warning' }))
        }
        // Cost is paid in accumulated research points.
        const rp = p._rp ?? 0
        if (rp < def.cost) {
          return withNotes(p, mkNote({ title: 'Not enough research', body: `Need ${def.cost} RP (have ${Math.floor(rp)}).`, type: 'warning' }))
        }
        ok = true
        const research = p.research.map((r) => (r.id === id ? { ...r, unlocked: true } : r))
        const missions = p.missions.map((m) =>
          m.type === 'research' ? { ...m, progress: Math.min(m.goal, m.progress + 1) } : m,
        )
        return withNotes(
          { ...p, research, _rp: rp - def.cost, missions, season: { ...p.season, xp: p.season.xp + 50 } },
          mkNote({ title: '🔬 Research complete', body: `${def.name} unlocked!`, type: 'success' }),
        )
      })
      return ok
    },
    [],
  )

  const createEngine = useCallback(
    (name: string, stats: Omit<CustomEngine, 'id' | 'version' | 'licensedTo' | 'name'>) => {
      setPlayer((p) => {
        if (!p) return p
        const cost = 4000
        if (p.money < cost) {
          return withNotes(p, mkNote({ title: 'Not enough cash', body: 'Engine creation costs $4,000.', type: 'warning' }))
        }
        const engine: CustomEngine = { ...stats, id: uid('eng'), version: 1, licensedTo: [], name }
        return withNotes(
          { ...p, money: p.money - cost, engines: [...p.engines, engine] },
          mkNote({ title: '⚙️ Engine built', body: `${name} is ready to use.`, type: 'success' }),
        )
      })
    },
    [],
  )

  const claimLoginReward = useCallback((): number => {
    let reward = 0
    setPlayer((p) => {
      if (!p) return p
      const today = new Date().toDateString()
      if (p._lastClaimDay === today) return p
      // streak handling
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = p._lastClaimDay === yesterday ? p.streak + 1 : 1
      reward = loginRewardForStreak(streak)
      return {
        ...p,
        money: p.money + reward,
        streak,
        _lastClaimDay: today,
        xp: p.xp + 10,
      }
    })
    return reward
  }, [])

  const setAvatar = useCallback((avatar: string) => {
    setPlayer((p) => (p ? { ...p, avatar } : p))
  }, [])

  const setCountry = useCallback((country: string) => {
    setPlayer((p) => (p ? { ...p, country } : p))
  }, [])

  const resetGame = useCallback(() => {
    if (!user) return
    const fresh = createInitialPlayer(user.uid, player?.username ?? 'Studio', player?.avatar ?? '🦊', player?.country ?? 'USA')
    setPlayer(fresh)
  }, [user, player])

  // ----- Economy: loans -----
  const takeLoan = useCallback(
    (amount: number) => {
      setPlayer((p) => {
        if (!p) return p
        if (amount <= 0) return p
        return withNotes(
          { ...p, money: p.money + amount, loanBalance: p.loanBalance + amount },
          mkNote({ title: '🏦 Loan approved', body: `You borrowed $${amount.toLocaleString()}. Repay it with interest.`, type: 'info' }),
        )
      })
    },
    [],
  )

  const repayLoan = useCallback(
    (amount: number) => {
      setPlayer((p) => {
        if (!p) return p
        const pay = Math.min(amount, p.loanBalance, p.money)
        if (pay <= 0) return p
        return { ...p, money: p.money - pay, loanBalance: p.loanBalance - pay }
      })
    },
    [],
  )

  // Acquire a competitor studio (M&A): pay a premium on their value to absorb
  // their fans, a chunk of their worth, and sometimes poach a star employee.
  const acquireStudio = useCallback((studioId: string): boolean => {
    let ok = false
    const studio = marketRef.current.studios.find((s) => s.id === studioId)
    if (!studio) return false
    const cost = Math.round(studio.value * 0.6)
    setPlayer((p) => {
      if (!p) return p
      if (p.money < cost) {
        return withNotes(
          p,
          mkNote({ title: 'Not enough cash', body: `Acquiring ${studio.name} needs ${formatMoney(cost)}.`, type: 'warning' }),
        )
      }
      ok = true
      const maxEmp = upgradeEffect(p.upgrades, 'office')
      const canHire = p.employees.length < maxEmp
      const role = pick(['Programmer', 'Artist', 'Designer', 'Producer'] as EmployeeRole[])
      const hired = canHire ? randomEmployeeForRole(role) : null
      const newEmp: Employee | null = hired
        ? {
            id: uid('emp'),
            name: hired.name,
            role,
            level: hired.level,
            salary: hired.salary,
            experience: 0,
            mood: 80,
            energy: 100,
            productivity: 60,
            skill: hired.skill,
            specialization: 'General',
            hiredAt: Date.now(),
          }
        : null
      return withNotes(
        {
          ...p,
          money: p.money - cost,
          fans: p.fans + Math.round(studio.fans * 0.6),
          studioValue: p.studioValue + Math.round(studio.value * 0.4),
          employees: newEmp ? [...p.employees, newEmp] : p.employees,
        },
        mkNote({
          title: `🤝 Acquired ${studio.name}`,
          body: `Absorbed ${formatNumber(Math.round(studio.fans * 0.6))} fans${newEmp ? ` and poached ${newEmp.name}.` : '.'}`,
          type: 'success',
        }),
      )
    })
    if (ok) {
      setMarket((m) => ({ ...m, studios: m.studios.filter((s) => s.id !== studioId) }))
    }
    return ok
  }, [])

  // Resolve an interactive crisis/decision event by applying the chosen outcome.
  const resolveEvent = useCallback((choiceIndex: number) => {
    setPlayer((p) => {
      if (!p || !p.pendingEvent) return p
      const ev = p.pendingEvent
      const choice = ev.choices[choiceIndex]
      if (!choice) return p
      const next: PlayerState = {
        ...p,
        money: p.money + (choice.money ?? 0),
        fans: Math.max(0, p.fans + (choice.fans ?? 0)),
        xp: p.xp + (choice.xp ?? 0),
        companyRating: clamp(p.companyRating + (choice.rating ?? 0), 0, 100),
        pendingEvent: undefined,
      }
      return withNotes(next, mkNote({ title: ev.title, body: choice.result, type: choice.money && choice.money < 0 ? 'warning' : 'info' }))
    })
  }, [])

  // ----- Economy: stock market -----
  const buyStock = useCallback(
    (symbol: string, shares: number) => {
      setPlayer((p) => {
        if (!p) return p
        const stock = market.stocks.find((s) => s.symbol === symbol)
        if (!stock || shares <= 0) return p
        const cost = shares * stock.price
        if (p.money < cost) {
          return withNotes(p, mkNote({ title: 'Not enough cash', body: `Need $${cost.toLocaleString()} to buy.`, type: 'warning' }))
        }
        const held = p.stocks[symbol]
        const totalShares = (held?.shares ?? 0) + shares
        const avgPrice = held
          ? Math.round((held.avgPrice * held.shares + cost) / totalShares)
          : stock.price
        return {
          ...p,
          money: p.money - cost,
          stocks: { ...p.stocks, [symbol]: { shares: totalShares, avgPrice } },
        }
      })
    },
    [market],
  )

  const sellStock = useCallback(
    (symbol: string, shares: number) => {
      setPlayer((p) => {
        if (!p) return p
        const stock = market.stocks.find((s) => s.symbol === symbol)
        const held = p.stocks[symbol]
        if (!stock || !held || shares <= 0) return p
        const sell = Math.min(shares, held.shares)
        const proceeds = sell * stock.price
        const remaining = held.shares - sell
        const stocks = { ...p.stocks }
        if (remaining <= 0) delete stocks[symbol]
        else stocks[symbol] = { ...held, shares: remaining }
        return { ...p, money: p.money + proceeds, stocks }
      })
    },
    [market],
  )

  // ----- Engine licensing -----
  const licenseEngine = useCallback(
    (engineId: string, rate: number) => {
      setPlayer((p) => {
        if (!p) return p
        const licenses = { ...p.licenses }
        if (rate <= 0) delete licenses[engineId]
        else licenses[engineId] = rate
        const engines = p.engines.map((e) =>
          e.id === engineId
            ? { ...e, licensedTo: rate > 0 ? [...new Set([...e.licensedTo, 'market'])] : e.licensedTo.filter((x) => x !== 'market') }
            : e,
        )
        return withNotes(
          { ...p, licenses, engines },
          mkNote({
            title: rate > 0 ? '📜 Engine licensed' : 'License revoked',
            body: rate > 0 ? `Earning ${rate}% royalties weekly.` : 'Royalties stopped.',
            type: 'info',
          }),
        )
      })
    },
    [],
  )

  // ----- Season / Battle Pass -----
  const claimSeasonTier = useCallback((tier: number) => {
    let claimed = false
    setPlayer((p) => {
      if (!p) return p
      const def = SEASON_TIERS.find((t) => t.tier === tier)
      if (!def) return p
      if (p.season.xp < def.xpNeeded || p.season.claimedTiers.includes(tier)) return p
      claimed = true
      return {
        ...p,
        money: p.money + (def.reward.money ?? 0),
        fans: p.fans + (def.reward.fans ?? 0),
        xp: p.xp + (def.reward.xp ?? 0),
        season: { ...p.season, claimedTiers: [...p.season.claimedTiers, tier] },
      }
    })
    return claimed
  }, [])

  // Fast-forward the simulation by n weeks. Runs the pure simulation OUTSIDE
  // setState (using refs) so React StrictMode's double-invocation can never
  // advance the economy or fire notifications twice.
  const advanceWeeks = useCallback((n: number) => {
    const weeks = Math.max(1, Math.floor(n))
    const base = playerRef.current
    if (!base || advancing.current) return
    advancing.current = true
    try {
      let curPlayer = base
      let curMarket = marketRef.current
      const allNotes: Notification[] = []
      const releases: { name: string; score: number }[] = []
      const startWeek = base.week
      const startMoney = base.money
      const startFans = base.fans
      const startXpTotal = base.xp

      for (let i = 0; i < weeks; i++) {
        const r = simulateOneWeek(curPlayer, curMarket)
        curPlayer = r.player
        curMarket = r.market
        allNotes.push(...r.notes)
        for (const note of r.notes) {
          const m = /🎉 (.+) released!/.exec(note.title)
          if (m) {
            const scoreMatch = /Review score: (\d+)/.exec(note.body)
            releases.push({ name: m[1], score: scoreMatch ? Number(scoreMatch[1]) : 0 })
          }
        }
      }

      playerRef.current = curPlayer
      marketRef.current = curMarket
      setMarket(curMarket)
      setPlayer(curPlayer)
      // Only surface the summary modal for multi-week fast-forwards.
      if (weeks > 1) {
        setWeeklyReport({
          fromWeek: startWeek,
          toWeek: curPlayer.week,
          weeks,
          moneyDelta: curPlayer.money - startMoney,
          fansDelta: curPlayer.fans - startFans,
          xpDelta: curPlayer.xp - startXpTotal,
          releases,
          notes: allNotes.slice(0, 60),
        })
      }
    } finally {
      advancing.current = false
    }
  }, [])

  const advanceWeek = useCallback(() => advanceWeeks(1), [advanceWeeks])

  const dismissWeeklyReport = useCallback(() => setWeeklyReport(null), [])

  const toggleAutoPlay = useCallback(() => setAutoPlay((v) => !v), [])

  // Auto-advance: tick one week on a timer while enabled. Pauses when a
  // weekly report is open so the player can read it.
  useEffect(() => {
    if (!autoPlay || !player) return
    const t = window.setInterval(() => {
      // Pause the auto-simulation while a decision event is waiting.
      if (playerRef.current?.pendingEvent) return
      advanceWeeks(1)
    }, autoSpeed)
    return () => window.clearInterval(t)
  }, [autoPlay, autoSpeed, player?.uid, advanceWeeks])

  // Helper to push market updates outside the player setState.
  const globalRank = useMemo(() => {
    if (!player) return 0
    return rankAmongStudios(market.studios, player.studioValue).rank
  }, [player, market.studios])

  const value: GameContextValue = {
    player,
    loading,
    market,
    createGame,
    advanceWeek,
    advanceWeeks,
    weeklyReport,
    dismissWeeklyReport,
    autoPlay,
    toggleAutoPlay,
    autoSpeed,
    setAutoSpeed,
    hireEmployee,
    fireEmployee,
    trainEmployee,
    promoteEmployee,
    giveRaise,
    giveVacation,
    runCampaign,
    patchGame,
    releaseDLC,
    buyUpgrade,
    researchNode,
    createEngine,
    claimLoginReward,
    notify,
    markNotificationsRead,
    clearNotifications,
    resetGame,
    setupProfile,
    setAvatar,
    setCountry,
    takeLoan,
    repayLoan,
    acquireStudio,
    resolveEvent,
    buyStock,
    sellStock,
    licenseEngine,
    claimSeasonTier,
    globalRank,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
