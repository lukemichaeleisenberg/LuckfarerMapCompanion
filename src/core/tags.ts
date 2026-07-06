// ─── Hex tag helpers ─────────────────────────────────────────────────────────
// Tags are stored on hexes as plain arrays (JSON-serializable); these helpers
// enforce set semantics.

import type { HexState, Tag } from '../types'

export const TAGS: readonly Tag[] = [
  'Open Water',
  'Shoreline',
  'Settlement',
  'Altitude',
  'Road',
  'Inlet',
  'Riverway',
  'Inland'
]

export function hasTag (hex: HexState | null | undefined, tag: Tag): boolean {
  return hex?.tags?.includes(tag) ?? false
}

export function addTag (hex: HexState, tag: Tag): void {
  if (hasTag(hex, tag)) return
  ;(hex.tags ??= []).push(tag)
}

export function removeTag (hex: HexState, tag: Tag): void {
  if (!hasTag(hex, tag)) return
  hex.tags = hex.tags!.filter(t => t !== tag)
}
