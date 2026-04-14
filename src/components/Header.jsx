import { BIOME_CATALOG } from '../core/biomes.js'
import { useMapStore } from '../store/mapStore.js'

export default function Header({ activeBiome }) {
  const runGenerate = useMapStore(s => s.generateMap)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      borderBottom: '1px solid #333',
      background: '#0f1120',
    }}>
      <h2 style={{
        color: '#e0d8c8',
        fontFamily: 'Georgia, serif',
        margin: 0,
        fontSize: 18,
        letterSpacing: '0.02em',
      }}>
        Luckfarer Map Companion
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={runGenerate}
          style={{
            padding: '5px 14px',
            background: '#2a3a6a',
            border: '1px solid #4a5a9a',
            borderRadius: 5,
            color: '#c8d8ff',
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { e.target.style.background = '#3a4a8a' }}
          onMouseLeave={e => { e.target.style.background = '#2a3a6a' }}
        >
          Generate Map
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#555' }}>placing</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: 4,
              background: BIOME_CATALOG[activeBiome].color,
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 14,
              color: '#e0d8c8',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
            }}>
              {BIOME_CATALOG[activeBiome].name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
