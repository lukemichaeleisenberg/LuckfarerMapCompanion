// ─── Generator state shape ───────────────────────────────────────────────────
// This object is threaded through every step. Each step receives it, mutates
// or replaces fields, and returns the new state. Only `hexes` is returned to
// the store; everything else is generation-time bookkeeping.
//
// The type definitions live in src/types.ts (HexState, BiomeGrouping,
// MapGenState, …) so components and the store can import them too.

import type { BiomeGrouping, CoordinateModifier, MapGenState } from '../types'

/** Returns a fresh, empty MapGenState. */
export function createState (): MapGenState {
  return {
    hexes: {},
    biomeGroupings: []
  }
}

/** Builds the 4 biome groupings with their coordinate modifiers and hex shapes. */
export function buildBiomeGroupings (): BiomeGrouping[] {
  const configs: Array<[CoordinateModifier, number]> = [
    [{ axis: 'x', offset: 0 }, 4],
    [{ axis: 'x', offset: -2 }, 8],
    [{ axis: 'y', offset: -2 }, 16],
    [{ axis: 'y', offset: 0 }, 32]
  ]
  return configs.map(([coordinateModifier, base]) => ({
    coordinateModifier,
    primaryBiome: null,
    hexShapes: [
      {
        secondary_biome: null,
        combined_biome: null,
        count: base,
        shape: 'clump'
      },
      {
        secondary_biome: null,
        combined_biome: null,
        count: base,
        shape: 'tendril'
      },
      {
        secondary_biome: null,
        combined_biome: null,
        count: base,
        shape: 'belt'
      },
      {
        secondary_biome: null,
        combined_biome: null,
        count: base + 1,
        shape: 'clump'
      }
    ]
  }))
}
