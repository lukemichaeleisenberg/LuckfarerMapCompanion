// ─── Generator state shape ───────────────────────────────────────────────────
// This object is threaded through every step. Each step receives it, mutates
// or replaces fields, and returns the new state. Only `hexes` is returned to
// the store; everything else is generation-time bookkeeping.
//
// The type definitions live in src/types.ts (HexState, BiomeGrouping,
// MapGenState, …) so components and the store can import them too.

import { shuffle } from '../core/random'
import type { BiomeGrouping, CoordinateModifier, GeneralShapeKind, HexShape, MapGenState } from '../types'

/** Returns a fresh, empty MapGenState. */
export function createState (): MapGenState {
  return {
    hexes: {},
    biomeGroupings: [],
    shapes: {},
    nextShapeId: 1,
    latitude: null
  }
}

/** Builds the 4 biome groupings with their coordinate modifiers and hex shapes. */
export function buildBiomeGroupings (): BiomeGrouping[] {
  const bases = [4, 8, 16, 32]
  const modifiers: CoordinateModifier[] = shuffle([
    { axis: 'x', offset: 0 },
    { axis: 'y', offset: -2 },
    { axis: 'x', offset: 2 },
    { axis: 'y', offset: 0 }
  ])
  const configs: Array<[CoordinateModifier, number]> = bases.map((base, i) => [modifiers[i], base])
  return configs.map(([coordinateModifier, base]) => ({
    coordinateModifier,
    primaryBiome: null,
    hexShapes: [
      makeShape('clump', base),
      makeShape('tendril', base),
      makeShape('belt', base),
      makeShape('clump', base + 1)
    ]
  }))
}

// Restricted to GeneralShapeKind: 'single' is never a base shape — only the
// special-biome and geyser_basin overrides may set it.
function makeShape (shape: GeneralShapeKind, count: number): HexShape {
  return { secondaryBiome: null, combinedBiome: null, count, shape }
}
