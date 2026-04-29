import { useState } from 'react'
import { useMapStore } from '../store/mapStore.js'

export default function GenerationDebug() {
  const generatorState = useMapStore(s => s.generatorState)
  const runSetup    = useMapStore(s => s.setupOnly)
  const runGenerate = useMapStore(s => s.generateMap)
  const [openSections, setOpenSections] = useState({ biomeGroupings: true, hexes: false })

  const debugEnabled = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).has('debug')

  function toggle(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = generatorState ? [
    { key: 'biomeGroupings', label: 'Biome Groupings', data: generatorState.biomeGroupings },
    { key: 'hexes',          label: 'Hex Map',         data: generatorState.hexes },
  ] : []

  return (
    <div className="gen-debug">
      <div className="gen-debug-toolbar">
        {debugEnabled && <span className="gen-debug-label">Generation Debug</span>}
        {debugEnabled && (
          <button className="gen-debug-btn gen-debug-btn--setup" onClick={runSetup}>
            Setup Grid
          </button>
        )}
        <button className="gen-debug-btn gen-debug-btn--generate" onClick={runGenerate}>
          Generate Map
        </button>
      </div>

      {debugEnabled && sections.map(({ key, label, data }) => (
        <div key={key} className="gen-debug-section">
          <button className="gen-debug-section-toggle" onClick={() => toggle(key)}>
            <span>{label}</span>
            <span>{openSections[key] ? '▲' : '▼'}</span>
          </button>

          {openSections[key] && (
            <pre className="gen-debug-section-body">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
