import { motion } from 'framer-motion'
import './Navbar.scss'

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-logo">Wallection</div>
      <ul className="navbar-links">
        <li><a href="#collection" onClick={(e) => scrollTo(e, 'collection')}>Collection</a></li>
        <li><a href="#featured" onClick={(e) => scrollTo(e, 'featured')}>Featured</a></li>
        <li><a href="#about" onClick={(e) => scrollTo(e, 'about')}>About</a></li>
      </ul>
    </motion.nav>
  )
}
