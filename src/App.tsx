import { useState } from 'react'
import { combineBiomes } from './core/biomes'
import { keyOf, type GridHex } from './core/hexGrid'
import { useMapStore } from './store/mapStore'
import HexCanvas from './components/HexCanvas'
import PalettePanel from './components/control-panels/PalettePanel'
import BiomePanel from './components/control-panels/BiomePanel'
import Header from './components/Header'
import Footer from './components/Footer'
import GenerationDebug from './components/GenerationDebug'

export default function App() {
  const hexMap = useMapStore(s => s.hexMap)
  const setHex = useMapStore(s => s.setHex)

  const [activePrimary,   setActivePrimary]   = useState('grassland')
  const [activeSecondary, setActiveSecondary] = useState('grassland')
  const [activeOther,     setActiveOther]     = useState<string | null>(null)

  function selectPrimary(p: string)   { setActivePrimary(p);   setActiveOther(null) }
  function selectSecondary(s: string) { setActiveSecondary(s); setActiveOther(null) }
  function selectOther(t: string)     { setActiveOther(t) }

  const activeBiome = activeOther ?? combineBiomes(activePrimary, activeSecondary)

  function handleHexClick(hex: GridHex) {
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
