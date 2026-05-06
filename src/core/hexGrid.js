import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'

export const GRID_COLS = 20
export const GRID_ROWS = 20
export const HEX_SIZE = 30

export const HEX_X_RADIUS = HEX_SIZE * (Math.sqrt(3) / 2)
export const HEX_Y_RADIUS = HEX_SIZE

export const PointyHex = defineHex({
  dimensions: HEX_SIZE,
  orientation: Orientation.POINTY,
  offset: -1,
  origin: 'topLeft'
})

export function buildGrid () {
  return new Grid(PointyHex, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
}

// ─── Hex key helpers ─────────────────────────────────────────────────────────
export const keyOf = (q, r) => `${q},${r}`

export function parseKey (key) {
  const [q, r] = key.split(',').map(Number)
  return { q, r }
}

// ─── Direction primitives ────────────────────────────────────────────────────
export const DIRECTIONS = ['NE', 'E', 'SE', 'SW', 'W', 'NW']

export const STEP = {
  NE: { q: 1, r: -1 },
  E:  { q: 1, r: 0 },
  SE: { q: 0, r: 1 },
  SW: { q: -1, r: 1 },
  W:  { q: -1, r: 0 },
  NW: { q: 0, r: -1 }
}

export function step (q, r, dir) {
  const d = STEP[dir]
  return { q: q + d.q, r: r + d.r }
}

// ─── Axial / offset coordinate conversion ────────────────────────────────────
export function offsetToAxial (col1Indexed, row1Indexed) {
  const hex = new PointyHex({ col: col1Indexed - 1, row: row1Indexed - 1 })
  return { q: hex.q, r: hex.r }
}

export function axialToOffset ({ q, r }) {
  const hex = new PointyHex({ q, r })
  return { col: hex.col + 1, row: hex.row + 1 }
}

// ─── Neighbor iteration helpers ──────────────────────────────────────────────
// `hexes` is a `{ key → HexState | null | undefined }` map. Iterates the six
// flat neighbors of (q,r) and invokes `fn(hex, neighbor, dir)` for each, where
// `hex` is the looked-up value (may be null for empty or undefined for off-grid)
// and `neighbor` is `{ q, r }`.
export function forEachNeighbor (hexes, q, r, fn) {
  for (const dir of DIRECTIONS) {
    const n = step(q, r, dir)
    fn(hexes[keyOf(n.q, n.r)], n, dir)
  }
}

// Returns neighbors `{ q, r, dir }` for which `predicate(hex, neighbor, dir)` is truthy.
export function filterNeighbors (hexes, q, r, predicate) {
  const out = []
  forEachNeighbor(hexes, q, r, (hex, n, dir) => {
    if (predicate(hex, n, dir)) out.push({ ...n, dir })
  })
  return out
}

// Counts neighbors for which `predicate(hex, neighbor, dir)` is truthy.
export function countNeighbors (hexes, q, r, predicate) {
  let count = 0
  forEachNeighbor(hexes, q, r, (hex, n, dir) => {
    if (predicate(hex, n, dir)) count++
  })
  return count
}
