import { pick, randInt } from './format'
import type { YouTubeComment } from '../types'

const HANDLES = [
  'PixelPilot', 'NoobSlayer99', 'IndieKing', 'gg_easy', 'RetroRaider', 'FrameChaser',
  'LootGoblin', 'SynthWaveSam', 'BossRushBea', 'CasualCarl', 'ProGamer_T', 'ModMaster',
  'SpeedrunSue', 'CozyGamer', 'LagSwitchLarry', 'CritHitChris', 'StreamSnipe', 'ByteBard',
  'QuestingQuinn', 'TokenTina', 'GrindGod', 'NPC_Ned', 'FramePerfect', 'LoreLord',
]

const AVATARS = ['🦊', '🐼', '🤖', '👾', '🐉', '🦄', '🐸', '🐙', '🦁', '🐲', '🦖', '👻', '🐺', '🦉', '🐝', '🐳']

const HYPE_HIGH = [
  'Okay this looks INSANE 🔥 day one purchase for me',
  'The art direction is unreal. Take my money!',
  'Been waiting for a game like this forever. Hype is real.',
  'That gameplay loop looks so satisfying. Can\'t wait.',
  'Easily my most anticipated game of the year now.',
  'Dev team cooked with this one 🍳🔥',
  'The trailer gave me chills ngl',
  'Pre-ordering immediately. This is gonna be a masterpiece.',
]

const HYPE_MID = [
  'Looks pretty solid! Interested to see more.',
  'Decent trailer, hope the gameplay holds up.',
  'Some cool ideas here. Will keep an eye on it.',
  'Not bad at all — the music slaps.',
  'Reminds me of a game I used to love. Cautiously optimistic.',
  'Could be good. Needs a bit more polish maybe.',
  'I like the concept. Curious about the price.',
]

const HYPE_LOW = [
  'Hmm, didn\'t really grab me tbh.',
  'Looks a bit rough around the edges.',
  'Another one of these? Not convinced yet.',
  'Trailer felt a little generic to be honest.',
  'I\'ll wait for reviews before judging.',
  'Graphics look a bit dated imo.',
  'Maybe fun, maybe mid. We\'ll see.',
]

function pickTexts(hype: number): string[] {
  if (hype >= 70) return HYPE_HIGH
  if (hype >= 40) return HYPE_MID
  return HYPE_LOW
}

export function generateTrailerComments(hype: number, count = randInt(4, 7)): YouTubeComment[] {
  const pool = pickTexts(hype)
  const chosen = new Set<string>()
  const comments: YouTubeComment[] = []
  for (let i = 0; i < count; i++) {
    let text = pick(pool)
    while (chosen.has(text) && chosen.size < pool.length) text = pick(pool)
    chosen.add(text)
    comments.push({
      id: 'yc_' + Math.random().toString(36).slice(2, 9),
      author: pick(HANDLES),
      avatar: pick(AVATARS),
      text,
      likes: randInt(3, Math.round(40 + hype * 6)),
    })
  }
  // Pin the channel/dev reply when hype is decent.
  if (hype >= 50) {
    comments.unshift({
      id: 'yc_pin',
      author: 'Studio Dev',
      avatar: '🎮',
      text: 'Thanks for the love! More footage dropping soon — wishlist to stay updated ❤️',
      likes: randInt(120, 900),
      pinned: true,
    })
  }
  return comments
}
