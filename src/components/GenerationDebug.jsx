import { useState } from 'react'
import { useMapStore } from '../store/mapStore.js'

export default function GenerationDebug() {
  const generatorState = useMapStore(s => s.generatorState)
  const runSetup    = useMapStore(s => s.setupOnly)
  const runGenerate = useMapStore(s => s.generateMap)
  const [openSections, setOpenSections] = useState({ biomeGroupings: true, hexes: false })

  function toggle(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = generatorState ? [
    { key: 'biomeGroupings', label: 'Biome Groupings', data: generatorState.biomeGroupings },
    { key: 'hexes',          label: 'Hex Map',         data: generatorState.hexes },
  ] : []

  return (
    <div style={{
      margin: '1.5rem auto',
      maxWidth: '900px',
      textAlign: 'left',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
    }}>
      <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#888' }}>Generation Debug</span>
        <button
          onClick={runSetup}
          style={{
            padding: '5px 14px',
            background: '#2a4a2a',
            border: '1px solid #4a7a4a',
            borderRadius: 5,
            color: '#c8ffc8',
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { e.target.style.background = '#3a6a3a' }}
          onMouseLeave={e => { e.target.style.background = '#2a4a2a' }}
        >
          Setup Grid
        </button>
        <button
          onClick={runGenerate}
          style={{
            padding: '5px 14px',
            background: '#2a3a6a',
            border: '1px solid #4a5a9a',
            borderRadius: 5,
            color: '#c8d8ff',
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { e.target.style.background = '#3a4a8a' }}
          onMouseLeave={e => { e.target.style.background = '#2a3a6a' }}
        >
          Generate Map
        </button>
      </div>

      {sections.map(({ key, label, data }) => (
        <div key={key} style={{ marginBottom: '0.5rem', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => toggle(key)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.4rem 0.75rem',
              background: '#1a1a1a',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{label}</span>
            <span>{openSections[key] ? '▲' : '▼'}</span>
          </button>

          {openSections[key] && (
            <pre style={{
              margin: 0,
              padding: '0.75rem',
              background: '#111',
              color: '#d4d4d4',
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: '400px',
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
