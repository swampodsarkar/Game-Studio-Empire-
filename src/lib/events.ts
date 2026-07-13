import type { GameEvent } from '../types'
import { pick } from './format'

// Pool of interactive crisis / opportunity events. When one triggers, the
// simulation pauses and the player must pick an outcome before time advances.
const EVENT_POOL: Omit<GameEvent, 'id'>[] = [
  {
    title: 'Lawsuit Threat',
    body: 'A competitor claims your latest hit copied their mechanics and is threatening legal action.',
    choices: [
      {
        label: 'Settle out of court (-$120K)',
        money: -120000,
        rating: 2,
        result: 'You paid a quiet settlement. The drama faded and your reputation held steady.',
      },
      {
        label: 'Fight it in court',
        money: -40000,
        rating: -5,
        fans: 20000,
        result: 'The court ruled in your favor. Fans loved the underdog stand, though it cost goodwill elsewhere.',
      },
    ],
  },
  {
    title: 'Hardware Shortage',
    body: 'A chip shortage is driving up dev-kit costs across the industry this quarter.',
    choices: [
      {
        label: 'Absorb the cost (-$80K)',
        money: -80000,
        result: 'You ate the cost to keep your roadmap on track. The team appreciated the stability.',
      },
      {
        label: 'Delay one project',
        money: -10000,
        rating: -2,
        result: 'You slipped a release to save cash. Players grumbled about the wait.',
      },
    ],
  },
  {
    title: 'Viral Streamer',
    body: 'A massive streamer wants to feature your studio in a weekend marathon.',
    choices: [
      {
        label: 'Send free keys + swag (-$20K)',
        money: -20000,
        fans: 60000,
        result: 'The marathon exploded in popularity. Your fanbase surged overnight.',
      },
      {
        label: 'Decline politely',
        result: 'You passed on the spot. No harm, but the moment slipped away.',
      },
    ],
  },
  {
    title: 'Engine Vulnerability',
    body: 'Security researchers found a flaw in your custom engine. Patch now or risk a review bomb.',
    choices: [
      {
        label: 'Emergency patch (-$50K)',
        money: -50000,
        rating: 3,
        result: 'You shipped a fast fix. Reviewers praised your responsiveness.',
      },
      {
        label: 'Risk it',
        rating: -8,
        fans: -15000,
        result: 'The flaw leaked. Angry players review-bombed your store page.',
      },
    ],
  },
  {
    title: 'Talent Poaching',
    body: 'A rival is trying to lure your lead designer away with a huge offer.',
    choices: [
      {
        label: 'Counter-offer (-$60K)',
        money: -60000,
        xp: 0,
        result: 'You matched the offer. Your star stayed and morale lifted.',
      },
      {
        label: 'Let them go',
        xp: -50,
        rating: -1,
        result: 'Your designer left. The team lost momentum on current projects.',
      },
    ],
  },
  {
    title: 'Censorship Row',
    body: 'A regional market is pressuring you to cut content from your upcoming release.',
    choices: [
      {
        label: 'Comply for access (+$40K)',
        money: 40000,
        rating: -3,
        result: 'You localized a trimmed build and opened a new market, but critics called it cowardly.',
      },
      {
        label: 'Refuse on principle',
        fans: 35000,
        rating: 2,
        result: 'You stood firm. Fans rallied behind your principles.',
      },
    ],
  },
  {
    title: 'Crypto Hype',
    body: 'An investor wants to pump your studio into a trendy web3 partnership.',
    choices: [
      {
        label: 'Take the deal (+$150K)',
        money: 150000,
        rating: -6,
        result: 'The cash was real, but hardcore fans cringed at the pivot.',
      },
      {
        label: 'Stay focused',
        result: 'You ignored the noise and kept building games people love.',
      },
    ],
  },
  {
    title: 'Game Jam Glory',
    body: 'Your team won a weekend game jam and the prototype is getting buzz.',
    choices: [
      {
        label: 'Greenlight a spin-off',
        xp: 80,
        fans: 25000,
        result: 'You turned the jam hit into a full project. Buzz converted into fans.',
      },
      {
        label: 'Keep it as a freebie',
        fans: 10000,
        result: 'You released it free as goodwill. A small but loyal bump in fans.',
      },
    ],
  },
]

export function generateEvent(): GameEvent {
  const base = pick(EVENT_POOL)
  return { ...base, id: 'ev_' + Math.random().toString(36).slice(2, 9), choices: base.choices.map((c) => ({ ...c })) }
}
