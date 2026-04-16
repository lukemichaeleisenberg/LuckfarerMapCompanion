import { createState, buildBiomeGroupings } from './state.js'
import { buildGrid } from '../core/hexGrid.js'
import {
  SECONDARY_TYPES,
  BIOME_LOOKUP,
  WEIGHTED_PRIMARY_BIOMES
} from '../core/biomes.js'

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

// =============================================================================
// PHASE 2 — BIOME PLACEMENT
// Covers step: 0G
// Shape rules, tie-breaking, and fallback logic are helpers within this function.
// =============================================================================

export function placeBiomes (state) {
  return state
}

// =============================================================================
// PHASE 3 — POST-PLACEMENT CLEANUP
// Covers steps: 0H, 0I, 0J, 0K
// =============================================================================

export function cleanupBiomes (state) {
  for (const key of Object.keys(state.hexes)) {
    if (state.hexes[key] === null) {
      state.hexes[key] = { mode: 'biome', primary: 'sea', secondary: 'sea' }
    }
  }

  return state
}

// =============================================================================
// PHASE 4 — FEATURE PLACEMENT
// Covers steps: 0L, 0M, 0N, 0O, 0Q, 0R
// Note: 0O is a set of constraints enforced during 0N's river tracing —
// it is not a separate pass and is handled inline within the 0N block below.
// =============================================================================

export function placeFeatures (state) {
  return state
}

// =============================================================================
// PHASE 5 — FEATURE CLEANUP
// Covers step: 0P
// =============================================================================

export function cleanupFeatures (state) {
  return state
}
