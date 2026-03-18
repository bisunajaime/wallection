import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp } from '../../motion'
import { useWallpapers } from '../../WallpaperContext'
import { DownloadIcon } from '../../icons'
import './FeaturedSection.scss'

interface FeaturedSectionProps {
  onCardClick: (featuredId: string) => void
}

export function FeaturedSection({ onCardClick }: FeaturedSectionProps) {
  const { featured, compressedUrl, downloadPack } = useWallpapers()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section className="featured-section" id="featured" ref={ref}>
      <motion.div
        className="featured-label"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="featured-label-line" />
        Editor's Picks
      </motion.div>

      <div className="featured-grid">
        {featured.map((item, i) => (
          <motion.div
            className="featured-card"
            key={item.id}
            style={{ y: i === 0 ? y1 : y2 }}
            onClick={() => onCardClick(item.id)}
          >
            <img
              src={compressedUrl(item.images[0])}
              alt={item.title}
              loading="lazy"
            />
            <div className="featured-card-overlay">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button className="featured-download" onClick={(e) => { e.stopPropagation(); downloadPack(item.images, item.title) }}>
                <DownloadIcon /> Download Pack
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
