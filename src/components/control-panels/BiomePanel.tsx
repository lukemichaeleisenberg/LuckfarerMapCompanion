import { BIOME_CATALOG } from '../../core/biomes'
import { Section, TypeGrid } from './panelPrimitives'

const SORTED_BIOMES = Object.keys(BIOME_CATALOG).sort((a, b) =>
  BIOME_CATALOG[a].name.localeCompare(BIOME_CATALOG[b].name)
)

interface BiomePanelProps {
  activeOther: string | null
  onSelectOther: (type: string) => void
}

export default function BiomePanel({ activeOther, onSelectOther }: BiomePanelProps) {
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
