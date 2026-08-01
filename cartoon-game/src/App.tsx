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
          className={`mute-button ${muted ? 'is-muted' : 'is-on'}`}
          aria-pressed={muted}
          aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
          onClick={() => setMuted(m => !m)}
        >
          <span className="visually-hidden">{muted ? 'Unmute' : 'Mute'}</span>

          {/* Speaker SVG with animated transitions */}
          <svg className="mute-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <g className="speaker-group">
              <path className="speaker-body" d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
              <path className="sound-wave" d="M16.5 8.5a4.5 4.5 0 010 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g className="mute-line" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: muted ? 'block' : 'none' }}>
              <line x1="19" y1="5" x2="5" y2="19" />
            </g>
          </svg>

          <span className="mute-label">{muted ? 'Unmute' : 'Mute'}</span>
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
