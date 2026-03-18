import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Category, Wallpaper } from '../../types'
import { useWallpapers } from '../../WallpaperContext'
import { fadeUp, staggerContainer } from '../../motion'
import { DownloadIcon } from '../../icons'
import './WallpaperGrid.scss'

interface WallpaperCardProps {
  wallpaper: Wallpaper
  index: number
  hidden: boolean
  onClick: () => void
}

function WallpaperCard({ wallpaper, index, hidden, onClick }: WallpaperCardProps) {
  const { compressedUrl, downloadWallpaper } = useWallpapers()

  return (
    <motion.div
      className={`wallpaper-card${hidden ? ' wallpaper-card--hidden' : ''}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index % 4}
      onClick={hidden ? undefined : onClick}
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
            aria-label="Open wallpaper in new tab"
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
  const prevCategory = useRef(activeCategory)

  // Call onFilterComplete when the category changes
  useEffect(() => {
    if (prevCategory.current !== activeCategory) {
      prevCategory.current = activeCategory
      onFilterComplete?.()
    }
  }, [activeCategory, onFilterComplete])

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
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {wallpapers.map((w, i) => (
          <WallpaperCard
            key={w.id}
            wallpaper={w}
            index={i}
            hidden={activeCategory !== 'all' && w.category !== activeCategory}
            onClick={() => onCardClick(w.id)}
          />
        ))}
      </motion.div>
    </section>
  )
}
