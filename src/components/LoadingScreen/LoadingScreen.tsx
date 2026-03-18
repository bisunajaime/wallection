import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Wallpaper } from '../../types'
import { compressedUrl } from '../../utils'
import './LoadingScreen.scss'

interface LoadingScreenProps {
  wallpapers: Wallpaper[]
  baseUrl: string
  onComplete: () => void
}

export function LoadingScreen({ wallpapers, baseUrl, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (wallpapers.length === 0) return

    const srcs = wallpapers.map((w) => compressedUrl(w.name, baseUrl))
    let loaded = 0
    const total = srcs.length

    function tick() {
      loaded++
      setProgress(Math.round((loaded / total) * 100))
      if (loaded >= total) onComplete()
    }

    srcs.forEach((src) => {
      const img = new Image()
      img.onload = tick
      img.onerror = tick
      img.src = src
    })
  }, [wallpapers, baseUrl, onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="loading-screen"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="loading-content">
          <div className="loading-logo">Wallection</div>
          <div className="loading-bar-track">
            <motion.div
              className="loading-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
          <div className="loading-percent">{progress}%</div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
