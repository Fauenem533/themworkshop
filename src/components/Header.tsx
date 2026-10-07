import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

const base = import.meta.env.BASE_URL

const navItems = [
  { to: `${base}#kolekcja`, label: 'Kolekcja', kind: 'hash' as const },
  { to: `${base}#o-marce`, label: 'Warsztat', kind: 'hash' as const },
  { to: '/wyprzedaz', label: 'Wyprzedaż', kind: 'sale' as const },
  { to: '/checkout', label: 'Zamówienie', kind: 'link' as const },
  { to: '/admin', label: 'Admin', kind: 'link' as const },
]

export function Header() {
  const { count, toggle } = useCart()
  const { pathname } = useLocation()
  const solid = pathname !== '/'
  const onHero = pathname === '/'

  return (
    <motion.header
      className={`site-header ${solid ? 'is-solid' : ''} ${onHero ? 'on-hero' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="themworkshop — strona główna">
          <motion.span
            className="brand-mark"
            aria-hidden
            animate={{ scale: [1, 1.15, 1], boxShadow: [
              '0 0 0 4px rgba(61,139,132,0.22)',
              '0 0 0 8px rgba(61,139,132,0.12)',
              '0 0 0 4px rgba(61,139,132,0.22)',
            ]}}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="brand-name">
            <span className="brand-main">THEMWORKSHOP</span>
            <span className="brand-sub">@themworkshop</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Główne">
          {navItems.map((item, i) => {
            const className =
              item.kind === 'sale'
                ? 'nav-link nav-sale'
                : `nav-link${pathname === item.to ? ' is-active' : ''}`

            const inner = (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                {item.kind === 'sale' && <span className="sale-dot" aria-hidden />}
              </motion.span>
            )

            if (item.kind === 'hash') {
              return (
                <a key={item.to} href={item.to} className={className}>
                  {inner}
                </a>
              )
            }

            return (
              <Link key={item.to} to={item.to} className={className}>
                {inner}
              </Link>
            )
          })}
        </nav>

        <motion.button
          className="cart-trigger"
          onClick={toggle}
          aria-label="Otwórz koszyk"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Koszyk</span>
          <motion.span
            key={count}
            className="cart-count"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            {count}
          </motion.span>
        </motion.button>
      </div>
    </motion.header>
  )
}
