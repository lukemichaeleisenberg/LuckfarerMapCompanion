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

// ─── Display names ────────────────────────────────────────────────────────────
export const BIOME_NAMES = {
  // Pure primaries
  arctic: 'Arctic',
  coast: 'Coast',
  desert: 'Desert',
  forest: 'Forest',
  grassland: 'Grassland',
  mountain: 'Mountain',
  swamp: 'Swamp',
  sea: 'Sea',
  // Arctic blends
  floes: 'Floes',
  ice_sheet: 'Ice Sheet',
  taiga: 'Taiga',
  tundra: 'Tundra',
  glacier: 'Glacier',
  fens: 'Fens',
  // Coast blends
  sandbar: 'Sandbar',
  riviera: 'Riviera',
  chaparral: 'Chaparral',
  fjords: 'Fjords',
  bayou: 'Bayou',
  // Desert blends
  savanna: 'Savanna',
  shrubland: 'Shrubland',
  mesa: 'Mesa',
  oasis: 'Oasis',
  // Forest blends
  woodland: 'Woodland',
  alpine_forest: 'Alpine Forest',
  rainforest: 'Rainforest',
  // Grassland blends
  steppe: 'Steppe',
  marsh: 'Marsh',
  // Mountain blends
  cloud_forest: 'Cloud Forest',
  // Hill variants
  arctic_hill: 'Arctic Hill',
  coast_hill: 'Coast Hill',
  desert_hill: 'Desert Hill',
  forest_hill: 'Forest Hill',
  grassland_hill: 'Grassland Hill',
  mountain_hill: 'Mountain Hill',
  swamp_hill: 'Swamp Hill',
  // Wasteland
  wasteland: 'Wasteland',
  // Other
  lake: 'Lake',
  urban: 'Urban',
  navigable_river: 'Navigable River',
  shallow_river: 'Shallow River',
  rapids: 'Rapids',
  underdark: 'Underdark'
}

// Display names for primary/secondary type selector buttons
export const TYPE_NAMES = {
  arctic: 'Arctic',
  coast: 'Coast',
  desert: 'Desert',
  forest: 'Forest',
  grassland: 'Grassland',
  mountain: 'Mountain',
  swamp: 'Swamp',
  sea: 'Sea',
  hill: 'Hill',
  wasteland: 'Wasteland'
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const BIOME_COLORS = {
  arctic: '#ddeeff',
  coast: '#3bb8cc',
  desert: '#d4b483',
  forest: '#2d6a2d',
  grassland: '#7ec850',
  mountain: '#9e9e9e',
  swamp: '#4a6b3d',
  sea: '#1a4fa0',
  floes: '#a0cce0',
  ice_sheet: '#e4f0dc',
  taiga: '#3a6b4a',
  tundra: '#8ab895',
  glacier: '#b8d0e0',
  fens: '#6a8870',
  sandbar: '#d4c870',
  riviera: '#3aaa70',
  chaparral: '#9aba60',
  fjords: '#5888a0',
  bayou: '#508870',
  savanna: '#c8a040',
  shrubland: '#b8a860',
  mesa: '#c86040',
  oasis: '#70b848',
  woodland: '#5aa040',
  alpine_forest: '#386858',
  rainforest: '#1a5822',
  steppe: '#b0a870',
  marsh: '#78a858',
  cloud_forest: '#5a7858',
  arctic_hill: '#c0d8e8',
  coast_hill: '#5098b0',
  desert_hill: '#c8906a',
  forest_hill: '#3a7838',
  grassland_hill: '#90b860',
  mountain_hill: '#707878',
  swamp_hill: '#508060',
  wasteland: '#a08060',
  lake: '#4898d0',
  urban: '#808888',
  navigable_river: '#4888c8',
  shallow_river: '#80c0d8',
  rapids: '#b0e0f0',
  underdark: '#1e1028'
}

export const BIOME_STROKE = {
  arctic: '#aaccee',
  coast: '#1f8899',
  desert: '#b89050',
  forest: '#1a4a1a',
  grassland: '#5a9e38',
  mountain: '#606060',
  swamp: '#2a4a20',
  sea: '#0a2f70',
  floes: '#6090b0',
  ice_sheet: '#a8c0a0',
  taiga: '#1a4030',
  tundra: '#508860',
  glacier: '#7898b0',
  fens: '#385848',
  sandbar: '#a09040',
  riviera: '#1a7a48',
  chaparral: '#607838',
  fjords: '#285878',
  bayou: '#205848',
  savanna: '#987020',
  shrubland: '#807038',
  mesa: '#a03818',
  oasis: '#388828',
  woodland: '#307020',
  alpine_forest: '#184838',
  rainforest: '#083810',
  steppe: '#807848',
  marsh: '#407830',
  cloud_forest: '#284838',
  arctic_hill: '#88b0c8',
  coast_hill: '#206888',
  desert_hill: '#a06040',
  forest_hill: '#185018',
  grassland_hill: '#608838',
  mountain_hill: '#404848',
  swamp_hill: '#204830',
  wasteland: '#705840',
  lake: '#1868a0',
  urban: '#505858',
  navigable_river: '#1858a0',
  shallow_river: '#4890a8',
  rapids: '#78c0d8',
  underdark: '#0a0818'
}

// ─── Logic ───────────────────────────────────────────────────────────────────
export function resolveBiome (hexState) {
  if (hexState.mode === 'other') return hexState.type
  return BIOME_LOOKUP[hexState.primary]?.[hexState.secondary] ?? 'sea'
}

// Representative fill color for each primary/secondary type selector button
export const TYPE_COLORS = {
  arctic: '#ddeeff',
  coast: '#3bb8cc',
  desert: '#d4b483',
  forest: '#2d6a2d',
  grassland: '#7ec850',
  mountain: '#9e9e9e',
  swamp: '#4a6b3d',
  sea: '#1a4fa0',
  hill: '#b0a870',
  wasteland: '#a08060'
}

// ─── Merged catalogs ──────────────────────────────────────────────────────────
// Each entry: { name, color } — for biomes also includes stroke.
export const TYPE_CATALOG = Object.fromEntries(
  Object.keys(TYPE_NAMES).map(k => [
    k,
    { name: TYPE_NAMES[k], color: TYPE_COLORS[k] }
  ])
)
export const BIOME_CATALOG = Object.fromEntries(
  Object.keys(BIOME_NAMES).map(k => [
    k,
    { name: BIOME_NAMES[k], color: BIOME_COLORS[k], stroke: BIOME_STROKE[k] }
  ])
)
