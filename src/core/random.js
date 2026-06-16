// ─── Random helpers ──────────────────────────────────────────────────────────
// Centralized so every caller goes through the same primitives. All randomness
// in the generator flows through the module-level `rng` below, which can be
// swapped to a deterministic, seeded stream via `setSeed`.

// Active source of randomness. Defaults to Math.random (unseeded). `setSeed`
// replaces it with a deterministic mulberry32 stream.
let rng = Math.random
let activeSeed = null

// Hash an arbitrary string into a 32-bit unsigned int (cyrb53-lite / xfnv1a).
// Lets a seed be any human-readable string ("dragons", "test-3", a number…).
function hashSeed (str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32: tiny, fast, well-distributed 32-bit PRNG. Deterministic for a
// given starting state.
function mulberry32 (a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Seed the generator. Accepts any string or number; an empty/nullish seed
// reverts to unseeded Math.random. Returns the normalized seed string used.
export function setSeed (seed) {
  if (seed === null || seed === undefined || seed === '') {
    rng = Math.random
    activeSeed = null
    return null
  }
  const str = String(seed)
  rng = mulberry32(hashSeed(str))
  activeSeed = str
  return str
}

// Generate a fresh random seed string (used when the user generates without
// specifying one, so every generation remains reproducible and recordable).
export function randomSeed () {
  return Math.floor(Math.random() * 0xffffffff).toString(36)
}

// The seed currently driving generation, or null when unseeded.
export const getSeed = () => activeSeed

export const pickOne = arr => arr[Math.floor(rng() * arr.length)]

// Weighted picks today rely on caller-provided arrays where weight = repetition
// (e.g. WEIGHTED_PRIMARY_BIOMES). Kept as a separate name so the intent at the
// call site is clear and so we can swap in a true weight-pair API later.
export const pickWeighted = arr => pickOne(arr)

export const rollD20 = () => 1 + Math.floor(rng() * 20)

export function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
