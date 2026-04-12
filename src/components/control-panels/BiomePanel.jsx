import { BIOME_CATALOG } from '../../biomes.js'
import { Section, TypeGrid } from './Controls.jsx'

const SORTED_BIOMES = Object.keys(BIOME_CATALOG).sort((a, b) =>
  BIOME_CATALOG[a].name.localeCompare(BIOME_CATALOG[b].name)
)

export default function BiomePanel({ activeOther, onSelectOther }) {
  return (
    <div className="panel">
      <Section label="All Biomes">
        <TypeGrid
          types={SORTED_BIOMES}
          active={activeOther}
          onSelect={onSelectOther}
          catalog={BIOME_CATALOG}
        />
      </Section>
    </div>
  )
}
