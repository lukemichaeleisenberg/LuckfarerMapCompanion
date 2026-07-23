import { useEffect, useRef, useState } from 'react'
import { useMapStore } from '../store/mapStore'

const EXPORT_FORMAT_VERSION = 2  // v1 = pre-Phase-0 hex shape { mode, primary, secondary }

export default function GenerationDebug() {
  const generatorState   = useMapStore(s => s.generatorState)
  const snapshots        = useMapStore(s => s.snapshots)
  const currentStep      = useMapStore(s => s.currentStep)
  const runGenerate      = useMapStore(s => s.runGeneration)
  const stepForward      = useMapStore(s => s.stepForward)
  const stepBackward     = useMapStore(s => s.stepBackward)
  const goToStep         = useMapStore(s => s.goToStep)
  const loadGeneration   = useMapStore(s => s.loadGeneration)
  const seed             = useMapStore(s => s.seed)

  const [openSections, setOpenSections] = useState({ biomeGroupings: true, hexes: false })
  const [debugEnabled, setDebugEnabled] = useState(false)
  const [importError, setImportError] = useState(null)
  const [seedInput, setSeedInput] = useState('')
  const fileInputRef = useRef(null)

  // After a generation, reflect the actual seed used (a blank input gets a
  // random one) back into the input.
  useEffect(() => {
    if (seed != null) setSeedInput(String(seed))
  }, [seed])

  function handleGenerate() {
    runGenerate(seedInput.trim())
  }

  function handleExport() {
    const data = {
      version: EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      seed,
      snapshots
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `map-generation-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setImportError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.version !== EXPORT_FORMAT_VERSION) {
          throw new Error(`Unsupported version ${data.version}: hex format changed in v${EXPORT_FORMAT_VERSION} — re-export from a current build`)
        }
        if (!Array.isArray(data.snapshots) || data.snapshots.length === 0) {
          throw new Error('Invalid format: missing snapshots array')
        }
        loadGeneration(data.snapshots, data.seed ?? null)
        setDebugEnabled(true)
      } catch (err) {
        setImportError(err.message)
      }
    }
    reader.readAsText(file)
  }

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
        <div className="gen-debug-cols">
          <div className="gen-debug-col">
            <button className="gen-debug-btn gen-debug-btn--generate" onClick={handleGenerate}>
              Generate Map
            </button>
            <input
              className="gen-debug-seed-input"
              type="text"
              value={seedInput}
              placeholder="Seed (blank = random)"
              onChange={e => setSeedInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }}
            />
            {seed != null && (
              <div className="gen-debug-seed-label">
                Seed: <code>{seed}</code>
              </div>
            )}
          </div>
          <div className="gen-debug-col">
            <button
              className="gen-debug-btn gen-debug-btn--debug"
              onClick={() => setDebugEnabled(d => !d)}
              disabled={!hasSnapshots}
            >
              Debug
            </button>
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={handleExport}
              disabled={!hasSnapshots}
            >
              Export JSON
            </button>
            <button
              className="gen-debug-btn gen-debug-btn--setup"
              onClick={() => fileInputRef.current.click()}
            >
              Import JSON
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
        {importError && (
          <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
            Import error: {importError}
          </div>
        )}
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
