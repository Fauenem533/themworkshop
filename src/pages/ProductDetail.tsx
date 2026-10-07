import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MagneticButton } from '../components/MagneticButton'
import { PageTransition } from '../components/PageTransition'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { formatPrice, isOnSale, salePercent } from '../data/products'
import './ProductDetail.css'

export function ProductDetail() {
  const { id } = useParams()
  const { getById } = useProducts()
  const product = getById(id ?? '')
  const { add } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const sale = product ? isOnSale(product) : false
  const percent = product ? salePercent(product) : null

  if (!product) {
    return (
      <PageTransition>
        <div className="container not-found">
          <h1 className="display">Nie znaleziono produktu</h1>
          <Link to="/" className="btn btn-primary">
            Wróć do sklepu
          </Link>
        </div>
      </PageTransition>
    )
  }

  function handleAdd() {
    add(product!)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <PageTransition>
      <article className="product-page">
        <div className="container product-layout">
          <div className="product-gallery">
            <div className="product-main-image">
              <AnimatePresence mode="wait">
                <motion.img
                  key={product.images[activeImage]}
                  layoutId={activeImage === 0 ? `image-${product.id}` : undefined}
                  src={product.images[activeImage]}
                  alt={`${product.name} — zdjęcie ${activeImage + 1}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>
            <div className="product-thumbs">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  className={`thumb ${i === activeImage ? 'is-active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Pokaż zdjęcie ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <Link to="/#kolekcja" className="back-link">
              ← Kolekcja
            </Link>
            <p className="eyebrow">
              {product.maker} · {product.category}
            </p>
            <motion.h1
              className="display"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {product.name}
            </motion.h1>
            <p className="product-tagline">{product.tagline}</p>
            <div className="product-price-row">
              {sale && product.compareAtPrice != null && (
                <span className="product-price-old">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <p className={`product-price ${sale ? 'is-sale' : ''}`}>
                {formatPrice(product.price)}
              </p>
              {sale && percent != null && (
                <span className="product-sale-chip">−{percent}%</span>
              )}
            </div>
            <p className="product-desc">{product.description}</p>

            <div className="product-actions">
              <MagneticButton className="btn btn-primary" onClick={handleAdd}>
                {added ? 'Dodano do koszyka' : 'Dodaj do koszyka'}
              </MagneticButton>
              <Link to="/checkout" className="btn btn-ghost">
                Zamów teraz
              </Link>
            </div>

            <ul className="specs">
              {product.specs.map((spec, i) => (
                <motion.li
                  key={spec.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                >
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </PageTransition>
  )
}
