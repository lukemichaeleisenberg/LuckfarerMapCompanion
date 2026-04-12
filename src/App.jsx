import { useState } from 'react'
import { BIOME_LOOKUP } from './biomes.js'
import { useMapStore } from './store/mapStore.js'
import HexCanvas from './components/HexCanvas.jsx'
import PalettePanel from './components/control-panels/PalettePanel.jsx'
import BiomePanel from './components/control-panels/BiomePanel.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const hexMap = useMapStore(s => s.hexMap)
  const setHex = useMapStore(s => s.setHex)

  const [activePrimary,   setActivePrimary]   = useState('grassland')
  const [activeSecondary, setActiveSecondary] = useState('grassland')
  const [activeOther,     setActiveOther]     = useState(null)

  function selectPrimary(p)   { setActivePrimary(p);   setActiveOther(null) }
  function selectSecondary(s) { setActiveSecondary(s); setActiveOther(null) }
  function selectOther(t)     { setActiveOther(t) }

  function handleHexClick(hex) {
    const key = `${hex.q},${hex.r}`
    const newState = activeOther
      ? { mode: 'other', type: activeOther }
      : { mode: 'biome', primary: activePrimary, secondary: activeSecondary }
    setHex(key, newState)
  }

  const activeBiome = activeOther
    ? activeOther
    : (BIOME_LOOKUP[activePrimary]?.[activeSecondary] ?? 'grassland')

  return (
    <div className="app-layout">

      <Header activeBiome={activeBiome} />

      {/* ── Body ── */}
      <div className="app-body">
        <PalettePanel
          activePrimary={activePrimary}
          activeSecondary={activeSecondary}
          activeOther={activeOther}
          onSelectPrimary={selectPrimary}
          onSelectSecondary={selectSecondary}
          onSelectOther={selectOther}
        />

        <HexCanvas hexMap={hexMap} onHexClick={handleHexClick} />

        <BiomePanel activeOther={activeOther} onSelectOther={selectOther} />
      </div>

      <Footer />

    </div>
  )
}
