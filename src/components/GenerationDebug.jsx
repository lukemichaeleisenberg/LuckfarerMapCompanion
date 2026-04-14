import { useState } from 'react'
import { useMapStore } from '../store/mapStore.js'

export default function GenerationDebug() {
  const generatorState = useMapStore(s => s.generatorState)
  const [openSections, setOpenSections] = useState({ biomeGroupings: true, hexes: false })

  if (!generatorState) return null

  function toggle(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = [
    { key: 'biomeGroupings', label: 'Biome Groupings', data: generatorState.biomeGroupings },
    { key: 'hexes',          label: 'Hex Map',         data: generatorState.hexes },
  ]

  return (
    <div style={{
      margin: '1.5rem auto',
      maxWidth: '900px',
      textAlign: 'left',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
    }}>
      <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#888' }}>
        Generation Debug
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
