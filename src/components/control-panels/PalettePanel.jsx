import {
  PRIMARY_TYPES, SECONDARY_TYPES, OTHER_TYPES,
  TYPE_CATALOG, BIOME_CATALOG,
} from '../../biomes.js'
import { Section, TypeGrid } from './Controls.jsx'

export default function PalettePanel({ activePrimary, activeSecondary, activeOther, onSelectPrimary, onSelectSecondary, onSelectOther }) {
  const sections = [
    {
      label:    'Primary Type',
      types:    PRIMARY_TYPES,
      active:   activeOther ? null : activePrimary,
      onSelect: onSelectPrimary,
      catalog:  TYPE_CATALOG,
    },
    {
      label:    'Secondary Type',
      types:    SECONDARY_TYPES,
      active:   activeOther ? null : activeSecondary,
      onSelect: onSelectSecondary,
      catalog:  TYPE_CATALOG,
    },
    {
      label:    'Other (standalone)',
      types:    OTHER_TYPES,
      active:   activeOther,
      onSelect: onSelectOther,
      catalog:  BIOME_CATALOG,
    },
  ]

  return (
    <div style={{
      width: 200,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '24px 16px 16px',
    }}>
      {sections.map(({ label, types, active, onSelect, catalog }) => (
        <Section key={label} label={label}>
          <TypeGrid types={types} active={active} onSelect={onSelect} catalog={catalog} />
        </Section>
      ))}
    </div>
  )
}
