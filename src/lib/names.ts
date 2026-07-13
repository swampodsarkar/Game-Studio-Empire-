import type { EmployeeRole } from '../types'
import { pick, randInt } from './format'

const FIRST = [
  'Aria', 'Kai', 'Luna', 'Noah', 'Mira', 'Leo', 'Zoe', 'Eli', 'Nova', 'Theo',
  'Ivy', 'Max', 'Sora', 'Ruby', 'Finn', 'Maya', 'Owen', 'Cleo', 'Jude', 'Esha',
  'Ren', 'Yuki', 'Ada', 'Hugo', 'Lena', 'Diego', 'Nina', 'Sam', 'Tara', 'Bruno',
]

const LAST = [
  'Vega', 'Cross', 'Hale', 'Stone', 'Frost', 'Knox', 'Reyes', 'Vance', 'Cole',
  'Park', 'Ito', 'Santos', 'Marsh', 'Wolf', 'Quinn', 'Blake', 'Tran', 'Ferraro',
  'Ng', 'Khan', 'Bauer', 'Lopez', 'Okafor', 'Singh', 'Mueller', 'Rossi', 'Ahmed',
]

const STUDIO_PREFIX = [
  'Pixel', 'Neon', 'Quantum', 'Hyper', 'Cyber', 'Lunar', 'Stellar', 'Iron',
  'Crimson', 'Azure', 'Void', 'Arc', 'Turbo', 'Mystic', 'Nova', 'Echo', 'Flux',
  'Titan', 'Ghost', 'Solar',
]
const STUDIO_SUFFIX = [
  'Forge', 'Labs', 'Studios', 'Games', 'Works', 'Interactive', 'Digital',
  'Softworks', 'Collective', 'Entertainment', 'Dynamics', 'Systems', 'Realm',
]

const GAME_PREFIX = [
  'Eternal', 'Shadow', 'Cosmic', 'Crimson', 'Silent', 'Golden', 'Frozen',
  'Hidden', 'Infinite', 'Broken', 'Last', 'Rising', 'Dark', 'Astral', 'Lost',
  'Neon', 'Ancient', 'Virtual', 'Wild', 'Iron',
]
const GAME_SUFFIX = [
  'Kingdom', 'Protocol', 'Saga', 'Strike', 'Frontier', 'Odyssey', 'Empire',
  'Horizon', 'Legacy', 'Chronicles', 'Arena', 'Quest', 'Reborn', 'Rising',
  'Tactics', 'World', 'Zero', 'Legends', 'Online', 'Rift',
]

export function randomPersonName(): string {
  return `${pick(FIRST)} ${pick(LAST)}`
}

export function randomStudioName(): string {
  return `${pick(STUDIO_PREFIX)} ${pick(STUDIO_SUFFIX)}`
}

export function randomGameName(): string {
  return `${pick(GAME_PREFIX)} ${pick(GAME_SUFFIX)}`
}

export function randomEmployeeForRole(role: EmployeeRole): {
  name: string
  skill: number
  salary: number
  level: number
} {
  const base = {
    Programmer: 420,
    Artist: 380,
    Designer: 400,
    Writer: 340,
    SoundEngineer: 360,
    Tester: 280,
    Producer: 520,
    MarketingManager: 460,
  }[role]
  const level = randInt(1, 6)
  const skill = Math.min(100, 35 + level * 9 + randInt(-5, 8))
  const salary = Math.round(base * (0.8 + skill / 120) * (1 + level * 0.12))
  return { name: randomPersonName(), skill, salary, level }
}
