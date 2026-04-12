import { useMemo, useState } from 'react'
import { Stage, Layer, RegularPolygon } from 'react-konva'
import { buildGrid, HEX_X_RADIUS, HEX_Y_RADIUS, HEX_SIZE } from '../hexGrid.js'
import { BIOME_CATALOG, resolveBiome } from '../biomes.js'

export default function HexCanvas({ hexMap, onHexClick }) {
  const grid  = useMemo(() => buildGrid(), [])
  const hexes = useMemo(() => grid.toArray(), [grid])

  const [hoveredBiome, setHoveredBiome] = useState(null)
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 })

  const canvasWidth  = grid.pixelWidth  + HEX_X_RADIUS
  const canvasHeight = grid.pixelHeight + HEX_Y_RADIUS

  return (
    <div
      className="canvas-wrapper"
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div style={{ width: 'fit-content', margin: '0 auto' }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {hexes.map(hex => {
            const key   = `${hex.q},${hex.r}`
            const state = hexMap[key]
            const biome           = resolveBiome(state)
            const { color, stroke } = BIOME_CATALOG[biome]
            const cx              = hex.x + HEX_X_RADIUS
            const cy              = hex.y + HEX_Y_RADIUS
            return (
              <RegularPolygon
                key={key}
                x={cx} y={cy}
                sides={6}
                radius={HEX_SIZE}
                rotation={30}
                fill={color}
                stroke={stroke}
                strokeWidth={1}
                onClick={() => onHexClick(hex)}
                onTap={() => onHexClick(hex)}
                onMouseEnter={() => setHoveredBiome(biome)}
                onMouseLeave={() => setHoveredBiome(null)}
              />
            )
          })}
        </Layer>
      </Stage>
      </div>

      {hoveredBiome && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 14,
          top: mousePos.y - 10,
          background: 'rgba(10, 12, 20, 0.88)',
          border: `1px solid ${BIOME_CATALOG[hoveredBiome].color}`,
          borderRadius: 5,
          padding: '4px 9px',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: 2,
            background: BIOME_CATALOG[hoveredBiome].color,
            flexShrink: 0, display: 'inline-block',
          }} />
          <span style={{ fontSize: 12, color: '#e0d8c8', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {BIOME_CATALOG[hoveredBiome].name}
          </span>
        </div>
      )}
    </div>
  )
}
