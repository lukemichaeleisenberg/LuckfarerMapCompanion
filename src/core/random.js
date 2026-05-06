// ─── Random helpers ──────────────────────────────────────────────────────────
// Centralized so every caller goes through the same primitives. Eventually a
// seedable RNG can replace `Math.random` in one place.

export const pickOne = arr => arr[Math.floor(Math.random() * arr.length)]

// Weighted picks today rely on caller-provided arrays where weight = repetition
// (e.g. WEIGHTED_PRIMARY_BIOMES). Kept as a separate name so the intent at the
// call site is clear and so we can swap in a true weight-pair API later.
export const pickWeighted = arr => pickOne(arr)

export const rollD20 = () => 1 + Math.floor(Math.random() * 20)

export function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
