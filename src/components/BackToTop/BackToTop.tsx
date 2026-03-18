import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import './BackToTop.scss'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById('collection')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
