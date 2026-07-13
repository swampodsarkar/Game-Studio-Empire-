import type { Genre, Platform, Theme } from '../types'

// Procedural cover-art palette + iconography so every game gets a Steam-style
// capsule without needing real image assets.

interface Art {
  icon: string
  from: string
  via: string
  to: string
}

export const GENRE_ART: Partial<Record<Genre, Art>> = {
  RPG: { icon: '⚔️', from: '#7c3aed', via: '#4c1d95', to: '#1e1b4b' },
  Action: { icon: '💥', from: '#ef4444', via: '#b91c1c', to: '#450a0a' },
  Football: { icon: '⚽', from: '#22c55e', via: '#15803d', to: '#052e16' },
  Sports: { icon: '🏀', from: '#f97316', via: '#c2410c', to: '#431407' },
  Racing: { icon: '🏎️', from: '#eab308', via: '#a16207', to: '#3f2d05' },
  Simulation: { icon: '🏗️', from: '#06b6d4', via: '#0e7490', to: '#083344' },
  Strategy: { icon: '♟️', from: '#3b82f6', via: '#1d4ed8', to: '#172554' },
  Horror: { icon: '🩸', from: '#7f1d1d', via: '#450a0a', to: '#0a0a0a' },
  Adventure: { icon: '🗺️', from: '#14b8a6', via: '#0f766e', to: '#042f2e' },
  Puzzle: { icon: '🧩', from: '#ec4899', via: '#be185d', to: '#500724' },
  Shooter: { icon: '🔫', from: '#f43f5e', via: '#9f1239', to: '#3b0710' },
  FPS: { icon: '🎯', from: '#fb7185', via: '#9f1239', to: '#3b0710' },
  Stealth: { icon: '🥷', from: '#475569', via: '#1e293b', to: '#0f172a' },
  Survival: { icon: '🔥', from: '#f59e0b', via: '#b45309', to: '#451a03' },
  Sandbox: { icon: '🧱', from: '#84cc16', via: '#4d7c0f', to: '#1a2e05' },
  'Open World': { icon: '🌍', from: '#10b981', via: '#047857', to: '#022c22' },
  'City Builder': { icon: '🏙️', from: '#38bdf8', via: '#0369a1', to: '#082f49' },
  Tycoon: { icon: '💼', from: '#facc15', via: '#a16207', to: '#3f2d05' },
  Management: { icon: '📊', from: '#a3e635', via: '#4d7c0f', to: '#1a2e05' },
  'Visual Novel': { icon: '📖', from: '#c084fc', via: '#7e22ce', to: '#2e1065' },
  Anime: { icon: '🌸', from: '#f9a8d4', via: '#be185d', to: '#500724' },
  'Battle Royale': { icon: '🪂', from: '#22d3ee', via: '#0e7490', to: '#083344' },
  MOBA: { icon: '⚔️', from: '#818cf8', via: '#4338ca', to: '#1e1b4b' },
  Roguelike: { icon: '🎲', from: '#f472b6', via: '#9d174d', to: '#3b0710' },
  'Sci-Fi': { icon: '🛸', from: '#60a5fa', via: '#1e40af', to: '#172554' },
  Fantasy: { icon: '🐉', from: '#a78bfa', via: '#5b21b6', to: '#1e1b4b' },
  'Story Rich': { icon: '📜', from: '#fca5a5', via: '#b91c1c', to: '#450a0a' },
}

export const THEME_ICON: Record<Theme, string> = {
  Fantasy: '🐉',
  'Sci-Fi': '🛸',
  Modern: '🏙️',
  Historical: '🏛️',
  Zombie: '🧟',
  Space: '🌌',
  Military: '🎖️',
}

export const PLATFORM_ICON: Record<Platform, string> = {
  Steam: '🟦',
  Epic: '🟪',
  GOG: '🟫',
  'itch.io': '🩷',
  PlayStation: '🎮',
  Xbox: '🟢',
  'Nintendo Switch': '🔴',
  'Google Play': '🤖',
  'App Store': '🍎',
}

// Deterministic 0..1 value from a string so a game's art stays consistent.
export function hashUnit(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}
