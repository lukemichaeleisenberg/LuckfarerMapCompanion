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
    hill: 'snowy_hills',
    wasteland: 'wasteland',
    underdark: 'ice_caverns'
  },
  coast: {
    arctic: 'floes',
    coast: 'coast',
    desert: 'sandbar',
    forest: 'riviera',
    grassland: 'chaparral',
    mountain: 'fjords',
    swamp: 'bayou',
    hill: 'sea_cliffs',
    wasteland: 'wasteland',
    underdark: 'underground_sea'
  },
  desert: {
    arctic: 'ice_sheet',
    coast: 'sandbar',
    desert: 'desert',
    forest: 'savanna',
    grassland: 'shrubland',
    mountain: 'mesa',
    swamp: 'salt_pans',
    hill: 'plateau',
    wasteland: 'wasteland',
    underdark: 'crystal_hollows'
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
    wasteland: 'wasteland',
    underdark: 'fungal_jungle'
  },
  grassland: {
    arctic: 'tundra',
    coast: 'chaparral',
    desert: 'shrubland',
    forest: 'woodland',
    grassland: 'grassland',
    mountain: 'steppe',
    swamp: 'marsh',
    hill: 'rolling_hills',
    wasteland: 'wasteland',
    underdark: 'lava_tubes'
  },
  mountain: {
    arctic: 'glacier',
    coast: 'fjords',
    desert: 'mesa',
    forest: 'alpine_forest',
    grassland: 'steppe',
    mountain: 'mountain',
    swamp: 'cloud_forest',
    hill: 'highlands',
    wasteland: 'wasteland',
    underdark: 'chasm'
  },
  swamp: {
    arctic: 'fens',
    coast: 'bayou',
    desert: 'salt_pans',
    forest: 'rainforest',
    grassland: 'marsh',
    mountain: 'cloud_forest',
    swamp: 'swamp',
    hill: 'geyser_basin',
    wasteland: 'wasteland',
    underdark: 'solutional_cave'
  },
  sea: {
    arctic: 'sea',
    coast: 'sea',
    desert: 'sea',
    forest: 'kelp_forest',
    grassland: 'sea',
    mountain: 'sea',
    swamp: 'reef',
    hill: 'sea',
    wasteland: 'sea',
    underdark: 'underground_sea'
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
  // Forest hill (named hill for the Forest × Hill cell)
  forest_hill: { name: 'Forest Hill', color: '#7d9440', stroke: '#50661c' },
  // Wasteland
  wasteland: { name: 'Wasteland', color: '#a08060', stroke: '#705840' },
  // Other
  lake: { name: 'Lake', color: '#4898d0', stroke: '#1868a0' },
  urban: { name: 'Urban', color: '#808888', stroke: '#505858' },
  navigable_river: { name: 'Navigable River', color: '#4888c8', stroke: '#1858a0' },
  shallow_river: { name: 'Shallow River', color: '#80c0d8', stroke: '#4890a8' },
  rapids: { name: 'Rapids', color: '#b0e0f0', stroke: '#78c0d8' },
  underdark: { name: 'Underdark', color: '#1e1028', stroke: '#0a0818' },
  // Named hills for the Hill row of the combined matrix (forest_hill above is
  // the Forest × Hill form)
  snowy_hills: { name: 'Snowy Hills', color: '#d0e0e8', stroke: '#98b8c8' },
  sea_cliffs: { name: 'Sea Cliffs', color: '#6090a8', stroke: '#306078' },
  plateau: { name: 'Plateau', color: '#c89060', stroke: '#986030' },
  rolling_hills: { name: 'Rolling Hills', color: '#a4c470', stroke: '#709038' },
  highlands: { name: 'Highlands', color: '#889078', stroke: '#586048' },
  geyser_basin: { name: 'Geyser Basin', color: '#c0a8a0', stroke: '#907068' },
  // Combined-matrix additions (July revision)
  salt_pans: { name: 'Salt Pans', color: '#e8e4d8', stroke: '#b0aca0' },
  kelp_forest: { name: 'Kelp Forest', color: '#2e7862', stroke: '#105040' },
  reef: { name: 'Reef', color: '#48b0a0', stroke: '#188070' },
  // Settlements
  village: { name: 'Village', color: '#c0b8a8', stroke: '#908868' },
  town: { name: 'Town', color: '#9a9284', stroke: '#6a6250' },
  city: { name: 'City', color: '#746e62', stroke: '#484438' },
  metropolis: { name: 'Metropolis', color: '#4e4a42', stroke: '#262420' },
  riverside_village: { name: 'Riverside Village', color: '#b0bcc8', stroke: '#808c98' },
  riverside_town: { name: 'Riverside Town', color: '#8c98a6', stroke: '#5c6874' },
  riverside_city: { name: 'Riverside City', color: '#687482', stroke: '#3c4854' },
  riverside_metropolis: { name: 'Riverside Metropolis', color: '#44505e', stroke: '#20282e' },
  // Rivers
  headwater: { name: 'Headwater', color: '#70c8c0', stroke: '#389890' },
  braided_river: { name: 'Braided River', color: '#68a8d8', stroke: '#3878a8' },
  waterfall: { name: 'Waterfall', color: '#d0ecf8', stroke: '#88c4e0' },
  delta: { name: 'Delta', color: '#5aa0b8', stroke: '#287088' },
  // Specials
  volcano: { name: 'Volcano', color: '#c03020', stroke: '#801008' },
  atoll: { name: 'Atoll', color: '#48c8c0', stroke: '#189890' },
  slough: { name: 'Slough', color: '#607a58', stroke: '#304a30' },
  sky_cliffs: { name: 'Sky Cliffs', color: '#c8d4ec', stroke: '#90a0c8' },
  cloudlands: { name: 'Cloudlands', color: '#e8ecf4', stroke: '#b0b8cc' },
  lava_flow: { name: 'Lava Flow', color: '#e06020', stroke: '#a03008' },
  solid_earth: { name: 'Solid Earth', color: '#584838', stroke: '#382818' },
  // Post-conversions
  mudflats: { name: 'Mudflats', color: '#a08a68', stroke: '#706040' },
  morraine: { name: 'Morraine', color: '#b8b8a8', stroke: '#888878' },
  barrier_islands: { name: 'Barrier Islands', color: '#e0d498', stroke: '#b0a060' },
  sea_stacks: { name: 'Sea Stacks', color: '#788898', stroke: '#485868' },
  lagoon: { name: 'Lagoon', color: '#58c0d8', stroke: '#2890a8' },
  pass: { name: 'Pass', color: '#b0a898', stroke: '#807868' },
  dunes: { name: 'Dunes', color: '#e8d8a0', stroke: '#b8a868' },
  old_growth: { name: 'Old-growth', color: '#2a5a40', stroke: '#123a24' },
  mangrove_thicket: { name: 'Mangrove Thicket', color: '#3a7058', stroke: '#184834' },
  farmland: { name: 'Farmland', color: '#b8c858', stroke: '#889828' },
  // Underdark set
  ice_caverns: { name: 'Ice Caverns', color: '#405068', stroke: '#203048' },
  underground_sea: { name: 'Underground Sea', color: '#182850', stroke: '#081838' },
  crystal_hollows: { name: 'Crystal Hollows', color: '#584878', stroke: '#302850' },
  fungal_jungle: { name: 'Fungal Jungle', color: '#4a3860', stroke: '#281848' },
  lava_tubes: { name: 'Lava Tubes', color: '#502018', stroke: '#300808' },
  chasm: { name: 'Chasm', color: '#282830', stroke: '#101018' },
  solutional_cave: { name: 'Solutional Cave', color: '#484038', stroke: '#282018' }
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
// Canonical fill hexes for unassigned space (step 58). Hexes are mutated in
// place, so spread-copy at use sites rather than sharing these objects.
export const SEA_HEX = { biome: 'sea' }
export const GRASSLAND_HEX = { biome: 'grassland' }

export function combineBiomes (primary, secondary) {
  return BIOME_LOOKUP[primary]?.[secondary] ?? 'sea'
}

// Derive the secondary + combined biome for a shape, applying special rules:
//   - The first shape in a mountain grouping is always hill (yields highlands).
//   - A shape immediately following a mountain-secondary shape becomes hill.
// `rolledSecondary` is the random pre-roll the caller already made.
export function deriveSecondaryBiome ({ primaryBiome, rolledSecondary, isFirstShape, prevSecondary }) {
  let secondary = rolledSecondary
  if (isFirstShape && primaryBiome === 'mountain') secondary = 'hill'
  if (prevSecondary === 'mountain') secondary = 'hill'
  return { secondary, combined: combineBiomes(primaryBiome, secondary) }
}

