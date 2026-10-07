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
      initial={{ opacity: 0, y: 48, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.85,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
    >
      <Link
        to={`/produkt/${product.id}`}
        className="product-card-link cursor-grow"
        data-cursor="View"
      >
        <div className="product-card-media">
          {sale && (
            <motion.span
              className="sale-badge"
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.2 }}
            >
              −{percent ?? ''}%
            </motion.span>
          )}
          <motion.img
            layoutId={`image-${product.id}`}
            src={resolveAsset(product.images[0])}
            alt={product.name}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="product-card-veil"
            initial={false}
            whileHover={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
          <div className="product-card-shine" aria-hidden />
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
