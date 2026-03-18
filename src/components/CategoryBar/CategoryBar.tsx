import { motion } from 'framer-motion'
import type { Category } from '../../types'
import { useWallpapers } from '../../WallpaperContext'
import './CategoryBar.scss'

interface CategoryBarProps {
  active: Category
  onChange: (c: Category) => void
}

export function CategoryBar({ active, onChange }: CategoryBarProps) {
  const { categories } = useWallpapers()
  return (
    <>
      <div id="collection" style={{ position: 'relative', top: '-80px' }} />
      <div className="category-section">
        <div className="category-bar">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              className={`category-pill${active === cat.key ? ' active' : ''}`}
              onClick={() => onChange(cat.key)}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  )
}
