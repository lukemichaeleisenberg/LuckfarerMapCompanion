import {
  DIRECTIONS,
  step,
  keyOf,
  offsetToAxial,
  filterNeighbors,
  countNeighbors
} from '../core/hexGrid.js'
import { pickOne, rollD20, shuffle } from '../core/random.js'

export { pickOne }

export function placeOneShape (state, grouping, hexShape, start, randomFirstStep = true) {
  if (!start) return { placed: 0, lastHex: null }

  const biome = {
    primary: grouping.primaryBiome,
    secondary: hexShape.secondary_biome
  }

  writeHex(state, start, biome)
  let previous = start
  let placed = 1
  let firstDir = null

  for (; placed < hexShape.count; placed++) {
    const candidates = emptyNeighbors(state.hexes, previous.q, previous.r)
    if (candidates.length === 0) return { placed, lastHex: previous, firstDir }

    let next
    if (placed === 1 && randomFirstStep) {
      next = pickOne(candidates)
      firstDir = next.dir
    } else {
      const strategy = strategyFor(hexShape.shape, placed, hexShape.count)
      next = pickByStrategy(state.hexes, candidates, biome, strategy)
    }

    writeHex(state, next, biome)
    previous = next
  }

  return { placed, lastHex: previous, firstDir }
}

// Steps 1 & 2 for subsequent shape placement:
// 1) pick a random adjacent empty hex; 2) walk straight from each adjacent hex
// in the same random direction order, returning the first empty hex found.
// Returns null if neither step succeeds (caller should fall back to rollStartingHex).
export function findStartFromHex (hexes, lastHex) {
  // Step 1: random adjacent empty hex
  const adjacent = filterNeighbors(hexes, lastHex.q, lastHex.r, isEmptyHex)
  if (adjacent.length > 0) return { hex: pickOne(adjacent), step: 1 }

  // Step 2: straight line from each adjacent hex in shuffled direction order
  for (const dir of shuffle(DIRECTIONS)) {
    const adj = step(lastHex.q, lastHex.r, dir)
    const found = firstEmptyAlong(hexes, adj, dir)
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

function writeHex (state, { q, r }, biome) {
  state.hexes[keyOf(q, r)] = {
    mode: 'biome',
    primary: biome.primary,
    secondary: biome.secondary
  }
}

function rollCoordinate (coordinateModifier) {
  let x = rollD20()
  let y = rollD20()
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

function sameBiomeNeighborCount (hexes, q, r, biome) {
  return countNeighbors(hexes, q, r, h =>
    h?.mode === 'biome' &&
    h.primary === biome.primary &&
    h.secondary === biome.secondary
  )
}

function pickByStrategy (hexes, candidates, biome, strategy) {
  const scored = candidates.map(c => ({
    ...c,
    score: sameBiomeNeighborCount(hexes, c.q, c.r, biome)
  }))
  const target =
    strategy === 'max'
      ? Math.max(...scored.map(s => s.score))
      : Math.min(...scored.map(s => s.score))
  return pickOne(scored.filter(s => s.score === target))
}
