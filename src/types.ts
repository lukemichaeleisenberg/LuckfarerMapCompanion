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

export type Latitude = 'equatorial' | 'temperate' | 'polar'

// Persistent hex markers that survive biome changes. Stored as a plain array
// (set semantics enforced by core/tags.ts) so hexes stay JSON-serializable.
export type Tag =
  | 'Open Water'
  | 'Shoreline'
  | 'Settlement'
  | 'Altitude'
  | 'Road'
  | 'Inlet'
  | 'Riverway'
  | 'Inland'

// A placed hex. `biome` is a BIOME_CATALOG key; anything derivable from it
// (components, colors, names) lives in the catalog, not on the hex.
// `shapeId` is absent on hexes not placed as part of a shape (e.g. sea fill).
// Biome changes mutate `biome` in place so `tags` and `shapeId` persist.
export interface HexState {
  biome: string
  shapeId?: number
  tags?: Tag[]
}

// "q,r" → HexState. `null` marks an explicitly empty cell; missing keys are
// off-grid or unvisited.
export type HexMap = Record<string, HexState | null>

export interface CoordinateModifier {
  axis: 'x' | 'y'
  offset: number
}

export type ShapeKind = 'clump' | 'tendril' | 'belt'

export interface HexShape {
  secondaryBiome: string | null   // rolled secondary type (or null pre-setup)
  combinedBiome: string | null    // resolved BIOME_LOOKUP result (or null pre-setup)
  count: number                   // target hex count for this shape
  shape: ShapeKind
}

export interface BiomeGrouping {
  coordinateModifier: CoordinateModifier
  primaryBiome: string | null      // e.g. 'arctic', 'sea' (null pre-setup)
  hexShapes: HexShape[]            // 4 shapes: clump, tendril, belt, clump (final clump = base+1)
}

// Identity and membership of one placed shape, so later steps can operate on
// "that shape" after placement.
export interface ShapeRecord {
  id: number
  kind: ShapeKind
  groupingIndex: number            // index into MapGenState.biomeGroupings
  origin: Axial                    // first hex placed for this shape
  hexKeys: string[]                // "q,r" keys of every hex in the shape
}

// Threaded through every generator step. Each step receives it, mutates or
// replaces fields, and returns the new state. Only `hexes` is returned to the
// store; everything else is generation-time bookkeeping.
export interface MapGenState {
  hexes: HexMap
  biomeGroupings: BiomeGrouping[]
  shapes: Record<number, ShapeRecord>
  nextShapeId: number
  latitude: Latitude | null        // rolled during setup (null pre-roll)
}
