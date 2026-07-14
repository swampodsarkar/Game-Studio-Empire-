import { pick, rand, randInt, clamp } from './format'
import type { PublicReview } from '../types'

const NAMES = [
  'FrameChaser', 'LootGoblin', 'CozyGamer', 'BossRushBea', 'ModMaster', 'SynthWaveSam',
  'PixelPilot', 'RetroRaider', 'SpeedrunSue', 'CasualCarl', 'LoreLord', 'GrindGod',
  'NPC_Ned', 'CritHitChris', 'StreamSnipe', 'TokenTina', 'ByteBard', 'QuestingQuinn',
  'LagSwitchLarry', 'gg_easy', 'NoobSlayer99', 'IndieKing', 'ProGamer_T', 'FramePerfect',
  'gg_mint', 'BacklogBarry', 'PlatinumPete', 'BundleBeth', 'RefundRita', 'HypeHank',
]

const AVATARS = ['🦊', '🐼', '🤖', '👾', '🐉', '🦄', '🐸', '🐙', '🦁', '🐲', '🦖', '👻', '🐺', '🦉', '🐝', '🐳', '🐢', '🦋']

const POSITIVE = [
  'Absolutely loved this. Sunk 60 hours and still finding new stuff.',
  'Best game I\'ve played all year. The pacing is perfect.',
  'Did not expect much but this completely blew me away.',
  'The soundtrack alone is worth the price. 10/10 vibes.',
  'Addictive and fair. No predatory nonsense. Respect.',
  'Genuinely fun moment to moment. Hard to put down.',
  'A surprise gem. Told my whole friend group about it.',
  'Polished, generous, and respects my time. Bravo.',
  'The late game opens up so much. Brilliant design.',
  'Comfort game forever now. Cozy and deep at the same time.',
]

const NEUTRAL = [
  'Good bones but a few rough edges. Worth it on sale.',
  'Fun in bursts. Would\'ve liked more content.',
  'Solid, if a little safe. Enjoyed my time with it.',
  'Some great ideas buried under jank. Mixed feelings.',
  'Decent. Nothing groundbreaking but competently made.',
  'Better than I expected, not as good as I hoped.',
  'Enjoyable enough. Replay value is so-so.',
  'A respectable effort. A patch or two from great.',
]

const NEGATIVE = [
  'Wanted to like it but it just felt empty after a few hours.',
  'Bugs everywhere on launch. Waiting for a fix.',
  'Repetitive and shallow. Refunded halfway through.',
  'Pretty but boring. No real hook for me.',
  'Felt like an early access cash grab tbh.',
  'Performance was rough and the story went nowhere.',
  'Too many systems, none of them deep. Meh.',
  'Overhyped. Glad I only paid a few bucks.',
]

function poolFor(score: number): string[] {
  if (score >= 75) return [...POSITIVE, ...POSITIVE, ...NEUTRAL]
  if (score >= 55) return [...POSITIVE, ...NEUTRAL, ...NEUTRAL]
  if (score >= 40) return [...NEUTRAL, ...NEUTRAL, ...NEGATIVE]
  return [...NEUTRAL, ...NEGATIVE, ...NEGATIVE]
}

// Build a pool of public/player reviews clustered around the game's user score,
// so the review tab feels like a real community feed rather than a single quote.
export function generateUserReviews(userScore: number, count = 120): PublicReview[] {
  const pool = poolFor(userScore)
  const out: PublicReview[] = []
  for (let i = 0; i < count; i++) {
    const score = clamp(Math.round(userScore + rand(-22, 22)), 1, 100)
    out.push({
      id: 'pr_' + Math.random().toString(36).slice(2, 9),
      author: pick(NAMES),
      avatar: pick(AVATARS),
      score,
      text: pick(pool),
      hours: randInt(2, 220),
      helpful: randInt(0, 480),
    })
  }
  return out.sort((a, b) => b.helpful - a.helpful)
}

export function reviewSummary(reviews: PublicReview[]): { positive: number; neutral: number; negative: number } {
  let positive = 0
  let neutral = 0
  let negative = 0
  for (const r of reviews) {
    if (r.score >= 75) positive++
    else if (r.score >= 40) neutral++
    else negative++
  }
  return { positive, neutral, negative }
}
