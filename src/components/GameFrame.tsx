// Subtle CRT scanline overlay only — the full-screen HUD border, corner
// brackets and pixel labels were removed so the app runs edge-to-edge.
export function GameFrame() {
  return <div className="scanlines-overlay" aria-hidden />
}
