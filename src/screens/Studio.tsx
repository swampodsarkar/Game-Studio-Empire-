import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { StatBar } from '../components/ui/StatBar'
import { Modal } from '../components/ui/Modal'
import { Tabs, useTabState } from '../components/ui/Tabs'
import {
  OFFICE_BASE_RENT,
  OFFICE_RENT_PER_HEAD,
  OFFICE_RENT_PER_LEVEL,
  ROLES,
  ROLE_LABELS,
  UPGRADES,
} from '../config/gameConfig'
import type { CustomEngine, EmployeeRole } from '../types'
import { formatMoney } from '../lib/format'
import { upgradeEffect, upgradeLevel } from '../lib/gameLogic'

export function Studio() {
  const [tab, setTab] = useTabState('employees')
  return (
    <div>
      <Tabs
        tabs={[
          { id: 'employees', label: 'Employees', icon: '👥' },
          { id: 'upgrades', label: 'Upgrades', icon: '🏗️' },
          { id: 'engines', label: 'Engines', icon: '⚙️' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-4">
        {tab === 'employees' && <Employees />}
        {tab === 'upgrades' && <Upgrades />}
        {tab === 'engines' && <Engines />}
      </div>
    </div>
  )
}

function Employees() {
  const { player, hireEmployee, fireEmployee, trainEmployee, promoteEmployee, giveRaise, giveVacation } = useGame()
  const [hireOpen, setHireOpen] = useState(false)
  const [fireId, setFireId] = useState<string | null>(null)
  if (!player) return null
  const maxEmp = upgradeEffect(player.upgrades, 'office')
  const officeLvl = upgradeLevel(player.upgrades, 'office')
  const rent = OFFICE_BASE_RENT + officeLvl * OFFICE_RENT_PER_LEVEL + player.employees.length * OFFICE_RENT_PER_HEAD

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-white/50">
          {player.employees.length} / {maxEmp} employees · payroll {formatMoney(player.employees.reduce((s, e) => s + e.salary, 0))}/wk · 🏢 rent {formatMoney(rent)}/wk
        </div>
        <Button size="sm" onClick={() => setHireOpen(true)}>＋ Hire</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {player.employees.map((e) => (
          <GlassCard key={e.id}>
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{e.name}</div>
                <div className="text-xs text-white/50">{ROLE_LABELS[e.role]}</div>
              </div>
              <div className="text-right text-xs text-white/40">Lv {e.level}</div>
            </div>
            <div className="space-y-2">
              <StatBar value={e.skill} color="#7c5cff" label="Skill" />
              <StatBar value={e.mood} color={e.mood < 30 ? '#f87171' : '#34d399'} label="Mood" />
              <StatBar value={e.energy ?? 100} color={(e.energy ?? 100) < 25 ? '#f87171' : '#fbbf24'} label="Energy" />
            </div>
            {(e.mood < 30 || (e.energy ?? 100) < 25) && e.role !== 'Producer' && (
              <div className="mt-2 rounded-lg bg-accent-red/15 px-2 py-1 text-[11px] text-accent-red">
                ⚠ Burnout risk — give a raise or time off.
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-white/50">
              <span>Salary {formatMoney(e.salary)}/wk</span>
              <span>Exp {e.experience}</span>
            </div>
            {e.role !== 'Producer' && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => trainEmployee(e.id)}>Train $800</Button>
                <Button size="sm" variant="ghost" onClick={() => promoteEmployee(e.id)}>Promote</Button>
                <Button size="sm" variant="success" onClick={() => giveRaise(e.id)}>💸 Raise</Button>
                <Button size="sm" variant="success" onClick={() => giveVacation(e.id)}>🌴 Time Off</Button>
                <Button size="sm" variant="danger" onClick={() => setFireId(e.id)}>Fire</Button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <Modal open={hireOpen} onClose={() => setHireOpen(false)} title="Hire Employee">
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <Button
              key={r}
              variant="ghost"
              onClick={() => {
                hireEmployee(r as EmployeeRole)
              }}
            >
              {ROLE_LABELS[r]}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/40">
          Candidates are generated with random skill and salary based on role. Office level limits headcount.
        </p>
      </Modal>

      <Modal open={!!fireId} onClose={() => setFireId(null)} title="Fire Employee?" maxWidth="max-w-sm">
        <p className="text-sm text-white/70">
          {fireId
            ? `Are you sure you want to fire ${player.employees.find((e) => e.id === fireId)?.name ?? 'this employee'}? This cannot be undone.`
            : ''}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setFireId(null)} className="btn-game px-4 py-2 text-sm">Cancel</button>
          <button
            onClick={() => {
              if (fireId) fireEmployee(fireId)
              setFireId(null)
            }}
            className="btn-game px-4 py-2 text-sm !border-accent-pink/60"
          >
            Yes, fire
          </button>
        </div>
      </Modal>
    </div>
  )
}

function Upgrades() {
  const { player, buyUpgrade } = useGame()
  if (!player) return null
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {UPGRADES.map((u) => {
        const lvl = upgradeLevel(player.upgrades, u.id)
        const cost = Math.round(u.baseCost * Math.pow(u.costGrowth, lvl))
        const maxed = lvl >= u.maxLevel
        return (
          <GlassCard key={u.id}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{u.icon}</span>
              <div>
                <div className="font-bold text-white">{u.name}</div>
                <div className="text-xs text-white/50">Lv {lvl}/{u.maxLevel}</div>
              </div>
            </div>
            <p className="mb-2 text-xs text-white/50">{u.description}</p>
            <div className="mb-3 rounded-lg bg-white/5 p-2 text-xs text-accent-cyan">{u.effectLabel(lvl)}</div>
            <Button
              size="sm"
              className="w-full"
              disabled={maxed || player.money < cost}
              onClick={() => buyUpgrade(u.id)}
            >
              {maxed ? 'Maxed' : `Upgrade · ${formatMoney(cost)}`}
            </Button>
          </GlassCard>
        )
      })}
    </div>
  )
}

function Engines() {
  const { player, createEngine, licenseEngine } = useGame()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [stats, setStats] = useState({ graphics: 50, physics: 50, ai: 50, networking: 50, optimization: 50, tools: 50 })
  const [licenseRate, setLicenseRate] = useState<Record<string, number>>({})
  if (!player) return null

  function submit() {
    createEngine(name.trim() || 'Custom Engine', stats)
    setOpen(false)
    setName('')
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-white/50">{player.engines.length} custom engines</div>
        <Button size="sm" onClick={() => setOpen(true)}>＋ New Engine ($4,000)</Button>
      </div>
      {player.engines.length === 0 ? (
        <GlassCard><p className="text-sm text-white/40">No custom engines yet. Build one to boost your games' quality.</p></GlassCard>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {player.engines.map((e) => {
            const rate = player.licenses[e.id] ?? 0
            const pending = licenseRate[e.id] ?? 5
            return (
              <GlassCard key={e.id}>
                <div className="mb-2 font-bold text-white">{e.name} <span className="text-xs text-white/40">v{e.version}</span></div>
                <div className="space-y-1.5">
                  {(Object.keys(stats) as (keyof typeof stats)[]).map((k) => (
                    <StatBar key={k} value={e[k as keyof CustomEngine] as number} label={k} />
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-white/5 p-2 text-xs">
                  {rate > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-accent-green">Licensed · {rate}% royalties/wk</span>
                      <button className="text-accent-red hover:underline" onClick={() => licenseEngine(e.id, 0)}>Revoke</button>
                    </div>
                  ) : (
                    <div>
                      <label className="text-white/50">License rate: {pending}%</label>
                      <input type="range" min={1} max={20} value={pending} onChange={(ev) => setLicenseRate((r) => ({ ...r, [e.id]: +ev.target.value }))} className="w-full accent-brand-500" />
                      <Button size="sm" className="mt-1 w-full" onClick={() => licenseEngine(e.id, pending)}>License Engine</Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create Custom Engine">
        <label className="label">Engine Name</label>
        <input className="input mb-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Engine" />
        {Object.keys(stats).map((k) => (
          <div key={k} className="mb-2">
            <label className="label capitalize">{k}: {stats[k as keyof typeof stats]}</label>
            <input
              type="range"
              min={30}
              max={100}
              value={stats[k as keyof typeof stats]}
              onChange={(e) => setStats((s) => ({ ...s, [k]: +e.target.value }))}
              className="w-full accent-brand-500"
            />
          </div>
        ))}
        <Button className="mt-3" onClick={submit} disabled={player.money < 4000}>Create Engine ($4,000)</Button>
      </Modal>
    </div>
  )
}
