import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { PageTransition } from '../components/PageTransition'
import { ProductCard } from '../components/ProductCard'
import { StickyShowcase } from '../components/StickyShowcase'
import { useProducts } from '../context/ProductsContext'
import { resolveAsset } from '../data/products'
import './Home.css'

export function Home() {
  const { products } = useProducts()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <PageTransition>
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-media" style={{ y: imageY, scale: imageScale }}>
          <img
            src={resolveAsset('products/tw-hero.jpg')}
            alt="themworkshop — handmade kitchen knife"
          />
        </motion.div>
        <div className="hero-scrim" />

        <motion.div className="hero-content container" style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Kitchen Knives Workshop
          </motion.p>

          <h1 className="display hero-title" aria-label="themworkshop">
            <span className="hero-title-line">
              {'them'.split('').map((letter, i) => (
                <motion.span
                  key={`a-${letter}-${i}`}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.04,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            <span className="hero-title-line hero-title-line--sub">
              {'workshop'.split('').map((letter, i) => (
                <motion.span
                  key={`b-${letter}-${i}`}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.035,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Ręcznie robione noże kuchenne Marka Kani — gyuto, santoku, petty i
            custom. Prosto z warsztatu @themworkshop.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagneticButton className="btn btn-primary" href="#kolekcja">
              Zobacz kolekcję
            </MagneticButton>
            <MagneticButton className="btn btn-sale" href="/wyprzedaz">
              Wyprzedaż
            </MagneticButton>
            <MagneticButton
              className="btn btn-ghost"
              href="https://www.instagram.com/themworkshop/"
            >
              Instagram
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="hero-orbs" aria-hidden>
          <span />
          <span />
          <span />
        </div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span />
          Scroll Down
        </motion.div>
      </section>

      <StickyShowcase products={products} />

      <section className="collection section" id="kolekcja">
        <div className="container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Kolekcja</p>
            <h2 className="display">Noże do kuchni.</h2>
            <p className="section-lead">
              Oferta warsztatu themworkshop — zdjęcia z Instagrama, ceny możesz
              zmieniać w panelu admina.
            </p>
          </motion.div>

          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="brand-strip section" id="o-marce">
        <div className="container brand-strip-inner">
          <motion.div
            className="brand-copy"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Warsztat</p>
            <h2 className="display">Marek Kania · themworkshop</h2>
            <p>
              Kitchen Knives Workshop — knifemaking z naciskiem na narzędzia do
              codziennej pracy w kuchni. Śledź proces i nowości na Instagramie
              @themworkshop.
            </p>
          </motion.div>
          <BrandParallax />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">themworkshop</span>
          <a href="https://www.instagram.com/themworkshop/" target="_blank" rel="noreferrer">
            @themworkshop
          </a>
          <LinkAdmin />
        </div>
      </footer>
    </PageTransition>
  )
}

function BrandParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1])

  return (
    <motion.div
      className="brand-visual"
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        style={{ y, scale }}
        src={resolveAsset('products/tw-05.jpg')}
        alt="Warsztat themworkshop"
      />
    </motion.div>
  )
}

function LinkAdmin() {
  return (
    <a href={`${import.meta.env.BASE_URL}admin`} style={{ color: 'inherit' }}>
      Panel admina
    </a>
  )
}
