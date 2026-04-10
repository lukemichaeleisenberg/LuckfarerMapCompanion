import { useMemo, useState } from 'react'
import { Stage, Layer, RegularPolygon } from 'react-konva'
import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
import {
  PRIMARY_TYPES, SECONDARY_TYPES, OTHER_TYPES,
  BIOME_LOOKUP, BIOME_NAMES, TYPE_NAMES,
  BIOME_COLORS, BIOME_STROKE, TYPE_COLORS,
} from './biomes.js'

const GRID_COLS = 20
const GRID_ROWS = 20
const HEX_SIZE = 30

const HEX_X_RADIUS = HEX_SIZE
const HEX_Y_RADIUS = HEX_SIZE * (Math.sqrt(3) / 2)

const FlatHex = defineHex({
  dimensions: HEX_SIZE,
  orientation: Orientation.FLAT,
  origin: 'topLeft',
})

function buildGrid() {
  return new Grid(FlatHex, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

function resolveBiome(hexState) {
  if (hexState.mode === 'other') return hexState.type
  return BIOME_LOOKUP[hexState.primary]?.[hexState.secondary] ?? 'grassland'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HexMap() {
  const grid  = useMemo(() => buildGrid(), [])
  const hexes = useMemo(() => grid.toArray(), [grid])

  const [hexMap, setHexMap] = useState(() => {
    const m = {}
    for (const hex of hexes)
      m[`${hex.q},${hex.r}`] = { mode: 'biome', primary: 'grassland', secondary: 'grassland' }
    return m
  })

  const [activePrimary,   setActivePrimary]   = useState('grassland')
  const [activeSecondary, setActiveSecondary] = useState('grassland')
  const [activeOther,     setActiveOther]     = useState(null)

  const [hoveredBiome, setHoveredBiome] = useState(null)
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 })

  function selectPrimary(p)  { setActivePrimary(p);   setActiveOther(null) }
  function selectSecondary(s){ setActiveSecondary(s); setActiveOther(null) }
  function selectOther(t)    { setActiveOther(t) }

  function handleHexClick(hex) {
    const key = `${hex.q},${hex.r}`
    const newState = activeOther
      ? { mode: 'other', type: activeOther }
      : { mode: 'biome', primary: activePrimary, secondary: activeSecondary }
    setHexMap(prev => ({ ...prev, [key]: newState }))
  }

  const activeBiome = activeOther
    ? activeOther
    : (BIOME_LOOKUP[activePrimary]?.[activeSecondary] ?? 'grassland')

  const canvasWidth  = grid.pixelWidth  + HEX_X_RADIUS
  const canvasHeight = grid.pixelHeight + HEX_Y_RADIUS

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column' }}
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* ── Header ── */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#555' }}>painting</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: 4,
              background: BIOME_COLORS[activeBiome],
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 14,
              color: '#e0d8c8',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
            }}>
              {BIOME_NAMES[activeBiome]}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ── Left toolbar ── */}
        <div style={{
          width: 200,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: 16,
          borderRight: '1px solid #333',
        }}>
          <Section label="Primary Type">
            <TypeGrid
              types={PRIMARY_TYPES}
              active={activeOther ? null : activePrimary}
              onSelect={selectPrimary}
              nameMap={TYPE_NAMES}
              colorMap={TYPE_COLORS}
            />
          </Section>

          <Section label="Secondary Type">
            <TypeGrid
              types={SECONDARY_TYPES}
              active={activeOther ? null : activeSecondary}
              onSelect={selectSecondary}
              nameMap={TYPE_NAMES}
              colorMap={TYPE_COLORS}
            />
          </Section>

          <Section label="Other (standalone)">
            <TypeGrid
              types={OTHER_TYPES}
              active={activeOther}
              onSelect={selectOther}
              nameMap={BIOME_NAMES}
              colorMap={BIOME_COLORS}
            />
          </Section>
        </div>

        {/* ── Hex grid ── */}
        <div style={{ padding: 16 }}>
          <Stage width={canvasWidth} height={canvasHeight}>
            <Layer>
              {hexes.map(hex => {
                const key   = `${hex.q},${hex.r}`
                const state = hexMap[key]
                const biome = resolveBiome(state)
                const cx    = hex.x + HEX_X_RADIUS
                const cy    = hex.y + HEX_Y_RADIUS
                return (
                  <RegularPolygon
                    key={key}
                    x={cx} y={cy}
                    sides={6}
                    radius={HEX_SIZE}
                    rotation={30}
                    fill={BIOME_COLORS[biome]}
                    stroke={BIOME_STROKE[biome]}
                    strokeWidth={1}
                    onClick={() => handleHexClick(hex)}
                    onTap={() => handleHexClick(hex)}
                    onMouseEnter={() => setHoveredBiome(biome)}
                    onMouseLeave={() => setHoveredBiome(null)}
                  />
                )
              })}
            </Layer>
          </Stage>
        </div>

        {/* ── Right toolbar ── */}
        <div style={{
          width: 200,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: 16,
          borderLeft: '1px solid #333',
        }}>
          <Section label="All Biomes">
            <TypeGrid
              types={Object.keys(BIOME_NAMES)}
              active={activeOther}
              onSelect={selectOther}
              nameMap={BIOME_NAMES}
              colorMap={BIOME_COLORS}
            />
          </Section>
        </div>

      </div>

      {/* ── Hover tooltip ── */}
      {hoveredBiome && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 14,
          top: mousePos.y - 10,
          background: 'rgba(10, 12, 20, 0.88)',
          border: `1px solid ${BIOME_COLORS[hoveredBiome]}`,
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
            background: BIOME_COLORS[hoveredBiome],
            flexShrink: 0, display: 'inline-block',
          }} />
          <span style={{ fontSize: 12, color: '#e0d8c8', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {BIOME_NAMES[hoveredBiome]}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#555',
        marginBottom: 5,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function TypeGrid({ types, active, onSelect, nameMap, colorMap }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {types.map(t => {
        const color    = colorMap[t]
        const light    = isLight(color)
        const isActive = t === active
        return (
          <button
            key={t}
            title={nameMap[t]}
            onClick={() => onSelect(t)}
            style={{
              padding: '3px 7px',
              background: color,
              border: isActive ? '2px solid #fff' : '2px solid rgba(0,0,0,0.25)',
              borderRadius: 4,
              color: light ? '#222' : '#fff',
              fontWeight: 'bold',
              fontSize: 11,
              cursor: 'pointer',
              textShadow: light ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              outline: isActive ? '1px solid rgba(255,255,255,0.4)' : 'none',
              outlineOffset: 1,
            }}
          >
            {nameMap[t]}
          </button>
        )
      })}
    </div>
  )
}
