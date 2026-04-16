import { useMemo, useState, useRef, useEffect } from 'react'
import { Stage, Layer, RegularPolygon } from 'react-konva'
import { buildGrid, HEX_X_RADIUS, HEX_Y_RADIUS, HEX_SIZE } from '../core/hexGrid.js'
import { BIOME_CATALOG, resolveBiome } from '../core/biomes.js'

export default function HexCanvas({ hexMap, onHexClick }) {
  const grid  = useMemo(() => buildGrid(), [])
  const hexes = useMemo(() => grid.toArray(), [grid])

  const [hoveredHex, setHoveredHex] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const stageRef = useRef(null)

  useEffect(() => {
    const container = stageRef.current?.getStage()?.container()
    if (container) container.style.touchAction = 'pan-x pan-y'
  }, [])

  const canvasWidth = grid.pixelWidth  + HEX_X_RADIUS
  const canvasHeight = grid.pixelHeight + HEX_Y_RADIUS

  return (
    <div
      className="canvas-wrapper"
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className="canvas-center">
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight}>
        <Layer>
          {hexes.map(hex => {
            const key = `${hex.q},${hex.r}`
            const state = hexMap[key]
            const biome = resolveBiome(state)
            const { color, stroke } = BIOME_CATALOG[biome]
            const cx = hex.x + HEX_X_RADIUS
            const cy = hex.y + HEX_Y_RADIUS
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
                onMouseEnter={() => setHoveredHex({ q: hex.q, r: hex.r, biome })}
                onMouseLeave={() => setHoveredHex(null)}
              />
            )
          })}
        </Layer>
      </Stage>
      </div>

      {hoveredHex && (
        <div
          className="hex-tooltip"
          style={{
            left: mousePos.x + 14,
            top: mousePos.y - 10,
            borderColor: BIOME_CATALOG[hoveredHex.biome].color,
          }}
        >
          <span
            className="swatch"
            style={{ background: BIOME_CATALOG[hoveredHex.biome].color }}
          />
          <span className="hex-tooltip-name">
            {BIOME_CATALOG[hoveredHex.biome].name}
          </span>
          <span className="hex-tooltip-coords">
            {hoveredHex.q}, {hoveredHex.r}
          </span>
        </div>
      )}
    </div>
  )
}
