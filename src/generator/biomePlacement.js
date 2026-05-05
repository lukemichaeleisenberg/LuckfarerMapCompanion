import { PointyHex } from '../core/hexGrid.js'

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
  const dirs = shuffle(DIRECTIONS)

  // Step 1: random adjacent empty hex
  const adjacent = []
  for (const dir of dirs) {
    const n = step(lastHex.q, lastHex.r, dir)
    if (isEmpty(hexes, n.q, n.r)) adjacent.push({ ...n, dir })
  }
  if (adjacent.length > 0) return { hex: pickOne(adjacent), step: 1 }

  // Step 2: straight line from each adjacent hex in the same direction order
  for (const dir of dirs) {
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

function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const DIRECTIONS = ['NE', 'E', 'SE', 'SW', 'W', 'NW']

const STEP = {
  NE: { q: 1, r: -1 },
  E: { q: 1, r: 0 },
  SE: { q: 0, r: 1 },
  SW: { q: -1, r: 1 },
  W: { q: -1, r: 0 },
  NW: { q: 0, r: -1 }
}

function step (q, r, dir) {
  const d = STEP[dir]
  return { q: q + d.q, r: r + d.r }
}

const rollD20 = () => 1 + Math.floor(Math.random() * 20)
export const pickOne = arr => arr[Math.floor(Math.random() * arr.length)]
const randomDir = () => pickOne(DIRECTIONS)

const keyOf = (q, r) => `${q},${r}`

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

function offsetToAxial (col1Indexed, row1Indexed) {
  const hex = new PointyHex({ col: col1Indexed - 1, row: row1Indexed - 1 })
  return { q: hex.q, r: hex.r }
}

export function axialToOffset ({ q, r }) {
  const hex = new PointyHex({ q, r })
  return { col: hex.col + 1, row: hex.row + 1 }
}

function rollCoordinate (coordinateModifier) {
  let x = rollD20()
  let y = rollD20()
  if (coordinateModifier.axis === 'x') x += coordinateModifier.offset
  else y += coordinateModifier.offset
  return offsetToAxial(x, y)
}

export function emptyNeighbors (hexes, q, r) {
  const out = []
  for (const dir of DIRECTIONS) {
    const n = step(q, r, dir)
    if (isEmpty(hexes, n.q, n.r)) out.push({ ...n, dir })
  }
  return out
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
  let count = 0
  for (const dir of DIRECTIONS) {
    const n = step(q, r, dir)
    const h = hexes[keyOf(n.q, n.r)]
    if (
      h?.mode === 'biome' &&
      h.primary === biome.primary &&
      h.secondary === biome.secondary
    ) {
      count++
    }
  }
  return count
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
  return scored.find(s => s.score === target)
}
