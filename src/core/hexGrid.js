import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'

export const GRID_COLS = 20
export const GRID_ROWS = 20
export const HEX_SIZE = 30

export const HEX_X_RADIUS = HEX_SIZE * (Math.sqrt(3) / 2)
export const HEX_Y_RADIUS = HEX_SIZE

export const PointyHex = defineHex({
  dimensions: HEX_SIZE,
  orientation: Orientation.POINTY,
  offset: -1,
  origin: 'topLeft'
})

export function buildGrid () {
  return new Grid(PointyHex, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
}
