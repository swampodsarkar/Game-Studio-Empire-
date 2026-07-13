// Persisted visual preferences that make the app feel like a configurable PC
// game (Options menu): CRT scanlines on/off and a reduced-motion mode.
export interface UiPrefs {
  scanlines: boolean
  reduceMotion: boolean
  realTime: boolean
}

const KEY = 'gse-ui-prefs'

export function loadPrefs(): UiPrefs {
  try {
    return { scanlines: true, reduceMotion: false, realTime: false, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { scanlines: true, reduceMotion: false, realTime: false }
  }
}

export function savePrefs(p: UiPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export function applyPrefs(p: UiPrefs) {
  const d = document.documentElement
  d.classList.toggle('no-scanlines', !p.scanlines)
  d.classList.toggle('reduce-motion', p.reduceMotion)
}
