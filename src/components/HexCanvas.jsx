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
  const wrapperRef = useRef(null)

  useEffect(() => {
    const container = stageRef.current?.getStage()?.container()
    if (container) container.style.touchAction = 'pan-x pan-y'
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (el) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    }
  }, [])

  const canvasWidth = grid.pixelWidth  + HEX_X_RADIUS
  const canvasHeight = grid.pixelHeight + HEX_Y_RADIUS

  return (
    <div
      ref={wrapperRef}
      className="canvas-wrapper"
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className="canvas-center">
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight}>
        <Layer>
          {hexes.map(hex => {
            const key = `${hex.q},${hex.r}`
            const state = hexMap[key]
            const isUnassigned = state == null
            const biome = isUnassigned ? null : resolveBiome(state)
            const color  = isUnassigned ? '#2a2a35' : BIOME_CATALOG[biome].color
            const stroke = isUnassigned ? '#3a3a45' : BIOME_CATALOG[biome].stroke
            const cx = hex.x + HEX_X_RADIUS
            const cy = hex.y + HEX_Y_RADIUS
            return (
              <RegularPolygon
                key={key}
                x={cx} y={cy}
                sides={6}
                radius={HEX_SIZE}
                rotation={0}
                fill={color}
                stroke={stroke}
                strokeWidth={1}
                onClick={() => onHexClick(hex)}
                onTap={() => onHexClick(hex)}
                onMouseEnter={() => setHoveredHex({ col: hex.col, row: hex.row, biome })}
                onMouseLeave={() => setHoveredHex(null)}
              />
            )
          })}
        </Layer>
      </Stage>
      </div>

      {hoveredHex && (() => {
        const entry = hoveredHex.biome ? BIOME_CATALOG[hoveredHex.biome] : null
        const color = entry?.color ?? '#2a2a35'
        const name  = entry?.name  ?? 'unassigned'
        return (
          <div
            className="hex-tooltip"
            style={{
              left: mousePos.x + 14,
              top: mousePos.y - 10,
              borderColor: color,
            }}
          >
            <span className="swatch" style={{ background: color }} />
            <span className="hex-tooltip-name">{name}</span>
            <span className="hex-tooltip-coords">
              {hoveredHex.col + 1}, {hoveredHex.row + 1}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
