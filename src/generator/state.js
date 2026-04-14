// ─── Generator state shape ───────────────────────────────────────────────────
// This object is threaded through every step. Each step receives it, mutates
// or replaces fields, and returns the new state. Only `hexes` is returned to
// the store; everything else is generation-time bookkeeping.

/**
 * @typedef {Object} HexState
 * Either a biome hex:     { mode: 'biome', primary: string, secondary: string }
 * Or a special-type hex:  { mode: 'other', type: string }
 */

/**
 * @typedef {Object} CoordinateModifier
 * @property {'x'|'y'} axis
 * @property {number}  delta
 */

/**
 * @typedef {Object} HexGroupShape
 * @property {number} count
 * @property {string} biome   - biome key (primary or secondary lookup result)
 * @property {'clump'|'tendril'|'belt'} shape
 */

/**
 * @typedef {Object} BiomeGrouping
 * @property {CoordinateModifier} coordinateModifier
 * @property {string}             primaryBiome       - e.g. 'arctic', 'sea'
 * @property {HexGroupShape[]}    hexGroupShapes     - first 3 shapes (steps D–F)
 * @property {HexGroupShape}      finalClump         - "N+1 Clump Hexes of previously placed biome"
 */

/**
 * @typedef {Object} MapGenState
 * @property {Object.<string, HexState>} hexes            - "q,r" → HexState
 * @property {BiomeGrouping[]}           biomeGroupings   - 4 entries
 * @property {Array<{q:number,r:number}>} headwaters
 */

/** Returns a fresh, empty MapGenState. */
export function createState () {
  return {
    hexes: {},
    biomeGroupings: [],
    headwaters: []
  }
}

/** Builds the 4 biome groupings with their coordinate modifiers and hex shapes. */
export function buildBiomeGroupings () {
  const configs = [
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
