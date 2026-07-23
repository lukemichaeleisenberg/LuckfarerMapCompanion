import {
  setupGrid,
  placeBiomes,
  cleanupBiomes,
  placeFeatures,
  cleanupFeatures,
  type OnStep
} from './generation'
import { setSeed, randomSeed } from '../core/random'
import type { HexMap, MapGenState } from '../types'

// The first step consumes the store's raw HexMap; every later step threads the
// MapGenState it returns. STEPS models that with a union, and generateMap's
// loop widens the input at the single call site.
type StepFn =
  | ((existingHexMap: HexMap) => MapGenState)
  | ((state: MapGenState, onStep?: OnStep) => MapGenState)

export interface GenerationStep {
  id: string
  label: string
  description: string
  fn: StepFn
}

export interface GenerationSnapshot {
  id: string
  label: string
  description: string
  state: MapGenState
}

export const STEPS: GenerationStep[] = [
  {
    id: 'setup',
    label: 'Setup grid',
    description: 'Initialize empty hex grid and roll biome groupings, primary and secondary biomes.',
    fn: setupGrid
  },
  {
    id: 'placeBiomes',
    label: 'Place biomes',
    description: 'Place clump, tendril, and belt shapes for each biome grouping onto the grid.',
    fn: placeBiomes
  },
  {
    id: 'cleanupBiomes',
    label: 'Fill unassigned hexes',
    description: 'Any hex still unassigned after biome placement becomes sea, or grassland if no grouping rolled a sea primary biome.',
    fn: cleanupBiomes
  },
  {
    id: 'placeFeatures',
    label: 'Place features',
    description: 'Place rivers, roads, settlements, and other map features. (Not yet implemented.)',
    fn: placeFeatures
  },
  {
    id: 'cleanupFeatures',
    label: 'Cleanup features',
    description: 'Final pass to resolve feature conflicts. (Not yet implemented.)',
    fn: cleanupFeatures
  }
]

export function generateMap (
  existingHexMap: HexMap,
  seed?: string | number | null
): { snapshots: GenerationSnapshot[], seed: string | null } {
  // Seed the RNG before any rolls happen. A blank seed gets a fresh random one
  // so the result is always reproducible from the returned `seed`.
  const usedSeed = setSeed(seed === null || seed === undefined || seed === ''
    ? randomSeed()
    : seed)

  const snapshots: GenerationSnapshot[] = []
  let state: MapGenState | undefined

  for (const step of STEPS) {
    const before = snapshots.length
    const run = step.fn as (input: HexMap | MapGenState, onStep?: OnStep) => MapGenState
    state = run(state ?? existingHexMap, (sub) => {
      snapshots.push({
        id: step.id,
        label: sub.label,
        description: sub.description,
        state: structuredClone(sub.state)
      })
    })
    if (snapshots.length === before) {
      snapshots.push({
        id: step.id,
        label: step.label,
        description: step.description,
        state: structuredClone(state)
      })
    }
  }

  return { snapshots, seed: usedSeed }
}
