import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon } from '../../icons'
import { useWallpapers } from '../../WallpaperContext'
import './Hero.scss'

function pickRandom(pool: string[], exclude?: string): string {
  const candidates = exclude ? pool.filter((src) => src !== exclude) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function Hero() {
  const { wallpapers, compressedUrl } = useWallpapers()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // Build hero bg pool from 2k + 4k wallpapers
  const heroBgPool = useMemo(
    () =>
      wallpapers
        .filter((w) => w.category === '2k' || w.category === '4k')
        .map((w) => compressedUrl(w.name)),
    [wallpapers, compressedUrl],
  )

  const [bgSrc, setBgSrc] = useState(() => pickRandom(heroBgPool))

  const rotateBg = useCallback(() => {
    setBgSrc((prev) => pickRandom(heroBgPool, prev))
  }, [heroBgPool])

  useEffect(() => {
    const interval = setInterval(rotateBg, 60_000)
    return () => clearInterval(interval)
  }, [rotateBg])

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-bg" style={{ y: bgY }}>
        <AnimatePresence mode="popLayout">
          <motion.img
            key={bgSrc}
            src={bgSrc}
            alt="Hero wallpaper"
            loading="eager"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </motion.div>
      <div className="hero-gradient" />

      <motion.div className="hero-content" style={{ opacity }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-badge-dot" />
          Curated Collection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Walls that<br />
          <span className="gradient-text">define spaces</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          AI-generated wallpapers crafted with Qwen and Flux models
          on a local workstation. From mobile to ultrawide — always free.
        </motion.p>

        <motion.button
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span>
            Browse Collection <ArrowRightIcon />
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span>Scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  )
}
