import { useState } from 'react'
import { useMapStore } from '../store/mapStore.js'

export default function GenerationDebug() {
  const generatorState   = useMapStore(s => s.generatorState)
  const snapshots        = useMapStore(s => s.snapshots)
  const currentStep      = useMapStore(s => s.currentStep)
  const runGenerate      = useMapStore(s => s.generateMap)
  const stepForward      = useMapStore(s => s.stepForward)
  const stepBackward     = useMapStore(s => s.stepBackward)
  const goToStep         = useMapStore(s => s.goToStep)

  const [openSections, setOpenSections] = useState({ biomeGroupings: true, hexes: false })
  const [debugEnabled, setDebugEnabled] = useState(false)

  function toggle(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = generatorState ? [
    { key: 'biomeGroupings', label: 'Biome Groupings', data: generatorState.biomeGroupings },
    { key: 'hexes',          label: 'Hex Map',         data: generatorState.hexes },
  ] : []

  const hasSnapshots = snapshots.length > 0
  const activeSnap   = hasSnapshots ? snapshots[currentStep] : null

  return (
    <div className="gen-debug">
      <div className="gen-debug-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="gen-debug-btn gen-debug-btn--generate" onClick={runGenerate}>
            Generate Map
          </button>
          <button
            className="gen-debug-btn gen-debug-btn--debug"
            onClick={() => setDebugEnabled(d => !d)}
            disabled={!hasSnapshots}
          >
            Debug
          </button>
        </div>
      </div>

      {debugEnabled && hasSnapshots && (
        <div className="gen-debug-stepper">
          <div className="gen-debug-stepper-col">
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={stepBackward}
              disabled={currentStep <= 0}
            >
              ◀ Prev
            </button>
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={() => goToStep(0)}
              disabled={currentStep <= 0}
            >
              ⏮ First
            </button>
          </div>
          <div className="gen-debug-stepper-info">
            <div className="gen-debug-stepper-title">
              Step {currentStep + 1} / {snapshots.length}: {activeSnap.label}
            </div>
            <div className="gen-debug-stepper-desc">
              {activeSnap.description}
            </div>
          </div>
          <div className="gen-debug-stepper-col">
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={stepForward}
              disabled={currentStep >= snapshots.length - 1}
            >
              Next ▶
            </button>
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={() => goToStep(snapshots.length - 1)}
              disabled={currentStep >= snapshots.length - 1}
            >
              Last ⏭
            </button>
          </div>
        </div>
      )}

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
