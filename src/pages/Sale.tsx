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
          <p className="eyebrow sale-eyebrow">Promocje</p>
          <h1 className="display sale-title">Wyprzedaż</h1>
          <p className="sale-lead">
            Wybrane noże themworkshop w obniżonych cenach. Dopóki są dostępne.
          </p>
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
