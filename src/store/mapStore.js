import { create } from 'zustand'
import { buildGrid, GRID_COLS, GRID_ROWS } from '../hexGrid'

function defaultHexState() {
  return { mode: 'biome', primary: 'grassland', secondary: 'grassland' }
}

function initHexMap() {
  const grid = buildGrid()
  const m = {}
  for (const hex of grid) {
    m[`${hex.q},${hex.r}`] = defaultHexState()
  }
  return m
}

export const useMapStore = create((set) => ({
  hexMap: initHexMap(),

  setHex: (key, hexState) =>
    set(prev => ({ hexMap: { ...prev.hexMap, [key]: hexState } })),

  resetMap: () =>
    set({ hexMap: initHexMap() }),
}))

export { GRID_COLS, GRID_ROWS }
