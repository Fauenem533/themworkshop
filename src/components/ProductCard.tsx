import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import {
  formatPrice,
  isOnSale,
  resolveAsset,
  salePercent,
} from '../data/products'
import './ProductCard.css'

type Props = {
  product: Product
  index: number
}

export function ProductCard({ product, index }: Props) {
  const sale = isOnSale(product)
  const percent = salePercent(product)

  return (
    <motion.article
      className={`product-card ${sale ? 'is-sale' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/produkt/${product.id}`} className="product-card-link">
        <div className="product-card-media">
          {sale && <span className="sale-badge">−{percent ?? ''}%</span>}
          <img
            src={resolveAsset(product.images[0])}
            alt={product.name}
            loading="lazy"
          />
        </div>
        <div className="product-card-meta">
          <div>
            <p className="eyebrow">{product.maker}</p>
            <h3 className="display">{product.name}</h3>
            <p className="product-card-tagline">{product.tagline}</p>
          </div>
          <div className="product-card-prices">
            {sale && product.compareAtPrice != null && (
              <span className="price-old">{formatPrice(product.compareAtPrice)}</span>
            )}
            <p className={`product-card-price ${sale ? 'is-sale-price' : ''}`}>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
