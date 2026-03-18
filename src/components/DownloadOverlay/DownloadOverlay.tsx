import { motion, AnimatePresence } from 'framer-motion'
import { Download } from 'lucide-react'
import { useWallpapers } from '../../WallpaperContext'
import './DownloadOverlay.scss'

export function DownloadOverlay() {
  const { downloadState } = useWallpapers()
  const { active, packName, loaded, total } = downloadState
  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="download-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="download-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="download-dialog-icon">
              <Download size={24} />
            </div>
            <div className="download-dialog-info">
              <div className="download-dialog-title">{packName}</div>
              <div className="download-dialog-status">
                {loaded} / {total} wallpapers
              </div>
              <div className="download-dialog-track">
                <motion.div
                  className="download-dialog-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
