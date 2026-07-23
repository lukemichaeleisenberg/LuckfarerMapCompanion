import { create } from 'zustand'
import { buildGrid, keyOf } from '../core/hexGrid'
import { SEA_HEX } from '../core/biomes'
import { generateMap, type GenerationSnapshot } from '../generator/generateMap'
import type { HexMap, HexState, MapGenState } from '../types'

export interface MapStore {
  hexMap: HexMap
  generatorState: MapGenState | null
  snapshots: GenerationSnapshot[]
  currentStep: number
  seed: string | null

  setHex: (key: string, hexState: HexState | null) => void
  resetMap: () => void
  runGeneration: (seed?: string | number | null) => void
  goToStep: (index: number) => void
  stepForward: () => void
  stepBackward: () => void
  loadGeneration: (snapshots: GenerationSnapshot[], seed?: string | null) => void
}

function initHexMap (): HexMap {
  const m: HexMap = {}
  for (const hex of buildGrid()) {
    m[keyOf(hex.q, hex.r)] = { ...SEA_HEX }
  }
  return m
}

export const useMapStore = create<MapStore>()((set, get) => ({
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
