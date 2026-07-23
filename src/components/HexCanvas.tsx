import { useMemo, useState, useRef, useEffect } from 'react'
import { Stage, Layer, RegularPolygon } from 'react-konva'
import type Konva from 'konva'
import { buildGrid, HEX_X_RADIUS, HEX_Y_RADIUS, HEX_SIZE, keyOf, type GridHex } from '../core/hexGrid'
import { BIOME_CATALOG } from '../core/biomes'
import type { HexMap } from '../types'

interface HexCanvasProps {
  hexMap: HexMap
  onHexClick: (hex: GridHex) => void
}

interface HoveredHex {
  col: number
  row: number
  biome: string | null
}

export default function HexCanvas({ hexMap, onHexClick }: HexCanvasProps) {
  const grid  = useMemo(() => buildGrid(), [])
  const hexes = useMemo(() => grid.toArray(), [grid])

  const [hoveredHex, setHoveredHex] = useState<HoveredHex | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const stageRef = useRef<Konva.Stage>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
              const key = keyOf(hex.q, hex.r)
              const state = hexMap[key]
              const biome = state?.biome ?? null
              const style = biome ? BIOME_CATALOG[biome] : null
              const color  = style?.color  ?? '#2a2a35'
              const stroke = style?.stroke ?? '#3a3a45'
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
