import { createState, buildBiomeGroupings } from './state.js'
import { axialToOffset } from '../core/hexGrid.js'
import { pickOne, pickWeighted } from '../core/random.js'
import {
  SECONDARY_TYPES,
  WEIGHTED_PRIMARY_BIOMES,
  deriveSecondaryBiome
} from '../core/biomes.js'
import {
  placeOneShape,
  rollStartingHex,
  findStartFromHex
} from './biomePlacement.js'

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
    grouping.primaryBiome = pickWeighted(WEIGHTED_PRIMARY_BIOMES)

    grouping.hexShapes.forEach((hexShape, idx) => {
      const { secondary, combined } = deriveSecondaryBiome({
        primaryBiome: grouping.primaryBiome,
        rolledSecondary: pickOne(SECONDARY_TYPES),
        isFirstShape: idx === 0,
        prevSecondary: prevShape?.secondary_biome
      })
      hexShape.secondary_biome = secondary
      hexShape.combined_biome = combined
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

const ROUNDS = 10

export function placeBiomes (state, onStep) {
  const findStart = rollStartingHex(state)
  const totalShapes = state.biomeGroupings.length * ROUNDS
  let placedShapes = 0
  let lastHex = null

  for (let g = 0; g < state.biomeGroupings.length; g++) {
    const grouping = state.biomeGroupings[g]

    for (let round = 0; round < ROUNDS; round++) {
      const hexShape = pickOne(grouping.hexShapes)
      const { start, originText } = pickStartHex(state, grouping, lastHex, findStart)

      // randomFirstStep only applies when we rolled (not chaining from lastHex)
      const randomFirstStep = !lastHex || !start?.dir || originText.startsWith('Rolled')
      const {
        placed,
        lastHex: newLastHex,
        firstDir
      } = placeOneShape(state, grouping, hexShape, start, randomFirstStep)
      lastHex = newLastHex ?? lastHex
      placedShapes++

      onStep?.({
        ...formatPlacementStep({
          g,
          totalGroups: state.biomeGroupings.length,
          grouping,
          hexShape,
          placed,
          placedShapes,
          totalShapes,
          start,
          newLastHex,
          firstDir,
          originText
        }),
        state
      })
    }
  }

  return state
}

// First shape ever: roll. All subsequent shapes: try steps 1 → 2 → fall back to roll.
function pickStartHex (state, grouping, lastHex, findStart) {
  if (!lastHex) {
    const { start, rerolls } = findStart(grouping)
    return { start, originText: rolledOriginText(rerolls) }
  }

  const found = findStartFromHex(state.hexes, lastHex)
  if (found) {
    const originText = found.step === 1
      ? `Adjacent ${found.hex.dir}`
      : `Line ${found.hex.dir}`
    return { start: found.hex, originText }
  }

  const { start, rerolls } = findStart(grouping)
  return { start, originText: rolledOriginText(rerolls) }
}

const rolledOriginText = rerolls =>
  `Rolled ${rerolls} reroll${rerolls === 1 ? '' : 's'}`

function formatPlacementStep ({
  g, totalGroups, grouping, hexShape,
  placed, placedShapes, totalShapes,
  start, newLastHex, firstDir, originText
}) {
  const startOff = start ? axialToOffset(start) : null
  const endOff = newLastHex ? axialToOffset(newLastHex) : null
  const startText = startOff ? `(${startOff.col}, ${startOff.row})` : 'no valid start'
  const endText = endOff ? `(${endOff.col}, ${endOff.row})` : startText
  const continuedText = firstDir ? ` and continued ${firstDir}` : ''

  return {
    label: `Place ${hexShape.shape}: ${hexShape.combined_biome}`,
    description:
      `Group ${g + 1} of ${totalGroups} (${grouping.primaryBiome}). ` +
      `${originText}. Placed ${placed} ${hexShape.combined_biome} hexes ` +
      `as a ${hexShape.shape} starting from ${startText}${continuedText}, ` +
      `ending at ${endText}. ` +
      `Shape ${placedShapes} of ${totalShapes}.`
  }
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
