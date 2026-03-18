import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../../motion'
import './Stats.scss'

const stats = [
  { number: '2,400+', label: 'Wallpapers' },
  { number: '180K', label: 'Downloads' },
  { number: '4', label: 'Resolutions' },
]

export function Stats() {
  return (
    <section className="stats-section" id="about">
      <motion.div
        className="stats-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((stat, i) => (
          <motion.div className="stat-item" key={stat.label} variants={fadeUp} custom={i}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
