import { createState, buildBiomeGroupings } from './state'
import { DIRECTIONS, axialToOffset } from '../core/hexGrid'
import { pickOne, pickWeighted } from '../core/random'
import {
  BIOME_CATALOG,
  GRASSLAND_HEX,
  SEA_HEX,
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
        prevSecondary: prevShape?.secondaryBiome
      })
      hexShape.secondaryBiome = secondary
      hexShape.combinedBiome = combined
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
      const { start, bsd, origin } = pickStartHex(state, grouping, lastHex, findStart)

      const {
        placed,
        lastHex: newLastHex,
        firstDir
      } = placeOneShape(state, grouping, hexShape, start, bsd)
      lastHex = newLastHex ?? lastHex
      placedShapes++

      onStep?.({
        ...formatPlacementStep({
          g,
          round,
          hexShape,
          placed,
          placedShapes,
          totalShapes,
          start,
          newLastHex,
          firstDir,
          origin
        }),
        state
      })
    }
  }

  return state
}

// Shape start per spec steps 43–45 & 54–56. Every shape rolls a
// [Biome Shape Direction] (44). With an origin (previous shape's last hex, 54),
// the first tile comes from findStartFromHex, which consumes the BSD (45), so
// `bsd` returns null. Without an origin — or when every direction from it is
// exhausted (56) — roll coordinates (43) plus a fresh BSD, which placeOneShape
// consumes on the first adjacency placement.
// Returns { start, bsd, origin } where origin is one of:
//   { kind: 'rolled', rerolls } | { kind: 'adjacent', dir } | { kind: 'line', dir }
function pickStartHex (state, grouping, lastHex, findStart) {
  if (lastHex) {
    const bsd = pickOne(DIRECTIONS)
    const found = findStartFromHex(state.hexes, lastHex, bsd)
    if (found) {
      const kind = found.step === 1 ? 'adjacent' : 'line'
      return { start: found.hex, bsd: null, origin: { kind, dir: found.hex.dir } }
    }
  }

  const { start, rerolls } = findStart(grouping)
  return { start, bsd: pickOne(DIRECTIONS), origin: { kind: 'rolled', rerolls } }
}

function originTextOf (origin) {
  switch (origin.kind) {
    case 'adjacent': return `Adjacent ${origin.dir}`
    case 'line': return `Line ${origin.dir}`
    default:
      return `Rolled ${origin.rerolls} reroll${origin.rerolls === 1 ? '' : 's'}`
  }
}

function formatPlacementStep ({
  g, round, hexShape,
  placed, placedShapes, totalShapes,
  start, newLastHex, firstDir, origin
}) {
  const startOff = start ? axialToOffset(start) : null
  const endOff = newLastHex ? axialToOffset(newLastHex) : null
  const startText = startOff ? `(${startOff.col}, ${startOff.row})` : 'no valid start'
  const endText = endOff ? `(${endOff.col}, ${endOff.row})` : startText
  const continuedText = firstDir ? ` and continued ${firstDir}` : ''
  const biomeName = BIOME_CATALOG[hexShape.combinedBiome]?.name ?? hexShape.combinedBiome

  return {
    label: `Place ${hexShape.shape}: ${biomeName}`,
    description:
      `Group ${g + 1}, shape ${round + 1} (${hexShape.shape}, ${biomeName}). ` +
      `${originTextOf(origin)}. Placed ${placed} ${biomeName} hexes ` +
      `as a ${hexShape.shape} starting from ${startText}${continuedText}, ` +
      `ending at ${endText}. ` +
      `Shape ${placedShapes} of ${totalShapes}.`
  }
}

// =============================================================================
// PHASE 3 — POST-PLACEMENT CLEANUP
// Covers step: 58
// =============================================================================

// Unassigned fill (58). Blanks become Sea only when some grouping rolled Sea as
// its [Primary Biome]; on a map with no sea at all they become Grassland
// instead, so the leftovers read as interior land rather than a phantom ocean.
export function cleanupBiomes (state, onStep) {
  const hadSeaPrimary = state.biomeGroupings.some(g => g.primaryBiome === 'sea')
  const fill = hadSeaPrimary ? SEA_HEX : GRASSLAND_HEX

  let filled = 0
  for (const key of Object.keys(state.hexes)) {
    if (state.hexes[key] === null) {
      state.hexes[key] = { ...fill }
      filled++
    }
  }

  onStep?.({
    label: `Fill unassigned hexes with ${fill.biome}`,
    description:
      `${filled} hex${filled === 1 ? '' : 'es'} were left unassigned after ` +
      `placement. ${hadSeaPrimary
        ? 'At least one grouping rolled a Sea primary biome, so they become sea.'
        : 'No grouping rolled a Sea primary biome, so they become grassland.'}`,
    state
  })

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
