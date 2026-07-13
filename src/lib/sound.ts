// Lightweight procedural sound engine built on the Web Audio API. No audio
// files needed — every effect is synthesised on the fly. Also provides a gentle
// ambient music pad that can be toggled on/off.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let sfxEnabled = true
let musicEnabled = false

// Music graph nodes (kept so we can stop them).
let musicGain: GainNode | null = null
let musicTimer: number | null = null

// Looping background music track (user-provided file served from /public).
let bgm: HTMLAudioElement | null = null

function ensureBgm(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!bgm) {
    bgm = new Audio('bc.mp3')
    bgm.loop = true
    bgm.volume = 0.35
    bgm.preload = 'auto'
  }
  return bgm
}

// Start (or resume) the looping track. We never reset currentTime here, so
// toggling music on/off just pauses/resumes in place instead of jarringly
// restarting the song; the `loop` flag repeats it naturally when it ends.
// Autoplay policies may reject the first play() until a user gesture has
// occurred; in that case we retry on the next pointer interaction.
function playBgm() {
  const a = ensureBgm()
  if (!a) return
  const p = a.play()
  if (p && typeof (p as Promise<void>).catch === 'function') {
    ;(p as Promise<void>).catch(() => {
      const retry = () => {
        a.play().catch(() => {})
        window.removeEventListener('pointerdown', retry)
      }
      window.addEventListener('pointerdown', retry, { once: true })
    })
  }
}

const SFX_KEY = 'gse_sfx'
const MUSIC_KEY = 'gse_music'

try {
  sfxEnabled = localStorage.getItem(SFX_KEY) !== '0'
  // Background music defaults ON (opt-out): a game should have BGM after the
  // first interaction. Only an explicit "off" (localStorage '0') disables it.
  musicEnabled = localStorage.getItem(MUSIC_KEY) !== '0'
} catch {
  /* ignore */
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// Call on the first user gesture to unlock audio.
export function initAudio() {
  ensureCtx()
  if (musicEnabled) startMusic()
}

export function isSfxEnabled() {
  return sfxEnabled
}
export function isMusicEnabled() {
  return musicEnabled
}

export function setSfxEnabled(v: boolean) {
  sfxEnabled = v
  try {
    localStorage.setItem(SFX_KEY, v ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export function setMusicEnabled(v: boolean) {
  musicEnabled = v
  try {
    localStorage.setItem(MUSIC_KEY, v ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (v) startMusic()
  else stopMusic()
}

function tone(
  freq: number,
  duration: number,
  opts: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number } = {},
) {
  const c = ensureCtx()
  if (!c || !master) return
  const { type = 'sine', gain = 0.12, delay = 0, slideTo } = opts
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function playClick() {
  if (!sfxEnabled) return
  tone(420, 0.05, { type: 'square', gain: 0.04 })
}

export function playHover() {
  if (!sfxEnabled) return
  tone(600, 0.03, { type: 'sine', gain: 0.02 })
}

export function playSuccess() {
  if (!sfxEnabled) return
  tone(523, 0.12, { type: 'triangle', gain: 0.1 })
  tone(659, 0.12, { type: 'triangle', gain: 0.1, delay: 0.09 })
  tone(784, 0.18, { type: 'triangle', gain: 0.1, delay: 0.18 })
}

export function playCoin() {
  if (!sfxEnabled) return
  tone(880, 0.06, { type: 'square', gain: 0.06 })
  tone(1320, 0.1, { type: 'square', gain: 0.06, delay: 0.05 })
}

export function playError() {
  if (!sfxEnabled) return
  tone(200, 0.18, { type: 'sawtooth', gain: 0.08, slideTo: 90 })
}

export function playLevelUp() {
  if (!sfxEnabled) return
  const notes = [523, 659, 784, 1047]
  notes.forEach((n, i) => tone(n, 0.16, { type: 'triangle', gain: 0.11, delay: i * 0.08 }))
}

export function playWhoosh() {
  if (!sfxEnabled) return
  tone(300, 0.16, { type: 'sine', gain: 0.05, slideTo: 900 })
}

// Ambient pad: a couple of slow detuned oscillators with a soft LFO on volume.
function startMusic() {
  // Play the looping background track (works even without Web Audio support).
  playBgm()

  const c = ensureCtx()
  if (!c || !master || musicGain) return
  musicGain = c.createGain()
  musicGain.gain.value = 0.0
  musicGain.connect(master)
  musicGain.gain.linearRampToValueAtTime(0.06, c.currentTime + 3)

  const chords = [
    [220, 277, 330],
    [196, 247, 294],
    [174, 220, 261],
    [246, 311, 370],
  ]
  let idx = 0

  const playChord = () => {
    if (!c || !musicGain) return
    const freqs = chords[idx % chords.length]
    idx++
    freqs.forEach((f) => {
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      const t0 = c.currentTime
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.5, t0 + 1.5)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 5.5)
      osc.connect(g)
      g.connect(musicGain!)
      osc.start(t0)
      osc.stop(t0 + 6)
    })
  }

  playChord()
  musicTimer = window.setInterval(playChord, 5000)
}

function stopMusic() {
  if (bgm) bgm.pause()
  if (musicTimer) {
    window.clearInterval(musicTimer)
    musicTimer = null
  }
  if (musicGain && ctx) {
    musicGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1)
    const g = musicGain
    setTimeout(() => g.disconnect(), 1200)
    musicGain = null
  }
}
