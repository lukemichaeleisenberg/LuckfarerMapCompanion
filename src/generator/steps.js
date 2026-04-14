import { createState, buildBiomeGroupings } from './state.js'
import { buildGrid, GRID_COLS, GRID_ROWS } from '../core/hexGrid.js'
import {
  SECONDARY_TYPES,
  BIOME_LOOKUP,
  WEIGHTED_PRIMARY_BIOMES
} from '../core/biomes.js'

// Called once by the store on initial load to build the hex key structure.
export function buildInitialHexMap () {
  const m = {}
  for (const hex of buildGrid()) {
    m[`${hex.q},${hex.r}`] = null
  }
  return m
}

// =============================================================================
// PHASE 1 — SETUP
// Covers steps: 0A, 0B, 0C, 0D, 0E, 0F
// =============================================================================

export function setupGrid (existingHexMap) {
  const state = createState()

  for (const key of Object.keys(existingHexMap)) {
    state.hexes[key] = null
  }

  state.biomeGroupings = buildBiomeGroupings()

  let prevShape = null
  for (const grouping of state.biomeGroupings) {
    grouping.primaryBiome =
      WEIGHTED_PRIMARY_BIOMES[
        Math.floor(Math.random() * WEIGHTED_PRIMARY_BIOMES.length)
      ]

    grouping.hexShapes.forEach((hexShape, idx) => {
      hexShape.secondary_biome =
        SECONDARY_TYPES[Math.floor(Math.random() * SECONDARY_TYPES.length)]
      hexShape.combined_biome =
        BIOME_LOOKUP[grouping.primaryBiome]?.[hexShape.secondary_biome] ??
        grouping.primaryBiome

      if (idx === 0 && grouping.primaryBiome === 'mountain') {
        hexShape.secondary_biome = 'hill'
        hexShape.combined_biome = BIOME_LOOKUP['mountain']['hill'] // mountain_hill
      }

      if (prevShape?.secondary_biome === 'mountain') {
        hexShape.secondary_biome = 'hill'
        hexShape.combined_biome =
          BIOME_LOOKUP[grouping.primaryBiome]?.['hill'] ?? grouping.primaryBiome
      }

      prevShape = hexShape
    })
  }

  return state
}
