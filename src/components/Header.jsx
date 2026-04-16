import { BIOME_CATALOG } from '../core/biomes.js'

export default function Header({ activeBiome }) {

  return (
    <div className="header">
      <h2 className="header-title">
        Luckfarer Map Companion
      </h2>

      <div className="header-biome row">
        <span className="muted">placing</span>
        <span
          className="swatch"
          style={{ background: BIOME_CATALOG[activeBiome].color }}
        />
        <span className="header-biome-name">
          {BIOME_CATALOG[activeBiome].name}
        </span>
      </div>
    </div>
  )
}
