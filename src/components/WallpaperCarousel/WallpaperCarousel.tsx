import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Controller } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react'
import type { CarouselItem } from '../../types'
import { useWallpapers } from '../../WallpaperContext'
import 'swiper/css'
import './WallpaperCarousel.scss'

interface WallpaperCarouselProps {
  items: CarouselItem[]
  initialIndex: number
  onClose: () => void
}

export function WallpaperCarousel({ items, initialIndex, onClose }: WallpaperCarouselProps) {
  const { compressedUrl, downloadWallpaper } = useWallpapers()
  const mainRef = useRef<SwiperType | null>(null)
  const thumbsRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  // Prevent sync feedback loops
  const syncingRef = useRef(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const syncFromMain = useCallback((swiper: SwiperType) => {
    if (syncingRef.current) return
    syncingRef.current = true
    const idx = swiper.realIndex
    setActiveIndex(idx)
    const thumbs = thumbsRef.current
    if (thumbs && !thumbs.destroyed && thumbs.realIndex !== idx) {
      thumbs.slideToLoop(idx, 250)
    }
    requestAnimationFrame(() => { syncingRef.current = false })
  }, [])

  const syncFromThumbs = useCallback((swiper: SwiperType) => {
    if (syncingRef.current) return
    syncingRef.current = true
    const idx = swiper.realIndex
    setActiveIndex(idx)
    const main = mainRef.current
    if (main && !main.destroyed && main.realIndex !== idx) {
      main.slideToLoop(idx, 0)
    }
    requestAnimationFrame(() => { syncingRef.current = false })
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="carousel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="carousel-backdrop" onClick={onClose} />

        <button className="carousel-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Info bar — top left */}
        <div className="carousel-slide-info">
          <button
            className="carousel-download-btn"
            aria-label="Download wallpaper"
            onClick={() => downloadWallpaper(items[activeIndex].name)}
          >
            <Download size={16} />
          </button>
          {items[activeIndex].label && (
            <span className="carousel-slide-category">{items[activeIndex].label}</span>
          )}
        </div>

        <div className="carousel-counter">
          <span className="carousel-counter-current">{activeIndex + 1}</span>
          <span className="carousel-counter-sep">/</span>
          <span className="carousel-counter-total">{items.length}</span>
        </div>

        {/* Nav buttons */}
        <button
          className="carousel-nav carousel-nav--prev"
          onClick={() => mainRef.current?.slidePrev()}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="carousel-nav carousel-nav--next"
          onClick={() => mainRef.current?.slideNext()}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>

        {/* Main swiper */}
        <div className="carousel-swiper-wrapper">
          <Swiper
            modules={[Keyboard, Controller]}
            initialSlide={initialIndex}
            slidesPerView={1}
            centeredSlides
            // loop
            keyboard={{ enabled: true }}
            grabCursor
            spaceBetween={40}
            onSwiper={(swiper) => { mainRef.current = swiper }}
            onSlideChange={syncFromMain}
          >
            {items.map((w) => (
              <SwiperSlide key={w.id}>
                <div className="carousel-slide">
                  <img
                    src={compressedUrl(w.name)}
                    alt={`Wallpaper ${w.id}`}
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Thumbs mini carousel */}
        <div className="carousel-thumbs-wrapper">
          <Swiper
            modules={[Controller]}
            initialSlide={initialIndex}
            slidesPerView="auto"
            centeredSlides
            slideToClickedSlide
            // loop
            grabCursor
            spaceBetween={8}
            onSwiper={(swiper) => { thumbsRef.current = swiper }}
            onSlideChange={syncFromThumbs}
          >
            {items.map((w) => (
              <SwiperSlide key={w.id} className="carousel-thumb-slide">
                <div className="carousel-thumb">
                  <img src={compressedUrl(w.name)} alt={`Thumbnail ${w.id}`} draggable={false} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
