import React, { useEffect, useState } from 'react'
import createGame from './game/GameEngine'
import './styles.css'

export default function App() {
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gameMuted') === '1'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    // expose a simple global flag the game scenes read to check mute state
    ;(window as any).__GAME_MUTED = muted
    try {
      localStorage.setItem('gameMuted', muted ? '1' : '0')
    } catch (e) {}

    // dispatch events so running scenes can resume/suspend audio contexts
    if (muted) {
      window.dispatchEvent(new Event('game-mute'))
    } else {
      window.dispatchEvent(new Event('game-unmute'))
    }
  }, [muted])

  useEffect(() => {
    const game = createGame('game-container')
    return () => {
      try { game.destroy(true) } catch { }
    }
  }, [])

  return (
    <div className="app">
      <h1>Cartoon Game Prototype</h1>

      <div className="controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          aria-pressed={muted}
          aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
          onClick={() => setMuted(m => !m)}
          style={{ padding: '6px 10px', cursor: 'pointer' }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <div style={{ fontSize: 14, color: '#444' }}>Use arrow keys to move</div>
      </div>

      <div id="game-container"></div>

      <div className="hud">
        <p>Use arrow keys to move the car. Avoid animals. Stage progression is automatic.</p>
      </div>
    </div>
  )
}
