import type { Category, Manifest, Wallpaper, WallpaperData } from './types'

const MANIFEST_URL = import.meta.env.VITE_MANIFEST_URL || '/manifest.json'

const CATEGORY_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  '2k': '2K',
  '4k': '4K',
  ultrawide: 'Ultrawide',
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function fetchWallpaperData(): Promise<WallpaperData> {
  const res = await fetch(MANIFEST_URL)
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`)
  const manifest: Manifest = await res.json()

  // Build wallpapers from manifest categories
  let id = 1
  const allWallpapers: Wallpaper[] = []

  for (const [cat, data] of Object.entries(manifest.categories)) {
    for (const image of data.images) {
      allWallpapers.push({
        id: id++,
        category: cat as Exclude<Category, 'all'>,
        resolution: data.resolution,
        name: `${cat}/${image}`,
      })
    }
  }

  // Build category filter tabs
  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    ...Object.keys(manifest.categories).map((cat) => ({
      key: cat as Category,
      label: CATEGORY_LABELS[cat] || cat,
    })),
  ]

  return {
    baseUrl: manifest.baseUrl,
    wallpapers: shuffle(allWallpapers),
    featured: manifest.featured,
    categories,
  }
}
