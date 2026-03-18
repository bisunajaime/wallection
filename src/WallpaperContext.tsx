import { createContext, useContext, useState, useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { WallpaperData } from './types'

export interface DownloadState {
  active: boolean
  packName: string
  loaded: number
  total: number
}

interface WallpaperContextValue extends WallpaperData {
  compressedUrl: (name: string) => string
  originalUrl: (name: string) => string
  downloadWallpaper: (name: string) => void
  downloadPack: (names: string[], packName: string) => Promise<void>
  downloadState: DownloadState
}

const WallpaperContext = createContext<WallpaperContextValue | null>(null)

export function WallpaperProvider({
  data,
  children,
}: {
  data: WallpaperData
  children: React.ReactNode
}) {
  const base = data.baseUrl

  const [downloadState, setDownloadState] = useState<DownloadState>({
    active: false,
    packName: '',
    loaded: 0,
    total: 0,
  })

  const compressedUrl = useCallback(
    (name: string) => (base ? `${base}/${name}.webp` : `/wallpapers/${name}.webp`),
    [base],
  )

  const originalUrl = useCallback(
    (name: string) => (base ? `${base}/${name}.png` : `/wallpapers/${name}.png`),
    [base],
  )

  const downloadWallpaper = useCallback(
    (name: string) => {
      const url = originalUrl(name)
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [originalUrl],
  )

  const downloadPack = useCallback(
    async (names: string[], packName: string) => {
      setDownloadState({ active: true, packName, loaded: 0, total: names.length })

      const zip = new JSZip()
      let loaded = 0

      const results = await Promise.allSettled(
        names.map(async (name) => {
          const url = originalUrl(name)
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to fetch ${url}`)
          const blob = await res.blob()
          const filename = `${name.replace('/', '-')}.png`
          zip.file(filename, blob)
          loaded++
          setDownloadState((prev) => ({ ...prev, loaded }))
        }),
      )

      const succeeded = results.filter((r) => r.status === 'fulfilled').length
      if (succeeded > 0) {
        setDownloadState((prev) => ({ ...prev, packName: 'Creating zip...' }))
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const safeName = packName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
        saveAs(zipBlob, `${safeName}-wallpapers.zip`)
      }

      setDownloadState({ active: false, packName: '', loaded: 0, total: 0 })
    },
    [originalUrl],
  )

  return (
    <WallpaperContext.Provider
      value={{
        ...data,
        compressedUrl,
        originalUrl,
        downloadWallpaper,
        downloadPack,
        downloadState,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  )
}

export function useWallpapers() {
  const ctx = useContext(WallpaperContext)
  if (!ctx) throw new Error('useWallpapers must be used within WallpaperProvider')
  return ctx
}
