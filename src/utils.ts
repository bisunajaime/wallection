/**
 * Standalone URL helpers (used outside React context, e.g. Hero bg pool).
 * Inside components, prefer useWallpapers().compressedUrl / downloadWallpaper.
 */

/** Compressed (display) URL — local fallback only */
export function compressedUrl(name: string, baseUrl = ''): string {
  return baseUrl ? `${baseUrl}/${name}.webp` : `/wallpapers/${name}.webp`
}

/** Original (download) URL — local fallback only */
export function originalUrl(name: string, baseUrl = ''): string {
  return baseUrl ? `${baseUrl}/${name}.png` : `/wallpapers/${name}.png`
}
