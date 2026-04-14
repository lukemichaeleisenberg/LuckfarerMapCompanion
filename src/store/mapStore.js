import { create } from 'zustand'
import { GRID_COLS, GRID_ROWS } from '../core/hexGrid'
import { buildInitialHexMap } from '../generator/steps.js'
import { generateMap } from '../generator/generateMap.js'

const DEFAULT_HEX = { mode: 'biome', primary: 'sea', secondary: 'sea' }

function initHexMap () {
  const m = buildInitialHexMap()
  for (const key of Object.keys(m)) {
    m[key] = { ...DEFAULT_HEX }
  }
  return m
}

export const useMapStore = create(set => ({
  hexMap: initHexMap(),
  generatorState: null,

  setHex: (key, hexState) =>
    set(prev => ({ hexMap: { ...prev.hexMap, [key]: hexState } })),

  resetMap: () => set({ hexMap: initHexMap(), generatorState: null }),

  generateMap: () =>
    set(prev => {
      const result = generateMap(prev.hexMap)
      return { hexMap: result.hexes, generatorState: result }
    })
}))

export { GRID_COLS, GRID_ROWS }
