import { Modal } from './ui/Modal'

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="📖 How To Play" maxWidth="max-w-lg">
      <div className="space-y-4 text-sm text-white/80">
        <p>
          You run an indie game studio. Your goal: build hit games, grow your fanbase and become the #1
          studio on the global leaderboard.
        </p>
        <div>
          <div className="mb-1 font-pixel text-[10px] uppercase text-accent-cyan">The Loop</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Go to <b>Game Dev</b> → create a game (pick genre, theme, stores like Steam/Epic, team).</li>
            <li>Assign developers, run <b>marketing campaigns</b> to build hype, then ship it.</li>
            <li>Each release earns cash + fans. Good reviews boost your <b>studio rating</b>.</li>
            <li>Make <b>Sequels</b> to a hit — they inherit a franchise bonus.</li>
          </ul>
        </div>
        <div>
          <div className="mb-1 font-pixel text-[10px] uppercase text-accent-cyan">Grow</div>
          <ul className="list-disc space-y-1 pl-5">
            <li><b>Studio</b>: hire & train employees, buy upgrades, build custom engines.</li>
            <li><b>Research</b>: unlock tech that improves your games.</li>
            <li><b>Market</b>: watch rivals, acquire competitor studios (M&amp;A).</li>
            <li><b>Economy</b>: take loans, trade stocks. <b>Awards</b> & <b>Seasons</b> give bonuses.</li>
          </ul>
        </div>
        <div>
          <div className="mb-1 font-pixel text-[10px] uppercase text-accent-cyan">Tips</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Time auto-advances (top bar shows next week). Use the speed buttons to fast-forward.</li>
            <li>Resolve <b>events</b> when they pop up — they pause the clock until you decide.</li>
            <li>Match genre + theme for affinity bonuses. Bigger teams & better engines = better scores.</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
