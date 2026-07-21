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

// Spec step 45: the [Biome Shape Direction] is consumed by the shape's first
// adjacency placement. Callers pass `bsd` only when that placement happens
// here (rolled starts); chained starts consume it in findStartFromHex.
export function placeOneShape (state, grouping, hexShape, start, bsd = null) {
  if (!start) return { placed: 0, lastHex: null }

  const biome = hexShape.combinedBiome
  const shape = registerShape(state, grouping, hexShape, start)
  writeHex(state, start, biome, shape)
  let previous = start
  let placed = 1
  let firstDir = null

  for (; placed < hexShape.count; placed++) {
    const candidates = emptyNeighbors(state.hexes, previous.q, previous.r)
    if (candidates.length === 0) return { placed, lastHex: previous, firstDir }

    // Spec step 52: Shape-Type adherence first, then direction priority
    // (BSD on its first use only, then NE → clockwise from NE).
    const strategy = strategyFor(hexShape.shape, placed, hexShape.count)
    const priority = directionPriority(placed === 1 ? bsd : null)
    const next = pickByStrategy(state.hexes, candidates, biome, strategy, priority)
    if (placed === 1) firstDir = next.dir

    writeHex(state, next, biome, shape)
    previous = next
  }

  return { placed, lastHex: previous, firstDir }
}

// Shape start from an existing origin (spec steps 52 & 55):
// 1) first tile adjacent to the origin, chosen by BSD → NE → clockwise from NE;
// 2) if no adjacent hex is empty, walk straight lines starting with the BSD's
//    line and proceeding clockwise from the BSD, taking the closest empty hex.
// Returns null if every direction is exhausted (caller rerolls coordinates
// and a fresh BSD per step 56).
export function findStartFromHex (hexes, lastHex, bsd) {
  const adjacent = filterNeighbors(hexes, lastHex.q, lastHex.r, isEmptyHex)
  for (const dir of directionPriority(bsd)) {
    const found = adjacent.find(a => a.dir === dir)
    if (found) return { hex: found, step: 1 }
  }

  for (const dir of clockwiseFrom(bsd)) {
    const found = firstEmptyAlong(hexes, lastHex, dir)
    if (found) return { hex: { ...found, dir }, step: 2 }
  }

  return null
}

export function rollStartingHex (state) {
  return grouping => {
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
const isEmptyHex = hex => hex === null
const onGrid = (hexes, q, r) =>
  Object.prototype.hasOwnProperty.call(hexes, keyOf(q, r))
const isEmpty = (hexes, q, r) =>
  onGrid(hexes, q, r) && hexes[keyOf(q, r)] === null

function registerShape (state, grouping, hexShape, origin) {
  const shape = {
    id: state.nextShapeId++,
    kind: hexShape.shape,
    groupingIndex: state.biomeGroupings.indexOf(grouping),
    origin: { q: origin.q, r: origin.r },
    hexKeys: []
  }
  state.shapes[shape.id] = shape
  return shape
}

function writeHex (state, { q, r }, biome, shape) {
  const key = keyOf(q, r)
  state.hexes[key] = { biome, shapeId: shape.id }
  shape.hexKeys.push(key)
}

function rollCoordinate (coordinateModifier) {
  let x = rollD(GRID_COLS)
  let y = rollD(GRID_ROWS)
  if (coordinateModifier.axis === 'x') x += coordinateModifier.offset
  else y += coordinateModifier.offset
  return offsetToAxial(x, y)
}

export function emptyNeighbors (hexes, q, r) {
  return filterNeighbors(hexes, q, r, isEmptyHex)
}

function firstEmptyAlong (hexes, from, dir) {
  let cur = { ...from }
  while (true) {
    cur = step(cur.q, cur.r, dir)
    if (!onGrid(hexes, cur.q, cur.r)) return null
    if (isEmpty(hexes, cur.q, cur.r)) return cur
  }
}

function strategyFor (shape, indexPlaced, totalCount) {
  if (shape === 'clump') return 'max'
  if (shape === 'belt') return 'min'
  return indexPlaced < Math.ceil(totalCount / 2) ? 'max' : 'min'
}

// DIRECTIONS is already clockwise starting at NE, so the spec's
// "NE second, clockwise from NE third" is the array in order; a live BSD
// takes top priority (step 52).
function directionPriority (bsd) {
  return bsd ? [bsd, ...DIRECTIONS.filter(d => d !== bsd)] : DIRECTIONS
}

function clockwiseFrom (dir) {
  const i = DIRECTIONS.indexOf(dir)
  return i <= 0 ? [...DIRECTIONS] : [...DIRECTIONS.slice(i), ...DIRECTIONS.slice(0, i)]
}

function sameBiomeNeighborCount (hexes, q, r, biome) {
  return countNeighbors(hexes, q, r, h => h?.biome === biome)
}

function pickByStrategy (hexes, candidates, biome, strategy, priority = DIRECTIONS) {
  const scored = candidates.map(c => ({
    ...c,
    score: sameBiomeNeighborCount(hexes, c.q, c.r, biome)
  }))
  const target =
    strategy === 'max'
      ? Math.max(...scored.map(s => s.score))
      : Math.min(...scored.map(s => s.score))
  const tied = scored.filter(s => s.score === target)
  for (const dir of priority) {
    const match = tied.find(c => c.dir === dir)
    if (match) return match
  }
  return tied[0]
}
