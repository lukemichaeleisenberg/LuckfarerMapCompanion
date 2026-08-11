import {
  DIRECTIONS,
  GRID_COLS,
  GRID_ROWS,
  step,
  keyOf,
  offsetToAxial,
  filterNeighbors,
  countNeighbors
} from '../core/hexGrid'
import { rollD } from '../core/random'
import type {
  Axial,
  BiomeGrouping,
  CoordinateModifier,
  Direction,
  HexMap,
  HexShape,
  HexState,
  MapGenState,
  ShapeRecord
} from '../types'

type Neighbor = Axial & { dir: Direction }

export interface PlacementResult {
  placed: number
  lastHex: Axial | null
  firstDir: Direction | null
}

export interface FoundStart {
  hex: Neighbor
  step: 1 | 2
}

// Spec steps 44–45: the [Biome Shape Direction] lives only until the shape's
// first adjacency placement — used if its hex is viable, unset otherwise.
// Callers pass `bsd` only when that placement happens here (rolled starts);
// chained starts consume it in findStartFromHex.
export function placeOneShape (
  state: MapGenState,
  grouping: BiomeGrouping,
  hexShape: HexShape,
  start: Axial | null,
  bsd: Direction | null = null
): PlacementResult {
  if (!start) return { placed: 0, lastHex: null, firstDir: null }

  const biome = hexShape.combinedBiome!
  const shape = registerShape(state, grouping, hexShape, start)
  writeHex(state, start, biome, shape)
  let previous: Axial = start
  let placed = 1
  let firstDir: Direction | null = null

  for (; placed < hexShape.count; placed++) {
    const candidates = emptyNeighbors(state.hexes, previous.q, previous.r)
    if (candidates.length === 0) return { placed, lastHex: previous, firstDir }

    // Spec step 52: a live BSD is an absolute override — take its hex when
    // viable; otherwise it is unset and the Shape-Type strategy picks,
    // breaking ties NE → clockwise from NE.
    const strategy = strategyFor(hexShape.shape, placed, hexShape.count)
    const viaBsd = placed === 1 && bsd !== null
      ? candidates.find(c => c.dir === bsd)
      : undefined
    const next = viaBsd ?? pickByStrategy(state.hexes, candidates, biome, strategy)
    if (placed === 1) firstDir = next.dir

    writeHex(state, next, biome, shape)
    previous = next
  }

  return { placed, lastHex: previous, firstDir }
}

// Shape start from an existing origin (spec steps 52 & 55):
// 1) first tile adjacent to the origin — the BSD's hex if viable (absolute
//    override), otherwise the BSD is unset and the Shape-Type strategy picks
//    with the NE → clockwise tie-break;
// 2) if no adjacent hex is empty, walk straight lines starting with the BSD's
//    line and proceeding clockwise from the BSD, taking the closest empty hex.
// Returns null if every direction is exhausted (caller rerolls coordinates
// and a fresh BSD per step 56 — the BSD never survives a failed start).
export function findStartFromHex (
  hexes: HexMap,
  origin: Axial,
  bsd: Direction,
  hexShape: HexShape
): FoundStart | null {
  const candidates = filterNeighbors(hexes, origin.q, origin.r, isEmptyHex)
  const viaBsd = candidates.find(c => c.dir === bsd)
  if (viaBsd) return { hex: viaBsd, step: 1 }
  if (candidates.length > 0) {
    const strategy = strategyFor(hexShape.shape, 0, hexShape.count)
    return { hex: pickByStrategy(hexes, candidates, hexShape.combinedBiome!, strategy), step: 1 }
  }

  for (const dir of clockwiseFrom(bsd)) {
    const found = firstEmptyAlong(hexes, origin, dir)
    if (found) return { hex: { ...found, dir }, step: 2 }
  }

  return null
}

export function rollStartingHex (state: MapGenState) {
  return (grouping: BiomeGrouping): { start: Axial | null, rerolls: number } => {
    let rerolls = 0
    while (true) {
      const rolled = rollCoordinate(grouping.coordinateModifier)
      if (isEmpty(state.hexes, rolled.q, rolled.r)) {
        return { start: rolled, rerolls }
      }
      rerolls++
      if (rerolls > 1000) return { start: null, rerolls }
    }
  }
}

// In our hex map: undefined = off-grid, null = empty, object = occupied.
const isEmptyHex = (hex: HexState | null | undefined): boolean => hex === null
const onGrid = (hexes: HexMap, q: number, r: number): boolean =>
  Object.prototype.hasOwnProperty.call(hexes, keyOf(q, r))
const isEmpty = (hexes: HexMap, q: number, r: number): boolean =>
  onGrid(hexes, q, r) && hexes[keyOf(q, r)] === null

function registerShape (state: MapGenState, grouping: BiomeGrouping, hexShape: HexShape, origin: Axial): ShapeRecord {
  const shape: ShapeRecord = {
    id: state.nextShapeId++,
    kind: hexShape.shape,
    groupingIndex: state.biomeGroupings.indexOf(grouping),
    origin: { q: origin.q, r: origin.r },
    hexKeys: []
  }
  state.shapes[shape.id] = shape
  return shape
}

function writeHex (state: MapGenState, { q, r }: Axial, biome: string, shape: ShapeRecord): void {
  const key = keyOf(q, r)
  state.hexes[key] = { biome, shapeId: shape.id }
  shape.hexKeys.push(key)
}

function rollCoordinate (coordinateModifier: CoordinateModifier): Axial {
  let x = rollD(GRID_COLS)
  let y = rollD(GRID_ROWS)
  if (coordinateModifier.axis === 'x') x += coordinateModifier.offset
  else y += coordinateModifier.offset
  return offsetToAxial(x, y)
}

export function emptyNeighbors (hexes: HexMap, q: number, r: number): Neighbor[] {
  return filterNeighbors(hexes, q, r, isEmptyHex)
}

function firstEmptyAlong (hexes: HexMap, from: Axial, dir: Direction): Axial | null {
  let cur = { ...from }
  while (true) {
    cur = step(cur.q, cur.r, dir)
    if (!onGrid(hexes, cur.q, cur.r)) return null
    if (isEmpty(hexes, cur.q, cur.r)) return cur
  }
}

type Strategy = 'max' | 'min'

function strategyFor (shape: HexShape['shape'], indexPlaced: number, totalCount: number): Strategy {
  if (shape === 'clump') return 'max'
  if (shape === 'belt') return 'min'
  return indexPlaced < Math.ceil(totalCount / 2) ? 'max' : 'min'
}

function clockwiseFrom (dir: Direction): Direction[] {
  const i = DIRECTIONS.indexOf(dir)
  return i <= 0 ? [...DIRECTIONS] : [...DIRECTIONS.slice(i), ...DIRECTIONS.slice(0, i)]
}

function sameBiomeNeighborCount (hexes: HexMap, q: number, r: number, biome: string): number {
  return countNeighbors(hexes, q, r, h => h?.biome === biome)
}

// DIRECTIONS is already clockwise starting at NE, so iterating it in order
// implements the spec's NE → first-empty-clockwise-from-NE tie-break (step 52).
function pickByStrategy (
  hexes: HexMap,
  candidates: Neighbor[],
  biome: string,
  strategy: Strategy
): Neighbor {
  const scored = candidates.map(c => ({
    ...c,
    score: sameBiomeNeighborCount(hexes, c.q, c.r, biome)
  }))
  const target =
    strategy === 'max'
      ? Math.max(...scored.map(s => s.score))
      : Math.min(...scored.map(s => s.score))
  const tied = scored.filter(s => s.score === target)
  for (const dir of DIRECTIONS) {
    const match = tied.find(c => c.dir === dir)
    if (match) return match
  }
  return tied[0]
}
