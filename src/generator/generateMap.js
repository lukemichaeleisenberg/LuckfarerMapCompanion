import {
  setupGrid,
  placeBiomes,
  cleanupBiomes,
  placeFeatures,
  cleanupFeatures
} from './steps.js'

export const STEPS = [
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
    label: 'Fill empty hexes with sea',
    description: 'Any hex still unassigned after biome placement becomes sea.',
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

export function generateMap (existingHexMap) {
  const snapshots = []
  let state

  for (const step of STEPS) {
    const before = snapshots.length
    state = step.fn(state ?? existingHexMap, (sub) => {
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

  return snapshots
}
