import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
import type { Axial, Direction, HexMap, HexState, Offset } from '../types'

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
export const keyOf = (q: number, r: number): string => `${q},${r}`

export function parseKey (key: string): Axial {
  const [q, r] = key.split(',').map(Number)
  return { q, r }
}

// ─── Direction primitives ────────────────────────────────────────────────────
export const DIRECTIONS: readonly Direction[] = ['NE', 'E', 'SE', 'SW', 'W', 'NW']

export const STEP: Record<Direction, Axial> = {
  NE: { q: 1, r: -1 },
  E:  { q: 1, r: 0 },
  SE: { q: 0, r: 1 },
  SW: { q: -1, r: 1 },
  W:  { q: -1, r: 0 },
  NW: { q: 0, r: -1 }
}

export function step (q: number, r: number, dir: Direction): Axial {
  const d = STEP[dir]
  return { q: q + d.q, r: r + d.r }
}

// ─── Axial / offset coordinate conversion ────────────────────────────────────
export function offsetToAxial (col1Indexed: number, row1Indexed: number): Axial {
  const hex = new PointyHex({ col: col1Indexed - 1, row: row1Indexed - 1 })
  return { q: hex.q, r: hex.r }
}

export function axialToOffset ({ q, r }: Axial): Offset {
  const hex = new PointyHex({ q, r })
  return { col: hex.col + 1, row: hex.row + 1 }
}

// ─── Neighbor iteration helpers ──────────────────────────────────────────────
// `hexes` is a `{ key → HexState | null | undefined }` map. Iterates the six
// flat neighbors of (q,r) and invokes `fn(hex, neighbor, dir)` for each, where
// `hex` is the looked-up value (may be null for empty or undefined for off-grid)
// and `neighbor` is `{ q, r }`.
type NeighborVisitor = (hex: HexState | null | undefined, neighbor: Axial, dir: Direction) => void
type NeighborPredicate = (hex: HexState | null | undefined, neighbor: Axial, dir: Direction) => boolean

export function forEachNeighbor (hexes: HexMap, q: number, r: number, fn: NeighborVisitor): void {
  for (const dir of DIRECTIONS) {
    const n = step(q, r, dir)
    fn(hexes[keyOf(n.q, n.r)], n, dir)
  }
}

// Returns neighbors `{ q, r, dir }` for which `predicate(hex, neighbor, dir)` is truthy.
export function filterNeighbors (hexes: HexMap, q: number, r: number, predicate: NeighborPredicate): Array<Axial & { dir: Direction }> {
  const out: Array<Axial & { dir: Direction }> = []
  forEachNeighbor(hexes, q, r, (hex, n, dir) => {
    if (predicate(hex, n, dir)) out.push({ ...n, dir })
  })
  return out
}

// Counts neighbors for which `predicate(hex, neighbor, dir)` is truthy.
export function countNeighbors (hexes: HexMap, q: number, r: number, predicate: NeighborPredicate): number {
  let count = 0
  forEachNeighbor(hexes, q, r, (hex, n, dir) => {
    if (predicate(hex, n, dir)) count++
  })
  return count
}
