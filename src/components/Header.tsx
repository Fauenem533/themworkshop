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

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="themworkshop — strona główna">
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">
            <span className="brand-main">THEMWORKSHOP</span>
            <span className="brand-sub">@themworkshop</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Główne">
          {navItems.map((item) => {
            const className =
              item.kind === 'sale'
                ? 'nav-link nav-sale'
                : `nav-link${pathname === item.to ? ' is-active' : ''}`

            if (item.kind === 'hash') {
              return (
                <a key={item.to} href={item.to} className={className}>
                  {item.label}
                </a>
              )
            }

            return (
              <Link key={item.to} to={item.to} className={className}>
                {item.label}
                {item.kind === 'sale' && <span className="sale-dot" aria-hidden />}
              </Link>
            )
          })}
        </nav>

        <button className="cart-trigger" onClick={toggle} aria-label="Otwórz koszyk">
          <span>Koszyk</span>
          <span className="cart-count">{count}</span>
        </button>
      </div>
    </header>
  )
}
