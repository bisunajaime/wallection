import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Category, Wallpaper } from '../../types'
import { useWallpapers } from '../../WallpaperContext'
import { fadeUp, staggerContainer } from '../../motion'
import { DownloadIcon } from '../../icons'
import './WallpaperGrid.scss'

interface WallpaperCardProps {
  wallpaper: Wallpaper
  index: number
  onClick: () => void
  skipAnimation: boolean
}

function WallpaperCard({ wallpaper, index, onClick, skipAnimation }: WallpaperCardProps) {
  const { compressedUrl, downloadWallpaper } = useWallpapers()

  return (
    <motion.div
      className="wallpaper-card"
      variants={skipAnimation ? undefined : fadeUp}
      initial={skipAnimation ? false : 'hidden'}
      whileInView={skipAnimation ? undefined : 'visible'}
      viewport={skipAnimation ? undefined : { once: true, margin: '-50px' }}
      custom={index % 4}
      layout
      onClick={onClick}
    >
      <img
        src={compressedUrl(wallpaper.name)}
        alt={`Wallpaper ${wallpaper.id}`}
        loading="lazy"
      />
      <div className="wallpaper-overlay">
        <div className="wallpaper-meta">
          <div className="resolution-badge">{wallpaper.resolution}</div>
          <button
            className="download-btn"
            aria-label="Download wallpaper"
            onClick={(e) => { e.stopPropagation(); downloadWallpaper(wallpaper.name) }}
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface WallpaperGridProps {
  activeCategory: Category
  onCardClick: (wallpaperId: number) => void
  onFilterComplete?: () => void
}

export function WallpaperGrid({ activeCategory, onCardClick, onFilterComplete }: WallpaperGridProps) {
  const { wallpapers } = useWallpapers()
  const hasFilteredRef = useRef(false)

  // After the first render with 'all', any filter change should skip animations
  const skipAnimation = hasFilteredRef.current
  if (activeCategory !== 'all' && !hasFilteredRef.current) {
    hasFilteredRef.current = true
  }

  const filtered =
    activeCategory === 'all'
      ? wallpapers
      : wallpapers.filter((w) => w.category === activeCategory)

  return (
    <section className="grid-section">
      <motion.div
        className="grid-section-header"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>The Collection</h2>
        <p>Every wallpaper, hand-selected for quality and beauty</p>
      </motion.div>

      <motion.div
        className="wallpaper-grid"
        variants={skipAnimation ? undefined : staggerContainer}
        initial={skipAnimation ? false : 'hidden'}
        whileInView={skipAnimation ? undefined : 'visible'}
        viewport={skipAnimation ? undefined : { once: true }}
      >
        <AnimatePresence mode="popLayout" onExitComplete={onFilterComplete}>
          {filtered.map((w, i) => (
            <WallpaperCard
              key={w.id}
              wallpaper={w}
              index={i}
              onClick={() => onCardClick(w.id)}
              skipAnimation={skipAnimation}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
