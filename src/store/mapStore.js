import { create } from 'zustand'
import { buildGrid } from '../core/hexGrid.js'
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
  snapshots: [],
  currentStep: -1,

  setHex: (key, hexState) =>
    set(prev => ({ hexMap: { ...prev.hexMap, [key]: hexState } })),

  resetMap: () => set({
    hexMap: initHexMap(),
    generatorState: null,
    snapshots: [],
    currentStep: -1
  }),

  generateMap: () => {
    set({ isGenerating: true })
    const snapshots = generateMap(get().hexMap)
    const last = snapshots[snapshots.length - 1]
    set({
      snapshots,
      currentStep: snapshots.length - 1,
      hexMap: last.state.hexes,
      generatorState: last.state,
      isGenerating: false
    })
  },

  goToStep: (index) => {
    const { snapshots } = get()
    if (index < 0 || index >= snapshots.length) return
    const snap = snapshots[index]
    set({
      currentStep: index,
      hexMap: snap.state.hexes,
      generatorState: snap.state
    })
  },

  stepForward: () => {
    const { currentStep, snapshots } = get()
    if (currentStep < snapshots.length - 1) get().goToStep(currentStep + 1)
  },

  stepBackward: () => {
    const { currentStep } = get()
    if (currentStep > 0) get().goToStep(currentStep - 1)
  },
}))
