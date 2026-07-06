// ─── Shared domain types ─────────────────────────────────────────────────────
// Central home for the shapes threaded through the generator, store, and
// components. Formerly JSDoc typedefs in generator/state.js.

// Axial hex coordinate.
export interface Axial {
  q: number
  r: number
}

// 1-indexed offset (col/row) coordinate, as printed in the rulebook tables.
export interface Offset {
  col: number
  row: number
}

export type Direction = 'NE' | 'E' | 'SE' | 'SW' | 'W' | 'NW'

// Either a biome hex or a special-type hex (e.g. river, landmark).
export type HexState =
  | { mode: 'biome', primary: string, secondary: string }
  | { mode: 'other', type: string }

// "q,r" → HexState. `null` marks an explicitly empty cell; missing keys are
// off-grid or unvisited.
export type HexMap = Record<string, HexState | null>

export interface CoordinateModifier {
  axis: 'x' | 'y'
  offset: number
}

export type ShapeKind = 'clump' | 'tendril' | 'belt'

export interface HexShape {
  secondary_biome: string | null   // rolled secondary type (or null pre-setup)
  combined_biome: string | null    // resolved BIOME_LOOKUP result (or null pre-setup)
  count: number                    // target hex count for this shape
  shape: ShapeKind
}

export interface BiomeGrouping {
  coordinateModifier: CoordinateModifier
  primaryBiome: string | null      // e.g. 'arctic', 'sea' (null pre-setup)
  hexShapes: HexShape[]            // 4 shapes: clump, tendril, belt, clump (final clump = base+1)
}

// Threaded through every generator step. Each step receives it, mutates or
// replaces fields, and returns the new state. Only `hexes` is returned to the
// store; everything else is generation-time bookkeeping.
export interface MapGenState {
  hexes: HexMap
  biomeGroupings: BiomeGrouping[]
}
