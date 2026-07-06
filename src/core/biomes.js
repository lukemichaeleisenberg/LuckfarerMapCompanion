// ─── Type lists ───────────────────────────────────────────────────────────────
export const PRIMARY_TYPES = [
  'arctic',
  'coast',
  'desert',
  'forest',
  'grassland',
  'mountain',
  'swamp',
  'sea'
]
export const SECONDARY_TYPES = [
  'arctic',
  'coast',
  'desert',
  'forest',
  'grassland',
  'mountain',
  'swamp',
  'hill',
  'wasteland'
]
export const OTHER_TYPES = [
  'lake',
  'urban',
  'navigable_river',
  'shallow_river',
  'rapids',
  'underdark'
]

export const WEIGHTED_PRIMARY_BIOMES = [
  'arctic',
  'coast',
  'desert',
  'forest',
  'forest',
  'forest',
  'grassland',
  'grassland',
  'grassland',
  'mountain',
  'swamp',
  'swamp',
  'sea',
  'sea',
  'sea',
  'sea',
  'sea',
  'sea',
  'sea',
  'sea'
]

// ─── Lookup matrix: BIOME_LOOKUP[primary][secondary] → biome key ──────────────
export const BIOME_LOOKUP = {
  arctic: {
    arctic: 'arctic',
    coast: 'floes',
    desert: 'ice_sheet',
    forest: 'taiga',
    grassland: 'tundra',
    mountain: 'glacier',
    swamp: 'fens',
    hill: 'arctic_hill',
    wasteland: 'wasteland'
  },
  coast: {
    arctic: 'floes',
    coast: 'coast',
    desert: 'sandbar',
    forest: 'riviera',
    grassland: 'chaparral',
    mountain: 'fjords',
    swamp: 'bayou',
    hill: 'coast_hill',
    wasteland: 'wasteland'
  },
  desert: {
    arctic: 'ice_sheet',
    coast: 'sandbar',
    desert: 'desert',
    forest: 'savanna',
    grassland: 'shrubland',
    mountain: 'mesa',
    swamp: 'oasis',
    hill: 'desert_hill',
    wasteland: 'wasteland'
  },
  forest: {
    arctic: 'taiga',
    coast: 'riviera',
    desert: 'savanna',
    forest: 'forest',
    grassland: 'woodland',
    mountain: 'alpine_forest',
    swamp: 'rainforest',
    hill: 'forest_hill',
    wasteland: 'wasteland'
  },
  grassland: {
    arctic: 'tundra',
    coast: 'chaparral',
    desert: 'shrubland',
    forest: 'woodland',
    grassland: 'grassland',
    mountain: 'steppe',
    swamp: 'marsh',
    hill: 'grassland_hill',
    wasteland: 'wasteland'
  },
  mountain: {
    arctic: 'glacier',
    coast: 'fjords',
    desert: 'mesa',
    forest: 'alpine_forest',
    grassland: 'steppe',
    mountain: 'mountain',
    swamp: 'cloud_forest',
    hill: 'mountain_hill',
    wasteland: 'wasteland'
  },
  swamp: {
    arctic: 'fens',
    coast: 'bayou',
    desert: 'oasis',
    forest: 'rainforest',
    grassland: 'marsh',
    mountain: 'cloud_forest',
    swamp: 'swamp',
    hill: 'swamp_hill',
    wasteland: 'wasteland'
  },
  sea: {
    arctic: 'sea',
    coast: 'sea',
    desert: 'sea',
    forest: 'sea',
    grassland: 'sea',
    mountain: 'sea',
    swamp: 'sea',
    hill: 'sea',
    wasteland: 'sea'
  }
}

// ─── Catalogs: key → { name, color, stroke } ──────────────────────────────────
export const BIOME_CATALOG = {
  // Pure primaries
  arctic: { name: 'Arctic', color: '#ddeeff', stroke: '#aaccee' },
  coast: { name: 'Coast', color: '#3bb8cc', stroke: '#1f8899' },
  desert: { name: 'Desert', color: '#d4b483', stroke: '#b89050' },
  forest: { name: 'Forest', color: '#2d6a2d', stroke: '#1a4a1a' },
  grassland: { name: 'Grassland', color: '#7ec850', stroke: '#5a9e38' },
  mountain: { name: 'Mountain', color: '#9e9e9e', stroke: '#606060' },
  swamp: { name: 'Swamp', color: '#4a6b3d', stroke: '#2a4a20' },
  sea: { name: 'Sea', color: '#1a4fa0', stroke: '#0a2f70' },
  // Arctic blends
  floes: { name: 'Floes', color: '#a0cce0', stroke: '#6090b0' },
  ice_sheet: { name: 'Ice Sheet', color: '#e4f0dc', stroke: '#a8c0a0' },
  taiga: { name: 'Taiga', color: '#3a6b4a', stroke: '#1a4030' },
  tundra: { name: 'Tundra', color: '#8ab895', stroke: '#508860' },
  glacier: { name: 'Glacier', color: '#b8d0e0', stroke: '#7898b0' },
  fens: { name: 'Fens', color: '#6a8870', stroke: '#385848' },
  // Coast blends
  sandbar: { name: 'Sandbar', color: '#d4c870', stroke: '#a09040' },
  riviera: { name: 'Riviera', color: '#3aaa70', stroke: '#1a7a48' },
  chaparral: { name: 'Chaparral', color: '#9aba60', stroke: '#607838' },
  fjords: { name: 'Fjords', color: '#5888a0', stroke: '#285878' },
  bayou: { name: 'Bayou', color: '#508870', stroke: '#205848' },
  // Desert blends
  savanna: { name: 'Savanna', color: '#c8a040', stroke: '#987020' },
  shrubland: { name: 'Shrubland', color: '#b8a860', stroke: '#807038' },
  mesa: { name: 'Mesa', color: '#c86040', stroke: '#a03818' },
  oasis: { name: 'Oasis', color: '#70b848', stroke: '#388828' },
  // Forest blends
  woodland: { name: 'Woodland', color: '#5aa040', stroke: '#307020' },
  alpine_forest: { name: 'Alpine Forest', color: '#386858', stroke: '#184838' },
  rainforest: { name: 'Rainforest', color: '#1a5822', stroke: '#083810' },
  // Grassland blends
  steppe: { name: 'Steppe', color: '#b0a870', stroke: '#807848' },
  marsh: { name: 'Marsh', color: '#78a858', stroke: '#407830' },
  // Mountain blends
  cloud_forest: { name: 'Cloud Forest', color: '#5a7858', stroke: '#284838' },
  // Hill variants
  arctic_hill: { name: 'Arctic Hill', color: '#c0d8e8', stroke: '#88b0c8' },
  coast_hill: { name: 'Coast Hill', color: '#5098b0', stroke: '#206888' },
  desert_hill: { name: 'Desert Hill', color: '#c8906a', stroke: '#a06040' },
  forest_hill: { name: 'Forest Hill', color: '#3a7838', stroke: '#185018' },
  grassland_hill: { name: 'Grassland Hill', color: '#90b860', stroke: '#608838' },
  mountain_hill: { name: 'Mountain Hill', color: '#707878', stroke: '#404848' },
  swamp_hill: { name: 'Swamp Hill', color: '#508060', stroke: '#204830' },
  // Wasteland
  wasteland: { name: 'Wasteland', color: '#a08060', stroke: '#705840' },
  // Other
  lake: { name: 'Lake', color: '#4898d0', stroke: '#1868a0' },
  urban: { name: 'Urban', color: '#808888', stroke: '#505858' },
  navigable_river: { name: 'Navigable River', color: '#4888c8', stroke: '#1858a0' },
  shallow_river: { name: 'Shallow River', color: '#80c0d8', stroke: '#4890a8' },
  rapids: { name: 'Rapids', color: '#b0e0f0', stroke: '#78c0d8' },
  underdark: { name: 'Underdark', color: '#1e1028', stroke: '#0a0818' }
}

// Primary/secondary type selector buttons: name + representative fill color
export const TYPE_CATALOG = {
  arctic: { name: 'Arctic', color: '#ddeeff' },
  coast: { name: 'Coast', color: '#3bb8cc' },
  desert: { name: 'Desert', color: '#d4b483' },
  forest: { name: 'Forest', color: '#2d6a2d' },
  grassland: { name: 'Grassland', color: '#7ec850' },
  mountain: { name: 'Mountain', color: '#9e9e9e' },
  swamp: { name: 'Swamp', color: '#4a6b3d' },
  sea: { name: 'Sea', color: '#1a4fa0' },
  hill: { name: 'Hill', color: '#b0a870' },
  wasteland: { name: 'Wasteland', color: '#a08060' }
}

// ─── Logic ───────────────────────────────────────────────────────────────────
// Canonical empty-water hex. Hexes are mutated in place, so spread-copy at use
// sites rather than sharing this object.
export const SEA_HEX = { biome: 'sea' }

export function combineBiomes (primary, secondary) {
  return BIOME_LOOKUP[primary]?.[secondary] ?? 'sea'
}

// Derive the secondary + combined biome for a shape, applying special rules:
//   - The first shape in a mountain grouping is always hill (yields mountain_hill).
//   - A shape immediately following a mountain-secondary shape becomes hill.
// `rolledSecondary` is the random pre-roll the caller already made.
export function deriveSecondaryBiome ({ primaryBiome, rolledSecondary, isFirstShape, prevSecondary }) {
  let secondary = rolledSecondary
  if (isFirstShape && primaryBiome === 'mountain') secondary = 'hill'
  if (prevSecondary === 'mountain') secondary = 'hill'
  return { secondary, combined: combineBiomes(primaryBiome, secondary) }
}

