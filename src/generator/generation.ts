import { createState, buildBiomeGroupings } from './state'
import { DIRECTIONS, axialToOffset } from '../core/hexGrid'
import { chance, pickOne, pickWeighted } from '../core/random'
import {
  BIOME_CATALOG,
  GRASSLAND_HEX,
  SEA_HEX,
  SECONDARY_TYPES,
  WEIGHTED_PRIMARY_BIOMES,
  deriveSecondaryBiome
} from '../core/biomes'
import {
  placeOneShape,
  rollStartingHex,
  findStartFromHex
} from './biomePlacement'
import type {
  Axial,
  BiomeGrouping,
  Direction,
  HexMap,
  HexShape,
  Latitude,
  MapGenState
} from '../types'

// Snapshot payload each step hands back for the step-by-step viewer.
export interface StepSnapshot {
  label: string
  description: string
  state: MapGenState
}

export type OnStep = (snapshot: StepSnapshot) => void

type ShapeOrigin =
  | { kind: 'rolled', rerolls: number }
  | { kind: 'adjacent' | 'line', dir: Direction }

type FindStart = ReturnType<typeof rollStartingHex>

// =============================================================================
// PHASE 1 — SETUP
// Covers spec steps 2–37: grid + groupings (2–7), latitude (8), special-biome
// pre-seeding (18–23), matrix resolution (24–28), latitude conversions
// (29–35), and shape-type overrides (36–37).
// =============================================================================

const LATITUDES: Latitude[] = ['equatorial', 'temperate', 'polar']

export function setupGrid (existingHexMap: HexMap, onStep?: OnStep): MapGenState {
  const state = createState()

  for (const key of Object.keys(existingHexMap)) {
    state.hexes[key] = null
  }

  state.biomeGroupings = buildBiomeGroupings()

  // Latitude roll (8): gates the biome substitutions in steps 29–35.
  state.latitude = pickOne(LATITUDES)
  onStep?.({
    label: 'Roll latitude',
    description:
      `Built the grid and 4 biome groupings, and rolled a ${state.latitude} ` +
      'latitude for the region.',
    state
  })

  const specials = preSeedSpecialBiomes(state)
  onStep?.({
    label: 'Pre-seed special biomes',
    description: specials.length > 0
      ? `Special biome rolls (steps 18–23) hit: ${specials.join('; ')}.`
      : 'No special biome rolls (steps 18–23) hit.',
    state
  })

  resolveBiomeMatrix(state)
  const conversions = applyLatitudeConversions(state)
  applyShapeTypeOverrides(state)
  onStep?.({
    label: 'Resolve biome matrix',
    description:
      `Primary biomes: ${state.biomeGroupings
        .map(g => BIOME_CATALOG[g.primaryBiome ?? '']?.name ?? g.primaryBiome)
        .join(', ')}. ` +
      (conversions.length > 0
        ? `Latitude (${state.latitude}) conversions: ${conversions.join(', ')}.`
        : `No latitude (${state.latitude}) conversions applied.`),
    state
  })

  return state
}

interface SpecialBiomeRoll {
  pct: number
  biome: string
  shapeOverride?: 'single' | 'belt'
  primaryOverride?: string
  nextSecondary?: string
  nextCombined?: string
}

// Steps 18–23, in sheet order. Each entry rolls once per generation.
const SPECIAL_BIOME_ROLLS: SpecialBiomeRoll[] = [
  { pct: 1, biome: 'sky_cliffs' },
  { pct: 1, biome: 'cloudlands' },
  { pct: 5, biome: 'volcano', shapeOverride: 'single', nextSecondary: 'hill' },
  { pct: 5, biome: 'lava_flow', shapeOverride: 'single', nextCombined: 'sea' },
  { pct: 5, biome: 'atoll', shapeOverride: 'single', primaryOverride: 'sea' },
  { pct: 10, biome: 'slough', shapeOverride: 'belt', nextSecondary: 'swamp' }
]

// Special-biome pre-seeding (18–23): roll each special in sheet order and
// apply the ones that hit. Returns descriptions of the applied specials.
function preSeedSpecialBiomes (state: MapGenState): string[] {
  const applied: string[] = []
  for (const roll of SPECIAL_BIOME_ROLLS) {
    if (!chance(roll.pct)) continue
    const groupingIndex = applySpecialBiome(state, roll)
    if (groupingIndex === null) continue
    applied.push(`${BIOME_CATALOG[roll.biome].name} in grouping ${groupingIndex + 1}`)
  }
  return applied
}

interface BiomeSlot {
  grouping: BiomeGrouping
  groupingIndex: number
  shape: HexShape
}

// The shape slots able to hold a rolled [Combined Biome], in grouping order.
// Copy-clumps have no biome slots of their own and are excluded, so specials
// never claim them and "the next [Shape Type]" skips past them.
function biomeSlots (state: MapGenState): BiomeSlot[] {
  return state.biomeGroupings.flatMap((grouping, groupingIndex) =>
    grouping.hexShapes
      .filter(shape => !shape.copyPrevious)
      .map(shape => ({ grouping, groupingIndex, shape })))
}

// A special that hit its roll claims the first slot with no [Combined Biome]
// yet, then applies its side effects:
//   - the slot's shape type may become Single Hex or Belt (20–23);
//   - atoll (22) forces Sea as the claimed slot's grouping [Primary Biome];
//   - volcano, lava_flow, and slough (20/21/23) preset a secondary or
//     combined biome on the slot that follows, crossing grouping boundaries
//     like the step 27 mountain→hill chain.
// Returns the claimed slot's grouping index, or null if no slot was free.
function applySpecialBiome (state: MapGenState, roll: SpecialBiomeRoll): number | null {
  const slots = biomeSlots(state)
  const index = slots.findIndex(slot => slot.shape.combinedBiome === null)
  if (index === -1) return null

  const { grouping, groupingIndex, shape } = slots[index]
  shape.combinedBiome = roll.biome
  if (roll.shapeOverride) {
    shape.shape = roll.shapeOverride
    if (roll.shapeOverride === 'single') shape.count = 1
  }
  if (roll.primaryOverride) grouping.primaryBiome = roll.primaryOverride

  const next = slots[index + 1]?.shape
  if (next && roll.nextSecondary) next.secondaryBiome = roll.nextSecondary
  if (next && roll.nextCombined) next.combinedBiome = roll.nextCombined

  return groupingIndex
}

// Matrix resolution (24–28): weighted primaries for groupings without one
// (24, atoll may have forced Sea), then secondaries and combined biomes for
// every slot not claimed by a special. Secondaries preset by volcano/slough
// (20/23) skip the roll but still pass through the mountain→hill replacement
// chain (26–27), which spans grouping boundaries.
function resolveBiomeMatrix (state: MapGenState): void {
  for (const grouping of state.biomeGroupings) {
    if (grouping.primaryBiome === null) {
      grouping.primaryBiome = pickWeighted(WEIGHTED_PRIMARY_BIOMES)
    }
  }

  let prevSecondary: string | null = null
  for (const grouping of state.biomeGroupings) {
    grouping.hexShapes.forEach((shape, idx) => {
      if (shape.copyPrevious || shape.combinedBiome !== null) {
        prevSecondary = shape.secondaryBiome
        return
      }
      const { secondary, combined } = deriveSecondaryBiome({
        primaryBiome: grouping.primaryBiome,
        rolledSecondary: shape.secondaryBiome ?? pickOne(SECONDARY_TYPES),
        isFirstShape: idx === 0,
        prevSecondary
      })
      shape.secondaryBiome = secondary
      shape.combinedBiome = combined
      prevSecondary = secondary
    })
  }
}

// Latitude conversions on rolled combined biomes (29–35). Step 33 is a single
// 50% roll covering every Bayou and Chaparral slot at once. Returns "from →
// to" descriptions of the applied conversions.
function applyLatitudeConversions (state: MapGenState): string[] {
  const latitude = state.latitude
  const notPolar = latitude === 'temperate' || latitude === 'equatorial'
  const notEquatorial = latitude === 'temperate' || latitude === 'polar'
  const equatorial = latitude === 'equatorial'
  const mangrove = equatorial && chance(50)
  const changes: string[] = []

  const convert = (shape: HexShape, to: string): void => {
    const from = shape.combinedBiome ?? ''
    changes.push(`${BIOME_CATALOG[from]?.name ?? from} → ${BIOME_CATALOG[to].name}`)
    shape.combinedBiome = to
  }

  for (const grouping of state.biomeGroupings) {
    for (const shape of grouping.hexShapes) {
      switch (shape.combinedBiome) {
        case 'ice_sheet':
          if (notPolar) convert(shape, 'dunes')
          break
        case 'floes':
        case 'fens':
          if (notPolar) convert(shape, 'lagoon')
          break
        case 'rainforest':
          if (notEquatorial) convert(shape, 'old_growth')
          break
        case 'bayou':
        case 'chaparral':
          if (mangrove) convert(shape, 'mangrove_thicket')
          break
        case 'taiga':
          if (equatorial) convert(shape, 'rainforest')
          break
        case 'tundra':
          if (equatorial) convert(shape, 'grassland')
          break
      }
    }
  }

  return changes
}

// Shape-type overrides (36–37): Geyser Basin always places as a single hex,
// Sea Cliffs always as a belt.
function applyShapeTypeOverrides (state: MapGenState): void {
  for (const grouping of state.biomeGroupings) {
    for (const shape of grouping.hexShapes) {
      if (shape.combinedBiome === 'geyser_basin') {
        shape.shape = 'single'
        shape.count = 1
      } else if (shape.combinedBiome === 'sea_cliffs') {
        shape.shape = 'belt'
      }
    }
  }
}

// =============================================================================
// PHASE 2 — BIOME PLACEMENT
// Covers step: 0G
// Shape rules, tie-breaking, and fallback logic are helpers within this function.
// =============================================================================

// 10 shapes per grouping (steps 39–42), each drawn randomly from the
// grouping's four shape slots — one clump, one tendril, one belt (kinds
// possibly overridden by a special or steps 36–37), plus the copy-clump: a
// clump one hex larger than the grouping's other shapes that takes the
// previously placed shape's biome, even when that shape came from another
// grouping. Drawing the copy-clump before anything has been placed falls
// back to a draw among the other slots.
const ROUNDS = 10

export function placeBiomes (state: MapGenState, onStep?: OnStep): MapGenState {
  const findStart = rollStartingHex(state)
  const totalShapes = state.biomeGroupings.length * ROUNDS
  let placedShapes = 0
  let lastHex: Axial | null = null
  let prevBiome: string | null = null

  for (let g = 0; g < state.biomeGroupings.length; g++) {
    const grouping = state.biomeGroupings[g]

    for (let round = 0; round < ROUNDS; round++) {
      let hexShape = pickOne(grouping.hexShapes)
      if (hexShape.copyPrevious) {
        hexShape = prevBiome
          ? { ...hexShape, combinedBiome: prevBiome }
          : pickOne(grouping.hexShapes.filter(s => !s.copyPrevious))
      }
      const { start, bsd, origin } = pickStartHex(state, grouping, lastHex, findStart)

      const {
        placed,
        lastHex: newLastHex,
        firstDir
      } = placeOneShape(state, grouping, hexShape, start, bsd)
      lastHex = newLastHex ?? lastHex
      placedShapes++
      if (placed > 0) prevBiome = hexShape.combinedBiome

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
function pickStartHex (
  state: MapGenState,
  grouping: BiomeGrouping,
  lastHex: Axial | null,
  findStart: FindStart
): { start: Axial | null, bsd: Direction | null, origin: ShapeOrigin } {
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

function originTextOf (origin: ShapeOrigin): string {
  switch (origin.kind) {
    case 'adjacent': return `Adjacent ${origin.dir}`
    case 'line': return `Line ${origin.dir}`
    default:
      return `Rolled ${origin.rerolls} reroll${origin.rerolls === 1 ? '' : 's'}`
  }
}

interface PlacementStepInfo {
  g: number
  round: number
  hexShape: HexShape
  placed: number
  placedShapes: number
  totalShapes: number
  start: Axial | null
  newLastHex: Axial | null
  firstDir?: Direction | null
  origin: ShapeOrigin
}

function formatPlacementStep ({
  g, round, hexShape,
  placed, placedShapes, totalShapes,
  start, newLastHex, firstDir, origin
}: PlacementStepInfo): { label: string, description: string } {
  const startOff = start ? axialToOffset(start) : null
  const endOff = newLastHex ? axialToOffset(newLastHex) : null
  const startText = startOff ? `(${startOff.col}, ${startOff.row})` : 'no valid start'
  const endText = endOff ? `(${endOff.col}, ${endOff.row})` : startText
  const continuedText = firstDir ? ` and continued ${firstDir}` : ''
  const biomeKey = hexShape.combinedBiome ?? ''
  const biomeName = BIOME_CATALOG[biomeKey]?.name ?? biomeKey

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
export function cleanupBiomes (state: MapGenState, onStep?: OnStep): MapGenState {
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

export function placeFeatures (state: MapGenState): MapGenState {
  return state
}

// =============================================================================
// PHASE 5 — FEATURE CLEANUP
// Covers step: 0P
// =============================================================================

export function cleanupFeatures (state: MapGenState): MapGenState {
  return state
}
