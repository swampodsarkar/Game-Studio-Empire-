import type { Mission } from '../types'

// A large built-in mission pool (~100). Each week the game rotates through a
// few of these so the quest log always has fresh, varied objectives. Types map
// to the existing progress trackers in GameProvider (release/hire/research/
// upgrade increment on the matching action; earn/fan derive from cumulative state).
type Tmpl = Omit<Mission, 'id' | 'progress' | 'expiresAt'>

const P: Tmpl[] = [
  // ── Release ──
  { title: 'Ship It', description: 'Release a new game.', goal: 1, reward: { xp: 80, money: 1000 }, type: 'release' },
  { title: 'Double Feature', description: 'Release 2 games.', goal: 2, reward: { xp: 140, money: 2000 }, type: 'release' },
  { title: 'Triple Threat', description: 'Release 3 games.', goal: 3, reward: { xp: 220, money: 4000 }, type: 'release' },
  { title: 'Studio On Fire', description: 'Release 5 games.', goal: 5, reward: { xp: 400, money: 8000 }, type: 'release' },
  { title: 'Sequel Sprint', description: 'Make a sequel to a hit.', goal: 1, reward: { xp: 120, money: 1500 }, type: 'release' },
  { title: 'Franchise Builder', description: 'Release 2 sequels.', goal: 2, reward: { xp: 240, money: 3500 }, type: 'release' },
  { title: 'Genre Hopper', description: 'Release a game in a new genre.', goal: 1, reward: { xp: 90, money: 1200 }, type: 'release' },
  { title: 'Platform Pioneer', description: 'Ship on a new platform.', goal: 1, reward: { xp: 90, money: 1200 }, type: 'release' },
  { title: 'Blockbuster', description: 'Release a game with 90+ score potential.', goal: 1, reward: { xp: 300, money: 6000 }, type: 'release' },
  { title: 'Seasoned Dev', description: 'Release 10 games total.', goal: 10, reward: { xp: 600, money: 15000 }, type: 'release' },
  { title: 'Quick Turnaround', description: 'Release a game under 4 weeks dev.', goal: 1, reward: { xp: 110, money: 1500 }, type: 'release' },
  { title: 'Big Budget', description: 'Release a game with $100k+ budget.', goal: 1, reward: { xp: 160, money: 2500 }, type: 'release' },
  { title: 'Trendsetter', description: 'Release a game matching the market trend.', goal: 1, reward: { xp: 130, money: 2000 }, type: 'release' },
  { title: 'Marathon Dev', description: 'Release a 12-week dev game.', goal: 1, reward: { xp: 200, money: 4000 }, type: 'release' },
  { title: 'Pocket Hit', description: 'Release a mobile game.', goal: 1, reward: { xp: 100, money: 1300 }, type: 'release' },

  // ── Earn (cumulative profit) ──
  { title: 'Cash Flow', description: 'Earn $20,000 in profit.', goal: 20000, reward: { xp: 120 }, type: 'earn' },
  { title: 'Profit Margin', description: 'Earn $50,000 in profit.', goal: 50000, reward: { xp: 160, money: 2000 }, type: 'earn' },
  { title: 'Money Maker', description: 'Earn $100,000 in profit.', goal: 100000, reward: { xp: 220, money: 4000 }, type: 'earn' },
  { title: 'Six Figures', description: 'Earn $250,000 in profit.', goal: 250000, reward: { xp: 300, money: 6000 }, type: 'earn' },
  { title: 'Quarter Mill', description: 'Earn $500,000 in profit.', goal: 500000, reward: { xp: 380, money: 10000 }, type: 'earn' },
  { title: 'Half Mill Club', description: 'Earn $750,000 in profit.', goal: 750000, reward: { xp: 460, money: 15000 }, type: 'earn' },
  { title: 'Millionaire', description: 'Earn $1,000,000 in profit.', goal: 1000000, reward: { xp: 600, money: 25000 }, type: 'earn' },
  { title: 'Tycoon', description: 'Earn $2,500,000 in profit.', goal: 2500000, reward: { xp: 800, money: 50000 }, type: 'earn' },
  { title: 'Empire', description: 'Earn $5,000,000 in profit.', goal: 5000000, reward: { xp: 1100, money: 100000 }, type: 'earn' },
  { title: 'Mega Corp', description: 'Earn $10,000,000 in profit.', goal: 10000000, reward: { xp: 1500, money: 200000 }, type: 'earn' },
  { title: 'First Sale', description: 'Earn your first $5,000.', goal: 5000, reward: { xp: 80 }, type: 'earn' },
  { title: 'Steady Income', description: 'Earn $10,000 in profit.', goal: 10000, reward: { xp: 90 }, type: 'earn' },
  { title: 'Big Payday', description: 'Earn $150,000 in profit.', goal: 150000, reward: { xp: 260, money: 3000 }, type: 'earn' },
  { title: 'Revenue Stream', description: 'Earn $350,000 in profit.', goal: 350000, reward: { xp: 340, money: 7000 }, type: 'earn' },

  // ── Hire ──
  { title: 'Talent Scout', description: 'Hire 1 employee.', goal: 1, reward: { xp: 50 }, type: 'hire' },
  { title: 'Growing Team', description: 'Hire 2 employees.', goal: 2, reward: { xp: 90 }, type: 'hire' },
  { title: 'Crew Expansion', description: 'Hire 3 employees.', goal: 3, reward: { xp: 150, money: 1500 }, type: 'hire' },
  { title: 'Full Roster', description: 'Hire 5 employees.', goal: 5, reward: { xp: 250, money: 3000 }, type: 'hire' },
  { title: 'Dream Team', description: 'Hire 8 employees.', goal: 8, reward: { xp: 400, money: 6000 }, type: 'hire' },
  { title: 'Recruiter', description: 'Hire 10 employees.', goal: 10, reward: { xp: 500, money: 10000 }, type: 'hire' },
  { title: 'Star Power', description: 'Hire a top-level (Lv5+) employee.', goal: 1, reward: { xp: 160, money: 2500 }, type: 'hire' },
  { title: 'Programmer Onboard', description: 'Hire a programmer.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Artist Onboard', description: 'Hire an artist.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Designer Onboard', description: 'Hire a designer.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Producer Onboard', description: 'Hire a producer.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Big Office', description: 'Hire 15 employees.', goal: 15, reward: { xp: 700, money: 20000 }, type: 'hire' },

  // ── Research ──
  { title: 'Innovate', description: 'Complete a research node.', goal: 1, reward: { xp: 70 }, type: 'research' },
  { title: 'R&D Push', description: 'Complete 2 research nodes.', goal: 2, reward: { xp: 140, money: 1500 }, type: 'research' },
  { title: 'Tech Leap', description: 'Complete 3 research nodes.', goal: 3, reward: { xp: 220, money: 3000 }, type: 'research' },
  { title: 'Lab Rat', description: 'Complete 5 research nodes.', goal: 5, reward: { xp: 360, money: 6000 }, type: 'research' },
  { title: 'Cutting Edge', description: 'Complete 8 research nodes.', goal: 8, reward: { xp: 520, money: 12000 }, type: 'research' },
  { title: 'Graphics Guru', description: 'Unlock a graphics tech.', goal: 1, reward: { xp: 110, money: 2000 }, type: 'research' },
  { title: 'Audio Whiz', description: 'Unlock an audio tech.', goal: 1, reward: { xp: 110, money: 2000 }, type: 'research' },
  { title: 'Engine Smith', description: 'Unlock an engine tech.', goal: 1, reward: { xp: 130, money: 2500 }, type: 'research' },
  { title: 'AI Pioneer', description: 'Unlock an AI tech.', goal: 1, reward: { xp: 150, money: 3000 }, type: 'research' },
  { title: 'Full Tech Tree', description: 'Complete 12 research nodes.', goal: 12, reward: { xp: 700, money: 20000 }, type: 'research' },

  // ── Fan ──
  { title: 'Crowd Pleaser', description: 'Gain 5,000 fans.', goal: 5000, reward: { xp: 90 }, type: 'fan' },
  { title: 'Building Buzz', description: 'Gain 10,000 fans.', goal: 10000, reward: { xp: 120, money: 1000 }, type: 'fan' },
  { title: 'Fan Favorite', description: 'Gain 25,000 fans.', goal: 25000, reward: { xp: 170, money: 2000 }, type: 'fan' },
  { title: 'Cult Following', description: 'Gain 50,000 fans.', goal: 50000, reward: { xp: 240, money: 4000 }, type: 'fan' },
  { title: 'Trending', description: 'Gain 100,000 fans.', goal: 100000, reward: { xp: 320, money: 8000 }, type: 'fan' },
  { title: 'Viral', description: 'Gain 250,000 fans.', goal: 250000, reward: { xp: 420, money: 15000 }, type: 'fan' },
  { title: 'Household Name', description: 'Gain 500,000 fans.', goal: 500000, reward: { xp: 560, money: 30000 }, type: 'fan' },
  { title: 'Global Icon', description: 'Gain 1,000,000 fans.', goal: 1000000, reward: { xp: 800, money: 60000 }, type: 'fan' },
  { title: 'First Thousand', description: 'Gain your first 1,000 fans.', goal: 1000, reward: { xp: 70 }, type: 'fan' },
  { title: 'Loyal Base', description: 'Gain 5,000 loyal fans.', goal: 5000, reward: { xp: 95 }, type: 'fan' },
  { title: 'Mega Fanbase', description: 'Gain 2,000,000 fans.', goal: 2000000, reward: { xp: 1100, money: 120000 }, type: 'fan' },
  { title: 'Legend', description: 'Gain 5,000,000 fans.', goal: 5000000, reward: { xp: 1500, money: 250000 }, type: 'fan' },

  // ── Upgrade ──
  { title: 'Upgrade', description: 'Buy 1 studio upgrade.', goal: 1, reward: { xp: 50 }, type: 'upgrade' },
  { title: 'Better Office', description: 'Buy 2 studio upgrades.', goal: 2, reward: { xp: 100, money: 1000 }, type: 'upgrade' },
  { title: 'Tech Refresh', description: 'Buy 3 studio upgrades.', goal: 3, reward: { xp: 160, money: 2000 }, type: 'upgrade' },
  { title: 'Facelift', description: 'Buy 4 studio upgrades.', goal: 4, reward: { xp: 220, money: 3500 }, type: 'upgrade' },
  { title: 'State Of Art', description: 'Buy 6 studio upgrades.', goal: 6, reward: { xp: 340, money: 7000 }, type: 'upgrade' },
  { title: 'Server Farm', description: 'Buy a servers upgrade.', goal: 1, reward: { xp: 90, money: 1200 }, type: 'upgrade' },
  { title: 'Marketing Suite', description: 'Buy a marketing upgrade.', goal: 1, reward: { xp: 90, money: 1200 }, type: 'upgrade' },
  { title: 'Comfy Office', description: 'Buy an office upgrade.', goal: 1, reward: { xp: 90, money: 1200 }, type: 'upgrade' },
  { title: 'Premium Gear', description: 'Buy 8 studio upgrades.', goal: 8, reward: { xp: 460, money: 12000 }, type: 'upgrade' },
  { title: 'Maxed Out', description: 'Buy 10 studio upgrades.', goal: 10, reward: { xp: 600, money: 20000 }, type: 'upgrade' },

  // ── Mixed / flavor objectives ──
  { title: 'Patch Crew', description: 'Release a game patch.', goal: 1, reward: { xp: 100, money: 1000 }, type: 'release' },
  { title: 'DLC Drop', description: 'Release DLC for a game.', goal: 1, reward: { xp: 130, money: 2000 }, type: 'release' },
  { title: 'Award Hunter', description: 'Win a category award.', goal: 1, reward: { xp: 200, money: 3000 }, type: 'release' },
  { title: 'Market Mover', description: 'Reach top 50 on the leaderboard.', goal: 1, reward: { xp: 300, money: 5000 }, type: 'fan' },
  { title: 'Local Hero', description: 'Reach top 100 on the leaderboard.', goal: 1, reward: { xp: 200, money: 3000 }, type: 'fan' },
  { title: 'Startup', description: 'Reach a studio value of $100k.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'earn' },
  { title: 'Mid-Size', description: 'Reach a studio value of $500k.', goal: 1, reward: { xp: 250, money: 5000 }, type: 'earn' },
  { title: 'Major Studio', description: 'Reach a studio value of $2M.', goal: 1, reward: { xp: 400, money: 12000 }, type: 'earn' },
  { title: 'AAA Player', description: 'Reach a studio value of $10M.', goal: 1, reward: { xp: 700, money: 40000 }, type: 'earn' },
  { title: 'Training Day', description: 'Train an employee.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Promotion', description: 'Promote an employee.', goal: 1, reward: { xp: 80, money: 800 }, type: 'hire' },
  { title: 'Raise Time', description: 'Give a raise to an employee.', goal: 1, reward: { xp: 70, money: 600 }, type: 'hire' },
  { title: 'Vacation', description: 'Send an employee on vacation.', goal: 1, reward: { xp: 60 }, type: 'hire' },
  { title: 'Campaign Blitz', description: 'Run 3 marketing campaigns.', goal: 3, reward: { xp: 140, money: 1500 }, type: 'release' },
  { title: 'Engine Build', description: 'Create a custom engine.', goal: 1, reward: { xp: 200, money: 3000 }, type: 'research' },
  { title: 'License Out', description: 'License your engine to others.', goal: 1, reward: { xp: 180, money: 2500 }, type: 'research' },
  { title: 'Stock Player', description: 'Buy a stock.', goal: 1, reward: { xp: 80 }, type: 'earn' },
  { title: 'Diversified', description: 'Own shares in 3 companies.', goal: 3, reward: { xp: 160, money: 2000 }, type: 'earn' },
  { title: 'Bank Loan', description: 'Take a business loan.', goal: 1, reward: { xp: 70 }, type: 'earn' },
  { title: 'Debt Free', description: 'Repay a loan fully.', goal: 1, reward: { xp: 120, money: 1500 }, type: 'earn' },
  { title: 'Acquire Rival', description: 'Acquire a competitor studio.', goal: 1, reward: { xp: 300, money: 6000 }, type: 'upgrade' },
  { title: 'Merger', description: 'Acquire 2 competitor studios.', goal: 2, reward: { xp: 500, money: 12000 }, type: 'upgrade' },
  { title: 'Perfect Score', description: 'Ship a game with 80+ review.', goal: 1, reward: { xp: 260, money: 4000 }, type: 'release' },
  { title: 'Critic Darling', description: 'Ship a game with 90+ review.', goal: 1, reward: { xp: 400, money: 8000 }, type: 'release' },
  { title: 'Bestseller', description: 'Sell 100k+ units in a week.', goal: 1, reward: { xp: 350, money: 7000 }, type: 'earn' },
  { title: 'Multiplat', description: 'Release on 3 platforms.', goal: 3, reward: { xp: 220, money: 3500 }, type: 'release' },
  { title: 'Niche King', description: 'Release 5 games in one genre.', goal: 5, reward: { xp: 380, money: 7000 }, type: 'release' },
  { title: 'Portfolio', description: 'Have 8 games in your catalog.', goal: 8, reward: { xp: 360, money: 6000 }, type: 'release' },
  { title: 'Veteran', description: 'Reach studio level 10.', goal: 1, reward: { xp: 500, money: 10000 }, type: 'earn' },
  { title: 'Icon', description: 'Reach studio level 20.', goal: 1, reward: { xp: 1000, money: 40000 }, type: 'earn' },
  { title: 'Speed Run', description: 'Release a game in under 3 weeks.', goal: 1, reward: { xp: 140, money: 2000 }, type: 'release' },
  { title: 'Long Haul', description: 'Release a 16-week masterpiece.', goal: 1, reward: { xp: 260, money: 5000 }, type: 'release' },
  { title: 'Rising Star', description: 'Gain 2,000 fans.', goal: 2000, reward: { xp: 80 }, type: 'fan' },
  { title: 'Influencer', description: 'Gain 150,000 fans.', goal: 150000, reward: { xp: 380, money: 10000 }, type: 'fan' },
  { title: 'Phenom', description: 'Gain 750,000 fans.', goal: 750000, reward: { xp: 620, money: 40000 }, type: 'fan' },
  { title: 'Budget Cut', description: 'Release a game under $20k budget.', goal: 1, reward: { xp: 100, money: 1000 }, type: 'release' },
  { title: 'No Expense', description: 'Release a $200k budget game.', goal: 1, reward: { xp: 220, money: 4000 }, type: 'release' },
  { title: 'Team Player', description: 'Have 6 employees.', goal: 6, reward: { xp: 300, money: 4000 }, type: 'hire' },
  { title: 'Small Army', description: 'Have 12 employees.', goal: 12, reward: { xp: 550, money: 10000 }, type: 'hire' },
  { title: 'Scholar', description: 'Complete 4 research nodes.', goal: 4, reward: { xp: 300, money: 4000 }, type: 'research' },
  { title: 'Inventor', description: 'Complete 6 research nodes.', goal: 6, reward: { xp: 420, money: 8000 }, type: 'research' },
  { title: 'Renovator', description: 'Buy 5 studio upgrades.', goal: 5, reward: { xp: 280, money: 5000 }, type: 'upgrade' },
  { title: 'Gold Standard', description: 'Reach a 70+ company rating.', goal: 1, reward: { xp: 300, money: 5000 }, type: 'fan' },
  { title: 'Prestige', description: 'Reach an 85+ company rating.', goal: 1, reward: { xp: 500, money: 12000 }, type: 'fan' },
  { title: 'Open World', description: 'Release an open-world genre game.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'release' },
  { title: 'RPG Master', description: 'Release an RPG.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'release' },
  { title: 'Shooter Pro', description: 'Release a shooter.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'release' },
  { title: 'Cozy Game', description: 'Release a simulation game.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'release' },
  { title: 'Horror Night', description: 'Release a horror game.', goal: 1, reward: { xp: 150, money: 2000 }, type: 'release' },
  { title: 'Indie Spirit', description: 'Release 4 indie games.', goal: 4, reward: { xp: 300, money: 5000 }, type: 'release' },
  { title: 'Monthly Cadence', description: 'Release a game 4 weeks in a row.', goal: 4, reward: { xp: 360, money: 7000 }, type: 'release' },
  { title: 'Profit Machine', description: 'Earn $750k in profit.', goal: 750000, reward: { xp: 460, money: 15000 }, type: 'earn' },
  { title: 'Cash Cow', description: 'Earn $3M in profit.', goal: 3000000, reward: { xp: 900, money: 60000 }, type: 'earn' },
  { title: 'Fan Army', description: 'Gain 3,000,000 fans.', goal: 3000000, reward: { xp: 1300, money: 150000 }, type: 'fan' },
]

// Pick `count` missions per week by rotating through the pool so the whole
// library is exercised over time and the quest log stays fresh.
export function generateMissions(week: number, count = 3): Mission[] {
  const len = P.length
  const start = (week * 3) % len
  const chosen: Tmpl[] = []
  for (let i = 0; i < count; i++) chosen.push(P[(start + i) % len])
  return chosen.map((m, i) => ({
    ...m,
    id: `m_${week}_${i}`,
    progress: 0,
    expiresAt: week + 6,
  }))
}

// Daily login reward tiers.
export const LOGIN_REWARDS = [500, 750, 1000, 1500, 2000, 3000, 5000]

export function loginRewardForStreak(streak: number): number {
  const idx = Math.min(streak - 1, LOGIN_REWARDS.length - 1)
  return LOGIN_REWARDS[Math.max(0, idx)] ?? 500
}
