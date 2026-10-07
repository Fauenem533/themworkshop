import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { isOnSale } from '../data/products'
import './Sale.css'

export function Sale() {
  const { products } = useProducts()
  const saleItems = products.filter(isOnSale)

  return (
    <PageTransition>
      <section className="sale-page">
        <div className="sale-hero">
          <div className="sale-hero-glow" aria-hidden />
          <motion.p
            className="eyebrow sale-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Limited drop
          </motion.p>
          <motion.h1
            className="display sale-title"
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Wyprzedaż
          </motion.h1>
          <motion.p
            className="sale-lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Wybrane noże themworkshop w obniżonych cenach. Dopóki są dostępne.
          </motion.p>
        </div>

        <div className="container sale-grid-wrap">
          {saleItems.length === 0 ? (
            <p className="sale-empty">Brak aktywnych promocji — wróć wkrótce.</p>
          ) : (
            <div className="product-grid">
              {saleItems.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
