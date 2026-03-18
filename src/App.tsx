import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Category, CarouselItem, WallpaperData } from './types'
import { fetchWallpaperData } from './data'
import { WallpaperProvider } from './WallpaperContext'
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { CategoryBar } from './components/CategoryBar/CategoryBar'
import { WallpaperGrid } from './components/WallpaperGrid/WallpaperGrid'
import { WallpaperCarousel } from './components/WallpaperCarousel/WallpaperCarousel'
import { FeaturedSection } from './components/FeaturedSection/FeaturedSection'
import { Footer } from './components/Footer/Footer'
import { BackToTop } from './components/BackToTop/BackToTop'
import { DownloadOverlay } from './components/DownloadOverlay/DownloadOverlay'

function App() {
  const [data, setData] = useState<WallpaperData | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const pendingScrollRef = useRef(false)
  const [carouselData, setCarouselData] = useState<{
    items: CarouselItem[]
    initialIndex: number
    key: string
  } | null>(null)

  // Fetch manifest
  useEffect(() => {
    fetchWallpaperData().then(setData)
  }, [])

  const handleCardClick = useCallback((wallpaperId: number) => {
    if (!data) return
    const clicked = data.wallpapers.find((w) => w.id === wallpaperId)
    if (!clicked) return

    const others = data.wallpapers.filter((w) => w.category === clicked.category && w.id !== clicked.id)
    const items: CarouselItem[] = [clicked, ...others].map((w) => ({
      id: w.id,
      name: w.name,
      label: w.category,
    }))

    setCarouselData({ items, initialIndex: 0, key: `wall-${wallpaperId}` })
  }, [data])

  const handleFeaturedClick = useCallback((featuredId: string) => {
    if (!data) return
    const feat = data.featured.find((f) => f.id === featuredId)
    if (!feat) return

    const items: CarouselItem[] = feat.images.map((name, i) => ({
      id: `${featuredId}-${i}`,
      name,
      label: feat.title,
    }))

    setCarouselData({ items, initialIndex: 0, key: `feat-${featuredId}` })
  }, [data])

  const handleCarouselClose = useCallback(() => {
    setCarouselData(null)
  }, [])

  const loading = !data || !imagesLoaded

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            wallpapers={data?.wallpapers ?? []}
            baseUrl={data?.baseUrl ?? ''}
            onComplete={() => setImagesLoaded(true)}
          />
        )}
      </AnimatePresence>

      {data && (
        <WallpaperProvider data={data}>
          <Navbar />
          <Hero />
          <CategoryBar active={activeCategory} onChange={(cat) => {
            pendingScrollRef.current = true
            setActiveCategory(cat)
          }} />
          <WallpaperGrid
            activeCategory={activeCategory}
            onCardClick={handleCardClick}
            onFilterComplete={() => {
              if (pendingScrollRef.current) {
                pendingScrollRef.current = false
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          />
          <FeaturedSection onCardClick={handleFeaturedClick} />
          <Footer />
          <BackToTop />
          <DownloadOverlay />

          {carouselData && (
            <WallpaperCarousel
              key={carouselData.key}
              items={carouselData.items}
              initialIndex={carouselData.initialIndex}
              onClose={handleCarouselClose}
            />
          )}
        </WallpaperProvider>
      )}
    </>
  )
}

export default App
