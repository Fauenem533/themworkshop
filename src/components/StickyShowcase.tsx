import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { formatPrice, resolveAsset } from '../data/products'
import './StickyShowcase.css'

type Props = {
  products: Product[]
}

export function StickyShowcase({ products }: Props) {
  const items = products.filter((p) => p.featured).slice(0, 4)
  const list = items.length >= 2 ? items : products.slice(0, 4)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  if (list.length === 0) return null

  return (
    <section className="sticky-showcase" ref={ref} aria-label="Wyróżnione noże">
      <div className="sticky-showcase-track">
        {list.map((product, index) => (
          <ShowcasePanel
            key={product.id}
            product={product}
            index={index}
            total={list.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  )
}

function ShowcasePanel({
  product,
  index,
  total,
  progress,
}: {
  product: Product
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(
    progress,
    [start, start + 0.12, end - 0.08, end],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0],
  )
  const scale = useTransform(progress, [start, end], [1.08, 1])
  const y = useTransform(progress, [start, end], ['8%', '-4%'])
  const textY = useTransform(progress, [start, end], [40, -20])

  return (
    <motion.article
      className="sticky-panel"
      style={{ opacity, zIndex: index + 1 }}
    >
      <motion.div className="sticky-panel-media" style={{ scale, y }}>
        <img
          src={resolveAsset(product.images[0])}
          alt={product.name}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </motion.div>
      <div className="sticky-panel-scrim" />
      <motion.div className="sticky-panel-copy container" style={{ y: textY }}>
        <p className="eyebrow">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <h2 className="display">{product.name}</h2>
        <p className="sticky-panel-lead">{product.tagline}</p>
        <div className="sticky-panel-meta">
          <span>{formatPrice(product.price)}</span>
          <Link
            to={`/produkt/${product.id}`}
            className="btn btn-primary cursor-grow"
            data-cursor="View"
          >
            Zobacz nóż
          </Link>
        </div>
      </motion.div>
    </motion.article>
  )
}
