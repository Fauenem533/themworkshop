import { Link } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { resolveAsset } from '../data/products'
import './Home.css'

export function Home() {
  const { products } = useProducts()

  return (
    <PageTransition>
      <section className="hero">
        <div className="hero-media">
          <img
            src={resolveAsset('products/tw-hero.jpg')}
            alt="themworkshop — handmade kitchen knife"
          />
        </div>
        <div className="hero-scrim" />

        <div className="hero-content container">
          <p className="eyebrow">Kitchen Knives Workshop</p>

          <h1 className="display hero-title">
            <span className="hero-title-line">them</span>
            <span className="hero-title-line hero-title-line--sub">workshop</span>
          </h1>

          <p className="hero-lead">
            Ręcznie robione noże kuchenne Marka Kani — gyuto, santoku, petty i
            custom. Prosto z warsztatu @themworkshop.
          </p>

          <div className="hero-cta">
            <a className="btn btn-primary" href="#kolekcja">
              Zobacz kolekcję
            </a>
            <Link className="btn btn-sale" to="/wyprzedaz">
              Wyprzedaż
            </Link>
            <a
              className="btn btn-ghost"
              href="https://www.instagram.com/themworkshop/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="collection section" id="kolekcja">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Kolekcja</p>
            <h2 className="display">Noże do kuchni.</h2>
            <p className="section-lead">
              Oferta warsztatu themworkshop — wybierz nóż, dodaj do koszyka i złóż
              zamówienie.
            </p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="brand-strip section" id="o-marce">
        <div className="container brand-strip-inner">
          <div className="brand-copy">
            <p className="eyebrow">Warsztat</p>
            <h2 className="display">Marek Kania · themworkshop</h2>
            <p>
              Kitchen Knives Workshop — knifemaking z naciskiem na narzędzia do
              codziennej pracy w kuchni. Śledź proces i nowości na Instagramie
              @themworkshop.
            </p>
          </div>
          <div className="brand-visual">
            <img
              src={resolveAsset('products/tw-05.jpg')}
              alt="Warsztat themworkshop"
            />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">themworkshop</span>
          <a href="https://www.instagram.com/themworkshop/" target="_blank" rel="noreferrer">
            @themworkshop
          </a>
          <Link to="/admin" style={{ color: 'inherit' }}>
            Panel admina
          </Link>
        </div>
      </footer>
    </PageTransition>
  )
}
