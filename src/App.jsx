import { useState } from 'react'
import { combineBiomes } from './core/biomes'
import { keyOf } from './core/hexGrid'
import { useMapStore } from './store/mapStore'
import HexCanvas from './components/HexCanvas.jsx'
import PalettePanel from './components/control-panels/PalettePanel.jsx'
import BiomePanel from './components/control-panels/BiomePanel.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import GenerationDebug from './components/GenerationDebug.jsx'

export default function App() {
  const hexMap = useMapStore(s => s.hexMap)
  const setHex = useMapStore(s => s.setHex)

  const [activePrimary,   setActivePrimary]   = useState('grassland')
  const [activeSecondary, setActiveSecondary] = useState('grassland')
  const [activeOther,     setActiveOther]     = useState(null)

  function selectPrimary(p)   { setActivePrimary(p);   setActiveOther(null) }
  function selectSecondary(s) { setActiveSecondary(s); setActiveOther(null) }
  function selectOther(t)     { setActiveOther(t) }

  const activeBiome = activeOther ?? combineBiomes(activePrimary, activeSecondary)

  function handleHexClick(hex) {
    setHex(keyOf(hex.q, hex.r), { biome: activeBiome })
  }

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

      <GenerationDebug />

      <Footer />

    </div>
  )
}
