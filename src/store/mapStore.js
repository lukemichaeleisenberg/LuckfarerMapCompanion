import { create } from 'zustand'
import { buildGrid } from '../core/hexGrid.js'
import { setupGrid } from '../generator/steps.js'
import { generateMap } from '../generator/generateMap.js'

const DEFAULT_HEX = { mode: 'biome', primary: 'sea', secondary: 'sea' }

function initHexMap () {
  const m = {}
  for (const hex of buildGrid()) {
    m[`${hex.q},${hex.r}`] = { ...DEFAULT_HEX }
  }
  return m
}

export const useMapStore = create((set, get) => ({
  hexMap: initHexMap(),
  generatorState: null,
  isGenerating: false,

  setHex: (key, hexState) =>
    set(prev => ({ hexMap: { ...prev.hexMap, [key]: hexState } })),

  resetMap: () => set({ hexMap: initHexMap(), generatorState: null }),

  setupOnly: () => {
    const state = setupGrid(get().hexMap)
    set({ generatorState: state })
  },

  generateMap: () => {
    set({ isGenerating: true })
    const result = generateMap(get().hexMap)
    set({ hexMap: result.hexes, generatorState: result, isGenerating: false })
  },
}))

