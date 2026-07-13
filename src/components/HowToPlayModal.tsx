import { Modal } from './ui/Modal'
import { useState } from 'react'

const TABS = [
  {
    id: 'basics',
    label: 'Basics',
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <p>You run an indie game studio. Your goal: make hit games, grow fans, climb the leaderboard.</p>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="mb-1 font-bold text-white">📋 The Game Loop</div>
          <ol className="list-decimal space-y-1 pl-4 text-white/70">
            <li><b>Game Dev</b> → create a game (genre, theme, stores, budget)</li>
            <li><b>Studio</b> → hire &amp; assign employees to the project</li>
            <li><b>Marketing</b> → run campaigns to build pre-launch hype</li>
            <li><b>Release</b> → game ships, reviews come in, revenue starts flowing</li>
            <li><b>Repeat</b> → use cash to hire more, upgrade, research, make sequels</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    id: 'dev',
    label: 'Game Dev',
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Creating a Game</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li><b>Genre + Theme</b> — matching pairs (e.g. RPG+Fantasy) get an affinity bonus</li>
            <li><b>Stores</b> — each store adds reach. Console stores (PlayStation, Xbox) have higher prices</li>
            <li><b>Budget</b> — the orange line shows the recommended amount. Underspending hurts quality</li>
            <li><b>Dev Time</b> — 3-24 weeks. Longer dev lets you spend more budget on quality</li>
            <li><b>Publishing</b> — Self = 100% revenue. Publisher = advance + 70%. Exclusive = big advance + rating bonus</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Post-Launch</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li>Patch bugs to protect ongoing sales and fan loyalty</li>
            <li>Release DLC to revive a game's sales curve</li>
            <li>Make a <b>Sequel</b> — inherits franchise bonus from the original</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'studio',
    label: 'Studio',
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Employees</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li>Each hire costs 1 week salary upfront + weekly salary</li>
            <li>Assign staff to game projects in the Game Dev tab</li>
            <li>Train (+3 skill, $800), Promote (+5 skill, salary bump)</li>
            <li>Keep mood &amp; energy up with raises, vacations, and comfy furniture</li>
            <li>Burnt-out staff (low energy/mood) may quit</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Upgrades &amp; Research</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li><b>Upgrades</b> — Office (more staff), Internet (faster dev), Computers (better graphics), etc.</li>
            <li><b>Research</b> — spend Research Points (earned weekly) to unlock tech bonuses</li>
            <li><b>Custom Engine</b> — build your own engine for better game quality</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'economy',
    label: 'Economy',
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Money &amp; Growth</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li><b>Income</b> — game sales revenue, publisher advances, licensing royalties, stock profits</li>
            <li><b>Costs</b> — employee salaries, office rent, loan interest (2%/wk), upgrade costs</li>
            <li><b>Loans</b> — borrow cash when you're short (2% weekly interest)</li>
            <li><b>Stocks</b> — trade 8 game/tech company stocks. Prices drift with market sentiment</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">Fans &amp; Rating</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li>Better reviews = more fans. Fans boost future game sales</li>
            <li>Company rating rises with average review score and fanbase size</li>
            <li>High rating = higher global rank on the leaderboard</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'tips',
    label: 'Tips',
    content: (
      <div className="space-y-3 text-sm text-white/80">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="font-bold text-white">✅ Pro Tips</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            <li>Match genre + theme for a free quality boost</li>
            <li>Always have at least 1 game in development — idle studios lose money to rent</li>
            <li>Hire a Tester and a Marketing Manager for better review scores</li>
            <li>Run at least 1 marketing campaign before launch</li>
            <li>Keep $2,000+ cash buffer for unexpected events and loan interest</li>
            <li>Sequels to 80+ score games start with a big advantage</li>
            <li>Research early — 3D Graphics unlocks the whole tech tree</li>
            <li>Use the speed buttons (2x, 4x) to fast-forward through development</li>
          </ul>
        </div>
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-3 text-accent-amber">
          ⚠ Events pause the game until you make a choice. Read each option carefully — some have hidden trade-offs.
        </div>
      </div>
    ),
  },
]

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState('basics')

  return (
    <Modal open={open} onClose={onClose} title="📖 How To Play" maxWidth="max-w-xl">
      <div className="mb-4 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === t.id ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.find((t) => t.id === tab)?.content}
    </Modal>
  )
}
