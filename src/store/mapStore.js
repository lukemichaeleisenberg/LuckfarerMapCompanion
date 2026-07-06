import { create } from 'zustand'
import { buildGrid, keyOf } from '../core/hexGrid'
import { SEA_HEX } from '../core/biomes.js'
import { generateMap } from '../generator/generateMap.js'

function initHexMap () {
  const m = {}
  for (const hex of buildGrid()) {
    m[keyOf(hex.q, hex.r)] = { ...SEA_HEX }
  }
  return m
}

export const useMapStore = create((set, get) => ({
  hexMap: initHexMap(),
  generatorState: null,
  snapshots: [],
  currentStep: -1,
  seed: null,

  setHex: (key, hexState) =>
    set(prev => ({ hexMap: { ...prev.hexMap, [key]: hexState } })),

  resetMap: () =>
    set({
      hexMap: initHexMap(),
      generatorState: null,
      snapshots: [],
      currentStep: -1,
      seed: null
    }),

  runGeneration: (seed) => {
    const { snapshots, seed: usedSeed } = generateMap(get().hexMap, seed)
    const last = snapshots[snapshots.length - 1]
    set({
      snapshots,
      currentStep: snapshots.length - 1,
      hexMap: last.state.hexes,
      generatorState: last.state,
      seed: usedSeed
    })
  },

  goToStep: index => {
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

  loadGeneration: (snapshots, seed = null) => {
    const last = snapshots[snapshots.length - 1]
    set({
      snapshots,
      currentStep: snapshots.length - 1,
      hexMap: last.state.hexes,
      generatorState: last.state,
      seed
    })
  }
}))
