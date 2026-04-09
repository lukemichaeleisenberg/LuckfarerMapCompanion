import { useMemo, useState } from 'react'
import { Stage, Layer, RegularPolygon } from 'react-konva'
import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'

const GRID_COLS = 20
const GRID_ROWS = 20
const HEX_SIZE = 30 // circumradius in px

// For a flat-top hex with circumradius r:
//   half-width  = r          (center to left/right vertex)
//   half-height = r * sin(60°) = r * sqrt(3)/2  (center to top/bottom flat edge)
const HEX_X_RADIUS = HEX_SIZE
const HEX_Y_RADIUS = HEX_SIZE * (Math.sqrt(3) / 2)

// origin: 'topLeft' → hex.x/y is the top-left corner of the bounding box.
// We add HEX_X_RADIUS/HEX_Y_RADIUS when passing to RegularPolygon (which wants center).
const FlatHex = defineHex({
  dimensions: HEX_SIZE,
  orientation: Orientation.FLAT,
  origin: 'topLeft',
})

function buildGrid() {
  return new Grid(FlatHex, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
}

const TERRAIN_TYPES = ['plains', 'ocean', 'forest', 'mountain', 'desert']

const TERRAIN_COLORS = {
  plains:   '#7ec850',
  ocean:    '#3a7bd5',
  forest:   '#2d6a2d',
  mountain: '#9e9e9e',
  desert:   '#d4b483',
}

const TERRAIN_STROKE = {
  plains:   '#5a9e38',
  ocean:    '#1a4fa0',
  forest:   '#1a4a1a',
  mountain: '#606060',
  desert:   '#b89050',
}

export default function HexMap() {
  const grid = useMemo(() => buildGrid(), [])
  const hexes = useMemo(() => grid.toArray(), [grid])

  const [terrain, setTerrain] = useState(() => {
    const map = {}
    for (const hex of hexes) map[`${hex.q},${hex.r}`] = 'plains'
    return map
  })

  const [activeTerrain, setActiveTerrain] = useState('ocean')

  function handleHexClick(hex) {
    const key = `${hex.q},${hex.r}`
    setTerrain(prev => ({ ...prev, [key]: activeTerrain }))
  }

  // Add one hex-radius of padding so the rightmost/bottommost hexes aren't clipped
  const canvasWidth = grid.pixelWidth + HEX_X_RADIUS
  const canvasHeight = grid.pixelHeight + HEX_Y_RADIUS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <h2 style={{ color: '#e0d8c8', fontFamily: 'Georgia, serif', margin: 0 }}>
        Luckfarer Map Companion
      </h2>

      {/* Terrain palette */}
      <div style={{ display: 'flex', gap: 8 }}>
        {TERRAIN_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setActiveTerrain(t)}
            style={{
              padding: '6px 14px',
              background: TERRAIN_COLORS[t],
              border: activeTerrain === t ? '3px solid #fff' : '3px solid transparent',
              borderRadius: 6,
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Hex grid */}
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {hexes.map(hex => {
            const key = `${hex.q},${hex.r}`
            const t = terrain[key] ?? 'plains'
            // hex.x/y is bounding-box top-left; RegularPolygon needs center
            const cx = hex.x + HEX_X_RADIUS
            const cy = hex.y + HEX_Y_RADIUS
            return (
              <RegularPolygon
                key={key}
                x={cx}
                y={cy}
                sides={6}
                radius={HEX_SIZE}
                rotation={30}   // 30° rotates from Konva's default pointy-top → flat-top
                fill={TERRAIN_COLORS[t]}
                stroke={TERRAIN_STROKE[t]}
                strokeWidth={1}
                onClick={() => handleHexClick(hex)}
                onTap={() => handleHexClick(hex)}
              />
            )
          })}
        </Layer>
      </Stage>

      <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
        Click hexes to paint · active: <strong style={{ color: '#ccc' }}>{activeTerrain}</strong>
      </p>
    </div>
  )
}
