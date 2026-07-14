import type {
  CustomEngine,
  Employee,
  GameProject,
  Platform,
  PlayerState,
  Review,
  ReviewComment,
  SalesData,
  StudioUpgrade,
} from '../types'
import {
  GENRE_THEME_AFFINITY,
  PLATFORM_DEV_COST,
  PLATFORM_MULT,
  PLATFORM_PRICE,
  PUBLISHING,
  UPGRADES,
} from '../config/gameConfig'
import type { PublishingDef } from '../config/gameConfig'
import { clamp, pick, rand } from './format'

export function upgradeLevel(upgrades: StudioUpgrade[], id: string): number {
  return upgrades.find((u) => u.id === id)?.level ?? 0
}

export function upgradeEffect(upgrades: StudioUpgrade[], id: string): number {
  const def = UPGRADES.find((u) => u.id === id)
  const lvl = upgradeLevel(upgrades, id)
  return def ? def.effect(lvl) : 1
}

// Cost to upgrade a custom engine scales with its current version, giving a
// long-term money sink that steadily improves the games built on it.
export function engineUpgradeCost(version: number): number {
  return 3000 * Math.max(1, version)
}

// Returns engine stats for either a custom engine or the studio's built-in engine.
export function getEngineStats(
  engine: CustomEngine | undefined,
  upgrades: StudioUpgrade[],
): { graphics: number; physics: number; ai: number; networking: number; optimization: number; tools: number } {
  if (engine) {
    return {
      graphics: engine.graphics,
      physics: engine.physics,
      ai: engine.ai,
      networking: engine.networking,
      optimization: engine.optimization,
      tools: engine.tools,
    }
  }
  // Built-in engine scales with studio computers / servers.
  const comp = upgradeEffect(upgrades, 'computers')
  const net = upgradeEffect(upgrades, 'servers')
  const base = 30 * comp
  return {
    graphics: clamp(base, 0, 100),
    physics: clamp(base * 0.8, 0, 100),
    ai: clamp(base * 0.7, 0, 100),
    networking: clamp(20 * net, 0, 100),
    optimization: clamp(40 * comp, 0, 100),
    tools: clamp(35 * comp, 0, 100),
  }
}

function roleKey(role: Employee['role']): string {
  return role
}

const KEY_ROLES: Employee['role'][] = [
  'Programmer',
  'Artist',
  'Designer',
  'Tester',
  'Writer',
]

export function recommendedBudget(p: GameProject): number {
  const plats = p.platforms?.length ? p.platforms : (['Steam'] as Platform[])
  const pd = Math.max(...plats.map((pl) => PLATFORM_DEV_COST[pl] ?? 1))
  return Math.round(p.devTimeWeeks * 1600 * pd)
}

// Combined reach multiplier for a set of stores: the strongest store plus a
// modest bonus for each extra store a game ships on.
function combinePlatformMult(platforms: Platform[]): number {
  if (!platforms?.length) return 1
  const mults = platforms.map((pl) => PLATFORM_MULT[pl] ?? 1)
  const max = Math.max(...mults)
  const extra = (platforms.length - 1) * 0.12
  return Math.min(2.4, max + extra)
}

// Average retail price across the selected stores.
function avgPlatformPrice(platforms: Platform[]): number {
  if (!platforms?.length) return 12
  const prices = platforms.map((pl) => PLATFORM_PRICE[pl] ?? 12)
  return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
}

export function computeReview(
  p: GameProject,
  employees: Employee[],
  engineStats: ReturnType<typeof getEngineStats>,
  upgrades: StudioUpgrade[],
  research: { id: string; unlocked: boolean }[],
  franchiseBonus = 0,
): Review {
  const team = employees.filter((e) => p.teamMemberIds.includes(e.id))
  const avgSkill =
    team.length > 0 ? team.reduce((s, e) => s + e.skill, 0) / team.length : 25
  const covered = KEY_ROLES.filter((r) =>
    team.some((e) => roleKey(e.role) === r),
  ).length
  const teamScore = clamp(avgSkill * 0.82 + (covered / KEY_ROLES.length) * 18)

  const engAvg =
    (engineStats.graphics +
      engineStats.physics +
      engineStats.ai +
      engineStats.networking +
      engineStats.optimization +
      engineStats.tools) /
    6
  let engineScore = clamp(engAvg)
  if (research.find((r) => r.id === '3d')?.unlocked) engineScore += 4
  if (research.find((r) => r.id === 'raytracing')?.unlocked) engineScore += 5
  if (research.find((r) => r.id === 'physics')?.unlocked) engineScore += 4
  engineScore = clamp(engineScore)

  const rec = recommendedBudget(p)
  const budgetRatio = p.budget / rec
  const budgetScore = clamp(35 + budgetRatio * 45)

  const qa = upgradeLevel(upgrades, 'qa')
  const hasTester = team.some((e) => e.role === 'Tester')
  const testingScore = clamp(
    30 + qa * 5 + (hasTester ? 22 : 0) + (p.devTimeWeeks >= 4 ? 12 : 0),
  )

  const mktRatio = p.marketingBudget / (rec * 0.3 + 1)
  const hasMkt = team.some((e) => e.role === 'MarketingManager')
  const marketingScore = clamp(
    14 + mktRatio * 12 + (hasMkt ? 20 : 0),
  )

  let innovation = rand(40, 68)
  if (research.find((r) => r.id === 'ainpc')?.unlocked) innovation += 8
  if (research.find((r) => r.id === 'vr')?.unlocked) innovation += 9
  if (research.find((r) => r.id === 'ar')?.unlocked) innovation += 9
  innovation = clamp(innovation)

  const matched = (GENRE_THEME_AFFINITY[p.genre] ?? []).includes(p.theme)
  const matchScore = matched ? rand(78, 94) : rand(44, 66)

  const weights = {
    team: 0.22,
    engine: 0.15,
    budget: 0.12,
    testing: 0.12,
    marketing: 0.1,
    innovation: 0.14,
    match: 0.15,
  }

  let score =
    teamScore * weights.team +
    engineScore * weights.engine +
    budgetScore * weights.budget +
    testingScore * weights.testing +
    marketingScore * weights.marketing +
    innovation * weights.innovation +
    matchScore * weights.match
  score = clamp(score + franchiseBonus)
  score = clamp(score + rand(-3, 3))

  const criticScore = clamp(score + rand(-6, 6))
  const userScore = clamp(score + rand(-4, 8) - (score > 85 ? 0 : 0))

  const comments = generateComments(score, {
    teamScore,
    engineScore,
    testingScore,
    marketingScore,
    innovation,
    matchScore,
    genre: p.genre,
    theme: p.theme,
  })

  return {
    score: Math.round(score),
    criticScore: Math.round(criticScore),
    userScore: Math.round(userScore),
    comments,
  }
}

function generateComments(
  score: number,
  aspects: Record<string, number | string>,
): ReviewComment[] {
  const outlets = ['PixelPress', 'GameHub', 'IndieDaily', 'ConsoleCast', 'MetaCritic', 'PlayWire']
  const pos = [
    'A masterclass in modern game design.',
    'Captivating from the first minute to the last.',
    'Sets a new bar for the genre.',
    'Gorgeous visuals and tight gameplay.',
    'An unforgettable experience.',
    'Smart, polished and endlessly fun.',
  ]
  const mid = [
    'Solid effort with real moments of brilliance.',
    'Good ideas held back by rough edges.',
    'Fun, but lacks lasting depth.',
    'A respectable entry that could be sharper.',
    'Worth playing, with caveats.',
  ]
  const neg = [
    'Bugs and bland design sink the experience.',
    'A missed opportunity with little polish.',
    'Repetitive and underwhelming.',
    'Promising concept, poor execution.',
    'Hard to recommend in its current state.',
  ]

  const band = score >= 80 ? pos : score >= 55 ? mid : neg
  const count = score >= 80 ? 4 : score >= 55 ? 3 : 3
  const comments: ReviewComment[] = []
  for (let i = 0; i < count; i++) {
    const author = pick(outlets)
    const cScore = clamp(score + rand(-10, 10))
    let text = pick(band)
    if (Number(aspects.engineScore) < 45 && i === 0) text += ' The tech shows its limits.'
    if (Number(aspects.testingScore) < 50 && i === 1) text += ' Needed more QA.'
    if (Number(aspects.marketingScore) < 40 && i === 2) text += ' Deserved better marketing.'
    if (Number(aspects.innovation) > 80 && i === 0) text += ' Genuinely inventive.'
    comments.push({ author, score: Math.round(cScore), text })
  }
  return comments
}

// Number of bugs a game ships with, based on how much testing it received.
export function computeBugs(
  p: GameProject,
  employees: Employee[],
  upgrades: StudioUpgrade[],
): number {
  const team = employees.filter((e) => p.teamMemberIds.includes(e.id))
  const testers = team.filter((e) => e.role === 'Tester').length
  const qa = upgradeLevel(upgrades, 'qa')
  const rec = recommendedBudget(p)
  const budgetRatio = clamp(p.budget / rec, 0.2, 2)
  const base = 22 - testers * 5 - qa * 2.2 - (p.devTimeWeeks >= 4 ? 4 : 0) - (budgetRatio - 1) * 6
  return Math.max(0, Math.round(base + rand(-3, 4)))
}

export function computeSales(
  p: GameProject,
  review: Review,
  player: PlayerState,
  publishing: PublishingDef,
  franchiseMult = 1,
): SalesData {
  const quality = review.score / 100
  // Blend review quality with marketing hype built up during development.
  const hypeMeter = clamp((p.hype ?? 0) / 100 * franchiseMult, 0, 1)
  const hype = clamp((review.comments.length > 0 ? review.score / 100 : 0.4) * 0.7 + hypeMeter * 0.5, 0, 1.2)
  const mktFactor = clamp(0.5 + (p.marketingBudget / (recommendedBudget(p) * 0.3 + 1)) * 0.4 + hypeMeter * 0.35)
  const fanFactor = 1 + Math.min(player.fans, 2_000_000) / 80_000
  const platMult = combinePlatformMult(p.platforms)
  const ratingBoost = 1 + player.companyRating / 200

  const baseUnits =
    Math.pow(quality, 2) *
    9000 *
    platMult *
    (0.55 + hype) *
    mktFactor *
    fanFactor *
    ratingBoost

  const price = avgPlatformPrice(p.platforms)

  const launchDay = Math.round(baseUnits * 0.05)
  const weekly = Math.round(baseUnits * 0.1)
  const monthly = Math.round(baseUnits * 0.32)
  const lifetime = Math.round(baseUnits * (4 + quality * 6))

  const secLvl = upgradeLevel(player.upgrades, 'security')
  const piracyPct = clamp(0.26 - secLvl * 0.03, 0.02, 0.3)

  const revenue = Math.round(lifetime * price * (1 - piracyPct) * publishing.revenueShare)
  const qaLvl = upgradeLevel(player.upgrades, 'qa')
  const refundRate = clamp(0.07 - qaLvl * 0.008, 0.005, 0.1)
  const refunds = Math.round(lifetime * refundRate)
  const refundCost = Math.round(refunds * price * 0.5)

  const totalCost = p.budget + p.marketingBudget
  // Publisher advance is upfront income; refunds are a real cost. Net profit
  // therefore ties exactly to the money the player actually receives.
  const advance = Math.round(p.budget * publishing.advanceMult)
  const profit = revenue + advance - refundCost - totalCost

  const fansGained =
    review.score >= 45
      ? Math.round(lifetime * (quality * 0.0018 + 0.0004) * publishing.fanMult * franchiseMult)
      : -Math.round(lifetime * 0.0006)

  // Build a normalized weekly sales schedule whose units sum to the remaining
  // lifetime total. A launch-week spike plus gradual decay keeps the curve
  // believable, and the simulation just walks this plan so actual copies sold
  // and revenue earned always reconcile with the displayed lifetime estimate.
  const remaining = Math.max(0, lifetime - launchDay)
  const span = Math.max(20, Math.round(remaining / Math.max(1, weekly)))
  const raw: number[] = []
  let rawSum = 0
  for (let w = 0; w < span; w++) {
    const boost = w === 0 ? 2.2 : 1
    const decay = Math.max(0.05, 1 - w / span)
    const wt = boost * decay
    raw.push(wt)
    rawSum += wt
  }
  const plan = raw.map((wt) => Math.round((wt / rawSum) * remaining))
  const diff = remaining - plan.reduce((s, x) => s + x, 0)
  if (plan.length) plan[0] += diff

  const launchRevenue = Math.round((launchDay / Math.max(1, lifetime)) * revenue)

  return {
    launchDay,
    weekly,
    monthly,
    lifetime,
    revenue,
    profit,
    refunds,
    piracyPct: Math.round(piracyPct * 100),
    fansGained,
    refundCost,
    plan,
    sold: launchDay,
    revenueToDate: launchRevenue,
  }
}

// Advance a single project by one in-game week. Returns the updated project
// and a flag indicating whether it just completed (released).
export function advanceProject(
  p: GameProject,
  employees: Employee[],
  upgrades: StudioUpgrade[],
  engineStats: ReturnType<typeof getEngineStats>,
  research: { id: string; unlocked: boolean }[],
  franchiseBonus = 0,
): { project: GameProject; justReleased: boolean; review?: Review; sales?: SalesData } {
  if (p.released) return { project: p, justReleased: false }

  const internet = upgradeEffect(upgrades, 'internet')
  // A tired, unhappy team works slower. Average the assigned team's mood/energy.
  const team = employees.filter((e) => p.teamMemberIds.includes(e.id))
  const teamMorale =
    team.length > 0
      ? team.reduce((s, e) => s + (e.mood * 0.5 + (e.energy ?? 100) * 0.5), 0) / team.length
      : 60
  const moraleFactor = clamp(0.55 + (teamMorale / 100) * 0.6, 0.4, 1.2)
  const speed = 1 * internet * moraleFactor
  // Each phase consumes a portion of devTimeWeeks; for simplicity one phase per
  // (devTimeWeeks / 6) weeks, accelerated by internet upgrade.
  const phaseWeeks = Math.max(0.5, p.devTimeWeeks / 6)

  let progress = p.progress + speed / phaseWeeks
  let phase = p.phase as GameProject['phase']
  let weeksSpent = p.weeksSpent + 1
  let justReleased = false
  let review: Review | undefined
  let sales: SalesData | undefined

  while (progress >= 1) {
    progress -= 1
    const idx = ['Concept', 'Design', 'Programming', 'Art', 'Testing', 'Marketing'].indexOf(
      phase as string,
    )
    if (idx >= 0 && idx < 5) {
      phase = (['Design', 'Programming', 'Art', 'Testing', 'Marketing'] as const)[idx]
    } else {
      // Released.
      phase = 'Released'
      justReleased = true
       review = computeReview(p, employees, engineStats, upgrades, research, franchiseBonus)
      const pub = PUBLISHING.find((x) => x.id === p.publishing) ?? PUBLISHING[0]
      if (pub.ratingBonus) {
        const bumped = clamp(review.score + pub.ratingBonus)
        review = {
          ...review,
          score: Math.round(bumped),
          criticScore: Math.round(clamp(review.criticScore + pub.ratingBonus)),
        }
      }
      break
    }
  }

  const updated: GameProject = {
    ...p,
    phase,
    progress: justReleased ? 1 : progress,
    weeksSpent,
    released: justReleased ? true : p.released,
    releasedAt: justReleased ? Date.now() : p.releasedAt,
    review,
  }
  return { project: updated, justReleased, review, sales }
}

export function computeStudioValue(player: PlayerState): number {
  const gameRevenue = (player.games || []).reduce(
    (s, g) => s + (g.sales?.revenue ?? 0),
    0,
  )
  const upgradesInvested = (player.upgrades || []).reduce((s, u) => {
    const def = UPGRADES.find((d) => d.id === u.id)
    let cost = 0
    if (def) for (let i = 1; i <= u.level; i++) cost += def.baseCost * Math.pow(def.costGrowth, i - 1)
    return s + cost
  }, 0)
  const employeeValue = (player.employees || []).reduce((s, e) => s + e.salary * 8, 0)
  return Math.round(
    player.money * 0.5 + gameRevenue * 0.25 + player.fans * 0.6 + upgradesInvested * 0.4 + employeeValue,
  )
}

export function computeCompanyRating(player: PlayerState): number {
  const released = (player.games || []).filter((g) => g.released && g.review)
  if (released.length === 0) return 10
  const avg = released.reduce((s, g) => s + (g.review?.score ?? 0), 0) / released.length
  // Fan contribution is capped so a huge fanbase can't fully carry the rating,
  // but the formula now lets a great catalogue reach the high 90s.
  const fanPart = Math.min(player.fans / 100_000, 40) * 0.5
  return clamp(avg * 0.85 + fanPart)
}

// Research points earned per week.
export function weeklyResearchPoints(player: PlayerState): number {
  const lab = upgradeEffect(player.upgrades, 'research')
  const researchers = player.employees.filter(
    (e) => e.role === 'Programmer' || e.role === 'Designer',
  ).length
  return Math.round(6 * lab + researchers * 1.5)
}

export function salaryBurn(player: PlayerState): number {
  return player.employees.reduce((s, e) => s + e.salary, 0)
}

export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(1.35, level - 1))
}
