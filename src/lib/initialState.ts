import type { PlayerState } from '../types'
import { STARTING_MONEY } from '../config/gameConfig'
import { generateMissions } from './missions'

export function createInitialPlayer(
  uid: string,
  username: string,
  avatar: string,
  country: string,
): PlayerState {
  return {
    uid,
    username,
    avatar,
    country,
    level: 1,
    xp: 0,
    money: STARTING_MONEY,
    fans: 0,
    studioValue: STARTING_MONEY,
    companyRating: 10,
    week: 1,
    achievements: [],
    notifications: [
      {
        id: 'welcome',
        title: 'Welcome to Game Studio Empire',
        body: 'You start with one PC, one developer and $5,000. Build your first game!',
        type: 'info',
        createdAt: Date.now(),
        read: false,
      },
    ],
    missions: generateMissions(1),
    lastLogin: Date.now(),
    streak: 0,
    _lastClaimDay: new Date().toDateString(),
    employees: [
        {
          id: 'emp_self',
          name: username,
          role: 'Producer',
          level: 1,
          salary: 50,
          experience: 0,
          mood: 80,
          energy: 100,
          productivity: 70,
          skill: 55,
          specialization: 'General',
          hiredAt: Date.now(),
        },
      ],
    games: [],
    engines: [],
    research: [],
    upgrades: [],
    licenses: {},
    loanBalance: 0,
    stocks: {},
    awards: [],
    season: { id: 1, xp: 0, claimedTiers: [] },
    history: { revenue: [0], fans: [0], studioValue: [STARTING_MONEY], weeks: [1] },
    createdAt: Date.now(),
  }
}
