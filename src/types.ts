export type Category = 'all' | 'mobile' | '2k' | '4k' | 'ultrawide'

export interface Wallpaper {
  id: number
  category: Exclude<Category, 'all'>
  resolution: string
  name: string // e.g. "4k/aurora" → {baseUrl}/4k/aurora.webp | .png
}

export interface FeaturedItem {
  id: string
  title: string
  desc: string
  images: string[] // array of names, first is cover
}

export interface CarouselItem {
  id: string | number
  name: string
  label?: string
}

// Manifest JSON shape (fetched at runtime)
export interface ManifestCategory {
  resolution: string
  images: string[]
}

export interface Manifest {
  baseUrl: string
  categories: Record<string, ManifestCategory>
  featured: FeaturedItem[]
}

// Parsed manifest data ready for the app
export interface WallpaperData {
  baseUrl: string
  wallpapers: Wallpaper[]
  featured: FeaturedItem[]
  categories: { key: Category; label: string }[]
}
