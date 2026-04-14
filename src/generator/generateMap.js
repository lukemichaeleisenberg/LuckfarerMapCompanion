import { setupGrid, placeBiomes, cleanupBiomes, placeFeatures, cleanupFeatures } from './steps.js'

export function generateMap(existingHexMap) {
  let state = setupGrid(existingHexMap)
  state = placeBiomes(state)
  state = cleanupBiomes(state)
  state = placeFeatures(state)
  state = cleanupFeatures(state)
  return { hexes: state.hexes, biomeGroupings: state.biomeGroupings }
}
